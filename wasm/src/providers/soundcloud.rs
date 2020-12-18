use std::collections::HashMap;

use super::common::*;
use async_trait::async_trait;
use lazy_static::lazy_static;
use log::*;
use regex::Regex;
use seed::browser::web_storage::LocalStorage;
use seed::{browser::web_storage::WebStorageError, prelude::*};
use serde::Deserialize;
use simple_eyre::eyre::{eyre, Result};

lazy_static! {
    // These are taken from youtube-dl:
    // https://github.com/ytdl-org/youtube-dl/blob/71ddc/youtube_dl/extractor/soundcloud.py
    static ref SRC_REGEX: Regex = Regex::new(r#"<script[^>]+src="([^"]+)""#).unwrap();
    static ref CLIENT_ID_REGEX: Regex =
        Regex::new(r#"client_id\s*:\s*"([0-9a-zA-Z]{32})""#).unwrap();
}

const API_BASE: &str = "https://api-v2.soundcloud.com";
const STORAGE_KEY: &str = "soundcloud_client_id";

pub struct SoundCloud {
    client_id: String,
}

impl SoundCloud {
    pub async fn new() -> Result<Self> {
        match LocalStorage::get(STORAGE_KEY) {
            Ok(client_id) => {
                debug!("using client id from storage");
                Ok(Self { client_id })
            }
            Err(WebStorageError::KeyNotFoundError) => Ok(Self {
                client_id: Self::fetch_client_id().await?,
            }),
            _ => Err(eyre!("failed to retrieve client id from local store")),
        }
    }

    async fn fetch_script_srcs() -> Result<Vec<String>> {
        const SOUNDCLOUD_DOT_COM: &str = "https://soundcloud.com";
        let url = &format!("{}/{}", CORS_PROXY_URL, SOUNDCLOUD_DOT_COM);

        trace!("Fetching {}", url);
        let response = fetch(url)
            .await
            .map_err(|_| eyre!("failed to fetch {}", SOUNDCLOUD_DOT_COM))?;
        let html = response
            .check_status()
            .map_err(|_| eyre!("status not ok"))?
            .text()
            .await
            .map_err(|_| eyre!("failed getting html text"))?;

        debug!("html: {}", html);

        let mut srcs = SRC_REGEX
            .captures_iter(&html)
            .filter_map(|capt| capt.get(1).map(|capt| capt.as_str().to_owned()))
            .collect::<Vec<String>>();
        srcs.reverse();

        debug!("srcs: {:#?}", srcs);

        Ok(srcs)
    }

    async fn fetch_client_id() -> Result<String> {
        debug!("fetching client id from scripts");
        let srcs = Self::fetch_script_srcs().await?;
        for src in srcs.into_iter() {
            trace!("Fetching soundcloud src {}", src);

            let response = fetch(src).await.map_err(|_| eyre!("HTTP request failed"))?;
            let script = response
                .check_status()
                .map_err(|_| eyre!("status not ok"))?
                .text()
                .await
                .map_err(|_| eyre!("failed getting script text"))?;

            if let Some(capt) = CLIENT_ID_REGEX
                .captures(&script)
                .and_then(|capt| capt.get(1))
            {
                let client_id = capt.as_str().to_owned();
                info!("client_id: {}", client_id);
                LocalStorage::insert(STORAGE_KEY, &client_id)
                    .map_err(|_| eyre!("failed to store client id"))?;
                return Ok(client_id);
            }
        }

        Err(eyre!("couldn't fetch client id"))
    }

    async fn fetch_info_json(&self, url: &'_ impl AsRef<str>) -> seed::fetch::Result<String> {
        let resolve_url = format!(
            "{}/{}/resolve?url={}&client_id={}",
            CORS_PROXY_URL,
            API_BASE,
            url.as_ref(),
            self.client_id
        );
        trace!("fetching info json");
        let response = fetch(resolve_url).await?.check_status()?;
        let resource_url = response.text().await?;
        debug!("resource_url: {}", resource_url);
        Ok(resource_url)
    }
}

#[async_trait(?Send)]
impl Provider for SoundCloud {
    fn is_match(&self, url: &str) -> bool {
        lazy_static! {
            static ref URL_REGEX: Regex =
                Regex::new(r"^(?:https?://)?(?:www\.|m\.)?soundcloud\.com").unwrap();
        }

        URL_REGEX.is_match(url)
    }

    async fn song_from_url(&self, url: &str) -> Result<Song> {
        #[derive(Debug, Deserialize)]
        struct Format {
            pub(crate) protocol: String,
            pub(crate) mime_type: String,
        }
        #[derive(Debug, Deserialize)]
        struct Transcoding {
            pub(crate) url: String,
            pub(crate) quality: String,
            pub(crate) format: Format,
        }
        #[derive(Debug, Deserialize)]
        struct Media {
            pub(crate) transcodings: Vec<Transcoding>,
        }
        #[derive(Debug, Deserialize)]
        struct SongJson {
            pub(crate) artwork_url: Option<String>,
            pub(crate) title: String,
            pub(crate) media: Media,
        }
        #[derive(Debug, Deserialize)]
        struct DirectUrlJson {
            pub(crate) url: String,
        }

        let json = self
            .fetch_info_json(&url)
            .await
            .map_err(|_| eyre!("failed to fetch info json"))?;

        let mut serialized = serde_json::from_str::<SongJson>(&json)?;
        serialized
            .media
            .transcodings
            .retain(|transcoding| &transcoding.format.protocol == "hls");
        trace!("serialized: {:#?}", serialized);
        let mut urls = HashMap::<String, Vec<(bool, String, String)>>::new();
        for Transcoding {
            url,
            quality,
            format,
        } in serialized.media.transcodings
        {
            let bare_url = url.clone();
            let url = format!("{}/{}?client_id={}", CORS_PROXY_URL, url, self.client_id);
            trace!("fetching direct url for {}", bare_url);
            let response = fetch(url)
                .await
                .map_err(|_| eyre!("failed to fetch direct url for {}", bare_url))?;
            let response = response
                .check_status()
                .map_err(|_| eyre!("response status isn't ok for {}", bare_url))?;
            let direct_url = serde_json::from_str::<DirectUrlJson>(
                &response
                    .text()
                    .await
                    .map_err(|_| eyre!("failed to convert {:#?} to text", response))?,
            )?;
            let direct_url = direct_url.url;
            debug!("direct url: {}", direct_url);
            let format_triple = (true, format.mime_type, direct_url);
            if let Some(existing_formats) = urls.get_mut(&quality) {
                existing_formats.push(format_triple);
            } else {
                urls.insert(quality, vec![format_triple]);
            }
        }
        debug!("urls: {:#?}", urls);

        Ok(Song {
            title: serialized.title,
            urls,
            artwork_url: serialized.artwork_url,
        })
    }

    fn is_hls(&self) -> bool {
        true
    }
}

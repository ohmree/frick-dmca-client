use super::common::*;
use lazy_static::lazy_static;
use log::*;
use regex::Regex;
use seed::prelude::*;
use simple_eyre::eyre::{eyre, Result};

lazy_static! {
    // These are taken from youtube-dl:
    // https://github.com/ytdl-org/youtube-dl/blob/71ddc/youtube_dl/extractor/soundcloud.py
    static ref SRC_REGEX: Regex = Regex::new(r#"<script[^>]+src="([^"]+)""#).unwrap();
    static ref CLIENT_ID_REGEX: Regex =
        Regex::new(r#"client_id\s*:\s*"([0-9a-zA-Z]{32})""#).unwrap();
}

pub struct SoundCloud {
    client_id: String,
}

impl SoundCloud {
    pub async fn new() -> Result<Self> {
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
                return Ok(Self { client_id });
            }
        }

        Err(eyre!("couldn't fetch client id"))
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
}

impl Provider for SoundCloud {
    fn is_match(&self, url: impl AsRef<str>) -> bool
    where
        Self: Sized,
    {
        lazy_static! {
            static ref URL_REGEX: Regex =
                Regex::new(r"^(?:https?://)?(?:www\.|m\.)?soundcloud\.com").unwrap();
        }

        URL_REGEX.is_match(url.as_ref())
    }
}

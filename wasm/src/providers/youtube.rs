use std::collections::HashMap;

use super::common::*;
use async_trait::async_trait;
use lazy_static::lazy_static;
use log::*;
use regex::Regex;
use seed::prelude::*;
use serde::Deserialize;
use simple_eyre::eyre::{eyre, Result};

pub struct YouTube;

const INVIDIOUS_INSTANCE: &str = "https://invidious.kavin.rocks";

lazy_static! {
    static ref URL_REGEX: Regex =
        Regex::new(
            r"^(?:https?://)?(?:www\.|m\.)?(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([A-Za-z0-9_-]{11})"
        )
        .unwrap();
}

impl YouTube {
    pub fn new() -> Self {
        Self
    }
    async fn fetch_info_json(url: &'_ impl AsRef<str>) -> seed::fetch::Result<String> {
        let url = url.as_ref();
        // This is guranteed to succeed because we check if the url matches the pattern before even calling this.
        let video_id = URL_REGEX.captures(&url).unwrap().get(1).map(|m| m.as_str()).unwrap();
        let api_url = format!(
            "{}/api/v1/videos/{}?fields=adaptiveFormats,title,videoThumbnails",
            INVIDIOUS_INSTANCE, video_id
        );
        trace!("fetching api response from {}", api_url);
        let response = fetch(api_url).await?;
        response.check_status()?.text().await
    }
}

#[async_trait(?Send)]
impl Provider for YouTube {
    fn is_match(&self, url: &str) -> bool {
        URL_REGEX.is_match(url)
    }

    async fn song_from_url(&self, url: &str) -> Result<Song> {
        #[derive(Debug, Deserialize)]
        struct VideoThumbnail {
            pub quality: String,
            pub url: String,
        }

        #[derive(Debug, Deserialize)]
        struct AdaptiveFormatJson {
            pub url: String,
            pub itag: String,
            #[serde(rename = "type")]
            pub mime_type: String,
        }

        #[derive(Debug, Deserialize)]
        struct SongJson {
            pub title: String,
            #[serde(rename = "adaptiveFormats")]
            pub adaptive_formats: Vec<AdaptiveFormatJson>,
            #[serde(rename = "videoThumbnails")]
            pub video_thumbnails: Vec<VideoThumbnail>,
        }

        let json = Self::fetch_info_json(&url)
            .await
            .map_err(|_| eyre!("failed to fetch info json"))?;

        let serialized = serde_json::from_str::<SongJson>(&json)?;

        trace!("serialized: {:#?}", serialized);

        let mut urls = HashMap::<String, Vec<(bool, String, String)>>::new();
        for AdaptiveFormatJson {
            url,
            itag,
            mime_type,
        } in serialized.adaptive_formats
        {
            if mime_type.starts_with("audio") {
                let format_triple = (false, mime_type.clone(), url);
                if let Some(existing_formats) = urls.get_mut(&itag) {
                    existing_formats.push(format_triple);
                } else {
                    urls.insert(mime_type, vec![format_triple]);
                }
            }
        }
        debug!("urls: {:#?}", urls);

        let artwork_url = serialized
            .video_thumbnails
            .iter()
            .find_map(|thumb| (thumb.quality == "high").then_some(thumb.url.clone()));

        Ok(Song {
            title: serialized.title,
            urls,
            artwork_url,
        })
    }

    fn is_hls(&self) -> bool {
        true
    }
}

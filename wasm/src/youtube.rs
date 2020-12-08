use nanoserde::DeJson;
use simple_eyre::eyre::Result;
use std::collections::HashMap;
use yew::callback::Callback;
use yew::format::{Nothing, Text};
use yew::services::fetch::{FetchService, FetchTask, Request, Response};

// TODO: let users choose an instance to use
const INVIDIOUS_INSTANCE: &str = "https://invidious.tube";

pub type FetchResponse = Response<Text>;
type FetchCallback = Callback<FetchResponse>;

#[derive(DeJson)]
struct AdaptiveFormatJson {
    pub url: String,
    pub itag: String,
    #[nserde(rename = "type")]
    pub mime_type: String,
}

#[derive(DeJson)]
struct SongJson {
    pub title: String,
    #[nserde(rename = "adaptiveFormats")]
    pub adaptive_formats: Vec<AdaptiveFormatJson>,
}

#[derive(Debug, Clone)]
pub struct Song {
    title: String,
    itags: HashMap<u16, String>,
}

impl Song {
    pub fn fetch(id: impl AsRef<str>, callback: FetchCallback) -> FetchTask {
        let id = id.as_ref();

        let url = format!(
            "{}/api/v1/videos/{}?fields=adaptiveFormats,title",
            INVIDIOUS_INSTANCE, id
        );

        let req = Request::get(&url).body(Nothing).unwrap();

        FetchService::fetch(req, callback).unwrap()
    }

    pub fn from_json_str(json_str: impl AsRef<str>) -> Result<Self> {
        let json_str = json_str.as_ref();

        let song_json: SongJson = DeJson::deserialize_json(&json_str)?;

        let title = song_json.title;
        let mut itags = HashMap::new();
        for format in song_json.adaptive_formats.into_iter() {
            if format.mime_type.contains("audio") {
                itags.insert(format.itag.parse()?, format.url);
            }
        }

        Ok(Self { title, itags })
    }

    pub fn title(&self) -> &str {
        self.title.as_str()
    }

    pub fn itags(&self) -> &HashMap<u16, String> {
        &self.itags
    }
}

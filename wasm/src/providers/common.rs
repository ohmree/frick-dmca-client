use async_trait::async_trait;
use getset::Getters;
use simple_eyre::eyre::Result;
use std::collections::HashMap;

pub const CORS_PROXY_URL: &str = "https://warp-co.rs";

#[async_trait(?Send)]
pub trait Provider {
    fn is_match(&self, url: &str) -> bool;
    async fn song_from_url(&self, url: &str) -> Result<Song>;
    fn is_hls(&self) -> bool;
}

#[derive(Clone, Debug, Getters)]
#[getset(get = "pub")]
pub struct Song {
    pub(crate) title: String,
    /// ```rust
    /// {
    ///     "sq": [(false, "mpeg", "https://example.com/sq/song.mp4"), (true, "ogg", "https://example.com/sq/song.ogg")],
    ///     "mq": [(false, "mpeg", "https://example.com/mq/song.mp4"), (true, "ogg", "https://example.com/mq/song.ogg")],
    ///     "hq": [(false, "mpeg", "https://example.com/hq/song.mp4"), (true, "ogg", "https://example.com/hq/song.ogg")],
    ///     // etc...
    ///     // the boolean means "is hls".
    /// }
    /// ```
    pub(crate) urls: HashMap<String, Vec<(bool, String, String)>>,
    pub(crate) artwork_url: Option<String>,
}

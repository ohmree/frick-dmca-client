pub const CORS_PROXY_URL: &str = "https://warp-co.rs";

pub trait Provider {
    fn is_match(&self, url: impl AsRef<str>) -> bool
    where
        Self: Sized;
}

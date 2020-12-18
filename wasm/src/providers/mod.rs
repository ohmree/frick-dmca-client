mod common;
#[cfg(feature = "soundcloud")]
mod soundcloud;
#[cfg(feature = "youtube")]
mod youtube;

pub use common::{Provider, Song};
#[cfg(feature = "soundcloud")]
pub use soundcloud::SoundCloud;
#[cfg(feature = "youtube")]
pub use youtube::YouTube;

pub use async_trait::async_trait;

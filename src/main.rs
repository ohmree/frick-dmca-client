#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rust_embed::RustEmbed;
use simple_eyre::eyre::{ContextCompat, Result};
use web_view::*;

#[derive(RustEmbed)]
#[folder = "wasm/dist"]
struct Asset;

fn main() -> Result<()> {
    let index_content = Asset::get("index.html").wrap_err("index.html not found")?;

    web_view::builder()
        .title("Minimal webview example")
        .content(Content::Html(std::str::from_utf8(index_content.as_ref())?))
        .size(800, 600)
        .resizable(true)
        .user_data(())
        .invoke_handler(|_webview, _arg| Ok(()))
        .run()?;

    Ok(())
}

#![feature(bool_to_option)]

mod hls;
mod model;
mod providers;

use crate::model::{update, view, Model};
use seed::prelude::*;

#[wasm_bindgen(start)]
pub async fn run() -> Result<(), JsValue> {
    if cfg!(debug_assertions) {
        console_error_panic_hook::set_once();
        console_log::init_with_level(log::Level::Trace).map_err(|e| e.to_string())?;
    } else {
        console_log::init().map_err(|e| e.to_string())?;
    }

    let model = Model::new().await.map_err(|e| e.to_string())?;
    App::start("app", |_url, _orders| model, update, view);
    Ok(())
}

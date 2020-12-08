#![feature(bool_to_option)]
#![recursion_limit = "1024"]

#[cfg(feature = "debug")]
mod debug;
mod model;
mod youtube;

use crate::model::Model;
use wasm_bindgen::prelude::*;
use yew::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn run_app() {
    #[cfg(feature = "debug")]
    debug::enable_debug();
    App::<Model>::new().mount_to_body();
}

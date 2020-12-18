use seed::prelude::*;
use web_sys::HtmlMediaElement;

#[wasm_bindgen]
extern "C" {
    #[derive(Clone)]
    #[wasm_bindgen(js_name = default)]
    pub type Hls;
    #[wasm_bindgen(constructor)]
    pub fn new() -> Hls;
    #[wasm_bindgen(js_name = loadSource, method)]
    pub fn load_source(this: &Hls, src: String);
    #[wasm_bindgen(js_name = attachMedia, method)]
    pub fn attach_media(this: &Hls, el: HtmlMediaElement);
    #[wasm_bindgen(js_name = isSupported, static_method_of = Hls)]
    pub fn is_supported() -> bool;
}

use js_sys::JsString;
use lazy_static::lazy_static;
use regex::Regex;
use simple_eyre::eyre::{eyre, Result};
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen_futures::JsFuture;
use yew::services::StorageService;
use yew::web_sys::{window, Request, RequestInit, RequestMode, Response};

const CORS_PROXY: &str = "https://warp-co.rs";

pub struct Song {
    title: String,
}

pub async fn fetch_client_id(storage: &mut StorageService) -> Result<(), JsValue> {
    lazy_static! {
        static ref SRC_REGEX: Regex = Regex::new(r#"<script[^>]+src="([^"]+)""#).unwrap();
        static ref CLIENT_ID_REGEX: Regex =
            Regex::new(r#"client_id\s*:\s*"([0-9a-zA-Z]{32})""#).unwrap();
    }

    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);
    let req =
        Request::new_with_str_and_init(&format!("{}/https://soundcloud.com", CORS_PROXY), &opts)?;

    let window = window().unwrap();
    let html_resp: Response = JsFuture::from(window.fetch_with_request(&req))
        .await?
        .dyn_into()?;
    let html = JsFuture::from(html_resp.text()?).await?;
    let html: &JsString = html.dyn_ref().unwrap();
    let html: String = html.into();

    for src in SRC_REGEX
        .captures_iter(&html)
        .collect::<Vec<_>>()
        .into_iter()
        .rev()
    {
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);
        let req = Request::new_with_str_and_init(&src[1], &opts)?;
        let script_resp: Response = JsFuture::from(window.fetch_with_request(&req))
            .await?
            .dyn_into()?;
        let script = JsFuture::from(script_resp.text()?).await?;
        let script: &JsString = script.dyn_ref().unwrap();
        let script: String = script.into();
        if let Some(caps) = CLIENT_ID_REGEX.captures(&script) {
            storage.store("client_id", Ok(caps[1].to_owned()));
        }
    }

    Ok(())
}

// pub async fn fetch_client_id<C: Component>(
//     storage: &mut StorageService,
//     link: &mut ComponentLink<C>,
//     msg: C::Message
// ) -> Result<()> {
//     lazy_static! {
//         static ref SRC_REGEX: Regex = Regex::new(r#"<script[^>]+src="([^"]+)""#).unwrap();
//         static ref CLIENT_ID_REGEX: Regex =
//             Regex::new(r#"client_id\s*:\s*"([0-9a-zA-Z]{32})""#).unwrap();
//     }

//     let req = Request::get(&format!("{}/https://soundcloud.com", CORS_PROXY)).body(Nothing)?;
//     let task = FetchService::fetch(
//         req,
//         link.batch_callback(move |res: FetchResponse| -> Option<C::Message> {
//             let html = res.into_body().ok()?;
//             for src in SRC_REGEX.captures_iter(&html).collect::<Vec<_>>().into_iter().rev() {
//                 let req = Request::get(&src[1]).body(Nothing).unwrap();
//                 FetchService::fetch(
//                     req,
//                     link.batch_callback(move |res: FetchResponse| -> Option<C::Message> {
//                         let script = res.into_body().ok()?;
//                         if let Some(caps) = CLIENT_ID_REGEX.captures(&script) {
//                             storage.store("client_id", Ok(caps[1].to_owned()));
//                             Some(msg)
//                         } else {
//                             None
//                         }
//                     })
//                 );
//             }
//             Some(msg)
//         }),
//     ).map_err(|e| eyre!(e))?;
// }

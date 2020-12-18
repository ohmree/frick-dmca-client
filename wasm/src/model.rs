// use crate::hls::set_hls_source;
use crate::hls::Hls;
#[cfg(feature = "soundcloud")]
use crate::providers::SoundCloud;
#[cfg(feature = "youtube")]
use crate::providers::YouTube;
use crate::providers::{Provider, Song};
use log::debug;
use seed::{
    prelude::{web_sys::HtmlSelectElement, *},
    *,
};
use simple_eyre::eyre::Result;
use std::rc::Rc;
use web_sys::HtmlAudioElement;

const ENTER_KEY: u32 = 13;

// ------ ------
//     Model
// ------ ------

#[derive(Clone)]
pub struct Model {
    pub providers: Vec<Rc<dyn Provider>>,
    pub song_url: String,
    pub currently_playing: Option<Song>,
    pub selected_quality: Option<String>,
    pub should_render_audio: bool,
    pub select_ref: ElRef<HtmlSelectElement>,
    pub audio_ref: ElRef<HtmlAudioElement>,
    pub hls: Hls,
    pub hls_supported: bool,
    pub should_render_sources: bool,
}

impl Model {
    pub async fn new() -> Result<Self> {
        let mut providers = Vec::<Rc<dyn Provider>>::new();
        #[cfg(feature = "soundcloud")]
        providers.push(Rc::new(SoundCloud::new().await?));
        #[cfg(feature = "youtube")]
        providers.push(Rc::new(YouTube::new()));
        Ok(Self {
            providers,
            song_url: String::new(),
            currently_playing: None,
            selected_quality: None,
            should_render_audio: false,
            select_ref: ElRef::new(),
            audio_ref: ElRef::new(),
            hls: Hls::new(),
            hls_supported: Hls::is_supported(),
            should_render_sources: false,
        })
    }
}

// ------ ------
//    Update
// ------ ------

pub enum Msg {
    SubmitUrl,
    UrlChanged(String),
    NewSong(Song),
    QualityChanged(String),
    AudioLoaded(String),
}

pub fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::SubmitUrl => {
            // let model = model.clone();
            model.should_render_audio = false;
            let song_url = model.song_url.clone();
            let providers = model.providers.clone();
            providers
                .into_iter()
                .find(|p| p.is_match(&song_url))
                .map(|p| {
                    orders.perform_cmd(async move {
                        p.song_from_url(&song_url).await.ok().map(Msg::NewSong)
                    })
                });
        }
        Msg::UrlChanged(edited_url) => {
            orders.skip();
            model.song_url = edited_url;
        }
        Msg::NewSong(song) => {
            model.currently_playing = Some(song);
            model.selected_quality = None;
            if let Some(select) = model.select_ref.get() {
                select.set_selected_index(0);
            }
        }
        Msg::QualityChanged(quality) => {
            model.selected_quality = Some(quality.clone());
            model.should_render_audio = true;
            orders.after_next_render(|_| Msg::AudioLoaded(quality));
        }

        Msg::AudioLoaded(selected_quality) => {
            if let Some(song) = model.currently_playing.as_ref() {
                for (is_hls, _mime_type, url) in song.urls[&selected_quality].iter() {
                    if let Some(audio) = model.audio_ref.get() {
                        if *is_hls {
                            if model.hls_supported {
                                debug!("hls.js is supported, using it");
                                model.hls.load_source(url.to_owned());
                                model.hls.attach_media(audio.into());
                                break;
                            } else {
                                debug!(
                                    "hls.js is not supported, falling back to native hls playback"
                                );
                            }
                        }
                        debug!("not a hls url");
                        model.should_render_sources = true;
                    }
                }
            }
        }
    }
}

// ------ ------
//     View
// ------ ------

pub fn view(model: &Model) -> Node<Msg> {
    main![
        id!["app"],
        div![
            C!["container"],
            div![
                C!["row"],
                select![
                    el_ref(&model.select_ref),
                    option![attrs! {
                        At::Hidden => "hidden";
                        At::Disabled => "disabled";
                        At::Selected => "selected";
                        At::Value => "";
                        At::Label => "Select quality";
                    }],
                    model.currently_playing.as_ref().map(|song| {
                        song.urls
                            .keys()
                            .map(|quality| {
                                option![attrs! {
                                    At::Value => quality;
                                    At::Label => quality;
                                }]
                            })
                            .collect::<Vec<_>>()
                    }),
                    input_ev(Ev::Change, Msg::QualityChanged)
                ],
                input![
                    attrs! {
                        At::Placeholder => "Song URL";
                    },
                    keyboard_ev(Ev::KeyDown, |keyboard_event| {
                        (keyboard_event.key_code() == ENTER_KEY).then(|| Msg::SubmitUrl)
                    }),
                    input_ev(Ev::Input, Msg::UrlChanged),
                ],
                button!["Load song", ev(Ev::Click, |_| Msg::SubmitUrl),]
            ],
            model.currently_playing.as_ref().map(|song| {
                div![
                    br![],
                    h3![id!["song-title"], song.title()],
                    br![],
                    IF!(model.should_render_audio =>
                        audio![
                            el_ref(&model.audio_ref),
                            id!["player"],
                            attrs! {
                                At::Controls => "controls";
                                At::AutoPlay => "autoplay";
                                At::Preload => "auto";
                            },
                            model.selected_quality.as_ref().map(|quality| {
                                model.currently_playing.as_ref().map(|song| {
                                    song.urls[quality].iter().map(|(_is_hls, mime_type, url)| {
                                        source![
                                            attrs! {
                                                At::Src => url,
                                                At::Type => mime_type,
                                            }
                                        ]
                                    })
                                    .collect::<Vec<_>>()
                                })
                            })
                        ]
                    )
                ]
            })
        ]
    ]
}

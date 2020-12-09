use crate::youtube::{FetchResponse, Song};
use simple_eyre::eyre::{eyre, Report};
use yew::prelude::*;
use yew::services::fetch::FetchTask;
use yew::web_sys::{HtmlInputElement as InputElement, HtmlSelectElement as SelectElement};

#[derive(Clone)]
pub struct State {
    song: Option<Song>,
    get_song_error: Option<String>,
    selected_url: Option<String>,
}

pub struct Model {
    state: State,
    link: ComponentLink<Self>,
    task: Option<FetchTask>,
    input_ref: NodeRef,
    select_ref: NodeRef,
}

pub enum Msg {
    GetSong(String),
    GetSongSuccess(Song),
    GetSongError(Report),
    UpdateSelectedUrl(String),
}

impl Model {
    fn render_song_title(&self) -> Html {
        let state = self.state.clone();
        if let Some(song) = state.song {
            html! {
                <div>
                    {song.title()}
                </div>
            }
        } else {
            html! {
                <div>
                    {state.get_song_error.unwrap_or_else(|| "No song loaded".to_owned())}
                </div>
            }
        }
    }

    fn render_input(&self) -> Html {
        let input_ref = self.input_ref.clone();
        html! {
            <div>
                <input ref=self.input_ref.clone() type="text" placeholder="Enter YouTube video ID"/>
                <button onclick=self.link.batch_callback(move |_| {
                    input_ref.cast::<InputElement>().map(|input| Msg::GetSong(input.value()))})>
                    {"Load"}
                </button>
            </div>
        }
    }

    fn render_quality_selection(&self) -> Html {
        let select_ref = self.select_ref.clone();
        html! {
            <div>
                <select ref={self.select_ref.clone()}
                        onchange=self.link.batch_callback(move |_| {
                            select_ref
                                .cast::<SelectElement>().map(|select| Msg::UpdateSelectedUrl(select.value()))
                        })
                >
                <option hidden=true disabled=true selected=true value=""> {"Select quality"} </option>
                    {
                        if let Some(song) = self.state.song.clone() {
                            song
                            .itags()
                            .iter()
                            .map(|(itag, url)| html! { <option value={url}>{itag}</option> })
                            .collect::<Html>()
                        } else {
                            html! {}
                        }
                    }
                </select>
            </div>
        }
    }

    fn render_audio(&self) -> Html {
        let state = self.state.clone();
        if let Some(url) = state.selected_url {
            html! {
                <div>
                    <audio src={url} controls=true autoplay=true/>
                </div>
            }
        } else {
            html! {}
        }
    }
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            state: State {
                song: None,
                get_song_error: None,
                selected_url: None,
            },
            link,
            task: None,
            input_ref: Default::default(),
            select_ref: Default::default(),
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::GetSong(song_id) => {
                let handler = self.link.callback(move |response: FetchResponse| {
                    let (_, data) = response.into_parts();
                    match data {
                        Ok(json_str) => match Song::from_json_str(json_str) {
                            Ok(song) => Msg::GetSongSuccess(song),
                            Err(err) => Msg::GetSongError(eyre!(err)),
                        },
                        Err(err) => Msg::GetSongError(eyre!(err)),
                    }
                });
                self.task = Some(Song::fetch(song_id, handler));
                true
            }
            Msg::GetSongSuccess(song) => {
                self.state.song = Some(song);
                true
            }
            Msg::GetSongError(err) => {
                self.state.song = None;
                self.state.get_song_error = Some(err.to_string());
                true
            }
            Msg::UpdateSelectedUrl(url) => {
                self.state.selected_url = Some(url);
                true
            }
        }
    }

    fn change(&mut self, _: Self::Properties) -> ShouldRender {
        true
    }

    fn view(&self) -> Html {
        html! {
            <div>
                {self.render_quality_selection()}
                {self.render_input()}
                <br/>
                {self.render_song_title()}
                <br/>
                {self.render_audio()}
            </div>
        }
    }
}

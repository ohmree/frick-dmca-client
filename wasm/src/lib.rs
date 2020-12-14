#![feature(bool_to_option)]
#![feature(const_fn)]

mod providers;

use log::trace;
use providers::Provider;
#[cfg(feature = "soundcloud")]
use providers::SoundCloud;
#[cfg(feature = "youtube")]
use providers::YouTube;
use seed::{prelude::*, *};
use simple_eyre::eyre::Result;

const ENTER_KEY: u32 = 13;

// ------ ------
//     Model
// ------ ------

pub struct Model {
    providers: Vec<Box<dyn Provider>>,
    streamer_username: String,
}

impl Model {
    pub async fn new() -> Result<Self> {
        let mut providers = Vec::<Box<dyn Provider>>::new();
        #[cfg(feature = "soundcloud")]
        providers.push(Box::new(SoundCloud::new().await?));
        #[cfg(feature = "youtube")]
        providers.push(Box::new(YouTube::new().await?));
        Ok(Self {
            providers,
            streamer_username: "".to_owned(),
        })
    }
}

// ------ ------
//    Update
// ------ ------

pub enum Msg {
    SubmitUsername,
    UsernameChanged(String),
}

pub fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::SubmitUsername => {
            orders.skip();
        }
        Msg::UsernameChanged(edited_username) => {
            orders.skip();
            model.streamer_username = edited_username;
        }
    }
    // match msg {
    //     Msg::Fetch => {
    //         orders.skip(); // No need to rerender
    //         orders.perform_cmd(async {
    //             let response = fetch("user.json").await.expect("HTTP request failed");

    //             let user = response
    //                 .check_status() // ensure we've got 2xx status
    //                 .expect("status check failed")
    //                 .json::<User>()
    //                 .await
    //                 .expect("deserialization failed");

    //             Msg::Received(user)
    //         });
    //     }
    //     Msg::Received(user) => {
    //         model.user = Some(user);
    //     }
    // }
}

// ------ ------
//     View
// ------ ------

pub fn view(model: &Model) -> Node<Msg> {
    main![
        C!["container"],
        div![
            C!["row"],
            input![
                attrs! {
                    At::Placeholder => "Streamer username";
                },
                keyboard_ev(Ev::KeyDown, |keyboard_event| {
                    (keyboard_event.key_code() == ENTER_KEY).then(|| Msg::SubmitUsername)
                }),
                input_ev(Ev::Input, Msg::UsernameChanged),
            ],
            button![
                attrs! {
                    At::Value => "Load song";
                },
                ev(Ev::Click, |_| Msg::SubmitUsername)
            ]
        ]
    ]
}

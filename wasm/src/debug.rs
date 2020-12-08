use log::Level;

pub fn enable_debug() {
    console_log::init_with_level(Level::Trace).unwrap();
}

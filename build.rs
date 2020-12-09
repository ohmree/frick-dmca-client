use color_eyre::eyre::Result;
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;

fn main() -> Result<()> {
    println!("cargo:rerun-if-changed=wasm");

    let out_dir = env::var("OUT_DIR")?;

    std::env::set_current_dir(Path::new("wasm").canonicalize()?)?;

    Command::new("yarn").arg("build:single-page").status()?;
    let html_path = Path::new("build").join("index.html").canonicalize()?;
    let dest_dir = Path::new(&out_dir).join("html");
    if !dest_dir.exists() {
        fs::create_dir(&dest_dir)?;
    }
    fs::copy(html_path, &dest_dir.join("index.html"))?;

    println!("cargo:rustc-env=APP_HTML_DIR={}", dest_dir.display());

    Ok(())
}

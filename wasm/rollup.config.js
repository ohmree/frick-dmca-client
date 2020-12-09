import { terser } from "rollup-plugin-terser";
import rust from "@wasm-tool/rollup-plugin-rust";
import html from "@rollup/plugin-html";
import serve from "rollup-plugin-serve"
import styles from "rollup-plugin-styles";

// `yarn build` -> `production` is true
// `yarn dev` -> `production` is false
const production = !("ROLLUP_WATCH" in process.env);
// Should we build a single fat HTML for desktop app distribution or a regular web app for serving to a browser?
const buildSinglePage = "BUILD_SINGLE_PAGE" in process.env;

export default {
    input: {
        wasm: "Cargo.toml",
        css: "styles/app.css"
    },
    output: {
        dir: "dist",
        format: "es",
        sourcemap: !production,
        // assetFileNames: "[name]-[hash][extname]"
    },
    watch: {
        include: ["src/**/*.rs", "Cargo.toml", "styles/**/*.css"]
    },
    plugins: [
        html({
            title: "FrickDMCA",
            meta: [
                {
                    "http-equiv": "Content-Security-Policy",
                    // TODO: maybe find a more secure way to handle this? Perhaps generate a nonce/hash at compile/bundle time?
                    content: buildSinglePage
                        && "default-src 'self' https://invidious.kavin.rocks; media-src https://*.googlevideo.com; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';"
                        || "default-src 'self' https://invidious.kavin.rocks; media-src https://*.googlevideo.com; style-src 'unsafe-inline'"
                    // TODO: remove the unsafe style loading when we find a better solution
                },
                {
                    charset:"utf-8"
                },
                {

                    "http-equiv":"x-ua-compatible",
                    content:"ie=edge"
                },
                {

                    name:"viewport",
                    content:"width=device-width, initial-scale=1"
                }
            ]
        }),
        rust({
            inlineWasm: buildSinglePage,
            cargoArgs: production && [] || ["--features", "debug"]
        }),
        styles({
            include: ["styles/**/*.css"],
            minimize: production,
        }),
        production && terser(), // minify, but only in production
        !production && serve("dist")
    ]
};

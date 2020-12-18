import { terser } from "rollup-plugin-terser";
import rust from "@wasm-tool/rollup-plugin-rust";
// TODO: migrate from a custom fork of the html plugin to clever usage of the `template` parameter.
import html from "./rollup-plugin-html";
import serve from "rollup-plugin-serve";
import styles from "rollup-plugin-styles";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// `yarn build` -> `production` is true
// `yarn dev` -> `production` is false
const production = !("ROLLUP_WATCH" in process.env);

export default {
    input: {
        wasm: "Cargo.toml",
        js: "js/index.js",
        css: "css/app.css"
    },
    output: {
        dir: "dist",
        format: "es",
        sourcemap: !production,
        // assetFileNames: "[name]-[hash][extname]"
    },
    watch: {
        include: ["src/**/*.rs", "Cargo.toml", "css/**/*.css", "js/**/*.js"]
    },
    plugins: [
        commonjs(),
        nodeResolve(),
        html({
            title: "FrickDMCA",
            meta: [
                {
                    "http-equiv":"x-ua-compatible",
                    content:"ie=edge"
                },
                {
                    name:"viewport",
                    content:"width=device-width, initial-scale=1"
                }
            ],
            shouldHash: true,
            hashAlgorithm: "sha512",
            additionalCspDirectives: {
                "default-src": [
                    "'self'",
                    "https://invidious.kavin.rocks",
                    "https://warp-co.rs/https://soundcloud.com",
                    "https://a-v2.sndcdn.com/assets/*"
                ],
                "media-src": "https://*.googlevideo.com",
            }
        }),
        rust({
            // cargoArgs: production && [] || ["--features", "debug"]
        }),
        styles({
            include: ["css/**/*.css"],
            minimize: production
        }),
        production && terser(), // minify, but only in production
        !production && serve("dist")
    ]
};

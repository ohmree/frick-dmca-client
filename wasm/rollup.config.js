import { terser } from "rollup-plugin-terser";
import rust from "@wasm-tool/rollup-plugin-rust";
import html from "./rollup-plugin-html";
import serve from "rollup-plugin-serve"

// `yarn build` -> `production` is true
// `yarn dev` -> `production` is false
const production = !("ROLLUP_WATCH" in process.env);

export default {
    input: {
        wasm: "Cargo.toml",
    },
    output: {
        dir: "dist",
        format: "es",
        sourcemap: !production,
        // assetFileNames: "[name]-[hash][extname]"
    },
    watch: {
        include: ["src/**/*.rs", "Cargo.toml"]
    },
    plugins: [
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
        production && terser(), // minify, but only in production
        !production && serve("dist")
    ]
};

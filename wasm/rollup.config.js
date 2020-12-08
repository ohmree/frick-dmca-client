import { terser } from "rollup-plugin-terser";
import rust from "@wasm-tool/rollup-plugin-rust";
import html from "@rollup/plugin-html";
import serve from "rollup-plugin-serve"
import styles from "rollup-plugin-styles";

// `yarn build` -> `production` is true
// `yarn dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: {
        wasm: "Cargo.toml",
        style: "styles/app.css"
    },
    output: {
        dir: "dist",
        format: "es",
        sourcemap: !production,
    },
    watch: {
        include: ["src/**/*.rs", "Cargo.toml", "**/*.css"]
    },
    plugins: [
        html({
            meta: [{ "http-equiv": "Content-Security-Policy", content: "media-src *.googlevideo.com;" }]
        }),
        rust({
            inlineWasm: true,
            cargoArgs: production || ["--features", "debug"]
        }),
        styles(),
        production && terser(), // minify, but only in production
        production || serve("dist")
    ]
};

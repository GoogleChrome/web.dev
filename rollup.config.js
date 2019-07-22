import resolve from "rollup-plugin-node-resolve";
import commonJs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import OMT from "rollup-plugin-off-main-thread";
import entrypointHashmanifest from "rollup-plugin-entrypoint-hashmanifest";

const isProd = process.env.ELEVENTY_ENV === "prod";

let outputPattern;
if (isProd) {
  outputPattern = "[name].[hash].js";
} else {
  outputPattern = "[name].js";
}

module.exports = [
  {
    input: "src/lib/app.js",
    output: {
      dir: "dist",
      format: "amd",
      entryFileNames: outputPattern,
      chunkFileNames: outputPattern,
    },
    watch: {
      clearScreen: false,
    },
    plugins: [
      resolve(),
      commonJs({
        include: "node_modules/**",
      }),
      OMT(),
      postcss({
        extract: true,
        sourceMap: isProd ? false : "inline",
      }),
      entrypointHashmanifest(),
    ],
  },
  {
    input: "src/lib/test/index.js",
    output: {
      dir: "dist/test",
      format: "amd",
      entryFileNames: outputPattern,
      chunkFileNames: outputPattern,
    },
    watch: {
      clearScreen: false,
    },
    plugins: [
      resolve(),
      commonJs({
        include: "node_modules/**",
      }),
      OMT(),
    ],
  },
];

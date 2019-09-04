import resolve from "rollup-plugin-node-resolve";
import commonJs from "rollup-plugin-commonjs";

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
      format: "iife",
      entryFileNames: outputPattern,
      chunkFileNames: outputPattern,
      sourcemap: true,
    },
    watch: {
      clearScreen: false,
    },
    plugins: [
      resolve(),
      commonJs({
        include: "node_modules/**",
      }),
    ],
  },
  {
    input: "src/lib/test/index.js",
    output: {
      dir: "dist/test",
      format: "iife",
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
    ],
  },
];

import resolve from "rollup-plugin-node-resolve";
import commonJs from "rollup-plugin-commonjs";

const isProd = process.env.ELEVENTY_ENV === "prod";
const webdevConfigName = "webdev_config";

let outputPattern;
if (isProd) {
  outputPattern = "[name].[hash].js";
} else {
  outputPattern = "[name].js";
}

const config = {
  prod: isProd,
  webcomponentsPath: isProd
    ? "lib/webcomponents"
    : "node_modules/@webcomponents/webcomponentsjs/bundles",
  version:
    "v" +
    new Date()
      .toISOString()
      .replace(/[\D]/g, "")
      .slice(0, 12),
};

const configPlugin = {
  load(id) {
    if (id === webdevConfigName) {
      return `export default ${JSON.stringify(config)};`;
    }
  },
  resolveId(importee, importer) {
    if (importee === webdevConfigName) {
      return importee;
    }
  },
};

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
  {
    input: "src/lib/bootstrap.js",
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
      configPlugin,
      resolve(),
      commonJs({
        include: "node_modules/**",
      }),
    ],
  },
];

/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

process.on("unhandledRejection", (reason, p) => {
  log.error("Build had unhandled rejection", reason, p);
  process.exit(1);
});

require("dotenv").config();

const glob = require("fast-glob");
const path = require("path");
const log = require("fancy-log");
const rollupPluginNodeResolve = require("rollup-plugin-node-resolve");
const rollupPluginCJS = require("rollup-plugin-commonjs");
const rollup = require("rollup");

const isProd = process.env.ELEVENTY_ENV === "prod";
const bootstrapConfigName = "webdev_config";

const bootstrapConfig = {
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

const defaultPlugins = [
  rollupPluginNodeResolve(),
  rollupPluginCJS({
    include: "node_modules/**",
  }),
];

async function build() {
  // Rollup all page entrypoints together to generate graph of source needs.
  // Generates unique filenames for each chunk and entrypoint that include the
  // source file's hash, useful for cache busting.
  const appBundle = await rollup.rollup({
    input: await glob("src/lib/pages/*.js"),
    plugins: defaultPlugins,
  });
  const appGenerated = await appBundle.write({
    sourcemap: true,
    dir: "dist",
    format: "esm",
    chunkFileNames: "_[hash].js",
    entryFileNames: "[name].[hash].js",
  });

  // Use appGenerated to configure bootstrap.js so it can load and preload the
  // correct assets.
  const entrypoints = {};
  for (const bundle of appGenerated.output) {
    if (!bundle.isEntry) {
      continue;
    }
    const entrypoint = path.basename(bundle.facadeModuleId);
    const entrypointConfig = {
      name: bundle.fileName,
      deps: bundle.imports, // TODO(samthor): This probably isn't exhaustive.
    };
    entrypoints[entrypoint] = entrypointConfig;
  }

  // Rollup the bootstrap script, passing it the global site config including
  // details on entrypoints, allowing it to dynamically load based on the
  // previous Rollup output.
  // "bootstrap.js" is never renamed.
  const localConfig = Object.assign(
    {
      entrypoints,
    },
    bootstrapConfig,
  );
  const configPlugin = {
    load(id) {
      if (id === bootstrapConfigName) {
        return `export default ${JSON.stringify(localConfig)};`;
      }
    },
    resolveId(importee, importer) {
      if (importee === bootstrapConfigName) {
        return importee;
      }
    },
  };
  const bootstrapBundle = await rollup.rollup({
    input: "src/lib/bootstrap.js",
    plugins: defaultPlugins.concat([configPlugin]),
  });
  await bootstrapBundle.write({
    sourcemap: true,
    dir: "dist",
    format: "esm",
  });

  // Additionally rollup tests.
  if (isProd) {
    return; // don't compile tests
  }
  const testBundle = await rollup.rollup({
    input: "src/lib/test/index.js",
    plugins: defaultPlugins,
  });
  await testBundle.write({
    dir: "dist/test",
    format: "iife",
  });
}

build();

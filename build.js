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

require("dotenv").config();

const log = require("fancy-log");
const rollupPluginNodeResolve = require("rollup-plugin-node-resolve");
const rollupPluginCJS = require("rollup-plugin-commonjs");
const rollupPluginVirtual = require("rollup-plugin-virtual");
const rollup = require("rollup");

process.on("unhandledRejection", (reason, p) => {
  log.error("Build had unhandled rejection", reason, p);
  process.exit(1);
});

const isProd = process.env.ELEVENTY_ENV === "prod";

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

/**
 * Performs main site compilation via Rollup: first on site code, and second
 * to build the Service Worker.
 *
 * @return {!Array<string>} generated source filenames
 */
async function build() {
  const generated = [];

  // Rollup bootstrap to generate graph of source needs. This eventually uses
  // dynamic import to bring in code required for each page (see router.js).
  // Does not hash "bootstrap.js" entrypoint, but hashes all generated chunks,
  // useful for cache busting.
  const appBundle = await rollup.rollup({
    input: "src/lib/bootstrap.js",
    plugins: [
      rollupPluginVirtual({
        webdev_config: `export default ${JSON.stringify(bootstrapConfig)};`,
      }),
      ...defaultPlugins,
    ],
  });
  const appGenerated = await appBundle.write({
    dynamicImportFunction: "window._import",
    sourcemap: true,
    dir: "dist",
    format: "esm",
  });
  for (const {fileName} of appGenerated.output) {
    generated.push(fileName);
  }

  const swBundle = await rollup.rollup({
    input: "src/lib/sw.js",
    plugins: [
      rollupPluginVirtual({
        // TODO(samthor): Inject any needed cache manifest here.
        "cache-manifest": "export default {};",
      }),
      ...defaultPlugins,
    ],
    inlineDynamicImports: true, // SW does not support imports
  });
  const swGenerated = await swBundle.write({
    sourcemap: true,
    dir: "dist",
    format: "esm",
  });
  for (const {fileName} of swGenerated.output) {
    generated.push(fileName);
  }

  return generated;
}

async function buildTest() {
  const testBundle = await rollup.rollup({
    input: "src/lib/test/index.js",
    plugins: defaultPlugins,
  });
  await testBundle.write({
    dir: "dist/test",
    format: "iife",
  });
}

(async function() {
  const generated = await build();
  log(`Generated ${generated.length} files`);
  if (!isProd) {
    await buildTest();
  }
})();

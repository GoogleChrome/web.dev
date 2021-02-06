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

require('dotenv').config();
const isProd = process.env.ELEVENTY_ENV === 'prod';

const log = require('fancy-log');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCJS = require('rollup-plugin-commonjs');
const rollupPluginPostCSS = require('rollup-plugin-postcss');
const rollupPluginVirtual = require('rollup-plugin-virtual');
const rollupPluginIstanbul = require('rollup-plugin-istanbul');
const rollup = require('rollup');
const buildVirtualJSON = require('./src/build/virtual-json');
const minifySource = require('./src/build/minify-js');

process.on('unhandledRejection', (reason, p) => {
  log.error('Build had unhandled rejection', reason, p);
  throw new Error(`Build had unhandled rejection ${reason}`);
});

const {
  virtualImports,
  buildDefaultPlugins,
  disallowExternal,
} = require('./src/build/common');

/**
 * Builds the main site via Rollup.
 */
async function build() {
  const postcssConfig = {};
  if (isProd) {
    // nb. Only require() autoprefixer when used.
    const autoprefixer = require('autoprefixer');
    postcssConfig.plugins = [autoprefixer];

    // uses cssnano vs. our regular CSS usees sass' builtin compression
    postcssConfig.minimize = true;
  }

  // Rollup "app.js" to generate graph of source needs.
  const appBundle = await rollup.rollup({
    input: 'src/lib/app.js',
    external: disallowExternal,
    plugins: [rollupPluginPostCSS(postcssConfig), ...buildDefaultPlugins()],
    manualChunks: (id) => {
      // lit-html/lit-element is our biggest dependency, and is always used
      // together. Return it in its own chunk (~30kb after Terser).
      if (/\/node_modules\/lit-.*\//.exec(id)) {
        return 'lit';
      }
      // Algolia is smaller (~17kb after Terser).
      if (id.includes('/node_modules/algoliasearch/')) {
        return 'algolia';
      }
    },
  });
  const appGenerated = await appBundle.write({
    sourcemap: !isProd,
    dir: 'dist/js',
    format: 'esm',
  });
  const outputFiles = appGenerated.output.map(({fileName}) => fileName);

  // Compress the generated source here, as we need the final files and hashes for the Service
  // Worker manifest.
  if (isProd) {
    const ratio = await minifySource(outputFiles);
    log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
  }
}

/**
 * Builds the test entrypoint.
 */
async function buildTest() {
  const testBundle = await rollup.rollup({
    input: 'test/unit/src/lib/index.js',
    plugins: [
      rollupPluginNodeResolve(),
      rollupPluginCJS(),
      rollupPluginVirtual(buildVirtualJSON(virtualImports)),
      rollupPluginPostCSS(),
      rollupPluginIstanbul(),
    ],
  });
  await testBundle.write({
    dir: 'dist/test',
    format: 'iife',
    name: 'test',
  });
}

(async function () {
  await build();
  if (!isProd) {
    await buildTest();
  }
})();

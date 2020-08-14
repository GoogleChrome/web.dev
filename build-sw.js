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
const rollupPluginReplace = require('rollup-plugin-replace');
const OMT = require('@surma/rollup-plugin-off-main-thread');
const rollup = require('rollup');
const minifySource = require('./src/build/minify-js');

process.on('unhandledRejection', (reason, p) => {
  log.error('Build had unhandled rejection', reason, p);
  throw new Error(`Build had unhandled rejection ${reason}`);
});

const {buildDefaultPlugins, disallowExternal} = require('./src/build/common');

/**
 * Builds the Service Worker.
 */
async function build() {
  const swBundle = await rollup.rollup({
    input: 'src/lib/sw.js',
    external: disallowExternal,
    manualChunks: (id) => {
      if (id.includes('/node_modules/idb-keyval')) {
        return 'sw-idb-keyval';
      }
      if (/\/node_modules\/workbox-.*\//.exec(id)) {
        return 'sw-workbox';
      }
    },
    plugins: [
      // This variable is defined by Webpack (and some other tooling), but not by Rollup. Set it to
      // "production" if we're in prod, which will hide all of Workbox's log messages.
      // Note that Terser below will actually remove the conditionals (this replace will generate
      // lots of `if ("production" !== "production")` statements).
      rollupPluginReplace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : ''),
      }),
      ...buildDefaultPlugins(),
      OMT(),
    ],
  });

  const swGenerated = await swBundle.write({
    sourcemap: true,
    dir: 'dist',
    format: 'amd',
  });

  const swOutputFiles = swGenerated.output.map(({fileName}) => fileName);
  if (isProd) {
    const ratio = await minifySource(swOutputFiles);
    log(`Minified service worker is ${(ratio * 100).toFixed(2)}% of source`);
  }
}

(async function () {
  await build();
  log(`Build the Service Worker`);
})();

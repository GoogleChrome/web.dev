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
const rollupPluginVirtual = require('rollup-plugin-virtual');
const rollupPluginReplace = require('rollup-plugin-replace');
const OMT = require('@surma/rollup-plugin-off-main-thread');
const rollup = require('rollup');
const {getManifest} = require('workbox-build');
const buildVirtualJSON = require('./src/build/virtual-json');
const minifySource = require('./src/build/minify-js');

process.on('unhandledRejection', (reason, p) => {
  log.error('Build had unhandled rejection', reason, p);
  throw new Error(`Build had unhandled rejection ${reason}`);
});

const {buildDefaultPlugins, disallowExternal} = require('./src/build/common');

/**
 * Builds the cache manifest for inclusion into the Service Worker.
 *
 * TODO(samthor): This relies on both the gulp and CSS tasks occuring
 * before the Rollup build script.
 */
async function buildCacheManifest() {
  const toplevelManifest = await getManifest({
    // JS or CSS files that include hashes don't need their own revision fields.
    dontCacheBustURLsMatching: /-[0-9a-f]{8}\.(css|js)/,
    globDirectory: 'dist',
    globPatterns: [
      // We don't include jpg files, as they're used for authors and hero
      // images, which are part of articles, and not the top-level site.
      'images/**/*.{png,svg}',
      '*.css',
      '*.js',
      'sw-partial-layout.partial',
    ],
    globIgnores: [
      // This removes large shared PNG files that are used only for articles.
      'images/{shared}/**',
    ],
  });
  if (toplevelManifest.warnings.length) {
    throw new Error(`toplevel manifest: ${toplevelManifest.warnings}`);
  }

  // We need this manifest to be separate as we pretend it's rooted at the
  // top-level, even though it comes from "dist/en".
  const contentManifest = await getManifest({
    globDirectory: 'dist/en',
    globPatterns: ['offline/index.json'],
  });
  if (contentManifest.warnings.length) {
    throw new Error(`content manifest: ${contentManifest.warnings}`);
  }

  const all = [];
  all.push(...toplevelManifest.manifestEntries);
  all.push(...contentManifest.manifestEntries);
  return all;
}

/**
 * Performs main site compilation via Rollup: first on site code, and second
 * to build the Service Worker.
 */
async function build() {
  // We don't generate a manifest in dev, so Workbox doesn't do a default cache step.
  const manifest = isProd ? await buildCacheManifest() : [];

  const swBundle = await rollup.rollup({
    input: 'src/lib/sw.js',
    external: disallowExternal,
    manualChunks: (id) => {
      const chunkNames = ['idb-keyval', 'virtual', 'workbox'];
      for (const chunkName of chunkNames) {
        if (id.includes(`/node_modules/${chunkName}/`)) {
          return 'sw-' + chunkName;
        }
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
      rollupPluginVirtual(
        buildVirtualJSON({
          'cache-manifest': manifest,
        }),
      ),
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

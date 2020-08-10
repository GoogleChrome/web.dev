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

const fs = require('fs').promises;
const log = require('fancy-log');
const rollupPluginReplace = require('rollup-plugin-replace');
const OMT = require('@surma/rollup-plugin-off-main-thread');
const rollup = require('rollup');
const {getManifest} = require('workbox-build');
const resourcePath = require('./src/build/resource-path');
const minifySource = require('./src/build/minify-js');

process.on('unhandledRejection', (reason, p) => {
  log.error('Build had unhandled rejection', reason, p);
  throw new Error(`Build had unhandled rejection ${reason}`);
});

const {buildDefaultPlugins, disallowExternal} = require('./src/build/common');

/**
 * Builds the cache manifest for inclusion alongside the Service Worker.
 *
 * This relies on Gulp, JS and CSS being run before us.
 */
async function buildCacheManifest() {
  const config = {
    // JS or CSS files that include hashes don't need their own revision fields.
    dontCacheBustURLsMatching: /-[0-9a-f]{8}\.(css|js)/,
    globDirectory: 'dist',
    globPatterns: [
      // We don't include jpg files, as they're used for authors and hero
      // images, which are part of articles, and not the top-level site.
      'images/**/*.{png,svg}',
      '*.css',
      '*.js',
    ],
    globIgnores: [
      // This removes large shared PNG files that are used only for articles.
      'images/{shared}/**',
    ],
  };
  if (isProd) {
    config.additionalManifestEntries = [
      {url: resourcePath('js'), revision: null},
      {url: resourcePath('css'), revision: null},
    ];
  } else {
    // Don't use hash revisions in dev, or even check that the files exist.
    config.globPatterns.push('bootstrap.js', 'app.css');
  }

  const toplevelManifest = await getManifest(config);
  if (toplevelManifest.warnings.length) {
    throw new Error(`toplevel manifest: ${toplevelManifest.warnings}`);
  }

  // We need this manifest to be separate as we pretend it's rooted at the
  // top-level, even though it comes from "dist/en".
  const contentManifest = await getManifest({
    globDirectory: 'dist/en',
    globPatterns: ['offline/index.json'],
  });
  if (isProd && contentManifest.warnings.length) {
    throw new Error(`content manifest: ${contentManifest.warnings}`);
  }

  const all = [];
  all.push(...toplevelManifest.manifestEntries);
  all.push(...contentManifest.manifestEntries);
  return all;
}

/**
 * Builds the Service Worker and creates related dependencies.
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

async function generateManifest() {
  // Now, construct the dynamic manifest fetched and used by the Service Worker. We steal the
  // site's version information from a known partial, and load the template itself.
  // Even though the generated template itself is a "manifest" because it points to specific JS and
  // CSS bundles (i.e., files with hashes in their name), it's impractical to use the hash of the
  // template itself as it's built in a random order by Eleventy: we can't easily apply its hash
  // to all built partials, as it itself is processed randomly in all our pages.
  const offlinePartial = JSON.parse(
    await fs.readFile('dist/en/offline/index.json'),
    'utf-8',
  );
  const layoutTemplate = await fs.readFile(
    'dist/sw-partial-layout.partial',
    'utf-8',
  );

  // This manifest can be incomplete in dev.
  const cacheManifest = await buildCacheManifest();
  const manifest = {
    template: layoutTemplate,
    cache: cacheManifest,
    resourcesVersion: offlinePartial.resourcesVersion,
    builtAt: offlinePartial.builtAt,
  };
  await fs.writeFile('dist/sw-manifest', JSON.stringify(manifest));
}

(async function () {
  await build();
  try {
    await generateManifest();
    log(`Built the Service Worker`);
  } catch (e) {
    if (isProd) {
      throw e;
    }
    log('Failed to generate Service Worker in dev', e);
    await fs.unlink('dist/sw-manifest');
  }
})();

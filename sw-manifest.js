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
const {promises: fs} = require('fs');
const {getManifest} = require('workbox-build');
const resourcePath = require('./src/build/resource-path');

process.on('unhandledRejection', (reason, p) => {
  log.error('Build had unhandled rejection', reason, p);
  throw new Error(`Build had unhandled rejection ${reason}`);
});

/**
 * Builds the cache manifest for inclusion into the Service Worker. This runs
 * last, after all other scripts have run, so we scan the 'dist' folder.
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
      '*-*.js',
      '*/offline/index.html',
    ],
    globIgnores: [
      // This removes large shared PNG files that are used only for articles.
      'images/shared/**/*',
      'images/rss-banner.png', // TODO: too large
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
    if (isProd) {
      throw new Error(`toplevel manifest: ${toplevelManifest.warnings}`);
    }
    toplevelManifest.warnings.forEach((warning) => log(warning));
  }

  return toplevelManifest.manifestEntries;
}

(async function () {
  const manifest = await buildCacheManifest();
  const src = `self['_manifest']=${JSON.stringify(manifest)};`;
  await fs.writeFile('dist/sw-manifest.js', src);
  log(`Build the Service Worker manifest, ${manifest.length} files`);
})();

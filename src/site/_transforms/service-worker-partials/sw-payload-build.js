/*
 * Copyright 2020 Google LLC
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

const {getManifest} = require('workbox-build');
const isProd = process.env.ELEVENTY_ENV === 'prod';
const crypto = require('crypto');
const cheerio = require('cheerio');

/**
 * Builds a payload of contents to be used inside the Service Worker.
 */
async function generatePayload(template) {
  const config = {
    // JS or CSS files that include hashes don't need their own revision fields.
    dontCacheBustURLsMatching: /-[0-9a-f]{8}\.(css|js)/,
    globDirectory: 'dist',
    globPatterns: [
      // We don't include jpg files, as they're used for authors and hero
      // images, which are part of articles, and not the top-level site.
      'images/**/*.{png,svg}',
      '*.js',
      '*.css',
    ],
    globIgnores: [
      // This removes large shared PNG files that are used only for articles.
      'images/{shared}/**',
      // Don't include the Service Worker JS itself.
      'sw{,-*}.js',
    ],
  };
  const manifest = await getManifest(config);
  if (isProd && manifest.warnings.length) {
    throw new Error(`Could not generate SW manifest: ${manifest.warnings}`);
  }
  const entries = manifest.manifestEntries;

  // Create a virtual manifest based on the contents of the offline pages.
  // They're unlikely to change often ("You're offline! Come back later!"), but
  // are cached aggressively by the SW so we need to invalidate on change.
  // This just creates virtual entries that we cache after everything is built
  // later, just using the untemplated source for the revision.
  const offlinePagesManifest = await getManifest({
    globDirectory: 'src/site/content',
    globPatterns: ['*/offline.njk'],
  });
  for (const entry of offlinePagesManifest.manifestEntries) {
    const lang = entry.url.split('/', 1)[0];
    entries.push({
      url: `${lang}/offline/index.html`,
      revision: entry.revision,
    });
  }

  const c = crypto.createHash('sha1');
  c.update(template);

  entries.forEach((raw) => {
    c.update(raw.url);
    raw.revision && c.update(raw.revision);
  });
  const resourcesVersion = c.digest('hex').substr(0, 12);
  const builtAt = +new Date();

  // The partial generator applies this version to all disk templates, but we must apply it to our
  // own template included inside the JSON payload too.
  const $ = cheerio.load(template);
  $('body').attr('data-resources-version', resourcesVersion);
  template = $.html();

  return {
    template,
    entries,
    resourcesVersion,
    builtAt,
  };
}

module.exports = generatePayload;

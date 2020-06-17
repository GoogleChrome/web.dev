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

/**
 * @fileoverview Builds a shortcode which writes article inner content to peer JSON files.
 *
 * This is needed so our SPA routing and Service Worker can fetch partials in order to hydrate the
 * main web.dev template, cutting down on bytes needed to render further pages.
 */

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

const computedData = require('../../_data/eleventyComputed');
const {getManifest} = require('workbox-build');
const isProd = process.env.ELEVENTY_ENV === 'prod';

const revision = {
  // Refers to the version of the site the partial was built at, and the build timestamp. We use
  // this inside the Service Worker to determine whether any cached layout HTML is out-of-date.
  resourcesVersion: computedData.resourcesVersion,
  builtAt: computedData.builtAt,
};

const writePartial = async (to, raw) => {
  await fs.mkdir(path.dirname(to), {recursive: true});
  await fs.writeFile(to, JSON.stringify(raw));
};

const getPartial = (content) => {
  const $ = cheerio.load(content);
  const partial = {
    raw: $('#content').html(),
    lang: $('html').attr('lang'),
    title: $('title').text(),
    rss: $('link[type="application/atom+xml"]').attr('href'),
    offline: Boolean($('meta[name="offline"]').attr('content')) || false,
    ...revision,
  };
  return partial;
};

const writeTemplate = async (to, raw) => {
  const manifest = [];

  // In prod, fetch manifest assets. We don't bother in dev as we're not sure
  // of the execution order.
  if (isProd) {
    const toplevelManifest = await getManifest({
      // JS files that include hashes don't need their own revision fields.
      globDirectory: 'dist',
      globPatterns: [
        // We don't include jpg files, as they're used for authors and hero
        // images, which are part of articles, and not the top-level site.
        'images/**/*.{png,svg}',
        '*.css',
        '*.js',
        '*.partial',
      ],
      globIgnores: [
        // This removes large shared PNG files that are used only for articles.
        'images/{shared}/**',
      ],
    });
    if (toplevelManifest.warnings.length) {
      throw new Error(`toplevel manifest: ${toplevelManifest.warnings}`);
    }
    manifest.push(...toplevelManifest.manifestEntries);

    // We need this manifest to be separate as we pretend it's rooted at the
    // top-level, even though it comes from "dist/en".
    const contentManifest = await getManifest({
      globDirectory: 'dist/en',
      globPatterns: ['offline/index.json'],
    });
    if (contentManifest.warnings.length) {
      throw new Error(`content manifest: ${contentManifest.warnings}`);
    }
    manifest.push(...contentManifest.manifestEntries);
  }

  const o = {
    template: raw,
    manifest,
    ...revision,
  };
  await fs.writeFile(to, JSON.stringify(o));
};

const serviceWorkerPartials = async (content, outputPath) => {
  // Page has permalink set to false and will not be rendered.
  if (!outputPath) {
    return content;
  }

  // Special-case the output partial. We need to include it as well as its revision information in
  // a single JSON file.
  if (outputPath === 'dist/sw-partial-layout.partial') {
    // nb. This does not end with ".json" as we don't want it to be confused with an actual partial.
    await writeTemplate('dist/template-json', content);
    return content;
  }

  // Unexpected output format.
  if (!outputPath.endsWith('/index.html')) {
    return content;
  }

  const partial = getPartial(content, outputPath);
  const suffixLength = 'index.html'.length;
  const partialOutputPath =
    outputPath.substr(0, outputPath.length - suffixLength) + 'index.json';
  await writePartial(partialOutputPath, partial);

  return content;
};

module.exports = {serviceWorkerPartials, getPartial, writePartial};

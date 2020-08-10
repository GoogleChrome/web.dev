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
 * @fileoverview Transforms the single generated partial to its JSON output format.
 */

const computedData = require('../../_data/eleventyComputed');
const {getManifest} = require('workbox-build');
const fs = require('fs');
const isProd = process.env.ELEVENTY_ENV === 'prod';

const revision = {
  resourcesVersion: computedData.resourcesVersion,
  builtAt: computedData.builtAt,
};

const generatePartialTemplate = async (content, outputPath) => {
  if (outputPath !== 'dist/sw-partial-layout.partial') {
    return content;
  }

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

  const manifest = [];

  const o = {
    template: content,
    manifest,
    ...revision,
  };
  fs.writeFileSync('dist/template-json', JSON.stringify(o));

  return null;
};

module.exports = {generatePartialTemplate};

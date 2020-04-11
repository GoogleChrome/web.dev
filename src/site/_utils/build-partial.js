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
const site = require('../_data/site');
const strip = require('../_filters/strip');

const suffixLength = 'index.html'.length;

const writePartial = async (to, raw) => {
  await fs.mkdir(path.dirname(to), {recursive: true});
  await fs.writeFile(to, JSON.stringify(raw));
};

module.exports = function buildPartial() {
  const work = [];

  return function(content, page, pathData, lang, title, offline) {
    if (!page.outputPath.endsWith('/index.html')) {
      return content; // unexpected output format
    }

    const outputPath =
      page.outputPath.substr(0, page.outputPath.length - suffixLength) +
      'index.json';

    const partial = {
      raw: content,
      lang,
      title: strip(title || (pathData && pathData.title) || site.title),
      offline: offline || undefined,
    };

    // Eleventy runs as a binary, and it can't be triggered programatically. So, these orphaned
    // promises are actually fine, because they'll hold the Node process open until complete.
    // If Eleventy or other code ever triggers process.exit(), then they could be preempted early.
    const p = writePartial(outputPath, partial);

    // Push into an array, even though it's not used; and if Eleventy ever provides build hooks, we
    // could `await Promise.all()` on it.
    work.push(p);

    return content;
  };
};

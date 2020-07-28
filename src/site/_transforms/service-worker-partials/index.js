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
  };
  return partial;
};

const serviceWorkerPartials = async (content, outputPath) => {
  // Page has permalink set to false and will not be rendered.
  if (!outputPath) {
    return content;
  }

  // Unexpected output format.
  if (!outputPath.endsWith('/index.html')) {
    return content;
  }

  // Skip the web.dev/LIVE page to force online-only.
  if (outputPath === 'dist/en/live/index.html') {
    return content;
  }

  const partial = getPartial(content);
  const suffixLength = 'index.html'.length;
  const partialOutputPath =
    outputPath.substr(0, outputPath.length - suffixLength) + 'index.json';
  await writePartial(partialOutputPath, partial);

  return content;
};

module.exports = {serviceWorkerPartials, getPartial, writePartial};

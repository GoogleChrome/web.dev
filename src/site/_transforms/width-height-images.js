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
 * @fileoverview An eleventy transform that makes sure all local images have
 * width and height html attributes set to avoid layout shift.
 */

const cheerio = require('cheerio');
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

module.exports = (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  const $ = cheerio.load(content);
  $('img').each((_, elem) => {
    const $elem = $(elem);
    const originalSrc = $elem.attr('src').trim();
    const isLocal = !RegExp('^(https?://|/)').test(originalSrc);
    if (!originalSrc || !isLocal) {
      return;
    }

    const distSrc = path.join(path.dirname(outputPath), originalSrc);
    if (!fs.existsSync(distSrc)) {
      return;
    }

    const {width, height} = sizeOf(distSrc);
    $elem.attr('width', width);
    $elem.attr('height', height);
  });
  return $.html();
};

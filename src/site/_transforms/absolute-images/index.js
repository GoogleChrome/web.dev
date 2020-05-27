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
 * @fileoverview An eleventy transform that rewrites image paths to be absolute
 * (in DEV) or to use our image CDN (in PROD).
 */
const {determineImagePath} = require('../responsive-images/helpers');

function rewriteUrl(outputPath, useCdn, match, p1, offset, string) {
  const newUrl = determineImagePath(p1, outputPath, useCdn).src;
  return match.replace(p1, newUrl);
}
const srcRegexp = /<img\s?\n?.*src\=\"([\w\.\-\_/]+)\"\s?.*>/g;

const absoluteImages = (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  const useCdn = process.env.ELEVENTY_ENV === 'prod';
  /* eslint-disable no-invalid-this */
  const replace = rewriteUrl.bind(this, outputPath, useCdn);

  // TODO: add srcset logic.
  return content.replace(srcRegexp, replace);
};

module.exports = {absoluteImages};

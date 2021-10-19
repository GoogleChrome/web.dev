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

const minify = require('html-minifier').minify;
const path = require('path');
const {URL} = require('url');
const stagingUrls =
  require('../../../tools/lhci/lighthouserc').ci.collect.url.map((url) =>
    path.join('dist', new URL(url).pathname, 'index.html'),
  );

const isProd = process.env.ELEVENTY_ENV === 'prod';
const isStaging = process.env.ELEVENTY_ENV === 'staging';

const minifyHtml = (content, outputPath) => {
  if (
    (isProd && outputPath && outputPath.endsWith('.html')) ||
    (isStaging && stagingUrls.includes(outputPath))
  ) {
    try {
      content = minify(content, {
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        sortClassName: true,
        sortAttributes: true,
        html5: true,
        decodeEntities: true,
      });
      return content;
    } catch (err) {
      console.warn('Could not minify html for', outputPath);
    }
  }

  return content;
};

module.exports = {minifyHtml};

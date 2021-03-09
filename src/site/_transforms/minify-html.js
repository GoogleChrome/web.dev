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

const minifyHtml = (content, outputPath) => {
  if (outputPath && outputPath.endsWith('.html')) {
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

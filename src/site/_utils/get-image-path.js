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

const path = require('path');
const site = require('../_data/site');

/**
 * Takes a path to an image and converts it to an image CDN path if we're in
 * a production environment.
 * @param {!string} src A path to an image asset.
 * @param {!string} pageUrl The url for the current page.
 * @return {string} An image path. May be converted to an image CDN path if
 * it's a production environment.
 */
module.exports = function getImagePath(src, pageUrl) {
  let imagePath = path.join(pageUrl, src);
  if (site.env === 'prod') {
    imagePath = new URL(imagePath, site.imageCdn).href;
  }
  return imagePath;
};

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
 * @fileoverview Utilities to be support rewriting image paths.
 */

const site = require("../../_data/site");
const path = require("path");

/**
 *
 * @param {string} src src attribute for image
 * @param {string} outputPath Output path for HTML file
 *
 * @return {{src: string, isLocal: boolean}}
 */
function determineImagePath(src, outputPath) {
  const isLocal = !RegExp("^https?://").test(src);

  // If an image has a protocol then we should just return the src as is.
  // If the outputPath is false then it means the file has permalink set to
  // false. In this scenario we should also just return the src as is.
  if (!isLocal || !outputPath) {
    return {
      src,
      isLocal,
    };
  }

  if (path.isAbsolute(src)) {
    return {src: new URL(src, site.imageCdn), isLocal};
  }

  // At this point we've determined that the image has a relative path.
  let base = path
    .dirname(outputPath)
    .split(path.sep)
    .pop();

  // The handbook is the only place on the site where we nest paths.
  if (outputPath.includes("handbook")) {
    base = path.join("handbook", base);
  }

  return {src: new URL(path.join(base, src), site.imageCdn), isLocal};
}

module.exports = {determineImagePath};

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
const postToPathsMap = require('../_data/postToPaths.js');
const paths = require('../_data/paths');

module.exports = (post) => {
  const out = postToPathsMap[post.fileSlug];
  if (out) {
    return out;
  }

  // Not all posts are correctly attributed to a path (they're not linked to in the path JSON).
  // However, guess based on their filename. This is only needed for some "return" links.
  const parts = post.filePathStem.split('/');

  if (parts.length > 2) {
    const pathFolder = parts[2];
    if (pathFolder in paths) {
      return [pathFolder]; // callers use this key to look up in paths again
    }
  }

  return [];
};

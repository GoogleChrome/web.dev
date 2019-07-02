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

/**
 * Strip the 'blog' part from input paths.
 * This is used to create permalinks for blog posts that live in /blog/*.
 * @param {string} inputPath The inputPath to filter.
 * @return {string}
 */
module.exports = (inputPath) => {
  // inputPath from eleventy will look like this:
  // "./src/site/content/en/blog/test-post/index.md"

  // Find the content dir.
  const parts = inputPath.split('/');
  const startIdx = parts.indexOf('content');

  // Chop off the content dir.
  // Filter out the blog dir and post markdown file.
  // This should leave en/<post-slug>.
  return parts
    .slice(startIdx + 1)
    .filter((part) => part !== 'blog' && part !== 'index.md')
    .join('/');
};

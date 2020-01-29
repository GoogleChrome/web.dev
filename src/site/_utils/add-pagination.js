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
 * Take array of posts and returns an array of paginated pages for the posts.
 * @param {Array<object>} posts Posts to paginate
 * @param {object} additionalData Aditional data that may be relevant to a page.
 * Items like `title` or `description` would be here.
 * @return {Array<object>} An array of items to display, including href and index.
 */
module.exports = function pageContent(posts, additionalData = {}) {
  const pageCount = 24;
  const paginated = [];
  const pages = Math.ceil(posts.length / pageCount);

  for (let i = 0; i < pages; i++) {
    paginated.push({
      ...additionalData,
      posts: posts.splice(0, pageCount),
      index: i,
      pages,
    });
  }

  return paginated;
};

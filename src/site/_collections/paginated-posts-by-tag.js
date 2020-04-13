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

const postTags = require('../_data/postTags');
const livePosts = require('../_filters/live-posts');
const addPagination = require('../_utils/add-pagination');
const setdefault = require('../_utils/setdefault');

/**
 * Returns all posts as an array of paginated tags.
 * It's not as if every element in the array is a single page for a tag, rather, its an array that includes every tags page.
 * Each element includes n number of posts as well as some basic information of that tag to pump into `_includes/partials/paged.njk`
 * This is because we can not paginate something already paginated... Pagination is effectively a loop, and we can't have an embedded loop O^2.
 *
 * @param {any} collection Eleventy collection object
 * @return {Array<{ title: string, href: string, description: string, elements: Array<object>, index: number, pages: number }>} An array where each element is a paged tag with some meta data and n posts for the page.
 */
module.exports = (collection) => {
  const posts = collection
    .getAll()
    .filter(livePosts)
    .sort((a, b) => b.date - a.date);

  // Map the posts to various tags in the post
  const tagsMap = new Map();
  posts.forEach((post) => {
    const postDataTags = post.data.tags || [];
    postDataTags.forEach((postTag) => {
      const tagsPosts = setdefault(tagsMap, postTag, []);
      tagsPosts.push(post);
      tagsMap.set(postTag, tagsPosts);
    });
  });

  let tags = [];
  Object.keys(postTags).forEach((tagName) => {
    // Invalid tags will be skipped, assuming our linter will catch them later.
    // Skips misspelled tags, internal tags, and tags that are not in `postTags.js`.
    if (!tagsMap.has(tagName)) {
      return;
    }

    const tagData = postTags[tagName];
    tags = tags.concat(addPagination(tagsMap.get(tagName), tagData));
  });

  return tags;
};

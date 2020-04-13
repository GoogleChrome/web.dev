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

const addPagination = require('../_utils/add-pagination');
const postDescending = require('./post-descending');

/**
 * Returns all posts as an array of paginated posts.
 * Each element includes n number of posts as well as some basic information to pump into `_includes/partials/paged.njk`
 * This is designed so that it follows a similar structure to `_collections/paged-tags.js`.
 *
 * @param {any} collection Eleventy collection object
 * @return {Array<{ title: string, href: string, description: string, tag: string, elements: Array<object>, index: number, pages: number }>} An array where each element is a blog page with some meta data and n posts for the page.
 */
module.exports = (collection) => {
  const posts = postDescending(collection);
  return addPagination(posts, {href: '/blog/'});
};

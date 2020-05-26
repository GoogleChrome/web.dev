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

const authorsCollection = require('./authors-with-posts');
const addPagination = require('../_utils/add-pagination');

/**
 * Returns all posts as an array of paginated authors.
 *
 * It's not as if every element in the array is a single page for an author, rather, it is an array
 * that includes every authors page. Each element includes n number of posts as well as some basic
 * information of that tag to pump into `_includes/partials/paged.njk`. This is because we cannot
 * paginate something already paginated... Pagination is effectively a loop, and we can't have an
 * embedded loop O^2.
 *
 * @param {any} collections Eleventy collection object
 * @return {Array<Paginated>} An array where each element is a paged tag with some meta data and n posts for the page.
 */
module.exports = (collections) => {
  const authors = authorsCollection(collections);

  /** @constant @type {Array<Paginated>} @default */
  let paginated = [];

  authors.forEach((author) => {
    paginated = paginated.concat(addPagination(author.elements, author));
  });

  return paginated;
};

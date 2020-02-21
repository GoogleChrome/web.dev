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

const contributors = require("../_data/contributors");
const livePosts = require("../_filters/live-posts");
const addPagination = require("../_utils/add-pagination");
const setdefault = require("../_utils/setdefault");

/**
 * Returns all posts as an array of paginated authors.
 * It's not as if every element in the array is a single page for an author, rather, its an array that includes every authors page.
 * Each element includes n number of posts as well as some basic information of that tag to pump into `_includes/partials/paged.njk`
 * This is because we can not paginate something already paginated... Pagination is effectively a loop, and we can't have an embedded loop O^2.
 *
 * @param {any} collection Eleventy collection object
 * @return {Array<{ title: string, href: string, description: string, posts: Array<object>, index: number, pages: number }>} An array where each element is a paged tag with some meta data and n posts for the page.
 */
module.exports = (collection) => {
  const posts = collection
    .getAll()
    .filter(livePosts)
    .sort((a, b) => b.date - a.date);

  // Map the posts by author's username
  const authorsMap = new Map();
  posts.forEach((post) => {
    const authors = post.data.authors || [];
    authors.forEach((author) => {
      const postsByAuthor = setdefault(authorsMap, author, []);
      postsByAuthor.push(post);
      authorsMap.set(author, postsByAuthor);
    });
  });

  let authors = [];
  authorsMap.forEach((value, key) => {
    authors = authors.concat(addPagination(value, contributors[key]));
  });

  return authors;
};

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

const contributors = require("../_data/contributors.json");
const addPagination = require("../_utils/add-pagination");
const postDescending = require("./post-descending");

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
  const mapValue = (map, key) => {
    return map.has(key) ? map.get(key) : [];
  };

  const posts = postDescending(collection);
  const authorsMap = new Map();

  // Map the posts to various tags in the post
  posts.forEach((post) => {
    const postDataAuthors = post.data.authors || [];
    postDataAuthors.forEach((author) => {
      const authorsPosts = mapValue(authorsMap, author);
      authorsPosts.push(post);
      authorsMap.set(author, authorsPosts);
    });
  });

  let authors = [];
  Object.keys(contributors).forEach((contributor) => {
    if (!authorsMap.has(contributor)) {
      return;
    }

    const contributorData = contributors[contributor];
    const title =
      contributorData.name.given + " " + contributorData.name.family;
    const description =
      contributorData.description && contributorData.description.en
        ? contributorData.description.en
        : `Our latest news, updates, and stories by ${title}.`;

    authors = authors.concat(
      addPagination(authorsMap.get(contributor), {
        ...contributorData,
        title,
        description,
        href: `/authors/${contributor}/`,
      }),
    );
  });

  return authors;
};

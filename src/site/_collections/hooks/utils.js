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
 * Reusable hooks for authors and tags
 */

const addPagination = require('../../_utils/add-pagination');
const filterByLang = require('../../_filters/filter-by-lang');

/**
 * @param {AuthorsItem[]|TagsItem[]} items
 * @return {any[]}
 */
const feed = (items) => {
  const filteredFeed = [];

  if (process.env.ELEVENTY_ENV !== 'prod') {
    return filteredFeed;
  }

  for (const item of items) {
    if (item.elements.length > 0) {
      filteredFeed.push(item);
    }
  }

  return filteredFeed;
};

/**
 *
 * @param {any[]} items
 * @param {string} href
 * @param {string[]} testItems
 * @return {any[]}
 */
const index = (items, href, testItems) => {
  let itemsWithPosts = [];

  if (process.env.PERCY) {
    itemsWithPosts = items.filter((item) => testItems.includes(item.key));
  } else {
    itemsWithPosts = items.filter((item) => item.elements.length > 0);
  }

  itemsWithPosts.sort((a, b) => a.title.localeCompare(b.title));

  return addPagination(itemsWithPosts, {href});
};

/**
 * @param {any[]} items
 * @param {string} lang
 * @return {Paginated[]}
 */
const individual = (items, lang) => {
  let paginated = [];

  for (const item of items) {
    if (item.elements.length > 0) {
      paginated = paginated.concat(
        addPagination(filterByLang(item.elements, lang), item),
      );
    }
  }

  return paginated;
};

module.exports = {
  feed,
  index,
  individual,
};

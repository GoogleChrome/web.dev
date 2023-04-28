// @ts-nocheck
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
const fs = require('fs');
const externalFeeds = './external/_data/external-posts.json';
const {PAGINATION_COUNT} = require('../../_utils/constants');
const addPagination = require('../../_utils/add-pagination');
const filterByLang = require('../../_filters/filter-by-lang');
const {defaultLocale} = require('../../../../shared/locale');

/**
 * @param {VirtualCollectionItem[]} items
 * @return {VirtualCollectionItem[]}
 */
const feed = (items) => {
  const filteredFeed = [];

  if (!['prod', 'staging'].includes(process.env.ELEVENTY_ENV)) {
    return filteredFeed;
  }

  for (const item of items) {
    if (item.elements.length > 0) {
      filteredFeed.push({
        ...item,
        elements: item.elements.slice(0, PAGINATION_COUNT),
      });
    }
  }

  return filteredFeed;
};

/**
 * @param {VirtualCollectionItem[]} items
 * @param {string} href
 * @param {string[]} testItems
 * @return {Paginated[]}
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
 * @param {VirtualCollectionItem[]} items
 * @param {string} lang
 * @param {boolean} indexedOnly
 * @return {Paginated[]}
 */
const individual = (items, lang, indexedOnly = false) => {
  let paginated = [];

  for (const item of items) {
    let elements = item.elements;
    if (indexedOnly) {
      elements = elements.filter((element) => element.data.noindex !== true);
    }

    if (elements.length > 0) {
      paginated = paginated.concat(
        addPagination(filterByLang(elements, lang), item),
      );
    }
  }

  return paginated;
};

/**
 * @param {AuthorsItem[]} items
 * @param {string} lang
 * @param {boolean} indexedOnly
 * @return {Paginated[]}
 */
const authorIndividual = (items, lang, indexedOnly = false) => {
  let paginated = [];
  const authorsFeeds = JSON.parse(fs.readFileSync(externalFeeds, 'utf-8'));

  for (const item in items) {
    const authorKey = items[item].key;
    const authorsFeedsObj = Object.assign({}, ...authorsFeeds);
    const feeds = authorsFeedsObj[authorKey];

    if (feeds) {
      items[item] = items[item] || {};
      for (const feed of feeds) {
        const element = {
          date: new Date(feed.date),
          url: feed.url,
          data: {
            title: feed.title,
            subhead: feed.summary,
            source: feed.source,
            lang: defaultLocale,
          },
        };
        
        if (!items[item].elements) {
          items[item].elements = [];
        }

        items[item].elements.push(element);
      };
    }

    let elements = items[item].elements;
    if (indexedOnly) {
      elements = elements.filter((element) => element.data.noindex !== true);
    }

    if (elements.length > 0) {
      paginated = paginated.concat(
        addPagination(filterByLang(elements, lang), items[item]),
      );
    }
  }

  return paginated;
};

module.exports = {
  feed,
  index,
  individual,
  authorIndividual,
};

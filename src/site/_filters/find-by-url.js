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

const chalk = require("chalk");
const warn = chalk.black.bgYellow;

let memo;

/**
 * Memoize an eleventy collection into a hash for faster lookups.
 * Important: Memoization assumes that all post slugs are unique.
 * @param {Array<Object>} collection An eleventy collection.
 * Typically collections.all
 * @return {Array<Object>} The original collection. We return this to make
 * eleventy.addCollection happy since it expects a collection of some kind.
 */
const memoize = (collection) => {
  if (memo && Object.keys(memo).length) {
    /* eslint-disable-next-line */
    console.warn(warn(`Overwriting existing memoized collection!`));
  }

  memo = {};
  collection.forEach((item) => {
    if (item.url) {
      if (memo[item.url]) {
        throw new Error(`Found duplicate post url: '${item.url}'`);
      }

      memo[item.url] = item;
    }
  });

  // Just return the collection back to eleventy.
  return collection;
};

/**
 * Look up a post by its url.
 * Requires that the collection the post lives in has already been memoized.
 * @param {string} url The post url (in a form of "lang/slug") to look up.
 * @return {Object} An eleventy collection item.
 */
const findByUrl = (url) => {
  if (!url) {
    throw new Error(`url is either null or undefined`);
  }

  if (!memo) {
    throw new Error(`No collection has been memoized yet.`);
  }

  const found = memo[url];
  if (!found) {
    throw new Error(`Could not find post with url: ${url}`);
  }

  return found;
};

module.exports = {memoize, findByUrl};

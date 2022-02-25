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

require('dotenv').config();

const algoliasearch = require('algoliasearch');
const fs = require('fs');
const path = require('path');
const truncateUTF8Bytes = require('truncate-utf8-bytes');

const {sizeOfJSONInBytes} = require('./shared/sizeOfJSONInBytes');
const {defaultLocale, supportedLocales} = require('./shared/locale');

const maxChunkSizeInBytes = 10000000; // 10,000,000
const maxChunkSizeInMB = maxChunkSizeInBytes / 1000000;
// This limit is set by our current Algolia plan (with some headroom).
// The restriction applies to the size of the JSON serialization of each item.
// See https://support.algolia.com/hc/en-us/articles/4406981897617-Is-there-a-size-limit-for-my-index-records-#:~:text=The%20record%20size%20limit%20is%20based%20on%20the%20size%20of%20this%20final%20JSON%20file.
const maxItemSizeInBytes = 9000;

/**
 * If needed, trims size of an AlgoliaItem so that its JSON serialization is
 * under the byte limit.
 *
 * @param {AlgoliaItem} item
 * @return {AlgoliaItem}
 */
const trimBytes = (item) => {
  const currentSizeInBytes = sizeOfJSONInBytes(item);

  // If the item is too big, trim the content before returning it.
  if (currentSizeInBytes > maxItemSizeInBytes) {
    const bytesToRemove = currentSizeInBytes - maxItemSizeInBytes;
    const contentSizeInBytes = sizeOfJSONInBytes(item.content);

    item.content = truncateUTF8Bytes(
      item.content,
      contentSizeInBytes - bytesToRemove,
    );
  }

  return item;
};

/**
 * Chunks array of AlgoliaItem into array of array of AlgoliaItems smaller than 10 MB.
 *
 * @param {AlgoliaItem[]} arr
 * @return {AlgoliaItem[][]}
 */
const chunkAlgolia = (arr) => {
  const chunked = [];
  let tempSizeInBytes = 0;
  let temp = [];
  for (const arrItem of arr) {
    const currentSizeInBytes = sizeOfJSONInBytes(arrItem);

    if (currentSizeInBytes >= maxChunkSizeInBytes) {
      throw new Error(
        `${path.join(
          arrItem.locale || '',
          arrItem.url || '',
        )} is >= than ${maxChunkSizeInMB} MB`,
      );
    } else if (tempSizeInBytes + currentSizeInBytes < maxChunkSizeInBytes) {
      temp.push(arrItem);
      tempSizeInBytes += currentSizeInBytes;
    } else {
      chunked.push(temp);
      temp = [arrItem];
      tempSizeInBytes = currentSizeInBytes;
    }
  }
  chunked.push(temp);
  return chunked;
};

async function index() {
  const indexedOn = new Date();

  const raw = fs.readFileSync('dist/pages.json', 'utf-8');
  /** @type {AlgoliaItem[]} */
  const pagesData = JSON.parse(raw);

  /** @type {{ [url: string]: string[]}} */
  const urlToLocale = pagesData.reduce((urlLocalesDict, {url, locale}) => {
    if (urlLocalesDict[url]) {
      urlLocalesDict[url].push(locale);
    } else {
      urlLocalesDict[url] = [locale];
    }

    return urlLocalesDict;
  }, {});

  const algoliaData = pagesData.map((/** @type {AlgoliaItem} */ item) => {
    if (item.locale === defaultLocale) {
      const locales = urlToLocale[item.url];
      item.locales = [
        item.locale,
        ...supportedLocales.filter((i) => locales.indexOf(i) === -1),
      ];
    } else {
      item.locales = [item.locale];
    }
    item.indexedOn = indexedOn.getTime();
    return trimBytes(item);
  });

  // Skip indexing unless the environment is configured.
  if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY) {
    throw new Error(
      'Missing Algolia environment variables, skipping indexing.',
    );
  } else {
    const chunkedAlgoliaData = chunkAlgolia(algoliaData);
    const postsCount = algoliaData.length;

    // @ts-ignore
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY,
    );
    const index = client.initIndex('prod_web_dev');

    console.log(
      `Indexing ${postsCount} articles amongst ${chunkedAlgoliaData.length} chunk(s).`,
    );

    // When indexing data we mark these two fields as fields that can be filtered by.
    await index.setSettings({
      searchableAttributes: ['title', 'content', 'description'],
      attributesForFaceting: ['locales', 'tags'],
      customRanking: ['desc(priority)'],
    });

    // Update the Algolia index with new data
    for (let i = 0; i < chunkedAlgoliaData.length; i++) {
      await index.saveObjects(chunkedAlgoliaData[i], {
        autoGenerateObjectIDIfNotExist: true,
      });
    }

    console.log('Updated algolia data.');

    console.log('Deleting old data no longer in pages.json.');
    await index.deleteBy({
      filters: `indexedOn < ${indexedOn.getTime()}`,
    });
    console.log('Deleted old data.');
    console.log('Done!');
  }
}

module.exports = {
  chunkAlgolia,
  index,
  maxChunkSizeInBytes,
  maxItemSizeInBytes,
  trimBytes,
};

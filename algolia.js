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
const byteof = require('byteof');
const fs = require('fs');
const path = require('path');

const {defaultLocale, supportedLocales} = require('./shared/locale');

const maxChunkSizeInBytes = 10000000; // 10,000,000
const maxChunkSizeInMB = maxChunkSizeInBytes / 1000000;
const maxItemSizeInBytes = 7000; // 7,000

/**
 * Trim byte size of Algoia Collection Item.
 *
 * @param {AlgoliaItem} item
 * @return {AlgoliaItem}
 */
const trimBytes = (item) => {
  const currentSizeInBytes = byteof(item);
  // Calculate how many characters needs to be removed to get to right size
  const bytesToRemove = currentSizeInBytes - maxItemSizeInBytes;
  const contentBytes = byteof(item.content);
  // Calculate what percentage of description can stay in order to get it to right size
  const percentageToRemove = (contentBytes - bytesToRemove) / contentBytes;

  item.content = item.content.slice(
    0,
    Math.floor(item.content.length * percentageToRemove),
  );

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
    const currentSizeInBytes = byteof(arrItem);

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

  if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY) {
    throw new Error(
      'Missing Algolia environment variables, skipping indexing.',
    );
    // Ok, not a test, we got the keys, DO IT!
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

    // Update algolia index with new data
    for (let i = 0; i < chunkedAlgoliaData.length; i++) {
      await index.saveObjects(chunkedAlgoliaData[i], {
        autoGenerateObjectIDIfNotExist: true,
      });
    }

    console.log('Updated algolia data.');

    console.log('Deleting old data no longer in algolia.json.');
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

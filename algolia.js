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
const {sizeof} = require('sizeof');

const maxChunkSizeInBytes = 10000000; // 10,000,000

/**
 * Chunks array of AlgoliaCollectionItem into array of array of AlgoliaCollectionItem smaller than 10 MB.
 *
 * @param {AlgoliaCollectionItem[]} arr
 * @return {AlgoliaCollectionItem[][]}
 */
const chunkAlgolia = (arr) => {
  const chunked = [];
  let tempSizeInBytes = 0;
  let temp = [];
  for (const current of arr) {
    const currentSizeInBytes = sizeof(current);
    if (tempSizeInBytes + currentSizeInBytes < maxChunkSizeInBytes) {
      temp.push(current);
      tempSizeInBytes += currentSizeInBytes;
    } else {
      chunked.push(temp);
      temp = [current];
      tempSizeInBytes = currentSizeInBytes;
    }
  }
  chunked.push(temp);
  return chunked;
};

async function index() {
  const indexedOn = new Date();

  if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY) {
    console.warn('Missing Algolia environment variables, skipping indexing.');
    return;
  }

  const raw = fs.readFileSync('dist/algolia.json', 'utf-8');
  /** @type {AlgoliaCollection} */
  const algoliaData = JSON.parse(raw);

  // Set date of when object is being added to algolia
  algoliaData.map((e) => {
    e.indexedOn = indexedOn.getTime();
    return e;
  });

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
    attributesForFaceting: ['locales', 'tags'],
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

index().catch((err) => {
  console.error(err);
  throw err;
});

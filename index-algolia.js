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

require("dotenv").config();

const algoliasearch = require("algoliasearch");
const fs = require("fs");
const log = require("fancy-log");

// TODO(samthor): For now, we only index 'en' content.
const raw = fs.readFileSync("dist/en/algolia.json", "utf-8");
const indexed = JSON.parse(raw);

// Revision will look like "YYYYMMDDHHMM".
const revision = new Date()
  .toISOString()
  .substring(0, 16)
  .replace(/\D/g, "");
const primaryIndexName = "webdev";
const deployIndexName = `webdev_deploy_${revision}`;

async function index() {
  const client = algoliasearch(
    process.env.ALGOLIA_APP,
    process.env.ALGOLIA_KEY,
  );

  const primaryIndex = client.initIndex(primaryIndexName); // nb. not actually used, just forces init
  const deployIndex = client.initIndex(deployIndexName);

  log(
    `Indexing ${indexed.length} articles with temporary index ${deployIndex.indexName}...`,
  );

  // TODO(samthor): This is from https://www.algolia.com/doc/api-reference/api-methods/replace-all-objects/#examples,
  // are there more things that should be copied?
  const toCopy = ["settings", "synonyms", "rules"];
  await client.copyIndex(primaryIndex.indexName, deployIndex.indexName, toCopy);

  // TODO(samthor): Batch uploads so that we don't send more than 10mb.
  // As of September 2019, the JSON itself is only ~70k. \shrug/
  await deployIndex.addObjects(indexed);
  log(`Indexed, replacing existing index ${primaryIndex.indexName}`);

  // Move our temporary deploy index on-top of the primary index, atomically.
  await client.moveIndex(deployIndex.indexName, primaryIndex.indexName);
  log(`Done!`);
}

index().catch((err) => {
  log.error(err);
  process.exit(1);
});

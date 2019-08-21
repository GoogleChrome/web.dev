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

 
const algoliasearch = require('algoliasearch');
const childProcess = require('child_process');
const fs = require('fs');

const INDEXED_REV = './indexed-rev.json';


/**
 * Fetches the last revision this file was changed in Git.
 *
 * @param {string} inputPath
 * @return {string}
 */
function lastRevision(inputPath) {
  const args = ['log', '-n', '1', '--pretty=format:%H', '--', inputPath];
  const out = childProcess.spawnSync('git', args, {cwd: __dirname});
  if (out.status) {
    throw new Error(`could not determine git revision for (status=${out.status}): ${inputPath}`);
  }
  // TODO(samthor): This still returns the last commit even for files that have been changed on-disk.
  return out.stdout.toString();
}

function previousRevisions() {
  const raw = fs.readFileSync(INDEXED_REV, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Reconciles the index inside Algolia. Expects _all_ posts to be passed to this method, but only
 * performs a partial insert and delete (as needed), based on a local revisions file.
 *
 * The local revisions file itself should be commited to git.
 *
 * @param {{applicationId: string, key: string}} config 
 * @param {!Array<Object>} posts from Eleventy
 */
async function updateIndex(config, posts) {
  const client = algoliasearch(config.applicationId, config.key);
  const index = client.initIndex('webdev');

  // Load last indexed revisions from storage, and build a Set of 
  const revisions = previousRevisions();
  const objectsToDelete = new Set(Object.keys(revisions));

  const stats = {new: 0, updated: 0, deleted: 0, unknown: 0};

  const objects = posts.map(({data, template}) => {
    const content = template.frontMatter.content;
    // TODO(samthor): Index full-text content.

    const {page} = data;
    const {inputPath, url} = page;

    objectsToDelete.delete(url);

    // Read the last changed revision of the file we're indexing, and perform another indexing job
    // only if it has changed (or didn't exist before).
    const rev = lastRevision(inputPath);
    if (!revisions[url]) {
      ++stats.new;
    } else if (!rev) {
      ++stats.unknown;
      return null; // refusing to index an uncommited file
    } else if (rev === revisions[url]) {
      return null; // revision matches, nothing to do!
    } else {
      ++stats.updated;
    }

    revisions[url] = rev;

    return {
      objectID: url,
      title: data.title,
      description: data.description,
      _tags: data.tags,
    };
  }).filter(Boolean);

  // Clear revisions from our store so that we don't try to delete them again.
  objectsToDelete.forEach((url) => {
    delete revisions[url];
  });
  stats.deleted = objectsToDelete.size;

  console.debug(`Indexing ${posts.length} posts: updated=${stats.updated}, new=${stats.new}, deleted=${stats.deleted}, unknown=${stats.unknown}`);
  objects.forEach(({title, objectID}) => {
    console.info(objectID, title);
  });

  const addPromise = objects.length ? index.addObjects(objects) : null;
  const deletePromise = objectsToDelete.size ? index.delete(Array.from(objectsToDelete)) : null;

  const addResult = await addPromise;
  const deleteResult = await deletePromise;

  if (addPromise || deletePromise) {
    console.info('Algolia returned', addResult, deleteResult);
    fs.writeFileSync(INDEXED_REV, JSON.stringify(revisions, null, 2));
  }
}

module.exports = {updateIndex};
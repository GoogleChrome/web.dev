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
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');

/** @type TagsData */
const tagsData = require('../_data/tagsData.json');
// The i18n for this file exposes top-level object keys of valid tags.
// We use this only to fetch valid tags from the object's keys.
const supportedTags = /** @type {{[tag: string]: unknown}} */ (
  YAML.load(
    fs.readFileSync(path.join(__dirname, '../_data/i18n/tags.yml'), 'utf-8'),
  )
);

const {isLive} = require('../_filters/is-live');
const {sortByUpdated} = require('../_utils/sort-by-updated');

/** @type Tags */
let processedCollection;

/**
 *
 * @param {string} key
 * @returns {TagsItem}
 */
function createChromeTag(key) {
  const release = +key.substr('chrome-'.length);
  const tag = {
    ...createTag(key),
    description: `i18n.tags.chrome.description`,
    /**
     * For Chrome releases, use a literal string title (don't translate "Chrome xx").
     */
    overrideTitle: key.replace('chrome-', 'Chrome '),
    title: `i18n.tags.chrome.title`,
    /**
     * This is the numeric Chrome release for this tag.
     */
    release,
  };
  return tag;
}

/**
 *
 * @param {string} key
 * @param {TagsDataItem} tagData
 * @returns {TagsItem}
 */
function createTag(key, tagData = {}) {
  const href = `/tags/${key}/`;
  const image = tagData.image;

  /** @type TagsItem */
  const tag = {
    ...tagData,
    data: {
      hero: image,
      tags: [key],
    },
    description: `i18n.tags.${key}.description`,
    elements: [],
    href,
    key,
    title: `i18n.tags.${key}.title`,
    url: href,
  };

  return tag;
}

/**
 * Returns all tags with their posts.
 *
 * @param {EleventyCollectionObject} [collections] Eleventy collection object
 * @return {Tags}
 */
module.exports = (collections) => {
  if (processedCollection) {
    return processedCollection;
  }

  /** @type Tags */
  const tags = Object.fromEntries(
    Object.keys(supportedTags).map((tag) => [
      tag,
      createTag(tag, tagsData[tag]),
    ]),
  );

  const posts = collections
    .getFilteredByGlob('**/*.md')
    .filter((item) => isLive(item) && !item.data.excludeFromTags)
    .sort(sortByUpdated);

  for (const post of posts) {
    post.data.tags = [post.data.tags ?? []].flat();
    if (post.data.tags.length) {
      // Handle Chrome Tags
      const chromeTags = post.data.tags.filter((tag) =>
        tag.startsWith('chrome-'),
      );

      for (const chromeTag of chromeTags) {
        if (!tags[chromeTag]) {
          tags[chromeTag] = createChromeTag(chromeTag);
        }
        tags[chromeTag].elements.push(post);
      }

      // Handle All Other Tags
      for (const postsTag of post.data.tags) {
        if (postsTag in supportedTags) {
          tags[postsTag].elements.push(post);
        }
      }
    }
  }

  if (collections) {
    processedCollection = tags;
  }

  return tags;
};

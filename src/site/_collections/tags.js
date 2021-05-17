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
/** @type TagsData */
const tagsData = require('../_data/tagsData.json');
const {livePosts} = require('../_filters/live-posts');
const {sortByUpdated} = require('../_utils/sort-by-updated');

/** @type Tags */
let processedCollection;

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
  const tags = {};

  Object.keys(tagsData).forEach((key) => {
    const tagData = tagsData[key];
    const title = tagData.title;
    const description =
      tagData.description ||
      `Our latest news, updates, and stories about ${title.toLowerCase()}.`;
    const href = `/tags/${key}/`;

    /** @type TagsItem */
    const tag = {
      ...tagData,
      data: {
        subhead: description,
        title,
        tags: [key],
      },
      description,
      elements: [],
      href,
      key,
      title,
      url: href,
    };

    // Get posts
    if (collections) {
      tag.elements = collections
        .getFilteredByGlob('**/*.md')
        .filter(
          (item) =>
            livePosts(item) &&
            !item.data.excludeFromTags &&
            (item.data.tags || []).includes(key),
        )
        .sort(sortByUpdated);
    }

    // Limit posts for percy
    if (process.env.PERCY) {
      tag.elements = tag.elements.slice(-6);
    }

    // Set created on date and updated date
    if (tag.elements.length > 0) {
      tag.data.date = tag.elements.slice(-1).pop().data.date;
      const updated = tag.elements.slice(0, 1).pop().data.date;
      if (tag.data.date !== updated) {
        tag.data.updated = updated;
      }
    }

    if (tag.elements.length > 0 || !collections) {
      tags[tag.key] = tag;
    }
  });

  if (collections) {
    processedCollection = tags;
  }

  return tags;
};

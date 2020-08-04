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
const tagsData = require('../_data/tagsData');
const {livePosts} = require('../_filters/live-posts');

/**
 * Returns all tags with posts.
 *
 * @param {any} [collections] Eleventy collection object
 * @return {Array<{ title: string, key: string, description: string, href: string, url: string, data: { title: string, subhead: string }, elements: Array<object> }>} An array where each element is a paged tag with some meta data and n posts for the page.
 */
module.exports = (collections) => {
  const tags = {};

  Object.keys(tagsData).forEach((key) => {
    const tag = {...tagsData[key]};

    tag.key = key;
    tag.href = `/tags/${key}/`;
    tag.description = tag.description
      ? tag.description
      : `Our latest news, updates, and stories about ${tag.title.toLowerCase()}.`;
    tag.data = {
      title: tag.title,
      subhead: tag.description,
      canonicalUrl: tag.href,
    };
    tag.elements = [];

    if (collections) {
      tag.elements = collections
        .getFilteredByTag(tag.key)
        .filter(livePosts)
        .sort((a, b) => b.date - a.date);
    }

    if (tag.elements.length > 0 || !collections) {
      tags[tag.key] = tag;
    }
  });

  return tags;
};

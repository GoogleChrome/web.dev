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

const path = require('path');
const postTags = require('../_data/postTags');
const {livePosts} = require('../_filters/live-posts');

/**
 * Returns all tags with posts.
 *
 * @param {any} collections Eleventy collection object
 * @return {Array<{ title: string, key: string, description: string, href: string, url: string, data: { title: string, subhead: string }, elements: Array<object> }>} An array where each element is a paged tag with some meta data and n posts for the page.
 */
module.exports = (collections) => {
  return Object.values(postTags).reduce((accumulator, tag) => {
    // This updates the shared postTags object with meta information and is safe to be called multiple times.
    tag.url = path.join('/en', tag.href);
    tag.data = {
      title: tag.title,
      subhead: tag.description,
    };
    tag.elements = collections
      .getFilteredByTag(tag.key)
      .filter(livePosts)
      .sort((a, b) => b.date - a.date);

    if (tag.elements.length > 0) {
      accumulator.push(tag);
    }

    return accumulator;
  }, []);
};

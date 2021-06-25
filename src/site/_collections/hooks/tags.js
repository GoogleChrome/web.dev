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

const {feed, index, individual} = require('./utils');

/**
 * @param {TagsItem[]} tags
 * @return {TagsItem[]}
 */
const tagsFeed = (tags) => feed(tags);

/**
 * @param {TagsItem[]} tags
 * @return {Paginated[]}
 */
const tagsIndex = (tags) => {
  const href = '/tags/';
  const testTags = [
    'css',
    'javascript',
    'lighthouse',
    'seo',
    'progressive-web-apps',
    'webxr',
  ];

  return index(tags, href, testTags);
};

/**
 * @param {TagsItem[]} tags
 * @param {string} lang
 * @return {Paginated[]}
 */
const tagsIndividual = (tags, lang) => individual(tags, lang);

module.exports = {
  feed: tagsFeed,
  index: tagsIndex,
  individual: tagsIndividual,
};

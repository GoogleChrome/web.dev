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

const {addFields, feed, index, individual} = require('./utils');

/**
 * @param {TagsItem[]} tags
 * @param {string} lang
 * @return {TagsItem[]}
 */
const tagsFeed = (tags, lang) => feed(addFields(tags, 'i18n.tags', lang));

/**
 * @param {TagsItem[]} tags
 * @param {string} lang
 * @return {Paginated[]}
 */
const tagsIndex = (tags, lang) => {
  const href = '/tags/';
  const testTags = [
    'css',
    'javascript',
    'lighthouse',
    'seo',
    'progressive-web-apps',
    'webxr',
  ];

  return index(addFields(tags, 'i18n.tags', lang), href, testTags);
};

/**
 * @param {TagsItem[]} tags
 * @param {string} lang
 * @return {Paginated[]}
 */
const tagsIndividual = (tags, lang) =>
  individual(addFields(tags, 'i18n.tags', lang), lang);

module.exports = {
  feed: tagsFeed,
  index: tagsIndex,
  individual: tagsIndividual,
};

/*
 * Copyright 2021 Google LLC
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
const striptags = require('striptags');

const md5 = require('./md5');
const {getDefaultUrl} = require('./urls');
const {defaultLocale} = require('../_data/site');
const {generateImgixSrc} = require('../_includes/components/Img');
const {findByUrl} = require('./find-by-url');
const {getPostParentUrl} = require('./get-post-parent-url');

/**
 * @param {EleventyCollectionItem} post
 * @return {AlgoliaItem}
 */
function algoliaItem(post) {
  const data = post.data;

  return {
    content: striptags(/** @type {string} */ (post.templateContent)),
    createdOn: data.date,
    description: data.renderData?.description || data.description,
    image: data.hero
      ? generateImgixSrc(data.hero, {w: 100, auto: 'format'})
      : null,
    locale: data.lang || defaultLocale,
    locales: [],
    objectID: md5(post.url),
    priority: data.algolia_priority ?? 1,
    tags: data.tags && Array.isArray(data.tags) ? data.tags : [],
    title: data.renderData?.title || data.title,
    updatedOn: data.updated,
    url: getDefaultUrl(post.url),
    parentTitle: findByUrl(getPostParentUrl(post))?.data?.title,
  };
}

module.exports = algoliaItem;

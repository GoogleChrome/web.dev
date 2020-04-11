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
const livePosts = require('../_filters/live-posts');
const addPagination = require('../_utils/add-pagination');

/**
 * Returns all tags as a paginated array.
 *
 * Each element includes n number of tags as well as some basic
 * information of that tag to pump into `_includes/partials/paged.njk`. This is because we cannot
 * paginate something already paginated... Pagination is effectively a loop, and we can't have an
 * embedded loop O^2.
 *
 * @param {any} collections Eleventy collection object
 * @return {Array<{ title: string, href: string, description: string, elements: Array<object>, index: number, pages: number }>} An array where each element is a paged tag with some meta data and n posts for the page.
 */
module.exports = (collections) => {
  const testTags = [
    'css',
    'javascript',
    'lighthouse',
    'seo',
    'progressive-web-apps',
    'webxr',
  ];

  const elements = Object.values(postTags)
    .filter((tag) => {
      const posts = collections.getFilteredByTag(tag.key).filter(livePosts);
      return process.env.PERCY ? testTags.includes(tag.key) : posts.length > 0;
    })
    .map((tag) => {
      tag.url = path.join('/en', tag.href);
      tag.data = {
        title: tag.title,
        subhead: tag.description,
      };
      return tag;
    });

  return addPagination(elements, {
    href: '/tags/',
  });
};

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

const addPagination = require('../../_utils/add-pagination');
const filterByLang = require('../../_filters/filter-by-lang');

/**
 * @param {any[]} blogPosts
 * @param {string} lang
 * @return {Paginated[]}
 */
const blogIndex = (blogPosts, lang) => {
  return addPagination(filterByLang(blogPosts, lang), {href: '/blog/'});
};

module.exports = {
  index: blogIndex,
};

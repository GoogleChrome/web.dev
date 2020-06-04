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

const constants = require('./constants');

/**
 * Take array of elements and returns an array of paginated pages for the elements.
 * @param {Array<object>} elements Elements to paginate
 * @param {AdditionalData} additionalData Aditional data that may be relevant to a page.
 * @return {Array<Paginated>} An array of items to display, including href and index.
 */
module.exports = function addPagination(elements, additionalData = {}) {
  if (!Array.isArray(elements)) {
    throw new Error(
      `addPagination only accepts an array, you passed in a ${typeof elements}`,
    );
  }

  if (typeof additionalData !== 'object') {
    throw new Error('additionalData must be an object');
  }

  const pageCount = constants.PAGINATION_COUNT;
  const paginated = [];
  const pages = Math.ceil(elements.length / pageCount);

  for (let i = 0; i < pages; i++) {
    const startFrom = i * pageCount;
    paginated.push({
      ...additionalData,
      elements: elements.slice(startFrom, startFrom + pageCount),
      index: i,
      pages,
    });
  }

  return paginated;
};

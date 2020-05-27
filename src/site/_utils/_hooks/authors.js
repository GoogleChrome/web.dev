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

const addPagination = require('../add-pagination');

/**
 * @param {Author[]} authors
 * @return {Author[]}
 */
const authorsFeed = (authors) => {
  let filteredAuthors = [];

  if (process.env.ELEVENTY_ENV !== 'dev') {
    filteredAuthors = authors.reduce((accumulator, author) => {
      if (author.elements.length > 0) {
        accumulator.push(author);
      }

      return accumulator;
    }, []);
  }

  return filteredAuthors;
};

/**
 * @param {Author[]} authors
 * @return {Paginated[]}
 */
const authorsIndex = (authors) => {
  const testAuthors = [
    'robdodson',
    'samthor',
    'surma',
    'mgechev',
    'addyosmani',
    'adamargyle',
  ];
  const authorsWithPosts = authors.reduce((accumulator, author) => {
    if (process.env.PERCY && !testAuthors.includes(author.key)) {
      accumulator.push(author);
    } else if (author.elements.length > 0) {
      accumulator.push(author);
    }

    return accumulator;
  }, []);

  return addPagination(authorsWithPosts, {href: '/authors/'});
};

/**
 * @param {Author[]} authors
 * @return {Paginated[]}
 */
const authorsIndividual = (authors) => {
  let paginated = [];

  authors.forEach((author) => {
    if (author.elements.length > 0) {
      paginated = paginated.concat(addPagination(author.elements, author));
    }
  });

  return paginated;
};

module.exports = {
  feed: authorsFeed,
  index: authorsIndex,
  individual: authorsIndividual,
};

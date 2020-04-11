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
const fs = require('fs');
const path = require('path');
const contributors = require('../_data/contributors');
const addPagination = require('../_utils/add-pagination');

/**
 * Returns all authors as a paginated array.
 *
 * Each element includes n number of authors as well as some basic
 * information of that tag to pump into `_includes/partials/paged.njk`. This is because we cannot
 * paginate something already paginated... Pagination is effectively a loop, and we can't have an
 * embedded loop O^2.
 *
 * @return {Array<{ title: string, href: string, description: string, elements: Array<object>, index: number, pages: number }>} An array where each element is a page with some meta data and n authors for the page.
 */
module.exports = () => {
  const testAuthors = [
    'robdodson',
    'samthor',
    'surma',
    'egsweeny',
    'addyosmani',
    'adamargyle',
  ];
  let authors = Object.values(contributors).sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  if (process.env.PERCY) {
    authors = authors.filter((item) => testAuthors.includes(item.key));
  }

  const elements = authors.map((author) => {
    author.url = path.join('/en', author.href);
    author.data = {
      title: author.title,
      subhead: author.description,
    };

    for (const size of ['@3x', '@2x', '']) {
      if (
        fs.existsSync(
          path.join(
            'src',
            'site',
            'content',
            'en',
            'images',
            'authors',
            `${author.key}${size}.jpg`,
          ),
        )
      ) {
        author.data.hero = path.join(
          '/images',
          'authors',
          `${author.key}${size}.jpg`,
        );
        author.data.alt = author.title;
        break;
      }
    }

    return author;
  });

  return addPagination(elements, {
    href: '/authors/',
  });
};

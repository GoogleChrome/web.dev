/*
 * Copyright 2022 Google LLC
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

const {getRelativePath} = require('../../../../../_filters/urls');

module.exports = {
  eleventyComputed: {
    'override:patterns': {
      sets: (data) => {
        const name = getRelativePath(data.page.url, '/patterns/');

        const sets = {};

        sets[name] = {
          id: name,
          title: data.title,
          description: data.description,
          hero: data.hero,
          draft: Boolean(data.draft),
          rawContent: data.contents,
        };

        return sets;
      },
      patterns: (data) => {
        const set = getRelativePath(data.page.url, '/patterns/');

        return {
          sample1: {
            id: 'sample1',
            title: 'A sample pattern',
            description: 'Lorem ipsum dolor sit amet',
            set,
          },
          sample2: {
            id: 'sample2',
            title:
              'A sample pattern with a longer title. Lorem ipsum dolor sit amet, ' +
              'consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
              'labore et dolore magna aliqua',
            description: 'Lorem ipsum dolor sit amet',
            set,
          },
          sample3: {
            id: 'sample3',
            title: 'Another sample pattern',
            description: 'Lorem ipsum dolor sit amet',
            set,
          },
        };
      },
    },
  },
};

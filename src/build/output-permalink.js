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

const {defaultLocale} = require('../site/_data/site');

/**
 * Takes the `inputPath` or `permalink` of a post or page and generates a permalink (output path).
 * Basically the idea is to take the `inputPath` (where in the project the file's located),
 * or take the existing permalink (a defined output for a file) and create a new permalink
 * with the path being modified based on its locale.
 *
 * If the content is in the default locale (en), we remove the default locale from the path.
 * If the `inputPath`/`permalink` is not of the default locale we add `i18n`
 * to the path, so that the locale's folder is in a `i18n` folder.
 *
 * @example outputPermalink({page: {inputPath: '/src/site/content/en/index.html'}}); // '/'
 * @example outputPermalink({page: {inputPath: '/src/site/content/pl/index.html'}}); // '/i18n/pl/'
 * @example outputPermalink({permalink: 'en/index.html'}); // '/'
 * @example outputPermalink({permalink: 'pl/index.html'}); // '/i18n/pl/'
 *
 * @param {TODO} data
 * @returns {string}
 */
module.exports = (data) => {
  const defaultLocaleRegExp = new RegExp(`^/${defaultLocale}/`);
  const localization = data.lang !== defaultLocale;

  // In eleventy you can set permalink: false to tell it to not output a page.
  // If a page has a false permalink we should completely ignore it.
  if ('permalink' in data && data.permalink === false) {
    return;
  }

  if (data.permalink) {
    return data.permalink.replace(
      /^\/{{lang}}/,
      localization ? '/i18n/{{lang}}' : '',
    );
  }

  return data.page.inputPath
    .replace(/^\.\/src\/site\/content/, localization ? 'i18n/' : '')
    .replace(/index.(md|njk)$/, '')
    .replace(/(md|njk)$/, 'html')
    .replace(defaultLocaleRegExp, '/');
};

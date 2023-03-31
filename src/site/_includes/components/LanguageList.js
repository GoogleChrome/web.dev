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

const {
  defaultLanguage,
  languageNames,
  languageOrdering,
} = require('../../../lib/utils/language');

const {getDefaultUrl, getTranslatedUrls} = require('../../_filters/urls');

module.exports = (data) => {
  const langHrefs = getTranslatedUrls(data.url).filter(
    (langHref) => langHref[0] !== data.lang,
  );

  // Exit early if there are no translations.
  if (langHrefs.length === 0) return '';

  langHrefs.map((langHref) => {
    langHref.push(languageNames[langHref[0]]);
  });

  // Ensure that the default (English) translation is added as well.
  langHrefs.push([
    defaultLanguage,
    getDefaultUrl(data.url),
    languageNames[defaultLanguage],
  ]);

  // Sort the list of languages with a specific ordering.
  // C.f. https://github.com/GoogleChrome/web.dev/issues/7430
  langHrefs.sort((a, b) => {
    const indexOfA = languageOrdering.indexOf(a[0]);
    const indexOfB = languageOrdering.indexOf(b[0]);
    return indexOfA > indexOfB ? 1 : -1;
  });

  return langHrefs;
};

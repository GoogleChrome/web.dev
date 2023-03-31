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
} = require('../../lib/utils/language');

const {
  getDefaultUrl,
  getLocaleSpecificUrl,
  getTranslatedUrls,
} = require('../_filters/urls');

/**
 * Look up a post by its url.
 * Requires that the collection the post lives in has already been memoized.
 * @param {String} lang The post url (in a form of "lang/slug") to look up.
 * @param {EleventyCollectionItem} page The post url (in a form of "lang/slug") to look up.
 * @return {Array} An eleventy collection item.
 */

const languageSupportedList = (page, lang) => {
  const url = page.url;
  const langHrefs = getTranslatedUrls(url).filter(
    (langHref) => langHref[0] !== lang,
  );

  // Exit early if there are no translations.
  if (langHrefs.length === 0) return;

  langHrefs.map((langHref) => {
    langHref.push(languageNames[langHref[0]]);
  });

  // Ensure that the default (English) translation is added as well.
  const defaultHref = getLocaleSpecificUrl(defaultLanguage, getDefaultUrl(url));
  langHrefs.push([
    defaultLanguage,
    defaultHref,
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

module.exports = {languageSupportedList};

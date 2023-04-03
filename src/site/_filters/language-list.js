/*
 * Copyright 2023 Google LLC
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
  languageNames,
  defaultLanguage,
  languageOrdering,
} = require('../../lib/utils/language');

const {
  getDefaultUrl,
  getTranslatedUrls,
  getLocaleSpecificUrl,
} = require('../_filters/urls');

/**
 * Look up all supported languages for a specific post
 *
 * @param {String} lang The current lang of a post to look up.
 * @param {EleventyCollectionItem} post The post to look up.
 * @return {String[][]} The list of supported languages for a specific post
 */

const supportedLanguages = (post, lang) => {
  const url = post.url;
  const languages = getTranslatedUrls(url).filter(
    (langHref) => langHref[0] !== lang,
  );

  // Exit early if there are no translations.
  if (languages.length === 0) return [];

  languages.map((langHref) => {
    langHref.push(languageNames[langHref[0]]);
  });

  // Ensure that the default (English) translation is added as well.
  const defaultHref = getLocaleSpecificUrl(defaultLanguage, getDefaultUrl(url));
  languages.push([
    defaultLanguage,
    defaultHref,
    languageNames[defaultLanguage],
  ]);

  // Sort the list of languages with a specific ordering.
  // C.f. https://github.com/GoogleChrome/web.dev/issues/7430
  languages.sort((a, b) => {
    const indexOfA = languageOrdering.indexOf(a[0]);
    const indexOfB = languageOrdering.indexOf(b[0]);
    return indexOfA > indexOfB ? 1 : -1;
  });

  return languages;
};

module.exports = {supportedLanguages};

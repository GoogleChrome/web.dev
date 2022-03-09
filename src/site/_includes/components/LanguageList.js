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
const {
  getDefaultUrl,
  getLocaleSpecificUrl,
  getTranslatedUrls,
} = require('../../_filters/urls');
const {i18n} = require('../../_filters/i18n');

module.exports = (url, lang) => {
  const langHrefs = getTranslatedUrls(url).filter(
    (langHref) => langHref[0] !== lang,
  );

  // Exit early if there are no translations.
  if (langHrefs.length === 0) {
    return '';
  }

  // Ensure that the default (English) translation is added as well.
  const defaultHref = getLocaleSpecificUrl(defaultLanguage, getDefaultUrl(url));
  langHrefs.push([defaultLanguage, defaultHref]);

  // Sort the list of languages with a specific ordering.
  // C.f. https://github.com/GoogleChrome/web.dev/issues/7430
  langHrefs.sort((a, b) => {
    const indexOfA = languageOrdering.indexOf(a[0]);
    const indexOfB = languageOrdering.indexOf(b[0]);
    return indexOfA > indexOfB ? 1 : -1;
  });

  const languageLinks = langHrefs.map((langHref) => {
    const href = langHref[1];
    return `<a class="w-post-signpost__link"
      translate="no"
      lang="${langHref[0]}"
      href="${href}">${languageNames[langHref[0]]}</a>`;
  });

  const availableIn = i18n('i18n.post.available_in', lang);
  const listFormat = new Intl.ListFormat(lang);

  return `<span class="w-post-signpost__title">
    ${availableIn}:
    ${listFormat.format(languageLinks)}
  </span>`;
};

/*
 * Copyright 2021 Google LLC
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
const path = require('path');
const {supportedLocales} = require('../../../shared/locale');
const {findByUrl} = require('./find-by-url');

const i18nRegex = /i18n\/\w+\//;

/**
 * Removes any i18n data from a URL to determine the default URL.
 * @param {string} url URL with possible i18n folder and locale in prefix.
 * @returns {string} URL without any i18n information.
 */
const getDefaultUrl = (url) => {
  if (typeof url !== 'string') {
    return url; // shows up for `permalink: false`
  }
  return url.startsWith('/i18n/') ? url.replace(i18nRegex, '') : url;
};

/**
 * Extracts relative path from a url.
 * @param {string} url Url to be processed.
 * @param {string} pathPrefix Part of the url the output should be relative to.
 * @returns {string} relative path
 */
const getRelativePath = (url, pathPrefix) => path.relative(pathPrefix, url);

/**
 * Find i18n equivalents of the current url and check if they exist.
 * @param {string} url Url of the original article.
 * @returns {Array} Array of language and url pairs.
 */
const getTranslatedUrls = (url) => {
  url = getDefaultUrl(url);
  return (
    supportedLocales
      .map((locale) => [locale, path.join('/', 'i18n', locale, url)])
      // Filter out i18n urls that do not have an existing translated file.
      .filter((langhref) => !!findByUrl(langhref[1]))
  );
};

module.exports = {
  getDefaultUrl,
  getRelativePath,
  getTranslatedUrls,
};

/*
 * Copyright 2019 Google LLC
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
const site = require('../_data/site');
const locales = require('../../../shared/locale');

module.exports = (inputPath, lang) => {
  // Check if requested a supported locale and other than the default one.
  if (
    !inputPath ||
    lang === locales.defaultLocale ||
    !locales.isSupportedLocale(lang)
  ) {
    return '';
  }
  inputPath = inputPath.replace(`/${lang}/`, `/${site.defaultLocale}/`);
  return path.join(site.gitlocalize, lang, inputPath);
};

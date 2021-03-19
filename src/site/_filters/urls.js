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

/**
 * Removes any i18n data from a URL to determine the default URL.
 *
 * @param {string} url URL with possible i18n folder and locale in prefix.
 * @returns {string} URL without any i18n information.
 */
const getDefaultUrl = (url) =>
  url.replace(/^\/i18n\/[a-z]{2}(-[A-Z]{2})?\//, '/');

module.exports = {
  getDefaultUrl,
};

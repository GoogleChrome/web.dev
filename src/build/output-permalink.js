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

/**
 *
 * @param {TODO} data
 * @param {boolean} [localization]
 * @returns {string}
 */
module.exports = (data, localization) => {
  if (data.permalink) {
    return data.permalink.replace(
      /^\/{{lang}}/,
      localization ? '/localized-files/{{lang}}' : '/',
    );
  }

  return data.page.inputPath
    .replace(/^.\/src\/site\/content/, localization ? 'localized-files/' : '')
    .replace(/index.(md|njk)$/, '')
    .replace(/(md|njk)$/, 'html')
    .replace(/^\/en\//, '/');
};

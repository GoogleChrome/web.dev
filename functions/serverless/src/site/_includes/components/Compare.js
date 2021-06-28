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

const {i18n, getLocaleFromPath} = require('../../_filters/i18n');

/**
 * @this {EleventyPage}
 * @param {string} content Markdown with the content for the compare element.
 * @param {string} type Compare element type: 'worse' or 'better'.
 * @param {string} labelOverride Custom label for the compare element.
 */
function Compare(content, type, labelOverride) {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);

  if (!type) {
    throw new Error(
      `Can't create Compare component without a type in ${this.page.inputPath}.
      Did you forget to pass the type as a string?`,
    );
  }

  let label = labelOverride || '';
  if (!label) {
    switch (type) {
      case 'worse':
        label = i18n(`i18n.common.dont`, locale);
        break;

      case 'better':
        label = i18n(`i18n.common.do`, locale);
        break;

      default:
        break;
    }
  }

  // prettier-ignore
  return `<figure class="w-compare"><p class="w-compare__label w-compare__label--${type}">${label}</p>

${content}</figure>`;
}

module.exports = Compare;

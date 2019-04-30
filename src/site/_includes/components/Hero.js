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

const {html} = require('common-tags');
const path = require('path');
const stripLanguage = require('../../_filters/strip-language');

module.exports = ({page, hero, alt, heroPosition}) => {
  return html`
    <img
      class="w-hero ${heroPosition ? `w-hero--${heroPosition}` : ''}"
      src="${stripLanguage(path.join(page.url, hero))}"
      alt="${alt}"
    />
  `;
};

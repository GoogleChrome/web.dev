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

const {html} = require("common-tags");
const stripLanguage = require("../../_filters/strip-language");
const getImagePath = require("../../_utils/get-image-path");
const getSrcsetRange = require("../../_utils/get-srcset-range");

/* eslint-disable max-len */
module.exports = ({page, hero, alt, heroPosition, heroFit = "cover"}) => {
  const imagePath = getImagePath(hero, stripLanguage(page.url));
  const srcsetRange = getSrcsetRange();

  // prettier-ignore
  return html`
    <img
      class="w-hero w-hero--${heroFit} ${heroPosition ? `w-hero--${heroPosition}` : ""}"
      sizes="100vw"
      srcset="${srcsetRange.map((width) => html`
        ${imagePath}?auto=format&fit=max&w=${width} ${width}w,
      `)}"
      src="${imagePath}"
      alt="${alt}"
    />
  `;
};

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
const getSrcsetRange = require('../../_utils/get-srcset-range');

module.exports = ({hero, alt, heroPosition, heroFit = 'cover'}) => {
  const srcsetRange = getSrcsetRange();

  // prettier-ignore
  return html`
    <img
      class="w-hero w-hero--${heroFit} ${heroPosition ? `w-hero--${heroPosition}` : ''}"
      width="1600"
      height="480"
      sizes="100vw"
      srcset="${srcsetRange.map((width) => html`
        ${hero}?auto=format&fit=max&w=${width} ${width}w,
      `)}"
      src="${hero}"
      alt="${alt}"
    />
  `;
};

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
 * A shortcode for embedding caniuse.com browser compatibility table.
 * @param {string} feature Feature id compatible with caniuse.com.
 * @returns {string}
 */
module.exports = (feature) => {
  // Source: https://caniuse.bitsofco.de/
  return `<picture>
    <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/${feature}.webp">
    <source type="image/png" srcset="https://caniuse.bitsofco.de/image/${feature}.png">
    <img
      src="https://caniuse.bitsofco.de/image/${feature}.jpg"
      width="800px"
      height="410px"
      alt="Data on support for the ${feature} feature across the major browsers from caniuse.com">
    </picture>
  `;
};

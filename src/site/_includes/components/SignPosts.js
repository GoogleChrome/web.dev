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

module.exports = ({postToCollections, url}) => {
  // When @devnook lands her localization work we might need to update this file.
  const strippedUrl = stripLanguage(url).replace(/\//g, "");
  const collections = postToCollections[strippedUrl] || [];
  const aTags = collections.map((collection) => {
    return html`
      <a class="w-post-signpost__link" href="${collection.href}"
        >${collection.title}</a
      >
    `;
  }).join(html`
    <span class="w-post-signpost__divider">|</span>
  `);

  return collections.length === 0
    ? ""
    : html`
        <div class="w-layout-container--narrow w-post-signpost">
          <span class="w-post-signpost__title">Appears in:</span>
          ${aTags}
        </div>
      `;
};

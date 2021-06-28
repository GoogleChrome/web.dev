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
const paths = require('../../_data/paths');
const postToPaths = require('../../_data/postToPaths');
const {i18n, getLocaleFromPath} = require('../../_filters/i18n');

/**
 * @this {EleventyPage}
 */
function SignPosts(slug) {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);

  const postPaths = postToPaths[slug];
  if (!postPaths) {
    return '';
  }
  const aTags = postPaths
    .map((pathName) => {
      return html`<a
        class="w-post-signpost__link"
        href="/${paths[pathName].slug}"
        >${i18n(paths[pathName].title, locale)}</a
      >`;
    })
    .join(html`<span class="w-post-signpost__divider">|</span>`);

  return html`
    <div class="w-layout-container--narrow w-post-signpost">
      <span class="w-post-signpost__title">Appears in:</span>
      ${aTags}
    </div>
  `;
}

module.exports = SignPosts;

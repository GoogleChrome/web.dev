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
const BaseCard = require('./BaseCard');

/**
 * AuthorCard used to preview authors.
 * @param {Object} collectionItem An eleventy collection item with post data.
 * @return {string}
 */
class AuthorCard extends BaseCard {
  constructor(collectionItem) {
    super(collectionItem, 'w-card-author');
  }

  renderThumbnail(_, img, alt) {
    return html`
      <figure class="w-card-base__figure w-card-author__figure">
        <img
          class="w-card-author__image"
          src="${img}"
          alt="${alt}"
          loading="lazy"
        />
      </figure>
    `;
  }
}
module.exports = (args) => new AuthorCard(args).render();

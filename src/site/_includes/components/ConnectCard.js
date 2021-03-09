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
const {Img} = require('./Img');

/**
 * ConnectCard used to present authors you can meet.
 * @param {Object} collectionItem An eleventy collection item with post data.
 * @return {string}
 */
class ConnectCard extends BaseCard {
  constructor(collectionItem) {
    super(collectionItem, 'w-card-author');
  }

  renderThumbnail(_, src, alt) {
    const img = Img({
      src,
      alt,
      width: '192',
      height: '192',
      class: 'w-card-author__image',
    });

    return html`
      <figure class="w-card-base__figure w-card-author__figure">
        ${img}
      </figure>
    `;
  }

  renderSubhead(subhead) {
    if (!subhead) {
      return;
    }

    return html`
      <a class="w-button w-button--primary w-masthead-home__button--primary" href="${this.collectionItem.connect.url}">
        Book a meeting
      </a>
      <a class="w-button w-button--secondary w-masthead-home__button--primary" href="${this.url}">
        Author's Posts
      </a>
    `;
  }

  renderChips() {
    if (!this.collectionItem.connect) return

    return html`
      <div class="w-card__chips w-chips">
        ${this.collectionItem.connect.topics.map((displayedTag) => {
          return html`
            <a class="w-chip">${displayedTag}</a>
          `;
        })}
      </div>
    `;
  }
}
module.exports = (args) => new ConnectCard(args).render();

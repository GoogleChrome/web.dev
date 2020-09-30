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

const path = require('path');
const {html} = require('common-tags');
const md = require('../../_filters/md');
const constants = require('../../_utils/constants');
const getSrcsetRange = require('../../_utils/get-srcset-range');
const tagsCollection = require('../../_collections/tags')();

const AuthorsDate = require('./AuthorsDate');

/* eslint-disable require-jsdoc,indent,max-len */

/**
 * BaseCard used to preview collection items.
 * @param {Object} collectionItem An eleventy collection item with additional data.
 * @param {string} className CSS class to apply to `div.w-card`
 * @param {boolean} featured If card is a featured card.
 * @return {string}
 */
class BaseCard {
  constructor(collectionItem, className = '', featured = false) {
    this.collectionItem = collectionItem;
    this.collectionItem.data = this.collectionItem.data || {};
    this.featured = featured;
    this.className = className;
    this.url = this.collectionItem.data.canonicalUrl;
    this.data = this.collectionItem.data;
    this.displayedTags = [];

    for (const tag of this.data.tags || []) {
      const foundTag = tagsCollection[tag.toLowerCase()];
      if (foundTag) {
        this.displayedTags.push(foundTag);
      }
      if (this.displayedTags.length === constants.POST_CARD_CHIP_COUNT) {
        break;
      }
    }

    // If the post does not provide a thumbnail, attempt to reuse the hero image.
    // Otherwise, omit the image entirely.
    this.thumbnail = this.data.thumbnail || this.data.hero || null;
    this.alt = this.data.alt || '';
  }

  isDraft() {
    return this.data.draft ? 'w-card--draft' : '';
  }

  renderThumbnail(url, img, alt) {
    const imagePath = path.isAbsolute(img) ? img : path.join(url, img);

    const srcsetRange = getSrcsetRange(240, 768);

    return html`
      <figure class="w-card-base__figure">
        <img
          class="w-card-base__image"
          srcset="
            ${srcsetRange.map(
              (width) => html`
                ${imagePath}?auto=format&fit=max&w=${width} ${width}w,
              `,
            )}
          "
          src="${imagePath}"
          alt="${alt}"
          width="100%"
          height="240"
          loading="lazy"
        />
      </figure>
    `;
  }

  renderSubhead(subhead) {
    if (!subhead) {
      return;
    }

    return html`
      <a class="w-card-base__link" tabindex="-1" href="${this.url}">
        <p class="w-card-base__subhead">
          ${md(subhead)}
        </p>
      </a>
    `;
  }

  renderChips() {
    if (!this.displayedTags.length) {
      return;
    }
    return html`
      <div class="w-card__chips w-chips">
        ${this.displayedTags.map((displayedTag) => {
          return html`
            <a class="w-chip" href="${displayedTag.href}"
              >${displayedTag.title}</a
            >
          `;
        })}
      </div>
    `;
  }

  render() {
    const authors = this.collectionItem.data.authors || [];

    // prettier-ignore
    return html`
      <div class="w-card ${this.className} ${this.isDraft()}" role="listitem">
        <article
          class="w-card-base ${this.featured ? 'w-card-base--featured' : ''}"
        >
          <div
            class="w-card-base__cover ${this.thumbnail &&
              'w-card-base__cover--with-image'}"
          >
            <a
              class="w-card-base__link"
              tabindex="-1"
              href="${this.url}"
              aria-hidden="true"
            >
              ${this.thumbnail &&
                this.renderThumbnail(this.url, this.thumbnail, this.alt)}
            </a>
          </div>
          <div class="w-card-base__blurb">
            <a class="w-card-base__link" href="${this.url}">
              <h2
                class="${this.thumbnail
                  ? 'w-card-base__headline--with-image'
                  : 'w-card-base__headline'}"
              >
                ${md(this.data.title)}
              </h2>
            </a>
            ${AuthorsDate({authors, date: this.collectionItem.date})}
            <div
              class="w-card-base__desc ${this.className &&
                `${this.className}__desc`}"
            >
              ${this.renderSubhead(this.data.subhead)}
              ${this.renderChips()}
            </div>
          </div>
        </article>
      </div>
    `;
  }
}

module.exports = BaseCard;

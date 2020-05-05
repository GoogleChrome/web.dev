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
const prettyDate = require('../../_filters/pretty-date');
const stripLanguage = require('../../_filters/strip-language');
const md = require('../../_filters/md');
const constants = require('../../_utils/constants');
const getSrcsetRange = require('../../_utils/get-srcset-range');
const postTags = require('../../_data/postTags');

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
    this.url = stripLanguage(this.collectionItem.url);
    this.data = this.collectionItem.data;
    this.displayedTags = [];

    for (const tag of this.data.tags || []) {
      const foundTag = postTags[tag.toLowerCase()];
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

  renderThumbnail(url, img, alt) {
    const imagePath = path.join(url, img);
    const srcsetRange = getSrcsetRange(240, 768);

    return html`
      <figure class="w-card-base__figure">
        <img
          class="w-card-base__image"
          srcset="${srcsetRange.map(
            (width) => html`
              ${imagePath}?auto=format&fit=max&w=${width} ${width}w,
            `,
          )}"
          src="${imagePath}"
          alt="${alt}"
          width="100%"
          height="240"
          loading="lazy"
        />
      </figure>
    `;
  }

  renderAuthorImages(authors) {
    if (!Array.isArray(authors) || !authors.length || authors.length > 2)
      return;

    return html`
      <div class="w-author__image--row">
        ${authors
          .map((authorId) => {
            const author = this.data.contributors[authorId];
            if (!author) {
              throw new Error(
                `Author '${authorId}' does not exist in '_data/contributors.js'.`,
              );
            }
            return html`
              <div class="w-author__image--row-item">
                <a href="${author.href}">
                  <img
                    class="w-author__image w-author__image--small"
                    src="/images/authors/${authorId}.jpg"
                    alt="${author.title}"
                  />
                </a>
              </div>
            `;
          })
          .reverse()}
      </div>
    `;
  }

  renderAuthorNames(authors) {
    if (!Array.isArray(authors) || !authors.length) return;

    return html`
      <span class="w-author__name">
        ${authors
          .map((authorId) => {
            const author = this.data.contributors[authorId];
            if (!author) {
              throw new Error(
                `Author '${authorId}' does not exist in '_data/contributors.js'.`,
              );
            }
            return html`
              <a class="w-author__name-link" href="/authors/${authorId}"
                >${author.title}</a
              >
            `;
          })
          .join(', ')}
      </span>
    `;
  }

  renderAuthorsAndDate(collectionItem) {
    const authors = collectionItem.data.authors || [];

    return html`
      <div class="w-authors__card">
        ${this.renderAuthorImages(authors)}
        <div>
          ${this.renderAuthorNames(authors)}
          ${this.renderDate(collectionItem.date)}
        </div>
      </div>
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

  renderDate(date) {
    return date
      ? html`
          <div class="w-author__published">
            <time>${prettyDate(date)}</time>
          </div>
        `
      : '';
  }

  render() {
    // prettier-ignore
    return html`
      <div class="w-card ${this.className}" role="listitem">
        <article
          class="w-card-base ${this.featured ? 'w-card-base--featured' : ''}"
        >
          <div
            class="w-card-base__cover ${this.thumbnail &&
              `w-card-base__cover--with-image`}"
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
                  ? `w-card-base__headline--with-image`
                  : `w-card-base__headline`}"
              >
                ${md(this.data.title)}
              </h2>
            </a>
            ${this.renderAuthorsAndDate(this.collectionItem)}
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

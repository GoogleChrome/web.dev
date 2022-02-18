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

/**
 * @fileoverview Provides helper to render an authors card and optional date
 * (literally a YYYY-MM-DD date, not a timestamp), and with potentially zero to
 * many authors.
 */

const {html} = require('common-tags');
const {Img} = require('./Img');
const prettyDate = require('../../_filters/pretty-date');
const {i18n} = require('../../_filters/i18n');
const authorsCollectionFn = require('../../_collections/authors');
const {defaultLocale} = require('../../_data/site');

/**
 *
 * @param {string} locale
 * @param {Date} date
 * @param {Date} [updated]
 * @returns {string}
 */
const renderDate = (locale, date, updated) => {
  // prettier-ignore
  return html`
      <time>${(+updated) ? `${i18n('i18n.common.updated', locale)}: ${prettyDate(updated)}` : prettyDate(date)}</time>
    `;
};

/**
 *
 * @param {number} limit
 * @param {Array<TODO>} pairs
 * @returns {string|string[]}
 */
const renderAuthorImages = (limit, pairs) => {
  if (!pairs.length || pairs.length > limit) {
    return ''; // don't render images if we have none, or too many
  }

  return pairs.map(({info}) => {
    const img = Img({
      src: info.image,
      alt: info.title,
      width: '40',
      height: '40',
      class: '',
      params: {
        fit: 'crop',
        h: '40',
        w: '40',
      },
    });
    return html` <a class="avatar" href="${info.href}">${img}</a> `;
  });
};

const renderAuthorNames = (pairs) => {
  if (!pairs.length) {
    return; // don't render if no authors
  }

  // prettier-ignore
  return html`
      <div
        class="card__authors flow-space-base"
        aria-label="authors"
      >
        ${pairs.map(({info}) => `<a href="${info.href}">${info.title}</a>`).join(', ')}
      </div>
    `;
};

/**
 * Render an authors card, including any number of authors and an optional date.
 *
 * @param {{authors?: string[], date?: Date, images?: number, updated?: Date, locale?: string}} arg
 * @param {Authors} [authorsCollection]
 * @return {string}
 */
function renderAuthorsDate(
  {authors, date, images = 2, updated, locale = defaultLocale},
  authorsCollection = authorsCollectionFn(),
) {
  const pairs = (authors || []).map((id) => {
    const author = authorsCollection[id];
    if (!author) {
      throw new Error(
        `Can't create Author component for "${id}" without author ` +
          `information. Please check '_data/authorsData.json' and make sure the ` +
          `author you provide is a key in this object.`,
      );
    }
    const title = i18n(author.title, locale);
    if (!title) {
      throw new Error(
        `Can't create Author "${id}" with missing title. ` +
          `Please check '_data/authorsData.json' and make sure the ` +
          `author has a title.`,
      );
    }

    return {
      id,
      info: {
        ...author,
        title,
      },
    };
  });

  return html`
    <div class="card__avatars cluster color-mid-text">
      ${renderAuthorImages(images, pairs)}
      <div class="flow flow-space-size-0">
        ${renderAuthorNames(pairs)} ${renderDate(locale, date, updated)}
      </div>
    </div>
  `;
}

module.exports = renderAuthorsDate;

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
const authorsCollectionFn = require('../../_collections/authors');
const prettyDate = require('../../_filters/pretty-date');
const {i18n} = require('../../_filters/i18n');

/**
 *
 * @param {string} locale
 * @param {Date} date
 * @param {Date} [updated]
 * @returns {string}
 */
const renderDate = (locale, date, updated) => {
  let result = '';

  // nb. +date checks for valid dates, not just non-null dates
  if (+updated) {
    result += html`
      <div class="w-author__updated">
        <time
          >${i18n('i18n.common.updated', locale)}: ${prettyDate(updated)}</time
        >
      </div>
    `;
  } else if (+date) {
    result += html`
      <div class="w-author__published">
        <time>${prettyDate(date)}</time>
      </div>
    `;
  }
  return result;
};

/**
 *
 * @param {number} limit
 * @param {Array<TODO>} pairs
 * @returns {string}
 */
const renderAuthorImages = (limit, pairs) => {
  if (!pairs.length || pairs.length > limit) {
    return ''; // don't render images if we have none, or too many
  }

  const inner = pairs
    .map(({info}) => {
      const img = Img({
        src: info.image,
        alt: info.title,
        width: '40',
        height: '40',
        class: 'w-author__image w-author__image--small',
        params: {
          fit: 'crop',
          h: '40',
          w: '40',
        },
      });
      return html`
        <div class="w-author__image--row-item">
          <a href="${info.href}">${img}</a>
        </div>
      `;
    })
    .reverse();

  return html` <div class="w-author__image--row">${inner}</div> `;
};

const renderAuthorNames = (pairs) => {
  if (!pairs.length) {
    return; // don't render if no authors
  }

  const inner = pairs
    .map(({info}) => {
      return html`
        <a class="w-author__name-link" href="${info.href}">${info.title}</a>
      `;
    })
    .join(', ');

  return html` <span class="w-author__name">${inner}</span> `;
};

/**
 * Render an authors card, including any number of authors and an optional date.
 *
 * @param {{authors: Array<string>, date?: Date, images?: number, updated?: Date, locale: string}} arg
 * @param {Authors} [authorsCollectionArg]
 * @return {string}
 */
const renderAuthorsDate = (
  {authors, date, images = 2, updated, locale},
  authorsCollectionArg,
) => {
  const authorsCollection = authorsCollectionArg
    ? authorsCollectionArg
    : authorsCollectionFn();
  const pairs = (authors || []).map((id) => {
    const info = authorsCollection[id];
    if (!info) {
      throw new Error(
        `Can't create Author component for "${id}" without author ` +
          `information. Please check '_data/authorsData.json' and make sure the ` +
          `author you provide is a key in this object.`,
      );
    }

    if (!info.title) {
      throw new Error(
        `Can't create Author with missing 'title'. author object: ${JSON.stringify(
          info,
        )}`,
      );
    }

    return {
      id,
      info,
    };
  });

  return html`
    <div class="w-authors__card">
      ${renderAuthorImages(images, pairs)}
      <div class="w-authors__card--holder">
        ${renderAuthorNames(pairs)} ${renderDate(locale, date, updated)}
      </div>
    </div>
  `;
};

module.exports = renderAuthorsDate;

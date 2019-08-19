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
const site = require('../../_data/site');
require('intl-list-format');
require('intl-list-format/locale-data/en');

/* eslint-disable require-jsdoc,max-len */

/**
 * An actions wrapper. This element handles the fixed positioning of the
 * floating action buttons and spacing them if there is more than one.
 * @param {*} children
 * @return {string}
 */
const Actions = (children) =>
  html`
    <div class="w-actions">${children}</div>
  `;

/**
 * A Floating Action Button (FAB) to perform a share on Twitter action.
 * @param {string} title The page title to Tweet.
 * @param {string} url The URL to share. This will look like '/some-post'
 * because eleventy doesn't attach the domain or protocol.
 * @param {array} authors Authors of the page.
 * @return {string}
 */
const ShareAction = (title, url, authors = []) => {
  if (!title) {
    throw new Error(`Can't create ShareButton without a title.`);
  }

  if (!url) {
    throw new Error(`Can't create ShareButton without a url.`);
  }

  const twitter = `https://twitter.com/share`;
  const encodedText = encodeURIComponent(`${title}${by(authors)}`);
  const encodedUrl = encodeURIComponent(`${site.url}${url}`);

  return html`
    <a
      class="w-actions__fab w-actions__fab--share gc-analytics-event"
      data-category="web.dev"
      data-label="share, twitter"
      data-action="click"
      href="${twitter}?text=${encodedText}&amp;url=${encodedUrl}"
      onclick="window.open(this.href, 'share-twitter', 'width=550,height=235');return false;"
    >
      <span>Share</span>
    </a>
  `;
};

const by = (authors) => {
  const screenNames = authors.map((author) => author.twitter)
    .filter(Boolean)
    .map((author) => `@${author}`);
  if (screenNames.length) {
    const il = new Intl.ListFormat('en');
    return ` by ${il.format(screenNames)}`;
  }
  return '';
};

const SubscribeAction = () => {
  return html`
    <a
      class="w-actions__fab w-actions__fab--subscribe gc-analytics-event"
      data-category="web.dev"
      data-label="subscribe, newsletter"
      data-action="click"
      href="${site.subscribe}"
    >
      <span>Subscribe</span>
    </a>
  `;
};

module.exports = {Actions, ShareAction, SubscribeAction};

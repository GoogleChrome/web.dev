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

const path = require('path');
const {html} = require('common-tags');
const site = require('../../_data/site');

/* eslint-disable require-jsdoc,max-len */

/**
 * An actions wrapper. This element handles the fixed positioning of the
 * floating action buttons and spacing them if there is more than one.
 * @param {*} children
 * @return {string}
 */
const Actions = (children) =>
  html`
    <web-actions-controller></web-actions-controller>
    <div class="w-actions">${children}</div>
  `;

/**
 * A Floating Action Button (FAB) to perform a share on Twitter action.
 * @param {string} title The page title to Tweet.
 * @param {string} url The URL to share. This will look like '/some-post'
 * because eleventy doesn't attach the domain or protocol.
 * @return {string}
 */
const ShareAction = (title, url) => {
  if (!title) {
    throw new Error(`Can't create ShareButton without a title.`);
  }

  if (!url) {
    throw new Error(`Can't create ShareButton without a url.`);
  }

  const twitter = `https://twitter.com/share`;
  const encodedText = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(path.join(site.url, url));

  return html`
    <a
      class="w-actions__fab w-actions__fab--share"
      href="${twitter}?text=${encodedText}&amp;url=${encodedUrl}"
      onclick="window.open(this.href, 'share-twitter', 'width=550,height=235');return false;"
    >
      <span>Share</span>
    </a>
  `;
};

const SubscribeAction = () => {
  return html`
    <a
      class="w-actions__fab w-actions__fab--subscribe"
      href="${site.subscribe}"
    >
      <span>Subscribe</span>
    </a>
  `;
};

module.exports = {Actions, ShareAction, SubscribeAction};

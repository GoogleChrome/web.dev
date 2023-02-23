/*
 * Copyright 2023 Google LLC
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
const {findByUrl} = require('../../_filters/find-by-url');

/**
 * @fileoverview A component to display an interactive demo,
 * as an iframe embed.
 */

/**
 * @param {string} demoUrl Url of the demo to be displayed. It can be
 *   an external url, or a deep url on web.dev, .e.g. /demos/my-demo-name.
 * @param {string} height Optional height of the widget with units, e.g. 100px.
 */
module.exports = function (demoUrl, height) {
  let url;
  try {
    // Check if it's external url.
    const externalUrl = new URL(demoUrl);
    url = externalUrl.href;
  } catch (e) {
    // Otherwise, check if internal url exists.
    url = path.join('/', demoUrl, '/');
    if (!findByUrl(url)) {
      return '';
    }
  }

  return `<div class="widget">
      <iframe
        src="${url}"
        title="Demo"
        height="${height}"
        loading="lazy"
        width="100%"
        scrolling="no"></iframe>
        <div class="widget__actions">
          <a
            href="${url}"
            target="_blank"
            class="code-pattern__icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </a>
          <share-action class="gc-analytics-event code-pattern__icon"
            data-category="web.dev"
            data-label="share"
            data-action="click"
            data-type="primary"
            data-icon="share"
            tabindex="0"
            role="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 16.1c-.8 0-1.4.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7L16 7.2c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .2 0 .5.1.7L8 9.8C7.5 9.3 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.4-.1.6 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9-1.2-2.9-2.8-2.9z" fill="currentColor"/></svg>
          </share-action>
    </div>
  </div>`;
};

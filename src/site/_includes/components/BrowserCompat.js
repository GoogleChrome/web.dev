/*
 * Copyright 2021 Google LLC
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
const bcd = require('../../_utils/browserCompat');
const {i18n, getLocaleFromPath} = require('../../_filters/i18n');

const browsers = ['chrome', 'firefox', 'edge', 'safari'];

/**
 * A shortcode for embedding caniuse.com browser compatibility table.
 * @this {EleventyPage}
 * @param {string} feature Feature id compatible with caniuse.com.
 */
async function BrowserCompat(feature) {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);
  const data = await bcd();
  let compatIcons = [];

  if (data[feature] && data[feature].support) {
    compatIcons = browsers.map((browser) => {
      const support = data[feature].support[browser];
      const isSupported = support.version_added && !support.version_removed;
      const version = isSupported ? support.version_added : '\u00D7';
      const ariaVersion = isSupported ? 'Version' + version : 'Not supported';
      return `<span
        class="browser-compat__icon browser-compat--${browser}"
        aria-label="${browser}">
      </span>
      <span class="browser-compat__version browser-compat--${isSupported}"
        aria-label="${ariaVersion}">
        ${version}
      </span>
      `;
    });
    const source = data[feature].mdn_url;
    const sourceLabel = i18n(`i18n.browser_compat.source`, locale);
    const sourceLink = source
      ? `<span class="browser-compat__link">
        <a href="${source}" target="_blank">${sourceLabel}</a>
      </span>`
      : '';
    const supportLabel = i18n(`i18n.browser_compat.browser_support`, locale);
    return `<div class="browser-compat">
      <span>${supportLabel}</span>
      ${compatIcons.join('')}
      ${sourceLink}
    </div>
    `;
  }

  return '';
}

module.exports = BrowserCompat;

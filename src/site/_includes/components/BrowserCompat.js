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
 * @param {import('@mdn/browser-compat-data/types').SimpleSupportStatement} support
 * @returns {string}
 */
const compatVersion = (support) => {
  if (!support.version_removed && support.version_added === 'preview') {
    return '\uD83D\uDC41'; // 👁 eye
  } else if (
    !support.version_removed &&
    typeof support.version_added === 'string'
  ) {
    return support.version_added;
  } else {
    return '\u00D7'; // × small x
  }
};

/**
 * @param {import('@mdn/browser-compat-data/types').SimpleSupportStatement} support
 * @returns {string}
 */
const compatProperty = (support) => {
  if (!support.version_removed && support.version_added === 'preview') {
    return 'preview';
  } else if (!support.version_removed && support.version_added) {
    return 'yes';
  } else {
    return 'no';
  }
};

/**
 * @param {import('@mdn/browser-compat-data/types').SimpleSupportStatement} support
 * @param {string} locale
 * @returns {string}
 */
const compatAria = (support, locale) => {
  if (!support.version_removed && support.version_added === 'preview') {
    return i18n('i18n.browser_compat.preview', locale);
  } else if (!support.version_removed && support.version_added) {
    return i18n('i18n.browser_compat.supported', locale);
  } else {
    return i18n('i18n.browser_compat.not_supported', locale);
  }
};
/**
 * A shortcode for embedding caniuse.com browser compatibility table.
 * @this {EleventyPage}
 * @param {string} feature Feature id compatible with caniuse.com.
 */
function BrowserCompat(feature) {
  const locale = getLocaleFromPath(this.page && this.page.filePathStem);
  const data = bcd();
  let compatIcons = [];

  if (data[feature] && data[feature].support) {
    compatIcons = browsers.map((browser) => {
      /** @type {import('@mdn/browser-compat-data/types').SimpleSupportStatement} */
      const support = Array.isArray(data[feature].support[browser])
        ? data[feature].support[browser][0]
        : data[feature].support[browser];

      const isSupported = support.version_added && !support.version_removed;

      const ariaLabel = [
        browser,
        isSupported ? ` ${support.version_added}, ` : ', ',
        compatAria(support, locale),
      ].join('');

      return `<span class="browser-compat__icon" data-browser="${browser}">
          <span class="visually-hidden">${ariaLabel}</span>
      </span>
      <span class="browser-compat__version"
        data-compat="${compatProperty(support)}"
      >
        ${compatVersion(support)}
      </span>
      `;
    });
    const source = data[feature].mdn_url;
    const sourceLabel = i18n(`i18n.browser_compat.source`, locale);
    const sourceLink = source
      ? `<span class="browser-compat__link">
        <a href="${source}#browser_compatibility" target="_blank">
          ${sourceLabel}
        </a>
      </span>`
      : '';
    const supportLabel = i18n(`i18n.browser_compat.browser_support`, locale);
    return `<div class="browser-compat">
      <span class="browser-compat__label">${supportLabel}:</span>
      <span class="browser-compat__items"
        >${compatIcons.join('')}</span>${sourceLink}
    </div>
    `;
  }

  return '';
}

module.exports = BrowserCompat;

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
 * @param {import('@mdn/browser-compat-data/types').StatusBlock} status
 * @returns {{aria: string, compatProperty: string, icon: string}}}
 */
function getInfoFromSupportStatement(support, status, locale) {
  if (status && status.deprecated) {
    return {
      aria: i18n('i18n.browser_compat.deprecated', locale),
      compatProperty: 'deprecated',
      icon: '🗑',
    };
  }

  if (!support.version_removed) {
    if (support.version_added === 'preview') {
      return {
        aria: i18n('i18n.browser_compat.preview', locale),
        compatProperty: 'preview',
        icon: '👁',
      };
    }

    if (support.flags?.length > 0) {
      return {
        aria: i18n('i18n.browser_compat.flag', locale),
        compatProperty: 'flag',
        icon: '⚑',
      };
    }

    if (typeof support.version_added === 'string') {
      return {
        aria: i18n('i18n.browser_compat.supported', locale),
        compatProperty: 'yes',
        icon: support.version_added,
      };
    }

    // See https://github.com/GoogleChrome/web.dev/issues/8333
    if (support.version_added === true) {
      return {
        aria: i18n('i18n.browser_compat.supported', locale),
        compatProperty: 'yes',
        icon: '✅',
      };
    }
  }

  return {
    aria: i18n('i18n.browser_compat.not_supported', locale),
    compatProperty: 'no',
    icon: '×',
  };
}

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

      const supportInfo = getInfoFromSupportStatement(
        support,
        data[feature].status,
        locale,
      );

      const isSupported = support.version_added && !support.version_removed;

      const ariaLabel = [
        browser,
        isSupported ? ` ${support.version_added}, ` : ', ',
        supportInfo.aria,
      ].join('');

      return `<span class="browser-compat__icon" data-browser="${browser}">
          <span class="visually-hidden">${ariaLabel}</span>
      </span>
      <span class="browser-compat__version"
        data-compat="${supportInfo.compatProperty}"
      >
        ${supportInfo.icon}
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

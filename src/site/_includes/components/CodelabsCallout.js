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

const {defaultLanguage} = require('../../../lib/utils/language');
const {findByUrl} = require('../../_filters/find-by-url');
const md = require('../../_filters/md');

/**
 * Find matching collection items given a language code.
 *
 * @param {string[]} slugs
 * @param {string} lang
 * @returns {EleventyCollectionItem[]}
 */
function filterCodelabsByLang(slugs, lang) {
  return slugs
    .map((slug) => findByUrl(`/${lang}/${slug}/`))
    .filter((item) => item); // filter out any undefined entries
}

/**
 * Generates codelab links HTML.
 *
 * @param {string[]|string} slugs
 * @param {string} lang
 * @returns {string}
 */
function CodelabsCallout(slugs, lang) {
  // Coerce slugs to Array just in case someone pasted in a single slug string.
  slugs = slugs instanceof Array ? slugs : [slugs];

  let codelabs = filterCodelabsByLang(slugs, lang);
  // If there's no language-specific codelab, returning the default (English)
  // language one is preferable.
  if (codelabs.length === 0) {
    codelabs = filterCodelabsByLang(slugs, defaultLanguage);
  }
  // If there's still no codelabs found, return an empty string (not undefined).
  if (codelabs.length === 0) {
    return '';
  }

  return `
      <aside class="callout bg-quaternary-box-bg color-quaternary-box-text">
        <div class="auto-grid">
          <div class="callout__content flow">
            <div class="callout__branding cluster gutter-base">
              <!-- icons/code.svg -->
              <svg width="24" height="24" fill="currentColor" aria-label="Code brackets" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.41 16.59 8 18l-6-6 6-6 1.41 1.41L4.83 12l4.58 4.59zm5.18-9.18L16 6l6 6-6 6-1.41-1.41L19.17 12l-4.58-4.59z"/></svg>
              Codelabs
            </div>
            <h2 class="callout__title">See it in action</h2>
            <p>Learn more and put this guide into action.</p>
          </div>
          <nav class="callout__links repel" aria-label="Codelabs links">
            <ul role="list">
              ${codelabs.map(CodelabsCallout.renderCodelab).join('')}
            </ul>
          </nav>
        </div>
      </aside>
    `;
}

/**
 * @param {EleventyCollectionItem} codelab
 * @returns {string}
 */
CodelabsCallout.renderCodelab = function (codelab) {
  const svg = html`<svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m8 7.34 4.58 4.365L8 16.07l1.41 1.34 6-5.705L9.41 6 8 7.34Z" />
  </svg>`;
  return html`
    <li>
      <a href="${codelab.url}">
        <span>${md(codelab.data.title)}</span>
        ${svg}
      </a>
    </li>
  `;
};

module.exports = CodelabsCallout;

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

// Need markdown-it for nested shortcodes to render as expected
const md = require('markdown-it')();
const {html} = require('common-tags');

/* eslint-disable max-len */

/**
 * Render a Details panel preview as an HTML string.
 * @param {string[]} contentArr Array of content split at new lines.
 * @return {string}
 */
function renderPreview(contentArr) {
  if (!contentArr.length) return '';

  const preview = contentArr.join('\n');

  return html`<p class="w-details__preview">${md.renderInline(preview)}</p>`;
}

module.exports = (content, headingLevel = 'h2') => {
  const validLevels = ['h2', 'h3', 'h4', 'h5', 'h6', 'p'];

  if (!validLevels.includes(headingLevel)) {
    throw new Error(
      'Invalid heading level for Details component. Use h2, h3, h4, h5, h6, or p.',
    );
  }

  const contentArr = content.trim().split('\n');
  const heading = contentArr.shift();

  // Has to be on one line to keep whitespace out of the heading element
  return html`
    <summary class="w-details__summary">
      <${headingLevel} class="w-details__header">
        ${md.renderInline(heading)}
      </${headingLevel}>
      ${renderPreview(contentArr)}
    </summary>
  `;
};

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
const isDesignSystemContext = require('../../../lib/utils/is-design-system-context');

/* NOTE: This component is in a transition period to support both new design system contexts
and the existing system. Once the new design system has been *fully* rolled out, this component
can be cleaned up with the following:

1. The isDesignSystemContext conditional can be removed and code in that block should run as normal
2. Everything from the '/// DELETE THIS WHEN ROLLOUT COMPLETE' comment *downwards* can be removed
*/

/* eslint-disable max-len */

/**
 * Render a Details panel preview as an HTML string.
 * @param {string[]} contentArr Array of content split at new lines.
 * @param {string} classNames String of CSS class names that are applied to summary
 * @return {string}
 */
function renderPreview(contentArr, classNames = 'w-details__preview') {
  if (!contentArr.length) return '';

  const preview = contentArr.join('\n');

  return html`<p class="${classNames}">${md.renderInline(preview)}</p>`;
}

function DetailsSummary(content, headingLevel = 'h2') {
  const validLevels = ['h2', 'h3', 'h4', 'h5', 'h6', 'p'];

  if (!validLevels.includes(headingLevel)) {
    throw new Error(
      'Invalid heading level for Details component. Use h2, h3, h4, h5, h6, or p.',
    );
  }

  const contentArr = content.trim().split('\n');
  const heading = contentArr.shift();

  if (isDesignSystemContext(this.page.filePathStem)) {
    return html`
      <summary>
        ${md.renderInline(heading)}
        ${renderPreview(contentArr, 'text-base color-core-text gap-top-base')}
      </summary>
    `;
  }

  /// DELETE THIS WHEN ROLLOUT COMPLETE

  // Has to be on one line to keep whitespace out of the heading element
  return html`
    <summary class="w-details__summary">
      <${headingLevel} class="w-details__header">
        ${md.renderInline(heading)}
      </${headingLevel}>
      ${renderPreview(contentArr)}
    </summary>
  `;
}

module.exports = DetailsSummary;

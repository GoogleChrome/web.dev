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
const {findByUrl} = require('../../_filters/find-by-url');
const md = require('../../_filters/md');
const isDesignSystemContext = require('../../../lib/utils/is-design-system-context');

/* NOTE: This component is in a transition period to support both new design system contexts
and the existing system. Once the new design system has been *fully* rolled out, this component
can be cleaned up with the following:

1. The isDesignSystemContext conditional can be removed and code in that block should run as normal
2. Everything from the '/// DELETE THIS WHEN ROLLOUT COMPLETE' comment *downwards* can be removed
*/

/* eslint-disable require-jsdoc */

function CodelabCallout(slugs, lang) {
  // Coerce slugs to Array just in case someone pasted in a single slug string.
  slugs = slugs instanceof Array ? slugs : [slugs];

  const codelabs = slugs
    .map((slug) => findByUrl(`/${lang}/${slug}/`))
    .filter((item) => item); // filter out any undefined entries

  if (!codelabs.length) {
    return;
  }

  /// UN-FENCE CODE IN THIS BLOCK WHEN ROLLOUT COMPLETE
  // prettier-ignore
  if (isDesignSystemContext(this.page.filePathStem)) {
    return `
      <aside class="callout bg-quaternary-box-bg color-quaternary-box-text">
        <div class="repel">
          <div class="callout__content flow">
            <div class="callout__branding cluster gutter-base">
              <!-- icons/code.svg -->
              <svg width="24" height="24" fill="currentColor" aria-label="Code brackets" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.41 16.59 8 18l-6-6 6-6 1.41 1.41L4.83 12l4.58 4.59zm5.18-9.18L16 6l6 6-6 6-1.41-1.41L19.17 12l-4.58-4.59z"/></svg>
              Codelabs
            </div>
            <h2 class="callout__title">See it in action</h2>
            <p>Learn more and put this guide into action.</p>
          </div>
          <nav class="callout__links" aria-label="Codelabs links">
            <ul role="list">
              ${codelabs.map(codelab => html`
                <li>
                  <a href="${codelab.url}">
                    <span>${md(codelab.data.title)}</span>
                    <!-- icons/carat-forward.svg -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="m8 7.34 4.58 4.365L8 16.07l1.41 1.34 6-5.705L9.41 6 8 7.34Z"/></svg>
                  </a>
                </li>
              `).join('')}
            </ul>
          </nav>
        </div>
      </aside>
    `
  }

  /// DELETE THIS WHEN ROLLOUT COMPLETE
  function renderCodelab(codelab) {
    return html`
      <li class="w-callout__listitem">
        <a
          class="w-callout__link w-callout__link--codelab"
          href="${codelab.url}"
        >
          ${md(codelab.data.title)}
        </a>
      </li>
    `;
  }

  return html`
    <div class="w-callout w-callout--2col">
      <div class="w-callout__header">
        <h2 class="w-callout__lockup w-callout__lockup--codelab">Codelabs</h2>
        <div class="w-callout__headline">See it in action</div>
        <div class="w-callout__blurb">
          Learn more and put this guide into action.
        </div>
      </div>
      <ul class="w-unstyled-list w-callout__list">
        ${codelabs.map(renderCodelab)}
      </ul>
    </div>
  `;
}

module.exports = CodelabCallout;

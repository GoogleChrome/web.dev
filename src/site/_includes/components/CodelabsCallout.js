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

/* eslint-disable require-jsdoc */

module.exports = (slugs, lang) => {
  // Coerce slugs to Array just in case someone pasted in a single slug string.
  slugs = slugs instanceof Array ? slugs : [slugs];

  const codelabs = slugs.map((slug) => findByUrl(`/${lang}/${slug}/`));
  if (!codelabs.length) {
    /* eslint-disable-next-line */
    console.warn(`Did not find any matching codelabs.`);
    return;
  }

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
};

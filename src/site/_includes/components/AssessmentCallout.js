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

const {html} = require("common-tags");

/* eslint-disable require-jsdoc, max-len */
module.exports = (content, blurb) => {
  // Need newlines around ${content} so MD parser renders it as MD, not HTML
  // prettier-ignore
  return html`
    <details class="w-callout w-callout--collapsible" open>
      <summary class="w-callout__header">
        <h2 class="w-callout__lockup w-callout__lockup--collapsible w-callout__lockup--assess">
          Check for understanding
          <span class="w-callout__toggle">
            <span class="w-tooltip w-tooltip--right">Toggle callout</span>
          </span>
        </h2>
        <div class="w-callout__blurb w-callout__blurb--open">
          ${blurb}
        </div>
        <div class="w-callout__blurb w-callout__blurb--collapsed">
          Expand this callout to practice concepts from the post.
        </div>
      </summary>

      ${content}

    </details>
  `;
};

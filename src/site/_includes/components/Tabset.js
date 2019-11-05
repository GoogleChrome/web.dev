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

/* eslint-disable max-len */

module.exports = (content, type = "info") => {
  return html`
    <div class="w-tabset" role="tablist">
      <button
        class="w-tabset__tab"
        active
        role="tab"
        aria-selected="true"
        id="w-tab-1"
        aria-controls="w-tab-1-pane"
      >
        <span class="w-tabset__text-label">Sample 1</span>
      </button>
      <button
        class="w-tabset__tab"
        role="tab"
        aria-selected="false"
        tabindex="-1"
        id="w-tab-2"
        aria-controls="w-tab-2-pane"
      >
        <span class="w-tabset__text-label">Sample 2</span>
      </button>
      <button
        class="w-tabset__tab"
        role="tab"
        aria-selected="false"
        tabindex="-1"
        id="w-tab-3"
        aria-controls="w-tab-3-pane"
      >
        <span class="w-tabset__text-label">Sample 3</span>
      </button>
      ${content}
    </div>
  `;
};

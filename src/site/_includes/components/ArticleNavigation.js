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
const md = require('markdown-it')();

module.exports = ({back, backLabel}) => {
  function renderBack(link, label) {
    return html`
      <a
        class="w-article-navigation__link w-article-navigation__link--back
          w-article-navigation__link--single gc-analytics-event"
        data-category="web.dev"
        data-label="navigation, go back"
        data-action="click"
        href="${link}"
      >
        ${md.renderInline(label)}
      </a>
    `;
  }

  return html`
    <nav class="w-article-navigation">
      ${back && backLabel && renderBack(back, backLabel)}
    </nav>
  `;
};

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

module.exports = (content, type) => {
  let label;
  switch (type) {
    case 'worse':
      label = 'Not recommended';
      break;

    case 'better':
      label = 'Recommended';
      break;

    default:
      break;
  }

  if (!label) {
    /* eslint-disable max-len */
    throw new Error(
      `Can't create compare component without a type. Did you forget to pass the type as a string?`
    );
    /* eslint-enable max-len */
  }

  // Add an em dash to separate the content from the label.
  content = ' — ' + content;

  return html`
    <div class="w-compare">
      <span class="w-compare__label w-compare__label--${type}">
        ${label}
      </span>
      ${content}
    </div>
  `;
};

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

const md = require('markdown-it')({
  html: true, // Allow full links, e.g. with _target=blank.
});

function Banner(content, type = 'info') {
  let utilityClasses = 'bg-state-info-bg color-core-text';

  switch (type) {
    case 'caution':
      utilityClasses = 'bg-state-bad-bg color-core-text';
      break;
    case 'warning':
      utilityClasses = 'bg-state-warn-bg color-core-text';
      break;
  }

  return `<div role="banner" class="banner ${utilityClasses}">
  <div class="banner__content flow">
    ${md.renderInline(content)}
    <span data-banner-close-btn>Dismiss</span>
  </div>
  </div>`;
}

module.exports = Banner;

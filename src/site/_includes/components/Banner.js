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
const md = require('markdown-it')({
  html: true, // Allow full links, e.g. with _target=blank.
});

const isDesignSystemContext = require('../../../lib/utils/is-design-system-context');

/* NOTE: This component is in a transition period to support both new design system contexts
and the existing system. Once the new design system has been *fully* rolled out, this component
can be cleaned up with the following:

1. The isDesignSystemContext conditional can be removed and code in that block should run as normal
2. Everything from the '/// DELETE THIS WHEN ROLLOUT COMPLETE' comment *downwards* can be removed
*/

function Banner(content, type = 'info', location) {
  if (isDesignSystemContext(this.page.filePathStem)) {
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
    </div>
    </div>`;
  }

  /// DELETE THIS WHEN ROLLOUT COMPLETE
  const locationOverride = location === 'body' ? 'w-banner--body' : '';

  return html`
    <div role="banner" class="w-banner w-banner--${type} ${locationOverride}">
      ${md.renderInline(content)}
    </div>
  `;
}

module.exports = Banner;

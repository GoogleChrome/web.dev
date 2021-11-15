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

const isDesignSystemContext = require('../../../lib/utils/is-design-system-context');

/* NOTE: This component is in a transition period to support both new design system contexts
and the existing system. Once the new design system has been *fully* rolled out, this component
can be cleaned up with the following:

1. The isDesignSystemContext conditional can be removed and code in that block should run as normal
2. Everything from the '/// DELETE THIS WHEN ROLLOUT COMPLETE' comment *downwards* can be removed
*/

/**
 * @param {string} content Markdown with the content for the compare element.
 * @return {string}
 */
function CompareCaption(content) {
  // Whitespace is intentional to allow markdown parser to kick back in.
  if (isDesignSystemContext(this.page.filePathStem)) {
    return `<figcaption class="compare__caption">
${content}</figcaption>`;
  }

  // Whitespace is intentional to allow markdown parser to kick back in.
  return `<figcaption class="w-compare__caption">

${content}</figcaption>`;
}

module.exports = CompareCaption;

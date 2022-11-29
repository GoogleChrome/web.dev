/*
 * Copyright 2022 Google LLC
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

/**
 * Prerender by adding Speculation Rules JSON
 * Also adds a GA event so can see how many prerender attempts were made
 * versus prerender navigations.
 * @param {string} url The url to prerender
 * @returns {string}
 */
module.exports = (url) => {
  // Only prerender internal URLs
  if (
    !url ||
    url.toString().startsWith('http://') ||
    url.toString().startsWith('https://')
  ) {
    return '';
  }

  // Only prerender if browser supports speculationrules
  // and not in SaveData mode (Chrome should exclude SaveData
  // browser anyway, but no harm double checking)
  return html`
    <script type="speculationrules">
      {
        "prerender": [
          {
            "source": "list",
            "urls": ["${url}"]
          }
        ]
      }
    </script>
  `;
};

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

module.exports = (content, type, twoColumns = false, prefix) => {
  if (!type) {
    /* eslint-disable max-len */
    throw new Error(
      `Can't create SelectGroup component without a type. Did you forget to pass either "radio" or "checkbox" as the type?`,
    );
    /* eslint-enable max-len */
  }

  if (twoColumns != true && twoColumns != false) {
    /* eslint-disable max-len */
    throw new Error(
      `The columns parameter for the SelectGroup component can only be set to true or false.`,
    );
    /* eslint-enable max-len */
  } else if (twoColumns === true) {
    twoColumns = "columns";
  }

  if (prefix) {
    prefix = "prefix='" + prefix + "'";
  }

  // prettier-ignore
  return html`
    <web-select-group type="${type}" ${twoColumns} ${prefix}>
    ${content}
    </web-select-group>
  `;
};

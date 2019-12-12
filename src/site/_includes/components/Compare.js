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

/* eslint-disable require-jsdoc */

module.exports = (content, type, labelOverride) => {
  if (!type) {
    /* eslint-disable max-len */
    throw new Error(
      `Can't create Compare component without a type. Did you forget to pass the type as a string?`,
    );
    /* eslint-enable max-len */
  }

  let label = labelOverride || "";
  if (!label) {
    switch (type) {
      case "worse":
        label = "Don't";
        break;

      case "better":
        label = "Do";
        break;

      default:
        break;
    }
  }

  return html`
    <figure class="w-compare">
      <p class="w-compare__label w-compare__label--${type}">
        ${label}
      </p>
      ${content}
    </figure>
  `;
};

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

module.exports = (content, cardinality, twoColumns = false) => {
  /* eslint-disable max-len */
  if (!cardinality) {
    throw new Error(
      `Can't create ResponseMultipleChoice component without a cardinality. Did you forget to pass the cardinality as a string?`,
    );
  } else if (
    !/^\d+$/.test(cardinality) &&
    !/^\d+\+$/.test(cardinality) &&
    !/^\d-\d+$/.test(cardinality)
  ) {
    throw new Error(
      `The cardinality value for the ResponseMultipleChoice component must be n, n+, or n-m.`,
    );
  }
  /* eslint-enable max-len */

  if (twoColumns != true && twoColumns != false) {
    /* eslint-disable max-len */
    throw new Error(
      `The columns value for the ResponseMultipleChoice component must be true or false.`,
    );
    /* eslint-enable max-len */
  } else if (twoColumns === true) {
    twoColumns = "columns";
  }

  // prettier-ignore
  return html`
    <web-response-mc cardinality="${cardinality}" ${twoColumns}>
    ${content}
    </web-response-mc>
  `;
};

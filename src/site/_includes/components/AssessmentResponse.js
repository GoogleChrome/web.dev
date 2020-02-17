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

module.exports = (
  content,
  type,
  cardinality,
  correctAnswers,
  twoColumns = false,
) => {
  if (!type) {
    throw new Error(
      `Can't create AssessmentResponse component without a type. Did you forget to pass the type as a string?`,
    );
  }

  if (
    cardinality &&
    !/^\d+$/.test(cardinality) &&
    !/^\d+\+$/.test(cardinality) &&
    !/^\d-\d+$/.test(cardinality)
  ) {
    throw new Error(
      `The cardinality value for the AssessmentResponse component must be n, n+, or n-m.`,
    );
  }

  if (correctAnswers && !/^\d(,\d)*$/.test(correctAnswers)) {
    throw new Error(
      `The correctAnswers value for the AssessmentResponse component must be a comma-separated list of positive integers.`,
    );
  }

  if (twoColumns != true && twoColumns != false) {
    throw new Error(
      `The columns value for the AssessmentResponse component must be true or false.`,
    );
  }

  let typeSuffix = "";

  switch (type) {
    case "think-and-check":
      typeSuffix = "-tac";
      break;
    case "multiple-choice":
      typeSuffix = "-mc";
      break;
    default:
      throw new Error(`Unrecognized self-assessment response type.`);
  }

  const cardinalityAttr = cardinality ? "cardinality=" + cardinality : "";
  const correctAnswersAttr = correctAnswers ? "correct=" + correctAnswers : "";
  const columnsAttr = twoColumns ? "columns" : "";

  // prettier-ignore
  return html`
    <web-response${typeSuffix} ${cardinalityAttr} ${correctAnswersAttr} ${columnsAttr}>
    ${content}
    </web-response${typeSuffix}>
  `;
};

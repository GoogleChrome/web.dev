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

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import "./_styles.scss";

/**
 * Element that renders the feedback form for self-assessments.
 * @extends {BaseElement}
 * @final
 */
class AssessmentFeedbackForm extends BaseElement {
  constructor() {
    super();
  }

  render() {
    const optionContents = [
      "The question is confusing.",
      "The answer is wrong.",
      "The answer explanations are wrong or unclear.",
      "The article is inaccurate or unclear.",
    ];
    const options = optionContents.map((option) => this.optionTemplate(option));

    return html`
      <form class="web-assessment-feedback-form__form">
        <section class="web-modal__content">
          <web-select-group
            @change-selections="${this.onSelectionChange}"
            type="radio"
          >
            ${options}
          </web-select-group>
        </section>
        <footer class="web-modal__footer">
          <button
            @click="${this.onFeedbackCancel}"
            class="w-button web-modal__button web-assessment-feedback-container__close"
          >
            Cancel
          </button>
          <button
            @click="${this.onFeedbackSubmit}"
            class="w-button w-button--primary web-modal__button"
            type="submit"
            disabled
          >
            Report
          </button>
        </footer>
      </form>
    `;
  }

  optionTemplate(content) {
    return html`
      <span>${content}</span>
    `;
  }

  onSelectionChange(e) {
    const selections = e.detail.numSelections;
    const submit = this.querySelector("[type=submit]");

    if (selections > 0) {
      submit.disabled = false;
    }
  }

  onFeedbackCancel() {
    const event = new Event("cancel-question-feedback");

    this.dispatchEvent(event);
  }

  onFeedbackSubmit() {
    // TODO (mfriesenhahn): Handle form submissions
  }
}

customElements.define("web-assessment-feedback-form", AssessmentFeedbackForm);

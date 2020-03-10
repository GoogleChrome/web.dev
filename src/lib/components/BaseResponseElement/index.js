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

import {BaseElement} from "../BaseElement";
import "./_styles.scss";

/**
 * Base element used by all self-assessment response components.
 *
 * @extends {BaseElement}
 */
export class BaseResponseElement extends BaseElement {
  static get properties() {
    return {
      state: {type: String, reflect: true},
    };
  }

  constructor() {
    super();
    this.state = "unanswered";

    this.reportUpdate = this.reportUpdate.bind(this);
    this.identifyCorrectOptions = this.identifyCorrectOptions.bind(this);
    this.enforceCardinality = this.enforceCardinality.bind(this);
    this.checkIfCorrect = this.checkIfCorrect.bind(this);
    this.submitResponse = this.submitResponse.bind(this);
    this.reset = this.reset.bind(this);
    this.enableOption = this.enableOption.bind(this);
    this.disableOption = this.disableOption.bind(this);
  }

  /**
   * Returns an object containing the minimum and maximum allowed selections
   * for a response component based on the passed cardinality string.
   * @param {string} cardinality A string indicating the cardinality of the response.
   *                 May be in the format n, n+, or n-m.
   * @return {Object} An object containing the min and max allowed selections.
   */
  static getSelectionRange(cardinality) {
    let min = 1;
    let max = null;

    if (cardinality === "1") {
      // noop
    } else if (/^\d+$/.test(cardinality)) {
      min = parseInt(cardinality);
      max = min;
    } else if (/^\d+\+$/.test(cardinality)) {
      min = parseInt(cardinality);
      max = 0;
    } else if (/^\d-\d+$/.test(cardinality)) {
      [min, max] = cardinality.split("-");
      [min, max] = [parseInt(min), parseInt(max)];
    }

    return {
      min: min,
      max: max,
    };
  }

  async firstUpdated() {
    // Fetch all children that are not yet defined.
    const undefinedElements = this.querySelectorAll(":not(:defined)");

    const promises = [...undefinedElements].map((child) =>
      customElements.whenDefined(child.localName),
    );

    // Wait for all children to be upgraded
    // and then add the data-correct attribute to the correct options
    // and report unanswered state to the parent AssessmentQuestion.
    await Promise.all(promises);
    this.identifyCorrectOptions();
  }

  updated() {
    this.reportUpdate();
  }

  reportUpdate() {
    const event = new CustomEvent("response-update", {
      detail: {
        responseState: this.state,
      },
    });

    this.dispatchEvent(event);
  }

  // Add the data-correct attribute to correct options
  // so they show as correct when they're submitted.
  identifyCorrectOptions() {
    if (!this.correctAnswer) {
      return;
    }

    const correctAnswersArr = this.correctAnswer.split(",").map(Number);
    const options = this.querySelectorAll("[data-role=option]");

    for (let i = 0; i < options.length; i++) {
      if (correctAnswersArr.includes(i)) {
        options[i].setAttribute("data-correct", "");
      }
    }
  }

  // Reports whether response component's minimum selections have been met
  // and disables unselected options when maximum selection is reached.
  // NOTE: Assumes client components handle the data-selected attribute.
  // (Necessary because selection mechanism will vary by response type.)
  enforceCardinality(e) {
    const options = this.querySelectorAll("[data-role=option]");
    let numSelected = 0;

    for (const option of options) {
      if (option.hasAttribute("data-selected")) {
        numSelected++;
      }
    }

    // Check whether minimum selections have been made
    // and whether selections are correct.
    // (If minimum selections have been made, AssessmentQuestion CTA enables.)
    const isAnsweredCorrectly = this.checkIfCorrect();

    if (numSelected >= this.minSelections && isAnsweredCorrectly) {
      this.state = "answeredCorrectly";
    } else if (numSelected >= this.minSelections && !isAnsweredCorrectly) {
      this.state = "answeredIncorrectly";
    } else {
      this.state = "unanswered";
    }

    // Disable remaining unselected options
    // when the maximum number of selections is reached.
    if (this.maxSelections === 0 || this.maxSelections === null) return;

    for (const option of options) {
      const isSelected = option.hasAttribute("data-selected");
      const hasBeenChecked = option.hasAttribute("data-submitted");

      if (numSelected < this.maxSelections && !isSelected && !hasBeenChecked) {
        this.enableOption(option);
      } else if (!isSelected && !hasBeenChecked) {
        this.disableOption(option);
      }
    }
  }

  // Return true if selections include all correct options.
  // NOTE: This considers responses that include all correct options
  // AND some incorrect options as correct--because it's not clear what else
  // we'd do in that case other than reveal the full correct answer.
  checkIfCorrect() {
    const correctAnswersArr = this.correctAnswer.split(",").map(Number);
    const options = this.querySelectorAll("[data-role=option]");
    const selectedOptions = this.querySelectorAll(
      "[data-role=option][data-selected]",
    );
    const selections = [];

    for (let i = 0; i < selectedOptions.length; i++) {
      const index = Array.from(options).indexOf(selectedOptions[i]);

      selections.push(index);
    }
    return correctAnswersArr.every((val) => selections.includes(val));
  }

  // Updates option states when response component is submitted.
  // NOTE: Assumes client components have a deselectOption() method.
  // (Necessary because selection mechanisms will vary by response type.)
  submitResponse() {
    const options = this.querySelectorAll("[data-role=option]");

    for (const option of options) {
      const isSelected = option.hasAttribute("data-selected");
      const isCorrect = option.hasAttribute("data-correct");
      const isSubmitted = option.hasAttribute("data-submitted");

      if (this.state === "answeredIncorrectly") {
        if (isSelected && isCorrect) {
          option.setAttribute("data-submitted", "");
          this.disableOption(option);
        } else if (isSelected && !isCorrect) {
          option.setAttribute("data-submitted", "");
          this.disableOption(option);
          this.deselectOption(option);
        } else if (!isSelected && !isSubmitted) {
          this.enableOption(option);
        }
      } else if (this.state === "answeredCorrectly") {
        this.disableOption(option);
        if (isSelected) {
          option.setAttribute("data-submitted", "");
        }
      }
    }
    // Force responseComponent state change on next option selection
    // so AssessmentQuestion state updates.
    if (this.state === "answeredIncorrectly") {
      this.state = "unanswered";
    }
  }

  // Helper function to allow other components to reset the response
  // to its unanswered state.
  // NOTE: Assumes client components have a deselectOption() method.
  // (Necessary because selection mechanisms will vary by response type.)
  reset() {
    const options = this.querySelectorAll("[data-role=option]");

    this.state = "unanswered";
    for (const option of options) {
      option.removeAttribute("data-submitted");
      if (typeof this.deselectOption == "function") {
        this.deselectOption(option);
      }
      this.enableOption(option);
    }
  }

  disableOption(option) {
    const inputs = option.querySelectorAll("input, button");

    option.setAttribute("disabled", "");
    for (const input of inputs) {
      input.disabled = true;
    }
  }

  enableOption(option) {
    const inputs = option.querySelectorAll("input, button");

    option.removeAttribute("disabled");
    for (const input of inputs) {
      input.disabled = false;
    }
  }
}

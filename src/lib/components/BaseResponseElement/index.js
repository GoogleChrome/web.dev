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
    this.state = "initial";

    this.reportUpdate = this.reportUpdate.bind(this);
    this.identifyCorrectOptions = this.identifyCorrectOptions.bind(this);
    this.submitOptions = this.submitOptions.bind(this);
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

  firstUpdated() {
    this.identifyCorrectOptions();
    this.reportUpdate();
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
    if (!this.correctAnswer) return;

    const correctAnswersArr = this.correctAnswer.split(",").map(Number);
    const options = this.querySelectorAll("[data-role=option]");

    for (let i = 0; i < options.length; i++) {
      if (correctAnswersArr.includes(i)) {
        options[i].setAttribute("data-correct", "");
      }
    }
  }

  submitOptions() {
    const options = this.querySelectorAll(
      "[data-role=option][data-state=selected]",
    );

    for (const option of options) {
      option.setAttribute("data-state", "submitted");
    }
  }
}

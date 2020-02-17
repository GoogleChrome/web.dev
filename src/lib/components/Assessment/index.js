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

class Assessment extends BaseElement {
  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.setLeader = [];

      for (const child of this.children) {
        if (child.classList.contains("web-assessment__set-leader")) {
          this.setLeader.push(child);
        } else {
          this.prerenderedChildren.push(child);
        }
      }
    }

    // prettier-ignore
    return html`
      <div class="w-callout__header web-assessment__header">
        <h2 class="w-callout__lockup web-assessment__lockup">
          Check your understanding
        </h2>
        ${this.setLeader}
        <button
          class="w-button--icon w-button--round web-assessment__close"
          data-icon="close"
        >
          <span role="tooltip" class="w-tooltip">
            Close
          </span>
        </button>
      </div>
      <button class="w-button w-button--primary web-assessment__open">
        Open quiz
      </button>
      ${this.prerenderedChildren}
    `;
  }
}

customElements.define("web-assessment", Assessment);

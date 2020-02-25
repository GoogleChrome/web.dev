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
import {BaseModalElement} from "../BaseModalElement";

/**
 * Element that renders a self-assessment callout.
 * @extends {BaseModalElement}
 * @final
 */
class Assessment extends BaseModalElement {
  static get properties() {
    return {
      modal: {attribute: "aria-modal", reflect: true},
    };
  }

  constructor() {
    super();
    this.modal = false;

    this.onAssessmentAnimationEnd = this.onAssessmentAnimationEnd.bind(this);
    this.onAssessmentResize = this.onAssessmentResize.bind(this);
  }

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

    return html`
      <div class="w-callout__header web-assessment__header">
        <h2 class="w-callout__lockup web-assessment__lockup">
          Check your understanding
        </h2>
        ${this.setLeader}
        <button
          @click="${this.onCloseClick}"
          class="w-button--icon w-button--round web-assessment__close"
          data-icon="close"
        >
          <span role="tooltip" class="w-tooltip">
            Close
          </span>
        </button>
      </div>
      <button
        @click="${this.onOpenClick}"
        class="w-button w-button--primary web-assessment__open"
      >
        Open quiz
      </button>
      ${this.prerenderedChildren}
    `;
  }

  firstUpdated() {
    // Override BaseModalElement's inert behavior since Assessment opens itself.
    this.inert = false;
    this.classList.remove("unresolved");
  }

  connectedCallback() {
    super.connectedCallback();
    const mqString = `(min-width: 481px)`;

    matchMedia(mqString).addListener(this.onAssessmentResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const mqString = `(min-width: 481px)`;

    matchMedia(mqString).removeListener(this.onAssessmentResize);
  }

  onOpenClick() {
    this.open = true;
  }

  onCloseClick() {
    this.open = false;
  }

  updated(changedProps) {
    if (changedProps.has("open")) {
      this.modal = this.open;
      if (this.open) {
        this.openModal();
      } else {
        this.addEventListener("animationend", this.closeModal, {
          once: true,
        });
      }
    }
  }

  openModal() {
    // TODO: Probably want to make a copy instead of moving the assessment
    // if there's a way to do that while retaining state.

    // Insert a placeholder element into the DOM where the assessment was
    // so the assessment can be reinserted there once it's closed.
    const placeholder = document.createElement("div");

    placeholder.className = "web-assessment__placeholder";
    this.after(placeholder);
    // Since the assessment opens itself, only set the dialog role
    // while it's open.
    this.setAttribute("role", "dialog");
    this.addEventListener("animationend", this.onAssessmentAnimationEnd, {
      once: true,
    });

    // Move the assessment to the end of the body so it's not
    // inside an inert element.
    document.body.append(this);
  }

  closeModal() {
    const placeholder = document.querySelector(".web-assessment__placeholder");

    // Since Assessment opens itself, override BaseModalElement's inert behavior
    // and remove the dialog role.
    this.inert = false;
    this.removeAttribute("role");
    // Again, need to replace this.
    if (placeholder) {
      placeholder.before(this);
      placeholder.remove();
    }

    // Since the assessment is removed and reinserted into the DOM
    // after BaseModalElement's manageFocus() method runs,
    // focus reverts to the body, so need to focus the assessment's Open button.
    this.querySelector(".web-assessment__open").focus();
  }

  onAssessmentAnimationEnd() {
    const tabs = this.querySelector("web-tabs");

    if (!tabs) {
      return;
    }

    // Apply overflow class to tabs if needed.
    tabs.onResize();
    // Override default modal focus behavior so active tab is always in viewport
    // when assessment is opened.
    tabs.focusTab(tabs.activeTab);
  }

  // Close modal when viewport is wider than mobile breakpoint
  // (src/styles/tools/_breakpoints.scss)
  // so things don't break if a mobile user switches to landscape orientation.
  onAssessmentResize() {
    this.open = false;
  }
}

customElements.define("web-assessment", Assessment);

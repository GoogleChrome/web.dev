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
 * Element that renders the feedback modal for self-assessments.
 * @extends {BaseModalElement}
 * @final
 */
class AssessmentFeedbackContainer extends BaseModalElement {
  static get properties() {
    return {
      modal: {attribute: "aria-modal", reflect: true},
      openDrawer: {attribute: "open-drawer", reflect: true},
    };
  }

  constructor() {
    super();
    this.modal = false;
    this.openDrawer_ = false;

    this.onDesktopView = this.onDesktopView.bind(this);
    this.onMobileView = this.onMobileView.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.openFeedbackModal = this.openFeedbackModal.bind(this);
    this.closeFeedbackModal = this.closeFeedbackModal.bind(this);
  }

  render() {
    return html`
      <div class="web-modal__container">
        <h2 class="web-modal__header">What's wrong?</h2>
        <web-assessment-feedback-form></web-assessment-feedback-form>
      </div>
    `;
  }

  firstUpdated() {
    // Listen for close event from Cancel button in child feedback form component
    const form = this.querySelector("web-assessment-feedback-form");

    form.addEventListener("cancel-question-feedback", this.onCloseClick);
  }

  connectedCallback() {
    super.connectedCallback();
    const desktop = `(min-width: 481px)`;
    const mobile = `(max-width: 480px)`;

    matchMedia(desktop).addListener(this.onDesktopView);
    matchMedia(mobile).addListener(this.onMobileView);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const desktop = `(min-width: 481px)`;
    const mobile = `(max-width: 480px)`;

    matchMedia(desktop).removeListener(this.onDesktopView);
    matchMedia(mobile).removeListener(this.onMobileView);
  }

  // On desktop, the feedback container is a simulated details element
  // rather than a modal. So, we just need to open it and un-inert it,
  // rather than inerting the document, etc.
  set openDrawer(val) {
    if (this.openDrawer_ === val) {
      return;
    }

    const oldVal = this.openDrawer_;

    this.openDrawer_ = val;
    if (this.openDrawer_) {
      this.inert = false;
    } else {
      const event = new Event("close-drawer");

      this.dispatchEvent(event);
      this.inert = true;
    }
    this.requestUpdate("openDrawer", oldVal);
  }

  get openDrawer() {
    return this.openDrawer_;
  }

  onCloseClick() {
    this.open = false;

    if (this.openDrawer) {
      this.openDrawer = false;
    }
  }

  updated(changedProps) {
    if (changedProps.has("open")) {
      this.modal = this.open;
      if (this.open) {
        this.openFeedbackModal();
      } else {
        this.addEventListener("animationend", this.closeFeedbackModal, {
          once: true,
        });
      }
    }
  }

  openFeedbackModal() {
    // Insert a placeholder element into the DOM where the form was
    // so the form can be reinserted there once it's closed.
    const placeholder = document.createElement("div");

    placeholder.className = "web-assessment-feedback__placeholder";
    this.after(placeholder);
    // Since the form is only modal on mobile, only set the dialog role
    // while it's open.
    this.setAttribute("role", "dialog");

    // Move the form to the end of the body so it's not
    // inside an inert element.
    document.body.append(this);
  }

  closeFeedbackModal() {
    const placeholder = document.querySelector(
      ".web-assessment-feedback__placeholder",
    );

    this.removeAttribute("role");
    if (placeholder) {
      placeholder.before(this);
      placeholder.remove();
    }
  }

  // Close modal when viewport is wider than mobile breakpoint
  // (src/styles/tools/_breakpoints.scss)
  // so things don't break if a mobile user switches to landscape orientation.
  onDesktopView() {
    this.open = false;
  }

  onMobileView() {
    this.openDrawer = false;
  }
}

customElements.define(
  "web-assessment-feedback-container",
  AssessmentFeedbackContainer,
);

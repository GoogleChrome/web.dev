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
import "./_styles.scss";

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
    this.breakpointDesktop_ = matchMedia(`(min-width: 481px)`);
    this.breakpointMobile_ = matchMedia(`(max-width: 480px)`);
    this.openDrawer_ = false;
    this._placeholder = null;

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
    // Listen for close event from Cancel button in child feedback form component.
    this.addEventListener("cancel-question-feedback", this.onCloseClick);
  }

  connectedCallback() {
    super.connectedCallback();
    this.breakpointDesktop_.addListener(this.onDesktopView);
    this.breakpointMobile_.addListener(this.onMobileView);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.breakpointDesktop_.removeListener(this.onDesktopView);
    this.breakpointMobile_.removeListener(this.onMobileView);
  }

  // On desktop, the feedback container is a simulated details element
  // rather than a modal. So, we just need to open it and un-inert it,
  // rather than the BaseModalElement logic (inerting the document, etc.).
  set openDrawer(val) {
    if (this.openDrawer_ === val) {
      return;
    }

    const oldVal = this.openDrawer_;

    this.openDrawer_ = val;
    if (this.openDrawer_) {
      this.inert = false;
    } else {
      this.inert = true;

      // Fire event so parent question component can re-enable buttons.
      const event = new Event("close-drawer", {
        bubbles: true,
      });
      this.dispatchEvent(event);
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
    // Get a ref to the feedback form's previous sibling
    // so the form can be reinserted below it when closed.
    this._placeholder = this.previousElementSibling;

    // Since the form is only modal on mobile,
    // wait to set the dialog role until it's open.
    this.setAttribute("role", "dialog");

    // Move the form to the end of the body so it's not
    // inside an inert element.
    document.body.append(this);
  }

  closeFeedbackModal() {
    // Since the feedback form moves itself, remove dialog role.
    // (display: none used to remove it from the tab order when closed on mobile.)
    this.removeAttribute("role");
    // Move feedback form back to its original location when viewport
    // becomes larger than the mobile breakpoint.
    if (this._placeholder) {
      this._placeholder.after(this);
      this._placeholder = null;
    }
  }

  // Close modal when viewport is wider than mobile breakpoint
  // (src/styles/tools/_breakpoints.scss)
  // so things don't break if a mobile user switches to landscape orientation.
  onDesktopView() {
    this.open = false;
    // Manually call closeFeedbackModal because the parent Assessment component's
    // closeAssessment method prevents the feedback modal's close animation.
    this.closeFeedbackModal();
  }

  // Close drawer when viewport is narrower than mobile breakpoint
  // so things don't break if a mobile user switches from landscape to portrait.
  onMobileView() {
    this.openDrawer = false;
  }
}

customElements.define(
  "web-assessment-feedback-container",
  AssessmentFeedbackContainer,
);

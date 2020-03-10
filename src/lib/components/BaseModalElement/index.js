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
import "wicg-inert";
import {handleOverflow} from "../../utils/handle-overflow";
import {openModal} from "../../actions";
import {closeModal} from "../../actions";
import "./_styles.scss";

/**
 * Base element that provides modal functionality.
 * Handles inert state for document, focus management, and modal content overflow.
 *
 * @extends {BaseElement}
 */
export class BaseModalElement extends BaseElement {
  static get properties() {
    return {
      open: {type: Boolean, reflect: true},
      animatable: {type: Boolean, reflect: true},
      overflow: {type: Boolean, reflect: true},
      parentModal: {attribute: "parent-modal", reflect: true},
    };
  }

  constructor() {
    super();

    this.open_ = false;
    this.animatable = false;
    this.inert = true;
    this.overflow = false;
    this.idSalt = BaseElement.generateIdSalt("web-modal-");

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.manageDocument = this.manageDocument.bind(this);
    this.manageFocus = this.manageFocus.bind(this);
    this.getTrigger = this.getTrigger.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.onClick);
    // Set tabindex to -1 so modal can be focused when it's opened.
    this.tabIndex = -1;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.onClick);
  }

  set open(val) {
    if (this.open_ === val) {
      return;
    }

    const oldVal = this.open_;

    this.open_ = val;
    if (this.open_) {
      // Must get trigger before manipulating the DOM.
      this.getTrigger();
      // Add keyup event listener to this element rather than document
      // so a nested modal doesn't close its parent modal when the user presses Esc.
      this.addEventListener("keyup", this.onKeyUp);
      window.addEventListener("resize", this.onResize);
    } else {
      // Fire custom event to allow other components
      // to respond when the modal closes, if needed
      // (e.g., to reenable a button).
      const event = new Event("close-modal");

      this.dispatchEvent(event);
      window.removeEventListener("resize", this.onResize);
    }

    this.manageDocument();
    this.animatable = true;
    this.addEventListener("animationend", this.onAnimationEnd, {
      once: true,
    });

    this.requestUpdate("open", oldVal);
  }

  get open() {
    return this.open_;
  }

  onClick(e) {
    // Check whether the event target matches the currentTarget
    // so the modal only closes when a user clicks the scrim.
    if (e.currentTarget !== e.target) {
      return;
    }
    this.open = false;
  }

  onKeyUp(e) {
    // Close modal when user presses Escape.
    if (e.key === "Escape") {
      this.open = false;
    }
  }

  // Assumes modal on/off transitions are handled by an animation
  // rather than a transition.
  onAnimationEnd() {
    this.animatable = false;
    // Must wait until animation ends to change focus and check overflow.
    this.manageFocus();
    if (this.open) {
      this.onResize();
      window.addEventListener("resize", this.onResize);
    } else {
      window.removeEventListener("resize", this.onResize);
      this.removeEventListener("keyup", this.onKeyUp);
    }
    this.inert = !this.open;
  }

  onResize() {
    // Set the modal's overflow prop to true if it has overflow to allow for styling changes
    // (e.g., adding borders to the child element handling overflow).
    // If the client component needs to use a different class for the element
    // handling overflow, it will need its own animationend listener.
    const content = this.querySelector(".web-modal__content");

    if (!content) {
      return;
    }

    const hasOverflow = handleOverflow(content, "height");

    if (hasOverflow) {
      this.overflow = true;
    } else {
      this.overflow = false;
    }
  }

  getTrigger() {
    // When the modal is opened, asign a class to the triggering element
    // so it can be refocused when the modal is closed.
    const trigger = document.activeElement;

    trigger.classList.add("js-modal-trigger");
  }

  // Manage state of the document based on the modal state.
  manageDocument() {
    if (this.open) {
      // When the modal is opened, inert the rest of the document.
      openModal();

      // If the modal is triggered by an element in a parent modal,
      // inert the triggering modal and tag it so it can be uninerted later.
      // (Tagging prevents failure if elements move around in the DOM.)
      const parent = this.closest(this.parentModal);

      if (parent) {
        parent.inert = true;
        parent.classList.add("web-modal-" + this.idSalt);
      }
    } else if (!this.open && this.parentModal) {
      // If the modal is triggered by an element in another modal,
      // uninert the triggering modal but leave the document inert.
      const parent = document.querySelector(".web-modal-" + this.idSalt);

      if (parent) {
        parent.inert = false;
        parent.classList.remove("web-modal-" + this.idSalt);
      }
    } else {
      // When the modal is closed, uninert the rest of the document.
      closeModal();
    }
  }

  manageFocus() {
    const triggerClass = "js-modal-trigger";

    if (this.open) {
      // When the modal is opened, move focus into the modal so
      // folks using a screen reader or switch can access it.
      this.focus();
    } else {
      // When the modal is closed, restore focus to the triggering element.
      // NOTE: It might be more techincally pure to
      // use a unistore action for this.
      const trigger = document.querySelector("." + triggerClass);

      if (trigger) {
        trigger.focus();
        trigger.classList.remove(triggerClass);
      } else {
        document.body.focus();
      }
    }
  }
}

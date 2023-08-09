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

import {BaseElement} from '../BaseElement';
import {checkOverflow} from '../../utils/check-overflow';
import {openModal} from '../../actions';
import {closeModal} from '../../actions';
import './_styles.scss';

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
      parentModal: {type: String, reflect: true, attribute: 'parent-modal'},
    };
  }

  constructor() {
    super();

    this.open_ = false;
    this.animatable = false;
    this.overflow = false;
    /** @type HTMLElement */
    this._triggerElement = null;
    this._parent = null;
    this.parentModal = null;

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onClick);
    // Set tabindex to -1 so modal can be focused when it's opened.
    this.tabIndex = -1;
    this.inert = !this.open;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.onClick);
    // To account for the Assessment modal, which opens itself,
    // check whether the modal is connected before closing it
    // to keep it from staying open after nav.
    window.setTimeout(() => {
      if (!this.isConnected) {
        this.open = false;
      }
    }, 0);
  }

  set open(val) {
    if (this.open_ === val) {
      return;
    }

    const oldVal = this.open_;

    this.open_ = val;
    if (this.open_) {
      // Must get trigger before manipulating the DOM.
      this._triggerElement = /** @type HTMLElement */ (document.activeElement);
      // Add keyup event listener to this element rather than document
      // so a nested modal doesn't close its parent modal when the user presses Esc.
      this.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('resize', this.onResize);
    } else {
      // Fire custom event to allow other components
      // to respond when the modal closes, if needed
      // (e.g., to reenable a button).
      const event = new Event('close-modal');

      this.dispatchEvent(event);
      window.removeEventListener('resize', this.onResize);
    }

    this.manageDocument();
    this.animatable = true;
    this.addEventListener('animationend', this.onAnimationEnd, {
      once: true,
    });
    this.inert = this.open; // starts the wrong way around, and flips onAnimationEnd

    this.requestUpdate('open', oldVal);
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
    if (e.key === 'Escape') {
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
      window.addEventListener('resize', this.onResize);
    } else {
      window.removeEventListener('resize', this.onResize);
      this.removeEventListener('keyup', this.onKeyUp);
    }
    this.inert = !this.open;
  }

  onResize() {
    // Set the modal's overflow prop to true if it has overflow to allow for styling changes
    // (e.g., adding borders to the child element handling overflow).
    // If the client component needs to use a different class for the element
    // handling overflow, it will need its own animationend listener.
    const content = this.querySelector('.web-modal__content');

    if (!content) {
      return;
    }

    this.overflow = checkOverflow(content, 'height');
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
        this._parent = parent;
      }
    } else if (!this.open && this.parentModal) {
      // If the modal is triggered by an element in another modal,
      // uninert the triggering modal but leave the document inert.

      if (parent) {
        parent.inert = false;
        this._parent = null;
      }
    } else {
      // When the modal is closed, uninert the rest of the document.
      closeModal();
    }
  }

  manageFocus() {
    if (this.open) {
      // When the modal is opened, move focus into the modal so
      // folks using a screen reader or switch can access it.
      this.focus();
    } else {
      // When the modal is closed, restore focus to the triggering element.
      // NOTE: It might be more techincally pure to
      // use a unistore action for this.
      if (this._triggerElement) {
        this._triggerElement.focus();
        this._triggerElement = null;
      } else {
        document.body.focus();
      }
    }
  }
}

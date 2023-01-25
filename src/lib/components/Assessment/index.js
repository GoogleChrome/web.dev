/*
 * Copyright 2020 Google LLC
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

import {html} from 'lit-element';
import {render} from 'lit-html';
import {BaseModalElement} from '../BaseModalElement';
import './_styles.scss';

/**
 * Element that renders a self-assessment callout.
 * @extends {BaseModalElement}
 * @final
 */
export class Assessment extends BaseModalElement {
  static get properties() {
    return {
      modal: {attribute: 'aria-modal', reflect: true},
      open: {type: Boolean, reflect: true},
      animatable: {type: Boolean, reflect: true},
      overflow: {type: Boolean, reflect: true},
      parentModal: {type: String, reflect: true, attribute: 'parent-modal'},
    };
  }

  constructor() {
    super();
    this.modal = false;
    this._placeholder = null;
    this.breakpoint_ = matchMedia('(min-width: 481px)');

    this.onAssessmentAnimationEnd = this.onAssessmentAnimationEnd.bind(this);
    this.onAssessmentResize = this.onAssessmentResize.bind(this);
    this.reset = this.reset.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
    this.openAssessment = this.openAssessment.bind(this);
    this.closeAssessment = this.closeAssessment.bind(this);
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.setLeader = [];

      for (const child of this.children) {
        if (child.classList.contains('web-assessment__set-leader')) {
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
          <span role="tooltip" class="w-tooltip">Close</span>
        </button>
      </div>
      ${this.prerenderedChildren}
    `;
  }

  firstUpdated() {
    this.classList.remove('unresolved');
    // Override BaseModalElement's inert behavior since Assessment
    // is visible on desktop in closed state.
    // (display: none used to remove it from the tab order when closed on mobile.)
    this.inert = false;
    // Render the launcher that appears in closed state on mobile.
    this.renderLauncher();
    // Listen to reset requests from child question components.
    this.addEventListener('request-assessment-reset', this.reset);

    // Get our position within all assessments on the page, and use this as the
    // basis for our Analytics ID.
    const assessments = document.querySelectorAll('web-assessment');
    const idx = [...assessments].indexOf(this);
    this.id = 'web-assessment-' + idx;

    const questions = Array.from(this.querySelectorAll('web-question'));
    questions.forEach((question, i) => {
      question.setAttribute('id', `${this.id}-question-${i}`);
    });
  }

  // Add unique IDs to passed elements
  addUniqueID(elements, target) {
    const idx = [...elements].indexOf(target);

    if (target.id === 'undefined') {
      target.id = idx;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Close modal if viewport is >481 px so document isn't inert on desktop
    this.breakpoint_.addListener(this.onAssessmentResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.breakpoint_.removeListener(this.onAssessmentResize);
  }

  renderLauncher() {
    const launcher = document.createElement('div');
    const contentTemplate = (setLeader) => html`
      <div class="w-callout__header web-assessment__header">
        <h2 class="w-callout__lockup web-assessment__lockup">
          Check your understanding
        </h2>
        <div class="w-callout__blurb web-assessment__set-leader">
          ${setLeader}
        </div>
      </div>
      <button
        @click="${this.onOpenClick}"
        class="w-button w-button--primary web-assessment__button web-assessment__open"
      >
        Open quiz
      </button>
    `;
    // lit-element prevents children from being duplicated,
    // so grab setLeader text content.
    const text = this.setLeader[0] ? this.setLeader[0].textContent : '';
    const content = contentTemplate(text);

    render(content, launcher);
    launcher.className = 'web-assessment__launcher';
    this.before(launcher);
  }

  onOpenClick() {
    this.open = true;
  }

  onCloseClick() {
    this.open = false;
  }

  updated(changedProps) {
    if (changedProps.has('open')) {
      this.modal = this.open;
      if (this.open) {
        this.openAssessment();
      } else {
        this.addEventListener('animationend', this.closeAssessment, {
          once: true,
        });
      }
    }
  }

  openAssessment() {
    // Get a ref to the assessment's previous sibling
    // so the assessment can be reinserted below it when it's closed.
    this._placeholder = this.previousElementSibling;

    // Since the assessment is visible when closed on desktop,
    // wait to set the dialog role until it's open.
    this.setAttribute('role', 'dialog');
    this.addEventListener('animationend', this.onAssessmentAnimationEnd, {
      once: true,
    });

    // Move the assessment to the end of the body so it's not
    // inside an inert element.
    document.body.append(this);
  }

  closeAssessment() {
    // Since the assessment is visible when closed on desktop,
    // override BaseModalElement's inert behavior.
    // (display: none used to remove it from the tab order when closed on mobile.)
    this.inert = false;
    // Move assessment back to its original location in case viewport
    // becomes larger than the mobile breakpoint.
    if (this._placeholder) {
      this._placeholder.after(this);
      this._placeholder = null;
    }
  }

  onAssessmentAnimationEnd() {
    /** @type import('../Tabs').Tabs */
    const tabs = this.querySelector('web-tabs');

    if (!tabs) {
      return;
    }

    // Apply overflow class to tabs if needed.
    tabs.onResize();
    // Override default modal focus behavior so active tab is always in viewport
    // when assessment is opened.
    tabs.focusTab(tabs.activeTab);
  }

  // When viewport is wider than mobile breakpoint
  // (src/styles/tools/_breakpoints.scss)
  // close modal and remove dialog role
  // so things don't break if a mobile user switches to landscape orientation
  // while the assessment modal is open.
  onAssessmentResize() {
    this.open = false;
    this.removeAttribute('role');
  }

  // Reset assessment to initial state.
  reset() {
    /** @type import('../Tabs').Tabs */
    const tabs = this.querySelector('web-tabs');
    /** @type NodeListOf<import('../AssessmentQuestion').AssessmentQuestion> */
    const questions = this.querySelectorAll('web-question');

    for (const question of questions) {
      question.reset();
    }

    if (tabs) {
      tabs.focusTab(0);
    }
  }
}

customElements.define('web-assessment', Assessment);

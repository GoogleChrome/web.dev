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

/**
 * @fileoverview A Material snackbar for showing notifications.
 */

import {html} from 'lit';
import {BaseElement} from '../BaseElement';

const OPENING_ANIMATION_TIME = 150;
const CLOSING_ANIMATION_TIME = 75;

class Snackbar extends BaseElement {
  static get properties() {
    return {
      animatable: {type: Boolean, reflect: true},
      stacked: {type: Boolean, reflect: true},
      type: {type: String},
      onAccept: {type: Object}, // onAccept is a Function
      onReject: {type: Object}, // onReject is a Function
    };
  }

  constructor() {
    super();
    this.onAccept = null;
    this.onReject = null;
    this.type = null;
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    let ms;
    if (val) {
      this.setAttribute('open', '');
      ms = OPENING_ANIMATION_TIME;
    } else {
      this.removeAttribute('open');
      ms = CLOSING_ANIMATION_TIME;
    }

    this.animatable = true;
    setTimeout(() => (this.animatable = false), ms);
  }

  get cookiesTemplate() {
    return html`
      <div class="web-snackbar__label" role="status">
        web.dev uses cookies to deliver and enhance the quality of its services
        and to analyze traffic. If you agree, cookies are also used to serve
        advertising and to personalize the content and advertisements that you
        see.
        <a href="https://policies.google.com/technologies/cookies">
          Learn more.
        </a>
      </div>
      <div class="web-snackbar__actions cluster gutter-base">
        <button @click=${this.onAccept} class="button button--action">
          Agree
        </button>
        <button @click=${this.onReject} class="button">No thanks</button>
      </div>
    `;
  }

  render() {
    let template;
    switch (this.type) {
      case 'cookies':
        template = this.cookiesTemplate;
        break;
      default:
        break;
    }

    return html` <div class="web-snackbar__surface flow">${template}</div> `;
  }
}

customElements.define('web-snackbar', Snackbar);

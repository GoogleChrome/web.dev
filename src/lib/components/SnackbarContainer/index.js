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
 * @fileoverview A Snackbar container for handling Redux state and actions.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {store} from '../../store';
import {setUserAcceptsCookies, checkIfUserAcceptsCookies} from '../../actions';
import '../Snackbar';
import './_styles.scss';

class SnackbarContainer extends BaseElement {
  static get properties() {
    return {
      open: {type: Boolean},
      type: {type: String},
    };
  }

  constructor() {
    super();
    this.onBeforeInstallPrompt = this.onBeforeInstallPrompt.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    checkIfUserAcceptsCookies();
    store.subscribe(this.onStateChanged);
    this.onStateChanged();

    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.unsubscribe(this.onStateChanged);
    window.removeEventListener(
      'beforeinstallprompt',
      this.onBeforeInstallPrompt,
    );
  }

  onBeforeInstallPrompt(e) {
    if (!this.acceptedCookies) {
      e.preventDefault();
    }
  }

  onStateChanged() {
    const state = store.getState();
    this.open = state.showingSnackbar;
    this.type = state.snackbarType;
    this.acceptedCookies = state.userAcceptsCookies;
  }

  render() {
    let action;
    let isStacked;
    switch (this.type) {
      case 'cookies':
        action = setUserAcceptsCookies;
        isStacked = true;
        break;
      default:
        break;
    }

    return html`
      <web-snackbar
        .type=${this.type}
        .open=${this.open}
        .stacked=${isStacked}
        .action="${action}"
      ></web-snackbar>
    `;
  }
}

customElements.define('web-snackbar-container', SnackbarContainer);

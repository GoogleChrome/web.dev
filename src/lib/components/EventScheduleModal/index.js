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

import {BaseModalElement} from '../BaseModalElement';
import {html} from 'lit-element';
import './_styles.scss';

/**
 * @fileoverview Modal element for session information.
 */

class EventScheduleModal extends BaseModalElement {
  static get properties() {
    return {
      sessionRow: Element,
      _sessionName: String,
    };
  }

  shouldUpdate(changedProperties) {
    if (!changedProperties.has('sessionRow')) {
      return false;
    }

    this._sessionName = '';
    if (!this.sessionRow) {
      return true;
    }

    // Remove the link that was used to open us.
    const link = this.sessionRow.querySelector('.w-event-schedule__open');
    if (link) {
      link.remove();
      this._sessionName = link.textContent;
    }
    return true;
  }

  render() {
    return html`
      <main>
        <h1>${this._sessionName || '?'}</h1>
        ${this.sessionRow}
        <button
          class="w-button w-button--secondary gc-analytics-event"
          data-category="web.dev"
          data-label="live, close session modal"
          data-action="click"
          @click=${() => (this.open = false)}
        >
          Close
        </button>
      </main>
    `;
  }
}

customElements.define('web-event-schedule-modal', EventScheduleModal);

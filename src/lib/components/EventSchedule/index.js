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

import '../EventScheduleModal';

/**
 * @fileoverview A schedule manager which opens and closes modals based on
 * the current href. Looks in children for content.
 *
 * This does not inherit from BaseStateElement as it is not a LitElement.
 */

class EventSchedule extends HTMLElement {
  constructor() {
    super();

    this._positionElement = document.createElement('div');
    this._positionElement.className = 'w-event-modal-position';

    this._modalElement = document.createElement('web-event-schedule-modal');
    this._modalElement.className = 'web-modal';
    this._modalElement.open = false;
    this._modalElement.addEventListener('close-modal', () => {
      if (!window.location.hash.substr(1)) {
        return; // we closed ourselves, so got an event that can be ignored
      }
      const url = window.location.pathname + window.location.search;
      window.history.pushState(null, null, url);
      this._updateHash();
    });

    this._currentSession = null;
    this._updateHash = this._updateHash.bind(this);
    this._updatePosition = this._updatePosition.bind(this);
  }

  _updateHash() {
    const id = this.isConnected ? window.location.hash.substr(1) : '';
    const session =
      (id && this.querySelector(`[data-session-id="${id}"]`)) || null;

    if (session === this._currentSession) {
      return;
    }

    this._currentSession = session;
    if (!session) {
      this._modalElement.open = false;
      this._positionElement.remove();
      return;
    }

    this._updatePosition();
    this._positionElement.scrollIntoView();

    this._positionElement.append(this._modalElement);
    this._modalElement.open = true;

    // TODO(samthor): Update the modal with content based on the row we just
    // created the modal in, e.g. with full talk description.
  }

  _updatePosition() {
    const bounds = this._currentSession.getBoundingClientRect();
    this._positionElement.style.top = window.scrollY + bounds.top + 'px';
    this._positionElement.style.left = window.scrollX + bounds.left + 'px';
    this._positionElement.style.width = bounds.width + 'px';

    document.body.append(this._positionElement);

    // TODO(samthor): If we resize, we might have to scroll the modal into view
    // again.
  }

  connectedCallback() {
    window.addEventListener('hashchange', this._updateHash);
    window.addEventListener('resize', this._updatePosition);
    this._updateHash();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this._updateHash);
    window.removeEventListener('resize', this._updatePosition);
    this._updateHash();
  }
}

customElements.define('web-event-schedule', EventSchedule);

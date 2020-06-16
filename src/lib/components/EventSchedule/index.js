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

    this._modalElement = document.createElement('web-event-schedule-modal');
    this._modalElement.className = 'web-modal';
    this._modalElement.open = false;
    this._modalElement.addEventListener('close-modal', () => {
      if (!window.location.hash.substr(1)) {
        return; // we closed ourselves, so got an event that can be ignored
      }
      const url = window.location.pathname + window.location.search;
      window.history.replaceState(null, null, url);
      this.onHashChange();
    });

    this._currentSession = null;
    this.onHashChange = this.onHashChange.bind(this);
    this.onClick = this.onClick.bind(this);

    this.onModalAnimationEnd = this.onModalAnimationEnd.bind(this);
    this._modalElement.addEventListener(
      'animationend',
      this.onModalAnimationEnd,
    );
  }

  _elementForHash(hash = window.location.hash) {
    const id = hash.substr(1);
    return (id && this.querySelector(`[data-session-id="${id}"]`)) || null;
  }

  /**
   * Controls the open/close of session modals, by matching the page's hash to any contained
   * elements with a matching `data-session-id` attribute.
   *
   * If no hash is set, or no element is found, hides any modal.
   */
  onHashChange() {
    const session = this.isConnected ? this._elementForHash() : null;
    if (session === this._currentSession) {
      return;
    }

    this._currentSession = session;
    if (!session) {
      this._modalElement.open = false;
      // Our animationend handler, added above, clears the modal after its remove animation.
      return;
    }

    // Clone the session node and pass it to our session. This is kinda gross but basically we use
    // it as the canonical source of truth for the modal. We also have to remove all tabindex
    // attributes as they may have been added by the inert polyfill.
    const clone = session.cloneNode(true);
    clone.querySelectorAll('[tabindex]').forEach((el) => {
      el.removeAttribute('tabindex');
    });

    this._modalElement.sessionRow = clone;
    this._modalElement.open = true;
    document.body.append(this._modalElement);
  }

  onModalAnimationEnd() {
    // Don't remove the modal if it's been made open again.
    if (!this._modalElement.open) {
      this._modalElement.remove();
    }
  }

  /**
   * Handles clicks within this schedule, searching for hashes which open a
   * session.
   *
   * @param {!MouseEvent} ev
   */
  onClick(ev) {
    if (!ev.target.href) {
      return;
    }

    const check = new URL(ev.target.href);
    const id = check.hash.substr(1);
    check.hash = '';

    const page = new URL(window.location);
    page.hash = '';

    if (!(page.toString() === check.toString() && id)) {
      return;
    }

    // We clicked on a link that's on the same page but has a hash, so intercept
    // it if handled. We need this as otherwise a history stack event occurs.

    const session = this._elementForHash(ev.target.hash);
    if (!session) {
      return;
    }

    window.history.replaceState(null, null, ev.target.hash);
    this.onHashChange();
    ev.preventDefault();
  }

  connectedCallback() {
    window.addEventListener('hashchange', this.onHashChange);
    this.addEventListener('click', this.onClick);
    this.onHashChange();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.onHashChange);
    this.removeEventListener('click', this.onClick);
    this.onHashChange();
  }
}

customElements.define('web-event-schedule', EventSchedule);

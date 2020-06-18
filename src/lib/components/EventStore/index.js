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

import {store} from '../../store';

// Pretend the date is active within this buffer. This is useful so we can
// reveal the player for a bit more time.
const bufferHours = 1;

/**
 * @fileoverview Publishes event data to Unistore.
 */

class EventStore extends HTMLElement {
  constructor() {
    super();

    this.onStateChanged = this.onStateChanged.bind(this);

    this._timeOffset = 0;
    this._data = [];
  }

  /**
   * @param {boolean=} change this should force a change
   */
  _update(change = false) {
    const now = +new Date() + this._timeOffset;
    let activeEventDay = null;

    for (const day of this._data) {
      const start = +new Date(day.when);
      start.setHours(start.getHours() - bufferHours);

      const end = new Date(start);
      end.setHours(end.getHours() + day.duration + bufferHours);

      const update = {
        complete: now >= end,
        active: now >= start && now < end,
      };

      if (!day.state) {
        // ok
      } else if (
        day.state.complete === update.complete &&
        day.state.active === update.active
      ) {
        continue;
      }
      change = true;

      // TODO(samthor): Should this be "active or next", so we prefill the video player?
      if (update.active) {
        activeEventDay = day;
      }
      day.state = update;
    }

    // Gate this with a boolean as to not trigger recursive updates.
    if (change) {
      store.setState({
        eventDays: this._data,
        activeEventDay,
      });
    }
  }

  connectedCallback() {
    store.subscribe(this.onStateChanged);

    const raw = JSON.parse(this.textContent.trim());
    this._data = raw || [];
    this._update(true);
  }

  disconnectedCallback() {
    store.unsubscribe(this.onStateChanged);

    this._data = [];
    this._update(true);
  }

  onStateChanged({timeOffset}) {
    if (this._timeOffset !== timeOffset) {
      this._timeOffset = timeOffset;
      this._update();
    }
  }
}

customElements.define('web-event-store', EventStore);

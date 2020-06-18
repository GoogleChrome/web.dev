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
    this._activeDay = null;
    this._data = [];
  }

  /**
   * @param {boolean=} change this should force a change
   */
  _update(change = false) {
    const now = +new Date() + this._timeOffset;

    // If there was a previously active day (because the user has their tab open for a long time),
    // then prefer it over showing the upcoming day (we store that in nextPendingDay).
    let nextPendingDay = null;

    for (const day of this._data) {
      const timeOffsetBy = (hours) => {
        const d = new Date(day.when);
        d.setHours(d.getHours() + hours);
        return +d;
      };

      const bufferStart = timeOffsetBy(-bufferHours);
      const bufferEnd = timeOffsetBy(day.duration + bufferHours);

      // Are we past the completion of this day? This allows the YT link to show up.
      const isComplete = now >= bufferEnd;
      if (day.isComplete !== isComplete) {
        day.isComplete = isComplete;
        change = true;
      }
      if (!isComplete && nextPendingDay === null) {
        nextPendingDay = day;
      }

      // Is this day actually active (within exact time range)?
      const isActive = now >= bufferStart && now <= bufferEnd;
      if (isActive && this._activeDay !== day) {
        this._activeDay = day;
        change = true;
      }
    }

    // If there was no previously active day, then choose the upcoming day.
    if (this._activeDay === null) {
      this._activeDay = nextPendingDay;
      change = true;
    }

    // Gate this with a boolean as to not trigger recursive updates.
    if (change) {
      console.warn('active day', this._activeDay);

      store.setState({
        eventDays: this._data,
        activeEventDay: this._activeDay,
      });
    }
  }

  connectedCallback() {
    store.subscribe(this.onStateChanged);
    this.onStateChanged(store.getState());

    const raw = JSON.parse(this.textContent.trim());

    for (let i = 0; i < raw.length; ++i) {
      const d = raw[i];
      d.index = i;
      d.complete = false;
    }

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

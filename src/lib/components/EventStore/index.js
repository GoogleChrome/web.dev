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

// Run the timer every five minutes.
const timerEvery = 60 * 1000 * 5;

/**
 * @fileoverview Provides an element which publishes event data to Unistore, as well as finding
 * the most relevant day to show information for (the active day).
 *
 * Notably:
 *   - From one hour before the upcoming day, you'll see that day
 *   - If you refresh the page one hour after that day, you'll see the next day
 *   - But if you leave the tab open, it'll continue to show the previously chosen day until it's
 *     one hour until the next day (so the user can leave their browser open on the previous day)
 */

class EventStore extends HTMLElement {
  constructor() {
    super();
    this.onStateChanged = this.onStateChanged.bind(this);
    this._update = this._update.bind(this);

    this._timer = 0;
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
        // The first time we find an incomplete day (e.g., tomorrow's event day), mark it as the
        // next pending day we use as the active fallback.
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

    // We gate setting a change with a boolean as to not accidentally trigger recursive updates.
    if (change) {
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

    for (let i = 0; i < raw.days.length; ++i) {
      const d = raw.days[i];
      d.index = i;
      d.complete = false;
    }

    this._data = raw.days || [];
    this._update(true);

    this._timer = window.setInterval(this._update, timerEvery);
  }

  disconnectedCallback() {
    store.unsubscribe(this.onStateChanged);

    this._data = [];
    this._update(true);

    window.clearInterval(this._timer);
  }

  onStateChanged({timeOffset}) {
    if (this._timeOffset !== timeOffset) {
      this._timeOffset = timeOffset;
      this._update();
    }
  }
}

customElements.define('web-event-store', EventStore);

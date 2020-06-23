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

import {BaseStateElement} from '../BaseStateElement';
import {html} from 'lit-element';

/**
 * @fileoverview A carousel manager which controls the video links for the top
 * carousel of the event page.
 *
 * Note that this element just uses global styles for the Live page.
 */

class EventCarousel extends BaseStateElement {
  static get properties() {
    return {
      eventDays: Object,
    };
  }

  render() {
    const renderDay = (day) => {
      const {isComplete, videoId, title} = day;
      const show = isComplete && videoId;

      if (!show) {
        return html`
          <div class="w-event-carousel__day">
            <div class="w-event-carousel__thumbnail"></div>
            <div class="w-event-carousel__description">
              ${title} &mdash; Coming soon
            </div>
          </div>
        `;
      }

      return html`
        <a
          class="w-event-carousel__day"
          href="https://youtu.be/${videoId}"
          target="_blank"
        >
          <div class="w-event-carousel__thumbnail">
            <img
              alt="${title}"
              src="https://img.youtube.com/vi/${videoId}/default.jpg"
              width="178"
              height="110"
            />
          </div>
          <div class="w-event-carousel__description">${title}</div>
        </a>
      `;
    };

    return html`${this.eventDays.map(renderDay)}`;
  }

  onStateChanged({eventDays}) {
    this.eventDays = eventDays;
  }
}

customElements.define('web-event-carousel', EventCarousel);

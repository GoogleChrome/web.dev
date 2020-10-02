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
      eventDays: {type: Object},
    };
  }

  render() {
    // Note that we use `isChatActive` to determine whether the current day
    // shows as "Broadcasting". We backed ourselves into a corner with the
    // `activeEventDay` property as it actually reflects the upcoming day, even
    // hours before the event starts (which is useful for the YT _preview_).

    const renderDay = (day) => {
      const {isComplete, isChatActive, videoId, playlistId, title} = day;
      const isClickable = Boolean(
        // Allows to click if playlist is available, otherwise depends on event status.
        (playlistId || isComplete || isChatActive) && (videoId || playlistId),
      );

      // The thumbnail is shown as long as we have a videoId, regardless of
      // whether the day is complete or not.
      // nb. We use "maxresdefault" as the other images have black bars as they
      // try to fit 4:3 rendering.
      const thumbnailPart = videoId
        ? html`<div class="w-event-carousel__thumbnail">
            <img
              alt="${title}"
              src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg"
              width="178"
              height="110"
            />
          </div>`
        : '';

      let message = 'Coming soon';
      if (isChatActive) {
        message = 'Broadcasting';
      } else if (isClickable) {
        message = 'All sessions';
      }

      const descriptionPart = html` <div class="w-event-carousel__description">
        ${title} &mdash; ${message}
      </div>`;

      if (isClickable) {
        // Prefer the playlistId over the videoId, if available.
        const href =
          !isChatActive && playlistId
            ? `https://www.youtube.com/playlist?list=${playlistId}`
            : `https://youtu.be/${videoId}`;
        return html`
          <a
            class="w-event-carousel__day gc-analytics-event"
            data-category="web.dev"
            data-label="live, open ${title} on YouTube"
            data-action="click"
            href="${href}"
            target="_blank"
          >
            ${thumbnailPart} ${descriptionPart}
          </a>
        `;
      }
      return html`
        <div class="w-event-carousel__day w-event-carousel__pending">
          ${thumbnailPart} ${descriptionPart}
        </div>
      `;
    };

    return html`${this.eventDays.map(renderDay)}`;
  }

  onStateChanged({eventDays}) {
    this.eventDays = eventDays;
  }
}

customElements.define('web-event-carousel', EventCarousel);

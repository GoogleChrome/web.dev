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

const {html} = require('common-tags');
const slugify = require('slugify');

const AuthorsDate = require('./AuthorsDate');

/**
 * @param {!Array<{title: string, from: !Date, sessions: !Array<any>}>} days
 * @param {Object.<string, Author>} authorsCollection
 * @return {string}
 */
module.exports = (days, authorsCollection) => {
  const defaultScheduleDay = 0; // we're post-event, use the first day as default

  const slugs = {};
  const slugForTitle = (title) => {
    // Find a slug for this title, but prevent duplicate IDs.
    const base = slugify(title, {
      lower: true,
      strict: true,
      remove: /[^-\w _]/, // remove anything not in: basic word chars, space, - and _
    });
    let id = base;
    let suffix = 0;
    while (id in slugs) {
      id = base + ++suffix;
    }
    slugs[id] = title;
    return id;
  };

  const renderSession = (
    playlistId,
    {speaker, title, blurb = '', abstract, videoId},
  ) => {
    // Always pass an Array of author IDs.
    /** @type {string[]} */
    const authors = Array.isArray(speaker) ? speaker : [speaker];

    const id = slugForTitle(title);

    // Coerce to array or empty array.
    abstract =
      (abstract && (typeof abstract === 'string' ? [abstract] : abstract)) ||
      [];

    let showVideoLink = false;
    const u = new URL('https://www.youtube.com/watch');
    if (videoId) {
      showVideoLink = true;
      u.searchParams.set('v', videoId);
    }
    if (playlistId) {
      u.searchParams.set('list', playlistId);
    }

    const videoLink = showVideoLink
      ? html`<a
          href="${u.toString()}"
          target="_blank"
          class="w-event-schedule__video"
          >Watch on YouTube</a
        >`
      : '';

    return html`
      <div class="w-event-schedule__row" data-session-id=${id}>
        <div class="w-event-schedule__cell w-event-schedule__speaker">
          ${AuthorsDate({authors}, authorsCollection)}
        </div>
        <div class="w-event-schedule__cell w-event-schedule__session">
          <a class="w-event-schedule__open" href="#${id}">
            <span>${title}</span>
          </a>
          ${videoLink}
          <div class="w-event-schedule__blurb">
            ${blurb}
          </div>
          <div class="w-event-schedule__abstract" hidden>
            ${abstract.map((part) => html`<p>${part}</p>`)}
          </div>
        </div>
      </div>
    `;
  };

  const renderDay = (day, index) => {
    // nb. We don't render a fallback time for browsers without JS.
    return html`
      <div
        data-label="${day.title}"
        class="${index === defaultScheduleDay ? 'w-tabs-default' : ''}"
      >
        <div class="w-event-section__schedule_header">
          <web-event-time
            class="unresolved"
            datetime="${day.date.toISOString()}"
            duration="${day.duration}"
          ></web-event-time>
        </div>

        <div class="w-event-schedule">
          ${day.sessions.map(renderSession.bind(null, day.playlistId))}
        </div>
      </div>
    `;
  };

  return html`
    <web-event-schedule>
      <web-tabs class="w-event-tabs unresolved" label="schedule">
        ${days.map(renderDay)}
      </web-tabs>
    </web-event-schedule>
  `;
};

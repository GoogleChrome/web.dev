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

const AuthorsDate = require('./AuthorsDate');

/**
 * @param {!Array<{title: string, from: !Date, sessions: !Array<any>}>} event
 * @param {Object.<string, Author>} authorsCollection
 * @return {string}
 */
module.exports = (event, authorsCollection) => {
  // Find the default day to show, as a very basic non-JS fallback. Pick the
  // first day where the build time is before the end time of the sessions.
  // This isn't a very good fallback as our build happens at minimum of once per
  // day, but it's better than nothing.
  const now = new Date();
  let defaultScheduleDay = 0;
  for (let i = 0; i < event.length; ++i) {
    const {date, duration} = event[i];
    const endTime = new Date(date);
    endTime.setHours(endTime.getHours() + duration);

    if (now < endTime) {
      defaultScheduleDay = i;
      break;
    }
  }

  const renderSession = ({speaker, title}) => {
    // Always pass an Array of author IDs.
    const authors = typeof speaker === 'string' ? [speaker] : speaker;

    return html`
      <tr>
        <td class="w-event-schedule__speaker">
          ${AuthorsDate({authors}, authorsCollection)}
        </td>
        <td class="w-event-schedule__session">${title}</td>
      </tr>
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

        <table class="w-event-schedule">
          <tbody>
            ${day.sessions.map(renderSession)}
          </tbody>
        </table>
      </div>
    `;
  };

  return html`
    <web-tabs class="w-event-tabs unresolved" label="schedule">
      ${event.map(renderDay)}
    </web-tabs>
  `;
};

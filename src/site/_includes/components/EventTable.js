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
const prettyDate = require('../../_filters/pretty-date');

const AuthorsDate = require('./AuthorsDate');

/**
 * @param {!Array<{title: string, from: !Date, sessions: !Array}>} event
 * @return {string}
 */
module.exports = (event) => {
  const renderSession = ({speaker, title}) => {
    // Always pass an Array of author IDs.
    const authors = typeof speaker === 'string' ? [speaker] : speaker;

    return html`
      <tr>
        <td class="w-event-schedule__speaker">
          ${AuthorsDate({authors})}
        </td>
        <td class="w-event-schedule__session">${title}</td>
      </tr>
    `;
  };

  const renderDay = (day) => {
    // nb. prettyDate is used as a fallback if the `web-event-time` Web Component doesn't wake up
    // and render a fancy timestamp in the user's local time.
    return html`
      <div data-label="${day.title}">
        <div class="w-event-section__schedule_header">
          <web-event-time
            datetime="${day.date.toISOString()}"
            duration="${day.duration}"
            >${prettyDate(day.date)}</web-event-time
          >
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
    <web-tabs class="w-event-tabs" label="schedule">
      ${event.map(renderDay)}
    </web-tabs>
  `;
};

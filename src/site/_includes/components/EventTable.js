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

// const path = require('path');
const {html} = require('common-tags');
// const prettyDate = require('../../_filters/pretty-date');
// const stripLanguage = require('../../_filters/strip-language');
// const md = require('../../_filters/md');
// const constants = require('../../_utils/constants');
// const getSrcsetRange = require('../../_utils/get-srcset-range');
// const postTags = require('../../_data/postTags');

const Author = require('./Author');

module.exports = (collections) => {
  const schedule = collections.eventSchedule;

  // TODO(MichaelSolati): "Author" needs a post but doesn't use it, we pass an empty object.
  const renderSession = ({speaker, info, title}) => {
    return html`
      <tr>
        <td class="w-event-schedule__speaker">
          ${Author({post: {}, author: info, id: speaker, small: true})}
        </td>
        <td class="w-event-schedule__session">${title}</td>
      </tr>
    `;
  };

  const renderDay = ({title, sessions}) => {
    return html`
      <div data-label="${title}">
        <div class="w-event-section__schedule_header">
          <web-event-time></web-event-time>
        </div>

        <table class="w-event-schedule">
          <tbody>
            ${sessions.map(renderSession)}
          </tbody>
        </table>
      </div>
    `;
  };

  return html`
    <web-tabs class="w-event-tabs">
      ${schedule.map(renderDay)}
    </web-tabs>
  `;
};

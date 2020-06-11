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

import {BaseModalElement} from '../BaseModalElement';
import {html} from 'lit-element';
import './_styles.scss';

/**
 * @fileoverview Modal element for session information.
 */

class EventScheduleModal extends BaseModalElement {
  render() {
    // TODO(samthor): Doesn't show anything interesting right now.
    return html`
      <main>
        <h2>Title of talk</h2>
        <a href="#">Close</a>
      </main>
    `;
  }
}

customElements.define('web-event-schedule-modal', EventScheduleModal);

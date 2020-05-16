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

const data = require('../_data/event');
const contributors = require('../_data/contributors');

let alreadyUpdated = false;

/**
 * Provides the singleton event schedule for web.dev/LIVE.
 *
 * @return {!Array<{title: string, sessions: !Array}>}
 */
module.exports = () => {
  if (alreadyUpdated) {
    return data;
  }

  const buildFallback = (id) => {
    return {name: {given: id, family: ''}};
  };

  // This updates the raw event data with links to the relevant contributor.
  for (const day of data) {
    for (const session of day.sessions) {
      session.info =
        contributors[session.speaker] || buildFallback(session.speaker);
    }

    // ... and parses the JS date of the start time.
    day.date = new Date(Date.parse(day.when)) || null;
    if (!day.date) {
      throw new TypeError(
        `each conference day needs a valid date, source: ${day.when}`,
      );
    }
  }

  alreadyUpdated = true;
  return data;
};

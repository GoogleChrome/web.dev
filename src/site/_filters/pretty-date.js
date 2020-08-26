/*
 * Copyright 2019 Google LLC
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

const {DateTime} = require('luxon');

/**
 * Convert a JavaScript Date object into a human readable string.
 * @param {Date} date The date to convert.
 * @return {string|undefined} A human readable date string.
 */
module.exports = (date) => {
  if (!date) {
    /* eslint-disable-next-line */
    console.warn('Date passed to prettyDate filter was undefined or null.');
    return;
  }

  return DateTime.fromISO(date.toISOString(), {zone: 'utc'}).toLocaleString(
    DateTime.DATE_MED,
  );
};

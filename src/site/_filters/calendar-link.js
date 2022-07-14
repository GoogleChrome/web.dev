/*
 * Copyright 2022 Google LLC
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

/**
 * @fileoverview Returns a calendar link for an event.
 */

const {DateTime} = require('luxon');

/**
 * @param {Date} date Date of the event.
 * @param {string} title Title of the event.
 * @param {string} description Description of the event.
 * @return {string} Calendar url string.
 */
function calendarLink(date, title, description) {
  const end = DateTime.fromJSDate(date);
  const start = end.minus({ days: 1 })
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('dates', [start.toFormat('yyyyMMdd'), end.toFormat('yyyyMMdd')].join('/'));
  url.searchParams.set('text', title);
  url.searchParams.set('details', description);
  return url.toString();
}

module.exports = {calendarLink};

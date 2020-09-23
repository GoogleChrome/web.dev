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

/**
 * @fileoverview Provides a helper for calculating relative time.
 */

/**
 * @param {?string} raw a date-like string
 * @return {number} the number of milliseconds we're pretending to be offset by
 */
export function getTimeOffset(raw) {
  if (!raw) {
    return 0;
  }

  const overrides = {
    'wdl-day1': '2020-06-30T16:02Z',
    'wdl-preday2': '2020-07-01T10:59Z', // before 1hr buffer
    'wdl-day2': '2020-07-01T12:00Z',
    'wdl-day3': '2020-07-02T07:30Z',
  };

  raw = overrides[raw] || raw;

  const d = new Date(raw);
  if (+d) {
    const now = new Date();
    console.warn('debug time start at', d);
    return +d - +now;
  }
  return 0;
}

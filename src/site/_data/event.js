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
 * @fileoverview Contains event data for web.dev/LIVE.
 */

module.exports = [
  {
    title: 'Day 1',
    from: Date.UTC(2020, 5, 30, 16), // 4pm UTC = 9am PST
    sessions: [
      {
        speaker: 'addyosmani',
        title: 'How to optimize for Web Vitals',
      },
      {
        speaker: 'rviscomi',
        title: 'How to browse CrUX data on BigQuery',
      },
    ],
  },
  {
    title: 'Day 2',
    from: Date.UTC(2020, 5, 30, 16), // 4pm UTC = 9am PST
    sessions: [
      {
        speaker: 'samthor',
        title: 'App-Like UX for Better PWAs',
      },
    ],
  },
  {
    title: 'Day 3',
    from: Date.UTC(2020, 6, 2, 16), // 4pm UTC = 9am PST
    sessions: [],
  },
];

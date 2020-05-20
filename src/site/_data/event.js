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

const eventData = [
  {
    title: 'Day 1',
    when: '2020-06-30T16:00Z',
    duration: 8,
    sessions: [
      {
        speaker: 'addyosmani',
        title: 'Optimize User Experience for Core Web Vitals',
      },
      {
        speaker: 'rviscomi',
        title: 'Mastering the Chrome UX Report on BigQuery',
      },
      {
        speaker: 'houssein',
        title: 'How to Analyze Your JavaScript Bundles',
      },
      {
        speaker: 'egsweeny',
        title: "What's New in Speed Tooling",
      },
      {
        speaker: 'paullewis',
        title: 'Core Web Vitals in the DevTools Timeline',
      },
      {
        speaker: 'patrickkettner',
        title: 'AMPs performance secrets',
      },
      {
        speaker: ['sebabenz', 'nainar'],
        title: 'AMP at your Service',
      },
      {
        speaker: 'morss',
        title: 'Workerized JavaScript Made Easy',
      },
      {
        speaker: 'martinsplitt',
        title: 'Debugging SEO problems in JavaScript web apps',
      },
      {
        speaker: 'martinsplitt',
        title: 'Implementing Structured Data with JavaScript',
      },
    ],
  },
  {
    title: 'Day 2',
    when: '2020-07-01T16:00Z',
    duration: 8,
    sessions: [
      {
        speaker: 'paullewis',
        title: "What's new in DevTools",
      },
      {
        speaker: ['syg', 'leszeks'],
        title: "What's new in V8/JavaScript",
      },
      {
        speaker: 'mathiasbynens',
        title: "What's new in Puppeteer",
      },
      {
        speaker: 'andreban',
        title: 'Shipping a PWA as an Android app',
      },
      {
        speaker: 'demianrenzulli',
        title: 'How to define your install strategy',
      },
      {
        speaker: 'beaufortfrancois',
        title: 'Taking your media experience to the next level',
      },
      {
        speaker: 'thomassteiner',
        title:
          "Building for Modern Browsers and Progressively Enhancing Like It's 2003",
      },
      {
        speaker: 'demianrenzulli',
        title: 'Advanced PWA Patterns',
      },
      {
        speaker: 'pjmclachlan',
        title: 'Giving your PWA superpowers 🦹‍♀️',
      },
      {
        speaker: 'samthor',
        title: 'App-Like UX for Better PWAs',
      },
      {
        speaker: 'pjmclachlan',
        title: 'Taming web notifications',
      },
      {
        speaker: 'petelepage',
        title: 'Storage for the Web',
      },
      {
        speaker: 'nattestad',
        title:
          'Building Zoom on the Web: Advanced APIs for high performance web apps',
      },
    ],
  },
  {
    title: 'Day 3',
    when: '2020-07-02T16:00Z',
    duration: 8,
    sessions: [
      {
        speaker: 'kosamari',
        title: 'Building better in the world of build tools!',
      },
      {
        speaker: 'una',
        title: '10 modern layouts in 1 line of CSS',
      },
      {
        speaker: ['jakearchibald', 'developit'],
        title: 'Writing rollup plugins',
      },
      {
        speaker: 'jakearchibald',
        title: 'Image compression formats compared',
      },
      {
        speaker: 'sfluin',
        title: 'Stay Fast and Fresh with Angular',
      },
      {
        speaker: 'samdutton',
        title: 'Digging into the Privacy Sandbox',
      },
      {
        speaker: 'rowan_m',
        title: 'Cookie recipes - SameSite and beyond',
      },
      {
        speaker: 'agektmr',
        title: 'Isolate your origin using COOP+COEP',
      },
      {
        speaker: 'samdutton',
        title: 'Find and fix problems with the DevTools Issues Panel',
      },
      {
        speaker: ['maudn', 'rowan_m'],
        title: 'Get a (User-Agent Client) Hint',
      },
      {
        speaker: 'samdutton',
        title: 'Signin form best practice',
      },
      {
        speaker: 'agektmr',
        title: "What's new in Web Payments",
      },
    ],
  },
];

// Include parsed Date objects for each day.
for (const day of eventData) {
  // nb. We specify dates with a "Z" suffix, which effectively means 'parse in
  // UTC'.
  day.date = new Date(day.when);
}

module.exports = eventData;

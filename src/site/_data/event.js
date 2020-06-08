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
    when: '2020-06-30T16:00Z', // 9am PDT (-7)
    duration: 3,
    sessions: [
      {
        speaker: 'dalmaer',
        title: 'Welcome to Day One',
      },
      {
        speaker: 'egsweeny',
        title: "What's New in Speed Tooling",
      },
      {
        speaker: 'addyosmani',
        title: 'How to Optimize for Web Vitals',
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
        speaker: ['paullewis', 'philipwalton'],
        title: 'Core Web Vitals in the DevTools Timeline',
      },
      {
        speaker: ['patrickkettner', 'philipwalton'],
        title: 'AMPs Performance Secrets',
      },
      {
        speaker: ['nainar', 'sebabenz'],
        title: 'AMP at Your Service',
      },
      {
        speaker: ['crystallambert', 'morss'],
        title: 'Workerized JavaScript Made Easy',
      },
      {
        speaker: 'martinsplitt',
        title: 'Debugging JavaScript SEO issues',
      },
      {
        speaker: 'martinsplitt',
        title: 'Implementing Structured Data with JavaScript',
      },
    ],
  },
  {
    title: 'Day 2',
    when: '2020-07-01T12:00Z', // 12pm GMT/UTC (+0), note UK time will be 1pm
    duration: 3,
    sessions: [
      {
        speaker: 'dalmaer',
        title: 'Day Two Opening Note',
      },
      {
        speaker: 'paullewis',
        title: "What's New in DevTools",
      },
      {
        speaker: ['syg', 'leszeks'],
        title: "What's New in V8/JavaScript",
      },
      {
        speaker: 'mathiasbynens',
        title: "What's New in Puppeteer",
      },
      {
        speaker: 'andreban',
        title: 'Shipping a PWA as an Android app',
      },
      {
        speaker: 'demianrenzulli',
        title: 'How to Define your Install Strategy',
      },
      {
        speaker: 'thomassteiner',
        title: "Progressively Enhancing Like It's 2003",
      },
      {
        speaker: 'demianrenzulli',
        title: 'Advanced PWA Patterns',
      },
      {
        speaker: ['pjmclachlan', 'andreban'],
        title: 'Giving Your PWA Superpowers 🦹‍♀️',
      },
      {
        speaker: 'samthor',
        title: 'App-Like UX for Better PWAs',
      },
      {
        speaker: 'pjmclachlan',
        title: 'Quieter Notifications Permissions',
      },
      {
        speaker: 'petelepage',
        title: 'Storage for the Web',
      },
      {
        speaker: 'nattestad',
        title: 'Advanced APIs for Bringing People Together',
      },
    ],
  },
  {
    title: 'Day 3',
    when: '2020-07-02T07:30Z', // 1pm IST (+5:30)
    duration: 3,
    sessions: [
      {
        speaker: 'dalmaer',
        title: 'Day Three Opening Note',
      },
      {
        speaker: 'kosamari',
        title: 'Building Better in the World of Build Tools',
      },
      {
        speaker: 'una',
        title: '10 Modern Layouts in 1 Line of CSS',
      },
      {
        speaker: ['developit', 'jakearchibald'],
        title: 'Writing Build Plugins',
      },
      {
        speaker: ['jakearchibald', 'surma'],
        title: 'Image Compression Deep-dive',
      },
      {
        speaker: 'sfluin',
        title: 'How to Stay Fast and Fresh with Angular',
      },
      {
        speaker: ['maudn', 'samdutton'],
        title: 'Security and Privacy for the Open Web',
      },
      {
        speaker: 'rowan_m',
        title: 'Cookie Recipes - SameSite and Beyond',
      },
      {
        speaker: 'agektmr',
        title: 'Prevent Info Leaks and Enable Powerful Features: COOP and COEP',
      },
      {
        speaker: 'samdutton',
        title: 'Find and Fix Problems with Chrome DevTools Issues Tab',
      },
      {
        speaker: ['maudn', 'rowan_m'],
        title: 'Just the Data you Need',
      },
      {
        speaker: 'samdutton',
        title: 'Sign-in Form Best Practice',
      },
      {
        speaker: 'agektmr',
        title: "What's New in Web Payments",
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

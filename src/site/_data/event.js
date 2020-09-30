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

const days = [
  {
    title: 'Day 1',
    when: '2020-06-30T16:00Z', // 9am PDT (-7)
    duration: 3 * 60, // minutes
    videoId: 'H89hKw06iWs',
    playlistId: 'PLNYkxOF6rcIDC0-BiwSL52yQ0n9rNozaF',
    sessions: [
      {
        speaker: 'dalmaer',
        title: 'Welcome to Day One',
        blurb:
          "On day 1, we kick things off by sharing why we are coming together as a community, including a guest speaker from CA.gov. We'll then cover some of the key updates made to the platform around performance, security and privacy, as well as a look at build tools and rich content.",
        abstract: [
          "On day 1, we kick things off by sharing why we are coming together as a community, including a guest speaker from CA.gov. We'll then cover some of the key updates made to the platform around performance, security and privacy, as well as a look at build tools and rich content.",
          'Special Guest: <a href="https://twitter.com/nopatternaaron">Aaron Hans, Tech lead, CA.Gov</a>',
        ],
        videoId: 'Wy1bTEFQyCc',
      },
      {
        speaker: 'egsweeny',
        title: "What's New in Speed Tooling",
        blurb:
          'This talk will cover where to measure your Core Web Vitals in the lab and in the field, as well as how to leverage the newest features and products to build and maintain exceptionally fast experiences for all of your users.',
        abstract: [
          "Our understanding of how to effectively measure and optimize a users' experience is continually evolving, and we keep our metrics and tooling updated to reflect the latest in our learnings. This talk will cover where to measure your Core Web Vitals in the lab and in the field, as well as how to leverage the newest features and products to build and maintain exceptionally fast experiences for all of your users.",
        ],
        videoId: 'yDHfrhCGFQw',
      },
      {
        speaker: 'addyosmani',
        title: 'Optimize for Core Web Vitals',
        blurb:
          "In this hands-on talk, we'll cover tips & tricks for optimizing your user-experience to meet the Core Web Vitals. We'll use tools like Lighthouse & DevTools, show you code snippets for fixes and highlight how you too can get fast and stay fast.",
        abstract: [
          "In this hands-on talk, we'll cover tips & tricks for optimizing your user-experience to meet the Core Web Vitals. We'll use tools like Lighthouse & DevTools, show you code snippets for fixes and highlight how you too can get fast and stay fast.",
          "Optimizing for quality of user experience is key to the long-term success of any site on the web. Whether you're a business owner, marketer, or developer, Core Web Vitals can help you quantify the experience of your site and identify opportunities to improve.",
        ],
        videoId: 'AQqFZ5t8uNc',
      },
      {
        speaker: 'rviscomi',
        title: 'Mastering the Chrome UX Report on BigQuery',
        blurb:
          'Learn how to query the Chrome UX Report using our new summary datasets and shortcut functions, so you can extract insights quickly and cheaply like a pro.',
        abstract: [
          "There is so much information in the Chrome UX Report dataset on BigQuery, it could feel overwhelming at first. We've been hard at work making sure that the treasure trove of web transparency data is accessible to every developer. Learn how to query the Chrome UX Report using our new summary datasets and shortcut functions, so you can extract insights quickly and cheaply like a pro.",
        ],
        videoId: 'YGcA-h4YM6w',
      },
      {
        speaker: 'houssein',
        title: 'How to Analyze Your JavaScript Bundles',
        blurb:
          'Learn how to analyze your bundled JavaScript code and to spot common issues that can easily bloat up your application size.',
        abstract: [
          'Learn how to analyze your bundled JavaScript code and to spot common issues that can easily bloat up your application size.',
        ],
        videoId: 'MxBCPc7bQvM',
      },
      {
        speaker: ['paullewis', 'philipwalton'],
        title: 'Core Web Vitals in the DevTools Timeline',
        blurb:
          "In this talk we'll cover what the Core Web Vitals are, where they came from, and how you can use Chrome's DevTools to explore your site or app's vitals values.",
        abstract: [
          "The Core Web Vitals are a great way to assess the UX impact of page load performance. In this talk we'll cover what the vitals are, where they came from, and how you can use Chrome's DevTools to explore your site or app's vitals values.",
          'For more on Core Web Vitals check out <a href="https://web.dev/vitals/">https://web.dev/vitals/</a>',
        ],
        videoId: 't8YBZLjL-KU',
      },
      {
        speaker: ['nainar', 'sebabenz'],
        title: 'AMP at Your Service',
        blurb:
          "Naina and Sebastian discuss how AMP makes web development less painful and why it's time to move away from paired AMP.",
        abstract: [
          "The one where Naina and Sebastian discuss how AMP makes web development less painful and why it's time to move away from paired AMP.",
        ],
        videoId: '2QWO78U43FU',
      },
      {
        speaker: 'martinsplitt',
        title: 'Debugging JavaScript SEO issues',
        blurb:
          'Diagnosing common JavaScript SEO issues and helpful steps to debug them!',
        abstract: [
          'Diagnosing common JavaScript SEO issues and helpful steps to debug them!',
        ],
        videoId: 'himvKu12YCY',
      },
      {
        speaker: ['crystallambert', 'morss'],
        title: 'Workerized JavaScript Made Easy',
        blurb:
          'In this talk we chat about how to use &lt;amp-script&gt; to create your very own Workerized JS browser interactions!',
        abstract: [
          "When JavaScript lives in a Worker, it runs in a separate thread. Thus, it can't block the browser from creating smooth user experiences! Unfortunately, since Workers can't access the DOM directly, you can't just stick your JavaScript into a Worker. Fortunately, last year, AMP introduced &lt;amp-script&gt;, a component that makes this straightforward. In this talk we chat about how to use &lt;amp-script&gt; to create your very own Workerized JS browser interactions!",
        ],
        videoId: 'nOEXIcMdr_g',
      },
      {
        speaker: 'martinsplitt',
        title: 'Implementing Structured Data with JavaScript',
        blurb:
          'In this session we walk through typical approaches to add structured data to your pages, both in popular frameworks as well as vanilla JavaScript.',
        abstract: [
          'If you are building a great website with JavaScript, you want it to stand out in Google Search, too. To be eligible for rich results, you need to add structured data to your pages. In this session we walk through typical approaches to do this both in popular frameworks as well as vanilla JavaScript.',
        ],
        videoId: 'hBKZnaIMm4M',
      },
    ],
  },
  {
    title: 'Day 2',
    when: '2020-07-01T12:00Z', // 12pm GMT/UTC (+0), note UK time will be 1pm
    duration: 3 * 60, // minutes
    videoId: 'r3QPKK0JPtI',
    playlistId: 'PLNYkxOF6rcIBhuGsbO6t8-OBE5-fVPe7K',
    sessions: [
      {
        speaker: 'dalmaer',
        title: 'Day Two Opening Note',
        blurb:
          "On day 2, we travel virtually to an EMEA friendly timezone and welcome all developers who can join us real time. We'll dive into the top developer pain points and how we are looking to address them.",
        abstract: [
          "On day 2, we travel virtually to an EMEA friendly timezone and welcome all developers who can join us real time. We'll dive into the top pain points and how we are looking to address them, the state of CSS and layout, and the latest on developers tools that you use every day, including some very special guests from Mozilla to share their own updates.",
          'Special Guests: <a href="https://twitter.com/atopal">Kadir Topal</a> & <a href="https://twitter.com/violasong">Victoria Wang</a>, Mozilla',
        ],
        videoId: 'SZb0KA5coQo',
      },
      {
        speaker: 'paullewis',
        title: "What's New in DevTools",
        blurb:
          "Let's take a look at the latest and greatest features in Chrome's DevTools!",
        abstract: [
          "Let's take a look at the latest and greatest features in Chrome's DevTools. We'll cover how you can use the Performance Panel to assess your page load metrics, how you can locate issues with your pages, debug your Web Assembly, and even emulate color vision deficiencies.",
        ],
        videoId: '6yrJZHqJe2k',
      },
      {
        speaker: ['syg', 'leszeks'],
        title: "What's New in V8/JavaScript",
        blurb:
          'Shu and Leszek take a tour of some of the new features and improvements that have landed in JavaScript and V8.',
        abstract: [
          "What exciting things happened in the JavaScript language and the V8 engine in 2019? Shu and Leszek take a tour of some new features and improvements. For JavaScript, you'll learn about new syntax, like optional chaining and nullish coalescing, that make expressing common patterns a breeze, as well as the powerful new weak references that may help plug memory leaks. For V8, you'll learn how the engine got faster with streaming parsing and slimmer with pointer compression.",
        ],
        videoId: 'TPm-UhWkiq8',
      },
      {
        speaker: 'mathiasbynens',
        title: "What's New in Puppeteer",
        blurb:
          'This session gives an overview of recent changes in Puppeteer, including new features, architectural changes, and a sneak peek of what’s coming next.',
        abstract: [
          'The Chrome team maintains Puppeteer, a Node.js library to automate Chromium and other browsers using a simple and modern JavaScript API. This session gives an overview of recent changes in Puppeteer, including new features, architectural changes, and a sneak peek of what’s coming next.',
        ],
        videoId: 'ZO7XWLudGKI',
      },
      {
        speaker: 'andreban',
        title: 'Shipping a PWA as an Android app',
        blurb:
          'In this session you will learn about Bubblewrap, a new tool that developers can use to transform their PWAs into an Android application, without having to learn Android code or tooling.',
        abstract: [
          'Increase the reach of your Progressive Web App by using it as an Android app. In this session you will learn about Bubblewrap, a new tool that developers can use to transform their PWAs into an Android application, without having to learn Android code or tooling. You’ll watch us to transform an existing PWA into an Android app from start to finish, in just a few minutes.',
        ],
        videoId: 'QJlbMfW3jPc',
      },
      {
        speaker: 'demianrenzulli',
        title: 'How to Define your Install Strategy',
        blurb:
          'Learn best practices for combining different installation offerings to increase installation rates and avoid platform competition and cannibalization.',
        abstract: [
          'Learn best practices for combining different installation offerings to increase installation rates and avoid platform competition and cannibalization.',
        ],
        videoId: '6R9pupbDXYw',
      },
      {
        speaker: 'thomassteiner',
        title: "Progressively Enhancing Like It's 2003",
        blurb:
          'In this talk, we will show how new and upcoming browser capabilities can progressively enhance an application so that it remains useful on all modern browsers, but delivers an advanced experience on browsers that support capabilities like file system access, system clipboard access, contacts retrieval, periodic background sync, screen wake lock, sharing features, and many more.',
        abstract: [
          'Back in March 2003, Nick Finck and Steve Champeon stunned the web design world with the concept of progressive enhancement, a strategy for web design that emphasizes core webpage content first, and that then progressively adds more nuanced and technically rigorous layers of presentation and features on top of the content. While in 2003, progressive enhancement was about using at the time modern CSS features, unobtrusive JavaScript, and even Scalable Vector Graphics, progressive enhancement in 2020 is about using modern browser capabilities.',
          'In this talk, we will show at the example of a greeting card web application how new and upcoming browser capabilities can progressively enhance this application so that it remains useful on all modern browsers, but delivers an advanced experience on browsers that support capabilities like file system access, system clipboard access, contacts retrieval, periodic background sync, screen wake lock, sharing features, and many more.',
          'After the talk, developers will have a solid understanding of how to progressively enhance their web applications with new browser features, all while not putting a download burden on the subset of their users that happen to be on incompatible browsers, and, most importantly, while not excluding them from using the web application in the first place.',
        ],
        videoId: 'NXCT3htg9nk',
      },
      {
        speaker: 'demianrenzulli',
        title: 'Advanced PWA Patterns',
        blurb:
          'Learn advanced PWA recipes that combine several modern web APIs, and how companies are using them to create app-like experiences on their sites.',
        abstract: [
          'Learn advanced PWA recipes that combine several modern web APIs, and how companies are using them to create app-like experiences on their sites.',
        ],
        videoId: 'fhqCwDP69PI',
      },
      {
        speaker: ['pjmclachlan', 'andreban'],
        title: 'Giving Your PWA Superpowers 🦹‍♀️',
        blurb:
          'In this session we’ll introduce new features for installed PWAs, teach approaches for building better PWAs, and answer frequent developer questions about the design and future of PWAs.',
        abstract: [
          'In this session we’ll introduce new features for installed PWAs, including capabilities previously reserved for iOS/Android apps. You’ll learn approaches for building better PWAs, including Play apps that use PWAs. Finally, we’ll answer frequently asked developer questions about the design and future of PWAs.',
        ],
        videoId: 'M0wPM8B6z5c',
      },
      {
        speaker: 'pjmclachlan',
        title: 'Quieter Notifications Permissions',
        blurb:
          'This year we’ve made major changes in Chrome to reduce abuse of notifications and create a safer, better web browsing experience for Chrome users.  This session will review the recent changes, demo techniques for improving your website’s use of notifications and discuss the future of notifications on the web.',
        abstract: [
          'Notifications on the web help users receive important updates for a wide range of applications including messaging, calendars, email clients, ride sharing, social media and delivery services. Unfortunately, notifications are also used for abusive purposes. Browser notifications can be used to spam, mislead, show ads, phish or promote malware.',
          'This year we’ve made major changes in Chrome to reduce abuse of notifications and create a safer, better web browsing experience for Chrome users.  This session will review the recent changes, demo techniques for improving your website’s use of notifications and discuss the future of notifications on the web.',
        ],
        videoId: 'J_t8c9HOjBc',
      },
      {
        speaker: 'petelepage',
        title: 'Storage for the Web',
        blurb:
          "Let's dive into web storage to learn about the best way to store data in the browser, how much you can safely store, how to check your quota, how browser eviction works, how you can start Chrome with limited storage to test quota exceeded errors, and more.",
        abstract: [
          "How should we be storing data and caching our critical app resources on the client? Is IndexedDB still the best option? What about Local Storage? Let's dive into web storage to learn about the best way to store data in the browser, how much you can safely store, how to check your quota, how browser eviction works, how you can start Chrome with limited storage to test quota exceeded errors, and more.",
        ],
        videoId: 'NNuTV-gjlZQ',
      },
      {
        speaker: 'nattestad',
        title: 'Zoom on Web: Getting Connected with Advanced Web Technology',
        blurb:
          'Now more than ever, having a dependable and performant video chat connection to your friends and family is critical. The Chrome team has been collaborating with Zoom over the past few months to explore advanced new APIs that will allow for a dramatically improved web experience.',
        abstract: [
          'Now more than ever, having a dependable and performant video chat connection to your friends and family is critical. The Chrome team has been collaborating with Zoom over the past few months to explore advanced new APIs that will allow for a dramatically improved web experience.',
        ],
        videoId: 'nhTxJBgTywc',
      },
    ],
  },
  {
    title: 'Day 3',
    when: '2020-07-02T07:30Z', // 1pm IST (+5:30)
    duration: 4 * 60, // minutes
    videoId: 'klnvttPfOUM',
    playlistId: 'PLNYkxOF6rcIDJHOcBzho38p6WTn3vESvQ',
    sessions: [
      {
        speaker: 'dalmaer',
        title: 'Day Three Opening Note',
        blurb:
          'Day 3 will have us move to the Asia and Australia continents where we we will get insights from Evan You, the founder of Vue.js, share the latest on PWA and new capabilities that allow you to build rich web applications, and show how you can understand your applications deeply through the latest updates to Lighthouse.',
        abstract: [
          'Day 3 will have us move to the Asia and Australia continents where we we will get insights from Evan You, the founder of Vue.js, share the latest on PWA and new capabilities that allow you to build rich web applications, and show how you can understand your applications deeply through the latest updates to Lighthouse.',
          'Special guest: <a href="https://twitter.com/youyuxi">Evan You, Vue.js</a>',
        ],
        videoId: 'Z-JpyC16bNc',
      },
      {
        speaker: 'kosamari',
        title: 'Building Better in the World of Build Tools',
        blurb:
          "It's surprisingly difficult to choose and configure build tools in a way that produces consistent and good results. We're often forced to make tradeoff decisions in our tooling, which can stand in the way of delivering the best possible applications on the web. Come find out how we defined what's the best tool for a job and how we investigated and tested each one.",
        abstract: [
          "Build tools are an integral part of modern web development, making it possible to build great apps that are bandwidth-friendly and delivered as-needed. However, it's surprisingly difficult to choose and configure build tools in a way that produces consistent and good results. We're often forced to make tradeoff decisions in our tooling, which can stand in the way of delivering the best possible applications on the web.",
          "We developed a guide to help you choose tools which are best suited for your next project with example of how to set one up. Come find out how we defined what's the best tool for a job and how we investigated and tested each one.",
        ],
        videoId: 'vsMJiNtQWvw',
      },
      {
        speaker: 'una',
        title: '10 Modern Layouts in 1 Line of CSS',
        blurb:
          'In this dynamic talk, Una will go over the power of modern CSS layout techniques by highlighting a few key terms and how much detail can be described in a single line of code.',
        abstract: [
          'In this dynamic talk, Una will go over the power of modern CSS layout techniques by highlighting a few key terms and how much detail can be described in a single line of code. You’ll learn a few layout tricks you can implement in your codebase today, and be able to write entire swaths of layout with just a few lines of code.',
        ],
        videoId: 'qm0IfG1GyZU',
      },
      {
        speaker: ['developit', 'jakearchibald'],
        title: 'Writing Build Plugins',
        blurb:
          "Knowing how to write plugins gives you insight into how the build tool works, and makes it easier to debug the rest of your build. In this session we'll develop the same plugin for both Rollup and webpack, showing the difference between the two systems.",
        abstract: [
          "It's really common to use a build tool as part of development, but most folks don't think about writing their own plugins, which is totally understandable, as it can be pretty daunting. However, knowing how to write plugins gives you insight into how the build tool works, and makes it easier to debug the rest of your build.",
          "In this session we'll develop the same plugin for both Rollup and webpack, showing the difference between the two systems.",
        ],
        videoId: 'mr67QkDfkoQ',
      },
      {
        speaker: ['jakearchibald', 'surma'],
        title: 'Image Compression Deep-dive',
        blurb:
          'There are some rough rules for which image format you should use in a given situation, but this session will dive into why, and explore some of the lesser-known capabilities of popular image formats.',
        abstract: [
          'Images are often the biggest assets in a web page, so compressing them well can be a huge saving for users.',
          'There are some rough rules for which image format you should use in a given situation, but this session will dive into why, and explore some of the lesser-known capabilities of popular image formats.',
        ],
        videoId: 'F1kYBnY6mwg',
      },
      {
        speaker: 'sfluin',
        title: 'How to Stay Fast and Fresh with Angular',
        blurb:
          'Watch a live coding demo walking through the top principles and tools you can use to make your applications shine when it comes to startup performance and bundle size.',
        abstract: [
          'Watch a live coding demo walking through the top principles and tools you can use to make your applications shine when it comes to startup performance and bundle size.',
        ],
        videoId: 'B-lipaiZII8',
      },
      {
        speaker: ['maudn', 'samdutton'],
        title: 'Security and Privacy for the Open Web',
        blurb:
          "What's the role of the browser in enabling security and privacy by default on the open web? How are browsers changing to balance trade-offs and mitigate risk? How can you get involved?",
        abstract: [
          "What's the role of the browser in enabling security and privacy by default on the open web? How are browsers changing to balance trade-offs and mitigate risk? How can you get involved?",
        ],
        videoId: '8Tl0uQdVpxU',
      },
      {
        speaker: 'rowan_m',
        title: 'Cookie Recipes - SameSite and Beyond',
        blurb:
          'Learn about the different cookie attributes and naming conventions that will help you tailor your cookies for the right situation.',
        abstract: [
          "Cookies really can make everything better! However, you need the right recipes and you shouldn't take too many. Hopefully you've already updated your cookies for the new SameSite changes, but that one change is just a taste of what's possible. Learn about the different cookie attributes and naming conventions that will help you tailor your cookies for the right situation.",
        ],
        videoId: 'Fet6-IiX69E',
      },
      {
        speaker: 'agektmr',
        title: 'Prevent Info Leaks and Enable Powerful Features: COOP and COEP',
        blurb:
          'Cross-Origin Embedder Policy (COEP) and Cross-Origin Opener Policy (COOP) isolate your origin and enable powerful features. This session helps you understand how it works and why this is important.',
        abstract: [
          'Cross-Origin Embedder Policy (COEP) and Cross-Origin Opener Policy (COOP) isolate your origin and enable powerful features. This session helps you understand how it works and why this is important.',
        ],
        videoId: 'XLNJYhjA-0c',
      },
      {
        speaker: 'samdutton',
        title: 'Find and Fix Problems with Chrome DevTools Issues Tab',
        blurb:
          'The Chrome DevTools Issues Panel provides a structured, actionable approach to deprecations and other warnings from the browser. Learn how to use the Issues Panel to find and fix problems with your website.',
        abstract: [
          'Fed up with wading through browser messages in the console?',
          'The Chrome DevTools Issues Panel provides a more structured, actionable approach to deprecations and other warnings from the browser.',
          'This video shows you how to use the Issues Panel to find and fix problems with your website.',
        ],
        videoId: '1TbkSxQb4bI',
      },
      {
        speaker: ['maudn', 'rowan_m'],
        title: 'Just the Data you Need',
        blurb:
          "User-Agent Client Hints provide a privacy focused approach for sites to request information about the browser that's viewing them. Moving forward from the legacy of the User-Agent string is a challenge, so now is the time to experiment and give feedback.",
        abstract: [
          "User-Agent Client Hints provide a privacy focused approach for sites to request information about the browser that's viewing them. Moving forward from the legacy of the User-Agent string is a challenge, so now is the time to experiment and give feedback.",
        ],
        videoId: 'f0YY0o2OAKA',
      },
      {
        speaker: 'samdutton',
        title: 'Sign-in Form Best Practice',
        blurb:
          'Use built-in, cross-platform browser features to create signin forms that are secure, accessible and easy to use.',
        abstract: [
          'Use built-in, cross-platform browser features to create signin forms that are secure, accessible and easy to use.',
        ],
        videoId: 'alGcULGtiv8',
      },
      {
        speaker: 'agektmr',
        title: "What's New in Web Payments",
        blurb:
          'This session demystifies some of the misconceptions developers may have around Web Payments and provides an update on the subject.',
        abstract: [
          "What's happening with Web Payments? How is it different from Google Pay or Apple Pay? This session demystifies some of the misconceptions developers may have and provides an update on topics around Web Payments.",
        ],
        videoId: 'ZXmKKV7R72c',
      },
    ],
  },
];

// Include parsed Date objects for each day.
for (const day of days) {
  // nb. We specify dates with a "Z" suffix, which effectively means 'parse in
  // UTC'.
  day.date = new Date(day.when);
}

// TODO: Placeholder data for testing, replace with real data once available.
// prettier-ignore
const communityEvents = {
  'North America': [
    {
      place: 'Indianapolis',
      country: 'USA',
      date: new Date('2020-07-23'),
      marker: '39.7794493,-86.4122414',
      link: 'https://www.meetup.com/gdg-indy/events/271345952/',
    },
    {
      place: 'Fredericton',
      country: 'Canada',
      date: new Date('2020-08-01'),
      marker: '45.9451213,-66.9457401',
      link: 'https://www.meetup.com/GDG-Fredericton-NB/events/271396869/',
    },
    {
      place: 'New York',
      country: 'USA',
      date: new Date('2020-07-15'),
      marker: '40.6961398,-74.5387144',
      link: 'https://www.meetup.com/gdgnyc/events/271424273/',
    },
  ],
  'South America': [
    {
      place: 'Cali',
      country: 'Colombia',
      date: new Date('2020-07-11'),
      marker: '3.3950543,-76.6654052',
      link: 'https://www.meetup.com/GDGCali/events/271357490/',
    },
    {
      place: 'Campinas',
      country: 'Brazil',
      date: new Date('2020-07-14'),
      marker: '-22.8949777,-47.310532',
      link: 'https://www.meetup.com/pt-BR/gdgcampinas/',
    },
  ],
  Asia: [
    {
      place: 'Bhubaneswar',
      country: 'India',
      date: new Date('2020-07-09'),
      marker: '20.3008287,85.6807125',
      link: 'https://webdevlivein.web.app',
    },
    {
      place: 'Bursa',
      country: 'Turkey',
      date: new Date('2020-07-18'),
      marker: '40.2213419,28.7527983',
      link: 'https://www.meetup.com/tr-TR/GDGBursa/events/271394720/',
    },
    {
      place: 'Cebu City',
      country: 'Philippines',
      date: new Date('2020-08-01'),
      marker: '10.3787343,123.7065536',
      link: 'https://www.meetup.com/GDGCebu/events/271473987/',
    },
    {
      place: 'Colombo',
      country: 'Sri Lanka',
      date: new Date('2020-07-16'),
      marker: '6.9218336,79.7863371',
      link: 'https://www.meetup.com/GDG-LK/events/271601256/',
    },
    {
      place: 'Bandung',
      country: 'Indonesia',
      date: new Date('2020-07-11'),
      marker: '-6.9034291,107.5034163',
      link: 'https://web.gdgbandung.dev',
    },
    {
      place: 'Kuala Lumpur',
      country: 'Malaysia',
      date: new Date('2020-07-18'),
      marker: '3.1384966,101.5472482',
      link: 'https://gdgkl-webdev-live.peatix.com',
    },
    {
      place: 'Islamabad',
      country: 'Pakistan',
      date: new Date('2020-07-18'),
      marker: '33.6148588,72.5270609',
      link: '#',
    },
  ],
  Europe: [
    {
      place: 'Nantes',
      country: 'France',
      date: new Date('2020-08-24'),
      marker: '47.2382006,-1.6302672',
      link: 'https://ask-the-expert-live.web.app',
    },
    {
      place: 'London',
      country: 'UK',
      date: new Date('2020-08-01'),
      marker: '51.5273134,-0.660608',
      link: 'https://www.eventbrite.co.uk/e/devparty-webdev-live-with-gdg-uk-ireland-tickets-111092001166',
    },
    {
      place: 'Moscow',
      country: 'Russia',
      date: new Date('2020-07-11'),
      marker: '55.5769386,36.2674211',
      link: 'https://www.meetup.com/GDG-Moscow/events/271352597/',
    },
  ],
};

// prettier-ignore
const qAndAs = [
  {
    category: 'Web Vitals',
    question: 'Is there a tool to help us quantify LCP, FID, CLS (not in percentiles)?',
    answer: 'To get your raw LCP, FID and CLS scores, you can look at the Chrome UX Report in BigQuery (for field data) and at Lighthouse (for lab data). You can also use the <a href="https://github.com/GoogleChrome/web-vitals">web-vitals.js library</a> and <a href="https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en">Web Vitals extension</a> to see individual Core web Vitals in the wild.',
  },
  {
    category: 'Web Vitals',
    question: 'Why have we moved to 75th percentile?',
    answer: 'You can see rationale at <a href="https://web.dev/defining-core-web-vitals-thresholds/">https://web.dev/defining-core-web-vitals-thresholds/</a>.',
  },
  {
    category: 'Web Vitals',
    question: 'Is it possible to configure the Core Web Vitals metrics thresholds during build time? or as part of your CI process?',
    answer: 'Core Web Vitals prescribe a specific set of metrics thresholds and percentiles we believe correspond well to user expectations across a range of devices. We encourage using our official thresholds as much as possible. If however, you would like to set custom targets for thresholds (e.g an LCP performance budget of < 3s), this is possible using Lighthouse CI and LightWallet. You can find a more detailed answer on <a href="https://stackoverflow.com/questions/62682873/are-the-core-web-vitals-metrics-configurable-at-build-time/62682874">Stackoverflow.</a>',
  },
  {
    category: 'Web Vitals',
    question: 'Do Web Vitals metrics get tested against low bandwidth connections too?',
    answer: 'Chrome UX report, the source for these metrics, reports real user metrics so yes, bandwidth connections are taken into account.',
  },
  {
    category: 'Web Vitals',
    question: '#webdevLIVE how do you get field values and how do you get lab values for core web vitals?',
    answer: 'For field data you can look at <a href="https://developers.google.com/web/tools/chrome-user-experience-report">Chrome UX Report</a> data, available in tools like <a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a>, <a href="https://web.dev/chrome-ux-report-data-studio-dashboard/">DataStudio</a>  and the <a href="https://developers.google.com/web/tools/chrome-user-experience-report/api/reference">CrUX API</a>. For lab data, you can use Lighthouse (either in the <a href="https://developers.google.com/web/tools/lighthouse#devtools">Lighthouse panel in DevTools</a>, via the <a href="https://developers.google.com/web/tools/lighthouse#cli">CLI</a>, or in <a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a>).',
  },
  {
    category: 'Web Vitals',
    question: 'Does on-scroll animation give a bad CLS score?',
    answer: 'The CLS metric excludes layout shifts if there was user input within 500ms of the shift. However, scrolling is not considered "user input" for the purposes of calculating CLS, so scroll-driven animations could give a bad CLS if not implemented properly (e.g. animating/transitioning the `transform` property, which does not cause layout shifts). As always, the best way to know for sure is to test your page and see if your scroll-driven animations are causing an increase in CLS.',
  },
  {
    category: 'Performance',
    question: 'What’s the best way to measure responsiveness of an interaction (not just page load)?',
    answer: 'FID is the best way to measure the responsiveness of the first interaction with a page. For other interactions, Chrome is shipping the Event Timing API in M85 (currently in Chrome Canary), which I\'d recommend taking a look at <a href="https://www.chromestatus.com/feature/5167290693713920">https://www.chromestatus.com/feature/5167290693713920</a>',
  },
  {
    category: 'Performance',
    question: 'How long does it take to see changes in field data? I get good lab scores but field data seems the same even though I made major changes.',
    answer: 'Media field data in these tools is based on the previous 28-day period, so it could take a while changes to show up',
  },
  {
    category: 'Performance',
    question: 'Can we also access specific urls rather than only domains with the crux dashboard?',
    answer: 'The CrUX Dashboard currently only supports origin-level data from the BigQuery dataset.',
  },
  {
    category: 'Performance',
    question: 'Does this CrUX tool rely on embedding javascript to collect metrics for analysis?',
    answer: 'All of the data included in the CrUX dataset is measured directly by Chrome, without any instrumentation on the websites themselves.',
  },
  {
    category: 'Performance',
    question: 'How do you implement image width and height for responsive?',
    answer: 'Two answers here. Ideally, your different sources have the same aspect ratio. For art direction with &lt;picture&gt;, there is work being explored to add width/height to &lt;source&gt; elements.',
  },
  {
    category: 'Performance',
    question: '#webdevLIVE if Search Console shows your CLS as high, but using Page Speed Insights & Lighthouse look great for the example Url, what could be going on?',
    answer: 'There is some nuance to how PageSpeed Insights (PSI) and Search Console report on Cumulative Layout Shift. The lab portion (Lighthouse) of PSI measures CLS until Lighthouse considers a page fully loaded. Search Console and the field portion of the PSI uses Chrome UX Report data and measures CLS until unload, stopping reporting after pagehidden. What this means is that the reporting you see in different tools can vary based on the window of time we are able to look at. Lab tools like Lighthouse have to define a shorter window because they are focused on the experience during page load and optimize for delivering information about the experience quickly. Field data is able to take a more holistic view of the user-experience, which could include shifts caused after a page has loaded and the user has scrolled down to other interactions contributing to CLS. See the detailed answer <a href="https://stackoverflow.com/questions/62682709/why-does-cumulative-layout-shift-differ-between-pagespeed-insights-and-search-co/62682710#62682710">here</a>.',
  },
  {
    category: 'Performance',
    question: 'Does "reduce initial server response time" audit take into account all API times up until LCP or is it just for the initial navigation?',
    answer: '"Server response time" is just for the initial navigation of the HTML page.',
  },
  {
    category: 'Performance',
    question: 'Any insights on how to optimize page transitions in SPA websites and how to feed crux with page transitions?',
    answer: 'Measuring SPA navigation performance is something the Chrome metrics team and other teams are actively working on 🙂',
  },
  {
    category: 'Performance',
    question: 'What can we do if we see long tasks from Google Analytics OR Doubleclick scripts ? I am sure the respective team knows about this but it hasn\'t been addressed so far?',
    answer: 'Yes, sometimes third party scripts (including Google\'s) will contain long tasks, and we\'re working with those teams to help them reduce those.',
  },
  {
    category: 'Performance',
    question: 'How do you do a fallback for webp in amp-img for Wordpress #webdevLive?',
    answer: 'The AMP cache does that for you.',
  },
  {
    category: 'Performance',
    question: 'You mentioned that web vitals will impact seo rankings. Can you send a link to the announcement?',
    answer: '<a href="https://developers.google.com/search/docs/guides/page-experience">https://developers.google.com/search/docs/guides/page-experience</a>.',
  },
  {
    category: 'Performance',
    question: 'Can a worker handle input events?',
    answer: 'You can handle input events on the main thread and then marshall the data to your worker for processing. Workers can\'t receive input directly.',
  },
  {
    category: 'Tools',
    question: 'Is there anything on HTTP Status code w.r.t DevTools that can help us easily to identify  in an eye catching way...',
    answer: 'The Network tab highlights responses with an HTTP status code that indicates an error. The text of affected rows is red. However, you\'re right: this is not very accessible -- we shouldn\'t just rely on color to communicate the failure. I\'ve filed <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=1101323">https://bugs.chromium.org/p/chromium/issues/detail?id=1101323</a> to improve the situation.',
  },
  {
    category: 'PWA',
    question: 'Can we call OS functionality from PWAs?',
    answer: 'No, developers only have access to the capabilities of the browser, but we’re working to add new capabilities with our  capabilities project.',
  },
  {
    category: 'PWA',
    question: 'What was the philosophy behind the Fugu name?',
    answer: 'Fugu reminds us to respect and protect the user. The fugu fish is a wonderful delicacy, it tastes wonderful. But, if it’s handled improperly it can be deadly. We feel the same way with Fugu features, they open up new scenarios on the web. But if implemented poorly, they could potentially be dangerous.',
  },
  {
    category: 'PWA',
    question: 'Is it okay to make the pathname `.well-known/assetlinks.json.` be accsessible publicly?',
    answer: 'Yes, it needs to be publicly accessible so an Android app can verify it as necessary.',
  },
  {
    category: 'PWA',
    question: 'When will we get multi window support?',
    answer: 'Multi-window support is something we\'re working on, mostly being led by the team at Microsoft.',
  },
  {
    category: 'PWA',
    question: 'Can you give me an API that makes it easier to sync storage.',
    answer: 'Take a look at <a href="https://firebase.google.com/products/firestore">Cloud Firestore</a>, it’s an API that provides a sync datastore in the cloud.',
  },
  {
    category: 'Performance',
    question: 'How do we drill down long tasks to understand exactly what JS function generated it?',
    answer: 'You should see JS stacks if you record performance profiles, those should help you drill down.',
  },
  {
    category: 'Tools',
    question: 'Can you share an info link for the color vision deficiency emulation in Chrome DevTools?',
    answer: 'You can find more details at <a href="https://developers.google.com/web/updates/2020/03/devtools">https://developers.google.com/web/updates/2020/03/devtools</a>.',
  },
  {
    category: 'PWA',
    question: 'Do we have top level await support on the web yet?',
    answer: 'Sadly not yet, keep an eye on <a href="https://chromestatus.com/features/5767881411264512">https://chromestatus.com/features/5767881411264512</a> for details as it progresses.',
  },
  {
    category: 'PWA',
    question: 'What are the best features of service workers?',
    answer: 'Service Workers let developers intercept their web app\'s outgoing requests. You can generate responses from caches or other sources, which can be more reliable & faster than going against the network. Read <a href="https://web.dev/service-workers-cache-storage/">this</a> and many other articles on web.dev to understand their use cases.',
  },
  {
    category: 'UX',
    question: 'How do you add dark mode on your website?',
    answer: 'Refer <a href="https://web.dev/prefers-color-scheme/">https://web.dev/prefers-color-scheme/</a>.',
  },
  {
    category: 'UX',
    question: 'My website sign in page has lots of fields. What is the best way to present them all?',
    answer: 'Check out <a href="https://web.dev/sign-in-form-best-practices/">https://web.dev/sign-in-form-best-practices/</a>.',
  },
  {
    category: 'Tools',
    question: 'Can you make selected context only persist in Chrome Devtools?',
    answer: 'This behavior has recently been fixed in Chrome DevTools and will be available for developers to use in <a href="https://developers.google.com/web/updates/2020/06/devtools#selected-context">Chrome M85</a> (July’20).',
  },
  {
    category: 'Tools',
    question: 'Can you export HAR through Puppeteer?',
    answer: 'No, but there\'s a userland puppeteer-har implementation that handles this.',
  },
  {
    category: 'PWA',
    question: 'Will permission request be improved (customisation and specifying the source of the request)?',
    answer: 'We don\'t allow customization of the prompt at the moment. We do recommend, though, to prompt contextually, so the user knows why the prompt shows up.',
  },
  {
    category: 'PWA',
    question: 'Any updates on the A2HS button? (Google promised to change it to Install button)',
    answer: 'On desktop it says install, but on mobile, it is still Add to Home Screen. We want to get this right, and are still investigating what works best for users.',
  },
  {
    category: 'Tools',
    question: 'Do you recommend using Workbox instead of coding the SW directly?',
    answer: 'When first getting started, absolutely. Service Workers are really powerful, and as a result can be very complex. Once you’ve got a handle on some of the complexities, it’s OK to start down your own path.',
  },
  {
    category: 'PWA',
    question: 'Are installed PWA\'s still crawl-able by Googlebot?',
    answer: 'As long as they are reachable with a public URL, they should be indexable. See Martin Splitt\'s talks from web.dev LIVE day 1 (<a href="https://www.youtube.com/watch?v=himvKu12YCY&list=PLNYkxOF6rcIDC0-BiwSL52yQ0n9rNozaF">Debugging JS SEO issues</a> & <a href="https://www.youtube.com/watch?v=hBKZnaIMm4M&list=PLNYkxOF6rcIDC0-BiwSL52yQ0n9rNozaF">Implementing Structured Data with JS</a>) to learn more.',
  },
  {
    category: 'PWA',
    question: 'Does AppCache still exist?',
    answer: 'Yes, but it’s going away very soon! See <a href="https://web.dev/appcache-removal/">https://web.dev/appcache-removal/</a>.',
  },
  {
    category: 'UX',
    question: 'Is the Portal tag available now?',
    answer: 'It\'s going to origin trial very soon! Check out <a href="https://web.dev/hands-on-portals/">https://web.dev/hands-on-portals/</a> for the latest.',
  },
  {
    category: 'PWA',
    question: 'Can you please mention what can be used in place of localstorage and Appcache?',
    answer: 'We recommend <a href="https://web.dev/storage-for-the-web/#recommendation">Service Workers and IndexedDB</a>.',
  },
  {
    category: 'PWA',
    question: 'Do Opaque Responses still have the 7MB padding applied? The Storage Quota becomes really tricky to manage on a large site with lots of third-party requests.',
    answer: 'Yes, the padding still applies to opaque responses (context: <a href="https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses/39109790#39109790">https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses/39109790#39109790</a>).',
  },
  {
    category: 'PWA',
    question: 'What about storage from PWAs? If say someone wrote important information in a note writing app for long term storage and didn\'t visit for a long time, does this mean that chrome could evict that?',
    answer: 'Yes, for that you should request <a href="https://web.dev/persistent-storage/">persistent storage</a>.',
  },
  {
    category: 'PWA',
    question: 'Do you need service workers to use the Cache API?',
    answer: 'Typically yes, but you can also use the cache API from a page.',
  },
  {
    category: 'Tools',
    question: 'Wouldn\'t it be more handy if we could emulate a disk limit via DevTools?',
    answer: 'Yes, absolutely, and it’s coming. Just hasn’t landed yet.',
  },
  {
    category: 'PWA',
    question: 'How does Indexed DB work and what are its features?',
    answer: 'See documentation for <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">IndexedDB on MDN</a> for more.',
  },
  {
    category: 'PWA',
    question: '\'Cookies have some uses\' - so when should you use cookies, and when indexedDB?',
    answer: 'We\'ve got specific details at <a href="https://web.dev/storage-for-the-web/">https://web.dev/storage-for-the-web/</a>.',
  },
];

module.exports = {
  isPreEvent: false,
  isDuringEvent: false,
  isPostEvent: true,
  days,
  communityEvents,
  qAndAs,
};

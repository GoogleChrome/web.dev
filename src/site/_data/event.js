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
    videoId: null,
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
      },
      {
        speaker: 'egsweeny',
        title: "What's New in Speed Tooling",
        blurb:
          'This talk will cover where to measure your Core Web Vitals in the lab and in the field, as well as how to leverage the newest features and products to build and maintain exceptionally fast experiences for all of your users.',
        abstract: [
          "Our understanding of how to effectively measure and optimize a users' experience is continually evolving, and we keep our metrics and tooling updated to reflect the latest in our learnings. This talk will cover where to measure your Core Web Vitals in the lab and in the field, as well as how to leverage the newest features and products to build and maintain exceptionally fast experiences for all of your users.",
        ],
      },
      {
        speaker: 'addyosmani',
        title: 'How to Optimize for Web Vitals',
        blurb:
          "In this hands-on talk, we'll cover tips & tricks for optimizing your user-experience to meet the Core Web Vitals. We'll use tools like Lighthouse & DevTools, show you code snippets for fixes and highlight how you too can get fast and stay fast.",
        abstract: [
          "In this hands-on talk, we'll cover tips & tricks for optimizing your user-experience to meet the Core Web Vitals. We'll use tools like Lighthouse & DevTools, show you code snippets for fixes and highlight how you too can get fast and stay fast.",
          "Optimizing for quality of user experience is key to the long-term success of any site on the web. Whether you're a business owner, marketer, or developer, Core Web Vitals can help you quantify the experience of your site and identify opportunities to improve.",
        ],
      },
      {
        speaker: 'rviscomi',
        title: 'Mastering the Chrome UX Report on BigQuery',
        blurb:
          'Learn how to query the Chrome UX Report using our new summary datasets and shortcut functions, so you can extract insights quickly and cheaply like a pro.',
        abstract: [
          "There is so much information in the Chrome UX Report dataset on BigQuery, it could feel overwhelming at first. We've been hard at work making sure that the treasure trove of web transparency data is accessible to every developer. Learn how to query the Chrome UX Report using our new summary datasets and shortcut functions, so you can extract insights quickly and cheaply like a pro.",
        ],
      },
      {
        speaker: 'houssein',
        title: 'How to Analyze Your JavaScript Bundles',
        blurb:
          'Learn how to analyze your bundled JavaScript code and to spot common issues that can easily bloat up your application size.',
        abstract: [
          'Learn how to analyze your bundled JavaScript code and to spot common issues that can easily bloat up your application size.',
        ],
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
      },
      {
        speaker: ['nainar', 'sebabenz'],
        title: 'AMP at Your Service',
        blurb:
          "Naina and Sebastian discuss how AMP makes web development less painful and why it's time to move away from paired AMP.",
        abstract: [
          "The one where Naina and Sebastian discuss how AMP makes web development less painful and why it's time to move away from paired AMP.",
        ],
      },
      {
        speaker: ['crystallambert', 'morss'],
        title: 'Workerized JavaScript Made Easy',
        blurb:
          'In this talk we chat about how to use &lt;amp-script&gt; to create your very own Workerized JS browser interactions!',
        abstract: [
          "When JavaScript lives in a Worker, it runs in a separate thread. Thus, it can't block the browser from creating smooth user experiences! Unfortunately, since Workers can't access the DOM directly, you can't just stick your JavaScript into a Worker. Fortunately, last year, AMP introduced &lt;amp-script&gt;, a component that makes this straightforward. In this talk we chat about how to use &lt;amp-script&gt; to create your very own Workerized JS browser interactions!",
        ],
      },
      {
        speaker: 'martinsplitt',
        title: 'Debugging JavaScript SEO issues',
        blurb:
          'Diagnosing common JavaScript SEO issues and helpful steps to debug them!',
        abstract: [
          'Diagnosing common JavaScript SEO issues and helpful steps to debug them!',
        ],
      },
      {
        speaker: 'martinsplitt',
        title: 'Implementing Structured Data with JavaScript',
        blurb:
          'In this session we walk through typical approaches to add structured data to your pages, both in popular frameworks as well as vanilla JavaScript.',
        abstract: [
          'If you are building a great website with JavaScript, you want it to stand out in Google Search, too. To be eligible for rich results, you need to add structured data to your pages. In this session we walk through typical approaches to do this both in popular frameworks as well as vanilla JavaScript.',
        ],
      },
    ],
  },
  {
    title: 'Day 2',
    when: '2020-07-01T12:00Z', // 12pm GMT/UTC (+0), note UK time will be 1pm
    duration: 3 * 60, // minutes
    videoId: null,
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
      },
      {
        speaker: 'paullewis',
        title: "What's New in DevTools",
        blurb:
          "Let's take a look at the latest and greatest features in Chrome's DevTools!",
        abstract: [
          "Let's take a look at the latest and greatest features in Chrome's DevTools. We'll cover how you can use the Performance Panel to assess your page load metrics, how you can locate issues with your pages, debug your Web Assembly, and even emulate color vision deficiencies.",
        ],
      },
      {
        speaker: ['syg', 'leszeks'],
        title: "What's New in V8/JavaScript",
        blurb:
          'Shu and Leszek take a tour of some of the new features and improvements that have landed in JavaScript and V8.',
        abstract: [
          "What exciting things happened in the JavaScript language and the V8 engine in 2019? Shu and Leszek take a tour of some new features and improvements. For JavaScript, you'll learn about new syntax, like optional chaining and nullish coalescing, that make expressing common patterns a breeze, as well as the powerful new weak references that may help plug memory leaks. For V8, you'll learn how the engine got faster with streaming parsing and slimmer with pointer compression.",
        ],
      },
      {
        speaker: 'mathiasbynens',
        title: "What's New in Puppeteer",
        blurb:
          'This session gives an overview of recent changes in Puppeteer, including new features, architectural changes, and a sneak peek of what’s coming next.',
        abstract: [
          'The Chrome team maintains Puppeteer, a Node.js library to automate Chromium and other browsers using a simple and modern JavaScript API. This session gives an overview of recent changes in Puppeteer, including new features, architectural changes, and a sneak peek of what’s coming next.',
        ],
      },
      {
        speaker: 'andreban',
        title: 'Shipping a PWA as an Android app',
        blurb:
          'In this session you will learn about Bubblewrap, a new tool that developers can use to transform their PWAs into an Android application, without having to write native code or learn native tooling.',
        abstract: [
          'Increase the reach of your Progressive Web App by using it as an Android app. In this session you will learn about Bubblewrap, a new tool that developers can use to transform their PWAs into an Android application, without having to write native code or learn native tooling. You’ll watch us to transform an existing PWA into a native app from start to finish, in just a few minutes.',
        ],
      },
      {
        speaker: 'demianrenzulli',
        title: 'How to Define your Install Strategy',
        blurb:
          'Learn best practices for combining different installation offerings to increase installation rates and avoid platform competition and cannibalization.',
        abstract: [
          'Learn best practices for combining different installation offerings to increase installation rates and avoid platform competition and cannibalization.',
        ],
      },
      {
        speaker: 'thomassteiner',
        title: "Progressively Enhancing Like It's 2003",
        blurb:
          'In this talk, we will show how new and upcoming browser capabilities can progressively enhance an application so that it remains useful on all modern browsers, but delivers an advanced experience on browsers that support capabilities like native file system access, system clipboard access, contacts retrieval, periodic background sync, screen wake lock, sharing features, and many more.',
        abstract: [
          'Back in March 2003, Nick Finck and Steve Champeon stunned the web design world with the concept of progressive enhancement, a strategy for web design that emphasizes core webpage content first, and that then progressively adds more nuanced and technically rigorous layers of presentation and features on top of the content. While in 2003, progressive enhancement was about using at the time modern CSS features, unobtrusive JavaScript, and even Scalable Vector Graphics, progressive enhancement in 2020 is about using modern browser capabilities.',
          'In this talk, we will show at the example of a greeting card web application how new and upcoming browser capabilities can progressively enhance this application so that it remains useful on all modern browsers, but delivers an advanced experience on browsers that support capabilities like native file system access, system clipboard access, contacts retrieval, periodic background sync, screen wake lock, sharing features, and many more.',
          'After the talk, developers will have a solid understanding of how to progressively enhance their web applications with new browser features, all while not putting a download burden on the subset of their users that happen to be on incompatible browsers, and, most importantly, while not excluding them from using the web application in the first place.',
        ],
      },
      {
        speaker: 'demianrenzulli',
        title: 'Advanced PWA Patterns',
        blurb:
          'Learn advanced PWA recipes that combine several modern web APIs, and how companies are using them to create app-like experiences on their sites.',
        abstract: [
          'Learn advanced PWA recipes that combine several modern web APIs, and how companies are using them to create app-like experiences on their sites.',
        ],
      },
      {
        speaker: ['pjmclachlan', 'andreban'],
        title: 'Giving Your PWA Superpowers 🦹‍♀️',
        blurb:
          'In this session we’ll introduce new features for installed PWAs, teach approaches for building better PWAs, and answer frequent developer questions about the design and future of PWAs.',
        abstract: [
          'In this session we’ll introduce new features for installed PWAs, including capabilities previously reserved for native apps. You’ll learn approaches for building better PWAs, including Play apps that use PWAs. Finally, we’ll answer frequently asked developer questions about the design and future of PWAs.',
        ],
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
      },
      {
        speaker: 'petelepage',
        title: 'Storage for the Web',
        blurb:
          "Let's dive into web storage to learn about the best way to store data in the browser, how much you can safely store, how to check your quota, how browser eviction works, how you can start Chrome with limited storage to test quota exceeded errors, and more.",
        abstract: [
          "How should we be storing data and caching our critical app resources on the client? Is IndexedDB still the best option? What about Local Storage? Let's dive into web storage to learn about the best way to store data in the browser, how much you can safely store, how to check your quota, how browser eviction works, how you can start Chrome with limited storage to test quota exceeded errors, and more.",
        ],
      },
      {
        speaker: 'nattestad',
        title: 'Zoom on Web: Getting Connected with Advanced Web Technology',
        blurb:
          'Now more than ever, having a dependable and performant video chat connection to your friends and family is critical. The Chrome team has been collaborating with Zoom over the past few months to explore advanced new APIs that will allow for a dramatically improved web experience.',
        abstract: [
          'Now more than ever, having a dependable and performant video chat connection to your friends and family is critical. The Chrome team has been collaborating with Zoom over the past few months to explore advanced new APIs that will allow for a dramatically improved web experience.',
        ],
      },
    ],
  },
  {
    title: 'Day 3',
    when: '2020-07-02T07:30Z', // 1pm IST (+5:30)
    duration: 4 * 60, // minutes
    videoId: null,
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
      },
      {
        speaker: 'una',
        title: '10 Modern Layouts in 1 Line of CSS',
        blurb:
          'In this dynamic talk, Una will go over the power of modern CSS layout techniques by highlighting a few key terms and how much detail can be described in a single line of code.',
        abstract: [
          'In this dynamic talk, Una will go over the power of modern CSS layout techniques by highlighting a few key terms and how much detail can be described in a single line of code. You’ll learn a few layout tricks you can implement in your codebase today, and be able to write entire swaths of layout with just a few lines of code.',
        ],
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
      },
      {
        speaker: 'sfluin',
        title: 'How to Stay Fast and Fresh with Angular',
        blurb:
          'Watch a live coding demo walking through the top principles and tools you can use to make your applications shine when it comes to startup performance and bundle size.',
        abstract: [
          'Watch a live coding demo walking through the top principles and tools you can use to make your applications shine when it comes to startup performance and bundle size.',
        ],
      },
      {
        speaker: ['maudn', 'samdutton'],
        title: 'Security and Privacy for the Open Web',
        blurb:
          "What's the role of the browser in enabling security and privacy by default on the open web? How are browsers changing to balance trade-offs and mitigate risk? How can you get involved?",
        abstract: [
          "What's the role of the browser in enabling security and privacy by default on the open web? How are browsers changing to balance trade-offs and mitigate risk? How can you get involved?",
        ],
      },
      {
        speaker: 'rowan_m',
        title: 'Cookie Recipes - SameSite and Beyond',
        blurb:
          'Learn about the different cookie attributes and naming conventions that will help you tailor your cookies for the right situation.',
        abstract: [
          "Cookies really can make everything better! However, you need the right recipes and you shouldn't take too many. Hopefully you've already updated your cookies for the new SameSite changes, but that one change is just a taste of what's possible. Learn about the different cookie attributes and naming conventions that will help you tailor your cookies for the right situation.",
        ],
      },
      {
        speaker: 'agektmr',
        title: 'Prevent Info Leaks and Enable Powerful Features: COOP and COEP',
        blurb:
          'Cross-Origin Embedder Policy (COEP) and Cross-Origin Opener Policy (COOP) isolate your origin and enable powerful features. This session helps you understand how it works and why this is important.',
        abstract: [
          'Cross-Origin Embedder Policy (COEP) and Cross-Origin Opener Policy (COOP) isolate your origin and enable powerful features. This session helps you understand how it works and why this is important.',
        ],
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
      },
      {
        speaker: ['maudn', 'rowan_m'],
        title: 'Just the Data you Need',
        blurb:
          "User-Agent Client Hints provide a privacy focused approach for sites to request information about the browser that's viewing them. Moving forward from the legacy of the User-Agent string is a challenge, so now is the time to experiment and give feedback.",
        abstract: [
          "User-Agent Client Hints provide a privacy focused approach for sites to request information about the browser that's viewing them. Moving forward from the legacy of the User-Agent string is a challenge, so now is the time to experiment and give feedback.",
        ],
      },
      {
        speaker: 'samdutton',
        title: 'Sign-in Form Best Practice',
        blurb:
          'Use built-in, cross-platform browser features to create signin forms that are secure, accessible and easy to use.',
        abstract: [
          'Use built-in, cross-platform browser features to create signin forms that are secure, accessible and easy to use.',
        ],
      },
      {
        speaker: 'agektmr',
        title: "What's New in Web Payments",
        blurb:
          'This session demystifies some of the misconceptions developers may have around Web Payments and provides an update on the subject.',
        abstract: [
          "What's happening with Web Payments? How is it different from Google Pay or Apple Pay? This session demystifies some of the misconceptions developers may have and provides an update on topics around Web Payments.",
        ],
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

// TODO: Dummy data for testing, replace with real data once available.
const communityEvents = {
  'North America': [
    {
      place: 'Austin',
      date: new Date(),
      marker: '30.3074624,-99.9946506',
    },
    {
      place: 'San Francisco',
      date: new Date(),
      marker: '40.718217,-73.998284',
    },
  ],
  Europe: [
    {
      place: 'Zurich',
      date: new Date(),
      marker: '47.3774337,8.4666757',
    },
  ],
};

const qAndAs = [
  {
    category: '',
    question: '',
    answer: '',
  },
];

module.exports = {
  isPreEvent: true,
  isDuringEvent: false,
  isPostEvent: false,
  days,
  communityEvents,
  qAndAs,
};

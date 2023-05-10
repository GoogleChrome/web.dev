---
title: Optimize First Input Delay
subhead: How to respond faster to user interactions.
authors:
  - houssein
  - addyosmani
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/WH0KlcJXJlxvsxU9ow2i.jpg
alt: A hand touching a smartphone screen
description: |
  First Input Delay (FID) measures the time from when a user first interacts with your site
  to the time when the browser is actually able to respond to that interaction. Learn how to
  optimize FID by minimizing unused JavaScript, breaking up Long Tasks, and improving interaction
  readiness.
tags:
  - blog
  - performance
  - web-vitals
---

{% Aside 'important' %}
FID will be [replaced by Interaction to Next Paint (INP)](/inp-cwv/) as a Core Web Vital in March 2024.
{% endAside %}

<blockquote>
  <p>
    I clicked but nothing happened! Why can't I interact with this page? 😢
  </p>
</blockquote>

[First Contentful Paint](/fcp/) (FCP) and [Largest Contentful
Paint](/lcp/) (LCP) are both metrics that measure the time it takes for content to
visually render (paint) on a page. Although important, paint times do not capture _load
responsiveness_: or how quickly a page responds to user interaction.

[First Input Delay](/fid/) (FID) is a [Core Web Vitals](/vitals/) metric that captures a user's
first impression of a site's interactivity and responsiveness. It measures the time from when a user
first interacts with a page to the time when the browser is actually able to respond to that
interaction. FID is a [field metric](/user-centric-performance-metrics/#in-the-field) and cannot be
simulated in a lab environment. **A real user interaction** is required in order to measure the
response delay.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="Good fid values are 2.5 seconds, poor values are greater than 4.0 seconds and anything in between needs improvement", width="384", height="96" %}
</picture>

To help predict FID in the [lab](/how-to-measure-speed/#lab-data-vs-field-data), we
recommend [Total Blocking Time (TBT)](/tbt/). They measure different things, but
improvements in TBT usually correspond to improvements in FID.

The main cause of a poor FID is **heavy JavaScript execution**. Optimizing how JavaScript parses,
compiles, and executes on your web page will directly reduce FID.

## Heavy JavaScript execution

The browser cannot respond to most user input while it's executing JavaScript on the main thread. In other words, the
browser can't respond to user interactions while the main thread is busy. To improve this:

- [Break up Long Tasks](#long-tasks)
- [Optimize your page for interaction readiness](#optimize-interaction-readiness)
- [Use a web worker](#use-a-web-worker)
- [Reduce JavaScript execution time](#reduce-javascript-execution)

## Break up Long Tasks {: #long-tasks }

If you've already attempted to reduce the amount of JavaScript that loads on a single page, it can
be useful to break down long-running code into **smaller, asynchronous tasks**.

[**Long Tasks**](/custom-metrics/#long-tasks-api) are JavaScript execution periods where users may
find your UI unresponsive. Any piece of code that blocks the main thread for 50 ms or more can be
characterized as a Long Task. Long Tasks are a sign of
potential JavaScript bloat (loading and executing more than a user may need right now).
Splitting up long tasks can reduce input delay on your site.

<figure>
  {% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Long Tasks in Chrome DevTools", width="800", height="132" %}
  <figcaption>Chrome DevTools <a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">visualizes Long Tasks</a> in the Performance Panel</figcaption>
</figure>

FID should improve noticeably as you adopt best practices like code-splitting and breaking up your
Long Tasks. While TBT is not a field metric, it's useful for checking progress towards ultimately
improving both Time To Interactive (TTI) and FID.

{% Aside %}
For more information, take a look at [Are long JavaScript tasks delaying your Time to
Interactive?](/long-tasks-devtools/).
{% endAside %}

## Optimize your page for interaction readiness

There are a number of common causes for poor FID and TBT scores in web apps that rely heavily on
JavaScript:

### First-party script execution can delay interaction readiness

- JavaScript size bloat, heavy execution times and inefficient chunking can slow down how soon a
  page can respond to user input and impact FID, TBT, and TTI. Progressive loading of code and
  features can help spread this work out and improve interaction readiness.
- Server-side rendered apps may look like they're getting pixels painted on the screen
  quickly, but beware of user interactions being blocked by large script executions (e.g.
  re-hydration to wire up event listeners). This can take several hundred milliseconds, sometimes
  even seconds, if route-based code splitting is being used. Consider shifting more logic
  server-side or generating more content statically during build time.

Below are the TBT scores before and after optimizing first-party script loading for an
application. By moving costly script loading (and execution) for a non-essential component off the
critical path, users were able to interact with the page much sooner.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEIbBnIAyfzIoQtvXvMk.png", alt="Improvements in TBT score in Lighthouse after optimizing the first-party script.", width="800", height="148" %}

### Data-fetching can impact many aspects of interaction readiness

- Waiting on a waterfall of cascading fetches (e.g. JavaScript and data fetches for components) can
  impact interaction latency. Aim to minimize a reliance on cascading data fetches.
- Large inline datastores can push out HTML parsing time and impact both paint and interaction
  metrics. Aim to minimize how much data needs to be post-processed on the client-side.

### Third-party script execution can delay interaction latency too

- Many sites include third-party tags and analytics which can keep the network busy and
  make the main thread periodically unresponsive, impacting interaction latency. Explore
  on-demand loading of third-party code (e.g. maybe don't load those below-the-fold ads until
  they're scrolled closer to the viewport).
- In some cases, third-party scripts can pre-empt first-party ones in terms of priority and
  bandwidth on the main thread, also delaying how soon a page is interaction-ready. Attempt to
  prioritize loading what you believe offers the greatest value to users first.

## Use a web worker

A blocked main thread is one of the main causes of input delay. [Web
workers](https://developer.mozilla.org/docs/Web/API/Worker) make it possible to run JavaScript
on a background thread. Moving non-UI operations to a separate worker thread can cut down main
thread blocking time and consequently improve FID.

Consider using the following libraries to make it easier to use web workers on your site:

- [Comlink](https://github.com/GoogleChromeLabs/comlink): A helper library that abstracts
  `postMessage` and makes it easier to use
- [Workway](https://github.com/WebReflection/workway): A general purpose web worker exporter
- [Workerize](https://github.com/developit/workerize): Move a module into a web worker

{% Aside %}
To learn more about how web workers can execute code off the main thread, refer to [Use Web Workers
to run JavaScript off the browser's main thread](/off-main-thread/).
{% endAside %}

### Reduce JavaScript execution time {: #reduce-javascript-execution }

Limiting the amount of JavaScript on your page reduces the amount of time that the browser needs to
spend executing JavaScript code. This speeds up how fast the browser can begin to respond to any
user interactions.

To reduce the amount of JavaScript executed on your page:

- Defer unused JavaScript
- Minimize unused polyfills

#### Defer unused JavaScript

By default all JavaScript is render-blocking. When the browser encounters a script tag that links to
an external JavaScript file, it must pause what it's doing and download, parse, compile, and execute
that JavaScript. Therefore you should only load the code that's needed for the page or
responding to user input.

The [Coverage](https://developer.chrome.com/docs/devtools/coverage/) tab in Chrome
DevTools can tell you how much JavaScript is not being used on your web page.

{% Img src="image/admin/UNEigFiwsGu48rtXMZM4.png", alt="The Coverage tab.", width="800", height="559" %}

To cut down on unused JavaScript:

- Code-split your bundle into multiple chunks
- Defer any non-critical JavaScript, including third-party scripts, using `async` or `defer`

**Code-splitting** is the concept of splitting a single large JavaScript bundle into smaller chunks
that can be conditionally loaded (also known as lazy loading).
[Most newer browsers support dynamic import syntax](https://caniuse.com/#feat=es6-module-dynamic-import),
which allows for module fetching on demand:

```js
import('module.js').then((module) => {
  // Do something with the module.
});
```

Dynamically importing JavaScript on certain user interactions (such as changing a route or
displaying a modal) will make sure that code not used for the initial page load is only fetched when
needed.

Aside from general browser support, dynamic import syntax can be used in many different build
systems.

- If you use [webpack](https://webpack.js.org/guides/code-splitting/),
  [Rollup](https://medium.com/rollup/rollup-now-has-code-splitting-and-we-need-your-help-46defd901c82),
  or [Parcel](https://parceljs.org/code_splitting.html) as a module bundler, take advantage of
  their dynamic import support.
- Client-side frameworks, like
  [React](https://reactjs.org/docs/code-splitting.html#reactlazy),
  [Angular](https://angular.io/guide/lazy-loading-ngmodules), and
  [Vue](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) provide
  abstractions to make it easier to lazy-load at the component-level.

{% Aside %}
Take a look at [Reduce JavaScript payloads with code
splitting](/reduce-javascript-payloads-with-code-splitting/) to learn more about code-splitting.
{% endAside %}

Aside from code-splitting, always use [async or
defer](https://javascript.info/script-async-defer) for scripts that are not necessary for
critical-path or above-the-fold content.

```html
<script defer src="…"></script>
<script async src="…"></script>
```

Unless there is a specific reason not to, all third-party scripts should be loaded with either `defer`
or `async` by default.

#### Minimize unused polyfills

If you author your code using modern JavaScript syntax and reference modern browsers APIs, you will
need to transpile it and include polyfills in order for it to work in older browsers.

One of the main performance concerns of including polyfills and transpiled code in your site is that
newer browsers shouldn't have to download it if they do not need it. To cut down on the JavaScript
size of your application, minimize unused polyfills as much as possible and restrict their usage to
environments where they're needed.

To optimize polyfill usage on your site:

- If you use [Babel](https://babeljs.io/docs/en/index.html) as a transpiler, use
  [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) to only include the polyfills
  needed for the browsers you plan on targeting. For Babel 7.9, enable the
  [`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes) option to further cut down
  on any unneeded polyfills
- Use the module/nomodule pattern to deliver two separate bundles (`@babel/preset-env` also
  supports this via [`target.esmodules`](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules))

  ```html
  <script type="module" src="modern.js"></script>
  <script nomodule src="legacy.js" defer></script>
  ```

  Many newer ECMAScript features compiled with Babel are already supported in environments
  that support JavaScript modules. So by doing this, you simplify the process of making sure that
  only transpiled code is used for browsers that actually need it.

{% Aside %}
The [Serve modern code to modern browsers for faster page
loads](/serve-modern-code-to-modern-browsers/) guide goes into more detail about this topic.
{% endAside %}

## Developer tools

A number of tools are available to measure and debug FID:

- [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) does not include
  support for FID since it is a field metric. However, [Total Blocking
  Time](/tbt/) (TBT) can be used as a proxy. Optimizations that improve TBT should
  also improve FID in the field.

  {% Img src="image/admin/FRM9kHWmsDv9dddGMgwu.jpg", alt="Lighthouse 6.0.", width="800", height="309" %}

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
  provides real-world FID values aggregated at the origin-level

_With thanks to Philip Walton, Kayce Basques, Ilya Grigorik, and Annie Sullivan for their reviews._

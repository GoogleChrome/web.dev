---
layout: post
title: Debug Web Vitals in the field
subhead: |
  Learn how to attribute your Web Vitals data with debug information
  to help you identify and fix real-user issues with analytics
description: |
  Learn how to attribute your Web Vitals data with debug information
  to help you identify and fix real-user issues with analytics
authors:
  - philipwalton
date: 2021-04-01
updated: 2021-04-01
hero: image/eqprBhZUGfb8WYnumQ9ljAxRrA72/pOHexwZOflz5RGf6FT4P.jpg
alt: Laptop screen showing an analytics interface
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

Google currently provides two categories of tools to measure and debug Web Vitals:

- **Lab tools:** Tools such as Lighthouse, where your page is loaded in a
  simulated environment that can mimic various conditions (for example, a slow
  network and a low-end mobile device).
- **Field tools:** Tools such as [Chrome User Experience
  Report](https://developers.google.com/web/tools/chrome-user-experience-report)
  (CrUX), which is based on aggregate, real-user data from Chrome. (Note that the
  field data reported by tools such as [PageSpeed
  Insights](https://developers.google.com/speed/pagespeed/insights/) and [Search
  Console](https://support.google.com/webmasters/answer/9205520) is sourced from
  CrUX data.)

While field tools offer more accurate data—data which actually represents what
real users experience—lab tools are often better at helping you identify and fix
issues.

CrUX data is more representative of your page's real performance, but knowing
your CrUX scores is unlikely to help you figure out _how_ to improve your
performance.

Lighthouse, on the other hand, will identify issues and make specific
suggestions for how to improve. However, Lighthouse will only make suggestions
for performance issues it discovers at page load time. It does not detect issues
that only manifest as a result of user interaction such as scrolling or clicking
buttons on the page.

This raises an important question: **how can you capture debug information for
the Web Vitals metric data from real users in the field?**

This post will explain in detail what APIs you can use to collect additional
debugging information for each of the current Core Web Vitals metrics and give
you ideas for how to capture this data in your existing analytics tool.

## APIs for attribution and debugging

### CLS

Of all the Core Web Vitals metrics, [CLS](/cls/) is perhaps the one for which
collecting debug information in the field is the most important. CLS is measured
throughout the entire lifespan of the page, so the way a user interacts with the
page—how far they scroll, what they click on, and so on—can have a significant
impact on whether there are layout shifts and which elements are shifting.

Consider the following report from PageSpeed Insights for the URL:
[web.dev/measure](/measure/)

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/nZjd6rXrOgW5VUsm5fyx.png",
   alt="A PageSpeed Insights Report with different CLS values",
   width="800",
   height="587",
   class="w-screenshot" %}

The value reported for CLS from the lab (Lighthouse) compared to the CLS from
the field (CrUX data) are quite different, and this makes sense if you consider
that the [web.dev/measure](/measure/) page has a lot of interactive content that
is not being used when tested in Lighthouse.

But even if you understand that user interaction affects field data, you still
need to know what elements on the page are shifting to result in a score of 0.45
at the 75th percentile.

The [LayoutShiftAttribution](/debug-layout-shifts/#layoutshiftattribution)
interface makes that possible.

#### Get layout shift attribution

The [LayoutShiftAttribution](/debug-layout-shifts/#layoutshiftattribution)
interface is exposed on each `layout-shift` entry that [Layout Instability
API](https://wicg.github.io/layout-instability) emmits.

For a detailed explanation of both of these interfaces, see [Debug layout
shifts](/debug-layout-shifts/#layoutshiftattribution). For the purposes of
this post, the main thing you need to know is that, as a developer, you are able
to observe every layout shift that happens on the page as well as what elements
are shifting.

Here's some example code that logs each layout shift as well as the elements
that shifted:

```js
new PerformanceObserver((list) => {
  for (const {value, startTime, sources} of list.getEntries()) {
    // Log the shift amount and other entry info.
    console.log('Layout shift:', {value, startTime});
    if (sources) {
      for (const {node, curRect, prevRect} of sources) {
        // Log the elements that shifted.
        console.log('  Shift source:', node, {curRect, prevRect});
      }
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

It's probably not practical to measure and send data to your analytics tool for
every single layout shift that occurs; however, by monitoring all shifts, you
can keep track of the worst shifts and just report information about those.

The goal isn't to identify and fix every single layout shift that occurs for
every user, the goal is to identify the shifts that affect the largest number of
users and thus contribute the most to your page's CLS at the 75th percentile.

Also, you don't need to compute the largest source element every time there's a
shift, you only need to do so when you're ready to send the CLS value to your
analytics tool.

The following code takes a list of `layout-shift` entries that have contributed
to CLS and returns the largest source element from the largest shift:

```js
function getCLSDebugTarget(entries) {
  const largestShift = entries.reduce((a, b) => {
    return a && a.value > b.value ? a : b;
  });
  if (largestShift && largestShift.sources) {
    const largestSource = largestShift.sources.reduce((a, b) => {
      return a.node && a.previousRect.width * a.previousRect.height >
          b.previousRect.width * b.previousRect.height ? a : b;
    });
    if (largestSource) {
      return largestSource.node;
    }
  }
}
```

Once you've identified the largest element contributing to the largest shift,
you can report that to your analytics tool.

The element contributing the most to CLS for a given page will likely vary from
user to user, but if you aggregate those elements across all users, you'll be
able to generate a list of shifting elements affecting the most number of users.

Once you've identified and fixed the root cause of the shifts for those
elements, your analytics code will start reporting smaller shifts as the "worst"
shifts for your pages. Eventually, all reported shifts will be small enough that
your pages are well within [the "good" threshold of
0.1](/cls/#what-is-a-good-cls-score)!

Some other metadata that may be useful to capture along with the largest shift
source element is:

- The time of the largest shift
- The URL path at the time of the largest shift (for sites that dynamically
  update the URL, such as Single Page Applications).

### LCP

To debug LCP in the field, the primary information you need is which particular
element was the largest element (the LCP candidate element) for that particular
page load.

Note that it's entirely possible—in fact, it's quite common—that the LCP
candidate element will be different from user to user, even for the exact same
page.

This can happen for several reasons:

- User devices have different screen resolutions, which results in different
  page layouts and thus different elements being visible within the viewport.
- Users don't always load pages scrolled to the very top. Oftentimes links will
  contain [fragment identifiers](/text-fragments/#fragment-identifiers) or even
  [text fragments](/text-fragments/#text-fragments), which means it's possible
  for your pages to be loaded and displayed at any scroll position on the page.
- Content may be personalized for the current user, so the LCP candidate element
  could vary wildly from user to user.

This means you cannot make assumptions about which element or set of elements
will be the most common LCP candidate element for a particular page. You have to
measure it based on real-user behavior.

#### Identify the LCP candidate element

To determine the LCP candidate element in JavaScript you can use the [Largest
Contentful Paint API](https://wicg.github.io/largest-contentful-paint/), the
same API you use to determine the LCP time value.

Given a list of `largest-contentful-paint` entries, you can determine the
current LCP candidate element by looking at the last entry:

```js
function getLCPDebugTarget(entries) {
  const lastEntry = entries[entries.length - 1];
  return lastEntry.element;
}
```

{% Aside 'caution' %}
  As explained in the [LCP metric documentation](/lcp/), the LCP candidate
  element can change through the page load, so more work is required to identify
  the "final" LCP candidate element. The easiest way to identify and measure the
  "final" LCP candidate element is to use the
  [web-vitals](https://github.com/GoogleChrome/web-vitals/) JavaScript library,
  as shown in the [example
  below](#usage-with-the-web-vitals-javascript-library).
{% endAside %}

Once you know the LCP candidate element, you can send it to your analytics tool
along with the metric value. As with CLS, this will help you identify which
elements are most important to optimize first.

Some other metadata that may be useful to capture along with the LCP candidate
element:

- The image source URL (if the LCP candidate element is an image).
- The text font family (if the LCP candidate element is text and the page uses
  web fonts).

### FID

To debug FID in the field, it's important to remember that FID measures [only
the delay portion](/fid/#fid-in-detail) of the overall first input event
latency. That means that what the user interacted with is not really as
important as what else was happening on the main thread at the time they
interacted.

For example, many JavaScript applications that support server-side rendering
(SSR) will deliver static HTML that can be rendered to the screen before it's
interactive to user input—that is, before the JavaScript required to make the
content interactive has finished loading.

For these types of applications, it can be very important to know whether the
first input occurred before or after
[hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)). If it
turns out that many people are attempting to interact with the page before
hydration completes, consider rendering your pages in a disabled or loading
state rather than in a state that looks interactive.

If your application framework exposes the hydration timestamp, you can easily
compare that with the timestamp of the `first-input` entry to determine whether
the first input happened before or after hydration. If your framework doesn't
expose that timestamp, or doesn't use hydration at all, another useful signal
may be whether input occurred before or after JavaScript finished loading.

The `DOMContentLoaded` event fires after the page's HTML has completely loaded
and parsed, which includes waiting for any synchronous, deferred, or module
scripts (including all statically imported modules) to load. So you can use the
timing of that event and compare it to when FID occurred.

The following code takes a `first-input` entry and returns true if the first
input occurred prior to the end of the `DOMContentLoaded` event:

```js
function wasFIDBeforeDCL(fidEntry) {
  const navEntry = performance.getEntriesByType('navigation')[0];
  return navEntry && fidEntry.startTime < navEntry.domContentLoadedEventStart;
}
```

{% Aside %}
  If your page uses `async` scripts or dynamic `import()` to load JavaScript,
  the `DOMContentLoaded` event may not be a useful signal. Instead, you can
  consider using the `load` event or—if there's a particular script you know
  takes a while to execute—you can use the [Resource
  Timing](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API)
  entry for that script.
{% endAside %}

#### Identify the FID target element

Another potentially useful debug signal is the element that was interacted with.
While the interaction with the element itself does not contribute to FID
(remember FID is just the delay portion of the total event latency), knowing
which elements your users are interacting with may be useful in determining how
best to improve FID.

For example, if the vast majority of your user's first interactions are with a
particular element, it consider inlining the JavaScript code needed for that
element in the HTML, and lazy loading the rest.

To get the element associated with the first input event, you can reference the
`first-input` entry's `target` property:

```js
function getFIDDebugTarget(entries) {
  return entries[0].target;
}
```

Some other metadata that may be useful to capture along with the FID target
element:

- The type of event (such as `mousedown`, `keydown`, `pointerdown`).
- Any relevant [long task attribution
  ](https://w3c.github.io/longtasks/#taskattributiontiming)data for the long
  task that occurred at the same time as the first input (useful if the page
  loads third-party scripts).

## Usage with the web-vitals JavaScript library

The sections above offer some suggestions for additional debug info to include
in the data you send to your analytics tool. Each of the examples includes some
code that uses one or more performance entries associated with a particular Web
Vitals metric and returns a DOM element that can be used to help debug issues
affecting that metric.

These examples are designed to work well with the
[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript library,
which exposes the list of performance entries on the
[`Metric`](https://github.com/GoogleChrome/web-vitals#api) object passed to each
callback function.

If you combine the examples listed above with the `web-vitals` metric functions,
the end result will look something like this:

```js
import {getLCP, getFID, getCLS} from 'web-vitals';

function getSelector(node, maxLen = 100) {
  let sel = '';
  try {
    while (node && node.nodeType !== 9) {
      const part = node.id ? '#' + node.id : node.nodeName.toLowerCase() + (
        (node.className && node.className.length) ?
        '.' + Array.from(node.classList.values()).join('.') : '');
      if (sel.length + part.length > maxLen - 1) return sel || part;
      sel = sel ? part + '>' + sel : part;
      if (node.id) break;
      node = node.parentNode;
    }
  } catch (err) {
    // Do nothing...
  }
  return sel;
}

function getLargestLayoutShiftEntry(entries) {
  return entries.reduce((a, b) => a && a.value > b.value ? a : b);
}

function getLargestLayoutShiftSource(sources) {
  return sources.reduce((a, b) => {
    return a.node && a.previousRect.width * a.previousRect.height >
        b.previousRect.width * b.previousRect.height ? a : b;
  });
}

function wasFIDBeforeDCL(fidEntry) {
  const navEntry = performance.getEntriesByType('navigation')[0];
  return navEntry && fidEntry.startTime < navEntry.domContentLoadedEventStart;
}

function getDebugInfo(name, entries = []) {
  // In some cases there won't be any entries (e.g. if CLS is 0,
  // or for LCP after a bfcache restore), so we have to check first.
  if (entries.length) {
    if (name === 'LCP') {
      const lastEntry = entries[entries.length - 1];
      return {
        debug_target: getSelector(lastEntry.element),
        event_time: lastEntry.startTime,
      };
    } else if (name === 'FID') {
      const firstEntry = entries[0];
      return {
        debug_target: getSelector(firstEntry.target),
        debug_event: firstEntry.name,
        debug_timing: wasFIDBeforeDCL(firstEntry) ? 'pre_dcl' : 'post_dcl',
        event_time: firstEntry.startTime,
      };
    } else if (name === 'CLS') {
      const largestEntry = getLargestLayoutShiftEntry(entries);
      if (largestEntry && largestEntry.sources) {
        const largestSource = getLargestLayoutShiftSource(largestEntry.sources);
        if (largestSource) {
          return {
            debug_target: getSelector(largestSource.node),
            event_time: largestEntry.startTime,
          };
        }
      }
    }
  }
  // Return default/empty params in case there are no entries.
  return {
    debug_target: '(not set)',
  };
}

function sendToAnalytics({name, value, entries}) {
  navigator.sendBeacon('/analytics', JSON.stringify({
    name,
    value,
    ...getDebugInfo(name, entries)
  });
}

getLCP(sendToAnalytics);
getFID(sendToAnalytics);
getCLS(sendToAnalytics);
```

The specific format required to send the data will vary by analytics tool, but
the above code should be sufficient to get the data needed, regardless of the
format requirements.

{% Aside %}
  The code above also includes a `getSelector()` function (not mentioned in
  previous sections), which takes a DOM node and returns a CSS selector
  representing that node and its place in the DOM. It also takes an optional
  maximum length parameter (defaulting to 100 characters) in the event that your
  analytics provider has length restrictions on the data you send it.
{% endAside %}

## Report and visualize the data

Once you've started collecting debug information along with your Web Vitals
metrics, the next step is aggregating the data across all your users to start
looking for patterns and trends.

As mentioned above, you don't necessarily need to address every single issue
your users are encountering, you want to address—especially at first—the issues
that are affecting the largest number of users, which should also be the issues
that have the largest negative impact on your Core Web Vitals scores.

### The Web Vitals Report tool

If you're using the [Web Vitals
Report](https://github.com/GoogleChromeLabs/web-vitals-report) tool, it's been
recently updated to support [reporting on a single debug
dimension](https://github.com/GoogleChromeLabs/web-vitals-report#debug-dimension)
for each of the Core Web Vitals metrics.

Here's a screenshot from the Web Vitals Report debug info section, showing data
for the Web Vitals Report tool website itself:

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/Y49u3cmRD6RfAaZGCSmx.png",
   alt="Web Vitals Report showing debug information",
   width="800",
   height="535" %}

Using the data above, you can see that whatever is causing the `section.Intro`
element to shift is contributing the most to CLS on this page, so identifying
and fixing the cause of that shift will yield the greatest improvement to the
score.

## Summary

Hopefully this post has helped outline the specific ways you can use the
existing performance APIs to get debug information for each of the Core Web
Vitals metrics based on real-user interactions in the field. While it's focused
on the Core Web Vitals, the concepts also apply to debugging any performance
metric that's measurable in JavaScript.

If you're just getting started measuring performance, and you're already a
Google Analytics user, the Web Vitals Report tool may be a good place to start
because it already supports reporting debug information for each of the Core Web
Vitals metrics.

If you're an analytics vendor and you're looking to improve your products and
provide more debugging information to your users, consider some of the
techniques described here but don't limit yourself to _just_ the ideas presented
here. This post is intended to be generally applicable to all analytics tools;
however, individual analytics tools likely can (and should) capture and report
even more debug information.

Lastly, if you feel there are gaps in your ability to debug these metrics due to
missing features or information in the APIs themselves send your feedback to
[web-vitals-feedback@googlegroups.com](mailto:web-vitals-feedback@googlegroups.com).

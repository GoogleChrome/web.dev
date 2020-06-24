---
layout: post
title: User Timing marks and measures
description: |
  Learn how the User Timing API can help you get real-world performance data
  for your web page.
date: 2019-05-02
updated: 2020-06-24
web_lighthouse:
  - user-timings
---

## What's the User Timing API?

Making your web app fast and responsive is crucial for a good user experience.
The first step in improving performance is identifying where time is being spent.

The [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)
gives you a way to measure your app's JavaScript performance.
You do that by inserting API calls in your JavaScript and then
extracting detailed timing data that you can use to optimize your code.
You can access those data from JavaScript using the API
or by viewing them on your [Chrome DevTools Timeline Recordings](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference).

Check out the [HTML5 Rocks page about the User Timing API](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/)
for a quick introduction to using it.

## How Lighthouse reports User Timing data

When your app uses the User Timing API to add marks (that is, time stamps)
and measures (that is, measurements of the elapsed time between marks),
you'll see them in your
[Lighthouse](https://developers.google.com/web/tools/lighthouse/) report:

<figure class="w-figure">
  <img class="w-screenshot" src="user-timings.png" alt="A screenshot of the Lighthouse User Timing marks and measures audit">
</figure>

Lighthouse extracts User Timing data from
[Chrome's Trace Event Profiling Tool](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool).

This audit is not structured as a pass or fail test.
It's just an opportunity to discover a useful API that can help you measure your app's performance.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Resources

- [Source code for **User Timing marks and measures** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/user-timings.js)
- [User Timing API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)
- [User Timing API (HTML5 Rocks)](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/)

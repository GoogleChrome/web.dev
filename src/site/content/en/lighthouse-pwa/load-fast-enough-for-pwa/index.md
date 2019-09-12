---
layout: post
title: Page load is not fast enough on mobile networks
description: |
  Learn how to make your web page load quickly on mobile networks.
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2019-09-19
---

Many users of your page visit over a slow cellular network connection.
Ensuring that your page loads fast over a simulated mobile network
ensures that your page loads in a reasonable amount of time for your mobile
users.

{% Aside 'note' %}
A fast page load on a mobile network is a baseline requirement for a site
to be considered a Progressive Web App. See the
[Baseline Progressive Web App Checklist](https://developers.google.com/web/progressive-web-apps/checklist#baseline).
{% endAside %}

## How the Lighthouse page load speed audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't load fast enough on mobile:

<figure class="w-figure">
  <img class="w-screenshot" src="load-fast-enough-for-pwa.png" alt="Lighthouse audit showing page doesn't load fast enough on mobile">
</figure>

There are two main metrics regarding how users perceive load time:

- The page appears visually complete.
- The page is interactive. If a page appears visually complete at 1s,
but the user can't interact with it until 10s,
then the perceived page load time is 10s.

Lighthouse computes what time to interactive would be on a slow 4G network
connection. If the time to interactive is more than 10s, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to improve your page's load time

To speed up time-to-visually-complete, only load the resources you need in order
to display the page.
See
[Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) and
[Optimizing Content Efficiency](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/).

To speed up time-to-interactive, only execute the JavaScript that you need
to display the page and defer the rest.
See
[Get Started With Analyzing Runtime Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/)
to learn how to analyze JavaScript execution with Chrome DevTools.

[Record load performance](/web/tools/chrome-devtools/evaluate-performance/reference#record-load)
shows you how to record a page load.
Once you're familiar with the basics,
do a page load recording and analyze the results to find JS work that can be deferred.
See
[Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering/) for strategies.

## Resources

- [Source code for **Page load is not fast enough on mobile networks** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/load-fast-enough-for-pwa.js)
- [Baseline Progressive Web App Checklist](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
- [Get Started With Analyzing Runtime Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/)
- [Record load performance](/web/tools/chrome-devtools/evaluate-performance/reference#record-load)
- [Optimizing Content Efficiency](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/)
- [Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering/)

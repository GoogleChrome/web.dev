---
layout: post
title: Page load is fast enough on mobile
description: |
  Learn about `load-fast-enough-for-pwa` audit.
web_lighthouse:
  - load-fast-enough-for-pwa
---

Many users of your page visit on a mobile device. 
Testing your page on a simulated mobile network helps ensure that it
will load quickly for your mobile users.

{% Aside 'note' %}
A fast page load on a mobile network is a baseline requirement for a site
to be considered a Progressive Web App. See [Baseline Progressive Web App
Checklist](https://developers.google.com/web/progressive-web-apps/checklist#baseline).
{% endAside %}

## Recommendations

There are two main metrics that affect how users perceive load time:

- Time until page appears visually complete.
- Time until page is interactive. If a page appears visually complete after 1 second, but the user can't interact with it for 10 seconds, the perceived page load time is 10 seconds.

To speed up time-to-visually-complete, only load the resources you need 
to display the page. See [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) and [Optimizing Content
Efficiency](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/).

To speed up time-to-interactive, only execute the JavaScript you need 
to display the page and defer the rest. See [Get Started With Analyzing
Runtime Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/) to learn how to analyze JavaScript execution with
Chrome DevTools. See [Record load performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#record-load) to learn how to record a page
load. Once you're familiar with the basics, record a page load and analyze
the results to find JS work that can be deferred. See [Rendering
Performance](https://developers.google.com/web/fundamentals/performance/rendering/) for strategies.

## More information

Lighthouse computes what time-to-interactive would be on a slow 4G network 
connection. If the time-to-interactive is less than 10 seconds, the audit passes.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/load-fast-enough-for-pwa.js)
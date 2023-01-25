---
layout: post
title: Time to Interactive (TTI)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: |
  This post introduces the Time to Interactive (TTI) metric and explains
  how to measure it
tags:
  - performance
  - metrics
---

{% Aside %}
  Time to Interactive (TTI) is an important [lab
  metric](/user-centric-performance-metrics/#in-the-lab) for measuring [load
  responsiveness](/user-centric-performance-metrics/#types-of-metrics). It helps
  identify cases where a page _looks_ interactive but actually isn't. A fast TTI
  helps ensure that the page is
  [usable](/user-centric-performance-metrics/#questions).
{% endAside %}

## What is TTI?

The TTI metric measures the time from when the page starts
loading to when its main sub-resources have loaded and it is capable of reliably
responding to user input quickly.

To calculate TTI based on a [performance
trace](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference)
of a web page, follow these steps:

1. Start at [First Contentful Paint (FCP)](/fcp/).
2. Search forward in time for a quiet window of at least five seconds, where
   _quiet window_ is defined as: no [long
   tasks](/custom-metrics/#long-tasks-api) and no more than two in-flight
   network GET requests.
3. Search backwards for the last long task before the quiet window, stopping at
   FCP if no long tasks are found.
4. TTI is the end time of the last long task before the quiet window (or the
   same value as FCP if no long tasks are found).

The following diagram should help visualize the steps above:

{% Img src="image/admin/WZM0n4aXah67lEyZugOT.svg", alt="A page load timeline showing how to compute TTI", width="800", height="473", linkTo=true %}

Historically, developers have optimized pages for fast render times,
sometimes at the expense of TTI.

Techniques like server-side rendering (SSR) can lead to scenarios where a page
_looks_ interactive (that is, links and buttons are visible on the screen), but it's not
_actually_ interactive because the main thread is blocked or
because the JavaScript code controlling those elements hasn't loaded.

When users try to interact with a page that looks interactive but actually
isn't, they'll likely respond in one of two ways:

* In the best-case scenario, they'll be annoyed that the page is slow to respond.
* In the worst-case scenario, they'll assume the page is broken and likely
  leave. They may even lose confidence or trust in the value of your brand.

To avoid this problem, make every effort to minimize the difference
between FCP and TTI. And in cases were a noticeable difference does exist,
make it clear through visual indicators that the components on your page are not yet
interactive.

## How to measure TTI

TTI is a metric that's best measured [in the
lab](/user-centric-performance-metrics/#in-the-lab). The best way to measure TTI is to run a
Lighthouse performance audit on your site. See the [Lighthouse documentation on
TTI](/interactive/) for usage details.

### Lab tools

* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
* [WebPageTest](https://www.webpagetest.org/)

{% Aside %}
  While it's possible to measure TTI in the field, it's not recommended, as user
  interaction can affect your page's TTI in ways that lead to lots of variance
  in your reports. To understand a page's interactivity in the field, you should
  measure [First Input Delay (FID)](/fid/).
{% endAside %}

## What is a good TTI score?

To provide a good user experience, sites should strive to have a Time to
Interactive of less than **5 seconds** when tested on **average mobile
hardware**.

For details on how your page's TTI affects your Lighthouse performance score,
see [How Lighthouse determines your TTI
score](/interactive/#how-lighthouse-determines-your-tti-score).

## How to improve TTI

To learn how to improve TTI for a specific site, you can run a Lighthouse
performance audit and pay attention to any specific
[opportunities](/lighthouse-performance/#opportunities) the audit suggests.

To learn how to improve TTI in general (for any site), refer to the following
performance guides:

* [Minify JavaScript](/unminified-javascript/)
* [Preconnect to required origins](/uses-rel-preconnect/)
* [Preload key requests](/uses-rel-preload/)
* [Reduce the impact of third-party code](/third-party-summary/)
* [Minimize critical request depth](/critical-request-chains/)
* [Reduce JavaScript execution time](/bootup-time/)
* [Minimize main thread work](/mainthread-work-breakdown/)
* [Keep request counts low and transfer sizes small](/resource-summary/)

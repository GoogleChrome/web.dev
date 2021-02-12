---
layout: post
title: Total Blocking Time (TBT)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: |
  This post introduces the Total Blocking Time (TBT) metric and explains
  how to measure it
tags:
  - performance
  - metrics
---

{% Aside %}

  Total Blocking Time (TBT) is an important [lab
  metric](/user-centric-performance-metrics/#in-the-lab) for measuring [load
  responsiveness](/user-centric-performance-metrics/#types-of-metrics) because
  it helps quantify the severity of how non-interactive a page is prior to it
  becoming reliably interactive&mdash;a low TBT helps ensure that the page is
  [usable](/user-centric-performance-metrics/#questions).

{% endAside %}

## What is TBT?

The Total Blocking Time (TBT) metric measures the total amount of time between
[First Contentful Paint (FCP)](/fcp/) and [Time to Interactive (TTI)](/tti/)
where the main thread was blocked for long enough to prevent input
responsiveness.

The main thread is considered "blocked" any time there's a [Long
Task](/custom-metrics/#long-tasks-api)&mdash;a task that runs on the main
thread for more than 50 milliseconds (ms). We say the main thread is "blocked"
because the browser cannot interrupt a task that's in progress. So in the event
that a user _does_ interact with the page in the middle of a long task, the
browser must wait for the task to finish before it can respond.

If the task is long enough (e.g. anything above 50 ms), it's likely that the
user will notice the delay and perceive the page as sluggish or janky.

The _blocking time_ of a given long task is its duration in excess of 50 ms. And
the _total blocking time_ for a page is the sum of the _blocking time_ for each
long task that occurs between FCP and TTI.

For example, consider the following diagram of the browser's main thread during
page load:

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="A tasks timeline on the main thread", width="800", height="156", linkTo=true %}

The above timeline has five tasks, three of which are Long Tasks because their
duration exceeds 50 ms. The next diagram shows the blocking time for each of the
long tasks:

[![A tasks timeline on the main thread showing blocking
time](tbt-blocking-time.svg)](tbt-blocking-time.svg)

So while the total time spent running tasks on the main thread is 560 ms, only
345 ms of that time is considered blocking time.

<table>
  <tr>
    <th></th>
    <th>Task duration</th>
    <th>Task blocking time</th>
  </tr>
  <tr>
    <td>Task one</td>
    <td>250 ms</td>
    <td>200 ms</td>
  </tr>
  <tr>
    <td>Task two</td>
    <td>90 ms</td>
    <td>40 ms</td>
  </tr>
  <tr>
    <td>Task three</td>
    <td>35 ms</td>
    <td>0 ms</td>
  </tr>
  <tr>
    <td>Task four</td>
    <td>30 ms</td>
    <td>0 ms</td>
  </tr>
  <tr>
    <td>Task five</td>
    <td>155 ms</td>
    <td>105 ms</td>
  </tr>
  <tr>
    <td colspan="2" ><strong>Total Blocking Time</strong></td>
    <td><strong>345 ms</strong></td>
  </tr>
</table>

### How does TBT relate to TTI?

TBT is a great companion metric for TTI because it helps quantify the severity
of how non-interactive a page is prior it to becoming reliably interactive.

TTI considers a page "reliably interactive" if the main thread has been free of
long tasks for at least five seconds. This means that three, 51 ms tasks spread
out over 10 seconds can push back TTI just as far as a single 10-second long
task&mdash;but those two scenarios would feel very different to a user trying to
interact with the page.

In the first case, three, 51 ms tasks would have a TBT of **3 ms**. Whereas a
single, 10-second long tasks would have a TBT of **9950 ms**. The larger TBT
value in the second case quantifies the worse experience.

## How to measure TBT

TBT is a metric that should be measured [in the
lab](/user-centric-performance-metrics/#in-the-lab). The best way to measure TBT is to run a
Lighthouse performance audit on your site. See the [Lighthouse documentation on
TBT](/lighthouse-total-blocking-time) for usage details.

### Lab tools

* [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
* [WebPageTest](https://www.webpagetest.org/)

{% Aside %}
  While it is possible to measure TBT in the field, it's not recommended as user
  interaction can affect your page's TBT in ways that lead to lots of variance
  in your reports. To understand a page's interactivity in the field, you should
  measure [First Input Delay (FID)](/fid/).
{% endAside %}

## What is a good TBT score?

To provide a good user experience, sites should strive to have a Total Blocking
Time of less than **300 milliseconds** when tested on **average mobile
hardware**.

For details on how your page's TBT affects your Lighthouse performance score,
see [How Lighthouse determines your TBT
score](/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)

## How to improve TBT

To learn how to improve TBT for a specific site, you can run a Lighthouse
performance audit and pay attention to any specific
[opportunities](/lighthouse-performance/#opportunities) the audit suggests.

To learn how to improve TBT in general (for any site), refer to the following
performance guides:

- [Reduce the impact of third-party code](/third-party-summary/)
- [Reduce JavaScript execution time](/bootup-time/)
- [Minimize main thread work](/mainthread-work-breakdown/)
- [Keep request counts low and transfer sizes small](/resource-summary/)

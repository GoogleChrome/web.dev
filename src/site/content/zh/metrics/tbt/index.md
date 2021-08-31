---
layout: post
title: Total Blocking Time (TBT)
authors:
  - philipwalton
date: '2019-11-07'
updated: '2020-06-15'
description: |2

  This post introduces the Total Blocking Time (TBT) metric and explains

  how to measure it
tags:
  - performance
  - metrics
---

{% Aside %}

Total Blocking Time (TBT) is an important [lab metric](/user-centric-performance-metrics/#in-the-lab) for measuring [load responsiveness](/user-centric-performance-metrics/#types-of-metrics) because it helps quantify the severity of how non-interactive a page is prior to it becoming reliably interactive—a low TBT helps ensure that the page is [usable](/user-centric-performance-metrics/#questions).

{% endAside %}

## What is TBT?

The Total Blocking Time (TBT) metric measures the total amount of time between [First Contentful Paint (FCP)](/fcp/) and [Time to Interactive (TTI)](/tti/) where the main thread was blocked for long enough to prevent input responsiveness.

The main thread is considered "blocked" any time there's a [Long Task](/custom-metrics/#long-tasks-api)—a task that runs on the main thread for more than 50 milliseconds (ms). We say the main thread is "blocked" because the browser cannot interrupt a task that's in progress. So in the event that a user *does* interact with the page in the middle of a long task, the browser must wait for the task to finish before it can respond.

If the task is long enough (e.g. anything above 50 ms), it's likely that the user will notice the delay and perceive the page as sluggish or janky.

The *blocking time* of a given long task is its duration in excess of 50 ms. And the *total blocking time* for a page is the sum of the *blocking time* for each long task that occurs between FCP and TTI.

For example, consider the following diagram of the browser's main thread during page load:

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="A tasks timeline on the main thread", width="800", height="156", linkTo=true %}

The above timeline has five tasks, three of which are Long Tasks because their duration exceeds 50 ms. The next diagram shows the blocking time for each of the long tasks:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xKxwKagiz8RliuOI2Xtc.svg", alt="A tasks timeline on the main thread showing blocking time", width="800", height="156", linkTo=true %}

So while the total time spent running tasks on the main thread is 560 ms, only 345 ms of that time is considered blocking time.

<table>
  <tr>
    <th></th>
    <th>任务持续时间</th>
    <th>任务阻塞时间</th>
  </tr>
  <tr>
    <td>任务一</td>
    <td>250 毫秒</td>
    <td>200 毫秒</td>
  </tr>
  <tr>
    <td>任务二</td>
    <td>90 毫秒</td>
    <td>40 毫秒</td>
  </tr>
  <tr>
    <td>任务三</td>
    <td>35 毫秒</td>
    <td>0 毫秒</td>
  </tr>
  <tr>
    <td>任务四</td>
    <td>30 毫秒</td>
    <td>0 毫秒</td>
  </tr>
  <tr>
    <td>任务五</td>
    <td>155 毫秒</td>
    <td>105 毫秒</td>
  </tr>
  <tr>
    <td colspan="2"><strong>总阻塞时间</strong></td>
    <td><strong>345 毫秒</strong></td>
  </tr>
</table>

### How does TBT relate to TTI?

TBT is a great companion metric for TTI because it helps quantify the severity of how non-interactive a page is prior it to becoming reliably interactive.

TTI considers a page "reliably interactive" if the main thread has been free of long tasks for at least five seconds. This means that three, 51 ms tasks spread out over 10 seconds can push back TTI just as far as a single 10-second long task—but those two scenarios would feel very different to a user trying to interact with the page.

In the first case, three, 51 ms tasks would have a TBT of **3 ms**. Whereas a single, 10-second long tasks would have a TBT of **9950 ms**. The larger TBT value in the second case quantifies the worse experience.

## 如何测量 TBT

TBT is a metric that should be measured [in the lab](/user-centric-performance-metrics/#in-the-lab). The best way to measure TBT is to run a Lighthouse performance audit on your site. See the [Lighthouse documentation on TBT](/lighthouse-total-blocking-time) for usage details.

### 实验室工具

- [Chrome 开发者工具](https://developers.google.com/web/tools/chrome-devtools/)
- [灯塔](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} While it is possible to measure TBT in the field, it's not recommended as user interaction can affect your page's TBT in ways that lead to lots of variance in your reports. To understand a page's interactivity in the field, you should measure [First Input Delay (FID)](/fid/). {% endAside %}

## What is a good TBT score?

To provide a good user experience, sites should strive to have a Total Blocking Time of less than **300 milliseconds** when tested on **average mobile hardware**.

For details on how your page's TBT affects your Lighthouse performance score, see [How Lighthouse determines your TBT score](/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)

## 如何改进 TBT

To learn how to improve TBT for a specific site, you can run a Lighthouse performance audit and pay attention to any specific [opportunities](/lighthouse-performance/#opportunities) the audit suggests.

To learn how to improve TBT in general (for any site), refer to the following performance guides:

- [减少第三方代码的影响](/third-party-summary/)
- [减少 JavaScript 执行时间](/bootup-time/)
- [最小化主线程工作](/mainthread-work-breakdown/)
- [Keep request counts low and transfer sizes small](/resource-summary/)

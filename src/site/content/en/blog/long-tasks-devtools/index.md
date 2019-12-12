---
title: Are long JavaScript tasks delaying your Time to Interactive?
subhead: Learn to diagnose costly work preventing user interaction.
authors:
  - addyosmani
date: 2019-05-29
hero: long-tasks.jpg
alt: An hourglass with sand pouring through it
description: |
  Long Tasks can keep the main thread busy, delaying user interaction. Chrome DevTools can now visualize Long Tasks, making it easier to see tasks to optimize.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - performance
---

**tl;dr: Long Tasks can keep the main thread busy, delaying user interaction. Chrome DevTools can now visualize Long Tasks, making it easier to see tasks to optimize.**

If you use Lighthouse to audit your pages, you may be familiar with [Time to Interactive](/interactive), a metric representing when users can interact with your page and get a response. But did you know Long (JavaScript) Tasks can contribute heavily to a poor TTI?

<img
class="w-screenshot" sizes="(max-width: 1400px) 100vw, 1400px"
srcset="
./Are-long0_rq2bce_c_scale_w_200.png 200w,
./Are-long0_rq2bce_c_scale_w_775.png 775w,
./Are-long0_rq2bce_c_scale_w_1239.png 1239w,
./Are-long0_rq2bce_c_scale_w_1400.png 1400w"
src="./Are-long0_rq2bce_c_scale_w_1400.png"
alt="Time to Interactive displayed in the Lighthouse Report">

## What are Long Tasks?

A [Long Task](https://developer.mozilla.org/en-US/docs/Web/API/Long_Tasks_API) is JavaScript code that monopolizes the main thread for extended periods of time, causing the UI to "freeze".

While a web page is loading, Long Tasks can tie up the main thread and make the page unresponsive to user input even if it looks ready. Clicks and taps often don't work because event listeners, click handlers etc have not yet been attached.

CPU-heavy Long Tasks occur due to complex work that takes longer than 50ms. Why 50ms? [The RAIL model](https://developers.google.com/web/fundamentals/performance/rail) suggests you process user input events in [50ms](https://developers.google.com/web/fundamentals/performance/rail#response) to ensure a visible response within 100ms. If you don't, the connection between action and reaction is broken.

## Are there Long Tasks in my page that could delay interactivity?

Until now, you've needed to manually look for "long yellow blocks" of script over 50ms long in [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) or use the [Long Tasks API](https://calendar.perfplanet.com/2017/tracking-cpu-with-long-tasks-api/) to figure out what tasks were delaying interactivity. This could be a little cumbersome.

<img
class="w-screenshot" sizes="(max-width: 1400px) 100vw, 1400px"
srcset="
./Are-long1_yp7hwf_c_scale_w_200.png 200w,
./Are-long1_yp7hwf_c_scale_w_349.png 349w,
./Are-long1_yp7hwf_c_scale_w_457.png 457w,
./Are-long1_yp7hwf_c_scale_w_570.png 570w,
./Are-long1_yp7hwf_c_scale_w_670.png 670w,
./Are-long1_yp7hwf_c_scale_w_755.png 755w,
./Are-long1_yp7hwf_c_scale_w_841.png 841w,
./Are-long1_yp7hwf_c_scale_w_919.png 919w,
./Are-long1_yp7hwf_c_scale_w_1000.png 1000w,
./Are-long1_yp7hwf_c_scale_w_1077.png 1077w,
./Are-long1_yp7hwf_c_scale_w_1153.png 1153w,
./Are-long1_yp7hwf_c_scale_w_1220.png 1220w,
./Are-long1_yp7hwf_c_scale_w_1289.png 1289w,
./Are-long1_yp7hwf_c_scale_w_1400.png 1400w"
src="./Are-long1_yp7hwf_c_scale_w_1400.png"
alt="A DevTools Performance panel screenshot showing the differences between short tasks and long tasks">

To help ease your performance auditing workflow, [DevTools now visualizes Long Tasks](https://developers.google.com/web/updates/2019/03/devtools#longtasks). Tasks (shown in gray) have red flags if they are Long Tasks.

<img
class="w-screenshot" sizes="(max-width: 1400px) 100vw, 1400px"
srcset="
./Are-long2_momntc_c_scale_w_200.png 200w,
./Are-long2_momntc_c_scale_w_424.png 424w,
./Are-long2_momntc_c_scale_w_600.png 600w,
./Are-long2_momntc_c_scale_w_740.png 740w,
./Are-long2_momntc_c_scale_w_884.png 884w,
./Are-long2_momntc_c_scale_w_1020.png 1020w,
./Are-long2_momntc_c_scale_w_1136.png 1136w,
./Are-long2_momntc_c_scale_w_1254.png 1254w,
./Are-long2_momntc_c_scale_w_1400.png 1400w"
src="./Are-long2_momntc_c_scale_w_1400.png"
alt="DevTools visualizing Long Tasks as gray bars in the Performance Panel with a red flag for long tasks">

* Record a trace in the [Performance panel](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/) of loading up a web page.
* Look for a red flag in the main thread view. You should see tasks are now gray ("Task").
*  Hovering over a bar will let you know the duration of the task and if it was considered "long".

## What is causing my Long Tasks?

To discover what is causing a long task, select the gray **Task** bar. In the drawer beneath, select **Bottom-Up** and **Group by Activity**. This allows you to see what activities contributed the most (in total) to the task taking so long to complete. Below, it appears to be a costly set of DOM queries.

<img
class="w-screenshot" sizes="(max-width: 1400px) 100vw, 1400px"
srcset="
./Are-long3_tfm3wr_c_scale_w_200.png 200w,
./Are-long3_tfm3wr_c_scale_w_394.png 394w,
./Are-long3_tfm3wr_c_scale_w_547.png 547w,
./Are-long3_tfm3wr_c_scale_w_678.png 678w,
./Are-long3_tfm3wr_c_scale_w_786.png 786w,
./Are-long3_tfm3wr_c_scale_w_904.png 904w,
./Are-long3_tfm3wr_c_scale_w_1010.png 1010w,
./Are-long3_tfm3wr_c_scale_w_1109.png 1109w,
./Are-long3_tfm3wr_c_scale_w_1212.png 1212w,
./Are-long3_tfm3wr_c_scale_w_1312.png 1312w,
./Are-long3_tfm3wr_c_scale_w_1400.png 1400w"
src="./Are-long3_tfm3wr_c_scale_w_1400.png"
alt="Selecting a long task (labelled 'Task') in DevTools allows us to drill-down into the activities that were responsible for it.">

## What are common ways to optimize Long Tasks?

Large scripts are often a major cause of Long Tasks so consider [splitting them up](/reduce-javascript-payloads-with-code-splitting). Also keep an eye on third-party scripts; their Long Tasks can delay primary content from getting interactive.

Break all your work into small chunks (that run in < 50ms) and run these chunks at the right place and time; the right place may even be off the main thread, in a worker. Phil Walton's [Idle Until Urgent](https://philipwalton.com/articles/idle-until-urgent/) is a good read on this topic.

Keep your pages responsive. Minimizing Long Tasks is a great way to ensure your users have a delightful experience when they visit your site. For more on Long Tasks, check out [User-centric Performance Metrics](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_long_tasks).

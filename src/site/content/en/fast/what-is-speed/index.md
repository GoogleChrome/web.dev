---
layout: post
title: What is speed?
authors:
  - bojanpavic
  - ansteychris
description: |
  Speed matters, but what exactly do we mean by it? What does it mean to have a fast site?
web_lighthouse: N/A
date: 2019-05-01
tags:
  - performance
---

So, speed matters, but what exactly do we mean by it? What does it mean to have a fast site?

It's common to hear people talk in terms of their website loading in x.xx seconds or similar, but a [load is not a single moment in time](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics); it's an experience that no single metric can fully capture. There are multiple moments during the load experience that can affect whether a user perceives it as 'fast', and if you just focus solely on one, you might miss bad experiences that happen during the rest of the time.

Rather than measuring load with just one metric, you should time each moment during the experience that affects the user's perception of load speed. When a user navigates to a web page, they're typically looking for certain types of feedback:

{% Img src="image/admin/NGX9WC2BXTRY6FP5TTGl.png", alt="Image of feedback user is typically looking for", width="800", height="185" %}

Traditional performance metrics like load time or DOMContentLoaded time are unreliable, since their occurrence may or may not correspond with these feedback milestones. So, [additional metrics](/lighthouse-performance/#metrics) have emerged that could be used to understand when a page delivers this feedback to its users:

{% Img src="image/admin/tz1aubGGvefskjcPfjBQ.png", alt="Image of speed metrics", width="800", height="654" %}

It's important to understand the different insights offered by these metrics, then establish the ones that are important to your user experience. Some brands even define additional custom metrics specific to the expectations people have of their service. In the case of Pinterest, users want to see images, so they defined a custom metric, [Pinner Wait Time](https://www.youtube.com/watch?v=Xryhxi45Q5M), that combines Time to Interactive and Above the Fold Image load times.

Even though the load is more than one moment in time, it can still be useful to have a single metric for the purposes of simplified reporting or comparison: [Speed Index](/speed-index) and [Lighthouse score](https://developers.google.com/web/tools/lighthouse/v3/scoring) can both be used in this way.

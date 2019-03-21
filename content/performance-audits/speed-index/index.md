---
page_type: guide
title: Speed Index
author: megginkearney
description: Reference documentation for the "Speed Index" Lighthouse audit.
web_lighthouse:
- speed-index
web_updated_on: 2019-03-20
web_published_on: 2019-03-20
wf_blink_components: N/A
---

# Speed Index

## Overview

Speed Index is a page load performance metric that shows you how
quickly the contents of a page are visibly populated. The lower the score,
the better.

## Recommendations

To lower your Speed Index score, you need to optimize your page to visually
load faster. Two good starting places are:

* [Optimizing Content Efficiency](/web/fundamentals/performance/optimizing-content-efficiency/).
* [Optimizing the Critical Rendering Path](/web/fundamentals/performance/critical-rendering-path/).

## More information

Lighthouse uses a node module called
[Speedline](https://github.com/pmdartus/speedline)
to generate the Speed Index score.

For more information on the algorithms and methodologies behind Speed Index,
see [Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index).

The target score is computed by a cumulative distribution function of a
log-normal distribution. Check out the comments in the
[source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/speed-index.js)
of the audit if you need to know more.

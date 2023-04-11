---
layout: pattern-set
title: Carousels
description: Performant carousels
date: 2021-08-10
---

A carousel is a UX component that displays content in a slideshow-like manner.
Large, above-the-fold carousels often contain a page's [Largest Contentful Paint
(LCP) element](/lcp/#what-elements-are-considered), and therefore
can have a significant impact on [LCP](/lcp). In addition, a
surprising number of carousels use [non-composited
animations](https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations/) that can contribute to
[Cumulative Layout Shift (CLS)](/cls). On pages with autoplaying
carousels, this has the potential to cause infinite layout shifts.

To learn about performance and UX best practices for carousels, see
[Carousel Best Practices](/carousel-best-practices/).

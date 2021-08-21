---
layout: pattern-set
title: Carousels
description: Performant carousels
date: 2021-08-10
---

A carousel is a UX component that displays content in a slideshow-like manner.
Large, above-the-fold carousels often contain a page's [Largest Contentful Paint
(LCP) element](https://web.dev/lcp/#what-elements-are-considered), and therefore
can have a significant impact on [LCP](https://web.dev/lcp). In addition, a
surprising number of carousels use [non-composited
animations](https://web.dev/non-composited-animations/) that can contribute to
[Cumulative Layout Shift (CLS)](https://web.dev/cls). On pages with autoplaying
carousels, this has the potential to cause infinite CLS.

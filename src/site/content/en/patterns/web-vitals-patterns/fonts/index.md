---
layout: pattern-set
title: Fonts
description: Load fonts quickly
date: 2021-08-17
---

If a web font has not been loaded, browsers typically delay rendering any text
that uses the web font. In many situations, this delays [First Contentful Paint
(FCP)](/fcp). In some situations, this delays [Largest Contentful
Paint (LCP)](/lcp).

In addition, fonts can cause [layout
shifts](/debug-layout-shifts). These layout shifts occur when a
web font and its fallback font take up different amounts of space on the page.

For more information, see [Best practices for fonts](/font-best-practices/).

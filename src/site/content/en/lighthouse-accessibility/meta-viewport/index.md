---
layout: post
title: "`[user-scalable=\"no\"]` is used in the `<meta name=\"viewport\">` element or the `[maximum-scale]` attribute is less than `5`"
description: |
  Learn how to make your web page more accessible by making sure that browser
  zoom isn't disabled.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - meta-viewport
---

The `user-scalable="no"` parameter for the `<meta name="viewport">` element
disables browser zoom on a web page.
The `maximum-scale` parameter limits the amount the user can zoom.
Both are problematic for users with low vision who rely on browser zoom
to see the contents of a web page.

## How the Lighthouse browser zoom audit fails

Lighthouse flags pages that disable browser zooming:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="Lighthouse audit showing the viewport disables text scaling and zooming", width="800", height="227", class="w-screenshot" %}
</figure>

A page fails the audit if it contains a `<meta name="viewport">` tag with either of the following:
- A `content` attribute with a `user-scalable="no"` parameter
- A `content` attribute with a `maximum-scale` parameter set to less than `5`

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to avoid disabling browser zoom

Remove the `user-scalable="no"` parameter from the viewport meta tag and
make sure the `maximum-scale` parameter is set to `5` or greater.

## Resources

- [Source code for **`[user-scalable="no"]` is used in the `<meta name="viewport">` element or the `[maximum-scale]` attribute is less than 5** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/meta-viewport.js)
- [Zooming and scaling must not be disabled (Deque University)](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)

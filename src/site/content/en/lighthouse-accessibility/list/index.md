---
layout: post
title: "Lists do not contain only `<li>` elements and script supporting elements (`<script>` and `<template>`)"
description: |
  Learn how to make lists on your web page clear to assistive technology users
  by avoiding child elements that don't belong in lists.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - list
---

Screen readers and other assistive technologies depend on lists
being structured properly
to keep users informed of content within the lists.
The only content lists should contain should be within `<li>` elements.
They can also contain script supporting elements (`<script>` and `<template>`).

## How this Lighthouse audit fails

Lighthouse flags lists that contain content elements that shouldn't be in a list:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xtmwFU4ntCqAou16qd88.png", alt="Lighthouse audit showing lists contain content elements that shouldn't be within the lists", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to create correctly structured lists

Remove any elements in lists that don't belong there.
Ordered and unordered lists must only contain `<li>`, `<script>` or `<template>` elements.

Valid lists must have parent elements (`<ul>` or `<ol>` elements) and child elements (`<li>` elements).
Any other content elements are invalid.

## Resources

- [Source code for **Lists do not contain only `<li>` elements and script supporting elements (`<script>` and `<template>`)** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/list.js)
- [`<ul>` and `<ol>` must only directly contain `<li>`, `<script>` or `<template>` elements (Deque University)](https://dequeuniversity.com/rules/axe/3.3/list)

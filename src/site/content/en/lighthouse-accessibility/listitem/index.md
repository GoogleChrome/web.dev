---
layout: post
title: "List items (`<li>`) are not contained within `<ul>` or `<ol>` parent elements"
description: |
  Learn how to make list items on your web page accessible to assistive
  technology users by placing them in list elements.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - listitem
---

Screen readers and other assistive technologies
require list items (`<li>`) to be contained
within parent `<ul>` or `<ol>` to be announced properly.

When assistive technologies come to a list,
they notify users how many items are within the list.
If you don't wrap list items in a parent list element,
assistive technologies can't set user expectations correctly.

## How this Lighthouse audit fails

Lighthouse flags list items (`<li>`) that aren't contained
in `<ul>` or `<ol>` parent elements:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t0eKD6m7y03inCQUuyUx.png", alt="Lighthouse audit showing list item isn't contained within a parent list", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix orphaned list items

Wrap any orphaned `<li>` elements inside a `<ul>` or `<ol>` element.

## Resources

- [Source code for **List items (`<li>`) are not contained within `<ul>` or `<ol>` parent elements** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/listitem.js)
- [`<li>` elements must be contained in a `<ul>` or `<ol>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/listitem)

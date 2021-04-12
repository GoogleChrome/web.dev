---
layout: post
title: "`<dl>`s do not contain only properly ordered `<dt>` and `<dd>` groups, `<script>`, or `<template>` elements"
description: |
  Learn how to structure definition lists on your web page so that
  assistive technologies can interpret them.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - definition-list
---

Screen readers and other assistive technologies have a specific way of
announcing definition lists.
When definition lists are not properly marked up,
assistive technologies may produce confusing or inaccurate output.

## How this Lighthouse audit fails

Lighthouse flags `<dl>` elements that don't
contain properly ordered `<dt>` and `<dd>` groups,
`<script>`, or `<template>` elements:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7PIfPwOqBuptPXkECl2J.png", alt="Lighthouse audit showing definition lists do not contain properly ordered <dt> and <dd> groups, <script>, or <template> elements", width="800", height="223", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to structure definition lists correctly

Definition list items require `dl` elements around the list,
`dt` elements for each term, and `dd` elements for each definition.
Each set of `dt` elements must be followed by one or more `dd` elements.
For example:

```html
<dl>
  <dt>Trail shoe</dt>
    <dd>Extra grip for uneven, natural survaces, such as forest trails.</dd>
  <dt>Road shoe</dt>
    <dd>Extra cushioning for hard surfaces, such as sidewalks and roads.</dd>
</dl>
```

## Resources

- [Source code for **`<dl>`s do not contain only properly ordered `<dt>` and `<dd>` groups, `<script>`, or `<template>` elements** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/definition-list.js)
- [`<dl>` elements must only directly contain properly-ordered `<dt>` and `<dd>` groups, `<script>`, or `<template>` elements (Deque University)](https://dequeuniversity.com/rules/axe/3.3/definition-list)

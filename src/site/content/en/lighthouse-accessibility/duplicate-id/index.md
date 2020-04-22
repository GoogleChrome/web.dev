---
layout: post
title: "`[id]` attributes on the page are not unique"
description: |
  Learn how to make sure that all elements on your page are announced correctly
  by assistive technologies.
date: 2019-05-02
updated: 2020-04-22
web_lighthouse:
  - duplicate-id
noindex: true
---

{% Banner 'caution', 'body' %}This audit has been deprecated. Check out [`[id]` attributes on active, focusable elements are not unique](/duplicate-id-active) and [ARIA IDs are not all unique](/duplicate-id-aria) instead.{% endBanner %}

{% include 'content/lighthouse-accessibility/no-duplicate-ids.njk' %}

## How the Lighthouse duplicate ID audit fails

Lighthouse flags duplicate IDs found in a page:

<figure class="w-figure">
  <img class="w-screenshot" src="duplicate-id.png" alt="Lighthouse audit showing ID attributes on the page are not unique">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

{% include 'content/lighthouse-accessibility/fix-duplicate-ids.njk' %}

## Resources

- [Source code for **`[id]` attributes on the page are not unique** audit](https://github.com/GoogleChrome/lighthouse/blob/4e11bd297010a3957a6f76a8e25abddc7ed5a716/lighthouse-core/audits/accessibility/duplicate-id.js)
- [ID attribute values must be unique (Deque University)](https://dequeuniversity.com/rules/axe/3.3/duplicate-id)

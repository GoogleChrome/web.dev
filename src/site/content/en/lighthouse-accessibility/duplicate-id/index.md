---
layout: post
title: "`[id]` attributes on the page are not unique"
description: |
  Learn how to make sure that all elements on your page are announced correctly
  by assistive technologies.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - duplicate-id
---

{% include 'content/lighthouse-accessibility/no-duplicate-ids.njk' %}

## How the Lighthouse duplicate ID audit fails

Lighthouse flags duplicate IDs found in a page:

<figure class="w-figure">
  <img class="w-screenshot" src="duplicate-id.png" alt="Lighthouse audit showing ID attributes on the page are not unique">
</figure>

This audit is similar to the
[**`[id]` attributes on active, focusable elements are not unique**](/duplicate-id-active) and
[**ARIA IDs are not all unique**](/duplicate-id-aria) audits,
but checks for duplicate IDs in a different set of elements.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

{% include 'content/lighthouse-accessibility/fix-duplicate-ids.njk' %}

## Resources

- [Source code for **`[id]` attributes on the page are not unique** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/duplicate-id.js)
- [ID attribute values must be unique](https://dequeuniversity.com/rules/axe/3.3/duplicate-id)

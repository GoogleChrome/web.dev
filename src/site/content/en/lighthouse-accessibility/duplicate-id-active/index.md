---
layout: post
title: "`[id]` attributes on active, focusable elements are not unique"
description: |
  Learn how to [fix the problem identified by the audit].
web_lighthouse:
  - duplicate-id-aria
date: 2019-10-17
---

{% include 'content/lighthouse-accessibility/no-duplicate-ids.njk' %}

Avoiding duplicate IDs for focusable controls like buttons and checkboxes
is particularly important to ensure that users can access
all of your page's functionality.

## How Lighthouse identifies focusable elements with duplicate IDs

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags focusable elements that have duplicate IDs:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hAevzwng1erk5DYZjLyq.png", alt="Lighthouse audit showing focusable elements with duplicate IDs", width="800", height="185", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/focusable-els.njk' %}

This audit is similar to the
[**ARIA IDs are not all unique**](/duplicate-id-aria) audit
but checks for duplicate IDs in a different set of elements.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

{% include 'content/lighthouse-accessibility/fix-duplicate-ids.njk' %}

## Resources
- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/duplicate-id-active.js" rel="noopener">Source code for **`[id]` attributes on active, focusable elements are not unique** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/duplicate-id-active" rel="noopener">ID attribute value must be unique (Deque University)</a>

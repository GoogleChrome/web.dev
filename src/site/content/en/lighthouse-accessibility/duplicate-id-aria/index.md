---
layout: post
title: "ARIA IDs are not unique"
description: |
  Learn how to [fix the problem identified by the audit].
web_lighthouse:
  - duplicate-id-aria
date: 2019-10-17
---

{% include 'content/lighthouse-accessibility/no-duplicate-ids.njk' %}

Avoiding duplicate IDs is particularly important
when using the `aria-labelledby` attribute.
`aria-labelledby` provides an accessible name for an element
by pointing to a second element, using its ID.
If more than one element shares that ID,
assistive technologies will read the first instance,
which may not be what you intended.

## How Lighthouse identifies ARIA elements that refer to duplicate IDs

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags elements that share an ID referred to
by another element's `aria-labelledby` attribute:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Yfs0KHGsKcZg6XbeYuXQ.png", alt="Lighthouse audit showing ARIA elements with duplicate IDs", width="800", height="206", class="w-screenshot" %}
</figure>

This audit is similar to the
[**`[id]` attributes on active, focusable elements are not unique**](/duplicate-id-active) audit
but checks for duplicate IDs in a different set of elements.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix duplicate IDs

Change an ID value if it is used more than once.

For example, the following code sample includes two elements with the same ID.
One ID should be changed:

```html/1,4
<div role="tabpanel" aria-labelledby="tabpanel-label">
  <h2 id="tabpanel-label">
    Tab panel title
  </h2>
  <p id="tabpanel-label">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>
</div>
```

## Resources
- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/duplicate-id-aria.js" rel="noopener">Source code for **ARIA IDs are not all unique** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/duplicate-id-aria" rel="noopener">IDs used in ARIA and labels must be unique (Deque University)</a>

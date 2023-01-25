---
layout: post
title: "Definition list items are not wrapped in `<dl>` elements"
description: |
  Learn how to make sure assistive technologies can announce definition list
  items on your web page.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - dlitem
---

Definition list items (`<dt>` and `<dd>`) must be wrapped
in a parent `<dl>` element
to ensure that screen readers and other assistive technologies
can properly announce them.

## How this Lighthouse audit fails

Lighthouse reports when definition list items are not wrapped in `<dl>` elements:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EwELO9eYuXEqMQmySCG8.png", alt="Lighthouse audit showing definition list items are not wrapped in <dl> elements", width="800", height="365", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix orphaned definition list items

Wrap all definition list items in parent `dl` elements
to ensure the list follows the proper hierarchy.

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

- [Source code for **Definition list items are not wrapped in `<dl>` elements** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/dlitem.js)
- [`<dt>` and `<dd>` elements must be contained by a `<dl>` (Deque University)](https://dequeuniversity.com/rules/axe/3.1/dlitem)

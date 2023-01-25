---
layout: post
title: "Some elements have a `[tabindex]` value greater than `0`"
description: |
  Learn how to improve your web page's keyboard accessibility by avoiding
  an explicit keyboard navigation order.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - tabindex
---

Although technically valid,
using a `tabindex` greater than `0` is considered an anti-pattern because
it shifts the affected element to the end of the
[tab order](/keyboard-access/#focus-and-the-tab-order).
This unexpected behavior can make it seem like some elements can't be accessed
via keyboard, which is frustrating for users who rely on assistive technologies.

## How the Lighthouse `tabindex` audit fails

Lighthouse flags elements that have a `tabindex` value greater than `0`:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fj9urW8nMfivHXbT1TSr.png", alt="Lighthouse audit showing some elements have a tabindex value greater than 0", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix problematic `tabindex` values

If you have a `tabindex` greater than `0`,
and you're using a link or form element,
remove the `tabindex`.
HTML elements such as `<button>` or `<input>`
have keyboard accessibility built-in for free.

If you're using custom interactive components,
set the `tabindex` to `0`.
For example:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

If you need an element to come sooner or later in the tab order,
it should be moved to a different spot in the DOM.
Learn more in
[Control focus with tabindex](/control-focus-with-tabindex).

## Resources

- [Source code for **Some elements have a `[tabindex]` value greater than 0** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/tabindex.js)
- [Elements should not have tabindex greater than zero (Deque University)](https://dequeuniversity.com/rules/axe/3.3/tabindex)

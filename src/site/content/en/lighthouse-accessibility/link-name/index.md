---
layout: post
title: Links do not have a discernible name
description: |
  Learn how to make links on your web page more accessible by
  making sure they have names that can be interpreted by assistive technologies.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - link-name
---

Link text that is discernible, unique, and focusable
improves the navigation experience for users of screen readers
and other assistive technologies.

## How this Lighthouse audit fails

Lighthouse flags links that don't have discernible names:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="Lighthouse audit showing links do not have discernible names", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add accessible names to links

Similar to buttons,
links primarily get their accessible name from their text content.
Avoid filler words like "Here" or "Read more";
instead, put the most meaningful text into the link itself:

```html
Check out <a href="…">our guide to creating accessible web pages</a>.
</html>
```

Learn more in
[Label buttons and links](/labels-and-text-alternatives#label-buttons-and-links).

## Resources

- [Source code for **Links do not have a discernible name** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/link-name.js)
- [Links must have discernible text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/link-name)

---
layout: post
title: "`<object>` elements do not have `[alt]` text"
description: |
  Learn how to improve the accessibility of object elements on your web page by
  providing alternative text.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - object-alt
---

Screen readers and other assistive technologies cannot translate non-text content.
Adding alternative text to define `<object>` elements helps
assistive technologies convey meaning to users.

## How this Lighthouse audit fails

Lighthouse flags `<object>` elements that don't have alternative text:

<!--
***Todo*** Rob's docs in accessibility recommend describing objects in the inner text.
But the Lighthouse audit implies that it is checking for `alt` text.
Need to check how this audit fails.
Also need to talk with Rob the slight inconsistencies between
Rob's doc, the audit, and recommendations in deque docs.
-->
<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JWSzKy951NpiznLGxqoQ.png", alt="Lighthouse audit showing <object> elements do not have alternative text", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add alternative text to `<object>` elements

Describe the object in the text content of the `<object>` element.
In the example below `2019 Web Accessibility Report` is the description
of the object.

```html
<object type="application/pdf"
    data="/report.pdf"
    width="600"
    height="400">
2019 Web Accessibility Report
</object>
```

Learn more in [Include text alternatives for images and objects](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects).

{% Aside 'note' %}
You can also use `alt` and ARIA labels to describe object elements,
for example,
`<object type="application/pdf" data="/report.pdf alt="2019 Web Accessibility Report">`.
(See [&lt;object> elements must have alternate text](https://dequeuniversity.com/rules/axe/3.3/object-alt).)
{% endAside %}

## Tips for writing effective `alt` text

- As previously mentioned, describe the information contained in the embedded object.
- Alternative text should give the intent, purpose, and meaning of the object.
- Blind users should get as much information from alternative text as a sighted user gets from the object.
- Avoid non-specific words like "chart", "image", or "diagram".

Learn more in
[WebAIM's guide to Alternative Text](https://webaim.org/techniques/alttext/).

## Resources

- [Source code for **`<object>` elements do not have `[alt]` text** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/object-alt.js)
- [&lt;object> elements must have alternate text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/object-alt)

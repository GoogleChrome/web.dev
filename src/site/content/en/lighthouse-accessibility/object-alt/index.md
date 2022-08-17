---
layout: post
title: "`<object>` elements do not have alt text"
description: |
  Learn how to improve the accessibility of `<object>` elements on your web page by
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

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JWSzKy951NpiznLGxqoQ.png", alt="Lighthouse audit showing <object> elements do not have alternative text", width="800", height="206" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add alternative text to `<object>` elements

Describe the object in an ARIA label or the `title` attribute.
In the example below `2019 Web Accessibility Report` is the description
of the object.

```html
<object type="application/pdf"
    data="/report.pdf"
    width="600"
    height="400"
    aria-label="2019 Web Accessibility Report">
</object>
```

See all valid alt text examples in [&lt;object> elements must have alternate text](https://dequeuniversity.com/rules/axe/3.3/object-alt).

{% Aside 'note' %}
The `alt` attribute and the inner text of the `<object>` element [are *not*
recognized as alt text by Lighthouse](https://github.com/dequelabs/axe-core/issues/3318).
{% endAside %}

## Tips for writing effective alt text

- As previously mentioned, describe the information contained in the embedded object.
- Alternative text should give the intent, purpose, and meaning of the object.
- Blind users should get as much information from alternative text as a sighted user gets from the object.
- Avoid non-specific words like "chart", "image", or "diagram".

Learn more in
[WebAIM's guide to Alternative Text](https://webaim.org/techniques/alttext/).

## Resources

- [Source code for **`<object>` elements do not have alt text** audit](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/object-alt.js)
- [`<object>` elements must have alternate text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/object-alt)

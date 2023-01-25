---
layout: post
title: Buttons do not have an accessible name
description: |
  Learn how to improve the accessibility of your web page by making sure that
  all buttons have names that assistive technology users can access.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - button-name
---

When a button doesn't have an accessible name,
screen readers and other assistive technologies announce it as _button_,
which provides no information to users about what the button does.

## How the Lighthouse button name audit fails

Lighthouse flags buttons that don't have text content or an `aria-label` property:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="Lighthouse audit showing buttons do not have an accessible name", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add accessible names to buttons

For buttons with visible labels,
add text content to the `button` element.
Make the label a clear call to action.
For example:

```html
<button>Book room</button>
```

For buttons without visible labels, like icon buttons,
use the `aria-label` attribute to clearly describe the action
to anyone using an assistive technology, for example:

{% Glitch {
  id: 'lh-button-name',
  path: 'index.html',
  previewSize: 0,
  height: 480
} %}

{% Aside %}
This sample app relies on Google's
[Material icon font](https://google.github.io/material-design-icons/),
which uses [ligatures](https://alistapart.com/article/the-era-of-symbol-fonts/)
to convert the buttons' inner text to icon glyphs.
Assistive technologies will refer to the `aria-label`
rather than the icon glyphs when announcing the buttons.
{% endAside %}

See also [Label buttons and links](/labels-and-text-alternatives#label-buttons-and-links).

## Resources

- [Source code for **Buttons do not have an accessible name** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/button-name.js)
- [Buttons must have discernible text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/button-name)

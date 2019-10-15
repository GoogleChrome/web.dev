---
layout: post
title: Buttons do not have an accessible name
description: |
  Learn how to improve the accessibility of your web page by making sure that
  all buttons have names that assistive technology users can access.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - button-name
---

When a button doesn't have an accessible name,
screen readers and other assistive technologies announce it as _button_,
which provides no information to users about what the button does.

## How the Lighthouse button name audit fails

Lighthouse flags buttons that don't have accessible names:

<figure class="w-figure">
  <img class="w-screenshot" src="button-name.png" alt="Lighthouse audit showing buttons do not have an accessible name">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add accessible names to buttons

For buttons with visible labels,
add inner text to the `button` element.
Make the label a clear call to action.
For example:

```html
<button>Book room</button>
```

For buttons without visible labels, like icon buttons,
use the `aria-label` attribute to clearly describe the action
to anyone using an assistive technology, for example:

```html
<button aria-label="Search"></button>
```

See also [Label buttons and links](/labels-and-text-alternatives#label-buttons-and-links).

## Resources

- [Source code for **Buttons do not have an accessible name** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/button-name.js)
- [Buttons must have discernible text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/button-name)

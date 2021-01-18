---
layout: post
title: The page has a logical tab order
description: |
  Learn how to make it easier for keyboard users to navigate your web page
  by placing tab stops in a logical order.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - logical-tab-order
---

Many different users rely on the keyboard to navigate applications,
from users with temporary and permanent motor impairments
to users who use keyboard shortcuts to be more efficient and productive.
A logical tab order is an important part
of providing a smooth keyboard navigation experience.

## How to manually test

To check if your application's tab order is logical,
try tabbing through your page.
The order in which elements are focused should aim to follow the DOM order.
In general,
focus should follow reading order, moving from left to right,
from the top to the bottom of your page.

Learn more in [Keyboard access fundamentals](/keyboard-access).

Are you able to reach all of the interactive controls on the page?
If not, you may need to use `tabindex` to improve the focusability of those controls.
The general rule of thumb is that any control a user can interact with or provide input to
should aim to be focusable and display a focus indicator.
If a keyboard user can't see what's focused, they have no way of interacting with the page.

## How to fix

If the focus order seems wrong,
you should rearrange the elements in the DOM to make the tab order more natural.

If you aren't able to reach all of the interactive controls on the page,
the first go-to fix is to replace custom controls with standardized HTML alternatives.
For example,
replace a `<div>` acting like a button with `<button>`.
Using built-in HTML elements can greatly improve the accessibility of your site,
and significantly cut down on your workload.

If you're building custom interactive components with no standardized HTML equivalent,
use the `tabindex` attribute to ensure that they're keyboard accessible.
For example:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

Learn more in [Control focus with tabindex](/control-focus-with-tabindex).

## Resources

[Source code for **The page has a logical tab order** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/logical-tab-order.js)

---
layout: post
title: Visual order on the page follows DOM order
description: |
  Learn about visual-order-follows-dom audit.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - visual-order-follows-dom
---

Implementing a logical tab order is an important part of
providing your users with a smooth keyboard navigation experience.
Screen readers and other assistive technologies navigate the page in DOM order.
The flow of information should make sense.

## How to manually test

To check if your application's tab order is logical,
try tabbing through your page.
In general,
focus should follow reading order,
moving from left to right,
from the top to the bottom of your page.

There are two main ideas to keep in mind when assessing your tab order:

- Are the elements in the DOM arranged in a logical order?
- Is offscreen content correctly hidden from navigation?

Notice any jumps in navigation that seem jarring.
Also notice any offscreen jumps,
where tabbing brings you to content that's not meant to be visible.

Learn more in [Keyboard access fundamentals](/keyboard-access).

## How to fix

If the focus order seems wrong,
you should rearrange the elements in the DOM to make the tab order more natural.

If you've used CSS to visually reposition elements,
assistive technology users will experience a nonsensical navigation.
Instead of using CSS,
move the element to an earlier position in the DOM.

If offscreen content is still accessible to keyboard controls,
consider removing it using `tabindex="-1"`.

Learn more in [Control focus with tabindex](/control-focus-with-tabindex).

## Resources

[Source code for **Visual order on the page follows DOM order** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/visual-order-follows-dom.js)

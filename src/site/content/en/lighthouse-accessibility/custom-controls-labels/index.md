---
layout: post
title: Custom controls have associated labels
description: |
  Learn how to improve your web page's accessibility by making sure that
  all custom controls have labels that assistive technology users can access.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - custom-controls-labels
---

Custom interactive controls should be focusable.
If you use JavaScript to turn a `<div`> into a fancy dropdown,
it won't automatically be inserted into the tab order.
You need to manually check that all custom controls are keyboard focusable.
See also [Keyboard access fundamentals](/keyboard-access).

## How to manually test

To test that the custom control is focusable,
press the `TAB` key to navigate through the site:

{% Glitch {
  id: 'tabindex-zero',
  path: 'index.html',
  height: 346
} %}

Are you able to reach all of the interactive controls on the page?
If not, you may need to use `tabindex` to improve the focusability of those controls.
See also [Control focus with tabindex](/control-focus-with-tabindex).

## How to fix

To make a custom control focusable,
insert the custom control element into the natural tab order using `tabindex="0"`.
For example:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

## Why this matters

For users who either cannot or choose not to use a mouse,
keyboard navigation is the primary means of reaching everything on a screen.
Good keyboarding experiences depend on a logical tab order and easily discernable focus styles.
If a keyboard user can't see what's focused, they have no way of interacting with the page.

Learn more in [How to do an Accessibility Review](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader).

## Resources

- [Source code for **Custom controls have associated labels** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/manual/custom-controls-labels.js)
- [Some elements have a `[tabindex]` value greater than `0`](/tabindex)

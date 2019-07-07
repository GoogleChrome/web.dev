---
layout: post
title: Manually check custom interactive controls are keyboard focusable and display a focus indicator
description: |
  Learn about focusable-controls audit.
web_lighthouse:
  - focusable-controls
---

Manually check that all custom controls are keyboard focusable
and display a focus indicator.
The order in which elements are focused should aim to follow the DOM order.
If you're unsure which elements should receive focus,
see [Introduction to Focus](https://developers.google.com/web/fundamentals/accessibility/focus/).

## How to manually test

To test that the custom control is focusable
and displays a focus indicator,
start by tabbing through your site.
Use `TAB` (or `SHIFT +
TAB`) to move between controls, and use the arrow keys and
`ENTER` and `SPACE` to manipulate their values
(see also [Keyboard access fundamentals](/keyboard-access)):

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/interactive-elements?path=index.html&previewSize=100&attributionHidden=true"
    alt="interactive-elements on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Are you able to reach all of the interactive controls on the page?
Is there a focus indicator on each interactive control?

## How to fix

If you aren't able to tab through all elements on a page,
you may need to use `tabindex` to improve the focusability of those controls.

To make a custom control focusable,
insert the custom control element into the natural tab order using `tabindex="0"`
(see also [Control focus with tabindex](/control-focus-with-tabindex)).
For example:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

You may also need to add the appropriate ARIA roles to the custom control elements.
See [Manually check all custom controls have appropriate ARIA roles](/custom-control-roles).

If you're not seeing a focus indicator,
consider using `:focus` to always show a focus indicator.
Regardless of whether you use a mouse or a keyboard to tab to it,
the button's focus indicator always looks the same
(see also [Style focus](/style-focus)).

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/focus-style?path=index.html&previewSize=100&attributionHidden=true"
    alt="focus-visible on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Why this matters

For users who either cannot or choose not to use a mouse,
keyboard navigation is the primary means of reaching everything on a screen.
Good keyboarding experiences depend on a logical tab order and easily discernable focus styles.
If a keyboard user can't see what's focused, they have no way of interacting with the page.

Learn more in [How to do an Accessibility Review](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader).

## More information

- [Check all custom controls are keyboard focusable audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/manual/focusable-controls.js)
- [Ensure `tabindex` attribute values are not greater than 0](/tabindex)
- [Use semantic HTML for easy keyboard wins](/use-semantic-html)

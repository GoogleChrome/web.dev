---
layout: post
title: Custom controls have ARIA roles
description: |
  Learn how to improve your web page's accessibility by making sure custom
  controls have ARIA roles that assistive technologies can interpret.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - custom-control-roles
---

Check that all custom controls have an appropriate `role` and
any required ARIA attributes that confer their properties and state.
For example, a custom checkbox needs a `role="checkbox"` and
`aria-checked="true|false"` to properly convey its state.
See the [Introduction to ARIA](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/)
for a general overview of how ARIA can provide missing semantics for custom controls.

## How to manually test

To check that all custom interactive controls have appropriate ARIA roles,
test the page using either the
[Chrome DevTools accessibility pane](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
or a screen reader.
[JAWS](https://www.freedomscientific.com/products/software/jaws/) and
[NVDA](https://www.nvaccess.org/)
are two of the more popular screen readers for Windows.
[VoiceOver](https://www.apple.com/accessibility/mac/vision/)
is the screen reader built into MacOS.

Using CSS, it's possible
to style the `<div>` and `<button>` elements so they convey the same visual affordances,
but the two experiences are very different when using a screen reader.
A `<div>` is just a generic grouping element,
so a screen reader only announces the text content of the `<div>`.
The `<button>` is announced as a "button,"
a much stronger signal to the user that it's something they can interact with.
See also [Semantics and screen readers](/semantics-and-screen-readers).

## How to fix

The simplest
and often best solution to this problem
is to avoid custom interactive controls altogether.
For example, replace a `<div>` that's acting like a button
with an actual `<button>`.

If you must keep the `<div>`,
then add `role="button"` and `aria-pressed="false"` to the `<div>`:

{% Glitch {
  id: 'gorgeous-raven',
  path: 'example.html:13:39',
  height: 346
} %}

Now screen readers will announces the role and interactive state for the `<div>`.

## Why this matters

The only way to truly understand how assistive technology users
experience your content
is to check that content yourself using a screen reader.
Using a screen reader first hand will give you a clear understanding
of how your content is labeled, and if there are any obstructions to
assistive technology navigation.
If you're unfamiliar with how semantic markup gets interpreted by assistive technology,
see the [Introduction to Semantics](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/) for a refresher.

See also [How to Do an Accessibility Review](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader).

## Resources

[Source code for **Custom controls have ARIA roles** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/manual/custom-controls-roles.js)

---
layout: post
title: Manually check all custom controls have appropriate ARIA roles
description: |
  Learn about custom-controls-labels audit.
web_lighthouse:
  - custom-controls-labels
---

Check all custom controls have appropriate `role` and
any required ARIA attributes that confer their interactive state.
For example, a custom checkbox needs a `role="checkbox"` and
`aria-checked="true|false"` to properly convey its state.
See the [Introduction to ARIA](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/)
for a general overview of how ARIA can provide missing semantics for custom controls.

## How to manually test

To check all custom interactive controls have appropriate ARIA roles,
test the page using a Screen Reader.
This example compares a `<div>` to a `<button>`
(you'll need to click "Enable ChromeVox Lite" to test it):

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/div-vs-button?path=example.html&previewSize=100&attributionHidden=true"
    alt="div-vs-button on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Using CSS, it's possible
to style the `<div>` and `<button>` elements so they convey the same visual affordances,
but the two experiences are very different when using the screen reader.
A `<div>` is just a generic grouping element,
sp the screen reader only announces the `div`'s text content.
The `<button>` is announced as a "button",
a much stronger signal to the user that this is something with which they can interact.
See also [Semantics and screen readers](/semantics-and-screen-readers).

## How to fix

So the simplest,
and reasonably the best solution to this problem
is to aviod custom interactive controls all together.
For example, replace the `<div>` that's acting like a button
with an actual `<button>`.

If you must keep the `<div>`,
then add `role="button"`and `aria-pressed="false"` to the `<div>`:

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/gorgeous-raven?path=example.html:13:39"
    alt="div-vs-button on Glitch with role and ARIA attribute"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Now the screen reader announces the role and interactive state for the `<div>`.

## Why this matters

The only way to truly understand how screen reader users experience your content
is to check that content yourself using a screen reader.
Using a screen reader first hand will give you a clear understanding
of how your content is labeled, and if there are any obstructions to screen reader navigation.
If you're unfamiliar with how semantic markup gets interpreted by assistive technology, 
see the [Introduction to Semantics](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/) for a refresher.

See also [How to Do an Accessibility Review](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader).

## More information

- [Check all custom controls have appropriate ARIA roles audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/manual/custom-controls-roles.js)

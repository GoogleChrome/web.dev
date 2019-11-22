---
layout: post
title: User focus is not accidentally trapped in a region
description: |
  Learn how to improve you web page's accessibility for keyboard users by
  preventing focus from being trapped in a region of the page.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - focus-traps
---

Keyboard focus should never be locked or trapped at one particular page element.
Users should be able to navigate to and from all page elements
using only the keyboard.

## How to manually test

To test users can't accidentally trap their focus,
navigate to and from all page elements using only the keyboard.
Use `TAB` to navigate "forward" and `SHIFT + TAB` to navigate "backward."

If you can't tab through all page elements successfully,
then you've failed the test.
When testing, watch out in particular for autocomplete widgets,
where keyboard focus may get stuck.

## How to fix

Pages that present content in multiple formats, such as modal dialogs,
widgets, are at risk for focus traps.
In the case of a displaying a modal,
when you don't want the user interacting with the rest of the page,
it makes sense to temporarily trap the user.

But you should aim to provide a keyboard-accessible method of escaping the modal as well.
Check out [this example on how to create an accessible modal](https://github.com/gdkraus/accessible-modal-dialog).
See also [Modals and Keyboard Traps](https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex#modals_and_keyboard_traps).
In this example,
you get the desired behaviors of a modal,
without forcing the user to refresh the page to get out of the focus trap.

## Why this matters

For users who either cannot or choose not to use a mouse,
keyboard navigation is the primary means of reaching everything on a screen.
Good keyboarding experiences depend on a logical tab order and easily discernible focus styles.
If a keyboard user gets trapped in a particular page element,
they have no way of interacting with the page.

Learn more in [How to do an Accessibility Review](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader).

## Resources

[Source code for **User focus is not accidentally trapped in a region** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/manual/focus-traps.js)

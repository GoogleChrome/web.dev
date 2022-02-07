---
layout: post
title: Offscreen content is hidden from assistive technology
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by hiding off-screen content from assistive technologies.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - offscreen-content-hidden
---

Ensure that only relevant parts of the page are exposed to screen readers and
other assistive technologies.
For instance,
content that's offscreen or just presentational
should be hidden from assistive technologies.

## How to manually test

To check that offscreen content is hidden,
you need to manually test that content using a screen reader.
- For Mac users, check out
[this video on using VoiceOver](https://www.youtube.com/watch?v=5R-6WvAihms&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=6).
- For PC users, check out
[this video on using NVDA](https://www.youtube.com/watch?v=Jao3s_CwdRU&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=4).
- For Chromebooks users, check out
[ChromeVox, the built-in screen reader](https://support.google.com/chromebook/answer/7031755?hl=en).

Use the `TAB` key to tab through your page.
The screen reader shouldn't announce hidden content.

## How to fix

To hide offscreen content,
remove the element containing that content from the
tab order by setting it to `display: none` or `visibility: hidden`.

For example:

```css
.remove-me {
  visibility: hidden;
}
```

```html
<button class="remove-me">Can't reach me with the TAB key!</button>
```

See also [Correctly set the visibility of offscreen content](/keyboard-access/#correctly-set-the-visibility-of-offscreen-content).

## Resources

[Source code for **Offscreen content is hidden from assistive technology** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/offscreen-content-hidden.js)

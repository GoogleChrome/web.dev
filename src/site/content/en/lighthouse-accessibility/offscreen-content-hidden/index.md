---
layout: post
title: Manually check offscreen content is hidden from assistive technology
description: |
  Learn about offscreen-content-hidden audit.
web_lighthouse:
  - offscreen-content-hidden
---

Ensure only relevant parts of the page are exposed to assistive technology.
For instance,
content that's offscreen or just presentation
should be hidden from a screen reader.

## How to manually test

To check offscreen content is hidden,
you need to manually test that content using a screen reader.
For Mac users, checkout
[this video on using VoiceOver](https://www.youtube.com/watch?v=5R-6WvAihms&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=6).
For PC users, checkout
[this video on using NVDA](https://www.youtube.com/watch?v=Jao3s_CwdRU&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=4).
For Chromebooks users, checkout
[ChromeVox, the built-in screen reader](https://support.google.com/chromebook/answer/7031755?hl=en).

Use the `TAB` key to tab through your page,
the screen reader shouldn't announce hidden content.

## How to fix

To hide offscreen content,
remove the element containing that content from the
tab order by setting it to `display: none` or `visiblity: hidden`.

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

## More information

- [Check offscreen content is hidden from assistive technology audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/offscreen-content-hidden.js)
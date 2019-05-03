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
remove the element containing that content from the tab order
using `tabindex="-1"`.

<!--
***Todo*** Ask Rob if `aria-hidden="true"` is also necessary to truly remove something.
-->
For example:

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

This removes an element from the natural tab order,
but the element can still be
focused by calling its `focus()` method.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-negative-one?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

See also [Control focus with tabindex](/control-focus-with-tabindex).

## More information

- [Check offscreen content is hidden from assistive technology audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/offscreen-content-hidden.js)
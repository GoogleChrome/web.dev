---
layout: post
title: Avoid invisible text during font loading
authors:
  - katiehempenius
description: |
  Fonts are often large files that take awhile to load. To deal with this, some
  browsers hide text until the font loads (the "flash of invisible text"). If
  you're optimizing for performance, you'll want to avoid the "flash of
  invisible text" and show content to users immediately using a system font.
date: 2018-11-05
codelabs:
  - codelab-avoid-invisible-text
tags:
  - performance
feedback:
  - api
---

## Why should you care?

Fonts are often large files that take awhile to load. To deal with this, some
browsers hide text until the font loads (the "flash of invisible text"). If
you're optimizing for performance, you'll want to avoid the "flash of invisible
text" and show content to users immediately using a system font (the "flash of
unstyled text").

## Display text immediately

This guide outlines two ways to achieve this: the first approach is very simple
but does not have universal browser
[support](https://caniuse.com/#search=font-display); the second approach is more
work but has full browser support. The best choice for you is the one that
you'll actually implement and maintain.

## Option #1: Use font-display

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Before</th>
        <th>After</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td>
<code>@font-face {
  font-family: Helvetica;
  <strong>font-display: swap;</strong>
}
</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

[`font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
is an API for specifying font display strategy. `swap` tells the browser that
text using this font should be displayed immediately using a system font. Once
the custom font is ready, the system font is swapped out.

If a browser does not support `font-display`, the browser continues to follow
it's default behavior for loading fonts. Check which browsers support
`font-display` [here](https://caniuse.com/#search=font-display).

These are the default font-loading behaviors for common browsers:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th><strong>Browser</strong></th>
        <th><strong>Default behavior if font is not ready…</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Edge</td>
        <td>Uses a system font until font is ready. Swaps out font.</td>
      </tr>
      <tr>
        <td>Chrome</td>
        <td>
          Will hide text for up to 3 seconds. If text is still not ready, uses a
          system font until font is ready. Swaps out font.
        </td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          Will hide text for up to 3 seconds. If text is still not ready, uses a
          system font until font is ready. Swaps out font.
        </td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>Hides text until font is ready.</td>
      </tr>
    </tbody>
  </table>
</div>

## Option #2: Wait to use custom fonts until they are loaded

With a bit more work, the same behavior can be implemented to work across all
browsers.

There are three parts to this approach:

+  Don't use a custom font on initial page load. This ensures that the
    browser displays text immediately using a system font.
+  Detect when your custom font is loaded. This can be accomplished with a
    couple lines of JavaScript code, thanks to the [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) library.
+  Update page styling to use the custom font.

Here are the changes you can expect to make in order to implement this:

+  Refactor your CSS to not use a custom font on initial page load.
+  Add a script to your page. This script detects when the custom font is
    loaded and then will update the page styling.

{% Aside 'codelab' %}
[Use Font Face Observer to display text immediately](/codelab-avoid-invisible-text).
{% endAside %}

## Verify

Run Lighthouse to verify the site is using `font-display: swap` to display
text:

{% Instruction 'audit-performance', 'ol' %}

Confirm that the **Ensure text remains visible during webfont load** audit is passing.

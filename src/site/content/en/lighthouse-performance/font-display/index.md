---
layout: post
title: Ensure text remains visible during webfont loads
description: |
  Learn about the font-display audit.
web_lighthouse:
  - font-display
---

Fonts are often large files that take awhile to load.
Some browsers hide text until the font loads causing the "flash of invisible text".
You need to ensure that text remains visible during webfont loads.
Lighthouse reports in the Diagnostics section any font URLs that may flash invisible text:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="font-display.png" alt="Lighthouse: Ensure text remains visible during webfont loads">
  <figcaption class="w-figcaption">
    Ensure text remains visible during webfont loads.
  </figcaption>
</figure>

## Easiest way to avoid showing invisible text

The easiest way to avoid showing invisible text while custom fonts load,
is to show a system font while waiting.
By including `font-display: swap` in your `@font-face` style,
you can fix this problem in most modern browsers:

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

The [font-display API](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
specifies the font display strategy.
`swap` tells the browser that text using this font should be displayed immediately using a system font.
Once the custom font is ready, the system font is swapped out
(see [Avoid invisible text during loading](/avoid-invisible-text)).

## Browser support

It's worth mentiong that not all major browsers support `font-display: swap`,
so you may need to do a bit more work to fix the invisible text problem.
Follow the [Avoid flast of invisible text codelab](/codelab-avoid-invisible-text)
to learn how to avoid this invisible text across all browsers.

## More information

- [Font-display audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js)
- [Controlling font performance with font displays](https://developers.google.com/web/updates/2016/02/font-display)

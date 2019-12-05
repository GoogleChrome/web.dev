---
layout: post
title: Ensure text remains visible during webfont load
description: |
  Learn how to use the font-display API to make sure your web page text
  will always be visible to your users.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - font-display
---

Fonts are often large files that take awhile to load.
Some browsers hide text until the font loads,
causing a [flash of invisible text (FOIT)](/avoid-invisible-text).

## How the Lighthouse font-display audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags any font URLs that may flash invisible text:

<figure class="w-figure">
  <img class="w-screenshot" src="font-display.png" alt="A screenshot of the Lighthouse Ensure text remains visible during webfont loads audit">
</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to avoid showing invisible text

The easiest way to avoid showing invisible text while custom fonts load
is to temporarily show a system font.
By including `font-display: swap` in your `@font-face` style,
you can avoid FOIT in most modern browsers:

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
specifies how a font is displayed.
`swap` tells the browser that text using the font should be displayed immediately using a system font.
Once the custom font is ready, it replaces the system font.
(See the [Avoid invisible text during loading](/avoid-invisible-text) post
for more information.)

### Google Fonts

Add the `&display=swap` [parameter](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#Basics_anatomy_of_a_URL) to the end of your Google Fonts URL:
```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## Browser support

It's worth mentioning that not all major browsers support `font-display: swap`,
so you may need to do a bit more work to fix the invisible text problem.
See the [Avoid flash of invisible text codelab](/codelab-avoid-invisible-text)
to learn how to avoid FOIT across all browsers.

## Resources

- [Source code for **Ensure text remains visible during webfont load** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js)
- [Avoid invisible text during loading](/avoid-invisible-text)
- [Controlling font performance with font displays](https://developers.google.com/web/updates/2016/02/font-display)

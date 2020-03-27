---
title: The color-scheme CSS property and meta tag
subhead: |
  The color-scheme CSS property and the corresponding meta tag
  allow developers to opt in their sites to theme-specific defaults of the user-agent stylesheet,
  for example for form controls, scroll bars, as well as CSS system colors.
  At the same time, this feature prevents browsers from applying any transformations on their own.
authors:
  - thomassteiner
date: 2020-03-27
hero: hero.jpg
alt: Pigeons on a wall with a sharp black and white contrast in the background.
description: |
  The color-scheme CSS property and the corresponding meta tag
  allow developers to opt in their sites to theme-specific defaults of the user-agent stylesheet,
  for example for form controls, scroll bars, as well as CSS system colors.
  At the same time, this feature prevents browsers from applying any transformations on their own.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - css
  - dark-mode
  - dark-theme
  - prefers-color-scheme
  - color-scheme
draft: true
---
The
[`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
user preference media feature gives developers full control over their sites' appearances.
You actually may have read my article
[`prefers-color-scheme`: Hello darkness, my old friend](/prefers-color-scheme/),
where I have documented everything I know about creating amazing dark mode experiences.

One puzzle piece that was missing in the article is
the `color-scheme` CSS property and the corresponding meta tag.
They both make your developer life easier
by allowing you to opt in to theme-specific defaults of the user-agent stylesheet,
for example for form controls, scroll bars, as well as CSS system colors.
At the same time, this feature prevents browsers from applying any transformations on their own.

## The user-agent stylesheet

Before I continue, let me briefly describe what a user-agent stylesheet is:
a user-agent (UA for short) stylesheet determines the default look and feel of a page.
As the name suggests, a UA stylesheet is something that is dependent on the UA in question.
You can have a look at
[Chrome's](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
(and Chromium's) UA stylesheet and compare it to
[Firefox’s](https://dxr.mozilla.org/mozilla-central/source/layout/style/res/html.css) or
[Safari's](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) (and WebKit's).
Typically, all UA stylesheets agree and make texts black and background colors white,
but there are also differences, for example, how to display form controls.

Let's have a closer look at
[WebKit's UA stylesheet]([Safari's](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
and what it does regarding dark mode (do a full text search for "dark" in the code).
It changes the UA stylesheet's default values based on whether dark mode is on or off.
To illustrate this, here is one such CSS rule (using the
[`:matches`](https://css-tricks.com/almanac/selectors/m/matches/)
pseudo class and WebKit-internal variables like `-apple-system-control-background`,
as well as the WebKit-internal preprocessor directive `#if defined`):

```css
input,
input:matches([type="password"], [type="search"]) {
  -webkit-appearance: textfield;
  #if defined(HAVE_OS_DARK_MODE_SUPPORT) &&
      HAVE_OS_DARK_MODE_SUPPORT
    color: text;
    background-color: -apple-system-control-background;
  #else
    background-color: white;
  #endif
  /* snip */
}
```

You will notice some non-standard values for the `color` and `background-color` properties above.
Neither `text` nor `-apple-system-control-background` are valid CSS colors,
they are WebKit-internal *semantic* colors.

Turns out, CSS has standardized semantic system colors, too, specified in
[CSS Color Module Level 4](https://drafts.csswg.org/css-color/#css-system-colors).
For example, `Canvas` is for background of application content or documents, whereas
`CanvasText` is for text in application content or documents.
The two go together and should not be used in isolation.

UA stylesheets can make use of their own proprietary or standardized semantic system colors
to determine how HTML elements should be rendered by default.

If the operating is set to a dark theme, `CanvasText` (or `text` respectively)
would be set to a light white,
and `Canvas` (or `-apple-system-control-background`) would be set to a dark black.
The UA stylesheet would then assign the following CSS only once, and cover both light and dark mode.

```css
body {
  color: CanvasText;
  background-color: Canvas
}
```

## Demo

You can see the effects of `color-scheme` in action in the demo embedded below, or
[directly on Glitch](https://color-scheme-demo.glitch.me/).

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/color-scheme-demo?path=index.html&previewSize=100"
    title="color-scheme-demo on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;"
    loading="lazy">
  </iframe>
</div>

## Acknowledgements

Hero image by
[Philippe Leone](https://unsplash.com/@philinit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on [Unsplash](https://unsplash.com/photos/dbFfEBOCrkU).

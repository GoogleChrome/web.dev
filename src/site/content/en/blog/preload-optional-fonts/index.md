---
title: 'Prevent layout shifting and flashes of invisible text (FOIT) by preloading optional fonts'
subhead: 'Starting in Chrome 83, link rel="preload" and font-display: optional can be combined to remove layout jank completely'
authors:
  - houssein
date: 2020-03-18
hero: image/admin/wv5DLtYiAhHm4lNemN1E.jpg
alt: A large letter A from a type set sitting on a white table.
description: |
  By optimizing rendering cycles, Chrome 83 eliminates layout shifting when
  preloading optional fonts. Combining <link rel="preload"> with font-display: optional is the
  most effective way to guarantee jank-free rendering of custom fonts.
tags:
  - blog
  - performance
  - fonts
feedback:
  - api
---

{% Aside %}
  In Chrome 83, new font loading improvements have been made to completely eliminate layout shifting and flash of invisible text (FOIT) when optional fonts are preloaded.
{% endAside %}

By optimizing rendering cycles, Chrome 83 eliminates layout shifting when preloading optional fonts.
Combining `<link rel="preload">` with `font-display: optional` is the most effective way to
guarantee no layout jank when rendering custom fonts.

## Browser compatibility {: #compatibility }

Check out MDN's data for up-to-date cross-browser support information:

* [`<link rel="preload">`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)
* [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#Browser_compatibility)

## Font rendering

Layout shifting, or re-layout, occurs when a resource on a web page changes dynamically, resulting in
a "shift" of content. Fetching and rendering web fonts can directly cause layout shifts in one of
two ways:

-  A fallback font is swapped with a new font ("flash of unstyled text")
-  "Invisible" text is shown until a new font is rendered into the page ("flash of invisible text")

The CSS [`font-display`](https://font-display.glitch.me/) property provides a way to modify
rendering behavior of custom fonts through a range of different supported values (`auto`, `block`,
`swap`, `fallback`, and `optional`). Choosing which value to use depends on the preferred behavior
for asynchronously loaded fonts. However, every one of these supported values can trigger re-layout
in one of the two ways listed above, until now!

{% Aside %}
  The [Cumulative Layout Shift](/cls/) metric makes it possible to measure the layout
  instability on a web page.
{% endAside %}

## Optional fonts

The `font-display` property uses a timeline of three periods to handle fonts that need to be
downloaded before they can be rendered:

-  **Block:** Render "invisible" text, but switch to the web font as soon as it finishes loading.
-  **Swap:** Render text using a fallback system font, but switch to the web font as soon as it
   finishes loading.
-  **Fail:** Render text using a fallback system font.

Previously, fonts designated with `font-display: optional` had a 100ms block period and no swap
period. This means that "invisible" text is displayed very briefly before switching to a fallback
font. If the font is not downloaded within 100ms, then the fallback font is used and no swapping
occurs.

<figure class="w-figure">
  {% Img src="image/admin/WHLORYEu864QRRveFQUz.png", alt="Diagram showing previous optional font behavior when font fails to load", width="800", height="340" %}
  <figcaption class="w-figcaption">Previous <code>font-display: optional</code> behavior in Chrome when font is downloaded <b>after</b> the 100ms block period</figcaption>
</figure>

However, in the case that the font is downloaded before the 100ms block period completes, the custom
font is rendered and used on the page.

<figure class="w-figure">
  {% Img src="image/admin/mordYRjmCCDtlMcNXEOU.png", alt="Diagram showing previous optional font behavior when font loads in time", width="800", height="318" %}
  <figcaption class="w-figcaption">Previous <code>font-display: optional</code> behavior in Chrome when font is downloaded <b>before</b> the 100ms block period</figcaption>
</figure>

Chrome re-renders the page **twice** in both instances, regardless of whether the fallback font
is used or if the custom font finishes loading in time. This causes a slight flicker of invisible
text and, in cases when a new font is rendered, layout jank that moves some of the page's content.
This occurs even if the font is stored in the browser's disk cache and can load well before the
block period is complete.

[Optimizations](https://bugs.chromium.org/p/chromium/issues/detail?id=1040632) have landed in Chrome 83 to entirely remove the first render cycle for optional fonts
that are preloaded with [`<link rel="preload'>`](/codelab-preload-web-fonts/).
Instead, rendering is blocked until the custom font has finished loading or a certain period of time
has passed. This timeout period is currently set at 100ms, but may possibly change in the near
future to optimize performance.

<figure class="w-figure">
  {% Img src="image/admin/zLldiq9J3duBTaeRN88e.png", alt="Diagram showing new preloaded optional font behavior when font fails to load", width="800", height="353" %}
  <figcaption class="w-figcaption">New <code>font-display: optional</code> behavior in Chrome when fonts are preloaded and font is downloaded <b>after</b> the 100ms block period (no flash of invisible text)</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/OEHClGFMFspaWjb3xXLY.png", alt="Diagram showing new preloaded optional font behavior when font loads in time", width="800", height="346" %}
  <figcaption class="w-figcaption">New <code>font-display: optional</code> behavior in Chrome when fonts are preloaded and font is downloaded <b>before</b> the 100ms block period (no flash of invisible text)</figcaption>
</figure>

Preloading optional fonts in Chrome removes the possibility of layout jank and flash of unstyled
text. This matches the required behavior as specified in [CSS Fonts Module Level
4](https://drafts.csswg.org/css-fonts-4/#valdef-font-face-font-display-optional) where optional
fonts should never cause re-layout and user agents can instead delay rendering for a suitable period
of time.

Although it is not necessary to preload an optional font, it greatly improves the chance for it to
load before the first render cycle, especially if it is not yet stored in the browser's
cache.

## Conclusion

The Chrome team is interested to hear your experiences preloading optional fonts with these new optimizations in
place! File an [issue](https://bugs.chromium.org/p/chromium/issues/entry) if you experience any
problems or would like to drop any feature suggestions.

---
layout: pattern
title: Self-hosted fonts
description:
  This demo combines two performance techniques to deliver
  a self-hosted font as quickly as possible&#58; use of inline font declarations
  and use of the WOFF2 font format.
date: 2021-08-19
updated: 2021-08-19
height: 400
---

Self-hosted fonts are font files that are served from your own servers - rather
than those of a third-party font provider (for example, Google Fonts).

It is incredibly important to deliver fonts quickly: faster font delivery not
only means that text will be visible to the user sooner - but it also has a
large impact on whether a font causes layout shifts. If a font cannot be
delivered before it is needed, there will typically be a layout shift when the
font is swapped. The size of this layout shift can vary depending on how closely
the fallback font matches the web font. To see this phenomena in action, view
the demo and compare the layout shifts that occur on a fast connection versus a
slow connection.

The example below combines two performance techniques to deliver a self-hosted
font as quickly as possible: use of inline font declarations and use of the
WOFF2 font format.

* **Inline font declarations**: Inlining `@font-face` and `font-family`
  declarations in the main document, rather than including this information in
  an external stylesheet, allows the browser to determine which font files will
  be used on the page without having to wait for a separate stylesheet file to
  download. This is important because generally browsers will not download font
  files until they know that they are used on the page. In most situations,
  inline font declarations are [preferable to using `preload` to load
  fonts](https://web.dev/font-best-practices/#avoid-using-preload-to-load-fonts).

* **WOFF2**: Of the modern font fonts, [WOFF2](https://caniuse.com/woff2) is the
  newest, has the widest browser support, and offers the best compression.
  Because it uses Brotli, WOFF2 compresses 30% better than WOFF.

To further improve performance, consider using [font
subsetting](https://web.dev/reduce-webfont-size/#unicode-range-subsetting). Font
subsetting is the practice of breaking a font file into smaller subsets -
typically with the goal of removing unused glyphs. This can significantly reduce
the filesize of a font. Tools for creating font subsets include
[fontkit](https://github.com/foliojs/fontkit),
[subfont](https://github.com/Munter/subfont), and
[glyphhanger](https://github.com/zachleat/glyphhanger).

For more information on best practices for self-hosted fonts, see [Using
self-hosted
fonts](https://web.dev/font-best-practices/#using-self-hosted-fonts).

---
layout: pattern
title: Third-party fonts
description: Load fonts quickly as possible
date: 2021-08-19
updated: 2021-08-19
height: 400
---

The example below combines two performance techniques to load a third-party font
as quickly as possible: use of inline font declarations and use of preconnect
resource hints. Although this code snippet demonstrates how to load fonts from
[Google Fonts](https://fonts.google.com/), these techniques also apply to other
third-party font providers.

* **Inline font declarations**: Inlining `font-family`
  declarations in the main document, rather than including this information in
  an external stylesheet, allows the browser to determine which font files will
  be used on the page without having to wait for a separate stylesheet file to
  download. This is important because generally browsers will not download font
  files until they know that they are used on the page. In most situations,
  inline font declarations are [preferable to using `preload` to load
  fonts](https://web.dev/font-best-practices/#avoid-using-preload-to-load-fonts).

* **Preconnect**: The recommended way to load Google Fonts is to use the
  `<link>` tag in conjunction with `preconnect` resource hints. The `preconnect`
  resource hint establishes an early connection with the third-party origin. In
  the code snippet below, the first resource hint sets up a connection for
  downloading the font stylesheet; the second resource hint sets up a connection
  for downloading font files.

For more information, see [Best practices for fonts](https://web.dev/font-best-practices/).

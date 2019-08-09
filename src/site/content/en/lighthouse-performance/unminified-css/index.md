---
layout: post
title: Minify CSS
description: |
  Learn about the unminified-css audit.
web_lighthouse:
  - unminified-css
---

The Opportunities section of your Lighthouse report lists
all unminified CSS files,
along with the potential savings in kilobytes (KB)
when these files are minified:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="unminified-css.png" alt="Minify CSS">
  <figcaption class="w-figcaption">
    Minify CSS.
  </figcaption>
</figure>


## How minifying CSS files can improve performance

Minifying CSS files can improve your page load performance.
CSS files are often larger than they need to be. For example:

```css
/* Header background should match brand colors. */
h1 {
  background-color: #000000;
}
h2 {
  background-color: #000000;
}
```

Can be reduced to:

```css
h1, h2 { background-color: #000000; }
```

From the perspective of the browser,
these 2 code samples are functionally equivalent,
but the second example uses less bytes.
Minifiers can further improve byte efficiency by removing whitespace:

```css
h1,h2{background-color:#000000;}
```

Some minifiers employ clever tricks to minimize bytes.
For example, the color value `#000000` can be further reduced to `#000`,
which is its shorthand equivalent.

Lighthouse provides an estimate of potential savings based
on the comments and whitespace characters that it finds in your CSS.
This is a conservative estimate.
As mentioned earlier,
minifiers can perform clever optimizations (such as reducing `#000000` to `#000`)
to further reduce your file size.
So, if you use a minifier,
you may see more savings than what Lighthouse reports.

## Use a CSS minifier to minify your CSS code

For small sites that you don't update often,
you can probably use an online service for manually minifying your files.
You paste your CSS into the service's UI, and it returns a minified version of the code.

For professional developers,
you probably want to set up an automated workflow that minifies your CSS automatically
before you deploy your updated code.
This is usually accomplished with a build tool like Gulp or Webpack.

Learn how to minify your CSS code in [Minify CSS](/minify-css).

## More information

- [Unminified CSS audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-css.js)
- [Minify CSS](/minify-css)
- [Minify and compress network payloads](/reduce-network-payloads-using-text-compression)

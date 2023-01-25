---
layout: post
title: Reduce WebFont Size
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |
  This post explains how to reduce the size of the WebFonts that you use on your site, so that good typography doesn't mean a slow site.
tags:
  - performance
  - fonts
---

Typography is fundamental to good design, branding, readability, and accessibility.
WebFonts enable all of the above and more:
the text is selectable, searchable, zoomable, and high-DPI friendly,
providing consistent and sharp text rendering regardless of the screen size and resolution.
WebFonts are critical to good design, UX, and performance.

WebFont optimization is a critical piece of the overall performance strategy.
Each font is an additional resource, and some fonts may block rendering of the text,
but just because the page is using WebFonts doesn't mean that it has to render slower.
On the contrary, optimized fonts,
combined with a judicious strategy for how they are loaded and applied on the page,
can help reduce the total page size and improve page rendering times.

## Anatomy of a WebFont

A *WebFont* is a collection of glyphs,
and each glyph is a vector shape that describes a letter or symbol.
As a result, two simple variables determine the size of a particular font file:
the complexity of the vector paths of each glyph and the number of glyphs in a particular font.
For example, Open Sans, which is one of the most popular WebFonts,
contains 897 glyphs, which include Latin, Greek, and Cyrillic characters.

{% Img src="image/admin/B92rhiBJD9sx88a5CvVy.png", alt="Font glyph table", width="800", height="309" %}

When picking a font, it's important to consider which character sets are supported.
If you need to localize your page content to multiple languages,
you should use a font that can deliver a consistent look and experience to your users.
For example, [Google's Noto font family](https://www.google.com/get/noto/) aims to support all the world's languages.
Note, however, that the total size of Noto, with all languages included, results in a 1.1GB+ ZIP download.

In this post you will find out how to reduce the delivered filesize of your WebFonts.

### WebFont formats

Today there are four font container formats in use on the web:

* [EOT](https://en.wikipedia.org/wiki/Embedded_OpenType)
* [TTF](https://en.wikipedia.org/wiki/TrueType)
* [WOFF](https://en.wikipedia.org/wiki/Web_Open_Font_Format)
* [WOFF2](https://www.w3.org/TR/WOFF2/).

[WOFF](http://caniuse.com/#feat=woff) and [WOFF 2.0](http://caniuse.com/#feat=woff2) enjoy the widest support,
however for compatibility with older browsers you may need to include other formats:

* Serve WOFF 2.0 variant to browsers that support it.
* Serve WOFF variant to the majority of browsers.
* Serve TTF variant to old Android (below 4.4) browsers.
* Serve EOT variant to old IE (below IE9) browsers.

{% Aside %}
There's technically another container format, the [SVG
font container](http://caniuse.com/svg-fonts), but IE and Firefox never supported it, and it is now deprecated in Chrome. As
such, it's of limited use and it's intentionally omitted it in this guide.
{% endAside %}

### Reduce font size with compression

A font is a collection of glyphs, each of which is a set of paths describing the letter form.
The individual glyphs are different,
but they contain a lot of similar information that can be compressed with GZIP or a compatible compressor:

* EOT and TTF formats are not compressed by default. Ensure that your servers are configured to
apply [GZIP compression](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer#text-compression-with-gzip)
when delivering these formats.
* WOFF has built-in compression.
Ensure that your WOFF compressor is using optimal compression settings.
* WOFF2 uses custom preprocessing and compression algorithms to deliver ~30% file-size reduction over other formats.
For more information, see [the WOFF 2.0 evaluation report](http://www.w3.org/TR/WOFF20ER/).

Finally, it's worth noting that some font formats contain additional metadata,
such as [font hinting](https://en.wikipedia.org/wiki/Font_hinting) and [kerning](https://en.wikipedia.org/wiki/Kerning)
information that may not be necessary on some platforms,
which allows for further file-size optimization.
Consult your font compressor for available optimization options,
and if you take this route, ensure that you have the appropriate infrastructure to test and deliver these optimized fonts to each browser.
For example, [Google Fonts](https://fonts.google.com/)
maintains 30+ optimized variants for each font and automatically detects and delivers the optimal variant for each platform and browser.

{% Aside %}
Consider using [Zopfli compression](http://en.wikipedia.org/wiki/Zopfli) for the EOT, TTF, and WOFF formats.
Zopfli is a zlib compatible compressor that delivers ~5% file-size reduction over gzip.
{% endAside %}

## Define a font family with @font-face

The `@font-face` CSS at-rule allows you to define the location of a particular font resource, its
style characteristics, and the Unicode codepoints for which it should be used. A combination of such
`@font-face` declarations can be used to construct a "font family," which the browser will use to
evaluate which font resources need to be downloaded and applied to the current page.

### Consider a variable font

Variable fonts can significantly reduce the filesize of your fonts in cases where you need multiple variants of a font.
Instead of needing to load the regular and bold styles plus their italic versions,
you can load a single file that contains all of the information.

Variable fonts are now supported by all modern browsers,
find out more in the [Introduction to variable fonts on the web](/variable-fonts/).

### Select the right format

Each `@font-face` declaration provides the name of the font family, which acts as a logical group of
multiple declarations, [font properties](http://www.w3.org/TR/css3-fonts/#font-prop-desc) such as
style, weight, and stretch, and the [src descriptor](http://www.w3.org/TR/css3-fonts/#src-desc),
which specifies a prioritized list of locations for the font resource.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome.woff2') format('woff2'),
        url('/fonts/awesome.woff') format('woff'),
        url('/fonts/awesome.ttf') format('truetype'),
        url('/fonts/awesome.eot') format('embedded-opentype');
}

@font-face {
  font-family: 'Awesome Font';
  font-style: italic;
  font-weight: 400;
  src: local('Awesome Font Italic'),
        url('/fonts/awesome-i.woff2') format('woff2'),
        url('/fonts/awesome-i.woff') format('woff'),
        url('/fonts/awesome-i.ttf') format('truetype'),
        url('/fonts/awesome-i.eot') format('embedded-opentype');
}
```

First, note that the above examples define a single _Awesome Font_ family with two styles
(normal and _italic_), each of which points to a different set of font resources.
In turn, each `src` descriptor contains a prioritized, comma-separated list of resource variants:

* The `local()` directive allows you to reference, load, and use locally installed fonts.
* The `url()` directive allows you to load external fonts, and are allowed to contain an optional
`format()` hint indicating the format of the font referenced by the provided URL.

{% Aside %}
Unless you're referencing one of the default system fonts,
it is rare for the user to have it locally installed,
especially on mobile devices,
where it is effectively impossible to "install" additional fonts.
You should always start with a `local()` entry "just in case," and then provide a list of `url()` entries.
{% endAside %}

When the browser determines that the font is needed,
it iterates through the provided resource list in the specified order and tries to load the appropriate resource.
For example, following the example above:

1. The browser performs page layout and determines which font variants are required to render the
specified text on the page.
1. For each required font, the browser checks if the font is available locally.
1. If the font is not available locally, the browser iterates over external definitions:
    * If a format hint is present, the browser checks if it supports the hint before initiating the
      download. If the browser doesn't support the hint, the browser advances to the next one.
    * If no format hint is present, the browser downloads the resource.

The combination of local and external directives with appropriate format hints allows you to specify
all of the available font formats and let the browser handle the rest. The browser determines which
resources are required and selects the optimal format.

{% Aside %}
The order in which the font variants are specified matters.
The browser picks the first format it supports.
Therefore, if you want the newer browsers to use WOFF 2.0,
then you should place the WOFF 2.0 declaration above WOFF.
{% endAside %}

### Unicode-range subsetting

In addition to font properties such as style, weight, and stretch,
the `@font-face` rule allows you to define a set of Unicode codepoints supported by each resource.
This enables you to split a large Unicode font into smaller subsets
(for example, Latin, Cyrillic, and Greek subsets)
 and only download the glyphs required to render the text on a particular page.

The [unicode-range descriptor](http://www.w3.org/TR/css3-fonts/#descdef-unicode-range) allows you to
specify a comma-delimited list of range values, each of which can be in one of three different
forms:

* Single codepoint (for example, `U+416`)
* Interval range (for example, `U+400-4ff`): indicates the start and end codepoints of a range
* Wildcard range (for example, `U+4??`): `?` characters indicate any hexadecimal digit

For example, you can split your _Awesome Font_ family into Latin and Japanese
subsets, each of which the browser downloads on an as-needed basis:

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-jp.woff2') format('woff2'),
        url('/fonts/awesome-jp.woff') format('woff'),
        url('/fonts/awesome-jp.ttf') format('truetype'),
        url('/fonts/awesome-jp.eot') format('embedded-opentype');
  unicode-range: U+3000-9FFF, U+ff??; /* Japanese glyphs */
}
```

{% Aside %}
Unicode-range subsetting is particularly important for Asian languages, where the number of
glyphs is much larger than in Western languages and a typical "full" font is often measured in
megabytes instead of tens of kilobytes.
{% endAside %}

The use of Unicode range subsets and separate files for each stylistic variant of the font allows
you to define a composite font family that is both faster and more efficient to download. Visitors
only download the variants and subsets they need, and they aren't forced to download subsets that
they may never see or use on the page.

Most browsers [now support unicode-range](http://caniuse.com/#feat=font-unicode-range).
For compatibility with older browsers you may need to fall back to "manual subsetting".
In this case you have to fall back to providing a single font resource
that contains all the necessary subsets and hide the rest from the browser.
For example, if the page is only using Latin characters,
then you can strip other glyphs and serve that particular subset as a standalone resource.

1. **Determine which subsets are needed:**
    * If the browser supports unicode-range subsetting,
    then it will automatically select the right subset.
    The page just needs to provide the subset files and specify appropriate unicode-ranges in the `@font-face` rules.
    * If the browser doesn't support unicode-range subsetting,
      then the page needs to hide all unnecessary subsets;
      that is, the developer must specify the required subsets.
1. **Generate font subsets:**
    - Use the open-source [pyftsubset tool](https://github.com/behdad/fonttools/) to subset and optimize your fonts.
    - Some font services allow manual subsetting via custom query parameters,
    which you can use to manually specify the required subset for your page.
    Consult the documentation from your font provider.

### Font selection and synthesis

Each font family is composed of multiple stylistic variants
(regular, bold, italic) and multiple weights for each style,
each of which, in turn, may contain very different glyph shapes&mdash;for example,
different spacing, sizing, or a different shape altogether.

{% Img src="image/admin/FNtAc2xRmx2MuUt2MADj.png", alt="Font weights", width="697", height="127" %}

For example, the above diagram illustrates a font family that offers three different bold weights:
400 (regular), 700 (bold), and 900 (extra bold).
All other in-between variants (indicated in gray) are automatically mapped to the closest variant by the browser.

<blockquote>
  <p>When a weight is specified for which no face exists,
a face with a nearby weight is used.
In general, bold weights map to faces with heavier weights and light weights map to faces with lighter weights.</p>
<cite><a href="http://www.w3.org/TR/css3-fonts/#font-matching-algorithm">CSS font matching algorithm</a></cite>
</blockquote>

Similar logic applies to _italic_ variants.
The font designer controls which variants they will produce,
and you control which variants you'll use on the page.
Because each variant is a separate download, it's a good idea to keep the number of variants small.
For example, you can define two bold variants for the _Awesome Font_ family:

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 700;
  src: local('Awesome Font'),
        url('/fonts/awesome-l-700.woff2') format('woff2'),
        url('/fonts/awesome-l-700.woff') format('woff'),
        url('/fonts/awesome-l-700.ttf') format('truetype'),
        url('/fonts/awesome-l-700.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

The above example declares the _Awesome Font_ family
that is composed of two resources that cover the same set of Latin glyphs (`U+000-5FF`)
but offer two different "weights": normal (400) and bold (700).
However, what happens if one of your CSS rules specifies a different font weight,
or sets the font-style property to italic?

- If an exact font match isn't available, the browser substitutes the closest match.
- If no stylistic match is found (for example, no italic variants were declared in the example above),
then the browser synthesizes its own font variant.

{% Img src="image/admin/a8Jo2cIO1tPsj71AzftS.png", alt="Font synthesis", width="800", height="356" %}

{% Aside 'warning' %}
Be aware that synthesized approaches may not be suitable for scripts like Cyrillic,
where italic forms are very different in shape.
For proper fidelity in those scripts, use an actual italic font.
{% endAside %}

The example above illustrates the difference between the actual vs. synthesized font results for Open Sans.
All synthesized variants are generated from a single 400-weight font.
As you can see, there's a noticeable difference in the results.
The details of how to generate the bold and oblique variants are not specified.
Therefore, the results vary from browser to browser, and are highly dependent on the font.

{% Aside %}
For best consistency and visual results, don't rely on font synthesis.
Instead, minimize the number of used font variants and specify their locations,
such that the browser can download them when they are used on the page.
Or, choose to use a variable font.
That said, in some cases a synthesized variant [may be a viable option](https://www.igvita.com/2014/09/16/optimizing-webfont-selection-and-synthesis/),
but be cautious in using synthesized variants.
{% endAside %}

## WebFont size optimization checklist

- **Audit and monitor your font use:** don't use too many fonts on your pages, and, for each font,
minimize the number of used variants. This helps produce a more consistent and a faster experience
for your users.
- **Subset your font resources:** many fonts can be subset, or split into multiple unicode-ranges to
deliver just the glyphs that a particular page requires. This reduces the file size and improves the
download speed of the resource. However, when defining the subsets, be careful to optimize for font
re-use. For example, don't download a different but overlapping set of characters on each page. A
good practice is to subset based on script: for example, Latin, and Cyrillic.
- **Deliver optimized font formats to each browser:** provide each font in WOFF 2.0, WOFF, EOT, and TTF
formats. Make sure to apply GZIP compression to the EOT and TTF formats, because they are not
compressed by default.
- **Give precedence to `local()` in your `src` list:** listing `local('Font Name')` first in your
`src` list ensures that HTTP requests aren't made for fonts that are already installed.
- **Use [Lighthouse](https://developers.google.com/web/tools/lighthouse)** to test for [text compression](/uses-text-compression/).

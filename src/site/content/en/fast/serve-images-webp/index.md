---
layout: post
title: Use WebP images
authors:
  - katiehempenius
description: |
  WebP images are smaller than their JPEG and PNG counterparts—usually on the
  magnitude of a 25–35% reduction in filesize. This decreases page sizes and
  improves performance.
date: 2018-11-05
updated: 2020-04-06
codelabs:
  - codelab-serve-images-webp
tags:
  - performance
feedback:
  - api
---

## Why should you care?

WebP images are smaller than their JPEG and PNG counterparts—usually on the
magnitude of a 25–35% reduction in filesize. This decreases page sizes and
improves performance.

-  YouTube found that switching to WebP thumbnails resulted in [10%
    faster page loads](https://www.youtube.com/watch?v=rqXMwLbYEE4).
-  Facebook
    [experienced](https://code.fb.com/android/improving-facebook-on-android/) a
    25-35% filesize savings for JPEGs and an 80% filesize savings for PNGs when
    they switched to using WebP.

WebP is an excellent replacement for JPEG, PNG, and GIF images. In addition,
WebP offers both lossless and lossy compression. In lossless compression no data
is lost. Lossy compression reduces file size, but at the expense of possibly
reducing image quality.

## Convert images to WebP

People generally use one of the following approaches for converting their images
to WebP: the
[cwebp command-line tool](https://developers.google.com/speed/webp/docs/using)
or the [Imagemin WebP plugin](https://github.com/imagemin/imagemin-webp) (npm
package).
The Imagemin WebP plugin is generally the best choice if your project uses build
scripts or build tools (e.g. Webpack or Gulp), whereas the CLI is a good choice
for simple projects or if you'll only need to convert images once.

When you convert images to WebP, you have the option to set a wide variety of
compression settings—but for most people the only thing you'll ever need to
care about is the quality setting. You can specify a quality level from 0
(worst) to 100 (best). It's worth playing around with this find
which level is the right tradeoff between image quality and filesize for your
needs.

### Use cwebp

Convert a single file, using cwebp's default compression settings:

```bash
cwebp images/flower.jpg -o images/flower.webp
```

Convert a single file, using a quality level of `50`:

```bash
cwebp -q 50 images/flower.jpg -o images/flower.webp
```

Convert all files in a directory:

```bash
for file in images/*; do cwebp "$file" -o "${file%.*}.webp"; done
```

### Use Imagemin

The Imagemin WebP plugin can be used by itself or with your favorite build tool
(Webpack/Gulp/Grunt/etc.). This usually involves adding \~10 lines of code to a
build script or the configuration file for your build tool.
Here are examples of how to do that for
[Webpack](https://glitch.com/~webp-webpack),
[Gulp](https://glitch.com/~webp-gulp), and
[Grunt](https://glitch.com/~webp-grunt).

If you are not using one of those build tools, you can use Imagemin by itself as
a Node script. This script will convert the files in the `images` directory and
save them in the `compressed_images` directory.

```js
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

## Serve WebP images

If your site only supports WebP compatible
[browsers](https://caniuse.com/#search=webp), you can stop reading. Otherwise,
serve WebP to newer browsers and a fallback image to older browsers:

**Before:**
```html
<img src="flower.jpg" alt="">
```

**After:**
```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

The
[`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture),
[`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source),
and `<img>` tags, including how they are ordered relative to each other, all
interact to achieve this end result.

### picture

The `<picture>` tag provides a wrapper for zero or more `<source>` tags and one `<img>` tag.

### source

The `<source>` tag specifies a media resource.

The browser uses the first listed source that's in a format it supports. If the browser does not support any of the formats listed in the `<source>` tags, it falls back to loading the image specified by the `<img>` tag.

{% Aside 'gotchas' %}

- The `<source>` tag for the "preferred" image format (in this case that is WebP) should be listed first, before other `<source>` tags.

- The value of the `type` attribute should be the MIME type corresponding to the image format. An image's [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types) and its file extension are often similar, but they aren't necessarily the same thing (e.g. `.jpg` vs. `image/jpeg`).

{% endAside %}

### img

The `<img>` tag is what makes this code work on browsers
that don't support the `<picture>` tag.
If a browser does not support the `<picture>` tag, it will
ignore the tags it doesn't support. Thus, it only "sees" the
`<img src="flower.jpg" alt="">` tag and loads that image.

{% Aside 'gotchas' %}
- The `<img>` tag should always be included, and it should always be listed last, after all `<source>` tags.
- The resource specified by the `<img>` tag should be in a universally supported format (e.g. JPEG), so it can be used as a fallback.
{% endAside %}

## Verify WebP usage

Lighthouse can be used to verify that all images on your site are being served
using WebP. Run the Lighthouse Performance Audit (**Lighthouse > Options >
Performance**) and look for the results of the **Serve images in next-gen
formats** audit. Lighthouse will list any images that are not being served in
WebP.

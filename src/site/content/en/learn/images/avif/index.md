---
title: 'Image formats: AVIF'
authors:
  - matmarquis
description: AV1 Image File Format (AVIF) is an encoding based on the open source AV1 video codec. 
date: 2023-02-01
tags:
  - images
---

AV1 Image File Format (AVIF) is an encoding based on the open source AV1 video codec. AVIF is [even newer](https://caniuse.com/avif)—than WebP,
only supported in Chrome and Opera since 2020, Firefox in 2021, and Safari just this year. As with WebP, AVIF aims to address every conceivable use case for
raster images on the web: GIF-like animation, PNG-like transparency, and improved perceptual quality at file sizes smaller than JPEG or WebP.

So far, AVIF shows promise. A [testing framework](https://github.com/Netflix/image_compression_comparison) developed by Netflix—a founding member of
the [Alliance for Open Media](https://aomedia.org/), the group responsible for the development of the AV1 codec—shows
[significant reductions in file sizes](https://netflixtechblog.com/avif-for-next-generation-image-coding-b1d75675fe4) when
compared to JPEG or WebP. Additional studies by [Cloudinary](https://cloudinary.com/blog/contemplating-codec-comparisons) and
[Chrome's codecs team](https://storage.googleapis.com/avif-comparison/index.html) have weighed it favorably against current
encoding standards.

Though tooling is relatively limited, you can and should [start experimenting with AVIF](https://jakearchibald.com/2020/avif-has-landed/)
today, as one of the encodings offered by Squoosh:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/TkVWHUuKwH9qauQJDNpI.png", alt="A Squoosh screenshot showing AVIF compression settings.", width="800", height="547" %}

## Browser support

Now, if you find yourself wondering why we've spent so much time discussing JPEG when AVIF and WebP can offer us higher
quality results and far smaller file sizes, it's because they—and any new image encoding—come with a major catch. Support
for GIF, PNG, and JPEG is guaranteed across all browsers, and has been for decades. Relative to those legacy image formats,
AVIF is brand new, and while support for WebP is [excellent](https://caniuse.com/?search=webp) across modern browsers, it
isn't a given across the entire web.

As you can imagine, a tremendous amount of time and effort has gone into the development of new image formats that aim to
improve both quality and transfer size. Formats like WebP, AVIF, and [JPEG XL](https://jpeg.org/jpegxl/) ([not supported in any browser](https://caniuse.com/jpegxl))
aim to become the unifying solution to raster images on the web, as SVG is to vectors. Others, like JPEG 2000 (only supported in Safari)
were intended to satisfy all the same use cases as a baseline JPEG, but improve on compression methods to deliver a visually
similar but much smaller image.

While some of these newer formats share the JPEG name, their encodings are as fundamentally dissimilar as JavaScript is to Java.
A browser that doesn't support a given encoding won't be able to parse that image file at all—it's as though I instructed you to fill
out your graph paper pixel grid in a language you don't understand. The browser will request the image data, attempt to parse it, and
upon failing, will discard it without rendering anything at all. An image source that fails to render outside of modern browsers would be a
huge point of failure for our content, and for the web at large—a broken image and wasted bandwidth to a huge number of users around
the world. You shouldn't sacrifice a more resilient web for the sake of a more performant one.

For a long time, our single-minded friend `<img>` made it exceptionally difficult to use any new image format, no matter how promising
it seemed. Remember, `<img>` only supported a single source file, and was hyper-optimized to transfer that file quickly—so quickly,
in fact, that we couldn't intercept that request via JavaScript. Until recently, the only viable option was to serve all users the brand
new type of image, and request one of the “legacy" formats when the browser fired an error—incurring a second file transfer after the first one was wasted.

For that reason and more, `<img>` as it had existed for decades had to change. In the next module, [Responsive Images](/learn/images/responsive-images/), you'll learn about the
features introduced to the HTML specification to address these issues and how to use them in your day-to-day work.


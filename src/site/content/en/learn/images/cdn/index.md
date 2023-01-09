---
title: 'Image content delivery networks'
authors:
  - matmarquis
description: To do
date: 2023-01-10
tags:
  - images
---

You may already be familiar with the core concept of a content delivery network (CDN): a network of distributed but interconnected
servers that quickly and efficiently delivers assets to users. When a file is uploaded to a CDN provider, a duplicate will be created
on the other nodes of the CDN network around the world. When a user requests a file, the data will be sent by the node geographically
closest to that user, reducing latency. The distributed nature of CDNs also provides redundancy in the event of network outages or
hardware failure, and load balancing to mitigate spikes in traffic.

An [image CDN](/image-cdns/) can provide all these benefits, with one key difference: the ability to transform and
optimize the contents of an image based on strings the URL used to access it.

A user will upload a canonical, high-resolution image to the provider, which will generate a URL used to access it:

```html
https://res.cloudinary.com/demo/image/upload/sample.jpg
```

Though the exact syntax used will vary from one provider to another, at a minimum all image CDNs allow you to alter a source
image's dimensions, encoding, and compression settings. [Cloudinary](https://cloudinary.com/), for example,
performs [dynamic resizing](https://cloudinary.com/documentation/resizing_and_cropping#setting_the_resize_dimensions) of an
uploaded image through the following syntaxes: `h_` followed by the numerical height in pixels, `w_` followed by the width,
and a `c_` value that allows you to specify [detailed information about how the image should be scaled or cropped](https://cloudinary.com/documentation/resizing_and_cropping#crop).

Any number of transforms can be applied by adding comma-separated values to the URL, prior to the filename and extension,
meaning that the uploaded image can be manipulated as-needed through the `src` of the `img` element that requests it.

```html
<img src="https://res.cloudinary.com/demo/image/upload/w_400/sample.jpg" alt="…">
```

The first time a user visits the URL containing these transforms, a new version of the image proportionally scaled to a
width of 400px (`w_400`) is generated and sent. That newly-created file is then cached across the CDN so it can be sent
to any user requesting the same URL, rather than recreated on-demand.

Though not uncommon for image CDN providers to offer [software development kits](https://cloudinary.com/documentation/cloudinary_sdks)
to facilitate advanced usage and integration with various technology stacks, this predictable URL pattern alone allows us to easily
turn a single uploaded file into a viable `srcset` attribute without the need for any other development tooling:

```html
<img
  src="https://res.cloudinary.com/demo/image/upload/w_1000/sample.jpg 1000w"
  srcset="https://res.cloudinary.com/demo/image/upload/w_1000/sample.jpg 1000w,
      	https://res.cloudinary.com/demo/image/upload/w_800/sample.jpg 800w,
      	https://res.cloudinary.com/demo/image/upload/w_600/sample.jpg 600w"
  alt="…">

```

We're able to manually specify our desired level of compression using what should now be a familiar syntax: `q_`, short
for "quality," followed by the numerical shorthand for compression level:

```html
<img src="https://res.cloudinary.com/demo/image/upload/w_400,q_60/sample.jpg"  alt="…">
```

It's rare that you'll need to include this information manually, however, thanks to a set of incredibly powerful features
provided by most image CDNs: fully automatic compression, encoding, and content negotiation.

## Automated compression

The computing power image CDNs have at their disposal means they're able to offer an incredibly powerful feature: analyzing
the content of an image to algorithmically determine its ideal compression level and encoding settings, just as you or I would
manually fine-tune compression for each one of our images.

These algorithms automate the decisions you might make balancing file size and perceptual quality, analyzing image content for
measurable signs of degradation and fine-tuning compression settings accordingly. This frequently means huge reductions in file
size compared to the one-size-fits-all manual approach to compression settings.

As complex as this process might sound, implementation couldn't be much simpler: for Cloudinary, the addition of `q_auto` in an
image URL enables this feature:

```html
<img src="https://res.cloudinary.com/demo/image/upload/w_1400/sample.jpg" alt="…">
<!-- 250 KB-->

<img src="https://res.cloudinary.com/demo/image/upload/w_1400,q_auto/sample.jpg" alt="…">
<!-- 134 KB-->
```

## Automated encoding and content negotiation

Upon receiving a request for an image, image CDNs determine the most modern encoding the browser supports through the
[HTTP headers](https://developer.mozilla.org/docs/Web/HTTP/Headers) sent by the browser alongside requests for assets—specifically,
the `Accept` header. This header indicates the encodings that the browser is able to understand, using the same
[media types](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) we would use to populate the `type`
attribute of a `<picture>` element's `<source>`.

For example, adding the `f_auto` parameter to the list of image transforms in an asset URL explicitly tells Cloudinary to
deliver the most efficient encoding the browser is able to understand:

```html
<img src="https://res.cloudinary.com/demo/image/upload/w_1200,q_auto,f_auto/sample.jpg" alt="…">
```

The server then generates a version of the image with that encoding and caches the result for all subsequent users with the same
level of browser support.  That response includes a [`Content-Type` header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type)
to explicitly inform the browser of the file's encoding, regardless of the file extension. Even though a user with a modern browser will make a
request for a file ending in `.jpg`, that request will be accompanied by a header informing the server that AVIF is supported, and the server
will send an AVIF encoded file along with an explicit instruction to treat it as AVIF.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/JyJi8gXuacJB0L2puHbK.png", alt="CDN user interface", width="800", height="649" %}

The net result is a process that not only absolves you of creating alternately encoded files and of manually fine-tuning your compression settings
(or maintaining a system that does these tasks for you), but does away with the need to use `<picture>` and the `type` attribute to effectively
deliver those files to users. So, using the `srcset` and `sizes` syntaxes alone can still provide your users with images encoded as—for example—AVIF,
falling back to WebP (or JPEG-2000, for Safari alone), falling back again to the most sensible legacy encoding.

The drawbacks of using an image CDN are more logistical than technical, chief among them being cost. While it is common for image CDNs to
offer feature-robust free plans for personal usage, generating image assets requires bandwidth and storage space for uploads, processing on
the server to transform images, and additional space for the cached transform results—so advanced usage and high-traffic applications may require a paid plan.


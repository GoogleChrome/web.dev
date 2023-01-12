---
title: 'Automating compression and encoding'
authors:
  - matmarquis
description: The benefits of using a CDN for automated compression and encoding. 
date: 2023-01-16
tags:
  - images
---

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

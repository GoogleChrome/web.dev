---
title: 'Image content delivery networks'
authors:
  - matmarquis
description: Learn how image CDNs have the ability to transform and optimize the contents of an image.
date: 2023-01-16
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

# Outro

Congratulations, you've made it to the end! By now you’ve learned a lot about how images work on the web, and the part that they—and you—can play in building a faster, more efficient experience for users everywhere.

## Additional resources

* [HTTP Archive’s annual state of the web report](https://almanac.httparchive.org/en/2022/)
* [web.dev - Lazy loading images](/lazy-loading-images/)
* [web.dev - Learn Accessibility: Images](/learn/accessibility/images/)
* [MDN - SVG](https://developer.mozilla.org/docs/Web/SVG)
* [MDN - Image file type and format guide](https://developer.mozilla.org/docs/Web/Media/Formats/Image_types)
* [MDN - Responsive Images](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

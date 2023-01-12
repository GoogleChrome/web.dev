---
title: 'Site Generators, frameworks, and CMSs'
authors:
  - matmarquis
description: Discover how CMSs such as WordPress, and other site generators can make it easier to use responsive images.
date: 2023-01-16
tags:
  - images
---

WordPress was one of the earliest adopters of native responsive images markup, and the API has gone largely unchanged since
being [introduced in WordPress 4.4](https://make.wordpress.org/core/2015/11/10/responsive-images-in-wordpress-4-4/). The WordPress
core is designed to make use of the [ImageMagick PHP extension](https://www.php.net/manual/en/book.imagick.php) (or, absent
that, [GD](https://www.php.net/manual/en/book.image.php)), allowing settings like [compression level](https://developer.wordpress.org/reference/hooks/jpeg_quality/)
to be configured alongside other core configuration options.

```php
add_filter( 'jpeg_quality', 65 );
```

When an image is uploaded through WordPress' admin interface, that source image is used to generate user-facing files on
the server, in much the same way as you would on your local machine. By default, any image output by WordPress will come
with a generated `srcset` attribute based on [the image sizes configured in your theme](https://developer.wordpress.org/apis/responsive-images/).

Given that WordPress has full understanding of all [alternate cuts](https://developer.wordpress.org/reference/functions/add_image_size/)
and encodings it generates from an uploaded image, it can provide helper functions like
[`wp_get_attachment_image_srcset()`](https://developer.wordpress.org/reference/functions/wp_get_attachment_image_srcset/) to
retrieve the full, generated `srcset` value of an image attachment.

As you'll likely have guessed by this point, working with the `sizes` attribute is a little more fraught. Absent any information
about how images will be used in a layout, WordPress currently defaults to a `sizes` value that effectively says "this image
should occupy 100% of the available viewport, up to the largest source's intrinsic size"—a predictable default, but not a correct
one for any real-world application. Be sure to make use of [`wp_calculate_image_sizes()`](https://developer.wordpress.org/reference/hooks/wp_calculate_image_sizes/)
to set contextually-appropriate `sizes` attributes in your templates.

Of course, there are countless WordPress plugins dedicated to making modern image workflows faster for development teams and users alike.
Perhaps most excitingly, plugins like [Jetpack's Site Accelerator](https://jetpack.com/support/site-accelerator/) (formerly "Photon")
can provide _server-side_ negotiation for encodings, ensuring that users will receive the smallest, most efficient encoding that their
browser is able to support without the need for `<picture>` and `type` markup pattern. It does this through use of an image content
delivery network—a technology you can make use of yourself, independent of your CMS.

All of this is also true of hosted CMS solutions like Shopify, though the mechanisms themselves will differ somewhat: offering similar
hooks for [generating alternate image sources and corresponding `srcset` attributes](https://performance.shopify.com/blogs/blog/responsive-images-on-shopify-with-liquid#provide-multiple-image-size-options-with-srcset)
and [art direction through the `<picture>` element](https://performance.shopify.com/blogs/blog/responsive-images-on-shopify-with-liquid#art-direction).

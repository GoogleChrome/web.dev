---
layout: pattern
title: Responsive images and art direction
description: These responsive images load without causing layout shifts.
date: 2021-08-17
updated: 2021-08-17
height: 400
---

[Responsive
images](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
are often implemented using the
[`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset)
attribute. The `srcset` attribute is a comma-separated list of image filenames
and their
[width](https://html.spec.whatwg.org/multipage/images.html#width-descriptor) or
density descriptors. To prevent layout shifts, set the `width` and `height`
attributes on `<img>` and `<source>` tags that use `srcset`.



**For responsive images that use density descriptors:**

* All images listed in `src` and `srcset` should have the same [aspect
  ratio](https://en.wikipedia.org/wiki/Aspect_ratio_(image)).
* Set the `width` and `height` attributes to match the dimensions of the `1x`
  image.
* The `src` attribute should refer to the `1x` image.

**For responsive images that use width descriptors:**
* All images listed in `src` and `srcset` should have the same aspect ratio.
* Set the `width` and `height` attributes to match the dimensions of the
  fallback image.
* **Adjust image styling as needed:** In the absence of any CSS styling, setting
  `width` and `height` on a responsive image that uses width descriptors will
  cause the image to always render at the same size - even if the images listed
  in `srcset` have varying dimensions. This behavior may not be what you want.
  Adding `width: 100%; height: auto;` or `width: 100vw; height: auto;` to your
  image styling may give you the visual appearance you want.

**For &lt;picture&gt; tags:**

* **Set the `width` and `height` attributes for all `<source>` tags:** The
  appropriate values for `width` and `height` will depend on how the `<source>`
  tag uses `srcset`. (See above for information on working with `srcset`.)
* **Adjust image styling:** If you need to adjust image styling, keep in mind
  that adding styling to a `<source>` tag will have no effect - a `<source>` tag
  is an [empty
  element](https://developer.mozilla.org/docs/Web/HTML/Element/source).
  Instead, you will need to style the corresponding `<img>` tag.
* **Set the `width` and `height` attributes on the `<img>` tag:** These values
  should match the intrinsic size of the fallback image.
  
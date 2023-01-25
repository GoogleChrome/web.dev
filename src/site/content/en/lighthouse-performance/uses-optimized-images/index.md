---
layout: post
title: Efficiently encode images
description: |
  Learn about the uses-optimized-images audit.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-optimized-images
---

The Opportunities section of your Lighthouse report lists
all unoptimized images, with potential savings in [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte).
Optimize these images so that the page loads faster and consumes less data:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="A screenshot of the Lighthouse Efficiently encode images audit", width="800", height="263", class="w-screenshot" %}
</figure>


## How Lighthouse flags images as optimizable

Lighthouse collects all the JPEG or BMP images on the page,
sets each image's compression level to 85,
and then compares the original version with the compressed version.
If the potential savings are 4KiB or greater, Lighthouse flags the image as optimizable.

## How to optimize images

There are many steps you can take to optimize your images, including:

- [Using image CDNs](/image-cdns/)
- [Compressing images](/use-imagemin-to-compress-images)
- [Replacing animated GIFs with video](/replace-gifs-with-videos)
- [Lazy loading images](/use-lazysizes-to-lazyload-images)
- [Serving responsive images](/serve-responsive-images)
- [Serving images with correct dimensions](/serve-images-with-correct-dimensions)
- [Using WebP images](/serve-images-webp)

## Optimize images using GUI tools

Another approach is to run your images through an optimizer
that you install onto your computer and run as a GUI.
For example,
with [ImageOptim](https://imageoptim.com/mac) you drag and drop images into its UI,
and then it automatically compresses the images without compromising quality noticeably.
If you're running a small site and can handle manually optimizing all images,
this option is probably good enough.

[Squoosh](https://squoosh.app/) is another option.
Squoosh is maintained by the Google Web DevRel team.

## Stack-specific guidance

### Drupal

Consider using [a
module](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search)
that automatically optimizes and reduces the size of images uploaded through the
site while retaining quality. Also, ensure you are using the Drupal's built-in
[Responsive Image
Styles](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8)
(available in Drupal 8 and above) for all images rendered on the site.

### Joomla

Consider using an [image optimization
plugin](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance)
that compresses your images while retaining quality.

### Magento

Consider using a [third-party Magento extension that optimizes
images](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image).

### WordPress

Consider using an [image optimization WordPress
plugin](https://wordpress.org/plugins/search/optimize+images/) that compresses
your images while retaining quality.

## Resources

- [Source code for **Efficiently encode images** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-optimized-images.js)

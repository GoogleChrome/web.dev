---
layout: post
title: Defer offscreen images
description: |
  Learn about the offscreen-images audit.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - offscreen-images
---

The Opportunities section of your Lighthouse report lists
all offscreen or hidden images in your page
along with the potential savings in [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte).
Consider lazy-loading these images
after all critical resources have finished loading
to lower [Time to Interactive](/interactive):

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/agMyJtIarLruD8iuz0Mt.png", alt="A screenshot of the Lighthouse Defer offscreen images audit", width="800", height="416", class="w-screenshot" %}
</figure>

See also [Lazy load offscreen images with lazysizes codelab](/codelab-use-lazysizes-to-lazyload-images).

## Stack-specific guidance

### AMP

Automatically lazy-load images with [`amp-img`](https://amp.dev/documentation/components/amp-img/).
See the [Images](https://amp.dev/documentation/guides-and-tutorials/develop/media_iframes_3p/#images)
guide.

### Drupal

Install [a Drupal module][drupal] that can lazy load images. Such modules
provide the ability to defer any offscreen images to improve performance.

### Joomla

Install a [lazy-load Joomla
plugin](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=lazy%20loading)
that provides the ability to defer any offscreen images, or switch to a template
that provides that functionality. Starting with Joomla 4.0, a dedicated
lazy-loading plugin can be enabled by using the "Content - Lazy Loading Images"
plugin. Also consider using [an AMP
plugin](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=amp).

### Magento

Consider modifying your product and catalog templates to make use of the web
platform's [lazy loading](/browser-level-image-lazy-loading/) feature.

### WordPress

Install a [lazy-load WordPress
plugin](https://wordpress.org/plugins/search/lazy+load/) that provides the
ability to defer any offscreen images, or switch to a theme that provides that
functionality. Also consider using [the AMP
plugin](https://wordpress.org/plugins/amp/).

## Resources

- [Source code for **Defer offscreen images** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/offscreen-images.js)

[drupal]: https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A67&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=%22lazy+load%22&solrsort=iss_project_release_usage+desc&op=Search
[joomla]: https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=lazy%20loading
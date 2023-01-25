---
layout: post
title: Serve images in next-gen formats
description: |
  Learn about the uses-webp-images audit.
date: 2019-05-02
updated: 2020-05-29
codelabs:
  - codelab-serve-images-webp
web_lighthouse:
  - uses-webp-images
---

The Opportunities section of your Lighthouse report lists all images
in older image formats,
showing potential savings gained by serving WebP versions of those images:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/VmK3YIRiXNjbzEXxx1Ix.png", alt="A screenshot of the Lighthouse Serve images in next-gen formats audit", width="800", height="306", class="w-screenshot" %}
</figure>

## Why serve images in WebP format

JPEG 2000, JPEG XR, and WebP are image formats that have superior compression and quality characteristics compared to their older JPEG and PNG counterparts. Encoding your images in these formats rather than JPEG or PNG means that they will load faster and consume less cellular data.

WebP is supported in Chrome and Opera and provides better lossy and lossless compression for images on the web.
See [A New Image Format For The Web](https://developers.google.com/speed/webp/)
for more on WebP.

{% Aside 'codelab' %}
[Create WebP Images with the Command Line](/codelab-serve-images-webp)
{% endAside %}

## How Lighthouse calculates potential savings

Lighthouse collects each BMP, JPEG, and PNG image on the page,
and then converts each to WebP,
reporting the potential savings based on the conversion figures.

{% Aside 'note' %}
Lighthouse omits the image from its report if the potential savings are less than 8KiB.
{% endAside %}

## Browser compatibility

Browser support is not universal for WebP, but similar savings should be available in most major browsers in an alternative next-gen format. You'll need to serve a fallback PNG or JPEG image for other browser support. See
[How can I detect browser support for WebP?](https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp) for an overview of fallback techniques and the list below for browser support of image formats.

To see the current browser support for each next-gen format, check out the entries below:

- [WebP](https://caniuse.com/#feat=webp)
- [JPEG 2000](https://caniuse.com/#feat=jpeg2000)
- [JPEG XR](https://caniuse.com/#feat=jpegxr)

## Stack-specific guidance

### AMP

Consider displaying all
[`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites)
components in WebP formats while [specifying an appropriate
fallback](https://amp.dev/documentation/components/amp-img/#specify-a-fallback-image)
for other browsers.

### Drupal

Consider installing and configuring [a module to leverage WebP image
formats](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=webp&solrsort=iss_project_release_usage+desc&op=Search)
in your site. Such modules automatically generate a WebP version of your
uploaded images to optimize loading times.

### Joomla

Consider using a
[plugin](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=webp)
or service that will automatically convert your uploaded images to the optimal
formats.

### Magento

Consider searching the [Magento
Marketplace](https://marketplace.magento.com/catalogsearch/result/?q=webp) for a
variety of third-party extensions to leverage newer image formats.

### WordPress

Consider using a [plugin](https://wordpress.org/plugins/search/convert+webp/) or
service that will automatically convert your uploaded images to the optimal
formats.

## Resources

- [Source code for **Serve images in next-gen formats** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-webp-images.js)
- [Use WebP images](/serve-images-webp)

<!-- https://www.reddit.com/r/webdev/comments/gspjwe/serve_images_in_nextgen_formats/ -->

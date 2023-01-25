---
layout: post
title: Browser-level image lazy-loading for the web
subhead: Built-in lazy-loading is finally here!
authors:
  - houssein
  - addyosmani
  - mathiasbynens
date: 2019-08-06
updated: 2020-07-16
hero: image/admin/F6VE4QkpCsomiJilTFNG.png
alt: Phone outline with loading image and assets
description: |
  This post covers the loading attribute and how it can be used
  to control the loading of images.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
feedback:
  - api
---

Browser-level support for lazy-loading images is now supported on the web! This video shows
a [demo](https://mathiasbynens.be/demo/img-loading-lazy) of the feature:

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.mp4" type="video/mp4">
  </video>
</figure>

In Chrome 76 onwards, you can use the `loading` attribute to lazy-load images
without the need to write custom lazy-loading code or use a separate JavaScript library. Let's dive into the details.

## Browser compatibility

`<img loading=lazy>` is supported by most popular Chromium-powered browsers (Chrome, Edge, Opera)
and [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/75#HTML).
The implementation for WebKit (Safari) [is in progress](https://bugs.webkit.org/show_bug.cgi?id=200764).
[caniuse.com](https://caniuse.com/#feat=loading-lazy-attr) has detailed information on cross-browser
support. Browsers that do not support the `loading` attribute simply ignore it without side-effects.

## Why browser-level lazy-loading?

According to [HTTPArchive](https://httparchive.org/reports/page-weight), images are the most
requested asset type for most websites and usually take up more bandwidth than any other
resource. At the 90th percentile, sites send about 4.7 MB of images on desktop and mobile. That's a
lot of [cat pictures](https://en.wikipedia.org/wiki/Cats_and_the_Internet).

Currently, there are two ways to defer the loading of off-screen images:

- Using the [Intersection Observer
  API](https://developers.google.com/web/updates/2016/04/intersectionobserver)
- Using `scroll`, `resize`, or `orientationchange` [event
  handlers](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way)

Either option can let developers include lazy-loading functionality, and many developers have built
third-party libraries to provide abstractions that are even easier to use. With lazy-loading
supported directly by the browser, however, there's no need for an external library. Browser-level lazy
loading also ensures that deferred loading of images still works even if JavaScript is
disabled on the client.

## The `loading` attribute

Today, Chrome already loads images at different priorities depending on where they're located with
respect to the device viewport. Images below the viewport are loaded with a lower priority, but they're
still fetched as soon as possible.

In Chrome 76+, you can use the `loading` attribute to completely defer the loading of offscreen images that can be reached by scrolling:

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Here are the supported values for the `loading` attribute:

- `auto`: Default lazy-loading behavior of the browser, which is the same as not
  including the attribute.
- `lazy`: Defer loading of the resource until it reaches a [calculated distance](#distance-from-viewport-thresholds) from the viewport.
- `eager`: Load the resource immediately, regardless of where it's located on the page.

{% Aside 'caution' %}
  Although available in Chromium, the `auto` value is not mentioned in the [specification](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes). Since it may be subject to change, we recommend not to use it until it gets included.
{% endAside %}

### Distance-from-viewport thresholds

All images that are above the fold—that is, immediately viewable without scrolling—load
normally. Those that are far below the device viewport are only fetched when the user scrolls near them.

Chromium's implementation of lazy-loading tries to ensure that offscreen images are loaded early enough so that they have finished loading once the user scrolls near to them. By fetching nearby images before they become visible in the viewport, we maximize the chance they are already loaded by the time they become visible.

Compared to JavaScript lazy-loading libraries, the thresholds for fetching images that scroll into view may be considered conservative. Chromium is looking at better aligning these thresholds with developer expectations.

{% Aside %}
Experiments conducted using Chrome on Android suggest that on 4G, 97.5% of below-the-fold images that are lazy-loaded were fully loaded within 10ms of becoming visible. Even on slow 2G networks, 92.6% of below-the-fold images were fully loaded within 10ms. This means browser-level lazy-loading offers a stable experience regarding the visibility of elements that are scrolled into view.
{% endAside %}

The distance threshold is not fixed and varies depending on several factors:

- The type of image resource being fetched
- Whether [Lite mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) is enabled
  on Chrome for Android
- The [effective connection type](https://googlechrome.github.io/samples/network-information/)

You can find the default values for the different effective connection types in the [Chromium
source](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/settings.json5?l=971-1003&rcl=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad).
These numbers, and even the approach of fetching only when a certain distance from the viewport is
reached, may change in the near future as the Chrome team improves heuristics to determine when to
begin loading.

{% Aside %}
In Chrome 77+, you can experiment with these different thresholds by [throttling the
network](https://developers.google.com/web/tools/chrome-devtools/network/#throttle) in DevTools. In
the meantime, you will need to override the effective connection type of the browser using the
`chrome://flags/#force-effective-connection-type` flag.
{% endAside %}

## Improved data-savings and distance-from-viewport thresholds

As of July 2020, Chrome has made significant improvements to align the image lazy-loading distance-from-viewport thresholds to better meet developer expectations.

On fast connections (e.g 4G), we reduced Chrome's distance-from-viewport thresholds from `3000px` to `1250px` and on slower connections (e.g 3G), changed the threshold from `4000px` to `2500px`. This change achieves two things:

* `<img loading=lazy>` behaves closer to the experience offered by JavaScript lazy-loading libraries.
* The new distance-from-viewport thresholds still allow us to guarantee images have probably loaded by the time a user has scrolled to them.

You can find a comparison between the old vs. new distance-from-viewport thresholds for one of our demos on a fast connection (4G) below:

Old thresholds. vs new thresholds:

<figure class="w-figure">
  {% Img src="image/admin/xSZMqpbioBRwRTnenK8f.png", alt="The new and improved thresholds for image lazy-loading, reducing the distance-from-viewport thresholds for fast connections from 3000px down to 1250px", width="800", height="460" %}
</figure>

and the new thresholds vs. LazySizes (a popular JS lazy-loading library):

<figure class="w-figure">
  {% Img src="image/admin/oHMFvflk9aesT7r0iJbx.png", alt="The new  distance-from-viewport thresholds in Chrome loading 90KB of images compared to LazySizes loading in 70KB under the same network conditions", width="800", height="355" %}
</figure>


{% Aside %}
  To ensure Chrome users on recent versions also benefit from the new thresholds, we have backported these changes so that Chrome 79 - 85 inclusive also uses them. Please keep this in mind if attempting to compare data-savings from older versions of Chrome to newer ones.
{% endAside %}

We are committed to working with the web standards community to explore better alignment in how distance-from-viewport thresholds are approached across different browsers.

### Images should include dimension attributes

While the browser loads an image, it does not immediately know the image's dimensions, unless these are explicitly specified. To enable the browser to reserve sufficient space on a page for images, it is recommended that all `<img>` tags include both `width` and `height` attributes. Without dimensions specified, [layout shifts](/cls) can occur, which are more noticeable on pages that take some time to load.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Alternatively, specify their values directly in an inline style:

```html
<img src="image.png" loading="lazy" alt="…" style="height:200px; width:200px;">
```

The best practice of setting dimensions applies to `<img>` tags regardless of whether or not they are being loaded lazily. With lazy-loading, this can become more relevant. Setting `width` and `height` on images in modern browsers also allows browsers to infer their intrinsic size.

In most scenarios images still lazy-load if dimensions are not included, but there are a few edge cases you should be aware of. Without `width` and `height` specified, image dimensions are 0×0 pixels at first. If you have a gallery of such images, the browser may conclude that all of them fit inside the viewport at the start, as each takes up practically no space and no image is pushed offscreen. In this case the browser determines that all of them are visible to the user and decides to load everything.

Also, [specifying image dimensions decreases the chances of layout shifts happening](https://www.youtube.com/watch?v=4-d_SoCHeWE). If you are unable to include dimensions for your images, lazy-loading them can be a trade-off between saving network resources and potentially being more at risk of layout shift.

While lazy-loading in Chromium is implemented in a way such that images are likely to be loaded once they are visible, there is still a small chance that they might not be loaded yet. In this case, missing `width` and `height` attributes on such images increase their impact on Cumulative Layout Shift.

{% Aside %}
  Take a look at this [demo](https://mathiasbynens.be/demo/img-loading-lazy) to see how the `loading` attribute works with 100 pictures.
{% endAside %}

Images that are defined using the `<picture>` element can also be lazy-loaded:

```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x">
  <img src="photo.jpg" loading="lazy">
</picture>
```

Although a browser will decide which image to load from any of the `<source>` elements, the `loading`
attribute only needs to be included to the fallback `<img>` element.


## Avoid lazy-loading images that are in the first visible viewport

You should avoid setting `loading=lazy` for any images that are in the first visible viewport.

It is recommended to only add `loading=lazy` to images which are positioned below the fold, if possible. Images that are eagerly loaded can be fetched right away, while images which are loaded lazily the browser currently needs to wait until it knows where the image is positioned on the page, which relies on the IntersectionObserver to be available.

{% Aside %}
  In Chromium, the impact of images in the initial viewport being marked with `loading=lazy` on Largest Contentful Paint is fairly small, with a regression of <1% at the 75th and 99th percentiles compared to eagerly loaded images.
{% endAside %}

Generally, any images within the viewport should be loaded eagerly using the browser's defaults. You do not need to specify `loading=eager` for this to be the case for in-viewport images.

```html
<!-- visible in the viewport -->
<img src="product-1.jpg" alt="..." width="200" height="200">
<img src="product-2.jpg" alt="..." width="200" height="200">
<img src="product-3.jpg" alt="..." width="200" height="200">

<!-- offscreen images -->
<img src="product-4.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-5.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-6.jpg" loading="lazy" alt="..." width="200" height="200">
```

## Graceful degradation

Browsers that do not yet support the `loading` attribute will ignore its presence. While these browsers will of course not get the benefits of lazy-loading, including the attribute has no negative impact on them.

## FAQ

### Are there plans to automatically lazy-load images in Chrome?

Chromium already automatically
lazy-loads any images that are well suited to being deferred if [Lite
mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) is enabled on Chrome for Android. This is primarily aimed at users who are conscious about data-savings.

### Can I change how close an image needs to be before a load is triggered?

These values are hardcoded and can't be changed through the API. However, they may change in the
future as browsers experiment with different threshold distances and variables.

### Can CSS background images take advantage of the `loading` attribute?

No, it can currently only be used with `<img>` tags.

### Is there a downside to lazy-loading images that are within the device viewport?

It is safer to avoid putting `loading=lazy` on above-the-fold images, as Chrome won't preload `loading=lazy` images in the preload scanner.

### How does the `loading` attribute work with images that are in the viewport but not immediately visible (for example: behind a carousel, or hidden by CSS for certain screen sizes)?

Only images that are below the device viewport by the [calculated
distance](#distance-from-viewport-thresholds) load lazily. All images above the viewport, regardless of
whether they're immediately visible, load normally.

### What if I'm already using a third-party library or a script to lazy-load images?

The `loading` attribute should not affect code that currently lazy-loads your assets in any way, but
there are a few important things to consider:

1. If your custom lazy-loader attempts to load images or frames sooner than when Chrome loads them
   normally—that is, at a distance greater than the [distance-from-viewport thresholds](#distance-from-viewport-thresholds)—
   they are still deferred and load based on normal browser behavior.
2. If your custom lazy-loader uses a shorter distance to determine when to load a particular image than the browser, then the behavior would conform to your custom settings.

One of the important reasons to continue to use a third-party library along with `loading="lazy"` is
to provide a polyfill for browsers that do not yet support the attribute.


### How do I handle browsers that don't yet support lazy-loading?

Create a polyfill or use a third-party library to lazy-load images on your site. The `loading`
property can be used to detect if the feature is supported in the browser:

```js
if ('loading' in HTMLImageElement.prototype) {
  // supported in browser
} else {
  // fetch polyfill/third-party library
}
```

For example, [lazysizes](https://github.com/aFarkas/lazysizes) is a popular JavaScript lazy-loading
library. You can detect support for the `loading` attribute to load lazysizes as a fallback
library only when `loading` isn't supported. This works as follows:

- Replace `<img src>` with `<img data-src>` to avoid an eager load in unsupported browsers. If the
  `loading` attribute is supported, swap `data-src` for `src`.
- If `loading` is not supported, load a fallback (lazysizes) and initiate it. As per lazysizes docs, you use the
  `lazyload` class as a way to indicate to lazysizes which images to lazy-load.

```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt="…">

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="cats.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="dogs.jpg" alt="…" loading="lazy" class="lazyload">

<script>
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
</script>
```

Here's a [demo](https://lazy-loading.firebaseapp.com/lazy_loading_lib.html) of this pattern. Try
it out in a browser like Firefox or Safari to see the fallback in action.

{% Aside %}
  The lazysizes library also provides a [loading plugin](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading)
  that uses browser-level lazy-loading when available but falls back to the library's custom functionality when needed.
{% endAside %}

### Is lazy-loading for iframes also supported in Chrome?

`<iframe loading=lazy>` was recently standardized and is already implemented in Chromium. This allows you to lazy-load iframes using the `loading` attribute. A dedicated article about iframe lazy-loading will be published on web.dev shortly.

The `loading` attribute affects iframes differently than images, depending on whether the iframe is
hidden. (Hidden iframes are often used for analytics or communication purposes.) Chrome uses the
following criteria to determine whether an iframe is hidden:

- The iframe's width and height are 4 px or smaller.
- `display: none` or `visibility: hidden` is applied.
- The iframe is placed off-screen using negative X or Y positioning.

If an iframe meets any of these conditions, Chrome considers it hidden and won't lazy-load it in
most cases. Iframes that _aren't_ hidden will only load when they're within the [distance-from-viewport thresholds](#distance-from-viewport-thresholds).
A placeholder shows for lazy-loaded iframes that are still being fetched.

### How does browser-level lazy-loading affect advertisements on a web page?

All ads displayed to the user in the form of an image or iframe lazy-load just
like any other image or iframe.

### How are images handled when a web page is printed?

Although the functionality isn't in Chrome currently, there's an [open
issue](https://bugs.chromium.org/p/chromium/issues/detail?id=875403) to ensure that all images and
iframes are immediately loaded if a page is printed.

### Does Lighthouse recognize browser-level lazy-loading?

Earlier versions of Lighthouse would still highlight that pages using `loading=lazy` on images required a strategy for loading offscreen images. [Lighthouse 6.0](/lighthouse-whats-new-6.0/) and above better factor in approaches for offscreen image lazy-loading that may use different thresholds, allowing them to pass the [Defer offscreen images](/offscreen-images/) audit.

## Conclusion

Baking in support for lazy-loading images can make it significantly easier for
you to improve the performance of your web pages.

Are you noticing any unusual behavior with this feature enabled in Chrome? [File a
bug](https://bugs.chromium.org/p/chromium/issues/entry?summary=%5BLazyLoad%5D:&comment=Application%20Version%20%28from%20%22Chrome%20Settings%20%3E%20About%20Chrome%22%29:%20%0DAndroid%20Build%20Number%20%28from%20%22Android%20Settings%20%3E%20About%20Phone/Tablet%22%29:%20%0DDevice:%20%0D%0DSteps%20to%20reproduce:%20%0D%0DObserved%20behavior:%20%0D%0DExpected%20behavior:%20%0D%0DFrequency:%20%0D%3Cnumber%20of%20times%20you%20were%20able%20to%20reproduce%3E%20%0D%0DAdditional%20comments:%20%0D&labels=Pri-2&components=Blink%3ELoader%3ELazyLoad%2C)!

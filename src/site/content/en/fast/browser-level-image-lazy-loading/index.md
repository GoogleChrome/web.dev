---
layout: post
title: Browser-level image lazy loading for the web
subhead: Built-in lazy loading is finally here!
authors:
  - houssein
  - addyosmani
  - mathiasbynens
  - tunetheweb
date: 2019-08-06
updated: 2023-06-02
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

Browser-level support for lazy loading images is now supported on the web! This video shows a [demo](https://mathiasbynens.be/demo/img-loading-lazy) of the feature:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.mp4" type="video/mp4">
  </video>
</figure>

You can use the `loading` attribute to lazy-load images without the need to write custom lazy loading code or use a separate JavaScript library. Let's dive into the details.

## Browser compatibility

{% BrowserCompat 'html.elements.img.loading' %}

Browsers that do not support the `loading` attribute simply ignore it without side effects.

## Why browser-level lazy loading?

According to the [HTTP Archive](https://httparchive.org/reports/page-weight), images are the most requested asset type for most websites and usually take up more bandwidth than any other resource. At the 90th percentile, sites send over 5 MB of images on desktop and mobile. That's a lot of [cat pictures](https://en.wikipedia.org/wiki/Cats_and_the_Internet).

Previously, there were two ways to defer the loading of off-screen images:

- Using the [Intersection Observer API](https://developer.chrome.com/blog/intersectionobserver/)
- Using `scroll`, `resize`, or `orientationchange` [event handlers](/lazy-loading-images/)

Either option can let developers include lazy loading functionality, and many developers have built third-party libraries to provide abstractions that are even easier to use. With lazy loading supported directly by the browser, however, there's no need for an external library. Browser-level lazymloading also ensures that deferred loading of images still works even if JavaScript is disabled on the client.

## The `loading` attribute

Chrome loads images at different priorities depending on where they're located with respect to the device viewport. Images below the viewport are loaded with a lower priority, but they're still fetched as the page loads.

You can use the `loading` attribute to completely defer the loading of offscreen images that are reached by scrolling:

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Here are the supported values for the `loading` attribute:

- `lazy`: Defer loading of the resource until it reaches a [calculated distance](#distance-from-viewport-thresholds) from the viewport.
- `eager`: Default loading behavior of the browser, which is the same as not including the attribute and means the image is loaded regardless of where it's located on the page. While this is the default, it can be useful to explicitly set this if your tooling automatically adds `loading="lazy"` if there is no explicit value, or if your linter complains if it is not explicitly set.

{% Aside 'caution' %}
  Images that are highly likely to be in-viewport, and in particular [LCP](/lcp/) images, [should not be lazy-loaded](#avoid-lazy-loading-images-that-are-in-the-first-visible-viewport).
{% endAside %}

### Relationship between the `loading` attribute and fetch priority

The `eager` value is simply an instruction to load the image as usual, without delaying the load further if it is off-screen. It does not imply that the image is loaded any quicker than another image without the `loading="eager"` attribute.

Browsers prioritize resources based on various heuristics, and the `loading` attribute just states _when_ the image resource is queued, not _how_ it is prioritized in that queue. `eager` just implies the usual eager queueing browsers use by default.

If you want to increase the fetch priority of an important image (for example the LCP image), then [Fetch Priority](/fetch-priority/) should be used with `fetchpriority="high"`.

Note that an image with `loading="lazy"` and `fetchpriority="high"` will still be delayed while it is off-screen, and then fetched with a high priority when it is nearly within the viewport. It would likely be fetched with a high priority in this case anyway, so this combination should not really be needed nor used.

### Distance-from-viewport thresholds

All images that are above the fold—that is, immediately viewable without scrolling—load normally. Those that are far below the device viewport are only fetched when the user scrolls near them.

Chromium's implementation of lazy loading tries to ensure that offscreen images are loaded early enough so that they have finished loading once the user scrolls near to them. By fetching nearby images well before they become visible in the viewport, we maximize the chance they are already loaded by the time they become visible.

Compared to JavaScript lazy loading libraries, the thresholds for fetching images that scroll into view may be considered conservative.

{% Aside %}
Experiments conducted using Chrome on Android suggest that on 4G, 97.5% of below-the-fold images that are lazy-loaded were fully loaded within 10ms of becoming visible. Even on slow 2G networks, 92.6% of below-the-fold images were fully loaded within 10ms. This means browser-level lazy loading offers a stable experience regarding the visibility of elements that are scrolled into view.
{% endAside %}

The distance threshold is not fixed and varies depending on several factors:

- The type of image resource being fetched
- The [effective connection type](https://googlechrome.github.io/samples/network-information/)

You can find the default values for the different effective connection types in the [Chromium source](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/settings.json5;l=963-995). These numbers, and even the approach of fetching only when a certain distance from the viewport is reached, may change in the future as the Chrome team improves heuristics to determine when to begin loading.

{% Aside %}
You can experiment with these different thresholds by [throttling the network](https://developer.chrome.com/docs/devtools/network/#throttle) in DevTools.
{% endAside %}

## Improved data-savings and distance-from-viewport thresholds

As of July 2020, Chrome has made significant improvements to align the image lazy loading distance-from-viewport thresholds to better meet developer expectations.

On fast connections (4G), we reduced Chrome's distance-from-viewport thresholds from `3000px` to `1250px` and on slower connections (3G or lower), changed the threshold from `4000px` to `2500px`. This change achieves two things:

* `<img loading=lazy>` behaves closer to the experience offered by JavaScript lazy loading libraries.
* The new distance-from-viewport thresholds still allow us to guarantee images have probably loaded by the time a user has scrolled to them.

You can find a comparison between the old vs. new distance-from-viewport thresholds for one of our demos on a fast connection (4G) below:

Old thresholds. vs new thresholds:

<figure>
  {% Img src="image/admin/xSZMqpbioBRwRTnenK8f.png", alt="The new and improved thresholds for image lazy loading, reducing the distance-from-viewport thresholds for fast connections from 3000px down to 1250px", width="800", height="460" %}
</figure>

and the new thresholds vs. LazySizes (a popular JS lazy loading library):

<figure>
  {% Img src="image/admin/oHMFvflk9aesT7r0iJbx.png", alt="The new  distance-from-viewport thresholds in Chrome loading 90KB of images compared to LazySizes loading in 70KB under the same network conditions", width="800", height="355" %}
</figure>

We are committed to working with the web standards community to explore better alignment in how distance-from-viewport thresholds are approached across different browsers.

### Images should include dimension attributes

While the browser loads an image, it does not immediately know the image's dimensions, unless these are explicitly specified. To enable the browser to reserve sufficient space on a page for images, it is recommended that all `<img>` tags include both `width` and `height` attributes. Without dimensions specified, [layout shifts](/cls/) can occur, which are more noticeable on pages that take some time to load.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Alternatively, specify their values directly in an inline style:

```html
<img src="image.png" loading="lazy" alt="…" style="height:200px; width:200px;">
```

The best practice of setting dimensions applies to `<img>` tags regardless of whether or not they are being loaded lazily. With lazy loading, this can become more relevant. Setting `width` and `height` on images in modern browsers also allows browsers to infer their intrinsic size.

In most scenarios images still lazy-load if dimensions are not included, but there are a few edge cases you should be aware of. Without `width` and `height` specified, image dimensions are 0×0 pixels at first. If you have a gallery of such images, the browser may conclude that all of them fit inside the viewport at the start, as each takes up practically no space and no image is pushed offscreen. In this case the browser determines that all of them are visible to the user and decides to load everything.

Also, [specifying image dimensions decreases the chances of layout shifts happening](https://www.youtube.com/watch?v=4-d_SoCHeWE). If you are unable to include dimensions for your images, lazy loading them can be a trade-off between saving network resources and potentially being more at risk of layout shift.

While lazy loading in Chromium is implemented in a way such that images are likely to be loaded once they are visible, there is still a small chance that they might not be loaded yet. In this case, missing `width` and `height` attributes on such images increase their impact on Cumulative Layout Shift.

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

Although a browser will decide which image to load from any of the `<source>` elements, the `loading` attribute only needs to be included to the fallback `<img>` element.


## Avoid lazy loading images that are in the first visible viewport

You should avoid setting `loading=lazy` for any images that are in the first visible viewport. This is particularly relevant for LCP images. See the article [The performance effects of too much lazy-loading](/lcp-lazy-loading/) for more information.

It is recommended to only add `loading=lazy` to images which are positioned below the fold, if possible. Images that are eagerly loaded can be fetched right away, while images which are loaded lazily the browser currently needs to wait until it knows where the image is positioned on the page, which relies on the `IntersectionObserver` to be available.

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

Browsers that do not support the `loading` attribute will ignore its presence. While these browsers will of course not get the benefits of lazy loading, including the attribute has no negative impact on them.

## FAQ

### Are there plans to automatically lazy-load images in Chrome?

Previously, Chromium automatically lazy-loaded any images that were well suited to being deferred if [Lite mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) was enabled on Chrome for Android and the `loading` attribute was either not provided or set as `loading="auto"`. However, [Lite mode has been deprecated](https://support.google.com/chrome/thread/151853370/sunsetting-chrome-lite-mode-in-m100-and-older?hl=en) (as was the non-standard `loading="auto"`) and there are currently no plans to provide automatically lazy-load of images in Chrome.

### Can I change how close an image needs to be before a load is triggered?

These values are hardcoded and can't be changed through the API. However, they may change in the
future as browsers experiment with different threshold distances and variables.

### Can CSS background images take advantage of the `loading` attribute?

No, it can currently only be used with `<img>` tags.

### Is there a downside to lazy loading images that are within the device viewport?

It is safer to avoid putting `loading=lazy` on above-the-fold images, as Chrome won't preload `loading=lazy` images in the [preload scanner](/preload-scanner/) and will also delay fetching such images until all layout is complete. See [Avoid lazy-loading images that are in the first visible viewport](#avoid-lazy-loading-images-that-are-in-the-first-visible-viewport) for more information.

### How does the `loading` attribute work with images that are in the viewport but not immediately visible (for example: behind a carousel, or hidden by CSS for certain screen sizes)?

Using `loading="lazy"` _may_ prevent them being loaded when they are not visible but within the [calculated-distance](#distance-from-viewport-thresholds). For example, Chrome, Safari and Firefox do not load images using `display: none;` styling—either on the image element or on a parent element. However, other techniques to hide images—such as using `opacity:0` styling—will still result in the images being loaded. Always test your implementation thoroughly to ensure it's acting as intended.

### What if I'm already using a third-party library or a script to lazy-load images?

With full support of native lazy loading now available in modern browsers, you may wish to reconsider if you still need a third-party library or script to lazy-load images.

One reason to continue to use a third-party library along with `loading="lazy"` is to provide a polyfill for browsers that do not support the attribute, or to have more control over when lazy loading is triggered.

### How do I handle browsers that don't support lazy loading?

Create a polyfill or use a third-party library to lazy-load images on your site. The `loading`
property can be used to detect if the feature is supported in the browser:

```js
if ('loading' in HTMLImageElement.prototype) {
  // supported in browser
} else {
  // fetch polyfill/third-party library
}
```

For example, [lazysizes](https://github.com/aFarkas/lazysizes) is a popular JavaScript lazy loading library. You can detect support for the `loading` attribute to load lazysizes as a fallback library only when `loading` isn't supported. This works as follows:

- Replace `<img src>` with `<img data-src>` to avoid an eager load in unsupported browsers. If the `loading` attribute is supported, swap `data-src` for `src`.
- If `loading` is not supported, load a fallback (lazysizes) and initiate it. As per lazysizes docs, you use the `lazyload` class as a way to indicate to lazysizes which images to lazy-load.

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

Here's a [demo](https://lazy-loading.firebaseapp.com/lazy_loading_lib.html) of this pattern. Try it out in an older browser to see the fallback in action.

{% Aside %}
  The lazysizes library also provides a [loading plugin](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading)
  that uses browser-level lazy loading when available but falls back to the library's custom functionality when needed.
{% endAside %}

### Is lazy loading for iframes also supported in browsers?

{% BrowserCompat 'html.elements.iframe.loading' %}

`<iframe loading=lazy>` has also been standardized and is already implemented in Chromium and Safari. This allows you to lazy-load iframes using the `loading` attribute. See [this dedicated article about iframe lazy-loading](/iframe-lazy-loading/) for more information.

### How does browser-level lazy loading affect advertisements on a web page?

All ads displayed to the user in the form of an image or iframe lazy-load just like any other image or iframe.

### How are images handled when a web page is printed?

All images and iframes are immediately loaded if the page is printed. See [issue #875403](https://bugs.chromium.org/p/chromium/issues/detail?id=875403) for details.

### Does Lighthouse recognize browser-level lazy loading?

[Lighthouse 6.0](/lighthouse-whats-new-6.0/) and above factor in approaches for offscreen image lazy loading that may use different thresholds, allowing them to pass the [Defer offscreen images](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/) audit.

## Conclusion

Baking in support for lazy loading images can make it significantly easier for you to improve the performance of your web pages.

Are you noticing any unusual behavior with this feature enabled in Chrome? [File a bug](https://bugs.chromium.org/p/chromium/issues/entry?summary=%5BLazyLoad%5D:&comment=Application%20Version%20%28from%20%22Chrome%20Settings%20%3E%20About%20Chrome%22%29:%20%0DAndroid%20Build%20Number%20%28from%20%22Android%20Settings%20%3E%20About%20Phone/Tablet%22%29:%20%0DDevice:%20%0D%0DSteps%20to%20reproduce:%20%0D%0DObserved%20behavior:%20%0D%0DExpected%20behavior:%20%0D%0DFrequency:%20%0D%3Cnumber%20of%20times%20you%20were%20able%20to%20reproduce%3E%20%0D%0DAdditional%20comments:%20%0D&labels=Pri-2&components=Blink%3ELoader%3ELazyLoad%2C)!

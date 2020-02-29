---
title: Native lazy-loading for the web
subhead: Browser-level native lazy-loading is finally here!
authors:
  - houssein
  - addyosmani
  - mathiasbynens
date: 2019-08-06
hero: hero.png
alt: Phone outline with loading image and assets
description: |
  This post covers the loading attribute and how it can be used
  to control the loading of images and iframes.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - performance
---

Support for natively lazy-loading images and iframes is coming to the web! This video shows
a [demo](https://mathiasbynens.be/demo/img-loading-lazy) of the feature:

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="./lazyload.webm" type="video/webm">
    <source src="./lazyload.mp4" type="video/mp4">
  </video>
</figure>

Starting with Chrome 76, you'll be able to use the new `loading` attribute to lazy-load resources
without the need to write custom lazy-loading code or use a separate JavaScript library. Let's dive
into the details.

## Why native lazy-loading?

According to [HTTPArchive](https://httparchive.org/reports/page-weight), images are the most
requested asset type for most websites and usually take up more bandwidth than any other
resource. At the 90th percentile, sites send about 4.7 MB of images on desktop and mobile. That's a
lot of [cat pictures](https://en.wikipedia.org/wiki/Cats_and_the_Internet).

Embedded iframes also use a lot of data and can harm page performance. Only loading
non-critical, below-the-fold images and iframes when the user is likely to see them improves
page load times, minimizes user bandwidth, and reduces memory usage.

Currently, there are two ways to defer the loading of off-screen images and iframes:

- Using the [Intersection Observer
  API](https://developers.google.com/web/updates/2016/04/intersectionobserver)
- Using `scroll`, `resize`, or `orientationchange` [event
  handlers](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way)

Either option can let developers include lazy-loading functionality, and many developers have built
third-party libraries to provide abstractions that are even easier to use. With lazy-loading
supported directly by the browser, however, there's no need for an external library. Native lazy
loading also ensures that deferred loading of images and iframes still works even if JavaScript is
disabled on the client.

## The `loading` attribute

Today, Chrome already loads images at different priorities depending on where they're located with
respect to the device viewport. Images below the viewport are loaded with a lower priority, but they're
still fetched as soon as possible.

In Chrome 76, you can use the `loading` attribute to completely defer the loading of offscreen images
and iframes that can be reached by scrolling:

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
<iframe src="https://example.com" loading="lazy"></iframe>
```

Here are the supported values for the `loading` attribute:

- `auto`: Default lazy-loading behavior of the browser, which is the same as not
  including the attribute.
- `lazy`: Defer loading of the resource until it reaches a [calculated distance](#load-in-distance-threshold) from the viewport.
- `eager`: Load the resource immediately, regardless of where it's located on the page.

### Load-in distance threshold

All images and iframes that are above the fold—that is, immediately viewable without scrolling—load
normally. Those that are far below the device viewport are only fetched when the user scrolls near
them.

The distance threshold is not fixed and varies depending on several factors:

- The type of resource being fetched (image or iframe)
- Whether [Lite mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) is enabled
  on Chrome for Android
- The [effective connection type](https://googlechrome.github.io/samples/network-information/)

You can find the default values for the different effective connection types in the [Chromium
source](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/settings.json5?l=971-1003&rcl=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad).
These numbers, and even the approach of fetching only when a certain distance from the viewport is
reached, may change in the near future as the Chrome team improves heuristics to determine when to
begin loading.

{% Aside %}
In Chrome 77, you can experiment with these different thresholds by [throttling the
network](https://developers.google.com/web/tools/chrome-devtools/network/#throttle) in DevTools. In
the meantime, you will need to override the effective connection type of the browser using the
`chrome://flags/#force-effective-connection-type` flag.
{% endAside %}

### Image loading

To prevent the surrounding content from reflowing when a lazy-loaded image is downloaded, make sure
to add `height` and `width` attributes to the `<img>` element or specify their values directly in an
inline style:

```html
<img src="…" loading="lazy" alt="…" width="200" height="200">
<img src="…" loading="lazy" alt="…" style="height:200px; width:200px;">
<!-- lazy-loaded -->
```

Images will still lazy-load if dimensions are not included, but [specifying them decreases the chance of
browser reflow](https://www.youtube.com/watch?v=4-d_SoCHeWE).

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

### iframe loading

The `loading` attribute affects iframes differently than images, depending on whether the iframe is
hidden. (Hidden iframes are often used for analytics or communication purposes.) Chrome uses the
following criteria to determine whether an iframe is hidden:

- The iframe's width and height are 4 px or smaller.
- `display: none` or `visibility: hidden` is applied.
- The iframe is placed off-screen using negative X or Y positioning.

If an iframe meets any of these conditions, Chrome considers it hidden and won't lazy-load it in
most cases. Iframes that _aren't_ hidden will only load when they're within the [load-in distance threshold](#load-in-distance-threshold).
A placeholder shows for lazy-loaded iframes that are still being fetched.

## FAQ

### Are there plans to expand this feature?

There are plans to change the default lazy-loading behavior of the browser to automatically
lazy-load any images or iframes that are well suited to being deferred if [Lite
mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) is enabled on Chrome for
Android.

### Can I change how close an image or iframe needs to be before a load is triggered?

These values are hardcoded and can't be changed through the API. However, they may change in the
future as the Chrome team experiments with different threshold distances and variables.

### Can CSS background images take advantage of the `loading` attribute?

No, it can currently only be used with `<img>` tags.

### Is there a downside to lazy-loading images or iframes that are within the device viewport?

Intersection observers for elements that are above the device fold may not fire before the window
load event, and the lazy-loading functionality in Chrome relies on `IntersectionObserver`. There is
an [open issue](https://bugs.chromium.org/p/chromium/issues/detail?id=992526) to modify this
behavior so that intersection observers are fired _before_ the window load event. 

In the meantime, it is safer to only use the `loading` attribute for elements that are outside of
the device viewport to prevent late fetches of on-screen elements.

### How does the `loading` attribute work with images that are in the viewport but not immediately visible (for example: behind a carousel, or hidden by CSS for certain screen sizes)?

Only images that are below the device viewport by the [calculated
distance](#load-in-distance-threshold) load lazily. All images above the viewport, regardless of
whether they're immediately visible, load normally.

### What if I'm already using a third-party library or a script to lazy-load images or iframes?

The `loading` attribute should not affect code that currently lazy-loads your assets in any way, but
there are a few important things to consider:

1. If your custom lazy-loader attempts to load images or frames sooner than when Chrome loads them
   normally—that is, at a distance greater than the [load-in distance threshold](#load-in-distance-threshold)—
   they are still deferred and load based on normal browser behavior.
2. If your custom lazy-loader uses a shorter distance to determine when to load a particular image
   or iframe than the browser, then the behavior would conform to your custom settings.

One of the important reasons to continue to use a third-party library along with `loading="lazy"` is
to provide a polyfill for browsers that do not yet support the attribute.

### Do other browsers support native lazy-loading?

The `loading` attribute can be treated as a progressive enhancement. Browsers that support it can
lazy-load images and iframes. Those that don't yet can load images just like they would today. In
terms of cross-browser support, currently `loading` is supported in Chrome 76, Mozilla Firefox 75 and in and any Chromium 76-based browsers.

A [similar API](https://w3c.github.io/web-performance/specs/ResourcePriorities/Overview.html) was
proposed and used in IE and Edge but was focused on lowering the download priorities of resources
instead of deferring them entirely. It was discontinued in favour of [resource
hints](https://w3c.github.io/resource-hints/).

### How do I handle browsers that don't yet support native lazy-loading?

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

Here's a [demo](https://lazy-loading.firebaseapp.com/lazy_loading_native.html) of this pattern. Try
it out in a browser like Firefox or Safari to see the fallback in action.

{% Aside %}
  The lazysizes library also provides a [native loading plugin](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading)
  that uses native lazy-loading when available but falls back to the library's custom functionality when needed.
{% endAside %}

### How does native lazy-loading affect advertisements on a web page?

All ads displayed to the user in the form of an image or iframe lazy-load just
like any other image or iframe.

### How are images handled when a web page is printed?

Although the functionality isn't in Chrome 76, there's an [open
issue](https://bugs.chromium.org/p/chromium/issues/detail?id=875403) to ensure that all images and
iframes are immediately loaded if a page is printed.

## Conclusion

Baking in native support for lazy-loading images and iframes can make it significantly easier for
you to improve the performance of your web pages.

Are you noticing any unusual behavior with this feature enabled in Chrome? [File a
bug](https://bugs.chromium.org/p/chromium/issues/entry?summary=%5BLazyLoad%5D:&comment=Application%20Version%20%28from%20%22Chrome%20Settings%20%3E%20About%20Chrome%22%29:%20%0DAndroid%20Build%20Number%20%28from%20%22Android%20Settings%20%3E%20About%20Phone/Tablet%22%29:%20%0DDevice:%20%0D%0DSteps%20to%20reproduce:%20%0D%0DObserved%20behavior:%20%0D%0DExpected%20behavior:%20%0D%0DFrequency:%20%0D%3Cnumber%20of%20times%20you%20were%20able%20to%20reproduce%3E%20%0D%0DAdditional%20comments:%20%0D&labels=Pri-2&components=Blink%3ELoader%3ELazyLoad%2C)!

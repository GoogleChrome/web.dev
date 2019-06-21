---
title: Native lazy loading for the web
subhead: Browser-level native lazy loading is finally here!
authors:
  - houssein
  - addyosmani
  - mathiasbynens
date: 2019-06-20
hero: hero.png
alt: Phone outline with loading image and assets
description: |
  This post covers the loading attribute and how it can be used
  to defer the loading of images and iframes
tags:
  - post # post is a required tag for the article to show up in the blog.
  - performance
---

Support for natively lazy-loading images and iframes is coming to the web!

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="./lazyload.webm" type="video/webm">
    <source src="./lazyload.mp4" type="video/mp4">
  </video>
 <figcaption class="w-figcaption w-figcaption--fullbleed">
    <a href="https://mathiasbynens.be/demo/img-loading-lazy">Lazy loading demo</a>
  </figcaption>
</figure>

Starting with Chrome 76, you’ll be able to use the new `loading` attribute to lazy-load resources,
without the need for a separate JavaScript library. Let’s dive into the details.

## Motivation

According to [HTTPArchive](https://httparchive.org/reports/page-weight), images are the most
requested type of asset for a majority of websites and usually take up more bandwidth than any other
resource. At the 90th percentile, sites send down ~4.7 MB of images on desktop & mobile. That’s a
lot of cat pictures.

Embedded inline frames use a lot of data too and can also harm page performance. Only loading
non-critical, below-the-fold images and iframes when the user is likely to see them improves
page load times, minimize user bandwidth, and reduce memory usage.

Currently, there are two ways to defer the loading of off-screen images and inline frames:

- Using the [Intersection Observer
  API](https://developers.google.com/web/updates/2016/04/intersectionobserver)
- Using [`scroll`, `resize`, or `orientationchange` event
  listeners](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way)

Either option can let developers include lazy loading functionality, and many have built third-party
libraries to provide even simpler-to-use abstractions. With lazy loading supported directly by the
browser however, an external library would not need to be loaded and relied upon. This also ensures
that deferred loading of images and frames still works even if JavaScript is disabled on the client.

## Lazy loading

Today, Chrome already loads images at different priorities depending on where they are located with
respect to the device viewport. Although this means that images below the viewport are loaded with a
lower priority, they are still fetched as soon as possible.

In Chrome 76, the loading attribute can be used to completely defer the loading of offscreen images
and iframes until the user scrolls near them:

```html
<img src="image.png" loading="lazy" alt="…" width=”200” height=”200” />
<iframe src="https://example.com" loading="lazy"></iframe>
```

The supported values for the attribute are as follows:

- `loading="auto"`: Default lazy-loading behaviour of the browser, which is the same as not
  including the attribute.
- `loading="lazy"`: Defer loading of resource until it reaches a certain distance from the viewport.
- `loading="eager"`: Load resource immediately regardless of where it is located on the page.

Updates to the feature will continue to be rolled in with a final, stable launch in Chrome 76 at the
earliest, but can currently be tested by enabling the following flags:

- `chrome://flags/#enable-lazy-image-loading`
- `chrome://flags/#enable-lazy-frame-loading`

### Image loading

To take advantage of lazy loading effectively, include height and width attributes or specify their
values directly in the inline style.

```html
<img src="..." loading="lazy" width=”200” height=”200” />
<img src="..." loading="lazy" style="height:200px;width:200px;" />
```

Images will still load lazily if dimensions are not included, but this increases the chance of
browser reflow.

Support for the `intrinsicsize` attribute is also being [worked
on](https://bugs.chromium.org/p/chromium/issues/detail?id=967992), so images will also lazy-load
correctly if `intrinsicsize` is specified along with one other dimension (`width` or `height`).

```html
<img src="…" alt="…" loading="lazy" intrinsicsize="250x200" width="450"> <!-- lazy-loaded -->
```

<div class="w-aside w-aside--note">
  Take a look at the following <a href="https://mathiasbynens.be/demo/img-loading-lazy">demo</a> to see how the <code>loading</code> attribute works with 100 pictures.
</div>

### Inline frame loading

Iframes that are intentionally hidden from view are usually used for analytics or communication
purposes and are not lazy-loaded in most cases. The following criteria is used to identify if a
frame is not hidden in Chrome:

- Must have a larger width and height than 4px
- `display: none` and `visibility: hidden` cannot be used
- Not off-screen using negative X or Y positioning

If an inline frame meets all of these conditions, those that are offscreen only load when they reach
a certain distance from the viewport. A similar placeholder also shows for lazily-loaded iframes that
are still being fetched.

### Load-in distance threshold

All images and iframes that are above the fold, or immediately viewable without scrolling, load
normally. Those that are outside, and not near, the device viewport do not load right after the
page has finished loading. They are only fetched when the user scrolls near them (or when the image
or iframe reaches a certain distance from the viewport).

The distance threshold is not fixed and varies depending on a number of different factors:

- Type of resource being fetched (image or iframe)
- If Lite mode is enabled on Chrome for Android
- [Effective connection type](https://googlechrome.github.io/samples/network-information/)

You can find the default values for the different effective connection types in the [Chromium
source](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/settings.json5?l=971-1003&rcl=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad).
These numbers, and even the approach of fetching only when a certain distance from the viewport is
reached, may change in the near future as we improve heuristics to determine when to begin loading.

### Feature Policy

Developers can override the default behavior through [feature
policies](https://developers.google.com/web/updates/2018/06/feature-policy):

- `loading-image-default-eager`: changes the default behavior of the `loading` attribute for images.
- `loading-frame-default-eager`: changes the default behavior of the `loading` attribute for frames.

The Feature-Policy HTTP header can be used to control both features. For example, the following
header can be used for all images on the page:

```
Feature-Policy: loading-image-default-eager 'none'
```

This lazily loads every image below the device viewport unless `loading=eager` is used.

```html
<img src="kitten.jpg" alt="…"> <!-- loaded lazily -->
<img loading="eager" src="puppy.jpg" alt="…"> <!-- loaded eagerly -->
```

The same can be done for iframes:

```
Feature-Policy: loading-frame-default-eager 'none'
```

To learn more about how both these policies work, as well as how to allow the feature for only
certain origins on a page, take a look at the policy proposals for both
[images](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/loading-image-default-eager.md)
and
[frames](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/loading-frame-default-eager.md).

<div class="w-aside w-aside--note">
  Complete functionality for both feature policies is expected to launch by Chrome 77.
</div>

## FAQ

### Can I change the amount of distance the image or iframe needs to be from the bottom of the viewport to trigger a load?

Although dependent on the effective connection type as well as other factors, these values are
hardcoded and cannot be changed through the API. However, they may change in the future as we
experiment with different threshold distances and variables.

### Does this support CSS background images?

The `loading` attribute can only be used for image tags in markup and cannot be used for images that
load via the CSS
[`background-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image) property.

### How does this feature work with images that are above the viewport but are not immediately visible (for example: behind a carousel)?

Only images that are below the device viewport by a certain distance load lazily. All images
above the viewport, regardless if they are not immediately visible (behind a carousel for example),
load normally.

### What if I’m already using a third-party library or a script to lazy-load images or inline frames?

The `loading` attribute should not affect code that currently lazy-loads your assets in any way, but
there are a few important things to consider:

1. If your custom lazy-loader attempts to load images or frames sooner than when Chrome loads
   them normally, i.e., at a distance greater than the buffer distance the browser uses to determine
   when to load, they are still deferred and load as per the normal browser behaviour.
2. If your custom lazy-loader uses a shorter distance to determine when to load a particular image
   or inline frame than the browser, then the behaviour would conform to your custom settings.

One of the important reasons to continue to use a third-party library along with `loading="lazy"` is
to provide a polyfill for browsers that do not yet support the attribute.

### Do other browsers support native lazy-loading?

The `loading` attribute can be treated as a progressive enhancement. Browsers that do support it can
lazy-load images and iframes. Those that don’t (yet) are still able to load their images, just like
they would today. In terms of cross-browser support, `loading` should be supported in Chrome 76 and
any Chromium 76-based browsers. There is also [an open implementation bug for
Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1542784).

A [similar API](https://w3c.github.io/web-performance/specs/ResourcePriorities/Overview.html) was
proposed and used in IE and Edge but was focused on lowering the download priorities of resources
instead of deferring them entirely. It was discontinued in favour of [resource
hints](https://w3c.github.io/resource-hints/). 

### How do I handle browsers that do not yet support this feature?

For browsers that do not yet support the `loading` attribute, create a polyfill or leverage a
third-party library to lazily load images on your site. The `loading` property can be used to detect
if the feature is supported in the browser:

```js
if ('loading' in HTMLImageElement.prototype) {
  // supported in browser
} else {
  // fetch polyfill/third-party library
}
```

For example, [lazysizes](https://github.com/aFarkas/lazysizes) is a popular JavaScript lazy-loading
library. We can feature-detect support for the `loading` attribute to load lazysizes as a fallback
library only when it isn’t supported. This works as follows:

- Replace `<img src>` with `<img data-src>` to avoid an eager load in unsupported browsers. If the
  `loading` attribute is supported, we swap `data-src` for `src`.
- If `loading` is not supported, we load a fallback (lazysizes) and initiate it. Here, we use
  `class=lazyload` as a way to indicate to lazysizes images we want to be lazily-loaded.

```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt="…">

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="cats.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="dogs.jpg" alt="…" loading="lazy" class="lazyload">

<script>
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll("img.lazyload");
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js";
    document.body.appendChild(script);
  }
</script>
```

A [demo](https://lazy-loading.firebaseapp.com/lazy_loading_native.html) of this pattern in action is
available. Try it out in a browser like Firefox or Safari to see the fallback in action.

<div class="w-aside w-aside--note">
  The lazysizes library also provides a <a href="https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading">native loading plugin</a>
  which leverages browser native lazy loading when available but falls back to its own custom functionality when needed.
</div>

### How does this affect advertisements on a web page?

All ads displayed to the user in the form of an image or inline frame lazy-load in the exact same
way.

### How are images handled when a web page is printed?

Although not in Chrome 76, there is an [open
issue](https://bugs.chromium.org/p/chromium/issues/detail?id=875403) to ensure that all images and
iframes are immediately loaded if a page is printed. 

## Conclusion

Baking in native support for lazy-loading images and iframes can make it significantly easier for
developers to improve the performance of their web pages. We always love to hear feedback:

- Are you noticing any unusual behaviour with this feature enabled in Chrome? [File a
  bug](https://bugs.chromium.org/p/chromium/issues/entry) and we’ll help you.

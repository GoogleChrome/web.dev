---
layout: post
title: Lazy-loading images
authors:
  - jeremywagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: |
  This post explains lazy-loading and the options available to you when lazy-loading images.
tags:
  - performance
---

Images can appear on a webpage due to being inline in the HTML as `<img>` elements
or as CSS background images. In this guide you will find out how to lazy-load both types of image.

### Inline images {: #images-inline }

The most common lazy-loading candidates are images as used in `<img>` elements.
With inline images we have three options for lazy-loading,
which may be used in combination for the best compatibility across browsers.

- [Using native browser lazy-loading](#images-inline-native).
- [Using intersection observer](#images-inline-intersection-observer).
- [Using scroll and resize event handlers](#images-inline-event-handlers).

#### Using native browser lazy-loading {: #images-inline-native }

Chrome and Firefox both support native browser lazy-loading with the `loading` attribute.
This attribute can be added to `<img>` elements, and also to `<iframe>` elements.
A value of `lazy` tells the browser to load the image immediately if it is in the viewport,
and to fetch other images when the user scrolls near them.

{% Aside %}
  Please note `<iframe loading=lazy>` is currently non-standard.
  While implemented in Chromium, it does not yet have a specification and is subject to future change when this does happen.
  We suggest not to lazy-load iframes using the loading attribute until it becomes part of the specification.
{% endAside %}

See the `loading` field of MDN's
[Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Browser_compatibility)
table for details of browser support for native lazy-loading.
If the browser does not support native lazy-loading then the attribute will be ignored
and images will load immediately, as normal.

For most websites, adding this attribute to inline images will be a performance boost
and save users loading images that they may not ever scroll to.
If you have large numbers of images and want to be sure that users of browsers without support for native lazy-loading benefit
you will need to combine this with one of the methods explained next.

#### Using intersection observer {: #images-inline-intersection-observer }

To polyfill lazy-loading of `<img>` elements, we use JavaScript to check if they're in the
viewport. If they are, their `src` (and sometimes `srcset`) attributes are
populated with URLs to the desired image content.

If you've written lazy-loading code before, you may have accomplished your task
by using event handlers such as `scroll` or `resize`. While this approach is the
most compatible across browsers, modern browsers offer a more performant and
efficient way to do the work of checking element visibility via [the
intersection observer API](https://developers.google.com/web/updates/2016/04/intersectionobserver).

{% Aside %}
  Intersection observer is not supported in all browsers.
  If compatibility across browsers is crucial,
  be sure to read [the next section](#using_event_handlers_the_most_compatible_way),
  which shows you how to lazy-load images using less performant (but more compatible!) scroll and resize event handlers.
{% endAside %}

Intersection observer is easier to use and read than code relying on various
event handlers, because you only need to register an observer to watch
elements rather than writing tedious element visibility detection code. All
that's left to do is to decide what to do when an element is visible.
Let's assume this basic markup pattern for your lazily loaded `<img>` elements:

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="I'm an image!">
```

There are three relevant pieces of this markup that you should focus on:

1. The `class` attribute, which is what you'll select the element with in
JavaScript.
2. The `src` attribute, which references a placeholder image that will appear when
the page first loads.
3. The `data-src` and `data-srcset` attributes, which are placeholder attributes
containing the URL for the image you'll load once the element is in the viewport.

Now let's see how to use intersection observer in JavaScript to lazy-load
images using this markup pattern:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to a more compatible method here
  }
});
```

On the document's `DOMContentLoaded` event, this script queries the DOM for all
`<img>` elements with a class of `lazy`. If intersection observer is available,
create a new observer that runs a callback when `img.lazy` elements enter the
viewport.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/lazy-intersection-observer?path=index.html&previewSize=100"
    title="lazy-intersection-observer on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Intersection observer is available in all modern browsers.
Therefore using it as a polyfill for `loading=lazy` will ensure that lazy-loading is available for most visitors.
It is not available in Internet Explorer. If Internet Explorer support is critical, read on.

#### Using event handlers (the most compatible way) {: #images-inline-event-handlers }

While you _should_ use intersection observer for lazy-loading, your application
requirements may be such that browser compatibility is critical. [You _can_
polyfill intersection observer
support](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) (and
this would be easiest), but you could also fall back to code using
[`scroll`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll),
[`resize`](https://developer.mozilla.org/en-US/docs/Web/Events/resize), and
possibly
[`orientationchange`](https://developer.mozilla.org/en-US/docs/Web/Events/orientationchange)
event handlers in concert with
[`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
to determine whether an element is in the viewport.

Assuming the same markup pattern from before, the following JavaScript provides
the lazy-loading functionality:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      active = true;

      setTimeout(function() {
        lazyImages.forEach(function(lazyImage) {
          if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");

            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
            }
          }
        });

        active = false;
      }, 200);
    }
  };

  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
});
```

This code uses `getBoundingClientRect` in a `scroll` event handler to check if
any of `img.lazy` elements are in the viewport. A `setTimeout` call is used to
delay processing, and an `active` variable contains the processing state which
is used to throttle function calls. As images are lazy-loaded, they're removed
from the elements array. When the elements array reaches a `length` of `0`, the
scroll event handler code is removed.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/lazy-loading-fallback?path=lazy.js&previewSize=100"
    title="lazy-loading-fallback on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

While this code works in pretty much any browser, it has potential performance
issues in that repetitive `setTimeout` calls can be wasteful, even if the code
within them is throttled. In this example, a check is being run every 200
milliseconds on document scroll or window resize regardless of whether there's
an image in the viewport or not. Plus, the tedious work of tracking how many
elements are left to lazy-load and unbinding the scroll event handler are left
to the developer.

Simply put: Use native lazy-loading with a fallback intersection observer wherever possible, and only use event
handlers if the widest possible compatibility is a critical application
requirement.

### Images in CSS {: #images-css }

While `<img>` tags are the most common way of using images on web pages, images
can also be invoked via the CSS
[`background-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image)
property (and other properties). Native browser lazy-loading does not apply to CSS background images,
so we need to consider other methods if we have background images to lazy-load.

Unlike `<img>` elements which load regardless
of their visibility, image loading behavior in CSS is done with more
speculation. When [the document and CSS object
models](/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model)
and [render
tree](/web/fundamentals/performance/critical-rendering-path/render-tree-construction)
are built, the browser examines how CSS is applied to a document before
requesting external resources. If the browser has determined a CSS rule
involving an external resource doesn't apply to the document as it's currently
constructed, the browser doesn't request it.

This speculative behavior can be used to defer the loading of images in CSS by
using JavaScript to determine when an element is within the viewport, and
subsequently applying a class to that element that applies styling invoking a
background image. This causes the image to be downloaded at the time of need
instead of at initial load. For example, let's take an element that contains a
large hero background image:

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

The `div.lazy-background` element would normally contain the hero background
image invoked by some CSS. In this lazy-loading example, however, you can isolate
the `div.lazy-background` element's `background-image` property via a `visible`
class added to the element when it's in the viewport:

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Placeholder image */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* The final image */
}
```

From here, use JavaScript to check if the element is in the viewport (with
intersection observer!), and add the `visible` class to the
`div.lazy-background` element at that time, which loads the image:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/lazy-background?path=index.html&previewSize=100"
    title="lazy-background on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

As indicated earlier, if you need Internet Explorer support for lazy-loading of background images,
you will need to polyfill the Intersection Observer code, due to lack of support in that browser.

## lazy-loading libraries {: #libraries }

The following libraries can be used to lazy-load images.

- [lazysizes](https://github.com/aFarkas/lazysizes) is a full-featured lazy
loading library that lazy-loads images and iframes. The pattern it uses is quite
similar to the code examples shown here in that it automatically binds to a
`lazyload` class on `<img>` elements, and requires you to specify image URLs in
`data-src` and/or `data-srcset` attributes, the contents of which are swapped
into `src` and/or `srcset` attributes, respectively. It uses intersection
observer (which you can polyfill), and can be extended with [a number of
plugins](https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo) to
do things like lazy-load video. [Find out more about using lazysizes](/use-lazysizes-to-lazyload-images/).
- [lozad.js](https://github.com/ApoorvSaxena/lozad.js) is a super lightweight
option that uses intersection observer only. As such, it's highly performant,
but will need to be polyfilled before you can use it on older browsers.
- [yall.js](https://github.com/malchata/yall.js) is a library I wrote that uses
IntersectionObserver and falls back to event handlers. It's compatible with IE11
and major browsers.
- If you're seeking a React-specific lazy-loading library, you might consider
[react-lazyload](https://github.com/jasonslyvia/react-lazyload). While it
doesn't use intersection observer, it _does_ provide a familiar method of lazy
loading images for those accustomed to developing applications with React.

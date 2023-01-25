---
layout: post
title: Lazy-loading best practices
authors:
  - jeremywagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-11
description: |
  This post details how to navigate the potential pitfalls of lazy-loading.
tags:
  - performance
---

While lazy-loading images and video have positive and measurable performance
benefits, it's not a task to be taken lightly. If you get it wrong, there could
be unintended consequences. As such, it's important to keep the following
concerns in mind.

## Mind the fold {: #wrong-fold }

It may be tempting to lazy-load every single media resource on the page with
JavaScript, but you need to resist this temptation. Anything resting above the
fold shouldn't be lazy-loaded. Such resources should be considered critical
assets, and thus should be loaded normally.

Lazy-loading delays the loading of resources until after the DOM is interactive
when scripts have finished loading and begin execution. For images below the
fold, this is fine, but critical resources above the fold should be loaded with
the standard `<img>` element so they're displayed as soon as possible.

Of course, where the fold lies is not so clear these days when websites are
viewed on so many screens of varying sizes. What lies above the fold on a laptop
may well lie _below_ it on mobile devices. There's no bulletproof advice for
addressing this optimally in every situation. You'll need to conduct an
inventory of your page's critical assets, and load those images in typical
fashion.

Additionally, you may not want to be so strict about the fold line as the
threshold for triggering lazy-loading. It may be more ideal for your purposes to
establish a buffer zone some distance below the fold so that images begin
loading well before the user scrolls them into the viewport. For example, the
Intersection Observer API allows you to specify a `rootMargin` property in an
options object when you create a new `IntersectionObserver` instance. This
effectively gives elements a buffer, which triggers lazy-loading behavior before
the element is in the viewport:

```javascript
let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
  // lazy-loading image code goes here
}, {
  rootMargin: "0px 0px 256px 0px"
});
```

If the value for `rootMargin` looks similar to values you'd specify for a CSS
`margin` property, that's because it is! In this case, the
bottom margin of the observed element (the browser viewport by default, but
this can be changed to a specific element using the `root` property) is broadened by 256
pixels. That means the callback function will execute when an image element is
within 256 pixels of the viewport and the image will begin to load
before the user actually sees it.

To achieve this same effect in browsers that don't support Intersection Observe, use scroll event handling code and adjust your
`getBoundingClientRect` check to include a buffer.

## Layout shifting and placeholders {: #wrong-layout-shifting }

Lazy-loading media can cause [shifting in the layout](/cls) if placeholders aren't used.
These changes can be disorienting for users and trigger expensive DOM layout
operations that consume system resources and contribute to jank. At a minimum,
consider using a solid color placeholder occupying the same dimensions as the
target image, or techniques such as
[LQIP](http://www.guypo.com/introducing-lqip-low-quality-image-placeholders) or
[SQIP](https://github.com/technopagan/sqip) that hint at the content of a media
item before it loads.

For `<img>` tags, `src` should initially point to a placeholder until that
attribute is updated with the final image URL. Use the `poster` attribute in a
`<video>` element to point to a placeholder image. Additionally, use `width` and
`height` attributes on both `<img>` and `<video>` tags. This ensures that
transitioning from placeholders to final images won't change the rendered size
of the element as media loads.

## Image decoding delays {: #wrong-decoding-delays }

Loading large images in JavaScript and dropping them into the DOM can tie up the
main thread, causing the user interface to be unresponsive for a short period of
time while decoding occurs. [Asynchronously decoding images using the `decode`
method](https://medium.com/dailyjs/image-loading-with-image-decode-b03652e7d2d2)
prior to inserting them into the DOM can cut down on this sort of jank, but
beware: It's not available everywhere yet, and it adds complexity to lazy-loading logic.
If you want to use it, you'll need to check for it. Below shows
how you might use `Image.decode()` with a fallback:

```javascript
var newImage = new Image();
newImage.src = "my-awesome-image.jpg";

if ("decode" in newImage) {
  // Fancy decoding logic
  newImage.decode().then(function() {
    imageContainer.appendChild(newImage);
  });
} else {
  // Regular image load
  imageContainer.appendChild(newImage);
}
```

Check out [this CodePen link](https://codepen.io/malchata/pen/WzeZGW) to see
code similar to this example in action. If most of your images are fairly small,
this may not do much for you, but it can certainly help cut down on jank when
lazy-loading large images and inserting them into the DOM.

## When stuff doesn't load {: #wrong-loading-failure }

Sometimes media resources fail to load for one reason or another and errors
occur. When might this happen? It depends, but here's one hypothetical scenario
for you: You have an HTML caching policy for a short period of time (e.g., five
minutes), and the user visits the site _or_ a user has a left a stale tab open for
a long period of time (e.g., several hours) and comes back to read your content.
At some point in this process, a redeployment occurs. During this deployment, an
image resource's name changes due to hash-based versioning, or is removed
altogether. By the time the user lazy-loads the image, the resource is
unavailable, and thus fails.

While these are relatively rare occurrences, it may behoove you to have a backup
plan if lazy-loading fails. For images, such a solution may look something like
this:

```javascript
var newImage = new Image();
newImage.src = "my-awesome-image.jpg";

newImage.onerror = function(){
  // Decide what to do on error
};
newImage.onload = function(){
  // Load the image
};
```

What you decide to do in the event of an error depends on your application. For
example, you could replace the image placeholder area with a button that allows
the user to attempt to load the image again, or simply display an error message
in the image placeholder area.

Other scenarios could arise as well. Whatever you do, it's never a bad idea to
signal to the user when an error has occurred, and possibly give them an action
to take if something goes awry.

## JavaScript availability {: #wrong-no-js }

It shouldn't be assumed that JavaScript is always available. If you're going to
lazy-load images, consider offering `<noscript>` markup that will show images in
case JavaScript is unavailable. The simplest possible fallback example involves
using `<noscript>` elements to serve images if JavaScript is turned off:

<!-- An image that eventually gets lazy-loaded by JavaScript -->
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load.jpg" alt="I'm an image!">
<!-- An image that is shown if JavaScript is turned off -->
<noscript>
  <img src="image-to-lazy-load.jpg" alt="I'm an image!">
</noscript>

If JavaScript is turned off, users will see _both_ the placeholder image and the
image contained with the `<noscript>` elements. To get around this, place
a class of `no-js` on the `<html>` tag like so:

```html
<html class="no-js">
```

Then place one line of inline script in the `<head>` before any style sheets
are requested via `<link>` tags that removes the `no-js` class from the `<html>`
element if JavaScript is on:

```html
<script>document.documentElement.classList.remove("no-js");</script>
```

Finally, use some CSS to hide elements with a class of lazy when
JavaScript is unavailable:

```css
.no-js .lazy {
  display: none;
}
```

This doesn't prevent placeholder images from loading, but the outcome is more
desirable. People with JavaScript turned off get something more than placeholder
images, which is better than placeholders and no meaningful image content at
all.

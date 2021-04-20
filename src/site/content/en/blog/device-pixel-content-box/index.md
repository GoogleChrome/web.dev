---
title: Pixel-perfect rendering with devicePixelContentBox
subhead: How many pixels are there _really_ in a canvas?
authors:
  - surma
date: 2020-07-07
# updated: 2020-06-24
hero: image/admin/t9UnR0miKBlEuPbvPdPH.jpg
alt: A closeup image of a computer screen.
description: Since Chrome 84, ResizeObserver supports a new box measurement called device-pixel-content-box, that measures the element's dimension in physical pixels. This is crucial for rendering pixel-perfect graphics, especially in the context of high-density screens.
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

Since Chrome 84, [ResizeObserver] supports a new box measurement called `device-pixel-content-box`, that measures the element's dimension in _physical_ pixels. This enables rendering pixel-perfect graphics, especially in the context of high-density screens.

## Background: CSS pixels, canvas pixels, and physical pixels

While we often work with abstract units of length like `em`, `%` or `vh`, it all boils down to pixels. Whenever we specify the size or position of an element in CSS, the browser's layout engine will eventually convert that value to pixels (`px`). These are "CSS Pixels", which have a lot of history and only have a loose relationship with the pixels you have on your screen.

For a long time, it was fairly reasonable to estimate anyone's screen pixel density with 96DPI ("dots per inch"), meaning any given monitor would have roughly 38 pixels per cm. Over time, monitors grew and/or shrunk or started to have more pixels on the same surface area. Combine that with the fact that lots of content on the web define their dimensions, including font sizes, in `px`, and we end up with illegible text on these high-density ("HiDPI") screens. As a counter-measure, browsers hide the monitor's actual pixel density and instead pretend that the user has a 96 DPI display. The `px` unit in CSS represents the size of one pixel on this _virtual_ 96 DPI display, hence the name "CSS Pixel". This unit is only used for measurement and positioning. Before any actual rendering happens, a conversion to physical pixels happens.

How do we go from this virtual display to the user's real display? Enter `devicePixelRatio`. This global value tells you how many _physical_ pixels you need to form a single CSS pixel. If `devicePixelRatio` (dPR) is `1`, you are working on a monitor with roughly 96DPI. If you have a retina screen, your dPR is probably `2`. On phones it is not uncommon to encounter higher (and weirder) dPR values like `2`, `3` or even `2.65`. It is essential to note that this value is _exact_, but doesn't let you derive the monitor's _actual_ DPI value. A dPR of `2` means that 1 CSS pixel will map to _exactly_ 2 physical pixels.

{% Details %}
{% DetailsSummary %}
Example

My monitor has a dPR of `1` according to Chrome…
{% endDetailsSummary %}
It has 3440 pixels in width and the display area is 79cm wide.
That leads to a resolution of 110 DPI. Close to 96, but not quite.
That is also the reason why a <code>&lt;div style="width: 1cm; height: 1cm"&gt;</code>
will not exactly measure 1cm in size on most displays.
{% endDetails %}

Finally, dPR can also be affected by your browser's zoom feature. If you zoom in, the browser increases the reported dPR, causing everything to render bigger. If you check `devicePixelRatio` in a DevTools Console while zooming, you can see fractional values appear.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ko6ehWmACBrUcPrl4AGO.png", alt="", width="600", height="314" %}
  <figcaption class="w-figcaption">DevTools showing a variety of fractional <code>devicePixelRatio</code> due to zooming.</figcaption>
</figure>

Let's add the `<canvas>` element to the mix. You can specify how many pixels you want the canvas to have using the `width` and `height` attributes. So `<canvas width=40 height=30>` would be a canvas with 40 by 30 pixels. However, this does not mean that it will be _displayed_ at 40 by 30 pixels. By default, the canvas will use the `width` and `height` attribute to define its intrinsic size, but you can arbitrarily resize the canvas using all the CSS properties you know and love. With everything we have learned so far, it might occur to you that this will not be ideal in every scenario. One pixel on the canvas might end up covering multiple physical pixels, or just a fraction of a physical pixel. This can lead to unpleasing visual artifacts.

To summarize: Canvas elements have a given size to define the area that you can draw on. The number of canvas pixels is completely independent from the canvas' display size, specified in CSS pixels. The number of CSS pixels is not the same as the number of physical pixels.

### Pixel perfection

In some scenarios, it is desirable to have an exact mapping from canvas pixels to physical pixels. If this mapping is achieved, it's called "pixel-perfect". Pixel-perfect rendering is crucial for legible rendering of text, especially when using [subpixel rendering] or when displaying graphics with tightly aligned lines of alternating brightness.

To achieve something as close to a pixel-perfect canvas as possible on the web, this has been more or less the go-to approach:

```html
<style>
  /* … styles that affect the canvas' size … */
</style>
<canvas id="myCanvas"></canvas>
<script>
  const cvs = document.querySelector('#myCanvas');
  // Get the canvas' size in CSS pixels
  const rectangle = cvs.getBoundingClientRect();
  // Convert it to real pixels. Ish.
  cvs.width = rectangle.width * devicePixelRatio;
  cvs.height = rectangle.height * devicePixelRatio;
  // Start drawing…
</script>
```

The astute reader might be wondering what happens when dPR is not an integer value. That is a good question and exactly where the crux of this entire problem lies. In addition, if you specify an element's position or size using percentages, `vh`, or other indirect values, it is possible that they will resolve to fractional CSS pixel values. An element with `margin-left: 33%` can end up with a rectangle like this:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gWP1lVOw8ITEJhziaKnU.png", alt="", width="800", height="409" %}
  <figcaption class="w-figcaption">DevTools showing fractional pixel values as a result of a <code>getBoundingClientRect()</code> call.</figcaption>
</figure>

CSS pixels are purely virtual, so having fractions of a pixel is okay in theory, but how does the browser figure out the mapping to physical pixels? Because fractional _physical_ pixels are not a thing.

## Pixel snapping

The part of the unit conversion process that takes care of aligning elements with physical pixels is called "pixel snapping", and it does what it says on the tin: It snaps fractional pixel values to integer, physical pixel values. How exactly this happens is different from browser to browser. If we have an element with a width of `791.984px` on a display where dPR is 1, one browser might render the element at `792px` physical pixels, while another browser might render it at `791px`. That's just a single pixel off, but a single pixel can be detrimental to renderings that need to be pixel-perfect. This can lead to blurriness or even more visible artifacts like the [Moiré effect].

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/11FeCvp9aKLnDk05vYwY.png", alt="", width="600", height="802" %}
  <figcaption class="w-figcaption">The top image is a raster of differently colored pixels. The bottom image is the same as above, but the width and height have been reduced by one pixel using bilinear scaling. The emerging pattern is called the Moiré effect.<br>(You might have to open this image in a new tab to see it without any scaling applied to it.)</figcaption>
</figure>

## `devicePixelContentBox`

`devicePixelContentBox` gives you an element's content box in device pixel (i.e. physical pixel) units. It's part of `ResizeObserver`. While [ResizeObserver is now supported in all major browsers][ro support] since Safari 13.1, the `devicePixelContentBox` property is only in Chrome 84+ for now.

As mentioned in [`ResizeObserver`: it's like `document.onresize` for elements][resizeobserver], the callback function of a `ResizeObserver` will be called before paint and after layout. That means that the `entries` parameter to the callback will contain the sizes of all observed elements just before they are being painted. In the context of our canvas problem outlined above, we can use this opportunity to adjust the number of pixels on our canvas, ensuring that we end up with an exact one-to-one mapping between canvas pixels and physical pixels.

```js
const observer = new ResizeObserver((entries) => {
  const entry = entries.find((entry) => entry.target === canvas);
  canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
  canvas.height = entry.devicePixelContentBoxSize[0].blockSize;

  /* … render to canvas … */
});
observer.observe(canvas, {box: ['device-pixel-content-box']});
```

The `box` property in the options object for `observer.observe()` lets you define which sizes you wish to _observe_. So while each `ResizeObserverEntry` will always provide `borderBoxSize`, `contentBoxSize` and `devicePixelContentBoxSize` (provided the browser supports it), the callback will only be invoked if any of the _observed_ box metrics change.

{% Aside %}
All of the box metrics are arrays to allow `ResizeObserver` to handle fragmentation in the future. At the time of writing, the array is always of length 1.
{% endAside %}

With this new property, we can even animate our canvas' size and position (effectively guaranteeing fractional pixel values), and not see any Moiré effects on the rendering. If you would like to see the Moiré effect on the approach using `getBoundingClientRect()`, and how the new `ResizeObserver` property allows you to avoid it, take a look at the [demo] in Chrome 84 or later!

### Feature detection

To check if a user's browser has support for `devicePixelContentBox`, we can observe any element, and check if the property is present on the `ResizeObserverEntry`:

```js
function hasDevicePixelContentBox() {
  return new Promise((resolve) => {
    const ro = new ResizeObserver((entries) => {
      resolve(entries.every((entry) => 'devicePixelContentBoxSize' in entry));
      ro.disconnect();
    });
    ro.observe(document.body, {box: ['device-pixel-content-box']});
  }).catch(() => false);
}

if (!(await hasDevicePixelContentBox())) {
  // The browser does NOT support devicePixelContentBox
}
```

## Conclusion

Pixels are a surprisingly complex topic on the web and up until now there was no way for you to know the exact number of physical pixels an element occupies on the user's screen. The new `devicePixelContentBox` property on a `ResizeObserverEntry` gives you that piece of information and allows you to do pixel-perfect renderings with `<canvas>`. `devicePixelContentBox` is supported in Chrome 84+.

[resizeobserver]: /resize-observer/
[subpixel rendering]: https://en.wikipedia.org/wiki/Subpixel_rendering
[moiré effect]: https://en.wikipedia.org/wiki/Moir%C3%A9_pattern
[ro support]: https://caniuse.com/#feat=resizeobserver
[demo]: https://device-pixel-content-box.glitch.me/

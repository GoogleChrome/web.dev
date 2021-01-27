---
title: 'New Hardware-Accelerated Animation Capabilities in Chromium'
subhead: Why hardware-acceleration is important for your UIs.
authors:
  - una
date: 2021-01-19
hero: hero.jpg
alt: 'Bicycle race. Siora Photography via Unspash.'
description: Chromium is updating its hardware-acceleration capabilities to SVG animations, percentage-based transformations, clip-path, background images, and more.
tags:
  - blog
  - css
  - performance
---

*TLDR: Chromium is updating its hardware-acceleration capabilities automatically
for SVG animations,
percentage-based transformations, and soon, background-color and clip-path animations.*

When it comes to web animation performance, the terms "hardware-accelerated" and "GPU-accelerated"
animations will likely come up. But what do these even mean? Hardware-accelerated styles are those
that leverage the GPU (Graphical Processing Unit) rather than the CPU (Central Processing Unit) to
render visual styles. This is because the GPU can render visual changes on a web page faster than
the CPU. 

Using the GPU to offload graphic-intensive transitions and animations means smoother visuals and
less jank, as these animations are not affected by the main thread. By pulling them off the main
thread, your animations bypass the crust of other active scripts running on your page, which would
slow down your visuals and create jank. 

## Enabling hardware-accelerated animations

Hardware-accelerated animations are composited as layers and help developers achieve buttery-smooth
60 FPS (frames-per-second) animations to improve visual rendering performance. There are currently a
few ways to specify and enable hardware-accelerated animations and transitions on the web:

- Use CSS `transform` functions or transition the `opacity` or `filter` values
- Add the `will-change` property to your element.
- Create an animated canvas drawing
- Create a WebGL 3D drawing

{% Aside 'note' %} The Chromium rendering team is continually
[tracking](https://chromestatus.com/metrics/css/animated)  usage of the most-animated properties to
determine what should be next in regard to enabling hardware acceleration. While the current CSS
properties that are hardware-accelerated by default only include `opacity`, `filter`, and
`transform` for now, `background-color` and `clip-path` will soon join the list. {% endAside %}

What else is becoming hardware accelerated by default in Chromium? There are a few things coming
down the pipeline, including SVG animations, something that developers have been keenly
[requesting](https://codepen.io/chrisgannon/full/WvJMXP).

## Hardware accelerated SVG animations

SVG is a great addition to any website, and now those interactions with SVG can be more performant.
As of Chromium 88, Chromium will join the likes of Firefox to enable hardware-acceleration by
default on SVG animations. What do you, the developer, need to do? Nothing—this will be
automatically applied for SVG animations in Chromium 88+.

### Example

Let's take a look at the differences between an SVG animation with and without hardware acceleration turned on. Loading indicators are commonly-used UI elements, such as this one seen on facebook.com. These indicators hint at work being done on the server, while the user waits for a response. In the case shown here, the response would be to load additional results in the sidebar.

<figure class="w-figure">
  <img src="./fbsidebar.gif" alt="Facebook sidebar UI">
  <figcaption class="w-figcaption">Facebook sidebar UI shows a circular loader while loading additional content.</figcaption>
</figure>

When we open up DevTools, we can start to profile and really see the differences between a CPU and
GPU-accelerated animation experience.

<figure class="w-figure">
  <img src="./fbsidebar-perf.png" alt="Performance panel with paint flashing turned on">
  <figcaption class="w-figcaption">Left: Chromium 87. Right: Chromium 88, with hardware acceleration for SVG animations. See demo by Benoit Girard on <a href="https://jsfiddle.net/hydhaval/0pnot2sx/144/">JSFiddle</a>.</figcaption>
</figure>

You can see that on the left (Chromium 87), repaint occurs each time the spinner animates (which is
continuously). On the right there is no repainting (Chromium 88 and Firefox). We can test this in
the DevTools Rendering panel, when turning on Paint flashing.

<figure class="w-figure">
  <img src="./fbsidebar-perf2.png" alt="Performance panel showing rendering">
  <figcaption class="w-figcaption">Left: Chromium 87. Right: Chromium 88, with hardware acceleration for SVG animations. See demo by Benoit Girard on <a href="https://jsfiddle.net/hydhaval/0pnot2sx/144/">JSFiddle</a>.</figcaption>
</figure>

Taking a closer look at the Performance panel, you can again see this effect,
and how it affects the overall performance of your web property. You avoid
rendering and painting time completely for the animation, meaning smoother
animations and more performant applications. While Facebook won't be shipping
this SVG-based loader until browser support for hardware-accelerated SVG is
greater, it would allow for more flexibility in terms of theming, scaling and
resolution requirements, and easier maintenance.

Take a look at this more visually complex example:

<figure class="w-figure">
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/hardware-accel-animations/Kapture%202021-01-08%20at%2012.30.38.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">Left: Chromium 87. Right: Chromium 88, with hardware acceleration for SVG animations. Demo by <a href="">Chris Gannon</a> on <a href="https://codepen.io/chrisgannon/full/PzRWNO">Codepen</a>. </figcaption>
</figure>

Note the differences in paint flashing between Chromium 87 and 88. In Chromium 88, the entire SVG is
composited to one later, causing less jank. In Chromium 87, all of the layers are separated. Another
way to view the difference is through the FPS meter:

<figure class="w-figure">
  <img src="./gannon-ex.png" alt="Paint meter showing changes on animated demo">
  <figcaption class="w-figcaption">The FPS meter shows less GPU utilization in Chromium 87, and more utilization in 88. Demo by <a href="">Chris Gannon</a> on <a href="https://codepen.io/chrisgannon/full/PzRWNO">Codepen</a>. </figcaption>
</figure>

## Percentage animations

The Interactions team is also working on support for percentage transform animations, shipping in
Chromium 89. Percentage-based animations describe interactions that include percentage-based
movement. For example, you could scale something up by 20%, or slide a responsive sidebar menu from
off-screen using something like `translateX: -100%`. 

<video/gif of sliding animation>

These types of UI animations are relatively common, but currently do not take advantage of hardware
acceleration because previously we were unable to composite such animations. Percentages in
transforms depend on the box size (i.e. layout), but now, as long as the layout size is not changing
every frame, the browser can pre-calculate the absolute transform values and run them as if the
developer had provided pixel values. The good news is that the Chromium team is working on this
feature,  and soon, these types of animations will automatically get composited and
hardware-accelerated.

## What's coming next?

These updated animations will make web styling much smoother. And as mentioned above, the team is
always looking to see what upcoming web needs emerge. Right now, we're slated to convert
`background-color` and `clip-path` to automatically use hardware-acceleration in future versions of
Chromium.

`background-color` is a priority due to its high
[usage](https://chromestatus.com/metrics/css/timeline/animated/24) count for transitions and
effects, and `clip-path` enables much  more performant [transition
effects](https://transition.style/)  across the web. When performance meets interactivity, everyone
wins!

<figure class="w-figure">
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/hardware-accel-animations/Kapture%202021-01-07%20at%2017.55.00.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">Left: Chromium 87. Right: Chromium 88, with hardware acceleration for SVG animations. Demo by <a href="">Chris Gannon</a> on <a href="https://codepen.io/chrisgannon/full/PzRWNO">Codepen</a>. </figcaption>
</figure>


Cover Image: [Siora Photography](https://unsplash.com/photos/DhoCVkssJjs) for Unsplash.
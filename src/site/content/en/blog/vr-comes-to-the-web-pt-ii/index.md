---
title: Virtual reality comes to the web, part II
subhead: All about the frame loop
authors:
  - joemedley
date: 2020-02-13
hero: image/admin/2OEKtIp4RJNtX0stioZF.jpg
alt: A person using a virtual reality headset.
description:
  Virtual reality came to the web in Chrome 79. Based on the WebXR Device API,
  this launch is the foundation for both augmented and virtual reality. This
  article is the second in a series, focusing on the frame loop, the part of
  an XR session where images are shown to a viewer. Other browsers will soon be
  supporting the WebXR Device API, including Firefox Reality, Oculus Browser,
  Edge and Magic Leap's Helio browser, among others.
tags:
  - blog
  - augmented-reality
  - virtual-reality
  - webxr
---

Recently, I published [Virtual reality comes to the
web](/vr-comes-to-the-web/), an article that introduced basic
concepts behind the [WebXR Device
API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API). I
also provided instructions for requesting, entering, and ending an XR session.

This article describes the frame loop, which is a user-agent controlled
infinite loop in which content is repeatedly drawn to the screen. Content is
drawn in discrete blocks called frames. The succession of frames creates the
illusion of movement.

## What this article is not

WebGL and WebGL2 are the only means of rendering content during a frame loop in
a WebXR App. Fortunately many frameworks provide a layer of abstraction on top
of WebGL and WebGL2. Such frameworks include [three.js](https://threejs.org/),
[babylonjs](https://www.babylonjs.com/), and
[PlayCanvas](https://playcanvas.com/), while [A-Frame](https://aframe.io/) and
[React 360](https://facebook.github.io/react-360/) are designed for interacting
with WebXR.

This article is neither a WebGL nor a framework tutorial. It explains basics of
a frame loop using the Immersive Web Working Group's Immersive VR Session sample
([demo](https://immersive-web.github.io/webxr-samples/immersive-vr-session.html),
[source](https://github.com/immersive-web/webxr-samples/blob/master/immersive-vr-session.html)).
If you want to dive into WebGL or one of the frameworks, the internet provides a
growing list of articles.

## The players and the game

When trying to understand the frame loop, I kept getting lost in the details.
There's a lot of objects in play, and some of them are only named by reference
properties on other objects. To help you keep it straight, I'll describe the
objects, which I'm calling 'players'. Then I'll describe how they interact,
which I'm calling 'the game'.

## The players

### XRViewerPose

A pose is the position and orientation of something in 3D space. Both viewers
and input devices have a pose, but it's the viewer's pose we're concerned with
here. Both viewer and input device poses have a `transform` attribute describing
its position as a vector and its orientation as a quaternion relative to the
origin. The origin is specified based on the requested reference space type when
calling `XRSession.requestReferenceSpace()`.

Reference spaces take a bit to explain. I cover them in depth in [Augmented
reality](/web-ar/). The sample I'm using as the basis for this
article uses a `'local'` reference space which means the origin is at the
viewer's position at the time of session creation without a well-defined floor,
and its precise position may vary by platform.

### XRView

A view corresponds to a camera viewing the virtual scene. A view also has a
`transform` attribute describing it's position as a vector and its orientation.
These are provided both as a vector/quaternion pair and as an equivalent matrix,
you can use either representation depending on which best fits your code. Each
view corresponds to a display or a portion of a display used by a device to
present imagery to the viewer. `XRView` objects are returned in an array from
the `XRViewerPose` object. The number of views in the array varies. On mobile
devices an AR scene has one view, which may or may not cover the device screen.
Headsets typically have two views, one for each eye.

### XRWebGLLayer

Layers provide a source of bitmap images and descriptions of how those images
are to be rendered in the device. This description doesn't quite capture what
this player does. I've come to think of it as a middleman between a device and a
`WebGLRenderingContext`. MDN takes much the same view, stating that it 'provides
a linkage' between the two. As such, it provides access to the other players.

In general, WebGL objects store state information for rendering 2D and 3D
graphics.

### WebGLFramebuffer

A framebuffer provides image data to the `WebGLRenderingContext`. After
retrieving it from the `XRWebGLLayer`, you simply pass it to the current
`WebGLRenderingContext`. Other than calling `bindFramebuffer()` (more about that
later) you will never access this object directly. You will merely pass it from
the `XRWebGLLayer` to the WebGLRenderingContext.

### XRViewport

A viewport provides the coordinates and dimensions of a rectangular region in
the `WebGLFramebuffer`.

### WebGLRenderingContext

A rendering context is a programmatic access point for a canvas (the space we're
drawing on). To do this, it needs both a `WebGLFramebuffer` and an XRViewport.

Notice the relationship between `XRWebGLLayer` and `WebGLRenderingContext`. One
corresponds to the viewer's device and the other corresponds to the web page.
`WebGLFramebuffer` and `XRViewport` are passed from the former to the latter.

<figure class="w-figure">
  {% Img src="image/admin/ZdH8cIApe8jUr7F1WNgC.png", alt="The relationship between XRWebGLLayer and WebGLRenderingContext", width="711", height="94" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    The relationship between <code>XRWebGLLayer</code> and <code>WebGLRenderingContext</code>
  </figcaption>
</figure>

## The game

Now that we know who the players are, let's look at the game they play. It's a
game that starts over with every frame. Recall that frames are part of a [frame
loop](/vr-comes-to-the-web/#running-a-frame-loop) that happens at
a rate that depends on the underlying hardware. For VR applications the frames
per second can be anywhere from 60 to 144. AR for Android runs at 30 frames per
second. Your code should not assume any particular frame rate.

The basic process for the frame loop looks like this:

<ol>
  <li>Call <code>XRSession.requestAnimationFrame()</code>. In response, the user agent invokes the <code>XRFrameRequestCallback</code>, which is defined by you.</li>
  <li>Inside your callback function:
    <ol>
      <li>Call <code>XRSession.requestAnimationFrame()</code> again.</li>
      <li>Get the viewer's pose.</li>
      <li>Pass ('bind') the <code>WebGLFramebuffer</code> from the <code>XRWebGLLayer</code> to the <code>WebGLRenderingContext</code>.</li>
      <li>Iterate over each <code>XRView</code> object, retrieving its <code>XRViewport</code> from the <code>XRWebGLLayer</code> and passing it to the <code>WebGLRenderingContext</code>.</li>
      <li>Draw something to the framebuffer.</li>
    </ol>
  </li>
</ol>

Because steps 1 and 2a were covered in the previous article, I'll start at step
2b.

### Get the viewer's pose

It probably goes without saying. To draw anything in AR or VR, I need to know
where the viewer is and where they're looking. The viewer's position and
orientation are provided by an [XRViewerPose
object](https://developer.mozilla.org/en-US/docs/Web/API/XRViewerPose). I
get the viewer's pose by calling `XRFrame.getViewerPose()` on the current
animation frame. I pass it the reference space I acquired when I set up the
session. The values returned by this object are always relative to the reference
space I requested when I [entered the current
session](/vr-comes-to-the-web/#entering-a-session). As you may
recall, I have to pass the current reference space when requesting the pose.

```js/3-4
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);
  if (xrViewerPose) {
    // Render based on the pose.
  }
}
```

There's one viewer pose that represents the user's overall position, meaning
either the viewer's head or the the phone camera in the case of a smartphone.
The pose tells your application where the viewer is. Actual image rendering uses
`XRView` objects, which I'll get to in a bit.

Before moving on, I test whether the viewer pose was returned in case the system
loses tracking or blocks the pose for privacy reasons. Tracking is the XR
device's ability to know where it and/or it's input devices are relative to the
environment. Tracking can be lost in several ways, and varies depending on the
method used for tracking. For example, if cameras on the headset or phone are
used for tracking the device may lose its ability to determine where it is in
situations with low or no light, or if the cameras are covered.

An example of blocking the pose for privacy reasons is if the headset is showing
a security dialog such as a permission prompt, the browser may stop providing
poses to the application while this is happening. But I"ve already called
`XRSession.requestAnimationFrame()` so that if the system can recover, the frame
loop will continue. If not, the user agent will end the session and call the
`end` event handler.

### A short detour

The next step requires objects created during [session
set-up](/vr-comes-to-the-web/#requesting-a-session). Recall that
I created a canvas and instructed it to create an XR-compatible Web GL rendering
context, which I got by calling `canvas.getContext()`. All drawing is done using
the WebGL API, the WebGL2 API, or a WebGL-based framework such as Three.js. This
context was passed to the session object via `updateRenderState()`, along with a
new instance of `XRWebGLLayer`.

```js
let canvas = document.createElement('canvas');
// The rendering context must be based on WebGL or WebGL2
let webGLRenContext = canvas.getContext('webgl', { xrCompatible: true });
xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession, webGLRenContext)
  });

```

### Pass ('bind') the WebGLFramebuffer

The `XRWebGLLayer` provides a framebuffer for the `WebGLRenderingContext`
provided specifically for use with WebXR and replacing the rendering contexts
default framebuffer. This is called 'binding' in the language of WebGL.

```js/5-6
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);
  if (xrViewerPose) {
    let glLayer = xrSession.renderState.baseLayer;
    webGLRenContext.bindFramebuffer(webGLRenContext.FRAMEBUFFER, glLayer.framebuffer);
    // Iterate over the views
  }
}
```
### Iterate over each XRView object

After getting the pose and binding the framebuffer, it's time to get the
viewports. The `XRViewerPose` contains an array of XRView interfaces each of
which represents a display or a portion of a display. They contain information
that's needed to render content that's correctly positioned for the device and
the viewer such as the field of view, eye offset, and other optical properties.
Since I'm drawing for two eyes, I have two views, which I loop through and draw
a separate image for each.

When implementing for phone-based augmented reality, I would have only one view
but I'd still use a loop. Though it may seem pointless to iterate through one
view, doing so allows you to have a single rendering path for a spectrum of
immersive experiences. This is an important difference between WebXR and other
immersive systems.

```js/7-9
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);
  if (xrViewerPose) {
    let glLayer = xrSession.renderState.baseLayer;
    webGLRenContext.bindFramebuffer(webGLRenContext.FRAMEBUFFER, glLayer.framebuffer);
    for (let xrView of xrViewerPose.views) {
      // Pass viewports to the context
    }
  }
}
```
### Pass the XRViewport object to the WebGLRenderingContext

An `XRView` object refers to what's observable on a screen. But to draw to that
view I need coordinates and dimensions that are specific to my device. As with
the framebuffer, I request them from the `XRWebGLLayer` and pass them to the
`WebGLRenderingContext`.

```js/7-9
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);
  if (xrViewerPose) {
    let glLayer = xrSession.renderState.baseLayer;
    webGLRenContext.bindFramebuffer(webGLRenContext.FRAMEBUFFER, glLayer.framebuffer);
    for (let xrView of xrViewerPose.views) {
      let viewport = glLayer.getViewport(xrView);
      webGLRenContext.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      // Draw something to the framebuffer
    }
  }
}
```

#### The webGLRenContext

In writing this article I had a debate with a few collegues over the naming of
the `webGLRenContext` object. The sample scripts and most WebXR code simpley
calls this variable `gl`. When I was working to understand the samples, I kept
forgetting what `gl` referred to. I've called it `webGLRenContext` to remind you
while your learning that this is an instance of `WebGLRenderingContext`.

The reason is that using `gl` allows method names to look like their
counterparts in the OpenGL ES 2.0 API, used for creating VR in compiled
languages. This fact is obvious if you've written VR apps using OpenGL, but
confusing if you're completely new to this technology.

### Draw something to the framebuffer

If you're feeling really ambitious, you can use WebGL directly, but I don't
recommend that. It's much simpler to use one of the frameworks [listed at the
top](#what-this-article-is-not).

## Conclusion

This is not the end of WebXR updates or articles. You can find a [reference for
all of WebXR's interfaces and
members](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
at MDN. For upcoming enhancements to the interfaces themselves, follow
individual features on [Chrome
Status](https://www.chromestatus.com/features#WebXR).


Photo by [JESHOOTS.COM](https://unsplash.com/@jeshoots) on [Unsplash](https://unsplash.com/)

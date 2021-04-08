---
title: Virtual reality comes to the web
subhead: A few basics to prepare you for a spectrum of immersive experiences&#58; virtual reality, augmented reality, and everything in between.
authors:
  - joemedley
date: 2019-10-31
updated: 2020-03-02
hero: image/admin/5TAFoyhWvniJzDchNzPT.jpg
alt: A person using a virtual reality headset.
description:
  Virtual reality came to the web in Chrome 79. Based on the WebXR Devicer API,
  this launch is the foundation for both augmented and virtual reality. This
  article is the first in a series, exploring basic concepts and describing how
  to enter an XR session. Other browsers will soon be supporting the WebXR
  Device API, including Firefox Reality, Oculus Browser, Edge and Magic Leap's
  Helio browser, among others.
tags:
  - blog
  - augmented-reality
  - virtual-reality
  - webxr
feedback:
  - api
---

Immersive experiences came to the web in Chrome 79. The WebXR Device API brings
virtual reality brought virtual reality, while support for augmented reality
arrives in Chrome 81. While an update to the GamePad API extends the advanced
use of controlls to VR. Other browsers will be supporting these specs soon,
including Firefox Reality, Oculus Browser, Edge and Magic Leap's Helio browser,
among others.

This article begins a series on the immersive web. This installment covers
setting up a basic WebXR application as well as entering and exiting an XR
session. Later articles will cover the frame loop (the workhorse of WebXR
experience), the specifics of augmented reality, and the WebXR Hit Test API, a
means of detecting surfaces in an AR session. Unless stated otherwise,
everything I cover in this and succeeding articles applies equally to both AR
and VR.

## What is the immersive web?

Though we use two terms to describe immersive experiences&mdash;augmented
reality and virtual reality&mdash;many think of them on a spectrum from complete
reality to completely virtual, with degrees of immersion in between. The 'X' in
XR is intended to reflect that thinking by being a sort of algebraic variable
that stands for anything in the spectrum of immersive experiences.

<figure class="w-figure">
  {% Img src="image/admin/iQ99APUTFIgjdRPyS1C4.png", alt="A graph illustrating the spectrum of visual experiences from complete reality to completely immersive.", width="800", height="204" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    The spectrum of immersive experiences
  </figcaption>
</figure

Examples of immersive experiences include:

* Games
* 360° videos
* Traditional 2D (or 3D) videos presented in immersive surroundings
* Home buying
* Viewing products in your home before you buy them
* Immersive art
* Something cool nobody's thought of yet

## Concepts and usage

I'll explain a few basics of using the WebXR Device API. If you need more depth
than I've provided, check out the Immersive Web Working Group's [WebXR
samples](https://immersive-web.github.io/webxr-samples/) or [MDN's growing
reference
materials](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API).
If you're familiar with early versions of the WebXR Device API, you should
glance over all of this material. There have been changes.

The code in this article is based on the Immersive Web Working Group's barebones
sample ([demo](https://immersive-web.github.io/webxr-samples/vr-barebones.html),
[source](https://github.com/immersive-web/webxr-samples/blob/master/vr-barebones.html)),
but is edited for clarity and simplicity.

Part of creating the WebXR specification has been fleshing out security and
privacy measures to protect users. Consequently, implementations must adhere to
certain requirements. A web page or app must be active and focused before it can
request anything sensitive from the viewer. Web pages or apps must be served
over HTTPS. The API itself is designed to protect information obtained from
sensors and cameras, which it needs in order to function.

### Request a session

Entering an XR session requires a user gesture. To get that, use feature
detection to test for `XRSystem` (via `navigator.xr`) and make a call to
`XRSystem.isSessionSupported()`. Be aware that in Chrome versions 79 and 80 the
`XRSystem` object was called `XR`.

In the example below, I've indicated that I
want a virtual reality session with the `'immersive-vr'` session type. The
[other session
types](https://developer.mozilla.org/en-US/docs/Web/API/XR/isSessionSupported#Syntax)
are `'immersive-ar'` and `'inline'`. An inline session is for presenting content
within HTML and is mainly used for teaser content. The [Immersive AR
Session](https://immersive-web.github.io/webxr-samples/immersive-ar-session.html)
sample demonstrates this. I'll explain that in a later article.

Once I know that virtual reality sessions are supported, I enable a button that
lets me acquire a user gesture.

```js
if (navigator.xr) {
  const supported = await navigator.xr.isSessionSupported('immersive-vr');
  if (supported) {
    xrButton.addEventListener('click', onButtonClicked);
    xrButton.textContent = 'Enter VR';
    xrButton.enabled = supported; // supported is Boolean
  }
}
```

After enabling the button, I wait for a click event then request a session.

```js
let xrSession = null;
function onButtonClicked() {
  if (!xrSession) {
    navigator.xr.requestSession('immersive-vr')
    .then((session) => {
      xrSession = session;
      xrButton.textContent = 'Exit XR';
      onSessionStarted(xrSession);
    });
  } else {
    xrSession.end();
  }
}
```

Notice the object hierarchy in this code. It moves from `navigator` to `xr` to
an `XRSession` instance. In early versions of the API, a script had to request a
device before requesting a session. Now, the device is acquired implicitly.

### Enter a session

After getting a session, I need to start it and enter it. But first, I need to
set up a few things. A session needs an `onend` event handler so that the app or
web page can be reset when the user exits.

I'll also need a `<canvas>` element to draw my scene on. It needs to be an
XR-compatible
[WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext)
or
[WebGL2RenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext).
All drawing is done using them or a WebGL-based framework such as
[Three.js](https://threejs.org/).

Now that I have a place to draw, I need a source of content to draw on
it. For that, I create an instance of `XRWebGLLayer`. I associate it with the
canvas by calling `XRSession.updateRenderState()`.

Once I'm in a session, I need a way of determining where things are in virtual
reality. I'll need a reference space. A `'local-floor'` reference space is one
where the origin is located near the viewer and the y-axis is 0 at floor level
and is not expected to move. There are [other types of reference
spaces](https://developer.mozilla.org/en-US/docs/Web/API/XRSession/requestReferenceSpace),
but that is a more complicated topic than I can go into here. I save the
reference space to a variable because I'll need it when I draw to the screen.

```js
function onSessionStarted(xrSession) {
  xrSession.addEventListener('end', onSessionEnded);

  let canvas = document.createElement('canvas');
  webGLRenContext = canvas.getContext('webgl', { xrCompatible: true });

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession, webGLRenContext)
  });

  xrSession.requestReferenceSpace('local-floor')
  .then((refSpace) => {
    xrRefSpace = refSpace;
    xrSession.requestAnimationFrame(onXRFrame);
  });
}
```

After getting a reference space, I call `XRSession.requestAnimationFrame()`.
This is the start of presenting virtual content, which is done in the frame
loop.

### Run a frame loop

The frame loop is a user-agent controlled infinite loop in which content is
repeatedly drawn to the screen. Content is drawn in discrete blocks called
frames. The succession of frames creates the illusion of movement. For VR
applications the frames per second can be anywhere from 60 to 144. AR for
Android runs at 30 frames per second. Your code should not assume any particular
frame rate.

The basic process for the frame loop is:

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

The remainder of this article describes step 1 and part of step 2,  setting up
and calling the `XRFrameRequestCallback`. The remaining items of step 2 are
covered in part II.

#### The XRFrameRequestCallback

The `XRFrameRequestCallback` is defined by you. It takes two parameters: a
`DOMHighResTimeStamp` and an `XRFrame` instance. The `XRFrame` object provides
the information needed to render a single frame to the display. The
`DOMHighResTimeStamp` argument is for future use.

Before doing anything else, I'm going to request the next animation frame. As
previously stated, the timing of frames is determined by the user agent based on
the underlying hardware. Requesting the next frame first ensures that
the frame loop continues if something during the callback throws an error.

```js
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  // Render a frame.
}
```

At this point, it's time to draw something for the viewer. That's a discussion
for part II. Before going there, let me show you how to end a session.

### End the session

An immersive session may end for several reasons including ending by your own
code through a call to `XRSession.end()`. Other causes include the headset being
disconnected or another application taking control of it. This is why a
well-behaved application should monitor the `end` event. When it occurs, discard
the session and its related render objects. An ended immersive session cannot be
resumed. To reenter the immersive experience, my app needs to start a new
session.

Recall from [Entering a session](#entering-a-session) that during setup, I added
an `onend` event handler.

```js
function onSessionStarted(xrSession) {
  xrSession.addEventListener('end', onSessionEnded);
  // More setup…
}
```

Inside the event handler, restore the state of the app before the user entered a
session.

```js
function onSessionEnded(event) {
  xrSession = null;
  xrButton.textContent = 'Enter VR';
}
```

## Conclusion

I haven't explained everthing you need to write a Web XR or AR application.
Hopefull, I've give  you enought to start making sense of the code for yourself,
and enough to start experimenting. In the next article, I'll explain the frame
loop, which is where content is drawn to the screen.

Photo by [JESHOOTS.COM](https://unsplash.com/@jeshoots) on [Unsplash](https://unsplash.com/)

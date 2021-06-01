---
title: "Augmented reality: You may already know it"
subhead: If you've used the WebXR Device API already, you're most of the way there.
authors:
  - joemedley
date: 2020-02-13
hero: image/admin/VMTT5zbuFgXWfTj7Hlvv.jpg
alt: A person using augmented reality with a smartphone.
description:
  If you've already used the WebXR Device API, you'll be happy to know there's
  very little new to learn. Entering a WebXR session is largely the same.
  Running a frame loop is largely the same. The differences lie in
  configurations that allow content to be shown appropriately for augmented
  reality.
tags:
  - blog
  - augmented-reality
  - virtual-reality
  - webxr
feedback:
  - api
---

The WebXR Device API shipped last fall in Chrome 79. As stated then, Chrome's
implementation of the API is a work in progress. Chrome is happy to announce
that some of the work is finished. In Chrome 81, two new features have arrived:

* [Augmented reality session types](https://www.chromestatus.com/feature/5450241148977152).
* [Hit testing](https://www.chromestatus.com/feature/4755348300759040).

This article covers augmented reality. If you've already used the WebXR Device
API, you'll be happy to know there's very little new to learn. Entering a WebXR
session is largely the same. Running a frame loop is largely the same. The
differences lie in configurations that allow content to be shown appropriately
for augmented reality. If you're not familiar with the basic concepts of WebXR,
you should read my earlier posts on the WebXR Device API, or at least be
familiar with the topics covered therein. You should know how to [request and
enter a session](/vr-comes-to-the-web/) and you should know how
to run [a frame loop](/vr-comes-to-the-web-pt-ii).

For information on hit testing, see the companion article [Positioning virtual
objects in real-world views](/ar-hit-test). The code in this
article is based on the Immersive AR Session sample
([demo](https://immersive-web.github.io/webxr-samples/immersive-ar-session.html)
[source](https://github.com/immersive-web/webxr-samples/blob/master/immersive-vr-session.html)) from
the Immersive Web Working Group's [WebXR Device API
samples](https://immersive-web.github.io/webxr-samples/).

Before diving into the code you should use the [Immersive AR Session
sample](https://immersive-web.github.io/webxr-samples/immersive-ar-session.html)
at least once. You'll need a modern Android phone with Chrome 81 or later.

## What's it useful for?

Augmented reality will be a valuable addition to a lot of existing or new web
pages by allowing them to implement AR use cases without leaving the browser.
For example, it can help people learn on education sites, and allow potential
buyers to visualize objects in their home while shopping.

Consider the second use case. Imagine simulating placing a life-size
representation of a virtual object in a real scene. Once placed, the image stays
on the selected surface, appears the size it would be if the actual item were on
that surface, and allows the user to move around it as well as closer to it or
farther from it. This gives viewers a deeper understanding of the object than is
possible with a two dimensional image.

I'm getting a little ahead of myself. To actually do what I've described, you
need AR functionality and some means of detecting surfaces. This article covers
the former. The accompanying article on the WebXR Hit Test API (linked to above)
covers the latter.

## Requesting a session

Requesting a session is very much like what you've seen before. First find out
if the session type you want is available on the current device by calling
`xr.isSessionSupported()`. Instead of requesting `'immersive-vr'` as before,
request `'immersive-ar'`.

```js/1
if (navigator.xr) {
  const supported = await navigator.xr.isSessionSupported('immersive-ar');
  if (supported) {
    xrButton.addEventListener('click', onButtonClicked);
    xrButton.textContent = 'Enter AR';
    xrButton.enabled = supported; // supported is Boolean
  }
}
```

As before, this enables an 'Enter AR' button. When the user clicks it, call
`xr.requestSession()`, also passing `'immersive-ar'`.

```js/3,6
let xrSession = null;
function onButtonClicked() {
  if (!xrSession) {
    navigator.xr.requestSession('immersive-ar')
    .then((session) => {
      xrSession = session;
      xrSession.isImmersive = true;
      xrButton.textContent = 'Exit AR';
      onSessionStarted(xrSession);
    });
  } else {
    xrSession.end();
  }
}
```

### A convenience property

You've probably noticed that I highlighted two lines in the last code sample.
The `XRSession` object would seem to have a property called `isImmersive`. This
is a convenience property I've created myself, and not part of the spec. I'll
use it later to make decisions about what to show the viewer. Why isn't this
property part of the API? Because your app may need to track this property
differently so the spec authors decided to keep the API clean.

## Entering a session

Recall what `onSessionStarted()` looked like in my earlier article:

```js
function onSessionStarted(xrSession) {
  xrSession.addEventListener('end', onSessionEnded);

  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { xrCompatible: true });

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl)
  });

  xrSession.requestReferenceSpace('local-floor')
  .then((refSpace) => {
    xrRefSpace = refSpace;
    xrSession.requestAnimationFrame(onXRFrame);
  });
}
```

I need to add a few things to account for rendering augmented reality. Turn off
the background First, I'm going to determine whether I need the background. This
is the first place I'm going to use my convenience property.

```js/3-5
function onSessionStarted(xrSession) {
  xrSession.addEventListener('end', onSessionEnded);

  if (session.isImmersive) {
    removeBackground();
  }

  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { xrCompatible: true });

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl)
  });

  refSpaceType = xrSession.isImmersive ? 'local' : 'viewer';
  xrSession.requestReferenceSpace(refSpaceType).then((refSpace) => {
    xrSession.requestAnimationFrame(onXRFrame);
  });

}
```

### Reference spaces

My earlier articles skimmed over reference spaces. The sample I'm describing
uses two of them, so it's time to correct that omission.

{% Aside %}
  A full explanation of reference spaces would be longer than I can provide
  here. I'm only going to discuss reference spaces in regards to augmented
  reality.
{% endAside %}

A reference space describes the relationship between the virtual world and the
user's physical environment. It does this by:

* Specifying the origin for the coordinate system used for expressing positions
  in the virtual world.
* Specifying whether the user is expected to move within that coordinate system.
* Whether that coordinate system has pre-established boundaries. (The examples
  shown here do not use coordinate systems with pre-established boundaries.)

For all reference spaces, the X coordinate expresses left and right, the Y
expresses up and down, and Z expresses forward and backward. Positive values are
right, up, and backward, respectively.

The coordinates returned by `XRFrame.getViewerPose()` depend on the requested
[reference space
type](https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace#Reference_space_types).
More about that when we get to the frame loop. Right now we need to select a
reference type that's appropriate for augmented reality. Again, this uses my
convenience property.

```js/0,14-15
let refSpaceType
function onSessionStarted(xrSession) {
  xrSession.addEventListener('end', onSessionEnded);

  if (session.isImmersive) {
    removeBackground();
  }

  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { xrCompatible: true });

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl)
  });

  refSpaceType = xrSession.isImmersive ? 'local' : 'viewer';
  xrSession.requestReferenceSpace(refSpaceType).then((refSpace) => {
    xrSession.requestAnimationFrame(onXRFrame);
  });
}
```

If you've visited the [Immersive AR Session
Sample](https://immersive-web.github.io/webxr-samples/immersive-ar-session.html)
you'll notice that initially the scene is static and not at all augmented
reality. You can drag and swipe with your finger to move around the scene. If
you click "START AR", the background drops out and you can move around the scene
by moving the device. The modes use different reference space types. The
highlighted text above shows how this is selected. It uses the following
reference types:

`local` - The origin is at the viewer's position at the time of session
creation. This means the experience doesn't necessarily have a well-defined
floor and the exact position of the origin may vary by platform. Though there
are no pre-established boundaries to the space, it's expected that content can
be viewed with no movement other than rotation. As you can see from our own AR
example, some movement within the space may be possible.

`viewer` - Used most frequently for content presented inline in the page, this
space follows the viewing device. When passed to getViewerPose it provides no
tracking, and thus always reports a pose at the origin unless the application
modifies it with `XRReferenceSpace.getOffsetReferenceSpace()`. The sample uses
this to enable touch-based panning of the camera.

## Running a frame loop

Conceptually, nothing changes from what I did in the VR session described in my
earlier articles. Pass the reference space type to `XRFrame.getViewerPose()`.
The returned `XRViewerPose` will be for the current reference space type. Using
`viewer` as the default allows a page to show content previews before user
consent is requested for AR or VR. This illustrates an important point: the
inline content uses the same frame loop as the immersive content, cutting down
the amount of code that needs to be maintained.

```js/3
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(refSpaceType);
  if (xrViewerPose) {
    // Render based on the pose.
  }
}
```

## Conclusion

This series of articles only covers the basics of implementing immersive content
on the web. Many more capabilities and use cases are presented by the Immersive
Web Working Group's [WebXR Device API
samples](https://immersive-web.github.io/webxr-samples/). We've also just
published a [hit test article](/ar-hit-test/) which explains an API
for detecting surfaces and placing virtual items in a real-world camera view.
Check them out and watch The web.dev blog for more
articles in the year to come.

Photo by [David Grandmougin](https://unsplash.com/@davidgrdm) on [Unsplash](https://unsplash.com/)

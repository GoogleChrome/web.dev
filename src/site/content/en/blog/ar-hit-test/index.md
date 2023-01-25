---
title: Positioning virtual objects in real-world views
subhead: The Hit Test API lets you position virtual items in a real-world view.
authors:
  - joemedley
date: 2020-02-13
updated: 2020-06-04
hero: image/admin/7wUhOX8bWoohQObJO6lL.jpg
alt: A virtual object in a real-world view.
description:
  The WebXR Hit Test API is an enhancement to the web's augmented reality that
  lets you place virtual objects in a real-world view.
tags:
  - blog
  - augmented-reality
  - hit-test
  - virtual-reality
  - webxr
---

The WebXR Device API shipped last fall in Chrome 79. As stated then, Chrome's
implementation of the API is a work in progress. Chrome is happy to announce
that some of the work is finished. In Chrome 81, two new features have arrived:

* [Augmented reality session types](https://www.chromestatus.com/feature/5450241148977152)
* [Hit testing](https://www.chromestatus.com/feature/4755348300759040)

This article covers the [WebXR Hit Test
API](https://github.com/immersive-web/hit-test/blob/master/hit-testing-explainer.md), a
means of placing virtual objects in a real-world camera view.

In this article I assume you already know how to create an augmented reality
session and that you know how to run a frame loop. If you're not familiar with
these concepts, you should read the earlier articles in this series.

* [Virtual reality comes to the web](/vr-comes-to-the-web/)
* [Virtual reality comes to the web, part II](/vr-comes-to-the-web-pt-ii/)
* [Web AR: you may already know how to use it](/web-ar)

## The immersive AR session sample

The code in this article is based on, but not identical to, that found in the
Immersive Web Working Group's Hit Test sample
([demo](https://immersive-web.github.io/webxr-samples/hit-test.html),
[source](https://github.com/immersive-web/webxr-samples/blob/master/hit-test.html)).
This example lets you place virtual sunflowers on surfaces in the real world.

When you first open the app, you'll see a blue circle with a dot in the middle.
The dot is the intersection between an imaginary line from your device to the
point in the environment. It moves as you move the device. As it finds
intersection points, it appears to snap to surfaces such as floors, table tops,
and walls. It does this because hit testing provides the position and
orientation of the intersection point, but nothing about the surfaces
themselves.

{% Aside %}
  A reminder for those of you are new: in the WebXR device API "position and
  orientation" are covered by the term pose. I will be using that term from here
  on.
{% endAside %}

This circle is called a _reticle_, which is a temporary image that aids in
placing an object in augmented reality. If you tap the screen, a sunflower is
placed on the surface at the reticle location and orientation of the reticle
point, regardless of where you tapped the screen. The reticle continues to move
with your device.

<figure class="w-figure  w-figure--right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/42fbB0q2WTa9ytTm8NZN.png", alt="A reticle rendered on a wall, Lax, or Strict depending on their context", width="800", height="1422", style="max-width: 60vw;" %}
  <figcaption class="w-figcaption">
    The reticle is a temporary image that aids in placing an object in augmented reality.
  </figcaption>
</figure>

## Create the reticle

You must create the reticle image yourself since it is not provided by the
browser or the API. The method of loading and drawing it is framework specific.
If you're not drawing it directly using WebGL or WebGL2 consult your framework
documentation. For this reason, I won't go into detail about how the reticle is
drawn in the sample. Below I show one line of it for one reason only: so that in
later code samples, you'll know what I'm referring to when I use the `reticle`
variable.

```js
let reticle = new Gltf2Node({url: 'media/gltf/reticle/reticle.gltf'});
```
## Request a session

When requesting a session, you must request `'hit-test'` in the
`requiredFeatures` array as shown below.

```js
navigator.xr.requestSession('immersive-ar', {
  requiredFeatures: ['local', 'hit-test']
})
.then((session) => {
  // Do something with the session
});
```
## Entering a session

In previous articles I've presented code for entering an XR session. I've shown
a version of this below with some additions. First I've added the `select` event
listener. When the user taps the screen, a flower will be placed in the camera
view based on the pose of the reticle. I'll describe that event listener later.

```js/2,11-23
function onSessionStarted(xrSession) {
  xrSession.addEventListener('end', onSessionEnded);
  xrSession.addEventListener('select', onSelect);

  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { xrCompatible: true });

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl)
  });

  xrSession.requestReferenceSpace('viewer').then((refSpace) => {
    xrViewerSpace = refSpace;
    xrSession.requestHitTestSource({ space: xrViewerSpace })
    .then((hitTestSource) => {
      xrHitTestSource = hitTestSource;
    });
  });

  xrSession.requestReferenceSpace('local').then((refSpace) => {
    xrRefSpace = refSpace;
    xrSession.requestAnimationFrame(onXRFrame);
  });
}
```
### Multiple reference spaces

Notice that the highlighted code calls `XRSession.requestReferenceSpace()`
twice. I initially found this confusing. I asked why does the hit test code not
request an animation frame (starting the frame loop) and why does the frame loop
seem to not involve hit tests. The source of the confusion was a
misunderstanding of reference spaces. Reference spaces express relationships
between an origin and the world.

To understand what this code is doing, pretend that you're viewing this sample
using a standalone rig, and you have both a headset and a controller. To measure
distances from the controller, you would use a controller-centered frame of
reference. But to draw something to the screen you would use user-centered
coordinates.

In this sample, the viewer and the controller are the same device. But I have a
problem. What I draw must be stable with regard to the environment, but the
'controller' I'm drawing with is moving.

For image drawing, I use the `local` reference space, which gives me stability
in terms of the environment. After getting this I start the frame loop by
calling `requestAnimationFrame()`.

For hit testing, I use the `viewer` reference space, which is based on the
device's pose at the time of the hit test. The label 'viewer' is somewhat
confusing in this context because I'm talking about a controller. It makes sense
if you think of the controller as an electronic viewer. After getting this, I
call `xrSession.requestHitTestSource()`, which creates the source of hit test
data that I'll use when drawing.

## Running a frame loop

The `requestAnimationFrame()` callback also gets new code to handle hit testing.

As you move your device, the reticle needs to move with it as it tries to find
surfaces. To create the illusion of movement, redraw the reticle in every frame.
But don't show the reticle if the hit test fails. So, for the reticle I created
earlier, I set it's `visible` property to `false`.

```js/5
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);

  reticle.visible = false;

  // Reminder: the hitTestSource was acquired during onSessionStart()
  if (xrHitTestSource && xrViewerPose) {
    let hitTestResults = xrFrame.getHitTestResults(xrHitTestSource);
    if (hitTestResults.length > 0) {
      let pose = hitTestResults[0].getPose(xrRefSpace);
      reticle.visible = true;
      reticle.matrix = pose.transform.matrix;
    }
  }

  // Draw to the screen
}

```
To draw anything in AR, I need to know where the viewer is and where they're
looking. So I test that `hitTestSource` and the `xrViewerPose` are still valid.

```js/3,8
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);

  reticle.visible = false;

  // Reminder: the hitTestSource was acquired during onSessionStart()
  if (xrHitTestSource && xrViewerPose) {
    let hitTestResults = xrFrame.getHitTestResults(xrHitTestSource);
    if (hitTestResults.length > 0) {
      let pose = hitTestResults[0].getPose(xrRefSpace);
      reticle.visible = true;
      reticle.matrix = pose.transform.matrix;
    }
  }

  // Draw to the screen
}

```

Now I call `getHitTestResults()`. It takes the `hitTestSource` as an argument
and returns an array of `HitTestResult` instances. The hit test may find
multiple surfaces. The first one in the array is the one closest to the camera.
Most of the time you will use it, but an array is returned for advanced use
cases. For example, imagine your camera is pointed at a box on a table on a
floor. It's possible that the hit test will return all three surfaces in the
array. In most cases, it will be the box that I care about. If the length of the
returned array is 0, in other words, if no hit test is returned, continue
onward. Try again in the next frame.

```js/9-10
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);

  reticle.visible = false;

  // Reminder: the hitTestSource was acquired during onSessionStart()
  if (xrHitTestSource && xrViewerPose) {
    let hitTestResults = xrFrame.getHitTestResults(xrHitTestSource);
    if (hitTestResults.length > 0) {
      let pose = hitTestResults[0].getPose(xrRefSpace);
      reticle.visible = true;
      reticle.matrix = pose.transform.matrix;
    }
  }

  // Draw to the screen
}

```

Finally, I need to process the hit test results. The basic process is this. Get
a pose from the hit test result, transform (move) the reticle image to the hit
test position, then set its `visible` property to true.  The pose represents the
pose of a point on a surface.

```js
function onXRFrame(hrTime, xrFrame) {
  let xrSession = xrFrame.session;
  xrSession.requestAnimationFrame(onXRFrame);
  let xrViewerPose = xrFrame.getViewerPose(xrRefSpace);

  reticle.visible = false;

  // Reminder: the hitTestSource was acquired during onSessionStart()
  if (xrHitTestSource && xrViewerPose) {
    let hitTestResults = xrFrame.getHitTestResults(xrHitTestSource);
    if (hitTestResults.length > 0) {
      let pose = hitTestResults[0].getPose(xrRefSpace);
      reticle.matrix = pose.transform.matrix;
      reticle.visible = true;

    }
  }

  // Draw to the screen
}

```
## Placing an object

An object is placed in AR when the user taps the screen. I already added a
`select` event handler to the session. ([See above](#entering-a-session).)

The important thing in this step is knowing where to place it. Since the moving
reticle gives you a constant source of hit tests, the simplest way to place an
object is to draw it at the location of the reticle at the last hit test.

```js
function onSelect(event) {
  if (reticle.visible) {
    // The reticle should already be positioned at the latest hit point,
    // so we can just use its matrix to save an unnecessary call to
    // event.frame.getHitTestResults.
    addARObjectAt(reticle.matrix);
  }
}
```
## Conclusion

The best way to get a handle on this is to step through the [sample
code](https://immersive-web.github.io/webxr-samples/immersive-ar-session.html) or
try out the
[codelab](https://codelabs.developers.google.com/codelabs/ar-with-webxr). I hope
I've given you enough background to make sense of both.

We're not done building immersive web APIs, not by a long shot. We'll publish
new articles here as we make progress.

Photo by [Daniel Frank](https://unsplash.com/@fr3nks) on [Unsplash](https://unsplash.com/)

---
title: Control camera pan, tilt, and zoom
subhead:
  Pan, tilt, and zoom features on cameras are finally controllable on the web.
authors:
  - beaufortfrancois
date: 2020-10-05
updated: 2021-03-22
hero: image/admin/wbcUb7ooaR1nCeYnSiCV.jpg
thumbnail: image/admin/eBugU3Spjq9df1qb5l0b.jpg
alt: Five persons in a conference room photo.
description: |
  Pan, tilt, and zoom features on cameras are finally controllable on the web.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - media
feedback:
  - api
---

Room-scale video conferencing solutions deploy cameras with pan, tilt, and zoom
(PTZ) capabilities so that software can point the camera at meeting
participants. Starting in Chrome&nbsp;87, the pan, tilt, and zoom features on
cameras are available to websites using media track constraints in
`MediaDevices.getUserMedia()` and `MediaStreamTrack.applyConstraints()`.

## Using the API {: #use }

### Feature detection {: #feature-detection }

Feature detection for hardware is different from what you're probably used to.
The presence of `"pan"`, `"tilt"`, and `"zoom"` constraint names in
`navigator.mediaDevices.getSupportedConstraints()` tells you that the browser
supports the API to control camera PTZ, but not whether the camera hardware
supports it. As of Chrome&nbsp;87, controlling camera PTZ is supported on
desktop, while Android still supports zoom only.

```js
const supports = navigator.mediaDevices.getSupportedConstraints();
if (supports.pan && supports.tilt && supports.zoom) {
  // Browser supports camera PTZ.
}
```

### Request camera PTZ access {: #request }

A website is allowed to control camera PTZ only if the user has explicitly
granted the camera with PTZ permission through a prompt.

To request camera PTZ access, call `navigator.mediaDevices.getUserMedia()` with
the PTZ constraints as shown below. This will prompt the user to grant both
regular camera and camera with PTZ permissions.

<figure class="w-figure">
  {% Img src="image/admin/WmkzmVeiplCoh3HesJS5.jpg", alt="Screenshot of a camera PTZ user prompt in Chrome for macOS.", width="800", height="382", class="w-screenshot" %}
  <figcaption class="w-figcaption">Camera PTZ user prompt.</figcaption>
</figure>

The returned promise will resolve with a [`MediaStream`] object used to show the
camera video stream to the user. If the camera does not support PTZ, the user
will get a regular camera prompt.

```js
try {
  // User is prompted to grant both camera and PTZ access in a single call.
  // If camera doesn't support PTZ, it falls back to a regular camera prompt.
  const stream = await navigator.mediaDevices.getUserMedia({
    // Website asks to control camera PTZ as well without altering the
    // current pan, tilt, and zoom settings.
    video: { pan: true, tilt: true, zoom: true }
  });

  // Show camera video stream to user.
  document.querySelector("video").srcObject = stream;
} catch (error) {
  // User denies prompt or matching media is not available.
  console.log(error);
}
```

A previously-granted camera permission, specifically one without PTZ access,
does not automatically gain PTZ access if it becomes available. This is true
even when the camera itself supports PTZ. The permission must be requested
again. Fortunately, you can use the [Permissions API] to query and monitor the
status of PTZ permission.

```js
try {
  const panTiltZoomPermissionStatus = await navigator.permissions.query({
    name: "camera",
    panTiltZoom: true
  });

  if (panTiltZoomPermissionStatus.state == "granted") {
    // User has granted access to the website to control camera PTZ.
  }

  panTiltZoomPermissionStatus.addEventListener("change", () => {
    // User has changed PTZ permission status.
  });
} catch (error) {
  console.log(error);
}
```

To know whether a Chromium-based browser supports PTZ for a camera, go to the
internal `about://media-internals` page and check out the "Pan-Tilt-Zoom" column
in the "Video Capture" tab; "pan tilt" and "zoom" respectively mean the camera supports
the "PanTilt (Absolute)" and "Zoom (Absolute)" [UVC controls]. The "PanTilt (Relative)"
and "Zoom (Relative)" UVC controls are not supported in Chromium-based browsers.

<figure class="w-figure">
  {% Img
    src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/4EDS8fYYifXAUY6SBaiV.png",
    alt="Screenshot of the internal page in Chrome OS to debug PTZ camera support.",
    width="800",
    height="481",
    class="w-screenshot"
  %}
  <figcaption class="w-figcaption">Internal page to debug PTZ camera support.</figcaption>
</figure>

### Control camera PTZ {: #control }

Manipulate camera PTZ capabilities and settings using the preview
`MediaStreamTrack` from the `stream` object obtained earlier.
`MediaStreamTrack.getCapabilities()` returns a dictionary with the supported
capabilities and the ranges or allowed values. Correspondingly,
`MediaStreamTrack.getSettings()` returns the current settings.

Pan, tilt, and zoom capabilities and settings are available only if supported by
the camera and the user has granted PTZ permission to the camera.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/camera-pan-tilt-zoom/ptz_h264.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">Controlling Camera PTZ.</figcaption>
</figure>

Call `videoTrack.applyConstraints()` with the appropriate [PTZ advanced
constraints] to control camera pan, tilt, and zoom as shown in the example below.
The returned promise will resolve if successful. Otherwise it will reject if
either:
- the camera with PTZ permission is not granted.
- the camera hardware does not support the PTZ constraint.
- the page is not visible to the user. Use the [Page Visibility API] to detect
  page visibility changes.

```js
// Get video track capabilities and settings.
const [videoTrack] = stream.getVideoTracks();
const capabilities = videoTrack.getCapabilities();
const settings = videoTrack.getSettings();

// Let the user control the camera pan motion if the camera supports it
// and PTZ access is granted.
if ("pan" in settings) {
  const input = document.querySelector("input[type=range]");
  input.min = capabilities.pan.min;
  input.max = capabilities.pan.max;
  input.step = capabilities.pan.step;
  input.value = settings.pan;

  input.addEventListener("input", async () => {
    await videoTrack.applyConstraints({ advanced: [{ pan: input.value }] });
  });
}

if ("tilt" in settings) {
  // similar for tilt...
}
if ("zoom" in settings) {
  // similar for zoom...
}
```

It is also possible to configure camera pan, tilt, and zoom by calling
`navigator.mediaDevices.getUserMedia()` with some camera PTZ ideal constraint
values. This is handy when camera PTZ capabilities are known in advance. Note
that [mandatory constraints] (min, max, exact) are not allowed here.

```js
const stream = await navigator.mediaDevices.getUserMedia({
  // Website asks to reset known camera pan.
  video: { pan: 0, deviceId: { exact: "myCameraDeviceId" } }
});
```

## Playground  {: #playground }

You can play with the API by running the [demo] on Glitch. Be sure to [check out
the source code].

Tip: If you don't have a camera that supports PTZ, you can [run Chrome with the
switch] `--use-fake-device-for-media-stream` to simulate one on your machine.
Enjoy!

{% Glitch {
  id: 'ptz',
  path: 'script.js'
} %}

## Security Considerations  {: #security }

The spec authors have designed and implemented this API using the core
including user control, transparency, and ergonomics. The ability to use this
API is primarily gated by the same permission model as the [Media Capture and
Streams API]. In response to a user prompt, the website is allowed to control
camera PTZ only when the page is visible to the user.

## Helpful links {: #helpful }

- [PTZ Explainer](https://github.com/w3c/mediacapture-image/blob/master/ptz-explainer.md)
- [Specification draft](https://w3c.github.io/mediacapture-image/)
- [GitHub repository](https://github.com/w3c/mediacapture-image)
- [ChromeStatus entry](https://www.chromestatus.com/feature/5570717087170560)
- [Chrome tracking bug](https://bugs.chromium.org/p/chromium/issues/detail?id=934063)

## Acknowledgements

This article was reviewed by [Joe Medley] and [Thomas Steiner].
Thanks to [Rijubrata Bhaumik] and [Eero Häkkinen] at Intel for their work on the
spec and the implementation.
Hero image by [Christina @ wocintechchat.com] on [Unsplash].

[mandatory constraints]: https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints#Specifying_a_range_of_values:~:text=mandatory
[`MediaStream`]: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
[Permissions API]: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
[UVC controls]: https://www.usb.org/document-library/video-class-v15-document-set
[PTZ advanced constraints]: https://bugs.chromium.org/p/chromium/issues/detail?id=1126045
[Page Visibility API]: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
[demo]: https://ptz.glitch.me/
[check out the source code]: https://glitch.com/edit/#!/ptz?path=public%2Fscript.js
[run Chrome with the switch]: https://www.chromium.org/developers/how-tos/run-chromium-with-flags
[Media Capture and Streams API]: https://w3c.github.io/mediacapture-main
[Controlling Access to Powerful Web Platform Features]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[Joe Medley]: https://github.com/jpmedley
[Thomas Steiner]: https://github.com/tomayac
[Eero Häkkinen]: https://github.com/eehakkin
[Rijubrata Bhaumik]: https://github.com/riju
[Christina @ wocintechchat.com]: https://unsplash.com/@wocintechchat
[Unsplash]: https://unsplash.com/photos/lqPLmYD_MO8

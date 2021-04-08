---
title: |
  Perform efficient per-video-frame operations on video with `requestVideoFrameCallback()`
subhead: |
  Learn how to use the `requestVideoFrameCallback()` to work more efficiently with videos in the browser.
authors:
  - thomassteiner
date: 2020-06-29
updated: 2020-08-17
hero: image/admin/gpmA4LxerS1wqYgY19W7.jpg
alt: Film roll.
description: |
  The requestVideoFrameCallback() method allows web authors to register a callback
  that runs in the rendering steps when a new video frame is sent to the compositor.
tags:
  - blog
  - media
  - capabilities
feedback:
  - api
---
There's a new Web API on the block, defined in the
[`HTMLVideoElement.requestVideoFrameCallback()`](https://wicg.github.io/video-rvfc/)
specification.
The `requestVideoFrameCallback()` method allows web authors to register a callback
that runs in the rendering steps when a new video frame is sent to the compositor.
This is intended to allow developers to perform efficient per-video-frame operations on video,
such as video processing and painting to a canvas, video analysis,
or synchronization with external audio sources.

## Difference with requestAnimationFrame()

Operations like drawing a video frame to a canvas via
[`drawImage()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
made through this API will be synchronized as a best effort
with the frame rate of the video playing on screen.
Different from
[`window.requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame),
which usually fires about 60 times per second,
`requestVideoFrameCallback()` is bound to the actual video frame rate—with an important
[exception](https://wicg.github.io/video-rvfc/#ref-for-update-the-rendering③:~:text=Note%3A%20The%20effective%20rate%20at%20which,browser%20would%20fire%20callbacks%20at%2060hz.):

> The effective rate at which callbacks are run is the lesser rate between the video's rate
  and the browser's rate.
  This means a 25fps video playing in a browser that paints at 60Hz
  would fire callbacks at 25Hz.
  A 120fps video in that same 60Hz browser would fire callbacks at 60Hz.

## What's in a name?

Due to its similarity with `window.requestAnimationFrame()`, the method initially
was [proposed as `video.requestAnimationFrame()`](https://discourse.wicg.io/t/proposal-video-requestanimationframe/3691),
but I'm happy with the new name,
`requestVideoFrameCallback()`, which was agreed on
after a [lengthy discussion](https://github.com/WICG/video-rvfc/issues/44).
Yay, [bikeshedding](https://css-tricks.com/what-is-bikeshedding/) for the win!

## Browser support and feature detection

The method is
[implemented in Chromium](https://chromestatus.com/feature/6335927192387584)
already, and
[Mozilla folks like it](https://mozilla.github.io/standards-positions/#requestVideoFrameCallback).
For what it's worth, I have also filed a
[WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=211945) asking for it.
Feature detection of the API works like this:

```js
if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
  // The API is supported! 
}
```

## Using the requestVideoFrameCallback() method

If you have ever used the `requestAnimationFrame()` method, you will immediately feel at home with the `requestVideoFrameCallback()` method.
You register an initial callback once, and then re-register whenever the callback fires.

```js
const doSomethingWithTheFrame = (now, metadata) => {
  // Do something with the frame.
  console.log(now, metadata);
  // Re-register the callback to be notified about the next frame.
  video.requestVideoFrameCallback(doSomethingWithTheFrame);
};
// Initially register the callback to be notified about the first frame.
video.requestVideoFrameCallback(doSomethingWithTheFrame);
```

In the callback, `now` is a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)
and `metadata` is a [`VideoFrameMetadata`](https://wicg.github.io/video-rvfc/#dictdef-videoframemetadata)
dictionary with the following properties:

- `presentationTime`, of type `DOMHighResTimeStamp`:
  The time at which the user agent submitted the frame for composition.
- `expectedDisplayTime`, of type `DOMHighResTimeStamp`:
  The time at which the user agent expects the frame to be visible.
- `width`, of type `unsigned long`:
  The width of the video frame, in media pixels.
- `height`, of type `unsigned long`:
  The height of the video frame, in media pixels.
- `mediaTime`, of type `double`:
  The media presentation timestamp (PTS) in seconds of the frame presented (e.g., its timestamp on the `video.currentTime` timeline).
- `presentedFrames`, of type `unsigned long`:
  A count of the number of frames submitted for composition. Allows clients to determine if frames were missed between instances of `VideoFrameRequestCallback`.
- `processingDuration`, of type `double`:
  The elapsed duration in seconds from submission of the encoded packet with the same presentation timestamp (PTS) as this frame (e.g., same as the `mediaTime`) to the decoder until the decoded frame was ready for presentation.

For WebRTC applications, additional properties may appear:

- `captureTime`, of type `DOMHighResTimeStamp`:
  For video frames coming from either a local or remote source, this is the time at which the frame was captured by the camera.
  For a remote source, the capture time is estimated using clock synchronization and RTCP sender reports
  to convert RTP timestamps to capture time.
- `receiveTime`, of type `DOMHighResTimeStamp`:
  For video frames coming from a remote source, this is the time the encoded frame was received
  by the platform, i.e., the time at which the last packet belonging to this frame was received over the network.
- `rtpTimestamp`, of type `unsigned long`:
  The RTP timestamp associated with this video frame.

{% Aside %}
  Note that `width` and `height` might differ from `videoWidth` and `videoHeight` in certain cases
  (e.g., an anamorphic video might have rectangular pixels).
{% endAside %}

Of special interest in this list is `mediaTime`.
In Chromium's implementation, we use the audio clock as the time source that backs `video.currentTime`,
whereas the `mediaTime` is directly populated by the `presentationTimestamp` of the frame.
The `mediaTime` is what you should use if you want to exactly identify frames in a reproducible way,
including to identify exactly which frames you missed.

{% Aside %}
  Unfortunately, the video element does not guarantee frame-accurate *seeking*.
  This has been an ongoing [subject of discussion](https://github.com/w3c/media-and-entertainment/issues/4).
  [WebCodecs](https://github.com/WICG/web-codecs) will eventually allow for frame accurate applications.
{% endAside %}

### If things seem one frame off…

Vertical synchronization (or just vsync), is a graphics technology that synchronizes the frame rate of a video and the refresh rate of a monitor.
Since `requestVideoFrameCallback()` runs on the main thread, but, under the hood, video compositing happens on the compositor thread,
everything from this API is a best effort, and we do not offer any strict guarantees.
What may be happening is that the API can be one vsync late relative to when a video frame is rendered.
It takes one vsync for changes made to the web page through the API to appear on screen (same as `window.requestAnimationFrame()`).
So if you keep updating the `mediaTime` or frame number on your web page and compare that
against the numbered video frames, eventually the video will look like it is one frame ahead.

What is really happening is that the frame is ready at vsync&nbsp;x, the callback is fired and the frame is rendered at vsync&nbsp;x+1,
and changes made in the callback are rendered at vsync&nbsp;x+2.
You can check whether the callback is a vsync late (and the frame is already rendered on screen)
by checking whether the `metadata.expectedDisplayTime` is roughly `now` or one vsync in the future.
If it is within about five to ten microseconds of `now`, the frame is already rendered;
if the `expectedDisplayTime` is approximately sixteen milliseconds in the future (assuming your browser/screen is refreshing at 60Hz),
then you are in sync with the frame.

## Demo

I have created a small
[demo on Glitch](https://requestvideoframecallback.glitch.me/)
that shows how frames are drawn on a canvas at exactly
the frame rate of the video and
where the frame metadata is logged for debugging purposes.
The core logic is just a couple of lines of JavaScript.

```js
let paintCount = 0;
let startTime = 0.0;

const updateCanvas = (now, metadata) => {
  if (startTime === 0.0) {
    startTime = now;
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const elapsed = (now - startTime) / 1000.0;
  const fps = (++paintCount / elapsed).toFixed(3);
  fpsInfo.innerText = `video fps: ${fps}`;
  metadataInfo.innerText = JSON.stringify(metadata, null, 2);

  video.requestVideoFrameCallback(updateCanvas);
};

video.requestVideoFrameCallback(updateCanvas);
```

{% Glitch {
  id: 'requestvideoframecallback',
  path: 'script.js',
  height: 1200
} %}

## Conclusions

I have done frame-level processing for a long time—without having access to the actual frames,
only based on `video.currentTime`.
I implemented video shot segmentation in JavaScript
in a rough-and-ready manner; you can still read the accompanying
[research paper](https://www2012.universite-lyon.fr/proceedings/nocompanion/DevTrack_028.pdf).
Had the `requestVideoFrameCallback()` existed back then, my life would have been much simpler…

## Acknowledgements

The `requestVideoFrameCallback` API was specified and implemented by
[Thomas Guilbert](https://github.com/tguilbert-google).
This article was reviewed by [Joe Medley](https://github.com/jpmedley)
and [Kayce Basques](https://github.com/kaycebasques).
[Hero image](https://unsplash.com/photos/tV80374iytg) by
[Denise Jans](https://unsplash.com/@dmjdenise) on Unsplash.

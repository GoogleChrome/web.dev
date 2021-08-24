---
layout: post
title: Insertable streams for MediaStreamTrack
subhead: |
  The content of a `MediaStreamTrack` is exposed as a stream that can be manipulated or used to
  generate new content.
authors:
  - thomassteiner
date: 2021-05-04
updated: 2021-08-24
description: |
  Insertable streams for MediaStreamTrack is about exposing the content of a MediaStreamTrack
  as a stream that can be manipulated or used to generate new content.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/Qu2wfQ3pxR8AeEfty88S.jpg
alt: Cup of coffee and a laptop with a video conference showing many participants.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - media
  - capabilities
---

## Background

In the context of the
[Media Capture and Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)
the [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)
interface represents a single media track within a stream; typically, these are audio or video
tracks, but other track types may exist.
[`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) objects consist of
zero or more `MediaStreamTrack` objects, representing various audio or video tracks. Each
`MediaStreamTrack` may have one or more channels. The channel represents the smallest unit of a
media stream, such as an audio signal associated with a given speaker, like left or right in a
stereo audio track.

## What is insertable streams for `MediaStreamTrack`?

The core idea behind insertable streams for `MediaStreamTrack` is to expose the content of a
`MediaStreamTrack` as a collection of [streams](/streams/) (as defined by the WHATWG
[Streams API](https://streams.spec.whatwg.org/)). These streams can be manipulated to introduce new
components.

Granting developers access to the video (or audio) stream directly allows them to apply
modifications directly to the stream. In contrast, realizing the same video manipulation task with
traditional methods requires developers to use intermediaries such as `<canvas>` elements. (For
details of this type of process, see, for example,
[video + canvas = magic](https://html5doctor.com/video-canvas-magic/).)

## Use cases

Use cases for insertable streams for `MediaStreamTrack` include, but are not limited to:

- Video conferencing gadgets like "funny hats" or virtual backgrounds.
- Voice processing like software [vocoders](https://en.wikipedia.org/wiki/Vocoder).

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | [In Progress][spec]      |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Completed                |
| 5. **Launch**                            | **Completed**            |

</div>

## How to use insertable streams for `MediaStreamTrack`

### Feature detection

You can feature-detect insertable streams for `MediaStreamTrack` support as follows.

```js
if ('MediaStreamTrackProcessor' in window && 'MediaStreamTrackGenerator' in window) {
  // Insertable streams for `MediaStreamTrack` is supported.
}
```

### Core concepts

Insertable streams for `MediaStreamTrack` builds on concepts previously proposed by
[WebCodecs](https://web.dev/webcodecs/) and conceptually splits the `MediaStreamTrack` into two
components:

- The `MediaStreamTrackProcessor`, which consumes a `MediaStreamTrack` object's source and generates
  a stream of media frames, specifically
  [`VideoFrame`](https://w3c.github.io/webcodecs/#videoframe-interface) or
  [`AudioFrame`](https://w3c.github.io/webcodecs/#audioframe-interface)) objects. You can think of
  this as a track sink that is capable of exposing the unencoded frames from the track as a
  `ReadableStream`.
- The `MediaStreamTrackGenerator`, which consumes a stream of media frames and exposes a
  `MediaStreamTrack` interface. It can be provided to any sink, just like a track from
  `getUserMedia()`. It takes media frames as input.

#### The `MediaStreamTrackProcessor`

A `MediaStreamTrackProcessor` object exposes one property, `readable`. It allows for reading the
frames from the `MediaStreamTrack`. If the track is a video track,
chunks read from `readable` will be `VideoFrame` objects. If the track is an audio track, chunks
read from `readable` will be `AudioFrame` objects.

#### The `MediaStreamTrackGenerator`

A `MediaStreamTrackGenerator` object likewise exposes one property, `writable`, which is a
`WritableStream` that allows writing media frames to the
`MediaStreamTrackGenerator`, which is itself a `MediaStreamTrack`. If the `kind` attribute is
`"audio"`, the stream accepts `AudioFrame` objects and fails with any other type. If kind is
`"video"`, the stream accepts `VideoFrame` objects and fails with any other type. When a frame is
written to `writable`, the frame's `close()` method is automatically invoked, so that its media
resources are no longer accessible from JavaScript.

In the `MediaStream` model, apart from media, which flows from sources to sinks, there are also
control signals that flow in the opposite direction (i.e., from sinks to sources via the track).
A `MediaStreamTrackGenerator` is a track for which a custom
source can be implemented by writing media frames to its `writable` field.

### Bringing it all together

The core idea is to create a processing chain as follows:

Platform Track → Processor → Transform → Generator → Platform Sinks

For a barcode scanner application, this chain would look as in the code sample below.

```js
const stream = await getUserMedia({ video: true });
const videoTrack = stream.getVideoTracks()[0];

const trackProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
const trackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });

const transformer = new TransformStream({
  async transform(videoFrame, controller) {
    const barcodes = await detectBarcodes(videoFrame);
    const newFrame = highlightBarcodes(videoFrame, barcodes);
    videoFrame.close();
    controller.enqueue(newFrame);
  },
});

trackProcessor.readable.pipeThrough(transformer).pipeTo(trackGenerator.writable);

const videoBefore = document.getElementById('video-before');
const videoAfter = document.getElementById('video-after');
videoBefore.srcObject = stream;
const streamAfter = new MediaStream([generator]);
videoAfter.srcObject = streamAfter;
```

{% Aside %} This article barely scratches the surface of what is possible and going into the details
is way beyond the scope of this publication. For more examples, see the extended
[video processing demo](https://webrtc.github.io/samples/src/content/insertable-streams/video-processing/)
and the
[audio processing demo](https://webrtc.github.io/samples/src/content/insertable-streams/audio-processing/)
respectively. You can find the source code for both demos
[on GitHub](https://github.com/webrtc/samples/tree/gh-pages/src/content/insertable-streams).
{% endAside %}

## Demo

You can see the [QR code scanner demo](https://mediastreamtrack.glitch.me/) from the section above
in action on a desktop or mobile browser. Hold a QR code in front of the camera and the app will
detect it and highlight it. You can see the application's source code
[on Glitch](https://glitch.com/edit/#!/mediastreamtrack?path=index.html%3A21%3A50).

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/VwysZHgnzswePs684xOJ.png", alt="QR code scanner running in desktop browser tab showing a detected and highlighted QR code on the phone the user holds in front of the laptop's camera.", width="800", height="481" %}

## Security and Privacy considerations

The security of this API relies on existing mechanisms in the web platform. As data is exposed using
the `VideoFrame` and `AudioFrame` interfaces, the rules of those interfaces to deal with
origin-tainted data apply. For example, data from cross-origin resources cannot be accessed due to
existing restrictions on accessing such resources (e.g., it is not possible to access the pixels of
a cross-origin image or video element). In addition, access to media data from cameras, microphones,
or screens is subject to user authorization. The media data this API exposes is already available
through other APIs. In addition to the media data, this API exposes some control signals such as
requests for new frames. These signals are intended as hints and do not pose a significant security
risk.

## Feedback

The Chromium team wants to hear about your experiences with insertable streams for
`MediaStreamTrack`.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Do you have a question or comment on the
security model? File a spec issue on the corresponding [GitHub repo][github], or add your thoughts
to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>MediaStream` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use insertable streams for `MediaStreamTrack`? Your public support helps the
Chromium team prioritize features and shows other browser vendors how critical it is to support
them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#InsertableStreams`](https://twitter.com/search?q=%23InsertableStreams&src=recent_search_click&f=live)
and let us know where and how you are using it.

## Helpful links

- [Spec draft][spec]
- [Explainer][explainer]
- [ChromeStatus](https://chromestatus.com/feature/5499415634640896)
- [Chromium bug](https://crbug.com/1142955)
- [TAG review](https://github.com/w3ctag/design-reviews/issues/603)
- [GitHub repo][github]

## Acknowledgements

The insertable streams for `MediaStreamTrack` spec was written by
[Harald Alvestrand](https://github.com/alvestrand) and [Guido Urdaneta](https://github.com/guidou).
This article was reviewed by Harald Alvestrand, [Joe Medley](https://github/com/jpmedley),
[Ben Wagner](https://github.com/dogben), [Huib Kleinhout](https://github.com/huibk), and
[François Beaufort](https://github.com/beaufortfrancois). Hero image by
[Chris Montgomery](https://unsplash.com/@cwmonty) on
[Unsplash](https://unsplash.com/photos/smgTvepind4).

[spec]: https://w3c.github.io/mediacapture-transform/
[explainer]: https://github.com/w3c/mediacapture-transform/blob/main/explainer.md
[github]: https://github.com/w3c/mediacapture-transform/
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[ot]: https://developer.chrome.com/origintrials/#/view_trial/-7811493553674125311

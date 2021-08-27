---
title: Video processing with WebCodecs
subhead: Manipulating video stream components.
description: |
  Work with components of a video stream, such as frames and unmuxed chunks of encoded video or audio.
date: 2020-10-13
updated: 2021-08-26
hero: image/admin/I09h0la9qLPSRLZs1ruB.jpg
alt: A roll of film.
authors:
 - djuffin
origin_trial:
    url: https://developers.chrome.com/origintrials/#/view_trial/-7811493553674125311
tags:
  - blog
  - media
  - video
feedback:
  - api
---

Modern web technologies provide ample ways to work with video.
[Media Stream API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API),
[Media Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API),
[Media Source API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API),
 and [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) add up
to a rich tool set for recording, transferring, and playing video streams.
While solving certain high-level tasks, these APIs don't let web
programmers work with individual components of a video stream such as frames
and unmuxed chunks of encoded video or audio.
To get low-level access to these basic components, developers have been using
WebAssembly to bring [video and audio
codecs](https://en.wikipedia.org/wiki/Video_codec) into the browser. But given
that modern browsers already ship with a variety of codecs (which are often
accelerated by hardware), repackaging them as WebAssembly seems like a waste of
human and computer resources.

[WebCodecs API](https://wicg.github.io/web-codecs/) eliminates this inefficiency
by giving programmers a way to use media components that are already present in
the browser. Specifically:

+   Video and audio decoders
+   Video and audio encoders
+   Raw video frames
+   Image decoders

The WebCodecs API is useful for web applications that require full control over the
way media content is processed, such as video editors, video conferencing, video
streaming, etc.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                         | Status                       |
| -------------------------------------------- | ---------------------------- |
| 1. Create explainer                          | [Complete](https://github.com/WICG/web-codecs/blob/master/explainer.md)        |
| 2. Create initial draft of specification     | [Complete](https://wicg.github.io/web-codecs/)         |
| 3. Gather feedback & iterate on design       | Complete                     |
| 4. Origin trial                              | Complete                     |
| 5. Launch                                    | Chrome 94                    |

</div>

## Video processing workflow

Frames are the centerpiece in video processing. Thus in WebCodecs most classes
either consume or produce frames. Video encoders convert frames into encoded
chunks. Video decoders do the opposite.

Also `VideoFrame` plays nicely with other Web APIs by being a [`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource) and having a [constructor](https://www.w3.org/TR/webcodecs/#dom-videoframe-videoframe) that accepts `CanvasImageSource`.
So it can be used in functions like [`drawImage()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) and[`texImage2D()`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D). Also it can be constructed from canvases, bitmaps, video elements and other video frames.


WebCodecs API works well in tandem with the classes from [Insertable Streams API](https://w3c.github.io/mediacapture-transform/)
which connect WebCodecs to [media stream tracks](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack).
- `MediaStreamTrackProcessor` breaks media tracks into individual frames.
- `MediaStreamTrackGenerator` creates a media track from a stream of frames.


## WebCodecs and web workers

By design WebCodecs API does all the heavy lifting asynchronously and off the main thread.
But since frame and chunk callbacks can often be called multiple times a second,
they might clutter the main thread and thus make the website less responsive.
Therefore it is preferable to move handling of individual frames and encoded chunks into a
web worker.

To help with that, [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
provides a convenient way to automatically transfer all frames coming from a media
track to the worker. For example, `MediaStreamTrackProcessor` can be used to obtain a
`ReadableStream` for a media stream track coming from the web camera. After that
the stream is transferred to a web worker where frames are read one by one and queued
into a `VideoEncoder`.

With [`HTMLCanvasElement.transferControlToOffscreen`](https://developers.google.com/web/updates/2018/08/offscreen-canvas#unblock_main_thread) even rendering can be done off the main thread. But if all the high level tools turned
out to be inconvenient, `VideoFrame` itself is [transferable](https://developer.mozilla.org/en-US/docs/Web/API/Transferable) and may be
moved between workers.

## WebCodecs in action

### Encoding

<figure class="w-figure">
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/lEovMYp8oh1JSClCLCiD.png", alt="The path from a Canvas or an ImageBitmap to the network or to storage", width="800", height="393" %}
  <figcaption class="w-figcaption">The path from a <code>Canvas</code> or an <code>ImageBitmap</code> to the network or to storage</figcaption>
</figure>

It all starts with a `VideoFrame`.
There are three ways to construct video frames.
+ From an image source like a canvas, an image bitmap, or a video element.
```js
const cnv = document.createElement('canvas');
// draw something on the canvas
…
let frame_from_canvas = new VideoFrame(cnv, { timestamp: 0 });
```
+ Use `MediaStreamTrackProcessor` to pull frames from a [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)
```js
  const stream = await navigator.mediaDevices.getUserMedia({ … });
  const track = stream.getTracks()[0];

  const media_processor = new MediaStreamTrackProcessor(track);

  const reader = media_processor.readable.getReader();
  while (true) {
      const result = await reader.read();
      if (result.done)
        break;
      let frame_from_camera = result.value;
  }
```
+ Create a frame from its binary pixel representation in a [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource)
```js
  const pixelSize = 4;
  const init = {timestamp: 0, codedWidth: 320, codedHeight: 200, format: 'RGBA'};
  let data = new Uint8Array(init.codedWidth * init.codedHeight * pixelSize);
  for (let x = 0; x < init.codedWidth; x++) {
    for (let y = 0; y < init.codedHeight; y++) {
      let offset = (y * init.codedWidth + x) * pixelSize;
      data[offset] = 0x7F;      // Red
      data[offset + 1] = 0xFF;  // Green
      data[offset + 2] = 0xD4;  // Blue
      data[offset + 3] = 0x0FF; // Alpha
    }
  }
  let frame = new VideoFrame(data, init);
```

No matter where they are coming from, frames can be encoded into
`EncodedVideoChunk` objects with a `VideoEncoder`.

Before encoding, `VideoEncoder` needs to be given two JavaScript objects:

+   Init dictionary with two functions for handling encoded chunks and
    errors. These functions are developer-defined and can't be changed after
    they're passed to the `VideoEncoder` constructor.
+   Encoder configuration object, which contains parameters for the output
    video stream. You can change these parameters later  by calling `configure()`.

```js
const init = {
  output: handleChunk,
  error: (e) => {
    console.log(e.message);
  }
};

let config = {
  codec: 'vp8',
  width: 640,
  height: 480,
  bitrate: 2_000_000, // 2 Mbps
  framerate: 30,
};

let encoder = new VideoEncoder(init);
encoder.configure(config);
```

After the encoder has been set up, it's ready to accept frames via `encode()` method.
Both `configure()` and `encode()` return immediately without waiting for the
actual work to complete. It allows several frames to queue for encoding at the
same time, while `encodeQueueSize` shows how many requests are waiting in the queue
for previous encodes to finish.
Errors are reported either by immediately throwing an exception, in case the arguments
or the order of method calls violates the API contract, or by calling the `error()`
callback for problems encountered in the codec implementation.
If encoding completes successfully the `output()`
callback is called with a new encoded chunk as an argument.
Another important detail here is that frames need to be told when they are no
longer needed by calling `close()`.

```js
let frame_counter = 0;

const track = stream.getVideoTracks()[0];
const media_processor = new MediaStreamTrackProcessor(track);

const reader = media_processor.readable.getReader();
while (true) {
    const result = await reader.read();
    if (result.done)
      break;

    let frame = result.value;
    if (encoder.encodeQueueSize > 2) {
      // Too many frames in flight, encoder is overwhelmed
      // let's drop this frame.
      frame.close();
    } else {
      frame_counter++;
      const insert_keyframe = (frame_counter % 150) == 0;
      encoder.encode(frame, { keyFrame: insert_keyframe });
      frame.close();
    }
}
```

Finally it's time to finish encoding code by writing a function that handles
chunks of encoded video as they come out of the encoder.
Usually this function would be sending data chunks over the network or [muxing
](https://en.wikipedia.org/wiki/Multiplexing#Video_processing)them into a media
container for storage.

```js
function handleChunk(chunk, metadata) {

  if (metadata.decoderConfig) {
    // Decoder needs to be configured (or reconfigured) with new parameters
    // when metadata has a new decoderConfig.
    // Usually it happens in the beginning or when the encoder has a new
    // codec specific binary configuration. (VideoDecoderConfig.description).
    fetch('/upload_extra_data',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: metadata.decoderConfig.description
    });
  }

  // actual bytes of encoded data
  let chunkData = new Uint8Array(chunk.byteLength);
  chunk.copyTo(chunkData);

  let timestamp = chunk.timestamp;        // media time in microseconds
  let is_key = chunk.type == 'key';       // can also be 'delta'
  fetch(`/upload_chunk?timestamp=${timestamp}&type=${chunk.type}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: chunkData
  });
}
```

If at some point you'd need to make sure that all pending encoding requests have
been completed, you can call `flush()` and wait for its promise.

```js
await encoder.flush();
```

### Decoding

<figure class="w-figure">
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/fzi3E4v2jJJj5QAlhoRG.png", alt="The path from the network or storage to a Canvas or an ImageBitmap.", width="800", height="419" %}
  <figcaption class="w-figcaption">The path from the network or storage to a <code>Canvas</code> or an <code>ImageBitmap</code>.</figcaption>
</figure>

Setting up a `VideoDecoder` is similar to what's been done for the
`VideoEncoder`: two functions are passed when the decoder is created, and codec
parameters are given to `configure()`.

The set of codec parameters varies from codec to codec. For example H.264 codec
might need a [binary blob](https://wicg.github.io/web-codecs/#dom-audiodecoderconfig-description)
of avcC, unless it's encoded in so called AnnexB format ( `encoderConfig.avc = { format: "annexb" }` ).

```js
const init = {
  output: handleFrame,
  error: (e) => {
    console.log(e.message);
  }
};

const config = {
  codec: 'vp8',
  codedWidth: 640,
  codedHeight: 480
};

let decoder = new VideoDecoder(init);
decoder.configure(config);
```

Once the decoder is initialized, you can start feeding it with `EncodedVideoChunk` objects.
To create a chunk, you'll need:
- A [`BufferSource`](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource) of encoded video data
- the chunk's start timestamp in microseconds (media time of the first encoded frame in the chunk)
- the chunk's type, one of:
  - `key` if the chunk can be decoded independently from previous chunks
  - `delta` if the chunk can only be decoded after one or more previous chunks have been decoded

Also any chunks emitted by the encoder are ready for the decoder as is.
All of the things said above about error reporting and the asynchronous nature
of encoder's methods are equally true for decoders as well.

```js
let responses = await downloadVideoChunksFromServer(timestamp);
for (let i = 0; i < responses.length; i++) {
  let chunk = new EncodedVideoChunk({
    timestamp: responses[i].timestamp,
    type: (responses[i].key ? 'key' : 'delta'),
    data: new Uint8Array ( responses[i].body )
  });
  decoder.decode(chunk);
}
await decoder.flush();
```
Now it's time to show how a freshly decoded frame can be shown on the page. It's
better to make sure that the decoder output callback  (`handleFrame()`)
quickly returns. In the example below, it only adds a frame to the queue of
frames ready for rendering.
Rendering happens separately, and consists of two steps:

1.  Waiting for the right time to show the frame.
2.  Drawing the frame on the canvas.

Once a frame is no longer needed, call `close()` to release underlying memory
before the garbage collector gets to it, this will reduce the average amount of
memory used by the web application.

```js
let cnv = document.getElementById('canvas_to_render');
let ctx = cnv.getContext('2d');
let ready_frames = [];
let underflow = true;
let time_base = 0;

function handleFrame(frame) {
  ready_frames.push(frame);
  if (underflow)
    setTimeout(render_frame, 0);
}

function delay(time_ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });
}

function calculateTimeTillNextFrame(timestamp) {
  if (time_base == 0)
    time_base = performance.now();
  let media_time = performance.now() - time_base;
  return Math.max(0, (timestamp / 1000) - media_time);
}

async function render_frame() {
  if (ready_frames.length == 0) {
    underflow = true;
    return;
  }
  let frame = ready_frames.shift();
  underflow = false;

  // Based on the frame's timestamp calculate how much of real time waiting
  // is needed before showing the next frame.
  let time_till_next_frame = calculateTimeTillNextFrame(frame.timestamp);
  await delay(time_till_next_frame);
  ctx.drawImage(frame, 0, 0);
  frame.close();

  // Immediately schedule rendering of the next frame
  setTimeout(render_frame, 0);
}
```

## Demo

The demo below shows how animation frames from a canvas are:
- captured at 25fps into a `ReadableStream` by `MediaStreamTrackProcessor`
- transferred to a web worker
- encoded into H.264 video format
- decoded again into a sequence of video frames
- and rendered on the second canvas using `transferControlToOffscreen()`

{% Glitch 'new-webcodecs-blogpost-demo' %}

## Using the WebCodecs API {: #use }

## Feature detection

To check for WebCodecs support:

```js
if ('VideoEncoder' in window) {
  // WebCodecs API is supported.
}
```
Keep in mind that WebCodecs API is only available in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts),
so detection will fail if [`self.isSecureContext`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/isSecureContext) is false.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the WebCodecs API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are
there missing methods or properties that you need to implement your idea? Have a
question or comment on the security model? File a spec issue on the
corresponding [GitHub repo](https://github.com/WICG/web-codecs/issues), or add
your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec? File a bug at [new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EMedia%3EWebCodecs).
Be sure to include as much detail as you can, simple instructions for
reproducing, and enter `Blink>Media>WebCodecs` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the WebCodecs API? Your public support helps the
Chrome team to prioritize features and shows other browser vendors how critical
it is to support them.

Send emails to [media-dev@chromium.org](mailto:media-dev@chromium.org) or send a tweet
to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebCodecs`](https://twitter.com/search?q=%23WebCodecs&src=typed_query&f=live)
and let us know where and how you're using it.

[Hero image](https://unsplash.com/photos/8eQOBtgn9Qo) by
[Denise Jans](https://unsplash.com/@dmjdenise)
on [Unsplash](https://unsplash.com).

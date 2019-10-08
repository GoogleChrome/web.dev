---
title: "The Shape Detection API: a picture is worth a thousand words, faces, and barcodes"
subhead: The Shape Detection API detects faces, barcodes, and text in images.
authors:
  - thomassteiner
description: The Shape Detection API detects faces, barcodes, and text in images.
date: 2019-01-07
updated: 2019-10-08
tags:
  - post
  - capabilities
  - shape-detection
  - progressive-web-apps
  - webapp
hero: hero.jpg
alt: Photo of bokeh lights
---

{% Aside %}
  This API as part of the new
  [capabilities project](https://developers.google.com/web/updates/capabilities),
  and is available as an [**origin trial**](#ot). This post will be updated as
  the Shape Detection API evolves.
{% endAside %}

## What is the Shape Detection API? {: #what }

With APIs like
[`navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
and the new Chrome for Android
[photo picker](https://bugs.chromium.org/p/chromium/issues/detail?id=656015),
it has become fairly easy to capture images or live video data from device
cameras, or to upload local images. So far, this dynamic image data—as well as
static images on a page—has been not been accessible by code, even though
images may actually contain a lot of interesting features such as faces,
barcodes, and text.

For example, in the past, if developers wanted to extract such features on the
client to build a [QR code reader](https://qrsnapper.appspot.com/), they had
to rely on external JavaScript libraries. This could be expensive from a
performance point of view and increase the overall page weight. On the other
hand, operating systems including Android, iOS, and macOS, but also hardware
chips found in camera modules, typically already have performant and highly
optimized feature detectors such as the Android
[`FaceDetector`](https://developer.android.com/reference/android/media/FaceDetector)
or the iOS generic feature detector,
[`CIDetector`](https://developer.apple.com/documentation/coreimage/cidetector?language=objc).

The Shape Detection API exposes these native implementations through a set of
JavaScript interfaces. Currently, the supported features are face detection
through the `FaceDetector` interface, barcode detection through the
`BarcodeDetector` interface, and text detection (Optical Character
Recognition, (OCR)) through the `TextDetector` interface.

{% Aside 'caution' %}
  Text detection, despite being an interesting field, is not considered stable
  enough across either computing platforms or character sets to be
  standardized at the moment, which is why text detection has been moved to
  a separate
  [informative specification](https://wicg.github.io/shape-detection-api/text.html).
{% endAside %}

### Suggested use cases {: #use-cases }

As outlined above, the Shape Detection API currently supports the detection
of faces, barcodes, and text. The following bullet list contains examples
of use cases for all three features.

#### Face detection

- Online social networking or photo sharing sites commonly let their users
  annotate people in images. By highlighting the boundaries of detected faces,
  this task can be facilitated.
- Content sites can dynamically crop images based on potentially detected
  faces rather than relying on other heuristics, or highlight detected faces
  with [Ken Burns](https://en.wikipedia.org/wiki/Ken_Burns_effect)-like
  panning and zooming effects in story-like formats.
- Multimedia messaging sites can allow their users to overlay funny objects like
  [sunglasses or mustaches](https://beaufortfrancois.github.io/sandbox/media-recorder/mustache.html)
  on detected face landmarks.

#### Barcode detection

- Web applications that read QR codes can unlock interesting use cases like
  online payments or web navigation, or use barcodes for establishing social
  connections on messenger applications.
- Shopping apps can allow their users to scan
  [EAN](https://en.wikipedia.org/wiki/International_Article_Number) or
  [UPC](https://en.wikipedia.org/wiki/Universal_Product_Code) barcodes of
  items in a physical   store to compare prices online.
- Airports can provide web kiosks where passengers can scan their boarding
  passes' [Aztec codes](https://en.wikipedia.org/wiki/Aztec_Code) to show
  personalized information related to their flights.

#### Text detection

- Online social networking sites can improve the accessibility of
  user-generated image content by adding detected texts as `alt` attributes
  for `<img>` tags when no other descriptions are provided.
- Content sites can use text detection to avoid placing headings on top of
  hero images with contained text.
- Web applications can use text detection to translate texts such as,
  for example, restaurant menus.

## Current status {: #status }

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [In Progress][spec]          |
| 3. Gather feedback & iterate on design     | [In progress](#feedback)     |
| **4. Origin trial**                        | [**In progress**](#ot)       |
| 5. Launch                                  | Not started                  |

## How to use the Shape Detection API {: #use }

{% Aside 'warning' %}
  The origin trial is expected to end in Chrome 78 and the API will be
  turned off while we integrate developer feedback. You can always use the
  Shape Detection API for local experiments by enabling the
  `#enable-experimental-web-platform-features` flag.
{% endAside %}

The Shape Detection API is currently available as an origin trial.
[Origin trials][ot-what-is] allow you to try out new features and give
feedback on usability, practicality, and effectiveness to the Chrome team and the web
standards community. For more information, see the
[Origin Trials Guide for Web Developers][ot-dev-guide].

### Register for the origin trial {: #ot }
This conversation was marked as resolved by petele

1. [Request a token][ot] for your origin.
2. Add the token to your pages, there are two ways to provide this token on
   any pages in your origin:
     * Add an `origin-trial` `<meta>` tag to the head of any page. For example,
       this may look something like: <br>
       `<meta http-equiv="origin-trial" content="TOKEN_GOES_HERE">`
     * If you can configure your server, you can also provide the token on pages
       using an `Origin-Trial` HTTP header. The resulting response header should
       look something like: `Origin-Trial: TOKEN_GOES_HERE`

### Alternatives to the origin trial

If you want to experiment with the Shape Detection API locally, without an
origin trial, enable the `#enable-experimental-web-platform-features`
flag in `chrome://flags`.


### Using the Shape Detection API during the origin trial

The interfaces of all three detectors, `FaceDetector`, `BarcodeDetector`, and
`TextDetector`, are similar. They all provide a single asynchronous method
called `detect()` that takes an
[`ImageBitmapSource`](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#imagebitmapsource)
as an input (that is, either a
[`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource), a
[`Blob`](https://w3c.github.io/FileAPI/#dfn-Blob), or
[`ImageData`](https://html.spec.whatwg.org/multipage/canvas.html#imagedata)).

For `FaceDetector` and `BarcodeDetector`, optional parameters can be passed
to the detector's constructor that allow for providing hints to the
underlying native detectors.

Please carefully check the support matrix in the
[explainer](https://github.com/WICG/shape-detection-api#overview) for an
overview of the different platforms.

{% Aside 'gotchas' %}
  If your `ImageBitmapSource` has an
  [effective script origin](https://html.spec.whatwg.org/multipage/#concept-origin)
  which is not the same as the   document's effective script origin, then
  attempts to call `detect()` will fail with a new
  `SecurityError` [`DOMException`](https://heycam.github.io/webidl/#idl-DOMException).
  If your image origin supports CORS, you can use the
  [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)
  attribute to request CORS access.
{% endAside %}

### Working with the `FaceDetector` {: #facedetector}

The `FaceDetector` always returns the bounding boxes of faces it detects in
the `ImageBitmapSource`. Dependent on the platform, more information
regarding face landmarks like eyes, nose, or mouth may be available.

```js
const faceDetector = new FaceDetector({
  // (Optional) Hint to try and limit the amount of detected faces
  // on the scene to this maximum number.
  maxDetectedFaces: 5,
  // (Optional) Hint to try and prioritize speed over accuracy
  // by, e.g., operating on a reduced scale or looking for large features.
  fastMode: false
});
try {
  const faces = await faceDetector.detect(image);
  faces.forEach(face => drawMustache(face));
} catch (e) {
  console.error('Face detection failed:', e);
}
```

### Working with the `BarcodeDetector` {: #barcodedetector}

The `BarcodeDetector` returns the barcode raw values it finds in the
`ImageBitmapSource` and the bounding boxes, as well as other information like
the formats of the detected barcodes.

```js
const barcodeDetector = new BarcodeDetector({
  // (Optional) A series of barcode formats to search for.
  // Not all formats may be supported on all platforms
  formats: [
    'aztec',
    'code_128',
    'code_39',
    'code_93',
    'codabar',
    'data_matrix',
    'ean_13',
    'ean_8',
    'itf',
    'pdf417',
    'qr_code',
    'upc_a',
    'upc_e'
  ]
});
try {
  const barcodes = await barcodeDetector.detect(image);
  barcodes.forEach(barcode => searchProductDatabase(barcode));
} catch (e) {
  console.error('Barcode detection failed:', e);
}
```

### Working with the `TextDetector` {: #textdetector}

The `TextDetector` always returns the bounding boxes of the detected texts,
and on some platforms the recognized characters.

{% Aside 'caution' %}
  Text recognition is not universally available.
{% endAside %}

```js
const textDetector = new TextDetector();
try {
  const texts = await textDetector.detect(image);
  texts.forEach(text => textToSpeech(text));
} catch (e) {
  console.error('Text detection failed:', e);
}
```

## Feature detection {: #featuredetection }

Purely checking for the existence of the constructors to feature detect the
Shape Detection API doesn't suffice, as Chrome on Linux and Chrome OS
currently still expose the detectors, but they are known to not work
([bug](https://crbug.com/920961)). As a temporary measure, we instead
recommend a *defensive programming* approach by doing feature detection
like this:

```js
const supported = await (async () => 'FaceDetector' in window &&
    await new FaceDetector().detect(document.createElement('canvas'))
    .then(_ => true)
    .catch(e => e.name === 'NotSupportedError' ? false : true))();
```

## Best practices {: #bestpractices}

All detectors work asynchronously, that is, they do not block the main
thread. So don't rely on realtime detection, but rather allow for some
time for the detector to do its work.

If you are a fan of
[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API),
you'll be happy tro know thatß detectors are exposed there as well.
Detection results are serializable and can thus be passedß from the worker
to the main app via `postMessage()`. The [demo][demo] shows this in action.

Not all platform implementations support all features, so be sure to check
the support situation carefully and use the API as a progressive
enhancement. For example, some platforms might support face detection
per se, but not face landmark detection (eyes, nose, mouth, etc.); or the
existence and the location of text may be recognized, but not text contents.

{% Aside 'caution' %}
  This API is an optimization and not something guaranteed to be available
  from the platform for every user. Developers are expected to combine this
  with their own [image recognition code](https://github.com/mjyc/opencv) and
  take advantage of the native optimization when it is available.
{% endAside %}

## Feedback {: #feedback }

We want to hear about your experiences with the Shape Detection API.

### Tell us about the API design {: .hide-from-toc }

Is there something about the API that doesn't work like you expected? Or
are there missing methods or properties that you need to implement your
idea? Have a question or comment on the security model?

* File a spec issue on the [Shape Detection API GitHub repo][issues],
  or add your thoughts to an existing issue.

### Problem with the implementation? {: .hide-from-toc }

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at <https://new.crbug.com>. Be sure to include as
  much detail as you can, simple instructions for reproducing, and set
  *Components* to `Blink>ImageCapture`. [Glitch](https://glitch.com)
  works great for sharing quick and easy repros.

### Planning to use the API? {: .hide-from-toc }

Planning to use the Shape Detection API on your site? Your public support
helps us to prioritize features, and shows other browser vendors how
critical it is to support them.

* Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]
* Send a Tweet to [@ChromiumDev][cr-dev-twitter] with `#shapedetection` and
  let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [API Demo][demo] | [API Demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: `Blink>ImageCapture`

[cr-dev-twitter]: https://twitter.com/chromiumdev
[spec]: https://wicg.github.io/shape-detection-api
[issues]: https://github.com/WICG/shape-detection-api/issues
[demo]: https://shape-detection-demo.glitch.me/
[demo-source]: https://glitch.com/edit/#!/shape-detection-demo
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=728474
[cr-status]: https://www.chromestatus.com/feature/4757990523535360
[explainer]: https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit
[wicg-discourse]: https://discourse.wicg.io/t/rfc-proposal-for-face-detection-api/1642/3
[ot]: https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919
[ot-what-is]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/README.md
[ot-dev-guide]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[ot-use]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin

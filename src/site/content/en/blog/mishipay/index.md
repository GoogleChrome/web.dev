---
title: MishiPay's PWA increases transactions 10 times and saves 2.5 years of queuing
subhead: Learn how switching to PWA helped MishiPay's business.
authors:
  - nikilmathew
  - thomassteiner
description: Learn how MishiPay's PWA increases transactions 10 times and saves 2.5 years of queuing.
date: 2022-03-28
updated: 2022-03-30
tags:
  - blog
  - capabilities
  - case-study
  - progressive-web-apps
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/CZo4R87iOBYiRpIq6NcP.jpg
alt: MishiPay company logo over crowded street.
---

MishiPay empowers shoppers to scan and pay for their shopping with their smartphones, rather than
wasting time queuing at the checkout. With MishiPay's [Scan & Go](https://mishipay.com/) technology,
shoppers can use their own phone to scan the barcode on items and pay for them, then simply leave
the store. [Studies](https://www.adyen.com/en_GB/landing/online/uk/2019/bnb/report) reveal that
in-store queuing costs the global retail sector about $200 billion annually.

Our technology relies on device hardware capabilities such as GPS sensors and cameras that allow
users to locate MishiPay-enabled stores, scan item barcodes within the physical store, and then pay
using the digital payment method of their choice. The initial versions of our Scan & Go technology
were platform-specific iOS and Android applications, and early adopters loved the technology. Read
on to learn how switching to a PWA increased transactions by 10 times and saved 2.5 years of
queuing!

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">
      10<sub>×</sub>
    </p>
    <p>Increased transactions</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      2.5 years
   </p>
    <p>Queuing saved</p>
  </div>
</ul>

## Challenge

Users find our technology extremely helpful when waiting in a queue or check-out line, as it allows
them to skip the queue and have a smooth in-store experience. But the hassle of downloading an
Android or iOS application made users not choose our technology despite the value. It was a growing
challenge for MishiPay, and we needed to increase user adoption with a lower barrier of entry.

## Solution

Our efforts at building and launching the PWA helped us remove the installation hassle and
encouraged new users to try our technology inside a physical store, skip the queue, and have a
seamless shopping experience. Since the launch, we have seen a massive spike in user adoption with
our PWA compared to our platform-specific applications.

<figure>
  {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/jtJZ418n11SOtHLTsOht.mp4", autoplay=true, muted=true, playsinline=true, loop=true %}
  <figcaption>
    Side-by-side comparison of directly launching the PWA (left, faster) vs. installing and launching the Android app (right, slower).
  </figcaption>
</figure>

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/I5FMltbcuDHqgqEQMyqA.png", alt="Transactions by platform. ¡OS: 16397 (3.98%). Android: 13769 (3.34%). Web: 382184 (92.68%).", width="300", height="415" %}
  <figcaption>
    The majority of all transactions happen on the web.
  </figcaption>
</figure>

## Technical deep-dive

### Locating MishiPay enabled stores

To enable this feature, we rely on the
[`getCurrentPosition()`](https://developer.mozilla.org/docs/Web/API/Geolocation/getCurrentPosition)
API along with an IP-based fallback solution.

```js
const geoOptions = {
  timeout: 10 * 1000,
  enableHighAccuracy: true,
  maximumAge: 0,
};

window.navigator.geolocation.getCurrentPosition(
  (position) => {
    const cords = position.coords;
    console.log(`Latitude :  ${cords.latitude}`);
    console.log(`Longitude :  ${cords.longitude}`);
  },
  (error) => {
    console.debug(`Error: ${error.code}:${error.message}`);
    /**
     * Invoke the IP based location services
     * to fetch the latitude and longitude of the user.
     */
  },
  geoOptions,
);
```

This approach worked well in the earlier versions of the app, but was later proven to be a huge pain
point for MishiPay's users for the following reasons:

- Location inaccuracies in the IP-based fallback solutions.
- A growing listing of MishiPay-enabled stores per region requires users to scroll a list and
  identify the correct store.
- Users accidentally occasionally choose the wrong store, causing the purchases to be recorded
  incorrectly.

To address these issues, we embedded unique geolocated QR codes on the in-store displays for each
store. It paved the way for a faster onboarding experience. Users simply scan the geolocated QR
codes printed on marketing material present in the stores to access the Scan & Go web application.
This way, they can avoid typing in the web address `mishipay.shop` to access the service.

<figure>
  {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/NqyMBZGYzGSNqLE7soXR.mp4", autoplay=true, muted=true, playsinline=true, loop=true, width=1296, height=600 %}
  <figcaption>
    In-store scanning experience using the PWA.
  </figcaption>
</figure>

### Scanning products

A core feature in the MishiPay app is the barcode scanning as this empowers our users to scan their
own purchases and see the running total even before they would otherwise have reached a cash
register.

To build a scanning experience on the web, we have identified three core layers.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/jRJeqbGW7yqU8VpdbjBO.png", alt="Diagram showing the three main thread layers: video stream, processing layer, and decoder layer.", width="800", height="358" %}

### Video stream

With the help of the
[`getUserMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) method, we
can access the user's rear view camera with the constraints listed below. Invoking the method
automatically triggers a prompt for users to accept or deny access to their camera. Once we have
access to the video stream, we can relay it to a video element as shown below:

```js
/**
 * Video Stream Layer
 * https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia
 */
const canvasEle = document.getElementById('canvas');
const videoEle = document.getElementById('videoElement');
const canvasCtx = canvasEle.getContext('2d');
fetchVideoStream();
function fetchVideoStream() {
  let constraints = { video: { facingMode: 'environment' } };
  if (navigator.mediaDevices !== undefined) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoEle.srcObject = stream;
        videoStream = stream;
        videoEle.play();
        // Initiate frame capture - Processing Layer.
      })
      .catch((error) => {
        console.debug(error);
        console.warn(`Failed to access the stream:${error.name}`);
      });
  } else {
    console.warn(`getUserMedia API not supported!!`);
  }
}
```

### Processing layer

For detecting a barcode in a given video stream, we need to periodically capture frames and transfer
them to the decoder layer. To capture a frame, we simply draw the streams from `VideoElement` onto
an `HTMLCanvasElement` using the
[`drawImage()`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage)
method of the [Canvas API](https://developer.mozilla.org/docs/Web/API/Canvas_API).

```js
/**
 * Processing Layer - Frame Capture
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
 */
async function captureFrames() {
  if (videoEle.readyState === videoEle.HAVE_ENOUGH_DATA) {
    const canvasHeight = (canvasEle.height = videoEle.videoHeight);
    const canvasWidth = (canvasEle.width = videoEle.videoWidth);
    canvasCtx.drawImage(videoEle, 0, 0, canvasWidth, canvasHeight);
    // Transfer the `canvasEle` to the decoder for barcode detection.
    const result = await decodeBarcode(canvasEle);
  } else {
    console.log('Video feed not available yet');
  }
}
```

For advanced use cases, this layer also performs some pre-processing tasks such as cropping,
rotating, or converting to grayscale. These tasks can be CPU-intensive and result in the application
being unresponsive given that barcode scanning is a long-running operation. With the help of the
[OffscreenCanvas](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) API, we can offload
the CPU-intensive task to a web worker. On devices that support hardware graphics acceleration,
WebGL API and its
[`WebGL2RenderingContext`](https://developer.mozilla.org/docs/Web/API/WebGL2RenderingContext) can
optimize gains on the CPU-intensive pre-processing tasks.

### Decoder layer

The final layer is the decoder layer which is responsible for decoding barcodes from the frames
captured by the processing layer. Thanks to the
[Shape Detection API](https://developer.mozilla.org/docs/Web/API/Barcode_Detection_API) (which is
not yet available on all browsers) the browser itself decodes the barcode from an
`ImageBitmapSource`, which can be an `img` element, an SVG `image` element, a `video` element, a
`canvas` element, a `Blob` object, an `ImageData` object, or an `ImageBitmap` object.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/GR4od5fHOxys6lrxttPn.png", alt="Diagram showing the three main thread layers: video stream, processing layer, and Shape Detection API.", width="800", height="358" %}

```js
/**
 * Barcode Decoder with Shape Detection API
 * https://web.dev/shape-detection/
 */
async function decodeBarcode(canvas) {
  const formats = [
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
    'upc_e',
  ];
  const barcodeDetector = new window.BarcodeDetector({
    formats,
  });
  try {
    const barcodes = await barcodeDetector.detect(canvas);
    console.log(barcodes);
    return barcodes.length > 0 ? barcodes[0]['rawValue'] : undefined;
  } catch (e) {
    throw e;
  }
}
```

For devices that don't support the Shape Detection API yet, we need a fallback solution to decode
the barcodes. The Shape Detection API exposes a
[`getSupportedFormats()`](https://developer.mozilla.org/docs/Web/API/BarcodeDetector/getSupportedFormats)
method which helps switch between the Shape Detection API and the fallback solution.

```js
// Feature detection.
if (!('BarceodeDetector' in window)) {
  return;
}
// Check supported barcode formats.
BarcodeDetector.getSupportedFormats()
.then((supportedFormats) => {
  supportedFormats.forEach((format) => console.log(format));
});
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/GmrPC7mFTdtsEdS1BDWp.png", alt="Flow diagram showing how, dependent on Barcode Detector support and the supported barcode formats, either the Shape Detection API or the fallback solution  is being used.", width="800", height="404" %}

### Fallback solution

Several open-source and enterprise scanning libraries are available that can be easily integrated
with any web application to implement scanning. Here are some of the libraries that MishiPay
recommend.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Library Name</th>
        <th>Type</th>
        <th>Wasm Solution</th>
        <th>Barcode Formats</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/serratus/quaggaJS">QuaggaJs</a></td>
        <td>Open Source</td>
        <td>No</td>
        <td>1D</td>
      </tr>
      <tr>
        <td><a href="https://github.com/zxing-js/library">ZxingJs</a></td>
        <td>Open Source</td>
        <td>No</td>
        <td>1D & 2D (Limited)</td>
      </tr>
      <tr>
        <td><a href="https://codecorp.com/products">CodeCorp</a></td>
        <td>Enterprise</td>
        <td>Yes</td>
        <td>1D & 2D</td>
      </tr>
      <tr>
        <td><a href="https://docs.scandit.com/stable/web/">Scandit</a></td>
        <td>Enterprise</td>
        <td>Yes</td>
        <td>1D & 2D</td>
      </tr>
    </tbody>
    <caption style="max-width:initial;">
      Comparison of open-source and commercial barcode scanning libraries
    </caption>
  </table>
</div>

All the above libraries are full-fledged SDKs that compose all the layers discussed above. They also
expose interfaces to support various scanning operations. Depending on the barcode formats and
detection speed needed for the business case, a decision can be between Wasm and non-Wasm solutions.
Despite the overhead of requiring an additional resource (Wasm) to decode the barcode, Wasm
solutions outperform the non-Wasm solution in terms of accuracy.

[Scandit](https://docs.scandit.com/stable/web/) was our primary choice. It supports all barcode
formats required for our business use cases; it beats all the available open-source libraries in
scanning speed.

## Future of scanning

Once the Shape Detection API is fully supported by all major browsers, we could potentially have a
new HTML element `<scanner>` that has the capabilities required for a barcode scanner. Engineering
at MishiPay believes there is a solid use case for the barcode scanning functionality to be a new
HTML element due to the growing number of open source and licensed libraries that are enabling
experiences such as Scan & Go and many others.

## Conclusion

App fatigue is an issue that developers face when their products enter the market. Users often want
to understand the value that an application gives them before they download it. In a store, where
MishiPay saves shoppers' time and improves their experience, it is counterintuitive to wait for a
download before they can use an application. This is where our PWA helps. By eliminating the barrier
to entry, we have increased our transactions by 10 times and enabled our users to save 2.5 years of
waiting in the queue.

## Acknowledgements

This article was reviewed by [Joe Medley](https://github.com/jpmedley).

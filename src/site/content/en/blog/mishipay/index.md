---
title: MishiPay's PWA increases transactions by 10× and saves 2.5 years of queuing
subhead: Learn how switching to PWA helped MishiPay's business.
authors:
  - nikilmathew
  - thomassteiner
description:
date: 2022-03-28
# updated: 2022-03-28
tags:
  - blog
  - capabilities
  - case-study
  - progressive-web-apps
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/jyVxx3oZ5TiBF0CP4C1O.jpeg
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
were platform-specific iOS and Android applications, and our early adopters loved the technology.
Read on to learn how switching to PWA increased transactions by 10× and saved 2.5 years of queuing!

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

Users find our technology incredibly helpful when waiting in the queue, as it allows them to skip
the queue and have a seamless in-store experience. But the hassle of downloading an Android or iOS
application made users not choose our technology despite the value. It was a growing challenge for
MishiPay, and we needed to increase user adoption with seamless user onboarding.

## Solution

Our efforts of building and launching the PWA helped us remove the hassle and encouraged new users
to try our technology inside a physical store, skip the queue, and have a seamless shopping
experience. Since the launch, we have seen a massive spike in user adoption with our PWA compared to
our platform-specific applications.

<div class="switcher">
  <figure>
    {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/cs0PXp0masvpoIqD9Dfw.mp4", autoplay=true, muted=true, playsinline=true, loop=true, width=332, height=720 %}
    <figcaption>
      Installing and launching the Android app (slower).
    </figcaption>
  </figure>
  <figure>
    {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/F4krjSntmEbFzhE2XXyc.mp4", autoplay=true, muted=true, playsinline=true, loop=true, width=332, height=720 %}
    <figcaption>
      Directly launching the PWA (faster).
    </figcaption>
  </figure>
</div>

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
API along with an IP-based fallback solution. This approach worked well in the earlier versions of
our app, but was later proven to be a huge pain point for our end-users due to the following
reasons: Location inaccuracies in the IP-based fallback solutions A growing listing of MishiPay
enabled stores per region requires the users to scroll/search the list and identify the correct
store Users accidentally choose the wrong store, causing the purchases to be recorded incorrectly.

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

To address the above issues, we embedded unique geolocated QR codes on the marketing materials for
each store. It paved the way for a faster onboarding experience. Users simply scan the geolocated QR
codes printed on marketing material present in the stores to access the Scan & Go web application.
This way, they can avoid typing in the web address `mishipay.shop` to access our services.

<figure>
  {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/NqyMBZGYzGSNqLE7soXR.mp4", autoplay=true, muted=true, playsinline=true, loop=true, width=1296, height=600 %}
  <figcaption>
    In-store scanning experience using the PWA.
  </figcaption>
</figure>

### Scanning products

One of the most loved features in our app is the barcode scanning as this empowers our users to scan
the product they wish to buy and see the running total even before they handover the product at the
traditional cash register. To build a scanning experience on the Web, we have identified three core
layers.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/jRJeqbGW7yqU8VpdbjBO.png", alt="Diagram showing the three main thread layers: video stream, processing layer, and decoder layer.", width="800", height="358" %}

### Video stream

With the help of the
[`getUserMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) API, we can
gain access to the user's rearview camera with the below constraints. Invoking the API would
automatically trigger the user prompt asking for permission to allow or deny the request to access
their camera. Once we have access to the video stream, we can relay it to a video element as shown
below:

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
  let constraints = {video: {facingMode: 'environment'}};
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

For detecting the barcodes from a given video stream, we need to periodically capture the frames and
transfer them to the decoder layer. To capture a frame, we simply draw the streams from
`VideoElement` onto an `HTMLCanvasElement` using the
[`drawImage()`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage)
method of the [Canvas API](https://developer.mozilla.org/docs/Web/API/Canvas_API).

```js
/**
 * Processing Layer - Frame Capture
 * https://developer.mozilla.org/docs/Web/API/Canvas_API/Manipulating_video_using_cacanvas
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
rotation, and converting to grayscale. These tasks can be CPU-intensive and result in the
application being unresponsive given barcode scanning is a long-running operation. With the help of
the [OffscreenCanvas](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) API, we can
offload the CPU-intensive task to a web worker. On devices that support hardware graphics
acceleration, leveraging WebGL API and its
[`WebGL2RenderingContext`](https://developer.mozilla.org/docs/Web/API/WebGL2RenderingContext) can be
a strategy for some optimization gains on the CPU-intensive pre-processing tasks.

### Decoder layer

The final layer is the decoder layer that is responsible for decoding the barcodes from the frames
captured by the processing layer. Thanks to the
[Shape Detection API](https://developer.mozilla.org/docs/Web/API/Barcode_Detection_API),
starting from Chromium&nbsp;83, the browser itself supports the functionality of decoding a barcode
from an `ImageBitmapSource`, which can be an `img` element, an SVG `image` element, a `video`
element, a `canvas` element, a `Blob` object, an `ImageData` object, or an `ImageBitmap` object.

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

For devices that don't support the Shape Detection API yet, we would need a fallback solution to
decode the barcodes. The Shape Detection API exposes a
[`getSupportedFormats()`](https://developer.mozilla.org/docs/Web/API/BarcodeDetector/getSupportedFormats)
method that can also be used as a deciding factor by the decoding layer to decide between the Shape
Detection API and the fallback solution.

```js
// Check supported barcode formats.
BarcodeDetector.getSupportedFormats().then((supportedFormats) => {
  supportedFormats.forEach((format) => console.log(format));
});
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/oYmpkpsdwmtA8e440F9I.png", alt="Flow diagram showing how dependent on the Barcode Detector support and the supported barcode formats either the Shape Detection API is being used or the fallback solution.", width="800", height="404" %}

### Fallback solution

Several open-source and enterprise scanning libraries are available that can be easily integrated
with any web application to build a scanning experience. Here are some of the libraries that we
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

All the above libraries are fully-fledged SDKs that compose all the layers discussed above. They
also expose interfaces to cater to various scanning operations. Depending upon the barcode formats
needed for the business case, a decision can be between Wasm and non-Wasm solutions. Despite the
overhead of requiring an additional resource (Wasm) to decode the barcode, Wasm solutions outperform
the non-Wasm solution in terms of accuracy.

[Scandit](https://docs.scandit.com/stable/web/) has been our primary choice. It supports all barcode
formats required for our business use cases; it beats all the available open-source libraries in
scanning speed.

## Future of scanning

Once the Shape Detection API is fully supported by all major browsers, we could potentially have a
new HTML element `<scanner>` that has the capabilities required for a barcode scanner. We believe
there is a solid use case for the barcode scanning functionality to be a new HTML element due to the
growing number of open source and licensed libraries that are enabling experiences such as Scan & Go
and many others.

## Conclusion

App fatigue is an issue that developers face when their products enter the market. Users often want
to understand the value that an application delivers for them before they commit to downloading it.
In a store setting, where MishiPay has been positioned to save shoppers' time and improve their
experience in store, it is counterintuitive to have to insist that a user takes time to download an
application before they can use it. This is where our PWA has facilitated a step change in adoption.
By eliminating the barrier to entry, we have increased our transactions by 10× and enabled our users
to save 2.5 years of waiting in the queue.

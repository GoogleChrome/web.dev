---
title: Compression and decompression in the browser with the Compression Streams API
subhead: >
  Write smaller web apps that don't need to ship their owm compression or decompression library
date: 2022-08-26
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/koW7cNlWa6BUlJsQR4wI.jpg
alt: Clamp to symbolize how data gets compressed.
author: thomassteiner
tags:
  - blog
---

The [Compression Streams API](https://developer.mozilla.org/docs/Web/API/Compression_Streams_API)
provides a JavaScript API for compressing and decompressing streams of data using the gzip or
deflate (or deflate-raw) formats.

Built in compression means that JavaScript applications will not need to include a compression
library, which makes the download size of the application smaller. After Chrome, now Safari, too,
supports this useful API. You can use it as shown in the snippet below.

```js
const readableStream = await fetch('lorem.txt').then((response) => response.body);
const compressedReadableStream = readableStream.pipeThrough(new CompressionStream('gzip'));
```

To decompress, pipe the compressed stream through the decompression stream.

```js
const decompressedReadableStream = compressedReadableStream.pipeThrough(new DecompressionStream('gzip'));
```

## Demo

{% Glitch 'compressionstream-demo' %}

## Browser support

{% BrowserCompat 'api.CompressionStream' %}

## Acknowledgements

Hero image by [Matt Artz](https://unsplash.com/@mattartz) on
[Unsplash](https://unsplash.com/photos/7_zxKAWCDQI).

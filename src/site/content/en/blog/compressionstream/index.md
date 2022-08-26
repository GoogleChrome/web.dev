---
title: CompressionStream is now supported in Safari and Chrome
subhead: >
  Now that compression streams are supported in Chrome and Safari, they're ready for prime time!
date: 2022-08-25
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/koW7cNlWa6BUlJsQR4wI.jpg
alt: Clamp.
author: thomassteiner
tags:
  - blog
---

{% Aside 'celebration' %} This web feature is now available in two major browser engines!
{% endAside %}

The [Compression Streams API](https://developer.mozilla.org/docs/Web/API/Compression_Streams_API)
provides a JavaScript API for compressing and decompressing streams of data using the gzip or
deflate (or deflate-raw) formats.

Built in compression means that JavaScript applications will not need to include a compression
library, which makes the download size of the application smaller. After Chrome, now Safari, too,
supports this useful API.

```js
const readableStream = await fetch('lorem.txt').then((response) => response.body);
const compressedReadableStream = readableStream.pipeThrough(new CompressionStream('gzip'));
```

## Demo

{% Glitch 'compressionstream-demo' %}

## Browser support

{% BrowserCompat 'api.CompressionStream' %}

## Acknowledgements

Hero image by [Matt Artz](https://unsplash.com/@mattartz) on
[Unsplash](https://unsplash.com/photos/7_zxKAWCDQI).

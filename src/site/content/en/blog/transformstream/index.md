---
title: TransformStream is now supported cross-browser
subhead: >
  Now that transform streams are supported in Chrome, Safari, and Firefox, they're finally ready for
  prime time!
date: 2022-07-01
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/mYb1fWj36xhm6z1hQnz5.jpg
alt: Transformer toy figurine.
author: thomassteiner
tags:
  - blog
  - newly-interoperable
---

{% Aside 'celebration' %}
Woohoo, this web feature is now usable on all browsers.
{% endAside %}

The [Streams API](/streams/) allows you to break down a resource that you want to receive, send, or transform into small chunks, and then process these chunks bit by bit. Recently, Firefox 102
[started to support `TransformStream`](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/102#apis),
which means [`TransformStream`](https://developer.mozilla.org/docs/Web/API/TransformStream) is now
finally usable across browsers. Transform streams allow you to pipe from a
[`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) to a
[`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream), executing a
transformation on the chunks, or consume the transformed result directly,
as shown in the following example.

```js
class UpperCaseTransformStream {
  constructor() {
    return new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk.toUpperCase());
      },
    });
  }
}

button.addEventListener('click', async () => {
  const response = await fetch('/script.js');
  const readableStream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new UpperCaseTransformStream());

  const reader = readableStream.getReader();
  pre.textContent = '';
  while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      pre.textContent += value;
  }
});
```

## Demo

{% Glitch 'transformstream-demo' %}

## Browser support

{% BrowserCompat 'api.TransformStream' %}

## Acknowledgements

Hero image by <a href="https://unsplash.com/@tetrakiss">Arseny Togulev</a> on <a href="https://unsplash.com/s/photos/transformer">Unsplash</a>

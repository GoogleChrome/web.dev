---
layout: post
title: 使用 fetch API 流式处理请求
authors:
  - jakearchibald
description: Chrome 从版本 95 开始支持上传流，这意味着可以在整个请求主体可用之前开始处理请求。
date: 2020-07-22
updated: 2021-09-22
hero: image/admin/9U7u4C7WCGbrdHm3181W.jpg
alt: 一艘指向上游的独木舟。
tags:
  - blog
  - chrome-95
  - network
  - service-worker
feedback:
  - api
---

从 Chrome 95 开始，通过使用 Streams API，可以在整个请求主体可用之前开始处理请求。

这可以用来：

- 预热服务器。换句话说，一旦用户焦点落在文本输入字段，就可以开始处理请求，并除去所有标头，然后等到用户按下“发送”，再发送他们输入的数据。
- 陆续发送客户端上生成的数据，例如音频、视频或输入数据。
- 通过 HTTP 重新创建 Web 套接字。

但由于这是一个低级 Web 平台功能，不要被*我的*想法限制。也许您可以想到更令人兴奋的请求流用例。

## 演示 {: #demo }

{% Glitch { id: 'fetch-request-stream', path: 'index.html', height: 480 } %}

这展示了如何将用户数据流式传输到服务器，并发送回可以实时处理的数据。

好吧，这不是最有想象力的示例，我只是想简单一点，好吗？

总之，这是怎么实现的？

## 前情提要：fetch 流的令人兴奋的冒险

所有现代浏览器支持*响应*流已经有一段时间了。通过这些流，您可以在响应从服务器到达时访问部分响应：

```js
const response = await fetch(url);
const reader = response.body.getReader();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log('Received', value);
}

console.log('Response fully received');
```

每个 `value` 都是一个 `Uint8Array` 字节。获得的数组数量和数组大小取决于网络速度。如果使用快速连接，将获得更少、更大的数据“块”。如果连接速度较慢，将获得更多、更小的数据块。

如果要将这些字节转换为文本，可以使用 [`TextDecoder`](https://developer.mozilla.org/docs/Web/API/TextDecoder/decode)，如果[目标浏览器支持](https://caniuse.com/#feat=mdn-api_textdecoderstream)的话，还可以使用更新的转换流：

```js
const response = await fetch(url);
const reader = response.body
  .pipeThrough(new TextDecoderStream())
  .getReader();
```

`TextDecoderStream` 是一个转换流，可抓取所有 `Uint8Array` 块并将它们转换为字符串。

流非常好用，因为在数据到达时就可以开始对其操作。例如，如果接收由 100 个“结果”构成的列表，只要收到第一个结果就可以立即显示出来，而不用等待收到全部 100 个结果。

总之，这就是响应流，我想谈论的令人兴奋的新东西是请求流。

## 流式请求主体

请求主体可以是：

```js
await fetch(url, {
  method: 'POST',
  body: requestBody,
});
```

以前，需要整个请求主体就绪，才能开始处理请求，但现在在 Chrome 95 中，您可以提供您自己的数据 `ReadableStream`：

```js
function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const stream = new ReadableStream({
  async start(controller) {
    await wait(1000);
    controller.enqueue('This ');
    await wait(1000);
    controller.enqueue('is ');
    await wait(1000);
    controller.enqueue('a ');
    await wait(1000);
    controller.enqueue('slow ');
    await wait(1000);
    controller.enqueue('request.');
    controller.close();
  },
}).pipeThrough(new TextEncoderStream());

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: stream,
});
```

以上代码将向服务器发送“This is a slow request”，一次发送一个单词，相邻发送之间有一秒暂停。

请求主体的每个块都需要是一个 `Uint8Array` 字节，因此我使用 `pipeThrough(new TextEncoderStream())` 进行转换。

### 可写流

有时，如果有 `WritableStream`，处理流会更容易。您可以使用“标识”流来实现这一点，它是一个可读/可写对，接受传递到其可写端的任何内容，然后将其发送到可读端。您可以通过创建一个不带任何参数的 `TransformStream` 来创建这样一个流：

```js
const { readable, writable } = new TransformStream();

const responsePromise = fetch(url, {
  method: 'POST',
  body: readable,
});
```

现在，您发送到该可写流的任何内容都将成为请求的一部分。这样便可以将流组合在一起。例如，以下示例从一个 URL 获取数据，然后压缩并发送到另一个 URL：

```js
// Get from url1:
const response = await fetch(url1);
const { readable, writable } = new TransformStream();

// Compress the data from url1:
response.body
  .pipeThrough(new CompressionStream('gzip'))
  .pipeTo(writable);

// Post to url2:
await fetch(url2, {
  method: 'POST',
  body: readable,
});
```

上面的示例使用[压缩流](https://chromestatus.com/feature/5855937971617792)来通过 gzip 压缩任意数据。

### 功能检测

```js
const supportsRequestStreamsP = (async () => {
  const supportsStreamsInRequestObjects = !new Request('', {
    body: new ReadableStream(),
    method: 'POST',
  }).headers.has('Content-Type');

  if (!supportsStreamsInRequestObjects) return false;

  return fetch('data:a/a;charset=utf-8,', {
    method: 'POST',
    body: new ReadableStream(),
  }).then(() => true, () => false);
})();

// Note: supportsRequestStreamsP is a promise.
if (await supportsRequestStreamsP) {
  // …
} else {
  // …
}
```

如果您感到好奇，以下是功能检测的原理：

如果浏览器不支持特定的 `body` 类型，它会针对对象调用 `toString()`，并将结果用作主体。因此，如果浏览器不支持请求流，则请求主体将变为字符串 `"[object ReadableStream]"`。当使用字符串作为主体时，会顺便将 `Content-Type` 标头设置为 `text/plain;charset=UTF-8`。因此，如果设置了该标头，我们就知道浏览器*不*支持请求对象中的流，我们可以提早退出。

不幸的是，虽然 Safari*{nbsp}*支持请求对象中的流，但*不*允许与 `fetch` 一起使用。

为了测试这一点，我们尝试对流主体 `fetch`。如果依赖于网络，那么测试将不稳定和缓慢，但庆幸的是，规范中的一种 quirk（怪异模式）允许对 `data:` URL 发出 `POST` 请求。这样做很快并且无需连接。Safari 将拒绝此调用，因为它不支持流主体。

## 限制

流式请求是 Web 的新能力，因此还有一些限制：

### 重定向受限

某些形式的 HTTP 重定向要求浏览器将请求主体重新发送到另一个 URL。为了支持这一点，浏览器必须对流的内容进行缓冲，这在某种程度上违背了初衷，所以它不会这样做。

相反，如果请求具有流主体，并且响应是除 303 以外的 HTTP 重定向，则 fetch 将拒绝并且*不会*遵循重定向。

303 重定向是被允许的，因为它们显式地将方法更改为 `GET` 并丢弃请求主体。

### 默认仅限 HTTP/2

默认情况下，如果连接不是 HTTP/2，fetch 将被拒绝。如果要通过 HTTP/1.1 使用流式请求，需要选择加入：

```js/3-3
await fetch(url, {
  method: 'POST',
  body: stream,
  allowHTTP1ForStreamingUpload: true,
});
```

{% Aside 'caution' %} `allowHTTP1ForStreamingUpload` 是非标准的，只会作为 Chrome 实验性实现的一部分来使用。{% endAside %}

根据 HTTP/1.1 规则，请求和响应主体需要发送 `Content-Length` 标头，以便另一方知道将接收多少数据，或者更改消息的格式以使用[块编码](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)。使用块编码时，主体分成几个部分，每个部分都有自己的内容长度。

块编码在 HTTP/1.1 *响应*中很常见，但在*请求*中非常少见。正因为如此，Chrome 有些担心兼容性，所以现在才选择加入。

{% Aside %} 这对 HTTP/2 来说不是问题，因为 HTTP/2 数据总是“分块”的，尽管它会调用块[帧](https://developers.google.com/web/fundamentals/performance/http2#streams_messages_and_frames)。块编码直到 HTTP/1.1 才被引入，因此具有流式主体的请求在 HTTP/1 连接上总是会失败。{% endAside %}

根据这次试验的进展情况，规范会将流式响应限制为 HTTP/2，或者始终允许 HTTP/1.1 和 HTTP/2。

### 无双工通信

HTTP 的一个鲜为人知的特性（尽管这是否为标准行为取决于您问的人）是，可以在发送请求的同时开始接收响应。然而，它是如此鲜为人知，以至于服务器和浏览器都没有很好地支持。

在 Chrome 的当前实现中，您在主体被完整发送之前不会收到响应。在下面的示例中，`responsePromise` 在可读流关闭之前不会解析。服务器在这之前发送的任何内容都将被缓冲。

```js
const responsePromise = fetch(url, {
  method: 'POST',
  body: readableStream,
});
```

仅次于双工通信的是对流式请求进行一次 fetch，然后进行另一次 fetch 接收流式响应。服务器需要某种方式来关联这两个请求，例如 URL 中的 ID。这就是[演示](#demo)的原理。

## 潜在问题

这是一个新功能，如今在互联网上并未得到充分利用。以下是一些需要注意的问题：

### 服务器端不兼容

一些应用服务器不支持流式请求，而是等待接收完整请求，然后才显示出来，这有点违背初衷。请改用支持流的应用服务器，如 [NodeJS](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage)。

但是，问题还不止于此！NodeJS 等应用服务器通常位于所谓的“前端服务器”后面，而后者又可能位于 CDN 后面。如果其中任何一个服务器决定先对请求进行缓冲，再提供给链中的下一个服务器，您将失去请求流的优势。

此外，如果使用 HTTP/1.1，其中一个服务器可能没有为块编码做好准备，并且可能失败并出错。但是，至少可以对此进行测试，并在需要时尝试更改服务器。

*……长叹一口气……*

### 不受控制的不兼容性

如果使用 HTTPS，则无需担心您和用户之间的代理，但用户可能会在他们的机器上运行代理。一些互联网保护软件会这样做，以监控浏览器和网络之间的所有内容。

在某些情况下，此类软件会缓冲请求主体，或者在使用 HTTP/1.1 的情况下，它不需要块编码，并以某种激动人心的方式中断。

目前，尚不清楚这种情况会多久发生一次，如果真会发生的话。

如果要防止这种情况发生，可以创建一个类似于[上面演示](#demo)的“功能测试”，在其中尝试流式传输一些数据而不关闭流。如果服务器接收到数据，它可以通过不同的 fetch 进行响应。一旦发生这种情况，您就知道客户端支持端到端流式请求。

## 欢迎反馈

社区的反馈对于新 API 的设计至关重要，所以请进行试用并告诉我们您的想法！如果您遇到任何错误，请[报告它们](https://bugs.chromium.org/p/chromium/issues/list)，但如果您有一般反馈，请发送到 [blink-network-dev Google Group](https://groups.google.com/a/chromium.org/forum/#!forum/blink-network-dev)。

照片作者：[Unsplash](https://unsplash.com/s/photos/canoe-stream?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) 上的 [Laura Lefurgey-Smith](https://unsplash.com/@lauralefurgeysmith?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

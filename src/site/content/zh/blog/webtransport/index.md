---
title: 尝试使用 WebTransport
subhead: WebTransport 是一种新的 API，提供低延迟、双向、客户端-服务器消息传递。了解有关其用例的更多信息，以及如何就实施的未来提供反馈。
authors:
  - jeffposnick
description: WebTransport 是一种新的 API，提供低延迟、双向、客户端-服务器消息传递。了解有关其用例的更多信息，以及如何就实施的未来提供反馈。
date: 2020-06-08
updated: 2021-09-29
hero: image/admin/Wh6q6ughWxUYcu4iOutU.jpg
hero_position: center
alt: |2-

  车流疾驶而过的照片。
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/793759434324049921"
tags:
  - blog
  - capabilities
  - network
feedback:
  - api
---

{% Aside 'caution' %}此提案在初始试用期内会继续更改。浏览器实现与本文中的信息可能存在差异。

有关这篇不断完善的提案的最新信息，请阅读 [WebTransport 编辑草稿](https://w3c.github.io/webtransport/)。

提案定稿后，我们将按最新信息更新本文和相关代码示例。 {% endAside %}

## 背景

### 什么是 WebTransport？

[WebTransport](https://w3c.github.io/webtransport/) 是一个 Web API，使用 [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) 协议作为双向传输。它用于 Web 客户端和 HTTP/3 服务器之间的双向通信。[它支持通过其数据报 API](#datagram) 以不可靠方式发送数据，以及通过其[流 API](#stream) 以可靠方式发送数据。

[数据报](https://tools.ietf.org/html/draft-ietf-quic-datagram-00)非常适合发送和接收不需要严格保证交付的数据。单个数据包的大小受到[底层连接的最大传输单元 (MTU)](https://en.wikipedia.org/wiki/Maximum_transmission_unit) 的限制，可能会或可能不会成功传输，如果传输，它们可能以任意顺序到达。这些特性使数据报 API 成为低延迟、尽力而为的数据传输的理想选择。您可以将数据报视为[用户数据报协议 (UDP)](https://en.wikipedia.org/wiki/User_Datagram_Protocol) 消息，但经过加密和拥塞控制。

相比之下，流 API 提供[可靠](https://en.wikipedia.org/wiki/Reliability_(computer_networking))、有序的数据传输，[非常适合](https://quicwg.org/base-drafts/draft-ietf-quic-transport.html#name-streams)需要发送或接收一个或多个有序数据流的场景。使用多个 WebTransport 流类似于建立多个 [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) 连接，但由于 HTTP/3 在[底层使用了轻量级的 QUIC](https://www.chromium.org/quic) 协议，因此可以在没有太多开销的情况下打开和关闭。

### 用例

下面简要列出了开发人员对 WebTransport 可能的几种使用示例。

- 通过小型、不可靠、无序的消息，以最小的延迟定期向服务器发送游戏状态。
- 以最小的延迟接收从服务器推送的媒体流，独立于其他数据流。
- 在网页打开时接收从服务器推送的通知。

在初始试用中，我们有兴趣[了解更多](#feedback)有关您计划如何使用 WebTransport 的信息。

{% Aside %}此提案中的许多概念之前都曾在早期的 QuicTransport 初始试用中进行过试验，但最终并未作为 Chrome 的一部分发布。

WebTransport 有助于与 QuicTransport 类似的用例，主要区别在于 [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) 而不是 [QUIC](https://www.chromium.org/quic) 是底层传输协议。 {% endAside %}

## 当前状态 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">步骤</th>
<th data-md-type="table_cell">状态</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 创建解释器</td>
<td data-md-type="table_cell"><a href="https://github.com/w3c/webtransport/blob/main/explainer.md" data-md-type="link">完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 创建规范的初稿</td>
<td data-md-type="table_cell"><a href="https://w3c.github.io/webtransport/" data-md-type="link">完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. 收集反馈并迭代设计</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">进行中</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">4. 初始试用</strong></td>
<td data-md-type="table_cell"><a href="#register-for-ot" data-md-type="link"><strong data-md-type="double_emphasis">进行中</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 启动</td>
<td data-md-type="table_cell">未开始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## WebTransport 与其他技术的关系

### WebTransport 可以替代 WebSockets 吗？

也许可以。在某些用例中，[WebSockets](https://developer.mozilla.org/docs/Web/API/WebSockets_API) 或 WebTransport 可作为可用的有效通信协议。

WebSockets 通信围绕单一、可靠、有序的消息流建模，这对于某些类型的通信需求来说是很好的。如果您需要这些特性，那么 WebTransport 的流 API 也可以提供它们。相比之下，WebTransport 的数据报 API 提供低延迟交付，但不保证可靠性或排序，因此它们不能直接替代 WebSocket。

通过数据报 API 或多个并发 Streams API 实例使用 WebTransport，意味着您不必担心[队列阻塞](https://en.wikipedia.org/wiki/Head-of-line_blocking)，这可能是 WebSockets 的问题。此外，在建立新连接时还有性能优势，因为底层 [QUIC 握手](https://www.fastly.com/blog/quic-handshake-tls-compression-certificates-extension-study)比通过 TLS 启动 TCP 更快。

WebTransport 属于新草案规范，因此围绕客户端和服务器库的 WebSocket 生态系统目前更加强大。如果您需要具有通用服务器设置和广泛的 Web 客户端支持的“开箱即用”工具，WebSockets 是目前更好的选择。

### WebTransport 是否与 UDP 套接字 API 相同？

不相同。WebTransport 不是 [UDP 套接字 API](https://www.w3.org/TR/raw-sockets/) 。虽然 WebTransport 使用 HTTP/3，而后者又在“幕后”使用 UDP，但 WebTransport 对加密和拥塞控制有要求，这使其不仅仅是基本的 UDP 套接字 API。

### WebTransport 可以替代 WebRTC 数据通道吗？

可以，用于客户端-服务器连接。 [WebTransport 与 WebRTC 数据通道](https://developer.mozilla.org/docs/Web/API/RTCDataChannel)共享许多相同的属性，尽管底层协议不同。

{% Aside %}WebRTC 数据通道支持点对点通信，但 WebTransport 仅支持客户端-服务器连接。如果您有多个客户端需要直接相互通信，那么 WebTransport 不是一个可行的选择。 {% endAside %}

通常，与维护 WebRTC 服务器相比，运行兼容 HTTP/3 的服务器需要更少的设置和配置，后者涉及了解多种协议（[ICE](https://developer.mozilla.org/docs/Web/API/WebRTC_API/Connectivity#ICE_candidates) 、 [DTLS](https://webrtc-security.github.io/#4.3.1.) 和 [SCTP](https://developer.mozilla.org/docs/Web/API/RTCSctpTransport)）以获得有效的传输。WebRTC 需要更多可能导致客户端/服务器协商失败的移动部分。

WebTransport API 的设计考虑了 Web 开发人员的用例，与使用 WebRTC 的数据通道接口相比，它更像是编写现代 Web 平台代码。[与 WebRTC 不同的](https://bugs.chromium.org/p/chromium/issues/detail?id=302019)[是，Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) 内部支持 WebTransport，它允许您独立于给定的 HTML 页面执行客户端-服务器通信。由于 WebTransport 有一个兼容[流](https://streams.spec.whatwg.org/)的接口，因此支持围绕[背压](https://streams.spec.whatwg.org/#backpressure)的优化。

但是，如果您已经有一个满意的 WebRTC 客户端/服务器设置，那么切换到 WebTransport 可能不会带来很多优势。

## 试试看

试验 WebTransport 的最佳方法是在本地启动兼容的 HTTP/3 服务器。（遗憾的是，目前没有与最新规范兼容的公共参考服务器。）然后，您可以将此页面与[基本 JavaScript 客户端](https://googlechrome.github.io/samples/webtransport/client.html)一起使用来试验客户端/服务器通信。

## 使用 API

WebTransport 的设计基于现代 Web 平台基本类型（如 [Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API)）。它在很大程度上依赖于 [promise](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises)，并且可以很好地与 [<code>async</code> 和 <code>await</code>](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Async_await) 配合使用。

WebTransport [初始试用](#register-for-ot)支持三种不同类型的流量：数据报以及单向流和双向流。

### 连接到服务器

您可以通过创建 `WebTransport` 实例连接到 HTTP/3 服务器。URL 的模式应为 `https`。您需要直接指定端口号。

您应该使用 `ready` promise 来等待建立连接。在完成设置之前，不会履行该 promise，如果在 QUIC/TLS 阶段连接失败，被拒绝该 promise。

`closed` promise 在连接正常关闭时会履行，如果意外关闭，则会被拒绝。

如果服务器由于[客户端指示](https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.2)错误（如 URL 的路径无效）而拒绝连接，则会导致 `closed` 拒绝，而 `ready` 仍未解析。

```js
const url = 'https://example.com:4999/foo/bar';
const transport = new WebTransport(url);

// 或者，可以选择设置函数以响应
// 连接关闭:
transport.closed.then(() => {
  console.log(`The HTTP/3 connection to ${url} closed gracefully.`);
}).catch((error) => {
  console.error('The HTTP/3 connection to ${url} closed due to ${error}.');
});

// 一旦 .ready 满足，就可以使用连接。
await transport.ready;
```

### 数据报 API {: #datagram }

一旦您拥有连接到服务器的 WebTransport 实例，您就可以使用它来发送和接收离散的数据位，称为[数据报](https://en.wikipedia.org/wiki/Datagram)。

`writeable` getter 返回一个 <code>[WritableStream](https://developer.mozilla.org/docs/Web/API/WritableStream)</code>，Web 客户端可以使用它向服务器发送数据。<code>readable</code> getter 返回一个 <code>[ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)</code>，允许您侦听来自服务器的数据。这两个流本质上都是不可靠的，因此服务器可能收不到您写入的数据，反之亦然。

两种类型的流都使用 <code>[Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)</code> 实例进行数据传输。

```js
// 向服务器发送两个数据报。
const writer = transport.datagrams.writable.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);

// 从服务器读取数据报。
const reader = transport.datagrams.readable.getReader();
while (true) {
  const {value, done} = await reader.read();
  if (done) {
    break;
  }
  // 值为 Uint8Array。
  console.log(value);
}
```

{% Aside %} Chrome [目前](https://bugs.chromium.org/p/chromium/issues/detail?id=929585)没有为 `ReadableStream` 公开[异步迭代器](https://github.com/whatwg/streams/issues/778)。目前，使用 `getReader()` 方法结合 `while()` 循环是从流中读取的最佳方式。{% endAside %}

### 流 API {: #stream }

连接到服务器后，您还可以使用 WebTransport 通过其 Streams API 发送和接收数据。

所有流的每个块都是一个 `Uint8Array`。与数据报 API 不同，这些流是可靠的。但是每个流都是独立的，因此不能保证跨流的数据顺序。

#### SendStream

<code>[SendStream](https://wicg.github.io/web-transport/#sendstream)</code> 由 Web 客户端使用 <code>WebTransport</code> 实例的 `createSendStream()` 方法创建，该方法返回对 <code>SendStream</code> 的 promise。

使用 <code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code> 的 <code>[close()](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/close)</code> 方法关闭关联的 HTTP/3 连接。浏览器尝试在实际关闭关联的连接之前发送所有挂起的数据。

```js
// 向服务器发送两个 Uint8Array。
const stream = await transport.createSendStream();
const writer = stream.writable.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);
try {
  await writer.close();
  console.log('All data has been sent.');
} catch (error) {
  console.error(`An error occurred: ${error}`);
}
```

同样，使用 <code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code> 的 <code>[abort()](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/abort)</code> 方法将 [QUIC RESET_STREAM](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4) 发送到服务器。使用 <code>abort()</code> 时，浏览器可能会丢弃任何尚未发送的挂起的数据。

```js
const ws = await transport.createSendStream();
const writer = ws.getWriter();
writer.write(...);
writer.write(...);
await writer.abort();
// 并非所有数据都已写入。
```

#### ReceiveStream

<code>[ReceiveStream](https://wicg.github.io/web-transport/#receivestream)</code> 由服务器发起。对于网络客户端，获取 <code>ReceiveStream</code> 的过程分为两步。 首先，它调用 <code>WebTransport</code> 实例的 `receiveStreams()` 方法，该方法返回一个 <code>ReadableStream</code>。该 <code>ReadableStream</code> 的每个块又是一个 <code>ReceiveStream</code>，可用于读取服务器发送的 <code>Uint8Array</code> 实例。

```js
async function readFrom(receiveStream) {
  const reader = receiveStream.readable.getReader();
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    // 值为 Uint8Array
    console.log(value);
  }
}

const rs = transport.receiveStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // 值为 ReceiveStream 的一个实例
  await readFrom(value);
}
```

您可以使用 <code>[ReadableStreamDefaultReader](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)</code> 的 <code>[closed](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/closed)</code> promise 来检测流关闭。当[使用 FIN 位关闭](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.8)底层 HTTP/3 连接时，在读取所有数据后会履行 <code>closed</code> promise。当 HTTP/3 连接突然关闭时（例如，由<code>[STREAM_RESET](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)</code> 关闭)，则 <code>closed</code> promise 会被拒绝。

```js
// 假设一个活动的接收流
const reader = receiveStream.readable.getReader();
reader.closed.then(() => {
  console.log('The receiveStream closed gracefully.');
}).catch(() => {
  console.error('The receiveStream closed abruptly.');
});
```

#### BidirectionalStream

<code>[BidirectionalStream](https://wicg.github.io/web-transport/#bidirectional-stream)</code> 可能由服务器或客户端创建。

Web 客户端可以使用 `WebTransport` 实例的 {code 0}createBidirectionalStream() 方法创建一个，该方法会返回对 `BidirectionalStream` 的 promise。

```js
const stream = await transport.createBidirectionalStream();
// stream 是一个 BidirectionalStream
// stream.readable 是一个 ReadableStream
// stream.writable 是一个 WritableStream
```

您可以使用 `WebTransport` 实例的 `receiveBidirectionalStreams()` 方法侦听服务器创建的 `BidirectionalStream`，该方法返回 `ReadableStream{ /code3}。该 <code data-md-type="codespan">ReadableStream` 的每个块又是一个 `BidirectionalStream`。

```js
const rs = transport.receiveBidrectionalStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // value 是一个 BidirectionalStream
  // value.readable 是一个 ReadableStream
  // value.writable 是一个 WritableStream
}
```

`BidirectionalStream` 只是 `SendStream` 和 `ReceiveStream` 的组合。前两个部分中的示例解释了如何使用它们中的每一个。

### 更多示例

[WebTransport 草案规范](https://wicg.github.io/web-transport/)包括许多额外的内联示例，以及所有方法和属性的完整文档。

## 在初始试用期间启用支持 {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Chrome DevTools 中的 WebTransport

遗憾的是， 初始试用之初，对 WebTransport 的 [Chrome DevTools](https://developer.chrome.com/docs/devtools/) 支持还没有准备好。您可以对[此 Chrome 问题](https://bugs.chromium.org/p/chromium/issues/detail?id=1152290)添加“星标”，以便在 DevTools 界面上收到有关更新的通知。

## 隐私和安全注意事项

有关权威指南，请参阅草案规范的[相应部分](https://wicg.github.io/web-transport/#privacy-security)。

## 反馈 {: #feedback }

Chrome 团队希望了解您在整个初始试用过程中使用此 API 的想法和体验。

### 关于 API 设计的反馈

API 是否存在不按预期工作的情况？或者是否缺少相关部分而让您无法实现自己的想法？

请在 [Web Transport GitHub 存储库](https://github.com/WICG/web-transport/issues)上提交问题或将您的想法添加到现有问题中。

### 实现遇到问题？

您是否发现 Chrome 实现的缺陷？

在 [https://new.crbug.com](https://new.crbug.com) 中提交缺陷。尽可能包括更多的详细信息以及再现缺陷的简单说明。

### 计划使用 API？

您的公开支持有助于 Chrome 团队确定功能的优先级，并向其他浏览器供应商展示支持这些功能的重要性。

- 请确保您已报名[初始试用](https://developer.chrome.com/origintrials/#/view_trial/793759434324049921)以表明您的兴趣并提供您的域和联系信息。
- 请向 [@ChromiumDev](https://twitter.com/chromiumdev) 发送带有  [`#WebTransport`](https://twitter.com/search?q=%23WebTransport&src=typed_query&f=live) 标签的推文，并提供有关您所在地以及使用方式的详细信息。

### 交流区

您可以使用 [web-transport-dev Google Group](https://groups.google.com/a/chromium.org/g/web-transport-dev) 解决一般问题或不属于其他类别的问题。

## 致谢

本文含有来自 [WebTransport Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md) 、[草案规范](https://wicg.github.io/web-transport/)和[相关设计文档](https://docs.google.com/document/d/1UgviRBnZkMUq4OKcsAJvIQFX6UCXeCbOtX_wMgwD_es/edit#)的信息。感谢各位作者提供的基础文档。

*本文主图作者：[Robin Pierre](https://unsplash.com/photos/dPgPoiUIiXk) 来源：Unsplash。*

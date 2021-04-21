---
title: Experimenting with WebTransport
subhead: WebTransport is a new API offering low-latency, bidirectional, client-server messaging. Learn more about its use cases, and how to give feedback about the future of the implementation.
authors:
  - jeffposnick
description: WebTransport is a new API offering low-latency, bidirectional, client-server messaging. Learn more about its use cases, and how to give feedback about the future of the implementation.
date: 2020-06-08
updated: 2021-02-23
hero: image/admin/Wh6q6ughWxUYcu4iOutU.jpg
hero_position: center
alt: |
  Photo of fast-moving traffic.
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/793759434324049921
tags:
  - blog
  - capabilities
  - network
feedback:
  - api
---

## Background

### What's WebTransport?

[WebTransport](https://w3c.github.io/webtransport/) is a web API that uses the [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) protocol as a bidirectional transport. It's intended for two-way communications between a web client and an HTTP/3 server. It supports sending data both unreliably via its [datagram APIs](#datagram), and reliably via its [streams APIs](#stream).

[Datagrams](https://tools.ietf.org/html/draft-ietf-quic-datagram-00) are ideal for sending and receiving data that do not need strong delivery guarantees. Individual packets of data are limited in size by the [maximum transmission unit (MTU)](https://en.wikipedia.org/wiki/Maximum_transmission_unit) of the underlying connection, and may or may not be transmitted successfully, and if they are transferred, they may arrive in an arbitrary order. These characteristics make the datagram APIs ideal for low-latency, best-effort data transmission. You can think of datagrams as [user datagram protocol (UDP)](https://en.wikipedia.org/wiki/User_Datagram_Protocol) messages, but encrypted and congestion-controlled.

The streams APIs, in contrast, provide [reliable](https://en.wikipedia.org/wiki/Reliability_(computer_networking)), ordered data transfer. They're [well-suited](https://quicwg.org/base-drafts/draft-ietf-quic-transport.html#name-streams) to scenarios where you need to send or receive one or more streams of ordered data. Using multiple WebTransport streams is analogous to establishing multiple [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) connections, but since HTTP/3 uses the lighter-weight [QUIC](https://www.chromium.org/quic) protocol under the hood, they can be opened and closed without as much overhead.

### Use cases

This a small list of possible ways developers might use WebTransport.

- Sending game state at a regular interval with minimal latency to a server via small, unreliable, out-of-order messages.
- Receiving media streams pushed from a server with minimal latency, independent of other data streams.
- Receiving notifications pushed from a server while a web page is open.

As part of the origin trial process, we're interested in [hearing more](#feedback) about how you plan to use WebTransport.

{% Aside %}
Many of the concepts in this proposal were previously experimented with as part of the earlier QuicTransport origin trial, which did not end up being released as part of Chrome.

WebTransport helps with similar use cases as QuicTransport, with the primary difference being that [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) instead of [QUIC](https://www.chromium.org/quic) is the underlying transport protocol.
{% endAside %}

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete](https://github.com/w3c/webtransport/blob/main/explainer.md) |
| 2. Create initial draft of specification   | [Complete](https://w3c.github.io/webtransport/) |
| **3. Gather feedback and iterate design**  | [**In Progress**](#feedback) |
| **4. Origin trial**                        | [**In Progress**](#register-for-ot) |
| 5. Launch                                  | Not Started |

</div>

## WebTransport's relationship to other technologies

### Is WebTransport a replacement for WebSockets?

Maybe. There are use cases where either [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) or WebTransport might be valid communication protocols to use.

WebSockets communications are modeled around a single, reliable, ordered stream of messages, which is fine for some types of communication needs. If you need those characteristics, then WebTransport's streams APIs can provide them as well. In comparison, WebTransport's datagram APIs provide low-latency delivery, without guarantees about reliability or ordering, so they're not a direct replacement for WebSockets.

Using WebTransport, via the datagram APIs or via multiple concurrent Streams API instances, means that you don't have to worry about [head-of-line blocking](https://en.wikipedia.org/wiki/Head-of-line_blocking), which can be an issue with WebSockets. Additionally, there are performance benefits when establishing new connections, as the underlying [QUIC handshake](https://www.fastly.com/blog/quic-handshake-tls-compression-certificates-extension-study) is faster than starting up TCP over TLS.

WebTransport is part of a new draft specification, and as such the WebSocket ecosystem around client and server libraries is currently much more robust. If you need something that works "out of the box" with common server setups, and with broad web client support, WebSockets is a better choice today.

### Is WebTransport the same as a UDP Socket API?

No. WebTransport is not a [UDP Socket API](https://www.w3.org/TR/raw-sockets/). While WebTransport uses HTTP/3, which in turn uses UDP "under the hood," WebTransport has requirements around encryption and congestion control that make it more than a basic UDP Socket API.

### Is WebTransport an alternative to WebRTC data channels?

Yes, for client-server connections. WebTransport shares many of the same properties as [WebRTC data channels](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel), although the underlying protocols are different.

{% Aside %}
WebRTC data channels support peer-to-peer communications, but WebTransport only supports client-server connection. If you have multiple clients that need to talk directly to each other, then WebTransport isn't a viable alternative.
{% endAside %}

Generally, running a HTTP/3-compatible server requires less setup and configuration than maintaining a WebRTC server, which involves understanding multiple protocols ([ICE](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity#ICE_candidates), [DTLS](https://webrtc-security.github.io/#4.3.1.), and [SCTP](https://developer.mozilla.org/en-US/docs/Web/API/RTCSctpTransport)) in order to get a working transport. WebRTC entails many more moving pieces that could lead to failed client/server negotiations.

The WebTransport API was designed with the web developer use cases in mind, and should feel more like writing modern web platform code than using WebRTC's data channel interfaces. [Unlike WebRTC](https://bugs.chromium.org/p/chromium/issues/detail?id=302019), WebTransport is supported inside of [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), which allows you to perform client-server communications independent of a given HTML page. Because WebTransport exposes a [Streams](https://streams.spec.whatwg.org/)-compliant interface, it supports optimizations around [backpressure](https://streams.spec.whatwg.org/#backpressure).

However, if you already have a working WebRTC client/server setup that you're happy with, switching to WebTransport may not offer many advantages.

## Try it out

The best way to experiment with WebTransport is to use [this Python code](https://github.com/GoogleChrome/samples/blob/gh-pages/webtransport/web_transport_server.py) to start up a compatible HTTP/3 server locally. You can then use this page with a [basic JavaScript client](https://googlechrome.github.io/samples/webtransport/client.html) to try out client/server communications.

## Using the API

WebTransport was designed on top of modern web platform primitives, like the [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). It relies heavily on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), and works well with [<code>async</code> and <code>await</code>](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await).

The WebTransport [origin trial](#register-for-ot) supports three distinct types of traffic: datagrams, as well as both unidirectional and bidirectional streams.

### Connecting to a server

You can connect to a HTTP/3 server by creating a `WebTransport` instance. The scheme of the URL should be `https`. You need to explicitly specify the port number.

You should use the `ready` promise to wait for the connection to be established. This promise will not be fulfilled until the setup is complete, and will reject if the connection fails at the QUIC/TLS stage.

The `closed` promise fulfills when the connection closes normally, and rejects if the closure was unexpected.

If the server rejects the connection due to a [client indication](https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.2) error (e.g. the path of the URL is invalid), then that causes `closed` to reject, while `ready` remains unresolved.

```js
const url = 'https://example.com:4999/foo/bar';
const transport = new WebTransport(url);

// Optionally, set up functions to respond to
// the connection closing:
transport.closed.then(() => {
  console.log(`The HTTP/3 connection to ${url} closed gracefully.`);
}).catch((error) => {
  console.error('The HTTP/3 connection to ${url} closed due to ${error}.');
});

// Once .ready fulfills, the connection can be used.
await transport.ready;
```

### Datagram APIs {: #datagram }

Once you have a WebTransport instance that's connected to a server, you can use it to send and receive discrete bits of data, known as [datagrams](https://en.wikipedia.org/wiki/Datagram).

The `sendDatagrams()` method returns a <code>[WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)</code>, which a web client can use to send data to the server. The <code>receiveDatagrams()</code> method returns a <code>[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)</code>, allowing you to listen for data from the server. Both streams are inherently unreliable, so it is possible that the data you write will not be received by the server, and vice versa.

Both types of streams use <code>[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)</code> instances for data transfer.

```js
// Send two datagrams to the server.
const ws = transport.sendDatagrams();
const writer = ws.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);

// Read datagrams from the server.
const rs = transport.receiveDatagrams();
const reader = rs.getReader();
while (true) {
  const {value, done} = await reader.read();
  if (done) {
    break;
  }
  // value is a Uint8Array.
  console.log(value);
}
```

{% Aside %}
Chrome does not [currently](https://bugs.chromium.org/p/chromium/issues/detail?id=929585) expose an [async iterator](https://github.com/whatwg/streams/issues/778) for a `ReadableStream`. For the time being, using the `getReader()` method combined with a `while()` loop is the best way to read from the stream.
{% endAside %}

### Streams APIs  {: #stream }

Once you've connected to the server, you could also use WebTransport to send and receive data via its Streams APIs.

Each chunk of all streams is a `Uint8Array`. Unlike with the Datagram APIs, these streams are reliable. But each stream is independent, so data order across streams is not guaranteed.

#### SendStream

A <code>[SendStream](https://wicg.github.io/web-transport/#sendstream)</code> is created by the web client using the <code>createSendStream()</code> method of a `WebTransport` instance, which returns a promise for the <code>SendStream</code>.

Use the <code>[close()](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter/close)</code> method of the <code>[WritableStreamDefaultWriter](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter)</code> to close the associated HTTP/3 connection. The browser tries to send all pending data before actually closing the associated connection.

```js
// Send two Uint8Arrays to the server.
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

Similarly, use the <code>[abort()](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter/abort)</code> method of the <code>[WritableStreamDefaultWriter](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter)</code> to send a [QUIC RESET\_STREAM](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4) to the server. When using <code>abort()</code>, the browser may discard any pending data that hasn't yet been sent.

```js
const ws = await transport.createSendStream();
const writer = ws.getWriter();
writer.write(...);
writer.write(...);
await writer.abort();
// Not all the data may have been written.
```

#### ReceiveStream

A <code>[ReceiveStream](https://wicg.github.io/web-transport/#receivestream)</code> is initiated by the server. Obtaining a <code>ReceiveStream</code> is a two-step process for a web client. First, it calls the <code>receiveStreams()</code> method of a `WebTransport` instance, which returns a <code>ReadableStream</code>. Each chunk of that <code>ReadableStream</code>, is, in turn, a <code>ReceiveStream</code> that can be used to read <code>Uint8Array</code> instances sent by the server.

```js
async function readFrom(receiveStream) {
  const reader = receiveStream.readable.getReader();
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    // value is a Uint8Array
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
  // value is an instance of ReceiveStream
  await readFrom(value);
}
```

You can detect stream closure using the <code>[closed](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/closed)</code> promise of the <code>[ReadableStreamDefaultReader](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader)</code>. When the underlying HTTP/3 connection is [closed with the FIN bit](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.8), the <code>closed</code> promise is fulfilled after all the data is read. When the HTTP/3 connection is closed abruptly (for example, by <code>[STREAM_RESET](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)</code>), then the <code>closed</code> promise rejects.

```js
// Assume an active receiveStream
const reader = receiveStream.readable.getReader();
reader.closed.then(() => {
  console.log('The receiveStream closed gracefully.');
}).catch(() => {
  console.error('The receiveStream closed abruptly.');
});
```

#### BidirectionalStream

A <code>[BidirectionalStream](https://wicg.github.io/web-transport/#bidirectional-stream)</code> might be created either by the server or the client.

Web clients can create one using the `createBidirectionalStream()` method of a `WebTransport` instance, which returns a promise for a `BidirectionalStream`.

```js
const stream = await transport.createBidirectionalStream();
// stream is a BidirectionalStream
// stream.readable is a ReadableStream
// stream.writable is a WritableStream
```

You can listen for a `BidirectionalStream` created by the server with the `receiveBidirectionalStreams()` method of a `WebTransport` instance, which returns a `ReadableStream`. Each chunk of that `ReadableStream`, is, in turn, a `BidirectionalStream`.

```js
const rs = transport.receiveBidrectionalStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // value is a BidirectionalStream
  // value.readable is a ReadableStream
  // value.writable is a WritableStream
}
```

A `BidirectionalStream` is just a combination of a `SendStream` and `ReceiveStream`. The examples from the previous two sections explain how to use each of them.

### More examples

The [WebTransport draft specification](https://wicg.github.io/web-transport/) includes a number of additional inline examples, along with full documentation for all of the methods and properties.

## Enabling support during the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### WebTransport in Chrome's DevTools

Unfortunately, [Chrome's DevTools](https://developers.google.com/web/tools/chrome-devtools) support for WebTransport is not ready for the start of the origin trial. You can "star" [this Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1069742) to be notified about updates on the DevTools interface.

## Privacy and security considerations

See the [corresponding section](https://wicg.github.io/web-transport/#privacy-security) of the draft specification for authoritative guidance.

## Feedback  {: #feedback }

The Chrome team wants to hear your thoughts and experiences using this API throughout the origin trial process.

### Feedback about the API design

Is there something about the API that's awkward or doesn't work as expected? Or are there missing pieces that you need to implement your idea?

File an issue on the [Web Transport GitHub repo](https://github.com/WICG/web-transport/issues), or add your thoughts to an existing issue.

### Problem with the implementation?

Did you find a bug with Chrome's implementation?

File a bug at [https://new.crbug.com](https://new.crbug.com). Include as much detail as you can, along with simple instructions for reproducing.

### Planning to use the API?

Your public support helps Chrome prioritize features, and shows other browser vendors how critical it is to support them.

- Be sure you have signed up for the [origin trial](https://developer.chrome.com/origintrials/#/view_trial/793759434324049921) to show your interest and provide your domain and contact info.
- Send a tweet to [@ChromiumDev](https://twitter.com/chromiumdev) using the hashtag
  [`#WebTransport`](https://twitter.com/search?q=%23WebTransport&src=typed_query&f=live)
  and details on where and how you're using it.

### General discussion

You can use the [web-transport-dev Google Group](https://groups.google.com/a/chromium.org/g/web-transport-dev) for general questions or problems that don't fit into one of the other categories.

## Acknowledgements

This article incorporates information from the [WebTransport Explainer](https://github.com/wicg/web-transport/blob/master/explainer.md), [draft specification](https://wicg.github.io/web-transport/), and [related design docs](https://docs.google.com/document/d/1UgviRBnZkMUq4OKcsAJvIQFX6UCXeCbOtX_wMgwD_es/edit#). Thank you to the respective authors for providing that foundation.

_The hero image on this post is by [Robin Pierre](https://unsplash.com/photos/dPgPoiUIiXk) on Unsplash._

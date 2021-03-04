---
layout: post
title: Streaming requests with the fetch API
authors:
  - jakearchibald
description: >
  Chrome 85 has an experimental implementation of streaming uploads, which you
  can use on live sites using the origin trial.
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/-7680889164480380927
date: 2020-07-22
updated: 2020-07-22
hero: image/admin/9U7u4C7WCGbrdHm3181W.jpg
alt: A canoe pointed up stream.
tags:
  - blog
  - network
  - service-worker
feedback:
  - api
---

Chrome 85 has an experimental implementation of request streams, meaning you can
start making a request before you have the whole body available.

You could use this to:

- Warm up the server. In other words, you could start the request once the user
  focuses a text input field, and get all of the headers out of the way, then
  wait until the user presses 'send' before sending the data they entered.
- Gradually send data generated on the client, such as audio, video, or input data.
- Recreate web sockets over HTTP.

But since this is a low-level web platform feature, don't be limited by _my_ ideas.
Maybe you can think of a much more exciting use-case for request streaming.

## Try out request streams

### Enabling via chrome://flags {: #enable-flags }

Try out request streams in Chrome 85 by flipping an experimental flag:
`enable-experimental-web-platform-features`.

### Enabling support during the origin trial phase

Fetch request streams are available in an origin trial as of Chrome 85. The
origin trial is expected to end in Chrome 87.

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

## Demo {: #demo }

{% Glitch {
  id: 'fetch-request-stream',
  path: 'index.html',
  height: 480
} %}

This shows how you can stream data from the user to the server, and send data
back that can be processed in real time.

Yeah ok it isn't the most imaginative example, I just wanted to keep it simple,
okay?

Anyway, how does this work?

## Previously on the exciting adventures of fetch streams

_Response_ streams have been available in all modern browsers for a while now.
They allow you to access parts of a response as they arrive from the server:

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

Each `value` is a `Uint8Array` of bytes. The number of arrays you get and the
size of the arrays depends on the speed of the network. If you're on a fast
connection, you'll get fewer, larger 'chunks' of data. If you're on a slow
connection, you'll get more, smaller chunks.

If you want to convert the bytes into text, you can use
[`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode),
or the newer transform stream if your [target browsers support
it](https://caniuse.com/#feat=mdn-api_textdecoderstream):

```js
const response = await fetch(url);
const reader = response.body
  .pipeThrough(new TextDecoderStream())
  .getReader();
```

`TextDecoderStream` is a transform stream that grabs all those `Uint8Array`
chunks and converts them to strings.

Streams are great, as you can start acting on the data as it arrives. For
instance, if you're receiving a list of 100 'results', you can display the first
result as soon as you receive it, rather than waiting for all 100.

Anyway, that's response streams, the exciting new thing I wanted to talk about
is request streams.

## Streaming request bodies

Requests can have bodies:

```js
await fetch(url, {
  method: 'POST',
  body: requestBody,
});
```

Previously, you needed the whole body ready to go before you could start the
request, but now in Chrome 85 you can provide your own `ReadableStream` of data:

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

The above will send "This is a slow request" to the server, one word at a time,
with a one second pause between each word.

Each chunk of a request body needs to be a `Uint8Array` of bytes, so I'm using
`pipeThrough(new TextEncoderStream())` to do the conversion for me.

### Writable streams

Sometimes it's easier to work with streams when you have a `WritableStream`. You can do this using an 'identity' stream, which is a readable/writable pair that takes anything that's passed to its writable end, and sends it to the readable end. You can create one of these by creating a `TransformStream` without any arguments:

```js
const { readable, writable } = new TransformStream();

const responsePromise = fetch(url, {
  method: 'POST',
  body: readable,
});
```

Now, anything you send to the writable stream will be part of the request. This
lets you compose streams together. For instance, here's a silly example where
data is fetched from one URL, compressed, and sent to another URL:

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

The above example uses [compression
streams](https://chromestatus.com/feature/5855937971617792) to compress
arbitrary data using gzip.

### Feature detection

If you provide a body object that the browser doesn't specifically handle, it
will call `toString()` on the object and use the result as the body. If the
browser doesn't support request streams, that means the request body becomes
`"[object ReadableStream]"`–probably not what you want to send to the server.
To avoid this, use feature detection:

```js
const supportsRequestStreams = !new Request('', {
  body: new ReadableStream(),
  method: 'POST',
}).headers.has('Content-Type');

if (supportsRequestStreams) {
  // …
} else {
  // …
}
```

{% Aside %}
This works because the browser adds a `Content-Type` header of
`text/plain;charset=UTF-8` to the request if the body is text. The browser only
treats the body as text if it _doesn't_ support request streams, otherwise it
won't add a `Content-Type` header at all.
{% endAside %}

## Restrictions

Streaming requests are a new power for the web, so they come with a few
restrictions:

### Restricted redirects

Some forms of HTTP redirect require the browser to resend the body of the
request to another URL. To support this, the browser would have to buffer the
contents of the stream, which sort-of defeats the point, so it doesn't do that.

Instead, if the request has a streaming body, and the response is an HTTP
redirect other than 303, the fetch will reject and the redirect will _not_ be
followed.

303 redirects are allowed, since they explicitly change the method to `GET` and
discard the request body.

### HTTP/2 only by default

By default, the fetch will be rejected if the connection isn't HTTP/2. If you
want to use streaming requests over HTTP/1.1, you need to opt in:

```js/3-3
await fetch(url, {
  method: 'POST',
  body: stream,
  allowHTTP1ForStreamingUpload: true,
});
```

{% Aside 'caution' %}
`allowHTTP1ForStreamingUpload` is non-standard and will only be used as part of
Chrome's experimental implementation.
{% endAside %}

According to HTTP/1.1 rules, request and response bodies either need to send a
`Content-Length` header, so the other side knows how much data it'll receive, or
change the format of the message to use [chunked
encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding). With chunked
encoding, the body is split into parts, each with their own content length.

Chunked encoding is pretty common when it comes to HTTP/1.1 _responses_, but
very rare when it comes to _requests_. Because of this, Chrome is a little worried
about compatibility, so it's opt-in for now.

{% Aside %}
This isn't an issue for HTTP/2, as HTTP/2 data is always 'chunked', although it
calls the chunks
[frames](https://developers.google.com/web/fundamentals/performance/http2#streams_messages_and_frames).
Chunked encoding wasn't introduced until HTTP/1.1, so requests with streaming
bodies will always fail on HTTP/1 connections.
{% endAside %}

Depending on how this trial goes, the spec will either restrict streaming
responses to HTTP/2, or always allow it for both HTTP/1.1 and HTTP/2.

### No duplex communication

A little-known feature of HTTP (although, whether this is standard behaviour
depends on who you ask) is that you can start receiving the response while
you're still sending the request. However, it's so little-known, that it isn't
well supported by servers, and, well, browsers.

In Chrome's current implementation, you won't get the response until the body
has been fully sent. In the following example `responsePromise` won't resolve
until the readable stream has been closed. Anything the server sends before that
point will be buffered.

```js
const responsePromise = fetch(url, {
  method: 'POST',
  body: readableStream,
});
```

The next best thing to duplex communication is to make one fetch with a
streaming request, then make another fetch to receive the streaming response.
The server will need some way to associate these two requests, like an ID in the
URL. That's how the [demo](#demo) works.

## Potential issues

Yeah, so… this is a new feature, and one that's underused on the internet today.
Here are some issues to look out for:

### Incompatibility on the server side

Some app servers don't support streaming requests, and instead wait for the full
request to be received before letting you see any of it, which kinda defeats the
point. Instead, use an app server that supports streaming, like
[NodeJS](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage).

But, you're not out of the woods yet! The application server, such as NodeJS,
usually sits behind another server, often called a "front-end server", which may
in turn sit behind a CDN. If any of those decide to buffer the request before
giving it to the next server in the chain, you lose the benefit of request
streaming.

Also, if you're using HTTP/1.1, one of the servers may not be prepared for
chunked encoding, and may fail with an error. But hey, at least you can test
that and try to change servers if needed.

_…long sigh…_

### Incompatibility outside of your control

If you're using HTTPS you don't need to worry about proxies between you and the
user, but the user may be running a proxy on their machine. Some internet
protection software does this to allow it to monitor everything that goes
between the browser and network.

There may be cases where this software buffers request bodies, or in the case of
HTTP/1.1, doesn't expect chunked encoding, and breaks in some exciting way.

Right now, it's not clear how often this will happen, if at all.

If you want to protect against this, you can create a 'feature test' similar to
the [demo above](#demo), where you try to stream some data without closing the
stream. If the server receives the data, it can respond via a different fetch.
Once this happens, you know the client supports streaming requests end-to-end.

## Feedback welcome

Feedback from the community is crucial to the design of new APIs, so please try
it out and tell us what you think! If you encounter any bugs, please [report
them](https://bugs.chromium.org/p/chromium/issues/list), but if you have general
feedback, please send it to the [blink-network-dev Google
Group](https://groups.google.com/a/chromium.org/forum/#!forum/blink-network-dev).

Photo by [Laura
Lefurgey-Smith](https://unsplash.com/@lauralefurgeysmith?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
on
[Unsplash](https://unsplash.com/s/photos/canoe-stream?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)

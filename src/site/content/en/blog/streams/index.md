---
title: Streams—The definitive guide
subhead: Learn how to use readable, writable, and transform streams with the Streams API.
description: |
  The Streams API allows JavaScript to programmatically access streams of data received over the
  network and process them as desired by the developer.
authors:
  - thomassteiner
date: 2021-01-11
# updated: 2021-01-11
hero: hero.jpg
alt: A forest stream with colored fallen leaves.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - streams
---

The Streams API allows you to programmatically access streams of data received over the network and
process these streams with JavaScript. Streaming involves breaking a resource that you want to
receive over the network down into small chunks, and then processing them bit by bit. While
streaming is something browsers do anyway when receiving assets like HTML or videos to be shown on
webpages, this capability has never been available to JavaScript before.

Previously, if you wanted to process a resource of some kind (be it a video, or a text file, etc.),
you would have to download the entire file, wait for it to be deserialized into a suitable format,
and then process the whole lot after it is fully received. With streams being available to
JavaScript, this all changes—you can now start processing raw data with JavaScript bit by bit as
soon as it is available on the client-side, without needing to generate a buffer, string, or blob.
This unlocks a number of use cases, some of which I list below:

- **Video effects:** piping a readable video stream through a transform stream that applies effects
  in real time.
- **Data (de)compression:** piping a file stream through a transform stream that selectively
  (de)compresses it.
- **Image decoding:** piping an HTTP response stream through a transform stream that decodes bytes
  into bitmap data, and then through another transform that translates bitmaps into PNGs. If
  installed inside the `fetch` hook of a service worker, this allows developers to transparently
  polyfill new image formats like AVIF.

## Core concepts

Before I go into details on the various types of streams, let me introduce some core concepts first.

### Chunks

A chunk is a **single piece of data** that is written to or read from a stream. It can be of any
type; streams can even contain chunks of different types. A chunk will often not be the most atomic
unit of data for a given stream. For example, a byte stream might contain chunks consisting of 16
KiB `Uint8Array` units, instead of single bytes.

### Readable streams

A readable stream represents a source of data, from which you can read. In other words, data **comes
out** of a readable stream. Concretely, a readable stream is an instance of the `ReadableStream`
class.

### Writable streams

A writable stream represents a destination for data, into which you can write. In other words, data
**goes in** to a writable stream. Concretely, a writable stream is an instance of the
`WritableStream` class.

### Transform streams

A transform stream consists of a **pair of streams**: a writable stream, known as its writable side,
and a readable stream, known as its readable side. In a manner specific to the transform stream in
question, writes to the writable side result in new data being made available for reading from the
readable side. Concretely, any object with a `writable` property and a `readable` property can serve
as a transform stream. However, the standard `TransformStream` class makes it much easier to create
such a pair that is properly entangled.

### Pipe chains

Streams are primarily used by **piping** them to each other. A readable stream can be piped directly
to a writable stream, using the readable stream's `pipeTo()` method, or it can be piped through one
or more transform streams first, using the readable stream's `pipeThrough()` method. A set of
streams piped together in this way is referred to as a pipe chain.

### Backpressure

Once a pipe chain is constructed, it will propagate signals regarding how fast chunks should flow
through it. If any step in the chain cannot yet accept chunks, it propagates a signal backwards
through the pipe chain, until eventually the original source is told to stop producing chunks so
fast. This process of **normalizing flow** from the original source according to how fast the chain
can process chunks is called backpressure.

### Teeing

A readable stream can be tee'd (named after the shape of an uppercase 'T') using its `tee()` method.
This will lock the stream, making it no longer directly usable; however, it will create **two new
streams**, called branches, which can be consumed independently.

## Creating a readable stream

A readable stream is a data source represented in JavaScript by a `ReadableStream` object that flows
from an underlying source. The
[`ReadableStream()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
constructor creates and returns a readable stream object from the given handlers. There are two
types of underlying source:

- **Push sources** constantly push data at you when you have accessed them, and it is up to you to
  start, pause, or cancel access to the stream. Examples include video streams, Server-Sent Events,
  or WebSockets.
- **Pull sources** require you to explicitly request data from them once connected to. Examples
  include a file access operation via a `fetch()` or `XMLHttpRequest` call.

The data is read sequentially in small pieces called **chunks**. A chunk can be a single byte, or it
can be something larger such as a typed array of a certain size. A single stream can contain chunks
of different sizes and types.

The chunks placed in a stream are said to be **enqueued**. This means they are waiting in a queue
ready to be read. An **internal queue** keeps track of the chunks that have not yet been read.

The chunks inside the stream are read by a **reader**. This reader processes the data one chunk at a
time, allowing you to do whatever kind of operation you want to do on it. The reader plus the other
processing code that goes along with it is called a **consumer**.

The next construct in this context is called a **controller**. Each reader has an associated
controller that allows you to control the stream.

Only one reader can read a stream at a time; when a reader is created and starts reading a stream
(that is, becomes an **active reader**), it is **locked** to it. If you want another reader to start
reading your stream, you typically need to **cancel** the first reader before you do anything else
(although you can **tee** streams).

You create a readable stream by calling its constructor
[`ReadableStream()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream).
It expects a required argument called the stream's `underlyingSource`, which represents an object
containing methods and properties that define how the constructed stream instance will behave. The
`underlyingSource` can contain the following optional, developer-defined methods:

- `start(controller)`: This method is called immediately when the object is constructed. The
  contents of this method should aim to get access to the stream source, and do anything else
  required to set up the stream functionality. If this process is to be done asynchronously, it can
  return a promise to signal success or failure. The `controller` parameter passed to this method is
  a
  [`ReadableStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultController)
  by default.
- `pull(controller)`: This method can be used by the developer to control the stream as more chunks
  are fetched. It will be called repeatedly when the stream's internal queue of chunks is not full,
  up until it reaches its high water mark. If `pull()` returns a promise, it will not be called
  again until that promise fulfills; if the promise rejects, the stream will become errored.
- `cancel(reason)`: This method gets called when the stream consumer cancels the stream.

The `ReadableStreamDefaultController` supports the following methods:

- [`ReadableByteStreamController.close()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController/close)
  closes the associated stream.
- [`ReadableByteStreamController.enqueue()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController/enqueue)
  enqueues a given chunk in the associated stream.
- [`ReadableByteStreamController.error()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController/error)
  causes any future interactions with the associated stream to error.

In order to read from a readable stream, you need a reader, which, by default, will be a
[`ReadableStreamDefaultReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader).
The `getReader()` method of the `ReadableStream` interface creates a reader and locks the stream to
it. While the stream is locked, no other reader can be acquired until this one is released.

The [`read()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/read)
method of the `ReadableStreamDefaultReader` interface returns a promise providing access to the next
chunk in the stream's internal queue. It fulfills or rejects with a result depending on the state of
the stream. The different possibilities are as follows:

- If a chunk is available, the promise will be fulfilled with an object of the form
  `{ value: chunk, done: false }`.
- If the stream becomes closed, the promise will be fulfilled with an object of the form
  `{ value: undefined, done: true }`.
- If the stream becomes errored, the promise will be rejected with the relevant error.

The code sample below shows all the steps in action. I first create a `ReadableStream` that in its
`underlyingSource` argument defines a `start` method that tells the stream's `controller` to
`enqueue()` the current time during 10 seconds and then to `close()` the stream. I then consume this
stream by creating a reader via the `getReader()` method and calling `read()` until the stream is
`done`.

```js
let interval = null;

const stream = new ReadableStream({
  start(controller) {
    interval = setInterval(() => {
      // Extract just the hh:mm:ss from the date.
      let string = new Date().toISOString().replace(/.*?T(.*?)\..*?$/, '$1 ');
      // Add the string to the stream.
      console.log(`Enqueued ${string}`);
      controller.enqueue(string);
    }, 1_000);

    setTimeout(() => {
      clearInterval(interval);
      // Close the stream after 10s.
      controller.close();
    }, 10_000);
  },

  cancel() {
    // This is called if the reader cancels.
    clearInterval(interval);
  },
});

let result = '';
const reader = stream.getReader();

const readStream = async () => {
  // The `read()` method returns a promise that
  // resolves when a value has been received.
  const { done, value } = await reader.read();
  // Result objects contain two properties:
  // `done`  - `true` if the stream has already given you all its data.
  // `value` - Some data. Always `undefined` when `done` is `true`.
  if (done) {
    return console.log(`Stream complete.\n${result}`);
  }
  result += value;
  console.log(`Read ${result.length} characters so far`);
  console.log(`Most recently read chunk: ${value}`);
  // Read some more, and call this function again.
  return readStream();
};
readStream();
```

The next (a bit contrived) code sample shows how you could implement a SHOUT implementation of
`fetch()` in a service worker by
[consuming the returned response promise as a stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_as_a_stream)
and uppercasing chunk by chunk. The advantage of this approach is that you do not need to wait for
the whole document to be downloaded, which can make a huge difference when dealing with large files.

```js
// Install immediately without waiting.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Claim all clients immediately.
self.addEventListener('activate', (event) => {
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  // If the destination of the request is anything else
  // than a document, return.
  if (event.request.destination !== 'document') {
    return;
  }
  event.respondWith(
    (async () => {
      // Create a new stream that implements the SHOUTING.
      const result = await shoutFetch(event.request.url);
      // Return the newly created stream.
      return new Response(result.stream, { headers: result.headers });
    })(),
  );
});

const shoutFetch = async (url) => {
  // Chunks arrive encoded, so need to decode them.
  const textDecoder = new TextDecoder('utf-8', { stream: true });
  // After uppercasing, need to encode chunks again.
  const textEncoder = new TextEncoder();
  // Fetch the initial document and get access to the
  // reader of the readable stream.
  const response = await fetch(url);
  const readableStream = response.body;
  const reader = readableStream.getReader();
  // Create a new stream.
  const responseStream = new ReadableStream({
    // Called whenever the internal queue of chunks is not full.
    async pull(controller) {
      // Read the next chunk.
      let chunkPromise = await reader.read();
      // Close the stream when done.
      if (chunkPromise.done) {
        return controller.close();
      }
      // Uppercase each chunk (after decoding it).
      const upperCaseValue = textDecoder.decode(chunkPromise.value).toUpperCase();
      // Enqueue the uppercased value (afer re-encoding it).
      controller.enqueue(textEncoder.encode(upperCaseValue));
      return chunkPromise;
    },

    // Called when the reader cancels.
    cancel() {
      reader.cancel();
    },
  });
  // Return the new stream with the headers of the original response.
  return await { stream: responseStream, headers: response.headers };
};
```

## Teeing a readable stream

The [`tee()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/tee) method of the
`ReadableStream` interface tees the current readable stream, returning a two-element array
containing the two resulting branches as new `ReadableStream` instances. This is useful for allowing
two readers to read a stream simultaneously. You might do this for example in a service worker if
you want to fetch a response from the server and stream it to the browser, but also stream it to the
service worker cache. Since a response body cannot be consumed more than once, you need two copies
to do this. To cancel the stream, you then need to cancel both resulting branches. Teeing a stream
will generally lock it for the duration, preventing other readers from locking it.

```js
const readableStream = new ReadableStream({
  async start(controller) {
    // called by constructor
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  async pull(controller) {
    // called read when controller's queue is empty
    console.log('[pull]');
    controller.enqueue('d');
    controller.close(); // or controller.error();
  },
  async cancel(reason) {
    // called when rs.cancel(reason)
    console.log('[cancel]', reason);
  },
});

(async () => {
  // rs.tree() duplicate two ReadableStreams
  const [streamA, streamB] = readableStream.tee();

  // Read streamA
  const readerA = streamA.getReader();
  console.log('[A]', await readerA.read()); //=> {value: "a", done: false}
  console.log('[A]', await readerA.read()); //=> {value: "b", done: false}
  console.log('[A]', await readerA.read()); //=> {value: "c", done: false}
  console.log('[A]', await readerA.read()); //=> {value: "d", done: false}
  console.log('[A]', await readerA.read()); //=> {value: undefined, done: true}

  // Read streamB
  const readerB = streamB.getReader();
  for (
    let chunkPromise = await readerB.read();
    !chunkPromise.done;
    chunkPromise = await readerB.read()
  ) {
    console.log('[B]', chunkPromise);
  }
})();
```

## Creating a writable stream

The `WritableStream` interface of the Streams API provides a standard abstraction for writing
streaming data to a destination, known as a sink. This object comes with built-in backpressure and
queuing. You create a writable stream by calling its constructor
[`WritableStream()`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream/WritableStream).
It expects a required argument called the stream's `underlyingSink`, which represents an object
containing methods and properties that define how the constructed stream instance will behave. The
`underlyingSink` can contain the following optional, developer-defined methods:

- `start(controller)`: This method is called immediately when the object is constructed. The
  contents of this method should aim to get access to the underlying sink. If this process is to be
  done asynchronously, it can return a promise to signal success or failure. The `controller`
  parameter passed to this method is a `WritableStreamDefaultController`. This can be used by the
  developer to control the stream during set up.
- `write(chunk, controller)`: This method will be called when a new chunk of data (specified in the
  `chunk` parameter) is ready to be written to the underlying sink. It can return a promise to
  signal success or failure of the write operation. The `controller` parameter passed to this method
  is a `WritableStreamDefaultController` that can be used by the developer to control the stream as
  more chunks are submitted for writing. This method will be called only after previous writes have
  succeeded, and never after the stream is closed or aborted.
- `close(controller)`: This method will be called if the app signals that it has finished writing
  chunks to the stream. The contents should do whatever is necessary to finalize writes to the
  underlying sink, and release access to it. If this process is asynchronous, it can return a
  promise to signal success or failure. This method will be called only after all queued-up writes
  have succeeded. The `controller` parameter passed to this method is a
  `WritableStreamDefaultController`, which can be used to control the stream at the end of writing.
- `abort(reason)`: This method will be called if the app signals that it wishes to abruptly close
  the stream and put it in an errored state. It can clean up any held resources, much like
  `close()`, but `abort()` will be called even if writes are queued up—those chunks will be thrown
  away. If this process is asynchronous, it can return a promise to signal success or failure. The
  `reason` parameter contains a `DOMString` describing why the stream was aborted.

The
[`WritableStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultController)
interface of the Streams API represents a controller allowing control of a `WritableStream`'s state.
When constructing a `WritableStream`, the underlying sink is given a corresponding
`WritableStreamDefaultController` instance to manipulate. The `WritableStreamDefaultController` has
only one method:
[`WritableStreamDefaultController.error()`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultController/error),
which causes any future interactions with the associated stream to error.

In order to write to a writable stream, you need a writer, which will be a
`WritableStreamDefaultWriter`. The `getWriter()` method of the `WritableStream` interface returns a
new instance of `WritableStreamDefaultWriter` and locks the stream to that instance. While the
stream is locked, no other writer can be acquired until this one is released.

The [`write()`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter/write)
method of the `WritableStreamDefaultWriter` interface writes a passed chunk of data to a
`WritableStream` and its underlying sink, then returns a promise that resolves to indicate the
success or failure of the write operation. Note that what "success" means is up to the underlying
sink; it might indicate that the chunk has been accepted, and not necessarily that it is safely
saved to its ultimate destination.

The code sample below shows all steps in action.

{% Aside %} The [File System Access API](https://web.dev/file-system-access/)'s
[`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#filesystemwritablefilestream)
and the experimental
[`fetch()` request streams](https://web.dev/fetch-upload-streaming/#writable-streams) are examples
of writable streams in the wild. {% endAside %}

```js
const writableStream = new WritableStream({
  async start(controller) {
    console.log('[start]');
  },
  async write(chunk, controller) {
    console.log('[write]', chunk);
    // Wait to next write.
    await new Promise((r) => setTimeout(r, 1000));
  },
  async close(controller) {
    console.log('[close]');
  },
  async abort(reason) {
    console.log('[abort]', reason);
  },
});

(async () => {
  const writer = writableStream.getWriter();
  const start = Date.now();
  for (const char of 'abcd') {
    // Wait to add write queue.
    await writer.ready;
    console.log('[ready]', Date.now() - start, 'ms');
    // The Promise resolved after finish to write.
    writer.write(char);
  }
  await writer.close();
})();
```

## Piping a readable stream to a writable stream

A readable stream can be piped to a writable stream through the readable stream's
[`pipeTo()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeTo) method.
`ReadableStream.pipeTo() pipes the current `ReadableStream`to a given`WritableStream` and returns a
promise that fulfills when the piping process completes successfully, or rejects if any errors were
encountered.

```js
const readableStream = new ReadableStream({
  async start(controller) {
    // Called by constructor.
    console.log('[start readable]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  async pull(controller) {
    // Called when controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  async cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

const writableStream = new WritableStream({
  async start(controller) {
    // Called by constructor
    console.log('[start writable]');
  },
  async write(chunk, controller) {
    // Called when writer.write()
    console.log('[write]', chunk);
  },
  async close(controller) {
    console.log('[close]');
  },
  async abort(reason) {
    console.log('[abort]', reason);
  },
});

(async () => {
  await readableStream.pipeTo(writableStream);
  console.log('[finished]');
})();
```

## Creating a transform stream

The `TransformStream` interface of the Streams API represents a set of transformable data. You
create a transform stream by calling its constructor `TransformStream()`, which creates and returns
a transform stream object from the given handlers. The `TransformStream()` constructor accepts as
its first argument a JavaScript object representing the `transformer`. Such objects can contain any
of the following methods:

- `start(controller)`: This method is called immediately when the object is constructed. Typically
  this is used to enqueue prefix chunks, using `controller.enqueue()`. Those chunks will be read
  from the readable side but do not depend on any writes to the writable side. If this initial
  process is asynchronous, for example because it takes some effort to acquire the prefix chunks,
  the function can return a promise to signal success or failure; a rejected promise will error the
  stream. Any thrown exceptions will be re-thrown by the `TransformStream()` constructor.
- `transform(chunk, controller)`: This method is called when a new chunk originally written to the
  writable side is ready to be transformed. The stream implementation guarantees that this function
  will be called only after previous transforms have succeeded, and never before `start()` has
  completed or after `flush()` has been called. This function performs the actual transformation
  work of the transform stream. It can enqueue the results using `controller.enqueue()`. This
  permits a single chunk written to the writable side to result in zero or multiple chunks on the
  readable side, depending on how many times `controller.enqueue()` is called. If the process of
  transforming is asynchronous, this function can return a promise to signal success or failure of
  the transformation. A rejected promise will error both the readable and writable sides of the
  transform stream. If no `transform()` method is supplied, the identity transform is used, which
  enqueues chunks unchanged from the writable side to the readable side.
- `flush(controller)`: This method is called after all chunks written to the writable side have been
  transformed by successfully passing through `transform()`, and the writable side is about to be
  closed. Typically this is used to enqueue suffix chunks to the readable side, before that too
  becomes closed. If the flushing process is asynchronous, the function can return a promise to
  signal success or failure; the result will be communicated to the caller of
  `stream.writable.write()`. Additionally, a rejected promise will error both the readable and
  writable sides of the stream. Throwing an exception is treated the same as returning a rejected
  promise.

```js
const transformStream = new TransformStream({
  async transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  async flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

(async () => {
  const readStream = transformStream.readable;
  const writeStream = transformStream.writable;

  const writer = writeStream.getWriter();
  for (const char of 'abc') {
    writer.write(char);
  }
  writer.close();

  const reader = readStream.getReader();
  for (
    let chunkPromise = await reader.read();
    !chunkPromise.done;
    chunkPromise = await reader.read()
  ) {
    console.log('[value]', chunkPromise.value);
  }
})();
```

## Piping a readable stream through a transform stream

The [`pipeThrough()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough)
method of the `ReadableStream` interface provides a chainable way of piping the current stream
through a transform stream or any other writable/readable pair. Piping a stream will generally lock
it for the duration of the pipe, preventing other readers from locking it.

```js
const transformStream = new TransformStream({
  async transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  async flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

const readableStream = new ReadableStream({
  async start(controller) {
    // called by constructor
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  async pull(controller) {
    // called read when controller's queue is empty
    console.log('[pull]');
    controller.enqueue('d');
    controller.close(); // or controller.error();
  },
  async cancel(reason) {
    // called when rs.cancel(reason)
    console.log('[cancel]', reason);
  },
});

(async () => {
  const reader = readableStream.pipeThrough(transformStream).getReader();
  for (
    let chunkPromise = await reader.read();
    !chunkPromise.done;
    chunkPromise = await reader.read()
  ) {
    console.log('[value]', chunkPromise.value);
  }
})();
```

```js
const uncompressed = 'hello hello';
const readableStream = new Blob([uncompressed], { type: 'text/plain' }).stream();

const uncompressedStream = readableStream
  .pipeThrough(new CompressionStream('gzip'))
  .pipeThrough(new DecompressionStream('gzip'))
  .pipeThrough(new TextDecoderStream());

const reader = uncompressedStream.getReader();
(async () => {
  for (
    let chunkPromise = await reader.read();
    !chunkPromise.done;
    chunkPromise = await reader.read()
  ) {
    console.log('[value]', chunkPromise.value);
  }
})();
```

## Acknowledgements

Hero image by [Ryan Lara](https://unsplash.com/@ryanlara) on [Unsplash](https://unsplash.com/).

---
title: Streams—The definitive guide
subhead: Learn how to use the Streams API.
description: |
  The Streams API allows JavaScript to programmatically access streams of data received over the
  network and process them as desired by the developer.
authors:
  - thomassteiner
date: 2021-01-06
# updated: 2020-11-04
hero: hero.jpg
alt: A forest stream with colored fallen leaves.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - streams
---

The Streams API allows developers to programmatically access streams of data received over the
network and process these streams with JavaScript.
Streaming involves breaking a resource that you want to receive over the network down into small
chunks, and then processing them bit by bit.
While streaming is something browsers do anyway when receiving assets like HTML or videos
to be shown on webpages, this capability has never been available to JavaScript before.

Previously, if you wanted to process a resource of some kind (be it a video, or a text file, etc.),
you would have to download the entire file, wait for it to be deserialized into a suitable format,
and then process the whole lot after it is fully received.
With streams being available to JavaScript, this all changes—you can now start processing raw data
with JavaScript bit by bit as soon as it is available on the client-side, without needing to
generate a buffer, string, or blob.
This unlocks a number of use cases, some of which I list below:

- **Video effects:** piping a readable video stream through a transform stream that applies effects
  in real time.
- **Data (de)compression:** piping a file stream through a transform stream that selectively
  (de)compresses files.
- **Image decoding:** piping an HTTP response stream through a transform stream that decodes bytes
  into bitmap data, and then through another transform that translates bitmaps into PNGs.
  If installed inside the `fetch` hook of a service worker, this allows developers to transparently
  polyfill new image formats like AVIF.

## Core concepts

Before I go into details on the various types of streams, let me introduce some core concepts first.

### Chunks

A chunk is a single piece of data that is written to or read from a stream.
It can be of any type; streams can even contain chunks of different types.
A chunk will often not be the most atomic unit of data for a given stream.
For example, a byte stream might contain chunks consisting of 16 KiB `Uint8Array` units,
instead of single bytes.

### Readable streams

A readable stream represents a source of data, from which you can read. In other words,
data comes out of a readable stream.
Concretely, a readable stream is an instance of the `ReadableStream` class.

### Writable streams

A writable stream represents a destination for data, into which you can write.
In other words, data goes in to a writable stream.
Concretely, a writable stream is an instance of the `WritableStream` class.

### Transform streams

A transform stream consists of a pair of streams: a writable stream, known as its writable side,
and a readable stream, known as its readable side.
In a manner specific to the transform stream in question, writes to the writable side result
in new data being made available for reading from the readable side.
Concretely, any object with a `writable` property and a `readable` property
can serve as a transform stream.
However, the standard `TransformStream` class makes it much easier to create such a pair
that is properly entangled.

### Pipe chains

Streams are primarily used by piping them to each other.
A readable stream can be piped directly to a writable stream, using its `pipeTo()` method,
or it can be piped through one or more transform streams first, using its `pipeThrough()` method.
A set of streams piped together in this way is referred to as a pipe chain.

### Backpressure

Once a pipe chain is constructed, it will propagate signals regarding
how fast chunks should flow through it. If any step in the chain cannot yet accept chunks,
it propagates a signal backwards through the pipe chain, until eventually the original source
is told to stop producing chunks so fast. This process of normalizing flow from the original source
according to how fast the chain can process chunks is called backpressure.

### Teeing

A readable stream can be tee'd (named after the shape of an uppercase 'T') using its `tee()` method.
This will lock the stream, making it no longer directly usable; however,
it will create two new streams, called branches, which can be consumed independently.

## Creating a readable stream

A readable stream is a data source represented in JavaScript by a `ReadableStream` object
that flows from an underlying source.
There are two types of underlying source:

- **Push sources** constantly push data at you when you have accessed them,
  and it is up to you to start, pause, or cancel access to the stream.
  Examples include video streams or WebSockets.
- **Pull sources** require you to explicitly request data from them once connected to.
  Examples include a file access operation via a `fetch()` or `XMLHttpRequest` call.

The data is read sequentially in small pieces called **chunks**. A chunk can be a single byte,
or it can be something larger such as a typed array of a certain size.
A single stream can contain chunks of different sizes and types.

The chunks placed in a stream are said to be **enqueued**.
This means they are waiting in a queue ready to be read.
An **internal queue** keeps track of the chunks that have not yet been read.

The chunks inside the stream are read by a **reader**.
This processes the data one chunk at a time, allowing you to do
whatever kind of operation you want to do on it.
The reader plus the other processing code that goes along with it is called a **consumer**.

The next construct in this context is called a **controller**.
Each reader has an associated controller that allows you to control the stream.

Only one reader can read a stream at a time; when a reader is created and starts reading a stream
(that is, becomes an **active reader**), it is **locked** to it.
If you want another reader to start reading your stream,
you typically need to **cancel** the first reader before you do anything else
(although you can tee streams).



```js
let interval = null;

const stream = new ReadableStream({
  start(controller) {
    interval = setInterval(() => {
      // Extract just the hh:mm:ss from the date.
      let string = new Date().toISOString().replace(/.*?T(.*?)\..*?$/, '$1 ');
      // Add a string to the stream.
      controller.enqueue(string);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      // Close the stream after 10s.
      controller.close();
    }, 10_000);
  },

  cancel() {
    // This is called if the reader cancels.
    clearInterval(interval);
  }
});

let result = '';
const reader = stream.getReader();

const readStream = async () => {
  // read() returns a promise that resolves when a value has been received
  const { done, value } = await reader.read();
  // Result objects contain two properties:
  // done  - true if the stream has already given you all its data.
  // value - some data. Always undefined when done is true.
  if (done) {
    return console.log(`Stream complete.\n${result}`);
  }
  result += value;
  console.log(`Read ${result.length} characters so far. Most recent chunk: ${value}`);
  // Read some more, and call this function again.
  return readStream();
};
readStream();
```

## Acknowledgements

Hero image by [Ryan Lara](https://unsplash.com/@ryanlara) on [Unsplash](https://unsplash.com/).


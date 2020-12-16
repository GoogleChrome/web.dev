---
title: Streams—The definitive guide
subhead: Learn how to use the Streams API.
description: |
  The Streams API allows JavaScript to programmatically access streams of data received over the
  network and process them as desired by the developer.
authors:
  - thomassteiner
date: 2020-12-07
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
Streaming involves breaking a resource that you want to receive over a network down into small
chunks, and then processing them bit by bit.
While streaming is something browsers do anyway when receiving assets to be shown on webpages,
like HTML or videos, this capability has never been available to JavaScript before.

Previously, if you wanted to process a resource of some kind (be it a video, or a text file, etc.),
you would have to download the entire file, wait for it to be deserialized into a suitable format,
and then process the whole lot after it is fully received.
With streams being available to JavaScript, this all changes—you can now start processing raw data
with JavaScript bit by bit as soon as it is available on the client-side, without needing to
generate a buffer, string, or blob.
This unlocks a number of use cases, some of which I list below:

- **Video effects:** piping a readable video stream through a transform stream that applies effects
  in real time.
- **Data decompression:** piping a file stream through a transform stream that selectively
  decompresses files from a compressed archive.
- **Image decoding:** piping an HTTP response stream through a transform stream that decodes bytes
  into bitmap data, and then through another transform that translates bitmaps into PNGs.
  If installed inside the `fetch` hook of a service worker, this allows developers to transparently
  polyfill new image formats.

## Core concepts

Before I look at the concrete streams, let me introduce some core concepts.

### Chunks

A chunk is a single piece of data that is written to or read from a stream.
It can be of any type; streams can even contain chunks of different types.
A chunk will often not be the most atomic unit of data for a given stream;
for example a byte stream might contain chunks consisting of 16 KiB `Uint8Array` units,
instead of single bytes.

### Readable streams
A readable stream represents a source of data, from which you can read. In other words, data comes out of a readable stream. Concretely, a readable stream is an instance of the ReadableStream class.

## Acknowledgements

Hero image by [Ryan Lara](https://unsplash.com/@ryanlara) on [Unsplash](https://unsplash.com/).


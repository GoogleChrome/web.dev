---
layout: post
title: PWA with offline streaming
authors:
  - dero
  - derekherman
description: |
  Building a PWA with offline streaming has its challenges. In this article you
  will learn about the APIs and techniques that provide users with a
  high-quality offline media experience.
date: 2021-07-05
updated: 2021-07-05
tags:
  - media
  # - video
---

[Progressive Web Apps] bring a lot of features previously reserved for native
applications to the web. One of the most prominent features associated with
PWAs is an offline experience.

Even better would be an offline streaming media experience, which is an
enhancement you could offer to your users in a few different ways. However,
this creates a truly unique problem—media files can be *very* large. So
you might be asking:

- How do I download and store a large video file?
- And how do I serve it to the user?

In this article we will discuss answers to these questions, while
referencing the [Kino] demo PWA we built that provides you with practical
examples of how you can implement an offline streaming media experience without
using any functional or presentational frameworks. The following examples are
mainly for educational purposes, because in most cases you should probably use
one of the existing [Media Frameworks] to provide these features.

Unless you have a good business case for developing your own, building a PWA
with offline streaming has its challenges. In this article you will learn about
the APIs and techniques used to provide users with a high-quality offline media
experience.

## Downloading and storing a large media file

Progressive Web Apps usually use the convenient [Cache API] to both download
and store the assets required to provide the offline experience: documents,
stylesheets, images, and others.

Here is a basic example of using the Cache API within a Service Worker:

```javascript/10-11
const cacheStorageName = 'v1';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheStorageName).then(function(cache) {
      return cache.addAll([
        'index.html',
        'style.css',
        'scripts.js',

        // Don't do this.
        'very-large-video.mp4',
      ]);
    })
  );
});
```

While the example above does technically work, using the Cache API has several
limitations that makes its use with large files impractical.

For example, the Cache API doesn't:
- Allow you to easily pause and resume downloads
- Let you track the progress of downloads
- Offer a way to properly respond to [HTTP range requests]

All of these issues are pretty serious limitations for any video application.
Let's review some other options that might be more appropriate.

Nowadays, the [Fetch API] is a cross-browser way to asynchronously access remote
files. In our use case it allows you to access large video files as a stream and
store them incrementally as chunks using an HTTP range request.

{% Aside %}
Check out the [Background Fetch API] as a candidate for a progressive
enhancement of the Fetch API in browsers that [support Background Fetch].
{% endAside %}

Now that you can read the chunks of data with the [Fetch API] you also need to
store them. Chances are there is a bunch of metadata associated with your media
file such as: name, description, runtime length, category, etc.

You're not storing just the one media file, you are storing a structured object,
and the media file is just one of its properties.

In this case the [IndexedDB API] provides an excellent solution to store both the
media data and metadata. It can hold huge amounts of binary data easily, and it
also offers indexes that allow you to perform very fast data lookups.

{% Aside %}
There is also a [File System Access API] that you could use in some browsers to
store the media files directly on the client device.
{% endAside %}

### Downloading media files using the Fetch API

We built a couple of interesting features around the Fetch API in our demo PWA,
which we named [Kino]—the [source code] is public so feel free to review it.

- The ability to pause and resume incomplete downloads.
- A custom buffer for storing chunks of data in the database.

Before showing how those features are implemented, we'll first do a
quick recap of how you can use the Fetch API to download files.

```javascript
/**
 * Downloads a single file.
 *
 * @param {string} url URL of the file to be downloaded.
 */
async function downloadFile(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  do {
    const { done, dataChunk } = await reader.read();
    // Store the `dataChunk` to IndexedDB.
  } while (!done);
}
```

Notice that `await reader.read()` is in a loop? That's how you'll receive chunks
of data from a readable stream as they arrive from the network. Consider how
useful this is: you can start processing your data even before it all arrives
from the network.

{% Aside %}
If you find the concept of streams confusing, check out
[Streams–The definitive guide] before you continue.
{% endAside %}

### Resuming downloads

When a download is paused or interrupted, the data chunks that have arrived will
be safely stored in an IndexedDB database. You can then display a button to
resume a download in your application. Because the [Kino] demo PWA server
supports [HTTP range requests] resuming a download is somewhat straightforward:

```javascript
async downloadFile() {
  // this.currentFileMeta contains data from IndexedDB.
  const { bytesDownloaded, url, downloadUrl } = this.currentFileMeta;
  const fetchOpts = {};

  // If we already have some data downloaded,
  // request everything from that position on.
  if (bytesDownloaded) {
    fetchOpts.headers = {
      Range: `bytes=${bytesDownloaded}-`,
    };
  }

  const response = await fetch(downloadUrl, fetchOpts);
  const reader = response.body.getReader();

  let dataChunk;
  do {
    dataChunk = await reader.read();
    if (!dataChunk.done) this.buffer.add(dataChunk.value);
  } while (!dataChunk.done && !this.paused);
}
```

### Custom write buffer for IndexedDB

On paper, the process of writing `dataChunk` values into an IndexedDB database
is simple. Those values already are `ArrayBuffer` instances, which are storable
in IndexedDB directly, so we can just create an object of an appropriate shape
and store it.

```javascript
const dataItem = {
  url: fileUrl,
  rangeStart: dataStartByte,
  rangeEnd: dataEndByte,
  data: dataChunk,
}

// Name of the store that will hold your data.
const storeName = 'fileChunksStorage'

// `db` is an instance of `IDBDatabase`.
const transaction = db.transaction([storeName], 'readwrite');
const store = transaction.objectStore(storeName);
const putRequest = store.put(data);

putRequest.onsuccess = () => { ... }
```

While this approach works, you will likely discover that your IndexedDB writes
are significantly slower than your download. This isn't because IndexedDB writes
are slow, it's because we are adding a lot of transactional overhead by creating
a new transaction for every data chunk that we receive from a network.

The downloaded chunks can be rather small and can be emitted by the stream in
rapid succession. You need to limit the rate of IndexedDB writes. In the
[Kino] demo PWA we do this by implementing an **intermediary write buffer**.

As data chunks arrive from the network, we append them to our buffer first. If
the incoming data doesn't fit, we flush the full buffer into the database and
clear it before appending the rest of the data. As a result our IndexedDB
writes are less frequent, which leads to significantly improved write
performance.

## Serving a media file from offline storage

Once you have a media file downloaded, you probably want your service worker to
serve it from IndexedDB instead of fetching the file from the network.

```javascript
/**
 * The main service worker fetch handler.
 *
 * @param {FetchEvent} event Fetch event.
 */
const fetchHandler = async (event) => {
  const getResponse = async () => {
    // Omitted Cache API code used to serve static assets.

    const videoResponse = await getVideoResponse(event);
    if (videoResponse) return videoResponse;

    // Fallback to network.
    return fetch(event.request);
  };
  event.respondWith(getResponse());
};
self.addEventListener('fetch', fetchHandler);
```

So what do you need to do in `getVideoResponse()`?

- The `event.respondWith()` method expects a `Response` object as a parameter.
- The [Response() constructor] tells us that there are several types of objects we
  could use to instantiate a `Response` object: a `Blob`, `BufferSource`,
  `ReadableStream`, and more.
- We need an object that doesn't hold all of its data in memory, so we'll
  probably want to choose the `ReadableStream`.

Also, because we're dealing with large files, and we wanted to allow browsers to
only request the part of the file they currently need, we needed to implement
some basic support for [HTTP range requests].

```javascript
/**
 * Respond to a request to fetch offline video file and construct a response
 * stream.
 *
 * Includes support for `Range` requests.
 *
 * @param {Request} request  Request object.
 * @param {Object}  fileMeta File meta object.
 *
 * @returns {Response} Response object.
 */
const getVideoResponse = (request, fileMeta) => {
  const rangeRequest = request.headers.get('range') || '';
  const byteRanges = rangeRequest.match(/bytes=(?<from>[0-9]+)?-(?<to>[0-9]+)?/);

  // Using the optional chaining here to access properties of
  // possibly nullish objects.
  const rangeFrom = Number(byteRanges?.groups?.from || 0);
  const rangeTo = Number(byteRanges?.groups?.to || fileMeta.bytesTotal - 1);

  // Omitting implementation for brevity.
  const streamSource = {
     pull(controller) {
       // Read file data here and call `controller.enqueue`
       // with every retrieved chunk, then `controller.close`
       // once all data is read.
     }
  }
  const stream = new ReadableStream(streamSource);

  // Make sure to set proper headers when supporting range requests.
  const responseOpts = {
    status: rangeRequest ? 206 : 200,
    statusText: rangeRequest ? 'Partial Content' : 'OK',
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': rangeTo - rangeFrom + 1,
    },
  };
  if (rangeRequest) {
    responseOpts.headers['Content-Range'] = `bytes ${rangeFrom}-${rangeTo}/${fileMeta.bytesTotal}`;
  }
  const response = new Response(stream, responseOpts);
  return response;
```

Feel free to check out the [Kino] demo PWA [service worker source code] to find
out how we are reading file data from IndexedDB and constructing a stream in
a real application.

## Other considerations

With the main obstacles out of your way, you can now start adding some
nice-to-have features to your video application. Here are a few examples of
features you would find in the [Kino] demo PWA:

- [Media Session API] integration that allows your users to control media
  playback using dedicated hardware media keys or from media notification
  popups.
- Caching of other assets associated with the media files like subtitles, and
  poster images using the good old [Cache API].
- Support for video streams (DASH, HLS) download within the app. Because stream
  manifests generally declare multiple sources of different bitrates, you need to
  transform the manifest file and only download one media version before storing
  it for offline viewing.

Up next, you will learn about [Fast playback with audio and video preload].

[Progressive Web Apps]: /progressive-web-apps/
[Media Frameworks]: /media-frameworks/
[Cache API]: /cache-api-quick-guide/
[HTTP range requests]: https://developer.mozilla.org/docs/Web/HTTP/Range_requests
[Fetch API]: https://developer.mozilla.org/docs/Web/API/Fetch_API
[IndexedDB API]: https://developer.mozilla.org/docs/Web/API/IndexedDB_API
[Background Fetch API]: https://developer.mozilla.org/docs/Web/API/Background_Fetch_API
[support Background Fetch]: https://caniuse.com/mdn-api_serviceworkerregistration_backgroundfetch
[File System Access API]: /file-system-access/
[Kino]: https://kinoweb.dev
[source code]: https://github.com/GoogleChrome/kino
[Streams–The definitive guide]: /streams/
[Media Session API]: /media-session/
[Response() constructor]: https://developer.mozilla.org/docs/Web/API/Response/Response
[service worker source code]: https://github.com/GoogleChrome/kino/blob/72055bdc7c8ad3de943a55293b2bf882e467c814/src/js/sw/sw.js#L53-L122
[Fast playback with audio and video preload]: /fast-playback-with-preload/

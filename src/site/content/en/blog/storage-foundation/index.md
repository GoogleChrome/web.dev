---
layout: post
title: 'High performance storage for your app: the Storage Foundation API'
subhead: |
  The Storage Foundation API resembles a basic file system,
  with direct access to stored data through buffers and offsets. It gives
  developers flexibility by providing generic, simple, and performant 
  primitives on which they can build higher-level components.
authors:
  - thomassteiner
date: 2021-06-16
updated: 2021-06-17
description: |
  The Storage Foundation API is a storage API that resembles a basic file system,
  with direct access to stored data through buffers and offsets. It gives
  developers flexibility by providing generic, simple, and performant primitives on
  which they can build higher-level components. It is particularly well suited for
  Wasm-based libraries and applications that perform best when they can use custom storage algorithms to
  fine-tune execution speed and memory usage.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/jHUvdkuNQBLYxfWrCizd.jpg
alt: |
  Hacker binary attack code.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/2916080758722396161
---

{% Aside %} The Storage Foundation API is part of the
[capabilities project](https://web.dev/fugu-status/) and is currently in development. This post will
be updated as the implementation progresses. {% endAside %}

The web platform increasingly offers developers the tools they need to build fined-tuned
high-performance applications for the web. Most notably,
[WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) (Wasm) has opened the door to
fast and powerful web applications, while technologies like [Emscripten](https://emscripten.org/)
now allow developers to reuse tried and tested code on the web. To truly leverage this potential,
developers must have the same power and flexibility when it comes to storage.

This is where the Storage Foundation API comes in. The Storage Foundation API is a new fast and
unopinionated storage API that unlocks new and much-requested use cases for the web, such as
implementing performant databases and gracefully managing large temporary files. With this new
interface, developers can "bring their own storage" to the web, reducing the feature gap between web
and platform-specific code.

The Storage Foundation API is designed to resemble a very basic file system so it gives developers
flexibility by providing generic, simple, and performant primitives on which they can build
higher-level components. Applications can take advantage of the best tool for their needs, finding
the right balance between usability, performance, and reliability.

## Why does the web need another storage API?

The web platform offers a number of storage options for developers, each of which is built with
specific use-cases in mind.

- Some of these options clearly do not overlap with this proposal as they only allow very small
  amounts of data to be stored, like
  [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), or the
  [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) consisting of
  the `sessionStorage` and the `localStorage` mechanisms.
- Other options are already deprecated for various reasons like the
  [File and Directory Entries API](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Introduction)
  or [WebSQL](https://www.w3.org/TR/webdatabase/).
- The [File System Access API](/file-system-access/) has a similar API surface, but its use is to
  interface with the client's file system and provide access to data that may be outside of the
  origin's or even the browser's ownership. This different focus comes with stricter security
  considerations and higher performance costs.
- The [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) can be used as
  a backend for some of the Storage Foundation API's use-cases. For example, Emscripten includes
  [IDBFS](https://emscripten.org/docs/api_reference/Filesystem-API.html), an IndexedDB-based
  persistent file system. However, since IndexedDB is fundamentally a key-value store, it comes with
  significant performance limitations. Furthermore, directly accessing subsections of a file is even
  more difficult and slower under IndexedDB.
- Finally, the
  [CacheStorage interface](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) is widely
  supported and is tuned for storing large-sized data such as web application resources, but the
  values are immutable.

The Storage Foundation API is an attempt at closing all the gaps of the previous storage options by
allowing for the performant storage of mutable large files defined within the origin of the
application.

### Suggested use cases for the Storage Foundation API {: #use-cases }

Examples of sites that may use this API include:

- Productivity or creativity apps that operate on large amounts of video, audio, or image data. Such
  apps can offload segments to disk instead of holding them in memory.
- Apps that rely on a persistent file system accessible from Wasm and that need more performance
  than what IDBFS can guarantee.

## What is the Storage Foundation API? {: #what }

There are two main parts to the API:

- **File system calls**, which provide basic functionality to interact with files and file paths.
- **File handles**, which provide read and write access to an existing file.

### File system calls

The Storage Foundation API introduces a new object, `storageFoundation`, that lives on the `window`
object and that includes a number of functions:

{% Aside %} We are currently exploring the tradeoffs between providing a synchronous versus an
asynchronous API. The interfaces are designed to be asynchronous as a temporary measure and will be
updated once a decision has been reached. For more background on the tradeoffs, see the
[Explainer](https://github.com/WICG/storage-foundation-api-explainer#sync-vs-async). {% endAside %}

- `storageFoundation.open(name)`: Opens the file with the given name if it exists and otherwise
  creates a new file. Returns a promise that resolves with the the opened file.

{% Aside 'warning' %} File names are restricted to lowercase alphanumeric characters and underscore
(`a-z`, `0-9`, `_`). {% endAside %}

{% Aside %} A file can only be opened once. This means concurrent access from different tabs is
currently not possible. {% endAside %}

- `storageFoundation.delete(name)`: Removes the file with the given name. Returns a promise that
  resolves when the file is deleted.
- `storageFoundation.rename(oldName, newName)`: Renames the file from the old name to the new name
  atomically. Returns a promise that resolves when the file is renamed.
- `storageFoundation.getAll()`: Returns a promise that resolves with an array of all existing file
  names.
- `storageFoundation.requestCapacity(requestedCapacity)`: Requests new capacity (in bytes) for usage
  by the current execution context. Returns a promise that resolved with the remaining amount of
  capacity available.

{% Aside %} The Storage Foundation API achieves fast and predictable performance by implementing its
own quota management system. Web applications must explicitly ask for capacity before storing any
new data. This request will be granted according to the browser's quota guidelines. Anytime an
application starts a new JavaScript execution context (e.g., a new tab, a new worker, or when
reloading the page), it must make sure it owns sufficient capacity before writing any data.
{% endAside %}

- `storageFoundation.releaseCapacity(toBeReleasedCapacity)`: Releases the specified number of bytes
  from the current execution context, and returns a promise that resolves with the remaining
  capacity.
- `storageFoundation.getRemainingCapacity()`: Returns a promise that resolves with the capacity
  available for the current execution context.

### File handles

Working with files happens via the following functions:

{% Aside %} The Storage Foundation API used to be called NativeIO. Some references to this name
still remain and will be removed eventually. {% endAside %}

- `NativeIOFile.close()`: Closes a file, and returns a promise that resolves when the operation
  completes.
- `NativeIOFile.flush()`: Synchronizes (that is, flushes) a file's in-memory state with the storage
  device, and returns a promise that resolves when the operation completes.

{% Aside %} It is a known issue that `flush()` might be slow and we are exploring whether offering a
faster, less reliable variant would be useful. {% endAside %}

- `NativeIOFile.getLength()`: Returns a promise that resolves with the length of the file in bytes.
- `NativeIOFile.setLength(length)`: Sets the length of the file in bytes, and returns a promise that
  resolves when the operation completes. If the new length is smaller than the current length, bytes
  are removed starting from the end of the file. Otherwise the file is extended with zero-valued
  bytes.
- `NativeIOFile.read(buffer, offset)`: Reads the contents of the file at the given offset through a
  buffer that is the result of transferring the given buffer, which is then left detached. Returns a
  `NativeIOReadResult` with the transferred buffer and the the number of bytes that were
  successfully read.

  A `NativeIOReadResult` is an object that consists of two entries:

  - `buffer`: An
    [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView), which is
    the result of transferring the buffer passed to `read()`. It is of the same type and length as
    source buffer.
  - `readBytes`: The number of bytes that were successfully read into `buffer`. This may be less
    than the buffer size, if an error occurs or if the read range spans beyond the end of the file.
    It is set to zero if the read range is beyond the end of the file.

- `NativeIOFile.write(buffer, offset)`: Writes the contents of the given buffer into the file at the
  given offset. The buffer is transferred before any data is written and is therefore left detached.
  Returns a `NativeIOWriteResult` with the transferred buffer and the number of bytes that were
  successfully written. The file will be extended if the write range exceeds its length.

  A `NativeIOWriteResult` is an object that consists of two entries:

  - `buffer`: An
    [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) which is
    the result of transferring the buffer passed to `write()`. It is of the same type and length as
    the source buffer.
  - `writtenBytes`: The number of bytes that were successfully written into `buffer`. This may be
    less than the buffer size if an error occurs.

{% Aside %} Calls to `NativeIOFile.write()` only guarantee that the data has been written to the
file, but it does not guarantee that the data has been persisted to the underlying storage. To
ensure that no data loss occurs on system crash, you must call `NativeIOFile.flush()` and wait for
it to successfully return. {% endAside %}

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | [Started][ot]            |
| 5. Launch                                | Not started              |

</div>

{% Aside %} There is currently an
[ongoing effort](https://docs.google.com/document/d/1g7ZCqZ5NdiU7oqyCpsc2iZ7rRAY1ZXO-9VoG4LfP7fM/edit?usp=sharing)
to augment the
[origin private file system](/file-system-access/#accessing-the-origin-private-file-system)
of the [File System Access API](/file-system-access/) as to not introduce yet another entry point
for a storage system. This article will be updated as we make progress on this. {% endAside %}

## How to use the Storage Foundation API {: #use }

### Enabling via about://flags

To experiment with the Storage Foundation API locally, without an origin trial token, enable the
`#experimental-web-platform-features` flag in `about://flags`.

### Enabling support during the origin trial phase

Starting in Chromium&nbsp;90, the Storage Foundation API is available as an origin trial in
Chromium. The origin trial is expected to end in Chromium&nbsp;95 (November 10, 2021).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Feature detection

To check if the Storage Foundation API is supported, use:

```js
if ('storageFoundation' in window) {
  // The Storage Foundation API is supported.
}
```

### Complete examples

To make the concepts introduced above clearer, here are two complete examples that walk you through
the different stages in the lifecycle of Storage Foundation files.

#### Opening, writing, reading, closing

```js
// Open a file (creating it if needed).
const file = await storageFoundation.open('test_file');
try {
  // Request 100 bytes of capacity for this context.
  await storageFoundation.requestCapacity(100);

  const writeBuffer = new Uint8Array([64, 65, 66]);
  // Write the buffer at offset 0. After this operation, `result.buffer`
  // contains the transferred buffer and `result.writtenBytes` is 3,
  // the number of bytes written. `writeBuffer` is left detached.
  let result = await file.write(writeBuffer, 0);

  const readBuffer = new Uint8Array(3);
  // Read at offset 1. `result.buffer` contains the transferred buffer,
  // `result.readBytes` is 2, the number of bytes read. `readBuffer` is left
  // detached.
  result = await file.read(readBuffer, 1);
  // `Uint8Array(3) [65, 66, 0]`
  console.log(result.buffer);
} finally {
  file.close();
}
```

#### Opening, listing, deleting

```js
// Open three different files (creating them if needed).
await storageFoundation.open('sunrise');
await storageFoundation.open('noon');
await storageFoundation.open('sunset');
// List all existing files.
// `["sunset", "sunrise", "noon"]`
await storageFoundation.getAll();
// Delete one of the three files.
await storageFoundation.delete('noon');
// List all remaining existing files.
// `["sunrise", "noon"]`
await storageFoundation.getAll();
```

## Demo

You can play with the [Storage Foundation API demo][demo] in the embed below. Create, rename, write
into, and read from files, and see the available capacity you have requested update as you make
changes. You can find the [source code][demo-source] of the demo on Glitch.

{% Glitch 'storage-foundation' %}

## Security and permissions

The Chromium team has designed and implemented the Storage Foundation API using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics.

Following the same pattern as other modern storage APIs on the web, access to the Storage Foundation
API is origin-bound, meaning that an origin may only access self-created data. It is also limited to
secure contexts.

### User control

Storage quota will be used to distribute access to disk space and to prevent abuse. Memory you want
to occupy needs to be requested first. Like other storage APIs, users can clear the space taken by
Storage Foundation API through their browser.

## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the Storage Foundation API.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>Storage` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Storage Foundation API? Your public support helps the Chromium team
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#StorageFoundation`](https://twitter.com/search?q=%23StorageFoundation&src=recent_search_click&f=live)
and let us know where and how you are using it. Ask a question on StackOverflow with the hashtag
[`#file-system-access-api`](https://stackoverflow.com/questions/tagged/file-system-access-api).

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [Storage Foundation API demo][demo] | [Storage Foundation API demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>Storage>NativeIO`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/566)
- [Intent to Prototype](https://groups.google.com/a/chromium.org/g/blink-dev/c/gh0gTHO18YQ)
- [WebKit thread](https://lists.webkit.org/pipermail/webkit-dev/2021-February/031687.html)
- [Mozilla thread](https://github.com/mozilla/standards-positions/issues/481)

## Acknowledgements

The Storage Foundation API was specified and implemented by
[Emanuel Krivoy](https://github.com/fivedots) and [Richard Stotz](https://github.com/rstz). This
article was reviewed by [Pete LePage](https://github.com/petele) and
[Joe Medley](https://github.com/jpmedley).

Hero image via [Markus Spiske](https://unsplash.com/@markusspiske) on
[Unsplash](https://unsplash.com/photos/iar-afB0QQw).

[issues]: https://github.com/WICG/storage-foundation-api-explainer/issues
[demo]: https://storage-foundation.glitch.me/
[demo-source]: https://glitch.com/edit/#!/storage-foundation
[explainer]: https://github.com/WICG/storage-foundation-api-explainer#readme
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=914488
[cr-status]: https://chromestatus.com/feature/5670244905385984
[blink-component]: https://chromestatus.com/features#component%3ABlink%3EStorage
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot]: https://developer.chrome.com/origintrials/#/view_trial/2916080758722396161

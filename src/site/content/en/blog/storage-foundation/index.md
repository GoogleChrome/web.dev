---
layout: post
title: 'High performance storage for your app: The Storage Foundation API'
subhead: |
  An API that is particularly well suited for Wasm-based libraries and
  applications that want to use custom storage algorithms to fine-tune
  execution speed and memory usage.
authors:
  - thomassteiner
date: 2021-06-03
# updated: 2021-06-03
description: |
  The Storage Foundation API is a storage API that resembles a very basic filesystem,
  with direct access to stored data through buffers and offsets. Its goal is to give
  developers flexibility by providing generic, simple, and performant primitives upon
  which they can build higher-level components. It is particularly well suited for
  Wasm-based libraries and applications that want to use custom storage algorithms to
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

{% Aside %}
The Storage Foundation API is part of the [capabilities project](https://web.dev/fugu-status/) and is currently in development. This post will be updated as the implementation progresses.
{% endAside %}

The web platform increasingly offers developers the tools they need to build fined-tuned
high-performance applications for the web. Most notably, [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) (Wasm) has opened the door to fast and powerful web applications, while technologies like [Emscripten](https://emscripten.org/) now allow developers to reuse tried and tested code on the web.
In order to truly leverage this potential, developers must be given the same power and flexibility when it comes to storage.

This is where the Storage Foundation API comes in. The Storage Foundation API is a new fast and unopinionated storage API that unlocks new and much-requested use cases for the web, such as implementing performant databases and gracefully managing large temporary files. With this new interface, developers will be able to "bring their own storage" to the web, reducing the feature gap between web and platform-specific code.

The Storage Foundation API is designed to resemble a very basic filesystem, aiming to give developers flexibility by providing generic, simple, and performant primitives upon which they can build higher-level components. Applications can take advantage of the best tool for their needs, finding the right balance between usability, performance, and reliability.

## Background: Why does the web need another storage API?

The web platform offers a number of storage options for developers, each of which built with specific use-cases in mind.

- Some of these options clearly do not overlap with this proposal as they only allow very small amounts of data to be stored, like [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), or the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) consisting of the `sessionStorage` and the `localStorage` mechanisms.
- Other options are already deprecated for various reasons like the [File and Directory Entries API](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Introduction) or [WebSQL](https://www.w3.org/TR/webdatabase/).
- The [File System Access API](/file-system-access/) has a similar API surface, but its main intended usage is to interface with the client's filesystem and provide access to data that may be outside of the origin's or even the browser's ownership. This different focus comes with stricter security considerations and higher performance costs.
- The [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) can be used as a backend for some of the Storage Foundation API's use-cases. For example, Emscripten includes [IDBFS](https://emscripten.org/docs/api_reference/Filesystem-API.html), an IndexedDB-based persistent file system. However, since IndexedDB is fundamentally a key-value store, it comes with significant performance limitations. Furthermore, directly accessing sub-sections of a file is even more difficult and slower under IndexedDB.
- Finally, the [CacheStorage interface](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) is widely supported and is tuned for storing large-sized data such as web application resources, but the values are immutable.

The Storage Foundation API is an attempt at closing all the gaps of the previous storage options by allowing for the performant storage of mutable large files defined within the origin of the application.

## What is the Storage Foundation API? {: #what }

There are two main parts to the API:

- **File system calls**, which provide basic functionality to interact with files and file paths
- **File handles**, which provide read and write access to an existing file

### File system calls

The Storage Foundation API introduces a new interface `storageFoundation` that lives on the `window` object and that includes a number of functions:

- `await storageFoundation.open(name)`: Opens the file with the given name if it exists and otherwise creates a new file. Returns a promise that resolves with the the opened file.
- `await storageFoundation.delete(DOMString name)`: Removes the file with the given name. Void.
- `await storageFoundation.rename(oldName, newName)`: Renames the file from the old name to the new name atomically. Void.
- `await storageFoundation.getAll()`: Returns a promise that resolves with an array of all existing file names.
- `await storageFoundation.requestCapacity(requestedCapacity)`: Requests new capacity (in bytes) for usage by the current execution context. Returns a promise that resolved with the remaining amount of capacity available.
- `await storageFoundation.releaseCapacity(toBeReleasedCapacity)`: Releases unused capacity (in bytes) from the current execution context. Returns a promised that resolves with the remaining amount of capacity available.
- `await storageFoundation.getRemainingCapacity()`: Returns a promise that resolves with the capacity available for the current execution context.

{% Aside 'warning' %}
File names are restricted to lower-case alphanumeric characters and underscore (`a-z`, `0-9`, `_`).
{% endAside %}

{% Aside %}
We are currently exploring the tradeoffs between providing a synchronous vs. asynchronous API. The interfaces are designed to be asynchronous as a temporary measure and will be updated once a decision has been reached.
{% endAside %}

### File handles

{% Aside %}
Storage Foundation API used to be called NativeIO. Some references to this name still remain and will be removed eventually.
{% endAside %}

Working with files happens via the following functions:

- `await NativeIOFile.close()`: Closes a file. Void.
- `await NativeIOFile.flush()`: Synchronizes (that is, flushes) a file's in-core state with the storage device. Void.

{% Aside %}
It is a known issue that `flush()` might be slow and we are exploring whether offering a
faster, less reliable variant would be useful.
{% endAside %}

- `await NativeIOFile.getLength()`: Returns a promise that resolves with the length of the file in bytes.
- `await NativeIOFile.setLength(length)`: Sets the length of the file in bytes. If the new length is smaller than the current length, bytes are removed starting  from the end of the file. Otherwise the file is extended with zero-valued bytes. Void.
- `await NativeIOFile.read(buffer, offset)`: Reads the contents of the file at the given offset through a buffer that is
  the result of transferring the given buffer, which is then left detached. Returns a `NativeIOReadResult` with the transferred buffer and the the number
  of bytes that were successfully read.
- `await NativeIOFile.write(buffer, offset)`: Writes the contents of the given buffer into the file at the given offset.
  The buffer is transferred before any data is written and is therefore left detached. Returns a `NativeIOWriteResult` with the transferred
  buffer and the number of bytes that were successfully written. The file will be extended if the write range spans beyond its length.

{% Aside %}
Calls to `NativeIOFile.write()` only guarantee that the data has been written to the
file, but it does not guarantee that the data has been persisted to the
underlying storage. To ensure that no data loss occurs on system crash, you must call
`NativeIOFile.flush()` and wait for it to successfully return.
{% endAside %}

### Suggested use cases for the API_NAME API {: #use-cases }

Examples of sites that may use this API include:

*

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [In Progress][spec]          |
| 3. Gather feedback & iterate on design     | [In progress](#feedback)     |
| 4. Origin trial                            | [Started][ot]                  |
| 5. Launch                                  | Not started                  |

</div>
## How to use the API_NAME API {: #use }

### Enabling via about://flags

To experiment with the API_NAME API locally, without an origin trial token, enable the `#TODO` flag in `about://flags`.

### Enabling support during the origin trial phase

Starting in Chromium XX, the API_NAME API will be available as an origin trial in Chromium. The origin trial is expected to end in Chromium XX (TODO exact date).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Progressive enhancement


### Feature detection

To check if the Storage Foundation API is supported, use:

```javascript

```

### DevTools support



## Security and permissions

The Chromium team has designed and implemented the API_NAME API using the core principles defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user control, transparency, and ergonomics.

### User control


### Transparency


### Permission persistence


## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the API_NAME API.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods or properties that you need to implement your idea? Have a question or comment on the security model?
File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can, simple instructions for reproducing, and enter `Blink>Storage` in the **Components** box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the API_NAME API? Your public support helps the Chromium team prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag [`#StorageFoundation`](https://twitter.com/search?q=%23StorageFoundation&src=recent_search_click&f=live) and let us know where and how you are using it.
Ask a question on StackOverflow with the hashtag [`#file-system-access-api`](https://stackoverflow.com/questions/tagged/file-system-access-api).

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [TODO API Demo][demo] | [TODO API Demo source][demo-source]
* [Chromium tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`TODO`][blink-component]
* [TAG Review](TODO)
* [Intent to Ship](TODO)
* [WebKit-Dev thread](TODO)
* [WebKit implementation bug](TODO)
* [Mozilla thread](TODO)
* [Mozilla implementation bug](TODO)


## Acknowledgements

The Storage Foundation API was specified and implemented by
[Emanuel Krivoy](https://github.com/fivedots) and
[Richard Stotz](https://github.com/rstz).
This article was reviewed by [Joe Medley](https://github.com/jpmedley).

Hero image via [Markus Spiske](https://unsplash.com/@markusspiske) on [Unsplash](https://unsplash.com/photos/iar-afB0QQw).

[issues]: https://github.com/WICG/storage-foundation-api-explainer/issues
[demo]: TODO
[demo-source]: TODO
[explainer]: https://github.com/WICG/storage-foundation-api-explainer
[wicg-discourse]: TODO
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=914488
[cr-status]: https://chromestatus.com/feature/5670244905385984
[blink-component]: https://chromestatus.com/features#component%3ABlink%3EStorage
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot]: https://developer.chrome.com/origintrials/#/view_trial/2916080758722396161

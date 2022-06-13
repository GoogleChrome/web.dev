---
title: The synchronous FileSystem API for workers
authors:
  - ericbidelman
date: 2011-10-25
updated: 2013-07-30
tags:
  - blog
---

## Introduction

The HTML5 [FileSystem API][fs-spec] and [Web Workers][workers-spec] are massively
powerful in their own regard. The FileSystem API finally brings hierarchical storage and
file I/O to web applications and Workers bring true asynchronous 'multi-threading'
to JavaScript. However, when you use these APIs together, you can build some truly interesting apps.

This tutorial provides a guide and code examples for leveraging the HTML5
FileSystem inside of a Web Worker. It assumes a working knowledge of
both APIs. If you're not quite ready to dive in or are interested in learning
more about those APIs, read two great tutorials that discuss the basics:
[Exploring the FileSystem APIs](https://www.html5rocks.com/tutorials/file/filesystem/) and
[Basics of Web Workers](https://www.html5rocks.com/tutorials/workers/basics/).

## Synchronous vs. Asynchronous APIs

Asynchronous JavaScript APIs can be tough to use. They're large. They're complex.
But what's most frustrating is that they offer plenty of opportunities for things to go wrong.
The last thing you want to deal with is layering on a complex asynchronous API (FileSystem)
in an already asynchronous world (Workers)! The good news is that the
[FileSystem API][fs-spec] defines a synchronous version to ease the pain in Web Workers.

For the most part, the synchronous API is exactly the same as its asynchronous cousin.
The methods, properties, features, and functionality will be familiar. The major deviations are:

* The synchronous API can only be used within a Web Worker context, whereas the
asynchronous API can be used in and out of a Worker.
* Callbacks are out. API methods now return values.
* The global methods on the window object (`requestFileSystem()` and
`resolveLocalFileSystemURL()`) become `requestFileSystemSync()` and
`resolveLocalFileSystemSyncURL()`.

{% Aside %}
These methods are members of the
worker's global scope, not the `window` object.
{% endAside %}

Apart from these exceptions, the APIs are the same. OK, we're good to go!

## Requesting a filesystem

A web application obtains access to the synchronous filesystem by requesting a
`LocalFileSystemSync` object from within a Web Worker. The `requestFileSystemSync()`
is exposed to the Worker's global scope:

```js
var fs = requestFileSystemSync(TEMPORARY, 1024*1024 /*1MB*/);
```

Notice the new return value now that we're using the synchronous API as well as
the absence of success and error callbacks.

As with the normal FileSystem API, methods are prefixed at the moment:

```js
self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
                                 self.requestFileSystemSync;
```

### Dealing with quota

Currently, it's not possible to [request `PERSISTENT` quota](https://www.html5rocks.com/tutorials/file/filesystem/#toc-requesting-quota) in a Worker context. I recommend taking care of quota issues outside of Workers.
The process could look like something this:

1.  worker.js: Wrap any FileSystem API code in a `try/catch` so any
`QUOTA_EXCEED_ERR` errors are caught.
1. worker.js: If you catch a `QUOTA_EXCEED_ERR`, send a `postMessage('get me more quota')` back to the main app.
1. main app: Go through the `window.webkitStorageInfo.requestQuota()` dance when #2 is received.
1. main app: After the user grants more quota, send `postMessage('resume writes')` back
to the worker to inform it of additional storage space.

That's a fairly involved workaround, but it should work. See [requesting quota](https://www.html5rocks.com/tutorials/file/filesystem/#toc-requesting-quota) for more information on using `PERSISTENT` storage with the FileSystem API.

## Working with files and directories

The synchronous version of `getFile()` and `getDirectory()` return a `FileEntrySync`
and `DirectoryEntrySync`, respectively.

For example, the following code creates an empty file called "log.txt" in the
root directory.

```js
var fileEntry = fs.root.getFile('log.txt', {create: true});
```

The following creates a new directory in the root folder.

```js
var dirEntry = fs.root.getDirectory('mydir', {create: true});
```

## Handling errors

If you've never had to debug Web Worker code, I envy you! It can be a real pain
to figure out what is going wrong.

The lack of error callbacks in the synchronous world makes dealing with problems
trickier than they should be. If we add the general complexity of debugging Web Worker code,
you'll be frustrated in no time. One thing that can make life easier is to wrap all
of your relevant Worker code in a try/catch. Then, if any errors occur, forward
the error to the main app using `postMessage()`:

```js
function onError(e) {
    postMessage('ERROR: ' + e.toString());
}

try {
    // Error thrown if "log.txt" already exists.
    var fileEntry = fs.root.getFile('log.txt', {create: true, exclusive: true});
} catch (e) {
    onError(e);
}
```

## Passing around Files, Blobs, and ArrayBuffers

When Web Workers first came on the scene, they only allowed string data to be
sent in `postMessage()`. Later, browsers began accepting serializable data, which
meant passing a JSON object was possible. Recently however, some browsers like Chrome
accept more complex data types to be passed through `postMessage()` using the
[structured clone algorithm][structuredclone].

What does this really mean? It means that it's a heck of a lot easier to pass
binary data between main app and the Worker thread. Browsers that support structured cloning
for Workers allow you to pass Typed Arrays, `ArrayBuffer`s, `File`s, or `Blob`s
into Workers. Although the data is still a copy, being able to pass a `File` means
a performance benefit over the former approach, which involved base64ing the file
before passing it into `postMessage()`.

The following example passes a user-selected list of files to an dedicated Worker.
The Worker simply passes through the file list (simple to show the returned data
is actually a `FileList`) and the main app reads each file as an `ArrayBuffer`.

The sample also uses an improved version of the [inline Web Worker technique](https://www.html5rocks.com/tutorials/workers/basics/#toc-inlineworkers)
described in [Basics of Web Workers](https://www.html5rocks.com/tutorials/workers/basics/).

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <title>Passing a FileList to a Worker</title>
    <script type="javascript/worker" id="fileListWorker">
    self.onmessage = function(e) {
    // TODO: do something interesting with the files.
    postMessage(e.data); // Pass through.
    };
    </script>
</head>
<body>
</body>

<input type="file" multiple>

<script>
document.querySelector('input[type="file"]').addEventListener('change', function(e) {
    var files = this.files;
    loadInlineWorker('#fileListWorker', function(worker) {

    // Setup handler to process messages from the worker.
    worker.onmessage = function(e) {

        // Read each file aysnc. as an array buffer.
        for (var i = 0, file; file = files[i]; ++i) {
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log(this.result); // this.result is the read file as an ArrayBuffer.
        };
        reader.onerror = function(e) {
            console.log(e);
        };
        reader.readAsArrayBuffer(file);
        }

    };

    worker.postMessage(files);
    });
}, false);


function loadInlineWorker(selector, callback) {
    window.URL = window.URL || window.webkitURL || null;

    var script = document.querySelector(selector);
    if (script.type === 'javascript/worker') {
    var blob = new Blob([script.textContent]);
    callback(new Worker(window.URL.createObjectURL(blob));
    }
}
</script>
</html>
```

## Reading files in a Worker

It's perfectly acceptable to use the asynchronous [`FileReader` API to read files](https://www.html5rocks.com/tutorials/file/dndfiles/#toc-reading-files) in a Worker. However, there's a better way. In Workers, there's a
synchronous API (`FileReaderSync`) that streamlines reading files:

*Main app:*

```html
<!DOCTYPE html>
<html>
<head>
    <title>Using FileReaderSync Example</title>
    <style>
    #error { color: red; }
    </style>
</head>
<body>
<input type="file" multiple />
<output id="error"></output>
<script>
    var worker = new Worker('worker.js');

    worker.onmessage = function(e) {
    console.log(e.data); // e.data should be an array of ArrayBuffers.
    };

    worker.onerror = function(e) {
    document.querySelector('#error').textContent = [
        'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join('');
    };

    document.querySelector('input[type="file"]').addEventListener('change', function(e) {
    worker.postMessage(this.files);
    }, false);
</script>
</body>
</html>
```

*worker.js*

```js
self.addEventListener('message', function(e) {
    var files = e.data;
    var buffers = [];

    // Read each file synchronously as an ArrayBuffer and
    // stash it in a global array to return to the main app.
    [].forEach.call(files, function(file) {
    var reader = new FileReaderSync();
    buffers.push(reader.readAsArrayBuffer(file));
    });

    postMessage(buffers);
}, false);
```

As expected, callbacks are gone with the synchronous `FileReader`. This simplifies
the amount of callback nesting when reading files. Instead, the readAs* methods
returns the read file.

## Example: Fetching all entries

In some cases, the synchronous API is much cleaner for certain tasks. Fewer callbacks
are nice and certainly make things more readable. The real downside of the
synchronous API stems from the limitations of Workers.

For security reasons, data between the calling app and a Web Worker thread is
never shared. Data is always copied to and from the Worker when `postMessage()` is called.
As a result, not every data type can be passed.

Unfortunately, `FileEntrySync` and `DirectoryEntrySync` don't currently fall
into the accepted types. So how can you get entries back to the calling app?
One way to circumvent the limitation is to return a list of [filesystem: URLs](https://www.html5rocks.com/tutorials/file/filesystem/#toc-filesystemurls) instead of a list of entries. `filesystem:` URLs are just strings,
so they're super easy to pass around. Furthermore, they can be resolved to 
entries in the main app using `resolveLocalFileSystemURL()`. That gets you back
to a `FileEntrySync`/`DirectoryEntrySync` object.

*Main app:*

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="chrome=1">
<title>Listing filesystem entries using the synchronous API</title>
</head>
<body>
<script>
    window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL ||
                                        window.webkitResolveLocalFileSystemURL;

    var worker = new Worker('worker.js');
    worker.onmessage = function(e) {
    var urls = e.data.entries;
    urls.forEach(function(url, i) {
        window.resolveLocalFileSystemURL(url, function(fileEntry) {
        console.log(fileEntry.name); // Print out file's name.
        });
    });
    };

    worker.postMessage({'cmd': 'list'});
</script>
</body>
</html>
```

*worker.js*

```js
self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
                                self.requestFileSystemSync;

var paths = []; // Global to hold the list of entry filesystem URLs.

function getAllEntries(dirReader) {
    var entries = dirReader.readEntries();

    for (var i = 0, entry; entry = entries[i]; ++i) {
    paths.push(entry.toURL()); // Stash this entry's filesystem: URL.

    // If this is a directory, we have more traversing to do.
    if (entry.isDirectory) {
        getAllEntries(entry.createReader());
    }
    }
}

function onError(e) {
    postMessage('ERROR: ' + e.toString()); // Forward the error to main app.
}

self.onmessage = function(e) {
    var data = e.data;

    // Ignore everything else except our 'list' command.
    if (!data.cmd || data.cmd != 'list') {
    return;
    }

    try {
    var fs = requestFileSystemSync(TEMPORARY, 1024*1024 /*1MB*/);

    getAllEntries(fs.root.createReader());

    self.postMessage({entries: paths});
    } catch (e) {
    onError(e);
    }
};
```

## Example: Downloading files using XHR2

A common use case for Workers is to download a bunch of files using [XHR2](https://www.html5rocks.com/tutorials/file/xhr2/),
and write those files to the HTML5 FileSystem. This is a perfect task for a Worker thread!

The following example only fetches and writes one file, but you can image
expanding it to download a set of files.

*Main app:*

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="chrome=1">
<title>Download files using a XHR2, a Worker, and saving to filesystem</title>
</head>
<body>
<script>
    var worker = new Worker('downloader.js');
    worker.onmessage = function(e) {
    console.log(e.data);
    };
    worker.postMessage({fileName: 'GoogleLogo',
                        url: 'googlelogo.png', type: 'image/png'});
</script>
</body>
</html>
```

*downloader.js:*

```js
self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
                                self.requestFileSystemSync;

function makeRequest(url) {
    try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // Note: synchronous
    xhr.responseType = 'arraybuffer';
    xhr.send();
    return xhr.response;
    } catch(e) {
    return "XHR Error " + e.toString();
    }
}

function onError(e) {
    postMessage('ERROR: ' + e.toString());
}

onmessage = function(e) {
    var data = e.data;

    // Make sure we have the right parameters.
    if (!data.fileName || !data.url || !data.type) {
    return;
    }
    
    try {
    var fs = requestFileSystemSync(TEMPORARY, 1024 * 1024 /*1MB*/);

    postMessage('Got file system.');

    var fileEntry = fs.root.getFile(data.fileName, {create: true});

    postMessage('Got file entry.');

    var arrayBuffer = makeRequest(data.url);
    var blob = new Blob([new Uint8Array(arrayBuffer)], {type: data.type});

    try {
        postMessage('Begin writing');
        fileEntry.createWriter().write(blob);
        postMessage('Writing complete');
        postMessage(fileEntry.toURL());
    } catch (e) {
        onError(e);
    }

    } catch (e) {
    onError(e);
    }
};
```

## Conclusion

Web Workers are an underutilized and under-appreciated feature
of HTML5. Most developers I talk to don't need the extra computational benefits, 
but they can be used for more than just pure computation.
If you're skeptical (as I was), I hope this article has helped change your mind.
Offloading things like disc operations (Filesystem API calls) or HTTP requests to a Worker
are a natural fit and also help compartmentalize your code. The HTML5 File APIs
inside of Workers opens a whole new can of awesomeness for web apps that a lot of folks haven't explored.

[fs-spec]: http://dev.w3.org/2009/dap/file-system/file-dir-sys.html
[workers-spec]: http://www.whatwg.org/specs/web-apps/current-work/multipage/workers.html
[structuredclone]: https://developer.mozilla.org/DOM/The_structured_clone_algorithm
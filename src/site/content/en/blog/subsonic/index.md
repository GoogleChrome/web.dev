---
layout: post
title: Case Study - SONAR, HTML5 Game Development
authors:
  - seanmiddleditch
date: 2012-07-25
tags:
  - blog
  - case-study
---

## Introduction

Last summer I worked as the technical lead on a commercial WebGL game called [SONAR](https://chrome.google.com/webstore/detail/bnnkhdiodblfknjkjcifnpcmbkckmiaf). The project took around three months to complete, and was done completely from scratch in JavaScript. During the development of SONAR, we had to find innovative solutions to a number of problems in the new and untested HTML5 waters. In particular, we needed a solution to a seemingly simple problem: how do we download and cache 70+ MB of game data when the player starts the game?

Other platforms have ready-made solutions for this problem. Most consoles and PC games load resources off of a local CD/DVD or from a hard-drive. Flash can package all resources as part of the SWF file that contains the game, and Java can do the same with JAR files. Digital distribution platforms like Steam or the App Store ensure that all resources are downloaded and installed before the player can even start the game.

HTML5 doesn'’'t give us these mechanisms, but it does give us all of the tools we need to build our own game resource download system. The upside to building our own system is that we get all the control and flexibility we need, and can build a system that exactly matches our needs.

## Retrieval

Before we had resource caching at all we had a simple chained resource loader.  This system allowed us to request individual resources by relative path, which could in turn request more resources.  Our loading screen presented a simple progress meter that gauged how much more data needed to be loaded, and transitioned to the next screen only after the resource loader queue was empty.

The design of this system allowed us to easily switch between packaged resources and loose (unpackaged) resources served over a local HTTP server, which was really instrumental in ensuring that we could rapidly iterate on both game code and data.

The following code illustrates the basic design of our chained resource loader, with error handling and the more advanced XHR/image loading code removed to keep things readable.

```js
function ResourceLoader() {
  this.pending = 0;
  this.baseurl = './';
  this.oncomplete = function() {};
}

ResourceLoader.prototype.request = function(path, callback) {
  var xhr = new XmlHttpRequest();
  xhr.open('GET', this.baseurl + path);
  var self = this;

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(path, xhr.response, self);

      if (--self.pending == 0) {
        self.oncomplete();
      }
    }
  };

  xhr.send();
};
```

The usage of this interface is pretty simple but also quite flexible. The initial game code can request some data files that describe the initial game level and game objects. These might be simple JSON files, for instance. The callback used for these files then inspect that data and can make additional requests (chained requests) for dependencies. The game objects definition file might list models and materials, and the callback for materials might then request texture images.

The `oncomplete` callback attached to the main `ResourceLoader` instance will only be called after all resources are loaded. The game loading screen can just wait for that callback to be invoked before transitioning to the next screen.

Quite a bit more can be done with this interface, of course. As exercises for the reader, a few additional features that are worth investigating are adding progress/percentage support, adding image loading (using the Image type), adding automatic parsing of JSON files, and of course, error handling.

The most important feature for this article is the baseurl field, which allows us to easily switch the source of files we request. It's easy to set up the core engine to allow a `?uselocal` type of query parameter in the URL to request resources from a URL served by the same local Web server (like `python -m SimpleHTTPServer`) that served the main HTML document for the game, while using the cache system if the parameter is not set.

## Packaging Resources

One problem with chained loading of resources is that there's no way to get a complete byte count of all the data. The consequence of this is that there's no way to make a simple, reliable progress dialog for downloads. Since we're going to be downloading all the content and caching it, and this can take a rather long time for larger games, giving the player a nice progress dialog is pretty important.

The easiest fix for this problem (which also gives us a few other nice advantages) is to package all the resource files into a single bundle, which we'll download with a single XHR call, which gives us the progress events we need to display a nice progress bar.

Building a custom bundle file format is not terribly hard, and would even solve a few problems, but would require creating a tool for creating the bundle format. An alternative solution is to use an existing archive format for which tools already exist, and then need to write a decoder to run in the browser. We don't need a compressed archive format because HTTP can already compress data using gzip or deflate algorithms just fine. For these reasons, we settled on the TAR file format.

TAR is a relatively simple format. Every record (file) has a 512 byte header, followed by the file contents padded out to 512 bytes. The header has only a few relevant or interesting fields for our purposes, mainly the file type and name, which are stored at fixed positions within the header.

Header fields in the TAR format are stored at fixed locations with fixed sizes in the header block. For example, the last modification timestamp of the file is stored at 136 bytes from the start of the header, and is 12 bytes long. All numeric fields are encoded as octal numbers stored in ASCII format. To parse the fields, then, we extract the fields from our array buffer, and for numeric fields we call `parseInt()` being sure to pass in the second parameter to indicate the desired octal base.

One of the most important fields is the type field. This is a single digit octal number which tells us what type of file the record contains. The only two interesting record types for our purposes are regular files (`'0'`) and directories (`'5'`). If we were dealing with arbitrary TAR files we might also care about symbolic links (`'2'`) and possibly hard links (`'1'`).

Each header is followed immediately by the contents of the file described by the header (excepting file types that have no contents of their own, like directories). The file contents are then followed by padding to ensure that every header begins on a 512-byte boundary. Thus, to calculate the total length of a file record in a TAR file, we first must read the header for the file. We then add the length of the header (512 bytes) with the length of the file contents extracted from the header. Finally, we add any padding bytes necessary to make the offset align to 512 bytes, which can be done easily by dividing the file length by 512, taking the ceiling of the number, and then multiplying by 512.

```js
// Read a string out of an array buffer with a maximum string length of 'len'.
// state is an object containing two fields: the array buffer in 'buffer' and
// the current input index in 'index'.
function readString (state, len) {
  var str = '';

  // We read out the characters one by one from the array buffer view.
  // this actually is a lot faster than it looks, at least on Chrome.
  for (var i = state.index, e = state.index + len; i != e; ++i) {
    var c = state.buffer[i];

    if (c == 0) { // at NUL byte, there's no more string
      break;
    }

    str += String.fromCharCode(c);
  }

  state.index += len;

  return str;
}

// Read the next file header out of a tar file stored in an array buffer.
// state is an object containing two fields: the array buffer in 'buffer' and
// the current input index in 'index'.
function readTarHeader (state) {
  // The offset of the file this header describes is always 512 bytes from
  // the start of the header
  var offset = state.index + 512;

  // The header is made up of several fields at fixed offsets within the
  // 512 byte block allocated for the header.  fields have a fixed length.
  // all numeric fields are stored as octal numbers encoded as ASCII
  // strings.
  var name = readString(state, 100);
  var mode = parseInt(readString(state, 8), 8);
  var uid = parseInt(readString(state, 8), 8);
  var gid = parseInt(readString(state, 8), 8);
  var size = parseInt(readString(state, 12), 8);
  var modified = parseInt(readString(state, 12), 8);
  var crc = parseInt(readString(state, 8), 8);
  var type = parseInt(readString(state, 1), 8);
  var link = readString(state, 100);

  // The header is followed by the file contents, then followed
  // by padding to ensure that the next header is on a 512-byte
  // boundary.  advanced the input state index to the next
  // header.
  state.index = offset + Math.ceil(size / 512) * 512;

  // Return the descriptor with the relevant fields we care about
  return {
    name : name,
    size : size,
    type : type,
    offset : offset
  };
};
```

I looked around for existing TAR readers, and found a few, but none that did not have other dependencies or which would easily fit into our existing codebase. For this reason, I chose to write my own. I also took the time to optimize the loading as best as possible, and ensure that the decoder easily handles both binary and string data within the archive.

One of the first problems I had to solve was how to actually get the data loaded from an XHR request. I originally started with a "binary string" approach. Unfortunately, converting from binary strings to more readily usable binary forms like an `ArrayBuffer` is not straightforward, nor are such conversions particularly quick. Converting to `Image` objects is equally painful.

I settled on loading the TAR files as an `ArrayBuffer` directly from the XHR request and adding a small convenience function for converting chunks from the `ArrayBuffer` to a string. Currently my code only handles basic ANSI/8-bit characters, but this can be fixed once a more convenient conversion API is available in browsers.

The code simply scans over the `ArrayBuffer` parsing out record headers, which includes all of the relevant TAR header fields (and a few not-so-relevant ones) as well as the location and size of the file data within the `ArrayBuffer`. The code can also optionally extract the data as an `ArrayBuffer` view and store that in the returned record headers list.

The code is freely available under a friendly, permissive Open Source license at [https://github.com/subsonicllc/TarReader.js](https://github.com/subsonicllc/TarReader.js).

## FileSystem API

For actually storing file contents and accessing them later, we used the FileSystem API. The API is quite new but already has some great documentation, including the excellent [HTML5 Rocks FileSystem article](https://www.html5rocks.com/tutorials/file/filesystem/).

The FileSystem API is not without its caveats. For one thing, its an event-driven interface; this both makes the API non-blocking which is great for UI but also makes it a pain to use. [Using the FileSystem API from a WebWorker](https://www.html5rocks.com/tutorials/file/filesystem-sync/) can alleviate this problem, but that would require splitting the entire downloading and unpacking system into a WebWorker. That might even be the best approach, but it's not the one I went with due to time constraints (I was not familiar with WorkWorkers yet), so I had to deal with the asynchronous event-driven nature of the API.

Our needs are mostly focused on writing out files into a directory structure. This requires a series of steps for each file. First, we need to take the file path and turn it into a list, which is easily done by splitting the path string on the path separator character (which is always the forward-slash, like URLs). Then we need to iterate over each element in the resulting list save for the last, recursively creating a directory (if necessary) in the local filesystem. Then we can create the file, and then create a `FileWriter`, and finally write out the file contents.

A second important thing to take into account is the file size limit of the FileSystem API's `PERSISTENT` storage. We wanted persistent storage because the temporary storage can be cleared at any time, including while the user is in the middle of playing our game right before it tries to load the evicted file.

For apps targeting the Chrome Web Store, there are no storage limits when using the `unlimitedStorage` permission in the application's manifest file. However, regular web apps can still request space with the experimental quota request interface.

```js
function allocateStorage(space_in_bytes, success, error) {
  webkitStorageInfo.requestQuota(
    webkitStorageInfo.PERSISTENT,
    space_in_bytes,
    function() {
      webkitRequestFileSystem(PERSISTENT, space_in_bytes, success, error);      
    },
    error
  );
}
```
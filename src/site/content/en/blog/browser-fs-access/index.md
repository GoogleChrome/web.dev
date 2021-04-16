---
layout: post
title: Reading and writing files and directories with the browser-fs-access library
authors:
  - thomassteiner
description: |
  All modern browsers can read local files and directories; however,
  true write access, that is, more than just downloading files,
  is limited to browsers that implement the File System Access API.
  This post introduces a support library called browser-fs-access
  that acts as an abstraction layer on top of the File System Access API
  and that transparently falls back to legacy approaches for dealing with files.
scheduled: true
date: 2020-07-27
updated: 2021-01-27
hero: image/admin/Y4wGmGP8P0Dc99c3eKkT.jpg
tags:
  - blog
  - progressive-web-apps
  - capabilities
  - file-system
  - file-system-access
feedback:
  - api
---

Browsers have been able to deal with files and directories for a long time.
The [File API](https://w3c.github.io/FileAPI/)
provides features for representing file objects in web applications,
as well as programmatically selecting them and accessing their data.
The moment you look closer, though, all that glitters is not gold.

## The traditional way of dealing with files

{% Aside %}
  If you know how it used to work the old way, you can
  [jump down straight to the new way](#the-file-system-access-api).
{% endAside %}

### Opening files

As a developer, you can open and read files via the
[`<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
element.
In its simplest form, opening a file can look something like the code sample below.
The `input` object gives you a [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList),
which in the case below consists of just one
[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).
A `File` is a specific kind of [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob),
and can be used in any context that a Blob can.

```js
const openFile = async () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => {
      resolve(input.files[0]);
    });
    input.click();
  });
};
```

### Opening directories

For opening folders (or directories), you can set the
[`<input webkitdirectory>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-webkitdirectory)
attribute.
Apart from that, everything else works the same as above.
Despite its vendor-prefixed name,
`webkitdirectory` is not only usable in Chromium and WebKit browsers, but also in the legacy EdgeHTML-based Edge as well as in Firefox.

### Saving (rather: downloading) files

For saving a file, traditionally, you are limited to *downloading* a file,
which works thanks to the
[`<a download>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download:~:text=download)
attribute.
Given a Blob, you can set the anchor's `href` attribute to a `blob:` URL that you can get from the
[`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
method.
{% Aside 'caution' %}
To prevent memory leaks, always revoke the URL after the download.
{% endAside %}

```js
const saveFile = async (blob) => {
  const a = document.createElement('a');
  a.download = 'my-file.txt';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
```

### The problem

A massive downside of the *download* approach is that there is no way to make a classic
open→edit→save flow happen, that is, there is no way to *overwrite* the original file.
Instead, you end up with a new *copy* of the original file
in the operating system's default Downloads folder whenever you "save".

## The File System Access API

The File System Access API makes both operations, opening and saving, a lot simpler.
It also enables *true saving*, that is, you can not only choose where to save a file,
but also overwrite an existing file.

{% Aside %}
  For a more thorough introduction to the File System Access API, see the article
  [The File System Access API: simplifying access to local files](/file-system-access/).
{% endAside %}

### Opening files

With the [File System Access API](https://wicg.github.io/file-system-access/),
opening a file is a matter of one call to the `window.showOpenFilePicker()` method.
This call returns a file handle, from which you can get the actual `File` via the `getFile()` method.

```js
const openFile = async () => {
  try {
    // Always returns an array.
    const [handle] = await window.showOpenFilePicker();
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

### Opening directories

Open a directory by calling
`window.showDirectoryPicker()` that makes directories selectable in the file dialog box.

### Saving files

Saving files is similarly straightforward.
From a file handle, you create a writable stream via `createWritable()`,
then you write the Blob data by calling the stream's `write()` method,
and finally you close the stream by calling its `close()` method.

```js
const saveFile = async (blob) => {
  try {
    const handle = await window.showSaveFilePicker({
      types: [{
        accept: {
          // Omitted
        },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return handle;
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

## Introducing browser-fs-access

As perfectly fine as the File System Access API is,
it's [not yet  widely available](https://caniuse.com/#feat=file-system-access-api).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/G1jsSjCBR871W1uKQWeN.png", alt="Browser support table for the File System Access API. All browsers are marked as 'no support' or 'behind a flag'.", width="800", height="224", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Browser support table for the File System Access API.
    (<a href="https://caniuse.com/?search=file%20system%20access%20api">Source</a>)
  </figcaption>
</figure>

This is why I see the File System Access API as a [progressive enhancement](/progressively-enhance-your-pwa).
As such, I want to use it when the browser supports it,
and use the traditional approach if not;
all while never punishing the user with unnecessary downloads of unsupported JavaScript code.
The [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access)
library is my answer to this challenge.

### Design philosophy

Since the File System Access API is still likely to change in the future,
the browser-fs-access API is not modeled after it.
That is, the library is not a [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill),
but rather a [ponyfill](https://github.com/sindresorhus/ponyfill).
You can (statically or dynamically) exclusively import whatever functionality you need to keep your app as small as possible.
The available methods are the aptly named
[`fileOpen()`](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files),
[`directoryOpen()`](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories), and
[`fileSave()`](https://github.com/GoogleChromeLabs/browser-fs-access#saving-files).
Internally, the library feature-detects if the File System Access API is supported,
and then imports the corresponding code path.

### Using the browser-fs-access library

The three methods are intuitive to use.
You can specify your app's accepted `mimeTypes` or file `extensions`, and set a `multiple` flag
to allow or disallow selection of multiple files or directories.
For full details, see the
[browser-fs-access API documentation](https://github.com/GoogleChromeLabs/browser-fs-access#api-documentation).
The code sample below shows how you can open and save image files.

```js
// The imported methods will use the File
// System Access API or a fallback implementation.
import {
  fileOpen,
  directoryOpen,
  fileSave,
} from 'https://unpkg.com/browser-fs-access';

(async () => {
  // Open an image file.
  const blob = await fileOpen({
    mimeTypes: ['image/*'],
  });

  // Open multiple image files.
  const blobs = await fileOpen({
    mimeTypes: ['image/*'],
    multiple: true,
  });

  // Open all files in a directory,
  // recursively including subdirectories.
  const blobsInDirectory = await directoryOpen({
    recursive: true
  });

  // Save a file.
  await fileSave(blob, {
    fileName: 'Untitled.png',
  });
})();
```

### Demo

You can see the above code in action in a [demo](https://browser-fs-access.glitch.me/) on Glitch.
Its [source code](https://glitch.com/edit/#!/browser-fs-access) is likewise available there.
Since for security reasons cross origin sub frames are not allowed to show a file picker,
the demo cannot be embedded in this article.

## The browser-fs-access library in the wild

In my free time, I contribute a tiny bit to an
[installable PWA](/progressive-web-apps/#installable)
called [Excalidraw](https://excalidraw.com/),
a whiteboard tool that lets you easily sketch diagrams with a hand-drawn feel.
It is fully responsive and works well on a range of devices from small mobile phones to computers with large screens.
This means it needs to deal with files on all the various platforms
whether or not they support the File System Access API.
This makes it a great candidate for the browser-fs-access library.

I can, for example, start a drawing on my iPhone,
save it (technically: download it, since Safari does not support the File System Access API)
to my iPhone Downloads folder, open the file on my desktop (after transferring it from my phone),
modify the file, and overwrite it with my changes, or even save it as a new file.

<figure class="w-figure">
  {% Img src="image/admin/u1Gwxp5MxS39wl8PW2vz.png", alt="An Excalidraw drawing on an iPhone.", width="300", height="649", class="w-screenshot" %}
  <figcaption class="w-figcaption">Starting an Excalidraw drawing on an iPhone where the File System Access API is not supported, but where a file can be saved (downloaded) to the Downloads folder.</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/W1lt36DtKuveBJJTzonC.png", alt="The modified Excalidraw drawing on Chrome on the desktop.", width="800", height="592", class="w-screenshot" %}
  <figcaption class="w-figcaption">Opening and modifying the Excalidraw drawing on the desktop where the File System Access API is supported and thus the file can be accessed via the API.</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/srqhiMKy2i9UygEP4t8e.png", alt="Overwriting the original file with the modifications.", width="800", height="585", class="w-screenshot" %}
  <figcaption class="w-figcaption">Overwriting the original file with the modifications to the original Excalidraw drawing file. The browser shows a dialog asking me whether this is fine.</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/FLzOZ4eXZ1lbdQaA4MQi.png", alt="Saving the modifications to a new Excalidraw drawing file.", width="800", height="592", class="w-screenshot" %}
  <figcaption class="w-figcaption">Saving the modifications to a new Excalidraw file. The original file remains untouched.</figcaption>
</figure>

### Real life code sample

Below, you can see an actual example of browser-fs-access as it is used in Excalidraw.
This excerpt is taken from
[`/src/data/json.ts`](https://github.com/excalidraw/excalidraw/blob/cd87bd6901b47430a692a06a8928b0f732d77097/src/data/json.ts#L24-L52).
Of special interest is how the `saveAsJSON()` method passes either a file handle or `null` to browser-fs-access'
`fileSave()` method, which causes it to overwrite when a handle is given,
or to save to a new file if not.

```js
export const saveAsJSON = async (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  fileHandle: any,
) => {
  const serialized = serializeAsJSON(elements, appState);
  const blob = new Blob([serialized], {
    type: "application/json",
  });
  const name = `${appState.name}.excalidraw`;
  (window as any).handle = await fileSave(
    blob,
    {
      fileName: name,
      description: "Excalidraw file",
      extensions: ["excalidraw"],
    },
    fileHandle || null,
  );
};

export const loadFromJSON = async () => {
  const blob = await fileOpen({
    description: "Excalidraw files",
    extensions: ["json", "excalidraw"],
    mimeTypes: ["application/json"],
  });
  return loadFromBlob(blob);
};
```

### UI considerations

Whether in Excalidraw or your app,
the UI should adapt to the browser's support situation.
If the File System Access API is supported (`if ('showOpenFilePicker' in window) {}`)
you can show a **Save As** button in addition to a **Save** button.
The screenshots below show the difference between Excalidraw's responsive main app toolbar on iPhone and on Chrome desktop.
Note how on iPhone the **Save As** button is missing.

<figure class="w-figure">
  {% Img src="image/admin/c2sjjj86zh53VDrPIo6M.png", alt="Excalidraw app toolbar on iPhone with just a 'Save' button.", width="300", height="226", class="w-screenshot" %}
  <figcaption class="w-figcaption">Excalidraw app toolbar on iPhone with just a <strong>Save</strong> button.</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/unUUghwH5mG2hLnaViHK.png", alt="Excalidraw app toolbar on Chrome desktop with a 'Save' and a 'Save As' button.", width="300", height="66", class="w-screenshot" %}
  <figcaption class="w-figcaption">Excalidraw app toolbar on Chrome  with a <strong>Save</strong> and a focused <strong>Save As</strong> button.</figcaption>
</figure>

## Conclusions

Working with system files technically works on all modern browsers.
On browsers that support the File System Access API, you can make the experience better by allowing
for true saving and overwriting (not just downloading) of files and
by letting your users create new files wherever they want,
all while remaining functional on browsers that do not support the File System Access API.
The [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) makes your life easier
by dealing with the subtleties of progressive enhancement and making your code as simple as possible.

## Acknowledgements

This article was reviewed by [Joe Medley](https://github.com/jpmedley) and
[Kayce Basques](https://github.com/kaycebasques).
Thanks to the [contributors to Excalidraw](https://github.com/excalidraw/excalidraw/graphs/contributors)
for their work on the project and for reviewing my Pull Requests.
[Hero image](https://unsplash.com/photos/hXrPSgGFpqQ) by
[Ilya Pavlov](https://unsplash.com/@ilyapavlov) on Unsplash.

---
layout: post
title: Reading and writing files and directories with the browser-nativefs library
authors:
  - thomassteiner
description: |
  All modern browsers can get read access to native files and directories, however,
  true write access, that is, more than just downloading files,
  is limited to browsers that implement the Native File System API.
  This post introduces a support library called browser-nativefs
  that acts as an abstraction layer on top of the Native File System API
  and that transparently falls back to legacy approaches for dealing with files.
date: 2020-06-25
tags:
  - blog
  - progressive-web-apps
  - capabilities
---

Browser can deal with files for a long time.
The [File API](https://w3c.github.io/FileAPI/)
provides an API for representing file objects in web applications,
as well as programmatically selecting them and accessing their data.

## The traditional way of dealing with files

### Opening files

As a developer, you can open and read files via the
[`<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
element.
In its simplest form, opening a file can look something like in the code sample below.
You get back a [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList),
which in the case below consists of just one
[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).
`File`s are a specific kind of [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)s,
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

For opening folders (or directories), you can use the
[`<input webkitdirectory>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-webkitdirectory)
attribute, and despite its vendor-prefixed name that suggests it is implemented only for WebKit-based browsers
(inherited by Blink-based browsers like Chrome or the new Edge),
`webkitdirectory` is also usable in the (legacy EdgeHTML-based) Microsoft Edge as well as Firefox 50 and later.

## Saving (rather: downloading) files

For saving a file, traditionally, you are limited to *downloading* a file,
which works thanks to the
[`<a download>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download:~:text=download)
element.
Given a Blob, you can set the anchor's `href` attribute to a `blob:` URL with the
[`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
method.

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

A massive downside of the *download* approach is that there is no way to make a classic
open→edit→save flow happen, that is, there is no way to over-save the original file.
Instead, you end up with copies of the original file in the operating system's default Downloads folder.

## The Native File System API

The Native File System API makes both operations, opening and saving, a lot simpler.
It also enables true saving, that is, you can not only choose where to save a file,
but also over-save an existing file.

{% Aside %}
  For all details on the Native File System API, see the article
  [The Native File System API: Simplifying access to local files](https://web.dev/native-file-system/).
{% endAside %}

### Opening files

With the [Native File System API](https://wicg.github.io/native-file-system/),
opening a file is a matter of one call to the `window.chooseFileSystemEntries()` method.

```js
const openFile = async () => {
  try {
    const handle = await window.chooseFileSystemEntries();
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

### Opening directories

Directories can be opened by passing an options object like `{type: 'open-directory'}` to
`chooseFileSystemEntries()` that allow directories to be selected in the file dialog.

### Saving files

Saving files is a similarly straight-forward operation.

```js
const saveFile = async (blob) => {
  try {
    const handle = await window.chooseFileSystemEntries({
      type: 'save-file',
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (err) {
    console.error(err.name, err.message);
  }
};


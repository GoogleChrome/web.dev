---
layout: post
title: How to drag and drop files
date: 2022-02-11
authors:
  - thomassteiner
description: |
  Learn how to drag and drop files into the browser.
tags:
  - how-to
---

The
[HTML Drag and Drop interfaces](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
enable web applications to accept
[dragged and dropped files](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop)
on a web page. During a drag and drop operation, dragged file and directory items are associated
with file entries and directory entries respectively. The `DataTransferItem.getAsFileSystemHandle()`
method returns a promise with a `FileSystemFileHandle` object if the dragged item is a file, and a
promise with a `FileSystemDirectoryHandle` object if the dragged item is a directory. The listing
below shows this in action. Note that the Drag and Drop interface's
[`DataTransferItem.kind`](https://developer.mozilla.org/docs/Web/API/DataTransferItem/kind) will be
`"file"` for both files _and_ directories, whereas the File System Access API's
[`FileSystemHandle.kind`](https://wicg.github.io/file-system-access/#dom-filesystemhandle-kind) will
be `"file"` for files and `"directory"` for directories.

```js
const supportsFileSystemAccessAPI =
  'getAsFileSystemHandle' in DataTransferItem.prototype;
const supportsWebkitGetAsEntry =
  'webkitGetAsEntry' in DataTransferItem.prototype;

const elem = document.querySelector('main');
const debug = document.querySelector('pre');

elem.addEventListener('dragover', (e) => {
  // Prevent navigation.
  e.preventDefault();
});

elem.addEventListener('dragenter', (e) => {
  elem.style.outline = 'solid red 1px';
});

elem.addEventListener('dragleave', (e) => {
  elem.style.outline = '';
});

elem.addEventListener('drop', async (e) => {
  e.preventDefault();
  elem.style.outline = '';
  const fileHandlesPromises = [...e.dataTransfer.items]
    .filter((item) => item.kind === 'file')
    .map((item) =>
      supportsFileSystemAccessAPI
        ? item.getAsFileSystemHandle()
        : supportsWebkitGetAsEntry
        ? item.webkitGetAsEntry()
        : item.getAsFile(),
    );

  for await (const handle of fileHandlesPromises) {
    if (handle.kind === 'directory' || handle.isDirectory) {
      console.log(`Directory: ${handle.name}`);
      debug.textContent += `Directory: ${handle.name}\n`;
    } else {
      console.log(`File: ${handle.name}`);
      debug.textContent += `File: ${handle.name}\n`;
    }
  }
});
```

## Browser support

### `DataTransferItem.getAsFileSystemHandle()`

{% BrowserCompat 'api.DataTransferItem.getAsFileSystemHandle' %}

### `DataTransferItem.getAsFile()`

{% BrowserCompat 'api.DataTransferItem.getAsFile' %}

### `DataTransferItem.webkitGetAsEntry()`

{% BrowserCompat 'api.DataTransferItem.webkitGetAsEntry' %}

## Demo

{% Glitch {
  id: 'how-to-series',
  path: 'drag-and-drop-files.html',
  previewSize: 0,
  allow: []
} %}

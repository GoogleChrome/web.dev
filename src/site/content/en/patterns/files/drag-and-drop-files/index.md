---
layout: pattern
title: How to drag and drop files
date: 2022-04-22
authors:
  - thomassteiner
description: >
  Learn how to drag and drop files into the browser.
height: 800
---

The
[HTML Drag and Drop interfaces](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
enable web applications to accept
[dragged and dropped files](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop)
on a web page. During a drag and drop operation, dragged file and directory items are associated
with file entries and directory entries respectively. When it comes to dragging and dropping files
into the browser, there are two ways of doing it: the modern and the classic way.

## The modern way

### Using the File System Access API's `DataTransferItem.getAsFileSystemHandle()` method

The `DataTransferItem.getAsFileSystemHandle()` method returns a promise with a
`FileSystemFileHandle` object if the dragged item is a file, and a promise with a
`FileSystemDirectoryHandle` object if the dragged item is a directory. These handles let you read,
and optionally write back to the file or directory. Note that the Drag and Drop interface's
[`DataTransferItem.kind`](https://developer.mozilla.org/docs/Web/API/DataTransferItem/kind) will be
`"file"` for both files _and_ directories, whereas the File System Access API's
[`FileSystemHandle.kind`](https://wicg.github.io/file-system-access/#dom-filesystemhandle-kind) will
be `"file"` for files and `"directory"` for directories.

{% BrowserCompat 'api.DataTransferItem.getAsFileSystemHandle' %}

## The classic way

### Using the classic `DataTransferItem.getAsFile()` method

The `DataTransferItem.getAsFile()` method returns the drag data item's `File` object. If the item is
not a file, this method returns `null`. While you can read the file, there is no way to write back
to it. This method has the disadvantage that it does not support directories.

{% BrowserCompat 'api.DataTransferItem.getAsFile' %}

## Progressive enhancement

The snippet below uses the modern File System Access API's
`DataTransferItem.getAsFileSystemHandle()` method when it is supported, then falls back to the
non-standard `DataTransferItem.webkitGetAsEntry()` method, and finally falls back to the classic
`DataTransferItem.getAsFile()` method. Be sure to check the type of each `handle`, since it could be
either of:

- `FileSystemFileHandle` when the modern code path is chosen.
- `File` when the classic code path is chosen.

All types have a `name` property, so logging it is fine and will always work.

```js
// Run feature detection.
const supportsFileSystemAccessAPI =
  'getAsFileSystemHandle' in DataTransferItem.prototype;

// This is the drag and drop zone.
const elem = document.querySelector('main');

  // Prevent navigation.
elem.addEventListener('dragover', (e) => {
  e.preventDefault();
});

// Visually highlight the drop zone.
elem.addEventListener('dragenter', (e) => {
  elem.style.outline = 'solid red 1px';
});

// Visually unhighlight the drop zone.
elem.addEventListener('dragleave', (e) => {
  elem.style.outline = '';
});

// This is where the drop is handled.
elem.addEventListener('drop', async (e) => {
  // Prevent navigation.
  e.preventDefault();
  // Unhighlight the drop zone.
  elem.style.outline = '';
  // Prepare an array of promises…
  const fileHandlesPromises = [...e.dataTransfer.items]
    // …by including only files (where file misleadingly means actual file _or_
    // directory)…
    .filter((item) => item.kind === 'file')
    // …and, depending on previous feature detection…
    .map((item) =>
      supportsFileSystemAccessAPI
        // …either get a modern `FileSystemHandle`…
        ? item.getAsFileSystemHandle()
        // …or a classic `File`.
        : item.getAsFile(),
    );
  // Loop over the array of promises.
  for await (const handle of fileHandlesPromises) {
    // This is where we can actually exclusively act on the files.
    if (handle.kind === 'file' || handle.isFile) {
      console.log(`File: ${handle.name}`);
    }
  }
});
```

## Further reading

- [File System Access API](/file-system-access/)
- [Drag and Drop API](/drag-and-drop/)

## Demo

---
layout: pattern
title: How to save a file
date: 2022-10-10
authors:
  - thomassteiner
description: >
  Learn how to save a file in the browser.
height: 800
---

Dealing with files is one of the most common operations for apps on the web.
Traditionally, users needed to upload a file, make some changes to it, and then
download it again, resulting in a copy in the Downloads folder.
With the File System Access API, users can now open files
directly, make modifications, and save back the changes to the original file.

## The modern way

### Using the File System Access API's `showSaveFilePicker()` method

To save a file, call
[`showSaveFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showSaveFilePicker),
which returns a promise with [`FileSystemFileHandle`](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle). You can pass the desired file name to the method as `{ suggestedName: 'example.txt' }`.

{% BrowserCompat 'api.Window.showSaveFilePicker' %}

## The classic way

### Using the `<a download>` element

The `<a download>` element on a page allows the user to click it and download
a file. The trick now consists of inserting the element invisibly into a page with JavaScript and clicking it programmatically.

{% BrowserCompat 'api.HTMLAnchorElement.download' %}

## Progressive enhancement

The method below uses the File System Access API when it's supported
and else falls back to the classic approach. In both cases the function
saves the file, but in case of where the File System Access API
is supported, the user will get a file save dialog where they can choose
where the file should be saved.

```js
const saveFile = async (blob, suggestedName) => {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    'showSaveFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    try {
      // Show the file save dialog.
      const handle = await showSaveFilePicker({
        suggestedName,
      });
      // Write the blob to the file.
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      // Fail silently if the user has simply canceled the dialog.
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message);
      }
    }
  }
  // Fallback if the File System Access API is not supported…
  // Create the blob URL.
  const blobURL = URL.createObjectURL(blob);
  // Create the `<a download>` element and append it invisibly.
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = suggestedName;
  document.body.append(a);
  a.style.display = 'none';
  // Click the element.
  a.click();
  // Revoke the blob URL and remove the element.
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);
};
```

## Further reading

- [File System Access API](/file-system-access/)

## Demo

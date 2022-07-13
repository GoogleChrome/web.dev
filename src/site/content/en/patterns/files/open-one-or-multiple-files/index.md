---
layout: pattern
title: How to open one or multiple files
date: 2022-07-13
description: >
  Learn how to open one or multiple files in the browser.
height: 800
---

Dealing with files is one of the most common operations for apps on the web.
Traditionally, users needed to upload a file, make some changes to it, and then
download it again, resulting in a copy in the Downloads folder.
With the File System Access API, users can now open files
directly, make modifications, and save back the changes to the original file.

## The modern way

### Using the File System Access API's `showOpenFilePicker()` method

To open a file, call
[`showOpenFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showOpenFilePicker),
which returns a promise with an array of
the picked file or files. If you need multiple files, you can pass `{ multiple: true, }` to the method.

{% BrowserCompat 'api.Window.showOpenFilePicker' %}

## The classic way

### Using the `<input type="file">` element

The `<input type="file">` element on a page allows the user to click it and open
one or multiple files. The trick now consists of inserting the element invisibly into a page with JavaScript and click it programmatically.

{% BrowserCompat 'html.elements.input' %}

## Progressive enhancement

The method below uses the File System Access API when it's supported
and else falls back to the classic approach. In both cases the function
returns an array of files, but in case of where the File System Access API
is supported, each file object also has a `FileSystemFileHandle` stored in
the `handle` property, so you can optionally serialize the handle to disk.

```js
const button = document.querySelector('button');
const buttonMultiple = document.querySelector('button.multiple');
const pre = document.querySelector('pre');

const openFileOrFiles = async (multiple = false) => {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    'showOpenFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    let fileOrFiles = undefined;
    try {
      // Show the file picker, optionally allowing multiple files.
      const handles = await showOpenFilePicker({ multiple });
      // Only one file is requested.
      if (!multiple) {
        // Add the `FileSystemFileHandle` as `.handle`.
        fileOrFiles = await handles[0].getFile();
        fileOrFiles.handle = handles[0];
      } else {
        fileOrFiles = await Promise.all(
          handles.map(async (handle) => {
            const file = await handle.getFile();
            // Add the `FileSystemFileHandle` as `.handle`.
            file.handle = handle;
            return file;
          })
        );
      }
    } catch (err) {
      // Fail silently if the user has simply canceled the dialog.
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message);
      }
    }
    return fileOrFiles;
  }
  // Fallback if the File System Access API is not supported.
  return new Promise((resolve) => {
    // Append a new `<input type="file" multiple? />` and hide it.
    const input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'file';
    document.body.append(input);
    if (multiple) {
      input.multiple = true;
    }
    // The `change` event fires when the user interacts with the dialog.
    input.addEventListener('change', () => {
      // Remove the `<input type="file" multiple? />` again from the DOM.
      input.remove();
      // If no files were selected, return.
      if (!input.files) {
        return;
      }
      // Return all files or just one file.
      resolve(multiple ? Array.from(input.files) : input.files[0]);
    });
    // Programmatically click the `<input type="file" multiple? />`.
    input.click();
  });
};
```

## Further reading

- [File System Access API](/file-system-access/)

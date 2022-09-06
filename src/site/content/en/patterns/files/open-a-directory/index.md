---
layout: pattern
title: How to open a directory
date: 2022-07-19
authors:
  - thomassteiner
description: >
  Learn how to open a directory in the browser.
height: 800
---

Dealing with directories is not something you will cope with on a daily basis,
but occasionally the use case arises, such as wanting to process all images in a directory.
With the File System Access API, users can now open directories in the browser
and decide if they need write access or not.

## The modern way

### Using the File System Access API's `showDirectoryPicker()` method

To open a directory, call
[`showDirectoryPicker()`](https://developer.mozilla.org/docs/Web/API/Window/showDirectoryPicker),
which returns a promise with the picked directory. If you need write access, you can pass `{ mode: 'readwrite' }` to the method.

{% BrowserCompat 'api.Window.showDirectoryPicker' %}

## The classic way

### Using the `<input type="file" webkitdirectory>` element

The `<input type="file" webkitdirectory>` element on a page allows the user to click it and open
a directory. The trick now consists of inserting the element invisibly into a page with JavaScript and click it programmatically.

{% BrowserCompat 'api.HTMLInputElement.webkitdirectory' %}

## Progressive enhancement

The method below uses the File System Access API when it's supported
and else falls back to the classic approach. In both cases the function
returns a directory, but in case of where the File System Access API
is supported, each file object also has a `FileSystemDirectoryHandle` stored in
the `directoryHandle` property and a `FileSystemFileHandle` stored in the `handle` property,
so you can optionally serialize the handles to disk.

```js
const openDirectory = async (mode = "read") => {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    "showDirectoryPicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    let directoryStructure = undefined;

    // Recursive function that walks the directory structure.
    const getFiles = async (dirHandle, path = dirHandle.name) => {
      const dirs = [];
      const files = [];
      for await (const entry of dirHandle.values()) {
        const nestedPath = `${path}/${entry.name}`;
        if (entry.kind === "file") {
          files.push(
            entry.getFile().then((file) => {
              file.directoryHandle = dirHandle;
              file.handle = entry;
              return Object.defineProperty(file, "webkitRelativePath", {
                configurable: true,
                enumerable: true,
                get: () => nestedPath,
              });
            })
          );
        } else if (entry.kind === "directory") {
          dirs.push(getFiles(entry, nestedPath));
        }
      }
      return [
        ...(await Promise.all(dirs)).flat(),
        ...(await Promise.all(files)),
      ];
    };

    try {
      // Open the directory.
      const handle = await showDirectoryPicker({
        mode,
      });
      // Get the directory structure.
      directoryStructure = getFiles(handle, undefined);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err.name, err.message);
      }
    }
    return directoryStructure;
  }
  // Fallback if the File System Access API is not supported.
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;

    input.addEventListener('change', () => {
      let files = Array.from(input.files);
      resolve(files);
    });

    input.click();
  });
};
```

## Further reading

- [File System Access API](/file-system-access/)

## Demo

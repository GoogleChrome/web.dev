---
layout: pattern
title: How to handle files opened from the file explorer
authors:
  - pliao
date: 2022-09-01
description: >
  Learn how to use the File Handling API to register your web app as a file handler to the operating
  system.
height: 800
---

## The modern way

### Using the File Handling API

First, declare the `file_handlers` attribute in your web app manifest. The File Handling API
requires you to specify the `action` property (a handling URL) and the `accept` property, which is
an object with MIME types as keys and arrays of the particularly corresponding file extensions.

```json
{
  "file_handlers": [
    {
      "action": "./",
      "accept": {
        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"]
      }
    }
  ]
}
```

Next, you need to use the File Handling API to imperatively deal with opened files via the
`launchQueue`.

```js
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      // Handle the file.
    }
  });
}
```

### Browser compatibility

The File Handling API is currently supported from Chromium 102.

## The classic way

### Using the classic `DataTransferItem.getAsFile()` method

If the File Handling API is not supported, you can still drag and drop files from the file explorer
into the app. The `DataTransferItem.getAsFile()` method returns the drag data item's `File` object.
If the item is not a file, this method returns `null`. While you can read the file, there is no way
to write back to it. This method has the disadvantage that it does not support directories.
{% BrowserCompat 'api.DataTransferItem.getAsFile' %}

## Progressive enhancement

The snippet below uses the File Handling API when it's available, and additionally registers drag
and drop handlers so dragged files can be handled.

Declare the file types that can be handled in the web app manifest. Browsers that don't support the
File Handling API will just ignore this.

```json
{
  "file_handlers": [
    {
      "action": "./",
      "accept": {
        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"]
      }
    }
  ]
}
```

```js
// File Handling API
const handleLaunchFiles = () => {
  window.launchQueue.setConsumer((launchParams) => {
    if (!launchParams.files.length) {
      return;
    }
    launchParams.files.forEach(async (handle) => {
      const file = await handle.getFile();
      console.log(`File: ${file.name}`);
      // Do something with the file.
    });
  });
};

if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  handleLaunchFiles();
}

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
    .map((item) => item.getAsFile());
  // Loop over the array of promises.
  for await (const handle of fileHandlesPromises) {
    // This is where we can actually exclusively act on the files.
    if (handle.isFile) {
      console.log(`File: ${handle.name}`);
      // Do something with the file.
    }
  }
});
```

## Further reading

- [Let installed web applications be file handlers](/file-handling/)
- [The File System Access API: simplifying access to local files](/file-system-access/)

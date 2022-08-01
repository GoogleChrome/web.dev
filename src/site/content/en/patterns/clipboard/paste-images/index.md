---
layout: pattern
title: How to paste images
date: 2022-08-01
authors:
  - charistheodoulou
description: >
  Pasting images into the browser consists of using the read() method of the Async Clipboard API.
---

## The modern way

### Using the Async Clipboard API

To read images from the user's clipboard programmatically, i.e., after a button click, you can use the [`read()`](https://developer.mozilla.org/docs/Web/API/Clipboard/read) method of the [Async Clipboard API](https://developer.mozilla.org/docs/Web/API/Clipboard_API). If permission to read from the clipboard have not been granted yet, the call to `navigator.clipboard.read()` will request it upon the first call of the method.

```js
const pasteButton = document.querySelector('#paste-button');

pasteButton.addEventListener('click', async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      const imageTypes = clipboardItem.types.find(type => type.startsWith('image/'))
      for (const imageType of imageTypes) {
        const blob = await clipboardItem.getType(imageType);
        // Do something with the image blob.
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
});
```

{% BrowserCompat 'api.Clipboard.read' %}

## The classic way

### Listen for the `paste` event

The classic way to paste images is to use the (synchronous) [Clipboard API](https://developer.mozilla.org/docs/Web/API/Clipboard_API), which gives you access to the [`clipboardData`](https://developer.mozilla.org/docs/Web/API/ClipboardEvent/clipboardData) field inside the [Document: `paste` event](https://developer.mozilla.org/docs/Web/API/Document/paste_event). However, this method comes with limitations, for example because it's synchronous, pasting large amounts of data can block the page.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();

  for (const clipboardItem of e.clipboardData.files) {
    if (clipboardItem.type.startsWith('image/')) {
      // Do something with the image file.
    }
  }
});
```

{% BrowserCompat 'api.Clipboard' %}

## Progressive enhancement

For browsers that do not support the Async Clipboard API, it is impossible to access the user's clipboard programmatically (i.e., on a button click). Thus for accessing a user's clipboard on a `paste` event, you can use the Async Clipboard API and fall back to the (synchronous) Clipboard API.

The `ClipboardItem` objects coming from `navigator.clipboard.read` have a `types` field which is an array, and `File` objects coming from `event.clipboardData.files` have a `type` field which is a string. You can conditionally check each of the `type` or `types` fields for images in the clipboard:

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const clipboardItems = typeof navigator?.clipboard?.read === 'function' ? await navigator.clipboard.read() : e.clipboardData.files;

  for (const clipboardItem of clipboardItems) {
    let blob;
    if (clipboardItem.type?.startsWith('image/')) {
      // For files from `e.clipboardData.files`.
      blob = clipboardItem
      // Do something with the blob.
    } else {
      // For files from `navigator.clipboard.read()`.
      const imageTypes = clipboardItem.types?.filter(type => type.startsWith('image/'))
      for (const imageType of imageTypes) {
        blob = await clipboardItem.getType(imageType);
        // Do something with the blob.
      }
    }
  }
});
```
## Further reading

- Clipboard API on MDN
- Unblocking clipboard access on web.dev

## Demo

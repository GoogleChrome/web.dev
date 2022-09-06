---
layout: pattern
title: How to copy images
subhead: Learn how to copy images to the clipboard.
description: Learn how to copy images to the clipboard.
date: 2022-09-05
authors:
  - thomassteiner
height: 800
static:
  - assets/fugu.svg
---

Many modern browsers support copying images to the clipboard in the formats PNG and SVG. Other formats are not yet supported for security reasons.

## The modern way

### Using the Async Clipboard API

The [`Clipboard.write()`](​​https://developer.mozilla.org/docs/Web/API/Clipboard/write) method takes an array of [`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem) objects and returns a Promise that resolves when the image is successfully written to the clipboard. `Clipboard.write()` can only be used from the `window` object that has focus.

{% BrowserCompat 'api.Clipboard.write' %}

## The classic way

### Using `navigator.clipboard.writeText()`

While not all browsers support `navigator.clipboard.write()` for binary data
yet, they all support `navigator.clipboard.writeText()`. If you want to copy
an SVG image, instead of copying the image itself, you can copy the SVG source code. For PNG images, you are unfortunately out of luck.

{% BrowserCompat 'api.Clipboard.writeText' %}

## Progressive enhancement

```js
const button = document.querySelector('button');
const img = document.querySelector('img');

button.addEventListener('click', async () => {
  const responsePromise = fetch(img.src);
  try {
    if ('write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/svg+xml': new Promise(async (resolve) => {
            const blob = await responsePromise.then(response => response.blob());
            resolve(blob);
          }),
        }),
      ]);
      // Image copied as image.
    } else {
      const text = await responsePromise.then(response => response.text());
      await navigator.clipboard.writeText(text);
      // Image copied as source code.
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
});
```

## Further reading

- [Unblocking clipboard access](/async-clipboard/)

## Demo

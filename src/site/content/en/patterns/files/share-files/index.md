---
layout: pattern
title: How to share files
date: 2022-08-08
authors:
  - pliao
description: >
  Sharing files across different apps nowadays is a popular operation. To achieve this, use the navigator.share() method of Web Share API.
height: 800
static:
  - cat.png
---

## The modern way

### Using the Web Share API's `share()` method

To share files, call
[`navigator.share()`](https://developer.mozilla.org/docs/Web/API/Navigator/share). Note that you
should always check if files can be shared with
[`navigator.canShare()`](https://developer.mozilla.org/docs/Web/API/Navigator/canShare) and make
sure your site is using HTTPS before calling the `share()` method.

```js
// Assume `blob` is a PNG image file.
const data = {
  files: [
    new File([blob], 'image.png', {
      type: blob.type,
    }),
  ],
  title: 'My title',
  text: 'My text',
};
if (navigator.canShare(data)) {
  await navigator.share(data);
}
```

{% BrowserCompat 'api.Navigator.share' %}

## The classic way

The next best thing to offer to the user if the Web Share API is not supported is falling back to letting the user download the file, so they can share it manually, for example, via email or via a messenger or online social network app.

{% BrowserCompat 'api.HTMLAnchorElement.download' %}

## Progressive enhancement

The method below uses the Web Share API when the browser supports it and when the data can be shared based on the [supported file types](https://developer.mozilla.org/docs/Web/API/Navigator/share#shareable_file_types).
Else, it falls back to downloading the file.

```js
const button = document.querySelector('button');
const img =  document.querySelector('img');

// Feature detection
const webShareSupported = 'canShare' in navigator;
// Update the button action text.
button.textContent = webShareSupported ? 'Share' : 'Download';

const shareOrDownload = async (blob, fileName, title, text) => {
  // Using the Web Share API.
  if (webShareSupported) {
    const data = {
      files: [
        new File([blob], fileName, {
          type: blob.type,
        }),
      ],
      title,
      text,
    };
    if (navigator.canShare(data)) {
      try {
        await navigator.share(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      } finally {
        return;
      }
    }
  }
  // Fallback implementation.
  const a = document.createElement('a');
  a.download = fileName;
  a.style.display = 'none';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000)
  });
  document.body.append(a);
  a.click();
};

button.addEventListener('click', async () => {
  const blob = await fetch(img.src).then(res => res.blob());
  await shareOrDownload(blob, 'cat.png', 'Cat in the snow', 'Getting cold feet…');
});
```

## Further reading

- [Web Share API on MDN](https://developer.mozilla.org/docs/Web/API/Navigator/share)
- [Integrate with the OS sharing UI with the Web Share API](/web-share/)

## Demo

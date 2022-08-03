---
layout: post
title: "SVGcode: a PWA to convert raster images to SVG vector graphics"
subhead: >
  SVGcode is a Progressive Web App that lets you convert raster images like JPG, PNG, GIF, WebP,
  AVIF, etc. to vector graphics in SVG format. It uses the File System Access API, the Async
  Clipboard API, the File Handling API, and Window Controls Overlay
  customization.
authors:
  - thomassteiner
description: >
  Convert color or monochrome bitmap images (PNG, JPG, JPEG, WEBP, AVIF, GIF,…) to color or
  monochrome vector images (SVG).
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/lqecVwtwI01kJ7n52Sqp.jpg
alt: SVGcode logo
date: 2021-11-19
updated: 2022-05-09
tags:
  - capabilities
  - progressive-web-apps
  - blog
---

{% Aside %}
In a hurry? Go [straight to the SVGcode app](https://svgco.de/)
and read the article later.
{% endAside %}

<figure data-size="full">
  {% YouTube "kcvfyQh6J-0" %}
  <figcaption>
    (If you prefer watching over reading, this article is also available as a <a href="https://youtu.be/kcvfyQh6J-0">video</a>.)
  </figcaption>
</figure>

## From raster to vector

Have you ever scaled an image and the result was pixelated and unsatisfactory? If
so, you have probably dealt with a raster image format such as WebP, PNG, or JPG.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/bIiC6vyZLqgGWPuFF9od.mp4" %}
  <figcaption>
    Scaling up a raster image makes it look pixelated.
  </figcaption>
</figure>

In contrast, vector graphics are images that are defined by points in a coordinate system. These
points are connected by lines and curves to form polygons and other shapes. Vector graphics have an
advantage over raster graphics in that they may be scaled up or down to any resolution
without pixelation.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/yM32DfKFp8ooBAshjlUE.mp4" %}
  <figcaption>
    Scaling up a vector image with no loss of quality.
  </figcaption>
</figure>

## Introducing SVGcode

I have built a PWA called [SVGcode](https://svgco.de/) that can help you convert raster images to
vectors. Credit where credit is due: I didn't invent this. With SVGcode, I just stand on the
shoulders of a command line tool called [Potrace](http://potrace.sourceforge.net/) by
[Peter Selinger](https://www.mathstat.dal.ca/~selinger/) that I have
[converted to Web Assembly](https://www.npmjs.com/package/esm-potrace-wasm), so it can be used in a
Web app.

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/xMosQFxacBsz116CcFwy.png", alt="SVGcode application screenshot.", width="800", height="483" %}
  <figcaption>
    The <a href="https://svgco.de/">SVGcode</a> app.
  </figcaption>
</figure>

### Using SVGcode

First, I want to show you how to use the app. I start with the teaser image for Chrome Dev Summit
that I downloaded from the ChromiumDev Twitter channel. This is a PNG raster image that I then
drag onto the SVGcode app. When I drop the file, the app traces the image color by color,
until a vectorized version of the input appears. I can now zoom into the image, and as you can see,
the edges stay sharp. But zooming in on the Chrome logo, you can see that the tracing wasn't
perfect, and especially the outlines of the logo look a bit speckled. I can improve the result by
de-speckling the tracing by suppressing speckles of up to, say, five pixels.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/WvmYtNTHAbINP3ec1h1w.mp4" %}
  <figcaption>
    Converting a dropped image to SVG.
  </figcaption>
</figure>

### Posterization in SVGcode

An important step for vectorization, especially for photographic images, is posterizing the input
image to reduce the number of colors. SVGcode allows me to do this per color channel, and see the
resulting SVG as I make changes. When I'm happy with the result, I can save the SVG to my hard disk
and use it wherever I like.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/BzcR6yPyuQ0TIgzwYbLy.mp4" %}
  <figcaption>
    Posterizing an image to reduce the number of colors.
  </figcaption>
</figure>

## APIs used in SVGcode

Now that you have seen what the app is capable of, let me show you some of the APIs that help make
the magic happen.

### Progressive Web App

SVGcode is an installable Progressive Web App and therefore fully offline enabled. The app is based
on the
[Vanilla JS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-vanilla)
for [Vite.js](https://github.com/vitejs/vite) and uses the popular
[Vite plugin PWA](https://github.com/antfu/vite-plugin-pwa), which creates a service worker that
uses [Workbox.js](https://developer.chrome.com/docs/workbox/) under the hood. Workbox is a set
of libraries that can power a production-ready service worker for Progressive Web Apps, This pattern
may not necessarily work for all apps, but for SVGcode's use case it's great.

#### Window Controls Overlay

To maximize the available screen real estate, SVGcode uses
[Window Controls Overlay](/window-controls-overlay/) customization by moving its main menu up into
the titlebar area. You can see this get activated at the end of the install flow.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/aDk3LFxexL6g2NbH4RCA.mp4" %}
  <figcaption>
    Installing SVGcode and activating the Window Controls Overlay customization.
  </figcaption>
</figure>

### File System Access API

To open input image files and save the resulting SVGs, I use the
[File System Access API](/file-system-access/). This allows me to keep a reference to previously
opened files and to continue where I left off, even after an app reload. Whenever an image gets
saved, it is optimized via the [svgo](https://github.com/svg/svgo) library, which may take a moment,
depending on the complexity of the SVG. Showing the file save dialog requires a user gesture. It is
therefore important to obtain the file handle before the SVG optimization happens, so the user
gesture is not invalidated by the time the optimized SVG is ready.

```js
try {
  let svg = svgOutput.innerHTML;
  let handle = null;
  // To not consume the user gesture obtain the handle before preparing the
  // blob, which may take longer.
  if (supported) {
    handle = await showSaveFilePicker({
      types: [{description: 'SVG file', accept: {'image/svg+xml': ['.svg']}}],
    });
  }
  showToast(i18n.t('optimizingSVG'), Infinity);
  svg = await optimizeSVG(svg);
  showToast(i18n.t('savedSVG'));
  const blob = new Blob([svg], {type: 'image/svg+xml'});
  await fileSave(blob, {description: 'SVG file'}, handle);
} catch (err) {
  console.error(err.name, err.message);
  showToast(err.message);
}
```

#### Drag an drop

For opening an input image, I can either use the file open feature, or, as you have seen above, just
drag and drop an image file onto the app. The file open feature is pretty straightforward, more
interesting is the drag and drop case. What's particularly nice about this is that you can
get a file system handle from the data transfer item via the
[`getAsFileSystemHandle()`](https://developer.mozilla.org/docs/Web/API/DataTransferItem/getAsFileSystemHandle)
method. As mentioned before, I can persist this handle, so it's ready when the app gets reloaded.

```js
document.addEventListener('drop', async (event) => {
  event.preventDefault();
  dropContainer.classList.remove('dropenter');
  const item = event.dataTransfer.items[0];
  if (item.kind === 'file') {
    inputImage.addEventListener(
      'load',
      () => {
        URL.revokeObjectURL(blobURL);
      },
      {once: true},
    );
    const handle = await item.getAsFileSystemHandle();
    if (handle.kind !== 'file') {
      return;
    }
    const file = await handle.getFile();
    const blobURL = URL.createObjectURL(file);
    inputImage.src = blobURL;
    await set(FILE_HANDLE, handle);
  }
});
```

For more details, check out the article on the [File System Access API](/file-system-access/) and,
if you're interested, study the SVGcode source code in
[`src/js/filesystem.js`](https://github.com/tomayac/SVGcode/blob/main/src/js/filesystem.js).

### Async Clipboard API

SVGcode is also fully integrated with the operating system's clipboard via the Async Clipboard API.
You can paste images from the operating system's file explorer into the app either by clicking the
paste image button or by pressing command or control plus v on your keyboard.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/9wHL0Uc7eHFEFF99anaB.mp4" %}
  <figcaption>
    Pasting an image from the file explorer into SVGcode.
  </figcaption>
</figure>

The Async Clipboard API has recently gained the ability to deal with SVG images as well, so you can
also copy an SVG image and paste it into another application for further processing.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/KiGt5UHOvZZEvPhtwIny.mp4" %}
  <figcaption>
    Copying an image from SVGcode into SVGOMG.
  </figcaption>
</figure>

```js
copyButton.addEventListener('click', async () => {
  let svg = svgOutput.innerHTML;
  showToast(i18n.t('optimizingSVG'), Infinity);
  svg = await optimizeSVG(svg);
  const textBlob = new Blob([svg], {type: 'text/plain'});
  const svgBlob = new Blob([svg], {type: 'image/svg+xml'});
  navigator.clipboard.write([
    new ClipboardItem({
      [svgBlob.type]: svgBlob,
      [textBlob.type]: textBlob,
    }),
  ]);
  showToast(i18n.t('copiedSVG'));
});
```

To learn more, read the [Async Clipboard](/async-clipboard/) article, or see the file
[`src/js/clipboard.js`](https://github.com/tomayac/SVGcode/blob/main/src/js/clipboard.js).

### File Handling

One of my favorite features of SVGcode is how well it blends in with the operating system. As an
installed PWA, it can become a file handler, or even the default file handler, for image files. This
means that when I'm in the Finder on my macOS machine, I can right-click an image and open it with
SVGcode. This feature is called File Handling and works based on the file_handlers property in the
Web App Manifest and the launch queue, which allows the app to consume the passed file.

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/DEQLkm1vrt226xsAoysI.mp4" %}
  <figcaption>
    Opening a file from the desktop with installed SVGcode app.
  </figcaption>
</figure>

```js
window.launchQueue.setConsumer(async (launchParams) => {
  if (!launchParams.files.length) {
    return;
  }
  for (const handle of launchParams.files) {
    const file = await handle.getFile();
    if (file.type.startsWith('image/')) {
      const blobURL = URL.createObjectURL(file);
      inputImage.addEventListener(
        'load',
        () => {
          URL.revokeObjectURL(blobURL);
        },
        {once: true},
      );
      inputImage.src = blobURL;
      await set(FILE_HANDLE, handle);
      return;
    }
  }
});
```

For more information, see [Let installed web applications be file handlers](/file-handling/), and view the source code in
[`src/js/filehandling.js`](https://github.com/tomayac/SVGcode/blob/main/src/js/filehandling.js).

### Web Share (Files)

Another example of blending in with the operating system is the app's share feature. Assuming I want
to make edits to an SVG created with SVGcode, one way to deal with this would be to save the file,
launch the SVG editing app, and then open the SVG file from there. A smoother flow, though, is to
use the [Web Share API](/web-share/#sharing-files), which allows for files to be shared directly. So if
the SVG editing app is a share target, it can directly receive the file without deviation.

```js
shareSVGButton.addEventListener('click', async () => {
  let svg = svgOutput.innerHTML;
  svg = await optimizeSVG(svg);
  const suggestedFileName =
    getSuggestedFileName(await get(FILE_HANDLE)) || 'Untitled.svg';
  const file = new File([svg], suggestedFileName, { type: 'image/svg+xml' });
  const data = {
    files: [file],
  };
  if (navigator.canShare(data)) {
    try {
      await navigator.share(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message);
      }
    }
  }
});
```

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/p3Dn9FXrNLPtb4syXnfl.mp4" %}
  <figcaption>
    Sharing an SVG image to Gmail.
  </figcaption>
</figure>

### Web Share Target (Files)

The other way round, SVGcode can also act as a share target and receive files from other apps. To
make this work, the app needs to let the operating system know via the
[Web Share Target API](/web-share-target/) what types of data it can accept. This happens via a
dedicated field in the Web App Manifest.

```json
{
  "share_target": {
    "action": "https://svgco.de/share-target/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "image",
          "accept": ["image/jpeg", "image/png", "image/webp", "image/gif"]
        }
      ]
    }
  }
}
```

The `action` route does not actually exist, but is handled purely in the service worker's `fetch`
handler, which then passes on received files for actual processing in the app.

```js
self.addEventListener('fetch', (fetchEvent) => {
  if (
    fetchEvent.request.url.endsWith('/share-target/') &&
    fetchEvent.request.method === 'POST'
  ) {
    return fetchEvent.respondWith(
      (async () => {
        const formData = await fetchEvent.request.formData();
        const image = formData.get('image');
        const keys = await caches.keys();
        const mediaCache = await caches.open(
          keys.filter((key) => key.startsWith('media'))[0],
        );
        await mediaCache.put('shared-image', new Response(image));
        return Response.redirect('./?share-target', 303);
      })(),
    );
  }
});
```

<figure>
  {% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/SVtll3ShgNigvkVLu7cn.mp4" %}
  <figcaption>
    Sharing a screenshot to SVGcode.
  </figcaption>
</figure>

## Conclusion

Alright, this was a quick tour through some of the advanced app features in SVGcode. I hope this app
can become an essential tool for your image processing needs alongside other amazing apps like
[Squoosh](https://squoosh.app/) or [SVGOMG](https://jakearchibald.github.io/svgomg/).

SVGcode is available at [svgco.de](https://svgco.de/). See what I did there? You can
[review its source code on GitHub](https://github.com/tomayac/SVGcode). Note that since Potrace is
GPL-licensed, so is SVGcode. And with that, happy vectorizing! I hope SVGcode will be useful, and
some of its features can inspire your next app.

## Acknowledgements

This article was reviewed by [Joe Medley](https://github.com/jpmedley).

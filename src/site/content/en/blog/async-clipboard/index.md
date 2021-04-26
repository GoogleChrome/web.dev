---
title: Unblocking clipboard access
subhead: Safer, unblocked clipboard access for text and images
authors:
  - developit
  - thomassteiner
description: Async Clipboard API simplifies permissions-friendly copy and paste.
date: 2020-07-31
updated: 2021-02-08
tags:
  - blog
  - capabilities
  - input
  - clipboard
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: Clipboard with shopping list
feedback:
  - api
---

Over the past few years, browsers have used
[`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands)
for clipboard interactions. Though widely supported, this method of cutting and
pasting came at a cost: clipboard access was synchronous, and could only read
and write to the DOM.

That's fine for small bits of text, but there are many cases where blocking the
page for clipboard transfer is a poor experience. Time consuming sanitization or
image decoding might be needed before content can be safely pasted. The browser
may need to load or inline linked resources from a pasted document. That would
block the page while waiting on the disk or network. Imagine adding permissions
into the mix, requiring that the browser block the page while requesting
clipboard access. At the same time, the permissions put in place around
`document.execCommand()` for clipboard interaction are loosely defined and vary
between browsers.

The
[Async Clipboard API](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api)
addresses these issues, providing a well-defined permissions model that doesn't
block the page. Safari recently announced  [support for it in version
13.1](https://webkit.org/blog/10855/). With that, major browsers have a basic
level of support in place. As of this writing, Firefox only supports text; and
image support is limited to PNGs in some browsers. If you're interested in using
the API,
[consult a browser support table](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard#Browser_compatibility)
before proceeding.

{% Aside %}
The Async Clipboard API is limited to handling text and images. Chrome&nbsp;84
introduces an experimental feature that allows the clipboard to handle any
arbitrary data type.
{% endAside %}

## Copy: writing data to the clipboard

### writeText()

To copy text to the clipboard call `writeText()`. Since this API is
asynchronous, the `writeText()` function returns a Promise that resolves or
rejects depending on whether the passed text is copied successfully:

```js
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
```

### write()

Actually, `writeText()` is just a convenience method for the generic `write()`
method, which also lets you copy images to the clipboard. Like `writeText()`, it
is asynchronous and returns a Promise.

To write an image to the clipboard, you need the image as a
[`blob`](https://developer.mozilla.org/en-US/docs/Web/API/blob). One way to do
this is by requesting the image from a server using `fetch()`, then calling
[`blob()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/blob) on the
response.

Requesting an image from the server may not be desirable or possible for a
variety of reasons. Fortunately, you can also draw the image to a canvas and
call the canvas'
[`toBlob()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
method.

Next, pass an array of `ClipboardItem` objects as a parameter to the `write()`
method. Currently you can only pass one image at a time, but we hope to add
support for multiple images in the future. `ClipboardItem` takes an object with
the MIME type of the image as the key and the blob as the value. For Blob
objects obtained from `fetch()` or `canvas.toBlob()`, the `blob.type` property
automatically contains the correct MIME type for an image.

```js
try {
  const imgURL = '/images/generic/file.png';
  const data = await fetch(imgURL);
  const blob = await data.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  console.log('Image copied.');
} catch (err) {
  console.error(err.name, err.message);
}
```

### The copy event

In the case where a user initiates a clipboard copy, non-textual data is
provided as a Blob for you. The
[`copy` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/copy_event)
includes a `clipboardData` property with the items already in the right format,
eliminating the need to manually create a Blob. Call `preventDefault()` to
prevent the default behavior in favor of your own logic, then copy contents to
the clipboard. What's not covered in this example is how to fall back to earlier
APIs when the Clipboard API isn't supported. I'll cover that under
[Feature detection](#feature-detection), later in this article.

```js
document.addEventListener('copy', async (e) => {
    e.preventDefault();
    try {
      let clipboardItems = [];
      for (const item of e.clipboardData.items) {
        if (!item.type.startsWith('image/')) {
          continue;
        }
        clipboardItems.push(
          new ClipboardItem({
            [item.type]: item,
          })
        );
        await navigator.clipboard.write(clipboardItems);
        console.log('Image copied.');
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
```

## Paste: reading data from clipboard

### readText()

To read text from the clipboard, call `navigator.clipboard.readText()` and wait
for the returned Promise to resolve:

  ```js
  async function getClipboardContents() {
    try {
      const text = await navigator.clipboard.readText();
      console.log('Pasted content: ', text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }
  ```

### read()

The `navigator.clipboard.read()` method is also asynchronous and returns a
Promise. To read an image from the clipboard, obtain a list of
[`ClipboardItem`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem)
objects, then iterate over them.

Each `ClipboardItem` can hold its contents in different types, so you'll need to
iterate over the list of types, again using a `for...of` loop. For each type,
call the `getType()` method with the current type as an argument to obtain the
corresponding Blob. As before, this code is not tied to images, and will
work with other future file types.

```js
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        console.log(URL.createObjectURL(blob));
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

### The paste event

As noted before, there are plans to introduce events to work with the Clipboard API,
but for now you can use the existing `paste` event. It works nicely with the new
asynchronous methods for reading clipboard text. As with the `copy` event, don't
forget to call `preventDefault()`.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Pasted text: ', text);
});
```

As with the `copy` event, falling back to earlier APIs when the Clipboard API
isn't supported will be covered under [Feature detection](#feature-detection).

## Handling multiple file types

Most implementations put multiple data formats on the clipboard for a single cut
or copy operation. There are two reasons for this: as an app developer, you have
no way of knowing the capabilities of the app that a user wants to copy text or images to,
and many applications support pasting structured data as plain text. This is
presented to users with an **Edit** menu item with a name such as **Paste and
match style** or **Paste without formatting**.

The following example shows how to do this. This example uses `fetch()` to obtain
image data, but it could also come from a
[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
or the [File System Access API](/file-system-access/).

```js
function copy() {
  const image = await fetch('kitten.png');
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## Security and permissions

Clipboard access has always presented a security concern for browsers. Without
proper permissions, a page could silently copy all manner of malicious content
to a user's clipboard that would produce catastrophic results when pasted.
Imagine a web page that silently copies `rm -rf /` or a
[decompression bomb image](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html)
to your clipboard.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="Browser prompt asking the user for the clipboard permission.", width="800", height="338", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The permission prompt for the Clipboard API.
  </figcaption>
</figure>

Giving web pages unfettered read access to the clipboard is even more
troublesome. Users routinely copy sensitive information like passwords and
personal details to the clipboard, which could then be read by any page without
the user's knowledge.

As with many new APIs, the Clipboard API is only supported for pages served over
HTTPS. To help prevent abuse, clipboard access is only allowed when a page is
the active tab. Pages in active tabs can write to the clipboard without
requesting permission, but reading from the clipboard always requires
permission.

Permissions for copy and paste have been added to the
[Permissions API](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web).
The `clipboard-write` permission is granted automatically to pages when they are
the active tab. The `clipboard-read` permission must be requested, which you can
do by trying to read data from the clipboard. The code below shows the latter:

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Will be 'granted', 'denied' or 'prompt':
console.log(permissionStatus.state);

// Listen for changes to the permission state
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

You can also control whether a user gesture is required to invoke cutting or
pasting using the `allowWithoutGesture` option. The default for this value
varies by browser, so you should always include it.

Here's where the asynchronous nature of the Clipboard API really comes in handy:
attempting to read or write clipboard data automatically prompts the user for
permission if it hasn't already been granted. Since the API is promise-based,
this is completely transparent, and a user denying clipboard permission causes
the promise to reject so the page can respond appropriately.

Because Chrome only allows clipboard access when a page is the active tab,
you'll find that some of the examples here don't run if pasted directly into
DevTools, since DevTools itself is the active tab. There's a trick: defer
clipboard access using `setTimeout()`, then quickly click inside the page to
focus it before the functions are called:

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## Permissions policy integration

To use the API in iframes, you need to enable it with
[Permissions Policy](https://w3c.github.io/webappsec-permissions-policy/),
which defines a mechanism that allows for selectively enabling and
disabling various browser features and APIs. Concretely, you need to pass either
or both of `clipboard-read` or `clipboard-write`, depending on the needs of your app.

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## Feature detection

To use the Async Clipboard API while supporting all browsers, test for
`navigator.clipboard` and fall back to earlier methods. For example, here's how
you might implement pasting to include other browsers.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  let text;
  if (navigator.clipboard) {
    text = await navigator.clipboard.readText();
  }
  else {
    text = e.clipboardData.getData('text/plain');
  }
  console.log('Got pasted text: ', text);
});
```

That's not the whole story. Before the Async Clipboard API, there were a mix of
different copy and paste implementations across web browsers. In most browsers,
the browser's own copy and paste can be triggered using
`document.execCommand('copy')` and `document.execCommand('paste')`. If the text
to be copied is a string not present in the DOM, it must be injected into the
DOM and selected:

```js
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Failed to copy text.');
  }
});
```

In Internet Explorer, you can also access the clipboard through
`window.clipboardData`. If accessed within a user gesture such as a click
event—part of asking permission responsibly—no permissions prompt is shown.

## Demos

You can play with the Async Clipboard API in the demos below or
[directly on Glitch](https://async-clipboard-api.glitch.me/).

The first example demonstrates moving text on and off the clipboard.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">
  <iframe
    src="https://async-clipboard-text.glitch.me/"
    title="async-clipboard-text on Glitch"
    allow="clipboard-read; clipboard-write"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

To try the API with images use this demo. Recall that only PNGs are supported
and only in
[a few browsers]([https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">
  <iframe
    src="https://async-clipboard-api.glitch.me/"
    title="async-clipboard-api on Glitch"
    allow="clipboard-read; clipboard-write"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Next Steps

Chrome is actively working on expanding the Asynchronous Clipboard API with
simplified events aligned with the
[Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).
Because of potential risks Chrome is
treading carefully. To stay up to date on Chrome's progress, watch this article
and our [blog](/blog/) for updates.

For now, support for the Clipboard API is available in
[a number of browsers](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard#Browser_compatibility).

Happy copying and pasting!

## Related links

* [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

## Acknowledgements

The Asynchronous Clipboard API was implemented by [Darwin
Huang](https://www.linkedin.com/in/darwinhuang/) and [Gary
Kačmarčík](https://www.linkedin.com/in/garykac/). Darwin also provided the demo.
Thanks to [Kyarik](https://github.com/kyarik) and again Gary Kačmarčík for
reviewing parts of this article.

Hero image by [Markus Winkler](https://unsplash.com/@markuswinkler) on
[Unsplash](https://unsplash.com/photos/7iSEHWsxPLw).

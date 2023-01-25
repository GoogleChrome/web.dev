---
title: Read files in JavaScript
subhead: How to select files, read file metadata and content, and monitor read progress.
description: |
  How to select files, read file metadata and content, and monitor read progress.
date: 2010-06-18
updated: 2021-03-29
authors:
 - kaycebasques
 - petelepage
 - thomassteiner
tags:
  - blog
  - storage
---

Being able to select and interact with files on the user's local device is
one of the most commonly used features of the web. It allows users to select
files and upload them to a server, for example, uploading photos, or
submitting tax documents, etc. But, it also allows sites to read and
manipulate them without ever having to transfer the data across the network.

## The modern File System Access API

The File System Access API provides an easy way to both read
and write to files and directories on the user's local system. It's currently
available in most Chromium-derived browsers like Chrome or Edge. To learn
more about it, see the [File System Access API][file-system-access] article.

Since the File System Access API is not compatible with all browsers yet,
check out [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access),
a helper library that uses the new API wherever it is available, but falls
back to legacy approaches when it is not.

## Working with files, the classic way

This guide shows you how to:

* Select files
  * [Using the HTML input element](#select-input)
  * [Using a drag-and-drop zone](#select-dnd)
* [Read file metadata](#read-metadata)
* [Read a file's content](#read-content)

## Select files {: #select }

### HTML input element {: #select-input }

The easiest way to allow users to select files is using the
[`<input type="file">`][mdn-file-input] element, which is supported in every
major browser. When clicked, it lets a user select a file, or multiple files
if the [`multiple`][mdn-file-input-attributes] attribute is included, using
their operating system's built-in file selection UI. When the user finishes
selecting a file or files, the element's `change` event is fired. You can
access the list of files from `event.target.files`, which is a
[`FileList`][mdn-filelist] object. Each item in the `FileList` is a
[`File`][mdn-file] object.

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="file-selector" multiple>
<script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script>
```

{% Aside %}
  Check if the [`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read)
  method is a viable alternative for your use case,
  since it also gives you a file handle so you can possibly write back to the file, apart from reading.
  This method can be [polyfilled](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files).
{% endAside %}

This example lets a user select multiple files using their operating system's
built-in file selection UI and then logs each selected file to the console.

{% Glitch {
  id: 'input-type-file',
  height: 480
} %}

#### Limit the types of files user can select {: #accept }

In some cases, you may want to limit the types of files users can select.
For example, an image editing app should only accept images, not text files.
To do that, you can add an [`accept`][mdn-file-input-attributes] attribute to
the input element to specify which files are accepted.

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### Custom drag-and-drop {: #select-dnd }

In some browsers, the `<input type="file">` element is also a drop target,
allowing users to drag-and-drop files into your app. But, the drop target is
small, and can be hard to use. Instead, once you've provided the core
functionality using an `<input type="file">` element, you can provide a
large, custom drag-and-drop surface.

{% Aside %}
  Check if the [`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration)
  method is a viable alternative for your use case,
  since it also gives you a file handle so you can possibly write back to the file, apart from reading.
{% endAside %}

#### Choose your drop zone {: #choose-drop-zone }

Your drop surface will depend on the design of your application. You may
only want part of the window to be a drop surface, or potentially the entire
window.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="A screenshot of Squoosh, an image compression web app.", width="800", height="589", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    Squoosh makes the entire window a drop zone.
  </figcaption>
</figure>

Squoosh allows the user to drag-and-drop an image anywhere into the window,
and clicking **select an image** invokes the `<input type="file">` element.
Whatever you choose as your drop zone, make sure it's clear to the user that
they can drag-and-drop files onto that surface.

#### Define the drop zone {: #define-drop-zone }

To enable an element to be a drag-and-drop zone, you'll need to listen for
two events, [`dragover`][mdn-dragover] and [`drop`][mdn-drop]. The `dragover`
event updates the browser UI to visually indicate that the drag-and-drop
action is creating a copy of the file. The `drop` event is fired after the
user has dropped the files onto the surface. Similar to the input element,
you can access the list of files from `event.dataTransfer.files`, which is
a [`FileList`][mdn-filelist] object. Each item in the `FileList` is a
[`File`][mdn-file] object.

```js
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
```

[`event.stopPropagation()`][mdn-stoppropagation] and
[`event.preventDefault()`][mdn-preventdefault] stop the browser's default
behavior from happening, and allow your code to run instead. Without them,
the browser would otherwise navigate away from your page and open the files
the user dropped into the browser window.

{# This example doesn't work as an embed. #}

Check out [Custom drag-and-drop][glitch-drag-and-drop] for a live demonstration.

### What about directories? {: #directories }

Unfortunately, today there isn't a good way to get access to a directory.

The [`webkitdirectory`][mdn-webkitdirectory] attribute on the
`<input type="file">` element allows the user to choose a directory or
directories. It is supported in some Chromium-based browsers, and possibly
desktop Safari, but has [conflicting][caniuse-webkitdirectory] reports of
browser compatibility.

{% Aside %}
  Check if the [`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents)
  method is a viable alternative for your use case,
  since it also gives you a directory handle so you can possibly write back to the directory, apart from reading.
  This method can be [polyfilled](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories).
{% endAside %}

If drag-and-drop is enabled, a user may try to drag a directory into the
drop zone. When the drop event is fired, it will include a `File` object for
the directory, but will be unable to access any of the files within the
directory.

## Read file metadata {: #read-metadata }

The [`File`][mdn-file] object contains a number of metadata properties about
the file. Most browsers provide the file name, the size of the file, and the
MIME type, though depending on the platform, different browsers may provide
different, or additional information.

```js
function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({file, name, type, size});
  }
}
```

You can see this in action in the [`input-type-file`][glitch-input-demo]
Glitch demo.

## Read a file's content {: #read-content }

To read a file, use [`FileReader`][mdn-filereader], which enables you to read
the content of a `File` object into memory. You can instruct `FileReader`
to read a file as an [array buffer][mdn-filereader-as-buffer], a
[data URL][mdn-filereader-as-dataurl], or [text][mdn-filereader-as-text].

```js
function readImage(file) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith('image/')) {
    console.log('File is not an image.', file.type, file);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    img.src = event.target.result;
  });
  reader.readAsDataURL(file);
}
```

The example above reads a `File` provided by the user, then converts it to a
data URL, and uses that data URL to display the image in an `img` element.
Check out the [`read-image-file`][glitch-read-image] Glitch to see how to
verify that the user has selected an image file.

{% Glitch {
  id: 'read-image-file',
  height: 480
} %}

### Monitor the progress of a file read {: #monitor-progress }

When reading large files, it may be helpful to provide some UX to indicate
how far the read has progressed. For that, use the
[`progress`][mdn-filereader-progress] event provided by `FileReader`. The
`progress` event provides two properties, `loaded`, the amount read, and
`total`, the total amount to read.

```js/7-12
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // Do something with result
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsDataURL(file);
}
```

Hero image by Vincent Botta from [Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)

[mdn-file-input]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
[mdn-file-input-attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Additional_attributes
[mdn-filelist]: https://developer.mozilla.org/en-US/docs/Web/API/FileList
[mdn-file]: https://developer.mozilla.org/en-US/docs/Web/API/File
[mdn-dragover]: https://developer.mozilla.org/en-US/docs/Web/API/Document/dragover_event
[mdn-drop]: https://developer.mozilla.org/en-US/docs/Web/API/Document/drop_event
[file-system-access]: /file-system-access/
[mdn-filereader]: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[mdn-filereader-as-buffer]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer
[mdn-filereader-as-dataurl]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL
[mdn-filereader-as-text]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsText
[mdn-filereader-progress]: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/progress_event
[mdn-stoppropagation]: https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
[mdn-preventdefault]: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
[mdn-webkitdirectory]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
[glitch-read-image]: https://read-image-file.glitch.me/
[glitch-input-demo]: https://input-type-file.glitch.me/
[glitch-drag-and-drop]: https://custom-drag-and-drop.glitch.me/
[caniuse-webkitdirectory]: https://caniuse.com/#search=webkitdirectory

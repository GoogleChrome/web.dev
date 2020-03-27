---
title: Read files in JavaScript
subhead: How to select files, read file metadata and content, and monitor read progress.
description: |
  How to select files, read file metadata and content, and monitor read progress.
date: 2010-06-18
updated: 2020-03-24
authors: 
 - kaycebasques
tags:
  - post
draft: true
---

This guide shows you how to:

* [Select files with HTML and read file metadata](#input)
* [Select files with a custom drag-and-drop UI](#drag-and-drop) (not recommended)
* [Read a file's content](#read)
* [Slice a file's content](#slice)
* [Monitor the progress of a file read](#monitor)

## Browser compatibility {: #compatibility }

Detailed browser compatibility data is listed at the bottom of each section.
If you see the usual [feature detection design pattern][detection] in a code sample
it means that it's unknown whether the API is 100% supported across all browsers
at the time of writing.

## Prerequisites {: #prerequisites }

This guide assumes you're familiar with:

* [Beginner web development concepts](https://developer.mozilla.org/docs/Learn)
* [Events](https://developer.mozilla.org/docs/Learn/JavaScript/Building_blocks/Events), in
  particular [`Event.stopPropagation()`][propagation] and
  [`Event.preventDefault()`][preventdefault]
* [Feature detection][detection]
* Modern JavaScript syntax like
  [arrow functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions),
  [shorthand object declarations](https://alligator.io/js/object-property-shorthand-es6/),
  [`const`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const), and
  [template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)

## Select files with an `<input type="file">` element {: #input }

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="file-selector" multiple>
<script>
  if (window.FileList && window.File) {
    document.getElementById('file-selector').addEventListener('change', event => {
      // `file` is a `File` object.
      // `event.target.files` is a `FileList` object.
      for (const file of event.target.files) {
        // Not supported in Safari for iOS.
        const name = file.name ? file.name : 'NOT SUPPORTED';
        // Not supported in Firefox for Android or Opera for Android.
        const type = file.type ? file.type : 'NOT SUPPORTED';
        // Unknown cross-browser support.
        const size = file.size ? file.size : 'NOT SUPPORTED';
        console.log({file, name, type, size});
      }
    }); 
  }
</script>
```

This example lets a user select multiple files using their operating system's built-in
file selection UI and then logs out the name and file type of each selected file to the Console.

After the user clicks the `<input type="file">` element the operating system's built-in
file selection UI appears. Add the `multiple` attribute to your `<input type="file">` element
to instruct the operating system to allow the user to select multiple files. When the
user finishes selecting a file or files the browser fires the `<input type="file">` element's
`change` event. You can access the list of files from `event.target.files`, which is a [`FileList`][filelist]
object. Each item in the `FileList` is a [`File`][file] object.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/input-type-file?previewSize=100"
          alt="How to select local files and read file metadata with JavaScript."
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Browser compatibility data for the APIs used in this section:
[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Browser_compatibility),
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility)

### Select files with a custom drag-and-drop UI {: #drag-and-drop }

{% Aside 'caution' %}
  If you're only going to provide one way to select files,
  [selecting files with an `<input type="file">` element](#input) is the recommended
  approach because browser vendors do a lot of work to ensure that their elements
  are accessible. However, MDN doesn't currently have cross-browser support data
  on how many browsers treat `<input type="file">` as built-in drag-and-drop targets.
  After you provide an accessible `<input type="file">` element you can also
  provide a large, custom drag-and-drop surface to achieve a best-of-both-worlds UX.
{% endAside %}

```html
<div id="file-selector"></div>
<script>
  const fileSelector = document.getElementById('file-selector');
  if (window.FileList && window.File) {
    fileSelector.addEventListener('dragover', event => {
      event.stopPropagation();
      event.preventDefault();
      // Style the drag-and-drop as a "copy file" operation.
      event.dataTransfer.dropEffect = 'copy';
    });
    fileSelector.addEventListener('drop', event => {
      event.stopPropagation();
      event.preventDefault();
      // `file` is a `File` object.
      // `event.dataTransfer.files` is a `FileList` object.
      for (const file of event.dataTransfer.files) {
        // Not supported in Safari for iOS.
        const name = file.name ? file.name : 'NOT SUPPORTED';
        // Not supported in Firefox for Android or Opera for Android.
        const type = file.type ? file.type : 'NOT SUPPORTED';
        // Unknown cross-browser support.
        const size = file.size ? file.size : 'NOT SUPPORTED';
        console.log({file, name, type, size});
      }
    }); 
  }
</script>
```

This example lets users select multiple files by dragging and dropping them
over a custom drag-and-drop target on the page and then logs the name and file type
of each selected file to the Console.

This is mostly the same as the [Select files with an `<input type="file">` element](#input)
example. Check out the links in [Prerequisites](#prerequisites) if you're not familiar with
`event.preventDefault()` or `event.stopPropagation()`.
The `dragover` event listener may not seem necessary, but without it
you'll probably find that the drag-and-drop UX doesn't work as intended.
[`event.dataTransfer.dropEffect = 'copy'`][dropeffect] enables you instruct the browser to
visually indicate that the drag-and-drop action is creating a copy of the file.
In comparison, `event.dataTransfer.dropEffect = 'move'` instructs the browser to indicate
that the original file is being moved from one location to another.
When you do a custom drag-and-drop UI you access the selected files from
`event.dataTransfer.files` in your `drop` event listener, which is a `FileList` object.

{# This example doesn't work as an embed. #}

Check out [Custom drag-and-drop](https://custom-drag-and-drop.glitch.me/)
for a live demonstration.

Browser compatibility data for the APIs used in this section:
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility),
[`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer#Browser_compatibility)

## Read a file's content {: #read }

```html
<input type="file" id="file-selector">
<img id="output">
<script>
  const img = document.getElementById('output');
  if (window.FileList && window.File && window.FileReader) {
    document.getElementById('file-selector').addEventListener('change', event => {
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        img.src = event.target.result;
      });
      reader.readAsDataURL(event.target.files[0]);
    }); 
  }
</script>
```

This example lets the user select a single image file using their operating system's built-in
file selection UI, then converts the file content to a data URL, then uses that data URL
to display the image in an `<img>` element. Check out the `read-image-file` Glitch below
to see how to verify that the user has selected an image file.

This is mostly the same as the [Select files with an `<input type="file">` element](#input)
example. The key API here is [`FileReader`][filereader], which enables you to read
the content of a `File` object into memory. You can instruct `FileReader` to read a file
as an [array buffer][buffer], a [data URL][data], or [text][text].
You can track the progress of your read operations by listening for the `loadstart`,
`progress`, `abort`, `error`, and `loadend` events on your `FileReader` object.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/read-image-file?previewSize=100"
          alt="How to read the content of an image file in JavaScript."
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Browser compatibility data for the APIs used in this section:
[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Browser_compatibility),
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility),
[`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader#Browser_compatibility)

## Monitor the progress of a file read {: #monitor }

```html
<input type="file" id="file-selector">
<p id="output"></p>
<script>
  const output = document.getElementById('output');
  if (window.FileList && window.File && window.FileReader) {
    document.getElementById('file-selector').addEventListener('change', event => {
      output.textContent = 'Progress: 0%';
      const reader = new FileReader();
      // `event` is a `ProgressEvent`.
      reader.addEventListener('progress', event => {
        // `loaded` and `total` are `ProgressEvent` properties. Not supported in IE.
        if (event.loaded && event.total) {
          const status = Math.round((event.loaded / event.total) * 100);
          output.textContent = `Progress: ${status}%`;
        }
      });
      reader.readAsDataURL(event.target.files[0]);
    }); 
  }
</script>
```

This example lets the user select a single file using their operating system's
built-in file selection UI and then displays a progress bar that goes from `0%`
to `100%` while the file's content is being loaded into memory.

This is mostly the same as the [Read a file's content](#read) sample code.
The key APIs here are the `progress` event and the 
[`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent)
object, which lets you quantify the progress of the file read operation by
dividing its `loaded` property by its `total` property.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/monitor-file-read-progress?previewSize=100"
          alt="How to monitor the progress of a file read in JavaScript."
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Browser compatibility data for the APIs used in this section:
[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Browser_compatibility),
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility),
[`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader#Browser_compatibility),
[`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent#Browser_compatibility)

[compat]: https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility
[file]: https://developer.mozilla.org/docs/Web/API/File
[filereader]: https://developer.mozilla.org/docs/Web/API/FileReader
[filelist]: https://developer.mozilla.org/docs/Web/API/FileList
[input]: https://developer.mozilla.org/docs/Web/HTML/Element/input/file
[detection]: https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection
[events]: https://developers.google.com/analytics/devguides/collection/analyticsjs/events
[buffer]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer
[data]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL
[text]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsText
[dropeffect]: https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect
[propagation]: https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Examples#Example_5:_Event_Propagation
[preventdefault]: https://developer.mozilla.org/docs/Web/API/Event/preventDefault
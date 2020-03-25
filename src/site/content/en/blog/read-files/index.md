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
* [Events](https://developer.mozilla.org/docs/Learn/JavaScript/Building_blocks/Events)
* [Feature detection][detection]
* Modern JavaScript syntax like
  [arrow functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions),
  [shorthand object declarations](https://alligator.io/js/object-property-shorthand-es6/),
  [`const`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const), and
  [template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)

## Select files with an `<input type="file">` element {: #input }

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="input" multiple/>
<script>
  if (window.FileList && window.File) {
    document.getElementById('input').addEventListener('change', event => {
      const files = event.target.files; // This is a `FileList` object.
      // `forEach()` won't work unless you convert `files` to an `Array`.
      for (let i = 0; i < files.length; i++) {
        const file = files[i]; // This is a `File` object.
        const name = file.name ? file.name : 'NOT SUPPORTED';
        const type = file.type ? file.type : 'NOT SUPPORTED';
        console.log({name, type});
      }
    }); 
  }
</script>
```

This example lets a user select multiple files using their operating system's built-in
file selection UI and then logs out the name and file type of each selected file to the Console.

[`<input type="file">`][input] is the recommended way to enable users to select files because
browser vendors do a lot of work to make sure that their built-in elements are accessible.
Some browsers also treat `<input type="file">` elements as automatic drag-and-drop targets.
After the user clicks the `<input type="file">` element the operating system's built-in
file selection UI appears. Add the `multiple` attribute to your `<input type="file">` element
to instruct the operating system to allow the user to select multiple files. When the
user finishes selecting a file or files the browser fires the `<input type="file">` element's
`change` event. You can access the list of files from `event.target.files`, which is a [`FileList`][filelist]
object, not an `Array`. If you want to iterate over `files` with `forEach()` you'll need to convert
it to an `Array`. Each item in the `FileList` is a [`File`][file] object.

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

### Select files with a custom drag-and-drop UI (not recommended) {: #drag-and-drop }

{% Aside 'caution' %}
  [Selecting files with an `<input type="file">` element](#input) is the recommended
  approach because browser vendors do a lot of work to ensure that their elements
  are accessible. However, MDN doesn't currently state how many browsers treat their
  `<input type="file">` elements as built-in drag-and-drop targets.
{% endAside %}

```html
<div id="input"></div>
<script>
  const input = document.getElementById('input');
  if (window.FileList && window.File) {
    input.addEventListener('dragover', event => {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    });
    input.addEventListener('drop', event => {
      event.stopPropagation();
      event.preventDefault();
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name ? file.name : 'NOT SUPPORTED';
        const type = file.type ? file.type : 'NOT SUPPORTED';
        console.log(`name: ${name}, type: ${type}`);
      }
    }); 
  }
</script>
```

This example lets users select multiple files by dragging and dropping them
over a custom drag-and-drop target on the page and then logs the name and file type
of each selected file to the Console.

This is mostly the same as the [Select files with an `<input type="file">` element](#input)
example. The `dragover` event listener may not seem necessary, but without it
you'll probably find that the drag-and-drop UX doesn't work as intended.
[`event.dataTransfer.dropEffect = 'copy'`][dropeffect] enables you instruct the browser to
visually indicate that the drag-and-drop operation is creating a copy of the file,
rather than moving the original file to a new location for example. When you do a custom drag-and-drop
UI you access the selected files from `event.dataTransfer.files` in your `drop` event listener,
which is a `FileList` object.

{# This example doesn't work as an embed. #}

Check out [Custom drag-and-drop](https://custom-drag-and-drop.glitch.me/)
for a live demonstration.

Browser compatibility data for the APIs used in this section:
[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Browser_compatibility),
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility),
[`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer#Browser_compatibility)

## Read a file's content {: #read }

```html
<input type="file" id="input"/>
<img id="output"/>
<script>
  const output = document.getElementById('output');
  if (window.FileList && window.File && window.FileReader) {
    document.getElementById('input').addEventListener('change', event => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        output.src = event.target.result;
      });
      reader.readAsDataURL(file);
    }); 
  }
</script>
```

This example lets the user select a single image file using their operating system's built-in
file selection UI, then converts the file content to a data URL, then uses that data URL
to display the image in an `<img/>` element. Check out the `read-image-file` Glitch below
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
<input type="file" id="input"/>
<p id="output"></p>
<script>
  const output = document.getElementById('output');
  if (window.FileList && window.File && window.FileReader) {
    document.getElementById('input').addEventListener('change', event => {
      output.textContent = 'Progress: 0%';
      const file = event.target.files[0];
      const reader = new FileReader();
      // `event` is a `ProgressEvent`.
      reader.addEventListener('progress', event => {
        // `loaded` and `total` are `ProgressEvent` properties.
        if (event.loaded && event.total) {
          const status = Math.round((event.loaded / event.total) * 100);
          output.textContent = `Progress: ${status}%`;
        }
      });
      reader.readAsDataURL(file);
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
[binary]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsBinaryString
[data]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL
[text]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsText
[dropeffect]: https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect
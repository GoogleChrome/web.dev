---
title: Read files with HTML and JavaScript
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
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name ? file.name : undefined;
        const type = file.type ? file.type : undefined;
        console.log({name, type});
      }
    }); 
  }
</script>
```

`<input type="file">` is the recommended way to enable users to select files because
browser vendors do a lot of work to make sure that their built-in elements are accessible.
Most browsers also treat `<input type="file">` elements as automatic drag-and-drop targets.
After the user clicks the `<input type="file">` element the operating system's built-in
file selection UI appears. Add the `multiple` attribute to your `<input type="file">` element
to instruct the operating system to allow the user to select multiple files. When the
user finishes selecting a file or files the browser fires the `<input type="file">` element's
`change` event. You can access the list of files from `event.target.files`, which is a `FileList`
object, not an `Array`. If you want to iterate over `files` with `forEach()` you'll need to convert
it to an `Array`.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/input-type-file?previewSize=100"
          alt="TODO"
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
  are accessible.
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
        console.log(`name: ${name}, type: ${type}, size: ${size}`);
      }
    }); 
  }
</script>
```

This is mostly the same as the [Select files with an `<input type="file">` element](#input)
sample code. The `dragover` event listener may not seem necessary, but without it
you'll probably find that the drag-and-drop UX doesn't work as intended.
`event.dataTransfer.dropEffect = 'copy'` enables you instruct the browser to
visually indicate that the drag-and-drop operation is creating a copy of the file,
rather than moving the original file to a new location. When you do a custom drag-and-drop
UI you access the selected files from `event.dataTransfer.files` in your `drop` event listener.

{# This example doesn't work as an embed. #}

Check out [Custom drag-and-drop](https://custom-drag-and-drop.glitch.me/)
for an example.

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

This is mostly the same as the [Select files with an `<input type="file">` element](#input)
sample code. The key API here is `FileReader`, which enables you to read
the content of a `File` object. You can instruct `FileReader` to read a file
as an [array buffer][buffer], a [binary string][binary],
a [data URL][data], or [text][text].

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/read-image-file?previewSize=100"
          alt="TODO"
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Browser compatibility data for the APIs used in this section:
[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Browser_compatibility),
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility),
[`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader#Browser_compatibility)

## Slice a file's content {: #slice }

```html
<style>
  #byte_content {
    margin: 5px 0;
    max-height: 100px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  #byte_range { margin-top: 5px; }
</style>

<input type="file" id="files" name="file" /> Read bytes: 
<span class="readBytesButtons">
  <button data-startbyte="0" data-endbyte="4">1-5</button>
  <button data-startbyte="5" data-endbyte="14">6-15</button>
  <button data-startbyte="6" data-endbyte="7">7-8</button>
  <button>entire file</button>
</span>
<div id="byte_range"></div>
<div id="byte_content"></div>

<script>
  function readBlob(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        document.getElementById('byte_content').textContent = evt.target.result;
        document.getElementById('byte_range').textContent = 
            ['Read bytes: ', start + 1, ' - ', stop + 1,
             ' of ', file.size, ' byte file'].join('');
      }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  }
  
  document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
    if (evt.target.tagName.toLowerCase() == 'button') {
      var startByte = evt.target.getAttribute('data-startbyte');
      var endByte = evt.target.getAttribute('data-endbyte');
      readBlob(startByte, endByte);
    }
  }, false);
</script>
```

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
        // These are all `ProgressEvent` properties.
        if (event.lengthComputable && event.loaded && event.total) {
          const status = Math.round((event.loaded / event.total) * 100);
          output.textContent = `Progress: ${status}%`;
        }
      });
      reader.readAsDataURL(file);
    }); 
  }
</script>
```

This is mostly the same as the [Read a file's content](#read) sample code.
The key APIs here are the `progress` event and the 
[`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent)
object, which lets you quantify the progress of the file read operation by
dividing its `loaded` property by its `total` property.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/monitor-file-read-progress?previewSize=100"
          alt="TODO"
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
[input]: https://developer.mozilla.org/docs/Web/HTML/Element/input/file
[detection]: https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection
[events]: https://developers.google.com/analytics/devguides/collection/analyticsjs/events
[buffer]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer
[binary]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsBinaryString
[data]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL
[text]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsText
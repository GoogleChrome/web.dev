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

* [Select files with HTML and read file metadata with the `FileList` and `File` APIs](#input)
* [Select files with a custom drag-and-drop UI](#drag-and-drop) (not recommended)
* [Read a file's content with the `FileReader` API](#read)
* [Slice a file's content](#slice)
* [Monitor the progress of a file read](#monitor)

## Browser compatibility {: #compatibility }

Detailed browser compatibility data is listed at the bottom of each section.

## Prerequisites {: #prerequisites }

This guide assumes you're familiar with:

* [Events](https://developer.mozilla.org/docs/Learn/JavaScript/Building_blocks/Events)
  and [`Event.target`](https://developer.mozilla.org/docs/Web/API/Event/target)
* [Feature detection][detection]

## Select files with an `<input type="file">` element {: #input }

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="input" multiple/>
<script>
  if (window.FileList && window.File) {
    document.getElementById('input').addEventListener('change', event => {
      const files = event.target.files; // This is a `FileList`.
      // `forEach()` won't work here because `files` is a `FileList`, not an `Array`.
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Check before using because browser compatibility isn't 100%.
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
to instruct the operating system to let the user select multiple files. When the
user finishes selecting a file or files the browser fires the `<input type="file">` element's
`change` event. You can access the list of files from `event.target.files`, which is a `FileList`
object, not an `Array`. If you want to iterate over `files` with `forEach()` you'll need to convert
it to an `Array`. At the time of writing all major browsers have basic support for `File` and
`FileList` but `File.name` and `File.type` don't quite have 100% support which is why the code sample
checks for their existence before using them. There's also a `File.size` property which you may
find useful, but MDN doesn't have browser compatibility data on it at the moment.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/input-type-file?previewSize=100"
          alt="TODO"
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Browser compatibility data for the APIs used in this section:
[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Browser_compatibility),
[`File`](https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility),
[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList#Browser_compatibility),
[`File.name`](https://developer.mozilla.org/docs/Web/API/File/name#Browser_compatibility),
[`File.type`](https://developer.mozilla.org/docs/Web/API/File/name#Browser_compatibility)

### Select files with a custom drag-and-drop UI (not recommended) {: #drag-and-drop }

{% Aside 'caution' %}
  [Selecting files with an `<input type="file">` element](#input) is the recommended
  approach because browser vendors do a lot of work to ensure that their elements
  are accessible.
{% endAside %}

```html
<div id="drop_zone">Drop files here</div>
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
</script>
```

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/custom-drag-and-drop?previewSize=100"
          alt="TODO"
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

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

Check out [Select files with an `<input type="file">` element](#input) for
an explanation of `<input type="file">` and `event.target.files`.
The key API in this code sample is `FileReader`, which enables you to read
the content of a `File` object. You can instruct `FileReader` to read a file
as an array buffer ([`FileReader.readAsArrayBuffer()`][buffer]),
binary string ([`FileReader.readAsBinaryString()`][binary]),
data URL ([`FileReader.readAsDataURL()`][data]), or
text ([`FileReader.readAsText()`][text]).

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/read-image-file?previewSize=100"
          alt="TODO"
          style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

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
<style>
  #progress_bar {
    margin: 10px 0;
    padding: 3px;
    border: 1px solid #000;
    font-size: 14px;
    clear: both;
    opacity: 0;
    -moz-transition: opacity 1s linear;
    -o-transition: opacity 1s linear;
    -webkit-transition: opacity 1s linear;
  }
  #progress_bar.loading {
    opacity: 1.0;
  }
  #progress_bar .percent {
    background-color: #99ccff;
    height: auto;
    width: 0;
  }
</style>

<input type="file" id="files" name="file" />
<button onclick="abortRead();">Cancel read</button>
<div id="progress_bar"><div class="percent">0%</div></div>

<script>
  var reader;
  var progress = document.querySelector('.percent');

  function abortRead() {
    reader.abort();
  }

  function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
  }

  function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

  function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function(e) {
      alert('File read cancelled');
    };
    reader.onloadstart = function(e) {
      document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      progress.style.width = '100%';
      progress.textContent = '100%';
      setTimeout("document.getElementById('progress_bar').className='';", 2000);
    }

    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.target.files[0]);
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>
```

[compat]: https://developer.mozilla.org/docs/Web/API/File#Browser_compatibility
[file]: https://developer.mozilla.org/docs/Web/API/File
[input]: https://developer.mozilla.org/docs/Web/HTML/Element/input/file
[detection]: https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection
[events]: https://developers.google.com/analytics/devguides/collection/analyticsjs/events
[buffer]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer
[binary]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsBinaryString
[data]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL
[text]: https://developer.mozilla.org/docs/Web/API/FileReader/readAsText
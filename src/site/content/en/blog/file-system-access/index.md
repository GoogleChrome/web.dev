---
title: 'The File System Access API: simplifying access to local files'
subhead:
  The File System Access API allows web apps to read or save changes directly to files and folders
  on the user's device.
authors:
  - petelepage
  - thomassteiner
description:
  The File System Access API enables developers to build powerful web apps that interact with files
  on the user's local device, like IDEs, photo and video editors, text editors, and more. After a
  user grants a web app access, this API allows them to read or save changes directly to files and
  folders on the user's device.
date: 2019-08-20
updated: 2020-11-10
tags:
  - blog
  - capabilities
  - file
  - file-system
hero: hero.jpg
alt: Image of hard disk platters
feedback:
  - api
---

## What is the File System Access API? {: #what-is-it }

The [File System Access API][spec] (formerly known as Native File System API
and prior to that it was called Writeable Files API) enables developers to
build powerful web apps that interact with files on the user's local device, like IDEs, photo and
video editors, text editors, and more. After a user grants a web app access, this API allows them to
read or save changes directly to files and folders on the user's device. Beyond reading and writing
files, the File System Access API provides the ability to open a directory and enumerate its
contents.

If you've worked with reading and writing files before, much of what I'm about to share will be
familiar to you. I encourage you to read it anyway, because not all systems are alike.

{% Aside %}
  We've put a lot of thought into the design and implementation of the File System Access
  API to ensure that people can easily manage their files. See the
  [security and permissions](#security-considerations) section for more information.
{% endAside %}

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                |
| ---------------------------------------- | --------------------- |
| 1. Create explainer                      | [Complete][explainer] |
| 2. Create initial draft of specification | [Complete][spec]      |
| 3. Gather feedback & iterate on design   | [Complete][spec]      |
| 4. Origin trial                          | Complete              |
| **5. Launch**                            | **Complete**          |

</div>

{% Aside %}
  During the origin trial phase, there was a universal method named `Window.chooseFileSystemEntries()` that has
  been replaced with the three specialized methods `Window.showOpenFilePicker()`,
  `Window.showSaveFilePicker()`, and `Window.showDirectoryPicker()`. There were a number of other
  [changes](https://github.com/WICG/file-system-access/blob/master/changes.md) that you can
  read up on.
{% endAside %}

## Using the File System Access API {: #how-to-use }

To show off the power and usefulness of the File System Access API, I wrote a single file [text
editor][text-editor]. It lets you open a text file, edit it, save the changes back to disk, or start
a new file and save the changes to disk. It's nothing fancy, but provides enough to help you
understand the concepts.

### Try it

See the File System Access API in action in the
[text editor](https://googlechromelabs.github.io/text-editor/) demo.

### Read a file from the local file system {: #read-file }

The first use case I wanted to tackle was to ask the user to choose a file, then open and read that
file from disk.

#### Ask the user to pick a file to read

The entry point to the File System Access API is
[`window.showOpenFilePicker()`][showopenfilepicker]. When called, it shows a file picker dialog box,
and prompts the user to select a file. After they select a file, the API returns an array of file
handles. An optional `options` parameter lets you influence the behavior of the file picker, for
example, by allowing the user to select multiple files, or directories, or different file types.
Without any options specified, the file picker allows the user to select a single file. This is
perfect for a text editor.

Like many other powerful APIs, calling `showOpenFilePicker()` must be done in a [secure
context][secure-contexts], and must be called from within a user gesture.

```js/3
let fileHandle;
butOpenFile.addEventListener('click', async () => {
  // Destructure the one-element array.
  [fileHandle] = await window.showOpenFilePicker();
  // Do something with the file handle.
});
```

Once the user selects a file, `showOpenFilePicker()` returns an array of handles, in this case a
one-element array with one [`FileSystemFileHandle`][fs-file-handle] that contains the properties and
methods needed to interact with the file.

It's helpful to keep a reference to the file handle around so that it can be used later. It'll be
needed to save changes back to the file, or to perform any other file operations.

#### Read a file from the file system

Now that you have a handle to a file, you can get the file's properties, or access the file itself.
For now, I'll simply read its contents. Calling `handle.getFile()` returns a
[`File`][file-api-spec] object, which contains a blob. To get the data from the blob, call one of
[its methods][blob-methods] (`slice()`, `stream()`, `text()`, `arrayBuffer()`).

```js
const file = await fileHandle.getFile();
const contents = await file.text();
```

The `File` object returned by `FileSystemFileHandle.getFile()` is only readable as long as the
underlying file on disk hasn't changed. If the file on disk is modified, the `File` object becomes
unreadable and you'll need to call `getFile()` again to get a new `File` object to read the changed
data.

#### Putting it all together

When users click the Open button, the browser shows a file picker. Once they've selected a file, the
app reads the contents and puts them into a `<textarea>`.

```js/3-4
let fileHandle;
butOpenFile.addEventListener('click', async () => {
  [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  textArea.value = contents;
});
```

### Write the file to the local file system {: #write-file }

In the text editor, there are two ways to save a file: **Save**, and **Save As**. **Save** simply
writes the changes back to the original file using the file handle retrieved earlier. But **Save
As** creates a new file, and thus requires a new file handle.

#### Create a new file

To save a file, call [`showSaveFilePicker()`][showsavefilepicker], which will show the file
picker in "save" mode, allowing the user to pick a new file they want to use for saving. For the
text editor, I also wanted it to automatically add a `.txt` extension, so I provided some additional
parameters.

```js
async function getNewFileHandle() {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}
```

#### Save changes to disk {: #save-to-disk }

You can find all the code for saving changes to a file in my [text editor][text-editor] demo on
[GitHub][text-editor-source]. The core file system interactions are in
[`fs-helpers.js`][text-editor-fs-helper]. At its simplest, the process looks like the code below.
I'll walk through each step and explain it.

```js
async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}
```

Writing data to disk uses a [`FileSystemWritableFileStream`][fs-writablestream] object, essentially
a [`WritableStream`][writable-stream]. Create the stream by calling `createWritable()` on the file
handle object. When `createWritable()` is called, the browser first checks if the user has granted
write permission to the file. If permission to write hasn't been granted, the browser will prompt
the user for permission. If permission isn't granted, `createWritable()` will throw a
`DOMException`, and the app will not be able to write to the file. In the text editor, these
`DOMException`s are handled in the [`saveFile()`][text-editor-app-js] method.

The `write()` method takes a string, which is what's needed for a text editor. But it can also take
a [BufferSource][buffersource], or a [Blob][blob]. For example, you can pipe a stream directly to
it:

```js/4,6
async function writeURLToFile(fileHandle, url) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Make an HTTP request for the contents.
  const response = await fetch(url);
  // Stream the response into the file.
  await response.body.pipeTo(writable);
  // pipeTo() closes the destination pipe by default, no need to close it.
}
```

You can also [`seek()`][spec-seek], or [`truncate()`][spec-truncate] within the stream to update the
file at a specific position, or resize the file.

{% Aside 'caution' %}
  Changes are **not** written to disk until the stream is closed, either by
  calling `close()` or when the stream is automatically closed by the pipe.
{% endAside %}

### Storing file handles in IndexedDB

File handles are serializable, which means that you can save a file handle to IndexedDB, or call
`postMessage()` to send them between the same top-level origin.

Saving file handles to IndexedDB means that you can store state, or remember which files a user was
working on. This makes it possible to keep a list of recently opened or edited files, offer to
re-open the last file when the app is opened, etc. In the text editor, I store a list of the five
most recent files the user has opened, making it easy to access those files again.

Since permissions currently are not persisted between sessions, you should verify whether the user
has granted permission to the file using `queryPermission()`. If they haven't, use
`requestPermission()` to (re-)request it.

In the text editor, I created a `verifyPermission()` method that checks if the user has already
granted permission, and if required, makes the request.

```js/6,10
async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = 'readwrite';
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}
```

By requesting write permission with the read request, I reduced the number of permission prompts:
the user sees one prompt when opening the file, and grants permission to both read and write to it.

### Opening a directory and enumerating its contents

To enumerate all files in a directory, call [`showDirectoryPicker()`][showdirectorypicker]. The user
selects a directory in a picker, after which a [`FileSystemDirectoryHandle`][fs-dir-handle] is
returned, which lets you enumerate and access the directory's files.

```js
const butDir = document.getElementById('butDirectory');
butDir.addEventListener('click', async () => {
  const dirHandle = await window.showDirectoryPicker();
  for await (const entry of dirHandle.values()) {
    console.log(entry.kind, entry.name);
  }
});
```

### Creating or accessing files and folders in a directory

From a directory, you can create or access files and folders using the
[`getFileHandle()`][getfilehandle] or respectively the [`getDirectoryHandle()`][getdirectoryhandle]
method. By passing in an optional `options` object with a key of `create` and a boolean value of
`true` or `false`, you can determine if a new file or folder should be created if it doesn't exist.

```js
// In an existing directory, create a new directory named "My Documents".
const newDirectoryHandle = await existingDirectoryHandle.getDirectoryHandle('My Documents', {
  create: true,
});
// In this new directory, create a file named "My Notes.txt".
const newFileHandle = await newDirectoryHandle.getFileHandle('My Notes.txt', { create: true });
```

### Resolving the path of an item in a directory

When working with files or folders in a directory, it can be useful to resolve the path of the item
in question. This can be done with the aptly named [`resolve()`][resolve] method. For resolving, the
item can be a direct or indirect child of the directory.

```js
// Resolve the path of the previously created file called "My Notes.txt".
const path = await newDirectoryHandle.resolve(newFileHandle);
// `path` is now ["My Documents", "My Notes.txt"]
```

### Deleting files and folders in a directory

If you have obtained access to a directory, you can delete the contained files and folders with the
[`removeEntry()`][removeentry] method. For folders, deletion can optionally be recursive
and include all subfolders and the therein contained files.

```js
// Delete a file.
await directoryHandle.removeEntry('Abandoned Masterplan.txt');
// Recursively delete a folder.
await directoryHandle.removeEntry('Old Stuff', { recursive: true });
```

### Drag and drop integration

The
[HTML Drag and Drop interfaces](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
enable web applications to accept
[dragged and dropped files](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop)
on a web page.
During a drag and drop operation, dragged file and directory items are associated
with file entries and directory entries respectively.
The `DataTransferItem.getAsFileSystemHandle()` method returns a promise with a `FileSystemFileHandle` object
if the dragged item is a file, and a promise with a `FileSystemDirectoryHandle` object if the dragged item is a directory.
The listing below shows this in action.
Note that the Drag and Drop interface's
[`DataTransferItem.kind`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/kind)
will be `"file"` for both files *and* directories, whereas the File System Access API's
[`FileSystemHandle.kind`](https://wicg.github.io/file-system-access/#dom-filesystemhandle-kind)
will be `"file"` for files and `"directory"` for directories.

```js/13
elem.addEventListener('dragover', (e) => {
  // Prevent navigation.
  e.preventDefault();
});

elem.addEventListener('drop', async (e) => {
  // Prevent navigation.
  e.preventDefault();
  // Process all of the items.
  for (const item of e.dataTransfer.items) {
    // Careful: `kind` will be 'file' for both file
    // _and_ directory entries.
    if (item.kind === 'file') {
      const entry = await item.getAsFileSystemHandle();
      if (entry.kind === 'directory') {
        handleDirectoryEntry(entry);
      } else {
        handleFileEntry(entry);
      }
    }
  }
});
```

### Accessing the origin-private file system

The origin-private file system is a storage endpoint that, as the name suggests, is private to the
origin of the page. While browsers will typically implement this by persisting the contents of this
origin-private file system to disk somewhere, it is _not_ intended that the contents be easily user
accessible. Similarly, there is _no_ expectation that files or directories with names matching the
names of children of the origin-private file system exist.
While the browser might make it seem that there are files, internally—since this is an
origin-private file system—the browser might store these "files" in a database or any
other data structure.
Essentially: what you create with this API, do _not_ expect to find it 1:1 somewhere on the hard disk.
You can operate as usual on the
origin-private file system once you have access to the root `FileSystemDirectoryHandle`.

```js
const root = await navigator.storage.getDirectory();
// Create a new file handle.
const fileHandle = await root.getFileHandle('Untitled.txt', { create: true });
// Create a new directory handle.
const dirHandle = await root.getDirectoryHandle('New Folder', { create: true });
// Recursively remove a directory.
await root.removeEntry('Old Stuff', { recursive: true });
```

## Polyfilling

It is not possible to completely polyfill the File System Access API methods.

- The `showOpenFilePicker()` method can be approximated with an `<input type="file">` element.
- The `showSaveFilePicker()` method can be simulated with a `<a download="file_name">` element,
  albeit this will trigger a programmatic download and not allow for overwriting existing files.
- The `showDirectoryPicker()` method can be somewhat emulated with the non-standard
  `<input type="file" webkitdirectory>` element.

We have developed a library called [browser-fs-access](/browser-fs-access/) that uses the File
System Access API wherever possible and that falls back to these next best options in all other cases.

## Security and permissions {: #security-considerations }

The Chrome team has designed and implemented the File System Access API using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control and transparency, and user ergonomics.

### Opening a file or saving a new file

<figure class="w-figure w-figure--inline-right">
  <a href="fs-open.jpg">
    <img src="fs-open.jpg"
         alt="File picker to open a file for reading">
  </a>
  <figcaption class="w-figcaption">
    A file picker used to open an existing file for reading.
  </figcaption>
</figure>

When opening a file, the user provides permission to read a file or directory via the file picker.
The open file picker can only be shown via a user gesture when served from a [secure
context][secure-contexts]. If users change their minds, they can cancel the selection in the file
picker and the site does not get access to anything. This is the same behavior as that of the
`<input type="file">` element.

<div class="w-clearfix"></div>

<figure class="w-figure w-figure--inline-left">
  <a href="fs-save.jpg">
    <img src="fs-save.jpg"
         alt="File picker to save a file to disk.">
  </a>
  <figcaption class="w-figcaption">
    A file picker used to save a file to disk.
  </figcaption>
</figure>

Similarly, when a web app wants to save a new file, the browser will show the save file picker,
allowing the user to specify the name and location of the new file. Since they are saving a new file
to the device (versus overwriting an existing file), the file picker grants the app permission to
write to the file.

<div class="w-clearfix"></div>

#### Restricted folders

To help protect users and their data, the browser may limit the user's ability to save to certain
folders, for example, core operating system folders like Windows, the macOS Library folders, etc.
When this happens, the browser will show a modal prompt and ask the user to choose a different
folder.

### Modifying an existing file or directory

A web app cannot modify a file on disk without getting explicit permission from the user.

#### Permission prompt

<figure class="w-figure w-figure--inline-right">
  <a href="fs-save-permission.jpg">
    <img src="fs-save-permission-crop.jpg" class="w-screenshot"
         alt="Permission prompt shown prior to saving a file.">
  </a>
  <figcaption class="w-figcaption">
    Prompt shown to users before the browser is granted write
    permission on an existing file.
  </figcaption>
</figure>

If a person wants to save changes to a file that they previously granted read access to, the browser
will show a modal permission prompt, requesting permission for the site to write changes to disk.
The permission request can only be triggered by a user gesture, for example, by clicking a Save
button.

Alternatively, a web app that edits multiple files, like an IDE, can also ask for permission to save
changes at the time of opening.

If the user chooses Cancel, and does not grant write access, the web app cannot save changes to the
local file. It should provide an alternative method to allow the user to save their data, for
example by providing a way to ["download" the file][download-file], saving data to the cloud, etc.

<div class="w-clearfix"></div>

### Transparency

<figure class="w-figure w-figure--inline-right">
  <a href="fs-save-icon.jpg">
    <img src="fs-save-icon.jpg" class="w-screenshot"
         alt="Omnibox icon">
  </a>
  <figcaption class="w-figcaption">
    Omnibox icon indicating the user has granted the website permission to
    save to a local file.
  </figcaption>
</figure>

Once a user has granted permission to a web app to save a local file, the browser will show an icon
in the URL bar. Clicking on the icon opens a pop-over showing the list of files the user has given
access to. The user can easily revoke that access if they choose.

<div class="w-clearfix"></div>

### Permission persistence

The web app can continue to save changes to the file without prompting until all tabs for that
origin are closed. Once a tab is closed, the site loses all access. The next time the user uses the
web app, they will be re-prompted for access to the files.

## Feedback {: #feedback }

We want to hear about your experiences with the File System Access API.

### Tell us about the API design {: .hide-from-toc }

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model?

- File a spec issue on the [WICG File System Access GitHub repo][spec-issues], or add your thoughts
  to an existing issue.

### Problem with the implementation? {: .hide-from-toc }

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?

- File a bug at [https://new.crbug.com][new-bug]. Be sure to include as much detail as you can,
  simple instructions for reproducing, and set _Components_ to `Blink>Storage>FileSystem`.
  [Glitch](https://glitch.com) works great for sharing quick and easy repros.

### Planning to use the API? {: .hide-from-toc }

Planning to use the File System Access API on your site? Your public support helps us to prioritize
features, and shows other browser vendors how critical it is to support them.

- Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]
- Send a Tweet to [@ChromiumDev][cr-dev-twitter] with `#filesystemaccess` and let us know where and how
  you're using it.

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [File System Access specification][spec] & [File specification][file-api-spec]
- [Tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Request an [origin trial token]({{origin_trial.url}})
- [TypeScript definitions][typescript]
- [File System Access API - Chromium Security Model][nfs-cr-sec-model]
- Blink Component: `Blink>Storage>FileSystem`

## Acknowledgements

The File System Access API spec was written by
[Marijn Kruisselbrink](https://github.com/mkruisselbrink).

[spec]: https://wicg.github.io/file-system-access/
[cr-bug]: https://crbug.com/853326
[cr-status]: https://www.chromestatus.com/feature/6284708426022912
[explainer]: https://github.com/WICG/file-system-access/blob/master/EXPLAINER.md
[spec-security]: https://wicg.github.io/file-system-access/#privacy-considerations
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EStorage%3EFileSystem
[nfs-cr-sec-model]: https://docs.google.com/document/d/1NJFd-EWdUlQ7wVzjqcgXewqC5nzv_qII4OvlDtK6SE8/edit
[wicg-discourse]: https://discourse.wicg.io/t/writable-file-api/1433
[file-api-spec]: https://w3c.github.io/FileAPI/
[blob-methods]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
[showopenfilepicker]: https://wicg.github.io/file-system-access/#api-showopenfilepicker
[showsavefilepicker]: https://wicg.github.io/file-system-access/#api-showsavefilepicker
[showdirectorypicker]: https://wicg.github.io/file-system-access/#api-showdirectorypicker
[getfilehandle]: https://wicg.github.io/file-system-access/#dom-filesystemdirectoryhandle-getfilehandle
[getdirectoryhandle]: https://wicg.github.io/file-system-access/#dom-filesystemdirectoryhandle-getdirectoryhandle
[removeentry]: https://wicg.github.io/file-system-access/#dom-filesystemdirectoryhandle-removeentry
[resolve]: https://wicg.github.io/file-system-access/#api-filesystemdirectoryhandle-resolve
[fs-writer]: https://wicg.github.io/file-system-access/#filesystemwriter
[blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
[buffersource]: https://developer.mozilla.org/en-US/docs/Web/API/BufferSource
[fs-file-handle]: https://wicg.github.io/file-system-access/#api-filesystemfilehandle
[fs-dir-handle]: https://wicg.github.io/file-system-access/#api-filesystemdirectoryhandle
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot-guide]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[spec-issues]: https://github.com/wicg/file-system-access/issues/
[api-surface]: https://docs.google.com/document/d/11rcS0FdwM8w-s2esacEQxFfp3g2AAI9uD7drH8ARKPA/edit#
[secure-contexts]: https://w3c.github.io/webappsec-secure-contexts/
[writablestream]: https://streams.spec.whatwg.org/#ws-class
[text-editor]: https://googlechromelabs.github.io/text-editor/
[text-editor-source]: https://github.com/GoogleChromeLabs/text-editor/
[text-editor-fs-helper]: https://github.com/GoogleChromeLabs/text-editor/blob/master/src/inline-scripts/fs-helpers.js
[text-editor-app-js]: https://github.com/GoogleChromeLabs/text-editor/blob/master/src/inline-scripts/app.js
[download-file]: https://developers.google.com/web/updates/2011/08/Downloading-resources-in-HTML5-a-download
[cr-dev-twitter]: https://twitter.com/chromiumdev
[fs-writablestream]: https://wicg.github.io/file-system-access/#api-filesystemwritablefilestream
[writable-stream]: https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
[spec-resolve]: https://wicg.github.io/file-system-access/#api-filesystemdirectoryhandle-resolve
[spec-issameentry]: https://wicg.github.io/file-system-access/#api-filesystemhandle-issameentry
[spec-seek]: https://wicg.github.io/file-system-access/#api-filesystemwritablefilestream-seek
[spec-truncate]: https://wicg.github.io/file-system-access/#api-filesystemwritablefilestream-truncate
[typescript]: https://www.npmjs.com/package/@types/wicg-file-system-access

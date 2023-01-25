---
title: 用 JavaScript 读取文件
subhead: 如何选择文件、读取文件元数据和内容以及监控读取进度。
description: |2

  如何选择文件、读取文件元数据和内容以及监控读取进度。
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

最常用的网络功能之一就是能够选择用户本地设备上的文件并与之进行交互。该功能允许用户选择文件并将其上传到服务器，例如上传照片或提交税务文件等。但是，这项功能也使网站能够在无需通过网络传输数据的情况下对文件进行读取和操作。

## 现代的文件系统访问 API

文件系统访问 API 提供了一种简单的方法来对用户本地系统中的文件和目录进行读取和写入。在大多数 Chromium 衍生浏览器（如 Chrome 或 Edge）中都可以使用该 API。如需了解更多信息，请参阅[文件系统访问 API](/file-system-access/) 一文。

由于文件系统访问 API 尚不与所有浏览器兼容，因而您可以了解一下 [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access)，这是一个辅助库，会在新 API 可用时使用该 API，而在不兼容时退而采用传统方法。

## 处理文件，经典方式

本指南会向您展示如何：

- 选择文件
    - [使用 HTML 输入元素](#select-input)
    - [使用拖放区](#select-dnd)
- [读取文件元数据](#read-metadata)
- [读取文件内容](#read-content)

## 选择文件 {: #select }

### HTML 输入元素 {: #select-input }

要想使用户能够选择文件，最简单方法是使用各大主流浏览器都支持的[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file)元素。单击该元素后，用户就能够使用他们操作系统的内置文件选择用户界面来选择单个或多个文件（如果元素中包含[`multiple`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes)属性）。用户选择了一个或多个文件后，将会触发`change`事件。您可以从`event.target.files`访问文件列表，该列表是一个[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList)对象。`FileList`中的每一项都是一个[`File`](https://developer.mozilla.org/docs/Web/API/File)对象。

```html
<!-- `multiple` 属性使用户能够选择多个文件。 -->
<input type="file" id="file-selector" multiple>
<script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script>
```

{% Aside %}请检查[`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read)方法对于您的用例是否是一个可行的替代方案，因为该方法还为您提供了一个文件句柄，所以除了读取文件之外，您还可以回写文件。您可以使用这种方法进行 [polyfill](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files)。{% endAside %}

该示例让用户使用他们操作系统的内置文件选择用户界面选择多个文件，然后将每个选定的文件记录到控制台。

{% Glitch { id: 'input-type-file', height: 480 } %}

#### 限制用户可以选择的文件类型 {: #accept }

在某些情况下，您可能希望限制用户可以选择的文件类型。例如，一个图像编辑应用程序应该只接受图像，而不是文本文件。为此，您可以向输入元素中添加一个[`accept`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes)属性来指定可接受的文件类型。

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### 自定义拖放 {: #select-dnd }

在某些浏览器中，`<input type="file">`元素也是一个放置目标，能够让用户将文件拖放到您的应用程序中。但是放置目标很小，可能较难使用。其实，在您使用`<input type="file">`元素提供了核心功能后，就可以提供一个较大的自定义拖放表面。

{% Aside %}请检查[`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration)方法对于您的用例是否是一个可行的替代方案，因为该方法还为您提供了一个文件句柄，所以除了读取文件之外，您还可以回写文件。{% endAside %}

#### 选择您的放置区 {: #choose-drop-zone }

您的放置表面将取决于您的应用程序设计。您可能只希望将一部分窗口作为放置表面，也可能希望整个窗口都是放置表面。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="Squoosh（图像压缩网络应用程序）的截图。", width="800", height="589" %}<figcaption>Squoosh 将整个窗口设置成了放置区。</figcaption></figure>

Squoosh 允许用户将图像拖放到窗口的任意位置，而单击**选择图像**就会调用`<input type="file">`元素。无论您选择何种放置区，请确保能够让用户一目了然地知道他们可以将文件拖放到该表面。

#### 定义放置区 {: #define-drop-zone }

要想使一个元素成为拖放区，您需要侦听[`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)和[`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)这两个事件。`dragover`事件会更新浏览器用户界面，直观地表明拖放操作正在创建文件的副本。`drop`事件会在用户将文件放置到表面后触发。与输入元素类似，您可以从`event.dataTransfer.files`访问文件列表，该列表是一个[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList)对象。`FileList`中的每一项都是一个[`File`](https://developer.mozilla.org/docs/Web/API/File)对象。

```js
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // 将拖放作为"复制文件"的操作。
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
```

[`event.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)和[`event.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)会阻止浏览器的默认行为，并转而允许您的代码运行。如果没有这两条，浏览器就会离开您的页面，并打开用户放入浏览器窗口的文件。

{# 该示例不可以用作嵌入。 #}

请查看[自定义拖放](https://custom-drag-and-drop.glitch.me/)中的现场演示。

### 如何处理目录？ {: #directories }

很可惜，我们至今都还没找到访问目录的好方法。

`<input type="file">`元素上的[`webkitdirectory`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory)属性允许用户选择一个或多个目录。一些基于 Chromium 的浏览器支持这项功能，且桌面端 Safari 可能也支持该功能，但浏览器兼容性报告存在[冲突](https://caniuse.com/#search=webkitdirectory)。

{% Aside %}请检查[`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents)方法对于您的用例是否是一个可行的替代方案，因为该方法还为您提供了一个目录句柄，所以除了读取目录之外，您还可以回写目录。您可以使用这种方法进行 [polyfill](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories)。{% endAside %}

如果启用了拖放功能，用户可能会尝试将目录拖入放置区中。放置事件被触发时将包含该目录的一个`File`对象，但将无法访问目录中的任何文件。

## 读取文件元数据 {: #read-metadata }

[`File`](https://developer.mozilla.org/docs/Web/API/File)对象包含关于文件的许多元数据属性。大多数浏览器会提供文件名、文件大小和 MIME 类型，但因平台而异，不同浏览器可能会提供不同信息或附加信息。

```js
function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // iOS 版 Safari 浏览器不支持。
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // 安卓版 Firefox 浏览器及安卓版 Opera 浏览器不支持。
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // 跨浏览器支持情况未知。
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({file, name, type, size});
  }
}
```

您可以在[`input-type-file`](https://input-type-file.glitch.me/) Glitch 演示中看到实际运用。

## 读取文件内容 {: #read-content }

请使用[`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader)来读取文件，该函数使您能够将`File`对象的内容读入内存。您可以指示`FileReader`将文件读取为[数组缓冲区](https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer)、[数据 URL](https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL) 或[文本](https://developer.mozilla.org/docs/Web/API/FileReader/readAsText)。

```js
function readImage(file) {
  // 检查文件是否为图像。
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

上方示例中读取了用户提供的`File`，然后将其转换为数据 URL，并使用该数据 URL 在`img`元素中显示图像。请查看[`read-image-file`](https://read-image-file.glitch.me/) Glitch，了解如何验证用户是否选择了图像文件。

{% Glitch { id: 'read-image-file', height: 480 } %}

### 监控文件读取进度 {: #monitor-progress }

在读取大文件时，提供指示读取进度的用户体验可能会有所帮助。要实现这一点，请使用`FileReader`提供的[`progress`](https://developer.mozilla.org/docs/Web/API/FileReader/progress_event)事件。`progress`事件提供了两项属性，即`loaded`（已读取量）和`total`（需读取总量）。

```js/7-12
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // 对结果进行一些操作
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

首图作者：Vincent Botta（来自 [Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)）

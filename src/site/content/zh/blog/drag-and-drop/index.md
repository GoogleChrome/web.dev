---
title: 使用 HTML5 拖放 API
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2021-08-30
description: |-
  HTML5 拖放 (DnD) API 意味着页面上的几乎任何元素都可以变为可拖动。在本文中，我们将介绍
  拖放的基础知识。
tags:
  - blog
  - html
  - javascript
  - file-system
---

HTML5 拖放 (DnD) API 意味着页面上的几乎任何元素都可以变为可拖动。在本文中，我们将介绍拖放的基础知识。

## 创建可拖动的内容

值得注意的是，在大多数浏览器中，文本选择、图像和链接是默认可拖动的。例如，如果拖动[谷歌搜索](https://google.com)上的谷歌标志，您将看到重影图像。随后可以将该图像拖放到地址栏、 `<input type="file" />` 元素，甚至桌面上。要使其他类型的内容可拖动，您需要使用 HTML5 DnD API。

要使对象可拖动，请对该元素设置 `draggable=true`。几乎任何元素都可以支持拖动，包括图像、文件、链接、文件或页面上的任何标记。

在我们的示例中，我们将创建一个界面来重新排列一些列，它们已通过 CSS Grid 进行布局。这些列的基本标记如下所示，每个列的 `draggable` 属性均设置为 `true` 。

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

以下是我的容器和 box 元素的 CSS。请注意，唯一与 DnD 功能相关的 CSS 是 [`cursor: move`](https://developer.mozilla.org/docs/Web/CSS/cursor) 属性。其余代码仅控制容器和 box 元素的布局和样式。

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

此时，您会发现您可以拖动项目，但不会发生任何其他行为。要添加 DnD 功能，我们需要使用 JavaScript API。

## 监听拖动事件

可以附加许多不同的事件，以监视整个拖放过程。

- [`dragstart`](https://developer.mozilla.org/docs/Web/API/Document/dragstart_event)
- [`drag`](https://developer.mozilla.org/docs/Web/API/Document/drag_event)
- [`dragenter`](https://developer.mozilla.org/docs/Web/API/Document/dragenter_event)
- [`dragleave`](https://developer.mozilla.org/docs/Web/API/Document/dragleave_event)
- [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)
- [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)
- [`dragend`](https://developer.mozilla.org/docs/Web/API/Document/dragend_event)

要处理 DnD 流，您需要某种源元素（拖动的起点）、数据有效负载（您尝试放置的内容）和目标（捕捉放置的区域）。源元素可以是图像、列表、链接、文件对象、HTML 块等。目标是接受用户尝试放置的数据的放置区（或一组放置区）。请记住，并非所有元素都可以是目标，例如图像不能是目标。

## 开始和结束拖放序列

对内容定义 `draggable="true"` 属性后，附加一个 `dragstart` 事件处理程序针对每个列启动 DnD 序列。

此代码将在用户开始拖动时将列的不透明度设置为 40%，然后在拖动事件结束时将其恢复为 100%。

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
```

结果可以在下面的 Glitch 演示中看到。拖动一个项目，它会变得不透明。由于 `dragstart` 事件的目标是源元素，因此将 `this.style.opacity` 设置为 40% 会为用户提供视觉反馈，即当前选择的元素正在移动。放置项目后，虽然尚未编写放置功能，但源元素仍恢复为 100% 不透明度。

{% Glitch { id: 'simple-drag-and-drop-1', path: 'style.css' } %}

## 使用 `dragenter` 、`dragover` 和 `dragleave` 添加额外的视觉提示

为了帮助用户了解如何与您的界面交互，请使用 `dragenter` 、`dragover` 和`dragleave` 事件处理程序。在以下示例中，各个列除了可拖动，还是放置目标。为了帮助用户了解这一点，当用户拖动项目经过某个列时，该列的边框将变为虚线。例如，可以在 CSS 中创建一个 `over` 类来表示作为放置目标的元素：

```css
.box.over {
  border: 3px dotted #666;
}
```

然后，在 JavaScript 中设置事件处理程序，当拖动经过列时添加 `over` 类，在离开时将其删除。在 `dragend` 处理程序中，我们也要确保在拖动结束时删除该类。

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
```

{% Glitch { id: 'simple-drag-drop2', path: 'dnd.js' } %}

这段代码中有几点需要提一下：

- 在拖动链接之类的元素时，需要阻止浏览器的默认行为，即导航到该链接。为此，在 `dragover` 事件中调用 `e.preventDefault()`。另一个好的做法是在同一处理程序中返回 `false`。
- 使用 `dragenter` 事件处理程序切换 `over` 类，而不要使用 `dragover`。如果使用 `dragover`，CSS 类会被多次切换，因为事件 `dragover` 会在列悬停时不断触发。最终，这将导致浏览器的渲染器执行大量不必要的工作。最好始终将重绘保持在最低限度。如果因为某些原因需要使用 `dragover` 事件，请考虑[限制或去除事件监听器](https://css-tricks.com/debouncing-throttling-explained-examples/)。

## 完成放置

要处理实际放置，请为 `drop` 事件添加一个事件监听器。在 `drop` 处理程序中，您需要阻止浏览器的默认放置行为，这通常是某种恼人的重定向。可以调用 `e.stopPropagation()` 来防止事件触发 DOM。

```js
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  return false;
}
```

确保在其他处理程序中注册新的处理程序：

```js/7-7
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
```

如果此时运行代码，项目将不会放置到新位置。要实现这一点，需要使用 [`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer) 对象。

`dataTransfer` 属性是所有 DnD 奇迹发生的地方。它保存拖动操作中发送的数据片段。`dataTransfer` 在 `dragstart` 事件中设置，并在 drop 事件中被读取/处理。调用 `e.dataTransfer.setData(mimeType, dataPayload)` 可设置对象的 MIME 类型和数据有效负载。

在以下示例中，我们将允许用户重新排列各列的顺序。为此，首先您需要在拖动开始时存储源元素的 HTML：

  <figure>
    <video controls autoplay loop muted>
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </source></video>
  </figure>

```js/3-6
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
```

在 `drop` 事件中处理列放置，将源列的 HTML 设置为放置的目标列的 HTML，先检查用户拖放的目标列是否与源列相同。

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}
```

您可以在以下演示中看到结果。拖动 A 列并在 B 列上方释放，注意它们如何改变位置：

{% Glitch { id: 'simple-drag-drop', path: 'dnd.js' } %}

## 更多拖动属性

`dataTransfer` 对象公开了用于在拖动过程中向用户提供视觉反馈的属性。这些属性还可用于控制每个放置目标如何响应特定数据类型。

- [`dataTransfer.effectAllowed`](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed) 限制用户可以对元素执行的“拖动类型”。它在拖放处理模型中用于在 `dragenter` 和 `dragover` 事件期间初始化 `dropEffect`。该属性可以设置为以下值：`none`、`copy`、`copyLink`、`copyMove`、`link`、`linkMove`、`move`、`all` 和 `uninitialized`。
- [`dataTransfer.dropEffect`](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect) 控制在 `dragenter` 和 `dragover` 事件期间为用户提供的反馈。当用户在目标元素上悬停时，浏览器的光标将指示将要进行的操作类型（例如复制、移动等）。效果可以是以下值之一：`none`、`copy`、`link`、`move`。
- [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage) 表示不使用浏览器的默认“重影图像”反馈，而是可以选择设置拖动图标。

## 通过拖放上传文件

以下简单示例将一列用作拖动源和拖动目标。当用户被要求重新排列项目时，可能会在 UI 中看到这种情况。在某些情况下，拖动目标和拖动源可能不同，例如在一个界面中，用户需要选择一个图像作为产品的主图像，方法是将所选图像拖动到目标上。

拖放经常用于让用户将项目从桌面拖动到应用程序中。主要区别在于 `drop` 处理程序。不使用 `dataTransfer.getData()` 访问文件，文件的数据将包含在 `dataTransfer.files` 属性中：

```js
function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Read the File objects in this FileList.
  }
}
```

您可以在[自定义拖放](/read-files/#select-dnd)中找到更多相关信息。

## 更多资源

- [拖放规范](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
- [MDN HTML 拖放 API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
- [如何使用 Vanilla JavaScript 制作拖放文件上传器](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
- [使用 HTML 拖放 API 创建停车游戏](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
- [如何在 React 中使用 HTML 拖放 API](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)

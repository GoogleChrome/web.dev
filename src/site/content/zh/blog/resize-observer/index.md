---
title: ResizeObserver：就像元素的 document.onresize
subhead: "`ResizeObserver` 可告知元素大小何时发生变化。"
authors:
  - surma
  - joemedley
date: 2016-10-07
updated: 2020-05-26
hero: image/admin/WJ69aw9UMPwsc7ShYvif.jpg
alt: 盒子里生长的植物。
description: |2-

  `ResizeObserver` 在元素的 content rectangle 改变大小时发出通知，以便您做出相应的反应。
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

在`ResizeObserver`之前，必须将侦听器附加到文档的 `resize` 事件，以便 viewport 尺寸更改时得到通知。在事件处理程序中，必须确定哪些元素受到该更改的影响，并调用特定例程以做出适当的反应。如果在大小调整后需要元素的新尺寸，则必须调用 `getBoundingClientRect()` 或 `getComputedStyle()`，如果您不在乎批处理 *所有*读取和*所有*写入，则可能会导致布局抖动。

这甚至不包括窗口大小不变，元素调整自己大小的情况。例如，添加新子元素、将元素的 `display` 样式设置为 `none` 或类似操作可以更改元素、其同级或祖先的大小。

这就是为什么 `ResizeObserver` 是一个有用的基础。它对任何监听元素大小变化做出反应，与引起变化的原因无关。您可以通过它来访问监听元素的新大小。

## API

上述所有带 `Observer` 后缀的 API 都有一个简单的 API 设计。 `ResizeObserver` 也不例外。您创建一个 `ResizeObserver` 对象并将回调传递给构造函数。回调被传递一个 `ResizeObserverEntry` 对象数组（每个监听元素一项），其中包含元素的新尺寸。

```js
var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

// 监听一个或多个元素
ro.observe(someElement);
```

## 一些细节

### 报告哪些内容？

通常， [`ResizeObserverEntry` 通过一个名为](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry) `contentRect` 的属性报告元素的内容框，该属性返回一个 [`DOMRectReadOnly`](https://developer.mozilla.org/docs/Web/API/DOMRectReadOnly) 对象。内容框是可以放置内容的框，等于边框减去填充。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKxpe8LNq2CMPFdtLtVK.png", alt="CSS 框模型图。", width="727", height="562" %}</figure>

需要注意的是，虽然是 `ResizeObserver`*{nbsp}报告* `contentRect` 和填充的尺寸，但只*关注* `contentRect` 。*不要*将 `contentRect` 与元素的边界框混淆。 `getBoundingClientRect()` 报告的边界框是包含整个元素及其后代的框。SVG 不适用此规则，`ResizeObserver` 会报告边界框的尺寸。

从 Chrome 84 开始， `ResizeObserverEntry` 具有三个新属性来提供更详细的信息。这些属性中的每一个都返回一个 `ResizeObserverSize` 对象，其中包含一个 `blockSize` 属性和一个 `inlineSize` 属性。此信息与调用回调时监听的元素有关。

- `borderBoxSize`
- `contentBoxSize`
- `devicePixelContentBoxSize`

所有这些都返回只读数组，因为将来希望它们可以支持具有多个片段的元素，这些片段出现在多列场景中。目前，这些数组只包含一个元素。

支持这些属性的平台有限，但 [Firefox 已经支持](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility)前两个。

### 什么时候报告？

规范规定 `ResizeObserver` 应该在绘制之前和布局之后处理所有调整大小事件。这使得 `ResizeObserver` 的回调成为更改页面布局的理想场所。因为 `ResizeObserver` 处理发生在布局和绘制之间，这样做只会使布局无效，对绘制无影响。

### 明白了

您可能会问自己：如果我将回调中监听元素的大小更改为 `ResizeObserver` 会怎么样？答案是：将立即触发另一个回调调用。幸运的是， `ResizeObserver` 有一种机制可以避免无限回调循环和循环依赖。如果调整大小后的元素在 DOM 树中比前一个回调中处理的 *最浅*元素更深，则更改将仅在同一帧中处理。否则，将被推迟到下一帧。

## 应用

利用 `ResizeObserver` 可以实现每个元素的媒体查询。通过监听元素，可以强制定义设计断点并更改元素的样式。在以下[示例中](https://googlechrome.github.io/samples/resizeobserver/)，第二个框将根据其宽度更改边框半径。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_vp8.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_x264.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius =
        Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// 只监听第二个框
ro.observe(document.querySelector('.box:nth-child(2)'));
```

另一个有趣的例子是聊天窗口。在典型的从上到下的对话布局中出现的问题是滚动定位。为避免让用户感到困惑，最好将窗口贴在对话的底部，即最新消息出现的位置。此外，任何类型的布局更改（设想手机从横向变为纵向，反之亦然）都应该实现相同的效果。

利用 `ResizeObserver` 只需写*一*段代码，即可满足*两种*情况的需要。调整窗口大小是一个 `ResizeObserver` 可以根据定义捕获的事件，但调用 `appendChild()` 也会调整该元素的大小（除非设置了 `overflow: hidden` ），因为它需要为新元素腾出空间。考虑到这一点，只需很少的行就可以达到预期的效果：

<figure>
 <video controls autoplay loop muted>
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_vp8.webm" type="video/webm; codecs=vp8">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_x264.mp4" type="video/mp4; codecs=h264">
 </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  document.scrollingElement.scrollTop =
    document.scrollingElement.scrollHeight;
});

// 监听 scrollingElement 了解窗口大小何时改变
ro.observe(document.scrollingElement);
// 监听 timeline 以处理新消息
ro.observe(timeline);
```

很简洁吧？

在此基础上，我可以添加更多代码来处理用户手动向上滚动并希望在收到新消息时滚动到*那条*消息的情况。

另一个用例是针对任何类型的自定义元素进行自己的布局。在`ResizeObserver`之前，没有可靠的方法在其尺寸发生变化时获得通知，以便可以重新布置其子项。

## 结论

[大多数主流浏览器中](https://developer.mozilla.org/docs/Web/API/ResizeObserver#Browser_compatibility)都有 `ResizeObserver`。在某些情况下，最近才出现。有[一些 polyfill，](https://github.com/WICG/ResizeObserver/issues/3)但不可能完全复制 `ResizeObserver` 的功能。当前的实现要么依赖于轮询，要么依赖于向 DOM 添加 sentinel 元素。前者会通过让 CPU 始终繁忙而耗尽移动设备的电量，而后者会修改您的 DOM，并可能弄乱样式和其他依赖 DOM 的代码。

照片：[Markus Spiske](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)；来源：[Unsplash](https://unsplash.com/s/photos/observe-growth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)。

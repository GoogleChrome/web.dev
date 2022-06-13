---
title: 使用 Web Worker 在浏览器的主线程之外运行 JavaScript
subhead: 非主线程架构可以显著提高应用的可靠性和用户体验。
description: 浏览器的主线程超负荷工作。通过使用 Web Worker 将代码移出主线程，可以显著提高应用的可靠性和用户体验。
authors:
  - surma
date: 2019-12-05
tags:
  - blog
  - performance
  - test-post
---

过去的 20 年中，Web 已经从具有少量样式和图像的静态文档发展为复杂的动态应用。然而，有一点基本保持没变：每个浏览器选项卡只使用一个线程（有一些例外）来呈现网站并运行 JavaScript。

这样，主线程的工作负荷变得无比繁重。随着 Web 应用复杂性的增加，主线程成为性能的重要瓶颈。更糟糕的是，在给定用户的主线程上运行代码所需的时间**几乎完全不可预测**，因为设备功能对性能有巨大影响。这种不可预测性只会随着用户从越来越多样化的设备访问网络而增加，从超受限的功能手机到高性能、高刷新率的旗舰机器，无不如此。

如果我们希望复杂的 Web 应用能够可靠地满足性能准则，比如像 [RAIL 模型](/rail/)——它基于人类感知和心理经验数据，则我们需要采取**在主线程之外 (OMT)**执行代码的方法。

{% Aside %}如果您想了解更多有关 OMT 架构案例的信息，请观看我在下面的 CDS 2019 演讲。 {% endAside %}

{% YouTube '7Rrv9qFMWNM' %}

## 通过 Web Worker 实现线程处理

其他平台通常通过允许您为线程提供与程序的其余部分并行运行的函数来支持并行工作。您可以从两个线程访问相同的变量，并且可以使用互斥锁和信号量同步对这些共享资源进行访问，从而防止产生竞争条件。

在 JavaScript 中，我们可以从 Web Worker 获得大致相似的功能，这些功能自 2007 年以来一直存在，并且自 2012 年以来所有主要浏览器都支持。Web Worker 与主线程并行运行，但与 OS 线程不同的是，它们不能共享变量。

{% Aside %} 不要将 Web Worker 与[Service Worker](/service-workers-cache-storage)或 [Worklet](https://developer.mozilla.org/docs/Web/API/Worklet) 混淆。虽然名称相似，但功能和用途不同。 {% endAside %}

要创建 Web Worker，请将文件传递给 Worker 构造函数，则构造函数将开始在单独的线程中运行文件：

```js
const worker = new Worker("./worker.js");
```

可以通过 [`postMessage` API](https://developer.mozilla.org/docs/Web/API/Window/postMessage) 发送消息实现与 Web Worker 的通信。在 `postMessage` 调用中将消息值作为参数传递，然后向 Web Worker 添加消息事件侦听器：

<!--lint disable no-duplicate-headings-in-section-->

### `main.js`

```js/1
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
```

### `worker.js`

```js
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
});
```

要将消息发送回主线程，请在 Web Worker 中使用相同的 `postMessage` API 并在主线程上设置事件侦听器：

### `main.js`

```js/2-4
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
worker.addEventListener("message", event => {
  console.log(event.data);
});
```

### `worker.js`

```js/3
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
  postMessage(a+b);
});
```

诚然，这种方法有一定的局限性。从历史上看，Web Worker 主要用于将单个繁重的工作从主线程中移出。尝试使用单个 Web Worker 处理多个操作会很快变得笨拙：您不仅必须对消息中的参数进行编码，还必须对消息中的操作进行编码，并且必须进行簿记以匹配请求的响应。这种复杂性可能是 Web Worker 没有被更广泛采用的原因。

但是如果我们可以消除主线程和 Web Worker 之间通信的一些困难，这个模型可能非常适合许多用例。而且，幸运的是，有一个库可以做到这一点！

## Comlink：减少 Web Worker 的工作量

[Comlink](http://npm.im/comlink) 是一个库，其目标是让您使用 Web Worker 而无需考虑 `postMessage` 的细节。Comlink 允许您在 Web Worker 和主线程之间共享变量，就像其他支持线程的编程语言一样。

您可以通过将 Comlink 导入 Web Worker 并定义一组公开给主线程的函数来设置它。然后在主线程上导入 Comlink，包装 Web Worker，并访问公开的函数：

### `worker.js`

```js
import {expose} from "comlink";

const api = {
  someMethod() { /* … */ }
}
expose(api);
```

### `main.js`

```js
import {wrap} from "comlink";

const worker = new Worker("./worker.js");
const api = wrap(worker);
```

主线程上的 `api` 变量与 Web Worker 中的变量行为相同，不同之处在于每个函数为值返回一个承诺，而非值本身。

## 应该将哪些代码移至 Web Worker？

Web Worker 无权访问 DOM 和许多 API，例如 [WebUSB](https://developer.mozilla.org/docs/Web/API/USB)、[WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) 或 [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)，因此您不能将依赖于此类访问的应用部分放入 Web Worker 中。尽管如此，移动到 Worker 的每一小段代码都会在主线程上为*必须*的东西“购买”更多的空间，例如更新用户界面。

{% Aside %} 限制 UI 访问主线程实际上在其他语言中很常见。事实上，iOS 和 Android 都将主线程称为 *UI 线程*。 {% endAside %}

Web 开发人员面临的一个问题是，大多数 Web 应用依赖于像 Vue 或 React 这样的 UI 框架来编排应用中的所有内容；一切都是框架的组成部分，因此本质上与 DOM 相关联。这似乎使迁移到 OMT 架构变得困难。

但是，如果我们转向将 UI 关注点与其他关注点（例如状态管理）分开的模型，则 Web Worker 非常有用，即便对于基于框架的应用，情况也如此。这正是 PROXX 采用的方法。

## PROXX：OMT 案例研究

Google Chrome 团队开发了 [PROXX](/load-faster-like-proxx/) 作为满足[渐进式 Web 应用](https://developers.google.com/web/progressive-web-apps)要求的 Minesweeper 游戏克隆版，包括离线工作和具有吸引力的用户体验。不幸的是，该游戏的早期版本在功能手机等受限设备上表现不佳，这让团队意识到主线程是一个瓶颈。

团队决定使用 Web Worker 将游戏的视觉状态与其逻辑分开：

- 主线程处理动画和过渡的呈现。
- Web Worker 处理纯计算性的游戏逻辑。

{% Aside %} 这种方法类似于 Redux [Flux 模式](https://facebook.github.io/flux/)，因此许多 Flux 应用可能能够相当容易地迁移到 OMT 架构。查看[此博客文章](http://dassur.ma/things/react-redux-comlink/)，了解有关将 OMT 应用于 Redux 应用的更多信息。 {% endAside %}

OMT 对 PROXX 的功能手机性能产生了有趣的影响。在非 OMT 版本中，用户与其交互后 UI 会冻结 6 秒。没有反馈，用户必须等待整整六秒钟才能做其他事情。

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>PROXX 的<strong>非 OMT </strong>版本中的 UI 响应时间。</figcaption></figure>

在 OMT 版本中，游戏需要 *12* 秒才能完成 UI 更新。虽然这看起来像是一种性能损失，但它实际上会导致对用户的反馈增加。速度变慢是因为该应用比非 OMT 版本传送更多的帧，后者根本不传送任何帧。因此，用户知道正在发生的事情，可以在 UI 更新期间继续玩游戏，从而使游戏感觉更好。

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>PROXX 的 <strong>OMT</strong> 版本中的 UI 响应时间。</figcaption></figure>

这是一个有意识的权衡：我们在不惩罚高端设备用户的情况下，为受限设备的用户提供*感觉*更好的体验。

## OMT 架构的含义

正如 PROXX 示例所示，OMT 使您的应用在更广泛的设备上可靠运行，但不会使您的应用更快：

- 您只是从主线程中转移工作，而不是减少工作。
- Web Worker 和主线程之间的额外通信开销有时会使事情变慢。

### 考虑权衡

由于主线程可以在 JavaScript 运行时自由处理用户交互，例如滚动，因此即使总等待时间可能稍长，但丢帧会较少。让用户稍等片刻比丢帧更可取，因为丢帧的误差幅度较小：丢帧发生在几毫秒内，而在用户感知等待时间之前，您有*数百*毫秒的时间。

由于跨设备性能的不可预测性，OMT 架构的目标实际上是**降低风险——**使您的应用在面对高度可变的运行时条件时更加稳健——而不是并行化的性能优势。弹性的增加和用户体验的改进都值得在速度上做出任何小的折衷。

{% Aside %} 开发人员有时会担心在主线程和 Web Worker 之间复制复杂对象的成本。我在演讲中对这一方面有详细的说明。但总的来说，如果对象的字符串化 JSON 表示小于 10 KB，则不应超出性能预算。如果您需要复制更大的对象，请考虑使用 [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 或 [WebAssembly](https://webassembly.org/)。有关此问题的更多信息，请阅读[有关 `postMessage` 性能的博文](https://dassur.ma/things/is-postmessage-slow)。 {% endAside %}

### 关于工具的说明

Web Worker 尚未成为主流，因此大多数模块化工具 — 比如 [WebPack](https://webpack.js.org/)  和 [Rollup](https://github.com/rollup/rollup) — 不支持直接使用它们。（尽管 [Parcel](https://parceljs.org/) 支持）幸运的是，有一些插件可以让 Web Worker 与 WebPack 和 Rollup 一起*工作*：

- 用于 WebPack 的 [worker-plugin](https://github.com/GoogleChromeLabs/worker-plugin)
- 用于 Rollup 的 [rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread)

## 总结

为确保我们的应用尽可能可靠且易于访问，尤其是在日益全球化的市场中，我们需要支持受限设备——它们是全球大多数用户访问网络的方式。OMT 提供了一种有前途的方法来提高此类设备的性能，而不会对高端设备的用户产生不利影响。

此外，OMT 还有下列好处：

- 它将 JavaScript 执行成本转移到一个单独的线程。
- 它移动*解析*成本，这意味着 UI 可能会启动得更快。这可能会减少 [First Contentful Paint](/fcp/) 甚至 [Time to Interactive](/tti/) ，从而提高您的 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 分数。

Web Worker 无需担忧。Comlink 等工具正在减轻其工作，并使它们成为各种 Web 应用的可行选择。

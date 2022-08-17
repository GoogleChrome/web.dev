---
title: 优化 First Input Delay 首次输入延迟
subhead: 如何更快地响应用户交互。
authors:
  - houssein
  - addyosmani
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/WH0KlcJXJlxvsxU9ow2i.jpg
alt: 一只手触摸智能手机屏幕
description: 首次输入延迟 (FID) 测量从用户第一次与您的网站交互直到浏览器实际能够对交互作出响应的时间。了解如何通过最小化未使用的 JavaScript、分割长任务和改进交互准备来优化 FID。
tags:
  - blog
  - performance
  - web-vitals
---

<blockquote>
  <p>我明明点击了，却什么也没发生！为什么我无法与这个页面交互？😢</p>
</blockquote>

[First Contentful Paint 首次内容绘制](/fcp/) (FCP) 和[Largest Contentful Paint 最大内容绘制](/lcp/) (LCP) 都是测量内容在页面上完成视觉渲染（绘制）所需时间的指标。尽管这两项指标十分重要，但绘制时间并不能捕获*加载响应度*：或页面对用户交互的响应速度。

[首次输入延迟](/fid/) (FID) 是[核心 Web 指标](/vitals/)中的一项指标，可捕获用户对网站交互性和响应度的第一印象。该项指标测量从用户第一次与您的网站交互直到浏览器实际能够对交互作出响应的时间。FID 是一项[实际指标](/user-centric-performance-metrics/#in-the-field)，无法在实验室环境中进行模拟。该项指标需要**真实的用户交互**才能测量响应延迟。

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="好的fid 值为2.5 秒，差的值大于4.0 秒，中间的任何值都需要改进", width="384", height="96" %}
  </picture>

为了有助于在[实验室](/how-to-measure-speed/#lab-data-vs-field-data)中预测 FID，我们建议您测量[Total Blocking Time 总阻塞时间 (TBT)](/tbt/)。虽然这两项指标的测量内容不同，但 TBT 的改进通常能够带来 FID 的相应改进。

糟糕的 FID 主要是由**繁重的 JavaScript 执行**导致的。优化您网页上 JavaScript 的解析、编译和执行方式将直接降低 FID。

## 繁重的 JavaScript 执行

浏览器在主线程上执行 JavaScript 时无法对大多数用户输入作出响应。换句话说，当主线程繁忙时，浏览器无法响应用户交互。要想改善这一点：

- [分割长任务](#long-tasks)
- [优化您的页面，做好交互准备](#optimize-interaction-readiness)
- [使用 Web Worker](#use-a-web-worker)
- [减少 JavaScript 执行时间](#reduce-javascript-execution)

## 分割长任务 {: #long-tasks }

如果您已经尝试过减少在单个页面上加载的 JavaScript 数量，那么另一个可能会非常有用的做法是将长时间运行的代码拆解为**更小的异步任务**。

[**长任务**](/custom-metrics/#long-tasks-api)是 JavaScript 的执行期，这期间，用户可能会发现您的用户界面没有响应。任何阻塞主线程 50 毫秒或以上的代码都可以被称为长任务。长任务是潜在 JavaScript 膨胀的标志（加载和执行的内容超出用户现在可能需要的范围）。将长任务拆分可以减少您网站上的输入延迟。

<figure>
  {% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Chrome 开发者工具中的长任务", width="800", height="132" %}
  <figcaption> Chrome 开发者工具在性能面板中<a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">将长任务可视化</a></figcaption>
</figure>

当您采用类似代码分割和分割长任务这样的最佳实践后，FID 应该会得到显著改善。虽然 TBT 不是一项实际指标，但该指标对于查看 Time To Interactive 可交互时间 (TTI) 和 FID 的最终改进进度非常有用。

{% Aside %}如需了解更多信息，请查看[JavaScript 长任务是否会延迟您的可交互时间？](/long-tasks-devtools/)。{% endAside %}

## 优化您的页面，做好交互准备

对于高度依赖 JavaScript 的网络应用程序来说，导致 FID 和 TBT 分数较差的常见原因有很多：

### 第一方脚本执行会延迟交互准备

- JavaScript 体积膨胀、执行时间过长和分块效率低下会延迟页面对用户输入作出响应的时机，并影响 FID、TBT 和 TTI。渐进式加载代码和功能可以有助于分散工作量，改善交互准备。
- 服务端渲染的应用程序在屏幕上绘制像素的速度可能看起来很快，但需要注意用户交互被大型脚本执行（例如通过数据重构来连接事件侦听器）阻塞的情况。如果使用了基于路由的代码分割，这可能会花费数百毫秒，有时甚至是数秒。请考虑将更多逻辑转移到服务器端，或在构建期间静态生成更多内容。

以下是优化某应用程序的第一方脚本加载之前和之后的 TBT 分数。通过移除关键路径上消耗大量资源为非必要组件加载（和执行）的脚本，用户便能够更快地与页面进行交互。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEIbBnIAyfzIoQtvXvMk.png", alt="优化第一方脚本后，灯塔中 TBT 分数的改善。", width="800", height="148" %}

### 数据获取会影响交互准备的许多方面

- 等待一连串的级联获取（例如组件的 JavaScript 和数据获取）会影响交互延迟。请尽量最大限度地减少对级联数据获取的依赖。
- 大型内联数据存储会延长 HTML 解析时间并影响绘制和交互指标。请尽量最大限度地减少需要在客户端进行后处理的数据量。

### 第三方脚本执行也会加剧交互延迟

- 许多网站包括的第三方标签和分析会使网络一直处于忙碌状态，并使主线程周期性地无响应，从而影响交互延迟。请探究按需加载第三方代码的相关做法（例如，不要加载还未滚动到可视区域附近的非首屏广告）。
- 在某些情况下，第三方脚本会在主线程的优先级和带宽方面抢占第一方脚本，并延迟页面做好交互准备的时机。请尝试优先加载您认为可以为用户提供最大价值的内容。

## 使用 Web Worker

被阻塞的主线程是输入延迟的主要原因之一。[Web Worker](https://developer.mozilla.org/docs/Web/API/Worker)能够让 JavaScript 在后台线程上运行。将非用户界面操作移动到单独的工作线程上可以缩减主线程阻塞时间，从而改善 FID。

请考虑使用以下库来使您更轻松地在网站上使用 Web Worker：

- [Comlink](https://github.com/GoogleChromeLabs/comlink)：一个助手类库，该库抽象了`postMessage`，使其更易于使用
- [Workway](https://github.com/WebReflection/workway) : 一个通用的 Web Worker 导出器
- [Workerize](https://github.com/developit/workerize)：将模块移动到 Web Worker 中

{% Aside %}如需进一步了解 Web Worker 如何在主线程外执行代码，请参阅[使用 Web Worker 在浏览器主线程外运行 JavaScript](/off-main-thread/)。{% endAside %}

### 减少 JavaScript 执行时间 {: #reduce-javascript-execution }

限制页面上 JavaScript 的数量可以减少浏览器执行 JavaScript 代码所需的时间。这样能够使浏览器更迅速地开始对任何用户交互作出响应。

要想减少在页面上执行的 JavaScript 数量：

- 延迟加载未使用的 JavaScript
- 最大限度减少未使用的 polyfill

#### 延迟加载未使用的 JavaScript

默认情况下，所有 JavaScript 都是阻塞渲染的。当浏览器遇到链接到外部 JavaScript 文件的脚本标签时，就必须暂停正在执行的操作，转而下载、解析、编译和执行该 JavaScript。因此，您应该只加载页面所需的代码或响应用户输入所需的代码。

Chrome 开发者工具中的[代码覆盖率](https://developer.chrome.com/docs/devtools/coverage/)选项卡能够告诉您网页上有多少未在使用的 JavaScript。

{% Img src="image/admin/UNEigFiwsGu48rtXMZM4.png", alt="代码覆盖率选项卡。", width="800", height="559" %}

要想精简未使用的 JavaScript：

- 将您的资源包代码拆分为多个块
- 使用`async`或`defer`延迟加载任何非关键 JavaScript，包括第三方脚本

**代码分割**是将单个大型 JavaScript 包拆分为可以按需加载（也称懒加载）的多个小块的概念。[大多数较新的浏览器都支持动态导入语法](https://caniuse.com/#feat=es6-module-dynamic-import)，因此能够按需获取模块：

```js
import('module.js').then((module) => {
  // 对模块进行一些操作。
});
```

在进行某些用户交互（例如更改路由或显示模态框）时动态导入 JavaScript 将确保仅在需要时才获取初始页面加载中未使用的代码。

除了一般浏览器支持外，动态导入语法还可用于许多不同的构建系统。

- 如果您使用[webpack](https://webpack.js.org/guides/code-splitting/)、[Rollup](https://medium.com/rollup/rollup-now-has-code-splitting-and-we-need-your-help-46defd901c82)或[Parcel](https://parceljs.org/code_splitting.html)模块打包器，请多加利用这些工具的动态导入支持。
- [React](https://reactjs.org/docs/code-splitting.html#reactlazy)、[Angular](https://angular.io/guide/lazy-loading-ngmodules)和[Vue](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components)等客户端框架实现了抽象，使组件级的懒加载变得更加容易。

{% Aside %}请查看[使用代码分割减少 JavaScript 有效负载](/reduce-javascript-payloads-with-code-splitting/)，了解代码分割的更多相关信息。{% endAside %}

除了代码分割之外，请始终对关键路径或首屏内容不需要的脚本使用 [async 或 defer](https://javascript.info/script-async-defer)。

```html
<script defer src="…"></script>
<script async src="…"></script>
```

除非有特殊原因，否则所有第三方脚本在默认情况下都应该使用`defer`或`async`来加载。

#### 最大限度减少未使用的 polyfill

如果您使用现代 JavaScript 语法编写代码并参考现代浏览器 API，那么要使您的代码在旧版本浏览器中正常工作，您将需要对代码进行转译并包括 polyfill。

在您的网站中包括 polyfill 和转译代码会带来性能方面的一个主要担忧，即如果新版本浏览器不需要这些资源，则不必进行下载。要想精简您应用程序的 JavaScript 大小，请尽可能地减少未使用的 polyfill，并且只在需要它们的环境中进行使用。

如需优化您网站上的 polyfill 使用：

- 如果您在使用 [Babel](https://babeljs.io/docs/en/index.html) 转译器，请使用[`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env)来只将您计划定位的浏览器所需的 polyfill 包括在其中。对于 Babel 7.9，启用[`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes)选项来进一步精简任何不需要的 polyfill

- 使用模块/非模块模式来交付两个单独的资源包（`@babel/preset-env`也能够通过[`target.esmodules`](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)支持这一操作）

    ```html
    <script type="module" src="modern.js"></script>
    <script nomodule src="legacy.js" defer></script>
    ```

    许多使用 Babel 编译的较新的 ECMAScript 特性已经在支持 JavaScript 模块的环境中得到支持。因此，您可以通过这一做法对确保仅将转译代码用于实际有需要的浏览器的过程进行简化。

{% Aside %}[为现代浏览器提供现代代码来实现更快的页面加载速度](/serve-modern-code-to-modern-browsers/)指南对该主题展开了详细探讨。{% endAside %}

## 开发者工具

许多工具都可以用于测量和调试 FID：

- [灯塔 6.0](https://developer.chrome.com/docs/lighthouse/overview/) 不支持 FID，因为 FID 是一个实际指标。但是，可以用[总阻塞时间](/tbt/) (TBT) 作为代理。能够改进 TBT 的优化也应该能改进实际情况下的 FID。

    {% Img src="image/admin/FRM9kHWmsDv9dddGMgwu.jpg", alt="灯塔 6.0.", width="800", height="309" %}

- [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)提供在域级聚合下的真实 FID 值

*感谢 Philip Walton、Kayce Basques、Ilya Grigorik 和 Annie Sullivan 的审阅。*

---
layout: post
title: 使用 RAIL 模型衡量性能
description: 凭借 RAIL 模型，设计人员和开发人员能够可靠地将对用户体验影响最大的性能优化工作作为目标。了解 RAIL 模型设定了哪些目标和准则，以及您可以使用哪些工具来实现它们。
date: 2020-06-10
tags:
  - performance
  - animations
  - devtools
  - lighthouse
  - metrics
  - mobile
  - network
  - rendering
  - ux
---

**RAIL** 是一种以**用户为中心**的性能模型，它提供了一种考虑性能的结构。该模型将用户体验分解到按键操作（例如，点击、滚动、加载）中，帮助您为每个操作定义性能目标。

RAIL 代表 Web 应用生命周期的四个不同方面：响应、动画、空闲和加载。用户对这些上下文分别有不同的性能期望，因此，性能目标是根据上下文以及[用户如何感知延迟的用户体验研究](https://www.nngroup.com/articles/response-times-3-important-limits/)来定义的。

<figure>{% Img src="image/admin/uc1IWVOW2wEhIY6z4KjJ.png", alt="RAIL 性能模型的四个部分：响应、动画、空闲和加载。", width="800", height="290" %}<figcaption>RAIL 性能模型的四个部分</figcaption></figure>

## 以用户为中心

将用户作为性能工作的关键点。下表介绍了用户如何感知性能延迟的关键指标：

<table class="table-wrapper scrollbar">
  <thead>用户对性能延迟的看法</thead>
  <tr>
    <td>0 至 16 毫秒</td>
    <td>用户非常关注轨迹运动，他们不喜欢不流畅的动画。如果每秒渲染 60 个新帧，他们就认为动画很流畅。也就是说，每一帧只有 16 毫秒时间，这包括浏览器将新帧绘制到屏幕所需的时间，因而应用约有 10 毫秒的时间来生成一个帧。</td>
  </tr>
  <tr>
    <td>0 到 100 毫秒</td>
    <td>在此时间窗口内响应用户操作会让用户觉得结果是即时呈现的。如果时间更长，操作与用户反应之间的联系就会中断。</td>
  </tr>
  <tr>
    <td>100 到 1000 毫秒</td>
    <td>在此时间窗口内，用户会觉得任务进展基本上是自然连续的。对 Web 上的大多数用户来说，加载页面或更改视图是一项任务。</td>
  </tr>
  <tr>
    <td>1000 毫秒或更长</td>
    <td>超过 1000 毫秒（1 秒），用户的注意力就会从正在执行的任务上转移。</td>
  </tr>
  <tr>
    <td>10000 毫秒或更长</td>
    <td>超过 10000 毫秒（10 秒），用户会感到失望，并且可能放弃任务。他们以后可能会回来，也可能不会再回来。</td>
  </tr>
</table>

{% Aside %} 用户对性能延迟的感知有所不同，具体取决于网络条件和硬件。例如，通过快速 Wi-Fi 连接，在功能强大的台式机上加载站点时，通常只需不到 1 秒时间，用户已经习以为常。通过速度较慢的 3G 网络连接，在移动设备上加载站点则需要更长的时间，因此，移动用户通常会更有耐心。在移动设备上，5 秒钟内完成加载是更现实的目标。{% endAside %}

## 目标和准则

在 RAIL 的上下文中，术语**目标**和**准则**具有特定的含义：

- **目标**：与用户体验相关的关键性能指标。例如，点击即可在 100 毫秒内绘制。由于人类的感知相对一致，因此，这些目标不太可能很快发生改变。

- **准则**：帮助您实现目标的建议。这些准则可能特定于当前硬件和网络连接条件，因此可能会随着时间而改变。

## 响应：在 50 毫秒内处理事件

**目标**：在 100 毫秒内完成由用户输入发起的转换，让用户感觉交互是即时的。

**准则**：

- 为了确保在 100 毫秒内产生可见响应，需要在 50 毫秒内处理用户输入事件。这适用于大多数输入，例如点击按钮、切换表单控件或启动动画。但是，这不适用于触摸拖动或滚动。

- 尽管听起来可能有些自相矛盾，但是，即时响应用户输入并非总是正确的做法。您可以利用这 100 毫秒的时间窗口来执行其他需要消耗大量资源的工作，但是，注意不能妨碍用户。如果可能，应在后台工作。

- 对于需要 50 毫秒以上才能完成的操作，请随时提供反馈。

### 50 毫秒还是 100 毫秒？

目标是在 100 毫秒内响应输入，那么，为什么我们的预算只有 50 毫秒？这是因为除输入处理外，通常还有需要执行其他工作，而且这些工作会占用可接受输入响应的部分可用时间。如果应用程序在空闲时间以推荐的 50 毫秒区块执行工作，这就意味着，如果输入在这些工作区块之一中发生，它最多可能会排队 50 毫秒。考虑到这一点，假设只有剩余的 50 毫秒可用于实际输入处理才是安全地做法。下图展示了这种影响，图中显示了在空闲任务期间收到的输入如何排队，从而减少可用的处理时间：

<figure>{% Img src="image/admin/I7HDZ9qGxe0jAzz6PxNq.png", alt="显示空闲任务期间收到的输入如何排队，从而将可用输入处理时间减少到 50 毫秒的图表", width="800", height="400" %}<figcaption>空闲任务如何影响输入响应预算。</figcaption></figure>

## 动画：在 10 毫秒内生成一帧

**目标**：

- 在 10 毫秒或更短的时间内生成动画的每一帧。从技术上来讲，每帧的最大预算为 16 毫秒（1000 毫秒/每秒 60 帧≈16 毫秒），但是，浏览器需要大约 6 毫秒来渲染一帧，因此，准则为每帧 10 毫秒。

- 目标为流畅的视觉效果。用户会注意到帧速率的变化。

**准则**：

- 在动画之类对计算速度要求极高的场景下，关键在于即使可行，您也不能执行任何其他操作，让不能执行的操作保持绝对最少。只要可能，您就要利用这 100 毫秒的响应时间预先计算最消耗资源的工作，从而最大限度地提高达到 60 fps 的几率。

- 有关各种动画优化策略，请参阅[渲染性能](/rendering-performance/)。

{% Aside %} 识别所有类型的动画。动画不是花哨的 UI 效果。下面这些交互都是动画：

- 视觉动画，例如进入和退出，[补间](https://www.webopedia.com/TERM/T/tweening.html)和加载指示器。
- 滚动。这包括滑动，即用户开始滚动，然后松开，而页面会继续滚动。
- 拖放。动画通常遵循用户交互，例如平移地图或捏合缩放。 {% endAside %}

## 空闲：最大限度增加空闲时间

**目标**：最大限度增加空闲时间以提高页面在 50 毫秒内响应用户输入的几率。

**准则**：

- 利用空闲时间完成延缓的工作。例如，对于初始页面加载，应加载尽可能少的数据，然后利用[空闲时间](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)加载其余数据。

- 在 50 毫秒或更短的空闲时间内执行工作。如果时间更长，您可能会干扰应用在 50 毫秒内响应用户输入的能力。

- 如果用户在空闲时间工作期间与页面交互，则应中断空闲时间工作，用户交互始终具有最高优先级。

## 加载：在 5 秒内交付内容并实现可交互

当页面加载缓慢时，用户注意力会分散，他们会认为任务已中断。加载速度快的网站具有[更长的平均会话时间、更低的跳出率和更高的广告可见性](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)。

**目标**：

- 根据用户的设备和网络能力优化相关的快速加载性能。目前，对于首次加载，在使用速度较慢 3G 连接的中端移动设备上，理想的目标是在 [5 秒或更短的时间](/performance-budgets-101/#establish-a-baseline)内[实现可交互](/tti/)。

- 对于后续加载，理想的目标是在 2 秒内加载页面。

{% Aside %}

请注意，这些目标可能会随时间而改变。

{% endAside %}

**准则**：

- 在最常见的用户移动设备和网络连接上测试负载性能。您可以使用 [Chrome 用户体验报告](/chrome-ux-report/)来了解用户的[连接分布](/chrome-ux-report-data-studio-dashboard/#using-the-dashboard)。如果数据不适用于您的站点，[移动经济 2019](https://www.gsma.com/mobileeconomy/) 建议的理想全球标准是中端 Android 手机，例如 Moto G4 和速度较慢的 3G 网络（定义的 RTT 为 400 毫秒，传输速度为 400 kbps）。[WebPageTest](https://www.webpagetest.org/easy) 上提供了这一组合。

- 请记住，尽管您的典型移动用户的设备可能声称它使用的是 2G、3G 或 4G 连接，但实际上，由于数据包丢失和网络差异，[有效连接速度](/adaptive-serving-based-on-network-quality/#how-it-works)通常要慢得多。

- [消除阻塞渲染资源](/render-blocking-resources/)。

- 为了产生完整加载的感觉，您不必在 5 秒钟时间内加载所有内容。不妨考虑[延迟加载图像](/browser-level-image-lazy-loading/)、[代码拆分 JavaScript 包](/reduce-javascript-payloads-with-code-splitting/)以及 [web.dev 上建议的其他优化](/fast/)。

{% Aside %} 识别影响页面加载性能的因素：

- 网络速度和延迟
- 硬件（例如，速度较慢的 CPU）
- 缓存逐出
- L2/L3 缓存的差异
- 解析 JavaScript {% endAside %}

## 测量 RAIL 的工具

有一些工具可以帮助您自动执行 RAIL 测量。具体使用哪一种取决于您需要什么类型的信息，以及您喜欢什么类型的工作流程。

### Chrome DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/) 对加载或运行页面时发生的一切活动进行深入分析。请参阅[分析运行时性能入门](https://developer.chrome.com/docs/devtools/evaluate-performance/)，熟悉**性能**面板 UI。

以下 DevTools 功能密切相关：

- [限制 CPU 性能](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#cpu-throttle)来模拟功能较弱的设备。

- [限制网络速度](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network-throttle)来模拟速度较慢的连接。

- [查看主线程活动](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#main)，以查看记录时主线程上发生的每个事件。

- [查看表中的主线程活动](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#activities)，以根据活动占用的时间多少来对活动进行排序。

- [分析每秒帧数 (FPS)](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#fps) 以衡量您的动画能否真正流畅地运行。

- **使用性能监视器 (Performance Monitor)** 实时[监控 CPU 使用率、JS 堆大小、DOM 节点数、每秒布局数等](https://developers.google.com/web/updates/2017/11/devtools-release-notes#perf-monitor)。

- 使用**网络**部分[可视化](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network)记录时发生的网络请求。

- [在记录时捕获屏幕截图](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#screenshots)，以便准确回放加载页面时页面的外观，或触发的动画等。

- [查看交互](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#interactions)，以便快速识别用户与其交互后，页面上发生的情况。

- 通过在潜在问题侦听器触发时突出显示页面来[实时查找滚动性能问题](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#scrolling-performance-issues)。

- [实时查看绘制事件](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#paint-flashing)，以便识别可能损害动画性能的高资源消耗绘制事件。

### Lighthouse

[web.dev/measure](/measure/) 下的 Chrome DevTools 中以 Chrome 扩展和 Node.js 模块的形式提供了 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)，WebPageTest 中也提供了此工具。只要您提供一个 URL，它就会模拟使用速度较慢的 3G 连接的中端设备在页面上运行一系列审核，然后提供关于加载性能的报告以及如何改进的建议。

以下审核密切相关：

**响应**

- [最大首次输入延迟时间](/lighthouse-max-potential-fid/)。根据主线程空闲时间估算应用响应用户输入所需的时间。

- [不使用被动侦听器来提高滚动性能](/uses-passive-event-listeners/)。

- [总阻塞时间](/lighthouse-total-blocking-time/)。测量阻止页面响应用户输入（例如鼠标点击、屏幕点击或按键）的总时间。

- [交互时间](https://developers.google.com/web/tools/lighthouse/audits/consistently-interactive)。测量用户何时可以稳定地与所有页面元素进行交互。

**加载**

- [不要注册控制 page 和 start_url 的服务工作进程](/service-worker/)。服务工作进程可以缓存用户设备上的公共资源，从而减少通过网络获取资源所需的时间。

- [移动网络上的页面加载速度不够快](/load-fast-enough-for-pwa/)。

- [消除阻塞渲染的资源](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources)。

- [延迟处理屏幕外图像](/offscreen-images/)。推迟加载屏幕外的图像，在需要时才加载。

- [适当调整图像大小](/uses-responsive-images/)。不要提供明显大于移动视口中呈现的尺寸的图像。

- [避免链接关键请求](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)。

- [不要为其所有资源使用 HTTP/2](/uses-http2/) 。

- [对图像进行高效编码](/uses-optimized-images/)。

- [启用文本压缩](/uses-text-compression/)。

- [避免网络负载过大](/total-byte-weight/)。

- [避免 DOM 大小过大](https://developer.chrome.com/docs/lighthouse/performance/dom-size/)。通过仅传送呈现页面所需的 DOM 节点来减少网络字节数量。

### WebPageTest 网页性能测试工具

WebPageTest 是一款网页性能测试工具，它使用实际浏览器来访问网页并收集计时指标。在 [webpagetest.org/easy](https://webpagetest.org/easy) 上输入一个 URL，您可以获取在真实的 Moto G4 设备上使用速度较慢的 3G 连接时关于该页面的加载性能报告。您也可以将其配置为包含 Lighthouse 审核。

## 概述

RAIL 是一个将网站用户体验视为由不同交互组成的旅程的透镜。了解用户如何感知您的网站，从而设定对用户体验影响最大的性能目标。

- 以用户为中心。

- 在 100 毫秒内响应用户输入。

- 播放动画或执行滚动时，在 10 毫秒内生成一帧。

- 最大限度延长主线程空闲时间。

- 在 5000 毫秒内加载交互式内容。

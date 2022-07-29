---
layout: post
title: First Input Delay 首次输入延迟 (FID)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: 这篇文章介绍了首次输入延迟 (FID) 指标并说明了该指标的测量方式
tags:
  - performance
  - metrics
---

{% Aside %}首次输入延迟 (FID) 是测量[加载响应度](/user-centric-performance-metrics/#types-of-metrics)的一个以用户为中心的重要指标，因为该项指标将用户尝试与无响应页面进行交互时的体验进行了量化，低 FID 有助于让用户确信页面是[有效的](/user-centric-performance-metrics/#questions)。 {% endAside %}

我们都知道给人留下良好的第一印象是多么重要。这不仅对于结识新朋友十分重要，在网络上塑造体验时也同样重要。

在网络上，良好的第一印象能够决定人们会成为忠实用户，还是从此一去不回头。问题在于，什么样的体验能留下良好印象，而您又要如何衡量您给用户留下了怎样的印象？

在网络上，第一印象可以有很多不同的形式，我们会对网站的设计和视觉吸引力形成第一印象，也会对网站的速度和响应度形成第一印象。

虽然很难通过网页 API 来衡量用户对网站设计的喜爱程度，但网页 API 却可以轻松测量网站速度和响应度！

用户对您的网站加载速度的第一印象可以通过[First Contentful Paint 首次内容绘制 (FCP)](/fcp/)进行测量。但是，您的网站在屏幕上绘制像素的速度只是其中一部分，同样重要的还有当用户试图与这些像素进行交互时，您的网站响应度有多高！

首次输入延迟 (FID) 指标有助于衡量您的用户对网站交互性和响应度的第一印象。

## 什么是 FID？

FID 测量从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用由 JavaScript 驱动的自定义控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间。

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="好的 fid 值为 2.5 秒，差的值大于 4.0 秒，中间的任何值都需要改进", width="400", height="300" %}
</picture>

### 怎样算是良好的 FID 分数？

为了提供良好的用户体验，网站应该努力将首次输入延迟设控制在**100 毫秒**或以内。为了确保您能够在大部分用户的访问期间达成建议目标值，一个良好的测量阈值为页面加载的**第 75 个百分位数**，且该阈值同时适用于移动和桌面设备。

{% Aside %}如需详细了解这些建议值背后的研究和方法论，请参阅：[定义核心 Web 指标的指标阈值](/defining-core-web-vitals-thresholds/) {% endAside %}

## FID 详情

作为编写事件响应代码的开发者，我们通常会假定代码会在事件发生时立即运行。但作为用户，我们都常常面临相反的情况，当我们在手机上加载了一个网页并试图与网页交互，接着却因为网页没有任何反应而感到沮丧。

一般来说，发生输入延迟（又称输入延时）是因为浏览器的主线程正忙着执行其他工作，所以（还）不能响应用户。可能导致这种情况发生的一种常见原因是浏览器正忙于解析和执行由您的应用程序加载的大型 JavaScript 文件。在此过程中，浏览器不能运行任何事件侦听器，因为正在加载的 JavaScript 可能会让浏览器去执行其他工作。

{% Aside 'gotchas' %} FID 只测量事件处理过程中的"延迟"。FID 既不测量事件处理本身所花费的时间，也不测量浏览器在运行事件处理程序后更新用户界面所花费的时间。虽然这些时间确实会影响用户体验，但如果将其作为 FID 的一部分，则会激励开发者对事件进行异步响应，这么做虽然能够改善指标，但多半会使体验变得更糟糕。请参阅下方的[为什么只考虑输入延迟](#why-only-consider-the-input-delay)获取更多详情。 {% endAside %}

请看以下这条典型的网页加载时间轴：

{% Img src="image/admin/9tm3f6pwlHMqNKuFvaP0.svg", alt="示例页面加载跟踪", width="800", height="260", linkTo=true %}

上方的可视化图表中显示的是一个页面，该页面正在发出数个网络请求来获取资源（多为 CSS 和 JS 文件），这些资源下载完毕后，会在主线程上进行处理。

这就导致主线程会阶段性地处于忙碌状态（在图中表示为米黄色[任务](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task)块）。

较长的首次输入延迟通常发生在[首次内容绘制 (FCP)](/fcp/)和[Time to Interactive 可交互时间 (TTI)](/tti/)之间，因为在此期间，页面已经渲染出部分内容，但交互性还尚不可靠。为了说明这种情况的发生缘由，我们在时间轴中加入了 FCP 和 TTI：

{% Img src="image/admin/24Y3T5sWNuZD9fKhkuER.svg", alt="带有 FCP 和 TTI 的示例页面加载跟踪", width="800", height="340", linkTo=true %}

您可能已经注意到 FCP 和 TTI 之间有相当长的一段时间（包括三段[长任务](/custom-metrics/#long-tasks-api)），如果用户在这段时间内尝试与页面进行交互（例如单击一个链接），那么从浏览器接收到单击直至主线程能够响应之前就会有一段延迟。

请看如果用户在最长的任务刚开始时就尝试与页面进行交互会发生什么：

{% Img src="image/admin/krOoeuQ4TWCbt9t6v5Wf.svg", alt="带有 FCP、TTI 和 FID 的示例页面加载跟踪", width="800", height="380", linkTo=true %}

因为输入发生在浏览器正在运行任务的过程中，所以浏览器必须等到任务完成后才能对输入作出响应。浏览器必须等待的这段时间就是这位用户在该页面上体验到的 FID 值。

{% Aside %} 在这个示例中，用户恰好在主线程刚进入最繁忙的时段时与页面进行了交互。如果用户稍微提早一点（在空闲期间）与页面进行交互，那么浏览器就会立即响应。输入延迟上的这种差异强调了在报告指标时查看 FID 值分布的重要性。您可以阅读下方有关 FID 数据分析和报告的部分内容来了解更多相关信息。 {% endAside %}

### 如果交互没有事件侦听器怎么办？

FID 测量接收到输入事件的时间点与主线程下一次空闲的时间点之间的差值。这就意味着**即使在尚未注册事件侦听器的情况下，**FID 也会得到测量。这是因为许多用户交互的执行并不需要事件侦听器，但*一定*需要主线程处于空闲期。

例如，在对用户交互进行响应前，以下所有 HTML 元素都需要等待主线程上正在进行的任务完成运行：

- 文本字段、复选框和单选按钮 (`<input>` 、 `<textarea>`)
- 下拉选择列表（`<select>`）
- 链接 (`<a>`)

### 为什么只考虑首次输入？

虽然任何输入延迟都可能导致糟糕的用户体验，但我们主要建议您测量首次输入延迟，原因如下：

- 首次输入延迟将会是用户对您网站响应度的第一印象，而第一印象对于塑造我们对网站质量和可靠性的整体印象至关重要。
- 我们现如今在网络上看到的最大的交互性问题发生在页面加载期间。因此，我们认为首先侧重于改善网站的首次用户交互将对改善网络的整体交互性产生最大的影响。
- 我们推荐网站针对较高的首次输入延迟采取的解决方案（代码拆分、减少 JavaScript 的预先加载量等）不一定与针对页面加载后输入延迟缓慢的解决方案相同。通过分离这些指标，我们将能够为网页开发者提供更确切的性能指南。

### 哪些算是首次输入？

FID 是测量页面加载期间响应度的指标。因此，FID 只关注不连续操作对应的输入事件，如点击、轻触和按键。

其他诸如滚动和缩放之类的交互属于连续操作，具有完全不同的性能约束（而且，浏览器通常能够通过在单独的线程上执行这些操作来隐藏延迟）。

换句话说，FID 侧重于[RAIL 性能模型](/rail/)中的 R（响应度），而滚动和缩放与 A（动画）更为相关，因此这些操作的性能质量应该单独进行评估。

### 如果用户始终没有与您的网站进行交互怎么办？

并非所有用户都会在每次访问您的网站时进行交互。而且也并不是所有交互都与 FID 相关（如上一节所述）。此外，一些用户的首次交互会处于不利的时间段内（当主线程长时间处于繁忙时），而另一些用户的首次交互会处于有利的时间段内（当主线程完全空闲时）。

这意味着有些用户将没有 FID 值，有些用户的 FID 值较低，而有些用户的 FID 值可能较高。

您对 FID 的跟踪、报告和分析方式可能与您惯常使用的其他指标十分不同。下一节将说明相应的最佳做法。

### 为什么只考虑输入延迟？

如上所述，FID 只测量事件处理过程中的"延迟"。FID 既不测量事件处理本身所花费的时间，也不测量浏览器在运行事件处理程序后更新用户界面所花费的时间。

虽然这些时间对用户来说非常重要，也*确实*会影响用户体验，但这些时间并不包括在该项指标内，因为这样的做法可能会激励开发者加入变通方案，并因此导致体验变得更加糟糕，这里的意思是说，开发者可以将事件处理程序逻辑封装在一个异步回调中（通过`setTimeout()`或`requestAnimationFrame()`），从而将逻辑与事件关联的任务分离。最终的结果虽然能够提升指标分数，但会使用户感知到的响应速度变慢。

不过，虽然 FID 只测量事件延时的"延迟"部分，但想要对事件生命周期进行更多跟踪的开发者可以使用[事件计时 API](https://wicg.github.io/event-timing/)来实现这一想法。如需更多详情，请参阅[自定义指标](/custom-metrics/#event-timing-api)的相关指导。

## 如何测量 FID

FID 是一个只能进行[实际](/user-centric-performance-metrics/#in-the-field)测量的指标，因为该项指标需要真实用户与您的页面进行交互。您可以使用以下工具测量 FID。

{% Aside %} FID 需要真实用户，因此无法在实验室中进行测量。但是，[Total Blocking Time 总阻塞时间 (TBT)](/tbt/)指标不仅可以进行实验室测量，还与实际的 FID 关联性强，而且可以捕获影响交互性的问题。能够在实验室中改进 TBT 的优化也应该能为您的用户改进 FID。 {% endAside %}

### 实测工具

- [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights 网页速度测量工具](https://pagespeed.web.dev/)
- [搜索控制台（核心 Web 指标报告）](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)

### 在 JavaScript 中测量 FID

要在 JavaScript 中测量 FID，您可以使用[事件计时 API](https://wicg.github.io/event-timing)。以下示例说明了如何创建一个[`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)来侦听[`first-input`](https://wicg.github.io/event-timing/#sec-performance-event-timing)条目并记录在控制台中：

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});
```

{% Aside 'warning' %} 上述代码说明了如何将`first-input`条目记录在控制台中并计算延迟。但是，在 JavaScript 中测量 FID 要更为复杂。详情请见下文：{% endAside %}

在上方的示例中，`first-input`条目的延迟值是通过获取条目的`startTime`和`processingStart`时间戳之间的差值来测量的。在大多数情况下，这个差值就是 FID 值，然而，并非所有`first-input`条目都能够用来测量 FID。

以下部分列出了 API 报告的内容与指标计算方式之间的差异。

#### 指标和 API 之间的差异

- API 会为在后台选项卡中加载的页面分发`first-input`条目，但在计算 FID 时应忽略这些页面。
- 如果页面在首次输入发生前转移到后台，API 也会分发`first-input`条目，但在计算 FID 时仍应忽略这些页面（只有当页面始终处于前台时才考虑输入）。
- 当页面通过[往返缓存](/bfcache/#impact-on-core-web-vitals)恢复时，API 不会报告`first-input`条目，但在这些情况下应该测量 FID，因为这对用户来说是多次不同的页面访问体验。
- API 不会报告 iframe 中的输入，但要想正确测量 FID，您应该考虑这些输入。子框架可以使用 API 将这些输入的`first-input`条目报告给父框架来进行聚合。

开发者不必记住所有这些细微差异，而是可以使用[`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)来测量 FID，库会自行处理这些差异（在可能的情况下）：

```js
import {getFID} from 'web-vitals';

// 当 FID 可用时立即进行测量和记录。
getFID(console.log);
```

您可以参考[`getFID)`的源代码](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts)，了解如何在 JavaScript 中测量 FID 的完整示例。

{% Aside %}在某些情况下（例如跨域 iframe），FID 无法在 JavaScript 中进行测量。详情请参阅`web-vitals`库的[局限性](https://github.com/GoogleChrome/web-vitals#limitations)部分。 {% endAside %}

### 分析和报告 FID 数据

由于 FID 值的预期差异，您必须在报告 FID 时查看值的分布并关注较高的百分位数，这一点至关重要。

虽然所有核心 Web 指标阈值的[优选百分位数](/defining-core-web-vitals-thresholds/#choice-of-percentile)是第 75 个百分位数，但具体到 FID，我们仍然强烈建议您将阈值设置在第 95-99 个百分位数，因为这些百分位数对应于用户在您网站上经历的特别糟糕的首次体验，因而也能够让您获知最需要进行改进的地方。

即使您按设备类别或类型对报告进行细分，也应该这样做。例如，如果您分别对桌面端和移动端进行报告，那么您最应该关注的桌面端 FID 值应该是桌面端用户的第 95-99 个百分位数，而您最应该关注的移动端 FID 值应该是移动端用户的第 95-99 个百分位数。

## 如何改进 FID

要了解如何改进某个特定网站的 FID，您可以运行一次灯塔性能审计，并留心查看审计建议的各种具体[机会](/lighthouse-performance/#opportunities)。

虽然 FID 是一项实际指标（而灯塔是一个实验室指标工具），但改进 FID 的指导方向与改进[总阻塞时间 (TBT)](/tbt/)这项实验室指标的指导方向相同。

如需深入了解如何改进 FID，请参阅[优化 FID](/optimize-fid/)。有关其他能够改进 FID 的单个性能技巧的进一步指导，请参阅：

- [减少第三方代码的影响](/third-party-summary/)
- [减少 JavaScript 执行时间](/bootup-time/)
- [最小化主线程工作](/mainthread-work-breakdown/)
- [保持较低的请求数和较小的传输大小](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}

---
layout: post
title: Largest Contentful Paint 最大内容绘制 (LCP)
authors:
  - philipwalton
date: 2019-08-08
updated: 2022-07-18
description: 本篇文章介绍了最大内容绘制 (LCP) 指标并说明了该指标的测量方式
tags:
  - performance
  - metrics
---

{% Aside %}最大内容绘制 (LCP) 是测量[感知加载速度](/user-centric-performance-metrics/#types-of-metrics)的一个以用户为中心的重要指标，因为该项指标会在页面的主要内容基本加载完成时，在页面加载时间轴中标记出相应的点，迅捷的 LCP 有助于让用户确信页面是[有效的](/user-centric-performance-metrics/#questions)。 {% endAside %}

长久以来，对于网页开发者来说，测量网页主要内容的加载速度和内容对用户的显示速度一直是一个挑战。

诸如[load（加载）](https://developer.mozilla.org/docs/Web/Events/load)或[DOMContentLoaded（DOM 内容加载完毕）](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded)这样的旧有指标并不是很好，因为这些指标不一定与用户在屏幕上看到的内容相对应。而像[First Contentful Paint 首次内容绘制 (FCP)](/fcp/)这类以用户为中心的较新性能指标只会捕获加载体验最开始的部分。如果某个页面显示的是一段启动画面或加载指示，那么这些时刻与用户的关联性并不大。

我们以往推荐过一些性能指标，例如[First Meaningful Paint 首次有效绘制 (FMP)](/first-meaningful-paint/)和[Speed Index 速度指数 (SI)](/speed-index/) （两个指标都包含在灯塔工具中），这些指标有助于捕获到更多初始绘制后的加载体验，但这些指标十分复杂、难以解释，而且常常出错，也就意味着这些指标仍然无法识别出页面主要内容加载完毕的时间点。

有时候简胜于繁。根据[W3C Web 性能工作组](https://www.w3.org/webperf/)的讨论以及 Google 进行的研究，我们发现更准确地测量页面主要内容加载完毕的时间点的方法是查看最大元素完成渲染的时间点。

## 什么是 LCP？

最大内容绘制 (LCP) 指标会根据页面[首次开始加载](https://w3c.github.io/hr-time/#timeorigin-attribute)的时间点来报告可视区域内可见的最大[图像或文本块](#what-elements-are-considered)完成渲染的相对时间。

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/8ZW8LQsagLih1ZZoOmMR.svg", alt="良好的 LCP 值为 2.5 秒，较差的值大于 4.0 秒，两者之间的任何东西都需要改进", width="400", height="300" %}
</picture>

### 怎样算是良好的 LCP 分数？

为了提供良好的用户体验，网站应该努力将最大内容绘制控制在**2.5 秒**或以内。为了确保您能够在大部分用户的访问期间达成建议目标值，一个良好的测量阈值为页面加载的**第 75 个百分位数**，且该阈值同时适用于移动和桌面设备。

{% Aside %}如需详细了解这些建议值背后的研究和方法论，请参阅：[定义核心 Web 指标的指标阈值](/defining-core-web-vitals-thresholds/) {% endAside %}

### 哪些元素在考量范围内？

根据当前[最大内容绘制 API](https://wicg.github.io/largest-contentful-paint/)中的规定，最大内容绘制考量的元素类型为：

- `<img>`元素
- 内嵌在`<svg>`元素内的`<image>`元素
- `<video>`元素（使用封面图像）
- 通过[`url()`](https://developer.mozilla.org/docs/Web/CSS/url())函数（而非使用[CSS 渐变](https://developer.mozilla.org/docs/Web/CSS/CSS_Images/Using_CSS_gradients)）加载的带有背景图像的元素
- 包含文本节点或其他行内级文本元素子元素的[块级元素](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements)。

请注意，为了在初始阶段保持简洁，我们有意将元素限制在这几个有限的类型中。随着研究的深入，未来可能会添加其他元素（例如`<svg>` 、 `<video>`）。

### 如何确定一个元素的大小？

报告给最大内容绘制的元素大小通常是用户在可视区域内可见的大小。如果有元素延伸到可视区域之外，或者任何元素被剪裁或包含不可见的[溢出](https://developer.mozilla.org/docs/Web/CSS/overflow)，则这些部分不计入元素大小。

对于在[原始尺寸](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size)之上经过调整的图像元素，报告给指标的元素大小为可见尺寸或原始尺寸，以尺寸较小者为准。例如，远小于其原始尺寸的缩小图像将仅报告图像的显示尺寸，而拉伸或放大成更大尺寸的图像将仅报告图像的原始尺寸。

对于文本元素，指标仅考量其文本节点的大小（包含所有文本节点的最小矩形）。

对于所有元素，通过 CSS 设置的任何边距、填充或边框都不在考量范围内。

{% Aside %} 确定哪些文本节点属于哪些元素有时会很棘手，尤其是对于子元素既包括行内元素和纯文本节点，又包括块级元素的一部分元素。关键点在于每个文本节点都属于（且仅属于）其最近的块级祖先元素。用[规范术语](https://wicg.github.io/element-timing/#set-of-owned-text-nodes)来解释：每个文本节点都属于生成其[包含块](https://developer.mozilla.org/docs/Web/CSS/Containing_block)的对应元素。 {% endAside %}

### 何时报告最大内容绘制？

网页通常是分阶段加载的，因此，页面上的最大元素也可能会发生变化。

为了应对这种潜在的变化，浏览器会在绘制第一帧后立即分发一个`largest-contentful-paint`类型的[`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry)，用于识别最大内容元素。但是，在渲染后续帧之后，浏览器会在最大内容元素发生变化时分发另一个[`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry)。

例如，在一个带有文本和首图的网页上，浏览器最初可能只渲染文本部分，并在此期间分发一个`largest-contentful-paint`条目，其`element`属性通常会引用一个`<p>`或`<h1>` 。随后，一旦首图完成加载，浏览器就会分发第二个`largest-contentful-paint`条目，其`element`属性将引用`<img>` 。

需要注意的是，一个元素只有在渲染完成并且对用户可见后才能被视为最大内容元素。尚未加载的图像不会被视为"渲染完成"。 在[字体阻塞期](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#The_font_display_timeline)使用网页字体的文本节点亦是如此。在这种情况下，较小的元素可能会被报告为最大内容元素，但一旦更大的元素完成渲染，就会通过另一个`PerformanceEntry`对象进行报告。

除了延迟加载图像和字体之外，页面可能会在新内容可用时向 DOM 添加新元素。如果有任意一个新元素大于先前的最大内容元素，则浏览器还将报告一个新的`PerformanceEntry`。

如果当前的最大内容元素从可视区域被移除（甚至从 DOM 中被移除），那么除非有一个更大的元素完成渲染，否则该元素将持续作为最大内容元素。

{% Aside %} 在 Chrome 88 之前，已移除的元素不会被视为最大内容元素，而移除当前候选对象时会触发浏览器分发一个新的`largest-contentful-paint`条目。但是，该项指标已经针对流行的用户界面模式（例如经常将 DOM 元素移除的图像轮播）进行了更新，进而更准确地反映用户体验。请参阅[更新日志](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md) ，了解更多详情。{% endAside %}

当用户与页面进行交互（通过轻触、滚动或按键）时，浏览器将立刻停止报告新条目，因为用户交互通常会改变用户可见的内容（滚动操作时尤其如此）。

出于分析目的，您应该仅向您的分析服务报告最近一次分发的`PerformanceEntry`。

{% Aside 'caution' %}由于用户可以在后台选项卡中打开页面，而用户聚焦该选项卡的时间点可能远远晚于第一次加载页面的时间点，因此在用户聚焦该选项卡之前可能不会进行最大内容绘制。 {% endAside %}

#### 加载时间 vs. 渲染时间

出于安全考虑，对于缺少[`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin)标头的跨域图像来说，图像的渲染时间戳不会得到公开。相反，只有图像的加载时间会得到公开（因为加载时间已经通过其他许多网页 API 得到了公开）。

下方的[使用示例](#measure-lcp-in-javascript)说明了如何处理渲染时间不可用的元素。但是，我们始终建议您在可能的情况下设置好[`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin)标头，从而使您的指标更加准确。

### 如何处理元素布局和元素大小更改？

为了使计算和分发新性能条目的性能开销保持较低的水平，对元素大小或位置的更改不会生成新的 LCP 候选对象。只有元素在可视区域内的初始大小和位置会被纳入考量范围。

也就是说，最初在屏幕外完成渲染，然后过渡到屏幕上的图像可能不会得到报告。这也意味着最初在可视区域内进行渲染，然后被推出可视区域外的元素仍将报告其在可视区域内的初始大小。

### 示例

以下示例展示了一些热门网站上出现最大内容绘制的时间点：

{% Img src="image/admin/bsBm8poY1uQbq7mNvVJm.png", alt="来自 cnn.com 的最大内容绘制时间轴", width="800", height="311" %}

{% Img src="image/admin/xAvLL1u2KFRaqoZZiI71.png", alt="来自 techcrunch.com 的最大内容绘制时间轴", width="800", height="311" %}

在上方的两个时间轴中，最大元素随内容加载而变化。在第一个示例中，新内容被添加进 DOM，并因此使最大元素发生了改变。在第二个示例中，由于布局的改变，先前的最大内容从可视区域中被移除。

虽然延迟加载的内容通常比页面上已有的内容更大，但实际情况并非一定如此。接下来的两个示例显示了在页面完全加载之前出现的最大内容绘制。

{% Img src="image/admin/uJAGswhXK3bE6Vs4I5bP.png", alt="来自 instagram.com 的最大内容绘制时间轴", width="800", height="311" %}

{% Img src="image/admin/e0O2woQjZJ92aYlPOJzT.png", alt="来自 google.com 的最大内容绘制时间轴", width="800", height="311" %}

在第一个示例中，Instagram 标志加载得相对较早，即使其他内容随后陆续显示，但标志始终是最大元素。在 Google 搜索结果页面示例中，最大元素是一段文本，这段文本在所有图像或标志完成加载之前就显示了出来。由于所有单个图像都小于这段文字，因此这段文字在整个加载过程中始终是最大元素。

{% Aside %} 在 Instagram 时间轴的第一帧中，您可能注意到了相机标志的周围没有用绿框框出。这是因为该标志是一个`<svg>`元素，而`<svg>`元素目前不被视为 LCP 候选对象。首个 LCP 候选对象是第二帧中的文本。 {% endAside %}

## 如何测量 LCP

LCP 可以进行[实验室](/user-centric-performance-metrics/#in-the-lab)测量或[实际](/user-centric-performance-metrics/#in-the-field)测量，并且可以在以下工具中使用：

### 实测工具

- [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights 网页速度测量工具](https://pagespeed.web.dev/)
- [搜索控制台（核心 Web 指标报告）](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)

### 实验室工具

- [Chrome 开发者工具](https://developer.chrome.com/docs/devtools/)
- [灯塔](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest 网页性能测试工具](https://webpagetest.org/)

### 在 JavaScript 中测量 LCP

要在 JavaScript 中测量 LCP，您可以使用[最大内容绘制 API](https://wicg.github.io/largest-contentful-paint/) 。以下示例说明了如何创建一个[`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)来侦听`largest-contentful-paint`条目并记录在控制台中。

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

{% Aside 'warning' %}

上述代码说明了如何将`largest-contentful-paint`条目记录在控制台中，但在 JavaScript 中测量 LCP 要更为复杂。详情请见下文：

{% endAside %}

在上方的示例中，每条记录在案的`largest-contentful-paint`条目代表当前的 LCP 候选对象。通常情况下，最近条目发射的`startTime`值就是 LCP 值，但情况并非总是如此。并不是所有的`largest-contentful-paint`条目都能够用来测量 LCP。

以下部分列出了 API 报告的内容与指标计算方式之间的差异。

#### 指标和 API 之间的差异

- API 会为在后台选项卡中加载的页面分发`largest-contentful-paint`条目，但在计算 LCP 时应忽略这些页面。
- API 在页面转移到后台后，会继续分发`largest-contentful-paint`条目，但在计算 LCP 时应忽略这些条目（只有当页面始终处于前台时才考虑元素）。
- 当页面通过[往返缓存](/bfcache/#impact-on-core-web-vitals)恢复时，API 不会报告`largest-contentful-paint`条目，但在这些情况下应该测量 LCP，因为这对用户来说是多次不同的页面访问体验。
- API 不考虑 iframe 中的元素，但要想正确测量 LCP，您应该考虑这些元素。子框架可以使用 API 将这些元素的`largest-contentful-paint`条目报告给父框架来进行聚合。

开发者不必记住所有这些细微差异，而是可以使用[`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)来测量 LCP，库会自行处理这些差异（在可能的情况下）：

```js
import {getLCP} from 'web-vitals';

// 当 LCP 可用时立即进行测量和记录。
getLCP(console.log);
```

您可以参考[`getLCP()`的源代码](https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts)，了解如何在 JavaScript 中测量 LCP 的完整示例。

{% Aside %}在某些情况下（例如跨域 iframe），LCP 无法在 JavaScript 中进行测量。详情请参阅`web-vitals`库的[局限性](https://github.com/GoogleChrome/web-vitals#limitations)部分。 {% endAside %}

### 如果最大元素并非最重要元素该怎么办？

在某些情况下，页面上最重要的元素（或多个元素）并不是最大元素，而开发者可能更有兴趣测量前者的渲染时间。这时候可以使用[元素计时 API](https://wicg.github.io/element-timing/)来实现，该 API 在关于[自定义指标](/custom-metrics/#element-timing-api)的文章中有所描述。

## 如何改进 LCP

LCP 主要受四个因素影响：

- 缓慢的服务器响应速度
- JavaScript 和 CSS 渲染阻塞
- 资源加载时间
- 客户端渲染

如需深入了解如何改进 LCP，请参阅[优化 LCP](/optimize-lcp/)。有关其他能够改进 LCP 的单个性能技巧的进一步指导，请参阅：

- [使用 PRPL 模式做到即时加载](/apply-instant-loading-with-prpl)
- [优化关键渲染路径](/critical-rendering-path/)
- [优化您的 CSS](/fast#optimize-your-css)
- [优化您的图像](/fast#optimize-your-images)
- [优化网页字体](/fast#optimize-web-fonts)
- [优化您的 JavaScript](/fast#optimize-your-javascript)（针对客户端渲染的网站）

## 其他资源

- [安妮·沙利文 (Annie Sullivan)](https://perfnow.nl/)在[performance.now()](https://youtu.be/ctavZT87syI)上发表的演讲：[《从 Chrome 的性能监测工具中吸取的教训》](https://anniesullie.com/)(2019)

{% include 'content/metrics/metrics-changelog.njk' %}

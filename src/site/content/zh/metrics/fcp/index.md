---
layout: post
title: First Contentful Paint 首次内容绘制 (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: 本篇文章介绍了首次内容绘制 (FCP) 指标并说明了该指标的测量方式
tags:
  - performance
  - metrics
---

{% Aside %}首次内容绘制 (FCP) 是测量[感知加载速度](/user-centric-performance-metrics/#types-of-metrics)的一个以用户为中心的重要指标，因为该项指标会在用户首次在屏幕上看到任何内容时，在页面加载时间轴中标记出相应的点，迅捷的 FCP 有助于让用户确信某些事情正在[进行](/user-centric-performance-metrics/#questions)。{% endAside %}

## 什么是 FCP？

首次内容绘制 (FCP) 指标测量页面从开始加载到页面内容的任何部分在屏幕上完成渲染的时间。对于该指标，"内容"指的是文本、图像（包括背景图像）、`<svg>`元素或非白色的`<canvas>`元素。

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="来自 google.com 的 FCP 时间轴", width="800", height="311", linkTo=true %}

在上方的加载时间轴中，FCP 发生在第二帧，因为那是首批文本和图像元素在屏幕上完成渲染的时间点。

您会注意到，虽然部分内容已完成渲染，但并非所有内容都已经完成渲染。这是*首次*内容绘制 (FCP) 与*[Largest Contentful Paint 最大内容绘制 (LCP)](/lcp/)*（旨在测量页面的主要内容何时完成加载）之间的重要区别。

<picture>
  <source srcset="{{ "image/eqprBhZUGfb8WYnumQ9ljAxRrA72/V1mtKJenViYAhn05WxqR.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vQKpz0S2SGnnoXHMDidj.svg", alt="良好的 FCP 值是 1.8 秒或更短，差的值大于 3.0 秒，中间的任何东西都需要改进", width="400", height="300" %}
</picture>

### 怎样算是良好的 FCP 分数？

为了提供良好的用户体验，网站应该努力将首次内容绘制控制在**1.8 秒**或以内。为了确保您能够在大部分用户的访问期间达成建议目标值，一个良好的测量阈值为页面加载的**第 75 个百分位数**，且该阈值同时适用于移动和桌面设备。

## 如何测量 FCP

FCP 可以进行[实验室](/user-centric-performance-metrics/#in-the-lab)测量或[实际](/user-centric-performance-metrics/#in-the-field)测量，并且可以在以下工具中使用：

### 实测工具

- [PageSpeed Insights 网页速度测量工具](https://pagespeed.web.dev/)
- [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)
- [搜索控制台（速度报告](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)

### 实验室工具

- [灯塔](https://developer.chrome.com/docs/lighthouse/overview/)
- [Chrome 开发者工具](https://developer.chrome.com/docs/devtools/)
- [PageSpeed Insights 网页速度测量工具](https://pagespeed.web.dev/)

### 在 JavaScript 中测量 FCP

要在 JavaScript 中测量 FCP，您可以使用[绘制计时 API](https://w3c.github.io/paint-timing/)。以下示例说明了如何创建一个[`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)来侦听名称为`first-contentful-paint`的`paint`条目并记录在控制台中。

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

上述代码说明了如何将`first-contentful-paint`条目记录在控制台中，但在 JavaScript 中测量 FCP 要更为复杂。详情请见下文：

{% endAside %}

在上方的示例中，已记录的`first-contentful-paint`条目会告诉您首个内容元素的绘制时间点。但在某些情况下，该条目并不能够用来测量 FCP。

以下部分列出了 API 报告的内容与指标计算方式之间的差异。

#### 指标和 API 之间的差异

- API 会为在后台选项卡中加载的页面分发`first-contentful-paint`条目，但在计算 FCP 时应忽略这些页面（只有当页面始终处于前台时才应考虑首次绘制的时机）。
- 当页面通过[往返缓存](/bfcache/#impact-on-core-web-vitals)恢复时，API 不会报告`first-contentful-paint`条目，但在这些情况下应该测量 FCP，因为这对用户来说是多次不同的页面访问体验。
- API [可能不会报告跨域 iframe 中的绘制时机](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes)，但要想正确测量 FCP，您应该考虑所有框架的情况。子框架可以使用 API 将这些框架的绘制时机报告给父框架来进行聚合。

开发者不必记住所有这些细微差异，而是可以使用[`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)来测量 FCP，库会自行处理这些差异（在可能的情况下）：

```js
import {getFCP} from 'web-vitals';

// 当 FCP 可用时立即进行测量和记录。
getFCP(console.log);
```

您可以参考[`getFCP()`的源代码](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFCP.ts)，了解如何在 JavaScript 中测量 FCP 的完整示例。

{% Aside %}
在某些情况下（例如跨域 iframe），FCP 无法在 JavaScript 中进行测量。详情请参阅`web-vitals`库的[局限性](https://github.com/GoogleChrome/web-vitals#limitations)部分。
{% endAside %}

## 如何改进 FCP

要了解如何改进某个特定网站的 FCP，您可以运行一次灯塔性能审计，并留心查看审计建议的各种具体[机会](/lighthouse-performance/#opportunities)或[诊断](/lighthouse-performance/#diagnostics)。

要了解改进 FCP 的常见方式（针对任何网站），请参阅以下性能指南：

- [消除阻塞渲染的资源](/render-blocking-resources/)
- [缩小 CSS](/unminified-css/)
- [移除未使用的 CSS](/unused-css-rules/)
- [预连接到所需的来源](/uses-rel-preconnect/)
- [减少服务器响应时间 (TTFB)](/ttfb/)
- [避免多个页面重定向](/redirects/)
- [预加载关键请求](/uses-rel-preload/)
- [避免巨大的网络负载](/total-byte-weight/)
- [使用高效的缓存策略服务静态资产](/uses-long-cache-ttl/)
- [避免 DOM 过大](/dom-size/)
- [最小化关键请求深度](/critical-request-chains/)
- [确保文本在网页字体加载期间保持可见](/font-display/)
- [保持较低的请求数和较小的传输大小](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}

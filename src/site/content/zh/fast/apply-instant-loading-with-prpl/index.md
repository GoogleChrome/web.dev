---
layout: post
title: 使用 PRPL 模式实现即时加载
authors:
  - houssein
description: PRPL 是四个英文单词的首字母缩写，它描述了一种可以提高网页加载速度和交互性的模式。本指南介绍了解每种技术的组合使用方式，以及它们依然可以独立使用来取得想要的性能结果。
date: 2018-11-05
tags:
  - performance
---

PRPL 是四个英文单词的首字母缩写，它描述了一种可以提高网页加载速度和交互性的模式

- **推送 (Push)**（或**预加载**）最重要的资源。
- 尽快**渲染 (Render)** 初始路线。
- **预缓存 (Pre-cache)** 剩余资产。
- **延迟加载 (Lazy load)** 其他路线和非关键资产。

本指南介绍了解每种技术的组合使用方式，以及它们依然可以独立使用来取得想要的性能结果。

## 使用 Lighthouse 审计页面

运行 Lighthouse 来识别与 PRPL 技术一致的改进机会：

{% Instruction 'devtools-lighthouse', 'ol' %}

1. 选中 **Performance** 和 **Progressive Web App** 复选框。
2. 单击 **Run Audits** 来生成报告。

有关更多信息，请参阅[《使用 Lighthouse 发现性能机会》](/discover-performance-opportunities-with-lighthouse)一文。

## 预加载关键资源

如果某个资源被解析和延迟获取，Lighthouse 会显示以下失败的审计：

{% Img src="image/admin/tgcMfl3HJLmdoERFn7Ji.png", alt="Lighthouse：预加载关键请求审计", width="745", height="97" %}

[**Preload**](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) 是一个声明性的获取请求，它会告诉浏览器尽快请求资源。通过在 HTML 文档头部添加带有 `rel="preload"` 的 `<link>` 标签来预加载关键资源：

```html
<link rel="preload" as="style" href="css/style.css">
```

浏览器会为资源设置更合适的优先级，以便在不推迟 `window.onload` 事件的情况下尽快下载它。

有关预加载关键资源的更多信息，请参阅[预加载关键资产](/preload-critical-assets)指南。

## 尽快渲染初始路线

如果存在延迟[**首次绘制**](/user-centric-performance-metrics/#important-metrics-to-measure)（First Paint，即网站将像素呈现到屏幕的那一刻）的资源，Lighthouse 会发出警告：

{% Img src="image/admin/gvj0jlCYbMdpLNtHu0Ji.png", alt="Lighthouse: 消除渲染阻塞资源审计", width="800", height="111" %}

为了改进 First Paint，Lighthouse 建议内联关键 JavaScript 并使用 [`async`](/critical-rendering-path-adding-interactivity-with-javascript/) 推迟其余部分，以及内联首屏使用的关键 CSS。这样可以消除到服务器的往返，从而获取阻塞渲染的资产，提高性能。但是从开发的角度来看，内联代码更难维护，并且无法被浏览器单独缓存。

另一种改进 First Paint 的方法是在**服务器端渲染**页面的初始 HTML。这会在仍在获取、解析和执行脚本时立即向用户显示内容。但是，这会显着增加 HTML 文件的有效负载，可能会损害 [**Time to Interactive**](/tti/) ，或者影响到应用程序变得可交互并可以响应用户输入所需的时间。

降低应用程序中的 First Paint 并没有固定的单一解决方案。只有在对应用程序利大于弊的情况下，您才应该考虑使用内联样式和服务器端渲染。您可以通过以下资源了解有关这两个概念的更多信息。

- [优化 CSS 交付](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)
- [什么是服务器端渲染？](https://www.youtube.com/watch?v=GQzn7XRdzxY)

<figure data-float="right">{% Img src="image/admin/xv1f7ZLKeBZD83Wcw6pd.png", alt="带服务工作进程的请求/响应", width="800", height="1224" %}</figure>

## 预缓存资产

通过充当代理，**服务工作进程**可直接从缓存中获取资产，而不用在重复访问时从服务器获取。这不仅可以使用户在离线时使用您的应用程序，而且还可以在重复访问时加快页面的加载速度。

使用第三方库来简化生成服务工程进程的过程，除非这些库所无法满足您那些更复杂的缓存需求。例如， [Workbox](/workbox) 提供了一组工具，可以让您创建和维护服务工作进程来缓存资产。有关服务工作进程和离线可靠性的更多信息，请参阅可靠性学习路径中[的服务工作进程指南。](/service-workers-cache-storage)

## 延迟加载

如果您通过网络发送的数据太多，Lighthouse 会显示审计失败。

{% Img src="image/admin/Ml4hOCqfD4kGWfuKYVTN.png", alt="Lighthouse：网络有效负载过大的审计", width="800", height="99" %}

这包括所有资产类型，但由于浏览器解析和编译大型 JavaScript 有效负载需要时间，因此尤其消耗尤其严重。 Lighthouse 还会在适当的时候为此提供警告。

{% Img src="image/admin/aKDCV8qv3nuTVFt0Txyj.png", alt="Lighthouse：JavaScript 启动时间审计", width="797", height="100" %}

要发送仅包含用户最初加载应用程序所需代码的较小 JavaScript 有效负载，请根据需要拆分整个包并[延迟加载](/reduce-javascript-payloads-with-code-splitting)代码块。

一旦成功拆分数据包，请预加载更重要的代码块（请参阅[预加载关键资产](/preload-critical-assets)指南）。预加载可确保浏览器更快地获取和下载更重要的资源。

除了按需拆分和加载不同的 JavaScript 代码块外，Lighthouse 还提供对延迟加载非关键图像的审计。

{% Img src="image/admin/sEgLhoYadRCtKFCYVM1d.png", alt="Lighthouse：延迟加载屏幕外图像审计", width="800", height="90" %}

如果您在网页上使用了许多图像，请在加载页面时延迟加载所有位于首屏下方或设备视区之外的图像（请参阅[使用 lazysizes 来延迟加载图像](/use-lazysizes-to-lazyload-images)）。

## 接下来的步骤

现在您了解了 PRPL 模式背后的一些基本概念，请继续阅读本节中的下一个指南以了解更多信息。重要的是要记住，并非要一次性使用所有的技术。对以下任何一项所做的任何努力都将提供显著的性能改进。

- **推送**（或**预加载**）关键资源。
- 尽快**渲染**初始路线。
- **预缓存**剩余资产。
- **延迟加载**其他路线和非关键资产。

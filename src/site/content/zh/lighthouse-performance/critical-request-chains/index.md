---
layout: post
title: 避免链接关键请求
description: |2

  了解什么是关键请求链，它们如何影响网页性能，

  以及如何减少这种影响。
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - critical-request-chains
---

[关键请求链](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)是一系列对页面呈现很重要的依赖网络请求。链的长度越长，下载量越大，对页面加载性能的影响就越大。

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 报告通过高优先级加载的关键请求：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/apWYFAWSuxf9tQHuogSN.png", alt="Lighthouse 最小化关键请求深度审计的截图", width="800", height="452" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Lighthouse 如何识别关键请求链

Lighthouse 使用网络优先级作为识别阻塞呈现的关键资源的代理。有关 Chrome 如何定义这些优先级的更多信息，请参阅 Google 的 [Chrome 资源优先级和调度。](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit)

有关关键请求链、资源大小和下载资源所用时间的数据是从 [Chrome 远程调试协议](https://github.com/ChromeDevTools/devtools-protocol)中提取的。

## 如何减少关键请求链对性能的影响

使用关键请求链审计结果首先定位对页面加载影响最大的资源：

- 最小化关键资源的数量：消除它们，推迟下载，将它们标记为 `async` 等等。
- 优化关键字节数以减少下载时间（往返次数）。
- 优化剩余关键资源的加载顺序：尽早下载所有关键资产，缩短关键路径长度。

了解有关优化[图像](/use-imagemin-to-compress-images)、[JavaScript](/apply-instant-loading-with-prpl)、[CSS](/defer-non-critical-css) 和 [Web 字体的更多信息](/avoid-invisible-text)。

## 特定于堆栈的指南

### Magento

如果您不捆绑您的 JavaScript 资产，请考虑使用 [baler](https://github.com/magento/baler)。

## 资源

[**最小化关键请求深度**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)

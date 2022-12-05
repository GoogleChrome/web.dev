---
layout: post
title: 移动网络上的页面加载速度不够快
description: |2

  了解如何使您的网页在移动网络上快速加载。
web_lighthouse:
  - oad-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

许多用户会使用速度较慢的蜂窝网络连接来访问您的页面。在移动网络上快速加载页面有助于为这些移动用户提供更好的体验。

{% Aside 'note' %}在移动网络上快速加载页面，是网站被视为渐进式 Web 应用 (PWA) 的基本要求。请参阅[渐进式 Web 应用核心清单](/pwa-checklist/#core)。 {% endAside %}

## Lighthouse 页面加载速度审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记出在移动设备上加载速度不够快的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt="Lighthouse 审计显示在移动设备上加载速度不够快的页面", width="800", height="98"%}</figure>

有两个主要指标影响了用户对加载时间的体验：

- [首次有效绘制 (FMP)](https://developer.chrome.com/docs/lighthouse/performance/first-meaningful-paint/) ，它衡量页面的主要内容何时看起来完整
- [交互用时 (TTI)](/tti/) ，衡量页面何时完全交互

例如，如果一个页面在 1 秒后看起来完整，但用户在 10 秒内无法与其交互，则用户可能会认为页面加载时间为 10 秒。

Lighthouse 会计算慢速 4G 网络连接上的 TTI。如果交互时间超过 10 秒，则审计失败。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 如何改进页面的加载时间

{% include 'content/lighthouse-performance/improve.njk' %}

## 资源

- [**移动网络上的页面加载速度不够快**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/load-fast-enough-for-pwa.js)
- [基线渐进式 Web 应用程序清单](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [关键渲染路径](/critical-rendering-path/)
- [分析运行时性能入门](https://developer.chrome.com/docs/devtools/evaluate-performance/)
- [记录负载性能](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#record-load)
- [优化内容效率](/performance-optimizing-content-efficiency/)
- [渲染性能](/rendering-performance/)

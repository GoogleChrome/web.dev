---
layout: post
title: Time to Interactive 可交互时间 (TTI)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: 本篇文章介绍了可交互时间 (TTI) 指标并说明了该指标的测量方式
tags:
  - performance
  - metrics
---

{% Aside %}可交互时间 (TTI) 是测量[加载响应度](/user-centric-performance-metrics/#types-of-metrics)的重要[实验室指标](/user-centric-performance-metrics/#in-the-lab)。该指标有助于识别*看起来*具备交互性但实际上并非如此的页面情况。迅捷的 TTI 有助于确保页面的[有效性](/user-centric-performance-metrics/#questions)。 {% endAside %}

## 什么是 TTI？

TTI 指标测量页面从开始加载到主要子资源完成渲染，并能够快速、可靠地响应用户输入所需的时间。

如需根据网页的[性能跟踪](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)计算 TTI，请执行以下步骤：

1. 先进行[First Contentful Paint 首次内容绘制 (FCP)](/fcp/)。
2. 沿时间轴正向搜索时长至少为 5 秒的安静窗口，其中，*安静窗口*的定义为：没有[长任务](/custom-metrics/#long-tasks-api)且不超过两个正在处理的网络 GET 请求。
3. 沿时间轴反向搜索安静窗口之前的最后一个长任务，如果没有找到长任务，则在 FCP 步骤停止执行。
4. TTI 是安静窗口之前最后一个长任务的结束时间（如果没有找到长任务，则与 FCP 值相同）。

下图将有助于您更直观地理解上述步骤：

{% Img src="image/admin/WZM0n4aXah67lEyZugOT.svg", alt="显示 TTI 计算方式的页面加载时间轴", width="800", height="473", linkTo=true %}

长久以来，开发者为了追求更快的渲染速度而对页面进行了优化，但有时，这会以牺牲 TTI 为代价。

服务器端渲染 (SSR) 等技术可能会导致页面*看似*具备交互性（即，链接和按钮在屏幕上可见），但*实际上*并不能进行交互，因为主线程被阻塞或是因为控制这些元素的 JavaScript 代码尚未完成加载。

当用户尝试与看似具备交互性但实际上并非如此的页面进行交互时，他们可能会有如下两种反应：

- 在最好的情况下，他们会因为页面响应缓慢而感到恼火。
- 在最坏的情况下，他们会认为页面已损坏，因此很可能直接离开。他们甚至可能对您的品牌价值丧失信心或信任。

为了避免这个问题，请尽一切努力将 FCP 和 TTI 之间的差值降至最低。如果两者在某些情况下确实存在明显差异，请通过视觉指示器清楚表明页面上的组件还无法进行交互。

## 如何测量 TTI

TTI 指标最好[在实验室中](/user-centric-performance-metrics/#in-the-lab)进行测量。测量 TTI 的最佳方法是在您的网站上运行一次灯塔性能审计。有关使用详情，请参阅[灯塔中关于 TTI 的说明文档](/tti/)。

### 实验室工具

- [灯塔](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest 网页性能测试工具](https://www.webpagetest.org/)

{% Aside %}虽然 TTI 可以在实际情况下进行测量，但我们不建议这样做，因为用户交互会影响您网页的 TTI，从而导致您的报告中出现大量差异。如需了解页面在实际情况中的交互性，您应该测量[First Input Delay 首次输入延迟 (FID)](/fid/) 。{% endAside %}

## 怎样算是良好的 TTI 分数？

为了提供良好的用户体验，网站在**普通移动硬件**上进行测试时，应该努力将可交互时间控制在**5 秒**以内。

有关页面 TTI 对灯塔性能分数影响的详细信息，请参阅[灯塔如何确定您的 TTI 分数](/interactive/#how-lighthouse-determines-your-tti-score)。

## 如何改进 TTI

如需了解如何改进某个特定网站的 TTI，您可以运行一次灯塔性能审计，并留心查看审计建议的各种具体[机会](/lighthouse-performance/#opportunities)。

如需了解改进 TTI 的常见方式（针对任何网站），请参阅以下性能指南：

- [缩小 JavaScript](/unminified-javascript/)
- [预连接到所需的来源](/uses-rel-preconnect/)
- [预加载关键请求](/uses-rel-preload/)
- [减少第三方代码的影响](/third-party-summary/)
- [最小化关键请求深度](/critical-request-chains/)
- [减少 JavaScript 执行时间](/bootup-time/)
- [最小化主线程工作](/mainthread-work-breakdown/)
- [保持较低的请求数和较小的传输大小](/resource-summary/)

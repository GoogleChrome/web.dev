---
title: 长的 JavaScript 任务是否会延迟您的交互时间？
subhead: 学习诊断阻止用户交互的耗时工作。
authors:
  - addyosmani
date: 2019-05-29
hero: image/admin/QvWXvBSXsRKtpGOcakb5.jpg
alt: 一个沙子不断流出的沙漏
description: 长任务会使主线程保持忙碌，延迟用户交互。Chrome DevTools 现在可以将长任务可视化，从而更容易查看要优化的任务。
tags:
  - blog
  - performance
---

**tl;dr: 长任务会使主线程保持忙碌，延迟用户交互。Chrome DevTools 现在可以将长任务可视化，从而更容易查看要优化的任务。**

如果您使用 Lighthouse 来审计自己的页面，那么可能熟悉 [Time to Interactive](/tti/) ，这是一个表示用户何时可以与您的页面交互并获得响应的指标。但是您知道长 (JavaScript) 任务会导致 TTI 表现不佳吗？

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4XCzYI9gaUJDTTJu9JxH.png", alt="Lighthouse 报告中显示的 Time to Interactive", width="800", height="169" %}

## 什么是长任务？

[长任务](https://developer.mozilla.org/docs/Web/API/Long_Tasks_API)是指长时间独占主线程，导致界面卡顿的 JavaScript 代码。

在加载网页时，长任务会占用主线程并使页面对用户输入无响应，即使它看起来已准备就绪。点击和轻按通常不起作用，因为尚未附加事件侦听器、单击处理程序等。

由于耗时超过 50 毫秒的复杂工作，会出现占用大量 CPU 的长任务。为什么是 50 毫秒？ [RAIL 模型](/rail/)建议您在[50 毫秒](/rail/#response:-process-events-in-under-50ms)内处理用户输入事件，以确保在 100 毫秒内做出可见响应。如果你不这样做，操作和反应之间的连接就会中断。

## 我的页面中是否存在可能会延迟交互的长任务？

到目前为止，您需要在 [Chrome DevTools](https://developer.chrome.com/docs/devtools/) 中手动查找超过 50 毫秒的“黄色长块”脚本，或者使用 [Long Tasks API](https://calendar.perfplanet.com/2017/tracking-cpu-with-long-tasks-api/) 找出哪些任务延迟了交互。这可能有点麻烦。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mSKnMWBcEBHWkXzTGCAH.png", alt="显示短任务和长任务差异的 DevTools Performance 面板截图", width="800", height="450" %}

为了帮助简化性能审计工作流程， [DevTools 现在可视化了长任务](https://developers.google.com/web/updates/2019/03/devtools#longtasks) 。如果任务（以灰色显示）是长任务，则会以红色标注。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fyDPyO4XbSINMVpSSY9E.png", alt="DevTools 将长任务可视化为性能面板中的灰色条，以红色标注", width="800", height="450" %}

- 在[性能面板](https://developer.chrome.com/docs/devtools/evaluate-performance/)中记录加载网页的跟踪情况。
- 在主线程视图中寻找红色标志。您应该会看到任务现在是灰色的（“任务”）。
- 将鼠标悬停在栏上可以查看任务的持续时间以及它是否被视为“长任务”。

## 是什么原因导致的长任务？

要发现导致长任务的原因，请选择灰色的**任务**栏。在下方的抽屉中，选择**自下而上**和**按活动分组**。这样就可以查看哪些活动对长任务完成的任务贡献最大（总共）。下面似乎是一组耗时高的 DOM 查询。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7irBiePkFJRmzKMlcJUV.png", alt="在 DevTools 中选择一个长任务（标记为“任务”）可以深入了解负责它的活动。", width=" 800", height="450" %}

## 优化长任务的常用方法有哪些？

大型脚本通常是导致长任务的主要原因，因此请考虑[将它们拆分](/reduce-javascript-payloads-with-code-splitting)。还要留意第三方脚本；它们的长任务可能会延迟主要内容的交互性。

将您的所有工作分解成小块（运行时间 &lt; 50 毫秒），并在正确的时间和地点运行这些块；所谓正确的地点，甚至可能在主线程之外，比如在工程线程中。Phil Walton 的[《从空闲到紧急》](https://philipwalton.com/articles/idle-until-urgent/)是有关此主题的好读物。

保持页面的响应速度。最大限度地减少长任务是确保用户在访问您的网站时获得愉快体验的好方法。有关长任务的更多信息，请查看以[《以用户为中心的性能指标》](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_long_tasks)。

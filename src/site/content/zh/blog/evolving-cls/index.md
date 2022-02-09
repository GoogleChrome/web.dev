---
title: 不断改进 CLS 指标
subhead: 改进 CLS 指标，使其对长期存在的页面更加公平的计划。
description: 改进 CLS 指标，使其对长期存在的页面更加公平的计划。
authors:
  - anniesullie
  - hbsong
date: 2021-04-07
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: 用于测量布局偏移的示例窗口方法。
tags:
  - blog
  - performance
  - web-vitals
---

{% Aside %} **2021 年 6 月 2 日：**本文中描述的 CLS 更新现可在 Chrome 的 web 工具表面上使用。有关详细信息，请参阅[《Web 工具中不断发展的累积布局偏移》](/cls-web-tooling/)一文。 {% endAside %}

我们（Chrome Speed Metrics 团队）最近概述了我们对[使 CLS 指标对长时间打开的页面更加公平选项](/better-layout-shift-metric/)的初步研究。我们收到了很多非常有用的反馈，在完成大规模分析后，最终确定了计划对指标进行的更改：**1 秒间隔的最大会话窗口，最大值为 5 秒**。

请继续阅读以了解详细信息！

## 我们如何评估的这些选项？

我们审查并考虑了从开发者社区收到的所有反馈。

我们还在 Chrome 中实现了[顶级选项](/better-layout-shift-metric/#best-strategies)，并对数百万个网页的指标进行了大规模分析。我们检查了每个选项改进了哪些类型的网站，以及这些选项的比较方式，特别是查看了不同选项得分不同的网站。总的来说，我们发现：

- **所有**选项都降低了在页面上花费的时间与布局偏移分数之间的相关性。
- **没有**一个选项会导致任何页面的得分更差。因此，无需担心此更改会降低您网站的分数。

## 决策点

### 为什么选会话窗口？

在[之前的帖子](/better-layout-shift-metric/)中，我们介绍了[几种不同的窗口策略](/better-layout-shift-metric/#windowing-strategies)，用来将布局偏移组合在一起，同时确保分数不会无限增长。我们从开发人员那里收到的反馈压倒性地支持会话窗口策略，因为它可以最直观地将布局偏移组合到一起。

要审阅会话窗口，以下是一个示例：

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>会话窗口示例。</figcaption></figure>

在上面的示例中，在用户查看页面时，许多布局会随着时间的推移而变化。每个都由一个蓝条表示。您会注意到上面的蓝条具有不同的高度；这些代表每一个布局偏移的[分数](/cls/#layout-shift-score)。会话窗口从第一个布局偏移开始并继续扩展，直到出现没有布局偏移的间隙。当下一次布局偏移发生时，将启动一个新的会话窗口。由于存在三个没有布局偏移的间隙，因此示例中共有三个会话窗口。与 CLS 的当前定义类似，将每次偏移的分数相加，因此每个窗口的分数是其各个布局偏移的总和。

根据[最初的研究](/better-layout-shift-metric/#best-strategies)，我们在会话窗口之间选择了 1 秒的间隔，这个值在我们的大规模分析中效果很好。所以上例中显示的“会话间隔”是 1 秒。

### 为什么选最大会话窗口？

在最初的研究中，我们将[总结策略](/better-layout-shift-metric/#summarization)缩小到两个选项：

- 所有会话窗口的**平均**分数，用于非常大的会话窗口（无上限的窗口，它们之间有 5 秒的间隔）。
- 所有会话窗口的**最大**分数，用于较小的会话窗口（上限为 5 秒，它们之间有 1 秒的间隔）。

经过初步研究，我们将每个指标添加到 Chrome 中，以便对数百万个 URL 进行大规模分析。在大规模的分析中，我们发现了很多 URL 存在下列布局偏移模式：

{% Img src="image/MZfwZ8oVW8U6tzo5CXffcER0jR83/bW3lHZmss3cqGayZsq4P.png", alt="拉低平均值的小布局偏移示例", width="800", height="550" %}

在右下角，您可以看到会话窗口 2 中只有一个微小的布局偏移，因此得分非常低。这意味着平均分数非常低。但是，如果开发人员修复了那个微小的布局偏移会怎么样？然后只在会话窗口 1 上计算分数，这意味着页面的分数*几乎翻了一倍*。对于开发人员来说，如果改进他们的布局偏移却发现分数变得更糟，那真的会令人困惑和沮丧。并且移除这个小的布局偏移对于用户体验来说显然稍微好一些，所以它不应该使分数变差。

由于平均值的这个问题，我们决定继续使用较小的、有上限的、最大的窗口。因此，在上面的示例中，会话窗口 2 将被忽略，并且只会报告会话窗口 1 中布局偏移的总和。

### 为什么是 5 秒？

我们评估了多个窗口大小并发现了两件事：

- 对于短窗口，较慢的页面加载和较慢的用户交互响应可能会将布局偏移细分为多个窗口并提高分数。我们想让窗口保持足够大，避免它为减速提供分数奖励！
- 有一些页面具有连续的小布局偏移流。例如，体育比分页面随着每次比分更新而移动一点。这些偏移很烦人，但它们不会随着时间的推移而变得更烦人。因此，我们希望确保窗口为这些类型的布局偏移设置上限。

考虑到这两点，在比较了许多现实世界网页上的各种窗口大小，我们得出结论，5 秒将是对窗口大小的一个很好的限制。

## 它如何影响页面的 CLS 分数？

由于此更新限制了页面的 CLS，所以不会有页面会因这个更改而**获得更差的分数**。

根据我们的分析， **55% 的来源在第 75 个百分位处根本看不到 CLS 的变化**。这是因为他们的页面当前没有任何布局偏移，或者他们所做的偏移已经被限制在单个会话窗口中。

**通过此更改，其余来源在第 75 个百分位数处的分数将有所提高。**大多数人只会看到轻微的改善，但大约 3% 的人会看到他们的分数从“需要改进”或“差”评级提高到“优秀”评级。这些页面往往使用无限滚动条或有许多缓慢的 UI 更新，如我们[之前的帖子](/better-layout-shift-metric/)所述。

## 那么如何尝试呢？

我们将很快更新我们的工具以使用新的指标定义！ 在此之前，您可以使用[示例 JavaScript 实现](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver)或 [Web Vitals 扩展](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls)的分支在任何站点上试用 CLS 的更新版本。

在此感谢所有在百忙之中阅读上一篇文章并提供反馈的读者！

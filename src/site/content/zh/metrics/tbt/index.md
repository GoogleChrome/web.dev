---
layout: post
title: Total Blocking Time 总阻塞时间 (TBT)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: 本篇文章介绍了总阻塞时间 (TBT) 指标并说明了该指标的测量方式
tags:
  - performance
  - metrics
---

{% Aside %}

总阻塞时间 (TBT) 是测量[加载响应度](/user-centric-performance-metrics/#in-the-lab)的重要[实验室指标](/user-centric-performance-metrics/#types-of-metrics)，因为该项指标有助于量化在页面交互性变为可靠前，不可交互程度的严重性，较低的 TBT 有助于确保页面的[可用性](/user-centric-performance-metrics/#questions)。

{% endAside %}

## 什么是 TBT？

总阻塞时间 (TBT) 指标测量[First Contentful Paint 首次内容绘制 (FCP)](/fcp/)与[Time to Interactive 可交互时间 (TTI)](/tti/)之间的总时间，这期间，主线程被阻塞的时间过长，无法作出输入响应。

每当出现[长任务](/custom-metrics/#long-tasks-api)（在主线程上运行超过 50 毫秒的任务）时，主线程都被视作"阻塞状态"。我们说主线程处于"阻塞状态"是因为浏览器无法中断正在进行的任务。因此，如果用户在某个长任务运行期间与页面*进行*交互，那么浏览器必须等到任务完成后才能作出响应。

如果任务时长足够长（例如超过 50 毫秒），那么用户很可能会注意到延迟，并认为页面缓慢或卡顿。

某个给定长任务的*阻塞时间*是该任务持续时间超过 50 毫秒的部分。一个页面的*总阻塞时间*是在 FCP 和 TTI 之间发生的每个长任务的*阻塞时间*总和。

例如，请看以下这张页面加载期间浏览器主线程的图表：

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="主线程上的任务时间轴", width="800", height="156", linkTo=true %}

上方的时间轴上有五个任务，其中三个是长任务，因为这些任务的持续时间超过 50 毫秒。下图显示了各个长任务的阻塞时间：

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xKxwKagiz8RliuOI2Xtc.svg", alt="显示阻塞时间的主线程任务时间轴", width="800", height="156", linkTo=true %}

因此，虽然在主线程上运行任务的总时间为 560 毫秒，但其中只有 345 毫秒被视为阻塞时间。

<table>
  <tr>
    <th></th>
    <th>任务持续时间</th>
    <th>任务阻塞时间</th>
  </tr>
  <tr>
    <td>任务一</td>
    <td>250 毫秒</td>
    <td>200 毫秒</td>
  </tr>
  <tr>
    <td>任务二</td>
    <td>90 毫秒</td>
    <td>40 毫秒</td>
  </tr>
  <tr>
    <td>任务三</td>
    <td>35 毫秒</td>
    <td>0 毫秒</td>
  </tr>
  <tr>
    <td>任务四</td>
    <td>30 毫秒</td>
    <td>0 毫秒</td>
  </tr>
  <tr>
    <td>任务五</td>
    <td>155 毫秒</td>
    <td>105 毫秒</td>
  </tr>
  <tr>
    <td colspan="2"><strong>总阻塞时间</strong></td>
    <td><strong>345 毫秒</strong></td>
  </tr>
</table>

### TBT 与 TTI 有什么关系？

TBT 是 TTI 的一个出色的配套指标，因为 TBT 有助于量化在页面交互性变为可靠前，不可交互程度的严重性。

TTI 会在主线程至少有五秒钟没有长任务时，认为页面具备"可靠交互性"。也就是说，分布在 10 秒钟里的三个 51 毫秒长的任务与单个 10 秒长的任务对 TTI 的影响是相同的，但对于试图与页面进行交互的用户来说，这两种情况给人的感觉是截然不同的。

在第一种情况下，三个 51 毫秒的任务的 TBT 为**3 毫秒**。而单个 10 秒长的任务的 TBT 为**9950 毫秒**。第二种情况下较大的 TBT 值对较差的体验进行了量化。

## 如何测量 TBT

TBT 指标应该[在实验室中](/user-centric-performance-metrics/#in-the-lab)进行测量。测量 TBT的最佳方法是在您的网站上运行一次灯塔性能审计。有关使用详情，请参阅[灯塔中关于 TBT 的说明文档](/lighthouse-total-blocking-time)。

### 实验室工具

- [Chrome 开发者工具](https://developers.google.com/web/tools/chrome-devtools/)
- [灯塔](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest 网页性能测试工具](https://www.webpagetest.org/)

{% Aside %}虽然 TBT 可以在实际情况下进行测量，但我们不建议这样做，因为用户交互会影响您网页的 TBT，从而导致您的报告中出现大量差异。如需了解页面在实际情况中的交互性，您应该测量[First Input Delay 首次输入延迟 (FID)](/fid/) 。{% endAside %}

## 怎样算是良好的 TBT 分数？

为了提供良好的用户体验，网站在**普通移动硬件**上进行测试时，应该努力将总阻塞时间控制在**300 毫秒**以内。

有关页面 TBT 对灯塔性能分数影响的详细信息，请参阅[灯塔如何确定您的 TBT 分数](/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)

## 如何改进 TBT

如需了解如何改进某个特定网站的 TBT，您可以运行一次灯塔性能审计，并留心查看审计建议的各种具体[机会](/lighthouse-performance/#opportunities)。

如需了解改进 TBT 的常见方式（针对任何网站），请参阅以下性能指南：

- [减少第三方代码的影响](/third-party-summary/)
- [减少 JavaScript 执行时间](/bootup-time/)
- [最小化主线程工作](/mainthread-work-breakdown/)
- [保持较低的请求数和较小的传输大小](/resource-summary/)

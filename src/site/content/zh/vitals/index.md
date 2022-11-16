---
layout: post
title: Web 指标
description: 优秀网站的关键指标
hero: image/admin/BHaoqqR73jDWe6FL2kfw.png
authors:
  - philipwalton
date: 2020-04-30
updated: 2020-07-21
tags:
  - metrics
  - performance
  - web-vitals
---

不断优化用户体验是所有网站取得长远成功的关键。无论您是一名企业家、营销人员，还是开发者，Web 指标都能帮助您量化网站的体验指数，并发掘改进的机会。

## 概览

Web 指标是 Google 开创的一项新计划，旨在为网络质量信号提供统一指导，这些信号对于提供出色的网络用户体验至关重要。

多年来，Google 提供了许多性能测量和性能报告工具。一些开发者对这些工具的使用十分在行，而另一些开发者则发现大量的工具和指标令人应接不暇。

网站所有者要想了解他们提供给用户的体验质量，并非需要成为性能专家。 Web 指标计划旨在简化场景，帮助网站专注于最重要的指标，即**核心 Web 指标** 。

## 核心 Web 指标

核心 Web 指标是适用于所有网页的 Web 指标子集，每位网站所有者都应该测量这些指标，并且这些指标还将显示在所有 Google 工具中。每项核心 Web 指标代表用户体验的一个不同方面，能够进行[实际](/user-centric-performance-metrics/#how-metrics-are-measured)测量，并且反映出[以用户为中心](/user-centric-performance-metrics/#how-metrics-are-measured)的关键结果的真实体验。

核心 Web 指标的构成指标会随着时间的推移而[发展](#evolving-web-vitals) 。当前针对 2020 年的指标构成侧重于用户体验的三个方面——*加载性能*、*交互性*和*视觉稳定性*——并包括以下指标（及各指标相应的阈值）：

<div class="auto-grid" style="--auto-grid-min-item-size: 200px;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="最大内容绘制阈值建议", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="首次输入延迟阈值建议", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="累积布局偏移阈值建议" , width="400", height="350" %}</div>

- **[Largest Contentful Paint (LCP)](/lcp/)** ：最大内容绘制，测量*加载*性能。为了提供良好的用户体验，LCP 应在页面首次开始加载后的**2.5 秒**内发生。
- **[First Input Delay (FID)](/fid/)** ：首次输入延迟，测量*交互性*。为了提供良好的用户体验，页面的 FID 应为**100 毫秒**或更短。
- **[Cumulative Layout Shift (CLS)](/cls/)** ：累积布局偏移，测量*视觉稳定性*。为了提供良好的用户体验，页面的 CLS 应保持在 **0.1.** 或更少。

为了确保您能够在大部分用户的访问期间达成建议目标值，对于上述每项指标，一个良好的测量阈值为页面加载的**第 75 个百分位数**，且该阈值同时适用于移动和桌面设备。

如果一个页面满足上述全部三项指标建议目标值的第 75 个百分位数，那么评估核心 Web 指标合规性的工具应评判该页面为通过。

{% Aside %}要想详细了解这些建议值背后的研究和方法论，请参阅：[定义核心 Web 指标的指标阈值](/defining-core-web-vitals-thresholds/){% endAside %}

### 测量和报告核心 Web 指标的工具

Google 认为核心 Web 指标对一切网络体验都至关重要。因此，Google 致力于[在其所有热门工具中](/vitals-tools/)显示这些指标。以下部分详细介绍了支持核心 Web 指标的工具。

#### 核心 Web 指标的实测工具

[Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)为每项核心 Web 指标收集匿名的真实用户测量数据。这些数据既能使网站所有者快速进行性能评估，而无需在页面上进行手动检测分析，也能同时为[PageSpeed Insights 网页速度测量工具](https://pagespeed.web.dev/)和搜索控制台的[核心 Web 指标报告](https://support.google.com/webmasters/answer/9205520)等工具提供支持。

<div class="table-wrapper">
  <table>
    <tr>
      <td> </td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developer.chrome.com/docs/crux/">Chrome 用户体验报告</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights 网页速度测量工具</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520">搜索控制台（核心 Web 指标报告）</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %}关于这些工具的使用方法以及适合您用例的工具选择指南，请参阅：[测量 Web 指标入门指南](/vitals-measurement-getting-started/) {% endAside %}

Chrome 用户体验报告提供的数据带来了一种快速评估网站性能的方法，但这些数据没有提供详细的、对应每页浏览量的遥测数据，而这些通常是对回归进行准确诊断、监控，以及做出迅速反应的必要数据。因此，我们强烈建议网站搭建自己的真实用户监控。

#### 在 JavaScript 中测量核心 Web 指标

每项核心 Web 指标都可以通过使用标准网页 API 在 JavaScript 中进行测量。

测量所有核心 Web 指标，最简单的方法是使用[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 库，这是一个围绕底层网页 API 的小型的、生产就绪的封装器，通过准确匹配每项指标在上方列出的所有 Google 工具中的报告方式来进行指标测量。

通过使用[web-vitals](https://github.com/GoogleChrome/web-vitals)库，测量每项指标就像调用单个函数一样简单（有关完整[用法](https://github.com/GoogleChrome/web-vitals#usage)和[API](https://github.com/GoogleChrome/web-vitals#api)详情，请参阅文档）：

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

当您将网站配置为使用[web-vitals](https://github.com/GoogleChrome/web-vitals)库来测量您的核心 Web 指标数据并将其发送到分析端后，下一步是对数据进行汇总和报告，从而查看您的页面是否在至少 75% 的页面访问中都满足建议阈值。

一些分析工具供应商已经内置了核心 Web 指标支持，但即使是那些没有内置支持的供应商也应该包含基本的自定义指标功能，让您能够使用他们的工具来测量核心 Web 指标。

[Web 指标报告](https://github.com/GoogleChromeLabs/web-vitals-report)就是其中一个例子，它使网站所有者能够使用 Google 分析来测量他们的核心 Web 指标。了解使用其他分析工具测量核心 Web 指标的相关指南，请参阅[实测 Web 指标的最佳实践](/vitals-field-measurement-best-practices/)。

您还可以使用[Web 指标 Chrome 扩展程序](https://github.com/GoogleChrome/web-vitals-extension)来报告每项核心 Web 指标，且无需编写任何代码。该扩展程序使用[web-vitals](https://github.com/GoogleChrome/web-vitals)库来测量每一项指标，并在用户浏览网页时呈现给用户。

此扩展程序有助于您了解自己的网站、竞争对手的网站和整个网络的性能。

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">Web 指标扩展程序</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

此外，倾向于直接通过底层网页 API 来测量这些指标的开发者可以参考这些指标指南，从而了解执行详情：

- [在 JavaScript 中测量 LCP](/lcp/#measure-lcp-in-javascript)
- [在 JavaScript 中测量 FID](/fid/#measure-fid-in-javascript)
- [在 JavaScript 中测量 CLS](/cls/#measure-cls-in-javascript)

{% Aside %}关于如何使用热门分析服务（或您自己的内部分析工具）来测量这些指标的更多指导，请参阅：[实测 Web 指标的最佳实践](/vitals-field-measurement-best-practices/){% endAside %}

#### 核心 Web 指标的实验室测量工具

虽然所有的核心 Web 指标首先都是实测指标，但其中的许多指标也可以在实验室中进行测量。

实验室测量是在开发过程中（功能发布给用户之前）测试功能性能的最佳方式，也是在性能回归发生之前及时捕获的最佳方式。

以下工具可用于在实验室环境中测量核心 Web 指标：

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.chrome.com/docs/devtools/">Chrome 开发者工具</a></td>
        <td>✔</td>
        <td>✘（使用<a href="/tbt/"> TBT </a>代替）</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/lighthouse/overview/">灯塔</a></td>
        <td>✔</td>
        <td>✘（使用<a href="/tbt/"> TBT </a>代替）</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}灯塔这类在没有用户的模拟环境中加载页面的工具无法测量 FID（没有用户输入）。但是，Total Blocking Time 总阻塞时间 (TBT) 指标不仅可以进行实验室测量，而且还是 FID 的出色代理。在实验室中改进 TBT 的性能优化应该能够改进实际的 FID（请参阅下方的性能建议）。 {% endAside %}

虽然实验室测量对于提供出色的体验至关重要，但它不能替代实际测量。

根据用户设备功能、网络状况、设备上可能正在运行的其他进程以及与页面交互方式的差别，网站性能也可能会有很大差异。事实上，每项核心 Web 指标的得分都会受到用户交互的影响。只有通过实际测量才能准确获取全貌。

### 提高分数的建议

当您测量了核心 Web 指标并确定了需要改进的领域后，下一步就是优化。以下指南提供了如何针对每项核心 Web 指标优化页面的具体建议：

- [优化 LCP](/optimize-lcp/)
- [优化 FID](/optimize-fid/)
- [优化 CLS](/optimize-cls/)

## 其他 Web 指标

虽然核心 Web 指标是理解并提供出色用户体验的关键指标，但还有其他的一些重要指标。

其他 Web 指标通常用作核心 Web 指标的代理或补充指标，有助于获取范围更广的体验或帮助诊断特定的问题。

例如，[Time to First Byte 首字节时间 (TTFB)](/ttfb/)和[First Contentful Paint 首次内容绘制 (FCP)](/fcp/)指标都是*加载*体验的重要方面，并且在诊断 LCP 问题方面（分别为[服务器响应时间](/overloaded-server/)过长或[阻塞渲染资源](/render-blocking-resources/)）都十分有用。

同样，[总阻塞时间 (TBT)](/tbt/)和[Time to Interactive 可交互时间 (TTI)](/tti/)等指标是实验室指标，对于捕获和诊断会对 FID 产生影响的潜在*交互性*问题至关重要。然而，这些指标不是核心 Web 指标的一部分，因为它们无法进行实际测量，也不反映以[用户为中心](/user-centric-performance-metrics/#how-metrics-are-measured)的结果。

## 不断发展的 Web 指标

Web 指标和核心 Web 指标代表了当今开发者用来测量网络体验质量的最佳可用信号，但这些信号并不完美，并且会在未来不断进行改进或补充。

**核心 Web 指标**与所有网页都息息相关，并且已经显示在相关的 Google 工具中。这些指标的变化将产生广泛的影响，因此，开发者应当认为核心 Web 指标的定义和阈值是稳定的，并且会以可预测的、每年一次的更新节奏提前发布更新通知。

其他 Web 指标通常适用于特定情景或工具，并且可能比核心 Web 指标更具实验性。因此，这些指标的定义和阈值可能会有更频繁的更改。

针对所有 Web 指标的更改都将清楚地记录在这份公开的[更新日志](http://bit.ly/chrome-speed-metrics-changelog)中。

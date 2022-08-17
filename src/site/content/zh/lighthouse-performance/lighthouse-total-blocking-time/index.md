---
layout: post
title: 总阻塞时间
description: |2-

  了解 Lighthouse 的总阻塞时间指标以及如何测量和优化它。
web_lighthouse:
  - total-blocking-time
date: 2019-10-09
updated: 2021-06-04
---

总阻塞时间 (TBT) 是 Lighthouse 报告的**性能**部分中跟踪的指标之一。每个指标都会捕获页面加载速度的某些方面。

Lighthouse 报告以毫秒为单位显示 TBT：

<figure>{% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/wk3OTIdxFPoUImDCnjic.png", alt="Lighthouse 总阻塞时间审计截图", width="800", height="592" %}</figure>

## TBT 测量什么

TBT 测量页面被阻止响应用户输入（例如鼠标点击、屏幕点击或按下键盘）的总时间。总和是[首次内容绘制](/fcp/)和[互动时间](/tti/)之间所有[长时间任务](/long-tasks-devtools)*的阻塞部分*之和。任何执行时间超过 50 毫秒的任务都是长任务。50 毫秒后的时间量是阻塞部分。例如，如果 Lighthouse 检测到一个 70 毫秒长的任务，则阻塞部分将为 20 毫秒。

## Lighthouse 如何确定您的 TBT 分数

您的 TBT 分数是您的网页的 TBT 时间与在移动设备上加载时数百万个真实网站的 TBT 时间的比较。请参阅[如何确定指标分数](/performance-scoring/#metric-scores)以了解如何设置 Lighthouse 分数阈值。

下表显示了如何解释您的 TBT 分数：

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>TBT 时间<br>（以毫秒为单位）</th>
        <th>颜色编码</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–200</td>
        <td>绿色（快速）</td>
      </tr>
      <tr>
        <td>200-600</td>
        <td>橙色（中等）</td>
      </tr>
      <tr>
        <td>超过 600</td>
        <td>红色（慢）</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## 如何提高您的 TBT 分数

请参阅[是什么导致了我的长时间任务？](/long-tasks-devtools/#what-is-causing-my-long-tasks)了解如何使用 Chrome DevTools 的性能面板诊断长时间任务的根本原因。

一般来说，导致长时间任务的最常见原因是：

- 不必要的 JavaScript 加载、解析或执行。在性能面板中分析您的代码时，您可能会发现主线程正在执行加载页面并不真正需要的工作。[通过代码拆分减少 JavaScript 负载](/reduce-javascript-payloads-with-code-splitting/)、[删除未使用的代码](/remove-unused-code/)或[有效加载第三方 JavaScript](/efficiently-load-third-party-javascript/) 应该可以提高您的 TBT 分数。
- 低效的 JavaScript 语句。例如，在性能面板中分析您的代码后，假设您看到对`document.querySelectorAll('a')`的调用返回 2000 个节点，则重构您的代码以使用仅返回 10 个节点的更具体的选择器，这样应该会提高您的 TBT 分数。

{% Aside %}在大多数网站上，通常有很大的空间改进不必要的 JavaScript 加载、解析或执行。 {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## 资源

- [**总阻塞时间**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/total-blocking-time.js)
- [长的 JavaScript 任务是否会延迟您的交互时间？](/long-tasks-devtools)
- [优化首次输入延迟](/optimize-fid)
- [首次内容绘制](/fcp/)
- [互动时间](/tti/)
- [通过代码拆分减少 JavaScript 负载](/reduce-javascript-payloads-with-code-splitting/)
- [删除未使用的代码](/remove-unused-code/)
- [高效加载第三方资源](/efficiently-load-third-party-javascript/)

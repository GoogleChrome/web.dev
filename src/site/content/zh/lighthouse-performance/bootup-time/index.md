---
layout: post
title: 减少 JavaScript 执行时间
description: 了解 JavaScript 执行如何降低页面性能以及如何加速。
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - bootup-time
tags:
  - memory
---

当您的 JavaScript 需要很长时间来执行时，它会以多种方式降低您的页面性能：

- **网络成本**

    更多的字节等于更长的下载时间。

- **解析和编译成本**

    JavaScript 在主线程上被解析和编译。当主线程繁忙时，页面无法响应用户输入。

- **执行成本**

    JavaScript 也在主线程上执行。如果您的页面在真正需要之前运行了大量代码，这也会延迟您的[交互时间](/tti/)，这是与用户如何看待您的页面速度相关的关键指标之一。

- **内存成本**

    如果您的 JavaScript 持有大量引用，则可能会消耗大量内存。页面在消耗大量内存时会出现卡顿或缓慢。内存泄漏会导致您的页面完全冻结。

## Lighthouse JavaScript 执行时间审计失败的原因

当 JavaScript 执行时间超过 2 秒时，[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)会显示警告。当执行时间超过 3.5 秒时审计失败：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BoomMoQNycPXsy34DZZs.png", alt="减少 JavaScript 执行时间的 Lighthouse 审计截图", width="800", height="321" %}</figure>

为了帮助您确定对执行时间影响最大的因素，Lighthouse 报告了执行、评估和解析页面加载的每个 JavaScript 文件所花费的时间。

{% include 'content/lighthouse-performance/scoring.njk' %}

## 如何加速 JavaScript 执行

{% include 'content/lighthouse-performance/js-perf.njk' %}

## 资源

[**减少 JavaScript 执行时间**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/bootup-time.js)

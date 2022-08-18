---
layout: post
title: 避免非合成动画
description: 如何通过“避免非合成动画”Lighthouse 审计。
date: 2020-08-12
web_lighthouse:
  - non-composited-animations
---

在低端手机上，或当主线程上运行高性能任务时，非合成动画可能会出现卡顿（即不流畅）。卡顿的动画会提高页面的 [Cumulative Layout Shift](/cls/) (CLS)。降低 CLS 将提高 Lighthouse Performance 得分。

## 背景

浏览器的用来将 HTML、CSS 和 JavaScript 转换为像素的算法统称为*渲染流水线*。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/68xt0KeUvOpB8kA1OH0a.jpg", alt="渲染流水线包含以下顺序步骤：JavaScript、样式、布局、绘制、合成。", width="800", height="122 "%} <figcaption>渲染流水线。</figcaption></figure>

如果您不了解渲染流水线每个步骤的含义，那也没关系。现在要了解的重点是，在渲染流水线的每一步，浏览器都使用上一个操作的结果来创建新数据。例如，如果代码执行一些触发“布局”的操作，则“绘制”和“合成”步骤需要再次运行。非合成动画是触发渲染流水线较早步骤之一（“样式”、“布局”或“绘制”）的动画。非合成动画的性能更差，因为它们迫使浏览器做更多工作。

查看以下资源以深入了解渲染流水线：

- [深入了解现代 Web 浏览器（第 3 部分）](https://developer.chrome.com/blog/inside-browser-part3/)
- [简化绘制的复杂度、减小绘制区域](/simplify-paint-complexity-and-reduce-paint-areas/)
- [坚持仅合成器的属性和管理层计数](/stick-to-compositor-only-properties-and-manage-layer-count/)

## Lighthouse 如何检测非合成动画

当动画无法合成时，Chrome 会将失败原因报告给 DevTools 跟踪，Lighthouse 会进行读取。Lighthouse 将列出具有未合成动画的 DOM 节点以及每个动画的失败原因。

## 如何确保合成动画

请参阅[坚持仅合成器的属性和管理层计数](/stick-to-compositor-only-properties-and-manage-layer-count/)和[高性能动画](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)。

## 资源

- [*避免非合成动画*审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/non-composited-animations.js)
- [坚持仅合成器的属性和管理层计数](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [高性能动画](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [简化绘制的复杂度、减小绘制区域](/simplify-paint-complexity-and-reduce-paint-areas/)
- [深入了解现代 Web 浏览器（第 3 部分）](https://developer.chrome.com/blog/inside-browser-part3/)

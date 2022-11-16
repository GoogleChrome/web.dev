---
layout: post
title: 避免 DOM 过大
description: 了解大型 DOM 如何降低网页性能以及如何在加载时减小 DOM 的大小。
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - DOM 大小
tags:
  - memory
---

大型 DOM 树可能会以多种方式降低页面性能：

- **网络效率和加载性能**

    大型 DOM 树通常包含许多在用户首次加载页面时不可见的节点，这会增加用户的数据成本和减慢加载速度，但其实并非必要。

- **运行时性能**

    当用户和脚本与页面交互时，浏览器必须不断[重新计算节点的位置和样式](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli)。大型 DOM 树与复杂的样式规则相结合，会严重减慢渲染速度。

- **内存性能**

    如果 JavaScript 使用通用查询选择器，例如 `document.querySelectorAll('li')`，您可能会在不知不觉中存储对大量节点的引用，这可能会严重超出用户设备的内存容量。

## Lighthouse DOM 大小审核为何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会报告页面的总 DOM 元素数量，页面的最大 DOM 深度及其最大子元素：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SUCUejhAE77m6k2WyI6D.png", alt="Lighthouse 避免 DOM 过大审核的截图", width="800", height="363" %}</figure>

Lighthouse 使用 DOM 树标记页面：

- 当 body 元素有超过约 800 个节点时发出警告。
- 当 body 元素有超过约 1400 个节点时出错。

{% include 'content/lighthouse-performance/scoring.njk' %}

## 如何优化 DOM 大小

通常，仅在需要时才创建 DOM 节点，当不再需要时，应销毁节点。

如果您当前正在传送大型 DOM 树，请尝试加载您的页面并注意显示了哪些节点。也许您可以从最初加载的文档中删除未显示的节点，而仅在发生相关的用户交互（例如，滚动或单击按钮）之后创建这些节点。

如果您在运行时创建 DOM 节点， [子树修改 DOM 更改断点](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#dom)可以帮助您确定创建节点的时间。

如果无法避免使用大型 DOM 树，另一种提高渲染性能的方法是简化 CSS 选择器。有关更多信息，请参阅 Google 的[减小样式计算的范围和复杂性](/reduce-the-scope-and-complexity-of-style-calculations/)。

## 针对堆栈的具体指导

### Angular

如果要渲染大型列表，请使用组件开发工具包 (CDK) 中的[虚拟滚动](/virtualize-lists-with-angular-cdk/)。

### React

- 如果在页面上渲染许多重复元素，[`react-window`](/virtualize-long-lists-react-window/) 之列的“窗口化”库可以最大限度减少创建的 DOM 节点的数量。
- 使用 [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action)、[`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) 或 [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) 最大限度减少非必要的重新渲染。
- 如果使用 `Effect` 挂钩来提高运行时性能，则仅在某些依赖项发生更改后[跳过效果](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。

## 资源

- [**避免 DOM 过大审核**的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/dom-size.js)
- [减小样式计算的范围和复杂性](/reduce-the-scope-and-complexity-of-style-calculations/)

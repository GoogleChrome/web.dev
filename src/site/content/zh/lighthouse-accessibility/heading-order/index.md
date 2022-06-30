---
layout: post
title: 标题元素没有按降序顺序排列
description: 了解如何通过正确构建标题元素来确保辅助技术用户可以轻松浏览您的网页。
date: 2019-10-17
updated: 2020-05-07
web_lighthouse:
  - heading-order
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## Lighthouse 标题级别审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记标题跳过一级或多级的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4dd4TvMxSF6tYJ0wGM64.png", alt="显示标题跳级的 Lighthouse 审计", width="800", height="206" %}</figure>

例如，对页面标题使用 `<h1>` 元素，接着对页面的主要部分使用 `<h3>` 元素，将导致审计失败，因为跳过了 `<h2>` 级别：

```html
<h1>Page title</h1>
  <h3>Section heading 1</h3>
  …
  <h3>Section heading 2</h3>
  …
```

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何修复结构不良的标题

- 使所有标题元素遵循反映内容结构的逻辑数字顺序。
- 确保您的标题文本清楚地传达了相关部分的内容。

例如：

```html
<h1>Page title</h1>
<section>
  <h2>Section Heading</h2>
  …
    <h3>Sub-section Heading</h3>
</section>
```

检查标题结构的一种方法是提出以下问题：“如果有人只使用标题为我的页面创建大纲，这有意义吗？”

您还可以使用微软的 <a href="https://accessibilityinsights.io/" rel="noopener">Accessibility Insights 扩展</a>等工具来可视化您的页面结构并捕获无序的标题元素。

{% Aside 'caution' %} 开发人员有时会跳过标题级别以实现所需的视觉风格。例如，他们可能会使用 `<h3>` 元素，因为他们觉得 `<h2>` 文本太大。这被认为是一种**反模式**。相反，使用正确排序的标题结构并使用 CSS 来根据需要对标题进行视觉样式化。 {% endAside %}

有关更多信息，请参阅[标题和陆标](/headings-and-landmarks)帖文。

## 资源

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/heading-order.js" rel="noopener"><strong>标题跳级</strong>审计的源代码</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/heading-order" rel="noopener">标题级别应逐一增加 (Deque University)</a>

---
layout: post
title: '`<meta name="viewport">` 元素中使用了 `[user-scalable="no"]` ，或者 `[maximum-scale]` 属性小于 `5`'
description: 了解如何通过确保不禁用浏览器缩放功能使网页更易于访问。
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - "\tmeta-viewport"
---

`<meta name="viewport">` 元素的 `user-scalable="no"` 参数会禁用网页上的浏览器缩放。`maximum-scale` 参数会限制用户可以缩放的量。对于依赖浏览器缩放来查看网页内容的视力不佳的用户来说，这两者都是有问题的。

## Lighthouse 浏览器缩放审计失败的原因

Lighthouse 可以标记禁用浏览器缩放的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="Lighthouse 审计显示 viewport 禁用文本缩放和页面缩放", width="800", height="227" %}</figure>

如果页面包含 `<meta name="viewport">` 标签并有以下内容之一，则该页面的审计会失败：

- 带有 `user-scalable="no"` 参数的`content` 属性
- `maximum-scale` 参数设置为小于 `5` 的 `content` 属性

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何避免禁用浏览器缩放

从 viewport 元标签中删除 `user-scalable="no"` 参数，并确保将 `maximum-scale` 参数设置为 `5` 或更大。

## 资源

- [**在 `<meta name="viewport">` 元素中使用 `[user-scalable="no"]` 或 `[maximum-scale]` 属性小于 5** <br> 审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/meta-viewport.js)
- [不得禁用缩放 (Deque University)](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)

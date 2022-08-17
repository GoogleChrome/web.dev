---
layout: post
title: 没有带 `width` 或 `initial-scale` 的 `<meta name="viewport">` 标记
description: 了解有关“没有带 width 或 initial-scale 的 <meta name="viewport"> 标记”Lighthouse 审计的信息。
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - viewport
---

许多搜索引擎根据页面对移动设备的友好程度对页面进行排名。如果没有 [viewport meta 标记](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)，移动设备会以典型的桌面屏幕宽度呈现页面，然后缩小页面，使其难以阅读。

设置  viewport meta 标记可让您控制视口的宽度和缩放比例，以便在所有设备上正确调整大小。

## Lighthouse  viewport meta 标记审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记出没有  viewport meta 标记的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g9La56duNlpHZntDnzY9.png", alt="Lighthouse 审计显示页面缺少 viewport", width="800", height="76" %}</figure>

除非满足以下所有条件，否则页面将无法通过审计：

- 文档的 `<head>` 包含 `<meta name="viewport">` 标记。
-  viewport meta 标记包含 `content` 属性。
- `content` 属性的值包括文本 `width=`。

Lighthouse*不会*检查 `width` 是否等于 `device-width`，也不会检查 `initial-scale` 键值对。但是，您仍然需要同时包含这两个信息，才能让页面正确呈现在移动设备上。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 如何添加 viewport meta 标记

将带有适当键值对的 viewport `<meta>` 标记添加到页面的 `<head>` 中：

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …
```

以下是每个键值对的作用：

- `width=device-width` 将视口的宽度设置为设备的宽度。
- `initial-scale=1` 设置用户访问页面时的初始缩放级别。

## 资源

- [**具有带 `width` 或 `initial-scale` 的 `<meta name="viewport">` 标记**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/viewport.js)
- [响应式网页设计基础](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport)
- [使用  viewport meta 标记控制移动浏览器上的布局](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)

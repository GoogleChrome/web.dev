---
layout: codelab
title: 使用 lazysizes 延迟加载屏幕外图像
authors:
  - katiehempenius
description: 在此 Codelab 中，了解如何使用 lazysizes 仅加载处于当前视口中的图像。
date: 2018-11-05
glitch: lazysizes
related_post: use-lazysizes-to-lazyload-images
tags:
  - performance
---

延迟加载是一种进行等待直到需要资源时才进行加载的方法，而不是提前加载资源。这可以减少初始页面加载时需要加载和解析的资源量，从而提高性能。

在初始页面加载期间屏幕外的图像是此技术的理想候选者。最重要的是，[lazysizes](https://github.com/aFarkas/lazysizes) 让该技术成为非常简单的实现策略。

## 将 lazysizes 脚本添加到页面

{% Instruction 'remix' %}

`lazysizes.min.js` 已被下载并添加到该 Glitch 中。要将其包含在页面中：

- 将以下 `<script>` 标签添加到 `index.html` ：

```html/0
  <script src="lazysizes.min.js" async></script>
  <!-- Images End -->
</body>
```

{% Aside %} [lazysizes.min.js](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js) 文件已经添加到本项目中，无需单独添加。您刚刚添加的脚本可以使用此脚本。 {% endAside %}

当用户滚动页面时，lazysizes 将智能地加载图像，并优先考虑用户即将浏览到的图像。

## 指示要延迟加载的图像

- 将 `lazyload` 类添加到应延迟加载的图像中。此外，将 `src` 属性改为 `data-src`。

例如，对 `flower3.png` 的更改如下所示：

```html/1/0
<img src="images/flower3.png" alt="">
<img data-src="images/flower3.png" class="lazyload" alt="">
```

对于此示例，请尝试延迟加载 `flower3.png` 、`flower4.jpg` 和 `flower5.jpg`。

{% Aside %} 您可能想知道为什么需要将 `src` 属性更改为 `data-src`。如果不更改此属性，则所有图像将立即加载而不是延迟加载。`data-src` 不是浏览器识别的属性，所以当浏览器遇到具有该属性的图片标签时，它不会加载图片。在这种情况下，这是一件好事，因为它允许 lazysizes 脚本决定何时加载图像，而不是浏览器决定。 {% endAside %}

## 实现方式

就是这样！要查看这些更改的实际效果，请按照以下步骤操作：

{% Instruction 'preview' %}

- 打开控制台，找到刚刚添加的图像。当您向下滚动页面时，它们的类应该从 `lazyload` 改变为 `lazyloaded`。

{% Img src="image/admin/yXej5KAOMzoqoQAB2paq.png", alt="延迟加载的图像", width="428", height="252" %}

- 向下滚动页面时，注视网络面板，可以看到图像文件逐个添加。

{% Img src="image/admin/tcQpLeAubOW1l42eyXiW.png", alt="延迟加载的图像", width="418", height="233" %}

## 使用 Lighthouse 进行验证

最后，最好使用 Lighthouse 来验证这些更改。Lighthouse 的“延迟屏幕外图像”性能审核将提醒您是否忘记了向任何屏幕外图像添加延迟加载。

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. 验证**延迟屏幕外图像**审核已通过。

{% Img src="image/admin/AWMJnCEi3IAgANHhTgiC.png", alt="在 Lighthouse 中'通过有效编码图像'审核", width="800", height="774" %}

成功！您已使用 lazysizes 延迟加载了您页面上的图像。

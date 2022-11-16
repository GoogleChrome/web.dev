---
layout: post
title: 显示纵横比不正确的图像
description: 了解如何以正确的纵横比显示响应式图像。
web_lighthouse:
  - image-aspect-ratio
date: 2019-05-02
updated: 2020-04-29
---

如果渲染图像的[纵横比](https://en.wikipedia.org/wiki/Aspect_ratio_(image))与其源文件（*自然*纵横比）的纵横比存在显著不同，那么呈现的图像会很失真，可能会造成很不愉快的用户体验。

## Lighthouse 图像纵横比审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记出其渲染尺寸与以自然比例渲染时的预期尺寸相差超过几个像素的图像：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OSV0HmZeoy84Tf0Vrt9o.png", alt="Lighthouse 审计显示展示的图像纵横比不正确", width="800", height="198" %}</figure>

图像纵横比不正确的常见原因有两个：

- 图像被设置为与源图像尺寸不同的显式宽度和高度值。
- 图像的宽度和高度被设为可变大小容器的百分比。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 确保图像以正确的纵横比显示

### 使用图像 CDN

图像 CDN 可以更轻松地将创建不同大小版本图像的过程自动化。查看[使用图像 CDN 优化图像](/image-cdns/)来了解基本情况，并查看[如何安装 Thumbor 图像 CDN](/install-thumbor/)来了解 codelab 实践。

### 检查影响图像纵横比的 CSS

如果您找不到导致纵横比不正确的 CSS，Chrome DevTools 可以为您显示影响给定图像的 CSS 声明。有关详细信息，请参阅 Google 的[《仅查看实际应用于元素的 CSS》](https://developer.chrome.com/docs/devtools/css/reference/#computed)页面。

### 检查图像在 HTML 中的`width`和`height`属性

如有可能，最好在 HTML 页面中指定每个图像的`width`和`height`属性，以便浏览器为图像分配空间。这种方法有助于确保图像加载后图像下方的内容不会发生偏移。

但是，如果您使用的是响应式图像，那么在 HTML 中指定图像尺寸可能会很困难，因为您无法在知道视区尺寸之前知道宽度和高度的值。请考虑使用 [CSS Aspect Ratio](https://www.npmjs.com/package/css-aspect-ratio) 库或[纵横比框](https://css-tricks.com/aspect-ratio-boxes/)来保留响应式图像的纵横比。

最后，查看[以正确尺寸提供图像](/serve-images-with-correct-dimensions)一文，了解如何为每个用户的设备提供合适尺寸的图像。

## 资源

- [**显示纵横比不正确的图像**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/image-aspect-ratio.js)
- [CSS Aspect Ratio](https://www.npmjs.com/package/css-aspect-ratio)
- [纵横比框](https://css-tricks.com/aspect-ratio-boxes/)
- [以正确尺寸提供图像](/serve-images-with-correct-dimensions)

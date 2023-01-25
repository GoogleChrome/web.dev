---
layout: post
title: 使用媒体查询优化 CSS 背景图像
authors:
  - demianrenzulli
description: 使用媒体查询发送仅有最低所需大小要求的图像，这种技术通常称为响应式图像。
date: 2020-03-05
updated: 2020-03-05
tags:
  - performance
---

许多站点会请求尚未针对某些屏幕进行优化的大量资源（例如图像），还会发送一些大型 CSS 文件，而其中所包含的样式某些设备可能永远也不会使用。因此，现在流行使用一种媒体查询技术，用于将定制的样式表和资产发送到各种屏幕，从而减少传输给用户的数据量并提高页面加载性能。本指南将向您展示如何使用媒体查询发送仅有最低所需大小要求的图像，这种技术通常称为**响应式图像**。

## 先决条件

本指南假设您非常熟悉 [Chrome DevTools](https://developer.chrome.com/docs/devtools/)。如果您愿意，可以改用其他浏览器的 DevTools。只需将本指南中的 Chrome DevTools 屏幕截图映射回您所选浏览器中的相关功能。

## 了解响应式背景图像

首先，分析一下未优化演示的网络流量：

1. 在一个新 Chrome 标签中打开[未优化的演示](https://use-media-queries-unoptimized.glitch.me/)。{% Instruction 'devtools-network', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Aside %}如果您需要有关 DevTools 的更多帮助，请查看[使用 Chrome DevTools 检查网络活动](https://developer.chrome.com/docs/devtools/network/)。{% endAside %}

您会看到请求的唯一图像为 `background-desktop.jpg`，大小为 **1006KB**：

<figure>{% Img src="image/admin/K8P4MHp2FSnZYTw3ZVkG.png", alt="DevTools 未优化背景图像的网络跟踪。", width="800", height="126" %}</figure>

调整浏览器窗口的大小，并发现网络日志未显示该页面发出的任何新请求。这表示所有屏幕尺寸都使用相同的图像背景。

您可以在 [style.css](https://use-media-queries-unoptimized.glitch.me/style.css) 中看到控制背景图像的样式：

```css
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

所使用的每个属性的含义如下：

- `background-position: center center`：垂直和水平居中图像。
- `background-repeat: no-repeat`：仅显示图像一次。
- `background-attachment: fixed`：避免背景图像滚动。
- `background-size: cover`：调整图像大小以覆盖整个容器。
- `background-image: url(images/background-desktop.jpg)`：图片的 URL。

结合使用后，这些样式会告诉浏览器调整背景图像适应不同的屏幕高度和宽度。这是实现响应式背景的第一步。

对所有屏幕尺寸使用一个背景图像具有一定限制性：

- 无论屏幕尺寸如何，发送的字节数是相同的，即使对于某些设备（如手机），更小、更轻的图像背景看起来也一样好。通常，您希望发送尽可能小的图像，但在用户屏幕上仍然看起来不错，从而提高性能并保存用户数据。
- 在较小的设备中，图像将被拉伸或剪切以覆盖整个屏幕，可能会向用户隐藏背景的相关部分。

在下一节中，您将学习如何根据用户的设备应用优化来加载不同的背景图像。

## 使用媒体查询

使用媒体查询是一种常用技术，用于声明仅适用于特定媒体或设备类型的样式表。实施方法为使用 [@media 规则](https://developer.mozilla.org/docs/Web/CSS/@media)，允许您定义一组断点，可在其中定义特定样式。如果满足 `@media` 规则定义的条件（例如，特定屏幕宽度），将应用在断点内定义的样式组。

可以使用以下步骤将媒体查询应用于[站点](https://use-media-queries-unoptimized.glitch.me/)，以便根据请求页面的设备的最大宽度使用不同的图像。

- 在 `style.css` 中，移除包含背景图像 URL 的行：

```css//4
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

- 接下来，根据移动设备、平板电脑和桌面设备屏幕通常所具备的常见尺寸（以像素为单位），为每种屏幕宽度创建一个断点：

对于移动设备：

```css
@media (max-width: 480px) {
    body {
        background-image: url(images/background-mobile.jpg);
    }
}
```

对于平板电脑：

```css
@media (min-width: 481px) and (max-width: 1024px) {
    body {
        background-image: url(images/background-tablet.jpg);
    }
}
```

对于桌面设备：

```css
@media (min-width: 1025px) {
    body {
	    background-image: url(images/background-desktop.jpg);
   }
}
```

在浏览器中打开优化版本 [style.css](https://use-media-queries-optimized.glitch.me/style.css) 以查看所做的更改。

{% Aside %}优化演示中使用的图像已调整大小以适应不同的屏幕尺寸。本指南并未介绍如何调整图像大小，如果您想要了解更多相关信息，可查看[响应式图像服务指南](/serve-responsive-images/)，其中介绍了一些有用工具，例如 [sharp npm 包](https://www.npmjs.com/package/sharp)和 [ImageMagick CLI](https://www.imagemagick.org/script/index.php)。{% endAside %}

## 测量不同设备

下一步，在不同的屏幕尺寸和模拟移动设备中可视化生成的站点：

1. 在一个新的 Chrome 标签页中打开[优化的网站](https://use-media-queries-optimized.glitch.me/)。
2. 将您的视区缩小一些（小于 `480px`）。{% Instruction 'devtools-network', 'ol' %} {% Instruction 'reload-page', 'ol' %}请注意 `background-mobile.jpg` 图像的请求方式。
3. 将您的视口放大一些。如果宽度超过 `480px`，请注意 `background-tablet.jpg` 的请求方式。如果旦宽度超过 `1025px`，请注意 `background-desktop.jpg` 的请求方式。

浏览器屏幕的宽度改变后，会请求新的图像。

特别是当宽度低于在移动断点中定义的值 (480px) 时，您会看到以下网络日志：

<figure>{% Img src="image/admin/jd2kHIefYf91udpFEmvx.png", alt="DevTools 优化背景图像的网络跟踪。", width="800", height="125" %}</figure>

新的移动设备背景大小比桌面设备背景**小 67%**。

## 总结

在本指南中，您已经学会了应用媒体查询来请求根据特定屏幕尺寸定制的背景图像，还学会在较小设备（如手机）上访问网站时节省字节。您使用 `@media` 规则来实施响应式背景。这种技术受到所有浏览器的广泛支持。CSS 新功能 [image-set()](https://www.w3.org/TR/css-images-4/#image-set-notation)，可以用于通过较少代码行实现相同目的。在撰写本文时，并非所有浏览器都支持此功能，但您可能希望密切关注对此功能采纳方面的进展，因为它可以代表此技术的一个有趣替代方案。

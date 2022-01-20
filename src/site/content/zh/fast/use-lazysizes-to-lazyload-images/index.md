---
layout: post
title: 使用 lazysizes 延迟加载图像
authors:
  - katiehempenius
description: 延迟加载是根据需要加载资源的策略，而不是提前加载。这种方法在初始页面加载期间释放资源，可以避免加载从未不使用的资产。
date: 2018-11-05
updated: 2019-04-10
codelabs:
  - codelab-use-lazysizes-to-lazyload-images
tags:
  - performance
  - images
feedback:
  - api
---

{% Aside 'note' %} 浏览器级延迟加载已经正式推出！请参阅[Web 的内置延迟加载](/browser-level-image-lazy-loading/)一文来了解如何使用`loading`属性，以及对尚不支持该功能的浏览器使用 lazysizes 作为应急方案。 {% endAside %}

**延迟加载**是根据需要加载资源的策略，而不是提前加载。这种方法在初始页面加载期间释放资源，可以避免加载从未不使用的资产。

在初始页面加载期间屏幕外的图像是此技术的理想候选者。最重要的是，[lazysizes](https://github.com/aFarkas/lazysizes) 让该技术成为非常简单的实现策略。

## 什么是 lazysizes？

[lazysizes](https://github.com/aFarkas/lazysizes) 是最流行的延迟加载图像库。它是一个脚本，可以在用户浏览网页时智能地加载图像，并对用户很快会遇到的图像进行优先级排序。

## 添加 lazysizes

添加 lazysizes 很简单：

- 将 lazysizes 脚本添加到网页。
- 选择要延迟加载的图像。
- 更新这些图像的`<img>`和/或`<picture>`标签。

### 添加 lazysizes 脚本

将 lazysizes [脚本](https://github.com/aFarkas/lazysizes/blob/gh-pages/lazysizes.min.js)添加到网页：

```html
<script src="lazysizes.min.js" async></script>
```

### 更新`<img>`和/或`<picture>`标签

**`<img>`标签说明**

**之前：**

```html
<img src="flower.jpg" alt="">
```

**之后：**

```html
<img data-src="flower.jpg" class="lazyload" alt="">
```

更新`<img>`标签时会进行两项更改：

- **添加`lazyload`类**：这会向lazysizes 表明应该延迟加载图像。
- **将`src`属性改为`data-src`** ：在加载图像时，lazysizes 代码会使用`data-src`属性中的值设置图像的`src`属性。

**`<picture>`标签说明**

**之前：**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

**之后：**

```html
<picture>
  <source type="image/webp" data-srcset="flower.webp">
  <source type="image/jpeg" data-srcset="flower.jpg">
  <img data-src="flower.jpg" class="lazyload" alt="">
</picture>
```

更新`<picture>`标签时会进行两项更改：

- 向`<img>`标签添加`lazyload`类。
- 将`<source>`标签的`srcset`属性改为`data-srcset` 。

{% Aside 'codelab' %}[使用 lazysizes 仅加载当前视区中的图像](/codelab-use-lazysizes-to-lazyload-images)。 {% endAside %}

## 验证

打开 DevTools 并向下滚动页面以查看这些更改的实际效果。在滚动时，您应该会看到新的网络请求发生，并且`<img>`标记类从`lazyload`变成了`lazyloaded` 。

此外，您可以使用 Lighthouse 来验证是否确保延迟加载任何屏幕外图像。运行 Lighthouse 性能审计（ **Lighthouse &gt; Options &gt; Performance** ）并查找**延迟加载屏幕外图像**审计的结果。

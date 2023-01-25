---
title: 使用 CSS 的 mask-image 属性对图像应用不同的效果
subhead: CSS 遮罩使您可以选择使用图像作为遮罩层。这意味着您可以使用图像、SVG 或渐变作为遮罩，无需图像编辑器即可创建有趣的效果。
description: CSS 遮罩使您可以选择使用图像作为遮罩层。这意味着您可以使用图像、SVG 或渐变作为遮罩，无需图像编辑器即可创建有趣的效果。
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: 戴着口罩的泰迪熊。
tags:
  - blog
  - css
feedback:
  - api
---

当您使用 `clip-path` 属性[剪切元素](/css-clipping)时，剪切区域将变得不可见。相反，如果您想让图像的一部分变得不透明或对其应用一些其他效果，则需要使用遮罩。这篇文章介绍了 [`mask-image`](https://developer.mozilla.org/docs/Web/CSS/mask-image) 属性的使用方法。它允许您指定用作遮罩层的图像，并提供了三个选项。您可以将图像文件、SVG 或渐变用作遮罩。

## 浏览器兼容性

大多数浏览器仅部分支持标准 CSS 遮罩属性。除了标准属性之外，您还需要使用 `-webkit-` 前缀以实现最好的浏览器兼容性。请参阅[《我可以使用 CSS 遮罩吗？》](https://caniuse.com/#feat=css-masks)获取完整的浏览器支持信息。

虽然使用前缀属性的浏览器支持很好，但当使用遮罩使图像顶部的文本可见时，请注意如果遮罩不可用时会出现什么情况。这或许值得使用功能查询来检测对 `mask-image` 或 `-webkit-mask-image` 的支持，并在添加遮罩版本前提供可读的回退。

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* code that requires mask-image here. */
}
```

## 用图像进行遮罩

`mask-image` 属性的工作方式与 `background-image` 属性类似。使用 `url()` 的值传入图像。您的遮罩图像需要具有透明或半透明区域。

完全透明的区域将导致该区域下方的图像部分不可见。但是，使用半透明的区域将允许一些原始图像显示出来。您可以在下面的 Glitch 中看到不同之处。第一张图是没有遮罩的气球的原始图像。第二个图像应用了遮罩，它在完全透明的背景上覆盖了一颗白色星星。第三张图片的背景上有一颗白色的星星，具有渐变透明度。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&amp;previewSize=100" title="mask-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

在本例中，我还使用了值为 `cover` 的 `mask-size`属性。此属性的用法与 [`background-size`](https://developer.mozilla.org/docs/Web/CSS/background-size) 相同。您可以使用关键字 `cover` 和 `contain`，或者使用任何有效的长度单位或百分比为背景指定大小。

您也可以像重复背景图像一样重复蒙版，以便将小图像用作重复图案。

## 使用 SVG 进行遮罩

除了图像文件之外，您还可以使用 SVG 进行遮罩。有几种方法可以实现这一点。第一种方法是在 SVG 中包含一个 `<mask>` 属性，并在 `mask-image` 属性中引用该元素的 ID。

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Balloons">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="使用 SVG 蒙版的示例", width="699", height="490" %}</figure>

这种方法的优点是可以对任何 HTML 元素应用遮罩，而不仅限于图像。不幸的是，Firefox <br> 是唯一支持这种方法的浏览器。

但是我们并没有损失，因为对于最常见的遮罩图像场景，我们可以将图像包含在 SVG 中。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&amp;previewSize=100" title="mask-image-svg-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 渐变遮罩

使用 CSS 渐变作为遮罩是实现遮罩区域的一种优雅方式，无需费心创建图像或 SVG。

例如，用作遮罩的简单线性渐变可以确保图像的底部不会在标题下方太暗。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&amp;previewSize=100" title="mask-linear-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

您可以使用任何受支持的渐变类型，并随心所欲地发挥创意。下一个示例使用径向渐变创建圆形遮罩以照亮字幕后面。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&amp;previewSize=100" title="mask-radial-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 使用多个遮罩

与背景图像一样，您可以指定多个遮罩来源，将它们组合起来以获得想要的效果。如果您想使用由 CSS 渐变生成的图案作为遮罩，这种方法将特别有用。这些通常会使用多个背景图像，因此可以轻松转换为遮罩。

例如，我在[这篇文章](https://cssgradient.io/blog/gradient-patterns/)中发现了一个不错的棋盘格图案。使用背景图像的代码如下所示：

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

要将其或为背景图像设计的任何其他模式转换为遮罩，您需要将 `background-*` 属性替换为相关的 `mask` 属性，包括 `-webkit` 前缀的属性。

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

通过将渐变图案应用于图像，可以产生一些非常好的效果。尝试重新混合 Glitch 并测试其他遮罩方式。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&amp;previewSize=100" title="mask-checkers on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

除了剪切外，CSS 遮罩是一种无需使用图形处理程序即可为图像和其他 HTML 元素添加兴趣点的方法。

*<span>照片：<a href="https://unsplash.com/@juliorionaldo">Julio Rionaldo</a>；来源：Unsplash</span>。*

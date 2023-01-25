---
title: min()、max() 和 clamp()：今天要使用的三个逻辑 CSS 函数
subhead: 了解如何使用这些支持良好的 CSS 函数控制元素大小，以及保持适当的间距和实现流畅的排版。
authors:
  - una
date: 2020-10-14
hero: image/admin/aVL3BEXD3AF9fFzPGKMf.jpg
alt: 桌子上的一组工具。
description: Min、max 和 clamp 提供了一些强大的 CSS 功能，可让您以更少的代码实现响应性更佳的样式。本文将讨论如何使用这些支持良好的 CSS 数学函数来控制元素大小，并保持适当的间距和实现流畅的排版。
tags:
  - blog
  - css
  - layout
feedback:
  - api
---

随着响应式设计的不断发展，界面变得越来越精细，CSS 也在不断发展，并且为作者提供的控制能力也越来越强大。现代浏览器支持 [`min()`](https://developer.mozilla.org/docs/Web/CSS/min)、[`max()`](https://developer.mozilla.org/docs/Web/CSS/max) 和 [`clamp()`](https://developer.mozilla.org/docs/Web/CSS/clamp) 函数，它们是让创作网站和应用程序更具动态性和响应性的一些最新工具。

谈到灵活和流畅的排版、受控制的元素大小调整和保持适当的间距，`min()`、`max()` 和 `clamp()` 可以提供帮助。

## 背景

<blockquote>
  <p>数学函数 <code>calc()</code>、<code>min()</code>、<code>max()</code> 和 <code>clamp()</code> 支持将使用加法 (+)、减法 (-)、乘法 (*) 和除法 (/) 的数学表达式作为组件值</p>
  <cite><p data-md-type="paragraph"><a href="https://www.w3.org/TR/css-values-4/#calc-notation">CSS 值和单位级别 4</a></p></cite>
</blockquote>

2019 年 4 月，Safari 成为第一款[包含](https://bugs.webkit.org/show_bug.cgi?id=167000)整套函数的浏览器，当年晚些时候，Chromium 也在版本 79 中包含了这些函数。这一年，随着 Firefox [75](https://bugzilla.mozilla.org/show_bug.cgi?id=1519519) 发布，主要浏览器基本上都已经开始支持 `min()`、`max()` 和 `clamp()`。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIgePP41Quh7ubYh54vo.png", alt="", width="800", height="246" %}<figcaption> <a href="https://caniuse.com/css-math-functions">Caniuse</a> 支持表格。</figcaption></figure>

## 用法

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-demo.mp4">
  </source></video>
  <figcaption>显示 min() 函数如何根据选项列表及其父项选择值。请<a href="https://codepen.io/una/pen/rNeGNVL">参阅 Codepen 上的演示</a>。</figcaption></figure>

您可以在任何有意义的 CSS 表达式的右侧使用 `min()`、`max()` 和 `clamp()`。对于 `min()` 和 `max()`，您要提供一个参数值列表，浏览器则会分别确定哪个是最小值以及哪个是最大值。例如，对于：`min(1rem, 50%, 10vw)`，浏览器会计算这些相对单位中哪一个最小，并将该值用作实际值。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-demo.mp4">
  </source></video>
  <figcaption>显示 max() 函数如何根据选项列表及其父项选择值。请<a href="https://codepen.io/una/pen/RwaZXqR">参阅 Codepen 上的演示</a>。</figcaption></figure>

`max()` 函数从逗号分隔的表达式列表中选择最大值。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-demo.mp4">
  </source></video>
  <figcaption>显示 clamp() 函数如何根据选项列表及其父项选择值。请<a href="https://codepen.io/una/pen/bGpoGdJ">参阅 Codepen 上的演示</a>。</figcaption></figure>

要使用 `clamp()` 输入三个值：最小值、理想值（用于计算的值）和最大值。

只要允许使用 `<length>`、`<frequency>`、`<angle>`、`<time>`、`<percentage>`、`<number>` 或 `<integer>`，您都可以使用这些函数。您可以单独使用这些函数（即 `font-size: max(0.5vw, 50%, 2rem)`），也可以与 `calc()` 结合使用（即 `font-size: max(calc(0.5vw - 1em), 2rem)`），或者组合使用（即 `font-size: max(min(0.5vw, 1em), 2rem)`）。

{% Aside %} 在 `min()`、`max()` 或 `clamp()` 函数内部使用计算时，您可以删除对 `calc()` 的调用。例如，`font-size: max(calc(0.5vw - 1em), 2rem)` 与 `font-size: max(0.5vw - 1em, 2rem)` 的效果相同。{% endAside %}

总结：

- `min(<value-list>)`：从逗号分隔的表达式列表中选择最小值（最小负数）
- `max(<value-list>)`：从逗号分隔的表达式列表中选择最大值（最大正数）
- `clamp(<min>, <ideal>, <max>)`：根据设定的理想值，将值限定在上限与下限之间

我们来看几个例子。

## 理想宽度

Robert Bringhurst 在[《The Elements of Typographic Style》](http://webtypography.net/2.1.2#:~:text=%E2%80%9CAnything%20from%2045%20to%2075,is%2040%20to%2050%20characters.%E2%80%9D)中说：“对于有衬线字体的单列页面，一般认为一行 45 到 75 个字符的长度是比较理想的。”

为了确保文本块不少于 45 个字符，也不超过 75 个字符，请使用 `clamp()` 和 `ch`（[字符前](https://developer.mozilla.org/docs/Web/CSS/length) 0 宽度）单位：

```css
p {
  width: clamp(45ch, 50%, 75ch);
}
```

这样，浏览器就可以确定段落的宽度。它会将宽度设置为 50%，但如果 50% 的宽度小于 `45ch`，则会选择 `45ch`，反之，如果 50% 的宽度比 `75ch` 更宽，则会选择 `75ch`。在本演示中，卡片的尺寸被限定了：

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-width.mp4">
  </source></video>
  <figcaption>使用 clamp() 函数可限定最小和最大宽度。请<a href="https://codepen.io/una/pen/QWyLxaL">参阅 Codepen 上的演示</a>。</figcaption></figure>

只需要使用 `min()` 或 `max()` 函数，您就可以打破这种限制。如果您希望元素使用 `50%` 的宽度，并且不超过 `75ch`（即在较大的屏幕上），则可以这样编写代码：`width: min(75ch, 50%);`。实际上，这是使用 `min()` 函数来设置“最大”大小。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-width.mp4">
  </source></video>
  <figcaption>使用 clamp() 函数来限制最小和最大宽度。</figcaption></figure>

同样，您也可以使用 `max()` 函数来设定最小尺寸，从而让文本清晰易读。例如：`width: max(45ch, 50%);`。这样，浏览器就会选择 `45ch` 或 `50%` 中较大的值，这意味着元素*至少* 为 `45ch`，否则会更大。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-width.mp4">
  </source></video>
  <figcaption>使用 clamp() 函数来限制最小和最大宽度。</figcaption></figure>

## 填充管理

与上述概念相同，`min()` 函数可以设置“最大”值，而 `max()` 函数可以设置“最小”值，您也可以使用 `max()` 来设置最小填充大小。示例来自 [CSS 技巧](https://css-tricks.com/using-max-for-an-inner-element-max-width/)，下面是读者 Caluã de Lacerda Pataca 分享的想法：让元素在较大尺寸的屏幕上进行额外填充，但在较小尺寸的屏幕上保持填充最小（尤其是对于内联填充）。为此，您要使用 `calc()` 并从任意一侧减去最小填充：`calc((100vw - var(--contentWidth)) / 2)`，*或者*使用 max：`max(2rem, 50vw - var(--contentWidth) / 2)`。总之，代码如下：

```css
footer {
  padding: var(--blockPadding) max(2rem, 50vw - var(--contentWidth) / 2);
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-padding.mp4">
  </source></video>
  <figcaption>使用 max() 函数为组件设置最小填充。请<a href="https://codepen.io/chriscoyier/pen/qBZqNKa">参阅 Codepen 上的演示</a>。</figcaption></figure>

## 流畅的排版

为了实现[流畅的排版](https://www.smashingmagazine.com/2016/05/fluid-typography/)，[Mike Riethmeuller](https://twitter.com/mikeriethmuller) 推广了一种技术。该技术使用 `calc()` 函数来设置最小字体大小、最大字体大小，并允许从最小值放大至最大值。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/fliud-type.mp4">
  </source></video>
  <figcaption>使用 clamp() 实现流畅的排版。请<a href="https://codepen.io/una/pen/ExyYXaN">参阅 Codepen 上的演示</a>。</figcaption></figure>

凭借 `clamp()`，您可以更清楚地编写这一段代码。不需要复杂的字符串，浏览器就可以完成这项工作。设置可接受的最小字体大小（例如，标题为 `1.5rem`，最大大小（即 `3rem`）和理想大小为 `5vw`。

现在，我们实现了可随页面视口宽度进行缩放，直到达到限制的最小值和最大值的的排版效果，代码行变得更加简洁：

```css
p {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

{% Aside 'warning' %} 在 [1.4.4 调整文本大小 (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=144#resize-text) 下，利用 `max()` 或 `clamp()` 限制文本大小可能导致 WCAG 失败，因为用户可能无法将文本缩放到其原始大小的 200%。请务必[使用 zoom 测试结果](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html)。{% endAside %}

## 总结

CSS 数学函数 `min()`、`max()` 和 `clamp()` 非常强大，而且支持良好，当您构建响应式 UI 时，这些函数可能大有帮助。如需更多资源，请查看：

- [MDN 上的 CSS 值和单位](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS 值和单位级别 4 规范](https://www.w3.org/TR/css-values-4/)
- [关于内部元素宽度的 CSS 技巧文章](https://css-tricks.com/using-max-for-an-inner-element-max-width/)
- [min()、max()、clamp() 概述，作者：Ahmad Shadeed](https://ishadeed.com/article/css-min-max-clamp/)

Unsplash 上 [@yer_a_wizard](https://unsplash.com/@yer_a_wizard) 的封面图片。

---
title: 盒模型
description: CSS 显示的所有对象都是盒子。因此，了解 CSS 盒模型的工作原理是 CSS 的核心基础。
audio:
  title: CSS 播客   - 001：盒模型
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_001_v2.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

假设有下面这一段 HTML：

```html
<p>I am a paragraph of text that has a few words in it.</p>
```

您为这一段 HTML 编写了下面的 CSS：

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

那么，内容可能会超出您的元素，并且它的宽度为 142 像素，而不是 100 像素。这是为什么？盒模型是 CSS 的核心基础，您要理解它的工作原理以及 CSS 的其他方面会对其产生哪些影响，重要的是，如何控制它来帮助您编写更容易预测的 CSS。

<figure>{% Codepen { user: 'web-dot-dev', id: 'WNRemxN', height: 300 } %}</figure>

总的来说，编写 CSS 或在 Web 上工作时，要记住的一个重点是，CSS 显示的所有对象都是方框。无论是使用 `border-radius` 的看起来像圆形的方框，还是一些简单的文本：要记住的关键点是，它们都是方框。

## 内容和大小

根据 `display` 值、设置的尺寸以及包含的内容，方框具有不同的行为。这种内容可能是更多的方框（由子元素生成），也可能是纯文本内容。无论是哪种方式，默认情况下，内容都会影响方框的大小。

您可以通过使用 **extrinsic sizing** 来控制方框的大小，或者，您也可以继续使用 **intrinsic sizing**，让浏览器根据内容大小来做出决定。

我们来看一个演示，简单了解一下它们的区别。

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoMBL' } %} <figcaption>请注意，当方框使用 extrinsic sizing 时，您可以添加的内容有限制，如果超出限制，内容就会溢出方框的边界。因此，演示中的“awesome”一词溢出了边界。</figcaption></figure>

该演示在一个具有固定尺寸和粗边框的方框中显示“CSS is awesome”。这个方框有宽度，所以它使用的是外部大小。它会控制子内容的大小。但问题在于“awesome”一词对这个方框来说太大了，所以它会溢出到父方框的**边框**外（本课程的后续部分会详细介绍）。防止这种溢出的一种方法是取消设置 `width`，或者在本例中，将宽度设置为 `min-content`，从而允许方框使用内部大小。关键字 `min-content` 会告诉方框将宽度调整为与内容的内部最小宽度（单词“awesome”）一致。这样，方框就可以刚好包含“CSS is awesome”。

我们来看看更复杂的例子，了解不同大小对实际内容的影响：

<figure>{% Codepen { user: 'web-dot-dev', id: 'wvgwOJV', height: 650 } %}</figure>

打开和关闭 intrinsic sizing，了解如何通过 extrinsic sizing 实现更多控制，并利用 extrinsic sizing 来让内容获得更多控制。要查看 intrinsic sizing 和 extrinsic sizing 的效果，请在卡片中添加几句话。当该元素使用 extrinsic sizing 时，您可以添加的内容数量有限制，否则会溢出元素的边界，但是，打开 intrinsic sizing 时，情况并非如此。

默认情况下，该元素设置有 `width` 和 `height` - 均为 `400px`。这些尺寸会为元素内的所有内容实施严格的界限，除非内容对于方框来说太大，否则会发生可见溢出。您可以将花朵图片下方的标题内容更改为超出方框高度的内容（即几行内容），从而查看实际效果。

{% Aside "key-term" %}当内容对它所在的方框来说太大时，我们称之为溢出。利用 `overflow` 属性，您可以管理元素处理处理溢出内容的方式。{% endAside %}

切换到 intrinsic sizing 时，浏览器就会根据方框的内容大小做出决定。使用 intrinsic sizing 时，发生溢出的可能性要小得多，因为方框会根据内容调整自己的大小，而不是尝试调整内容的大小。务必记住，这是浏览器默认的灵活行为。尽管 extrinsic sizing 可以更好地控制表面，但是，在大多数情况下，intrinsic sizing 可以提供最大的灵活性。

## 盒模型的区域

方框由不同的盒模型区域组成，这些区域都会执行特定的工作。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ECuEOJEGnudhXW5JEFih.svg", alt="显示盒模型四个主要区域的图表 - 内容框、填充框、边框和边距框", width="800", height ="547" %}<figcaption>盒模型的四个主要区域：内容框、填充框、边框和边距框。</figcaption></figure>

首先是**内容框**，它是内容所在的区域。正如之前所学：这种内容可以控制父级的大小，因此，它通常是大小最容易发生变化的区域。

**填充框**位于内容框周围，它是 [`padding`](https://developer.mozilla.org/docs/Web/CSS/padding) 属性创建的空间。因为填充位于方框内部，所以，方框的背景在它创建的空间内可见。如果方框设置有溢出规则，例如 `overflow: auto` 或`overflow: scroll`，那么滚动条也会占据该空间。

<figure>{% Codepen { user: 'web-dot-dev', id: 'BaReoEV' } %}</figure>

**边框**位于填充框周围，它的空间被 `border` 值占据。边框是方框的边界，而**边框的边缘**则是可以直观看到的界限。<a href="https://developer.mozilla.org/docs/Web/CSS/border" data-md-type="link">`border`</a> 属性用于可视化元素的框架。

最后一个区域是**边距框**，它是方框周围的空间，由方框的 `margin` 规则定义。[`outline`](https://developer.mozilla.org/docs/Web/CSS/outline) 和 [`box-shadow`](https://developer.mozilla.org/docs/Web/CSS/box-shadow) 属性也会占据了该空间，因为它们在顶部绘制，所以不会影响方框的大小。您可以创建一个 `200px` `outline-width` 的方框，其中包含的所有内容以及边框的大小将完全相同。

<figure>{% Codepen { user: 'web-dot-dev', id: 'XWprGea' } %}</figure>

## 类比解析

盒模型难以理解，所以，我们使用一个类比来回顾一下所学内容。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FBaaJXdnuSkvOx1nB0CB.jpg", alt="三个画框", width="800", height="562" %}</figure>

该图中有三个并排安装在墙上的画框。该图包含关联框架元素和盒模型的标签。

解析一下这个类比：

- 内容框就是画框中的美术作品。
- 填充框是白色衬纸，它位于画框和美术作品之间。
- 边框就是画框，用于为美术作品提供文字边框。
- 边距框是每个画框之间的空间。
- 阴影与边距框占据相同的空间。

## 调试盒模型

浏览器 DevTools 为所选方框的盒模型计算提供可视化界面，从而帮助您了解盒模型的工作原理，重要的是，了解它如何影响正在处理的网站。

继续并在浏览器中尝试执行以下操作：

1. [打开 DevTools](https://developer.chrome.com/docs/devtools/open/)
2. [选择一个元素](https://developer.chrome.com/docs/devtools/css/reference/#select)
3. 显示盒模型调试器

<figure>{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/sKdHrAfqahgWfDVQEBBT.mp4", controls=true %}</figure>

## 控制盒模型

要了解如何控制盒模型，首先，您需要了解浏览器中发生的活动。

每个浏览器都会将用户代理样式表应用到 HTML 文档。使用的 CSS 因浏览器而异，但它们会提供合理的默认值，从而使内容更易于阅读。如果没有定义 CSS，那么，它们会定义元素的外观和行为。用户代理样式中也会设置方框的默认 `display`。例如，如果是在正常流程中，`<div>` 元素的默认 `display` 值是 `block` ，`<li>` 的默认 `display` 值是 `list-item`，而`<span>` 的默认 `display` 值是`inline`。

`inline` 元素具有块边距，但其他元素不会遵守此边距。使用 `inline-block`，这些元素就会遵守块边距，同时元素会保有与 `inline` 元素相同的大部分行为。默认情况下，`block` 项目会填充可用的**行内空间**，而 `inline` 和 `inline-block` 元素则只会与内容一样大。

除了解用户代理样式如何影响每个方框外，您还需要了解 `box-sizing`，它会告诉方框如何计算方框大小。默认情况下，所有元素都具有以下用户代理样式：`box-sizing: content-box;`。

将 `content-box` 作为 `box-sizing` 的值意味着当您设置尺寸时，例如 `width` 和 `height`，会将其应用到**内容框**。如果随后设置 `padding` 和 `border`，则会将这些值增加到内容框的大小。

{% Assessment 'box-model' %}

该方框的实际宽度为 260 像素。由于 CSS 使用默认的 `box-sizing: content-box`，因此，应用的宽度就是内容的宽度，而且会加上两边的 `padding` 和 `border` 值。也就是内容的 200 像素 + 填充的 40 像素 + 边框的 20 像素，从而得到 260 像素的总可见宽度。

不过，您*可以*执行以下修改，使用替代盒模型 `border-box` 来控制这一点：

```css/1
.my-box {
  box-sizing: border-box;
	width: 200px;
	border: 10px solid;
	padding: 20px;
}
```

上述替代盒模型会告诉 CSS 将 `width` 应用到边框（而不是内容框）。这意味着我们的 `border` 和 `padding` 将被*推入*，因此，当您将 `.my-box` 设置为 `200px` 宽度时：它最终就会以 `200px` 的宽度进行渲染。

通过以下交互式演示了解其工作原理。请注意，当您切换 `box-sizing` 值时，它会通过蓝色背景显示方框*内部*应用的 CSS。

<figure>{% Codepen { user: 'web-dot-dev', id: 'oNBvVpM', height: 650 } %}</figure>

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

该 CSS 规则选择文档中的每个元素以及每个 `::before` 和 `::after` 伪元素，同时应用 `box-sizing: border-box`。这意味着每个元素现在都有该替代盒模型。

由于替代盒模型更容易预测，因此，开发人员通常会将此规则添加到重置和归一化器中，如[本文中介绍的示例](https://piccalil.li/blog/a-modern-css-reset)。

## 资源

- [盒模型简介](https://developer.mozilla.org/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [什么是浏览器开发人员工具？](https://developer.mozilla.org/docs/Learn/Common_questions/What_are_browser_developer_tools)

### 用户代理样式表

- [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
- [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
- [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)

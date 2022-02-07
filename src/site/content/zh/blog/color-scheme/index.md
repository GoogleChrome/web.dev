---
title: 使用 `color-scheme` CSS 属性和相应元标记改进深色模式默认样式
subhead: |2-

  开发人员使用 `color-scheme` CSS 属性和相应元标记可以选择其页面使用用户代理样式表的主题特定默认值。
authors:
  - thomassteiner
date: 2020-04-08
updated: 2021-10-19
hero: image/admin/rOe3wxcy28m5DCKcHv7E.jpg
alt: 墙上绘有鸽子，背景为对比鲜明的黑白色。
description: 开发人员使用 color-scheme CSS 属性和对应元标记可以选择其页面使用用户代理样式表（例如表单控件、滚动条）的主题特定默认值，也可选择使用 CSS 系统颜色。同时，此功能还可防止浏览器自行应用任何转换。
tags:
  - blog
  - css
feedback:
  - api
---

## 背景

### `prefers-color-scheme` 用户偏好媒体功能

开发人员使用 [`prefers-color-scheme`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) 用户偏好媒体功能可以完全控制其页面的外观。如果您对它不熟悉，请阅读我的文章 [`prefers-color-scheme` ：Hello darkness, my old friend（你好深色，我的老朋友）](/prefers-color-scheme/)，我在这篇文章里记录了我所知道的关于创造新颖深色模式体验的所有内容。

文章中只简单提到一个难题，便是 `color-scheme` CSS 属性和同名称的相应 meta 标记。它们都允许您选择自己的页面使用用户代理样式表（例如表单控件、滚动条）的主题特定默认值，也可使用 CSS 系统颜色，从而使您的开发工作更轻松。同时，此功能还可防止浏览器自行应用转换。

### 用户代理样式表

在继续之前，我来先简要介绍一下什么是用户代理样式表。大多数情况下，您可以将*用户代理* (UA) 一词视为*浏览器*的一种别致说法。UA 样式表决定了页面的默认观感。顾名思义，UA 样式表取决于相关 UA。您可以查看 [Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)（和 Chromium）的 UA 样式表，并与 [Firefox](https://dxr.mozilla.org/mozilla-central/source/layout/style/res/html.css) 或 [Safari](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)（和 WebKit）的样式表进行比较。通常，UA 样式表在大多数方面都是一致的。例如，都将链接设置为蓝色，将一般文本设置为黑色，将背景颜色设置为白色，但也有重大（甚至有时令人烦恼）差异，例如，如何设置表单控件的样式。

仔细查看 [WebKit 的 UA 样式表](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)以及它对深色模式的作用。（在样式表中全文搜索 "dark"。）样式表提供的默认值会根据深色模式是打开还是关闭而发生变化。为了说明这一点，我们举个例子，一个 CSS 规则，使用 [`:matches`](https://css-tricks.com/almanac/selectors/m/matches/) 伪类和 WebKit 内部变量（例如 `-apple-system-control-background` ）以及 WebKit 内部预处理器指令 `#if defined` ：

```css
input,
input:matches([type="password"], [type="search"]) {
  -webkit-appearance: textfield;
  #if defined(HAVE_OS_DARK_MODE_SUPPORT) &&
      HAVE_OS_DARK_MODE_SUPPORT
    color: text;
    background-color: -apple-system-control-background;
  #else
    background-color: white;
  #endif
  /* snip */
}
```

您会注意到 `color` 和 `background-color` 属性的一些非标准值。`text` 和 `-apple-system-control-background` 都不是有效的 CSS 颜色，而是 WebKit 内部*语义*颜色。

事实证明，CSS 具有标准化语义系统颜色，在 [CSS 颜色模块级别 4](https://drafts.csswg.org/css-color/#css-system-colors) 中指定。例如，[`Canvas`](https://drafts.csswg.org/css-color/#valdef-system-color-canvas)（不要与 `<canvas>` 标记相混淆）用于应用程序内容或文档的背景，而 [`CanvasText`](https://drafts.csswg.org/css-color/#valdef-system-color-canvastext) 用于应用程序内容或文档中的文本。两者一起使用，不应单独使用。

UA 样式表可以使用自己的专有颜色或标准化语义系统颜色，来确定在默认情况下应如何呈现 HTML 元素。如果操作系统设置为深色模式或使用深色主题，则会将 `CanvasText`（或 `text`）有条件地设置为白色，并将 `Canvas`（或 `-apple-system-control-background`）设置为黑色。然后 UA 样式表仅分配以下 CSS 一次，并涵盖浅色和深色模式。

```css
/**
  Not actual UA stylesheet code.
  For illustrative purposes only.
*/
body {
  color: CanvasText;
  background-color: Canvas
}
```

## `color-scheme` CSS 属性

[CSS 颜色调整模块级别 1](https://drafts.csswg.org/css-color-adjust/) 规范引入了一个模型并通过用户代理控制自动颜色调整，目的是处理用户偏好（例如深色模式）、对比度调整或特定的所需配色方案。

通过其中定义的 [`color-scheme`](https://drafts.csswg.org/css-color-adjust/#color-scheme-prop) 属性，元素可以指示它适合渲染的颜色方案。将这些值与用户的偏好进行协调，从而生成影响用户界面 (UI) 事物的所选配色方案（例如表单控件和滚动条的默认颜色）以及 CSS 系统颜色的使用值。当前支持以下值：

- *`normal`* 表示元素完全不知道配色方案，因此应该使用浏览器的默认配色方案呈现该元素。

- *`[light | dark]+`* 表示元素知道且可以处理列出的配色方案，并表达它们之间的排序偏好。

{% Aside 'note' %} 提供这两个关键字表示（作者）优先选择第一个方案，但如果用户更喜欢第二个方案，则也可以接受。 {% endAside %}

在此列表中，`light` 表示浅色方案：背景色浅，前景色深，而 `dark` 则相反：背景色深，前景色浅。

对于所有元素，使用配色方案渲染应使在所有浏览器提供的元素 UI 中使用的颜色与配色方案的意图相匹配。例如滚动条、拼写检查下划线、表单控件等。

{% Aside 'note' %}`color-scheme` CSS 属性可用于 `:root` 级别，也可用于单个元素级别。{% endAside %}

在 `:root` 元素上，使用配色方案渲染还必会影响画布的表面颜色（即全局背景颜色）、`color` 属性的初始值以及系统颜色的使用值，并且还应影响视区的滚动条。

```css
/*
  The page supports both dark and light color schemes,
  and the page author prefers dark.
*/
:root {
  color-scheme: dark light;
}
```

## `color-scheme`  meta 标记

提供 `color-scheme` CSS 属性需要首先下载 CSS（如果此项通过 `<link rel="stylesheet">` 引用）并进行解析。为了帮助用户代理*立即*使用所需配色方案呈现页面背景，还可以提供 `color-scheme` 值（在 [`<meta name="color-scheme">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme) 元素中）。

```html
<!--
  The page supports both dark and light color schemes,
  and the page author prefers dark.
-->
<meta name="color-scheme" content="dark light">
```

## `color-scheme` 和 `prefers-color-scheme` 相结合

由于 meta 标记和 CSS 属性（如果应用于 `:root` 元素）最终会产生相同的行为，我始终建议通过 meta 标记指定配色方案，这样浏览器可以更快地采用首选方案。

虽然绝对基线页面不需要额外的 CSS 规则，但在一般情况下，您仍应该始终将 `color-scheme` 与 `prefers-color-scheme` 结合起来。例如，专有 WebKit CSS 颜色 `-webkit-link`（由 WebKit 和 Chrome 用于经典蓝色链接 `rgb(0,0,238)`）在黑色背景上的对比度不足 2.23:1，并且[不满足](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000) WCAG AA 以及 WCAG AAA [要求](https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels)。

我已经为 [Chrome](https://crbug.com/1066811)、[WebKit](https://bugs.webkit.org/show_bug.cgi?id=209851) 和 [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1626560) 以及 [HTML 标准中的元问题](https://github.com/whatwg/html/issues/5426)报告了 Bug 以解决此问题。

## 与 `prefers-color-scheme` 相互影响

`color-scheme` CSS 属性和相应 meta 标记与 `prefers-color-scheme` 用户首选项媒体功能的相互影响起初可能看起来令人困惑。但事实上，它们在一起配合得非常好。所要了解的最重要的事情是 `color-scheme` 专门确定默认外观，而 `prefers-color-scheme` 则确定可样式化的外观。为了更清楚地说明这一点，假设以下页面内容：

```html
<head>
  <meta name="color-scheme" content="dark light">
  <style>
    fieldset {
      background-color: gainsboro;
    }
    @media (prefers-color-scheme: dark) {
      fieldset {
        background-color: darkslategray;
      }
    }
  </style>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, legere ancillae ne vis.
  </p>
  <form>
    <fieldset>
      <legend>Lorem ipsum</legend>
      <button type="button">Lorem ipsum</button>
    </fieldset>
  </form>
</body>
```

页面上的内联 CSS 代码在一般情况下会将 `<fieldset>` 元素的 `background-color` 设置为 `gainsboro`，也会将该值设置为 `darkslategray`（如果用户优先选择 `dark`，根据 `prefers-color-scheme` 用户偏好媒体功能）。

通过 `<meta name="color-scheme" content="dark light">` 元素，页面会告知浏览器它支持深色和浅色主题，且优先选择深色主题。

根据操作系统被设置为深色模式还是浅色模式，整个页面会基于用户代理样式表在深色中显示浅色，反之亦然。*无需*其他开发人员提供的 CSS 来更改页面的段落文本或背景颜色。

请注意，`<fieldset>` 元素的 `background-color` 根据是否启用深色模式而更改，遵循页面上开发人员提供的内联样式表中的规则。具体为 `gainsboro` 或 `darkslategray`。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSgOIiGRqjw2PvRlVCaV.png", alt="浅色模式页面。", width="800", height="322" %}<figcaption> <strong>浅色模式：</strong>由开发人员和用户代理指定的样式。按照用户代理样式表，文本为黑色，背景为白色。按照内联的开发人员样式表，<code>&lt;fieldset&gt;</code> 元素的 <code>background-color</code> 为 <code>gainsboro</code>。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qqkHz83kerktbDIGCJeG.png", alt="深色模式页面。", width="800", height="322" %}<figcaption><strong>深色模式：</strong>由开发人员和用户代理指定的样式。按照用户代理样式表，文本为白色，背景为黑色。按照内联的开发人员样式表，<code>&lt;fieldset&gt;</code> 元素的 <code>background-color</code> 为 <code>darkslategray</code>。</figcaption></figure>

`<button>` 元素的外观由用户代理样式表控制。它的 `color` 设置为 [`ButtonText`](https://drafts.csswg.org/css-color/#valdef-system-color-buttontext) 系统颜色，`background-color` 和四个 `border-color` 设置为系统颜色 [`ButtonFace`](https://drafts.csswg.org/css-color/#valdef-system-color-buttonface)。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lSNFROIe1P94DlhoVtoV.png", alt="使用 ButtonFace 属性的浅色模式页面。", width="800", height="322" %} <figcaption> <strong>浅色模式：</strong>将 <code>background-color</code> 和各种 <code>border-color</code> 设置为 <a href="https://drafts.csswg.org/css-color/#valdef-system-color-buttonface">ButtonFace</a> 系统颜色。</figcaption></figure>

现在，请注意 `<button>` 元素的 `border-color` 发生变化。*计算*值（针对 `border-top-color` 和 `border-bottom-color`）从 `rgba(0, 0, 0, 0.847)`（偏黑色）切换为 `rgba(255, 255, 255, 0.847)`（偏白色），因为用户代理会根据配色方案动态更新 `ButtonFace`。这同样适用于 `<button>` 元素的 `color`，其设置为相应系统颜色 `ButtonText`。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IogmyIzUhokJgnnxUkPi.png", alt="显示计算出的颜色值与 ButtonFace 匹配。", width="800", height="322" %} <figcaption> <strong>浅色模式：</strong><code>border-top-color</code> 和 <code>border-bottom-color</code> 的计算值（在用户代理样式表中这两个值均设置为 <code>ButtonFace</code>）现在为 <code>rgba(0, 0, 0, 0.847)</code>。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3sU1uZyt3zNhEgw3gpZJ.png", alt="显示计算出的颜色值与 ButtonFace 匹配。", width="800", height="322" %} <figcaption> <strong>深色模式：</strong><code>border-top-color</code> 和 <code>border-bottom-color</code> 的计算值（在用户代理样式表中这两个值均设置为 <code>ButtonFace</code>）现在为 <code>rgba(0, 0, 0, 0.847)</code>。</figcaption></figure>

## 演示

您可以看到应用于大量 HTML 元素 `color-scheme` 的效果（在[故障演示](https://color-scheme-demo.glitch.me/)中）。该演示*特意*显示 WCAG AA 和 WCAG AAA [冲突](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000)（具有[上面警告](#using-color-scheme-in-practice)中提到的链接颜色）。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bqXapQKcNbyE3uwEOELO.png", alt="浅色模式下的演示。", width="800", height="982" %} <figcaption><a href="https://color-scheme-demo.glitch.me/">演示</a>已切换为 <code>color-scheme: light</code>。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9G4hFdtSSwPLOm57zedD.png", alt="深色模式下的演示。", width="800", height="982" %} <figcaption><a href="https://color-scheme-demo.glitch.me/">演示</a>已切换为 <code>color-scheme: dark</code>。请注意具有链接颜色的 WCAG AA 和 WCAG AAA<a href="https://webaim.org/resources/contrastchecker/?fcolor=0000EE&amp;bcolor=000000"> 冲突</a>。</figcaption></figure>

## 鸣谢

`color-scheme` CSS 属性和相应 meta 标记由 [Rune Lillesveen](https://github.com/lilles) 实施。Rune 也是 CSS 颜色调整模块级别 1 规范的共同编辑者。主图作者：[Philippe Leone](https://unsplash.com/@philinit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) 来源：[Unsplash](https://unsplash.com/photos/dbFfEBOCrkU)。

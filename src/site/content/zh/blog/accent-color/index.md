---
layout: post
title: CSS “强调色”
subhead: 使用一行代码将您的品牌颜色带入内置的 HTML 表单输入。
authors:
  - adamargyle
  - jarhar
description: 使用一行代码将您的品牌颜色带入内置的 HTML 表单输入。
date: 2021-08-11
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/WOcuCLCwMr0M2lF17bmm.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/huEpiCoJQ6dAo8rHGsZT.png
tags:
  - blog
  - css
---

当今的 HTML 表单元素[难于自定义](https://codepen.io/GeoffreyCrofte/pen/BiHzp)。感觉好像是在很少或没有自定义样式之间进行选择，或者重置输入样式并从头开始构建。从头开始构建工作量最终会比预期的多得多。还可能导致遗忘元素状态的样式（[不确定](https://developer.mozilla.org/docs/Web/CSS/:indeterminate)），以及内置辅助功能的丢失。完全重新创建浏览器提供的内容可能比您希望承担的工作更多。

```css
accent-color: hotpink;
```

[CSS UI 规范](https://www.w3.org/TR/css-ui-4/#widget-accent)中的 `accent-color` 在这里用一行 CSS 为元素着色，这种方法将您的品牌带入元素，使您免于自定义工作。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CfSS3F1XUsfCHIB86xeE.png", alt="强调色演示的浅色主题截图，其中复选框、单选按钮、范围滑块和进度元素都被着色为热粉色。", width="800", height="548" %}<figcaption><a href="https://codepen.io/web-dot-dev/pen/PomBZdy">演示</a></figcaption></figure>

`accent-color` 属性也适用于 [`color-scheme`](/color-scheme/) ，允许作者为浅色和深色元素着色。在以下示例中，用户激活了深色主题，页面使用 `color-scheme: light dark` ，并使用相同的 `accent-color: hotpink` 作为深色主题的热粉色着色控件。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/3gxeeZoSLY34tsMxkyt9.png", alt="强调色演示的深色主题截图，其中复选框、单选按钮、范围滑块和进度元素都被着色为热粉色。", width="800", height="548" %}<figcaption><a href="https://codepen.io/web-dot-dev/pen/PomBZdy">演示</a></figcaption></figure>

### 浏览器支持

撰写本文的当下，Chromium 93+ 和 Firefox 92+ 支持 `accent-color`。

## 支持的元素

目前，只有四个元素会通过 `accent-color` 属性着色：[复选框](#checkbox)、[单选按钮](#radio)、[范围滑块](#range)和[进度元素](#progress)。每个都有浅色和深色配色方案，可在 [https://accent-color.glitch.me](https://accent-color.glitch.me) 处预览。

{% Aside "warning" %}如果以下演示元素的颜色都相同，则您的浏览器不支持 `accent-color`。 {% endAside %}

### 复选框

{% Codepen { user: 'web-dot-dev', id: 'dyWjGqZ' } %}

### 单选按钮

{% Codepen { user: 'web-dot-dev', id: 'WNjKrgB' } %}

### 范围滑块

{% Codepen { user: 'web-dot-dev', id: 'yLbqeRy' } %}

### 进度元素

{% Codepen { user: 'web-dot-dev', id: 'rNmrxqL' } %}

## 保证对比度

为了防止存在不可访问的元素，具备 `accent-color` 的浏览器需要确定[符合条件的对比度颜色](https://webaim.org/articles/contrast/)，以便与自定义强调色一起使用。下面的截图展示了 Chrome 94（左）和 Firefox 92 Nightly（右）在算法上的不同：

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/DJhB56n10Eh8O29RsRdE.png", alt="Firefox 和 Chromium 并排的屏幕截图，以各种色调和暗度呈现系列复选框。", width="800", height="832" %}

最重要的一点是要**信任浏览器**。提供品牌颜色，并相信它会为您做出明智的决定。

{% Aside %} 浏览器不会在深色主题中更改您的颜色。 {% endAside %}

## 额外：更多着色

您可能想知道如何为这四个表单元素之外的其他元素着色，是吧？尤其以下几个元素的着色：

- 对焦环
- 文本选择突出显示
- 列表[标记](/css-marker-pseudo-element/)
- 箭头指示符（仅限 Webkit）
- 滚动条滑块（仅限 Firefox）

```css
html {
  --brand: hotpink;
  scrollbar-color: hotpink Canvas;
}

:root { accent-color: var(--brand); }
:focus-visible { outline-color: var(--brand); }
::selection { background-color: var(--brand); }
::marker { color: var(--brand); }

:is(
  ::-webkit-calendar-picker-indicator,
  ::-webkit-clear-button,
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button
) {
  color: var(--brand);
}
```

{% Codepen { user: 'web-dot-dev', id: 'RwVBreJ' } %}

### 潜在的未来

该规范并未将 `accent-color` 的应用限制在本文中显示的四个元素上，以后可能会添加更多支持。`<select>` 中选定的 `<option>` 等元素可以采用 `accent-color` 突出显示。

您还希望对网页上的什么着色？将您的选择通过推特[发给 @argyleink](https://twitter.com/argyleink) ，有可能会被添加到本文中！

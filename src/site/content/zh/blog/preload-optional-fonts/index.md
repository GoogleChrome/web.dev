---
title: 通过预加载可选字体来防止布局偏移和不可见文本闪烁 (FOIT)
subhead: '从 Chrome 83 开始，可以将 link rel="preload" 与 font-display: optional 组合来完全消除布局卡顿'
authors:
  - houssein
date: 2020-03-18
hero: image/admin/wv5DLtYiAhHm4lNemN1E.jpg
alt: 来自某个排字集的大写字母 A，放在白色桌子上
description: '通过优化渲染周期，Chrome 83 在预加载可选字体时可消除布局偏移。将 <link rel="preload"> 与 font-display: optional 组合是保证无卡顿渲染自定义字体的最有效方法。'
tags:
  - blog
  - performance
  - fonts
feedback:
  - api
---

{% Aside %} 在 Chrome 83 中，字体加载有了新的改进，在预加载可选字体时可完全消除布局偏移和不可见文本闪烁 (FOIT)。{% endAside %}

通过优化渲染周期，Chrome 83 在预加载可选字体时可消除布局偏移。将 `<link rel="preload">` 与 `font-display: optional` 组合是保证渲染自定义字体时没有布局卡顿的最有效方法。

## 浏览器兼容性 {: #compatibility }

查看 MDN 的数据以获取最新的跨浏览器支持信息：

- [`<link rel="preload">`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)
- [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#Browser_compatibility)

## 字体渲染

当网页上的资源动态变化时，会发生布局偏移或重新布局，从而导致内容“偏移”。获取和渲染 Web 字体可能以下面两种方式之一直接导致布局偏移：

- 后备字体与新字体交换（“无样式文本闪烁”）
- 新字体渲染到页面前显示“不可见”文本（“不可见文本闪烁”）

CSS [`font-display`](https://font-display.glitch.me/) 属性提供了一种通过一系列不同的支持值（`auto`、`block`、`swap`、`fallback` 和 `optional`）来修改自定义字体渲染行为的方法。选择使用哪个值取决于异步加载的字体的首选行为。但是，这些支持值中的每一个都可以通过上面列出的两种方式之一触发重新布局，直到现在！

{% Aside %} [Cumulative Layout Shift](/cls/) 指标可用于衡量网页上的布局不稳定性。{% endAside %}

## 可选字体

`font-display` 属性使用三段式的时间线来处理需要下载才能渲染的字体：

- **阻止：**渲染“不可见”文本，但在加载完成后立即切换到 Web 字体。
- **交换：**使用后备系统字体渲染文本，但在加载完成后立即切换到 Web 字体。
- **失败：**使用后备系统字体渲染文本。

以前，指定了 `font-display: optional` 的字体有 100 毫秒的阻止期，没有交换期。这意味着在切换到后备字体之前，“不可见”文本会非常短暂地显示。如果在 100 毫秒内未下载字体，则使用后备字体并且不会发生交换。

<figure>{% Img src="image/admin/WHLORYEu864QRRveFQUz.png", alt="该图表显示当字体加载失败时以前的可选字体行为", width="800", height="340" %} <figcaption>100 毫秒阻止期<b>之后</b>，下载字体时 Chrome 中以前的 <code>font-display: optional</code> 行为</figcaption></figure>

但是，如果在 100 毫秒阻止期结束之前下载完字体，则会在页面上渲染和使用自定义字体。

<figure>{% Img src="image/admin/mordYRjmCCDtlMcNXEOU.png", alt="该图表显示当字体及时加载时以前的可选字体行为", width="800", height="318" %} <figcaption>100 毫秒阻止期<b>之后</b>，下载字体时 Chrome 中以前的 <code>font-display: optional</code> 行为</figcaption></figure>

Chrome 在两种情况下都会重新渲染页面**两次**，无论是使用后备字体还是自定义字体及时完成加载时。这会导致不可见文本轻微闪烁，并且在渲染新字体时，会出现布局卡顿而使一些页面内容发生移动。即使字体存储在浏览器的磁盘缓存中并且可以在阻止期结束之前顺利加载，也会出现这种情况。

Chrome 83 中的[优化](https://bugs.chromium.org/p/chromium/issues/detail?id=1040632)完全去除了通过 [`<link rel="preload'>`](/codelab-preload-web-fonts/) 预加载的可选字体的第一个渲染周期。相反，渲染会被阻止，直到自定义字体完成加载或经过一段时间。这个超时期间目前设置为 100 毫秒，但在不久的将来可能会更改以优化性能。

<figure>{% Img src="image/admin/zLldiq9J3duBTaeRN88e.png", alt="该图表显示当字体加载失败时新的预加载可选字体行为", width="800", height="353" %} <figcaption>100 毫秒阻止期<b>之后</b>，预加载字体和下载字体时 Chrome 中新的 <code>font-display: optional</code> 行为（没有不可见文本闪烁）</figcaption></figure>

<figure>{% Img src="image/admin/OEHCGFMFspaWjb3xXLY.png", alt="该图表显示当字体及时加载时新的预加载可选字体行为", width="800", height="346" %} <figcaption>100 毫秒阻止期<b>之前</b>，预加载字体和下载字体时 Chrome 中新的 <code>font-display: optional</code> 行为（没有不可见文本闪烁）</figcaption></figure>

在 Chrome 中预加载可选字体消除了布局卡顿和无样式文本闪烁的可能性。 [这与 CSS 字体模块级别 4](https://drafts.csswg.org/css-fonts-4/#valdef-font-face-font-display-optional) 中指定的所需行为相匹配，其中可选字体不应导致重新布局，而用户代理可以将渲染延迟一段合适的时间。

虽然预加载可选字体不是必需的，但这大大提高了在第一个渲染周期之前加载它的机会，尤其是它尚未存储在浏览器的缓存中时。

## 结论

Chrome 团队有兴趣倾听您在应用这些新优化后预加载可选字体的体验！如果您遇到任何问题或想要提出任何功能建议，请提交[问题](https://bugs.chromium.org/p/chromium/issues/entry)。

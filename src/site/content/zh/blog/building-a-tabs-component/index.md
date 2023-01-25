---
layout: post
title: 构建 Tabs 组件
subhead: 关于如何构建类似于 iOS 和 Android 应用中的标签组件的基本概述。
authors:
  - adamargyle
description: 关于如何构建类似于 iOS 和 Android 应用中的标签组件的基本概述。
date: 2021-02-17
hero: image/admin/sq79nDAthaQGcdQkqazJ.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

在本文中，我想与您分享我在为 Web 构建一个 Tabs（标签）组件的想法，该组件响应迅速、支持多种设备输入并可以跨浏览器工作。观看[演示](https://gui-challenges.web.app/tabs/dist/)。

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IBDNCMVCysfM9fYC9bnP.mp4", autoplay="true", loop="true", muted="true" %}<figcaption><a href="https://gui-challenges.web.app/tabs/dist/">演示</a></figcaption></figure>

如果您更喜欢视频，以下是本文的 YouTube 版本：

{% YouTube 'mMBcHcvxuuA' %}

## 概览

Tabs 是设计系统的常见组件，但可以采用多种形状和形式。首先有在 `<frame>` 元素上构建的桌面标签，现在有基于物理属性的可实现动画内容的移动组件。它们的目标是一致的：节省空间。

现如今，Tabs 用户体验的基本要素是按钮导航区域，它可以切换显示框架中内容的可见性。许多不同的内容区域共享相同的空间，但根据导航中选择的按钮有条件地呈现。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/eAaQ44VAmzVOO9Cy5Wc8.png", alt="由于网页应用到组件概念的样式多种多样，所以拼贴图很混乱", width= "800", height="500" %}<figcaption>过去 10 年中标签组件网页设计风格的拼贴图</figcaption></figure>

## Web 策略

总而言之，我发现这个组件构建起来非常简单，这要归功于一些关键的 Web 平台功能：

- `scroll-snap-points`可实现优雅的滑动和键盘交互与适当的滚动停止位置
- 通过 URL 哈希让浏览器处理页内滚动锚定和共享支持，实现了[深层链接](https://en.wikipedia.org/wiki/Deep_linking)
- 通过`<a>`和`id="#hash"`元素标记实现了对屏幕阅读器支持
- `prefers-reduced-motion`可启用交叉淡入淡出过渡和即时页面内滚动
- 尚处于草案阶段的`@scroll-timeline` web 功能，可实现对所选标签进行动态下划线和更改颜色

### HTML {: #markup }

从根本上说，这里的 UX 是：单击链接，让 URL 呈现嵌套页面状态，然后当浏览器滚动到匹配元素时看到内容区域更新。

这里有一些结构内容成员：链接和`:target`。我们需要一个连接列表（可使用`<nav>`），以及一个`<article>`元素列表（可使用`<section>`）。每个链接哈希将匹配一个部分，让浏览器通过锚点滚动内容。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pr8BrPDjq8ga9NyoHLJk.mp4", autoplay="true", loop="true", muted="true" %}<figcaption>单击链接按钮，在焦点内容中滑动</figcaption></figure>

例如，在 Chrome 89 中点击链接会自动聚焦到`:target`这篇文章，不需要使用 JS。然后用户可以像往常一样使用输入设备滚动文章内容。它是免费内容，如标记所示。

我使用以下标记来组织 tabs：

```html
<snap-tabs>
  <header>
    <nav>
      <a></a>
      <a></a>
      <a></a>
      <a></a>
    </nav>
  </header>
  <section>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
  </section>
</snap-tabs>
```

我可以通过`href`和`id`属性在`<a>`和`<article>`元素之间建立连接，如下所示：

```html/3,10
<snap-tabs>
  <header>
    <nav>
      <a href="#responsive"></a>
      <a href="#accessible"></a>
      <a href="#overscroll"></a>
      <a href="#more"></a>
    </nav>
  </header>
  <section>
    <article id="responsive"></article>
    <article id="accessible"></article>
    <article id="overscroll"></article>
    <article id="more"></article>
  </section>
</snap-tabs>
```

我接下来用不同数量的伪占位文填充了文章，并用混合长度和图像的标题集填充链接。有了要处理的内容，我们就可以开始布局了。

### 滚动布局 {: #overscroll }

此组件中有 3 种不同类型的滚动区域：

- 导航区<b style="color: #FF00E2;">（粉红色）</b>可水平滚动
- 内容区域<b style="color: #008CFF;">（蓝色）</b>可水平滚动
- 每篇文章<b style="color: #2FD800;">（绿色）</b>都可以垂直滚动。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qVmUKMwbeoCBffP0aY55.png", alt="3 个带有颜色匹配方向箭头的彩色框，描绘出了滚动区域并显示滚动方向。", width="800", height="450" %}</figure>

滚动涉及两种不同类型的元素：

1. **窗口**<br>具有`overflow`属性样式的已定义尺寸的框。
2. **超大表面**<br>在此布局中，它是列表容器：导航链接、章节文章和文章内容。

#### `<snap-tabs>`布局 {: #tabs-layout }

我选择的顶层布局是 flex (Flexbox)。我将方向设置为`column` ，因此标题和章节是垂直排序的。这是我们的第一个滚动窗口，它通过溢出隐藏隐去了所有内容。标题和章节将很快采用过度滚动，作为单独的区域。

{% Compare 'better', 'HTML' %}

```html
<snap-tabs>
  <header></header>
  <section></section>
</snap-tabs>
```

{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
snap-tabs {
  display: flex;
  flex-direction: column;

  /* establish primary containing box */
  overflow: hidden;
  position: relative;

  & > section {
    /* be pushy about consuming all space */
    block-size: 100%;
  }

  & > header {
    /* defend against <section> needing 100% */
    flex-shrink: 0;
    /* fixes cross browser quarks */
    min-block-size: fit-content;
  }
}
```

{% endCompare %}

指回彩色的 3 滚动图：

- `<header>`现在准备成为<b style="color: #FF00E2;">（粉红色）</b>滚动容器。
- `<section>`准备成为<b style="color: #008CFF;">（蓝色）</b>滚动容器。

我在下面用 [VisBug](https://a.nerdy.dev/gimme-visbug) 高亮显示的框架可帮我们查看滚动容器创建的**窗口**。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Fyl0rTuETjORBigkIBx5.png", alt="header 和 section 元素上有粉红色覆盖，勾勒出它们在组件中占用的空间", width="800", height="620" %}</figure>

#### 标签 `<header>`布局 {: #tabs-header }

下一个布局几乎一模一样：我使用 flex 创建垂直排序。

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<snap-tabs>
  <header>
    <nav></nav>
    <span class="snap-indicator"></span>
  </header>
  <section></section>
</snap-tabs>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css/1-2
header {
  display: flex;
  flex-direction: column;
}
```
{% endCompare %}
</div>

`.snap-indicator`应该与链接组一起水平移动，这个标题布局有助于设置那个阶段。这里没有用到绝对定位的元素！

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/EGNIrpw4gEzIZEcsAt5R.png", alt="nav 和 span.indicator 元素上有粉红色覆盖，勾勒出它们在组件中占据的空间", width="800", height="368" %}</figure>

接下来是滚动样式。事实证明，我们可以在 2 个水平滚动区域（标题和章节）之间共享滚动样式，因此我创建了一个实用程序类`.scroll-snap-x` 。

```css
.scroll-snap-x {
  /* browser decide if x is ok to scroll and show bars on, y hidden */
  overflow: auto hidden;
  /* prevent scroll chaining on x scroll */
  overscroll-behavior-x: contain;
  /* scrolling should snap children on x */
  scroll-snap-type: x mandatory;

  @media (hover: none) {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
```

每个区域都需要在 x 轴上溢出，滚动遏制来捕获过度滚动，触摸设备的隐藏滚动条以及最后通过滚动捕捉来锁定内容展示区域。我们的键盘 tab 顺序是可访问的，任何交互都自然地引导焦点。滚动锁定容器还可以通过键盘获得漂亮的轮播式交互。

#### 标签页眉`<nav>`布局 {: #tabs-header-nav }

导航链接需要排成一行，不使用换行符，垂直居中，并且每个链接项都应该与滚动捕捉容器对齐。2021 CSS 可使用 Swift！

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<nav>
  <a></a>
  <a></a>
  <a></a>
  <a></a>
</nav>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
nav {
  display: flex;

  & a {
    scroll-snap-align: start;

    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
}
```
{% endCompare %}
</div>

每个链接的样式和大小都是自己的，所以导航布局只需要指定方向和流向。导航项目上的独特宽度使标签之间的转换变得有趣，因为指示器将其宽度调整为新目标。根据此处有多少元素，浏览器将呈现或不呈现滚动条。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/P7Vm3EvhO1wrTK1boU6y.png", alt="导航的 a 元素上有粉红色覆盖，勾勒出它们在组件中占据的空间以及溢出的位置", width="800", height="327" %}</figure>

#### 标签`<section>`布局 {: #tabs-section }

这是一个灵活的项，需要占据大部分空间。它还需要为要放入的文章创建列。再重申一遍，CSS 2021 可以使用 swift！`block-size: 100%`会拉伸这个元素以尽可能地填充父元素，然后对于自己的布局，它会创建一组与父元素宽度 `100%` 相同的列。百分比在这里很有效，因为我们已经对父级编写了强约束。

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<section>
  <article></article>
  <article></article>
  <article></article>
  <article></article>
</section>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
section {
  block-size: 100%;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
}
```
{% endCompare %}
</div>

就好像我们在说“尽可能以强制方式多多垂直扩展”（记住我们为`flex-shrink: 0`设置的标题：这是对这种扩展推动的一种防御），它为一组全高列设置了行高。 `auto-flow`样式会告诉网格始终将子项排列在水平线上，不要自动换行，而这正是我们想要的；溢出父窗口。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/FYroCMocutCGg1X8kfdG.png", alt="文章元素上有粉红色覆盖，勾勒出它们在组件中占据的空间以及溢出的位置", width="800", height="512" %}</figure>

我有时会发现这些实在很难理解！这个章节元素装进了一个盒子里，同时又创建了一组盒子。我希望上面的图像和解释会有所帮助。

#### 标签`<article>`布局 {: #tabs-article }

用户应该能够滚动文章内容，并且只有在溢出时才会显示滚动条。这些文章元素排列整齐。它们同时是滚动父项和滚动子项。浏览器确实在为我们处理一些棘手的触摸、鼠标和键盘交互。

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html
<article>
  <h2></h2>
  <p></p>
  <p></p>
  <h2></h2>
  <p></p>
  <p></p>
  ...
</article>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
article {
  scroll-snap-align: start;

  overflow-y: auto;
  overscroll-behavior-y: contain;
}
```
{% endCompare %}
</div>

我选择让文章在它们的父滚动条中对齐。我真的很喜欢导航链接项和文章元素与其各自滚动容器的内联开始对齐的样子。它看起来有一种和谐的关系。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/O8gJp7AxBty8yND4fFGr.png", alt="文章元素及其子元素上有粉红色覆盖，勾勒出它们在组件中占据的空间和溢出的方向", width="800", height="808" %}</figure>

文章是一个网格子项，它的大小预先确定为我们想要提供滚动 UX 的视区区域。这意味着我在这里无需定义任何高度或宽度样式，只需要定义它的溢出方式。我将 overflow-y 设置为自动，接着还使用方便的 overscroll-behavior 属性捕获滚动交互。

#### 3 个滚动区域回顾 {: #scroll-areas-recap }

下面我在系统设置中选择了“始终显示滚动条”。我认为要让布局成功，一定要启用此设置，因为我要查看布局和滚动编排。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/6I6TI9PI4rvrJ9lr8T99.png", alt="3 个滚动条设置为显示，现在占用布局空间，我们的组件看起来还不错", width="500", height="607" %}</figure>

我认为在这个组件中看到滚动条装订线，有助于清楚地显示滚动区域的位置、它们支持的方向以及相互交互方式。考虑每个滚动窗口框架如何是布局的弹性或网格父项。

DevTools 可以帮我们把这个视觉化：

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/GFJwc3IggHY4G5fBMiu9.png", alt="滚动区域有网格和弹性框工具叠加，勾勒出它们在组件中占据的空间和溢出方向", width="800", height="455" %}<figcaption> Chromium Devtools，显示了充满锚元素的弹性框导航元素布局，充满文章元素的网格章节布局，以及充满段落和标题元素的文章元素。</figcaption></figure>

滚动布局是完整的：对齐、可深层链接以及可使用键盘访问。为 UX 增强、风格和愉悦打下的坚实基础。

#### 功能亮点

在调整大小期间，滚动对齐的子项保持其锁定的位置。这意味着 JavaScript 不需要在设备旋转或浏览器调整大小时显示任何内容。在 Chromium DevTools [设备模式](https://developer.chrome.com/docs/devtools/device-mode/)中选择 **Responsive** 以外的任何模式，然后调整设备框架的大小，来试用一下。请注意，该元素保持在视图中并被其内容锁定。自从 Chromium 更新他们的实现以匹配此规范以来，这功能已经可以使用了。这里有一篇关于它的[博客文章](/snap-after-layout/)。

### 动画 {: #animation }

在这里，动画的目标是将交互与 UI 反馈清楚地联系起来。这有助于引导或帮助用户（希望如此）无缝地发现所有内容。我会有目的地和有条件地添加动作。用户现在可以在操作系统中指定[他们的运动偏好](/prefers-reduced-motion/)，我非常喜欢在我的界面中响应他们的偏好。

我会将标签下划线与文章滚动位置链接起来。捕捉不仅仅是对齐，它还会锚定动画的开始和结束。这使`<nav>`（它就像[迷你地图](https://en.wikipedia.org/wiki/Mini-map)）保持连接到内容。我们将从 CSS 和 JS 中检查用户的动作偏好。有几个很棒的地方需要考虑！

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/D4zfhetqvhqlcPdTRtLZ.mp4", autoplay="true", loop="true", muted="true" %}</figure>

#### 滚动行为 {: #scroll-behavior }

有机会增强`:target`和`element.scrollIntoView()`的运动行为。默认情况下，它是即时的。浏览器只是设置滚动位置。但如果我们要过渡到那个滚动位置，而不是闪动，那要怎么办？

```css
@media (prefers-reduced-motion: no-preference) {
  .scroll-snap-x {
    scroll-behavior: smooth;
  }
}
```

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Q4JDplhM9gEd4PoiXqs6.mp4", autoplay="true", loop="true", muted="true" %}</figure>

由于我们在此处引入了运动以及用户无法控制的运动（如滚动），因此我们仅在用户在操作系统中没有设置对减少运动的偏好时，才会应用此样式。这样，我们只为喜欢它的人引入滚动运动。

#### 标签指示器 {: #tabs-indicator }

此动画的目的是将指标与内容状态相关联。我决定为更喜欢减少运动的用户将 `border-bottom`样式使用颜色交叉淡入淡出动画，为喜欢运动的用户使用滚动链接滑动+颜色淡入淡出动画。

在 Chromium Devtools 中，我可以切换首选项并演示 2 种不同的过渡样式。我在构建这个过程中获得了很多乐趣。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/NVoLHgjGjf7fZw5HFpF6.mp4", autoplay="true", loop="true", muted="true" %}</figure>

```css
@media (prefers-reduced-motion: reduce) {
  snap-tabs > header a {
    border-block-end: var(--indicator-size) solid hsl(var(--accent) / 0%);
    transition: color .7s ease, border-color .5s ease;

    &:is(:target,:active,[active]) {
      color: var(--text-active-color);
      border-block-end-color: hsl(var(--accent));
    }
  }

  snap-tabs .snap-indicator {
    visibility: hidden;
  }
}
```

当用户更喜欢减少运动时，我会隐藏`.snap-indicator`，因为我已经不需要它了。然后我用`border-block-end`样式和`transition`替换它。另外请注意，在标签交互中，活动导航项不仅用品牌下划线高亮显示，而且其文本的颜色也更深。活动元素会使用更高的文本颜色对比度和明亮的下灯强调。

只需多加几行 CSS 就可以让用户感觉到被重视（从某种意义说，我们有考虑尊重他们的运动偏好）。我喜欢这一点。

#### `@scroll-timeline` {: #scroll-timeline }

在上一节中，我向您展示了如何处理减少的运动交叉淡入淡出样式；在本节中，我将向您展示如何将指示器和滚动区域链接在一起。接下来是一些有趣的实验性内容。我希望你和我一样兴奋。

```js
const { matches:motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
);
```

我首先从 JavaScript 检查用户的运动偏好。如果结果为`false` ，意味着用户更喜欢减少运动，那么我们将不会运行任何滚动链接运动效果。

```js
if (motionOK) {
  // motion based animation code
}
```

在撰写本文时，[浏览器还不支持`@scroll-timeline`](https://caniuse.com/css-scroll-timeline) 。它只是一个具有实验性实现的[草案规范](https://drafts.csswg.org/scroll-animations-1/)。不过它有一个 polyfill，我在这个演示中使用了它。

##### ` ScrollTimeline`

虽然 CSS 和 JavaScript 都可以创建滚动时间线，但我选择了 JavaScript，从而可以在动画中使用实时元素测量。

```js
const sectionScrollTimeline = new ScrollTimeline({
  scrollSource: tabsection,  // snap-tabs > section
  orientation: 'inline',     // scroll in the direction letters flow
  fill: 'both',              // bi-directional linking
});
```

我想要一个东西跟随另一个的滚动位置，并通过创建`ScrollTimeline`来定义滚动链接的驱动程序`scrollSource` 。通常，web 上的动画会根据全局时间帧刻度运行，但当内存中存在自定义`sectionScrollTimeline`时，我可以改变所有这些。

```js
tabindicator.animate({
    transform: ...,
    width: ...,
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

在进入动画的关键帧之前，我认为重要的是指出滚动的后续`tabindicator`将基于自定义时间轴（章节的滚动）进行动画处理。这补全了链接，但缺少最后一个要素，即在这两者之间动画的状态点，也称为关键帧。

#### 动态关键帧

有一种非常强大的纯声明式 CSS 方式可以使用`@scroll-timeline`制作动画，但我选择的动画太多变了。无法在`auto`宽度之间转换，也无法根据子项长度动态创建多个关键帧。

不过 JavaScript 知道如何获取该信息，因此我们将亲自迭代子项并在运行时获取计算值：

```js
tabindicator.animate({
    transform: [...tabnavitems].map(({offsetLeft}) =>
      `translateX(${offsetLeft}px)`),
    width: [...tabnavitems].map(({offsetWidth}) =>
      `${offsetWidth}px`)
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

对于每个`tabnavitem`，解构`offsetLeft`位置并返回一个将其用作`translateX`值的字符串。这会为动画创建 4 个变换关键帧。宽度也是如此，每一个都被问到它的动态宽度是多少，然后将其用作关键帧的值。

这是基于我的字体和浏览器首选项的示例输出：

TranslateX 关键帧：

```js
[...tabnavitems].map(({offsetLeft}) =>
  `translateX(${offsetLeft}px)`)

// results in 4 array items, which represent 4 keyframe states
// ["translateX(0px)", "translateX(121px)", "translateX(238px)", "translateX(464px)"]
```

宽度关键帧：

```js
[...tabnavitems].map(({offsetWidth}) =>
  `${offsetWidth}px`)

// results in 4 array items, which represent 4 keyframe states
// ["121px", "117px", "226px", "67px"]
```

总结该策略，标签指示器现在将根据章节滚动条的滚动对齐位置在 4 个关键帧上设置动画。对齐点会在关键帧之间创建清晰的轮廓，并真正增加了动画的同步感。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jV5X2JMkgUQSIpcivvTJ.png", alt="活动选项卡和非活动选项卡与 VisBug 叠加显示，显示两者的通过对比度分数", width="540", height="400" %}</figure>

用户通过他们的交互来驱动动画，看到指示器的宽度和位置从一个章节变化到下一个章节，通过滚动完美跟踪。

您可能没有注意到，但是当高亮显示的导航项被选中时，我对颜色的转换感到非常自豪。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/qoxGO8SR2t6GPuCWhwvu.mp4", autoplay="true", loop="true", muted="true" %}</figure>

当高亮显示的项目具有更高的对比度时，未选择的较浅灰色显得更加推后。为文本转换颜色是很常见的，比如在悬停时和被选中时，但在滚动时转换该颜色、与下划线指示器同步，则更高级。

下面是我使用的方法：

```js
tabnavitems.forEach(navitem => {
  navitem.animate({
      color: [...tabnavitems].map(item =>
        item === navitem
          ? `var(--text-active-color)`
          : `var(--text-color)`)
    }, {
      duration: 1000,
      fill: 'both',
      timeline: sectionScrollTimeline,
    }
  );
});
```

每个标签导航链接都需要这种新颜色的动画，跟踪与下划线指示器相同的滚动时间线。我使用之前的时间轴：因为它的作用是在滚动时发出滴答声，我们可以在想要的任何类型的动画中使用那个滴答声。正如我之前所做的那样，我在循环中创建了 4 个关键帧，并返回颜色。

```js
[...tabnavitems].map(item =>
  item === navitem
    ? `var(--text-active-color)`
    : `var(--text-color)`)

// results in 4 array items, which represent 4 keyframe states
// [
  "var(--text-active-color)",
  "var(--text-color)",
  "var(--text-color)",
  "var(--text-color)",
]
```

带有`var(--text-active-color)`的关键帧会高亮显示链接，否则它就是标准文本颜色。那里的嵌套循环使其相对简单，因为外循环是每个导航项，内循环是每个导航项的个人关键帧。我会检查外循环元素是否与内循环元素相同，并通过它来了解它何时被选中。

写这个的时候我很开心。

### 更多的 JavaScript 增强 {: #js }

值得提醒的是，我在这里向您展示的核心内容无需使用 JavaScript。话虽如此，让我们看看当 JS 可用时，要如何增强它。

#### 深层链接

深层链接更像是移动术语，但我认为深层链接的意图在这里与标签相吻合，因为您可以将 URL 直接分享到标签的内容。浏览器将在页面内导航到与 URL 哈希匹配的 ID。我发现这个`onload`处理程序产生了跨平台的效果。

```js
window.onload = () => {
  if (location.hash) {
    tabsection.scrollLeft = document
      .querySelector(location.hash)
      .offsetLeft;
  }
}
```

#### 滚动结束同步

用户并不总是点击或使用键盘，有时他们只是自由滚动，这是他们的自由。当章节滚动条停止滚动时，无论它停在任何位置，都需要在顶部导航栏中进行匹配。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/syltOES9Gxc0ihOsgTIV.mp4", autoplay="true", loop="true", muted="true" %}</figure>

这是我等待滚动结束的方式：

```js
tabsection.addEventListener('scroll', () => {
  clearTimeout(tabsection.scrollEndTimer);
  tabsection.scrollEndTimer = setTimeout(determineActiveTabSection, 100);
});
```

每当在滚动章节时，清除章节超时（如果有），然后开始一个新的超时。当章节停止滚动时，不要清除超时，然后在休息 100 毫秒后触发。当它触发时，调用试图找出用户停止位置的函数。

```js
const determineActiveTabSection = () => {
  const i = tabsection.scrollLeft / tabsection.clientWidth;
  const matchingNavItem = tabnavitems[i];

  matchingNavItem && setActiveTab(matchingNavItem);
};
```

假设滚动被捕捉，那么当前滚动位置除以滚动区域的宽度应该是一个整数，而不是小数。然后我尝试通过这个计算出的索引，从缓存中获取一个导航项，如果它找到了一些东西，我将匹配设置为活动状态。

```js
const setActiveTab = tabbtn => {
  tabnav
    .querySelector(':scope a[active]')
    .removeAttribute('active');

  tabbtn.setAttribute('active', '');
  tabbtn.scrollIntoView();
};
```

设置活动标签首先要清除任何当前活动的标签，然后为传入的导航项提供活动状态属性。调用`scrollIntoView()`与 CSS 有一个有趣的交互，值得注意。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/nsiyMgZ2QGF2fx9gVRgu.mp4", autoplay="true", loop="true", muted="true" %}</figure>

```css
.scroll-snap-x {
  overflow: auto hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}
```

在水平滚动捕捉实用程序 CSS 中，我们[嵌套](https://drafts.csswg.org/css-nesting-1/)了一个媒体查询，如果用户不介意运动，该查询会应用`smooth`。JavaScript 可以随意调用以将元素滚动到视图中，而 CSS 可以声明性地管理用户体验。它们有时会非常可爱。

### 结论

现在，您知道了我是怎么做到的，您会怎么做？！这可以做出一些有趣的组件架构！谁会做出第一个带老虎机的版本？ 🙂

让我们尝试各种方法并学习在网络上构建的所有方法。创建一个[Glitch](https://glitch.com) ，把您的版本[发推给我](https://twitter.com/argyleink)，我会把它添加到下面的[社区改编](#community-remixes)部分。

## 社区改编

- [@devnook](https://twitter.com/devnook)、[@rob_dodson](https://twitter.com/rob_dodson) 和 [@DasSurma](https://twitter.com/DasSurma) 与 Web 组件：[文章](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs)。
- [@jhvanderschee](https://twitter.com/jhvanderschee) 带按钮：[Codepen](https://codepen.io/joosts/pen/PoKdZYP) 。

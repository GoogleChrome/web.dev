---
title: 优化 Cumulative Layout Shift 累积布局偏移
subhead: 了解如何避免突然的布局偏移来改善用户体验
authors:
  - addyosmani
date: 2020-05-05
updated: 2021-08-17
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: 累积布局偏移 (CLS) 指标能够对用户经历页面内容突然偏移的频率进行量化。在本篇指南中，我们将介绍针对 CLS 常见成因（例如无尺寸或动态内容的图像和 iframe）的优化方式。
alt: 布局偏移可能会突然将您正在阅读的内容或即将点击的内容推到页面下方，从而导致糟糕的用户体验。为导致布局偏移的动态内容保留空间会带来更愉快的用户体验。
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='88' %}

"我正准备点那里！为什么移走了？😭"

布局偏移可能会分散用户的注意力。想象一下，您已经开始阅读一篇文章，可是页面上的元素突然位移，让您措手不及，于是您不得不再次找到先前阅读的位置。这在网络上十分常见，包括在阅读新闻或尝试单击"搜索"或"添加到购物车"按钮时。这种体验在视觉上十分扎眼且令人郁闷。这些情况通常是由于另一个元素被突然添加到页面上或是突然调整了大小，使可见元素被迫移动位置而导致的。

[累积布局偏移](/cls) (CLS)：[核心 Web 指标](/vitals)中的一项指标，通过计算未在用户输入 500 毫秒内发生的布局偏移的偏移分数总和来测量内容的不稳定性。该项指标查看可视区域中可见内容的位移量以及受影响元素的位移距离。

在本篇指南中，我们将介绍针对布局偏移常见成因的优化方式。

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="良好的 CLS 值低于 0.1，较差的值大于 0.25 并且中间的任何值都需要改进", width="384", height="96" %}
</picture>

CLS 较差的最常见原因为：

- 无尺寸的图像
- 无尺寸的广告、嵌入和 iframe
- 动态注入的内容
- 导致不可见文本闪烁 (FOIT)/无样式文本闪烁 (FOUT) 的网络字体
- 在更新 DOM 之前等待网络响应的操作

## 无尺寸的图像 🌆

**概述**：始终在您的图像和视频元素上包含`width`和`height`属性。或者通过使用[CSS 长宽比容器](https://css-tricks.com/aspect-ratio-boxes/)预留所需的空间。这种方法可以确保浏览器能够在加载图像期间在文档中分配正确的空间大小。

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg", controls=true, loop=true, muted=true %}<figcaption>未指定宽度和高度的图像。</figcaption></figure>

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg", controls=true, loop=true, muted=true %}<figcaption>已指定宽度和高度的图像。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="灯塔报告显示的在设置图像尺寸前/后对累积布局偏移的影响", width="800", height="148" %}<figcaption>灯塔 6.0 中设置图像尺寸对 CLS 的影响。</figcaption></figure>

### 历史

在网络发展的早期阶段，开发者会在他们的`<img>`标签中加入`width`和`height`属性，从而确保浏览器在开始获取图像前会在页面上预先分配足够的空间。这样可以最大限度地减少回流和重排。

```html
<img src="puppy.jpg" width="640" height="360" alt="小狗与气球" />
```

您可能会注意到，上方的`width`和`height`不包括单位。这些"像素"尺寸可以确保一块 640x360 的保留区域。无论图像的真实尺寸是否匹配，该图像都会被拉伸成保留区域的大小。

[响应式网页设计](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/)得到引入后，开发者开始省略`width`和`height`，并取而代之开始使用 CSS 来调整图像大小：

```css
img {
  width: 100%; /* or max-width: 100%; */
  height: auto;
}
```

这种方法的一个缺点是，只有在图像开始下载且浏览器可以确定其尺寸后才能为图像分配空间。随着图像的加载，页面会随着每个图像出现在屏幕上而进行重排，因此导致文本常常突然出现在屏幕上。这与良好的用户体验相距甚远。

这种情况下就需要用到长宽比。图像的长宽比是图像宽度与高度的比例。我们通常用由冒号分隔的两个数字来表示长宽比（例如 16:9 或 4:3）。x:y 的长宽比表示图像的宽度为 x 单位，高度为 y 单位。

也就是说，如果我们知道其中一个维度，就可以确定另一个维度。对于 16:9 的长宽比：

- 如果 puppy.jpg 的高度为 360px，则宽度为 360 x (16 / 9) = 640px
- 如果 puppy.jpg 的宽度为 640px，则高度为 640 x (9 / 16) = 360px

在知道长宽比的情况下，浏览器就能够进行计算，并为高度和其关联区域预留足够的空间。

### 现代最佳实践

现代浏览器目前会根据图像的宽度和高度属性设置图像的默认长宽比，因此，通过设置这些属性来防止布局偏移是非常有价值的。感谢 CSS 工作组的努力，开发者只需要照常设置`width`和`height`即可：

```html
<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="小狗与气球" />
```

……而且所有浏览器的[UA 样式表](https://developer.mozilla.org/docs/Web/CSS/Cascade#User-agent_stylesheets)都会根据元素现有的`width`和`height`属性添加[默认长宽比](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images)：

```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

这会在图像加载之前根据`width`和`height`属性计算长宽比。样式表在布局计算的一开始就会提供此信息。一旦图像被设定为某一特定宽度（例如`width: 100%` ），就可以通过长宽比来计算高度。

提示：如果您很难理解长宽比，还可以使用便捷的[计算器](https://aspectratiocalculator.com/16-9.html)来帮助计算。

上述针对图像长宽比的变化已经在 [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1547231) 和 [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=979891) 中得到应用，并将在 [WebKit](https://twitter.com/smfr/status/1220051332767174656) (Safari) 中进行应用。

如需深入了解长宽比并对响应式图像展开进一步思考，请参阅[使用媒体长宽比实现无卡顿页面加载](https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/)。

如果您的图像在容器中，您可以使用 CSS 将图像大小调整为该容器的宽度。我们需要设置`height: auto;`来避免图像高度为某个固定值（例如`360px` ）。

```css
img {
  height: auto;
  width: 100%;
}
```

**如何处理响应式图像？**

处理[响应式图像](/serve-responsive-images)时，`srcset`定义了允许浏览器选择的图像以及每个图像的大小。为了保证`<img>`的宽度和高度属性可以进行设置，每个图像都应该采用相同的长宽比。

```html
<img
  width="1000"
  height="1000"
  src="puppy-1000.jpg"
  srcset="puppy-1000.jpg 1000w, puppy-2000.jpg 2000w, puppy-3000.jpg 3000w"
  alt="小狗与气球"
/>
```

如何处理[美术设计](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)？

页面可能会想要在窄可视区域中包含一张剪裁后的图像，并在桌面上显示完整图像。

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" />
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" />
  <img src="puppy-800w.jpg" alt="小狗与气球" />
</picture>
```

这些图像很可能具有不同的长宽比，而浏览器仍然在评估这种情况下最有效的解决方案，比如是否应该在所有图像来源中写明尺寸。在确定解决方案前，该情况下仍然可能会进行重排。

## 无尺寸的广告、嵌入和 iframe 📢😱

### 广告

广告是网络布局偏移的最主要因素之一。广告网络和发布商通常支持动态广告尺寸。由于更高的点击率和更多的广告参与竞价，广告尺寸提高了绩效/收入。不幸的是，广告会将您正在查看的可见内容推至页面下方，因此可能会导致用户体验不佳。

广告生命周期中有许多时间点可以引发布局偏移：

- 当网站在 DOM 中插入广告容器时
- 当网站使用第一方代码调整广告容器的大小时
- 当广告标签库加载（并调整广告容器大小）时
- 当广告填满容器（以及在最终广告尺寸不同的情况下调整尺寸）时

好在网站可以遵循最佳实践来减少广告偏移。网站可以通过以下方式缓解这些布局偏移：

- 为广告位静态预留空间。
    - 换句话说，在加载广告标签库之前设置元素样式。
    - 如果要在内容流中放置广告，请通过预留广告位大小来确保消除偏移现象。如果这些广告在屏幕外进行加载，则*不应*导致布局偏移。
- 在可视区域顶部附近放置非粘性广告时需要留心。
    - 在下方的示例中，我们建议将广告移动到"世界视野"标志的下方，并确保为广告位预留足够的空间。
- 如果在广告位可见时没有返回广告，请通过显示占位符来避免折叠预留空间。
- 通过为广告位预留尽可能大的空间尺寸来消除偏移现象。
    - 这样虽然有效，但如果较小的广告创意填补了广告位，则可能会出现空白区域。
- 根据历史数据为广告位选择最有可能的尺寸。

如果不太可能填满广告位，一些网站可能会发现在最开始将广告位折叠可以减少布局偏移的发生。目前没有一种简单的方法可以每次都选择准确的尺寸，除非您自己控制广告投放。

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg", controls=true, loop=true, muted=true %}<figcaption>没有预留足够空间的广告。</figcaption></figure>

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg", controls=true, loop=true, muted=true %}<figcaption>已预留足够空间的广告。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="灯塔报告显示的在为广告等网页横幅预留空间前/后对累积布局偏移的影响", width="800", height="148" %}<figcaption>灯塔 6.0 中为该横幅预留空间对 CLS 的影响</figcaption></figure>

#### 为广告位静态预留空间

为相同大小的插槽 DOM 元素静态设置样式，并传递给您的标签库。这样有助于确保库在加载时不会引入布局偏移。如果不这样做，库就可能会在页面布局后改变插槽元素的大小。

同时还要考虑较小广告服务的尺寸。如果投放较小的广告，发布商可以通过设置（较大）容器的样式来避免布局偏移。这种方法的缺点是会增加空白区域的面积，所以要注意权衡。

#### 避免在可视区域顶部附近放置广告

可视区域顶部附近的广告可能比中间的广告造成更大的布局偏移。这是因为顶部广告的下方通常会有更多的内容，这就意味着当广告引起偏移时，更多的元素会发生位移。相反，靠近可视区域中间的广告可能不会导致如此多的元素发生位移，因为该广告上方的内容不太可能移动。

### 嵌入和 iframe

可嵌入小组件使您能够在页面中嵌入可移植的网络内容（例如，来自 YouTube 的视频、来自 Google 地图的地图、社交媒体帖子等）。这些嵌入可以采用多种形式：

- 通过 HTML 回退和一个 JavaScript 标签将回退转化为一个华丽的嵌入
- 内联 HTML 片段
- iframe 嵌入

这些嵌入通常无法提前预知某个嵌入会有多大（以社交媒体帖子为例，帖子是否有嵌入的图像？视频？多行文本？）。因此，提供嵌入的平台并不总能为这些嵌入预留足够的空间，并可能在最终加载时导致布局偏移。

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg", controls=true, loop=true, muted=true %}<figcaption>无预留空间的嵌入。</figcaption></figure>

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg", controls=true, loop=true, muted=true %}<figcaption>有预留空间的嵌入。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="灯塔报告显示的在为该嵌入预留空间前/后对累积布局偏移的影响", width="800", height="148" %}<figcaption> 灯塔 6.0 中为该嵌入预留空间对 CLS 的影响</figcaption></figure>

要解决此问题，您可以通过使用占位符或后备回调符为嵌入预先计算足够的空间来最大程度减少 CLS。您可以在嵌入上采用下述工作流程：

- 通过使用您的浏览器开发者工具对其进行检查来获取最终嵌入的高度
- 嵌入加载后，所包含的 iframe 将根据其内容调整到合适大小。

相应地记下嵌入的占位符的尺寸和样式。您可能需要使用媒体查询来了解不同形式因素之间广告/占位符大小的细微差异。

### 动态内容 📐

**概述**：除非是对用户交互做出响应，否则避免在现有内容的上方插入内容。这样能够确保任何布局偏移的发生都在预期之内。

您可能已经在试图加载一个网站时经历过由于在可视区域顶部或底部弹出用户界面而导致的布局偏移。与广告类似，这通常是由横幅和表格导致的，这些横幅和表格会使页面的其余内容发生位移：

- "订阅我们的新闻简报！"（喔，悠着点儿！我们才刚认识！）

- "相关内容"

- "安装我们的 [iOS/安卓] 应用程序"

- "我们仍在接受订单"

- "《一般数据保护条例》通知"

    <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg", controls=true, loop=true, muted=true %}<figcaption>无预留空间的动态内容。</figcaption></figure>

如果您需要显示上述类型的用户界面可供性，请提前在可视区域中为其预留足够的空间（例如，使用占位符或骨架用户界面），以便在加载时不会导致页面内容发生意外位移.

在某些情况下，动态添加内容是用户体验的一个重要部分。例如，加载更多的产品到项目列表或更新实时反馈内容。在这些情况下，有几种方法可以避免意外布局偏移。

- 在一个固定尺寸的容器中用新内容替换旧内容，或者使用轮播，在过渡后删除旧内容。请记得在过渡完成之前禁用任何链接和控件，防止在新内容进入时发生意外点击或触摸。
- 让用户主动加载新内容，这样他们就不会对偏移（例如出现"加载更多"或"刷新"按钮）感到惊讶。我们建议在用户交互前预取内容，以便立即进行显示。这里需要提醒一下，在用户输入后 500 毫秒内发生的布局偏移不计入 CLS。
- 无缝加载屏幕外的内容，并向用户叠加一个通知，说明内容已经可用（例如，显示一个 "向上滚动 "按钮）。

<figure>   {% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="来自 Twitter 和 Chloé 网站的没有造成意外布局偏移的动态内容加载示例", width="800", height="458" %}   <figcaption>没有造成意外布局偏移的动态内容加载示例。左图：Twitter 上的实时内容加载。右图：Chloé 网站上的"加载更多"示例。欢迎查看 YNAP 团队如何<a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">在加载更多内容时对 CLS 进行优化</a>。</figcaption></figure>

### 导致无样式文本闪烁 (FOUT)/不可见文本闪烁 (FOIT) 的网络字体 📝

下载和渲染网络字体可能通过两种方式导致布局偏移：

- 后备字体替换为新字体（FOUT：无样式文本闪烁）
- 新字体完成渲染前显示"不可见"文本（FOIT：不可见文本闪烁）

以下工具可以帮助您最大程度地减少这种情况：

- <code>[font-display](https://developer.chrome.com/docs/lighthouse/performance/font-display/)</code>使您能够通过使用<code>auto</code>、<code>swap</code>、<code>block</code>、<code>fallback</code>和<code>optional</code>值来修改自定义字体的渲染行为。遗憾的是，所有这些值（除 [optional](http://crrev.com/749080) 外）都可能通过上述某种方式导致重排。
- [字体加载 API](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#the_font_loading_api) 可以减少获取必要字体所需的时间。

从 Chrome 83 开始，我还会推荐以下做法：

- 在关键网络字体上使用`<link rel=preload>`：预加载的字体将有更大几率在首次绘制中出现，而在这种情况下将不会发生布局偏移。
- 将`<link rel=preload>`和`font-display: optional`结合使用

阅读[通过预加载可选字体来防止布局偏移和不可见文本闪烁 (FOIT)](/preload-optional-fonts/)了解更多详情。

### 动画 🏃‍♀️

**概述**：倾向于选择`transform`动画，而不是触发布局偏移的属性动画。

对 CSS 属性值的更改可能需要浏览器对这些更改做出反应。许多值都会触发重排、绘制和合成，例如`box-shadow`和`box-sizing`。很多 CSS 属性可以通过代价更小的方式进行更改。

如需进一步了解哪些 CSS 属性会触发布局，请参阅[CSS 触发器](https://csstriggers.com/)和[高性能动画](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)。

### 开发者工具 🔧

我很高兴与大家分享可用于测量和调试累积布局偏移 (CLS) 的各种工具。

[灯塔](https://developer.chrome.com/docs/lighthouse/overview/)[6.0](https://github.com/GoogleChrome/lighthouse/releases)及更高版本支持在实验室环境中测量 CLS。该版本还将突出显示导致最多布局偏移的节点。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="灯塔 6.0 支持在指标部分测量 CLS", width="800", height="309" %}

开发者工具中的[性能面板](https://developer.chrome.com/docs/devtools/evaluate-performance/)突出显示了 Chrome 84 中**体验**部分的布局偏移。`Layout Shift`记录的**摘要**视图包括累积布局偏移分数以及显示受影响区域的矩形叠加层。

<figure>{% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="展开体验部分时，Chrome 开发者工具性能面板中显示出布局偏移记录", width="800", height="438" %}<figcaption>在性能面板中记录新的跟踪后，结果中的<b>体验</b>部分将填充一个显示<code>Layout Shift</code>记录的红色条。单击记录可以让您详细了解受影响的元素（例如，标记位移自/至条目）。</figcaption></figure>

通过[Chrome 用户体验报告](https://developer.chrome.com/blog/chrome-ux-report-bigquery/)也可以测量在域级聚合下的真实 CLS。 CrUX CLS 数据可以通过 BigQuery 获得，并且可以使用[样本查询](https://github.com/GoogleChrome/CrUX/blob/master/sql/cls-summary.sql)查看 CLS 性能 。

以上就是本篇指南的全部内容。我希望这篇指南有助于让您的页面不再那么变化多端 :)

*感谢 Philip Walton、Kenji Baheux、Warren Maresca、Annie Sullivan、Steve Kobes 和 Gilberto Cocchi 的有益评论。*

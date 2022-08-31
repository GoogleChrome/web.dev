---
layout: post
title: Compat 2021：消除网络上的五个主要兼容性痛点
subhead: "Google 正在与其他浏览器供应商和行业合作伙伴协作修复 Web 开发人员面临的前五个浏览器兼容性痛点：CSS flexbox，CSS 网格、`position:sticky`、`aspect-ratio` 和 CSS 变换。"
description: 详细了解 Google 如何与其他浏览器供应商以及行业合作伙伴协作修复 Web 开发人员面临的前五个浏览器兼容性痛点：CSS flexbox、CSS 网格、位置：粘性、纵横比和 CSS 变换。
authors:
  - robertnyman
  - foolip
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/KQ5oNcLGKdBSuUM8pFPx.jpeg
alt: 缺了一块的拼图。
date: 2021-03-22
updated: 2021-11-16
tags:
  - blog
  - css
---

Google 正在与其他浏览器供应商和行业合作伙伴协作，为 Web 开发人员解决前五个浏览器兼容性痛点。重点领域是 CSS flexbox、CSS 网格、`position: sticky`、`aspect-ratio` 和 CSS 变换。请查看[如何做出贡献并继续](#contribute)学习如何参与。

## 背景

Web 上的兼容性一直是开发人员面临的一大挑战。在过去的几年里，Google 和其他合作伙伴，包括 Mozilla 和微软，已经着手更多地了解 Web 开发人员的主要痛点，以推动我们的工作和优先级，使情况变得更好。该项目与 [Google 的开发者满意度](/developer-satisfaction) (DevSAT) 工作相关，随着 2019 年和 2020 年 [MDN DNA（开发者需求评估）调查](https://insights.developer.mozilla.org/)的创建，以及在 [MDN 浏览器兼容性报告 2020](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html) 中呈现的深入研究工作，它在更大规模范围上开展。已经通过各种渠道进行了其他研究，例如[CSS 现状](https://stateofcss.com/)和[JS 现状](https://stateofjs.com/)调查。

2021 年的目标是消除五个关键重点领域的浏览器兼容性问题，以便开发人员可以自信地将它们作为可靠的基础。这项工作被称为 [**#Compat 2021**](https://twitter.com/search?q=%23compat2021&src=typed_query&f=live) 。

## 选择关注什么

基本上，所有的 Web 平台都存在浏览器兼容性问题，但该项目的重点是针对那些少数最有问题的领域，这些领域可以通过努力取得显着改善，它们是开发人员面临的首要问题，需要消除。

兼容性项目使用多个标准来影响优先考虑的领域，其中一些标准是：

- 功能使用。例如，[75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) 的页面浏览量都使用了 flexbox ，而且[HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout) 的采用率也在强劲增长。

- 错误数量（[Chromium](https://bugs.chromium.org/p/chromium/issues/list)、[Gecko](https://bugzilla.mozilla.org/describecomponents.cgi)、[WebKit](https://bugs.webkit.org/) 中），以及对于 Chromium，这些错误有多少颗星。

- 调查结果：

    - [MDN DNA 调查](https://insights.developer.mozilla.org/)
    - [MDN 浏览器兼容性报告](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
    - 最知名和最常用功能的 [CSS 现状](https://2020.stateofcss.com/en-US/features/)

- 来自[web-platform-tests](https://github.com/web-platform-tests/wpt#the-web-platform-tests-project)的测试结果。例如，[wpt.fyi 上的 flexbox](https://wpt.fyi/results/css/css-flexbox)。

- [我可以使用](https://caniuse.com/)的最常搜索功能。

## 2021 年的五个重点领域

2020 年，Chromium 开始致力于解决 [2020 年提高 Chromium 浏览器兼容性](https://blog.chromium.org/2020/06/improving-chromiums-browser.html)中概述的主要领域。2021 年，我们将继续努力。Google 和微软正在与 [Igalia](https://blogs.windows.com/msedgedev/2021/03/22/better-compatibility-compat2021/) 一起致力于[解决 Chromium 中的主要问题](https://www.igalia.com/)。Igalia 是 Chromium 和 WebKit 的定期贡献者，也是嵌入式设备官方 WebKit 端口的维护者，一直非常支持并参与这些兼容性工作，并将帮助解决和跟踪已发现的问题。

以下是承诺在 2021 年修复的领域。

### CSS flexbox

[CSS flexbox](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout) 在网络上被[广泛使用](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692)，但对于开发者来说仍然存在一些重大挑战。例如，[Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=721123) 和 [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209983) 都存在 `auto-height` flex 容器的问题，导致图像大小不正确。

<div class="switcher">
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/qmKoKHkZga5hgBeiHuBz.png", alt="棋盘的拉伸照片。", width="800", height="400" %}<figcaption style="margin-top: auto">由于错误，图像大小不正确。</figcaption></figure>
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/0ruhCiZKRP9jBhnN70Xh.png", alt="棋盘。", width="800", height="800" %}<figcaption style="margin-top: auto">正确大小的图像。<br>摄影：<a href="https://unsplash.com/photos/ab5OK9mx8do">Alireza Mahmoudi</a>。</figcaption></figure>
</div>

[Igalia 的 flexbox Cats](https://blogs.igalia.com/svillar/2021/01/20/flexbox-cats-a-k-a-fixing-images-in-flexbox/) 博客文章通过更多示例深入探讨了这些问题。

#### 为什么优先

- 调查：[MDN 浏览器兼容性报告](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)中的主要问题，[CSS 现状](https://2020.stateofcss.com/en-US/features/)中最长使用和最为人所知
- 测试：所有浏览器中 [85% 通过](https://wpt.fyi/results/css/css-flexbox)
- 使用率：[75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) 的页面浏览量，在 [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)中增长强劲

### CSS 网格

[CSS 网格](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout)是现代 Web 布局的核心构建块，取代了许多旧的技术和变通方法。随着采用率的增长，它需要非常可靠，因此浏览器之间的差异永远不是避免它的理由。缺乏的一个方面是动画网格布局的能力，Gecko 支持，但 [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=759665) 或 [WebKit](https://bugs.webkit.org/show_bug.cgi?id=204580) 不支持。当支持时，可以实现这样的效果：

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Ovs6wg9o5AJUG4IIoVvj.mp4", height="400", controls=false, autoplay=true, loop=true, muted=true, playinline=true %}<figcaption><a href="https://chenhuijing.com/blog/recreating-the-fools-mate-chess-move-with-css-grid/">Chen Hui Jing</a> 演示的动画象棋。</figcaption></figure>

#### 为什么优先

- 调查：[MDN 浏览器兼容性报告](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)中的次要问题，众所周知但在 [CSS 现状](https://2020.stateofcss.com/en-US/features/)中较少使用
- 测试：所有浏览器中 [75% 通过](https://wpt.fyi/results/css/css-grid)
- 使用率：[8% 且稳定增长](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693)，在 [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)中略有增长

{% Aside %} 虽然 [subgrid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid) 等更新的功能对于开发人员很重要，但其不是这项具体工作的一部分。要继续，请参阅 [MDN 上的 Subgrid compat](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid#browser_compatibility)。 {% endAside %}

### CSS 位置：粘性

[粘性定位](https://developer.mozilla.org/docs/Web/CSS/position#sticky_positioning)允许内容粘在视口的边缘，通常用于始终在视口顶部可见的标题。虽然在所有浏览器中都受支持，但在某些常见用例中它无法按预期工作。例如，Chromium 不支持[粘性表头](https://bugs.chromium.org/p/chromium/issues/detail?id=702927)，尽管当前在[flag 后面受支持](https://bugs.chromium.org/p/chromium/issues/detail?id=958381)，但结果在不同的浏览器之间不一致：

<div class="switcher">
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/DtNtuWCZUNwi7GGSBPvA.png", alt="", width="250", height="350" %}<figcaption>有“TablesNG”的 Chromium</figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/hJwLpLeJNfG6kVBUK9Yn.png", alt="", width="250", height="350" %} <figcaption> Gecko </figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/od1YyD2BoBqfrnkzynUK.png", alt="", width="250", height="350" %} <figcaption> WebKit </figcaption></figure>
</div>

查看由 Rob Flack 提供的<a href="https://output.jsbin.com/xunosud">粘性表头演示</a>。

#### 为什么优先

- 调查：在 [CSS 现状](https://2020.stateofcss.com/en-US/features/)中广为人知和使用，在 [MDN 浏览器兼容性报告](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)中多次提及
- 测试：所有浏览器中 [66% 通过](https://wpt.fyi/results/css/css-position/sticky?label=master&label=experimental&product=chrome&product=firefox&product=safari&aligned&q=%28status%3A%21missing%26status%3A%21pass%26status%3A%21ok%29)
- 使用率：[8%](https://www.chromestatus.com/metrics/feature/timeline/popularity/3354)

### CSS 纵横比属性

新的 [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) CSS 属性可以轻松地为元素保持一致的纵横比，从而消除对常见的 [`padding-top` hack 的需要](/aspect-ratio/#the-old-hack-maintaining-aspect-ratio-with-padding-top)：

<div class="switcher">{% Compare 'worse', 'Using padding-top' %} ```css .container { 宽度：100%;填充顶部：56.25%； } ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Using aspect-ratio' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

因为它是如此常见的用例，所以预计会被广泛使用，我们希望确保它在所有常见场景和浏览器中都是可靠的。

#### 为什么优先

- 调查：在[CSS 现状](https://2020.stateofcss.com/en-US/features/)中已广为人知但尚未广泛使用
- 测试：所有浏览器中 [27% 通过](https://wpt.fyi/results/css/css-sizing/aspect-ratio)
- 使用率：[3%](https://www.chromestatus.com/metrics/css/timeline/popularity/657) ，预计会增长

### CSS 变换

多年来，所有浏览器都支持 [CSS 变换](https://developer.mozilla.org/docs/Web/CSS/transform)，并在网络上广泛使用。然而，在许多浏览器中仍然存在许多不同的领域，特别是动画和 3D 变换。例如，卡片翻转效果在浏览器之间可能非常不一致：

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/RhyPpk7dUooEobKZ3VOC.mp4", controls=false, autoplay=true, loop=true, muted=true, playinline=true %}<figcaption> Chromium（左）、Gecko（中）和 WebKit（右）中的卡片翻转效果。来自 David Baron 在<a href="https://bugs.chromium.org/p/chromium/issues/detail?id=1008483#c42">错误评论</a>中的演示。</figcaption></figure>

#### 为什么优先

- 调查：在[CSS 现状](https://2020.stateofcss.com/en-US/features/)中广为人知且广泛使用
- 测试：所有浏览器中 [55% 通过](https://wpt.fyi/results/css/css-transforms)
- 使用率：[80%](https://www.chromestatus.com/metrics/css/timeline/popularity/446)

## 您如何做出贡献和关注 {: #contribute }

关注并分享我们在 [@ChromiumDev](https://twitter.com/ChromiumDev) 或[公共邮件列表 Compat 2021](https://groups.google.com/g/compat2021) 上发布的任何更新。确保存在错误，或将您遇到的问题[进行归档](/how-to-file-a-good-bug/)，如果有任何遗漏，请通过上述渠道联系。

web.dev 上会定期更新进度，您还可以在 [Compat 2021 仪表板中](https://wpt.fyi/compat2021)关注每个重点领域的进度。

<figure><p data-md-type="paragraph"><a href="https://wpt.fyi/compat2021">{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/BgX0dnesIhLaFAKyILzk.png", alt="Compat 2021 Dashboard", width="800", height="942" %}</a></p>
<figcaption>Compat 2021 仪表板（截图日期：2021 年 11 月 16 日）。</figcaption></figure>

我们希望浏览器供应商之间共同努力提高可靠性和互操作性的举措将帮助您在网络上构建卓越的内容！

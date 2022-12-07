---
layout: post
title: 轮播的最佳实践
subhead: 优化轮播以提高性能和可用性。
authors:
  - katiehempenius
description: 了解如何优化轮播以提高性能和可用性。
date: 2021-01-26
hero: image/admin/i7tjE04MYo7xJOZKkyQI.jpg
tags:
  - blog
  - performance
  - web-vitals
---

轮播是一种以类似幻灯片的方式显示内容的 UX 组件。轮播可以“自动播放”或由用户手动导航。尽管轮播可以在其他地方使用，但它们最常用于在主页上显示图像、产品和促销活动。

本文讨论了轮播的性能和 UX 最佳实践。

<figure>{% Img src="image/admin/u2FlXalClwBeDOBBiwxu.png", alt="显示旋转木马的图像", width="629", height="420" %}</figure>

## 性能

实现良好的轮播本身对性能的影响应该非常小或没有影响。然而，轮播经常包含大型媒体资产。大型资产无论显示在轮播中还是其他地方，都会影响性能。

- **LCP (Largest Contentful Paint)**

    大型的首屏轮播经常包含页面的 LCP 元素，因此会对 LCP 产生重大影响。在这些情况下，优化轮播可能会显著提高 LCP。有关如何在包含轮播的页面上进行  LCP 测量的深入说明，请参阅[轮播的 LCP 测量](#lcp-measurement-for-carousels)部分。

- **FID (First Input Delay)**

    轮播对 JavaScript 的要求极低，因此不应影响页面交互性。如果您发现网站的轮播含有长时间运行的脚本，则应考虑更换轮播工具。

- **CLS (Cumulative Layout Shift)**

    数量惊人的轮播使用低质量的非合成动画，而导致 CLS 增加。在自动播放轮播的页面上，这可能导致无限的 CLS。这种类型的 CLS 通常对人眼来说并不明显，使得问题很容易被忽视。为避免此问题，请在轮播中[避免使用非合成动画](https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations/)（例如，在幻灯片切换期间）。

## 性能最佳实践

### 使用 HTML 加载轮播内容

应通过页面的 HTML 标记加载轮播内容，以便浏览器在页面加载过程的早期就能发现它。使用 JavaScript 启动轮播内容的加载可能是使用轮播时应避免的最大性能错误。这会延迟图像加载并对 LCP 产生负面影响。

{% Compare 'better' %}

```html
<div class="slides">
  <img src="https://example.com/cat1.jpg">
  <img src="https://example.com/cat2.jpg">
  <img src="https://example.com/cat3.jpg">
</div>
```

{% endCompare %}

{% Compare 'worse' %}

```javascript
const slides = document.querySelector(".slides");
const newSlide = document.createElement("img");
newSlide.src = "htttp://example.com/cat1.jpg";
slides.appendChild(newSlide);
```

{% endCompare %}

要实现高级轮播优化，请考虑静态加载第一张幻灯片，然后逐步增强以包含导航控件和其他内容。这种技术最适合用户长时间关注的环境 — 具有额外的内容加载时间。在主页之类的环境中，用户可能只停留一两秒钟，只加载单个图像可能同样有效。

### 避免布局偏移

{% Aside %}

Chrome 88-90 内置了多个与布局偏移计算方式有关的[错误修复](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/cls.md)。其中许多错误修复与轮播相关。由于这些修复，在更高版本的 Chrome 中，预计网站的与轮播有关的布局偏移分数应该较低。

{% endAside %}

轮播中的幻灯片切换和导航控件是布局偏移的两个最常见来源：

- **幻灯片切换：**幻灯片切换期间发生的布局偏移通常是因更新 DOM 元素的布局诱导属性而导致的。这些属性的示例包括：`left`、`top`、`width` 和 `marginTop`。为避免布局偏移，请改用 CSS [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform) 属性来切换这些元素。这个[演示](https://glitch.com/~basic-carousel)展示了如何使用 `transform` 来构建一个基本轮播。

- **导航控件：**从 DOM 中移动或添加/删除轮播导航控件可能会导致布局偏移，具体取决于这些更改的实现方式。轮播通常是在响应用户悬停时表现出这种行为。

以下是关于轮播的 CLS 测量的几点常见混淆：

- **自动播放轮播：**幻灯片切换是轮播相关的布局偏移的最常见来源。在非自动播放轮播中，这些布局偏移通常发生在用户交互的 500 毫秒内，[因此不计入 Cumulative Layout Shift (CLS)](/cls/#expected-vs-unexpected-layout-shifts)。然而，对于自动播放轮播，这些布局偏移不仅可以计入 CLS，还可以无限重复。因此，确定自动播放轮播不是布局偏移的来源尤为重要。

- **滚动：**某些轮播允许用户使用滚动来浏览轮播幻灯片。如果元素的起始位置发生变化，但其滚动偏移量（即 [`scrollLeft`](https://developer.mozilla.org/docs/Web/API/Element/scrollLeft) 或 [`scrollTop`](https://developer.mozilla.org/docs/Web/API/Element/scrollTop)）也发生了相同的变化（但方向相反），只要它们发生在同一帧中，就不会被视为布局偏移。

有关布局偏移的更多信息，请参阅[调试布局偏移](/debug-layout-shifts/#identifying-the-cause-of-a-layout-shift)。

### 使用现代技术

许多网站使用[第三方 JavaScript](/third-party-javascript) 库来实现轮播。如果您目前使用较旧的轮播工具，则可以通过切换到较新的工具来提高性能。较新的工具倾向于使用更高效的 API，并且不太可能需要额外的依赖项，如 jQuery。

但是，根据您要构建的轮播类型，您可能完全不需要 JavaScript。新的 [Scroll Snap](https://developer.mozilla.org/docs/Web/CSS/CSS_Scroll_Snap) API 可以仅使用 HTML 和 CSS 实现类似轮播的切换。

以下是一些有关使用 `scroll-snap` 的资源，可能会对您有帮助：

- [构建 Stories 组件 (web.dev)](/building-a-stories-component/)
- [下一代 Web 样式：scroll snap (web.dev)](/next-gen-css-2019/#scroll-snap)
- [仅 CSS 轮播（CSS 技巧）](https://css-tricks.com/css-only-carousel/)
- [如何制作仅 CSS 轮播（CSS 技巧）](https://css-tricks.com/how-to-make-a-css-only-carousel/)

### 优化轮播内容

轮播经常包含网站的部分最大图像，因此值得花时间确保这些图像已完全优化。选择适当的图像格式和压缩级别、[使用图像 CDN](/image-cdns) 以及[使用 srcset 提供多个图像版本](https://developer.mozilla.org/docs/Web/CSS/CSS_Scroll_Snap)都是可以减少图像传输大小的技术。

## 性能测量

本节讨论与轮播相关的 LCP 测量。虽然在 LCP 计算期间对轮播的处理方式与任何其他 UX 元素没有区别，但计算自动播放轮播的 LCP 的机制是一个常见的混淆点。

### 轮播的 LCP 测量

以下是理解如何计算轮播的 LCP 的关键点：

- 在页面元素绘制到框架时，LCP 会考虑它们。一旦用户与页面进行交互（点击、滚动或按键），就不再考虑新的 LCP 候选元素。因此，自动播放的轮播中的任何幻灯片都有可能成为最终的 LCP 元素，而在静态轮播中，只有第一张幻灯片是潜在的 LCP 候选元素。
- 如果渲染两个大小相同的图像，第一个图像将被视为 LCP 元素。只有 LCP 候选元素大于当前 LCP 元素时，才会更新 LCP 元素。因此，如果所有轮播元素的大小相同，则 LCP 元素应该是所显示的第一个图像。
- 在评估 LCP 候选元素时，LCP 会考虑“[可见大小或固有大小，以较小者为准](/lcp)”。因此，如果自动播放的轮播以一致的大小显示图像，但所包含图像的[固有大小](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size)各不相同且小于显示大小，则 LCP 元素可能会随着新幻灯片的显示而改变。在这种情况下，如果所有图像都以相同大小显示，则固有大小最大的图像将被视为 LCP 元素。为了保持低 LCP，您应该确保自动播放的轮播中的所有项目都具有相同的固有大小。

### Chrome 88 中对轮播 LCP 计算的更改

从 [Chrome 88](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md) 开始，后来从 DOM 中删除的图像将被视为潜在的 largest contentful paint。在 Chrome 88 之前，这些图像被排除在考虑范围之外。对于使用自动播放的轮播的网站，此定义更改将对 LCP 分数产生中性或积极影响。

做出此更改是因为[观察](https://github.com/anniesullie/LCP_Examples/tree/master/removed_from_dom)到许多网站通过从 DOM 树中删除先前显示的图像来实现轮播转换。在 Chrome 88 之前，每次展示新幻灯片时，删除前一个元素都会触发 LCP 更新。根据定义，此更改仅影响自动播放的轮播，潜在的 largest contentful paint 只能出现在用户首次与页面交互之前。

## 其他注意事项

本节讨论您在实现轮播时应牢记的 UX 和产品最佳实践。轮播应该推动您的业务目标，并以易于浏览和阅读的方式展示内容。

### 导航最佳实践

#### 提供突出显示的导航控件

轮播导航控件应该易于点击且高度可见。这一点很少有人能做得很好，大多数轮播的导航控件都很小且不易察觉。请记住，单一颜色或样式的导航控件很少适用于所有情况。例如，在深色背景下清晰可见的箭头在浅色背景下可能很难看到。

#### 指示导航进度

轮播导航控件应提供有关幻灯片总数和用户浏览进度的上下文。此信息使用户可以更轻松地导航到特定幻灯片并了解已查看哪些内容。在某些情况下，提供即将显示的内容的预览（无论是下一张幻灯片的摘要还是缩略图列表）也会有帮助并提高参与度。

#### 支持移动端手势

在移动设备上，除了传统的导航控件（例如屏幕按钮），还应支持滑动手势。

#### 提供替代导航路径

因为大多数用户不太可能浏览所有轮播内容，所以轮播幻灯片链接到的内容应该可以从其他导航路径访问。

### 可读性最佳实践

#### 不使用自动播放

自动播放的使用产生了两个几乎矛盾的问题：屏幕动画往往会分散用户的注意力，将目光从更重要的内容移开；同时，由于用户经常将动画与广告联系起来，他们会忽略自动播放的轮播。

因此，最好不要使用自动播放。如果内容很重要，不使用自动播放将最大化其曝光率；如果轮播内容不重要，那么使用自动播放会分散对更重要内容的注意力。此外，自动播放的轮播可能难以阅读（也很烦人）。人们以不同的速度阅读，因此轮播很少能一直在“正确”的时间为不同的用户切换内容。

理想情况下，幻灯片导航应由用户通过导航控件指示。如果必须使用自动播放，则应在用户悬停时禁用自动播放。此外，幻灯片切换速率应该考虑到幻灯片内容 - 幻灯片包含的文本越多，在屏幕上显示的时间就应该越长。

#### 确保文本和图像分开

轮播文本内容经常被“烘焙”到相应的图像文件中，而不是使用 HTML 标记单独显示。这种方法不利于可访问性、本地化和压缩率。它还鼓励采用”一刀切“的资产创建方法。然而，相同的图像和文本格式很少在桌面和移动格式中具有相同的可读性。

#### 简明扼要

您只有几分之一秒的时间来吸引用户的注意力。简短、直截了当的文案会提高信息被传达的几率。

### 产品最佳实践

轮播在不能使用额外的垂直空间显示额外内容的场合效果很好。产品页面上的轮播通常是这种用例的好示例。

然而，轮播并不总是被有效使用。

- 轮播（尤其是包含促销或自动推进时）很容易被用户[误认为](https://www.nngroup.com/articles/auto-forwarding/)广告。用户往往会忽略广告 — 这种现象被称为[横幅失明](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/)。
- 轮播经常用于安抚多个部门，并避免做出有关业务优先级的决定。因此，轮播很容易变成无效内容的倾倒场。

#### 测试您的假设

应该对轮播（尤其是主页上的轮播）的影响进行评估和测试。轮播点击率可以帮助您确定轮播及其内容是否有效。

#### 确保相关性

当轮播包含有趣且相关的内容并以清晰的上下文呈现时，效果最好。如果内容在轮播外部不能吸引用户，那么将其放在轮播中也不会达到更好效果。如果必须使用轮播，请优选内容并确保每张幻灯片都足够相关，让用户愿意点击后面的幻灯片。

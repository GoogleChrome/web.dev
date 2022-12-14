---
title: 用于 Web Vitals 的 CSS
subhead: 用于优化 Web Vitals 的 CSS 相关技术
authors:
  - katiehempenius
  - una
date: 2021-06-02
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/uq7JQlKJo7KBETXnVuTf.jpg
alt: 多色渐变
description: 本文介绍用于优化 Web Vitals 的 CSS 相关技术。
tags:
  - blog
  - performance
  - css
---

您编写样式和构建布局的方式会对 [Core Web Vitals](/collection/) 产生重大影响。对于[累积布局偏移 (CLS)](/cls) 和[最大内容绘制 (LCP)](/lcp) 尤其如此。

本文介绍用于优化 Web Vitals 的 CSS 相关技术。这些优化按页面的不同方面进行细分：布局、图像、字体、动画和加载。在此过程中，我们将探索改进[示例页面](https://codepen.io/una/pen/vYyLKvY)：

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/pgmpMOmweK7BVBsVkQ5g.png", alt="示例网站截图", width="800", height="646" %}

## 布局

### 将内容插入 DOM

在周围的内容已经加载的前提下，如果将内容插入到页面，则会导致页面上的其他所有内容下移。即[布局偏移](/cls/#layout-shifts-in-detail)。

[Cookie 通知](/cookie-notice-best-practices/)，尤其是放置在页面顶部的通知，是此问题的常见示例。加载时经常导致这种类型的布局偏移的其他页面元素包括广告和嵌入。

#### 识别

Lighthouse“避免大的布局偏移”审计会识别已经偏移的页面元素。对于此演示，结果如下所示：

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/jaHtgwzDXCjx3vAFOO33.png", alt="Lighthouse's 'Avoid large layout shifts' audit", width="800", height="500" %}

这些发现中未列出 cookie 通知，因为 cookie 通知本身在加载时不会偏移。相反，它会导致页面上它下面的项目（即 `div.hero` 和 `article` ）偏移。有关识别和修复布局偏移的更多信息，请参阅[调试布局偏移](/debugging-layout-shifts)。

{% Aside %}

在“页面加载”事件未发生时，Lighthouse 只负责分析页面性能。Cookie 横幅、广告和其他小部件有时在页面加载后才会加载。这些布局偏移仍会影响用户——即使这些没有被 Lighthouse 标记。

{% endAside %}

#### 修复

使用绝对位置或固定位置将 cookie 通知放在页面底部。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/YBYLT9jJ9AXrbsaRNVoa.png", alt="页面底部显示的 Cookie 通知", width="800", height="656" %}

前：

```css
.banner {
  position: sticky;
  top: 0;
}
```

后：

```css
.banner {
  position: fixed;
  bottom: 0;
}
```

修复这种布局偏移的另一种方法是在屏幕顶部为 cookie 通知保留空间。这种方法同样有效。有关更多信息，请参阅[Cookie 通知最佳实践](/cookie-notice-best-practices/)。

{% Aside %}

cookie 通知是加载时触发布局偏移的多个页面元素中的一个。为了帮助我们更进一步了解这些页面元素，后续的演示步骤将不包含 cookie 通知。

{% endAside %}

## 图像

### 图像和最大内容绘制 (LCP)

图像通常是页面上最大的内容绘制 (LCP) 元素。可以作为[LCP 元素的其他页面元素](/lcp/#what-elements-are-considered)包括文本块和视频海报图像。LCP 元素加载的时间决定 LCP。

请务必注意，页面的 LCP 元素可能会因页面加载而异，具体取决于页面首次显示时用户可见的内容。例如，在本演示中，cookie 通知的背景、首图和文章文本是一些潜在的 LCP 元素。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bMoAoohyLOgTqV6B7lHr.png", alt="高亮显示不同场景下页面 LCP 元素的图。", width="800", height="498" %}

在示例站点中，cookie 通知的背景图像实际上是一张大图。为了改进 LCP，您可以改为在 CSS 中绘制渐变，而不是加载图像来创建效果。

#### 修复

更改 `.banner` CSS 以使用 CSS 渐变而非图像：

前：

```css
background: url("https://cdn.pixabay.com/photo/2015/07/15/06/14/gradient-845701\_960\_720.jpg")
```

后：

```css
background: linear-gradient(135deg, #fbc6ff 20%, #bdfff9 90%);
```

### 图像和布局偏移

浏览器只能在图像加载后确定图像的大小。如果在页面呈现后加载图像，但没有为图像保留空间，则在图像出现时会发生布局偏移。在本演示中，首图图像在加载时导致布局偏移。

{% Aside %}在图像加载速度较慢的情况下，图像导致布局偏移的现象更为明显。例如，连接速度较慢或加载文件特别大的图像时。 {% endAside %}

#### 识别

要识别没有明确 `width` 和 `height` 的图像，请使用 Lighthouse 的“图像元素具有明确的宽度和高度”审计。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wDGRVi7JaUOTjD9ODOk9.png", alt="Lighthouse 的'图像元素具有明确的宽度和高度'审计", width="800", height="274" %}

在本例中，首图和文章图像都缺少 `width` 和 `height` 属性。

#### 修复

在这些图像上设置 `width` 和 `height` 属性以避免布局偏移。

前：

```html
<img src="https://source.unsplash.com/random/2000x600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" alt="image to load in">
```

后：

```html
<img src="https://source.unsplash.com/random/2000x600" width="2000" height="600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" width="800" height="600" alt="image to load in">
```

<figure>{% Video src="video/j2RDdG43oidUy6AL6LovThjeX9c2/fLUscMG0lGhKnNHef2py.mp4"%}<figcaption>现在图像加载时不会导致布局偏移。</figcaption></figure>

{% Aside %}加载图像的另一种方法是使用 [`srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) 和 [`sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) 属性同时结合指定 `width` 和 `height` 属性。这会带来额外的性能优势，允许您为不同的设备提供不同大小的图像。有关更多信息，请参阅[提供响应式图像](/serve-responsive-images/)。 {% endAside %}

## 字体

字体会延迟文本呈现并导致布局偏移。因此，快速交付字体非常重要。

### 延迟文本呈现

默认情况下，如果尚未加载关联的 Web 字体，浏览器将不会立即呈现文本元素。这样做是为了防止[“无样式文本闪烁”（FOUT）](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) 。在许多情况下，这会延迟[首次内容绘制 (FCP)](/fcp) 。在某些情况下，这会延迟最大内容绘制 (LCP)。

{% Aside %}

默认情况下，如果相关的 Web 字体尚未加载，基于 Chromium 的浏览器和 Firefox 浏览器将[阻止文本呈现长达 3 秒](https://developers.google.com/web/updates/2016/02/font-display)；Safari 将无限期地阻止文本呈现。当浏览器请求 Web 字体时，[阻止时间段](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#the_font_display_timeline)开始。如果在阻止时间段结束时字体仍未加载，浏览器将使用后备字体呈现文本，并在字体可用时交换 Web 字体。

{% endAside %}

### 布局偏移

字体交换虽然非常适合快速向用户显示内容，但有可能导致布局偏移。当 Web 字体及其后备字体在页面上占用不同数量的空间时，就会发生这些布局偏移。使用类似比例的字体将最小化这些布局偏移的大小。

<figure>{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png", alt="显示由字体交换引起的布局偏移的图表", width="800", height="452" %}<figcaption>在此示例中，字体交换导致页面元素向上偏移五个像素。</figcaption></figure>

#### 识别

要查看特定页面上加载的字体，请打开 DevTools 中的 **Network** 选项卡并按 **Font** 筛选器。字体可以是大文件，因此只使用较少的字体通常会提高性能。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Ts38bQtR6x0SDgufA9vz.png", alt="DevTools 中显示的字体截图", width="800", height="252" %}

要查看请求字体所需的时间，请点击 **Timing** 选项卡。越早请求字体，就可以越早加载并使用字体。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wfS7qVThKMkGA7SHd439.png", alt="DevTools 中'Timing'选项卡的屏幕截图", width="800", height="340" %}

要查看字体的请求链，请点击 **Initiator** 选项卡。一般来说，请求链越短，可以越早请求字体。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/0tau1GQnZfj5vPhzwnIQ.png", alt="DevTools 中'Initiator'选项卡的屏幕截图", width="800", height="189" %}

#### 修复

此演示使用 Google Fonts API。Google Fonts 提供了通过 `<link>` 标签或 `@import` 语句加载字体的选项。`<link>`代码片段包括一个 `preconnect` 资源提示。这应该会比使用 `@import` 版本更快地交付样式表。

在非常高的层次上，您可以将[资源提示](https://www.w3.org/TR/resource-hints/#resource-hints)视为向浏览器提示需要建立特定连接或下载特定资源的一种方式。因此，浏览器将优先考虑这些操作。使用资源提示时，请记住优先处理特定操作会从其他操作中夺走浏览器资源。因此，应慎重使用资源提示，而不是用于所有情况。有关详细信息，请参阅[及早建立网络连接以提高感知页面速度](/preconnect-and-dns-prefetch/)。

从样式表中删除以下 `@import` 语句：

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&family=Roboto:wght@300&display=swap');
```

将以下 `<link>` 标签添加至文档的 `<head>` 中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
```

这些链接标签指示浏览器与 Google Fonts 使用的源建立早期连接，并加载包含 Montserrat 和 Roboto 字体声明的样式表。这些 `<link>` 标签应该尽可能早地放在 `<head>` 中。

{% Aside %}

要仅从 Google Fonts 加载字体的子集，请添加 [`?text=`](https://developers.google.com/fonts/docs/getting_started) API 参数。例如， `?text=ABC`仅加载呈现“ABC”所需的字符。这是减小字体文件大小的好方法。

{% endAside %}

## 动画

动画影响 Web Vitals 的主要方式是它们何时引起布局偏移。您应该避免使用两种类型的动画：[触发布局的动画](/animations-guide/#triggers)和移动页面元素的“类动画”效果。 通常，使用 [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform)、[`opacity`](https://developer.mozilla.org/docs/Web/CSS/opacity) 和 [`filter`](https://developer.mozilla.org/docs/Web/CSS/filter) 类的 CSS 属性可将这些动画替换为性能更高的等效动画。有关更多信息，请参阅[如何创建高性能 CSS 动画](/animations/)。

### 识别

Lighthouse“避免非合成动画”审计可能有助于识别不良动画。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/mXgypW9x3qgvmWDLbIZx.png", alt="Lighthouse 的'避免非合成动画'审计", width="512", height="132" %}

{% Aside 'caution' %}

Lighthouse“避免非合成动画”审计仅识别性能不佳的 *CSS 动画*；JavaScript 驱动的动画（例如，使用 [`setInterval()`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 为元素“制作动画”）对性能不利，但不会被此审计标记。

{% endAside %}

### 修复

更改 `slideIn` 动画序列以使用 `transform: translateX()`，而不是转换 `margin-left` 属性。

前：

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}
```

后：

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
```

## 关键 CSS

样式表采用阻止方式呈现。这意味着浏览器遇到样式表时，它将停止下载其他资源，直到浏览器下载并解析了样式表。这可能会延迟 LCP。要提高性能，请考虑[删除未使用的 CSS](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/)、[内联关键 CSS](/extract-critical-css/) 和[推迟非关键 CSS](/defer-non-critical-css/#optimize)。

## 结论

尽管仍有进一步改进的空间（例如，使用[图像压缩](/use-imagemin-to-compress-images/)来更快地传送图像），但这些更改已显着改善了该站点的 Web Vitals。如果这是一个真实站点，下一步将是[从真实用户那里收集性能数据，](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data)以评估它是否[满足大多数用户的 Web Vitals 阈值](/vitals-measurement-getting-started/#data-interpretation)。有关 Web Vitals 的更多信息，请参阅[了解 Web Vitals](/collection/)。

---
title: 响应式网页设计基础知识
subhead: 如何创建响应浏览设备的需要和功能的网站。
description: 如何创建响应浏览设备的需要和功能的网站。
date: 2019-02-12
updated: 2020-05-14
authors:
  - petelepage
  - rachelandrew
tags:
  - blog
  - css
  - layout
  - mobile
  - ux
---

{# TODO(kayce)：在 #1983 到位后删除这个硬编码的 ToC。 #}

- [设置可视区域](#viewport)
- [按可视区域调整内容尺寸](#size-content)
- [使用 CSS 媒体查询来提高响应性](#media-queries)
- [如何选择断点](#breakpoints)
- [在 Chrome DevTools 中查看媒体查询断点](#devtools)

使用移动设备上网的情况持续以天文数字般的速度增长，而这些设备通常受到屏幕显示尺寸的限制，因而需要采用不同的方法来布局屏幕上的内容。

响应式网页设计最初由 [Ethan Marcotte 在《A List Apart》中](http://alistapart.com/article/responsive-web-design/)进行了定义，响应了用户及他们所使用设备的需求。布局会根据设备的尺寸和功能而变化。例如，用户会在手机上看到以单列视图显示的内容，而平板电脑可能会采用两列视图来显示相同的内容。

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RKRFvbuoXGkOSuEArb7.mp4", autoplay=true, controls=true, loop=true, muted=true, playsinline=true %}</figure>

手机、“平板手机”、平板电脑、台式机、游戏机、电视，甚至可穿戴设备中存在多种不同的屏幕尺寸。屏幕尺寸始终在变化，因此至关重要的是您的网站能够适应现在以及将来的任何屏幕尺寸。此外，我们与不同设备的交互方式也不同。例如，您的一部分访问者将使用触摸屏。现代响应式设计将所有这些因素都考虑在内，进而优化每个人的体验。

## 设置可视区域 {: #viewport }

您在为多种设备优化页面时，必须在文档头部包含一个元可视区域标签。元可视区域标签为浏览器提供如何控制页面尺寸和缩放的指示。

为了力图提供最佳体验，移动端浏览器会以桌面端屏幕宽度（因设备而异，通常约为`980px`）来渲染页面，然后尝试通过增大字体和缩放内容来适应屏幕尺寸，提升内容的视觉效果。这就意味着字体大小对用户来说或许会不一致，他们可能需要双击或捏拉缩放才能查看内容并与之交互。

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …

```

使用`width=device-width`元可视区域值可以指示页面采用设备独立像素匹配屏幕宽度。一个设备（或密度）独立像素代表一个像素，在高密度屏幕上可能由许多物理像素组成。这使得页面无论是在小型手机还是大型桌面显示器上进行渲染，都可以对内容进行重排来匹配不同的屏幕尺寸。

<figure>{% Img src="image/admin/SrMBH5gokGU06S0GsjLS.png", alt="文本被过度缩小而难以阅读的页面截图", width="500", height="640" %} <figcaption>页面在没有可视区域元标签的情况下在设备中加载的示例。<a href="https://without-vp-meta.glitch.me/">在 Glitch 上查看此示例</a>。</figcaption></figure>

<figure>{% Img src="image/admin/9NrJxt3aEv37A3E7km65.png", alt="文本大小易于阅读的同一页面截图", width="500", height="888" %} <figcaption>页面在有可视区域元标签的情况下在设备中加载的示例。<a href="https://with-vp-meta.glitch.me/">在 Glitch 上查看此示例</a>。</figcaption></figure>

[部分浏览器](https://css-tricks.com/probably-use-initial-scale1/)在旋转到横屏模式时页面宽度保持不变，同时采用缩放来填充屏幕，而不是通过重排。添加`initial-scale=1`值可以指示浏览器在 CSS 像素和设备独立像素之间建立 1:1 的关系，从而在无需考虑设备方向的情况下使页面能够充分利用完整的横向宽度。

{% Aside '注意' %}为确保旧版浏览器可以正确解析属性，请使用逗号分隔属性。{% endAside %}

[没有包含`width`或`initial-scale`的`<meta name="viewport">`标签](/viewport/) Lighthouse 审计可以帮助您自动确保您的 HTML 文档正确使用了可视区域元标签。

### 确保可视区域的可访问性 {: #accessible-viewport }

除了设置`initial-scale`外，您还可以在可视区域上设置以下属性：

- `minimum-scale`
- `maximum-scale`
- `user-scalable`

设置这些属性后，用户将无法缩放可视区域，因此可能会导致可访问性问题。因此我们不建议使用这些属性。

## 按可视区域调整内容尺寸 {: #size-content }

桌面端和移动端设备的用户都习惯于垂直滚动网站，而不是水平滚动网站；强制用户水平滚动网站或通过缩小来显示全部页面都会导致糟糕的用户体验。

在开发带有元可视区域标签的移动端网站时，很容易意外创建尺寸与指定可视区域不太匹配的页面内容。例如，若显示图像的宽度大于可视区域宽度，就可能会导致可视区域水平滚动。您应该调整内容来匹配可视区域的宽度，使用户无需进行水平滚动。

[内容尺寸与可视区域不匹配](/content-width/)的 Lighthouse 审计可以帮助您自动检测溢出内容。

### 图像 {: #images }

一张图像具有固定的尺寸，如果该图像比可视区域大，就会出现滚动条。对于这个问题，最常用的处理方法就是将所有图像的`max-width`指定为`100%`。在可视区域尺寸比图像小的情况下，这将使图像缩小来与空间相匹配。然而，因为`max-width`是`100%`，而不是`width`是`100%`，图像并不会拉伸到大于其自然尺寸。一般来说，较安全的做法是将以下内容添加到您的样式表中，这样您就永远不会遇到图像导致的滚动条问题了。

```css
img {
  max-width: 100%;
  display: block;
}
```

#### 将图像尺寸添加到 img 元素中 {: #image-dimensions }

虽然您通过使用`max-width: 100%`覆盖了图像的自然尺寸，但是您仍然应该在`<img>`标签上使用`width`和`height`属性。这是因为现代浏览器将使用这些信息来在图像加载前为其预留空间，这样有助于避免随着内容加载而发生的[布局偏移](/optimize-cls/)。

### 布局 {: #layout }

由于不同设备之间（例如，手机与平板电脑之间，甚至不同手机之间）的屏幕尺寸和宽度（以 CSS 像素为单位）差别很大，因此内容不应该依赖于某一特定的可视区域宽度来达到良好的渲染效果。

在过去，我们需要设置元素来按百分比创建布局。在下面的示例中，您可以看到一个包含浮动元素的双列布局，元素尺寸由像素设置。一旦可视区域小于两列的总宽度，我们就必须水平滚动来查看内容。

<figure>{% Img src="image/admin/exFCZNQLUveUnpMFjvcj.jpg", alt="第二列的大部分超出可视区域的双列布局截图", width="800", height="504" %} <figcaption>使用像素设置的浮动布局。<a href="https://layout-floats-px.glitch.me/">在 Glitch 上查看此示例</a>。</figcaption></figure>

通过为宽度设置百分比，列的宽度就会始终保持在容器宽度的特定百分比。这意味着列会随之变窄，而不会出现滚动条。

{% Glitch { id: 'layout-floats-percent', path: 'README.md' } %}

弹性方框布局、网格布局和多列布局等现代 CSS 布局技术使创建这些灵活的网格变得更加容易。

#### 弹性方框布局 {: #flexbox }

当您有一组不同尺寸的元素，而您希望这些元素能够和谐地列进一排或多排，并且较小的元素占据较少的空间，而较大的元素获得更大的空间时，这种布局方法是非常理想的。

```css
.items {
  display: flex;
  justify-content: space-between;
}
```

在响应式设计中，您可以使用弹性方框布局将元素显示为单行排列，或者随着可用空间的减少而组成多行排列。

{% Glitch { id: 'responsive-flexbox', height: 220 } %}

[阅读弹性方框布局的更多相关信息](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox)。

#### CSS 网格布局 {: #grid }

CSS 网格布局使您能够非常直观地创建灵活的网格。如果考虑先前的浮动元素示例，我们可以不使用百分比来创建列，而是取而代之地使用网格布局和`fr`单位，该单位代表容器中的一部分可用空间。

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
```

{% Glitch 'two-column-grid' %}

您也可以使用网格创建常规的网格布局，并且可以包含尽可能多的元素。随着屏幕尺寸的缩小，可用的轨道数量也会减少。在下方的演示里，我们有尽可能多的卡可以排列在每一行中，其中最小的尺寸为`200px`。

{% Glitch 'grid-as-many-as-fit' %}

[阅读 CSS 网格布局的更多相关信息](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Grids)

#### 多列布局 {: #multicol }

对于某些布局类型，您可以采用多列布局 (Multicol)，这种布局可以利用`column-width`属性创建响应式的列数。您可以在下方的演示中看到，只要有空间容纳另一个`200px`的列，布局中就会添加新的列。

{% Glitch { id: 'responsive-multicol', path: 'style.css' } %}

[阅读多列布局的更多相关信息](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Multiple-column_Layout)

## 使用 CSS 媒体查询来提高响应性 {: #media-queries }

有时您会需要对布局进行更大规模的更改来支持特定的屏幕尺寸，而上述所展示的技术并不允许这一点。媒体查询在这种情况下非常实用。

媒体查询是可以应用于 CSS 样式的简单筛选器，能够根据渲染内容的设备类型或该设备的特征来轻松更改样式，例如宽度、高度、方向、悬停功能，以及设备是否被用作触摸屏。

要想提供不同的打印样式，您需要以一种输出*类型*为目标，这样才可以包含一个具有如下打印样式的样式表：

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <link rel="stylesheet" href="print.css" media="print">
    …
  </head>
  …
```

或者，您也可以使用媒体查询在主样式表中包含打印样式：

```css
@media print {
  /* 此处为打印样式 */
}
```

{% Aside '备注' %}也可以使用`@import`语法（`@import url(print.css) print;`）在您的主 CSS 文件中包含单独的样式表，但是出于性能原因，我们不建议您使用此方法。请参阅[避免 CSS 导入](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations#avoid_css_imports)了解更多详情。{% endAside %}

对于响应式网页设计，我们通常会查询设备*特征*，从而为较小的屏幕或者当检测到访问者正在使用触摸屏时提供不同的布局。

### 基于可视区域大小的媒体查询 {: #viewport-media-queries }

媒体查询使我们能够创建响应式体验，提供适用于小屏幕、大屏幕及介于两者之间任何屏幕尺寸的特定样式。因此，我们这里检测的特征是屏幕尺寸，而我们可以检测以下属性。

- `width` （ `min-width` ， `max-width` ）
- `height` （ `min-height` ， `max-height` ）
- `orientation`
- `aspect-ratio`

{% Glitch { id: 'media-queries-size', path: 'index.html' } %}

所有这些功能都具备出色的浏览器支持，如需了解包括浏览器支持信息在内的更多相关详情，请参阅 MDN 上的[宽度](https://developer.mozilla.org/docs/Web/CSS/@media/width)、[高度](https://developer.mozilla.org/docs/Web/CSS/@media/height)、[方向](https://developer.mozilla.org/docs/Web/CSS/@media/orientation)和[长宽比](https://developer.mozilla.org/docs/Web/CSS/@media/aspect-ratio)。

{% Aside '备注' %}尽管规范中确实包括了对`device-width`和`device-height`的检测，但这些已被弃用，您应该避免进行这些检测。`device-width`和`device-height`检测的是设备窗口的实际尺寸，这在实践中并不实用，因为该尺寸可能与用户正在查看的可视区域不一致，例如在用户调整了浏览器窗口大小的情况下。{% endAside %}

### 基于设备功能的媒体查询 {: #capability-media-queries }

鉴于目前可用设备的广度，我们不能假设每台大型设备都是一台常规的台式机或笔记本电脑，或者人们只在小型设备上使用触摸屏。通过对媒体查询规范作出的新补充，我们现在可以检测与设备交互的指针类型以及用户是否可以悬停在元素上等特征。

- `hover`
- `pointer`
- `any-hover`
- `any-pointer`

请尝试在不同设备上查看此演示，例如普通台式机、手机或平板电脑。

{% Glitch 'media-query-pointer' %}

这些较新的功能在所有现代浏览器中都具备良好的支持。您可以在 MDN 页面上了解 [hover](https://developer.mozilla.org/docs/Web/CSS/@media/hover)、[any-hover](https://developer.mozilla.org/docs/Web/CSS/@media/any-hover)、[pointer](https://developer.mozilla.org/docs/Web/CSS/@media/pointer)、[any-pointer](https://developer.mozilla.org/docs/Web/CSS/@media/any-pointer) 的更多相关信息。

#### 使用`any-hover`和`any-pointer`

`any-hover`和`any-pointer`功能检测用户是否能够悬停，或者即使在用户不是主要通过该类型指针来与设备进行交互的情况下还可以使用该类型的指针。您在使用这些功能时要非常谨慎。当用户在使用触摸屏时，强迫他们切换为鼠标是很不友好的！但是，如果确定用户的设备类型对您来说很重要的话，`any-hover`和`any-pointer`可能会非常实用。例如，带有触摸屏和触控板的笔记本电脑除了能够匹配悬停功能外，还应该可以匹配粗略指针和精确指针。

## 如何选择断点 {: #breakpoints }

请不要根据设备类别来定义断点。根据如今被广泛使用的特定设备、产品、品牌名称或操作系统来定义断点可能会导致维护的噩梦。反之，应该由内容本身来决定布局如何与容器相适配。

### 由小到大地选取断点 {: #major-breakpoints }

首先将内容设计为适合小屏幕的尺寸，然后逐步扩展屏幕尺寸，直到需要设置一个断点。这个做法使您能够根据内容来优化断点，同时保持尽可能少的断点。

我们就拿开头看到的示例来说：天气预报。第一步是让天气预报在小屏幕上呈现出良好的效果。

<figure>{% Img src="image/admin/3KPWtKzDFCwImLyHprRP.png", alt="移动设备宽度下的天气应用程序截图", width="400", height="667" %} <figcaption>宽度较窄情况下的应用程序。</figcaption></figure>

接下来，调整浏览器的大小，直到元素之间出现大片空白，这时天气预报的呈现效果就逊色一些了。虽然这个看法有点主观，但超过`600px`肯定是太宽了。

<figure>{% Img src="image/admin/sh1P84rvjvviENlVFED4.png", alt="元素之间间距过大的天气应用程序截图", width="400", height="240" %} <figcaption>该应用程序处于我们认为应该调整设计的地步。</figcaption></figure>

如需在`600px`处插入一个断点，请在 CSS 的末尾为组件创建两个媒体查询，一个在浏览器宽度处于`600px`及以下时使用，另一个在浏览器宽度大于`600px`时使用。

```css
@media (max-width: 600px) {

}

@media (min-width: 601px) {

}
```

最后，请重构 CSS。在`max-width`为`600px`的媒体查询中添加仅适用于小屏幕的 CSS。在`min-width`为`601px`的媒体查询中添加适用于更大屏幕的 CSS。

#### 必要时选择次断点

除了在布局发生显著变化时选择主断点之外，针对微小的变化进行调整也很有帮助。例如，在主断点之间，调整元素的边距或填充，或者增大字体来使元素在布局中更为和谐可能会有所帮助。

我们先从优化小屏幕布局开始。在本示例中，我们在可视区域宽度大于`360px`时增大字体。其次，当有足够空间时，我们可以将高温和低温分开，使两者在同一行上，而不是重叠在一起。我们还可以把天气图标调大一点。

```css
@media (min-width: 360px) {
  body {
    font-size: 1.0em;
  }
}

@media (min-width: 500px) {
  .seven-day-fc .temp-low,
  .seven-day-fc .temp-high {
    display: inline-block;
    width: 45%;
  }

  .seven-day-fc .seven-day-temp {
    margin-left: 5%;
  }

  .seven-day-fc .icon {
    width: 64px;
    height: 64px;
  }
}
```

同样，对于大屏幕来说，最好将天气预报面板限制为最大宽度，这样面板就不会占据整个屏幕宽度了。

```css
@media (min-width: 700px) {
  .weather-forecast {
    width: 700px;
  }
}
```

{% Glitch { id: 'responsive-forecast', path: 'style.css' } %}

### 优化文本，方便阅读

经典的可读性理论表明，一个理想的列应该包含每行 70 到 80 个字符（英语中的大约 8 到 10 个单词）。因此，每当一个文本块的宽度增加至超过 10 个单词时，请考虑添加一个断点。

<figure>{% Img src="image/admin/C4IGJw9hbPXKnTSovEXS.jpg", alt="移动设备上一页文本的截图", width="400", height="488" %} <figcaption>在移动设备上阅读的文本。</figcaption></figure>

<figure>{% Img src="image/admin/rmsa1EB5FpvWV0vFIpTF.jpg", alt="桌面端浏览器中一页文本的截图", width="800", height="377" %} <figcaption>在桌面端浏览器中阅读的文本，已添加断点限制每行的长度。</figcaption></figure>

我们来更深入地看一下上方的博客文章示例。在较小的屏幕上，`1em`的 Roboto 字体可以完美地保持每行 10 个单词，但在较大的屏幕上就需要一个断点。在本示例中，如果浏览器宽度大于`575px`，则理想的内容宽度为`550px`。

```css
@media (min-width: 575px) {
  article {
    width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

{% Glitch { id: 'rwd-reading', path: 'index.html' } %}

### 避免简单地隐藏内容

根据屏幕尺寸选择要隐藏或显示的内容时要谨慎。请不要仅仅因为您无法将内容合理安排在屏幕上就简单地将其隐藏。屏幕尺寸并不能明确指示用户的需求。例如，对于容易在春季过敏的人群来说，他们需要相关信息来确认是否可以外出，而从天气预报中移除花粉计数就可能会是一个严重的问题。

## 在 Chrome DevTools 中查看媒体查询断点 {: #devtools }

设置好媒体查询断点后，您会希望查看您的网站在有了断点后的呈现效果。虽然您可以调整浏览器窗口大小来触发这些断点，但 Chrome DevTools 有一项内置功能，可以让您轻松查看页面在不同断点下的呈现效果。

<figure>{% Img src="image/admin/DhaeCbVo5AmzZ0CyLtVp.png", alt="打开我们的天气应用程序并选择宽度为 822 像素时的 DevTools 截图。", width="800", height="522" %} <figcaption>DevTools 显示的天气应用程序在较宽的可视区域下的呈现效果。</figcaption></figure>

<figure>{% Img src="image/admin/35IEQnhGox93PHvbeglM.png", alt="打开我们的天气应用程序并选择宽度为 436 像素时的 DevTools 截图。", width="800", height="521" %} <figcaption>DevTools 显示的天气应用程序在较窄的可视区域下的呈现效果。</figcaption></figure>

如需在不同的断点下查看您的页面：

请[打开 DevTools](https://developer.chrome.com/docs/devtools/open/)，然后开启[设备模式](https://developer.chrome.com/docs/devtools/device-mode/#toggle)。默认情况下开启的是[响应模式](https://developer.chrome.com/docs/devtools/device-mode/#responsive)。

要想查看您的媒体查询，请打开设备模式菜单并选择[显示媒体查询](https://developer.chrome.com/docs/devtools/device-mode/#queries)，您的断点将以彩色条的形式显示在页面上方。

单击其中一个彩色条来查看对应的媒体查询处于活跃状态时的页面效果。右键单击一个彩色条可以跳转至媒体查询定义。

---
title: 优化 Largest Contentful Paint 最大内容绘制
subhead: 如何更快地渲染您的主要内容。
authors:
  - houssein
date: 2020-05-05
updated: 2020-08-20
hero: image/admin/qqTKhxUFqdLXnST2OFWN.jpg
alt: 优化 LCP 横幅
description: 最大内容绘制 (LCP) 可用于确定页面的主要内容何时在屏幕上完成渲染。了解如何通过改善缓慢的服务器响应速度、资源加载速度和客户端渲染速度来优化 LCP。
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='1073' %}

<blockquote>
  <p>我看不到任何有用的内容！为什么加载需要这么长时间？ 😖</p>
</blockquote>

导致用户体验不佳的一大因素是用户在看到任何内容在屏幕上完成渲染前所需的时间。[First Contentful Paint 首次内容绘制](/fcp) (FCP) 测量初始 DOM 内容完成渲染所需的时间，但该指标无法捕获页面上的最大（通常也更有意义）内容完成渲染所需的时间。

[最大内容绘制](/lcp) (LCP) 是[核心 Web 指标](/vitals/)中的一项指标，用于测量可视区域中最大内容元素变为可见的时间点。该项指标可用于确定页面主要内容在屏幕上完成渲染的时间点。

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9trpfS9wruEPGekHqBdn.svg", alt="好的 LCP 值为 2.5 秒，差的值大于 4.0 秒，两者之间的任何值都需要改进", width="384", height="96" %}
  </picture>

导致 LCP 不佳的最常见原因是：

- [缓慢的服务器响应速度](#slow-servers)
- [阻塞渲染的 JavaScript 和 CSS](#render-blocking-resources)
- [缓慢的资源加载速度](#slow-resource-load-times)
- [客户端渲染](#client-side-rendering)

## 缓慢的服务器响应速度 {: #slow-servers }

浏览器从服务器接收内容所需的时间越长，在屏幕上渲染任何内容所需的时间就越长。更快的服务器响应速度能直接改善包括 LCP 在内的各项页面加载指标。

您首先需要做的是改进服务器处理内容的方式和位置。请使用[**Time to First Byte 首字节时间**](/ttfb/) (TTFB) 来测量您的服务器响应时间。您可以通过多种不同的方式来改进您的 TTFB：

- 优化您的服务器
- 将用户路由到附近的 CDN
- 缓存资产
- 优先使用缓存提供 HTML 页面
- 尽早建立第三方连接
- 使用签名交换

### 优化您的服务器

您是否正在运行需要消耗大量时间和系统资源才能完成的查询？或者服务器端是否有其他复杂的操作会延迟页面内容的返回过程？分析和提高您服务器端代码的效率将直接改善浏览器接收数据所需的时间。

许多服务器端网络框架并不会在浏览器请求时立即提供静态页面，而是需要动态创建网络页面。换句话说，框架并不会在浏览器请求时发送一个已经准备好的完整 HTML 文件，而是需要运行逻辑来构建页面。这可能是由于数据库查询结果待定，甚至是因为组件需要由用户界面框架（例如[React](https://reactjs.org/docs/react-dom-server.html)）生成为标记。在服务器上运行的许多网络框架都有性能指导，您可以利用这些指导来加快此过程。

{% Aside %}请查看[修复过载服务器](/overloaded-server/)，获取更多建议。{% endAside %}

### 将用户路由到附近的 CDN

内容分发网络 (CDN) 是分布在许多不同位置的服务器网络。如果您将网页内容托管在单个服务器上，那么对于地理位置较远的用户来说，您的网站加载速度就会变慢，因为他们的浏览器请求不得不跨越千山万水。您可以考虑使用 CDN 来确保您的用户永远不必为发送到远距离服务器的网络请求而等待。

### 缓存资产

如果您的 HTML 是静态的，且不需要针对每个请求进行更改，那么缓存可以防止网页进行不必要的重建。通过在磁盘上存储已生成 HTML 的副本，服务器端缓存可以减少 TTFB 并最大限度地减少资源使用。

根据您所使用的工具链，有许多不同的方法可以进行服务器缓存：

- 配置反向代理（[Varnish](https://varnish-cache.org/)、[nginx](https://www.nginx.com/)）来提供缓存内容，或者当安装在应用程序服务器之前时充当缓存服务器
- 配置和管理您的云服务提供商（[Firebase](https://firebase.google.com/docs/hosting/manage-cache)、[AWS](https://aws.amazon.com/caching/)、[Azure](https://docs.microsoft.com/en-us/azure/architecture/best-practices/caching)）的缓存行为
- 使用提供边缘服务器的 CDN，以便将您的内容进行缓存并存储在离您的用户更近的地方

### 优先使用缓存提供 HTML 页面

安装好的 [Service Worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) 会在浏览器后台运行，并可以拦截来自服务器的请求。此级别的程序化缓存控制使得缓存部分或全部 HTML 页面内容得以实现，并且只会在内容发生更改时更新缓存。

下方的图表显示使用该模式能够减少网站的 LCP 分布：

<figure>{% Img src="image/admin/uB0Sm56R88MRF16voQ1k.png", alt="HTML 缓存前后的最大内容绘制分布", width="800", height="495" %}<figcaption>最大内容绘制分布，使用（和未使用）Service Worker 进行页面加载的情况 - <a href="https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/">philipwalton.com</a></figcaption></figure>

该图表显示了过去 28 天内某个网站的 LCP 分布，并且按 Service Worker 状态进行了细分。请注意，在 Service Worker 中引入优先使用缓存的 HTML 页面服务后，大多数页面加载的 LCP 值都变得更为迅速（图表的蓝色部分）。

{% Aside %}如需了解优先使用缓存提供完整或部分 HTML 页面的更多相关技巧，请查看[使用 Service Worker 实现更小的 HTML 有效负载](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/){% endAside %}

### 尽早建立第三方连接

对第三方域的服务器请求也会影响 LCP，尤其是当浏览器需要这些请求来在页面上显示关键内容的情况下。使用`rel="preconnect"`来告知浏览器您的页面打算尽快建立连接。

```html
<link rel="preconnect" href="https://example.com" />
```

您还可以使用`dns-prefetch`来更快地完成 DNS 查找。

```html
<link rel="dns-prefetch" href="https://example.com" />
```

尽管两种提示的原理不同，但对于不支持`preconnect`的浏览器，可以考虑将`dns-prefetch`做为后备。

```html
<head>
  …
  <link rel="preconnect" href="https://example.com" />
  <link rel="dns-prefetch" href="https://example.com" />
</head>
```

{% Aside %}如需了解更多详情，请阅读[尽早建立网络连接来提高页面感知速度](/preconnect-and-dns-prefetch/){% endAside %}

### 使用签名交换（SXG）

[签名交换 (SXG)](/signed-exchanges) 是一种交付机制，通过提供采用了易于缓存格式的内容来实现更快的用户体验。具体来说， [Google 搜索](https://developers.google.com/search/docs/advanced/experience/signed-exchange)会缓存 SXG，有时也会预获取 SXG。对于通过 Google 搜索获得大部分流量的网站，SXG 可以是改进 LCP 的重要工具。如需了解更多信息，请参阅[签名交换](/signed-exchanges)。

## 阻塞渲染的 JavaScript 和 CSS {: #render-blocking-resources }

浏览器在能够渲染任何内容之前，需要将 HTML 标记解析为 DOM 树。如果 HTML 解析器遇到任何外部样式表（`<link rel="stylesheet">`）或同步 JavaScript 标签（`<script src="main.js">`），则会暂停解析。

脚本和样式表都是阻塞渲染的资源，这些资源会使 FCP 延迟，进而导致 LCP 延迟。延迟加载任何非关键的 JavaScript 和 CSS，从而提高网页主要内容的加载速度。

### 减少 CSS 阻塞时间

通过以下操作确保您的网站上只有最少量的必要 CSS 会阻塞渲染：

- 削减 CSS
- 延迟加载非关键 CSS
- 内联关键 CSS

### 削减 CSS

为了更加易于阅读，CSS 文件可以包含空格、缩进或注释等字符。这些字符对于浏览器来说都不是必要的，而对这些文件进行削减能够确保将这些字符删除。最终，在减少了阻塞渲染的 CSS 数量后，充分渲染页面主要内容所需的时间 (LCP) 也总是能够相应地缩短。

如果您使用模块打包器或构建工具，那么可以在其中包含一个相应的插件来在每次构建时削减 CSS 文件：

- 对于 webpack：[optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
- 对于 Gulp：[gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- 对于 Rollup：[rollup-plugin-css-porter](https://www.npmjs.com/package/rollup-plugin-css-porter)

<figure>{% Img src="image/admin/vQXSKrY1Eq3CKkNbu9Td.png", alt="LCP 改进示例：削减 CSS 前后对比", width="800", height="139" %}<figcaption>LCP 改进示例：削减 CSS 前后对比</figcaption></figure>

{% Aside %} 如需了解更多详情，请参阅[削减 CSS](/minify-css/) 指南。{% endAside %}

### 延迟加载非关键 CSS

使用 Chrome 开发者工具中的[代码覆盖率](https://developer.chrome.com/docs/devtools/coverage/)选项卡查找您网页上任何未使用的 CSS。

{% Img src="image/admin/wjS4NrU5EsJeCuvK0zhn.png", alt="Chrome 开发者工具中的代码覆盖率选项卡", width="800", height="559" %}

优化方式：

- 如果是在您网站的单独页面上使用，可以将所有未使用的 CSS 完全删除或移动到另一个样式表。
- 对于任何初始渲染时不需要的 CSS，请使用 [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md) 来异步加载文件，这里运用了`rel="preload"`和`onload`。

```html
<link rel="preload" href="stylesheet.css" as="style" onload="this.rel='stylesheet'">
```

<figure>{% Img src="image/admin/2fcwrkXQRQrM8w1qyy3P.png", alt="LCP 改进示例：延迟加载非关键 CSS 前后对比", width="800", height="139" %}<figcaption>LCP 改进示例：延迟加载非关键 CSS 前后对比</figcaption></figure>

{% Aside %}如需了解更多详情，请参阅[延迟加载非关键 CSS](/defer-non-critical-css/) 指南。 {% endAside %}

### 内联关键 CSS

通过把用于首屏内容的任何关键路径 CSS 直接包括在`<head>`中来将这些 CSS 进行内联。

<figure>{% Img src="image/admin/m0n0JsLpH9JsNnXywSwz.png", alt="内联的关键 CSS", width="800", height="325" %}<figcaption>内联的关键 CSS</figcaption></figure>

将重要样式进行内联后，就不再需要通过往返请求来获取关键 CSS。延迟加载其余部分可以最大限度地减少 CSS 阻塞时间。

如果您无法为您的网站手动添加内联样式，请使用库来将该过程自动化。一些示例：

- [Critical](https://github.com/addyosmani/critical)、[CriticalCSS](https://github.com/filamentgroup/criticalCSS) 和 [Penthouse](https://github.com/pocketjoso/penthouse) 都是提取和内联首屏 CSS 的包
- [Critters](https://github.com/GoogleChromeLabs/critters) 是一个 webpack 插件，能够内联关键 CSS 并对其余部分进行懒加载

<figure>{% Img src="image/admin/L8sc51bd3ckxwnUfczC4.png", alt="LCP 改进示例：内联关键 CSS 前后对比", width="800", height="175" %}<figcaption>LCP 改进示例：内联关键 CSS 前后对比</figcaption></figure>

{% Aside %}请查看[提取关键 CSS](/extract-critical-css/) 指南了解更多信息。{% endAside %}

### 减少 JavaScript 阻塞时间

下载并向用户提供尽可能少的必要 JavaScript。减少阻塞渲染的 JavaScript 数量能够让渲染速度更快，从而获得更好的 LCP。

这可以通过优化您的脚本来实现，有如下几种不同的方式：

- [削减和压缩 JavaScript 文件](/reduce-network-payloads-using-text-compression/)
- [延迟加载未使用的 JavaScript](/reduce-javascript-payloads-with-code-splitting/)
- [最大限度减少未使用的 polyfill](/serve-modern-code-to-modern-browsers/)

{% Aside %}[优化首次输入延迟](/optimize-fid/)指南更详细地介绍了减少 JavaScript 阻塞时间所需的全部技巧。{% endAside %}

## 缓慢的资源加载速度 {: #slow-resource-load-time }

虽然 CSS 或 JavaScript 阻塞时间的增加会直接导致性能下降，但加载许多其他类型资源所需的时间也会影响绘制时间。影响 LCP 的元素类型为：

- `<img>`元素
- 内嵌在`<svg>`元素内的`<image>`元素
- `<video>`元素（使用[封面](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster)图像测量 LCP）
- 通过[`url()`](https://developer.mozilla.org/docs/Web/CSS/url())函数（而非使用<a> CSS 渐变</a>）加载的带有背景图像的元素
- 包含文本节点或其他行内级文本元素的[块级](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements)元素

如果在首屏渲染，加载这些元素所需的时间将对 LCP 产生直接影响。有几种方法可以确保尽快加载这些文件：

- 优化和压缩图像
- 预加载重要资源
- 压缩文本文件
- 基于网络连接交付不同资产（自适应服务）
- 使用 Service Worker 缓存资产

### 优化和压缩图像

对于许多网站来说，在页面加载完毕后，图像会是视图中的最大元素。这种情况的常见示例包括首图、大型轮播或横幅图像。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/unWra6cq0hPJJJT7Y3ye.png", alt="", width="459", height="925" %}<figcaption>图像为最大页面元素：<a href="https://design.google/">design.google</a></figcaption></figure>

改善这些类型的图像进行加载和渲染所需的时间将直接提升 LCP 的速度。实现方式：

- 首先考虑不使用图像。如果图像与内容无关，请将其删除。
- 压缩图像（例如使用 [Imagemin](/use-imagemin-to-compress-images)）
- 将图像转换为更新的格式（JPEG 2000、JPEG XR 或 WebP）
- 使用响应式图像
- 考虑使用图像 CDN

{% Aside %}请查看[优化您的图像](/fast/#optimize-your-images)的相关指南和资源，其中对上述所有技巧展开了详细的阐述。{% endAside %}

### 预加载重要资源

有时，在某个 CSS 或 JavaScript 文件中声明或使用的重要资源可能会比您所期望的要晚一点被获取，例如深藏在应用程序众多 CSS 文件中的某个字体。

如果您知道某个特定资源应该被优先获取，请使用`<link rel="preload">`来更加及时地获取该资源。 [多种类型的资源](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded)都可以进行预加载，但您应该首先侧重于[预加载关键资产](/preload-critical-assets/)，例如字体、首屏图像或视频，以及关键路径 CSS 或 JavaScript。

```html
<link rel="preload" as="script" href="script.js" />
<link rel="preload" as="style" href="style.css" />
<link rel="preload" as="image" href="img.png" />
<link rel="preload" as="video" href="vid.webm" type="video/webm" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

从 Chrome 73 开始，预加载可以与[响应式图像](/preload-responsive-images/)一起使用，将两种模式相结合能够实现更快速的图像加载。

```html
<link
  rel="preload"
  as="image"
  href="wolf.jpg"
  imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w"
  imagesizes="50vw"
/>
```

### 压缩文本文件

压缩诸如 [Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) 和 [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) 之类的算法可以显著缩减在服务器和浏览器之间传输的文本文件（HTML、CSS、JavaScript）大小。所有浏览器都有效支持 Gzip，而 Brotli [几乎可以在所有较新的浏览器中使用](https://caniuse.com/#feat=brotli)，并能提供更好的压缩结果。

压缩您的资源将最大限度地减少这些资源的交付大小、缩短加载时间，从而改善 LCP。

1. 首先，检查您的服务器是否已经自动压缩文件。大多数托管平台、CDN 和反向代理服务器在默认情况下都会对资产进行压缩编码，或者使您能够轻松配置资产。
2. 如果您需要对服务器进行修改来使其压缩文件，请考虑使用 Brotli，而不是 gzip，因为 Brotli 可以提供更好的压缩率。
3. 选择您要使用的压缩算法后，请在构建过程中提前压缩资产，而不是在浏览器请求时实时压缩资产。这样能够最大限度地减少服务器开销并防止在发出请求时出现延迟，尤其是在使用高压缩比的情况下。

<figure>{% Img src="image/admin/Ckh2Jjkoh7ojLj5Wxeqc.png", alt="LCP 改进示例：Brotli 压缩前后对比", width="800", height="139" %}<figcaption>LCP 改进示例：Brotli 压缩前后对比</figcaption></figure>

{% Aside %} 如需了解更多详情，请参阅[削减和压缩网络有效负载](/reduce-network-payloads-using-text-compression/)指南。{% endAside %}

### 自适应服务

当加载构成页面主要内容的资源时，根据用户的设备或网络条件按需获取不同的资源会是一个有效做法。您可以使用[网络状况 API](https://wicg.github.io/netinfo/)、[设备内存 API](https://www.w3.org/TR/device-memory/) 和[硬件并发 API](https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency) 来实现这一做法。

如果您有对初始渲染十分关键的大型资产，那么您可以根据用户的连接或设备采用同一资源的不同变体。例如，对于任何低于 4G 的连接速度，您可以显示图像，而不是视频：

```js
if (navigator.connection && navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // 加载视频
  } else {
    // 加载图像
  }
}
```

您可以使用的一系列实用属性：

- `navigator.connection.effectiveType`：有效连接类型
- `navigator.connection.saveData`：启用/禁用数据保护程序
- `navigator.hardwareConcurrency`：CPU 核心数
- `navigator.deviceMemory`：设备内存

{% Aside %}如需了解更多详情，请参阅[基于网络质量的自适应服务](/adaptive-serving-based-on-network-quality/)。{% endAside %}

### 使用 Service Worker 缓存资产

Service Worker 可用于完成许多有用的任务，其中包括本文前面提到的提供较小的 HTML 响应。Service Worker 还可用于缓存任何静态资源，并在收到重复请求时将资源直接提供给浏览器，而无需通过网络。

使用 Service Worker 预缓存关键资源可以显著减少资源加载时间，特别是对于使用较弱连接重新加载网页（甚至离线访问）的用户。与自己编写自定义 Service Worker 来更新预缓存资产相比，诸如 [Workbox](https://developer.chrome.com/docs/workbox/) 这样的库可以使整个过程更加容易。

{% Aside %}请查看[网络可靠性](/reliable/)，了解 Service Worker 和 Workbox 的更多相关信息。{% endAside %}

## 客户端渲染 {: #client-side-rendering }

许多网站使用客户端 JavaScript 逻辑直接在浏览器中渲染页面。诸如 [React](https://reactjs.org/)、[Angular](https://angular.io/) 和 [Vue](https://vuejs.org/) 这类的框架和库使构建单页应用变得更加容易，这些单页应用完全在客户端（而不是在服务器）中处理网页的各个层面。

如果您正在搭建一个主要在客户端进行渲染的网站，那么您应该特别小心网站在使用大型 JavaScript 包时可能对 LCP 产生的影响。如果您没有通过优化来加以阻止，那么在所有关键 JavaScript 完成下载和执行前，用户可能都无法看到页面上的任何内容或与之交互。

在搭建客户端渲染的网站时，请考虑以下优化：

- 最小化关键 JavaScript
- 使用服务端渲染
- 使用预渲染

### 最小化关键 JavaScript

如果您网站上的内容只有在一定数量的 JavaScript 完成下载后才变得可见或可以与之交互：尽可能缩减您的代码包的大小就变得尤为重要。这可以通过以下方式实现：

- 削减 JavaScript
- 延迟加载未使用的 JavaScript
- 最大限度减少未使用的 polyfill

请回到[减少 JavaScript 阻塞时间](#reduce-javascript-blocking-time)部分，阅读有关这些优化的更多信息。

### 使用服务端渲染

对于主要由客户端渲染的网站来说，首先需要关注的始终应该是将 JavaScript 的数量最小化。但是，您还应该考虑结合服务端渲染体验来尽可能地改善 LCP。

这个概念的实现方式是使用服务器将应用渲染为 HTML，然后客户端将所有 JavaScript 及所需数据"[水合](https://www.gatsbyjs.org/docs/react-hydration/)"到相同的 DOM 内容中。这个做法可以通过确保页面的主要内容首先在服务器上进行渲染（而不是仅在客户端上进行渲染）来改进 LCP，但该做法有一些弊端：

- 在服务器和客户端上维护相同的由 JavaScript 渲染的应用会增加复杂性。
- 与只使用服务器提供静态页面相比，在服务器上执行 JavaScript 来渲染 HTML 文件总是会增加服务器响应时间 (首字节时间 TTFB)。
- 服务端渲染的页面可能看似具备交互性，但在所有客户端 JavaScript 执行完毕之前，页面其实无法对任何用户输入作出响应。简而言之，该做法会使 [**Time to Interactive 可交互时间**](/tti/) (TTI) 变得更糟。

### 使用预渲染

预渲染是一种独立的技巧，该技巧比服务端渲染简单，并且还提供了一种改进应用程序 LCP 的方法。无头浏览器是一种没有用户界面的浏览器，我们会用无头浏览器在搭建期间生成每个路由的静态 HTML 文件。然后可以将这些文件与应用程序所需的 JavaScript 包一起进行运送。

在使用预渲染后，TTI 仍然会受到负面影响，但服务器响应时间不会像服务端渲染解决方案（仅在接到请求后才对各个页面进行动态渲染）中那样受到很大影响。

<figure>{% Img src="image/admin/sm9s16UHfh8a5MDEWjxa.png", alt="LCP 改进示例：预渲染前后对比", width="800", height="139" %}<figcaption>LCP 改进示例：预渲染前后对比</figcaption></figure>

{% Aside %} 如需更深入地了解不同的服务端渲染架构，请查看[网络中的渲染](/rendering-on-the-web/)。{% endAside %}

## 开发者工具

许多工具都可以用于测量和调试 LCP：

- [灯塔 6.0](https://developer.chrome.com/docs/lighthouse/overview/) 支持在实验室环境中测量 LCP。

    {% Img src="image/admin/Sar3Pa7TDe9ibny6sfq4.jpg", alt="灯塔 6.0", width="800", height="309" %}

- Chrome 开发者工具中[性能](https://developer.chrome.com/docs/devtools/evaluate-performance/)面板的**时间点**部分包括一个 LCP 标记，并会在您将鼠标悬停在**相关节点**字段上时显示哪些元素与 LCP 相关联。

    {% Img src="image/admin/sxczQPKH0cvMBsNCx5uH.png", alt="Chrome 开发者工具中的 LCP", width="800", height="509" %}

- [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)提供在域级聚合下的真实 LCP 值

*感谢 Philip Walton、Katie Hempenius、Kayce Basques 和 Ilya Grigorik 的审阅。*

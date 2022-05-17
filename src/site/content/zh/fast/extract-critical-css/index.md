---
layout: post
title: 提取关键 CSS (Critical CSS)
subhead: 了解如何使用关键 CSS 技术改进渲染时间。
authors:
  - mihajlija
date: 2019-05-29
hero: image/admin/ZC6iWHhgnrSZtPJMfwMh.jpg
alt: 扳手和螺丝刀的平面照片。
description: 了解如何使用关键 CSS 技术缩短渲染时间，以及如何为项目选择最佳工具。
codelabs: codelab-extract-and-inline-critical-css
tags:
  - blog
  - performance
  - css
---

浏览器必须先下载并解析 CSS 文件，然后才能显示页面，这样 CSS 可能会导致渲染不畅。如果 CSS 文件很大，或者网络条件很差，那么请求 CSS 文件会显着增加网页渲染所需的时间。

{% Aside 'key-term' %}关键 CSS (Critical CSS) 是一种提取首屏内容 CSS，以便尽快向用户呈现内容的技术。 {% endAside %}

<figure>{% Img src="image/admin/t3Kkvh265zi6naTBga41.png", alt="笔记本电脑和移动设备的网页溢出屏幕边缘的截图", width="800", height="469", class =""%}</figure>

{% Aside 'note' %}首屏是浏览用户在滚动加载页面前看到的所有内容。由于存在无数的设备和屏幕尺寸，因此首屏内容的像素高度没有统一定义。 {% endAside %}

将提取的样式内联到 HTML 文档的 `<head>` 中，从而无需发出额外的请求就能获取这些样式。 CSS 的其余部分可以异步加载。

<figure>{% Img src="image/admin/RVU3OphqtjlkrlAtKLEn.png", alt="标签内嵌关键 CSS 的 HTML 文件", width="800", height="325" %}<figcaption>内联关键 CSS</figcaption></figure>

缩短渲染时间可以对[用户体验](/rail/#focus-on-the-user)产生巨大影响，尤其是在较差的网络条件下。在移动网络上，无论带宽如何，高延迟都是一个问题。

<figure>{% Img src="image/admin/NdQz49RVgdHoh3Fff0yr.png", alt="使用 3G 连接加载具有渲染阻塞 CSS（顶部）的页面和具有内联关键 CSS（底部）的相同页面的胶片视图比较。顶部幻灯片在最终显示内容之前显示六个空白帧。底部幻灯片在第一帧显示有意义的内容。", width="800", height="363" %}<figcaption>使用 3G 连接加载具有渲染阻塞 CSS 的页面（顶部）和具有内联关键 CSS 的同一页面（底部）的比较</figcaption></figure>

如果您的 [First Contentful Paint (FCP)](/fcp/) 表现很差，并且在 Lighthouse 审计中看到了“消除渲染阻塞资源”，那么试试关键 CSS 是个不错的选择。

{% Img src="image/admin/0xea7menL90lWHwbjZoP.png", alt="Lighthouse 的”消除渲染阻塞资源“或”延迟加载未使用的 CSS“ 审计", width="743", height="449" %}

{% Aside 'gotchas' %} 请记住，如果你内联了大量 CSS，则会延迟 HTML 文档其余部分的传输。如果所有内容都被优先处理，那么也就没有了意义。内联也有一些缺点，因为它会阻止浏览器缓存 CSS 以便在后续页面加载时重用，因此最好谨慎使用它。 {% endAside %}

<p id="14KB">为了最大限度地减少首次渲染的次数，应将首屏内容保持在 <strong>14 KB</strong> （压缩）以下。</p>

{% Aside 'note' %}新的 [TCP](https://hpbn.co/building-blocks-of-tcp/) 连接无法立即利用客户端和服务器之间的全部可用带宽，这些连接会经过[慢启动](https://hpbn.co/building-blocks-of-tcp/#slow-start)以避免数据量超过连接的承载能力。在这个过程中，服务器会先开始传输少量数据，如果数据以完美的状态到达客户端，那么下一次往返中数据量会加倍。对于大多数服务器，第一次往返最多可以传输 10 个数据包或大约 14 KB。 {% endAside %}

此技术可实现的性能提升取决于您的网站类型。一般来说，网站使用的 CSS 越多，内联 CSS 可能产生的影响就越大。

## 工具概览

有许多出色的工具可以自动确定页面的关键 CSS。这是个好消息，因为手动执行此操作会相当乏味。它需要分析整个 DOM 以确定视区中应用的每个元素的样式。

### Critical

[Critical](https://github.com/addyosmani/critical) 可提取、缩小和内联首部 CSS，可作为[npm 模块使用](https://www.npmjs.com/package/critical)。它可以与 Gulp（直接）或 Grunt（作为[插件](https://github.com/bezoerb/grunt-critical)）一起使用，并且还有一个 [webpack 插件](https://github.com/anthonygore/html-critical-webpack-plugin)。

这是个简单的工具，会在处理时进行大量思考。您甚至不必指定样式表，Critical 会自动检测它们。它还支持为多个屏幕分辨率提取关键 CSS。

### criticalCSS

[CriticalCSS](https://github.com/filamentgroup/criticalCSS) 是另一个可以提取首屏 CSS的[npm 模块](https://www.npmjs.com/package/criticalcss)。它也可用于 CLI。

它没有内联和缩小关键 CSS 的选项，但它允许您强制包含实际上不属于关键 CSS 的规则，并提供了对包含 `@font-face` 声明的更精细的控制。

### Penthouse

如果您的站点或应用程序具有大量的样式或动态注入 DOM 的样式（在 Angular 应用程序中很常见），那么 [Penthouse](https://github.com/pocketjoso/penthouse) 是一个不错的选择。它使用 [Puppeteer](https://github.com/GoogleChrome/puppeteer)，还提供[在线版本](https://jonassebastianohlsson.com/criticalpathcssgenerator/)。

Penthouse 不会自动检测样式表，您必须指定要为其生成关键 CSS 的 HTML 和 CSS 文件。好处是它擅长并行处理多个作业。

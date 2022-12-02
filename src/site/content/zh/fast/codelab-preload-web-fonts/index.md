---
layout: codelab
title: 通过预加载 web 字体提高加载速度
authors:
  - gmimani
description: 通过此 Codelab ，了解如何通过预加载 web 字体来提高网页性能。
date: 2018-04-23
glitch: web-dev-preload-webfont?path=index.html
related_post: preload-critical-assets
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

此 Codelab 向您展示了如何通过 `rel="preload"` 来预加载 web 字体，从而避免出现无样式文本 (FOUT) 闪烁的情况。

## 措施

在添加任何优化之前，首先测量网站的性能表现。 {% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

生成的 Lighthouse 报告将显示**最大关键路径延迟**下的资源获取顺序。

{% Img src="image/admin/eperh8ZUnjhsDlnJdNIG.png", alt="关键请求链中的 web 字体。", width="704", height="198" %}

在上方的审计中，web 字体是关键请求链的一部分，并且会最后获取。[**关键请求链**](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)是指浏览器优先处理和获取资源的顺序。在此应用程序中，web 字体（Pacfico 和 Pacifico-Bold）通过 [@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face) 规则定义，并且是浏览器在关键请求链中获取的最后一个资源。Web 字体通常会延迟加载，即在下载关键资源（CSS、JS）之前不会加载它们。

下面列出了应用程序获取资源的顺序：

{% Img src="image/admin/9oBNjZORrBj6X8RVlr9t.png", alt="Web 字体是延迟加载的。", width="583", height="256" %}

## 预加载 Web 字体

为避免出现 FOUT 情况，您可以立即预加载需要的 web 字体。请在文档头为此应用添加 `Link` 元素：

```html
<head>
 <!-- ... -->
 <link rel="preload" href="/assets/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

`as="font" type="font/woff2"`属性会告诉浏览器将此资源作为字体下载，并帮助确定资源队列的优先级。

`crossorigin` 属性说明是否应使用 CORS 请求获取资源，因为字体可能来自不同的域。如果不设置此属性，浏览器将忽略预加载的字体。

由于页眉中使用了 Pacifico-Bold，我们添加了一个预加载标记，从而可以更快地获取它。是否预加载 Pacifico.woff2 字体并不重要，因为它会格式化折叠下方的文本样式。

重新加载应用程序并再次运行 Lighthouse。检查**最大关键路径延迟**部分。

{% Img src="image/admin/lC85s7XSc8zEXgtwLsFu.png", alt="已预加载 Pacifico-Bold web 字体并从将其从关键请求链中删除", width="645", height="166" %}

请注意`Pacifico-Bold.woff2`是如何从关键请求链中删除的。在应用程序中。它的获取时间较早。

{% Img src="image/admin/BrXidcKZfCbbUbkcSwas.png", alt="已预加载 Pacifico-Bold web 字体", width="553", height="254" %}

通过预加载，浏览器知道它需要提前下载这个文件。需要注意的是，如果使用不当，预加载可能会对未使用的资源发出不必要的请求，从而导致性能损耗。

---
layout: post
title: 使用图像 CDN 优化图像
authors:
  - katiehempenius
description: 图像 CDN 在优化图像方面非常出色。切换到图像 CDN 可以节省 40-80% 的图像字节。
date: 2019-08-14
codelabs:
  - install-thumbor
tags:
  - performance
---

## 为什么使用图像 CDN？

图像内容分发网络 (CDN) 在优化图像方面非常出色。切换到图像 CDN 可以节省 [40-80%](https://www.youtube.com/watch?v=YJGCZCaIZkQ&t=1010s) 的图像文件大小。理论上，只使用构建脚本也可以达到相同的效果，但在实践中很少见。

## 什么是图像 CDN？

图像 CDN 专门从事图像的转换、优化和分发。您也可以将它们视为 API，用于访问和处理网站上使用的图像。对于从图像 CDN 加载的图像，图像 URL 不仅指示要加载的图像，还指示大小、格式和质量等参数。这样便可针对不同用例轻松创建图像的变体。

<figure>{% Img src="image/admin/OIF2VcXp8P6O7tQvw53B.jpg", alt="显示图像 CDN 和客户端之间的请求/响应流。大小和格式等参数用于请求同一图像的变体。", width ="800", height="408" %} <figcaption> 图像 CDN 可以根据图像 URL 中的参数执行的转换示例。</figcaption></figure>

图像 CDN 与构建时图像优化脚本的不同之处在于，它们根据需要创建图像的新版本。因此，CDN 通常比构建脚本更适合创建针对每个单独客户端高度定制的图像。

## 图像 CDN 如何使用 URL 指示优化选项

图像 CDN 使用的图像 URL 可传达有关图像的重要信息以及应该对其应用的转换和优化。URL 格式会因图像 CDN 的不同而有所不同，但在高层次上，它们都具有相似的功能。让我们来看一些最常见的功能。

<figure>{% Img src="image/admin/GA4udXeYUEjHSY4N0Qew.jpg", alt="图像 URL 通常包含以下成分：来源、图像、安全密钥和转换。", width="800", height="127" %}</figure>

### 来源

图像 CDN 可以使用您自己的域或您的图像 CDN 的域。第三方图像 CDN 通常提供付费使用自定义域的选项。如果使用您自己的域，以后可以更容易地切换图像 CDN，因为不需要更改 URL。

上面的示例使用带有个性化子域的图像 CDN 域 ("example-cdn.com")，而不是自定义域。

### 图像

图像 CDN 通常可以配置为在需要时自动从图像的现有位置检索图像。此功能的实现方式通常是，将*现有图像*的完整 URL 包含在图像 CDN 生成的图像的 URL 中。例如，您可能会看到如下所示的 URL：`https://my-site.example-cdn.com/https://flowers.com/daisy.jpg/quality=auto`。此 URL 将获取并优化存在于 `https://flowers.com/daisy.jpg` 的图像。

将图像上传到图像 CDN 的另一种广泛支持的方法是通过 HTTP POST 请求将图像发送到图像 CDN 的 API。

### 安全密钥

安全密钥可防止其他人创建您的图像的新版本。如果启用此功能，图像的每个新版本都需要唯一的安全密钥。如果有人尝试更改图像 URL 的参数，但未提供有效的安全密钥，他们将无法创建新版本。您的图像 CDN 将处理生成和跟踪安全密钥的细节。

### 转换

图像 CDN 提供数十种（某些情况下数百种）不同的图像转换。这些转换通过 URL 字符串指定，并且对同时使用多个转换没有限制。在 Web 性能方面，最重要的图像转换是大小、像素密度、格式和压缩。这些转换是切换到图像 CDN 通常会使图像大小显著减小的原因。

性能转换往往有一个客观的最佳设置，因此一些图像 CDN 支持这些转换的“自动”模式。例如，您可以允许 CDN 自动选择并提供最佳格式，而不是指定将图像转换为 WebP 格式。图像 CDN 可用来确定图像转换的最佳方式的信号包括：

- [客户端提示](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/)（例如，视口宽度、DPR 和图像宽度）
- [`Save-Data`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Save-Data) 标头
- [User-Agent](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent) 请求标头
- [网络状况 API](https://developer.mozilla.org/docs/Web/API/Network_Information_API)

例如，图像 CDN 可能为 Edge 浏览器提供 JPEG XR，为 Chrome 浏览器提供 WebP，为非常旧的浏览器提供 JPEG。自动设置很受欢迎，因为您可以利用图像 CDN 在图像优化方面的大量专业知识，而无需在图像 CDN 支持新技术后更改代码来采用新技术。

## 图像 CDN 的类型

图像 CDN 可以分为两类：自我管理和第三方管理。

### 自我管理的图像 CDN

如果网站的工程人员愿意维护自己的基础设施，那么自我管理的 CDN 是一个不错的选择。

[Thumbor](https://github.com/thumbor/thumbor) 是目前唯一的自我管理图像 CDN。虽然它是开源的并且免费使用，但它的功能通常比大多数商业 CDN 少，而且它的文档也有一定的局限性。[Wikipedia](https://wikitech.wikimedia.org/wiki/Thumbor) 、[Square](https://medium.com/square-corner-blog/dynamic-images-with-thumbor-a430a1cfcd87) 和 [99designs](https://99designs.com/tech-blog/blog/2013/07/01/thumbnailing-with-thumbor/) 是三个使用 Thumbor 的网站。有关安装说明，请参阅文章[如何安装 Thumbor 图像 CDN](/install-thumbor)。

### 第三方图像 CDN

第三方图像 CDN 提供服务形式的图像 CDN。就像云提供商提供付费使用的服务器和其他基础设施一样；图像 CDN 提供付费的图像优化和分发。由于第三方图像 CDN 负责维护底层技术，因此入门相当简单，通常可以在 10-15 分钟内完成，但大型网站的完整迁移可能需要较长时间。第三方图像 CDN 通常根据使用层定价，大多数图像 CDN 提供免费层或免费试用，让您有机会试用它们的产品。

## 选择图像 CDN

图像 CDN 有许多不错的选择。一些图像 CDN 提供的功能比其他图像 CDN 多，但所有图像 CDN 都可以帮助您减小图像，从而使页面加载更快。除了功能集，选择图像 CDN 时要考虑的其他因素包括成本、支持、文档以及设置或迁移的难易程度。

在做出决定之前自己试用一下也会有帮助。您可以在下方找到 codelab，其中包含如何快速开始使用几个图像 CDN 的说明。

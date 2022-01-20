---
layout: post
title: 签名交换 (SXG)
subhead: SXG 是一种交付机制，可以独立于资源的交付方式来验证资源的来源。
authors:
  - katiehempenius
date: 2020-10-14
updated: 2021-04-21
hero: image/admin/6ll3P8MYWxvtb1ZjXIzb.jpg
alt: 一堆信封。
description: SXG 是一种交付机制，可以独立于资源的交付方式来验证资源的来源。
tags:
  - blog
  - performance
---

签名交换 (SXG) 是一种交付机制，可以独立于资源的交付方式来验证资源的来源。这种解耦推进了各种用例，例如保护隐私的预取、离线互联网体验和从第三方缓存提供服务。此外，实施 SXG 可以改善某些站点的 Largest Contentful Paint (LCP)。

本文全面概述了 SXG：它们的工作原理、用例和工具。

## 浏览器兼容性 {: #browser-compatibility }

基于 Chromium 的浏览器（Chrome 73、Edge 79 和 Opera 64 及后续版本）[支持](https://caniuse.com/#feat=sxg) SXG。

## 概述

签名交换 (SXG) 允许站点以加密方式对请求/响应对儿（“HTTP 交换”）进行签名，使浏览器可以独立于内容的分发方式验证内容的来源和完整性。因此，浏览器可以在地址栏中显示源站点的 URL，而不是提供内容的服务器的 URL。

SXG 的更广泛含义是它们使内容具有可移植性：通过 SXG 交付的内容可以很容易地由第三方分发，同时保持对其来源的完全保证和归属。从历史上看，站点使用第三方分发其内容同时保持归属的唯一方法是该站点与分发者共享其 SSL 证书。这有安全缺陷；此外，这离使内容真正可移植还差得很远。

从长远来看，真正可移植的内容可用于实现完全离线体验等用例。就近期而言，SXG 的主要用例是通过以易于缓存的格式提供内容来提供更快的用户体验。具体来说，[Google Search](#google-search) 会缓存并有时预取 SXG。对于从 Google Search 获得大部分流量的网站，SXG 可以成为向用户提供更快页面加载的重要工具。

### SXG 格式

SXG 封装在[二进制编码](https://cbor.io/)的文件中，该文件具有两个主要组件：HTTP 交换和[签名](https://developer.mozilla.org/docs/Glossary/Signature/Security)。HTTP 交换由请求 URL、内容协商信息和 HTTP 响应组成。

下面是一个解码的 SXG 文件的例子：

```html
format version: 1b3
request:
  method: GET
  uri: https://example.org/
  headers:
response:
  status: 200
  headers:
    Cache-Control: max-age=604800
    Digest: mi-sha256-03=kcwVP6aOwYmA/j9JbUU0GbuiZdnjaBVB/1ag6miNUMY=
    Expires: Mon, 24 Aug 2020 16:08:24 GMT
    Content-Type: text/html; charset=UTF-8
    Content-Encoding: mi-sha256-03
    Date: Mon, 17 Aug 2020 16:08:24 GMT
    Vary: Accept-Encoding
signature:
    label;cert-sha256=*ViFgi0WfQ+NotPJf8PBo2T5dEuZ13NdZefPybXq/HhE=*;
    cert-url="https://test.web.app/ViFgi0WfQ-NotPJf8PBo2T5dEuZ13NdZefPybXq_HhE";
    date=1597680503;expires=1598285303;integrity="digest/mi-sha256-03";sig=*MEUCIQD5VqojZ1ujXXQaBt1CPKgJxuJTvFlIGLgkyNkC6d7LdAIgQUQ8lC4eaoxBjcVNKLrbS9kRMoCHKG67MweqNXy6wJg=*;
    validity-url="https://example.org/webpkg/validity"
header integrity: sha256-Gl9bFHnNvHppKsv+bFEZwlYbbJ4vyf4MnaMMvTitTGQ=

The exchange has a valid signature.
payload [1256 bytes]:
<!doctype html>
<html>
<head>
    <title>SXG example</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
    }
    </style>
</head>
<body>
<div>
    <h1>Hello</h1>
</div>
</body>
</html>
```

签名中的 `expires` 参数表示 SXG 的到期日期。SXG 的有效期最多为 7 天。如果 SXG 的到期日期在未来超过 7 天，浏览器将拒绝它。有关签名标头的更多信息，请参阅[签名 HTTP 交换规范](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-3.1)。

### Web 打包

SXG 是更广泛的 [Web 打包](https://github.com/WICG/webpackage)规范提案系列的一部分。除了 SXG 之外，Web 打包规范的另一个主要组成部分是 [Web 捆绑包](/web-bundles/) （“捆绑 HTTP 交换”）。Web 捆绑包是 HTTP 资源和解释捆绑包所需的元数据的集合。

SXG 和 Web 捆绑包之间的关系是一个常见的混淆点。SXG 和 Web 捆绑包是两种互不依赖的不同技术——Web 捆绑包可用于已签名和未签名的交换。SXG 和 Web 捆绑包提出的共同目标是创建“Web 打包”格式，允许站点整体共享以供离线使用。

SXG 是基于 Chromium 的浏览器将实现的 Web 打包规范的第一部分。

## 加载 SXG

最初，SXG 的主要用例可能是作为页面主文档的交付机制。对于这个用例，可以使用 `<link>` 或 `<a>` 标签以及 [`Link` 标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link)来引用 SXG。与其他资源一样，SXG 可以通过在浏览器的地址栏中输入其 URL 来加载。

```html
<a href="https://example.com/article.html.sxg">
```

```html
<link rel="prefetch" as="document" href="https://example.com/article.html.sxg">
```

SXG 还可用于交付子资源。有关详细信息，请参阅[签名交换子资源替换](https://github.com/WICG/webpackage/blob/main/explainers/signed-exchange-subresource-substitution.md)。

## 服务 SXG

### 内容协商

[内容协商](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation)是一种机制，用于根据客户端的能力和偏好在同一 URL 上提供相同资源的不同表示——例如，为某些客户端提供资源的 gzip 版本，而为其他客户端提供 Brotli 版本。内容协商可以根据浏览器的功能提供相同内容的 SXG 和非 SXG 表示。

Web 浏览器使用 [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept) 请求标头传达它们支持的[MIME 类型](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types)。如果浏览器支持 SXG，则 MIME 类型 `application/signed-exchange` 将自动包含在此值列表中。

例如，这是由 Chrome 84 发送的 `Accept` 标头：

```json
accept:
text/html,
application/xhtml+xml,
application/xml;q=0.9,
image/webp,image/apng,
\*/\*;q=0.8,
application/signed-exchange;v=b3;q=0.9
```

此字符串的 `application/signed-exchange;v=b3;q=0.9` 部分通知网络服务器 Chrome 支持 SXG——特别是版本 `b3` 。最后的部分 `q=0.9` 表示 [q 值](https://developer.mozilla.org/docs/Glossary/Quality_values)。

`q-value` 使用 `0` 到 `1` 的十进制小数表示浏览器对特定格式的相对偏好，其中 `1` 代表最高优先级。当没有为格式提供 `q-value` 值时，则 `1` 为隐含值。

### 最佳实践

当 `Accept` 标头指示 `application/signed-exchange`  的 `q-value` 值大于或等于 `text/html` 的 `q-value` 值时，服务器应该服务于 SXG。在实践中，这意味着源服务器将 SXG 提供给爬网程序，而不是浏览器。

SXG 在与缓存或预取一起使用时可以提供卓越的性能。但是，对于直接从源服务器加载而没有这些优化优势的内容，`text/html`提供比 SXG 更好的性能。以 SXG 形式提供内容允许爬网程序和其他中介缓存 SXG，以便更快地向用户交付。

以下正则表达式可用于匹配应作为 SXG 提供服务的请求的 `Accept` 标头：

```regex
Accept: /(^|,)\s\*application\/signed-exchange\s\*;\s\*v=[[:alnum:]\_-]+\s\*(,|$)/
```

请注意，子表达式 `(,|$)` 匹配已省略 SXG 的 `q-value` 的标头；这种省略意味着 SXG 的 `q-value` 值为 `1`。尽管 `Accept` 标头理论上可以包含子字符串 `q=1` ，但[实际上](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values)浏览器在默认值为 `1` 时不会明确列出格式的 `q-value`。

## 使用 Chrome DevTools 调试 SXG {: #debugging }

可以通过在 Chrome DevTools 的**网络**面板的**类型**列中查找签名交换来识别 `signed-exchange`。

<figure>{% Img src="image/admin/cNdohSaeXqGHFBwD7L3B.png", alt="在 DevTools 的“网络”面板中显示 SXG 请求的屏幕截图", width="696", height="201" %}<figcaption> DevTools 中的<b>网络</b>面板</figcaption></figure>

**预览**选项卡提供有关 SXG 内容的更多信息。

<figure>{% Img src="image/admin/E0rBwuxk4BxFmLJ3gXhP.png", alt="SXG 的“预览”选项卡的屏幕截图", width="800", height="561" %}<figcaption> DevTools 中的<b>预览</b>选项卡</figcaption></figure>

要直接查看 SXG，请在[支持 SXG 的浏览器之一](https://signed-exchange-testing.dev/)中访问此[演示](#browser-compatibility)

## 用例

SXG 可用于直接从源服务器向用户交付内容——但这在很大程度上会违背 SXG 的目的。相反，SXG 的预期用途和好处主要在源服务器生成的 SXG 被缓存并由中间人提供给用户时实现。

尽管本节主要讨论 Google Search 对 SXG 的缓存和服务，但它是一种适用于任何希望为其外链提供更快用户体验或对有限网络访问具有更大弹性的站点的技术。这不仅包括搜索引擎和社交媒体平台，还包括为线下消费提供内容的信息门户。

### Google Search

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/oMtUUAVj5hAGwBZMDwct.png", alt="显示从缓存中提供的预取 SXG 的图表。", width="800", height="396" %}

对于从搜索结果页面加载的页面，Google Search 使用 SXG 为用户提供更快的页面加载体验。通过以 SXG 形式提供内容，从 Google Search 获得大量流量的网站可能会看到显著的性能改进。

Google Search 现在将在适用时抓取、缓存和预取 SXG。Google 和其他搜索引擎有时会[预取](https://developer.mozilla.org/docs/Web/HTTP/Link_prefetching_FAQ)用户可能访问的内容——例如，与第一个搜索结果对应的页面。SXG 特别适合预取，因为它们比非 SXG 格式具有隐私优势。

{% Aside %}所有网络请求都具有一定数量的固有用户信息，无论它们是如何或为什么发出的：这包括 IP 地址、cookie 是否存在以及 `Accept-Language` 等标头值等信息。当发出请求时，此信息会“公开”给目标服务器。因为 SXG 是从缓存而不是源服务器中预取的，所以用户对站点的兴趣只会在用户导航到该站点时才会向源服务器公开，而不是在预取时。此外，通过 SXG 预取的内容不会设置 cookie 或访问 `localStorage`，除非内容是由用户加载的。此外，这不会向 SXG 推荐人透露新的用户信息。使用 SXG 进行预取是隐私保护预取概念的一个例子。 {% endAside %}

#### 爬网

Google Search 爬网程序发送的 [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) 标头针对 `text/html` 和 `application/signed-exchange` 表示出同等偏好。如[上一节](#best-practices)所述，当请求的 `Accept` 标头表示对 SXG 的偏好高于或等于对 `text/html` <br> 的偏好时，希望使用 SXG 的站点应该为它们提供服务。在实践中，只有爬网程序会表达对 SXG 的偏好而不是 `text/html`。

#### 索引

Google Search 不会对页面的 SXG 和非 SXG 表示进行单独排名或编入索引。SXG 归根结底是一种交付机制——它不会改变底层内容。鉴于此，对于 Google Search 来说，单独索引或排名以不同方式交付的相同内容是没有意义的。

#### Web Vitals

对于从 Google Search 获得大部分流量的站点，SXG 可用于改进 [Web Vitals](/vitals/) — 即 [LCP](/lcp/) 。缓存和预取的 SXG 可以非常快地交付给用户，这会产生更快的 LCP。尽管 SXG 是强大的工具，但它们在与其他性能优化（例如使用 CDN 和减少呈现阻塞子资源）结合时性能最佳。

### AMP

AMP 内容可以使用 SXG 交付。SXG 允许使用其规范 URL（而非其 AMP URL ）预取和显示 AMP 内容。

本文档中描述的所有概念仍然适用于 AMP 用例，但是，AMP 有自己的单独[工具](https://github.com/ampproject/amppackager)来生成 SXG。

{% Aside%} 了解如何在 [amp.dev](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/signed-exchange/) 上使用签名交换提供  AMP。 {% endAside %}

## 工具

实现 SXG 包括生成与给定 URL 对应的 SXG，然后将该 SXG 提供给请求者（通常是爬网程序）。要生成 SXG，您需要可以签署 SXG 的证书。

### 证书

SXG 的生产使用需要支持 `CanSignHttpExchanges` 扩展的证书。根据[规范](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-4.2)，具有此扩展名的证书的有效期不得超过 90 天，并且要求请求域配置了[DNS CAA 记录](https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization)。

[此页面](https://github.com/google/webpackager/wiki/Certificate-Authorities)列出了可以颁发此类证书的证书颁发机构。SXG 的证书只能通过商业证书颁发机构获得。

### 特定于平台的 SXG 工具

这些工具支持特定的技术堆栈。如果您已经在使用这些工具之一支持的平台，您可能会发现它比通用工具更容易设置。

- [`sxg-rs/cloudflare_worker`](https://github.com/google/sxg-rs/tree/main/cloudflare_worker) 在 [Cloudflare Workers](https://workers.cloudflare.com/) 上运行。

- [`sxg-rs/fastly_compute`](https://github.com/google/sxg-rs/tree/main/fastly_compute) 在 [Fastly Compute@Edge](https://www.fastly.com/products/edge-compute/serverless) 上运行。

- [自动签名交换](https://blog.cloudflare.com/automatic-signed-exchanges/)是一项 Cloudflare 功能，可自动获取证书并生成签名交换。

- [NGINX SXG 模块](https://github.com/google/nginx-sxg-module)为使用[nginx](https://nginx.org/)的站点生成并提供 SXG。可在[此处](/how-to-set-up-signed-http-exchanges/)找到设置说明。

- [Envoy SXG Filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/sxg_filter) 为使用[Envoy](https://www.envoyproxy.io/)的站点生成并提供 SXG。

### 通用 SXG 工具

#### Web Packager CLI

[Web Packager CLI](https://github.com/google/webpackager) 生成对应于给定 URL 的 SXG。

```shell
webpackager \
    --private\_key=private.key \
    --cert\_url=https://example.com/certificate.cbor \
    --url=https://example.com
```

生成 SXG 文件后，将其上传到您的服务器并使用 `application/signed-exchange;v=b3` MIME 类型为其提供服务。此外，您需要将 SXG 证书作为 `application/cert-chain+cbor` 。

#### Web Packager 服务器

[Web Packager 服务器](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md)`webpkgserver` 充当为 SXG 提供服务的[反向代理](https://en.wikipedia.org/wiki/Reverse_proxy)。给定一个 URL，`webpkgserver` 将获取 URL 的内容，将它们打包为 SXG，并作为响应提供 SXG。有关设置 Web Packager 服务器的说明，请参阅[如何使用 Web Packager 设置签名交换](/signed-exchanges-webpackager)。

### SXG 库

这些库可用于构建您自己的 SXG 生成器：

- [`sxg_rs`](https://github.com/google/sxg-rs/tree/main/sxg_rs) 是用于生成 SXG 的 Rust 库。它是功能最强大的 SXG 库，用作 `cloudflare_worker` 和 `fastly_compute` 工具的基础。

- [`libsxg`](https://github.com/google/libsxg) 是用于生成 SXG 的最小 C 库。它用作 NGINX SXG 模块和 Envoy SXG 过滤器的基础。

- [`go/signed-exchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) 是 webpackage 规范提供的最小 Go 库，作为生成 SXG 的[参考实现](https://en.wikipedia.org/wiki/Reference_implementation)。它被用作其参考 CLI 工具、[`gen-signedexchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) 和功能更强大的 Web Packager 工具的基础。

## 结论

签名交换是一种交付机制，它可以独立于资源的交付方式来验证资源的来源和有效性。因此，SXG 可以由第三方分发，同时保持完整的发布者归属。

## 进阶阅读

- [签名 HTTP 交换规范草案](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)
- [Web 打包解释器](https://github.com/WICG/webpackage/tree/main/explainers)
- [在 Google Search 上开始使用已签名交换](https://developers.google.com/search/docs/advanced/experience/signed-exchange)
- [如何使用 Web Packager 设置签名交换](/signed-exchanges-webpackager)
- [签名交换演示](https://signed-exchange-testing.dev/)

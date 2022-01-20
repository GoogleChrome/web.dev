---
layout: post
title: 使用 HTTP 缓存避免不必要的网络请求
authors:
  - jeffposnick
  - ilyagrigorik
date: 2018-11-05
updated: 2020-04-17
description: 如何避免不必要的网络请求？浏览器的 HTTP 缓存是您的第一道防线。虽然它并非是最强大或最灵活的方法，并且对缓存响应生命周期的控制有限，但它具有一定效率，所有浏览器均支持，而且无需太多工作。
codelabs:
  - codelab-http-cache
feedback:
  - api
---

通过网络获取资源费时费力又费钱：

- 大型响应需要在浏览器和服务器之间多次往返。
- 在所有[关键资源](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)下载完毕前，页面不会加载。
- 如果用户通过非无限流量的资费方案访问您的站点，那么每个不必要的网络请求都在浪费他们的钱。

如何避免不必要的网络请求？浏览器的 HTTP 缓存是您的第一道防线。虽然它并非是最强大或最灵活的方法，并且对缓存响应生命周期的控制有限，但它具有一定效率，所有浏览器均支持，而且无需太多工作。

本指南向您展示了高效实现 HTTP 缓存的基础知识。

## 浏览器兼容性 {: #browser-compatibility }

其实并没有一个叫做 HTTP 缓存的 API。它是 Web 平台 API 集合的总称。所有浏览器都支持这些 API：

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Browser_compatibility)
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag#Browser_compatibility)
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified#Browser_compatibility)

## HTTP 缓存的工作原理 {: #overview }

浏览器发出的所有 HTTP 请求首先会转至浏览器缓存，用于检查是否存在可满足请求的有效缓存响应。如果存在匹配，则从缓存中读取响应，从而消除网络延迟和传输产生的数据成本。

HTTP 缓存的行为由[请求标头](https://developer.mozilla.org/docs/Glossary/Request_header)和[响应标头](https://developer.mozilla.org/docs/Glossary/Response_header)的一起控制。在理想情况下，您可以控制 Web 应用的代码（确定请求标头）和 Web 服务器的配置（确定响应标头）。

请查阅 MDN 的[HTTP 缓存](https://developer.mozilla.org/docs/Web/HTTP/Caching)一文，更深入地了解这个概念。

## 请求标头：坚持使用默认值（通常）{: #request-headers }

虽然有许多重要的标头应该包含在 Web 应用的传出请求中，但浏览器在发出请求时几乎总会代您进行设置。影响检查新鲜度的请求标头，如 [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) 和 [`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since)，只是基于浏览器对 HTTP 缓存中当前值的理解而出现。

这是个好消息——这意味着您可以继续在 HTML 中使用 `<img src="my-image.png">` 之类的标签，浏览器会自动为您处理 HTTP 缓存，无需额外工作。

{% Aside %} 那些需要对其 Web 应用中的 HTTP 缓存进行更多控制的开发人员可以有另一种选择：“下拉”一个级别，然后手动使用 [Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API) ，向它传递具有特定 [`cache`](https://developer.mozilla.org/docs/Web/API/Request/cache) 覆盖集的 [`Request`](https://developer.mozilla.org/docs/Web/API/Request) 对象。不过，该内容超出了本指南的范围！ {% endAside %}

## 响应标头：配置 web 服务器 {: #response-headers }

HTTP 缓存设置中最重要的部分是 Web 服务器添加到每个传出响应中的标头。下列标头都会影响到缓存行为的效率：

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control)。服务器可以通过返回 `Cache-Control` 指令，指定浏览器和其他中间缓存对单个响应进行缓存的方式以及持续时间。
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag)。当浏览器发现过期的缓存响应时，它可以向服务器发送一个小令牌（通常是文件内容的哈希）来检查文件是否已更改。如果服务器返回了相同的令牌，那么说明文件没有改动，无需重新下载。
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified)。此标头的用途与 `ETag` 相同，但它通过比较时间来确定资源是否已更改，而不是像 `ETag` 那样通过比较内容。

默认情况下，部分 Web 服务器内置支持设置这些标头，而其他 Web 服务器则完全不会动这些标头（除非您明确配置它们）。配置标头的具体*方式*的具体取决于使用的 Web 服务器，您应该查阅服务器的文档以获得最准确的详细信息。

为了节省您的时间，下面列出了部分常用 Web 服务器的配置说明：

- [Express](https://expressjs.com/en/api.html#express.static)
- [Apache](https://httpd.apache.org/docs/2.4/caching.html)
- [nginx](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Firebase Hosting](https://firebase.google.com/docs/hosting/full-config)
- [Netlify](https://www.netlify.com/blog/2017/02/23/better-living-through-caching/)

不去配置 `Cache-Control` 响应标头不会禁用 HTTP 缓存！相反，浏览器能[有效地猜测](https://www.mnot.net/blog/2017/03/16/browser-caching#heuristic-freshness)哪种类型的缓存行为最适合给定类型的内容。但您可能想要更多控制权，因此请花些时间配置响应标头。

## 应该使用哪些响应标头值？ {: #response-header-strategies }

配置 Web 服务器的响应标头时，应该涵盖两个重要的场景。

### 版本化 URL 的长期缓存 {: #versioned-urls }

{% Details %} {% DetailsSummary 'h4' %} 版本化 URL 对缓存策略的作用 版本化 URL 是一种非常好的做法，因为它们可以更方便地使缓存的响应无效化。 {% endDetailsSummary %} 假设您的服务器指示浏览器将 CSS 文件缓存 1 年（ <code>Cache-Control: max-age=31536000</code> ），但设计师刚刚进行了紧急更新，您需要立即推出此更新。那么如何通知浏览器更新文件的“陈旧”缓存副本呢？您做不到这点，除非修改资源的 URL。浏览器将响应缓存后会一直使用缓存版本，直到它不再是最新的（由 <code>max-age</code> 或 <code>expires</code> 决定），或者直到它因某些其他原因被从缓存中删除：例如用户清除浏览器缓存。因此，在构建页面时，不同的用户最终可能会使用不同版本的文件：刚刚获取资源的用户使用新版本，而缓存较早（但仍然有效）副本的用户使用响应的旧版本。客户端缓存和快速更新，如何两全其美呢？您更改资源的 URL 并强制用户在其内容更改时下载新响应。通常来说，您可以通过在文件名中嵌入文件的指纹或版本号来实现这一点，例如，<code>style.x234dff.css</code> 。 {% endDetails %}

当响应包含 "[fingerprint](https://en.wikipedia.org/wiki/Fingerprint_(computing))" 或版本信息、且其内容永远不会改变的的 URL 请求时，请将 `Cache-Control: max-age=31536000` 添加到响应中。

设置此值会告诉浏览器，当它需要在接下来的一年（31,536,000 秒；最大支持值）内加载相同的 URL 时，可以立即使用 HTTP 缓存中的值，无需向网络服务器请求。这样非常好！您可以避开网络操作，从而立即获得了可靠性和速度！

像 webpack 这样的构建工具可以[自动](https://webpack.js.org/guides/caching/#output-filenames)将哈希指纹分配给资产 URL。

{% Aside %} 您还可以将 [`immutable` 属性](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading)添加到 `Cache-Control` 标头中，进行进一步优化，尽管它在某些浏览器中[会被忽略](https://www.keycdn.com/blog/cache-control-immutable#browser-support)。 {% endAside %}

### 非版本化 URL 的服务器重新验证 {: #unversioned-urls }

遗憾的是，并非所有加载的 URL 都是版本化的。也许您无法在部署 Web 应用前就包含构建步骤，因此无法向资产 URL 添加哈希。并且每个 Web 应用都需要 HTML 文件，而这些文件（几乎）永远不会包含版本信息。因为如果用户需要记住他们要访问的 URL 是`https://example.com/index.34def12.html`，那就不会使用您的 Web 应用。那么，您能对这些 URL 做些什么呢？

这是您需要承认失败的一种情况。单独的 HTTP 缓存不足以完全避开网络。（别担心，您很快就会了解[服务工作进程](/service-workers-cache-storage/) ，它会提供我们需要的支持。）但是您可以采取一些步骤来确保网络请求尽可能更快更高效。

下列 `Cache-Control` 值可以帮您微调未版本化的 URL 的缓存位置和方式：

- `no-cache`。该值会命令浏览器在每次使用 URL 的缓存版本前都必须与服务器重新验证。
- `no-store`。该值会命令浏览器和其他中间缓存（如 CDN）永远不要存储文件的任何版本。
- `private`。浏览器可以缓存文件，但中间缓存不能。
- `public`。响应可以由任何缓存存储。

查看[附录： `Cache-Control` 流程图](#flowchart)显示了使用哪个 `Cache-Control` 值的决策过程。另外还要注意 `Cache-Control` 可以接受逗号分隔的指令列表。请参阅<a href="#examples" data-md-type="link">附录：`Cache-Control` 示例</a>。

除此之外，设置下面两个额外的响应标头之一也有帮助： [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag) 或 [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified)。正如在[响应标头](#response-headers)中提到的，`ETag` 和 `Last-Modified` 的作用相同：确定浏览器是否需要重新下载已过期的缓存文件。我们推荐使用 `ETag`，因为它更准确。

{% Details %} {% DetailsSummary 'h4' %} ETag 示例 {% endDetailsSummary %} 假设自初次获取以来已经过去了 120 秒，并且浏览器发起了对同一资源的新请求。那么浏览器首先会检查 HTTP 缓存并找到之前的响应。遗憾的是，浏览器无法使用之前的响应，因为它现在已经过期。此时，浏览器可以发出新的请求并获取新的完整响应。然而这个操作的效率较低，因为如果资源没有改变，那么就没有理由下载缓存中已经存在的相同信息！在 <code>ETag</code> 标头中指定的验证令牌旨在解决这个问题。服务器生成并返回一个任意令牌，通常是文件内容的哈希或其他指纹。浏览器不需要知道指纹是如何生成的；它只需要在下一个请求时将它发送到服务器。如果指纹还是一样的，那么资源没有改变，浏览器可以跳过下载。 {% endDetails %}

通过设置`ETag`或`Last-Modified` ，您可以让重新验证请求更加高效。它们最终会触发在[请求标头](#request-headers)中提到 [`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since) 或 [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) 请求标头。

当正确配置的 Web 服务器看到这些传入的请求标头时，它可以确认浏览器在其 HTTP 缓存中已有的资源版本是否与 Web 服务器上的最新版本匹配。如果匹配，则服务器可以使用 [`304 Not Modified`](https://developer.mozilla.org/docs/Web/HTTP/Status/304) HTTP 进行响应，这相当于说“请继续使用您已有的东西！”发送这种类型的响应时要传输的数据很少，因此通常比必须实际发回所请求的实际资源的副本要快得多。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e2bN6glWoVbWIcwUF1uh.png", alt="客户端请求资源和服务器响应 304 标头的图表。", width="474", height="215" %}<figcaption>浏览器从服务器请求 <code>/file</code> 并加入 <code>If-None-Match</code> 标头，命令服务器仅在服务器上文件的 <code>ETag</code> 与浏览器的 <code>If-None-Match</code> 值不匹配时才返回完整文件。在本例中，这两个值确实匹配，因此服务器返回 <code>304 Not Modified</code> 响应，并说明文件还要再缓存多久（<code>Cache-Control: max-age=120</code>） 。</figcaption></figure>

## 摘要 {: #summary }

HTTP 缓存是一种提高负载性能的有效方式，因为它减少了不必要的网络请求。所有浏览器都支持该功能，并且不需要太多设置。

下面的 `Cache-Control` 配置就是一个好的开始：

- `Cache-Control: no-cache` 适用于每次使用前应与服务器重新验证的资源。
- `Cache-Control: no-store` 适用于永远不要缓存的资源。
- `Cache-Control: max-age=31536000` 适用于版本化的资源。

`ETag` 或 `Last-Modified` 标头可以帮助您更有效地重新验证过期的缓存资源。

{% Aside 'codelab' %} 请试用 [HTTP Cache codelab](/codelab-http-cache)，在 Express 中了解 `Cache-Control` 和 `ETag` 的实践经验。 {% endAside %}

## 深入了解 {: #learn-more }

如果您不满足于 `Cache-Control` 标头的基础知识，请查看 Jake Archibald 的 [Caching best practices &amp; max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/) 指南。

欲了解如何为回访者优化缓存使用，请参阅 [Love your cache](/love-your-cache) 一文。

## 附录：更多技巧 {: #tips }

如果您的时间比较充裕，可以通过以下方式优化 HTTP 缓存的使用：

- 使用一致的 URL。如果您在不同的 URL 上提供相同的内容，那么该内容将被多次提取和存储。
- 尽量减少代码改动。如果资源的一部分（例如 CSS 文件）经常更新，而文件的其余部分并不常更新（例如库代码），请考虑将经常更新的代码拆分到一个单独的文件中，并对频繁更新的代码使用短持续时间缓存策略，对不经常更改的代码采用长缓存持续时间策略。
- 如果您的 `Cache-Control` 策略可以接受某种程度的陈旧，请查看新的 [`stale-while-revalidate`](/stale-while-revalidate/) 指令。

## 附录： `Cache-Control` 流程图 {: #flowchart }

{% Img src="image/admin/htXr84PI8YR0lhgLPiqZ.png", alt="流程图", width="595", height="600" %}

## 附录： `Cache-Control` 示例 {: #examples }

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<code>Cache-Control</code> 值</th>
        <th>解释</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>max-age=86400</code></td>
        <td>响应可以被浏览器和中间缓存缓存最多 1 天（60 秒 x 60 分钟 x 24 小时）。</td>
      </tr>
      <tr>
        <td><code>private, max-age=600</code></td>
        <td>响应可以被浏览器（但不是中间缓存）缓存最多 10 分钟（60 秒 x 10 分钟）。</td>
      </tr>
      <tr>
        <td><code>public, max-age=31536000</code></td>
        <td>响应可以由任何缓存存储 1 年。</td>
      </tr>
      <tr>
        <td><code>no-store</code></td>
        <td>不允许缓存响应，必须在每次请求时完整获取。</td>
      </tr>
    </tbody>
  </table>
</div>

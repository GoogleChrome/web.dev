---
title: 使用 Fetch Metadata 保护您的资源免受 Web 攻击
subhead: 防止 CSRF、XSSI、跨源信息泄露。
authors:
  - lwe
date: 2020-06-04
updated: 2020-06-10
hero: image/admin/El8ytnIgMDWVzdsglcfv.jpg
alt: 与资源隔离策略相关的 Python 代码截图。
description: |2-

  Fetch Metadata 是一项新的 Web 平台功能，旨在允许服务器保护自己免受跨源攻击。
tags:
  - blog
  - security
feedback:
  - api
---

## 为什么要留心隔离您的网络资源？

许多 Web 应用程序容易受到[跨源](/same-site-same-origin/#%22same-origin%22-and-%22cross-origin%22)攻击，例如[跨站点请求伪造](https://portswigger.net/web-security/csrf)(CSRF)、[跨站点脚本包含](https://portswigger.net/research/json-hijacking-for-the-modern-web)(XSSI)、定时攻击、[跨源信息泄漏](https://arxiv.org/pdf/1908.02204.pdf)或推测执行侧信道 ( [Spectre](https://developer.chrome.com/blog/meltdown-spectre/) ) 攻击。

[Fetch Metadata](https://www.w3.org/TR/fetch-metadata/) 请求标头允许您部署强大的纵深防御机制 — 资源隔离策略 — 以保护您的应用程序免受这些常见的跨源攻击。

给定 Web 应用程序公开的资源通常仅由应用程序本身加载，而不由其他网站加载。在这种情况下，部署基于 Fetch Metadata 请求标头的资源隔离策略不费吹灰之力，同时保护应用程序免受跨站点攻击。

## 浏览器兼容性 {: #compatibility }

从 Chrome 76 开始，以及其他基于 Chromium 的浏览器均支持 Fetch Metadata 请求标头，Firefox 正在开发对其的支持。有关最新的浏览器支持信息，请参阅[浏览器兼容性](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site#Browser_compatibility)。

## 背景

许多跨站点攻击是可能的，因为默认情况下 Web 是开放的，并且您的应用程序服务器无法轻松保护自己免受来自外部应用程序的通信的影响。典型的跨源攻击是跨站点请求伪造 (CSRF)，攻击者将用户引诱到他们控制的站点，然后向用户登录的服务器提交表单。由于服务器无法判断请求是否来自另一个域（跨站点），并且浏览器会自动将 cookie 附加到跨站点请求，因此服务器将代表用户执行攻击者请求的操作。

其他跨站点攻击，如跨站点脚本包含 (XSSI) 或跨源信息泄漏，本质上与 CSRF 类似，并依赖于从受攻击者控制的文档中的受害应用程序加载资源并泄漏有关受害应用程序的信息。由于应用程序无法轻易区分可信请求和不可信请求，因此它们无法丢弃恶意的跨站点流量。

{% Aside 'gotchas' %} 除了上述对资源的攻击之外，*窗口引用*还会导致跨源信息泄漏和 Spectre 攻击。您可以通过将 `Cross-Origin-Opener-Policy` 响应标头设置为 `same-origin` 来防止它们。 {% endAside %}

## 引入 Fetch Metadata {: #introduction }

Fetch Metadata 请求标头是一项新的 Web 平台安全功能，旨在帮助服务器防御跨源攻击。`Sec-Fetch-*` 标头中提供有关 HTTP 请求上下文的信息，它们允许响应服务器在处理请求之前应用安全策略。这让开发人员可以根据请求的发出方式和使用上下文来决定是接受还是拒绝请求，从而可以仅响应他们自己的应用程序发出的合法请求。

{% Compare 'better', 'Same-Origin' %} {% CompareCaption %} 来自由您自己的服务器（同源）提供服务的站点的请求将继续有效。 {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/aRsy2xULTR4TM2sMMsbQ.png", alt="来自 https://site.example 的 JavaScript 中资源 https://site.example/foo.json 的获取请求导致浏览器发送 HTTP 请求标头 'Sec Fetch-Site: same-origin'.", width="800", height="176" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

{% Compare 'worse', 'Cross-site' %} {% CompareCaption %} 由于 `Sec-Fetch-*` 标头提供的 HTTP 请求中的附加上下文，服务器可能会拒绝恶意跨站点请求。 {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/xY4yB36JqsVw62wNMIWt.png", alt="https://evil.example 上的图像已将 img 元素的 src 属性设置为 'https://site.example/foo.json'，导致浏览器发送 HTTP 请求标头 'Sec-Fetch-Site: cross-site'。", width="800", height="171" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

### `Sec-Fetch-Site`

`Sec-Fetch-Site` 告诉服务器哪个[站点](/same-site-same-origin)发送了请求。浏览器将此值设置为以下值之一：

- `same-origin`，前提是请求是由您自己的应用程序发出的（例如 `site.example` ）
- `same-site`，前提是请求是由您站点的子域发出的（例如 `bar.site.example` ）
- `none`，前提是请求是由用户与用户代理的交互（例如点击书签）明确引起的
- `cross-site`，前提是请求是由另一个网站发送的（例如 `evil.example` ）

### `Sec-Fetch-Mode`

`Sec-Fetch-Mode`指示请求的[模式](https://developer.mozilla.org/docs/Web/API/Request/mode)。这大致对应于请求的类型，并允许您区分资源负载和导航请求。例如，目的地 `navigate` 指示顶层导航请求，而 `no-cors` 表示加载图像等资源请求。

### `Sec-Fetch-Dest`

`Sec-Fetch-Dest` 公开请求的[目的地](https://developer.mozilla.org/docs/Web/API/Request/destination)（例如，如果 `script` 或 `img` 标签导致浏览器请求资源）。

## 如何使用 Fetch Metadata 来防范跨源攻击

这些请求标头提供的额外信息非常简单，但额外的上下文允许您在服务器端构建强大的安全逻辑，也称为资源隔离策略，只需几行代码。

### 实施资源隔离策略

资源隔离策略可防止您的资源被外部网站请求。阻止此类流量可缓解常见的跨站点 Web 漏洞，例如 CSRF、XSSI、定时攻击和跨源信息泄漏。可以为您的应用程序的所有端点启用此策略，并将允许来自您自己的应用程序的所有资源请求以及直接导航（通过 HTTP `GET` 请求）。应该在跨站点上下文中加载的端点（例如使用 CORS 加载的端点）可以选择退出此逻辑。

#### 第 1 步：允许来自不发送 Fetch Metadata 的浏览器的请求

由于并非所有浏览器都支持 Fetch Metadata，因此您需要通过检查 `sec-fetch-site` 的存在来允许未设置 `Sec-Fetch-*` 标头的请求。

{% Aside %} 以下所有示例均为 Python 代码。 {% endAside %}

```python
if not req['sec-fetch-site']:
  return True  # Allow this request
```

{% Aside 'caution' %}由于 Fetch Metadata 仅在基于 Chromium 的浏览器中受支持，因此应将其用作[纵深防御保护，](https://static.googleusercontent.com/media/landing.google.com/en//sre/static/pdf/Building_Secure_and_Reliable_Systems.pdf#page=181)而不是用作您的主要防线。 {% endAside %}

#### 第 2 步：允许相同站点和浏览器发起的请求

任何不是来自跨源上下文（如 `evil.example` ）的请求都将被允许。特别是如下请求：

- 源自您自己的应用程序（例如，始终允许 `site.example` 请求 `site.example/foo.json` 的同源请求）。
- 源自您的子域。
- 由用户与用户代理的交互（例如直接导航或通过单击书签等）明确引起。

```python
if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
  return True  # Allow this request
```

{% Aside 'gotchas' %}如果您的子域不被完全信任，您可以通过删除 `same-site` 值来阻止来自子域的请求，从而使策略更加严格。 {% endAside %}

#### 第 3 步：允许简单的顶级导航和 iframe

为了确保您的站点仍然可以从其他站点链接，您必须允许简单的 ( `HTTP GET` ) 顶级导航。

```python
if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
  # <object> and <embed> send navigation requests, which we disallow.
  and req['sec-fetch-dest'] not in ('object', 'embed'):
    return True  # Allow this request
```

{% Aside 'gotchas' %} 上述逻辑可保护您的应用程序的端点不被其他网站用作资源，但将允许顶级导航和嵌入（例如加载到`<iframe>` ）。为了进一步提高安全性，您可以使用 Fetch Metadata 标头将跨站点导航限制为仅允许的一组页面。 {% endAside %}

#### 第 4 步：选择退出旨在提供跨站点流量的端点（可选）

在某些情况下，您的应用程序可能会提供旨在跨站点加载的资源。这些资源需要在每个路径或每个端点的基础上免除。此类端点的示例包括：

- 旨在跨源访问的端点：如果您的应用程序正在为`CORS`端点提供服务，您需要明确地将它们从资源隔离中选择退出，以确保对这些端点的跨站点请求仍然是可能的。
- 公共资源（例如图像、样式等）：任何应该可以从其他站点跨源加载的公共和未经身份验证的资源也可以被豁免。

```python
if req.path in ('/my_CORS_endpoint', '/favicon.png'):
  return True
```

{% Aside 'caution' %}将您的应用程序的某些部分退出这些安全限制之前，请确保它们是静态的并且不包含任何敏感的用户信息。 {% endAside %}

#### 第 5 步：拒绝所有其他跨站点且不可导航的请求

此资源隔离策略将拒绝任何其他**跨站点**请求，从而保护您的应用程序免受常见的跨站点攻击。

{% Aside 'gotchas' %}默认情况下，违反您的策略的请求应被拒绝并提供 `HTTP 403` 响应。但是，根据您的用例，您还可以考虑其他操作，例如：

- **只记录违规**。这在测试策略的兼容性和查找可能需要选择退出的端点时特别有用。
- **修改请求**。在某些情况下，请考虑执行其他操作，例如重定向到您的登录页面、删除身份验证凭据（例如 cookie）。但是，请注意，这可能会削弱基于 Fetch Metadata 的策略的保护。 {% endAside %}

**示例：**以下代码演示了在服务器上完整实现强大的资源隔离策略或作为中间件拒绝潜在的恶意跨站点资源请求，同时允许简单的导航请求：

```python
# Reject cross-origin requests to protect from CSRF, XSSI, and other bugs
def allow_request(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigations except <object> and <embed>
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
    and req['sec-fetch-dest'] not in ('object', 'embed'):
      return True

  # [OPTIONAL] Exempt paths/endpoints meant to be served cross-origin.
  if req.path in ('/my_CORS_endpoint', '/favicon.png'):
    return True

  # Reject all other requests that are cross-site and not navigational
  return False
```

### 部署资源隔离策略

1. 安装类似于上文中代码片段的模块，用于记录和监控您网站的行为，并确保这些限制不会影响任何合法流量。
2. 通过免除合法的跨源端点来修复潜在的违规行为。
3. 通过丢弃不合规的请求来加强策略。

### 识别和修复违反策略的行为

建议您首先在服务器端代码中以报告模式启用策略，从而以无副作用的方式对其进行测试。或者，您可以在中间件或反向代理中实现此逻辑，反向代理会记录您的策略在应用于生产流量时可能产生的任何违规行为。

根据我们在 Google 推出 Fetch Metadata 资源隔离策略的经验，大多数应用程序默认与此类策略兼容，并且很少需要免除端点以允许跨站点流量。

### 加强资源隔离策略

在您确认您的策略不会影响合法的生产流量之后，您就可以加强限制了，以保证其他站点将无法请求您的资源，并保护您的用户免受跨站点攻击。

{% Aside 'caution' %} 确保在运行身份验证检查或对请求进行任何其他处理之前拒绝无效请求，以防止泄露敏感的时间信息。 {% endAside %}

## 进阶阅读

- [W3C Fetch Metadata 请求标头规范](https://www.w3.org/TR/fetch-metadata/)
- [Fetch Metadata Playground](https://secmetadata.appspot.com/)
- [Google I/O 演讲：使用现代平台功能保护 Web 应用程序](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf)（幻灯片）

{% YouTube id='DDtM9caQ97I', startTime='1856' %}

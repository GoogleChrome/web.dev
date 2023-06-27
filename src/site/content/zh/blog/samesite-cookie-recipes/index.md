---
title: SameSite cookie 配方
subhead: 更新网站的 cookie，为 SameSite 属性的行为即将到来的变化做准备
authors:
  - rowan_m
date: 2019-10-30
updated: 2020-05-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/5f56hyvtMT6Dymo839tc.png
description: 随着新的 SameSite=None 属性值的引入，网站现在可以明确地将其 cookie 标记为跨网站使用。浏览器正倾向于使不带 SameSite 属性的 cookie 默认成为第一方，这是比当前的开放行为更安全、更保护隐私的选项。了解如何标记 cookie 以确保第一方和第三方 cookie 在此更改生效后继续工作。
tags:
  - blog
  - security
  - cookies
  - chrome-80
  - test-post
feedback:
  - api
---

{% Aside %} 本文是有关 `SameSite` cookie 属性变化的系列文章的一部分：

- [SameSite cookie 介绍](/samesite-cookies-explained/)
- [SameSite cookie 配方](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite) {% endAside %}

[Chrome](https://www.chromium.org/updates/same-site) 、[Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) 、[Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) 和其他浏览器将根据 IETF 提案 [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) 更改其默认行为，因此：

- 不带 `SameSite` 属性的 cookie 将被视为 `SameSite=Lax`，这意味着默认行为将 cookie 限制到**仅**第一方上下文。
- 跨网站使用的 Cookie **必须**指定 `SameSite=None; Secure` 才能包含在第三方上下文中。

此功能是 [Chrome 84 稳定版以后](https://blog.chromium.org/2020/05/resuming-samesite-cookie-changes-in-july.html)的默认行为。如果您还没有这样做，您应该更新第三方 cookie 的属性，以便它们在将来不会被阻止。

## 跨浏览器支持

请参阅 MDN 的 [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) 页面的[浏览器兼容性](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)部分。

## 跨站点或第三方 cookie 的用例

有许多常见的用例和模式需要在第三方上下文中发送 cookie。如果您提供或依赖这些用例之一，请确保您或提供商将更新 cookie，以确保服务继续正常运行。

### `<iframe>` 中的内容

`<iframe>` 中显示的其他网站的内容在第三方上下文中。这里的标准用例是：

- 共享自其他网站的嵌入内容，例如视频、地图、代码示例和社交媒体帖子。
- 来自外部服务的小工具，例如付款、日历、预订和预约功能。
- 会创建不太明显的 `<iframes>` 的社交媒体按钮或反欺诈服务等小工具。

这里，Cookie 可用于保持会话状态、存储常规偏好、启用统计或为拥有现有帐户的用户提供个性化内容等。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fTUQP4SffHHcexSipvlz.png", alt="嵌入内容的 URL 与页面 URL 不匹配的浏览器窗口图示。", width="468", height="383", style="max-width: 35vw;" %} <figcaption> 如果嵌入的内容与顶级浏览上下文来自不同的网站，则是第三方内容。</figcaption></figure>

此外，由于 Web 本身是可组合的，`<iframes>` 还用于嵌入也在顶级或第一方上下文中显示的内容。当网站显示在框架内时，该网站使用的任何 cookie 都将被视为第三方 cookie。如果您要创建的网站需要可以轻易嵌入其他网站，同时还要依赖 cookie 才能运行，那么您还需要确保这些 cookie 被标记为跨网站使用，或者可以在没有它们的情况下优雅地回退。

### 跨网站的“不安全”请求

虽然“不安全”可能听起来有点令人不安，但这里指的是可能要更改状态的请求。在 Web 上主要是 POST 请求。标记为 `SameSite=Lax` 的 cookie 将在安全的顶级导航中发送，例如单击一个链接转到其他网站。但是，通过 POST 向其他网站提交 `<form>` 等行为不会包括 cookie。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vddDg7f9Gp93OgaqWwHu.png", alt="请求从一个页面移动到另一个页面的图示。", width="719", height="382", style="max-width: 35vw;" %} <figcaption> 如果传入请求使用“安全”方法，则将发送 cookie。</figcaption></figure>

此模式用于可能将用户重定向到远程服务执行某些操作再返回的网站，例如重定向到第三方身份提供商。在用户离开网站之前，会设置一个包含一次性令牌的 cookie，期望可以在返回请求中检查此令牌，以缓解[跨站点请求伪造 (CSRF)](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 攻击。如果该返回请求通过 POST 传入，则有必要将 cookie 标记为 `SameSite=None; Secure`。

### 远程资源

页面上的任何远程资源都可能依赖于随请求发送的 cookie、来自 `<img>` 标签、`<script>` 标签等。常见用例包括追踪像素和个性化内容。

这也适用于由 `fetch` 或 `XMLHttpRequest` 从 JavaScript 发起的请求。如果调用 `fetch()` 时带有 [`credentials: 'include'` 选项](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included)，那么这是表明这些请求很可能需要 cookie 的好迹象。对于 `XMLHttpRequest`，您应该查找 [`withCredentials` 属性](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/withCredentials)设置为 `true` 的实例。这是表明这些请求很可能需要 cookie 的好迹象。这些 cookie 需要适当标记以包含在跨网站请求中。

### WebView 中的内容

平台特定的应用程序中的 WebView 是由浏览器驱动的，您需要测试相同的限制或问题是否适用。在 Android 中，如果 WebView 由 Chrome 驱动，Chrome 84 **不会**立即应用新的默认值。不过，目标是在将来应用它们，所以您仍然应该为此进行测试和准备。此外，Android 允许其平台特定的应用程序直接通过 [CookieManager API](https://developer.android.com/reference/android/webkit/CookieManager) 设置 cookie。与通过标头或 JavaScript 设置的 cookie 一样，如果要跨网站使用 cookie，请考虑包含 `SameSite=None; Secure`。

## 目前如何实施 `SameSite`

对于只有第一方上下文中需要的 cookie，理想情况下，应该根据需要将它们标记为 `SameSite=Lax` 或 `SameSite=Strict`。您也可以选择什么都不做，只允许浏览器强制使用默认值，但这会带来浏览器之间行为不一致的风险，并且每个 cookie 都可能出现控制台警告。

```text
Set-Cookie: first_party_var=value; SameSite=Lax
```

对于第三方上下文中需要的 cookie，您需要确保将它们标记为 `SameSite=None; Secure`。请注意，您需要同时标记这两个属性。如果只指定 `None` 而没有指定 `Secure`，cookie 将被拒绝。不过，浏览器实现中存在一些相互不兼容的差异，因此您可能需要使用下面的[处理不兼容的客户端](#handling-incompatible-clients)中描述的一些缓解策略。

```text
Set-Cookie: third_party_var=value; SameSite=None; Secure
```

### 处理不兼容的客户端

由于这些包含 `None` 和更新默认行为的更改仍然相对较新，因此各浏览器对如何处理这些更改仍存在不一致。您可以参考 [chromium.org 上的更新页面](https://www.chromium.org/updates/same-site/incompatible-clients)了解目前已知的问题，但还不能说这是否详尽无遗。虽然这并不理想，但您可以在此过渡阶段采用一些变通方法。一般规则是将不兼容的客户端视为特殊情况。不要为实施较新规则的浏览器创建异常。

第一个选项是同时设置新旧样式的 cookie：

```text
Set-cookie: 3pcookie=value; SameSite=None; Secure
Set-cookie: 3pcookie-legacy=value; Secure
```

实施较新行为的浏览器将使用 `SameSite` 值设置 cookie，而其他浏览器可能会忽略或错误地设置它。但是，这些相同的浏览器将设置 `3pcookie-legacy` cookie。在处理包含的 cookie 时，网站应首先检查是否存在新样式的 cookie，如果未找到，则回退到旧 cookie。

下面的示例展示了如何在 Node.js 中实现此操作，其中利用了 [Express 框架](https://expressjs.com)及其 [cookie-parser](https://www.npmjs.com/package/cookie-parser) 中间件。

```javascript
const express = require('express');
const cp = require('cookie-parser');
const app = express();
app.use(cp());

app.get('/set', (req, res) => {
  // Set the new style cookie
  res.cookie('3pcookie', 'value', { sameSite: 'none', secure: true });
  // And set the same value in the legacy cookie
  res.cookie('3pcookie-legacy', 'value', { secure: true });
  res.end();
});

app.get('/', (req, res) => {
  let cookieVal = null;

  if (req.cookies['3pcookie']) {
    // check the new style cookie first
    cookieVal = req.cookies['3pcookie'];
  } else if (req.cookies['3pcookie-legacy']) {
    // otherwise fall back to the legacy cookie
    cookieVal = req.cookies['3pcookie-legacy'];
  }

  res.end();
});

app.listen(process.env.PORT);
```

缺点是这涉及设置冗余 cookie 以覆盖所有浏览器，并且需要在设置和读取 cookie 时都进行更改。但是，这种方法应该可覆盖所有浏览器，无论它们的行为如何，并且可确保第三方 cookie 继续像以前一样工作。

或者，在发送 `Set-Cookie` 标头时，您可以选择通过用户代理字符串检测客户端。请参见[不兼容客户端列表](https://www.chromium.org/updates/same-site/incompatible-clients)，然后使用适合您平台的库，例如 Node.js 上的 [ua-parser-js](https://www.npmjs.com/package/ua-parser-js) 库。建议找到一个可处理用户代理检测的库，因为您很可能不想自己编写这些正则表达式。

这种方法的好处是只需要在设置 cookie 时进行一次更改。不过，这里需要警告的是，用户代理嗅探本质上是脆弱的，可能无法捕获所有受影响的用户。

{% Aside %}

无论您选择哪个选项，都建议确保有方法来记录通过传统路由的流量级别。还要确保一旦这些级别降至网站的可接受阈值以下，您会收到提醒或警告来删除该变通方法。

{% endAside %}

## 语言、库和框架对 `SameSite=None` 的支持

大多数语言和库都支持 cookie 的 `SameSite` 属性，但是 `SameSite=None` 的增加仍然相对较新，这意味着您现在可能需要对一些标准行为做出变通。<a href="https://github.com/GoogleChromeLabs/samesite-examples" data-md-type="link">GitHub 上的 `SameSite` 示例仓库</a>中记录了这些内容。

## 获取帮助

Cookie 无处不在，但很少有网站对它们的设置和使用位置进行完全审计，尤其是将跨网站用例混合在一起时。当您遇到问题时，很可能是第一次有人遇到它 - 所以不要犹豫，立即：

- 在 [GitHub 上的`SameSite` 示例仓库](https://github.com/GoogleChromeLabs/samesite-examples)上提出问题。
- 在 [StackOverflow 上的“samesite”标签](https://stackoverflow.com/questions/tagged/samesite)下提出问题。
- 对于 Chromium 行为的问题，通过 [[SameSite cookie] 问题模板](https://bit.ly/2lJMd5c)提出错误。
- 关注 [`SameSite` 更新页面](https://www.chromium.org/updates/same-site)上 Chrome 的进展。

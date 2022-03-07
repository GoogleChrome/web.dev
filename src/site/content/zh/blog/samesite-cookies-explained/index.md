---
title: SameSite cookie 的说明
subhead: 通过学习如何显式标记您的跨站 cookie 来保护您的网站。
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: 了解如何使用 SameSite 属性标记您针对第一方和第三方使用的 cookie。您可以通过使用 SameSite 的 Lax 和 Strict 值来保护网站，提高对 CSRF 攻击的防御能力。指定新的 None 属性使您能够显式标记您针对跨站使用的 cookie。
tags:
  - blog
  - security
  - cookies
  - chrome-80
feedback:
  - api
---

{% Aside %} 本文是`SameSite` cookie 属性更改的相关系列文章中的一篇：

- [SameSite cookie 的说明](/samesite-cookies-explained/)
- [SameSite cookie 配方](/samesite-cookie-recipes/)
- [严格意义上的同站](/schemeful-samesite){% endAside %}

Cookie 是一种可用于向网站添加持久状态的方法。多年来，虽然 cookie 的功能得到了不断的进步和发展，但却给平台留下了一些遗留问题。为了解决这些问题，浏览器（包括 Chrome、Firefox 和 Edge）正在改变行为，从而强制执行更多保护隐私的默认设置。

每个 cookie 都是一对`key=value`，以及许多控制何时何地使用该 cookie 的属性。您可能已经使用这些属性设置过诸如过期日期或指示 cookie 应该仅通过 HTTPS 发送之类的内容。服务器通过在响应中发送命名合适的`Set-Cookie`标头来设置 cookie。您可以对 [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1) 进行深入研究来获取全部详情，但我会先在这里做一个快速回顾。

假设您有一个博客，您想在其中向用户显示"最新消息"的宣传。用户可以选择不看这则宣传，然后在一段时间内，他们就不会再次看到这则宣传。您可以将用户的首选项存储在 cookie 中，并设置为在一个月（2,600,000 秒）后过期，并且仅通过 HTTPS 发送。该标头如下所示：

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="单次响应中从服务器发送到浏览器的三个 cookie", width="800", height="276", style="max-width: 35vw" %}<figcaption>服务器使用<code>Set-Cookie</code>标头设置 cookie。</figcaption></figure>

当您的读者查看的页面满足这些要求，即他们处于安全连接上且 cookie 还不到一个月，那么他们的浏览器将在其请求中发送此标头：

```text
Cookie: promo_shown=1
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="单次请求中从浏览器向服务器发送的三个 cookie", width="800", height="165", style="max-width: 35vw" %}<figcaption>您的浏览器会在<code>Cookie</code>标头中发回 cookie。</figcaption></figure>

您还可以使用`document.cookie`在 JavaScript 中添加和读取该网站可用的 cookie。对`document.cookie`进行赋值将创建或覆盖一个带有该键的 cookie。例如，您可以在浏览器的 JavaScript 控制台中尝试以下操作：

```text
→ document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
← "promo_shown=1; Max-Age=2600000; Secure"
```

读取`document.cookie`将输出当前上下文中可访问的所有 cookie，每个 cookie 用分号进行分隔：

```text
→ document.cookie;
← "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="JavaScript 在浏览器中访问 cookie", width="600", height="382", style="max-width: 35vw" %}<figcaption> JavaScript 可以使用<code>document.cookie</code>访问 cookie。</figcaption></figure>

如果您在所选择的一系列热门网站上尝试此操作，您就会注意到大多数网站设置的 cookie 远不止三个。在大多数情况下，这些 cookie 会在每次向该域名发出请求时被发送，这会产生多种影响。对您的用户来说，上传带宽通常比下载更受限，因此，所有出站请求的开销都会使您的首字节时间发生延迟。请在 cookie 数量和大小的设置上做到保守。使用`Max-Age`属性来帮助确保 cookie 的停留时间不会超过所需时间。

## 什么是第一方和第三方 cookie？

如果再回到您之前查看的那几个网站，您可能会注意到不仅仅是您当前访问的域名有 cookie，许多域名都有 cookie。与当前网站的域名（即浏览器地址栏中显示的内容）相匹配的 cookie 被称为**第一方** cookie。同样，来自当前网站以外域名的 cookie 被称为**第三方** cookie。这不是一个绝对的标签，而是相对于用户上下文来决定的。同一个 cookie 可以是第一方的，也可以是第三方的，具体取决于用户当时所在的网站。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="三个 cookies 在同一页面的不同请求下被发送到浏览器", width="800", height="346", style="max-width: 35vw" %}<figcaption> Cookie 可能来自同一个页面上的多个不同域名。</figcaption></figure>

继续上面的例子，假设您的一篇博文中有一张非常独特的猫的照片，而这张照片被托管在`/blog/img/amazing-cat.png`。因为照片十分令人惊叹，其他人直接在他们的网站上使用了该照片。如果访问者访问过您的博客并拥有`promo_shown` cookie，那么当他们在其他人的网站上浏览`amazing-cat.png`时，就会在图像请求中**发送**该 cookie。这对任何一方都不是特别有用，因为`promo_shown`在其他人的网站上不用于任何内容，只是增加了请求的开销。

如果这样的效果并不是您的意图，那您为什么要这样做呢？正是这种机制允许网站在被用于第三方上下文时能够保持状态。例如，如果您在网站上嵌入了一个 YouTube 视频，那么访问者将在播放器中看到"稍后观看"选项。如果您的访问者已经登录了 YouTube，那么该会话将通过第三方 cookie 在嵌入式播放器中提供，也就意味着"稍后观看"按钮只会一次性保存视频，而不是提示他们进行登录或必须引导他们离开您的页面并回到 YouTube。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="在三个不同上下文中发送的相同 cookie", width="800", height="433", style="max-width: 35vw" %}<figcaption>访问不同页面时会发送第三方上下文中的 cookie。</figcaption></figure>

网络的其中一项文化属性就是它在默认情况下往往是开放的。这也是如此多的人得以在网络上创建自己的内容和应用程序的一部分原因。然而，这也带来了许多安全和隐私问题。跨站请求伪造 (CSRF) 攻击依赖于这样一个事实，即 cookie 会被附加到一个给定域名的任何请求（无论是谁发起请求）。例如，如果您访问`evil.example`，那么它就可以触发对`your-blog.example`的请求，并且您的浏览器会欣然附加相关的 cookie。如果您的博客对验证这些请求的方式没有多加留心，那么`evil.example`可能会触发删除帖子或添加自己的内容等操作。

用户也越来越了解 cookie 在跟踪他们跨多个站点的活动方面的用途。但直到现在还没有一种方法可以明确地说明您使用 cookie 的意图。您应该只在第一方上下文中发送`promo_shown` cookie，而将应嵌入其他网站的小组件的会话 cookie 用于在第三方上下文中提供登录状态。

## 用`SameSite`属性显式说明 cookie 的使用

`SameSite` 属性（在 [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00) 中进行了定义）的引入使您能够声明您的 cookie 是否应限制为第一方或同站上下文。准确理解此处"站点"的含义将会非常有帮助。这里的站点是域名后缀和域名后缀之前部分的组合。例如， `www.web.dev`域名是`web.dev`站点的一部分。

{% Aside 'key-term' %}

如果用户在`www.web.dev`上向`static.web.dev`请求图像，那么这是一个**同站**请求。

{% endAside %}

[公共后缀列表](https://publicsuffix.org/)对这一点进行了定义，因此站点不仅仅是`.com`等顶级域名，还包括`github.io`等服务。这就使得`your-project.github.io`和`my-project.github.io`算作独立的站点。

{% Aside 'key-term' %}

如果用户在`your-project.github.io`上向`my-project.github.io`请求图像，那么这是一个**跨站**请求。

{% endAside %}

在 cookie 上引入 `SameSite` 属性为控制此行为提供了三种不同的方式。您可以选择不指定属性，也可以使用`Strict`或`Lax`来将 cookie 的使用限制在同站请求中。

如果您将`SameSite`设置为`Strict` ，您的 cookie 将仅在第一方上下文中被发送。就用户而言，只有当 cookie 的站点与浏览器 URL 栏中当前显示的站点相匹配时，才会发送 cookie。因此，如果`promo_shown` cookie 设置如下：

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

当用户访问您的网站时，cookie 将按预期与请求一起被发送。但是，当通过链接进入您的网站时（比如通过另一个网站或通过朋友的电子邮件），在最初的请求中不会发送 cookie。这在您有与始终处于初始导航之后的功能（例如更改密码或进行购买）相关的 cookie 时是非常好的做法，但对`promo_shown`限制太大。如果您的读者通过链接进入网站，那么他们会希望通过发送 cookie 来实现他们的首选项。

这时候就需要通过允许这些顶级导航发送 cookie 来使用`SameSite=Lax`。让我们回到上文提到的一只猫的文章示例，其中，另一个站点正在引用您的内容。他们直接使用了您的猫的照片并提供了您原始文章的链接。

```html
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>
```

并且 cookie 已设置为：

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

当读者在另一个人的博客上时，cookie 在浏览器请求`amazing-cat.png`时**不会被发送**。但是，当读者通过链接访问您博客上的`cat.html`时，相应请求**将包含** cookie。这使得`Lax`非常适合用于影响网站显示的 cookie，而`Strict`对与用户正在执行的操作相关的 cookie 非常有用。

{% Aside 'caution' %}

`Strict`和`Lax`都不是针对您的网站安全的完整解决方案。Cookie 是作为用户请求的一部分发送的，而您应该像对待任何其他用户输入一样对待 cookie。这就意味着要对这些输入进行清理和验证。切勿使用 cookie 来存储您认为是服务端机密的数据。

{% endAside %}

最后，您还可以选择不指定值，而该做法在以前表示隐含地声明您希望在所有上下文中发送 cookie。在 [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03) 的最新一稿中，我们通过引入`SameSite=None`这个新的值来明确了这一点。这意味着您可以使用`None`来显式表示您有意希望在第三方上下文中发送 cookie。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="三个根据相应上下文标记为 None、Lax 或 Strict 的 cookie", width="800", height="456", style="max-width: 35vw" %}<figcaption>将 cookie 的上下文显式标记为<code>None</code>、<code>Lax</code>或<code>Strict</code>。</figcaption></figure>

{% Aside %}

如果您提供其他站点使用的服务，例如小组件、嵌入内容、附属程序、广告或跨多个站点登录，那么您应该使用`None`来确保您的意图明确。

{% endAside %}

## 在没有 SameSite 的情况下更改默认行为

虽然`SameSite`属性得到广泛支持，但遗憾的是该属性并未被开发者广泛采用。随处发送 cookie 的默认开放性意味着虽然所有用例都可以正常工作，但却会使用户容易受到 CSRF 和无意信息泄露的影响。为了鼓励开发者声明他们的意图并为用户提供更安全的体验，IETF 的[渐进式改善 cookie](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) 提案列出了两大关键变化：

- 没有`SameSite`属性的 cookie 将被视为`SameSite=Lax`。
- 具有`SameSite=None`的 cookie 还必须指定`Secure` ，即这些 cookie 需要一个安全的上下文环境。

Chrome 在 84 版本中实现了该默认行为。[Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) 在 Firefox 69 版本中为这些变化提供了测试，并会在将来实现默认行为。如需在 Firefox 中测试这些行为，请打开[`about:config`](http://kb.mozillazine.org/About:config)并设置`network.cookie.sameSite.laxByDefault`。[Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) 也计划更改其默认行为。

{% Aside %}

本文将在其他浏览器宣布支持后同步更新。

{% endAside %}

### 默认为`SameSite=Lax`

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

如果您发送的 cookie 没有指定`SameSite`属性……

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

浏览器会将该 cookie 视为已指定`SameSite=Lax`。

{% endCompareCaption %}

{% endCompare %}

虽然这是为了应用更安全的默认值，但理想情况下您应该设置显式的`SameSite`属性，而不是依赖浏览器为您应用该属性。这会使您的 cookie 意图明确，并提高在不同浏览器之间获得一致体验的机率。

{% Aside 'caution' %}

Chrome 应用的默认行为比显式的`SameSite=Lax`略宽松一些，因为 Chrome 允许在顶级 POST 请求上发送某些 cookie。您可以在 [blink-dev 公告](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ)中看到确切的细节。这只是一个临时缓解措施，因此您仍应修复您的跨站 cookie，并使用`SameSite=None; Secure`。

{% endAside %}

### `SameSite=None`必须是安全的

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

设置一个没有`Secure`的 cookie **将被拒绝**。

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

您必须确保将`SameSite=None`与`Secure`属性配对。

{% endCompareCaption %}

{% endCompare %}

从 Chrome 76 开始，您可以通过启用[`about:config`](http://kb.mozillazine.org/About:config) `about://flags/#cookies-without-same-site-must-be-secure`来测试此行为。您还可以在 Firefox 69 的[`about:config`](http://kb.mozillazine.org/About:config)中通过设置`network.cookie.sameSite.noneRequiresSecure`来测试此行为。

我们建议您在设置新 cookie 时应用此做法，并且即使在现有 cookie 尚未接近过期日期的情况下主动对其进行刷新。

{% Aside 'note' %}

如果您依赖于在您的网站上提供第三方内容的任何服务，您还应该与供应商确认他们正在更新他们的服务。您可能需要更新您的依赖项或代码段，从而确保您的站点能够采用新行为。

{% endAside %}

这两个更改都能够向后兼容已正确实现`SameSite`属性的先前版本，或根本不提供支持的浏览器。通过将这些更改应用于您的 cookie，您能够明确这些 cookie 的预期用途，而非依赖于浏览器的默认行为。同样，任何尚不能识别`SameSite=None`的客户端都应该将其忽略并按照未设置该属性的情况继续执行。

{% Aside 'warning' %}

许多旧版本的浏览器（包括 Chrome、Safari 和 UC 浏览器）与新的`None`属性不兼容，且可能会忽略或限制 cookie。该行为在当前版本中已得到修复，但您应该对流量进行检查，从而确定受影响的用户比例。您可以在 Chromium 网站上查看[已知不兼容客户端列表](https://www.chromium.org/updates/same-site/incompatible-clients)。

{% endAside %}

## `SameSite` cookie 配方

如需了解如何更新 cookie 来妥善处理对`SameSite=None`的这些更改，以及如何处理浏览器行为差异的更多详情，请访问后续文章 [SameSite cookie 配方](/samesite-cookie-recipes)。

_感谢 Lily Chen、Malte Ubl、Mike West、Rob Dodson、Tom Steiner 和 Vivek Sekhar 的贡献和反馈_

_Cookie 首图作者：[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) 上的 [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

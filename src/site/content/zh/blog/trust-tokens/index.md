---
title: 信任令牌入门
subhead: 信任令牌 (Trust Token) 是一种新 API。利用此 API，网站可以将有限数量的信息从一个浏览上下文传送到另一个上下文（例如，跨站），这样，无需被动跟踪即可防止欺诈。
authors:
  - samdutton
date: 2020-06-22
updated: 2021-12-10
hero: image/admin/okxi2ttRG3h1Z4F3cylI.jpg
thumbnail: image/admin/cTo0l2opcfNxg1TEjxSg.jpg
alt: 手持令牌的黑白照片
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside  'caution' %} **⚠️ 警告：您可能需要更新应用程序！**

**TrustTokenV3** 是为 Chromium 的信任令牌实现的向后不兼容更改的集合。这些更改已经在 Chrome 92 中实施，从而在 2021 年 7 月底发布了 Chrome 稳定版。

如果您还没有更新，则需要更新[测试 API](https://www.chromestatus.com/feature/5078049450098688) 的现有应用程序。

了解更多：[什么是 TrustTokenV3？](https://bit.ly/what-is-trusttokenv3){% endAside %}

<br><br>

{% YouTube id='bXB1Iwq6Eq4' %}

## 概述

利用信任令牌，来源能够向信任的用户颁发加密令牌。用户浏览器会存储令牌。随后，浏览器可以在其他上下文中使用令牌来评估用户的真实性。

利用信任令牌 API 可以将用户在一个上下文中的信任传递到另一个上下文中，而无需识别用户或关联两个身份。

您可以按照我们的[演示](https://trust-token-demo.glitch.me)试用该 API，并在 Chrome DevTools **网络**和**应用程序**选项卡中[检查令牌](https://developers.google.com/web/updates/2021/01/devtools#trust-token)。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/krrI292OLd6awb4dxkN0.jpg", alt="“Chrome DevTools 网络”选项卡中显示信任令牌的截图。", width="800", height="584" %}<figcaption> <b>Chrome DevTools 网络</b>选项卡中的信任令牌。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cwR9JdoVo1M4VDovP2oM.jpg", alt="Chrome DevTools 应用程序选项卡中显示信任令牌的屏幕截图。", width="800", height="584" %}<figcaption> <b>Chrome DevTools 应用程序</b>选项卡中的信任令牌。</figcaption></figure>

{% Aside %}隐私沙盒是一系列满足第三方用例的提案，无需第三方 Cookie 或其他跟踪机制。有关所有提案的概述，请参阅[深入了解隐私沙盒](/digging-into-the-privacy-sandbox)。

**本提案需要您的反馈！**如果希望发表意见，请在[信任令牌解释器](https://github.com/WICG/trust-token-api)存储库中[创建问题](https://github.com/WICG/trust-token-api/issues/new)。{% endAside %}

## 为什么需要信任令牌？

Web 需要建立信任信号的方法，从而证实用户的真实身份，而不至于被伪装成人类的机器人或欺骗真人或服务的恶意第三方欺诈。欺诈保护对广告商、广告提供商和 CDN 尤为重要。

遗憾的是，许多现有衡量和传播可信度的机制（例如，确定与站点的交互是否来自真人）利用了也可以用于指纹识别的技术。

{% Aside 'key-term' %}利用**指纹识别**，网站可以通过获取有关用户设备、操作系统、浏览器设置（如语言首选项、[用户代理](https://developer.mozilla.org/docs/Web/API/NavigatorID/userAgent)和可用字体）或设备状态变化的数据来识别和跟踪个人用户。在服务器上，通过检查请求标头即可实现，或者在客户端上，使用 JavaScript 也可以实现。

指纹识别使用用户不会意识到且无法控制的机制。[Panopticlick](https://panopticlick.eff.org/) 和 [amiunique.org](https://amiunique.org/) 等网站展示了如何结合指纹数据来识别您的个人身份。{% endAside %}

API 必须保护隐私，从而使信任能够跨站点传播，这样就无需跟踪单个用户。

## 信任令牌提案中有哪些内容？

网络要建立信任信号才能检测欺诈和垃圾邮件。一种实现方法是利用全局跨站点的各用户标识符来跟踪浏览。对于保护隐私的 API，这是不可接受的。

提案[**解释器**](https://github.com/WICG/trust-token-api#overview)说明：

<blockquote>
<p>该 API 为“隐私通行证”形式的加密令牌提出了一个全新的按来源存储区域，在第三方上下文中可以访问这些令牌。这些令牌是非个性化的，不能用于跟踪用户，但经过了加密签名，因此无法伪造。</p>
<p>当来源位于他们信任用户的上下文中时，他们可以向浏览器签发一批令牌，随后在用户不了解或不太信任的上下文中可以“使用”这些令牌。至关重要的是，令牌彼此不加区分，以防网站通过它们跟踪用户。</p>
<p>我们进一步为浏览器提出了一种扩展机制，可以使用绑定到特定令牌赎回的密钥对传出请求进行签名。</p>
</blockquote>

## 示例 API 用法

以下内容改编自 [API 解释器提供的示例代码](https://github.com/WICG/trust-token-api#sample-api-usage)。

{% Aside %}本文中的代码使用了自 Chrome 88 以来推出的更新语法。{% endAside %}

假设用户访问一个新闻网站 (`publisher.example`)，该网站嵌入了第三方广告网络 (`foo.example`) 的广告。用户之前曾使用过颁发信任令牌的社交媒体网站 (`issuer.example`)。

下面的步骤介绍信任令牌的工作原理。

**1.**用户访问 `issuer.example` 并执行让站点相信他们是真人的操作，例如帐户活动或通过验证码质询。

**2.** `issuer.example` 验证用户是真人，并运行以下 JavaScript 来向用户的浏览器颁发信任令牌：

```js
fetch('https://issuer.example/trust-token', {
  trustToken: {
    type: 'token-request',
    issuer: 'https://issuer.example'
  }
}).then(...)
```

**3.** 用户的浏览器存储信任令牌，并将其与 `issuer.example` 相关联。

**4.** 一段时间后，用户访问了 `publisher.example`。

**5.** `publisher.example` 想知道用户是否是真人。`publisher.example` 信任 `issuer.example`，因此，他们会检查用户的浏览器是否有来自该来源的有效令牌：

```js
document.hasTrustToken('https://issuer.example');
```

**6.** 如果返回解析为 `true` 的值，则意味着用户有来自 `issuer.example` 的令牌，因此，`publisher.example` 可以尝试赎回令牌：

```js
fetch('https://issuer.example/trust-token', {
trustToken: {
  type: 'token-redemption',
  issuer: 'https://issuer.example',
  refreshPolicy: {none, refresh}
}
}).then(...)
```

以上代码的作用：

1. 赎回者 `publisher.example` 请求赎回。
2. 如果赎回成功，则颁发者 `issuer.example` 返回赎回记录，这表明它们曾向浏览器颁发有效令牌。

**7.** `fetch()` 返回的值得到解析后，后续资源请求中就可以使用赎回记录：

```js
fetch('https://foo.example/get-content', {
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['https://issuer.example', ...]
  }
});
```

以上代码的作用：

1. 赎回记录作为请求标头 `Sec-Redemption-Record` 包含在内。
2. `foo.example` 收到赎回记录，并且可以通过解析该记录来确定 `issuer.example` 是否认为该用户是人类。
3. `foo.example` 进行相应地响应。

{% Details %} {% DetailsSummary %} 网站如何判断是否可以信任您？{% endDetailsSummary %}您可能在电子商务网站上有购物记录、定位平台上的签到记录或银行的账户记录。发行者还可能会考虑其他因素，例如您获得账户的时间或其他交互（例如验证码或表单提交），从而让发行者更相信您是真人。 {% endDetails %}

### 信任令牌颁发

如果信任令牌颁发者（例如 `issuer.example`）认为用户值得信赖，则颁发者可以使用 `trustToken` 参数 `fetch()` 获取用户的信任令牌：

```js
fetch('issuer.example/trust-token', {
  trustToken: {
    type: 'token-request'
  }
}).then(...)
```

它使用[新的加密原语](https://eprint.iacr.org/2020/072.pdf)调用[隐私通行证](https://privacypass.github.io/)发行协议的扩展：

1. 生成一组称为 *Nonce* 的伪随机数。

2. 屏蔽 Nonce（对其进行编码，使发行者无法查看其内容）并将其附加到 `Sec-Trust-Token` 标头的请求中。

3. 向提供的端点发送 POST 请求。

端点使用[屏蔽的令牌](https://en.wikipedia.org/wiki/Blind_signature)（屏蔽 Nounce 上的签名）进行响应，然后解除屏蔽令牌，并由浏览器将其与相关的 Nonce 一起存储为内部信任令牌。

### 信任令牌赎回

发布者站点（例如上例中的 `publisher.example`）可以检查是否有可供用户使用的信任令牌：

```js
const userHasTokens = await document.hasTrustToken('issuer.example/trust-token');
```

如果有可用令牌，则发布者站点可以通过赎回令牌来获得赎回记录：

```js
fetch('issuer.example/trust-token', {
  ...
  trustToken: {
    type: 'token-redemption',
    refreshPolicy: 'none'
  }
  ...
}).then(...)
```

通过使用 `fetch()` 调用，发布者可以在需要信任令牌（例如发表评论、点赞页面或投票）的请求中包含赎回记录，代码如下：

```js
fetch('https://foo.example/post-comment', {
  ...
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['issuer.example/trust-token', ...]
  }
  ...
}).then(...);
```

对话记录作为 `Sec-Redemption-Record` 请求标头包含在内。

{% Aside %} 信任令牌只能通过 Fetch、XHR 和 HTML `<iframe>` 元素的选项访问：<br>不能直接访问。{% endAside%}

### 隐私注意事项

根据设计，令牌“不可关联”。颁发者可以了解有关用户访问哪些站点的汇总信息，但不能将发行与赎回关联起来：当用户赎回令牌时，颁发者无法将该令牌与它创建的其他令牌区分开。但是，信任令牌目前并不是凭空存在的：目前，颁发者可以通过其他方式（理论上）跨站点加入用户的身份，例如第三方 Cookie 和变相跟踪技术。站点在规划支持时务必了解这种生态系统转变。这是许多隐私沙盒 API 转变的一个常见方面，在此不再进一步讨论。

### 安全注意事项

**信任令牌耗尽：**恶意站点可能会故意耗尽用户向特定颁发者获取的令牌。多种缓解措施可以应对此类攻击，例如让颁发者一次提供多个令牌，这样，用户便有足够的令牌来确保浏览器在每个顶级页面视图中只赎回一个令牌。

**双重支付预防：**恶意软件可能会尝试访问用户的所有信任令牌。但是，令牌会逐渐被耗尽，因为每次赎回都会发送给同一令牌颁发者，而该令牌颁发者可以验证每个令牌仅使用了一次。为了降低风险，颁发者还可以减少签署的令牌数量。

### 请求机制

可能可以允许在 `fetch()` 之外发送赎回记录，例如，对于导航请求。站点还可以在 HTTP 响应标头中包含颁发者数据，从而在加载页面的同时支持赎回令牌。

**重申：本提案需要您的反馈！**如果您希望发表意见，请在信任令牌[解释器存储库](https://github.com/WICG/trust-token-api)上[创建问题](https://github.com/WICG/trust-token-api/issues/new)。

## 了解更多

- [信任令牌演示](https://trust-token-demo.glitch.me)
- [Chrome 来源试用入门](https://developer.chrome.com/blog/origin-trials/)
- [深入了解隐私沙盒](/digging-into-the-privacy-sandbox/)
- [信任令牌 API 解释器](https://github.com/WICG/trust-token-api)
- [Chromium 项目：信任令牌 API](https://sites.google.com/a/chromium.org/dev/updates/trust-token)
- [实现意图：信任令牌 API](https://groups.google.com/a/chromium.org/g/blink-dev/c/X9sF2uLe9rA/m/1xV5KEn2DgAJ)
- [Chrome 平台状态](https://www.chromestatus.com/feature/5078049450098688)
- [隐私通行证](https://privacypass.github.io/)
- [隐私通行证的扩展](https://eprint.iacr.org/2020/072.pdf)

---

感谢帮助编写和审阅此博文的所有人。

照片由[ZSun Fu](https://unsplash.com/photos/b4D7FKAghoE)在[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)上拍摄。

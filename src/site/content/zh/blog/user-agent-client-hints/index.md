---
title: 通过用户代理客户端提示改善用户隐私和开发者体验
subhead: 用户代理客户端提示是客户端提示 API 的新扩展，能够使开发者以保护隐私和符合工效学的方式访问用户的浏览器信息。
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-02-12
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: 雪地上各种不同的脚印。提示了应该有谁来过。
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

客户端提示使开发者能够主动请求用户设备或条件的相关信息，而无需从用户代理 (UA) 字符串中解析出这些信息。提供这条替代路由是最终减少用户代理字符串粒度的第一步。

了解针对依赖于解析用户代理字符串的现有功能的更新方式，进而改为使用用户代理客户端提示。

{% Banner 'caution', 'body' %}如果您已经在使用用户代理客户端提示，请注意即将到来的变更。我们正在对标头格式进行更改，从而使`Accept-CH`令牌与返回头完全匹配。网站在以往可以发送`Accept-CH: UA-Platform`来接收`Sec-CH-UA-Platform`标头，而网站现在应改为发送`Accept-CH: Sec-CH-UA-Platform`。如果您已经实现了用户代理客户端提示，请在这一更改在稳定的 Chromium 中完全推出前发送这两种格式。请参阅[有意向移除：重命名用户代理客户端提示 ACCEPT-CH 令牌](https://groups.google.com/a/chromium.org/g/blink-dev/c/t-S9nnos9qU/m/pUFJb00jBAAJ)来获取更新。{% endBanner %}

## 背景

网络浏览器发出请求时，会包含浏览器及其环境的相关信息，以便服务器可以启用分析并自定义响应。这一点早在 1996 年就被定义了（HTTP/1.0 的 RFC 1945），您可以在其中找到[用户代理字符串](https://tools.ietf.org/html/rfc1945#section-10.15)的原始定义，里面包括一个示例：

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

这个标头的目的是按重要性顺序指定产品（例如浏览器或库）和一条注释（例如版本）。

### 用户代理字符串的状态

在过去的*几十年*里，这个字符串已经积累了发出请求的客户端的各种相关附加细节（由于向后兼容性，也包括 cruft）。我们在看 Chrome 当前的用户代理字符串时就能发现这一点：

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

上方的字符串包含用户的操作系统和版本、设备型号、浏览器的品牌和完整版本的相关信息，这些线索足以推断出这是一个移动浏览器，更不用说出于历史原因对其他浏览器的一些引用。

这些参数与可能值的绝对多样性相组合，就意味着用户代理字符串可以包含足够的信息来对单个用户做出唯一标识。如果您在 [AmIUnique](https://amiunique.org/) 中测试自己的浏览器，就可以看出**您自己的**用户代理字符串能够多么准确地识别**您**的身份。得到的"相似率"越低，请求就越独特，服务器也就越容易暗中跟踪您。

用户代理字符串支持许多合理的[用例](https://github.com/WICG/ua-client-hints/blob/main/README.md#use-cases)，并为开发者和网站所有者提供重要用途。但是，保护用户隐私免受隐蔽跟踪方法的侵害也至关重要，而默认发送 UA 信息与这一目标背道而驰。

提高网络兼容性对于用户代理字符串也是必须的。用户代理字符串是非结构化的，因此对其进行解析会带来不必要的复杂性，这通常是导致错误和站点兼容性问题并对用户造成困扰的原因。这些问题对不太常用的浏览器的用户造成的伤害也是不成比例的，因为网站可能无法针对这些用户配置进行测试。

## 推出新的用户代理客户端提示

[用户代理客户端提示](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity)使您能够通过更加保护隐私的方式访问相同的信息，进而使浏览器能够最终降低用户代理字符串默认公布所有内容的程度。[客户端提示](https://tools.ietf.org/html/draft-ietf-httpbis-client-hints)会强制执行一个模型，其中，服务器必须向浏览器询问有关客户端的一组数据（提示），而浏览器通过应用自己的政策或用户配置来确定返回哪些数据。这意味着**所有**用户代理信息现在不再会被默认公开，而是会以显式的、可审计的方式得到访问管理。开发者还将得益于一个更简单的 API 而不再需要编写正则表达式！

当前这组客户端提示主要描述了浏览器的显示和连接功能。您可以在[使用客户端提示实现自动化资源选择](https://developers.google.com/web/updates/2015/09/automating-resource-selection-with-client-hints)中探索详细信息，但我先在这里对该过程做一个快速回顾。

服务器通过标头请求特定的客户端提示：

⬇️*来自服务器的响应*

```text
Accept-CH: Viewport-Width, Width
```

或元标签：

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

然后浏览器可以选择在后续请求中发回以下标头：

⬆️*后续请求*

```text
Viewport-Width: 460
Width: 230
```

服务器可以选择改变其响应，例如选择以合适的分辨率提供图像。

{% Aside %} 目前关于在初始请求时启用客户端提示的讨论仍在持续进行，但在选定这个方向之前，您应该首先考虑[响应式设计](/responsive-web-design-basics)或渐进增强。{% endAside %}

用户代理客户端提示能够使用通过`Accept-CH`服务器响应头指定的`Sec-CH-UA`前缀来扩展属性范围。如需了解全部详情，请先从[解释器](https://github.com/WICG/ua-client-hints/blob/main/README.md)着手，然后再深入研究[完整方案](https://wicg.github.io/ua-client-hints/)。

{% Aside %} 客户端提示**仅通过安全连接发送**，因此请确保您已[将网站迁移到 HTTPS](/why-https-matters)。{% endAside %}

Chromium 84 提供了一组新的提示，现在我们就来探索一下这些提示的运作方式。

## Chromium 84 的用户代理客户端提示

用户代理客户端提示只会随着[兼容性问题](https://bugs.chromium.org/p/chromium/issues/detail?id=1091285)的逐一解决而在 Chrome 稳定版上逐步启用。强制开启功能进行测试的方式：

- 使用 Chrome 84 **测试版**或同等版本。
- 启用`about://flags/#enable-experimental-web-platform-features`标志。

默认情况下，浏览器会返回浏览器品牌、重要/主要版本以及客户端是否为移动设备的指示符：

⬆️*所有请求*

```text
Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

{% Aside 'caution' %} 这些属性比单个值更为复杂，因此我们用[结构化标头](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html)来表示列表和布尔值。{% endAside %}

### 用户代理响应和请求标头

<style>
.w-table-wrapper th:nth-of-type(1), .w-table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.w-table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️ 响应`Accept-CH`<br> ⬆️ 请求标头 | ⬆️ 请求<br>示例值 | 描述
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | 浏览器品牌及其重要版本列表。
`Sec-CH-UA-Mobile` | `?1` | 布尔值，指示浏览器是（`?1`表示真）否（`?0`表示假）在移动设备上。
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | 浏览器的完整版本。
`Sec-CH-UA-Platform` | `"Android"` | 设备平台，通常为操作系统 (OS)。
`Sec-CH-UA-Platform-Version` | `"10"` | 平台或操作系统的版本。
`Sec-CH-UA-Arch` | `"arm"` | 设备的底层架构。虽然这可能与显示页面无关，但网站可能会希望提供默认为正确格式的下载。
`Sec-CH-UA-Model` | `"Pixel 3"` | 设备型号。

{% Aside 'gotchas' %}出于隐私和兼容性的考虑，该值可能为空、不返回或用一个不同的值来填充。这被称为 [GREASE](https://wicg.github.io/ua-client-hints/#grease)。{% endAside %}

### 示例交换

示例交换如下所示：

⬆️*浏览器的初始请求*<br>浏览器正在向网站请求`/downloads`页面并发送其默认的基本用户代理。

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

⬇️*服务器的响应*<br>服务器将页面发回并另外要求提供完整的浏览器版本和平台。

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version, Sec-CH-UA-Platform
```

⬆️*后续请求*<br>浏览器授予服务器访问附加信息的权限，并在所有后续响应中发回额外提示。

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Full-Version: "84.0.4143.2"
Sec-CH-UA-Platform: "Android"
```

### JavaScript API

除了标头外，还可以通过`navigator.userAgentData`在 JavaScript 中访问用户代理。可以分别通过`brands`和`mobile`属性访问默认的`Sec-CH-UA`和`Sec-CH-UA-Mobile`：

```js
// 记录品牌数据
console.log(navigator.userAgentData.brands);

// 输出
[
  {
    brand: 'Chromium',
    version: '84',
  },
  {
    brand: 'Google Chrome',
    version: '84',
  },
];

// 记录移动指示器
console.log(navigator.userAgentData.mobile);

// 输出
false;
```

附加值可以通过`getHighEntropyValues()`调用来进行访问。"高熵"一词指的是[信息熵](https://en.wikipedia.org/wiki/Entropy_(information_theory))，也就是这些值揭示的有关用户浏览器的信息量。与请求附加标头一样，返回值（如果有）取决于浏览器。

```js
// 记录完整的用户代理数据
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "platform", "platformVersion",
     "uaFullVersion"])
  .then(ua => { console.log(ua) });

// 输出
{
  "architecture": "x86",
  "model": "",
  "platform": "Linux",
  "platformVersion": "",
  "uaFullVersion": "84.0.4143.2"
}
```

### 演示版

您可以在 [user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me) 上尝试对自己的设备使用标头和 JavaScript API。

{% Aside %} 确保您使用的是 Chrome 84 测试版或同等版本，并启用`about://flags/#enable-experimental-web-platform-features`。{% endAside %}

### 提示生命周期和重设

通过`Accept-CH`标头指定的提示将在浏览器会话期间或直到指定一组不同提示之前进行发送。

这意味着如果服务器发送：

⬇️*响应*

```text
Accept-CH: Sec-CH-UA-Full-Version
```

然后，浏览器直到关闭前都会为该网站的所有请求发送`Sec-CH-UA-Full-Version`标头。

⬆️*后续请求*

```text
Sec-CH-UA-Full-Version: "84.0.4143.2"
```

但是，如果收到另一个`Accept-CH`标头，则该标头将**完全替换**浏览器正在发送的当前提示。

⬇️*响应*

```text
Accept-CH: Sec-CH-UA-Platform
```

⬆️*后续请求*

```text
Sec-CH-UA-Platform: "Android"
```

之前请求的`Sec-CH-UA-Full-Version`**将不会被发送**。

最好将`Accept-CH`标头的功能视作指定该页面所需的完整提示集，这意味着浏览器随后会为该页面上的所有子资源发送指定的提示。虽然提示会持续到下一次导航，但网站不应依赖或假设这些提示会被传递。

{% Aside 'success' %}始终确保您在没有这些信息的情况下仍能提供有意义的体验。提示是为了增强用户体验，而不是定义用户体验的，所以这些信息才会被称为"提示"，而不是"答案"或"要求"！{% endAside %}

利用这一点，您还可以通过在响应中发送一个空的`Accept-CH`来有效清除浏览器发送的所有提示。可以考虑在任何用户重置首选项或退出网站的位置添加此选项。

这种模式也符合提示在`<meta http-equiv="Accept-CH" …>`标签下的运作方式。所请求的提示只会在页面发起请求时被发送，而不会在任何后续导航时被发送。

### 提示范围和跨域请求

默认情况下，客户端提示只会在同域请求中被发送。这意味着如果您在`https://example.com`中要求特定提示，但您要优化的资源在`https://downloads.example.com`上，那么这些资源**将不会**收到任何提示。

为了在跨域请求中发送提示，每个提示和域都必须由一个`Feature-Policy`标头进行指定。如需将这一做法应用在用户代理客户端提示中，您需要将提示小写并删除`sec-`前缀。例如：

⬇️*`example.com`的响应*

```text
Accept-CH: Sec-CH-UA-Platform, DPR
Feature-Policy: ch-ua-platform downloads.example.com;
                ch-dpr cdn.provider img.example.com
```

⬆️*向`downloads.example.com`发送的请求*

```text
Sec-CH-UA-Platform: "Android"
```

⬆️*向`cdn.provider`或`img.example.com`发送的请求*

```text
DPR: 2
```

## 在哪里使用用户代理客户端提示？

快速的解答就是您应该对正在解析用户代理标头或使用访问相同信息的任何 JavaScript 调用（例如`navigator.userAgent`、`navigator.appVersion`或`navigator.platform`）的任何实例进行重构，进而改用用户代理客户端提示。

更进一步地，您应该重新检查您对用户代理信息的使用，并尽可能地用其他方法代替。通常情况下，您可以通过使用渐进增强、特征检测或[响应式设计](/responsive-web-design-basics)来实现同样的目标。依赖用户代理数据的基本问题是，您始终要对正在检查的属性与其启用行为之间的映射进行维护。这项维护开销可确保您的检测是全面的并保持最新状态。

考虑到这些注意事项， [用户代理客户端提示存储库列出了一些有效用例](https://github.com/WICG/ua-client-hints#use-cases)（针对网站）。

## 用户代理字符串会发生什么变化？

该计划是通过减少现有用户代理字符串暴露的识别信息量，同时不对现有网站造成过度干扰，从而最大限度地削弱网络上隐蔽跟踪的能力。用户代理客户端提示的推出使您有机会在我们对用户代理字符串进行任何更改前了解和试验新功能。

[最终](https://groups.google.com/a/chromium.org/d/msg/blink-dev/-2JIRNMWJ7s/u-YzXjZ8BAAJ)，用户代理字符串中的信息将得到减少，从而在保持传统格式的同时，只提供与默认提示相同的高级浏览器和重要版本信息。在 Chromium 中，此更改已至少推迟到 2021 年，以便为生态系统提供更多时间来评估新的用户代理客户端提示功能。

您可以通过启用 Chrome 93 中的`about://flags/#reduce-user-agent`标志来测试其中一个版本（注意：此标志在 Chrome 84 - 92 版本中叫做`about://flags/#freeze-user-agent`)。出于兼容性原因，这将返回一个带有历史条目，但包含已净化具体内容的字符串。如下所示：

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*照片：[谢尔盖·佐尔金 (Sergey Zolkin)](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)；来源：[Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

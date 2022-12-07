---
title: 使用 Trusted Types 防止基于 DOM 的跨站点脚本漏洞
subhead: 减小应用程序的 DOM XSS 攻击面。
authors:
  - koto
date: 2020-03-25
hero: image/admin/3Mgu37qU0P4fVdI4NTxM.png
alt: 演示跨站点脚本漏洞的代码片段。
description: 推出 Trusted Types：一个用于在现代 Web 应用程序中防止基于 DOM 的跨站点脚本的浏览器 API。
tags:
  - blog
  - security
feedback:
  - api
---

## 为什么应关注？

基于 DOM 的跨站点脚本 (DOM XSS) 是最常见的 Web 安全漏洞之一，并且您的应用程序很容易将其引入。[Trusted Types](https://github.com/w3c/webappsec-trusted-types) 默认对危险的 Web API 函数加以保护，从而提供了编写、安全审核和维护无 DOM XSS 漏洞的应用程序的工具。Chrome 83 支持 Trusted Types，其他浏览器可以使用 [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill)。有关最新的跨浏览器支持信息，请参阅[浏览器兼容性](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types#browser_compatibility)。

{% Aside 'key-term' %}当来自用户控制的*源*的数据（例如用户名或从 URL 片段获取的重定向 URL）到达*接收器*（`eval()` 等函数或 `.innerHTML` 等属性 setter）时，会触发基于 DOM 的跨站点脚本，从而可执行任意 JavaScript 代码。{% endAside %}

## 背景

多年来， [DOM XSS](https://owasp.org/www-community/attacks/xss/) 一直是最普遍和最危险的 Web 安全漏洞之一。

有两组不同的跨站点脚本。一些 XSS 漏洞是服务器端代码引起的，这些代码不安全地创建了形成网站的 HTML 代码。另外一些漏洞的根本原因在于客户端，其中的 JavaScript 代码对用户控制的内容调用了危险的函数。

为了[防止服务器端 XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)，不要通过连接字符串来生成 HTML，而是使用安全的上下文自动转义模板库。对于不可避免发生的错误，使用[基于 nonce 的内容安全策略](https://csp.withgoogle.com/docs/strict-csp.html)来进一步缓解。

现在，浏览器还可以通过 [Trusted Types](https://bit.ly/trusted-types) 帮助防止客户端（也称为基于 DOM）XSS。

## API 简介

Trusted Types 的工作原理是锁定以下有风险的接收器函数。您可能已经认出其中一些，因为浏览器供应商和 [Web 框架](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)已经出于安全原因引导您避免使用这些功能。

- **脚本操作**：<br> [`<script src>`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-src) 和设置 [`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script) 元素的文本内容。

- **从字符串生成 HTML** ：<br>

    [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML)、[`outerHTML`](https://developer.mozilla.org/docs/Web/API/Element/outerHTML)、[`insertAdjacentHTML`](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML)、[`<iframe> srcdoc`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-srcdoc)、[`document.write`](https://developer.mozilla.org/docs/Web/API/Document/write)、[`document.writeln`](https://developer.mozilla.org/docs/Web/API/Document/writeln) 和 [`DOMParser.parseFromString`](https://developer.mozilla.org/docs/Web/API/DOMParser#DOMParser.parseFromString)

- **执行插件内容**：<br> [`<embed src>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed#attr-src)、[`<object data>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-data) 和 [`<object codebase>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-codebase)

- **运行时 JavaScript 代码编译**：<br> `eval`、`setTimeout`、`setInterval`、`new Function()`

Trusted Types 要求您在将数据传递给上述接收器函数之前对其进行处理。仅使用字符串将失败，因为浏览器不知道数据是否可信：

{% Compare 'worse' %}

```javascript
anElement.innerHTML = location.href;
```

{% CompareCaption %} 启用 Trusted Types 后，浏览器会抛出 *TypeError*，并阻止将 DOM XSS 接收器与字符串一起使用。{% endCompareCaption %}

{% endCompare %}

要表示数据已被安全处理，请创建一个特殊对象 - Trusted Type。

{% Compare 'better' %}

```javascript
anElement.innerHTML = aTrustedHTML;
```

{% CompareCaption %} 启用 Trusted Types 后，浏览器对于需要 HTML 片段的接收器将接受 `TrustedHTML` 对象，对于其他敏感接收器接受 `TrustedScript` 和 `TrustedScriptURL` 对象。{% endCompareCaption %}

{% endCompare %}

Trusted Types 大大减小了应用程序的 DOM XSS [攻击面](https://en.wikipedia.org/wiki/Attack_surface)。它简化了安全审核，并允许您在浏览器中在运行时编译、lint 或捆绑代码时强制执行基于类型的安全检查。

## 如何使用 Trusted Types

### 准备内容安全策略违规报告

您可以部署报告收集器（例如开源的 [go-csp-collector](https://github.com/jacobbednarz/go-csp-collector)），或使用具有同等功能的商业工具。还可以在浏览器中调试违规：

```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### 添加仅报告 CSP 标头

将以下 HTTP 响应标头添加到要迁移到 Trusted Types 的文档。

```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

现在，所有违规都已报告给 `//my-csp-endpoint.example`，但网站继续工作。下一节将解释 `//my-csp-endpoint.example` 的工作原理。

{% Aside 'caution' %} Trusted Types 仅在 HTTPS 和`localhost` 等[安全上下文](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts)中可用。{% endAside %}

### 识别 Trusted Types 违规

从现在开始，每次 Trusted Types 检测到违规时，都会向配置的 `report-uri` 发送报告。例如，当应用程序将一个字符串传递给 `innerHTML` 时，浏览器会发送以下报告：

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

这表示在 `https://my.url.example/script.js` 的第 39 行，使用以 `<img src=x` 开头的字符串调用了  `innerHTML`。此信息应该可以帮助您缩小可能会引入 DOM XSS 并需要更改的代码范围。

{% Aside %}大多数此类违规还可以通过对代码库运行代码 linter 或[静态代码检查器](https://github.com/mozilla/eslint-plugin-no-unsanitized)来进行检测。这有助于快速识别大量违规。

也就是说，您还应该分析 CSP 违规，因为这些违规会在执行不合规的代码时触发。{% endAside %}

### 修复违规

有几个选项用于修复 Trusted Type 违规。您可以[删除违规代码](#remove-the-offending-code)，[使用库](#use-a-library)，[创建 Trusted Type 策略](#create-a-trusted-type-policy)，或者[创建默认策略](#create-a-default-policy)作为最后手段。

#### 重写违规代码

也许不再需要不合规的功能，或者以现代方式（不使用易出错的函数）重写这些功能？

{% Compare 'worse' %}

```javascript
el.innerHTML = '<img src=xyz.jpg>';
```

{% endCompare %}

{% Compare 'better' %}

```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```

{% endCompare %}

#### 使用库

一些库已经生成了可以传递给接收器函数的 Trusted Types。例如，可以使用 [DOMPurify](https://github.com/cure53/DOMPurify) 清理 HTML 片段，删除 XSS 有效载荷。

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true});
```

DOMPurify [支持 Trusted Types](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types)，并将返回包装在 `TrustedHTML` 对象中的经过清理的 HTML，以使浏览器不会产生违规。{% Aside 'caution' %} 如果 DOMPurify 中的清理逻辑有错误，您的应用程序可能仍然存在 DOM XSS 漏洞。Trusted Types 会强制您*以某种方式*处理值，但尚未定义确切的处理规则，以及它们是否安全。{% endAside %}

#### 创建 Trusted Type 策略

有时，无法删除功能，并且没有库来清理值和创建 Trusted Type。在这种情况下，请自行创建 Trusted Type 对象。

为此，首先创建一个[策略](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr)。策略是 Trusted Types 的工厂，会对其输入强制执行某些安全规则：

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '&lt;')
  });
}
```

此代码创建了一个名为 `myEscapePolicy` 的策略，该策略可以通过其 `createHTML()` 函数生成 `TrustedHTML` 对象。所定义的规则将对 `<`字符进行 HTML 转义，以防止创建新的 HTML 元素。

按如下方式使用策略：

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // true
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)>'
```

{% Aside %} 虽然传递给 `trustedTypes.createPolicy()` 的 JavaScript 函数 `createHTML()` 返回一个字符串，但 `createPolicy()` 返回一个策略对象，该对象将返回值包装为正确的类型 - 在本例中为 `TrustedHTML`。 {% endAside %}

#### 使用默认策略

有时无法更改出错的代码。例如，如果从 CDN 加载第三方库，就会出现这种情况。在这种情况下，请使用[默认策略](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr)：

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

只要在仅接受 Trusted Type 的接收器中使用字符串，就会使用名为 `default` 的策略。{% Aside 'gotchas' %} 应尽量少用默认策略，而是首选重构应用程序来使用常规策略。这样做会鼓励在设计中让安全规则接近它们处理的数据，而且您拥有最多的上下文来正确地清理值。{% endAside %}

### 切换到强制执行内容安全策略

当应用程序不再产生违规时，可以开始强制执行 Trusted Types：

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

瞧！现在，无论 Web 应用程序有多复杂，唯一可能引入 DOM XSS 漏洞的是您的某个策略中的代码 - 您可以通过[限制策略创建](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive)来进一步锁定该漏洞。

## 进阶阅读

- [Trusted Types GitHub](https://github.com/w3c/webappsec-trusted-types)
- [W3C 规范草案](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [常见问题解答](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [集成](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)

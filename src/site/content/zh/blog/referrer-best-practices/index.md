---
title: 引荐来源 (Referer) 和引荐来源政策 (Referrer-Policy) 最佳实践
subhead: 设置引荐来源政策并在传入请求中使用引荐来源的最佳实践。
authors:
  - maudn
date: 2020-07-30
updated: 2020-09-23
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: 可以考虑设置 `strict-origin-when-cross-origin` 的引荐来源政策。该政策保留了引荐来源的大部分用途，同时降低了跨域泄露数据的风险。
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## 概述

- 意外的跨域信息泄露是网络用户隐私的绊脚石。一个保护性引荐来源政策可以提供帮助。
- 可以考虑设置 `strict-origin-when-cross-origin` 的引荐来源政策。该政策保留了引荐来源的大部分用途，同时降低了跨域泄露数据的风险。
- 不要使用引荐来源来防范跨站请求伪造 (CSRF)，而是用 [CSRF 令牌](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)和其他标头作为额外的一层安全保障。

{% Aside %}在我们开始之前：

- 如果您不确定"网站"和"域"之间的区别，请查看[了解"同站"和"同域"](/same-site-same-origin/)。
- 由于规范中的原始拼写错误，`Referer`标头缺少一个 R。JavaScript 和 DOM 中的`Referrer-Policy`标头和`referrer`的拼写是正确的。{% endAside %}

## 引荐来源和引荐来源政策 101

HTTP 请求可能包含可选的[`Referer`标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer)，该标头指示发出请求的域或网页 URL。[`Referrer-Policy`标头](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)定义了在`Referer`标头中可用的数据。

在下方的示例中，`Referer`标头包含发出请求的`site-one`上页面的完整 URL。

<figure class="w-figure">{% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="包括一个引荐来源标头的 HTTP 请求。", width="800", height="573" %}</figure>

`Referer`标头可能出现在不同类型的请求中：

- 导航请求（当用户点击链接时）
- 子资源请求（当浏览器请求页面需要的图像、iframe、脚本和其他资源时）

对于导航和 iframe，也可以通过 JavaScript 使用`document.referrer`访问这些数据。

`Referer`值可以提供非常有见解的信息。例如，分析服务可以使用该值来确定`site-two.example`上 50% 的访问者来自`social-network.example`。

但是当包含路径和查询字符串的完整 URL 在`Referer`中被**跨域**发送时，就可能会**有碍隐私**并带来**安全风险**。请看下列这些网址：

<figure class="w-figure">{% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="带有路径的 URL 映射到不同的隐私和安全风险。", width="800", height="370" %}</figure>

URL #1 到 #5 包含私人信息，有时甚至是识别信息或敏感信息。在不知不觉中跨域泄露这些信息可能会危及网络用户的隐私安全。

URL #6 是一个[功能性 URL](https://www.w3.org/TR/capability-urls/)。不要让它落入目标用户之外的任何人手中。如果发生这种情况，恶意行为者可能会劫持该用户的帐号。

**为了限制来自您网站的请求可以获取的引荐来源数据，您可以设置一个引荐来源政策。**

## 有哪些可用的政策，它们之间有何不同？

您可以从八种政策中选择一种。根据政策的选择， `Referer`标头（和`document.referrer`）中可用的数据可以是：

- 无数据（不存在`Referer`标头）
- 只有[域](/same-site-same-origin/#origin)
- 完整 URL：域、路径和查询字符串

<figure class="w-figure">{% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="引荐来源标头和 document.referrer 中可以包含的数据。", width="800", height="255" %}</figure>

一些政策被设计为根据**上下文**的不同而采取不同行为：跨域或同域请求、安全性（无论请求目的地的安全性是否和域一样），或两者兼备。这对于限制跨域共享或限制向不太安全的域共享的信息量非常有用，同时也能够保持您自己的网站中引荐来源的丰富性。

以下概览显示了引荐来源政策对于引荐来源标头和`document.referrer`中可用 URL 数据的限制方式：

<figure class="w-figure">{% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="不同安全性和跨域上下文情况下的不同引荐来源政策及其行为。", width="800", height="537" %}</figure>

MDN 提供了[完整的政策和行为示例列表](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives)。

注意事项：

- 所有将方案（HTTPS 与 HTTP）考虑在内的政策（`strict-origin`、`no-referrer-when-downgrade`和`strict-origin-when-cross-origin`）都会以相同的方式处理从一个 HTTP 域到另一个 HTTP 域的请求以及从一个 HTTPS 域到另一个 HTTPS 域的请求（即使 HTTP 的安全性更低）。这是因为对于这些政策来说，重要的是是否发生了安全**降级**，即请求是否可以将数据从一个加密域暴露给一个未加密域。 HTTP → HTTP 请求一直都是未加密的，因此不会出现降级。 相反，HTTPS → HTTP 请求会呈现降级。
- 如果请求是**同域的** ，这意味着方案（HTTPS 或 HTTP）相同，因此也就没有安全降级。

## 浏览器中的默认引荐来源政策

*截至 2020 年 7 月*

**在未设置引荐来源政策的情况下将使用浏览器的默认政策。**

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>浏览器</th>
        <th>默认<code>Referrer-Policy</code>/行为</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>计划在<a href="https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default">版本 85</a> 中切换为<code>strict-origin-when-cross-origin</code>（以往是<code>no-referrer-when-downgrade</code>）</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          <ul>
            <li>
<code>strict-origin-when-cross-origin</code> （<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">请参阅已关闭的错误</a>）</li>
            <li>私密浏览和跟踪器中使用<code>strict-origin-when-cross-origin</code>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Edge</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li>正在对<code>strict-origin-when-cross-origin</code>进行<a href="https://github.com/privacycg/proposals/issues/13">试验</a>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>与<code>strict-origin-when-cross-origin</code>类似。请参阅<a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">阻止反跟踪进行跟踪</a>了解详情。</td>
      </tr>
    </tbody>
  </table>
</div>

## 设置您的引荐来源政策：最佳实践

{% Aside 'objective' %} 显式设置隐私增强政策，例如`strict-origin-when-cross-origin`（或更严格的政策）。{% endAside %}

有多种方法可以为您的网站设置引荐来源政策：

- 作为 HTTP 标头
- 在您的 [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML) 中
- [基于每个请求](https://javascript.info/fetch-api#referrer-referrerpolicy)，来源于 JavaScript

您可以为不同的页面、请求或元素设置不同的政策。

HTTP 标头和元元素都是页面级的。确定一个元素的有效政策时的优先顺序是：

1. 元素级政策
2. 页面级政策
3. 浏览器默认

**示例：**

`index.html` ：

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

图像请求将使用`no-referrer-when-downgrade`政策，而来自该页面的所有其他子资源请求将遵循`strict-origin-when-cross-origin`政策。

## 如何查看引荐来源政策？

通过 [securityheaders.com](https://securityheaders.com/) 可以方便地确定某个特定站点或页面正在使用的政策。

您还可以使用 Chrome、Edge 或 Firefox 的开发者工具查看用于特定请求的引荐来源政策。在撰写本文时，Safari 未显示`Referrer-Policy`标头，但会显示已发送的`Referer`。

<figure class="w-figure">{% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="Chrome 开发者工具的网络面板截图，显示了引荐来源和引荐来源政策。", width="800", height="416" %}<figcaption class="w-figcaption"> Chrome 开发者工具，<b>网络面板</b>中已选中一条请求。</figcaption></figure>

## 您应该为您的网站设置哪种政策？

概述：显式设置隐私增强政策，例如`strict-origin-when-cross-origin`（或更严格的政策）。

### 为什么要"显式"？

在未设置引荐来源政策的情况下将使用浏览器的默认政策。事实上，网站通常会遵循浏览器的默认政策，但这并不理想，因为：

- 取决于浏览器和模式（私密/无痕），其默认政策通常是`no-referrer-when-downgrade`、`strict-origin-when-cross-origin`，或是更严格的政策。因此，您的网站在不同浏览器中的行为将无法预测。
- 浏览器正在逐步采用更严格的默认政策，例如`strict-origin-when-cross-origin`，以及针对跨域请求的机制，例如[引荐来源修剪](https://github.com/privacycg/proposals/issues/13)。在浏览器的默认政策更改之前显式选择加入隐私增强政策可以让您掌握控制权，并帮助您按照您认为合适的方式运行测试。

### 为什么要用`strict-origin-when-cross-origin`（或更严格的政策）？

您需要一个安全的、增强隐私且有用的政策，其中，"有用"的含义取决于您对引荐来源的需求：

- **安全**：如果您的网站使用 HTTPS（[如果还未使用，请优先考虑迁移](/why-https-matters/)），则要杜绝网站的 URL 在非 HTTPS 请求中泄露。由于网络上的任何人都可以看到这些，这就会使您的用户面临中间人攻击。`no-referrer-when-downgrade`、`strict-origin-when-cross-origin`、`no-referrer`和`strict-origin`政策解决了这个问题。
- **隐私增强**：对于跨域请求，`no-referrer-when-downgrade`会共享完整的 URL，因此并不能增强隐私。`strict-origin-when-cross-origin`和`strict-origin`只共享域，而`no-referrer`完全不共享任何信息。您因此可以将`strict-origin-when-cross-origin`、`strict-origin`和`no-referrer`作为隐私增强的选项。
- **有用**：`no-referrer`和`strict-origin`永远不会共享完整的 URL，即使对于同域请求也不例外，所以如果您对此有需求， 那么`strict-origin-when-cross-origin`是更好的选择。

所有这些都表明**`strict-origin-when-cross-origin`**通常是一个明智的选择。

**示例：设置一个`strict-origin-when-cross-origin`政策：**

`index.html` ：

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

或服务端，例如在 Express 中：

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### 如果`strict-origin-when-cross-origin`（或更严格的政策）不适用于您所有的用例怎么办？

在这种情况下，采取**渐进式方法**：为您的网站设置一个保护性政策，例如`strict-origin-when-cross-origin`，如果有进一步需要，为特定请求或 HTML 元素设置一个更宽松的政策。

### 示例：元素级政策

`index.html` ：

```html/6
<head>
  <!-- document-level policy: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- policy on this <a> element: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

请注意，Safari/WebKit 可能会限制[跨站](/same-site-same-origin/#same-site-cross-site)请求的`document.referrer`或`Referer`标头。查看[详情](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)。

### 示例：请求级政策

`script.js` ：

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### 您还应该考虑什么？

您的政策应该取决于您的网站和用例，而这又取决于您、您的团队和您的公司。如果某些 URL 包含识别或敏感数据，请设置一个保护性政策。

{% Aside 'warning' %}对您来说或许不敏感的数据可能对您的用户来说是敏感数据，或者是他们根本不想或未预计到会不知不觉地跨域泄漏的数据。{% endAside %}

## 使用传入请求中的引荐来源：最佳实践

### 如果您的网站功能使用传入请求的引荐来源 URL 怎么办？

#### 保护用户数据

`Referer`可能包含私密数据、个人数据或识别数据，因此请确保您对此类数据采用相应的对待方式。

#### 请记住，您收到的`Referer`可能会发生改变

使用传入跨域请求中的引荐来源有一些限制：

- 如果您无法控制请求发射器的执行情况，就不能对您收到的`Referer`标头（和`document.referrer`）做出假设。请求发射器可以随时决定切换到`no-referrer`政策，或者在更普遍的情况下切换到比之前更严格的政策，也就意味着您通过`Referer`获得的数据将比以前更少。
- 默认情况下，浏览器会越来越多地使用`strict-origin-when-cross-origin`引荐来源政策。这意味着，如果发送这些请求的网站没有设置政策，您现在可能只会在传入跨域请求中收到域（而不是完整的引荐来源 URL）。
- 浏览器可能会改变`Referer`的管理方式。例如，浏览器在将来可能会决定在跨域子资源请求中始终将引荐来源修剪到域，从而保护用户隐私。
- `Referer`标头（和`document.referrer`）可能包含超出您需要的数据，例如当您只想知道请求是否为跨域时，却收到了完整的 URL。

#### `Referer`的替代方案

如果出现以下情况，您可能需要考虑替代方案：

- 您网站的一项基本功能使用传入跨域请求中的引荐来源 URL；
- 和/或如果您的网站不再接收其在跨域请求中所需的引荐来源 URL 部分。当请求发射器更改了政策或没有设置政策，并且浏览器的默认政策发生了变化（比如在 [Chrome 85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) 中）时，就会发生这种情况。

要定义替代方案，请先分析您正在使用引荐来源的哪一部分。

**如果您只需要域（`https://site-one.example`）：**

- 如果您在对页面有顶级访问权限的脚本中使用引荐来源，那么`window.location.origin`是一种替代方案。
- 在可用的情况下，如[`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin)和[`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site)这样的标头可以为您提供`Origin`或描述请求是否为跨域，这可能正是您所需要的。

**如果您需要 URL 的其他元素（路径、查询参数……）：**

- 请求参数或许适用于您的用例，而且可以为您省去解析引荐来源带来的工作。
- 如果您在对页面有顶级访问权限的脚本中使用引荐来源，那么`window.location.pathname`是一种替代方案。仅提取 URL 的路径部分并将其作为参数传递，这样就不会传递 URL 参数中的任何潜在敏感信息。

**如果您不能使用上述替代方案：**

- 检查您的系统是否可以更改为期望请求发射器（`site-one.example`）在某种配置下显式设置您需要的信息。优点：更明确、对`site-one.example`用户来说更保护隐私、更利于将来。缺点：可能会为您或您的系统用户带来更多的工作。
- 检查发出请求的网站是否同意为每个元素或每个请求设置`no-referrer-when-downgrade`引荐来源政策。缺点：对`site-one.example`用户的隐私保护可能较弱、可能并非所有浏览器都支持。

### 跨站请求伪造 (CSRF) 保护

请注意，请求发射器始终可以通过设置一个`no-referrer`政策来决定不发送引荐来源（恶意行为者甚至可以伪造引荐来源）。

将 [CSRF 令牌](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)作为您的主要保护措施。要想获得额外保护，请使用[SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites)，同时使用诸如[`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin)（可用于 POST 和 CORS 请求）和[`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site)（如果可用）这样的标头，而不是`Referer`。

### 日志记录

请确保可能在`Refer`中的用户的个人数据或敏感数据得到保护。

如果您只使用域，请检查[`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin)标头是否可以作为替代方案。在调试方面，这可能会以更简单的方式为您提供所需信息，而无需解析引荐来源。

### 付款

付款服务提供商可能会依赖传入请求中的`Referer`标头来进行安全检查。

例如：

- 用户单击`online-shop.example/cart/checkout`上的**购买**按钮。
- `online-shop.example`重定向到`payment-provider.example`来管理交易。
- `payment-provider.example`对照商家设置的`Referer`准许值列表检查该请求的`Referer`。如果在列表中未找到任何匹配条目，则`payment-provider.example`拒绝该请求。如果有匹配条目，则用户可以继续进行交易。

#### 支付流程安全检查的最佳实践

**概述：作为付款提供商，您可以将`Referer`作为针对朴素攻击的基本检查，但您一定需要有另一种更可靠的验证方法。**

单独的`Referer`标头并不是一个可靠的检查依据：请求网站无论是否是合法商家，都可以设置一个`no-referrer`政策，这将使付款提供商无法获取`Referer`信息。但是，作为付款提供商，查看`Referer`可能会帮助您发现未设置`no-referrer`政策的朴素攻击者。因此，您可以使用`Referer`作为第一层基本检查。如果您这样做：

- **不要期望`Referer`总是存在。如果`Referer`存在，那么只检查其至少会包括的那部分数据：域**。在设置`Refer`准许值列表时，要确保不包括任何路径，只包括域。例如：`online-shop.example`的`Refer`准许值应该是`online-shop.example`，而不是`online-shop.example/cart/checkout`。为什么？因为通过对根本没有`Refer`或者一个是请求网站的域的`Refer`值作出期望，您可以防止意外错误，因为您既**没有对**商家设置的**`Referrer-Policy`做出假设**，也没有对商家未设置政策情况下的浏览器行为做出假设。网站和浏览器都可以将传入请求中的`Referer`剥离出来，只保留域，或者根本不发送`Referer`。
- 如果`Referer`不存在，或者其存在并且您的基本`Referer`域检查成功：您可以继续使用其他更可靠的验证方法（见下文）。

**有哪些更可靠的验证方法？**

一种可靠的验证方法是让请求者**将请求参数**与唯一密钥一起**散列**。作为付款提供商，您接下来可以**自己对相同的散列进行计算**，并且仅在请求与您的计算匹配时才接受。

**当一个没有引荐来源政策的 HTTP 商家网站重定向到一个 HTTPS 付款服务提供商时，`Referer`会发生什么？**

在向 HTTPS 付款提供商发出的请求中不会看到`Referer`，因为当网站没有设置政策时，[大多数浏览器](#default-referrer-policies-in-browsers)默认使用`strict-origin-when-cross-origin`或`no-referrer-when-downgrade`。另请注意，[Chrome 对新默认政策的更改](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)不会改变此行为。

{% Aside %}

如果您的网站使用 HTTP，请[迁移到 HTTPS](/why-https-matters/)。

{% endAside %}

## 结论

一个保护性的引荐来源政策是为您的用户提供更多隐私保护的好方法。

如需了解不同用户保护技术的更多相关信息，请查看 web.dev 的[安全和保障](/secure/)系列！

*非常感谢所有审稿人的贡献和反馈：特别是 Kaustubha Govind、David Van Cleve、Mike West、Sam Dutton、Rowan Merewood、Jxck 和 Kayce Basques。*

## 资源

- [理解"同站"和"同域"](/same-site-same-origin/)
- [新的安全标头：引荐来源政策 (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [MDN 上的引荐来源政策](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- [引荐来源标头：MDN 上的隐私和安全问题](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Chrome 更改：Blink 引擎有意向实现](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Chrome 更改：Blink 引擎有意向运送](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Chrome 更改：状态条目](https://www.chromestatus.com/feature/6251880185331712)
- [Chrome 更改：85 测试版博文](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [引荐来源修剪 GitHub 线程：不同浏览器的做法](https://github.com/privacycg/proposals/issues/13)
- [引荐来源政策规范](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)

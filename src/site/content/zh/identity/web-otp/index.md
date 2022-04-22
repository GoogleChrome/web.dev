---
layout: post
title: 使用 WebOTP API 验证网络上的电话号码
subhead: 帮助通过短信收到 OTP 的用户
authors:
  - agektmr
date: 2019-10-07
updated: 2021-06-04
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: 一幅一位女性使用 OTP 登录 Web 应用程序的图片。
description: 查找、记忆和输入通过短信发送的 OTP 很麻烦。WebOTP API 为用户简化了 OTP 工作流程。
tags:
  - identity
  - capabilities
feedback:
  - api
---

{% Aside 'gotchas' %}如果您想了解更多一般短信 OTP 表单最佳实践，包括 WebOTP API，请查看[短信 OTP 表单最佳实践](/sms-otp-form)。{% endAside %}

## 什么是 WebOTP API？

当今世界，大多数人都有一部移动设备，开发人员通常使用电话号码作为其服务用户的身份标识。

验证电话号码的方法有多种，但通过短信发送的随机生成的一次性密码 (OTP) 是最常见的方法之一。将此代码发回开发人员的服务器即表明对该电话号码拥有控制权。

这一想法已经部署在很多场景中来实现以下用途：

- **电话号码作为用户的身份标识。**注册新服务时，某些网站会要求提供电话号码而不是电子邮件地址，并将其用作帐户标识。
- **两步验证。**登录时，除密码或其他知识因素外，网站还会要求提供通过短信发送的一次性代码，以提高安全性。
- **支付确认。**当用户进行付款时，要求提供通过短信发送的一次性代码可以帮助核实用户的意图。

目前的流程给用户带来了一些麻烦。在短信消息中找到 OTP，然后将其复制并粘贴到表单中非常烦琐，会降低关键用户旅程的转化率。解决这一问题一直是许多全球知名开发商对网络的长期要求。Android 有[一个 API 可以做到这一点](https://developers.google.com/identity/sms-retriever/)。[iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow) 和 [Safari](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element) 也能做到。

WebOTP API 允许您的应用程序接收绑定到您应用程序域的特殊格式的消息。因此，您可以通过编程方式从短信消息中获取 OTP，并更轻松地为用户验证电话号码。

{% Aside 'warning' %}攻击者可以伪造短信并窃取他人的电话号码。运营商也可以在帐户注销后回收电话号码出售给新用户。虽然短信 OTP 可在上述用例中验证电话号码，但我们建议使用其他更强的身份验证形式（例如多重因素和 [Web 身份验证 API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API)）为这些用户建立新会话。{% endAside %}

## 实现方式

假设某位用户想要在网站上验证自己的电话号码。该网站通过短信向用户发送短信，用户输入短信中的 OTP 来验证电话号码的所有权。

如视频中所示，使用 WebOTP API 后，只需用户轻轻一按即可实现这些步骤。收到短信时，手机底部会弹出一个表单提示用户验证电话号码。单击底部表单上的**验证**按钮后，浏览器会将 OTP 粘贴到表单中，用户无需按**继续**即可提交表单。

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.webm" type="video/webm"></source></source></video>

整个过程如下图所示。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %} <figcaption> WebOTP API 图</figcaption></figure>

尝试一下[演示](https://web-otp.glitch.me)中的操作。它不会询问您的电话号码或向您的设备发送短信，但您可以复制演示中显示的文本，从另一台设备发送短信。可以这样操作是因为在使用 WebOTP API 时发送方是谁并不重要。

1. 在 Android 设备上的 Chrome 84 或更高版本中转到 [https://web-otp.glitch.me](https://web-otp.glitch.me)。
2. 从另一部手机向您的手机发送以下短信。

```text
Your OTP is: 123456.

@web-otp.glitch.me #12345
```

收到短信后看到提醒您在输入区输入代码的提示了吗？这就是 WebOTP API 为用户工作的方式。

{% Aside 'gotchas' %}

如果该对话框没有出现，请查看[常见问题解答](#no-dialog)。

{% endAside %}

使用 WebOTP API 包括三个部分：

- 正确注释的 `<input>` 标签
- Web 应用程序中的 JavaScript
- 通过短信发送的固定格式消息文本。

首先来介绍 `<input>` 标签。

## 为 `<input>` 标签加注释

WebOTP 本身无需任何 HTML 注释即可工作，但为了跨浏览器兼容性，强烈建议您将 `autocomplete="one-time-code"` 添加到您希望用户输入 OTP 的 `<input>` 标签中。

这样可以使 Safari 14 或更高版本建议用户在收到具有[设置短信格式](#format)中所述格式的短信时，使用 OTP 自动填充 `<input>` 字段，即使它不支持 WebOTP。

{% Label %}HTML{% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## 使用 WebOTP API

WebOTP 非常简单，只需复制并粘贴下方的代码即可。不过，我对此过程进行说明。

{% Label %}JavaScript{% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

### 功能检测

功能检测与许多其他 API 相同。监听 `DOMContentLoaded` 事件将等待 DOM 树准备好后再开始查询。

{% Label %}JavaScript{% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    …
    const form = input.closest('form');
    …
  });
}
```

{% Aside 'caution' %}

WebOTP API 需要安全来源 (HTTPS)。HTTP 网站上的功能检测将失败。

{% endAside %}

### 处理 OTP

WebOTP API 本身很简单。使用 [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get) 获取 OTP。WebOTP 向该方法添加了一个新的 `otp` 选项。它只有一个属性：`transport` ，其值必须是一个包含字符串 `'sms'` 的数组。

{% Label %}JavaScript{% endLabel %}

```js/1-2
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
    …
```

当 SMS 消息到达时，会触发浏览器的权限流。如果授予权限，则返回的承诺将使用 `OTPCredential` 对象进行解析。

{% Label %}获取的 `OTPCredential` 对象的内容{% endLabel %}

```json
{
  code: "123456" // 获取的 OTP
  type: "otp"  // `type` 始终为 "otp"
}
```

接下来，将 OTP 值传递给 `<input>` 字段。直接提交表单将省去需要用户点击按钮的步骤。

{% Label %}JavaScript{% endLabel %}

```js/5-6
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.error(err);
    });
    …
```

### 中止消息 {: #aborting }

如果用户手动输入 OTP 并提交表单，您可以在 [`options` 对象](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get#Parameters)中使用 `AbortController` 实例取消 `get()` 调用。

{% Label %} JavaScript {% endLabel %}

```js/1,5,11
    …
    const ac = new AbortController();
    …
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    …
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
    …
```

## 设置短信格式 {: #format }

API 本身看起来很简单，但在使用它之前，您需要了解一些注意事项。短信必须在调用 `navigator.credentials.get()` 之后发送，并且必须在调用 `get()` 的设备上接收。最后，短信必须遵循以下格式：

- 短信以人类可读文本开头（可选），包含一个 4 到 10 个字符的字母数字字符串，其中至少有一个数字，最后一行用于 URL 和 OTP。
- 调用 API 的网站 URL 的域部分必须以 `@` 开头。
- URL 必须包含一个井号 ('`#`')，后跟 OTP。

例如：

```text
Your OTP is: 123456.

@www.example.com #123456
```

以下是错误示例：

格式错误的短信文本示例 | 错误原因
--- | ---
`Here is your code for @example.com #123456` | 最后一行的第一个字符应为 `@`。
`Your code for @example.com is #123456` | 最后一行的第一个字符应为 `@`。
`Your verification code is 123456`<br><br>`@example.com\t#123456` | `@host` 和 `#code` 之间应该有一个空格。
`Your verification code is 123456`<br><br>`@example.com`<code>  </code>`#123456` | `@host` 和 `#code` 之间应该有一个空格。
`Your verification code is 123456`<br><br>`@ftp://example.com #123456` | 不能包含 URL 方案。
`Your verification code is 123456`<br><br>`@https://example.com #123456` | 不能包含 URL 方案。
`Your verification code is 123456`<br><br>`@example.com:8080 #123456` | 不能包含端口。
`Your verification code is 123456`<br><br>`@example.com/foobar #123456` | 不能包含路径。
`Your verification code is 123456`<br><br>`@example .com #123456` | 域中不能有空格。
`Your verification code is 123456`<br><br>`@domain-forbiden-chars-#%/:<>?@[] #123456` | 域中不能有[禁用字符](https://url.spec.whatwg.org/#forbidden-host-code-point)。
`@example.com #123456`<br><br>`Mambo Jumbo` | `@host` 和 `#code` 应该是最后一行。
`@example.com #123456`<br><br>`App hash #oudf08lkjsdf834` | `@host` 和 `#code` 应该是最后一行。
`Your verification code is 123456`<br><br>`@example.com 123456` | 缺少 `#`。
`Your verification code is 123456`<br><br>`example.com #123456` | 缺少 `@`。
`Hi mom, did you receive my last text` | 缺少 `@` 和 `#`。

## 演示

在演示中尝试各种消息：[https://web-otp.glitch.me](https://web-otp.glitch.me)

您也可以拆分演示，创建您自己的版本：[https://glitch.com/edit/#!/web-otp](https://glitch.com/edit/#!/web-otp)。

{% Glitch { id: 'web-otp', path: 'views/index.html', previewSize: 0, allow: [] } %}

## 使用跨域 iframe 中的 WebOTP

在跨域 iframe 中输入短信 OTP 通常用于支付确认，尤其是 3D Secure。WebOTP API 拥有支持跨域 iframe 的通用格式，提供绑定到嵌套源的 OTP。例如：

- 用户访问 `shop.example` 使用信用卡购买一双鞋。
- 输入信用卡号后，融合支付提供商会在 iframe 中显示一个来自 `bank.example` 的表单，要求用户验证其电话号码以便快速结账。
- `bank.example` 向用户发送一条包含 OTP 的 短信，以便用户输入 OTP 来验证身份。

要在跨域 iframe 中使用 WebOTP API，您需要完成两项任务：

- 为短信文本消息中的 top-frame 原点和 iframe 原点添加注释。
- 配置权限策略，允许跨域 iframe 直接从用户处接收 OTP。

<figure>{% Video src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4", autoplay="true", controls="true", loop="true", muted="true", preload="auto", width="300", height="600" %} <figcaption>iframe 中的 WebOTP API 实例。</figcaption></figure>

您可以尝试 [https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io) 中的演示。

### 为短信文本消息的 bound-origin 添加注释

从 iframe 内部调用 WebOTP API 时，短信文本消息必须包含以  `@` 开头的 top-frame 原点后跟以 `#` 开头的 OTP，最后一行是以 `@` 开头的 iframe 原点。

```text
Your verification code is 123456

@shop.example #123456 @bank.exmple
```

### 配置权限策略

要在跨域 iframe 中使用 WebOTP，嵌入程序必须通过 otp-credentials [权限策略](https://www.w3.org/TR/permissions-policy-1)授予对该 API 的访问权限，以避免出现意外行为。一般来说，实现这一目标有两种方法：

{% Label %}通过 HTTP 标头：{% endLabel %}

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

{% Label %}通过 iframe `allow` 属性：{% endLabel %}

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

查看[有关如何指定权限策略的更多示例](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)。

{% Aside %}

目前，Chrome 仅支持来自跨域 iframe 的 WebOTP API 调用，这些 iframe 在其祖先链中**只有一个**唯一来源。在以下场景中：

- `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `b.com`
- `a.com` -&gt; `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `c.com`

支持在 `b.com` 中使用 WebOTP，但不支持在 `c.com` 中使用它。

请注意，由于缺乏需求和 UX 复杂性，也不支持以下场景。

- `a.com` -&gt; `b.com` -&gt; `a.com`（调用 WebOTP API）

{% endAside %}

## 常见问题解答

### 我发送了格式正确的消息，但对话框没有出现。这是怎么回事？{: #no-dialog}

测试 API 时有几个注意事项：

- 如果发送方的电话号码在接收方的联系人列表中，则由于底层[短信用户同意 API](https://developers.google.com/identity/sms-retriever/user-consent/request#2_start_listening_for_incoming_messages) 的设计，不会触发此 API。
- 如果您在 Android 设备上使用工作号码而 WebOTP 不起作用，请尝试在您的个人号码（即您接收短信的号码）上安装和使用 Chrome。

再次查阅[格式](#format)，查看您的短信格式是否正确。

### 这个 API 在不同浏览器之间兼容吗？

Chromium 和 WebKit 就 [短信文本消息格式](https://wicg.github.io/sms-one-time-codes)达成一致， [Apple 宣布 Safari 从 iOS 14 和 macOS Big Sur 开始支持](https://developer.apple.com/news/?id=z0i801mg)该 API。尽管 Safari 不支持 WebOTP JavaScript API，但通过使用 `autocomplete=["one-time-code"]` 注释 `input` 元素，如果短信消息符合格式，默认键盘会自动建议您输入 OTP。

### 使用短信作为身份验证方式是否安全？

虽然短信 OTP 可用于在首次提供电话号码时验证电话号码，但通过短信进行电话号码验证以重新进行身份验证时必须谨慎，因为电话号码可能会被运营商窃取和回收。WebOTP 是一种方便的重新认证和恢复机制，但服务应该将它与其他因素结合起来，例如知识挑战，或者使用 [Web 身份验证 API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) 进行强身份验证。

### 在哪里报告 Chrome 实现中的错误？

您是否发现了 Chrome 实现的错误？

- 在 [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESMS) 中提交错误。尽可能包括更多的详细信息，再现错误的简单说明，并将**组件**设置为 `Blink>WebOTP`。

### 如何帮助此功能？

您打算使用 WebOTP API 吗？您的公开支持可以帮助我们设置各项功能的优先级，并向其他浏览器供应商展示支持它们的重要性。使用主题标签  [<code>#WebOTP</code>](https://twitter.com/chromiumdev) 向 <a>@ChromiumDev</a> 发送推文，让我们知道您在何处以及如何使用它。

{% Aside %}您可以在[说明文档的常见问题解答部分](https://github.com/WICG/WebOTP/blob/master/FAQ.md)找到更多问题。{% endAside %}

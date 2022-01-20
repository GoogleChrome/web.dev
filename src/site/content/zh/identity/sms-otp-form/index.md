---
layout: post
title: SMS OTP 表单最佳实践
subhead: 了解如何优化 SMS OTP 表单并改善用户体验。
authors:
  - agektmr
date: 2020-12-09
updated: 2020-12-09
hero: image/admin/J3XT84NDBPLlsRN0PhLl.jpg
alt: 霓虹聊天气泡标志。
description: 要求用户提供通过 SMS 发送的 OTP（一次性密码）是一种确认用户电话号码的常用方法。本文为您提供构建具有出色用户体验的 SMS OTP 表单的最佳实践。
tags:
  - identity
  - security
  - forms
---

{% YouTube 'sU4MpWYrGSI' %}

要求用户提供通过 SMS 发送的 OTP（一次性密码）是确认用户电话号码的常用方法。以下列出了几个 SMS OTP 用例：

- **双重身份验证。**除了用户名和密码之外，SMS OTP 还可以用作强烈信号，表明该帐户归属于收到 SMS OTP 的人所有。
- **电话号码验证。**某些服务使用电话号码作为用户的主要标识符。在此类服务中，用户可以输入他们的电话号码和通过短信收到的 OTP 来证明他们的身份。有时它与 PIN 结合构成双重身份验证。
- **帐户恢复。**当用户无法访问其帐户时，需要有一种方法来恢复。向他们注册的电子邮件地址发送电子邮件或向他们的电话号码发送 SMS OTP 是常见的帐户恢复方法。
- **支付确认。**在支付系统中，一些银行或信用卡发卡机构出于安全原因要求付款人进行额外的验证。SMS OTP 通常用于此目的。

本文阐述了为上述用例构建 SMS OTP 表单的最佳实践。

{% Aside 'caution' %}虽然本文讨论了 SMS OTP 表单的最佳实践，但请注意，SMS OTP 本身并不是最安全的身份验证方法，因为电话号码可能会被回收，有时甚至会被劫持。并且 [OTP 的概念本身并不防钓鱼](https://youtu.be/kGGMgEfSzMw?t=1133)。

如果您正在寻求更安全的方法，请考虑使用 [WebAuthn](https://www.w3.org/TR/webauthn-2/)。您可从 2019 年 Chrome 开发者峰会上的演讲[“注册和登录的新功能”](https://goo.gle/webauthn-video)中了解更多相关信息，并通过[“构建您的第一个 WebAuthn 应用”](https://goo.gle/WebAuthnReauthCodelab)代码实验室使用生物识别传感器构建双重身份验证体验。 {% endAside %}

## 清单

要通过 SMS OTP 提供最佳用户体验，请执行以下步骤：

- 将 `<input>` 元素用于：
    - `type="text"`
    - `inputmode="numeric"`
    - `autocomplete="one-time-code"`
- 将 `@BOUND_DOMAIN #OTP_CODE` 用作 OTP SMS 消息的最后一行。
- 使用 [WebOTP API](/web-otp/)。

## 使用 `<input>` 元素

使用含 `<input>` 元素的表单是您可以遵循的最重要的最佳实践，因为它适用于所有的浏览器。即使本文中的其他建议在某些浏览器中不起作用，用户仍然可以手动输入并提交 OTP。

```html
<form action="/verify-otp" method="POST">
  <input type="text"
         inputmode="numeric"
         autocomplete="one-time-code"
         pattern="\d{6}"
         required>
</form>
```

以下是确保输入字段充分利用浏览器功能的一些想法。

### `type="text"`

由于 OTP 通常是五位或六位数字，因此对输入字段使用 `type="number"` 可能看起来很直观，因为它会将移动键盘更改为全数字。不推荐这样做，因为浏览器希望输入字段是可数的而不是多个数字的序列，这可能会导致意外行为。使用 `type="number"` 会导致在输入字段旁边显示向上和向下按钮；按这些按钮会增加或减少数字，并可能删除前面的零。

请改用 `type="text"`。这不会将移动键盘转换为全数字，这样较好，因为使用 `inputmode="numeric"` 的下一个技巧可以完成这项工作。

### `inputmode="numeric"`

使用 [`inputmode="numeric"`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode) 将移动键盘更改为全数字。

一些网站将 `type="tel"` 用于 OTP 输入字段，因为它也会在聚焦时将移动键盘转换为全数字（包括 `*` 和 `#`)。这早在 `inputmode="numeric"` 还没有得到广泛支持时就得到了应用。由于 <a href="https://github.com/mdn/browser-compat-data/pull/6782" data-md-type="link">Firefox 开始支持 `inputmode="numeric"`</a> ，因此无需使用语义不正确的 `type="tel"`。

### `autocomplete="one-time-code"`

[`autocomplete`](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) 属性允许开发人员指定浏览器提供自动填充协助的权限，并通知浏览器该字段中预期的信息类型。

借助 `autocomplete="one-time-code"`，当用户在表单打开期间收到 SMS 消息时，操作系统将试探性地解析 SMS 中的 OTP，并且键盘会建议用户输入的 OTP。它仅适用于 iOS、iPadOS 和 macOS 上的 Safari 12 及更高版本，但我们强烈建议使用它，因为它是改善这些平台上 SMS OTP 体验的简单方法。

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>`autocomplete="one-time-code"` 正在运行。</figcaption></figure>

`autocomplete="one-time-code"` 改善了用户体验，但通过[确保 SMS 消息符合源绑定消息格式，](#format)您还可以做更多的事情。

{% Aside %} 可选属性：

- [`pattern`](https://developer.mozilla.org/docs/Web/HTML/Attributes/pattern) 指定输入的 OTP 必须匹配的格式。使用正则表达式指定匹配模式，例如，`\d{6}` 将 OTP 限制为六位字符串。请在[使用 JavaScript 进行更复杂的实时验证] (https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation) 中了解有关 `pattern` 属性的更多信息

- [`required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required) 表示一个字段为必填字段。

对于更一般的表单最佳实践，[Sam Dutton](/authors/samdutton/) 发表的[登录表单最佳实践](/sign-in-form-best-practices/)是很好的入门指南。 {% endAside %}

## 格式化 SMS 文本 {: #format }

遵循[通过 SMS 发送的源绑定的一次性代码](https://wicg.github.io/sms-one-time-codes/)规范，可以增强用户输入 OTP 的体验。

格式规则很简单：接收域以 @ 开头，OTP 以 # 开头，以此完成 SMS 消息。

例如：

```text
Your OTP is 123456

@web-otp.glitch.me #123456
```

使用 OTP 消息的标准格式可以更轻松、更可靠地从中提取代码。将 OTP 代码与网站相关联使诱骗用户向恶意网站提供代码变得更加困难。

{% Aside %} 确切的规则是：

- 消息以（可选）人们可读的文本开头，其中包含四到十个字符的字母数字字符串和至少一个数字，最后一行为 URL 和 OTP。
- 调用 API 的网站网址的域部分必须以 `@` 开头。
- URL 必须包含一个井号（“`#`”），后跟 OTP。

确保字符总数不超过 140。

要了解有关 Chrome 特定规则的更多信息，请阅读[格式化 WebOTP API 的 SMS 消息部分](/web-otp/#format)帖文。 {% endAside %}

使用这种格式有几个好处：

- OTP 将绑定到域。如果用户所在的域不是 SMS 消息中指定的域，则不会出现 OTP 建议。这也降低了网络钓鱼攻击和潜在帐户劫持的风险。
- 浏览器现在将能够可靠地提取 OTP，而无需依赖神秘和不稳定的启发式方法。

当网站使用 `autocomplete="one-time-code"` ，iOS 14 或更高版本的 Safari 将按照上述规则建议 OTP。

{% Aside %}如果用户在 macOS Big Sur 的桌面上使用与 iOS 上相同的 iCloud 帐户设置，则在 iOS 设备上收到的 OTP 也将在桌面 Safari 上可用。

要了解有关 Apple 平台可用性的其他好处和细微差别的更多信息，请阅读[使用域绑定代码增强 SMS 发送的代码安全性](https://developer.apple.com/news/?id=z0i801mg)。 {% endAside %}

这种 SMS 消息格式也有利于 Safari 以外的浏览器。Chrome、Opera 和 Android 上的 Vivaldi 也支持使用 WebOTP API 的源绑定一次性代码规则，但不是通过 `autocomplete="one-time-code"` 。

## 使用 WebOTP API

[WebOTP API](https://wicg.github.io/web-otp/) 提供对在 SMS 消息中收到的 OTP 的访问。通过调用 `otp` 类型 (`OTPCredential`) 的 [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get)   ( 其中 `transport` 包含 `sms`），网站将等待符合源绑定一次性代码的 SMS 发送以及用户授予的访问权限。将 OTP 发送给 JavaScript 后，网站可以在表单中使用它或将其直接发布到服务器。

{% Aside 'caution' %}WebOTP API 需要安全来源 (HTTPS)。 {% endAside %}

```js
navigator.credentials.get({
  otp: {transport:['sms']}
})
.then(otp => input.value = otp.code);
```

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>运行中的 WebOTP API。</figcaption></figure>

请参阅[使用 WebOTP API 验证 Web 上的电话号码](/web-otp/)以详细了解如何使用 WebOTP API，或复制并粘贴以下代码段。（确保 `<form>` 元素正确设置了 `action` 和 `method` 属性。）

```js
// Feature detection
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    // Cancel the WebOTP API if the form is submitted manually.
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        // Cancel the WebOTP API.
        ac.abort();
      });
    }
    // Invoke the WebOTP API
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      // Automatically submit the form when an OTP is obtained.
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

照片作者：[Jason Leung](https://unsplash.com/photos/mZNRsYE9Qi4)，来源：[Unsplash](https://unsplash.com)。

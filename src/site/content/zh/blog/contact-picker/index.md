---
layout: post
title: Web 联系人选取器
subhead: Contact Picker API 为用户提供了一种从他们的联系人列表中共享联系人的简单方法。
authors:
  - petelepage
description: "（几乎）自从出现以来，访问用户的联系人一直是 iOS/Android 应用的功能之一。 Contact Picker API 是一个按需运行的 API，允许用户从他们的联系人列表中选择一个或多个条目，并与网站共享所选联系人的有限详细信息。它允许用户在需要的时候只分享他们想分享的内容，并让用户更容易联系到他们的朋友和家人。"
date: 2019-08-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
hero: image/admin/K1IN7zWIjFLjZzJ4Us3J.jpg
alt: 在黄色背景上的电话。
feedback:
  - api
---

## 什么是 Contact Picker API? {: #what }？

&lt;style&gt; #video-demo { max-height: 600px; } &lt;/style&gt;

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZYR1SBlPglRDE69Xt2xl.mp4", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RbG1WcYhSLn0MQoQjZe.webm"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rif9Fh8w8SR78PcVXCO1.jpg", loop=true, autoplay=true, muted=true, linkTo=true, id="video-demo", playsinline=true %}</figure>

（几乎）自从出现以来，在移动设备上访问用户的联系人一直是 iOS/Android 应用的功能之一。这是我从 Web 开发人员那里听到的最常见的功能请求之一，并且通常是他们构建 iOS/Android 应用的关键原因。

Android 的 Chrome 80 提供了一个按需访问的 [Contact Picker API](https://wicg.github.io/contact-api/spec/)，它可以使用户从联系人列表中选择条目，并与网站共享所选条目的有限详细信息。它允许用户在需要的时候只分享他们想分享的内容，并让用户更容易联系到他们的朋友和家人。

例如，基于 Web 的电子邮件客户端可以使用 Contact Picker API 来选择电子邮件的收件人。 IP 语音应用可以查找要呼叫的电话号码。社交网络也可以帮助用户发现哪些朋友已经加入了该网络。

{% Aside 'caution' %}Chrome 团队在 Contact Picker API 的设计和实现中花费了大量精力，以确保浏览器只分享人们选择的内容。请参阅下面的[安全和隐私](#security-considerations)部分。 {% endAside %}

## 当前状态 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">步骤</th>
<th data-md-type="table_cell">状态</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 创建解释文档</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/contact-api/" data-md-type="link">已完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 创建规范初稿</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">已完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 收集反馈并对设计进行迭代</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">已完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 极早期试验</td>
<td data-md-type="table_cell">已完成</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. 发布</strong></td>
<td data-md-type="table_cell">
<strong data-md-type="double_emphasis">Chrome 80</strong><br> 仅在 Android 上提供。</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 使用 Contact Picker API {: #how-to-use }

Contact Picker API 需要使用一个带有 options 参数的方法调用，该参数会指定您需要的联系信息类型。第二个方法会告诉您底层系统将提供哪些信息。

{% Aside %} 查看 [Contact Picker API 演示](https://contact-picker.glitch.me)并查看[源代码](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)。 {% endAside %}

### 功能检测

要检查是否支持 Contact Picker API，请使用：

```js
const supported = ('contacts' in navigator && 'ContactsManager' in window);
```

此外，在 Android 上，联系人选取器需要 Android M 或更高版本。

### 打开联系人选取器

Contact Picker API 的入口点是 `navigator.contacts.select()` 。在被调用时，它返回一个 promise 并显示联系人选取器，允许用户选择他们想要与网站共享的联系人。选择要共享的内容并单击**完成**，promise 就会解析用户选择的一组联系人。

在调用 `select()` 时，您必须提供作为第一参数返回的属性数组（值可以是 `'name'`、`'email'`、`'tel'`、`'address'` 或 `'icon'` ） ，以及是否可以选择多个联系人作为第二个参数。

```js
const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Handle any errors here.
}
```

{% Aside 'caution' %}对 `'address'` 和 `'icon'` 的支持需要 Chrome 84 或更高版本。 {% endAside %}

联系人选取器 API 只能从[安全的](https://w3c.github.io/webappsec-secure-contexts/)顶级浏览上下文中调用，而且与其他功能强大的 API 一样，它需要用户手势。

### 检测可用属性

要检测哪些属性可用，请调用 `navigator.contacts.getProperties()` 。它会返回一个使用字符串数组解析的 promise，表明哪些属性可用。例如：`['name', 'email', 'tel', 'address']` 。您可以将这些值传递给 `select()` 。

请记住，属性并不总是可用的，并且可能会添加新的属性。今后其他平台和联系人来源可能会限制共享哪些属性。

### 处理结果

Contact Picker API 返回一组联系人，每个联系人都包含一组请求的属性。如果联系人没有所请求属性的数据，或者用户选择不分享特定的属性，那么 API 将返回一个空数组。（我在[用户控制](#security-control)部分介绍了用户选择属性的方式。）

例如，如果站点请求`name` 、 `email`和`tel` ，并且用户选择一个联系人，该联系人在 name 字段中有数据，提供两个电话号码，但没有电子邮件地址，则返回的响应将是：

```json
[{
  "email": [],
  "name": ["Queen O'Hearts"],
  "tel": ["+1-206-555-1000", "+1-206-555-1111"]
}]
```

{% Aside 'caution' %} 联系人字段上的标签和其他语义信息被丢弃。 {% endAside %}

## 安全和权限  {: #security-considerations }

Chrome 团队在[控制对强大 Web 平台功能的访问](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)一文中介绍了设计和实现 Contact Picker API 的核心原则，包括了用户控制、透明度和用户工效几方面。我会逐一进行解释。

### 用户控制 {: #security-control }

对用户联系人的访问是通过选取器进行的，并且只能在[安全的](https://w3c.github.io/webappsec-secure-contexts/)顶级浏览上下文中通过用户手势进行调用。这可确保网站不会在页面加载时显示选取器，或在没有任何上下文的情况下随机显示选取器。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EiHIOYdno52DZ6TNHcfI.jpg", alt="屏幕截图，用户可以选择分享哪些属性。", width="800", height="639" %}<figcaption>用户可以选择不分享某些属性。在此屏幕截图中，用户已取消选中“电话号码”按钮。即使该网站要求提供电话号码，也不会与该网站分享。</figcaption></figure>

不提供批量选择所有联系人的选项，因此鼓励用户仅选择他们需要为该特定网站分享的联系人。用户还可以通过切换选取器顶部的属性按钮来控制与站点分享哪些属性。

### 透明度 {: #security-transparency }

为清楚地表明共享的联系人详细信息，选取器会始终显示联系人的姓名和图标，以及网站请求的任何属性。例如，如果网站请求`name`、`email`和`tel` ，那么所有三个属性都将显示在选取器中。或者，如果网站仅请求`tel`，那么选取器将仅显示名称和电话号码。

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ig9SBKtJPlSE3mCjR2Go.jpg", alt="请求所有属性的网站选取器的屏幕截图。", width="800", height="639" %}<figcaption>选取器，网站请求<code>name</code>、<code>email</code>和<code>tel</code>，选择了一位联系人。</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vOB2nPSrfi1GnmtitElf.jpg", alt="仅请求电话号码的网站选取器的屏幕截图。", width="800", height="639" %}<figcaption>选择器，网站仅请求<code>tel</code>，选择了一位联系人。</figcaption></figure>
</div>

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLxdnKZwW0e4teyw2OOU.jpg", alt="长按联系人时选取器的屏幕截图。", width="800", height="389" %}<figcaption>长按联系人的结果。</figcaption></figure>

如果联系人被选中，长按联系人将显示将共享的所有信息。（请参阅 Cheshire Cat 联系人图片。）

### 无永久访问权限 {: #security-persistence }

对联系人的访问权限是按需的，而不是永久性的。网站每次想访问时，都必须通过用户手势调用`navigator.contacts.select()` ，并且用户必须单独选择他们想要与网站共享的联系人。

## 反馈意见 {: #feedback }

Chrome 团队想了解您使用 Contact Picker API 的体验。

### 遇到了实现问题？

是否发现了 Chrome 存在实现 bug？或者实现与规范不符？

- 在 [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts) 上提交错误。确保提供尽可能多的详细信息，提供重现该错误的简单说明，并将 *Components* 设置为 `Blink>NFC`。[Glitch](https://glitch.com) 非常适合共享快速简单的重现。

### 打算使用此 API？

您是否打算使用 Contact Picker API？您的公开支持有助于 Chrome 团队确定功能的优先级，并向其他浏览器供应商展示支持这些功能的重要性。

- 请前往 [WICG Discourse 帖子](https://discourse.wicg.io/t/proposal-contact-picker-api/3507)分享您的使用计划。
- 使用[<code>#ContactPicker</code>](https://twitter.com/chromiumdev)<a>标签向@ChromiumDev</a>发送推文，让我们知道您在何处以及如何使用它。

## 实用链接 {: #helpful }

- [公共解释文档](https://github.com/WICG/contact-api/)
- [联系人选取器规范](https://wicg.github.io/contact-api/spec/)
- [Contact Picker API 演示](https://contact-picker.glitch.me)和 [Contact Picker API 演示来源](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)
- [跟踪缺陷](https://bugs.chromium.org/p/chromium/issues/detail?id=860467)
- [ChromeStatus.com 条目](https://www.chromestatus.com/feature/6511327140904960)
- Blink 组件：`Blink>Contacts`

### 鸣谢

非常感谢实现该功能的 Finnur Thorarinsson 和 Rayan Kanso ，以及我在演示中参考了其[代码](https://tests.peter.sh/contact-api/)的 Peter Beverloo。

附注：我在联系人选取器中使用的名字是小说《爱丽丝梦游仙境》中的角色。

---
layout: post
title: 注册表单最佳实践
subhead: 帮助您的用户轻松注册、登录和管理他们的帐户详细信息。
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2020-12-11
description: 帮助您的用户轻松注册、登录和管理他们的帐户详细信息。
hero: image/admin/YfAltWqxvie1SP19BxBj.jpg
thumbnail: image/admin/7bDPvFWBMFIMynoqDpMc.jpg
alt: 含有手写页面的剪贴板，显示播种的蔬菜列表。
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-up-form-best-practices
---

{% YouTube 'Ev2mCzJZLtY' %}

如果用户需要登录您的网站，那么良好的注册表单设计至关重要。对于连接不良、使用移动设备、匆忙或压力大的人来说尤其如此。设计不佳的注册表单会导致高跳出率。每次跳出都可能意味着失去用户和造成用户不满意——而不仅仅是错过注册机会。

{% Aside 'codelab' %}如果您希望通过手把手的教程学习这些最佳实践，请查看[注册表单最佳实践代码实验室](/codelab-sign-up-form-best-practices)。 {% endAside %}

这是一个非常简单的注册表单示例，演示了所有最佳实践：

{% Glitch { id: 'signup-form', path: 'index.html', height: 700 } %}

{% Aside 'caution' %} 这篇博文阐述表单最佳实践。

其没有解释如何通过第三方身份提供者（联合登录）实现注册或展示如何构建后端服务来验证用户、存储凭据和管理帐户。

[将 Google Sign-In 集成到您的 Web 应用](https://developers.google.com/identity/sign-in/web/sign-in)解释了如何将联合登录添加到您的注册选项中。

[用户帐户、授权和密码管理的 12 个最佳实践](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account)概述了管理用户帐户的核心后端原则。 {% endAside %}

## 清单

- [如果可以，请避免登录](#no-forced-sign-in)。
- [明确如何创建帐户](#obvious-account-creation)。
- [明确如何访问帐户详细信息](#obvious-account-details)。
- [减少表单杂乱项](#cut-clutter)。
- [考虑会话长度](#session-length)。
- [帮助密码管理器安全地建议和存储密码](#help-password-managers)。
- [不允许泄露密码](#no-compromised-passwords)。
- [允许密码粘贴](#allow-password-pasting)。
- [切勿以纯文本形式存储或传输密码](#salt-and-hash)。
- [不要强制更新密码](#no-forced-password-updates)。
- [使更改或重置密码变得简单](#password-change)。
- [启用联合登录](#federated-login)。
- [使帐户切换变得简单](#account-switching)。
- [考虑提供多重身份验证](#multi-factor-authentication)。
- [注意用户名](#username)。
- [在现场和实验室中进行测试](#analytics-rum)。
- [在一系列浏览器、设备和平台上进行测试](#test-platforms)。

## 如果可以，请避免登录 {: #no-forced-sign-in }

在您实施注册表单并要求用户在您的网站上创建帐户之前，请考虑您是否真的需要这样做。在可能的情况下，您应该避免在登录后设置门控功能。

最好的注册表单是没有注册表单！

通过要求用户创建一个帐户，您会介于他们和他们想要实现的目标之间。您是在请求帮助，并要求用户信任您的个人数据。您存储的每个密码和数据项都带有隐私和安全“数据债务”，成为您网站的成本和责任。

如果您要求用户创建帐户的主要原因是在导航或浏览会话之间保存信息，请[考虑改用客户端存储](/storage-for-the-web)。对于购物网站，强迫用户创建帐户进行购买被认为是放弃购物车的主要原因。您应该[将访客结帐设为默认值](/payment-and-address-form-best-practices#guest-checkout)。

## 使登录变得明显 {: #obvious-account-creation}

明确如何在您的网站上创建帐户，例如使用页面右上角的**登录**或**登录**按钮。避免使用模棱两可的图标或模糊的措辞（“加入！”、“加入我们”）并且不要在导航菜单中隐藏登录信息。可用性专家 Steve Krug 总结了这种网站可用性的方法：[不要让我思考！](https://uxplanet.org/dont-make-me-think-20-wise-thoughts-about-usability-from-steve-krug-876b563f1d63)如果您需要说服网络团队中的其他人，请使用[分析](#analytics-rum)来显示不同选项的影响。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KeztoU8KgAqrQ5CKBSWw.jpg", alt="两个在安卓手机上查看的电子商务网站样机截图。左边的一个使用了一个有点模棱两可的登录链接图标；右边的一个简单地说'登录'", width="800", height="737" %}<figcaption>使登录变得明显。图标可能不明确，但<b>登录</b>按钮或链接很明显。</figcaption></figure>

{% Aside %}您可能会考虑是添加按钮（或链接）来创建帐户，还是添加供现有用户登录的按钮（或链接）。许多热门网站现在只显示一个**登录**按钮。当用户点击该按钮时，他们还会在必要时获得创建帐户的链接。现在这是一种常见模式，您的用户容易理解，但您可以使用[交互分析](#analytics-rum)来监控单个按钮是否效果最佳。 {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WUgCNqhEgvoWEVwGjfrA.jpg", alt="Gmail 登录截图：一个页面，显示&quot;登录&quot;按钮，单击时会引导至也具有&quot;创建帐户链接&quot;的表单。", width="800", height="545" %}  <figcaption>Gmail 登录页面包含用于创建帐户的链接。<br>当窗口尺寸大于此处显示的尺寸时，Gmail 会显示<b>登录</b>链接和<b>创建帐户</b>按钮。</figcaption></figure>

确保为通过身份提供商（例如 Google）注册并且还使用电子邮件和密码注册的用户关联帐户。如果您可以从身份提供商的配置文件数据访问用户的电子邮件地址，并且匹配两个帐户，那么这很容易做到。下面的代码显示了如何访问 Google 登录用户的电子邮件数据。

```js
// auth2 is initialized with gapi.auth2.init()
if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log(`Email: ${profile.getEmail()}`);
}
```

{：#obvious-account-details}

用户登录后，请明确如何访问帐户详细信息。尤其要明确如何[更改或重置密码](#password-change)。

## 减少表单杂乱项 {: #cut-clutter}

在注册流程中，您的工作是将复杂性降至最低并让用户保持专注。减少杂乱项。现在不是分心和诱惑的时候！

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/avoid-distractions.mp4" type="video/mp4">
   </source></video>
  <figcaption>不要分散用户完成注册的注意力。</figcaption></figure>

在注册时，要求尽可能少。仅在您需要并且用户看到提供该数据的明显好处时才收集其他用户数据（例如姓名和地址）。请记住，您传达和存储的每一项数据都会产生成本和责任。

不要仅仅为了确保用户获得正确的联系方式而加倍输入。这会减慢表单的完成速度，并且如果表单字段是自动填充的，则毫无意义。相反，在用户输入他们的联系方式后向用户发送确认代码，然后在他们响应后继续创建帐户。这是一种常见的注册模式：用户已经习惯了。

您可能希望通过在用户每次在新设备或浏览器上登录时向用户发送代码来考虑免密码登录。Slack 和 Medium 等网站使用了这一版本。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/medium-sign-in.mp4" type="video/mp4">
   </source></video>
  <figcaption>在 medium.com 上免密码登录。</figcaption></figure>

与联合登录一样，这还有一个额外的好处，即您不必管理用户密码。

## 考虑会话长度 {: #session-length}

无论您对用户身份采取何种方法，您都需要对会话长度做出谨慎的决定：用户保持登录状态的时间以及可能导致您注销的原因。

考虑您的用户是使用移动设备还是桌面设备，以及他们是在桌面设备上共享还是在共享设备上共享。

{% Aside %}您可以通过对敏感功能强制重新进行身份验证来解决共享设备的一些问题，例如在进行购买或更新帐户时。您可以从[您的首个 WebAuthn 应用](https://codelabs.developers.google.com/codelabs/webauthn-reauth/#0)代码实验室中找到更多关于实现多重身份验证的方法。 {% endAside %}

## 帮助密码管理器安全地建议和存储密码 {: #help-password-managers}

您可以帮助第三方和内置浏览器密码管理器建议和存储密码，让用户无需自己选择、记住或键入密码。密码管理器在现代浏览器中运行良好，可以跨设备、跨平台特定应用和 Web 应用同步帐户，也适用于新设备。

这使得正确编码注册表单非常重要，尤其是使用正确的自动填充值。对于注册表单，使用 `autocomplete="new-password"` 建议新密码，并尽可能将正确的自动填充值添加到其他表单字段，例如 `autocomplete="email"` 和 `autocomplete="tel"`。您还可以通过在注册和登录表单、`form` 元素本身以及任何  `input`、`select` 和 `textarea` 元素中使用不同的 `name` 和  `id` 值来帮助密码管理器。

您还应该使用适当的 [`type` 属性](https://developer.mozilla.org/docs/Web/HTML/Element/input/email)在移动设备上提供正确的键盘并启用浏览器的基本内置验证。您可以从[付款和地址表单最佳实践](/payment-and-address-form-best-practices#type)中了解更多信息。

{% Aside %}[登录表单最佳实践](/sign-in-form-best-practices)包含更多关于如何改进表单设计、布局和可访问性以及如何正确编码表单以利用内置浏览器功能的提示。 {% endAside %}

## 确保用户输入安全密码 {: #secure-passwords}

启用密码管理器建议密码是最好的选择，您应该鼓励用户接受浏览器和第三方浏览器管理器建议的强密码。

但是，很多用户都希望输入自己的密码，因此您需要实施密码强度规则。美国国家标准与技术研究所解释了[如何避免不安全的密码](https://pages.nist.gov/800-63-3/sp800-63b.html#5-authenticator-and-verifier-requirements)。

{% Aside 'warning' %} 某些网站上的注册表单具有密码验证规则，不允许使用浏览器和第三方密码管理器生成的强密码。确保您的站点不会这样做，因为它会中断表单的填写、惹恼用户并要求用户创建自己的密码，这可能不如密码管理器生成的密码安全。 {% endAside %}

## 不允许泄露密码 {: #no-compromised-passwords}

无论您为密码选择何种规则，您都不应允许[在安全漏洞中暴露](https://haveibeenpwned.com/PwnedWebsites)的密码。

用户输入密码后，您需要检查该密码是否已被泄露。网站 [Have I Being Pwned](https://haveibeenpwned.com/Passwords) 提供了用于密码检查的 API，或者您可以自己将其作为服务运行。

Google 的密码管理器还允许您[检查您现有的任何密码是否已泄露](https://passwords.google.com/checkup)。

如果您确实拒绝了用户建议的密码，请具体告诉他们拒绝的原因。在用户输入值后立即[显示问题原因并解释如何修复它们](https://baymard.com/blog/inline-form-validation)——不要等到他们提交注册表单并不得不等待服务器的响应之后。

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/password-validation.mp4" type="video/mp4">
   </source></video>
  <figcaption>明确密码被拒绝的原因。</figcaption></figure>

## 不要禁止密码粘贴 {: #allow-password-pasting}

某些站点不允许将文本粘贴到密码输入中。

禁止密码粘贴会惹恼用户，从而导致用户使用容易记忆的密码（因此可能更容易被破解），并且根据英国国家网络安全中心等组织的说法，实际上可能会[降低安全性](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords)。用户在尝试粘贴密码*后*才能意识到不允许粘贴，因此[禁止密码粘贴并不能避免剪贴板漏洞](https://github.com/OWASP/owasp-masvs/issues/106)。

## 切勿以纯文本存储或传输密码 {: #salt-and-hash}

确保对密码进行[salt 和散列](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#Use_a_cryptographically_strong_credential-specific_salt)——[不要尝试发明自己的散列算法](https://www.schneier.com/blog/archives/2011/04/schneiers_law.html)！

## 不要强制更新密码 {: #no-forced-password-updates}

[不要随意强迫用户更新他们的密码。](https://pages.nist.gov/800-63-3/sp800-63b.html#-5112-memorized-secret-verifiers:~:text=Verifiers%20SHOULD%20NOT%20require%20memorized%20secrets%20to%20be%20changed%20arbitrarily%20(e.g.%2C%20periodically).)

强制更新密码对 IT 部门来说可能代价高昂，让用户感到厌烦，并且[对安全性没有太大影响](https://pages.nist.gov/800-63-FAQ/#q-b05)。它还可能造成人们使用不安全、容易记住的密码，或保留密码的物理记录。

您应该监视异常的帐户活动并警告用户，而不是强制更新密码。如果可能，您还应该监控因数据泄露而被泄露的密码。

您还应该让您的用户访问他们的帐户登录历史记录，向他们显示登录发生的时间和地点。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zZXmhWc9bZ1GtvrE5Ooq.jpg", alt="Gmail 帐户活动页面", width="800", height="469" %}<figcaption> <a href="https://support.google.com/mail/answer/45938?hl=en-GB" title="了解如何查看 Gmail 帐户活动。">Gmail 帐户活动页面</a>。</figcaption></figure>

## 使更改或重置密码变得简单 {: #password-change}

让用户清楚地知道在哪里以及如何**更新**他们的帐户密码。在某些网站上，这出奇地困难。

当然，您还应该让用户在忘记密码时轻松**重置**密码。Web 应用安全计划 (Open Web Application Security Project) 提供了有关[如何处理丢失的密码](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)的详细指南。

为了确保您的企业和用户的安全，如果用户发现密码已被盗用，帮助他们更改密码尤为重要。为了使这更容易，您应该向重定向到您的密码管理页面的网站添加一个 [`/.well-known/change-password`](https://w3c.github.io/webappsec-change-password-url/) URL。这使密码管理器可以将您的用户直接导航到他们可以更改您网站密码的页面。此功能现已在 Safari、Chrome 中实现，并且即将在其他浏览器中使用。[通过添加用于更改密码的知名 URL 帮助用户轻松更改密码](/change-password-url)解释了如何实现这一点。

如果用户需要，您还应该让他们轻松删除他们的帐户。

## 通过第三方身份提供商提供登录 {: #federated-login}

许多用户更喜欢使用电子邮件地址和密码注册表单登录网站。但是，您还应该允许用户通过第三方身份提供者登录，也称为联合登录。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jubgwX1shLB7qAIiioTU.jpg", alt="WordPress 登录页面", width="800", height="513" %}<figcaption> WordPress 登录页面，含 Google 和 Apple 登录选项。</figcaption></figure>

这种方法有几个优点。对于使用联合登录创建帐户的用户，您无需询问、交流或存储密码。

您还可以通过联合登录访问其他经过验证的个人资料信息，例如电子邮件地址——这意味着用户无需输入该数据，您也无需自己进行验证。联合登录还可以让用户在使用新设备时更加轻松。

[将 Google Sign-In 集成到您的 Web 应用](https://developers.google.com/identity/sign-in/web/sign-in)解释了如何将联合登录添加到您的注册选项中。[许多其他](https://en.wikipedia.org/wiki/Federated_identity#Examples)身份平台可用。

{% Aside %} 获得新设备时的“第一天体验”变得越来越重要。用户希望从多种设备登录，包括手机、笔记本电脑、台式机、平板电脑、电视或汽车。如果您的注册和登录表单不是无缝衔接的，那么此时您可能会失去用户，或者至少在他们重新设置之前失去与他们的联系。您需要让新设备上的用户尽可能快速轻松地启动并运行您的网站。这是联合登录可以提供帮助的另一个领域。 {% endAside %}

## 使帐户切换变得简单 {: #account-switching}

许多用户使用相同的浏览器共享设备并在帐户之间切换。无论用户是否访问联合登录，您都应该使帐户切换变得简单。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sPDZJIY5Vo2ijqyuofCy.jpg", alt="Gmail, 显示账户切换", width="800", height="494" %}<figcaption> Gmail 上的帐户切换。</figcaption></figure>

## 考虑提供多重身份验证 {: #multi-factor-authentication}

多重身份验证意味着确保用户以不止一种方式提供身份验证。例如，除了要求用户设置密码外，您还可以使用通过电子邮件或 SMS 文本消息发送的一次性密码，或使用基于应用的一次性密码、安全密钥或指纹传感器。[SMS OTP 最佳实践](/sms-otp-form)和[使用 WebAuthn 启用强身份验证](https://developer.chrome.com/blog/webauthn/)解释了如何实现多重身份验证。

如果您的站点处理个人或敏感信息，您当然应该提供（或强制执行）多重身份验证。

## 注意用户名 {: #username}

除非（或直到）您需要用户名，否则不要坚持使用用户名。使用户能够仅使用电子邮件地址（或电话号码）和密码进行注册和登录，如果他们愿意，也可以使用[联合登录](#federated-login)。不要强迫他们选择并记住用户名。

如果您的网站确实需要用户名，请不要对其施加不合理的规则，也不要阻止用户更新其用户名。在您的后端，您应该为每个用户帐户生成一个唯一 ID，而不是基于用户名等个人数据的标识符。

还要确保对用户名使用 `autocomplete="username"`。

{% Aside 'caution' %}与个人姓名一样，请确保用户名不限于[拉丁字母中的字符](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types:~:text=Latin%20alphabet)。[付款和地址表单最佳实践](/payment-and-address-form-best-practices#unicode-matching)解释了如何以及为何使用 Unicode 字母匹配进行验证。 {% endAside %}

## 在一系列设备、平台、浏览器和版本上进行测试 {: #test-platforms}

在用户最常用的平台上测试注册表单。表单元素功能可能会有所不同，视口大小的差异可能会导致布局问题。 BrowserStack 支持在一系列设备和浏览器上对[开源项目进行免费测试。](https://www.browserstack.com/open-source)

## 实施分析和真实用户监控 {: #analytics-rum}

您需要[现场数据和实验室数据](/how-to-measure-speed/#lab-data-vs-field-data)来了解用户如何体验您的注册表单。分析和[真实用户监控](https://developer.mozilla.org/docs/Web/Performance/Rum-vs-Synthetic#Real_User_Monitoring) (RUM) 为用户的实际体验提供数据，例如加载注册页面需要多长时间、用户交互（或不交互）哪些 UI 组件以及用户完成注册所需的时间。

- **页面分析**：注册流程中每个页面的[页面浏览量、跳出率和退出率。](https://analytics.google.com/analytics/academy/course/6)
- **交互分析**：[目标渠道](https://support.google.com/analytics/answer/6180923?hl=en)和[事件](https://developers.google.com/analytics/devguides/collection/gtagjs/events)表明用户放弃注册流程的位置以及用户点击注册页面的按钮、链接和其他组件的比例。
- **网站性能**：以[用户为中心的指标](/user-centric-performance-metrics)可以告诉您注册流程是否加载缓慢或[视觉不稳定](/cls)。

微小的变化会对注册表单的完成率产生很大的影响。分析和 RUM 使您能够优化更改并确定其优先级，并监控您的站点是否存在本地测试未暴露的问题。

## 继续学习 {: #resources }

- [登录表单最佳实践](/sign-in-form-best-practices)
- [付款和地址表单最佳实践](/payment-and-address-form-best-practices)
- [创建出色的表单](/learn/forms/)
- [移动表单设计最佳实践](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [更强大的表单控件](/more-capable-form-controls)
- [创建无障碍表单](https://webaim.org/techniques/forms/)
- [使用凭证管理 API 简化注册流程](https://developer.chrome.com/blog/credential-management-api/)
- [使用 WebOTP API 验证网络上的电话号码](/web-otp)

照片：[@ecowarrioprincess](https://unsplash.com/@ecowarriorprincess)，来源：[Unsplash](https://unsplash.com/photos/lUShu7PHIGA)。

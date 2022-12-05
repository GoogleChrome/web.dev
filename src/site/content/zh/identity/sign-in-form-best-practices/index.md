---
layout: post
title: 登录表单最佳实践
subhead: 使用跨平台浏览器功能构建安全、可访问且易于使用的登录表单。
authors:
  - samdutton
scheduled: 'true'
date: 2020-06-29
updated: 2021-09-27
description: 使用跨平台浏览器功能构建安全、可访问且易于使用的登录表单。
hero: image/admin/pErOjllBUXhnj68qOhfr.jpg
alt: 一个人拿着手机。
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-in-form-best-practices
---

{% YouTube 'alGcULGtiv8' %}

如果用户需要登录到您的站点，良好的登录表单设计至关重要。这对于那些没有可靠的网络连接、使用移动设备、匆忙或压力大的人来说尤其如此。设计不佳的登录表单会导致高跳出率。每次跳出都可能意味着失去心怀不满的用户 - 而不仅仅是错过登录机会。

{% Aside 'codelab' %}如果您希望通过便捷的教程学习这些最佳实践，请查看[登录表单最佳实践代码实验室](/codelab-sign-in-form-best-practices/)。 {% endAside %}

以下是一个简单的登录表单示例，演示了所有最佳实践：

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

## 清单

- [使用有意义的 HTML 元素](#meaningful-html)：`<form>`、`<input>`、`<label>` 和 `<button>`。
-  [使用 `<label>` 标记每个输入](#label)。
- 使用元素属性[访问内置浏览器功能](#element-attributes)：`type`、`name`、`autocomplete`、`required`。
- 为输入 `name` 和 `id` 属性提供稳定的值，使其在页面加载或网站部署之间不会改变。
- 将登录[放在它自己的 &lt;form&gt; 元素中](#single-form)。
- [确保成功提交表单](#submission)。
- 将 [`autocomplete="new-password"`](#new-password) 和 [`id="new-password"`](#new-password) 用于注册表单中的输入密码，以及重置密码表单中的新密码。
- 将 [`autocomplete="current-password"`](#current-password) 和 [`id="current-password"`](#current-password) 用于登录密码输入。
- 提供[显示密码](#show-password)功能。
- [将 `aria-label` 和 `aria-describedby`](#accessible-password-inputs) 用于密码输入。
- [不要加倍输入](#no-double-inputs)。
- 设计表单，使[移动键盘不会妨碍输入或按钮](#keyboard-obstruction)。
- 确保表单在移动设备上可用：使用[清晰的文本](#size-text-correctly)，并确保输入和按钮[足够大以用作触摸目标](#tap-targets)。
- 在您的注册和登录页面上[维护品牌和风格。](#general-guidelines)
- [在现场和实验室中进行测试](#analytics)：在您的注册和登录流程中构建页面分析、交互分析和以用户为中心的性能测量。
- [跨浏览器和设备进行测试](#devices)：跨平台的表单行为差异很大。

{% Aside %}这篇文章着重讲述前端最佳实践，并没有解释如何构建后端服务来验证用户、存储他们的凭据或管理他们的帐户。[针对用户帐户、授权和密码管理的 12 条最佳实践](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account)概述了运行后端的核心原则。如果您的用户遍布世界上不同的地区，则需要考虑本地化您的站点对第三方身份服务及其内容的使用。

还有以下两个相对较新的 API 没有在本文中介绍，但它们可以帮助您构建更好的登录体验：

- [**WebOTP**](/web-otp/)：通过短信向手机发送一次性密码或 PIN 码。这可以允许用户选择电话号码作为标识符（无需输入电子邮件地址！），还可以启用登录的两步验证和付款确认的一次性代码。
- [**凭据管理**](https://developer.chrome.com/blog/credential-management-api/)：使开发人员能够以编程方式存储和检索密码凭据和联合凭据。 {% endAside %}

## 使用有意义的 HTML {: #meaningful-html }

使用为作业构建的元素：`<form>`、`<label>` 和 `<button>`。这些启用内置浏览器功能，提高可访问性，并为您的标记添加含义。

### 使用`<form>` {: #form }

您可能想将输入包装在 `<div>` 中并纯粹使用 JavaScript 处理输入数据提交。通常最好使用普通的旧 [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) 元素。这使屏幕阅读器和其他辅助设备可以访问您的站点，启用一系列内置浏览器功能，从而使得为旧浏览器构建基本功能登录变得更简单，并且即使 JavaScript 失败也仍然可以工作。

{: #single-form } {% Aside 'gotchas' %} 一个常见的错误是将整个网页包装在一个表单中，这很容易导致浏览器密码管理器和自动填充出现问题。为每个需要表单的 UI 组件使用不同的 &lt;form&gt;。例如，如果您在同一页面上进行登录和搜索，则应使用两个表单元素。 {% endAside %}

### 使用`<label>` {: #label }

要标记输入，请使用[`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label) !

```html
<label for="email">Email</label>
<input id="email" …>
```

两个原因：

- 点击或单击标签将焦点移至其输入。通过使用标签的 `for` 属性和输入的 `name` 或 `id` 将标签与输入相关联。
- 当标签或标签的输入获得焦点时，屏幕阅读器会宣布标签文本。

不要使用占位符作为输入标签。一旦开始输入文本，人们很可能会忘记输入的内容，尤其是当他们分心时（“我输入的是电子邮件地址、电话号码还是帐户 ID？”）。占位符还有许多其他潜在问题：如果您不相信，请参阅[不要使用占位符属性](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)和[表单字段中的占位符是有害的。](https://www.nngroup.com/articles/form-design-placeholders/)

最好将标签放在输入之上。这可以实现跨移动和桌面的一致设计，根据 [Google AI 研究](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html)，这还可以让用户更快地进行扫描。您将获得全宽标签和输入，并且无需调整标签和输入宽度以适合标签文本。

<figure>{% Img src="image/admin/k0ioJa9CqnMI8vyAvQPS.png", alt="屏幕截图：显示移动设备上的表单输入标签位置：输入旁边和输入上方。",  width="500", height="253" %} <figcaption>标签和输入宽度在同一行时受到限制。</figcaption></figure>

在移动设备上打开[标签位置](https://label-position.glitch.me)故障，亲自查看。

### 使用`<button>` {: #button }

使用 [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) 作为按钮！按钮元素提供可访问的行为和内置表单提交功能，并且可以轻松设置样式。`<div>` 或其他一些伪装成按钮的元素没有意义。

确保提交按钮说明它的作用。示例包括**创建帐户**或**登录**，而不是**提交**或**开始** 。

### 确保成功提交表单 {: #submission }

帮助密码管理员了解表单已提交。有两种方法可以做到这一点：

- 导航到不同的页面。
- 使用 `History.pushState()` 或 `History.replaceState()` 模拟导航，并删除密码表单。

对于 `XMLHttpRequest` 或 `fetch` 请求，确保在响应中报告登录成功，并通过从 DOM 中取出表单以及向用户指示成功来处理。

考虑在用户轻触或点击**登录**按钮后禁用它。即使在快速响应的站点上，[许多用户也会多次点击按钮。](https://baymard.com/blog/users-double-click-online)这会减慢交互速度并增加服务器负载。

相反，不要禁用等待用户输入的表单提交。例如，如果用户尚未输入其客户 PIN，请勿禁用**登录**按钮。用户可能会错过表单中的某些内容，然后尝试反复点击（已禁用）**登录**按钮并认为它不起作用。至少，如果您必须禁用表单提交，请向用户解释当他们单击禁用按钮时缺少什么。

{% Aside 'caution' %} 表单中按钮的默认类型是 `submit`。如果您想在表单中添加另一个按钮（例如，对于**显示密码** ），请添加 `type="button"` 。否则单击或点击按钮将提交表单。

在任何表单域获得焦点时按 `Enter` 键会模拟单击表单中第一个 `submit` 按钮。如果您在表单中的**提交**按钮之前包含一个按钮，并且未指定类型，则该按钮将具有表单中按钮的默认类型 ( `submit` ) 并在提交表单之前接收点击事件。有关示例，请参阅我们的[演示](https://enter-button.glitch.me/)：填写表格，然后按 `Enter`。 {% endAside %}

### 不要加倍输入 {: #no-double-inputs }

某些站点会强制用户输入电子邮件或密码两次。这可能会降低少数用户的错误，但会给*所有*用户带来额外工作，并且[增加放弃率](https://uxmovement.com/forms/why-the-confirm-password-field-must-die/)。在浏览器自动填充电子邮件地址或建议强密码的情况下，询问两次也毫无意义。最好让用户确认他们的电子邮件地址（无论如何您都需要这样做），并让他们在必要时轻松重置密码。

## 充分利用元素属性 {: #element-attributes }

这是魔法真正发生的地方！浏览器有多个有用的内置功能，这些功能使用输入元素属性。

## 将密码保密——但允许用户在需要时查看它们 {: #show-password }

密码输入应该有 `type="password"` 来隐藏密码文本并帮助浏览器理解输入的是密码。（请注意，浏览器使用[各种技术](#autofill)来理解输入角色并决定是否提供保存密码。）

您应该添加**显示密码**图标或按钮，让用户能够检查他们输入的文本——并且不要忘记添加**忘记密码**链接。请参阅[启用密码显示](#password-display)。

<figure>{% Img src="image/admin/58suVe0HnSLaJvNjKY53.png", alt="显示“显示密码”图标的 Google 登录表单。", width="300", height="107" %}<figcaption>从 Google 登录表单输入密码：使用<strong>显示密码</strong>图标和<strong>忘记密码</strong>链接。</figcaption></figure>

## 为移动用户提供正确的键盘 {: #mobile-keyboards }

使用 `<input type="email">` 为移动用户提供合适的键盘并启用浏览器的基本内置电子邮件地址验证……无需 JavaScript！

如果您需要使用电话号码而非电子邮件地址，`<input type="tel">` 可在移动设备上启用电话键盘。您还可以在必要时使用 `inputmode` 属性：`inputmode="numeric"` 非常适合 PIN 码。[您想知道的关于输入模式的一切](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/)都有更多的细节。

{% Aside 'caution' %} `type="number"` 添加向上/向下箭头来增加数字，所以不要将它用于不打算增加的数字，例如 ID 和帐号。 {% endAside %}

### 防止移动键盘遮挡**登录**按钮 {: #keyboard-obstruction }

不幸的是，如果您不小心，移动键盘可能会覆盖您的表单，或者更糟糕的是，部分遮挡**登录**按钮。用户可能在意识到发生了什么之前就放弃了。

<figure>{% Img src="image/admin/rLo5sW9LBpTcJU7KNnb7.png", alt="Android 手机登录表单的两个屏幕截图：一个显示提交按钮如何被手机键盘遮挡。", width="400 ", height="360" %}<figcaption><b>登录</b>按钮：一会儿能看见，一会儿看不见。</figcaption></figure>

在可能的情况下，仅在**登录**页面顶部显示电子邮件/电话和密码输入来避免这种情况。将其他内容放在下面。

<figure>{% Img src="image/admin/0OebKiAP4sTgaXbcbvYx.png", alt="Android 手机登录表单的屏幕截图：登录按钮没有被手机键盘遮挡。", width="200", height="342" %}<figcaption>键盘没有遮挡<b>登录</b>按钮。</figcaption></figure>

#### 在一系列设备上测试 {: #devices }

您需要针对目标受众在一系列设备上进行测试，并进行相应调整。 BrowserStack 支持在一系列真实设备和浏览器上对[开源项目进行免费测试。](https://www.browserstack.com/open-source)

<figure>{% Img src="image/admin/jToMlWgjS3J2WKmjs1hx.png", alt="iPhone 7、8 和 11 上登录表单的屏幕截图。在 iPhone 7 和 8 上，登录按钮被手机键盘遮挡，但 iPhone 11 上则没有", width="800", height="522" %}<figcaption><b>登录</b>按钮：在 iPhone 7 和 8 上被遮挡，但在 iPhone 11 上没有。</figcaption></figure>

#### 考虑使用两页 {: #two-pages }

一些网站（包括亚马逊和 eBay）通过在两个页面上询问电子邮件/电话和密码来避免这个问题。这种方法还简化了体验：用户一次只负责一件事。

<figure>{% Img src="image/admin/CxpObjYZMs0MMFo66f4P.png", alt="亚马逊网站登录表单的截图：电子邮件/电话和密码在两个单独的“页面”上。", width="400", height="385" %}<figcaption>两阶段登录：电子邮件或电话，然后是密码。</figcaption></figure>

理想情况下，这应该使用单个 &lt;form&gt; 来实现。使用 JavaScript 最初仅显示电子邮件输入，然后将其隐藏并显示密码输入。如果您必须强制用户在输入电子邮件和密码之间导航到新页面，则第二页上的表单应该有一个带有电子邮件值的隐藏输入元素，以帮助密码管理器存储正确的值。[Chromium 理解的密码表单样式](https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands)提供了一个代码示例。

### 帮助用户避免重新输入数据 {: #autofill }

您可以帮助浏览器正确存储数据并自动填充输入，这样用户就不必记住输入电子邮件和密码值。这在移动设备上尤其重要，对于电子邮件输入至关重要，因为电子邮件的[放弃率很高](https://www.formisimo.com/blog/conversion-rate-increases-57-with-form-analytics-case-study/)。

这有两个部分：

1. `autocomplete`、`name`、`id` 和 `type` 属性帮助浏览器了解输入的作用，以便存储以后可用于自动填充的数据。为了允许存储数据以进行自动填充，现代浏览器还要求输入具有稳定的 `name` 或 `id` 值（不是在每次页面加载或站点部署时随机生成的），并且在带有 `submit` 按钮的 &lt;form&gt; 中。

2. `autocomplete` 属性可帮助浏览器使用存储的数据正确自动填充输入。

对于电子邮件输入，请使用 `autocomplete="username"` ，因为现代浏览器中的密码管理器可以识别 `username`。即使您应该使用  `type="email"`，您可能想使用 `id="email"` 和 `name="email"`。

对于密码输入，使用适当的 `autocomplete` 和 `id` 值来帮助浏览器区分新密码和当前密码。

### 将 `autocomplete="new-password"` 和 `id="new-password"` 用于新密码 {: #new-password }

- 将 `autocomplete="new-password"` 和 `id="new-password"` 用于登录表单中的密码输入，或更改密码表单中的新密码输入。

### 将 `autocomplete="current-password"` 和 `id="current-password"` 用于现有密码 {: #current-password }

- 将 `autocomplete="current-password"` 和 `id="current-password"` 用于登录表单中的密码输入，或者用于更改密码表单中用户旧密码的输入。这告诉浏览器您希望它使用它为站点存储的当前密码。

对于登录表单：

```html
<input type="password" autocomplete="new-password" id="new-password" …>
```

对于登录：

```html
<input type="password" autocomplete="current-password" id="current-password" …>
```

{% Aside %}Chrome 等浏览器可以使用浏览器的密码管理器在登录过程中为回访用户自动填充字段。为了使这些功能发挥作用，浏览器需要能够区分用户何时更改了密码。

特别是在设置新密码后，更改用户密码的表单应从页面中清除或隐藏。如果更改用户密码的表单在发生密码更改后仍然填写在页面上，则浏览器可能无法记录更新。 {% endAside %}

### 支持密码管理器 {: #password-managers }

不同的浏览器处理电子邮件自动填充和密码建议的方式略有不同，但效果大致相同。例如，在桌面版 Safari 11 及更高版本上，会显示密码管理器，然后在可用时使用生物识别身份验证（指纹或面部识别）。

<figure>{% Img src="image/admin/UjBRRYaLbX9bh3LDFcAM.png", alt="桌面版 Safari 登录过程的三个阶段的屏幕截图：密码管理器、生物识别身份验证、自动填充。", width="800", height= "234" %}<figcaption>使用自动填充登录 - 无需输入文本！</figcaption></figure>

桌面版 Chrome 显示电子邮件建议、显示密码管理器并自动填充密码。

<figure>{% Img src="image/admin/mDm1cstWZB9jJDzMmzgE.png", alt="桌面版 Chrome 登录过程的四个阶段的屏幕截图：电子邮件填充、电子邮件建议、密码管理器、选择时自动填充。", width=" 800", height="232" %}<figcaption> Chrome 84 中的自动填充登录流程。</figcaption></figure>

浏览器密码和自动填充系统并不简单。猜测、存储和显示值的算法没有标准化，并且因平台而异。例如，正如 [Hidde de Vries](https://hiddedevries.nl/en/blog/2018-01-13-making-password-managers-play-ball-with-your-login-form) 所指出的：“Firefox 的密码管理器通过[配方系统](https://bugzilla.mozilla.org/show_bug.cgi?id=1119454)补充了它的启发式方法。”

[自动填充：Web 开发人员应该知道的东西，但没有](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont)更多关于使用 `name` 和 `autocomplete` 的信息。[HTML 规范](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#inappropriate-for-the-control)列出了所有 59 个可能的值。

{% Aside %} 对于 `form` 元素本身，以及任何 `input`、`select` 和`textarea` 元素，您可以通过在注册和登录表单中使用不同的 `name` 和 `id` 值来帮助密码管理器 {% endAside %}

### 启用浏览器建议强密码 {: #password-suggestions }

现代浏览器使用启发式方法来决定何时显示密码管理器 UI 并建议使用强密码。

以下是 Safari 在桌面上的执行方式。

<figure>{% Img src="image/admin/B1DlZK0CllVjrOUbb5xB.png", alt="Firefox 密码管理器桌面截图。", width="800", height="229" %}<figcaption> Safari 中的密码建议流程。</figcaption></figure>

（自 12.0 版以来，Safari 中已提供强大的唯一密码建议。）

内置的浏览器密码生成器意味着用户和开发人员不需要弄清楚什么是“强密码”。由于浏览器可以安全地存储密码并根据需要自动填充密码，因此用户无需记住或输入密码。鼓励用户利用内置的浏览器密码生成器也意味着他们更有可能在您的网站上使用唯一的强密码，并且不太可能重复使用可能在其他地方被泄露的密码。

{% Aside %} 这种方法的缺点是无法跨平台共享密码。例如，用户可能在 iPhone 上使用 Safari，在 Windows 笔记本电脑上使用 Chrome。 {% endAside %}

### 帮助用户避免意外丢失输入 {: #required-fields }

将 `required` 属性添加到电子邮件和密码字段。现代浏览器会自动提示并为丢失的数据设置焦点。无需 JavaScript！

<figure>{% Img src="image/admin/n5Nr290upVmQGvlc263U.png", alt="桌面版 Firefox 和 Chrome for Android 的屏幕截图，显示“请填写此字段”提示缺少数据。", width="600", height=" 392" %}<figcaption>提示并关注桌面版 Firefox（版本 76）和 Android 版 Chrome（版本 83）上丢失的数据。</figcaption></figure>

## 手指和拇指设计 {: #mobile-design }

与输入元素和按钮相关的几乎所有内容的默认浏览器大小都太小，尤其是在移动设备上。这似乎很明显，但这是许多网站上登录表单的常见问题。

### 确保输入和按钮足够大 {: #tap-targets }

输入和按钮的默认大小和填充在桌面上太小，在移动设备上更糟。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lJNO6w2dOyp4cYKl5b3y.png", alt="桌面版 Chrome 和 Chrome for Android 中无样式表单的屏幕截图。", width="800", height="434" %}</figure>

根据 [Android 辅助功能指南](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)，触摸屏对象的推荐目标尺寸为 7-10 毫米。 Apple 界面指南建议 48x48 像素，W3C 建议[至少 44x44 CSS 像素](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)。在此基础上，为移动设备的输入元素和按钮添加（至少）大约 15 像素的内边距，在桌面设备上添加大约 10 像素的内边距。用真正的移动设备和真正的手指或拇指试试这个。您应该能够轻松点击每个输入和按钮。

[点击目标的大小不合适](/tap-targets/)Lighthouse 审计可以帮助您自动化检测太小的输入元素的过程。

#### 拇指设计 {: #design-for-thumbs }

搜索[触摸目标](https://www.google.com/search?q=touch+target)，您会看到很多食指的图片。然而，在现实世界中，许多人使用拇指与手机进行交互。拇指比食指大，控制不太精确。重要的是要保证足够大小的触摸目标。

### 使文本足够大 {: #size-text-correctly }

与大小和填充一样，输入元素和按钮的默认浏览器字体大小太小，尤其是在移动设备上。

<figure>{% Img src="image/admin/EeIsqWhLbot15p4SYpo2.png", alt="Chrome 桌面和 Android 上无样式表单的屏幕截图。", width="800", height="494"%}<figcaption>桌面和移动设备上的默认样式：输入文本太小，许多用户无法辨认。</figcaption></figure>

不同平台上的浏览器字体大小不同，因此很难指定在任何地方都能正常工作的特定字体大小。对流行网站的快速调查显示桌面上的大小为 13-16 像素：匹配该物理大小是移动文本的最佳最小值。

这意味着您需要在移动设备上使用更大的像素尺寸：`16px` 的大小在 Chrome 桌面上是相当清晰的，但即使有良好的视力，在 Chrome for Android 上也难以阅读 `16px` 的文本。您可以使用[媒体查询](https://developers.google.com/web/fundamentals/design-and-ux/responsive#apply_media_queries_based_on_viewport_size)为不同的视口大小设置不同的字体像素大小。`20px` 在移动设备上是正确的——但您应该和视力不好的朋友或同事一起测试一下。

[文档没有使用清晰的字体大小](/font-size/) Lighthouse 审计可以帮助您自动化检测太小文本的过程。

### 在输入之间提供足够的空间 {: #size-margins-correctly }

添加足够的空间以使输入作为触摸目标工作良好。换句话说，瞄准大约手指宽度的空间。

### 确保您的输入清晰可见 {: #visible-inputs }

输入的默认边框样式使它们难以看到。它们在某些平台（例如 Android 版 Chrome）上几乎不可见。

除了填充，添加边框：在白色背景上，一个好的规则是使用 `#ccc` 或更暗的边框。

<figure>{% Img src="image/admin/OgDJ5V2N7imHXSBkN4pr.png", alt="Chrome on Android 中样式表单的屏幕截图。", width="250", height="525" %}<figcaption>清晰的文本、可见的输入边框、足够的填充和边距。</figcaption></figure>

### 使用内置浏览器功能警告无效的输入值 {: #built-in-validation }

浏览器具有内置功能，可以对具有 `type` 属性的输入进行基本的表单验证。当您提交具有无效值的表单时，浏览器会发出警告，并将焦点设置在有问题的输入上。

<figure>{% Img src="image/admin/Phf9m5J66lIX9x5brzOL.png", alt="桌面版 Chrome 登录表单的屏幕截图，显示浏览器提示和无效电子邮件值的焦点。", width="300", height="290" %}<figcaption>浏览器的基本内置验证。</figcaption></figure>

您可以使用 `:invalid` CSS 选择器来突出显示无效数据。使用 `:not(:placeholder-shown)` 避免选择没有内容的输入。

```css
input[type=email]:not(:placeholder-shown):invalid {
  color: red;
  outline-color: red;
}
```

尝试不同的方法来突出显示具有无效值的输入。

## 必要时使用 JavaScript {: #javascript }

### 切换密码显示 {: #password-display }

您应该添加**显示密码**图标或按钮，使用户能够检查他们输入的文本。当用户看不到他们输入的文本时，[可用性会受到影响。](https://www.nngroup.com/articles/stop-password-masking/)目前没有内置的方法可以做到这一点，但[有实施计划](https://twitter.com/sw12/status/1251191795377156099)。您需要改用 JavaScript。

<figure><img src="./show-password-google.png" alt="显示“显示密码”图标的 Google 登录表单。" width="350"><figcaption> Google 登录表单：带有<strong>显示密码</strong>图标和<strong>忘记密码</strong>链接。</figcaption></figure>

以下代码使用文本按钮添加**显示密码**功能。

HTML：

```html/2
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

这是使按钮看起来像纯文本的 CSS：

```css
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  /* Media query isn't shown here. */
  font-size: var(--mobile-font-size);
  font-weight: 300;
  padding: 0;
  /* Display at the top right of the container */
  position: absolute;
  top: 0;
  right: 0;
}
```

以及用于显示密码的 JavaScript：

```js
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
    togglePasswordButton.setAttribute('aria-label',
      'Hide password.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
    togglePasswordButton.setAttribute('aria-label',
      'Show password as plain text. ' +
      'Warning: this will display your password on the screen.');
  }
}
```

这是最终结果：

<figure>{% Img src="image/admin/x4NP9JMf1KI8PapQ9JFh.png", alt="Mac 和 iPhone 7 Safari 中显示密码文本“按钮”的登录表单截图。", width="800", height ="468" %}<figcaption>Mac 和 iPhone 7 上的 Safari 中带有<strong>显示密码</strong>文本“按钮”的登录表单。</figcaption></figure>

### 使密码输入可访问 {: #accessible-password-inputs }

使用 `aria-writtenby` 通过为其提供描述约束的元素的 ID 来概述密码规则。屏幕阅读器提供标签文本、输入类型（密码）和描述。

```html
<input type="password" aria-describedby="password-constraints" …>
<div id="password-constraints">Eight or more characters with a mix of letters, numbers and symbols.</div>
```

添加**显示密码**功能时，请确保包含 `aria-label` 以警告将显示密码。否则用户可能会无意中泄露密码。

```html/1-2
<button id="toggle-password"
        aria-label="Show password as plain text.
                    Warning: this will display your password on the screen.">
  Show password
</button>
```

您可以在以下故障中看到两个 ARIA 功能的运行情况：

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

[创建可访问表单](https://webaim.org/techniques/forms/)提供了更多帮助表单可访问的提示。

### 实时和提交前验证 {: #validation }

HTML 表单元素和属性具有用于基本验证的内置功能，但您还应该使用 JavaScript 在用户输入数据和尝试提交表单时进行更可靠的验证。

{% Aside 'warning' %} 客户端验证可帮助用户输入数据并避免不必要的服务器负载，但您必须始终验证和清理后端的数据。 {% endAside %}

登录表单代码实验室的[第 5 步](https://glitch.com/edit/#!/sign-in-form-codelab-5)使用[Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints) （得到[广泛支持](https://caniuse.com/#feat=constraint-validation)）添加自定义验证，使用内置浏览器 UI 设置焦点和显示提示。

了解更多：[使用 JavaScript 进行更复杂的实时验证](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)。

### 分析和 RUM {: #analytics }

“如果无法测量，则无法改进”对于注册和登录表单尤其如此。您需要设定目标、成功测量、改进您的网站——不断重复。

[折扣可用性测试](https://www.nngroup.com/articles/discount-usability-20-years/)有助于尝试更改，但您需要真实世界的数据才能真正了解您的用户如何体验您的注册和登录表单：

- **页面分析**：注册和登录页面浏览量、跳出率和退出。
- **交互分析**：[目标渠道](https://support.google.com/analytics/answer/6180923?hl=en)（用户在哪里放弃您的登录或登录流程？）和[事件](https://developers.google.com/analytics/devguides/collection/gtagjs/events)（用户在与您的表单交互时采取什么操作？）
- **网站性能**：以[用户为中心的指标](/user-centric-performance-metrics)（您的注册和登录表单是否由于某种原因变慢，如果是，原因是什么？）。

您可能还需要考虑实施 A/B 测试以尝试不同的注册和登录方法，并在向所有用户发布更改之前分阶段部署以验证对部分用户的更改。

## 一般准则 {: #general-guidelines }

精心设计的 UI 和 UX 可以减少登录表单的放弃：

- 不要让用户寻找登录！在页面顶部放置一个指向登录表单的链接，使用易于理解的措辞，例如**登录**、**创建帐户**或**注册**。
- 保持专注！注册表单不是用优惠和其他网站功能分散人们注意力的地方。
- 最大限度地减少注册的复杂性。仅当用户看到提供这些数据的明显好处时才收集其他用户数据（例如地址或信用卡详细信息）。
- 在用户开始使用您的注册表单之前，请明确价值主张是什么。他们如何从登录中受益？为用户提供具体的激励以完成注册。
- 如果可能，允许用户使用手机号码而不是电子邮件地址来标识自己，因为有些用户可能不使用电子邮件。
- 使用户可以轻松重置密码，将**忘记密码？**链接放在显眼的位置。
- 链接到您的服务条款和隐私政策文件：从一开始就向用户说明您如何保护他们的数据。
- 在您的注册和登录页面上包含您公司或组织的徽标和名称，并确保语言、字体和样式与您网站的其余部分相匹配。某些表单与其他内容不属于同一站点，尤其是当它们具有明显不同的 URL 时。

## 继续学习 {: #resources }

- [创建惊人的表格](/learn/forms/)
- [移动表单设计的最佳实践](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [更强大的表单控件](/more-capable-form-controls)
- [创建可访问表单](https://webaim.org/techniques/forms/)
- [使用凭证管理 API 简化登录流程](https://developer.chrome.com/blog/credential-management-api/)
- [使用 WebOTP API 验证网络上的电话号码](/web-otp/)

照片：[Meghan Schiereck](https://unsplash.com/photos/_XFObcM_7KU)；来源：[Unsplash](https://unsplash.com)

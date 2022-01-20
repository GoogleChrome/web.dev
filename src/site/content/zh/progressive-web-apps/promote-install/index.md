---
layout: post
title: 推广 PWA 安装的模式
authors:
  - pjmclachlan
  - mustafakurtuldu
date: 2019-06-04
updated: 2020-06-17
description: |2-

  如何推广渐进式 Web 应用的安装以及最佳做法。
tags:
  - progressive-web-apps
feedback:
  - api
---

安装渐进式 Web 应用 (PWA) 可使用户更轻松地进行查找和使用。即使进行浏览器推广，一些用户也没有意识到他们可以安装 PWA，因此提供可用于推广和启用 PWA 安装的应用内体验会很有帮助。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PtJp54jasjOYyh9Soqzu.png", alt="PWA 中简单安装按钮的屏幕截图。", width="800", height="368" %}<figcaption> PWA 中提供了一个简单安装按钮。</figcaption></figure>

此列表并不详尽，但却为推广 PWA 安装的不同方法提供了一个起点。无论您使用哪一种或*哪几种模式*，都会产生触发安装流程的相同代码，具体记录在[如何提供您自己的应用内安装体验](/customize-install/)中。

<div class="w-clearfix"> </div>

## PWA 安装推广最佳实践 {: #best-practices }

无论您在站点上使用何种推广模式，都有一些适用的最佳实践。

- 将推广置于用户操作流程之外。例如，在 PWA 登录页面中，将行动号召放在登录表单和提交按钮下方。滥用推广模式会降低 PWA 的可用性，并对您的参与度指标产生负面影响。
- 包括关闭或拒绝推广的功能。请记住用户在执行此操作时的偏好，并且仅在用户与您内容的关系发生变化（例如他们登录或完成购买）时才重新提示。
- 在 PWA 的不同部分融入以上多种方法，但要小心不要让安装推广使您的用户应接不暇或感到懊恼 。
- 仅在触发 [`beforeinstallprompt` 事件](/customize-install/#beforeinstallprompt)**后**显示推广。

## 自动浏览器推广 {: #browser-promotion }

当满足[某些条件](/install-criteria/)时，大多数浏览器会自动向用户表明可以安装您的渐进式 Web 应用。例如，桌面 Chrome 会在地址栏中显示一个安装按钮。

<div class="w-columns">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zIfRss5zOrZ49c4VdJ52.png", alt="显示安装指示的地址栏的屏幕截图。", width="800", height="307" %}<figcaption>浏览器提供的安装推广（桌面）</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kRjcsxlHDZa9Nqg2Fpei.png", alt="提供安装推广的浏览器屏幕截图。", width="800", height="307" %} <figcaption> 浏览器提供的安装推广（移动设备）</figcaption></figure>
</div>

<div class="w-clearfix"> </div>

Android 版 Chrome 会向用户显示一个迷你信息栏，不过这可通过对 `beforeinstallprompt` 事件调用 `preventDefault()` 来阻止。如果您不调用 `preventDefault()`，用户第一次访问您的站点并符合 Android 上的可安装性标准时将显示横幅，然后在大约 90 天后再次显示。

## 应用程序 UI 推广模式 {: #app-ui-patterns }

应用程序 UI 推广模式几乎可以用于任何类型的 PWA 并出现在应用程序 UI 中，例如站点导航和横幅。与任何其他类型的推广模式一样，了解用户的上下文以便最大程度地减少对用户旅程 (user journey) 的干扰非常重要。

对何时触发推广 UI 考虑周到的站点可以实现更大的安装量，并避免干扰那些对安装不感兴趣的用户的旅程。

<div class="w-clearfix"> </div>

### 简单安装按钮 {: #simple-button }

最简单可行的用户体验是在 Web 内容的适当位置加入“安装”或“获取应用”按钮。确保该按钮不会阻止其他重要功能，并且不妨碍用户在您应用程序中的整个旅程。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kv0x9hxZ0TLVaIiP4Bqx.png", alt="自定义安装按钮", width="800", height="448" %} <figcaption> 简单安装按钮 </figcaption></figure>

<div class="w-clearfix"> </div>

### 固定标题 {: #header }

这是一个安装按钮，是您站点标题的一部分。其他标题内容通常包括站点品牌，例如徽标和汉堡菜单。标题可能是也可能不是 `position:fixed`，具体取决于您站点的功能和用户需求。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GPJdkXcpNLR30r2zo7RR.png", alt="标题中的自定义安装按钮", width="800", height="448" %} <figcaption> 标题中的自定义安装按钮 </figcaption></figure>

如果使用得当，在站点的标题中推广 PWA 安装是一种很好的方式，可以让您最忠实的客户更轻松地回归您的体验。PWA 标题中的像素非常珍贵，因此请确保您的安装号召大小合适，比其他可能的标题内容更重要，而且不会造成干扰。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/L01AoSoy7LNk1ttMMax0.png", alt="标题中的自定义安装按钮", width="800", height="430" %} <figcaption> 标题中的自定义安装按钮 </figcaption></figure>

确保您：

- 不显示安装按钮，除非 `beforeinstallprompt` 已触发。
- 评估您的用户已安装的用例的价值。考虑选择性定位，以便仅向可能从中受益的用户展示您的推广。
- 有效地利用宝贵的标题空间。考虑在标题中为您的用户提供哪些有用的其他信息，并权衡安装推广相对于其他选项的优先级。

<div class="w-clearfix"> </div>

### 导航菜单 {: #nav }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aT7NHi8lbsZW8TOm3Gaw.png", alt="导航菜单中的自定义安装按钮", width="800", height="1117" %} <figcaption> 在滑出式导航菜单中添加安装按钮/推广。</figcaption></figure>

导航菜单是您推广应用安装的好地方，因为用户打开菜单即表明参与了您的体验。

确保您：

- 避免中断重要的导航内容。将 PWA 安装推广放在其他菜单项下方。
- 提供简短的相关宣传，说明为什么用户会从安装您的 PWA 中受益。

<div class="w-clearfix"> </div>

### 登陆页面 {: #landing }

登陆页面的目的是推广您的产品和服务，因此适合大力宣传安装 PWA 好处。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7q09M12HFxgIiWhKPGma.png", alt="登陆页面上的自定义安装提示", width="800", height="1117" %} <figcaption> 登陆页面上的自定义安装提示 </figcaption></figure>

首先，解释您站点的价值主张，然后让访问者知道他们将从安装中得到什么。

确保您：

- 利用对访问者最重要的功能，并强调可能将他们带到您的登录页面的关键字。
- 让您的安装推广和号召吸人眼球，但前提是您已经明确了您的价值主张。毕竟，这是您的登录页面。
- 考虑在应用中用户用时最多的部分添加安装推广。

<div class="w-clearfix"> </div>

### 安装横幅 {: #banner }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7fLCQQhdk2OzrQD3Xh4E.png", alt="页面顶部的自定义安装横幅。", width="800", height="1000" %} <figcaption> 页面顶部的可关闭横幅。</figcaption></figure>

大多数用户都在移动体验中遇到过安装横幅，并且熟悉横幅所提供的交互。横幅会干扰用户，因此应谨慎使用。

确保您：

- 等到用户表现出对您站点的兴趣后，再显示横幅。如果用户关闭了横幅，请勿再次显示，除非用户触发了表示对您的内容参与度更高的转化事件，例如在电子商务站点上购物或注册帐户。
- 在横幅中简要说明安装 PWA 的价值所在。例如，您可以指出它几乎不使用用户设备上的存储，或者无需商店重定向即可立即安装，从而将 PWA 的安装与 iOS/Android 应用区分开来。

<div class="w-clearfix"> </div>

### 临时 UI {: #temporary-ui }

临时 UI（例如 [Snackbar](https://material.io/components/snackbars/) 设计模式）会通知用户并让用户轻松完成操作。在本例中，可以安装应用。如果使用得当，这些类型的 UI 模式不会中断用户流程，并且在用户忽略的情况下通常会自动关闭。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6DySYRtyegazEfMcWXQL.png", alt="作为 snackbar 的自定义安装横幅。", width="800", height="448" %} <figcaption> 指示 PWA 可安装的可关闭 snackbar。</figcaption></figure>

在您的应用有几次参与、互动后再显示 snackbar。如果 snackbar 在页面加载时出现或者缺少上下文，则很容易被忽略，或让人无暇顾及。发生这种情况时，用户只会关闭他们所看到的一切。请记住，您站点的新用户可能还没有准备好安装您的 PWA。因此，最好等到用户表现出强烈的兴趣后再使用此模式，例如重复访问、用户登录或类似的转化事件。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/d8dwdIe1rYSgd0JdCGtt.png", alt="作为 snackbar 的自定义安装横幅。", width="800", height="424" %} <figcaption>  指示 PWA 可安装的可关闭 snackbar。</figcaption></figure>

确保您：

- 展示 snackbar 达 4 到 7 秒钟，让用户有足够的时间来查看它并做出反应，而不会妨碍用户操作。
- 避免将  snackbar 显示在其他临时 UI 上，例如横幅等。
- 等到用户表现出强烈的兴趣后再使用此模式，例如重复访问、用户登录或类似的转化事件。

<div class="w-clearfix"> </div>

## 转化后

用户转化事件之后（例如在电子商务站点上购物后）恰好是推广 PWA 安装的绝佳机会。用户显然已参与您的内容，而一次转化通常表示用户将会再次接受您的服务。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DrepSPFAm64d5cvTFoXe.png", alt="转化之后安装推广的屏幕截图。", width="800", height="448" %} <figcaption> 用户已完成购买后的安装推广。 </figcaption></figure>

### 预订或结帐旅程 {: #journey }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bOYZM2UiWK5itVSpjKWO.png", alt="用户旅程之后的安装推广。", width="800", height="1419" %} <figcaption> 用户旅程之后的安装推广。</figcaption></figure>

在连续旅程期间或之后显示安装推广，例如典型的预订或结帐流程。如果在用户已完成旅程后显示推广，由于旅程已完成，通常可以让推广更加显眼。

确保您：

- 加入相关的行动号召。哪些用户将从安装您的应用中受益？原因是什么？此应用与用户目前正在进行的旅程有何相关性？
- 如果您的品牌为已安装应用的用户提供独有优惠，请务必在此处说明。
- 不要让推广影响用户接下来的旅程，否则您可能会对旅程完成率产生负面影响。在上面的电子商务示例中，请注意结帐的关键行动号召如何优先于应用安装推广。

<div class="w-clearfix"> </div>

### 注册、登录或注销流程 {: #sign-up}

此推广是[旅程](#journey)推广模式的特例，推广卡片可以更加显眼。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PQXqSqtwRSwyELdJMjtd.png", alt="注册页面上的自定义安装按钮。", width="800", height="1117" %} <figcaption> 注册页面上的自定义安装按钮。</figcaption></figure>

这些页面通常只由参与的用户查看，他们已经认同您的 PWA 价值主张。这些页面上通常也没有很多其他有用的内容。因此，只要不碍事，发出更强的行动号召就不会造成太多负面影响。

确保您：

- 避免在注册表单内干扰用户的旅程。如果注册过程包含多个步骤，您最好等到用户完成旅程。
- 推广与已注册用户最相关的功能。
- 考虑在您应用的已登录区域内添加额外的安装推广。

<div class="w-clearfix"> </div>

## 内联推广模式

内联推广技术将推广与站点内容交织在一起。这通常比应用程序 UI 中的推广更微妙，后者中有诸多权衡因素。您希望您的推广足够显眼，让感兴趣的用户能够注意到它，但又不至于降低用户体验的质量。

### 信息流内 {: #in-feed }

您的 PWA 中的新闻文章或其他信息卡列表之间会出现一个信息流广告安装推广。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LS5qSE2vicfjRBBkA47a.png", alt="内容信息流内的安装推广。", width="800", height="1000" %} <figcaption> 内容信息流内的安装推广。</figcaption></figure>

您的目标是向用户展示如何更方便地访问他们正在欣赏的内容。专注于推广对用户有帮助的特性和功能。

确保您：

- 限制推广的频率以免惹恼用户。
- 让您的用户能够关闭推广。
- 记住您用户的关闭选择。

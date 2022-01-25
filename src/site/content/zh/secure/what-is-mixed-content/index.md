---
layout: post
title: 混合内容是什么？
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-24
description: 通过安全 HTTPS 连接加载初始 HTML，但通过不安全的 HTTP 连接加载其他资源时，就会出现混合内容。
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

通过安全 [HTTPS](/why-https-matters/) 连接加载初始 HTML，但通过不安全的 HTTP 连接加载其他资源（如图像、视频、样式表、脚本）时，就会出现**混合内容**。之所以称之为混合内容，不仅仅是因为显示的同一个页面上同时加载了 HTTP 和 HTTPS 内容，还因为初始请求是通过 HTTPS 加密的。

使用不安全的 HTTP 协议请求子资源会降低整个页面的安全性，因为这些请求容易遭受[**路径中攻击**](https://www.ietf.org/rfc/rfc7835.html#section-2.1.1)，攻击者会窃听网络连接并查看或修改两方之间的通信。利用这些资源，攻击者可以跟踪用户并替换网站上的内容，而对于主动混合内容的情况，他们可以完全控制页面，而不仅仅是导致资源不安全。

尽管许多浏览器会警告用户存在混合内容，但往往为时已晚：这时已经执行不安全的请求，页面安全性也已经遭到破坏。

这就是为什么浏览器要越来越严格地阻止混合内容的原因。如果您的网站上存在混合内容，那么通过修复可以确保即使浏览器实施更严格的限制，您也可以继续加载内容。

## 混合内容的两种类型

混合内容有两种类型：主动和被动。

**被动混合内容**是指不与页面其余部分交互的内容，因此，中间人攻击将仅限于他们拦截或更改这种内容时可以执行的操作。被动混合内容包括图像、视频和音频内容。

**主动混合内容**作为一个整体与页面进行交互，因此允许攻击者对页面执行几乎任何操作。主动混合内容包括脚本、样式表、iframe 和浏览器可以下载和执行的其他代码。

### 被动混合内容

一般认为，被动混合内容的问题相对较少，但仍会对您的网站和用户构成安全威胁。例如，攻击者可以拦截您网站上图像的 HTTP 请求并交换或替换这些图像；攻击者可以交换*保存*和*删除*按钮的图像，导致您的用户在无意中删除内容；或者使用淫秽或色情内容替换您的产品图表，从而破坏您的网站；又或者使用不同网站或产品的广告替换您的产品图片。

即使攻击者不更改您网站的内容，他们也可以通过混合内容请求来跟踪用户。攻击者可以根据浏览器加载的图像或其他资源来判断用户访问了哪些页面以及查看了哪些产品。

如果存在被动混合内容，大多数浏览器会在 URL 栏中指出页面不安全，即使页面本身是通过 HTTPS 加载的。您可以通过包含被动混合内容示例的此[演示](https://passive-mixed-content.glitch.me/)来观察这种行为。

直到最近，所有浏览器仍会加载被动混合内容，因为阻止这些内容会破坏许多网站。现在，这种情况开始发生变化，因此，更新您网站上的混合内容实例至关重要。

[Chrome 目前正在尽可能推出](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html)被动混合内容的自动升级。自动升级意味着，如果资产可通过 HTTPS 加载，但已将其硬编码为 HTTP，则浏览器会加载 HTTPS 版本。如果找不到安全版本，则不加载资产。

每当检测到混合内容或自动升级被动混合内容时，Chrome 都会将详细消息记录到 DevTools 的**“问题”**选项卡下，从而指导您解决特定的问题。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HNxoomaHi2ksvYHGuNiE.jpg", alt="Chrome DevTools 中显示关于特定混合内容问题及其解决方法详细信息的问题选项卡", width="800", height="310" %}</figure>

### 主动混合内容

与被动混合内容相比，主动混合内容构成的威胁更大。攻击者可以拦截和重写活动内容，从而完全控制您的页面，甚至控制整个网站。这样，攻击者便可以更改页面的任何内容，包括显示完全不同的内容，窃取用户密码或其他登录凭据，窃取用户会话 Cookie 或将用户重定向到完全不同的站点。

由于这种威胁的严重性，为了保护用户，大多数浏览器已经默认阻止此类内容，但具体功能因浏览器供应商和版本而异。

下面的[演示](https://active-mixed-content.glitch.me/)包含主动混合内容的示例。[通过 HTTP 加载示例](http://active-mixed-content.glitch.me/)可查看[通过 HTTPS 加载示例](https://active-mixed-content.glitch.me/)时阻止的内容。**问题**选项卡中也会详细说明阻止的内容。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xRG5zpKLr0Z3OwfYpn2H.jpg", alt="Chrome DevTools 中显示关于特定混合内容问题及其解决方法详细信息的问题选项卡", width="800", height="361" %}</figure>

{% Aside %} 浏览器还会在开发者工具中突出显示阻止的内容。在基于 Chromium 的浏览器的**问题**选项卡中会详细介绍阻止的内容问题。Firefox 和 Safari 会在控制台中记录消息。{% endAside %}

## 混合内容规范

浏览器需要遵循[混合内容规范](https://w3c.github.io/webappsec-mixed-content/)。该规范定义了[**可选择阻止的内容**](https://w3c.github.io/webappsec-mixed-content/#optionally-blockable-mixed-content)和[**可阻止的内容**](https://w3c.github.io/webappsec-mixed-content/#category-blockable)类别。

根据规范，“当 Web 的重要组成部分遭到破坏的风险超过允许使用混合内容的风险时”，则资源有资格作为可选择阻止的内容；这是上述被动混合内容类别的子集。

所有不可**选择阻止的**内容都被认为是**可阻止的内容**，并且浏览器应将其阻止。

{% Aside %}目前正在实施[第 2 级混合内容规范](https://w3c.github.io/webappsec-mixed-content/level2.html)，其中会添加规范的自动升级。{% endAside %}

近年来，[HTTPS 的应用越来越广泛](https://transparencyreport.google.com/https/overview)，已经成为 Web 上明确的默认设置。现在，这使浏览器考虑阻止所有混合内容变得更加可行，即便是[混合内容规范中](https://w3c.github.io/webappsec/specs/mixedcontent/)定义为**可选择阻止**的子资源类型。这就是我们现在看到 Chrome 对这些子资源实施更严格的方法的原因。

### 旧版浏览器

请务必记住，并非每一位访问您网站的用户都会使用最新的浏览器。不同的浏览器供应商，不同的版本，处理混合内容的方式可能不同。最糟糕的是，旧浏览器和旧版本根本不会阻止任何混合内容，这对用户来说非常不安全。

通过解决混合内容问题，您可以确保内容在新浏览器中可见。还有助于保护用户，防止遭到旧版浏览器未阻止的危险内容的侵害。

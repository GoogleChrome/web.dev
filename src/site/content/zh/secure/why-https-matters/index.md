---
layout: post
title: HTTPS 为何重要
authors:
  - kaycebasques
date: 2015-11-23
updated: 2020-04-07
description: HTTPS 为您的网站保驾护航，保护您用户的隐私和安全，是首选必备的全新而强大的 Web 平台 API。
tags:
  - security
---

您应该始终使用 HTTPS 保护您的所有网站，即使这些网站不处理敏感通信也应如此。除了为您的网站和用户的个人信息提供关键的安全性和数据完整性之外，HTTPS 还是使用许多新浏览器功能的必要前提，尤其是[渐进式 Web 应用程序](/progressive-web-apps)所需的功能。

{% YouTube 'iP75a1Y9saY' %}

## 摘要 {: #summary }

- 恶意和良性入侵者都会利用您的网站和用户间的每一个未受保护的资源。
- 许多入侵者通过查看群体行为来识别您的用户。
- HTTPS 不仅可以阻止滥用您的网站，也是使用许多最新功能的前提，还能为 Service Worker 等类似应用程序功能提供支持。

## HTTPS 为您的网站保驾护航 {: #integrity }

HTTPS 可帮助您阻止入侵者篡改您的网站与用户浏览器间的通信。入侵者包括故意的恶意攻击者，以及合法但具有侵入性的公司，例如 ISP 或在网页中植入广告的酒店。

入侵者利用未受保护的通信来诱使您的用户放弃敏感信息或安装恶意软件，或者将他们的广告插入您的资源中。例如，一些第三方会在网站中植入广告，这可能会破坏用户体验并造成安全漏洞。

入侵者会利用在您的网站和用户之间传输的所有未受保护的资源。图像、cookie、脚本、HTML……它们都可以被利用。入侵可能发生在网络中的任何一环，包括用户的电脑、Wi-Fi 热点或有安全漏洞的 ISP，这些只是其中的一小部分。

## HTTPS 保护您用户的隐私和安全 {: #privacy }

HTTPS 可防止入侵者被动监听您的网站与用户之间的通信。

关于 HTTPS 的一个常见误解是，只有处理敏感通信的网站才需要 HTTPS。事实上每个未受保护的 HTTP 请求都可能泄露有关用户行为和身份的信息。尽管对您未受保护的网站的单次访问看似没有恶意，但一些入侵者会查看您用户的总体浏览活动，从而推断他们的行为和意图，并对他们的身份进行[去匿名化](https://en.wikipedia.org/wiki/De-anonymization)。例如，员工可能只是阅读未受保护的医疗文章而无意中向雇主透露了敏感的健康状况。

## HTTPS 是网络的未来 {: #capabilities }

一些新的 Web 平台功能十分强大，例如使用 `getUserMedia()` 拍照或录制音频，通过 [Service Worker](/service-workers-cache-storage/) 实现离线应用程序体验，或构建[渐进式 Web 应用程序](/progressive-web-apps)。这些功能在执行之前都需要用户的明确许可。许多早期的 API 也正在更新以要求获得执行权限，例如 [Geolocation API](https://developer.mozilla.org/docs/Web/API/Geolocation/Using_geolocation)。HTTPS 正是这些新功能和更新 API 的权限工作流的关键组成部分。

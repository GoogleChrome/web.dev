---
layout: post
title: 不要为其所有资源使用 HTTP/2
description: 了解为什么 HTTP/2 对页面加载时间很重要以及如何在服务器上启用 HTTP/2。
web_lighthouse:
  - uses-http2
date: 2019-05-02
updated: 2019-08-28
---

HTTP/2 可以更快地为网页传输资源，并且通过网络传输的数据更少。

## Lighthouse HTTP/2 审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 列出了所有未通过 HTTP/2 提供服务的资源：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Gs0J63479ELUkMeI8MRS.png", alt="Lighthouse 审计显示未通过 HTTP/2 提供的资源", width="800", height="191" %}</figure>

Lighthouse 会收集页面请求的所有资源，并检查每个资源的 HTTP 协议版本。在部分情况下，审计结果中会忽略非 HTTP/2 请求。欲了解更多详细信息， [请参阅实现。](https://github.com/GoogleChrome/lighthouse/blob/9fad007174f240982546887a7e97f452e0eeb1d1/lighthouse-core/audits/dobetterweb/uses-http2.js#L138)

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 如何通过本次审核

通过 HTTP/2 传输资源。

要了解如何在服务器上启用 HTTP/2，请参阅[设置 HTTP/2](https://dassur.ma/things/h2setup/) 。

## 资源

- [**不要为其所有资源使用 HTTP/2**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-http2.js)
- [HTTP/2 简介](/performance-http2/)
- [HTTP/2 常见问题](https://http2.github.io/faq/)

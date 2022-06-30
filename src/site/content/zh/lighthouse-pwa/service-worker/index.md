---
layout: post
title: 不注册可控制页面和“start_url”的服务工作进程
description: 了解如何注册可支持离线功能、推送通知和可安装等渐进式 Web 应用程序特性的服务工作进程。
web_lighthouse:
  - service-worker
date: 2019-05-04
updated: 2020-06-10
---

注册[服务工作进程](/service-workers-cache-storage/)是启用以下关键[渐进式 Web 应用程序 (PWA)](/discover-installable) 特性的第一步：

- 离线工作
- 支持推送通知
- 可以安装到设备

有关更多信息，请参阅文章[服务工作进程和缓存存储 API](/service-workers-cache-storage/)。

## 浏览器兼容性

除 Internet Explorer 外的所有主流浏览器都支持服务工作进程。请参阅[浏览器兼容性](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility)。

## Lighthouse 服务工作进程审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记不注册服务工作进程的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="Lighthouse 审计显示网站不注册服务工作进程", width="800", height="95" %}</figure>

Lighthouse 检查 [Chrome 远程调试协议](https://github.com/ChromeDevTools/devtools-protocol)是否返回一个服务工作进程版本。如果不返回，则审计失败。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 如何注册服务工作进程

{% include 'content/reliable/workbox.njk' %}

注册服务工作进程只需几行代码，但使用服务工作进程的唯一原因是可以实现上述 PWA 特性之一。实际上，实现这些特性需要更多工作：

- 要了解如何缓存文件以供离线使用，请参阅文章[什么是网络可靠性以及如何进行测量？](/network-connections-unreliable)。
- 要了解如何使应用程序可安装，请参阅[使其可安装](/codelab-make-installable/) codelab。
- 要了解如何启用推送通知，请参阅 Google 的[向 Web 应用程序添加推送通知](https://codelabs.developers.google.com/codelabs/push-notifications)。

## 资源

- [**不注册可控制页面和 `start_url` 的服务工作进程**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/service-worker.js)
- [服务工作进程：简介](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [服务工作进程和缓存存储 API](/service-workers-cache-storage/)
- [什么是网络可靠性以及如何进行测量？](/network-connections-unreliable)
- [使其可安装](/codelab-make-installable/)
- [向 Web 应用程序添加推送通知](https://codelabs.developers.google.com/codelabs/push-notifications)

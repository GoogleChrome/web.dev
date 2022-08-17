---
layout: post
title: 避免巨大的网络有效负载
description: 了解如何通过减少为用户提供资源的总文件大小来提高网页的加载时间。
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - total-byte-weight
---

大型的网络有效负载与加载时间较长有很大的关系。另外，这还会提高用户的成本；例如，用户可能需要为更多的移动数据付费。因此，减少页面网络请求的总大小既可以改善用户在您网站上的体验，*也*可以帮他们省钱。

{% Aside %}要了解在全球范围内访问您的网站的费用，请查看 WebPageTest 的 [What Does My Site Cost？](https://whatdoesmysitecost.com/)您可以根据购买力来调整结果。 {% endAside %}

## Lighthouse 网络有效负载审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 显示页面请求的所有资源的总大小（单位是 [千字节 (KiB) ）。](https://en.wikipedia.org/wiki/Kibibyte)首先呈现最大的请求：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cCFb8MJkwnYquq3K9UmX.png", alt="Lighthouse 避免巨大网络有效负载审计的截图", width="800", height="518" %}</figure>

根据 [HTTP Archive 上的数据](https://httparchive.org/reports/state-of-the-web?start=latest#bytesTotal)，网络有效负载的中位数在 1700 到 1900 KiB 之间。为了筛选出最高的有效负载，Lighthouse 会标记总网络请求超过 5000 KiB 的页面。

{% include 'content/lighthouse-performance/scoring.njk' %}

## 如何减少有效负载大小

争取将总字节大小保持在 1600 KiB 以下。该目标基于理论上可通过 3G 连接下载的数据量，同时仍可实现 10 秒或更短的[Time to Interactive](/tti/)。

以下是一些降低有效负载大小的方法：

- 在真正需要请求之前尽量推迟它们。请参阅 [PRPL Pattern](/apply-instant-loading-with-prpl) 提供的一种可能办法。
- 将请求优化得尽可能小。可能实现的技术包括：
    - [缩小和压缩网络有效负载](/reduce-network-payloads-using-text-compression)。
    - [图像使用 WebP 格式，而不是 JPEG 或 PNG](/serve-images-webp)。
    - [将 JPEG 图像的压缩级别设为 85](/use-imagemin-to-compress-images) 。
- 缓存请求，避免在重复访问页面时重新下载资源。 （请参阅[网络可靠性登录页面](/reliable)来了解缓存的工作原理以及实现方法。）

## 针对堆栈的具体指导

### Angular

应用[路由级代码拆分](/route-level-code-splitting-in-angular/)，将 JavaScript 包最小化。此外，请考虑使用 [Angular 服务工作进程](/precaching-with-the-angular-service-worker/)来预缓存资产。

### Drupal

考虑使用[Responsive Image Styles（响应式图片样式）](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8)来减小页面上加载的图像的大小。如果您使用视图在页面上显示多个内容项，请考虑实施分页来限制给定页面上显示的内容项数。

### Joomla

考虑在文章类别中显示摘要（例如通过“阅读更多”链接），减少给定页面上显示的文章数量，将长文章分成多个页面，或使用插件来延迟加载评论。

### WordPress

考虑在您的帖子列表中显示摘录（例如通过“更多”标签），减少给定页面上显示的帖子数量，将您的长帖子分成多个页面，或使用插件来延迟加载评论。

## 资源

[**避免巨大的网络有效负载**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/total-byte-weight.js)

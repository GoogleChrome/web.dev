---
layout: post
title: Time to First Byte 第一字节时间 (TTFB)
authors:
  - jlwagner
date: 2021-10-26
updated: 2022-03-30
description: |
  本篇文章介绍了第一字节时间 (TTFB) 指标并说明了该指标的测量方式
tags:
  - performance
  - metrics
  - web-vitals
---

{% Aside %}
第一字节时间 (TTFB) 是在实验室和现场测量连接建立时间和 Web 服务器响应能力的一个基础指标。它有助于识别 Web 服务器何时对请求的响应速度太慢。对 HTML 文档的请求，该指标先于其他所有的加载性能指标。
{% endAside %}

## TTFB 是什么?

TTFB 是一个衡量对资源的请求和响应的第一个字节开始和到达之间时间的指标。

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ccT8ltSPrTri3tz7AA3h.png", alt="A diagram of network request timings. The phases from left to right are Redirect (which overlaps with Prompt for Unload), Cache, DNS, TCP, Request, Response, Processing, and Load. The associated timings are redirectStart and redirectEnd (which overlap with the Prompt for Unload's unloadEventStart and unloadEventEnd), fetchStart, domainLookupStart, domainLookupEnd, connectStart, secureConnectionStart, connectEnd, requestStart, responseStart, responseEnd, domInteractive, domContentLoadedEventStart, domContentLoadedEventEnd, domComplete, loadEventStart, and loadEventEnd.", width="800", height="337" %}
  <figcaption>
    网络请求阶段及其相关时间损耗的图示. TTFB 测量<code>startTime</code>和<code>responseStart</code>之间的时间损耗。
  </figcaption>
</figure>

TTFB 是下列请求节点的时间损耗汇总：

- Redirect time 重定向时延
- Service worker 启动时延（如果适用）
- DNS 查询时延
- 建立连接和 TLS 所消耗时延
- 请求，直到响应的第一个字节到达为止的时延

减少连接建立和后端服务的时延将有助于降低 TTFB

### 什么是好的 TTFB 分数?

由于网络与后端服务的差异很大，因此不能对什么是“好的” TTFB 分数设定一个任意的数字。由于 TTFB 先于[以用户为中心的指标](/user-centric-performance-metrics/)，如[首次内容显示（FCP）](/fcp/)和[最大内容显示（LCP）](/lcp/)，因此建议你的服务器对请求的响应速度要足够快，以使 **P75** 的用户体验在[良好的 FCP 分数](/fcp/#what-is-a-good-fcp-score).

## 如何测量 TTFB

TTFB 可以在[实验场景](/user-centric-performance-metrics/#in-the-lab)或[实际场景](/user-centric-performance-metrics/#in-the-field)中以如下的方式进行测量。

### 实际场景可选工具

- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals)

### 实验场景可选工具

- 在 Chrome 开发者工具的 [网络面板](https://developer.chrome.com/docs/devtools/network/)
- [WebPageTest](https://www.webpagetest.org/)

### 在 JavaScript 中测量 TTFB

可以在具备[Navigation Timing API](https://developer.mozilla.org/docs/Web/API/Navigation_timing_API)功能的浏览器中测量 TTFB。下面的这个示例展示了如何创建 [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) 并监听 `navigation` ，最终把日志输出到控制台：

```javascript
new PerformanceObserver((entryList) => {
  const [pageNav] = entryList.getEntriesByType('navigation');

  console.log(`TTFB: ${pageNav.responseStart}`);
}).observe({
  type: 'navigation',
  buffered: true
});
```

{% Aside 'caution' %}
不是所有的浏览器都支持 `PerformanceObserver` 或它的 `buffered` 参数。为了获得尽可能多的浏览器支持，可以考虑采用`web-vitals`包，下面将讨论这个问题。
{% endAside %}

[`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) 也能在浏览器内测量 TTFB 指标，代码将更加简洁：

```javascript
import {getTTFB} from 'web-vitals';

// Measure and log TTFB as soon as it's available.
getTTFB(console.log);
```

### Measuring resource requests

TTFB applies to _all_ requests, not just navigation requests. In particular, resources hosted on cross-origin servers can introduce latency due to the need to set up connections to those servers. To measure TTFB for resources in the field, use the [Resource Timing API](https://developer.mozilla.org/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API) within a `PerformanceObserver`:
TTFB适用于 _所有_ 的请求，而不仅仅是导航请求。特别是那些资源托管在需要跨域访问的服务器上时，由于需要建立与这些服务器的连接，会引入延迟。要测量实际场景中的TTFB，请在 `PerformanceObserver 中使用[Resource Timing API](https://developer.mozilla.org/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API)

```javascript
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();

  for (const entry of entries) {
    // Some resources may have a responseStart value of 0, due
    // to the resource being cached, or a cross-origin resource
    // being served without a Timing-Allow-Origin header set.
    if (entry.responseStart > 0) {
      console.log(`TTFB: ${entry.responseStart}`, entry.name);
    }
  }
}).observe({
  type: 'resource',
  buffered: true
});
```

上述代码片断与用于测量导航请求的 TTFB 的代码片断类似，只不过不是查询 "导航" 条目，而是查询 "资源" 条目。它还说明了这样一个事实，即一些从主源加载的资源可能会返回一个 "0" 的值，因为连接已经打开，或者一个资源是瞬间从缓存中获取的。

{% Aside 'gotchas' %}
如果跨源服务器未能设置 [`Timing-Allow-Origin` header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin)，则跨域请求的 TTFB 将无法在实际场景中测量。
{% endAside %}

## 如何优化 TTFB

优化 TTFB 在很大程度上取决于你的托管供应商和后端服务。TTFB 值高可能是由于以下一个或多个问题造成的。

- 托管服务商的基础设施能力不足，无法处理高流量负载
- 网络服务器的内存不足，可能导致 [系统颠簸](https://en.wikipedia.org/wiki/Memory_paging#Thrashing)
- 未经优化的数据库
- 不良的数据库服务器配置

通常通过选择一个合适的托管供应商是优化 TTFB ，其基础设施可确保高正常运行时间和响应能力。这与 CDN 相结合，可以起到帮助作用。

{% Aside %}
使用 [Server-Timing API](https://developer.mozilla.org/docs/Web/HTTP/Headers/Server-Timing) 来收集关于应用程序后端性能的额外现场数据，这可以帮助确定改进的机会，否则可能会被忽视。
{% endAside %}

其他优化高 TTFB 时延和相关感知延迟的机会包括：

- [避免多次重定向](/redirects/).
- 提前向跨域资源源[建立连接 Preconnect](/uses-rel-preconnect/) 。
- 将源提交给[HSTS预加载列表](https://hstspreload.org/)，以消除 HTTP-HTTPS 重定向延迟。
- [使用 HTTP/2](/uses-http2/) or [HTTP/3](https://en.wikipedia.org/wiki/HTTP/3)。
- 考虑[预测性预取](/predictive-prefetching/)，为没有指定[减少数据使用偏好](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-data)的用户提供快速页面导航。
- 在可能和适当的情况下，使用服务器端生成（SSG）来代替SSR的标记。

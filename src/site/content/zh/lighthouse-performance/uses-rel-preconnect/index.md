---
layout: post
title: 预连接到所需的源
description: 了解 uses-rel-preconnect 审计。
date: 2019-05-02
updated: 2020-05-06
web_lighthouse:
  - uses-rel-preconnect
---

Lighthouse 报告的“机会”部分列出了所有尚未使用 `<link rel=preconnect>` 对获取请求进行优先级排序的关键请求：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K5TLz5LOyRjffxJ6J9zl.png", alt="Lighthouse 预连接到所需的源审计截图", width="800", height="226" %}</figure>

## 浏览器兼容性

大多数浏览器都支持 `<link rel=preconnect>`。请参阅[浏览器兼容性](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)。

## 通过预连接提高页面加载速度

考虑添加 `preconnect` 或 `dns-prefetch` 资源提示来建立与重要第三方源的早期连接。

`<link rel="preconnect">` 会通知浏览器，您的页面打算与另一个源建立连接，而且您希望该过程尽快开始。

在慢速网络中建立连接通常需要消耗大量时间，尤其是在涉及安全连接时，因为它可能涉及到 DNS 查找、重定向以及用于处理用户请求而与最终服务器的多次往返。

提前处理好所有这些任务可以让用户觉得应用更快，而不会对带宽的使用产生负面影响。建立连接的大部分时间都花在了等待上，而不是用来交换数据。

只要向页面添加链接标签，就可以将您的意图告知浏览器：

`<link rel="preconnect" href="https://example.com">`

这样一来，浏览器就知道该页面打算连接到 `example.com` 并从那里检索内容。

请记住，虽然 `<link rel="preconnect">` 消耗不大，但它仍然会占用宝贵的 CPU 时间，尤其是在创建安全连接时。如果在 10 秒内没有使用连接，这种情况尤其糟糕，因为浏览器会关闭它，从而浪费所有早期的连接工作。

通常情况下，请尝试使用 `<link rel="preload">` ，因为它提供更全面的性能调整。但对于下列极端的情况，请在工具带中保留 `<link rel="preconnect">`：

- [用例：知道来自哪里，但不知道要获取的内容](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [用例：流媒体](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">` 是另一个与连接相关的 `<link>`。它仅负责 DNS 查找，但具有更广泛的浏览器支持，因此可以作为一个很好的后备。它的用法完全相同：

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## 针对堆栈的具体指导

### Drupal

请使用[支持用户代理资源提示的模块](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=dns-prefetch&solrsort=iss_project_release_usage+desc&op=Search)，从而可以安装和配置预连接或 DNS 预取资源提示。

### Magento

请[修改主题布局](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html)并添加预连接或 DNS 预取资源提示。

## 资源

- [**预连接到所需的源**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preconnect.js)
- [资源优先级——让浏览器帮助您](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [尽早建立网络连接以提高感知页面速度](/preconnect-and-dns-prefetch/)
- [链接类型：预连接](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)

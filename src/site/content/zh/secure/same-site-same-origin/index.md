---
layout: post
title: 理解“同站”和“同源”
authors:
  - agektmr
date: 2020-04-15
updated: 2020-06-10
description: "“同站 (Same-Site)”和“同源 (Same-Origin)”是两个常用但也常被误解的术语。本文可帮助您理解它们的含义和区别。"
tags:
  - security
---

“同站”和“同源”是两个常用但也常被误解的术语。例如，在页面转换、`fetch()` 请求、Cookie、打开弹出窗口、嵌入资源和 iframe 的上下文中都会使用这两个术语。

## 来源

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="Origin", width="680", height="100" %}

“来源 (Origin)”就是[方案](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)（也称为[协议](https://developer.mozilla.org/docs/Glossary/Protocol)，例如 [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP) 或 [HTTPS](https://developer.mozilla.org/docs/Glossary/HTTPS)）、[主机名](https://en.wikipedia.org/wiki/Hostname)和[端口](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port)（如果指定）的组合。例如，假设 URL 是 `https://www.example.com:443/foo` ，则“来源”为 `https://www.example.com:443`。

### “同源”和“跨源” {：#same-origin-and-cross-origin }

方案、主机名和端口均相同的组合的网站视为“同源”，否则视为“跨源”。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>源 A</th>
        <th>源 B</th>
        <th>源 A 和源 B是否“同源”/“跨源”的解释</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>跨源：域不同</td>
      </tr>
      <tr>
        <td>https://example.com:443</td>
        <td>跨源：子域不同</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td>跨源：子域不同</td>
      </tr>
      <tr>
        <td><strong>http://www.example.com:443</strong></td>
        <td>跨源：方案不同</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td>跨源：端口不同</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>同源：完全匹配</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>同源：隐式端口号 (443) 匹配</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## 站点

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="Site", width="680", height="142" %}

顶级域 (TLD)，例如 `.com` 和 `.org` 列在[根区数据库](https://www.iana.org/domains/root/db)中。在上面的示例中，“站点”是 TLD 与它之前的域部分的组合。例如，假设 URL 是 `https://www.example.com:443/foo` ，则“站点”为 `example.com`。

但是，对于 `.co.jp` 或 `.github.io` 等域，仅使用 `.jp` 或 `.io` 的 TLD 不足以识别“站点”。同时，无法通过算法确定特定 TLD 的可注册域的级别。这就是创建“有效 TLD”(eTLD) 列表的原因。这些域在[公共后缀列表](https://wiki.mozilla.org/Public_Suffix_List)中进行定义。eTLD 列表的维护网站是 [publicsuffix.org/list](https://publicsuffix.org/list/)。

完整站点名称为 eTLD+1。例如，假设 URL 为 `https://my-project.github.io`，则 eTLD 为 `.github.io`，而 eTLD+1 则为 `my-project.github.io`，这就是一个“站点”。换句话说，eTLD+1 是有效的 TLD 加上它前面的域部分。

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### “同站”和“跨站”{：#same-site-cross-site }

eTLD+1 相同的网站被视为“同站”。eTLD+1 不同的网站则被视为“跨站”。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>源 A</th>
        <th>源 B</th>
        <th>源 A 和源 B 是否“同站”/“跨站”的解释</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>跨站：域不同</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>同站：子域不同无关紧要</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td><strong>同站：方案不同无关紧要</strong></td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>同站：端口不同无关紧要</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>同站：完全匹配</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>同站：端口无关紧要</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### “有方案同站”

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

“同站”的定义正在演变为将 URL 方案视为站点的一部分，从而防止将 HTTP 用作[弱通道](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8)。由于浏览器转变为这种解释，因此，当引述旧定义时，您可能会看到“无方案同站”之类的引用，而“[有方案同站](/schemeful-samesite/)”则是更严格的定义。在这种情况下，`http://www.example.com` 和 `https://www.example.com` 被视为跨站，因为方案不匹配。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>源 A</th>
        <th>源 B</th>
        <th>源 A 和源 B 是否是“有方案同站”的解释</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>跨站：域不同</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>有方案同站：子域不同无关紧要</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>跨站：方案不同</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>有方案同站：端口不同无关紧要</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>有方案同站：完全匹配</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>有方案同站：端口无关紧要</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## 如何检查请求是“同站”、“同源”还是“跨站”

Chrome 将请求与 `Sec-Fetch-Site` HTTP 标头一起发送。截至 2020 年 4 月，没有其他浏览器支持 `Sec-Fetch-Site`。这是更大的[获取元数据请求标头 (Fetch Metadata Request Headers)](https://www.w3.org/TR/fetch-metadata/) 提案的一部分。该标头的值为以下之一：

- `cross-site`
- `same-site`
- `same-origin`
- `none`

通过检查 `Sec-Fetch-Site` 的值，您可以确定请求是“同站”、“同源”还是“跨站”（“有方案同站”不是在 `Sec-Fetch-Site` 中获取）。

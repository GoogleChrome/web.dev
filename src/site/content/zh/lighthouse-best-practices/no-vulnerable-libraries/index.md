---
layout: post
title: 包括具有已知安全漏洞的前端 JavaScript 库
description: |2-

  了解如何通过替换具有已知漏洞的 JavaScript 库使您的页面更安全。
web_lighthouse:
  - no-vulnerable-libraries
date: 2019-05-02
updated: 2020-06-04
---

入侵者有自动网络爬虫，可以扫描您的站点查找已知的安全漏洞。网络爬虫检测到漏洞时，会向入侵者发出警报。至此，入侵者需要的便只剩下弄清楚如何利用您网站上的漏洞了。

## 此 Lighthouse 审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 可以标记具有已知安全漏洞的前端 JavaScript 库：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="Lighthouse 审计显示页面使用的具有已知安全漏洞的前端 JavaScript 库", width="800", height="190" %}</figure>

为了检测易受攻击的库，Lighthouse 会执行以下操作：

- 运行[适用于 Chrome 的库检测器](https://www.npmjs.com/package/js-library-detector)。
- [根据 snyk 的漏洞数据库](https://snyk.io/vuln?packageManager=all)检查检测到的库列表。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 停止使用不安全的 JavaScript 库

停止使用 Lighthouse 标记出的每个库。如果库发布了修复该漏洞的新版本，请升级到该版本。如果库没有发布新版本或不再维护，请考虑使用其他库。

单击报告的**库版本**列中的链接，了解有关每个库所含漏洞的更多信息。

## 资源

- [**包括具有已知安全漏洞的前端 JavaScript 库**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
- [snyk 的漏洞数据库](https://snyk.io/vuln?packageManager=all)

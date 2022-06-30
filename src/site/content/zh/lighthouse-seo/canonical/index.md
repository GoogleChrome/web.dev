---
layout: post
title: 文档没有有效的 `rel=canonical`
description: |2-

  了解“文档没有有效的 rel=canonical”Lighthouse 审计。
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - canonical
---

当多个页面具有相似的内容时，搜索引擎会将它们视为同一页面的重复版本。例如，产品页面的桌面和移动版本通常被认为是重复版本。

搜索引擎选择其中一个页面作为 *canonical* 或主要版本，然后再**抓取**一次该页面。有效的 canonical 链接可让您告诉搜索引擎要抓取页面的哪个版本并在搜索结果中向用户显示。

{% Aside 'key-term' %} *抓取*是搜索引擎更新其 Web 内容索引的方式。{% endAside %}

使用 canonical 链接有很多优点：

- 帮助搜索引擎将多个 URL 合并为一个首选 URL。例如，如果其他站点将查询参数放在指向您页面的链接的末尾，搜索引擎会将这些 URL 合并为您的首选版本。
- 简化跟踪方法。跟踪一个 URL 比跟踪多个 URL 容易。
- 通过将指向原始内容的联合链接合并回首选 URL 来提高综合内容的页面排名。

## Lighthouse 规范链接审核失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记任何具有无效 canonical 链接的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TLhOThFgDllifsEEeOH3.png", alt="Lighthouse 审计显示文档具有无效的 canonical 链接", width="800", height="76" %}</figure>

除非满足以下所有条件，否则页面将无法通过审计：

- 有不止一个 canonical 链接。
- canonical 链接不是有效的 URL。
- canonical 链接指向不同地区或语言的页面。
- canonical 链接指向不同的域。
- canonical 链接指向站点根。请注意，这种情况在某些情况下可能是有效的，例如，对于 AMP 或移动页面变体，但 Lighthouse 仍将其视为失败。

{% include 'content/lighthouse-seo/scoring.njk' %}

## 如何向您的页面添加 canonical 链接

有两个选项可用于指定 canonical 链接。

**选项 1：**将 `<link rel=canonical>` 元素添加到页面的 `<head>` 中：

```html/4
<!doctype html>
<html lang="en">
  <head>
    …
    <link rel="canonical" href="https://example.com"/>
    …
  </head>
  <body>
    …
  </body>
</html>
```

**选项 2：**向 HTTP 响应添加一个 `Link` 标头：

```html
Link: https://example.com; rel=canonical
```

有关每种方法的优缺点列表，请参阅 Google 的[合并重复的 URL](https://support.google.com/webmasters/answer/139066) 页面。

### 一般准则

- 确保 canonical URL 有效。
- 尽可能使用安全的 [HTTPS](/why-https-matters/) canonical URL 而不是 HTTP。
- 如果您根据用户的语言或国家/地区使用 [`hreflang` 链接](/hreflang)来提供不同版本的页面，请确保 canonical URL 指向相应语言或国家/地区的正确页面。
- 不要将 canonical URL 指向不同的域。雅虎和必应不允许这样做。
- 不要将较低级别的页面指向站点的根页面，除非它们的内容相同。

### Google 特定的指南

- 使用 [Google 搜索控制台](https://search.google.com/search-console/index)查看 Google 认为整个网站中哪些网址是规范的或重复的。
- 不要使用 Google 的 URL 移除工具进行规范化。该工具会从搜索中移除*所有*版本的 URL。

{% Aside 'note' %} 欢迎为其他搜索引擎提供建议。[编辑此页面](https://github.com/GoogleChrome/web.dev/blob/master/src/site/content/en/lighthouse-seo/canonical/index.md)。{% endAside %}

## 资源

- 文档的[源代码**没有有效的 `rel=canonical`** 审计](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/canonical.js)
- [rel=canonical 的 5 个常见错误](https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html)
- [合并重复的 URL](https://support.google.com/webmasters/answer/139066)
- [阻止对参数化重复内容的抓取](https://support.google.com/webmasters/answer/6080548)
- [Google 搜索控制台](https://search.google.com/search-console/index)

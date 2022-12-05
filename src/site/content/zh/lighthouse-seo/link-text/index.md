---
layout: post
title: 链接没有描述性文本
description: |2-

  了解“链接没有描述性文本”Lighthouse 审计。
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - link-text
---

链接文本是超链接中可点击的单词或短语。当链接文本清楚地传达超链接的目标时，用户和搜索引擎都可以更轻松地了解您的内容以及它与其他页面的关系。

## Lighthouse 链接文本审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 标记没有描述性文本的链接：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hiv184j4TFNCsmqTCTNY.png", alt="显示链接没有描述性文本的 Lighthouse 审计", width="800", height="191" %}</figure>

Lighthouse 标记以下通用链接文本：

- `click here`
- `click this`
- `go`
- `here`
- `this`
- `start`
- `right here`
- `more`
- `learn more`

{% include 'content/lighthouse-seo/scoring.njk' %}

## 如何添加描述性链接文本

用具体的描述替换诸如“点击此处”和“了解更多”之类的通用短语。通常，编写链接文本，明确指出用户点击超链接后将获得什么类型的内容。

```html
<p>To see all of our basketball videos, <a href="videos.html">click here</a>.</p>
```

{% Compare 'worse', 'Don\'t' %}“点击此处”并不能表明超链接会将用户带到何处。 {% endCompare %}

```html
<p>Check out all of our <a href="videos.html">basketball videos</a>.</p>
```

{% Compare 'better', 'Do' %}“篮球视频”则会明确表示超链接会将用户带到一个视频页面。 {% endCompare %}

{% Aside %}您经常需要修改周围的句子以使链接文本具有描述性。 {% endAside %}

## 链接文本最佳实践

- 紧扣主题。不要使用与页面内容无关的链接文本。
- 不要使用页面的 URL 作为链接描述，除非您有充分的理由这样做，例如引用站点的新地址。
- 让描述简洁。瞄准几个词或一个短语。
- 也要注意您的内部链接。提高内部链接的质量可以帮助用户和搜索引擎更轻松地浏览您的网站。

有关更多提示，请参阅 Google [搜索引擎优化 (SEO) 入门指南](https://support.google.com/webmasters/answer/7451184#uselinkswisely)的[明智地使用链接](https://support.google.com/webmasters/answer/7451184)部分。

## 资源

- [**链接没有描述性文本**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/link-text.js)
- [搜索引擎优化 (SEO) 入门指南](https://support.google.com/webmasters/answer/7451184)

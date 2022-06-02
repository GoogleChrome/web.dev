---
layout: post
title: 文档没有描述标签
description: 了解 Lighthouse 的“文档没有描述标签”审计。
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - meta-description
---

`<meta name="description">` 元素提供搜索引擎在搜索结果中展示的页面内容摘要。高质量、独特的描述标签可以提高您的网页相关性，提高您的搜索流量。

## Lighthouse 描述标签审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记出没有描述标签的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="显示文档没有描述标签的 Lighthouse 审计", width="800", height="74" %}</figure>

若出现以下情况，审计将失败：

- 页面没有设置 `<meta name=description>` 元素。
- `<meta name=description>` 元素的 `content` 属性为空。

Lighthouse 并不会评估描述的质量。

{% include 'content/lighthouse-seo/scoring.njk' %}

## 如何添加描述标签

为每个页面的 `<head>` 添加 `<meta name=description>` 元素：

```html
<meta name="description" content="Put your description here.">
```

如适用，请在描述中提供明确标记的事实。例如：

```html
<meta name="description" content="Author: A.N. Author,
    Illustrator: P. Picture, Category: Books, Price: $17.99,
    Length: 784 pages">
```

## 描述标签最佳实践

- 为每个页面使用唯一的描述。
- 使描述尽量清晰简洁。避免诸如“主页”之类的模糊描述。
- 避免[关键字堆砌](https://support.google.com/webmasters/answer/66358)。这对用户没有帮助，搜索引擎可能会将页面标记为垃圾信息。
- 描述不必是完整的句子；它们可以包含结构化数据。

下面列出了优秀与不合格的描述示例：

{% Compare 'worse' %}

```html
<meta name="description" content="A donut recipe.">
```

{% CompareCaption %} 太模糊了。 {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```html
<meta
  name="description"
  content="Mary's simple recipe for maple bacon donuts
           makes a sticky, sweet treat with just a hint
           of salt that you'll keep coming back for.">
```

{% CompareCaption %} 内容明确而简洁。 {% endCompareCaption %} {% endCompare %}

要查看更多技巧，请参阅 Google 的[《在搜索结果中创建优秀的标题和摘要》](https://support.google.com/webmasters/answer/35624#1)一文。

## 资源

- [**文档没有描述标签**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
- [在搜索结果中创建优秀的标题和摘要](https://support.google.com/webmasters/answer/35624#1)
- [不相关的关键词](https://support.google.com/webmasters/answer/66358)

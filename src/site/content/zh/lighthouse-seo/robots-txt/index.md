---
layout: post
title: "`robots.txt` 无效"
description: |2-

  了解“robots.txt 无效”Lighthouse 审计。
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robots-txt
---

`robots.txt` 文件告诉搜索引擎可以抓取您网站的哪些页面。`robots.txt` 配置无效会导致两类问题：

- 阻止搜索引擎抓取公共页面，从而导致您的内容在搜索结果中出现的次数减少。
- 可能导致搜索引擎抓取您可能不希望显示在搜索结果中的页面。

## Lighthouse `robots.txt` 审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 可以标记无效的 `robots.txt` 文件：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="Lighthouse 审计显示无效的 robots.txt", width="800", height="203" %}</figure>

{% Aside %} 大多数 Lighthouse 审计仅适用于您当前所在的页面。但是，由于 `robots.txt` 是在主机名级别定义的，因此该审计适用于您的整个域（或子域）。 {% endAside %}

在报告中展开 **`robots.txt` 无效**审计以了解您的 `robots.txt` 有什么问题。

常见错误包括：

- `No user-agent specified`
- `Pattern should either be empty, start with "/" or "*"`
- `Unknown directive`
- `Invalid sitemap URL`
- `$ should only be used at the end of the pattern`

Lighthouse 不检查您的 `robots.txt` 文件是否位于正确的位置。该文件必须位于您的域或子域的根目录中，才能正常运行。

{% include 'content/lighthouse-seo/scoring.njk' %}

## 如何解决 `robots.txt` 的问题

### 确保`robots.txt`不返回 HTTP 5XX 状态代码

如果您的服务器针对 `robots.txt` 返回服务器错误（500 秒内[的 HTTP 状态代码](/http-status-code)），搜索引擎不知道应该抓取哪些页面，而可能会停止抓取您的整个网站，这会阻止将新内容编入索引。

要检查 HTTP 状态代码，在 Chrome 中打开 `robots.txt` 并[在 Chrome DevTools 中检查请求](https://developer.chrome.com/docs/devtools/network/reference/#analyze)。

### 保持`robots.txt`小于 500 KiB

如果文件大于 500 KiB，搜索引擎可能会中途停止处理 `robots.txt`，这可能会扰乱搜索引擎，从而导致网站的错误抓取。

为了保持 `robots.txt` 较小的大小，少关注个别已排除的页面，多关注更广泛的模式。例如，如果您需要阻止抓取 PDF 文件，不要禁止每个单独的文件。相反，使用 `disallow: /*.pdf` 禁止所有包含  `.pdf` 的 URL。

### 修复格式错误

- `robots.txt` 中只允许匹配 "name: value" 格式的空行、注释和指令。
- 确保 `allow` 值和 `disallow` 值为空或以 `/` 或 `*` 开头。
- 不要在值中间使用 `$`（例如，`allow: /file$html`）。

#### 确保 `user-agent` 具有值

用户代理名称告知搜索引擎抓取程序要遵循哪些指令。必须为 `user-agent` 的每个实例提供一个值，以便搜索引擎知道是否遵循相关的指令集。

要指定特定的搜索引擎抓取程序，请使用其发布列表的用户代理名称。 （例如，这里是 [Google 用于抓取的用户代理列表](https://support.google.com/webmasters/answer/1061943)。）

使用 `*` 匹配不符合所有其他条件的抓取程序。

{% Compare 'worse', 'Don\'t' %}

```text
user-agent:
disallow: /downloads/
```

未定义用户代理。 {% endCompare %}

{% Compare 'better', 'Do' %}

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```

定义了一般用户代理和 `magicsearchbot` 用户代理。 {% endCompare %}

#### 确保在 `user-agent` 之前没有 `allow` 或 `disallow` 指令

用户代理名称定义了 `robots.txt` 文件的各个部分。搜索引擎抓取程序使用这些部分来确定要遵循哪些指令。*在*第一个用户代理名称之前放置一个指令意味着没有抓取程序会跟踪它。

{% Compare 'worse', 'Don\'t' %}

```text
# start of file
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```

没有搜索引擎抓取程序会读取 `disallow: /downloads` 指令。 {% endCompare %}

{% Compare 'better', 'Do' %}

```text
# start of file
user-agent: *
disallow: /downloads/
```

禁止所有搜索引擎抓取 `/downloads` 文件夹。 {% endCompare %}

搜索引擎抓取程序仅遵循具有最具体用户代理名称的部分中的指令。例如，如果您有 `user-agent: *` 和 `user-agent: Googlebot-Image` 的指令，Googlebot Image 只遵循 `user-agent: Googlebot-Image` 部分中的指令。

#### 为 `sitemap` 提供绝对 URL

[Sitemap](https://support.google.com/webmasters/answer/156184) 文件是让搜索引擎了解您网站上的页面的好方法。Sitemap 文件通常包含您网站上的 URL 列表，以及有关它们上次更改时间的信息。

如果您选择在`robots.txt`提交 sitemap 文件，请确保使用[绝对 URL](https://tools.ietf.org/html/rfc3986#page-27) 。

{% Compare 'worse', 'Don\'t' %}

```text
sitemap: /sitemap-file.xml
```

{% endCompare %}

{% Compare 'better', 'Do' %}

```text
sitemap: https://example.com/sitemap-file.xml
```

{% endCompare %}

## 资源

- [**`robots.txt` 无效**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/robots-txt.js)
- [创建`robots.txt file`](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [Robots 元标签和 X-Robots-Tag HTTP 标头规范](https://developers.google.com/search/reference/robots_meta_tag)
- [了解站点地图](https://support.google.com/webmasters/answer/156184)
- [Google 抓取工具（用户代理）](https://support.google.com/webmasters/answer/1061943)

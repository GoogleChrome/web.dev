---
layout: post
title: 如何出色的提交浏览器错误
subhead: 将您在浏览器中发现的问题报告给浏览器供应商是帮助网络平台变得更好的一个重要组成部分！
authors:
  - robertnyman
  - petelepage
date: 2020-06-15
updated: 2020-06-15
description: 将您在特定设备或平台上使用浏览器时发现的问题报告给浏览器供应商是帮助网络平台变得更好的重要组成部分！
tags:
  - blog
---

出色地提交错误并不难，但需要一些工作。目标是轻松找到出错的地方，找到根本原因，最重要的是找到修复它的方法。容易重现和具有明确预期行为的错误往往会取得修复方面的快速进展。

## 验证错误

第一步是弄清楚“正确”的行为应该是什么。

### 什么是正确的行为？

在[MDN](https://developer.mozilla.org/) 上查看相关的 API 文档，或尝试查找相关规范。此信息可帮助您确定实际出错的 API、出错的位置以及预期的行为。

### 错误在不同的浏览器中发生吗？

浏览器之间不同的行为通常作为互操作性问题优先考虑，特别是当包含错误的浏览器是旧版的浏览器时。尝试在最新版的 Chrome、Firefox、Safari 和 Edge 上进行测试，可使用 [BrowserStack](https://www.browserstack.com/)等工具。

如果可能，请检查页面是否因用户代理探查而故意表现不同。在 Chrome DevTools 中，尝试[将 `User-Agent` 字符串设置为其他浏览器](https://developer.chrome.com/docs/devtools/device-mode/override-user-agent/)。

### 错误在最近的版本中发生吗？

错误在过去没有发生过，只是在最近的浏览器版本中发生？这种“回归”可以更快地采取行动，特别是如果您提供有效的版本号和失败的版本号。[BrowserStack](https://www.browserstack.com/) 等工具可以轻松检查旧的浏览器版本，而[bisect-builds 工具](https://www.chromium.org/developers/bisect-builds-py)（用于 Chromium）可以非常有效地搜索更改。

如果问题是回归问题并且可以重现，则通常可以快速找到并修复根本原因。

### 其他人是否看到了同样的问题？

如果您遇到问题，其他开发人员也很有可能遇到问题。首先，尝试在 [Stack Overflow](http://stackoverflow.com/) 上搜索相关错误。这可能会帮助您将抽象问题转化为特定的错误 API，并且可能会帮助您找到短期解决方法，直到修复错误。

## 相关错误之前有被报告过吗？

一旦您了解了错误是什么，就可以通过搜索浏览器错误数据库来检查是否已经有人报告过相关错误。

- 基于 Chromium 的浏览器：[https://crbug.com](https://crbug.com/)
- 火狐：[https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- 基于 Safari 和 WebKit 的浏览器：[https://bugs.webkit.org/](https://bugs.webkit.org/)

如果您发现描述该问题的现有错误，请为该错误加星标、收藏或评论，从而贡献您的支持。另外，在许多站点上，您可以将自己添加到 CC 列表中，这样在错误得到更改时您会获取更新信息。

如果您决定对相关错误发表评论，请提供有关错误如何影响您网站的信息。避免添加“+1”样式的评论，因为错误跟踪器通常会为每个评论发送电子邮件。

## 报告错误

如果相关错误之前没有被报告过，请将其告诉浏览器供应商。

### 创建最小规模的测试用例 {: #minified-test-case }

Mozilla 有一篇关于[如何创建最小规模测试用例](https://developer.mozilla.org/docs/Mozilla/QA/Reducing_testcases)的出色文章。长话短说，虽然对问题进行描述是不错的开始，但提供有关出现问题的错误的演示就更棒了。为了最大限度地提高快速修复进展的机会，示例应该包含演示问题所需的最少代码。最少代码示例是您提高修复错误几率的首要举措。

以下是最小化测试用例的一些技巧：

- 下载网页，添加 [`<base href="https://original.url">`](https://developer.mozilla.org/docs/Web/HTML/Element/base) 并验证本地是否存在该错误。如果 URL 使用 HTTPS，这可能需要实时 HTTPS 服务器。
- 在尽可能多的浏览器的最新版本上测试本地文件。
- 尝试将所有内容压缩为 1 个文件。
- 删除代码（从您知道的那些不必要的东西开始）直到错误消失。
- 使用版本控制，以便您可以保存工作并撤消错误操作。

#### 托管一个缩小的测试用例

如果您正在寻找良好的位置用来托管您的缩小测试用例，有几个好位置可供选择：

- [Glitch](https://glitch.com)
- [JSBin](https://jsbin.com)
- [JSFiddle](https://jsfiddle.net)
- [CodePen](https://codepen.io)

请注意，其中一些站点在 iframe 中显示内容，这可能会导致功能或错误的行为不同。

## 提交您的问题

一旦您获得了最小化的测试用例，您就可以准备提交该错误。前往正确的错误跟踪站点，并创建一个新问题。

- 基于 Chromium 的浏览器 - [https://crbug.com/new](https://crbug.com/new)
- 火狐 - [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- 基于 Safari 和 WebKit 的浏览器 - [https://bugs.webkit.org/](https://bugs.webkit.org/)

### 提供清晰的描述和重现问题所需的步骤

首先，提供清晰的描述，以帮助工程师快速了解问题所在并帮助对问题进行分类。

```text
When installing a PWA using the `beforeinstallprompt.prompt()`, the
`appinstalled` event fires before the call to `prompt()` resolves.
```

接下来，提供重现问题所需的详细步骤。这时您的[缩小测试用例](#minified-test-case)将配上用场。

```text
What steps will reproduce the problem?
1. Go to https://basic-pwa.glitch.me/, open DevTools and look at the
   console tab.
2. Click the Install button in the page, you might need to interact with
   the page a bit before it becomes enabled.
3. Click Install on the browser modal install confirmation.
```

最后，描述*实际的*和*预期的*结果。

```text
What is the actual result? In the console:
0. INSTALL: Available (logged when `beforeinstallprompt` event fired)
1. INSTALL: Success (logged when `appinstalled` event fired)
2. INSTALL_PROMPT_RESPONSE: {outcome: "accepted", platform: "web"}
   (logged when beforeinstallprompt.prompt()` resolves)

What is the expected result? In the console:
0. INSTALL: Available (logged when `beforeinstallprompt` event fired)
1. INSTALL_PROMPT_RESPONSE: {outcome: "accepted", platform: "web"}
   (logged when beforeinstallprompt.prompt()` resolves)
2. INSTALL: Success (logged when `appinstalled` event fired)
```

有关更多信息，请查看 MDN 上的[错误报告编写指南。](https://developer.mozilla.org/docs/Mozilla/QA/Bug_writing_guidelines)

#### 额外好处：添加问题的屏幕截图或截屏视频

虽然不是必需的，但在某些情况下，添加问题的屏幕截图或截屏视频会很有帮助。这在错误可能需要一些步骤来重现时特别有用。能够通过截屏视频或屏幕截图看到所发生的事情通常会很有帮助。

### 包括环境细节

有些错误只能在某些操作系统上重现，或者只能在特定类型的显示器上重现（例如，低 dpi 或高 dpi）。请务必包含您使用的任何测试环境的详细信息。

### 提交错误

最后，提交错误。之后，记得关注您的电子邮件，以获取对错误的任何回复。通常在调查期间和修复错误时，工程师可能有其他问题，或者如果他们难以重现问题，他们可能会联系您。

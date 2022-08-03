---
layout: post
title: 将浏览器错误记录到控制台
description: 了解如何识别和解决浏览器错误。
web_lighthouse:
  - errors-in-console
date: 2019-05-02
updated: 2019-08-28
---

大多数浏览器都附带内置的开发人员工具。这些工具通常都有[控制台](https://developer.chrome.com/docs/devtools/console/)。控制台可以提当前运行页面的信息。

控制台中记录的消息来自构建页面的 Web 开发人员或浏览器。所有控制台消息都有一个严重性级别：`Verbose`、`Info`、`Warning` 或 `Error`。`Error` 消息表示页面中有需要解决的问题。

## Lighthouse 浏览器错误审核为何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记记录到控制台的所有浏览器错误：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AjfKRZm8E4ZUi2QvQtL3.png", alt="显示控制台中的浏览器错误的 Lighthouse 审核", width="800", height="247" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 如何解决浏览器错误

解决 Lighthouse 报告的每个浏览器错误，确保页面对所有用户按预期运行。

Chrome DevTools 提供了一些可帮助您跟踪错误原因的工具：

- 在每个错误的文本下方，DevTools 控制台会显示导致有问题的代码执行的[调用堆栈](https://developer.mozilla.org/docs/Glossary/Call_stack)。
- 每个错误右上角的链接会显示导致错误的代码。

例如，下面的截屏显示了一个有两个错误的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KBP4iOO12CqHURgmjxaY.png", alt="Chrome DevTools 控制台中的错误示例", width="800", height="505" %}</figure>

在上述示例中，第一个错误来自 Web 开发人员对 [`console.error()`](https://developer.chrome.com/docs/devtools/console/api/#error) 的调用。第二个错误来自浏览器，指示页面脚本之一使用的一个变量不存在。

在每个错误的文本下方，DevTools 控制台会指示出现错误的调用堆栈。例如，对于第一个错误，控制台指示一个 `(anonymous)` 函数调用了 `init` 函数，而后者则调用了 `doStuff` 函数。单击 `pen.js:9` 链接可显示相关代码。

这样，您就可以查看每个错误的相关代码，从而识别和解决可能存在的问题。

如果您无法确定错误的原因，请尝试将错误文本输入搜索引擎。如果找不到问题的解决方案，请尝试在 [Stack Overflow](https://stackoverflow.com) 上提问。

如果无法解决错误，请考虑将其包装在 [`try…catch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) 语句中，从而在代码中明确指出您已意识到此问题。要更好地处理错误，您还可以使用 `catch` 块。

## 资源

- [**将浏览器错误记录到控制台**审核的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/errors-in-console.js)
- [控制台概览](https://developer.chrome.com/docs/devtools/console/)
- [堆栈溢出](https://stackoverflow.com/)
- [try…catch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch)

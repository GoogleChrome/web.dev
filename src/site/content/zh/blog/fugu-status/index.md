---
layout: post
title: 新功能状态
subhead: Web 应用理应能够执行任何 iOS/Android/桌面应用可以执行的操作。跨公司能力项目的成员希望让您能够在开放的 Web 上构建和交付以前从未实现过的应用。
date: 2018-11-12
updated: 2021-11-04
tags:
  - blog
  - capabilities
---

<figure data-float="right"> {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/uIIvM9xocYkjmBfHSrJE.svg", alt="一只河豚，Project Fugu 的标志", width="150", height="150" %}</figure>

[功能项目](https://developers.google.com/web/updates/capabilities)是一项跨公司的工作，其目标是让 Web 应用可以执行 iOS/Android/桌面应用可以执行的任何操作，方法是将这些平台的功能赋予 Web 平台，同时维护用户的安全性、隐私和信任，以及 Web 的其他核心原则。

这项工作使 [Adobe 能够将 Photoshop 引入网络](/ps-on-the-web/)、[Excalidraw 弃用他们的 Electron 应用](/deprecating-excalidraw-electron/)、[Betty Crocker 将购买意向指标提高了 300%](/betty-crocker/)，这样的例子比比皆是。

您可以在[Fugu API Tracker](https://goo.gle/fugu-api-tracker) 上查看新功能和潜在功能的完整列表以及每个提案所处的阶段。值得注意的是，许多想法从未通过解释器或初始试验阶段。该过程的目标是发布正确的功能。这意味着我们需要快速学习和迭代。如果某个功能不能解决开发人员的需求，对其不进行发布是允许的。

## 稳定可用的功能 {: #in-stable }

以下 API 已通过初始试用，可在最新版本的 Chrome 中使用，并且在许多情况下可用于其他基于 Chromium 的浏览器。

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#shipped">所有已经发布的 API</a>

## 可进行初始试用的功能 {: #origin-trial }

这些 API 可在 Chrome 中进行[初始试用](https://developers.chrome.com/origintrials/#/trials/active)。初始试用为 Chrome 提供验证实验性功能和 API 的机会，并使您可以提供有关它们在更广泛部署中的可用性和有效性的反馈。

选择加入初始试用，可让您在试用期间为试用版测试用户构建他们试用的演示和原型，而无需他们在浏览器中翻转任何标志。尽管通常比标志后面的可用功能（见下文）更稳定，但 API 表面仍然可能根据您的反馈进行更改。有关初始试用的更多信息，请参阅[面向 Web 开发人员的初始试用指南](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)。

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#origin-trial">当前处于初始试用阶段的所有 API</a>

## 标志后面可用的功能 {: #flag }

这些 API 仅在标志后面可用。它们是实验性的，仍在开发中。它们还没有准备好用于生产。很有可能存在错误，这些 API 会损坏，或者 API 表面会发生变化。

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#developer-trial">当前处于标志之后的所有 API </a>

## 已着手开始创建的功能 {: #started }

这些 API 的工作才刚刚开始。目前还没有太多可看的，但感兴趣的开发人员可能希望为相关的 Chromium 错误加注星标，以随时了解正在取得的进展。

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#started">已着手开始创建的所有 API</a>

## 正在考虑的功能 {: #under-consideration }

这是我们累积的尚未获得的 API 和想法。值得为相关的 Chromium 错误加注星标以投票支持某个功能，并将在工作开始后发送通知。

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#under-consideration">正在考虑的所有 API</a>

## 建议新功能 {: #suggest-new }

您有对 Chromium 功能方面的建议吗？请提交[新功能请求](https://goo.gl/qWhHXU)来告诉我们。请提供尽可能多的详细信息，例如您尝试解决的问题、建议的用例以及任何其他可能有帮助的内容。

{% Aside %} 想尝试其中的一些新功能吗？请查看[Web 功能代码实验室](https://developers.google.com/codelabs/project-fugu#0)。 {% endAside %}

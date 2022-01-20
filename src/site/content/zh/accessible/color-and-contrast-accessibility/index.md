---
layout: post
title: 颜色和对比度辅助功能
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: 如果您有良好的视力，很容易假设每个人都能像您一样感知颜色或阅读文本 — 当然，事实并非如此。
tags:
  - accessibility
---

如果您有良好的视力，很容易假设每个人都能像您一样感知颜色或阅读文本 — 当然，事实并非如此。

您可以想象到，一些颜色组合对于某些人来说很容易区分，而对另一些人则很难或无法识别。这通常归结于颜色对比度，即前景色和背景色亮度之间的关系。当两种颜色相似时，对比度低；当两种颜色不同时，对比度高。

[WebAIM 准则](https://webaim.org/standards/wcag/)建议所有文本的 AA（最低）对比度为 4.5:1。一个例外是非常大的文本（比默认正文文本大 120-150%），其对比度可以降至 3:1。注意下面显示的对比度的差异。

<figure>{% Img src="image/admin/DcYclKelVqhQ2CWlIG97.jpg", alt="显示不同对比度的图像", width="800", height="328" %}</figure>

为 AA 级选择 4.5:1 对比度的原因是，它可以补偿视力只有大约 20/40 的视觉损伤用户通常会经历的对比灵敏度损失。据报道，20/40 通常是 80 岁人群的典型视力。对于低视觉障碍或色觉缺陷的用户，我们可以将正文文本的对比度提高到 7:1。

您可以使用 Lighthouse 中的 Accessibility 审计来检查颜色对比度。打开 DevTools，点击 Audits（审计），然后选择 Accessibility（辅助功能）运行报告。

<figure>{% Img src="image/admin/vSFzNourQO6z2xV6qWuW.png", alt="颜色对比度审计的输出截图。", width="800", height="218" %}</figure>

Chrome 还包括一项实验性功能，可帮助您[检测页面上的所有低对比度文本](https://developers.google.com/web/updates/2020/10/devtools#css-overview)。您还可以使用[无障碍颜色建议](https://developers.google.com/web/updates/2020/08/devtools#accessible-color)来修复低对比度文本。

<figure>{% Img src="image/admin/VYZeK2l2vs6pIoWhH2hO.png", alt="Chrome 低对比度文本实验性功能的输出截图。", width="800", height="521" %}</figure>

要获得更完整的报告，请安装 [Accessibility Insights 扩展](https://accessibilityinsights.io/)。 Fastpass 报告中的一项检查是颜色对比度。您将获得任何未通过审计的元素的详细报告。

<figure>{% Img src="image/admin/CR21TFMZw8gWsSTWOGIF.jpg", alt="Accessibility Insights 中的报告", width="800", height="473" %}</figure>

## 高级感知对比度算法 (APCA)

[高级感知对比度算法 (APCA)](https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html) 是一种基于现代色彩感知研究来计算对比度的新方法。

与 [AA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum)/[AAA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-enhanced) 准则相比，APCA 更加与上下文相关。

对比度的计算基于以下特征：

- 空间属性（字体粗细和文本大小）
- 文本颜色（文本和背景之间的感知亮度差异）
- 上下文（环境光、周围环境和文本的预期目的）

Chrome 包含一项[实验性功能，可将 AA/AAA 对比度准则替换为 APCA](https://developers.google.com/web/updates/2021/01/devtools#apca)。

<figure>{% Img src="image/admin/YhGKRLYvt37j3ldlwiXE.png", alt="Chrome 中 APCA 功能的输出截图。", width="800", height="543" %}</figure>

## 不要只用颜色来传达信息

全世界大约 3.2 亿人有色觉缺陷。大约每 12 名男性和 200 名女性中就有 1 人患有某种形式的“色盲”；这意味着大约 1/20 或 5% 的用户无法按您预期的方式体验您的网站。当我们依靠颜色来传达信息时，这个数字会达到不可接受的水平。

{% Aside %} 注意：术语“色盲”通常用于描述辨别颜色有困难的人的视觉状况，但实际上很少有人真正是色盲。大多数有颜色缺陷的人可以看到部分或大多数颜色，但难以区分某些颜色，例如红色和绿色（最常见）、棕色和橙色以及蓝色和紫色。{% endAside %}

例如，在输入表单中，电话号码可能带有红色下划线以表示其无效。但是对于有颜色缺陷或使用屏幕阅读器的用户来说，该信息并不能很好地传达。因此，您应该始终设法为用户提供多种途径来获取关键信息。

<figure style="width: 200px">{% Img src="image/admin/MKmlhejyjNpk7XE9R2KV.png", alt="电话号码错误的输入表单仅用红色突出显示。", width="293", height="323" %}</figure>

[WebAIM 清单的第 1.4.1 节指出](https://webaim.org/standards/wcag/checklist#sc1.4.1)，“不应将颜色用作传达内容或区分视觉元素的唯一方法”，而且“不应只使用颜色来区分链接与周围文本”，除非它们满足特定对比度要求。该清单建议添加下划线等附加指示符（使用 CSS `text-decoration` 属性）来指示链接何时处于活动状态。

修正上一个示例的一个简单方法是向该字段添加一条附加消息，声明其无效以及原因。

<figure style="width: 200px">{% Img src="image/admin/FLQPcG16akNRoElx3pnz.png", alt="与上一个示例相同的输入表单，但这次有一个文本标签指示字段存在问题。", width="292", height ="343" %}</figure>

在构建应用程序时，请牢记这些事项，并注意可能过于依赖颜色来传达重要信息的区域。

如果您对网站在不同人眼中的外观感到好奇，或者您在很大程度上依赖 UI 中的颜色使用，可以使用 DevTools 来模拟各种形式的视觉障碍，包括不同类型的色盲。Chrome 包括一个[模拟视觉缺陷功能](https://developers.google.com/web/updates/2020/03/devtools#vision-deficiencies)。要访问该功能，请打开 DevTools，然后打开抽屉中的 **Rendering**（渲染）选项卡，即可模拟以下颜色缺陷。

- 红色盲：无法感知任何红光。
- 绿色盲：无法感知任何绿光。
- 蓝色盲：无法感知任何蓝光。
- 全色盲：无法感知除灰色阴影之外的任何颜色（极其罕见）。

<figure>{% Img src="image/admin/VAnFxYhzFcpovdTCToPl.jpg", alt="模拟全色盲患者的视觉，以灰度显示我们的页面。", width="800", height="393" %}</figure>

## 高对比度模式

高对比度模式允许用户反转前景色和背景色，这通常有助于更好地突出文本。对于低视觉障碍的人，使用高对比度模式可以更容易浏览页面上的内容。有几种方法可以在计算机上实现高对比度设置。

Mac OSX 和 Windows 等操作系统提供了高对比度模式，可以在系统级别为所有内容启用该模式。

一个有用的练习是打开高对比度设置并验证应用程序中的所有 UI 是否仍然可见和可用。

例如，导航栏可能只是轻微改变背景颜色来指示当前选择了哪个页面。如果在高对比度扩展中查看，这种细微差别就会完全消失，读者也无法了解到哪个页面处于活动状态。

<figure style="width: 500px">{% Img src="image/admin/dgmA4W1Qu8JmcgsH80HD.png", alt="高对比度模式下的导航栏截图，其中难以分辨活动的标签页", width="640", height="57" %}</figure>

同样，如果考虑上一课中的示例，无效电话号码字段上的红色下划线可能以难以区分的蓝绿色显示。

<figure>{% Img src="image/admin/HtlXwmHQHBcAO4LYSfAA.jpg", alt="先前使用的地址表单截图，这次是在高对比度模式下。无效元素的颜色变化很难看清。", width="700", height="328" %}</figure>

如果您达到了前面介绍的对比度准则，那么在支持高对比度模式方面应该没有问题。但是为了让您更安心，请考虑安装[高对比度 Chrome 扩展程序](https://chrome.google.com/webstore/detail/high-contrast/djcfdncoelnlbldjfhinnjlhdjlikmph)并检查一遍页面，以确认一切正常并按预期显示。

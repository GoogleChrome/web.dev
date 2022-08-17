---
title: 核心 Web 指标的测量工具
subhead: 您最喜欢的开发者工具现在已可以测量核心 Web 指标。
authors:
  - addyosmani
  - egsweeny
date: 2020-05-28
description: 阅读最新发布的热门网络开发者工具支持核心 Web 指标测量的相关内容，其中包括灯塔、PageSpeed Insights 网页速度测量工具、Chrome 用户体验报告等众多工具。
hero: image/admin/wNtXgv1OE2OETdiSzi8l.png
thumbnail: image/admin/KxBRBQe5CRZpCxNYyW2H.png
alt: Chrome 用户体验标志、PageSpeed Insights 标志、灯塔标志、搜索控制台标志、Chrome 开发者工具标志、Web 指标扩展程序标志。
tags:
  - blog
  - web-vitals
  - performance
---

近期宣布的 [Web 指标](/vitals/)计划为网络质量信号提供统一指导，这些信号对于所有网站提供出色的网络用户体验至关重要。我们很高兴地宣布，**Google 为网络开发者提供的所有热门工具现在都支持核心 Web 指标的测量**，从而帮助您更轻松地诊断和修复用户体验问题。这些工具包括[灯塔](https://github.com/GoogleChrome/lighthouse)、[PageSpeed Insights](https://pagespeed.web.dev/)、[Chrome 开发者工具](https://developer.chrome.com/docs/devtools/)、[搜索控制台](https://search.google.com/search-console/about)、[web.dev 测量工具](/measure/)、[Web 指标 Chrome 扩展程序](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)和一个全新的 (!) [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/) API。

由于 Google 搜索现在将核心 Web 指标作为评估 [页面体验](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html) 的基础，因此在最大程度上实现这些指标的可用性和可操作性就变得至关重要。

<figure>
  {% Img src="image/admin/V00vjrHmwzljYo04f3d3.png", alt="支持各项核心 Web 指标的 Chrome 和搜索工具摘要", width="800", height="509" %}
</figure>

{% Aside 'key-term' %} **实验室工具**可以用于深入了解*潜在用户*可能会如何体验您的网站，并提供可重现的结果，便于调试。**实际**工具可以深入了解您的*真实用户*是如何体验您的网站的。这类测量方式通常被称为真实用户监控 (RUM)。各个[实验室或实际工具](/how-to-measure-speed/#lab-data-vs-field-data)都为您的用户体验优化提供了独特的价值。{% endAside %}

要开启使用核心 Web 指标优化用户体验的旅程，您可以尝试以下工作流程：

- 使用搜索控制台的全新核心 Web 指标报告来确定需要重点关注的页面组（基于实际数据）。
- 确定需要进行处理的页面后，使用 PageSpeed Insights（由灯塔和 Chrome 用户体验报告提供支持）来诊断页面上的实验室问题和实际问题。PageSpeed Insights (PSI) 可以通过搜索控制台进行使用，或者您也可以直接在 PSI 中输入网址。
- 准备好在实验室中对您的网站进行本地优化了吗？使用灯塔和 Chrome 开发者工具来测量核心 Web 指标，并获得关于具体修复内容的可操作指导。 Web 指标 Chrome 扩展程序可以让您在桌面上实时查看各项指标。
- 需要核心 Web 指标的自定义仪表板？在实际数据上使用更新的 CrUX 仪表板或全新的 Chrome 用户体验报告 API，或者在实验室数据上使用 PageSpeed Insights API。
- 寻求指导？web.dev/measure 可以对您的页面进行测量，并使用 PSI 数据向您显示一组建议优先考虑的优化指南和代码实验室。
- 最后，在将变更部署到生产环境前，对拉取请求使用灯塔 CI，确保核心 Web 指标中没有回归。

看完了这些介绍，我们现在就来深入了解各个工具的具体更新！

### 灯塔

灯塔是一款自动化网站审计工具，可以帮助开发者诊断问题并发掘改善网站用户体验的机会。这款工具在实验室环境中测量用户体验质量的多个维度，包括性能和可访问性。灯塔的最新版本（[6.0](/lighthouse-whats-new-6.0/)，于 2020 年 5 月中旬发布）中包括额外的审计项、新指标和新的性能分数组成。

<figure>{% Img src="image/admin/4j72CWywp2D88Xti8zBf.png", alt="灯塔 6.0 显示最新的核心 Web 指标", width="800", height="527" %}</figure>

灯塔 6.0 在报告中引入了三项新指标。其中，[Largest Contentful Paint 最大内容绘制](/lcp/) (LCP) 和 [Cumulative Layout Shift 累积布局偏移](/cls/) (CLS) 这两项新指标是核心 Web 指标的实验室执行指标，为优化用户体验提供了重要的诊断信息。鉴于这些指标对评估用户体验的重要性，我们不仅会对新指标进行测量并将结果包含在报告中，还会在计算性能分数时将其考虑在内。

灯塔中包含的第三项新指标为 [Total Blocking Time 总阻塞时间](/tbt/) (TBT)，该项指标与 [First Input Delay 首次输入延迟](/fid/) (FID) 密切相关，后者是核心 Web 指标中的另一项实际指标。遵循灯塔报告中提供的建议并根据您的分数进行优化就可以使您为您的用户提供最佳体验。

灯塔支持的所有产品都依照最新版本进行了更新，其中也包括[灯塔 CI](https://github.com/GoogleChrome/lighthouse-ci)。该产品使您能够在合并和部署拉取请求前轻松测量核心 Web 指标。

<figure>{% Img src="image/admin/aOm5ZAIUbspjcyRMIXbn.png", alt="灯塔 CI 显示针对最大内容绘制的差异视图", width="800", height="498" %}</figure>

如需进一步了解灯塔最新更新的相关信息，请查看我们的[灯塔 6.0 新增功能](/lighthouse-whats-new-6.0/)博文。

### PageSpeed Insights 网页速度测量工具

[PageSpeed Insights](https://pagespeed.web.dev/) (PSI) 对页面在移动和桌面设备上的实验室性能和实际性能进行报告。该工具提供真实用户的页面体验概览（由 Chrome 用户体验报告提供支持）以及一系列关于网站所有者要如何改善页面体验的可操作建议（由灯塔提供支持）。

PageSpeed Insights 和 [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) 也已升级为在底层使用灯塔 6.0，而且目前支持在报告的实验室和实际部分测量核心 Web 指标！核心 Web 指标由蓝丝带进行了标识，如下图所示。

<figure>{% Img src="image/admin/l1posckVsR7JeVGnk6Jv.png", alt="PageSpeed Insights 中显示的实际环境和实验室环境下的核心 Web 指标数据", width="800", height="873" %}</figure>

虽然[搜索控制台](https://search.google.com/search-console/)为网站所有者提供了需要重点关注的页面组的全面概览，但 PSI 有助于您识别每个页面上能够改善页面体验的机会。在 PSI 中，您可以在报告顶部清楚地看出您的页面是否满足所有核心 Web 指标的良好体验阈值，报告结果将显示为**通过核心 Web 指标评估**或**未通过核心 Web 指标评估**。

### CrUX

[Chrome 用户体验报告](https://developer.chrome.com/docs/crux/) (CrUX) 是数百万个网站上的真实用户体验数据的公共数据集。该工具测量所有核心 Web 指标的实际版本。与实验室数据不同，CrUX 数据来自实际情况下[主动选择加入的用户](https://developer.chrome.com/docs/crux/methodology/#user-eligibility)。通过这些数据，开发者能够了解真实世界用户体验在自己的网站，甚至是竞争对手的网站上的分布。即使您的网站上还没有 RUM，CrUX 也可以提供一种快速简便的方法来评估您的核心 Web 指标。[BigQuery 上的 CrUX 数据集](https://developer.chrome.com/docs/crux/bigquery/)包含所有核心 Web 指标的细粒度性能数据，并在域级的每月快照中提供。

要想真正了解您的网站为用户呈现的性能表现，唯一的方法就是在这些用户进行页面加载和页面交互时对页面性能进行实测。这种类型的测量通常被称为真实用户监控，或简称为 RUM。即使您的网站上还没有 RUM，CrUX 也可以提供一种快速简便的方法来评估您的核心 Web 指标。

**推出全新的 CrUX API**

今天，我们很高兴地向大家推出 [CrUX API](http://developers.google.com/web/tools/chrome-user-experience-report/api/reference/) ，这款 API 能够通过一种快速且免费的方式，轻松将您的开发工作流程与下列实际指标的域级和 URL 级质量测量进行集成：

- 最大内容绘制
- 累积布局偏移
- 首次输入延迟
- 首次内容绘制

开发者可以查询域或 URL，并按不同的形式因素对结果进行细分。 API 会每日更新并汇总前 28 天的数据（与每月汇总的 BigQuery 数据集不同）。这款 API 也拥有充足的公共 API 配额，与另一个 PageSpeed Insights API 相同（每日 25,000 个请求）。

下方是使用 CrUX API 来将各项核心 Web 指标可视化的[演示](/chrome-ux-report-api/)，其中的数据分布为**良好**、**需要改进**和**欠佳**：

<figure>{% Img src="image/admin/ye3CMKfacSItYA2lqItP.png", alt="显示多项核心 Web 指标的 Chrome 用户体验报告演示", width="800", height="523" %}</figure>

在未来的版本中，我们计划扩展 API 并允许其访问更多的 CrUX 数据集维度和指标。

**改进后的 CrUX 仪表板**

新近重新设计的 [CrUX 仪表板](http://g.co/chromeuxdash)使您能够轻松跟踪域的性能随时间的变化，现在您还可以使用新的仪表板来监控所有核心 Web 指标的分布。要想上手使用仪表板，请查看我们在 web.dev 上的[教程](/chrome-ux-report-data-studio-dashboard/)。

<figure>{% Img src="image/admin/OjbICyhI21RNfGXrFP1x.png", alt="Chrome 用户体验报告仪表板在新着陆页面中显示核心 Web 指标", width="800", height="497" %}</figure>

我们引入了一个新的核心 Web 指标着陆页面，便于您对您的网站表现一目了然。我们欢迎您对所有 CrUX 工具集提出反馈意见。如需分享您的想法和疑问，请通过 [@ChromeUXReport](https://twitter.com/chromeuxreport) Twitter 帐户或 [Google 群组](https://groups.google.com/a/chromium.org/g/chrome-ux-report)联系我们。

### Chrome 开发者工具性能面板

**在体验部分调试布局偏移事件**

Chrome 开发者工具的**性能**面板中有一个全新的**[体验部分](https://developers.google.com/web/updates/2020/05/devtools#cls)**，可以帮助您检测意外的布局偏移。这项功能有助于查找和修复页面上导致累积布局偏移的视觉不稳定问题。

<figure>{% Img src="image/admin/VMbZAgKCi5V6FiQyu631.png", alt="在性能面板中显示为红色记录的累积布局偏移", width="800", height="517" %}</figure>

选中某次特定的布局偏移，即可在**摘要**选项卡中查看其详细信息。要想直观地看到偏移本身发生的位置，请将鼠标悬停在**位移自**和**位移至**字段上。

**使用页脚中的总阻塞时间调试交互准备情况**

总阻塞时间 (TBT) 指标可以在实验室工具中进行测量，并且是首次输入延迟的绝佳代理。TBT 测量[首次内容绘制 (FCP)](/fcp/) 和 [Time to Interactive 可交互时间 (TTI)](/tti/) 之间的总时间，这期间，主线程被阻塞的时间过长，无法作出输入响应。在实验室中改进 TBT 的性能优化应该能够改进实际情况下的 FID。

<figure>{% Img src="image/admin/WufuLpvrZfgbRn70C74V.png", alt="开发者工具性能面板页脚中显示的总阻塞时间", width="800", height="517" %}</figure>

当您测量页面性能时，TBT 现在会显示在 Chrome 开发者工具**性能**面板的页脚中：

{% Instruction 'devtools-performance', 'ol' %}

1. 单击**录制**。
2. 手动重新加载页面。
3. 等待页面加载，然后停止录制。

如需了解更多信息，请参阅[开发者工具新增功能 (Chrome 84)](https://developers.google.com/web/updates/2020/05/devtools#cls)。

### 搜索控制台

搜索控制台中全新的[核心 Web 指标报告](https://support.google.com/webmasters/answer/9205520)可以帮助您根据 CrUX 的真实世界（实际）数据识别网站中需要重点关注的页面组。URL 性能会按状态、指标类型和 URL 组（相似网页的组）进行分组。

<figure>{% Img src="image/admin/BjTUt0xdWXD9hrLsbhLK.png", alt="搜索控制台的全新核心 Web 指标报告", width="800", height="1000" %}</figure>

该报告基于三项核心 Web 指标：LCP、FID 和 CLS。如果一个 URL 没有针对这些指标的最小报告数据量，则报告中会将其省略。请尝试使用新报告来全面了解您的域的性能。

一旦您确定了带有核心 Web 指标相关问题的页面类型，就可以使用 PageSpeed Insights 了解针对代表性页面的具体优化建议。

#### web.dev

[web.dev/measure](/measure/) 使您能够测量页面在一段时间内的性能，并提供一系列建议优先考虑的改进指南和代码实验室。该工具的测量由 PageSpeed Insights 提供支持。该测量工具现在还支持各项核心 Web 指标，如下图所示：

<figure>{% Img src="image/admin/ryoV1T1PhxUmo9zdCsDe.png", alt="使用 web.dev 测量工具测量一段时间内的多项核心 Web 指标并获得优先重点方面的指导", width="800", height="459" %}</figure>

### Web 指标扩展程序

Web 指标扩展程序实时测量（桌面）Google Chrome 的三项核心 Web 指标。这有助于在开发工作流程中及早发现问题，同时也可以在您浏览网络时作为诊断工具评估核心 Web 指标的性能。

该扩展程序现在可以从 [Chrome 网上应用店](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)进行安装！我们希望这个扩展程序会对您有用。我们欢迎您提出任何改进意见以及对项目 [GitHub](https://github.com/GoogleChrome/web-vitals-extension/) 存储库的反馈。

<figure>{% Img src="image/admin/woROdEmNV4jlHDPryjBQ.png", alt="使用 Web 指标 Chrome 扩展程序实时显示的核心 Web 指标", width="800", height="459" %}</figure>

#### 快速亮点

内容到这里就结束了！您接下来可以做什么：

- 使用开发者工具中的**灯塔**来优化您的用户体验，确保您在为实际情况下的核心 Web 指标的成功奠定基础。
- 使用 **PageSpeed Insights** 将您的实验室核心 Web 指标性能与实际核心 Web 指标性能作对比。
- 试用全新的 **Chrome 用户体验报告 API**，轻松了解您的域和 URL 在过去 28 天内的核心 Web 指标表现。
- 使用开发者工具**性能**面板中的**体验**部分和页脚深入了解各项核心 Web 指标，并针对特定指标进行调试。
- 使用**搜索控制台的核心 Web 指标报告**获取您的域在实际情况下的性能表现概览。
- 使用 **Web 指标扩展程序**实时跟踪页面的核心 Web 指标性能。

我们将在六月的 [web.dev Live](/live/) 上更详细地介绍我们的核心 Web 指标工具集。订阅并获取活动更新！

作者：网页性能管理员伊丽莎白 (Elizabeth) 和阿迪 (Addy)

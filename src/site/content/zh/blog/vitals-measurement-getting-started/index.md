---
title: 开始测量 Web 指标
authors:
  - katiehempenius
date: 2020-05-27
updated: 2022-07-18
hero: image/admin/QxMJKZcue9RS5u05XxTE.png
alt: 月度图表叠加标有 LCP、FID 和 CLS 的秒表。
description: 了解如何在真实世界和实验室环境中测量您的网站 Web 指标。
tags:
  - blog
  - performance
  - web-vitals
---

收集您网站的 Web 指标数据是对其进行改善的第一步。一次全面的分析将会从真实世界和实验室环境中收集性能数据。测量 Web 指标所要求的代码改动非常微小，并且可以使用免费工具集来完成。

## 使用 RUM 数据测量 Web 指标

[真实用户监控](https://en.wikipedia.org/wiki/Real_user_monitoring) (RUM) 数据，也称实际数据，可以捕获网站真实用户的性能体验。Google 用 RUM 数据来确定网站是否符合[核心 Web 指标建议阈值](/vitals/)。

### 入门

如果您还未设置 RUM，那么以下工具将快速为您提供网站实际性能的相关数据。这些工具都基于相同的底层数据集（[Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)），但用例略有不同：

- **PageSpeed Insights 网页速度测量工具 (PSI)**：[PageSpeed Insights](https://pagespeed.web.dev/)报告过去 28 天的页面级和域级聚合性能。此外，该工具还会提供如何改进性能的相关建议。如果您正在寻求一种单一操作来着手测量和改进您网站的 Web 指标，我们建议您使用 PSI 来审计您的网站。 PSI 可在[网页](https://pagespeed.web.dev/)上使用，也可作为[API](https://developers.google.com/speed/docs/insights/v5/get-started)使用。
- **搜索控制台**：[搜索控制台](https://search.google.com/search-console/welcome)为每个页面报告性能数据。因此，该工具非常适合用来识别需要改进的特定页面。与 PageSpeed Insights 不同，搜索控制台的报告包括历史性能数据。只能针对您拥有并已验证所有权的网站使用搜索控制台。
- **CrUX 仪表板**：[CrUX 仪表板](https://developers.google.com/web/updates/2018/08/chrome-ux-report-dashboard)是一个预先构建的仪表板，可显示您所选域的 CrUX 数据。该工具是基于 Data Studio 构建的，设置过程大约需要一分钟。与 PageSpeed Insights 和搜索控制台相比，CrUX 仪表板的报告包含更多维度，例如，数据可以按设备和连接类型进行细分。

值得注意的是，虽然上方列出的工具非常适合作为 Web 指标的"入门"测量工具，但这些工具在其他情况下也十分有用。特别要指出的是，CrUX 和 PSI 都可作为 API 使用，还可用于[构建仪表板](https://dev.to/chromiumdev/a-step-by-step-guide-to-monitoring-the-competition-with-the-chrome-ux-report-4k1o)和其他报告。

### 收集 RUM 数据

尽管基于 CrUX 的工具是调查 Web 指标性能的良好开端，但我们强烈建议您使用自己的 RUM 来对性能数据进行补充。您自己收集的 RUM 数据可以针对您网站的性能提供更详细、即时的反馈，因而更加易于识别问题和测试可能的解决方案。

{% Aside %}基于 CrUX 的数据源使用大约一个月的粒度来报告数据，但相关具体细节在不同工具中会有细微差别。例如，PSI 和搜索控制台报告过去 28 天观察到的性能，而 CrUX 数据集和仪表板则按日历月进行报告。 {% endAside %}

您可以通过专用的 RUM 供应商或亲自搭建工具来收集您自己的 RUM 数据。

专用的 RUM 供应商专门收集和报告 RUM 数据。如需在这些服务的基础上同时使用核心 Web 指标，请向您的 RUM 供应商咨询为您的网站启用核心 Web 指标监控的相关信息。

如果您没有 RUM 供应商，那么可以通过使用[`web-vitals` JavaScript 库](https://github.com/GoogleChrome/web-vitals)来扩充您现有的分析手段，从而对这些指标进行收集和报告。以下内容对该方法进行了更详细的解释。

### web-vitals JavaScript 库

如果您正在为 Web 指标搭建和实现自己的 RUM，那么收集 Web 指标测量值最简单的方法是使用[`web-vitals`](https://github.com/GoogleChrome/web-vitals) JavaScript 库。`web-vitals`是一个小型的模块化库 (约 1KB)，可以提供一个便捷的 API 来为每个[可实际测量的](/user-centric-performance-metrics/#in-the-field) Web 指标进行收集和报告工作。

Web 指标的构成指标并非都由浏览器的内置性能 API 直接公开，而是直接基于这些 API 所构建。例如，[Cumulative Layout Shift 累积布局偏移 (CLS)](/cls/)是使用[布局不稳定性 API](https://wicg.github.io/layout-instability/)实现的。通过使用`web-vitals` ，您无需自己实现这些指标。该 JavaScript 库还能确保您收集的数据与每项指标的方法论和最佳实践相匹配。

如需进一步了解执行`web-vitals`的更多相关信息，请参考[文档](https://github.com/GoogleChrome/web-vitals)和[实测 Web 指标的最佳实践](/vitals-field-measurement-best-practices/)指南。

### 数据聚合

对`web-vitals`收集的测量值进行报告至关重要。如果在测量数据后不进行报告，那么您就无法看到这些数据。 `web-vitals`文档包含的一些示例说明了如何将数据发送到[一个通用 API 端点](https://github.com/GoogleChrome/web-vitals#send-the-results-to-an-analytics-endpoint)、[Google 分析](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics)或[Google 跟踪代码管理器](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-tag-manager)。

如果您已经有特别中意的报告工具，则可以考虑使用该工具。如果还没有，那么可以使用免费的 Google 分析来实现这一目的。

在考虑使用哪种工具时，思考谁会需要访问数据往往十分有帮助。当整个公司（而非单个部门）都希望提高绩效时，企业通常会取得最高的绩效。请参阅[跨功能修复网站速度](/fixing-website-speed-cross-functionally/)，了解如何获得不同部门的支持。

### 数据解读

在分析性能数据时，留意分布的尾部数据十分重要。RUM 数据经常显示出非常大的性能差异，有些用户的速度体验很快，而有些用户的速度体验很慢。但是，使用中位数来汇总数据就会很轻易地掩盖掉这种特性。

在 Web 指标方面，Google 使用"良好"体验的百分比，而不是中位数或平均值等统计数据来确定一个网站或页面是否符合建议阈值。具体而言，只有当一个网站或页面 75% 的页面访问量在每项指标下都满足"良好"阈值时，这个网站或页面才会被视为符合核心 Web 指标阈值。

## 使用实验室数据测量 Web 指标

[实验室数据](/user-centric-performance-metrics/#in-the-lab)，也称为合成数据，是从受控环境，而非实际用户中收集的数据。与 RUM 数据不同，实验室数据可以在预上线环境中进行收集，因此可以整合到开发者工作流程和持续集成过程中。收集合成数据的工具包括灯塔和 WebPageTest 网页性能测试工具等。

### 注意事项

RUM 数据和实验室数据之间始终会存在差异，特别是在实验室环境的网络条件、设备类型或地理位置与用户相对应的信息之间存在显著差异的情况下。但是，在收集有关 Web 指标的实验室数据时，尤为需要注意以下几条具体注意事项：

- **累积布局偏移 (CLS)：**在实验室环境中测量的[累积布局偏移](/cls/)可能会由于人为因素低于在 RUM 数据中观察到的 CLS。CLS 的定义为"*整个页面生命周期内*针对发生的每次意外布局偏移得出的所有单次布局偏移分数的总和。"然而，真实用户加载的页面生命周期通常会与虚拟性能测量工具加载的页面生命周期有很大不同。许多实验室工具只加载页面，而不进行交互。因此，这些工具只能捕获初始页面加载期间发生的布局偏移。相比之下，由 RUM 工具测量的 CLS 能够捕获整个页面生命周期中发生的[意外布局偏移](/cls/#expected-vs.-unexpected-layout-shifts)。
- **First Input Delay 首次输入延迟 (FID)：**[首次输入延迟](/fid/)无法在实验室环境中进行测量，因为该项指标需要用户与页面进行交互。因此，[Total Blocking Time 总阻塞时间](/tbt/) (TBT) 是我们推荐的 FID 实验室代理。 TBT 测量"First Contentful Paint 首次内容绘制和 Time to Interactive 可交互时间之间页面被阻塞而无法对用户输入作出响应的总时间"。虽然 FID 和 TBT 的计算方式不同，但这两项指标都能体现出引导进程中被阻塞的主线程。当主线程被阻塞时，浏览器就会对用户交互作出延迟响应。 FID 测量用户首次尝试与页面交互时发生的延迟（如果存在）。

### 工具集

这些工具可用于收集 Web 指标的实验室测量值：

- **Web 指标 Chrome 扩展程序：** Web 指标 Chrome [扩展程序](https://github.com/GoogleChrome/web-vitals-extension)对给定页面的核心 Web 指标（LCP 最大内容绘制、FID 和 CLS）进行测量和报告。该工具旨在为开发者进行代码更改时提供实时性能反馈。
- **灯塔：**灯塔对 LCP、CLS 和 TBT 进行报告，并突出显示合适的性能改进。灯塔在 Chrome 开发者工具中既可以作为 Chrome 扩展程序运行，也可以作为 npm 包运行。灯塔还可以通过[灯塔 CI](https://github.com/GoogleChrome/lighthouse-ci)整合到持续集成工作流程中。
- **WebPageTest 网页性能测试工具：**[WebPageTest](https://webpagetest.org/)将 Web 指标作为其标准报告的一部分。 WebPageTest 可用于在特定设备和网络条件下收集 Web 指标的相关信息。

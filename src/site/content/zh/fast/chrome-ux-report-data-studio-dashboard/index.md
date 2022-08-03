---
layout: post
title: 在 Data Studio 上使用 CrUX Dashboard
authors:
  - rviscomi
hero: image/admin/k3hWnnwqTvg7w7URsbIK.png
description: Data Studio 是一款功能强大的数据可视化工具，可让您使用大数据源构建仪表板，如 Chrome UX Report。您可以在本文中了解如何创建自定义 CrUX Dashboard 来跟踪源中用户的体验。
date: 2020-06-22
updated: 2022-07-18
tags:
  - performance
  - blog
  - chrome-ux-report
---

[Data Studio](https://marketingplatform.google.com/about/data-studio/) 是一款功能强大的数据可视化工具，可让您使用大数据源构建仪表板，如 [Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX)。您可以在本文中了解如何创建自定义 CrUX Dashboard 来跟踪源中用户的体验。

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX Dashboard", width="800", height="598" %}

CrUX 仪表板使用 Data Studio 的 [Community Connectors](https://developers.google.com/datastudio/connector/) 功能构建。此连接器是 [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report) 上的原始 CrUX 数据与 Data Studio 的可视化之间预建立的一个链接。有了它，仪表板用户无需编写任何查询或生成任何图表。它可以为您构建所有内容；您只需要提供一个源，就会为您生成一个自定义仪表板。

## 创建仪表板

首先请访问 [g.co/chromeuxdash](https://g.co/chromeuxdash)。您会进入 CrUX 社区连接器页面，可以在这里提供将用于生成仪表板的源。请注意，首次使用的用户可能需要完成权限或营销偏好提示。

{% Img src="image/admin/SSUqCau3HiN5qBbewX6h.png", alt="CrUX 仪表板连接器", width="800", height="484" %}

文本输入字段只接受源，不接受完整的 URL。例如：

{% Compare 'better', 'Origin (Supported)' %}

```text
https://web.dev
```

{% endCompare %}

{% Compare 'worse', 'URL (Not supported)' %}

```text
https://web.dev/chrome-ux-report-data-studio-dashboard/
```

{% endCompare %}

如果省略通讯协议，那么会假定使用 HTTPS。子域很重要，例如 `https://developers.google.com` 和 `https://www.google.com` 会被认为是不同的源。

源的一些常见问题包括提供了错误的协议，例如使用了 `http://` 而不是 `https://` ，以及在需要时省略了子域。一些网站采用了重定向，因此如果 `http://example.com` 重定向到 `https://www.example.com` ，那么您应该使用后者，这是源的规范版本。根据经验，请使用用户在地址栏中看到的源。

如果您的源并未包含在 CrUX 数据集中，那么您可能会看到如下所示的错误消息。数据集收集了超过 400 万个源，但您想用的源可能数据不足，所以未被收录。

{% Img src="image/admin/qt0jWTgtdS93hDKW2SCm.png", alt="CrUX Dashboard 错误信息", width="800", height="409" %}

如果源存在，您将转至仪表板的架构页面。这里显示了包含的所有字段：每个有效连接类型、每个窗体因子、数据集发布的月份、每个指标的性能分布，当然还有源的名称。您无需在此页面进行任何操作或更改，只需单击**创建报告**即可继续。

{% Img src="image/admin/DTNigYO4gUwovCuCgyhH.png", alt="CrUX Dashboard 架构", width="800", height="403" %}

## 使用仪表板

每个仪表板都提供三种类型的页面：

1. Core Web Vitals 概述
2. 指标性能
3. 用户人口统计

每个页面都提供一张图表，显示了数据在每个月度版本中随时间的分布情况。随着新数据集的发布，您只需刷新仪表板即可获取最新数据。

每个月的第二个星期二会发布月度数据集。例如，由 5 月份用户体验数据组成的数据集会在 6 月的第二个星期二发布。

### Core Web Vitals 概述

第一页显示了源的 [Core Web Vitals](/vitals/) 月度表现概览。这些是 Google 建议关注的最重要的用户体验指标。

{% Img src="image/admin/h8iCTgvmG4DS2zScvatc.png", alt="CrUX Dashboard Core Web Vitals 概览", width="800", height="906" %}

使用 Core Web Vitals 页面了解桌面和收集用户的源体验。默认情况会选择您创建仪表板时的最近一个月。要改为较旧或较新的月度版本，请使用页面顶部的**月份**过滤器。

请注意，默认情况下这些图表中会忽略平板电脑。但如果您有此方面的需要，则可以删除条形图配置中的**无平板电脑**过滤器，如下所示。

{% Img src="image/admin/lD3eZ3LipJmBGmmkrUvG.png", alt="编辑 CrUX 仪表板以在 Core Web Vitals 页面上显示平板电脑", width="800", height="288" %}

### 指标性能

在 Core Web Vitals 页面之后，您将找到 CrUX 数据集中所有[指标](https://developer.chrome.com/docs/crux/methodology/#metrics)的独立页面。

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX Dashboard LCP 页面", width="800", height="598" %}

每个页面顶部都设有**设备**过滤器，您可以用它来限制体验数据中的窗体因子。例如，您可以专门深入研究电话用户体验。此设置支持跨页面调用。

这些页面上的主要可视化内容各种体验的月度分布图，其类别有“良好”、“需要改进”和“差”。图表下方的颜色编码图例表示该类别包含的体验范围。例如，在上面的截图中，您可以看到[Largest Contentful Paint（最大内容绘制，LCP）](/lcp/#what-is-a-good-lcp-score)“良好”体验的百分比在最近几个月波动并稍有恶化。

最近一个月的“良好”和“差”体验百分比显示在图表上方，以及与上个月的百分比差异指标。对于这个源，“良好”的 LCP 体验环比下跌了 3.2%，现在是 56.04%。

{% Aside 'caution' %}由于 Data Studio 的一个奇怪特性，有时这里可能会显示 `No Data`。这是正常现象，因为上月版本要到第二个星期二才出现。 {% endAside %}

此外，对于 LCP 和提供明确百分位建议的其他 Core Web Vitals 指标，您会在“良好”和“差”百分比之间看到“P75”这样的指标。该值对应于源用户体验的第 75 个百分位数。换句话说，75% 的体验优于这个值。需要注意的是，该指标适用于源上*所有设备*的整体分布。使用**设备**过滤器切换特定设备不会重新计算百分位数。

{% Details %} {% DetailsSummary %} 关于百分位数的无聊技术说明 {% endDetailsSummary %}

请注意，百分位数指标是基于 [BigQuery](/chrome-ux-report-bigquery/) 的直方图数据，因此粒度会比较粗：LCP 为 1000 毫秒，FID 为 100 毫秒，CLS 为 0.05。换句话说，3800 毫秒的 P75 LCP 表明真正的第 75 个百分位数在 3800 毫秒和 3900 毫秒之间。

此外，BigQuery 数据集使用一种称为 bin spreading （分箱扩散）的技术：用户体验的密度被分组为粒度递减的非常粗略的分箱。这使我们能够在分布的尾部包含微小的密度，而不必超过四位数的精度。例如，小于 3 秒的 LCP 值被分组到 200 毫秒宽的区间中。在 3 到 10 秒之间，分箱的宽度为 500 毫秒。超过 10 秒后，分箱的宽度为 5000 毫秒，等等。分箱扩散不使用具有不同宽度的分箱，而是确保所有分箱的宽度恒定为 100 毫秒（最大公约数），并且分布在每个分箱上进行线性插值。

PageSpeed Insights 等工具中对应的 P75 值并非基于公共 BigQuery 数据集，并且能够提供毫秒级精度的值。 {% endDetails %}

### 用户人口统计

用户人口统计页面包含两个[维度](https://developer.chrome.com/docs/crux/methodology/#dimensions)：设备和有效连接类型 (ECT)。这些页面列出了每个人口统计中用户在整个源中的页面浏览量分布。

设备分布页面显示了手机、台式机和平板电脑用户随时间的细分数据。许多源往往几乎没有平板电脑数据，因此您经常会看到图表边缘出现 "0%" 的情况。

{% Img src="image/admin/6PXh8MoQTWHnHXf8o1ZU.png", alt="CrUX Dashboard 设备页面", width="800", height="603" %}

同样，ECT 分布页面向您展示了 4G、3G、2G、慢速 2G 和离线体验的细分数据。

{% Aside 'key-term' %}有效的连接类型之所以被认为是*有效的*，是因为它们基于用户设备上的带宽测量值，并不暗示使用了任何特定技术。例如，使用快速 WiFi 的桌面用户可能被标记为 4G，而较慢的移动连接可能被标记为 2G。 {% endAside %}

这些维度的分布是使用 [First Contentful Paint](/fcp/) (FCP) 直方图数据的分段计算的。

## 常问问题

### 什么时候要使用 CrUX Dashboard 而不是其他工具？

CrUX Dashboard 基于 BigQuery 上可用的相同基础数据，但您无需编写任何 SQL 代码即可提取数据，而且永远不必担心超出免费配额。设置仪表板快速简单，可以生成所有可视化数据，而且您可以选择与任何人共同分享。

### 使用 CrUX Dashboard 有什么限制吗？

基于 BigQuery 意味着 CrUX Dashboard 也继承了它的所有限制。它受限于月度粒度的源级别数据。

为了更加简单方便，CrUX Dashboard 还牺牲了 BigQuery 原始数据的一些多功能性。例如，指标分布不会给出完整的直方图，而是仅给出为“良好”、“需要改进”和“差”。 CrUX Dashboard 还提供全球范围的数据，而 BigQuery 数据集允许您缩放到特定的国家/地区。

### 可以在哪里了解到 Data Studio 的更多信息？

查看 [Data Studio 功能页面](https://marketingplatform.google.com/about/data-studio/features/)了解更多信息。

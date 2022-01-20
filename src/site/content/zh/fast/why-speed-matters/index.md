---
layout: post
title: 为什么速度很重要？
authors:
  - bojanpavic
  - ansteychris
  - jlwagner
description: 在用户体验方面，速度很重要。移动设备速度造成的延误不仅令人沮丧，还会对业务造成负面影响。
web_lighthouse: N/A
date: 2019-05-01
updated: 2020-07-23
tags:
  - performance
---

消费者越来越依赖移动设备来访问数字内容和服务，如果您查看自己站点的分析，可能会看到这个故事正在您自己的数据中上演。消费者也比以往任何时候都要求更高，当他们权衡您网站上的体验时，他们不仅仅将您与您的竞争对手进行比较，他们还会根据他们每天使用的一流服务对您进行评级。

这篇文章总结了一些关于性能与业务成功之间关系的研究。

## 性能是留住用户的关键

<figure data-float="right">
  <blockquote>
    <p>性能直接影响公司的命运。</p>
    <cite>
      <p data-md-type="paragraph"><a href="https://www.youtube.com/watch?v=Xryhxi45Q5M&amp;feature=youtu.be&amp;t=1366">Pinterest</a></p>
    </cite>
  </blockquote></figure>

性能在任何在线企业的成功中都起着至关重要的作用。高性能网站比低性能网站更能吸引和留住用户。

Pinterest 将感知等待时间减少了 40%，这[将搜索引擎流量和注册量增加了 15%](https://medium.com/@Pinterest_Engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7) 。

COOK 将页面平均加载时间减少了 850 毫秒，从而[将转化次数提高了 7%，将跳出率降低了 7%，并将每个会话的页面增加了 10%](https://www.nccgroup.trust/globalassets/resources/uk/case-studies/web-performance/cook-case-study.pdf) 。

研究还表明，性能不佳会对业务目标产生负面影响。例如， [BBC](https://www.creativebloq.com/features/how-the-bbc-builds-websites-that-scale) 发现他们的网站加载时间每增加一秒，他们就会失去 10% 的用户。

## 性能意味着提高转化率

留住用户对于提高转化率至关重要。慢速网站对收入有负面影响，而快速网站显示可以提高转化率。

对于 [Mobify](http://resources.mobify.com/2016-Q2-mobile-insights-benchmark-report.html)而言，主页加载速度每提高 100 毫秒，基于会话的转化率就会增加 1.11%，平均年收入增加近 380,000 美元。此外，结账页面加载速度每提高 100 毫秒，基于会话的转化率就会增加 1.55%，从而使年均收入增加近 530,000 美元。

当 [AutoAnything 将页面加载时间减少一半时](https://www.digitalcommerce360.com/2010/08/19/web-accelerator-revs-conversion-and-sales-autoanything/)，他们的销售额增长了 12% 到 13%。

零售商 [Furniture Village](https://www.thinkwithgoogle.com/intl/en-gb/success-stories/uk-success-stories/furniture-village-and-greenlight-slash-page-load-times-boosting-user-experience/) 审核了他们的网站速度，并制定了解决他们发现的问题的计划，导致页面加载时间降低了 20%，转化率提高了 10%。

## 性能关乎用户体验

在用户体验方面，速度至关重要。一项[消费者研究](https://www.ericsson.com/en/press-releases/2016/2/streaming-delays-mentally-taxing-for-smartphone-users-ericsson-mobility-report)表明，对移动速度延迟的压力反应类似于看恐怖电影或解决数学问题，而且比在零售店结账时排队等候的压力更大。

当网站开始加载时，用户需要等待一定的时间出现内容。在此之前，没有用户体验可言。这种缺乏体验在快速连接上是短暂的。然而，在较慢的连接上，用户被迫等待。随着页面资源慢慢载入，用户可能会遇到更多问题。

<figure>{% Img src="image/admin/W0ctiX3cMOfWnNF6AQMg.png", alt="页面加载的两个幻灯片卷轴的比较。第一个显示页面加载速度较慢，而第二个显示同一页面加载连接快速。", width="800", height="264" %}<figcaption>非常慢的页面加载连接（顶部）与较快的页面加载连接（底部）比较。</figcaption></figure>

性能是良好用户体验的基础。当网站发布大量代码时，浏览器必须使用用户数以百万计的数据计划才能下载代码。移动设备的 CPU 能力和内存有限。它们经常被我们认为所谓的“少量”未优化的代码所淹没。这会导致性能不佳，从而导致无响应。了解我们人类的行为后就会知道，用户只有对低性能的应用程序忍无可忍时才会选择放弃。

## 性能影响人们

性能不佳的网站和应用程序也会给使用它们的人们带来实际成本。

[随着移动用户继续在全球互联网用户中占据更大比例](http://gs.statcounter.com/platform-market-share/desktop-mobile-tablet)，请务必记住，其中许多用户通过移动 LTE、4G、3G 甚至 2G 网络访问互联网。正如 Calibre 的 Ben Schwarz 在[关于现实世界性能的研究中](https://calibreapp.com/blog/beyond-the-bubble)指出的那样，预付费数据计划的成本正在下降，这反过来又使得过去无法负担的地方开始有能力访问互联网。移动设备和互联网接入不再是奢侈品。它们是日益互联的世界中导航和发挥作用所必需的常用工具。

[至少自 2011 年以来，总页面大小一直在稳步增加](http://beta.httparchive.org/reports/state-of-the-web#bytesTotal)，而且这种趋势似乎还在继续。随着典型页面发送更多数据，用户必须更频繁地补充他们的计量数据计划，这会花费他们的资金。

除了为用户节省资金外，快速和轻量级的用户体验对于处于危机中的用户也至关重要。医院、诊所和危机中心等公共资源拥有在线资源，可为用户提供他们在危机期间所需的重要和具体信息。[虽然设计对于在压力时刻有效地呈现重要信息至关重要](https://aneventapart.com/news/post/eric-meyer-designing-for-crisis)，但不能低估快速传递这些信息的重要性。这是我们工作的一部分。

## 开始提高您的网站速度 {: #get-started }

阅读 [Core Web Vitals](/vitals/#core-web-vitals) ，了解 Google 认为所有网站都应关注的指标。

<blockquote>
  <p>目前，我们在这项工作的基础上，通过整合这些页面体验指标，提前了解即将到来的搜索排名变化。我们将推出一种新的信号，将 Core Web Vitals 与现有的页面体验信号相结合，以了解用户在页面上的体验质量的整体情况。</p>
  <cite><a href="https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html">评估页面体验以获得更好的网络</a>, 官方 Google 网站站长中心博客</cite>
</blockquote>

然后查看[快速加载时间，](/fast/)了解与快速和保持快速相关的许多提示和技巧。

---
layout: post
title: 渐进式 Web 应用如何推动业务成功
authors:
  - sfourault
date: 2020-05-20
updated: 2020-05-20
description: 为您的 PWA 构建可靠的商业案例。了解何时应该投资，以及如何测量其成功性。
tags:
  - progressive-web-apps
---

渐进式 Web 应用是许多公司的投资策略，他们希望借此实现其网站的现代化并适应用户的新期望。像所有新概念和技术功能一样，他们疑虑重重：这是否是我的客户所期望的，它将带给我的业务怎样的增长，在技术上的可行性如何？

{% Img src="image/admin/o70RxMcAQVPrjxH34a8r.jpg", alt="识别您的利益相关者", width="800", height="254" %}

为了制定您的数字战略，通常会涉及到几个利益相关者：产品经理和 CMO 是每个功能的业务影响的共同所有者，CTO 评估技术的可行性和可靠性，用户体验研究人员验证功能是否能回答真正的客户问题。

本文旨在帮助您回答这三个问题并制定您的 PWA 项目。您将从您的客户需求开始，将其转化为 PWA 功能，并专注于衡量每个功能带来的业务影响。

## PWA 解决客户需求 {: #solve-customer-needs }

我们在 Google 制作产品时喜欢遵循的一条规则是“[以用户为中心，则一切将水到渠成](https://www.google.com/about/philosophy.html)”。以*用户至上*为遵旨：客户的需求是什么，PWA 如何满足他们？

{% Img src="image/admin/TcmXmWb5mSUqal98NIAH.jpg", alt="识别客户需求", width="800", height="262" %}

在进行用户研究时，我们发现了一些有趣的模式：

- 用户讨厌移动设备上的延迟和不可靠性：移动设备延迟造成的压力程度[堪比观看恐怖电影](https://blog.hubspot.com/marketing/mobile-website-load-faster)。
- 50% 的智能手机用户在浏览或购物时更有可能使用公司的移动网站，因为他们[不想下载应用](https://www.thinkwithgoogle.com/data/smartphone-user-mobile-shopping-preferences/)。
- 卸载应用程序的主要原因之一是[存储空间有限](https://www.thinkwithgoogle.com/data/why-users-uninstall-travel-apps/)（而安装 PWA 通常不到 1MB）。
- 智能手机用户更有可能从[提供相关产品推荐](https://www.thinkwithgoogle.com/data/smartphone-mobile-app-and-site-purchase-data/)的移动网站购买，85% 的智能手机用户表示[移动通知很有用](https://www.thinkwithgoogle.com/data/smartphone-user-notification-preferences/)。

根据这些观察，我们发现客户更喜欢快速、可安装、可靠和有趣 (F.I.R.E.) 的体验！

## PWA 利用现代网络功能 {: #modern-capabilities }

PWA 提供系列最佳实践和现代 Web API，旨在让您的网站快速、可安装、可靠和有趣，从而满足客户的需求。

例如，使用 Service Worker [缓存您的资源](/service-workers-cache-storage/)并进行[预测性预取](/precache-with-workbox/)可以使您的站点更快、更可靠。使您的网站可安装，为您的客户提供了一种直接从其主屏幕或应用启动器访问它的简便方法。[网络推送通知](https://developer.mozilla.org/docs/Web/API/Push_API/Best_Practices)等新的 API 可以更轻松地通过个性化内容重新吸引用户以产生忠诚度。

{% Img src="image/admin/rP0eNCflNYOhzjPi1Lq5.jpg", alt="使用新功能改善用户体验", width="800", height="393" %}

## 了解业务影响 {: #business-impact }

根据您的活动，业务成功的定义可能有很多：

- 用户在您的服务上花费更多时间
- 降低潜在客户的跳出率
- 提高转化率
- 更多回头客

大多数 PWA 项目会产生更高的移动转化率，您可以从众多 [PWA 案例研究](https://www.pwastats.com/)中了解更多信息。根据您的目标，您可能希望优先考虑 PWA 的某些对您的业务更有意义的方面，这完全没问题。PWA 功能可以单独挑选和启动。

让我们来讨论每个 F.I.R.E 重要功能的业务影响。

### 快速网站的业务影响 {: #impact-fast }

[Deloitte Digital](https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html) 最近开展的一项研究表明，页面速度对业务指标有重大影响。

您可以做很多事情来优化网站的速度，从而优化所有用户的关键体验。如果您不知道从哪里开始，请查看我们的[快速](/fast/)部分，并使用 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 确定要修复的最重要的事情的优先级。

进行速度优化时，首先使用适当的工具和指标经常测量您的网站速度以监控您的进度。例如，使用[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 测量您的指标，确定明确的目标，例如拥有[“良好”的 Core Web Vitals 分数](/vitals/#core-web-vitals)，并[将性能预算纳入您的构建过程](/incorporate-performance-budgets-into-your-build-tools/)。由于您的日常测量和[“速度值”方法](/value-of-speed/)，您可以隔离增量速度变化的影响并计算您的工作产生了多少额外收入。

{% Img src="image/admin/yyRfQaDL3NcGhB0f79RN.jpg", alt="测量速度值并将其与转化相关联", width="800", height="306" %}

Ebay 在 2019 年将[速度作为公司的目标](/shopping-for-speed-on-ebay/)。他们使用了性能预算、关键路径优化和预测性预取等技术。他们得出的结论是，搜索页面加载时间每改进 100 毫秒，添加到购物车的数量就会增加 0.5%。

{% Img src="image/admin/Qq3wo5UOqzC1ugnTzdqT.jpg", alt="加载时间改进 100 毫秒使得 eBay 购物车的添加数量增加了 0.5%", width="800", height="184" %}

### 可安装网站的业务影响 {: #impact-installable }

为什么要让用户安装您的 PWA？目的是让用户更轻松地返回您的网站。Android 应用安装至少会增加三个步骤（重定向到 Play Store、下载 Android 应用、在漏斗顶部重新启动应用），PWA 安装则只需一键即可无缝完成，并且不会让用户离开当前的转化漏斗。

{% Img src="image/admin/u1jcKrBBOHEzSz3SqhEB.jpg", alt="安装体验应该是无缝的", width="800", height="239" %}

安装后，用户可以通过主屏幕上的图标一键启动应用，在应用之间切换时可在应用托盘中看到应用，或者通过应用搜索结果找到应用。我们称这为应用动态发现-启动-切换，让您的 PWA 可安装是解锁访问的关键。

除了可以从他们设备上熟悉的发现和启动界面访问之外，PWA 的启动与特定于平台的应用完全一样：在独立体验中，与浏览器分开。此外，它还受益于操作系统级设备服务，例如应用切换器和设置。

安装您 PWA 的用户很可能是您的参与度最高的用户，他们的参与度指标比临时访问者更好，包括更多的重复访问、更长的网站时间和更高的转化率，通常与移动设备上特定平台的应用用户同等。

要使您的 PWA 可安装，其需要满足[基本标准](/install-criteria/)。一旦满足这些标准，您就可以在桌面和移动设备（包括 iOS）上[提升安装](/promote-install/)，改善用户体验。

{% Img src="image/admin/5sH5YX7kFrwv4f6duqVf.jpg", alt="PWA 可以在任何地方安装", width="800", height="227" %}

一旦您开始提升您的 PWA 的安装，您应该测量有多少用户正在安装您的 PWA，以及他们如何使用您的 PWA。

为了最大限度地提升安装您网站的用户数量，您可能想要[测试不同的](https://pwa-book.awwwards.com/chapter-4)提升信息（例如“一秒内安装”或“添加我们的快捷方式以方便您”）、不同的展示位置（标题横幅、源中） ，并尝试在漏斗的不同步骤（在访问的第二页或预订后）提出建议。

要了解您的用户离开的原因以及如何提高留存率，可以通过下列四种方式[测量](https://pwa-book.awwwards.com/chapter-8)安装漏斗：

- 有资格安装的用户数量
- 点击 UI 安装提示的用户数量
- 接受和拒绝安装的用户数量
- 成功安装的用户数量

开始，您可以针对所有用户提升您的 PWA 安装，或者使用更谨慎的方法，仅对一小部分用户进行试验。

几天或几周后，您应该已经有一些数据来测量对您业务的影响。人们对安装的快捷方式的反应如何？他们参与得更多，还是他们转化得更多？

要细分安装了您的 PWA 的用户，请跟踪 [`appinstalled` 事件](/customize-install/#detect-install)，并使用 JavaScript[检查用户是否处于独立模式](/customize-install/#detect-launch-type)（表示已安装 PWA）。然后将这些用作分析跟踪的变量或维度。

{% Img src="image/admin/H2U4jKTmATNzVJQ3WNCO.jpg", alt="测量安装值", width="800", height="253" %}

Weekendesk 的[案例研究](https://www.thinkwithgoogle.com/_qs/documents/8971/Weekendesk_PWA_-_EXTERNAL_CASE_STUDY.pdf)很有趣：他们建议在访问的第二页进行安装以最大化安装率，并且他们观察到通过主屏幕上的图标返回的客户预订住宿的可能性提高了两倍多。

{% Img src="image/admin/eR23C2o1adHq5tATNw34.jpg", alt="已安装用户的转化率提高了 2.5 倍", width="800", height="201" %}

安装是让人们回到您的网站并提高客户忠诚度的好方法。您还可以考虑为这些高级用户个性化体验。

即使您已经有一个特定于平台的应用，您也可以先测试以推荐您的应用，然后再为那些拒绝或没有参与应用安装横幅的人推送 PWA。您的一些“半参与”用户可能不符合基于应用商店的安装阈值。这个群体可以通过 PWA 可安装性来解决，它通常被认为更轻，摩擦更少。

{% Img src="image/admin/iNQalNPhjdBueuqPHiad.jpg", alt="PWA 可以覆盖半参与用户", width="800", height="229" %}

### 可靠网站的业务影响 {: #impact-reliable }

Chrome Dino 游戏在用户离线时提供，每月[游戏次数超过 2.7 亿次。](https://www.blog.google/products/chrome/chrome-dino/)这个令人印象深刻的数字表明，网络可靠性是一个相当大的机会，尤其是在印度、巴西、墨西哥或印度尼西亚等移动数据不可靠或昂贵的市场中。

当启动从应用商店安装的应用时，用户希望无论他们是否连接互联网都能够将其打开。渐进式 Web 应用也应不例外。

至少，应该提供一个简单的离线页面，告诉用户应用程序在没有网络连接的情况下不可用。然后，考虑通过提供一些[离线时仍可用的有意义功能](https://pwa-book.awwwards.com/chapter-6)来进一步提升体验。例如，您可以提供门票或登机牌、离线愿望清单、呼叫中心联系信息、用户最近查看的文章或食谱等的访问权限。

{% Img src="image/admin/ubglZLCoddAfB5cl8JSz.jpg", alt="即使离线也有帮助", width="800", height="243" %}

一旦您实现了[可靠的用户体验](https://pwa-book.awwwards.com/chapter-6)，您可能想要对其进行测量；有多少用户离线，在哪些地区，当网络恢复时他们是否留在网站上？

离线使用情况可以通过记录用户[离线或在线](https://pwa-book.awwwards.com/chapter-8)时的分析 ping 来测量。它告诉您有多少用户在网络恢复后继续浏览您的网站。

{% Img src="image/admin/UfjYsWQWJjVIk2sp5bnE.jpg", alt="Trivago 看到有 67% 的用户返回在线继续浏览", width="800", height="272" %}

[Trivago 案例研究](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/case-studies/trivago-embrace-progressive-web-apps-as-the-future-of-mobile/)说明了这如何影响您的业务目标：对于会话被离线时段中断的用户（大约 3% 的用户），67% 的用户重新上线后继续浏览网站。

### 有趣的网站的业务影响 {: #impact-engaging }

Web 推送通知允许用户选择接收他们喜欢的网站的及时更新，并允许您通过定制的相关内容有效地重新吸引他们。

不过要小心。要求用户在他们第一次到达时注册 Web 通知而不暴露好处可能会被视为垃圾邮件，并对您的体验产生负面影响。确保在提示通知时遵循[最佳实践](https://developers.google.com/web/fundamentals/push-notifications/permission-ux)，并通过火车延误、价格跟踪、缺货产品等相关方法激发接受度。

从技术上讲，网络上的[推送通知](https://developers.google.com/web/fundamentals/push-notifications/)在后台运行，这要归功于 Service Worker，并且这些通知通常由为管理活动而构建的系统（例如 Firebase）发送。此功能为移动 (Android) 和桌面用户带来了巨大的商业价值：它增加了重复访问量，从而增加了销售和转化率。

要测量您的推送活动的有效性，您需要测量整个漏斗：

- 有资格获得推送通知的用户数量
- 点击自定义通知 UI 提示的用户数
- 授予推送通知权限的用户数
- 收到推送通知的用户数
- 参与通知的用户数
- 来自通知的用户转化和参与

{% Img src="image/admin/UpzfxBDi3e66cZ9gzkkS.jpg", alt="测量网页推送通知的值", width="800", height="255" %}

有很多关于网络推送通知的优秀案例研究，比如家乐福，通过重新吸引用户购买曾经放弃的购物车物品[，将转化率提高了 4.5 倍。](https://useinsider.com/case-studies/carrefour/)

## PWA 中的 P：渐进式发布，逐个功能 {: #feature-by-feature }

PWA 是现代化网站，受益于网络的广泛覆盖范围，结合了  Android/iOS/ 桌面应用中所有用户喜爱的友好功能。它们利用了一系列最佳实践和现代 Web API，可以根据您的业务特性和优先级独立实施。

{% Img src="image/admin/7g1j2z7h5m9QSHQhHceM.jpg", alt="渐进启动您的 PWA", width="800", height="253" %}

为了加速您网站的现代化并使其成为真正的 PWA，我们鼓励您保持敏捷：逐个启动功能。首先，与您的用户一起研究哪些功能会给他们带来最大的价值，然后与您的设计师和开发人员一起实现这些功能，最后不要忘记精确测量您的 PWA 带来了多少额外的收入。

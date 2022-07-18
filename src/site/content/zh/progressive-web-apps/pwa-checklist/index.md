---
layout: post
title: 什么是优秀的渐进式 Web 应用程序？
authors:
  - samrichard
  - petelepage
date: 2020-01-06
updated: 2022-07-18
description: 什么是优秀或出色的渐进式 Web 应用程序？
tags:
  - progressive-web-apps
---

<!-- Disable heading-increment because it mucks with the Details widget -->

<!--lint disable heading-increment-->

渐进式 Web 应用程序 (PWA) 使用现代 API 构建和增强，以提供增强的功能、可靠性和可安装性，同时只需一个代码库就可以借助*任何设备触及任何用户、任何地方*。为了帮助您打造最佳体验，请按照[核心](#core)和[最佳](#optimal)清单以及建议进行实施。

## 核心渐进式 Web 应用程序清单 {: #core }

渐进式 Web 应用程序清单描述无论大小或输入类型如何，如何让应用程序可供所有用户安装和使用。

{% Details %} {% DetailsSummary 'h3' %}

快速启动，高效运行

为了确保在线体验成功，性能始终扮演着重要的角色，因为高性能的网站比性能不佳的网站更能吸引和留住用户。网站需要专注于以用户为中心的性能指标优化。

{% endDetailsSummary %}

为了确保在线体验成功，性能始终扮演着重要的角色，因为高性能的网站比性能不佳的网站更能吸引和留住用户。网站需要专注于以用户为中心的性能指标优化。

#### 原因

为了让用户*使用*您的应用程序，速度至关重要。实际上，随着页面加载时间从 1 秒变为 10 秒，用户的跳出率会增加 123%。不是说只要完成 <code>load</code> 事件，就不再需要考虑性能。不能让用户对他们的交互（例如，点击按钮）是否已注册产生疑问。滚动和动画要让用户感觉平滑顺畅。性能会影响用户的整体体验，不论是用户如何看待您的应用程序，还是应用程序的实际表现，都会受到影响。

虽然所有应用程序都有不同的需求，但 Lighthouse 中的性能审核基于 [RAIL 以用户为中心的性能模型](/rail/)，如果在这些审核中得到高分，则说明您的用户更有可能获得愉快的体验。您还可以使用 [PageSpeed Insights](https://pagespeed.web.dev/) 或 [Chrome 用户体验报告](https://developer.chrome.com/docs/crux/)来获取 Web 应用程序的实际性能数据。

#### 方法

按照我们[快速加载指南](/fast/)操作，了解如何让您的 PWA 快速启动，高效运行。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

适用于任何浏览器

在安装之前，用户可以使用他们选择的任何浏览器访问您的 Web 应用程序。

{% endDetailsSummary%}

在安装之前，用户可以使用他们选择的任何浏览器访问您的 Web 应用程序。

#### 原因

首先，渐进式 Web 应用程序是 Web 应用程序，这意味着它们需要跨浏览器工作，而不是只适合一款浏览器。

一种有效的实现方法是，用[弹性 Web 设计](https://resilientwebdesign.com/)中 Jeremy Keith 的话来说：确定核心功能，使用最简单的技术实现这种功能，然后在可能的情况下增强体验。在许多情况下，这意味着刚开始只使用 HTML 来创建核心功能，然后使用 CSS 和 JavaScript 增强用户体验，从而打造更具吸引力的体验。

以表单提交为例。最简单的实现方法是提交 `POST` 请求的 HTML 表单。构建完成后，您可以使用 JavaScript 来执行表单验证，并通过 AJAX 提交表单，从而增强体验，改善可以提供支持的用户的体验。

考虑到用户会在各种设备和浏览器上体验您的网站。因此，您不能简单只定位高端设备。通过使用功能检测，您能够为最广泛的潜在用户提供可用体验，包括那些使用当今可能已经被淘汰的浏览器和设备的用户。

#### 方法

Jeremy Keith 的[弹性 Web 设计](https://resilientwebdesign.com/)是非常好的资源，其中介绍了在这种跨浏览器的渐进式方法中如何思考 Web 设计。

#### 课外阅读

- A List Apart 的[《理解渐进式增强》](https://alistapart.com/article/understandingprogressiveenhancement/)非常详细地介绍了本主题。
- Smashing Magazine 的[渐进式增强功能：是什么，如何使用？](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/)提供实用的介绍和更高级主题的链接。
- MDN 有一篇题为[实现功能检测](https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)的文章，讨论了如何通过直接查询来检测功能。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

响应任何尺寸的屏幕

用户可以在任何尺寸的屏幕上使用您的 PWA，并且在任何视口尺寸下都可以使用所有内容。

{% endDetailsSummary %}

用户可以在任何尺寸的屏幕上使用您的 PWA，并且在任何视口尺寸下都可以使用所有内容。

#### 原因

设备尺寸各异，即使在同一台设备上，用户也可能使用界面大小不一的应用程序。因此，至关重要的一点是，您要确保内容不仅适合视口，而且网站上的所有功能和内容都可用于所有视口尺寸。

用户想要完成的任务和想要访问的内容不随视口大小而改变。内容可以以不同的视口大小重新排列，但不管怎样都会在那里。实际上，正如 Luke Wroblewski 在他的着作“移动为先”中所说的那样，从小到大，逐步增强，而不是反过来，这样就可以改善网站的设计：

> 移动设备要求软件开发团队只关注应用程序中最重要的数据和操作。在 320 x 480 像素的屏幕上，根本没有空间放置非必要的无关元素。您必须知道孰轻孰重。

#### 方法

有很多关于响应式设计的资源，包括 [Ethan Marcotte 的原创文章](https://alistapart.com/article/responsive-web-design/)，与之相关的[重要概念集合](https://snugug.com/musings/principles-responsive-web-design/)以及大量书籍和演讲。为了将讨论范围缩小到响应式设计的内容方面，您可以深入研究[内容优先设计](https://uxdesign.cc/why-you-should-design-the-content-first-for-better-experiences-374f4ba1fe3c)和[内容输出响应式布局](https://alistapart.com/article/content-out-layout/)。最后，虽然 Josh Clark 所著[《移动设计的七个致命错误》](https://www.forbes.com/sites/anthonykosner/2012/05/03/seven-deadly-mobile-myths-josh-clark-debunks-the-desktop-paradigm-and-more/#21ecac977bca)课程主要关注移动设备，但与响应式网站的小尺寸视图也密切相关。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

提供自定义离线页面

当用户离线时，与返回默认浏览器离线页面相比，让他们保留在您的 PWA 中可以提供更无缝的体验。

{% endDetailsSummary %}

当用户离线时，与返回默认浏览器离线页面相比，让他们保留在您的 PWA 中可以提供更无缝的体验。

#### 原因

无论连接状态如何，用户都希望安装的应用程序能够正常工作。特定于平台的应用程序在离线时永远不显示空白页面，而渐进式 Web 应用程序也不应显示浏览器默认的离线页面。无论是在用户导航到未缓存的 URL 时，还是在尝试使用需要连接的功能时，提供自定义离线体验都有助于让用户感觉您的 Web 体验是运行设备的一部分。

#### 方法

在执行服务工作进程的 `install` 事件期间，您可以预缓存自定义离线页面以供随后使用。如果用户离线，您可以使用预缓存的自定义离线页面来响应用户请求。您可以查看我们的自定义[离线页面示例](https://googlechrome.github.io/samples/service-worker/custom-offline-page/)，了解示例的实际效果以及实现方法。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

可安装

在设备上安装或添加应用程序的用户往往更愿意经常使用这些应用程序。

{% endDetailsSummary %}

在设备上安装或添加应用程序的用户往往更愿意经常使用这些应用程序。

#### 原因

安装后，渐进式 Web 应用程序的外观、感觉和行为与所有其他安装的应用程序相似。它的启动位置与用户启动其他应用程序的位置相同。它在自己的应用程序窗口中运行，与浏览器分开，并且会显示在任务列表中，就像其他应用程序一样。

为什么希望用户安装您的 PWA？原因与您希望用户从应用商店安装您的应用相同。安装您的应用程序的用户是参与度最高的受众，他们比典型访问者的参与度指标更高，通常与移动设备上的应用程序用户相差无几。这些指标包括更多的重复访问次数，更长的网站停留时间和更高的转化率。

#### 方法

您可以按照我们的[可安装指南](/customize-install/)了解如何让您的 PWA 可安装，以及如何通过测试来了解它是否可安装，此外，您还可以亲自动手试一试。

{% endDetails %}

## 最佳渐进式 Web 应用程序清单 {: #optimal }

要创建真正出色的渐进式 Web 应用程序，使其像典型的一流应用程序一样，您需要的不仅仅是核心清单。最佳渐进式 Web 应用程序清单是为了让用户感觉您的 PWA 是它运行的设备的一部分，同时利用 Web 的强大性。

{% Details %} {% DetailsSummary 'h3' %}

提供离线体验

如果不严格要求连接网络，那么，不管是离线还是在线，您的应用程序都要以相同的方式工作。

{% endDetailsSummary %}

如果不严格要求连接网络，那么，不管是离线还是在线，您的应用程序都要以相同的方式工作。

#### 原因

除了提供自定义离线页面之外，用户还希望渐进式 Web 应用程序可以离线使用。例如，旅行和航空公司应用程序应该在离线时应该能够轻松提供旅行详细信息和登机牌。音乐、视频和播客应用程序应允许离线播放。社交和新闻应用程序应缓存最近的内容，以便用户可以在离线时阅读。用户还希望在离线时保持身份验证，因此要设计离线身份验证机制。离线 PWA 可以为用户提供真正类似典型应用程序的体验。

#### 方法

确定用户希望在离线使用哪些功能后，您需要让您的内容可用且适应离线环境。此外，您可以使用 [IndexedDB](https://developers.google.com/web/ilt/pwa/working-with-indexeddb)（一种浏览器内的 NoSQL 存储系统）来存储和检索数据，还可以使用[后台同步](https://developer.chrome.com/blog/background-sync/)来允许用户在离线时执行操作和推迟服务器通信，直到再次建立稳定的连接。您还可以使用服务工作进程来存储其他类型的内容，例如供离线时使用的图像、视频文件和音频文件，以及使用它们来实现[安全且长期活动的会话](https://developer.chrome.com/blog/2-cookie-handoff/)，从而保持用户的身份验证。从用户体验的角度来看，您可以使用[骨架屏](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)，让用户在加载时感知速度和内容，然后根据需要回退到缓存的内容或离线指示器。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

完全可访问

所有用户交互都会传递 [WCAG 2.0](https://www.w3.org/TR/WCAG20/) 可访问性要求。

{% endDetailsSummary %}

所有用户交互都会传递 [WCAG 2.0](https://www.w3.org/TR/WCAG20/) 可访问性要求。

#### 原因

大多数用户总有一天会希望以符合 [WCAG 2.0](https://www.w3.org/TR/WCAG20/) 可访问性要求的方式来利用您的 PWA。用户理解您的 PWA 并与其进行交互的能力存在一个范围，需求可能是暂时的，也可能是永久的。通过让 PWA 可访问，您可以确保人人都可以使用您的 PWA。

#### 方法

W3C 的 [Web 可访问性简介](https://www.w3.org/WAI/fundamentals/accessibility-intro/)是非常好的入门资源。大多数可访问性测试必须手动完成。Lighthouse 中的[可访问性](/lighthouse-accessibility/)审核、[Axe](https://github.com/dequelabs/axe-core) 和[可访问性洞察](https://accessibilityinsights.io/)等工具可以帮助您自动执行一些可访问性功能测试。使用语义正确的元素（而不是重新创建）也很重要，例如 `a` 和 `button` 元素。这样可以确保在确实需要构建更高级的功能时，您仍可以满足用户的可访问预期（例如使用箭头与选项卡时）。[A11Y Nutrition Cards](https://accessibilityinsights.io/) 为一些常见组件提供了一些非常好的建议。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

可通过搜索发现

通过搜索可以轻松[发现您的 PWA](/discoverable/)。

{% endDetailsSummary %}

通过搜索可以轻松[发现您的 PWA](/discoverable/)。

#### 原因

Web 的最大优势之一是能够通过搜索发现网站和应用程序。实际上，[一半以上](https://www.brightedge.com/resources/research-reports/channel_share)的网站流量来自自然搜索。至关重要的是，确保内容的 URL 规范，并且搜索引擎可以将您的网站加入索引，以便用户轻松找到您的 PWA。采用客户端渲染时尤其如此。

#### 方法

首先，确保每个 URL 具有唯一的描述性标题和元描述。然后，您可以使用 [Google Search Console](https://search.google.com/search-console/about) 和 Lighthouse 中的[搜索引擎优化审核](/lighthouse-seo/)来帮助您调试和修复 PWA 的可发现性问题。您还可以使用 [Bing](https://www.bing.com/toolbox/webmaster) 或 [Yandex](https://webmaster.yandex.com/welcome/) 的网站管理员工具，并考虑在您的 PWA 中利用 [Schema.org](https://schema.org/) 中提供的架构来包含[结构化数据](https://goo.gle/search-gallery)。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

适用于任何输入类型

您的 PWA 同样支持鼠标、键盘、手写笔或触控操作。

{% endDetailsSummary %}

您的 PWA 同样支持鼠标、键盘、手写笔或触控操作。

#### 原因

设备会提供多种输入法，当使用您的应用程序时，用户需要能够无缝切换这些输入法。同样重要的是，输入法不应依赖屏幕尺寸，这意味着大视口需要支持触摸，而小视口也需要支持键盘和鼠标。您要尽可能确保应用程序及其所有功能支持您的用户可能选择使用的任何输入法。在适当情况下，您还要增强体验，以允许特定于输入的控制（例如，下拉刷新）。

#### 方法

[指针事件 API](https://developer.chrome.com/blog/pointer-events/) 提供了一个统一的界面来处理各种输入选项，非常适合添加手写笔支持。为了同时支持触摸和键盘键入，请确保使用正确的语义元素（定位点、按钮、表单控件等），而不是使用非语义 HTML（对可访问性有利）来重建这些元素。当包含在悬停时激活的交互时，确保它们也可以在单击或点击时激活。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

为权限请求提供上下文

请求使用强大 API 的权限时，提供上下文并仅在需要 API 时进行询问。

{% endDetailsSummary %}

请求使用强大 API 的权限时，提供上下文并仅在需要 API 时进行询问。

#### 原因

触发权限提示的 API（如通知、地理位置和凭据）对用户具有破坏性，这是有意设计的，因为它们往往与需要选择加入的强大功能相关。在没有额外上下文的情况下触发这些提示（例如在页面加载时）会让用户不太可能接受这些权限，并在将来更可能不信任它们。因此，向用户提供为何需要这种权限的上下文理由后，您才应触发这些提示。

#### 方法

[权限用户体验](https://developers.google.com/web/fundamentals/push-notifications/permission-ux)一文和 UX Planet 的[《询问用户权限许可的正确方法》](https://uxplanet.org/mobile-ux-design-the-right-ways-to-ask-users-for-permissions-6cdd9ab25c27)是了解如何设计权限提示的优秀资源，虽然它主要讲述在移动设备上的设计，但同样适用于所有 PWA。

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

遵循健康代码的最佳实践

保持代码库健康可以更轻松地实现目标和交付新功能。

{% endDetailsSummary %}

保持代码库健康可以更轻松地实现目标和交付新功能。

#### 原因

构建现代 Web 应用程序需要考虑周全。让应用程序保持最新状态，并让代码库保持健康，您可以更轻松地交付满足此清单中列出的其他目标的新功能。

#### 方法

很多高优先级检查可以确保代码库健康：避免使用包含已知漏洞的库，确保不使用已弃用的 API，从代码库中删除 Web 反模式（例如使用 `document.write()` 或使用非被动滚动事件侦听器），以及采用防御性编码来确保您的 PWA 在分析或其他第三方库加载失败时不会中断。考虑需要在多个浏览器和发布渠道中进行静态代码分析（如 Linting）以及自动化测试。这些技术有助于提前发现错误，以免进入生产环境。

{% endDetails %}

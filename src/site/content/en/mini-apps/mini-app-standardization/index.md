---
layout: post
title: Mini app standardization
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter introduces the standardization effort that has been started for mini apps.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## Mini app popularity

Mini apps have seen tremendous growth. WeChat mini apps as of June 2020 have reached
[830 million active users](https://www.questmobile.com.cn/research/report-new/122), Alipay mini apps
[401 million active users](https://kr-asia.com/the-mau-of-wechat-alipay-and-baidus-mini-programs-now-add-up-to-more-than-1-billion)
as of April 2019, and Baidu mini apps in the same month
[115 million active users](https://kr-asia.com/the-mau-of-wechat-alipay-and-baidus-mini-programs-now-add-up-to-more-than-1-billion).
Effectively companies have traded building apps for the two operating systems iOS and Android and
additionally the web for building apps for three or more
[super apps platforms](/mini-app-super-apps/#for-mini-apps-you-need-super-apps).
The differences
between each super app platform may not be as big as the differences between Android, iOS, and the
web, but nevertheless they exist. Where on Android, iOS, and the web, we have seen cross-platform
approaches like [Flutter](https://flutter.dev/), [Ionic](https://ionicframework.com/), and
[React Native](https://reactnative.dev/) ([for Web](https://github.com/necolas/react-native-web))
gain popularity, in the mini apps ecosystem, we can see an effort led by the
[MiniApps Ecosystem Community Group](https://www.w3.org/community/miniapps/) with
[members](https://www.w3.org/community/miniapps/participants) from, among others, Alibaba, Baidu,
ByteDance, Huawei, Intel, Xiaomi, China Mobile, Facebook, and Google to standardize aspects of mini
apps.

## Publications

Notable publications of the group so far include a
[whitepaper](https://w3c.github.io/miniapp/white-paper/), a
[Comparison of APIs in MiniApps, W3C specs, and PWAs](https://www.w3.org/TR/mini-app-white-paper/comparison.html),
and specifications and explainers on the following aspects:

- URI Scheme: [spec](https://w3c.github.io/miniapp/specs/uri/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/uri/docs/explainer.md)
- Lifecycle: [spec](https://w3c.github.io/miniapp/specs/lifecycle/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/lifecycle/docs/explainer.md)
- Manifest: [spec](https://w3c.github.io/miniapp/specs/manifest/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/manifest/docs/explainer.md)
- Packaging: [spec](https://w3c.github.io/miniapp/specs/packaging/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/packaging/docs/explainer.md)
- An exploration of [widget requirements](https://w3c.github.io/miniapp/specs/widget-req/)

W3C member and group participant Fuqiao Xue (W3C) has further published a
[Comparison of MiniApps and web apps](https://xfq.github.io/miniapp-comparison/) on his own behalf,
that is, not as an official group publication, but nonetheless worth the read.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/NW2O3YZ3kxJPPeFr4Jw6.png", alt="The header of the MiniApp Standardization White Paper in a browser window.", width="800", height="540" %}
  <figcaption class="w-figure">
    The MiniApp Standardization White Paper.
  </figcaption>
</figure>

## Formal launch of the W3C MiniApps Working Group

On January 19, 2021, the [MiniApps Working Group](https://www.w3.org/2021/miniapps/) was [formally launched](https://www.w3.org/blog/2021/01/w3c-launches-the-miniapps-working-group/) in the W3C.
The group uses the spelling and capitalization "MiniApps" to distinguish the standardization effort from the technology.
You can read the group's [charter](https://www.w3.org/2021/01/miniapps-wg-charter.html) to get a feel for the planned work.
Leaders of the group introduced the effort as follows:

> Currently, there are many variants of MiniApps developed by different vendors with different APIs.
  To enhance the interoperability between MiniApp platforms, mainstream MiniApp vendors including
  Alibaba, Baidu, Huawei, and Xiaomi have been working together in the [W3C Chinese Web Interest Group](https://www.w3.org/2018/chinese-web-ig/index.html)
  since May 2019 and published a [MiniApp Standardization White Paper](https://www.w3.org/TR/mini-app-white-paper/) in September 2019 as the initial standardization exploration for MiniApp technologies. As more global companies get interested in joining the MiniApp related discussion, the MiniApps Ecosystem Community Group launched during TPAC 2019 so that the global Web community can join the discussion.

> Based on extensive standardization requirements, W3C today announced the formal establishment of the MiniApps Working Group,
  dedicated to in-depth exploration and coordination of the diverse MiniApp ecosystem with W3C members and the public,
  and enhancing the interoperability of different MiniApp platforms, thereby maximizing the integration of MiniApps and the Web,
  reducing technical fragmentation and the learning cost of developers.

*"Maximizing the integration of MiniApps and the Web"* in particular sounds very interesting.
As a curious member of the group, I look forward to seeing where this endeavor is headed.

{% Aside 'success' %}
  The following chapter looks at [alternative mini app runtime environments](/mini-app-alternative-runtime-environments/) apart from mobile devices.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.

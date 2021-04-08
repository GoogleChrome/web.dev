---
layout: post
title: Mini apps and super apps
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter introduces the concept of super apps and presents the major super app providers.
tags:
  - mini-apps
---

## Welcome to mini apps

When you look at applications on your phone, you probably have specific apps for specific tasks.
You might have a banking app. You might have an app for buying public transit tickets. Likely you
have an app for getting directions, and many more specialized apps. This post introduces you to the
concept of a different kind of apps—mini apps—sometimes also called mini programs or applets.
You will first learn about the background of various mini app platforms and their developer experience, and
then focus on things the web can learn from mini apps. But before learning about mini apps, you first
need to learn about super apps.

## What are super apps?

Super apps serve as hosts to other apps that run within them: the so-called mini apps. Popular super apps are
[WeChat](https://weixin.qq.com/) (微信) by Tencent, [Alipay](https://www.alipay.com/) (支付宝) by Ant Group
(an affiliate company of the Chinese Alibaba Group), the app of the search engine [Baidu](https://baidu.com/) (百度),
as well as ByteDance's [Douyin](https://www.douyin.com/) (抖音), which you might know as TikTok (蒂克托克).
The first three are commonly also referred to as BAT, derived from **B**(aidu)**A**(libaba)**T**(encent).
Super apps have taken the Chinese market by storm, which is why a lot of the examples in this article are Chinese.

<figure class="w-figure">
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/UKmUgG231MtQ2nEo1P0K.PNG", alt="List of recently launched mini apps in the WeChat super app.", width=300, height=649 %}
  <figcaption class="w-figcaption">The WeChat super app showing recently launched mini apps.</figcaption>
</figure>

### A few words about super app platforms

WeChat aims to make itself a one-stop shop to meet almost any need users might have in their daily
lives. Alipay builds its platforms on top of its payment system, focusing on retail and financial
services, including credit, loan, insurance, installment, and local life services. Baidu strives to
transform its search engine from solely connecting people, services, and information into
information-as-a-service through mini programs for travel, retail, ads, payment, and more. Last but
not least Douyin wants to boost itself as a hub for social e-commerce and transform to more of an
entertainment and shopping platform.

### Installing super apps

Super apps are available on multiple operating systems. Note that the versions available in
the official app stores may not always contain all features or be available in all locales. The
links below point to links that work universally, but that may require loading from untrusted
sources, so download and install the apps **at your own risk**. You typically need to create an
account, which involves revealing your phone number. You might want to consider getting a burner
phone. Be advised that many super apps only allow you to create a so-called overseas account, which
does not have all features of a domestic account.

- **WeChat:** [iOS](https://apps.apple.com/us/app/wechat/id414478124),
  [Android](https://weixin.qq.com/cgi-bin/readtemplate?uin=&stype=&promote=&fr=&lang=zh_CN&ADTAG=&check=false&t=weixin_download_method&sys=android&loc=weixin,android,web,0),
  [macOS](https://mac.weixin.qq.com/), [Windows](https://pc.weixin.qq.com/)
- **Baidu:** [iOS](https://apps.apple.com/us/app/%E7%99%BE%E5%BA%A6/id382201985),
  [Android](https://play.google.com/store/apps/details?id=com.baidu.searchbox&hl=en)
- **Alipay:** [iOS](https://itunes.apple.com/app/id333206289?mt=8),
  [Android](https://t.alipayobjects.com/L1/71/100/and/alipay_wap_main.apk)
- **Douyin:**
  [iOS](https://itunes.apple.com/cn/app/%E6%8A%96%E9%9F%B3%E7%9F%AD%E8%A7%86%E9%A2%91/id1142110895?l=zh&ls=1&mt=8)
  (CN-only), [Android](http://s.toutiao.com/UsMYE/)

{% Aside %}
Since the user interface of many super apps is Chinese-only, use the
[Google Translate app](https://translate.google.com/intl/en/about/#!#speak-with-the-world) in camera
mode with a secondary phone (given you have one) to understand what is going on if you do not speak Chinese.
{% endAside %}

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSLjHjkFgscBC2j2d6j9.png", alt="A secondary phone running Google Translate in camera mode live-translating the user interface of a Chinese mini app running on the primary phone.", width="300", height="520" %}
  <figcaption class="w-figure">
    Using Google Translate in camera mode to live-translate a Chinese mini app.
  </figcaption>
</figure>

{% Aside 'success' %}
  Read on to [learn more about mini apps](/mini-app-about/) in the next chapter.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.

---
layout: post
title: What are H5 and QuickApp?
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter provides background on H5 apps and QuickApp, which are both distinct from mini apps.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## What mini apps are not

Before I go into more detail on the developer experience of mini apps, I want to briefly mention and
set apart two technologies that come up in the context of mini apps, H5 and Quick App.

## H5

H5 apps (or pages) are commonly seen as the predecessor of mini apps. What people mean by H5 is
essentially a well-designed mobile web app (or page) that can be shared easily on chat applications.
H5 is a reference to the HTML5 umbrella of technologies that includes responsive design, snappy CSS
animations, multimedia content, etc. The Chinese Wikipedia actually
[redirects](https://zh.wikipedia.org/wiki/H5) from H5 to HTML5. A good example of a representative
H5 page experience is the [WeChat H5 boilerplate](https://panteng.github.io/wechat-h5-boilerplate/)
project's demo.

## Quick App

[Quick App](https://www.quickapp.cn/) is an industry alliance consisting of the following members:

- [vivo open platform](https://dev.vivo.com.cn/)
- [Huawei Developer Alliance](http://developer.huawei.com/cn/consumer)
- [OPPO open platform](https://open.oppomobile.com/)
- [Xiaomi Open Platform](https://dev.mi.com/console/app/newapp.html)
- [Lenovo Open Platform](http://open.lenovo.com/developer/)
- [Gionee Open Platform](http://devquickapp.gionee.com/)
- [Meizu Open Platform](http://open.flyme.cn/)
- [ZTE Developer Platform](https://dev.ztems.com/)
- [Nubian Open Platform](http://developer.nubia.com/developer/view/index.html)
- [OnePlus Open Platform](http://www.oneplus.cn/)
- [Hisense Open Platform](http://dev.hismarttv.com/)
- [China Mobile Terminal Corporation](https://www.chinamobileltd.com/tc/global/home.php)

While the technology of Quick App is comparable to "regular" mini apps (see
[Building blocks and compatibility](/mini-app-about/#building-blocks-and-compatibility)), the discovery of Quick App
is different. They are meant to be listed in stores, which come pre-installed on devices of the
manufacturers in the alliance, but can also be shared by means of a deep link (see the
[Quick App showcase](https://www.quickapp.cn/quickAppShow)). They do not run in the context of a
super app, but launch as seemingly self-contained full screen applications that feel deeply integrated into
device. What happens in the background is that they are opened in a full screen view rendered by the
operating system that provides the JavaScript bridge.

{% Aside 'success' %}
  The next chapter covers the [developer experience of mini apps](/mini-app-devtools/).
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.

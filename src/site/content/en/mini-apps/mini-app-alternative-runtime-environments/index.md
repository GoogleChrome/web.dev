---
layout: post
title: Other mini app runtime environments
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter presents a number of runtime environments for mini apps that are not mobile devices.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## More than just on mobile

In countries like China, mini apps have taken the market by storm.
Apart from mobile devices, where mini apps are omnipresent and which are their natural habitat, mini
apps have started to conquer other runtime environments like cars and the classic desktop.

## Mini apps in cars

In July 2020 the German car maker BMW Group
[announced](https://www.press.bmwgroup.com/china/article/detail/T0313254ZH_CN/%E2%80%9C2020-%E5%AE%9D%E9%A9%AC%E7%A7%91%E6%8A%80%E6%97%A5%E2%80%9D%E5%9C%A8%E7%BA%BF%E5%8F%91%E5%B8%83%E5%A4%9A%E6%AC%BE%E8%BD%A6%E5%86%85%E6%95%B0%E5%AD%97%E4%BA%A7%E5%93%81)
a collaboration with Tencent branded as WeScenario, which,
[according to Tencent](https://www.tencent.com/en-us/articles/2201068.html), will be rolled out to _"30
leading auto companies in the world, and [bring the WeScenario] ecosystem of social, content and
services to more than 110 mainstream automobile models"_.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AX07xQlEHL7MDjPo1U1H.jpg", alt="Dashboard of a Tencent car showing two rows of mini app icons.", width="800", height="533" %}
  <figcaption class="w-figure">
    Landing page of Tencent WeScenario (Source: <a href="https://www.press.bmwgroup.com/china/article/detail/T0313254ZH_CN/%E2%80%9C2020-%E5%AE%9D%E9%A9%AC%E7%A7%91%E6%8A%80%E6%97%A5%E2%80%9D%E5%9C%A8%E7%BA%BF%E5%8F%91%E5%B8%83%E5%A4%9A%E6%AC%BE%E8%BD%A6%E5%86%85%E6%95%B0%E5%AD%97%E4%BA%A7%E5%93%81">BMW</a>).
  </figcaption>
</figure>

## Mini apps on the desktop

### Mini apps in WeChat Desktop

Using the WeChat desktop client available for
[macOS](https://dldir1.qq.com/weixin/mac/WeChatMac.dmg)
and [Windows](https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe)), it is possible to run WeChat
mini apps on the desktop. (Make sure to _not_ load the macOS
[version from the App Store](https://itunes.apple.com/cn/app/id836500024)
if you are doing research and want the full experience, since it is more limited.)

To test it on macOS, share a mini app from a mobile device with yourself via the "File Transfer"
account. This will result in a message that you can then open on the desktop client. In most cases,
the mini app will then be directly clickable and runnable. In other cases, you have to forward the
chat history to yourself again from a mobile device.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLbYBpAoSvbc1Qjc9Ub0.png", alt="The WeChat macOS desktop client showing a chat with oneself with a shared mini app and a chat history as the two visible messages.", width="800", height="602" %}
  <figcaption class="w-figure">
    Sharing a mini app with oneself in the WeChat macOS desktop client.
  </figcaption>
</figure>

On Windows, the workaround to share mini apps with oneself is not necessary, since there is a
dedicated mini apps panel that shows the user's recently used mini apps and also includes an app
search where new mini apps can be discovered.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/NQCoGaAWcbuiO37dCNY5.png", alt="The mini app panel in the WeChat Windows client showing the user's recently used mini apps.", width="800", height="531" %}
  <figcaption class="w-figure">
    The mini app panel in the WeChat Windows client.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/H5nqmnoK9JjLcu8mWDSH.png", alt="The mini app search in the WeChat Windows client showing mini apps listed in various categories like games, business, education, etc.", width="800", height="576" %}
  <figcaption class="w-figure">
    The mini app search in the WeChat Windows client.
  </figcaption>
</figure>

WeChat mini apps on the desktop naturally integrate with the operating system. On both macOS and
Windows, they get their own entry in the multitasking bar and have their own taskbar icon. While on
macOS, there is an option to be kept in the Dock, the icon disappears the moment the WeChat client
app gets closed. On Windows, mini app icons can be pinned to the taskbar, but cannot be launched. On
macOS, the title of the app is always "WeChat" and not the actual title of the app, whereas the
title is displayed correctly on Windows.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nrvwtwOWot6eZI40evfp.png", alt="The macOS multitask switcher includes mini apps alongside regular macOS app.", width="800", height="79" %}
  <figcaption class="w-figure">
    The Starbucks app is a mini app and can be multitasked to like any regular macOS app.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fG4cpJgpyXeqvjn4lF3v.png", alt="The Starbucks mini app icon on the macOS Dock with a WeChat title.", width="646", height="412" %}
  <figcaption class="w-figure">
   Mini apps on macOS have WeChat as their title.
  </figcaption>
</figure>

Most mini apps are not optimized for desktop yet and run in a fixed, non-resizable window that
includes the well-known UI affordances and permission prompts as on mobile (see
[The user experience](/mini-app-about/#the-user-experience)).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uorcciuZIL8sadxTjXbv.png", alt="The Starbucks mini app running on macOS asking for the user profile permission which the user can grant via a prompt shown at the bottom.", width="300", height="484" %}
  <figcaption class="w-figure">
    The Starbucks mini app running on macOS asking for the user profile permission.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UGufvRnoaAGm8A3qQG4a.png", alt="The Starbucks mini app running on macOS showing the home screen of the app.", width="300", height="484" %}
  <figcaption class="w-figure">
    The Starbucks mini app running on macOS in a fixed, non-resizable window.
  </figcaption>
</figure>

Responsive mini apps that are optimized for the desktop (apart from for mobile) can be displayed in
a wider window that on macOS is currently still fixed, but that on Windows is flexibly resizable.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cUMqQ75zPeCDNTcCWF5D.png", alt="The WeChat components demo app in a responsive app window that can be resized and that by default is wider than the usual mobile screen.", width="800", height="620" %}
  <figcaption class="w-figure">
    The WeChat components demo app in a responsive app window.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rPbojIjBGKbNtDviB0MJ.png", alt="The WeChat components demo app in a narrow window showing three boxes A, B, and C stacked on top of each other.", width="300", height="614" %}
  <figcaption class="w-figure">
    The WeChat components demo app in a narrow app window.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xnlacc8Xm1eNMCuajYYL.png", alt="The WeChat components demo app in a wide window showing three boxes A, B, and C with A stacked on top of B and C on the side.", width="600", height="565" %}
  <figcaption class="w-figure">
    The WeChat components demo app in a wide app window.
  </figcaption>
</figure>

Mini app permission settings on macOS can be changed via the context menu. On Windows, this does not
seem to be possible and the location reported by the demo app appears to be the coarse location that
Windows allows apps to obtain without asking for permission.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rHyiTGbMauqbSFWBFlMW.png", alt="The WeChat components demo app running on macOS showing two checkboxes for the location and user info permission.", width="500", height="384" %}
  <figcaption class="w-figure">
    WeChat mini app settings on macOS.
  </figcaption>
</figure>

### Mini apps in the 360 Secure Browser

360 Secure Browser (360 安全浏览器) is a web browser developed by the company Qihoo. Apart from
[iOS and Android](https://mse.360.cn/), the browser is also available for
[Windows](https://browser.360.cn/se/), [macOS](https://browser.360.cn/ee/mac/index.html), and
[Linux](https://browser.360.cn/se/linux/index.html). On Windows, it is capable of running special
[360 mini apps](https://mp.360.cn/#/). The
[developer documentation](https://mp.360.cn/doc/miniprogram/dev/) and the
[API](https://mp.360.cn/doc/miniprogram/dev/#/e1487ee88399013ec06eff05007391fc) are comparable to
those of other vendors; however, 360 does not offer dedicated DevTools. Instead, developers need to
create their mini apps in an IDE of their own choosing and can then test them in the browser using a
special development mode. Debugging happens through Chrome Dev Tools. A
[demo app](https://mp.360.cn/examples/appdemo.zip) is available for getting started.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IdHpN4GhVWDZ5gmSZ4Jb.png", alt="A 360 mini app running in 360 Secure Browser being debugged with Chrome Dev Tools.", width="800", height="402" %}
  <figcaption class="w-figure">
    Debugging a 360 mini app using Chrome Dev Tools.
  </figcaption>
</figure>

360 mini apps can run in fullscreen mode and do appear as separate entries in the multitasking bar.
Via the context menu, a home screen icon can be added that allows for mini apps to be launched from
the desktop.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/M4MPV6TXwsLC6lFn9Jgi.png", alt="A 360 video mini app running in fullscreen mode showing various thumbnails of videos to watch.", width="800", height="402" %}
  <figcaption class="w-figure">
    360 mini app running in fullscreen mode.
  </figcaption>
</figure>

## Web-based mini apps

There are some mini app platforms that are web-based, but that depend on the presence of a special
WebView to unlock their full potential.

### LINE

[LINE](https://line.me/) is an app for instant communications on electronic devices such as
smartphones, tablet computers, and personal computers. In addition, LINE is a platform providing
various services including digital wallet, news stream, video on demand, and digital comic
distribution. The service is a subsidiary of Korean internet search engine company,
[Naver Corporation](http://www.navercorp.com/).

Since LINE [mini apps](https://developers.line.biz/en/docs/line-mini-app/quickstart/) is
[essentially just a regular web app](https://developers.line.biz/en/docs/line-mini-app/discover/specifications/#supported-platforms-and-versions)
(see [sample app](https://github.com/line/line-liff-v2-starter)) that pulls in the
[LINE Front-end Framework](https://developers.line.biz/en/docs/liff/developing-liff-apps/#developing-a-liff-app)
(LIFF),  it can also be accessed outside of the main LINE app through special
[permanent links](https://developers.line.biz/en/docs/line-mini-app/develop/permanent-links/)
([example](https://liff.line.me/1653544369-LP5XbPYw)). However, not all APIs are available in such
cases. Examples of not available in the browser APIs include the
[`liff.scanCode()`](https://developers.line.biz/en/reference/liff/#scan-code) method for reading QR
codes or Bluetooth-related APIs like
[`liff.bluetooth.getAvailability()`](https://developers.line.biz/en/reference/liff/#bluetooth-get-availability).
To get a feel for the platform, you can test the
[LINE Playground app](https://liff.line.me/1653544369-LP5XbPYw) in the browser and the LINE app if
you have a LINE account.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YIlFjXgZhq8ROMrPA1BO.png", alt="The LINE Playground demo app running on an iOS device showing `liff.getOS()` returning 'ios'.", width="300", height="649" %}
  <figcaption class="w-figure">
   The LINE Playground demo app running on an iOS device.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UPwJbVhssGfA4IQ89kEo.png", alt="The LINE Playground demo app running in the web browser showing `liff.getOS()` returning 'web'.", width="800", height="510" %}
  <figcaption class="w-figure">
   The LINE Playground demo app running in the web browser.
  </figcaption>
</figure>

### Google Spot

The [Google Spot Platform](https://developers.google.com/pay/spot) allows developers to set up a
Spot on [Google Pay](https://pay.google.com/)—a digital storefront that they can create, brand, and
host however they choose. It is discoverable both online as well as through physical barcodes. Users
can easily share a "Spot" (as the app calls it) on their favorite messaging app or find it on Google Pay. A Spot is built
using HTML and JavaScript, so existing investments into mobile websites or PWAs can be easily
transformed into a Spot by "adding a few lines of JavaScript" according to the announcement post.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/T4OLZX8PIFjFq3gVzUmo.png", alt="The Eat.fit mini app running in the Google Pay super app showing the sign-in bottom sheet.", width="300", height="637" %}
  <figcaption class="w-figure">
   The Eat.fit mini app running in the Google Pay super app (Source: <a href="https://developers.google.com/pay/spot">Google</a>).
  </figcaption>
</figure>

### Snap Minis

[Snap Inc.](https://snap.com/) is an American camera and social media company most known for its
chat app [Snapchat](https://www.snapchat.com/). Snap has announced
[Snap Minis](https://minis.snapchat.com/), bite-size utilities made for friends. They are built with
HTML5, so they are easy to develop. Plus, they work for all Snapchatters, on any kind of device,
with no installation required.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vM5d0wK5fCQSV0VyP7HA.png", alt="The Atom Tickets mini app running in Snapchat showing three snapchat users reserving their seats in a movie theater.", width="320", height="470" %}
  <figcaption class="w-figure">
   The Atom Tickets mini app running in Snapchat (Source: <a href="https://minis.snapchat.com/">Snap</a>).
  </figcaption>
</figure>

{% Aside 'success' %}
  Read on to see some examples of the [mini app open source projects](/mini-app-open-source-projects/).
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.

---
layout: post
title: What are mini apps?
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter introduces the concept of mini apps and provides examples of their look and feel.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## Building blocks and compatibility

Mini apps are small (commonly less than 4MB) apps that require a
[super app](/mini-app-super-apps/#for-mini-apps-you-need-super-apps)
to run. What they have in
common, independent of the super app, is that they are built with ("dialects" of) the web
technologies HTML, CSS, and JavaScript. The runtime of a mini app is a
[WebView](https://research.google/pubs/pub46739/) in the super app, not the underlying operating
system, which makes mini apps cross platform. The same mini app can run
in the same super app, no matter if the super app runs on Android, iOS, or another OS. However, not
all mini apps can run in all super apps, more on this [later](/mini-app-standardization/).

## Discovery

Mini apps are often discovered _ad-hoc_ via branded 2D barcodes, which solves an important
offline-to-online challenge, for example, getting from a physical restaurant menu to a payment mini
app, or from a physical e-scooter to a rental mini app. The image below shows an example of such a
branded 2D barcode for
[WeChat's demo mini app](https://github.com/wechat-miniprogram/miniprogram-demo). When the code is
scanned with the WeChat super app, the mini app launches directly.
Other super apps will typically not be able to recognize the barcode.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SOisfOqKQWr0GZZvUaqn.jpg", alt="WeChat-branded 2d barcode.", width="250", height="250" %}
  <figcaption class="w-figure">
    Scanning this 2d barcode with the WeChat app launches a demo mini app.
  </figcaption>
</figure>

Mini apps can also be discovered through regular in-app search in the super app, be shared in chat
messages, or be part of a news item in a news feed. Some super apps have the notion of verified
accounts that can contain mini apps in their profiles. Mini apps can be highlighted when they are
physically geographically close, like the mini app of a business in front of which the user
stands, or virtually close, like when the user gets directions on a map shown in the super
app. Frequently used mini apps are available in an app drawer that in many super apps can be
accessed through a swipe down gesture or through a special section in the super app menu.

## The user experience

All super apps have more or less the same user interface for mini apps. A themeable top bar with the
mini app's name, and, in the upper corner of the screen, a close button on the far right preceded by
an action menu that provides access to common features like sharing the app, adding it to a
favorites list or the home screen, reporting abusive apps, providing feedback, and settings. The
screenshot below shows a shopping mini app running in the context of the Alipay super app with the
action menu opened.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PkjzF8AyxDVIAMZmhVrr.jpg", alt="The Alipay super app running a shopping mini app with highlighted top bar, action menu button, and close button. The action menu is opened.", width="300", height="649" %}
  <figcaption class="w-figure">
    Opened action menu of a shopping mini app running in the Alipay super app.
  </figcaption>
</figure>

## UI paradigms

Usually there is a bottom tab bar for the mini app's main navigation. Most [super app providers offer
components](/mini-app-components/) that help developers quickly implement common UI paradigms,
such as carousels, accordions, progress bars, spinners, switches, maps, and so on. This also helps make the
user experience between different mini apps consistent, which is encouraged by
[WeChat's Mini Program Design Guidelines](https://developers.weixin.qq.com/miniprogram/en/design/).
This is similar to what Apple incentivizes with its
[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/),
and Google with its [Design for Android](https://developer.android.com/design) recommendations.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nFVCU3HqKERzl7Lops6Q.png", alt="The Douyin demo mini app showcasing the Douyin slider (carousel) component with toggles for auto-advance, dot indicators, etc.", width="300", height="617" %}
  <figcaption class="w-figure">
    Douyin's slider (carousel) component with various options.
  </figcaption>
</figure>

## Serving

Rather than being served piece by piece as separate resources, mini apps are served as encrypted
packaged apps, that is, as archives that contain all resources in just one file. Unlike regular web
apps, they are also not served from the particular origin of the mini app creator, but from the
super app provider directly. They can still access APIs from the servers of the mini app creator,
but the core resources (commonly referred to as the app shell), must be served from the super app
provider. Mini apps have to declare the origins they request additional data from.

## Caching, updates, and deep-linking

Mini apps are kept in the cache of the super app, so the next time the user launches a cached mini
app, it loads almost instantly. If there is an update, a new app package is loaded. The version
number can be part of the launch URI (see [Discovery](/mini-app-about/#discovery)), so the super app knows early on
if the locally cached version is still current. The launch URI also optionally contains the desired
page of the mini app, so deep-linking into specific pages of mini apps is possible. Via a sitemap,
mini apps can declare which of their pages should be indexable by the super app provider's mini app
crawler.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZKLNvNnm3Rr6aBmYbons.png", alt="macOS Finder showing a folder containing cached WeChat mini app `.wxapkg` files.", width="800", height="465" %}
  <figcaption class="w-figure">
    Mini apps are cached as encrypted packaged apps.
  </figcaption>
</figure>

## Security and permissions

Mini apps are reviewed by the super app provider, which means users perceive them as more secure
than web apps. They need to declare their potentially required permissions beforehand in a manifest
or mini app configuration file, which, for some providers, also requires explanations for why each
permission is needed. Mini apps can of course still lie, but they would have a hard time justifying
why they are, for example,
[trying to access motion sensors](https://twitter.com/search?q=why%20website%20access%20%22motion%20sensors%22%20&src=typed_query&f=live)
without a reason that is apparent to the user. The incentive to fingerprint the user is notably a
lot lower compared to the web, since the user is typically already logged in to the super app anyway
(see [Identity, payement, and social graph](/mini-app-about/#identity-payment-social-graph)).

Whenever a mini app performs an operation that requires a special permission, a prompt is shown to
the user that, if enforced by the platform, also includes the usage justification, as stated by the
developer. The screenshot below shows the
[Douyin demo mini app](https://microapp.bytedance.com/docs/zh-CN/mini-app/introduction/plug-in/example/)
as it asks the user for permission to share their location. In some super apps, there is also an
imperative API that mini apps can leverage to request permissions without immediately using them, or
to only check the status of a permission. This may even include an API to open the central super app
permission settings, which corresponds to
[Chrome's _Site Settings_](chrome://settings/content/siteDetails?site=https%3A%2F%2Fexample.com%2F).
Mini apps also have to declare beforehand the origins of all servers that they potentially will
request data from.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8To8DiUqnP4qqFfpPNqk.png", alt="The Douyin demo mini app showing a geolocation prompt with two options: 'Not Allowed' and 'Allowed'.", width="300", height="617" %}
  <figcaption class="w-figure" >
    The Douyin demo mini app asking for the geolocation permission.
  </figcaption>
</figure>

## Access to powerful features

The hosting super app offers access to powerful APIs via a JavaScript bridge that gets injected into
the WebView offered by the super app (see
[Building blocks and compatibility](/mini-app-about/#building-blocks-and-compatibility)). This JavaScript bridge
provides hooks into the operating system's APIs. For example, a mini app JavaScript function like
`getConnectedWifi()`—the capability of a mini app to obtain the name of the currently active Wi-Fi
network—under the hood is facilitated through Android's
[`getConnectionInfo()`](<https://developer.android.com/reference/android/net/wifi/WifiManager#getConnectionInfo()>)
API or iOS'
[`CNCopyCurrentNetworkInfo()`](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo)
API. Other examples of powerful device APIs exposed in common super apps are Bluetooth, NFC,
iBeacon, GPS, system clipboard, orientation sensors, battery information, calendar access, phonebook
access, screen brightness control, file system access, vibration hardware for physical feedback,
camera and microphone access, screen recording and screenshot creation, network status, UDP sockets,
barcode scanning, device memory information, and more.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HNEKyoLVeq3IUKGXEZEZ.png", alt="The WeChat demo mini app showing a slider that controls the screen brightness of the device moved all the way to the maximum.", width="300", height="649" %}
  <figcaption class="w-figure">
    The WeChat demo mini app setting the device's screen brightness to the maximum.
  </figcaption>
</figure>

## Access to cloud services

Many super apps also provide "serverless" access to cloud services of the super app provider that,
apart from raw cloud computing and cloud storage, frequently also include higher-level tasks like
text translation, object detection or content classification in images, speech recognition, or other
Machine Learning tasks. Mini apps can be monetized with ads, which are commonly made available by
super apps providers. Super app platforms usually also provide cloud analytics data, so mini app
developers can better understand how users interact with their apps.

## Identity, payment, social graph

A very important feature of mini apps is the identity and social graph information that is shared
from the super app. Super apps like Douyin or WeChat started as social networking sites in the
broadest sense, where users have a (sometimes even government-verified) identity, a friend or
follower network, and frequently also payment data stored. For example, a shopping mini app can (or
sometimes even must) process any payments directly through the payment APIs of the super app and,
upon user consent, can obtain user data like their shipping address, phone number, and full name,
all without ever having to force the user to painfully fill out forms. Below, you can see the
Walmart mini app running in WeChat, opened for the very first time, greeting me with a familiar
face.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HzPx6ZSqQWvsUDT04ex2.png", alt="The Walmart mini app showing the author's face and name on the 'Me' tab.", width="300", height="649" %}
  <figcaption class="w-figure">
    The Walmart mini app with a personalized "Me" view on the first visit.
  </figcaption>
</figure>

Mini apps can get highly popular by letting people share their achievements like highscores in a
game and challenge their contacts through status updates. The mini app is then only a tap away, so
users can enter into competition without any friction and the mini app thereby grow its reach.

{% Aside 'success' %}
  In the next chapter, you will learn [what sets mini apps apart from H5 apps and QuickApp](/mini-app-what-are-h5-and-quickapp).
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.

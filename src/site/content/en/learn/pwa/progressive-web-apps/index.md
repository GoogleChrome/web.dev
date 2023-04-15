---
title: Progressive Web Apps
description: >
  Progressive Web Apps (PWAs) are web apps built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device, all with a single codebase.
authors:
  - firt
date: 2021-11-03
updated: 2022-05-16
---

A Progressive Web Apps (PWA) is a web app that use progressive enhancement to provide users with a more reliable experience,
use new capabilities to provide a more integrated experience, and can be installed.
And, because it's a web app, it can reach anyone, anywhere, on any device, all with a single codebase.
Once installed, a PWA looks like any other app, specifically:

- It has an icon on the home screen, app launcher, launchpad, or start menu.
- It appears when you search for apps on the device.
- It opens in a standalone window, wholly separated from a browser's user interface.
- It has access to higher levels of integration with the OS, for example, URL handling or title bar customization.
- It works offline.

## The web platform

The web is an incredible platform.
Its mix of universality across devices and operating systems,
its user-centered security model,
and the fact that no single company controls its specification or implementation make it a powerful platform
for delivering software.

Combined with the web's inherent linkability,
it's possible to search across it and share what you've found with anyone, anywhere.
Whenever you go to a website,
it's the latest version the publisher deployed,
and your experience with that site can be as temporary or as permanent as you'd like.

Web applications can reach anyone, anywhere, on any device with a single codebase.
For developers, the web also offers a transparent and straightforward deploying mechanism.
There is no need for packaging, no extra content review, or delays on updates.
Users always get the latest version when they visit your app.
With new capabilities and techniques, a web app can now allow you to interact or see content even when offline,
a hurdle that was impossible to overcome a few years ago.

## Platform-specific apps

Platform-specific apps, on both mobile and desktop,
are known for being rich and reliable. They're ever-present, on home screens, docks, and taskbars.
They work regardless of network connection, and launch in their own standalone experience.
They can read and write files from the local file system,
access hardware connected via USB, serial, or Bluetooth,
and interact with data stored on your devices, such as contacts and calendar events.
In platform-specific applications, you can take pictures, play songs listed on the home screen, or control media playback while in another app.
These applications feel like part of the device they run on.

{% Aside %}
In modern mobile operating systems,
platform-specific apps are installed mostly from app stores,
with rules and limitations on who can publish and what can be published for their users.
These apps are typically shipped as a large, indivisible package, and every update needs re-packaging, re-signing, re-approval, and on-device re-installation.
{% endAside %}

A challenge for platform-specific apps is that they are not compatible with multiple platforms and devices,
so it's not easy, if even possible,
to move an Android app to iOS or an iOS to Windows or ChromeOS without creating a new app from scratch.

## Bringing the best of both worlds

If you think about platform apps and web apps in terms of capabilities and reach,
platform apps represent the best of capabilities,
whereas web apps represent the best of reach.
Progressive Web Apps sit at the intersection of the capabilities of platform apps and the reach of web apps.
A Progressive Web App includes features from both worlds.

<div class="switcher">
<div>

### Web

- Linkability
- Accessible by default
- Ubiquitous
- Easy to Deploy
- Easy to Update
- Everyone can publish

</div>
<div>

### Platform apps

- Offline-capable
- High performance
- Device Integration
- Standalone experience
- Installed Icon
- Rich and reliable
</div>
</div>

{% Aside %}
People tend to think of Progressive Web Apps as an app that the user can install from a browser instead of an app store.
However, a PWA can be listed in many app stores today as an optional distribution channel,
including Google Play Store (for Android and ChromeOS), Microsoft Store (for Windows 10 and 11),
and Apple AppStore (for iOS, iPadOS, and macOS). For these cases, you must follow all store rules and requirements,
but you will still get some of the advantages of a PWA.
{% endAside %}

## Adoption has its benefits

Hulu, a video streaming service in the USA,
created a Progressive Web App version of their experience to replace their desktop apps which had poor user reviews and poor usage.
As shared at [Google I/O 2019](https://blog.chromium.org/2019/05/google-io-2019-whats-new-with-chrome.html),
one developer could research and implement this experience from their existing web application in two weeks.

Within five months, 96% of their legacy app users had adopted the PWA,
with a 27% increase in return visits and a 5.5% increase in engagement.
Because it's in the launcher and on taskbars, PWAs are easier to return to than if they just lived in a tab.

[JD.ID](/jdid/), an e-commerce platform in Indonesia providing delivery services for many products,
wanted to expand its online presence by focusing on performance and a network-independent solid experience for their PWA.
With this enhanced experience, they increased their overall mobile conversion rate by 53%,
200% for installed users, and increased their daily active users by 26%.

[Clipchamp](/clipchamp/) is an in-browser,
desktop-class online video editor that empowers anyone to tell stories worth sharing through video.
They saw 9% higher user retention with their PWA versus their standard desktop app users and have seen their PWA installations increasing at a rate of 97% each month in its first five months launched.

Corel Corporation's [Gravit Designer](/gravit-designer/) is a powerful,
desktop-class vector design tool that serves tens of thousands of daily active users demanding rich,
affordable, accessible vector illustration software.
Since adding a PWA as an install option for users,
they've seen PWA users are 24% more active,
the PWA accounts for 31% more repeat users, and PWA users are 2.5 times more likely to purchase Gravit Designer PRO,
as compared to their other platforms and install options.

{% Aside %}
Many other companies have implemented PWA and seen a benefit.
Large companies have already published PWAs on various products, including Apple (AppStore Connect, Feedback Assistant), Microsoft (Office 365, Windows 365), Google (Duo, YouTube Music, Drive), Amazon (Luna), Facebook (Instagram Lite, Gaming).
{% endAside %}

### The streaming game changer

A great example of the power of Progressive Web Apps is the industry of streaming platforms,
including cloud gaming and remote computing.
Since 2021, most cloud game providers have launched Progressive Web Apps,
letting you play console games from any device and just a browser or a PWA installation:
iPhone, Android, iPad, laptops, Macs, or PCs.
Amazon Luna, Microsoft Xbox Cloud Gaming, Facebook Gaming, Google Stadia, Nvidia GeForce Now, and BlueStacks X offer cloud gaming solutions over the browser as PWAs.
They all provide a great experience with performance close to native on all platforms thanks to web technologies such as WebRTC, WebAssembly, and GamePad APIs.

## Challenges

Having covered the advantages of using the web platform to publish PWAs,
it's also important to be aware of the challenges you may face.

### Cross-browser compatibility

Apple is a crucial company for the multi-device world,
owning iOS, iPadOS, macOS, and Safari.
While Apple has never used the term PWA in public,
they've been supporting the technologies to make a PWA installable and offline-capable since 2018 on Safari for iPhones and iPads.

However, Apple's implementation of the PWA specs misses many features possessed by other browsers,
in particular browsers powered by the Chromium engine.

In the middle, we also have Firefox and its Gecko engine with implementations including more PWA specs on Android,
and fewer installation capabilities on desktop.

Limitations include the lack of push notifications, integration APIs (such as Web Bluetooth or WebNFC),
and installation promotion techniques that help users know they can install the current website to get an app experience.
In addition, there are several bugs with implemented features.

As with all web development, testing your experience on every platform is mandatory when releasing your PWA,
and when a major new browser or OS version is released.
You should always provide fallback solutions or alternative experiences when a feature is not available.

### Awareness of PWAs

As a PWA developer,
you will probably encounter an awareness problem,
both on the business and user sides.
Some business owners won't know about PWAs or will have misconceptions about the power and challenges of Progressive Web Apps.

When you publish a PWA,
your next challenge is ensuring users understand that the website is installable, leading to an installed app experience.

The installation challenge is more significant on some platforms, such as iOS and iPadOS,
and sometimes UX designers include screens that explain to the user how to install the app.

## Compatibility

You need to remember that a Progressive Web App is just a web app,
so content and services are running on top of standard specs and protocols.
Therefore, a PWA technically runs everywhere the web runs; you don't need the platform to be compatible with any "PWA spec."

However, when we are talking about PWA and compatibility, typically, we are thinking about the capabilities to cross the boundaries of the browser and online-only contexts: icon installation and offline support.

{% Aside %}
A PWA should work everywhere, even when the icon installation or the offline support capabilities are unavailable.
Always plan your PWA to work without capabilities by checking support and offering fallback solutions.
{% endAside %}

On top of the classic web platform support, let's check the support for basic app functionality, such as icon installation and offline capabilities.

<ul class="stats auto-grid bg-state-good-bg color-state-good-text">
  <div class="stats__item flow">
    <p class="font-brand text-size-6">
      97
      <sub>%</sub>
    </p>
    <p>Offline-ready browsers</p>
  </div>
  <div class="stats__item flow">
    <p class="font-brand text-size-6">
      88
      <sub>%</sub>
    </p>
    <p>Web users can install a PWA</p>
  </div>
</ul>

_Data sourced from StatCounter and Can I Use._

### Desktop and laptops

In a world of multifactor devices,
it's challenging to know what a desktop device is anymore.
Still, at least from an operating system point of view,
these browsers and stores are compatible with PWA installation and offline capabilities:

Windows 10 and 11
: Google Chrome (from version 73), Microsoft Edge (from version 79), Microsoft Store

ChromeOS
: built-in Chrome browser  (from version 72), Play Store (from version 85)

macOS, Linux, and Windows 7 and 8.x
: Google Chrome (from version 73), Microsoft Edge

In the following video the user installs a PWA from the browser on a desktop computer,
and then accesses it like any other app with its standalone window.

{% Video src="video/RK2djpBgopg9kzCyJbUSjhEGmnw1/d0cR0VyUhy30DkXEgGOt.mp4", alt="the user can install a PWA from the browser on a desktop computer, and then the user can access it like any other app with its standalone window", autoplay="true", loop="true", muted="true" %}

{% Aside 'caution' %}
On desktop, Safari and Firefox do not support PWA installation.
They do support offline capabilities, but the experience will always start within the browser user interface.
It may get fullscreen, but never a standalone window on desktop.
{% endAside %}

### Mobile devices

Talking about mobile phones and tablets,
a Progressive Web App is installable with offline capabilities using the following browsers and app stores:

iOS and iPadOS
: Safari (since iOS 11.3), AppStore (since iOS/iPadOS 14, with some limitations), mobile configuration for enterprise distribution.

Android
: Firefox, Google Chrome, Samsung Internet, Microsoft Edge, Opera, Brave, Huawei Browser, Baidu, UCWeb, Play Store (from version 72 with Google Chrome installed, or browsers compatible with TWA), Galaxy Store, Managed Play iframe for enterprise distribution.

{% Aside 'caution' %}
On iOS and iPadOS, PWAs are only installable if the user is using Safari. That means that users won't install PWAs if they use different browser apps, such as Google Chrome, Firefox, or Microsoft Edge. On both Android and iOS, users can't install PWAs from many in-app browsers, such as Facebook Mobile Browser, Instagram, Google Search App, or Gmail.
{% endAside %}

In the following video the user installs a PWA from the browser on a mobile device using the browser dialog, and also using the **Add to Home screen** menu.

{% Video src="video/RK2djpBgopg9kzCyJbUSjhEGmnw1/Nj9yCzWOm6wWqpNN9Ojz.mp4", alt="the user can install a PWA from the browser on mobile devices on Android and iPhones, using the browser dialog or the 'Add to Home screen' menu.", autoplay="true", loop="true", muted="true" %}

### Other devices

Some other small devices support PWAs, such as game consoles (Xbox with Microsoft Store) or XR devices (Microsoft Hololens, plans for Facebook's Oculus). However, the rest of the devices with a browser do not typically accept PWAs, including:

- Game consoles
- Smart TVs
- Smartwatches
- Cars

Your PWA will always work in the browser of all devices with their specific limitations.
This ability to work in many devices, lets you create multi-device journeys,
where the user can start a task in one device and complete it on another device, with data synced across them, with the exact same deployed app.

##  Resources

- [Introduction to Progressive Web Apps on MDN](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Introduction)
- [Progressive Web Apps Compatibility list](https://firt.dev/notes/pwa)
- [How Progressive Web Apps can drive business success](/drive-business-success/)
- [Clipchamp's video editor PWA installs see a 97% monthly growth](/clipchamp/)
- [PWA users are 2.5x more likely to purchase Gravit Designer PRO](/gravit-designer/)

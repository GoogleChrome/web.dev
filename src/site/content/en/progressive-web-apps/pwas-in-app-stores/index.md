---
layout: post
title: PWAs in app stores
authors:
  - thomassteiner
date: 2023-03-29
updated: 2023-03-29
description: |
  Progressive Web Apps can be submitted to app stores like the Android Play Store or the Microsoft Store and more.
tags:
  - progressive-web-apps
---

PWAs can be accessed through a web browser, but they can also be installed on a user's home screen as outlined in the articles in the section [Provide an installable experience](/progressive-web-apps/#provide-an-installable-experience). One of the challenges with PWAs, however, is distributing them to app stores. This is where [PWABuilder](https://pwabuilder.com/) comes in.

PWABuilder is a powerful tool that allows developers to create packages that can be submitted to various app stores, including the Google Play Store, the Microsoft Store, the Apple App Store, and the Meta Quest Store. One of the major advantages of using PWABuilder to create packages is that it simplifies the process of publishing your web application to app stores. Normally, submitting an app to app stores requires a lot of work, including writing code in languages web developers may not necessarily be familiar with, creating app icons, configuring various settings, and testing the app across different devices and operating systems. PWABuilder takes care of many of these tasks automatically, reducing the amount of time and effort required to publish an app.

{% Aside %}
Internally, PWABuilder uses a command line tool called [`bubblewrap`](https://github.com/GoogleChromeLabs/bubblewrap), which you can learn more about in the article [Trusted Web Activities Quick Start Guide](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/). Rather than use PWABuilder, you can run `bubblewrap` directly if you prefer the command line over graphical user interfaces.
{% endAside %}

## Prerequisites

If your web app meets a few baseline PWA requirements, you can use PWABuilder to validate, score, and package your application for stores. Your PWA needs to:

- be published at a public URL.
- have a complete web app manifest.
- be secured with HTTPS.

{% Aside 'gotcha' %}
To publish your package, you will also need a developer account with each platform you want to publish with. For the Microsoft and Google Play stores, these cost a one time fee. For the Apple App Store, an account costs a recurring fee per year. Meta Quest accounts are free.

By submitting to stores, you need to play by their rules, which, for example, may mean that you need to use their payment mechanisms and pay a comission for each purchase, or that certain content may not be allowed. Carefully assess these aspects for each store you want to publish to.
{% endAside %}

## Packaging

You can have an application package for your PWA in a few steps:

- From the homepage of PWABuilder, you can enter a URL to start the packaging process. PWABuilder will take you to report card page for your application, where you can view scores and action items for your progressive web app.
- To proceed to packaging your app, click the **Package for Stores** button on the top right of the scorecard page.
- Browse the options for packaging, and select a platform by clicking **Generate Package**. You will be prompted for metadata related to your application, which will vary depending on platform. Lastly, select **Download Package** to download your package.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/zBI3DyULt7jcI9ynDbbN.png", alt="SVGcode PWA in the PWABuilder uiser interface.", width="800", height="1136" %}

## Submitting

For guidance on how to publish a PWA to a specific store, check out the platform-specific articles:

- [Microsoft Store](https://docs.pwabuilder.com/#/builder/windows)
- [Google Play Store](https://docs.pwabuilder.com/#/builder/android)
- [Apple App Store](https://docs.pwabuilder.com/#/builder/app-store)
- [Meta Quest Store](https://docs.pwabuilder.com/#/builder/meta)

## Example

I have generated store packages for one of my apps, [SVGcode](/svgcode) using PWABuilder. Apart from [on the web](https://svgco.de/), you can also find the app in two stores now:

- <a href="https://svgco.de/"><img height="50px" src="https://raw.githubusercontent.com/tomayac/SVGcode/main/public/badges/web-browser.svg" style="max-width: 100%;"></a>
- <a href="https://play.google.com/store/apps/details?id=de.svgco.twa"><img height="50px" src="https://raw.githubusercontent.com/tomayac/SVGcode/main/public/badges/play-store.svg" style="max-width: 100%;"></a>
- <a href="https://www.microsoft.com/en-us/p/svgcode/9plhxdgsw1rj#activetab=pivot:overviewtab"><img height="50px" src="https://raw.githubusercontent.com/tomayac/SVGcode/main/public/badges/microsoft-store.svg" style="max-width: 100%;"></a></p>

---
layout: post
title: Web on Android
subhead: How different components can be used to render web content inside Android apps.
authors:
  - andreban
date: 2020-07-30
updated: 2020-08-05
hero: image/admin/874Rka3L44UJd5zLIyR5.svg
alt: Android robot
description: |
  Learn how different components can be used to render web content inside Android apps.
tags:
  - android
  - blog # blog is a required tag for the article to show up in the blog.
feedback:
  - api
---


The Android platform has been around for more than ten years, and since its early days it has had
great support for the Web. It shipped with WebView, a component that allows developers to use the
web inside their own Android Apps. More than that, Android allows developers to bring their own
browser engine into the platform, fostering competition and innovation.

Developers can include the web in their Android applications in many ways. WebView is frequently
used to render ads, as a layout component used along with Android UI elements, or for packaging HTML 5
games. Custom Tabs allows developers to build in-app browsers and provide a seamless navigation
experience to third-party web content, and Trusted Web Activity allows developers to use their
Progressive Web Apps (PWAs) in Android apps, which can be downloaded from the Play Store.

### Android WebView

WebView gives developers access to modern HTML, CSS, and JavaScript inside their Android apps, and
allows content to be shipped inside the APK or hosted on the internet. It's one of Android's most
flexible and powerful components, which can be used for most of the use-cases where web content is
included in an Android app. From powering ad services like AdMob to building and shipping complete
HTML5 games that use modern APIs such as WebGL.

But, when used to create an in-app-browser or including a PWA in an Android application, WebView
lacks the security, features, and capabilities of the web platform.

### The in-app browser challenge

Over time, more and more developers have built browser experiences
incorporating third-party content into their Android application, with the goal
of creating a more seamless experience for their users when navigating to
third-party websites. Those experiences became known
as in-app browsers.

WebView has extensive support for the modern web tech stack and supports many modern web APIs, like
WebGL. But WebView is primarily a web UI toolkit. It
[is not meant to - and does not - support all features of the web platform][1]. When an API already
has an OS-level alternative, like Web Bluetooth, or it requires browser UI to be implemented, like
push notifications, it may not be supported. As the web platform evolves and adds more features
that were only available to Android apps, this gap will become even larger. As app developers don't
control which features are used when opening third-party content, it makes WebView a poor choice
for in-app browsers or opening Progressive Web Apps. Even if WebView implemented support for all
web platform features, developers would still need to write code and implement their own UI for
functionality like permissions or push notifications, making it hard to achieve consistency for
users.

Another option available to developers is embedding a browser engine in their application. Besides
leading to increased application size, this approach is both complex and time-consuming.

### Custom Tabs as a solution for in-app browsers

Custom Tabs was [introduced in Chrome 45][2] and allows developers to use a tab from the user's
default browser as part of their application. Custom Tabs was originally launched by Chrome, and
was therefore known as "Chrome Custom Tabs". Today it's an [Android API][3] and most popular
browsers support Custom Tabs, including Chrome, Firefox, Edge, and Samsung Internet, so it's more
appropriate to just call it "Custom Tabs".

Custom Tabs helps developers seamlessly integrate web content into their app experience. They also
allow developers to customise the activity in which web content is shown by allowing them to
customize the toolbar color, action buttons, transition animation, and more.

They also offer features that were previously unavailable when using WebView or embedding a browser
engine. Since the in-app browser is powered by the user's browser, Custom Tabs shares storage
with the browser, so users don't need to re-login to their favourite websites every time one of
their installed apps starts an In-App browsing session.

Unlike WebViews, Custom Tabs supports all web platform features and APIs that are supported by the
browser powering it.

### Open Progressive Web Apps using Trusted Web Activity

[Progressive Web Apps][4] bring many behaviors and capabilities that were once only available to
platform-specific apps to the web. With the introduction of app-like behaviour, the desire from developers to
re-use those experiences on Android increased, and developers started asking for ways to integrate
PWAs into their apps.

Custom Tabs has support for all modern web capabilities and APIs but, since it was primarily
designed to open third-party content, it has a toolbar on the top that tells the users which URL
they are visiting, as well as the lock icon indicating whether the site is secure. When opening an app's
own experience, the toolbar prevents the application from feeling like it is integrated with the
operating system.

[Trusted Web Activities][5] was introduced in Chrome 72 and allows developers to
[use their PWA inside an Android][6] app. Its protocol is similar to the Custom Tabs protocol,
but introduces APIs that allow developers to verify (through [Digital Asset Links][7]) that they
control both the Android app and the URL being opened and remove the URL bar when both are true.

They also introduced APIs for creating splash screens when opening the PWA or delegating web
notifications to be handled by Android code. More features like support for Play Billing are coming
soon.

Since URLs opened in Trusted Web Activities are expected to be PWAs and have a set of behaviors and
performance characteristics, Trusted Web Activities introduces [quality criteria][8] for PWAs
being opened inside it.

### Limitations of the current solutions

Developer feedback showed a need for the platform compatibility of Custom Tabs combined with the
flexibility of WebView so they could, for instance, access the DOM or inject JavaScript, into their
in-app browsers.

Custom Tabs is effectively a tab rendered by the user's browser, with a custom UI or with no UI
at all. This means that the browser needs to honour the user's expectations around privacy and
security towards the browser, making some of those features impossible.

The Web on Android team at Google is looking into alternatives and experimenting with solutions
to solve those use-cases. Stay tuned for details!

### Summary

WebView is useful when an application needs HTML, CSS, and JavaScript inside their Android app, but
doesn't use more advanced features and capabilities available on the modern web such as Push
Notifications, Web Bluetooth and others. It is not recommended when opening content that has been
designed for the modern web platform, as it may not be displayed in the way the developer intended.
WebView is not recommended for creating in-app browsers. On the other hand displaying first-party
web content is an area where WebViews really shine.

Trusted Web Activity should be used when the developers want to render their own Progressive Web
App in fullscreen inside their Android application. It can be used as the only activity in the app
or used along with other Android activities.

Custom Tabs is the recommended way for opening third-party content that is designed for the web
platform, also known as in-app browsers.

[1]: https://research.google/pubs/pub46739/
[2]: https://android-developers.googleblog.com/2015/09/chrome-custom-tabs-smooth-transition.html
[3]: https://developer.android.com/reference/androidx/browser/customtabs/package-summary
[4]: /progressive-web-apps/
[5]: https://developers.google.com/web/android/trusted-web-activity/
[6]: /using-a-pwa-in-your-android-app/
[7]: https://developers.google.com/digital-asset-links
[8]: /using-a-pwa-in-your-android-app/#quality-criteria

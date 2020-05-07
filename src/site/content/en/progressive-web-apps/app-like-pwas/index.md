---
layout: post
title: App-like Progressive Web Apps
authors:
  - thomassteiner
description: |

date: 2020-04-29
---
When you play PWA buzzword bingo, it is a safe bet to set on "PWAs are just websites". Microsoft's PWA documentation [agrees](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites), we [say it](https://web.dev/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites) on this very site, and even PWA nominators Frances Berriman and Alex Russell [write so](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites), too. Yes, PWAs are just websites, but they are also more than that. If done right, a PWA will not feel like a website, but like a "real" app. Now what does it mean to feel like a real app?

## Capable of running offline

If you take a step back and think of some of the native applications you may have on your mobile phone or desktop computer, one thing clearly stands out: you never get nothing. Even if you are offline, there is always something. Let me illustrate this with Apple's macOS and iOS [Podcasts](https://support.apple.com/en-us/HT201859) app. Even when I am offline, the app naturally opens. The "Top Charts" section does not show any content, but instead it falls back to a "Can't connect right now" message paired with a "Retry" button. It may not be the most welcoming experience, but I get something.

<figure class="w-figure">
  <img src="./image4.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The Podcasts app follows the so-called app shell model. All the static content that is needed to show the core app is cached locally.
  Dynamic content like the "Top Charts" data is only loaded on demand, with locally cached fallback content available should the loading fail.
  Read the  article <a href="https://developers.google.com/web/fundamentals/architecture/app-shell">The App Shell Model</a>
  to learn how to apply this architectural model to your web app.
{% endDetails %}

## Offline content playable

Via the left-hand drawer, I can still navigate to the "Downloaded" section and enjoy downloaded podcast episodes that are ready to be played.

<figure class="w-figure">
  <img src="./image16.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Previously downloaded media content can be served from the cache, for example using the
  <a href="https://developers.google.com/web/tools/workbox/guides/advanced-recipes#cached-av">Serve cached audio and video</a>
  recipe from the <a href="https://developers.google.com/web/tools/workbox">Workbox</a> library.
{% endDetails %}

## Proactive background downloading

When I am back online, I can of course search for content, and when I subscribe to a [podcast like HTTP 203](https://web.dev/podcasts/), the latest episode of the series is immediately downloaded, no questions asked.

<figure class="w-figure">
  <img src="./image10.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Downloading a podcast episode is an operation that potentially can take longer. The <a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a> lets you delegate downloads to the browser that takes care of them in the background.
  On Android, the browser in turn can even delegate downloads to the operating system, so the browser does not need to be continuously running.
  Once the download has completed, your service worker gets woken up and you can decide what to do with the response.
{% endDetails %}

## Sharing to other applications

The Podcasts app integrates naturally with other applications. For example, when I right-click an episode that I like, I can share it to other apps on my device, like the Messages app. It also naturally integrates with the system clipboard. I can right-click any episode and copy a link to it.

<figure class="w-figure">
  <img src="./image19.png" alt="" class="w-screenshot" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://web.dev/web-share/">Web Share API</a> and the <a href="https://web.dev/web-share-target/">Web Share Target API</a>
  allow your app to share and receive texts, files, and links to and from other applications on the device.
  With the <a href="https://web.dev/image-support-for-async-clipboard/">Async Clipboard API</a> you can programmatically read and write
  text and image data (PNG images) to the system clipboard.
  On Android, you can use the <a href="https://web.dev/contact-picker/">Contact Picker API</a> to select entries from the device's contacts manager.
  If you offer both a native app and a PWA, you can use the <a href="https://web.dev/get-installed-related-apps/">Get Installed Related Apps API</a>
  to check if the native app is installed, in which case you do not need to encourage the user to install the PWA or accept web push notifications.
{% endDetails %}

## Background app refreshing

In the Podcasts app's settings, I can configure the app to download new episodes automatically, I do not even have to think about it, updated content will always just be there.

<figure class="w-figure">
  <img src="./image15.png" alt="" width="495">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://web.dev/periodic-background-sync/">Periodic Background Sync API</a>
  allows your app to refresh its content regularly in the background without the need for it to be running.
  This means new content is proactively available, so your users can start delving into it right away.
{% endDetails %}

## State synchronized over the cloud

At the same time, my subscriptions are synchronized across all devices I may own. In a seamless world, I do not have to worry about manually keeping my podcast subscriptions in sync. Likewise, I do not have to be afraid that my mobile device's memory will be consumed by episodes I have long listened to on my desktop or vice versa. The play state is kept in sync, and listened to episodes are automatically deleted.

<figure class="w-figure">
  <img src="./image11.png" alt="" width="495">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Syncing app state data is a task that you can delegate to the <a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a>. It does not have to happen immediately, just eventually, and maybe even when the user has closed the app again already.
{% endDetails %}

## Hardware media key controls

When I am busy with another application, say, the Chrome browser, I can still control the Podcasts app with the media keys on my laptop.

<figure class="w-figure">
  <img src="./image9.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Media keys are supported by the <a href="https://web.dev/media-session/">Media Session API</a>.
  Like that, users can profit from the hardware media keys on their physical keyboard, or even control the web app
  from the software media keys on their smartwatches.
{% endDetails %}

## Multitasking and app shortcut

Of course I can always tab back to the Podcasts app from anywhere. The app has a clearly distinguishable icon that I can also put on my desktop so Podcasts can be launched immediately when I feel like it.

<figure class="w-figure w-figure--fullbleed">
  <img src="./image3.png" alt="" >
  <figcaption class="w-figcaption w-figcaption--fullbleed"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Progressive Web Apps on both desktop and mobile can be installed to the home screen, start menu, or application dock.
  Installation can happen based on a proactive prompt, or fully controlled by the app developer.
  The article <a href="https://web.dev/install-criteria/">What does it take to be installable?</a> covers everything you need to know.
{% endDetails %}

## Quick actions in context menu

The most common app actions, "Search" for new content and "Check for New Episodes", are available right from the context menu of the app in the Dock. Via the "Options" menu, I can also decide to open the app at login time.

<figure class="w-figure">
  <img src="./image18.png" alt="" class="w-screenshot" width="267">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  By specifying <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/master/Shortcuts/explainer.md">app icon shortcuts</a>
  in the PWA's Web App Manifest, you can register quick routes to common tasks that users can reach directly from the app icon.
  On operating systems like macOS, users can also right-click the app icon and set the app to launch at login time.
  There is also ongoing work on standardizing <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">run on login</a>.
{% endDetails %}

## Act as default app

Other native applications and even websites or emails can integrate with the Podcasts app by leveraging the podcasts:// URL scheme. If I follow a link like [podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903), I am brought right into the Podcasts app and can decide to subscribe or listen to the podcast.

<figure class="w-figure">
  <img src="./image20.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Handling fully custom URL schemes is not yet possible, but there is ongoing work to standardize
  <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/master/URLProtocolHandler/explainer.md"> URL Protocol Handling</a>
  for PWAs. Currently, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a> with a <code>web+</code> scheme prefix is the second best alternative.
{% endDetails %}

## Native file system integration

You may not immediately think of it, but the Podcasts app naturally integrates with the native file system. When I download a podcast episode, on my laptop it is stored in ~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache. Unlike, say ~/Documents, this directory is not meant to be accessed directly by regular users, but it is there.

<figure class="w-figure">
  <img src="./image5.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://web.dev/native-file-system/">Native File System API</a> enables developers to get access to the local file system
  of the device. You can use it directly or via the <a href="https://github.com/GoogleChromeLabs/browser-nativefs">browser-nativefs</a>
  support library that transparently provides fallbacks for browsers that do not support the API.
{% endDetails %}

## Native look and feel

A more subtle thing but that is self-evident for an application like Podcasts: none of the textual labels are selectable, all texts blend in with the system font of the machine. Also my choice of system color theme (dark mode) is respected.

<figure class="w-figure">
  <img src="./image2.png" alt="" width="350">
  <img src="./image7.png" alt="" width="350">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  By leveraging the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/user-select"><code>user-select</code></a>
  CSS property with a value of <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>none</code></a>,
  you can protect UI elements from being accidentally selected.
  The <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#<generic-name>:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a>
  value for the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-family"><code>font-family</code></a> CSS property allows you to
  specify the default UI font of the system to be used for your app, whatever it may be in the concrete case.
  Finally, your app can obey to the user's color scheme preference by respecting their <a href="https://web.dev/prefers-color-scheme/"><code>prefers-color-scheme</code></a> choice, with an optional <a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">dark mode toggle</a>
  to override it.
{% endDetails %}

## Customized title bar

When you look at the Podcasts app window, you notice that it does not have a classic integrated title bar and toolbar, like, for example, the Safari browser window, but a customized experience that looks like a sidebar docked to the main player window.

<figure class="w-figure">
  <img src="./image8.png" alt="" class="w-screenshot">
  <figcaption class="w-figcaption"></figcaption>
</figure>

<figure class="w-figure">
  <img src="./image1.png" alt="" class="w-screenshot">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  While not currently possible, <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/master/TitleBarCustomization/explainer.md">title bar customization</a> is being standardized at the moment.
  You should, however, specify the <a href="https://web.dev/add-manifest/#display"><code>display</code></a> and the
  <a href="https://web.dev/add-manifest/#theme-color"><code>theme-color</code></a> properties of the Web App Manifest to
  determine the look and feel of your application.
{% endDetails %}

## Snappy animations

In-app animations are snappy and smooth. For example, when I open the "Episode Notes" drawer on the right, it elegantly slides in. When I remove one episode from my downloads, the remaining episodes float up and consume the screen real estate that was freed by the deleted episode.

<figure class="w-figure">
  <img src="./image14.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  Performant animations on the web are certainly possible if you take into account a number of best practices
  outlined in the article <a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Animations and Performance</a>.
{% endDetails %}

## Content surfaced outside of app

The Podcasts app on iOS can surface content in other locations than the actual application, for example, in the system's Widgets view, or in the form of a Siri Suggestion. Having proactive, usage-based calls-to-action that just require a tap to interact with can greatly increase the re-engagement of an app like Podcasts.

<figure class="w-figure">
  <img src="./image6.png" alt="" class="w-screenshot" width="300">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://web.dev/content-indexing-api/">Content Index API</a> allows your application
  to tell the browser which content of the PWA is available offline.
  This allows the browser to surface this content outside of the main app.
  By marking up interesting content in your app as suitable for <a href="https://developers.google.com/search/docs/data-types/speakable">speakable</a>
  audio playback and by using <a href="https://developers.google.com/search/docs/guides/search-gallery">structured markup</a> in general,
  you can help search engines and virtual assistants like the Google Assistant present your offerings in an ideal light.
{% endDetails %}

## Lock screen media control widget

When a podcast episode is playing, the Podcasts app shows a beautiful control widget on the lock screen that features metadata like the episode artwork, the episode title, and the podcast name. From there, the audio stream can also be broadcasted to a different device via AirPlay.

<figure class="w-figure">
  <img src="./image17.png" alt="" class="w-screenshot" width="300">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://web.dev/media-session/">Media Session API</a> lets you specify metadata like artwork, track titles, etc.
  that then gets displayed on the lock screen, smartwatches, or other media widgets in the browser.
{% endDetails %}

## Push notifications

The iOS Podcasts app optionally can also notify you of new episodes of podcasts you are subscribed to or recommend new ones as well as alert you about new features.

<figure class="w-figure">
  <img src="./image12.png" alt="" class="w-screenshot" width="300">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a>
  allows your app to receive push notifications so you can notify your users about noteworthy events around your PWA.
  For notifications that should fire at a known time in the future and that do not require a network connection,
  you can use the <a href="https://web.dev/notification-triggers/">Notification Triggers API</a>.
{% endDetails %}

## App icon badging

Whenever there are new episodes available for one of the podcasts I am subscribed to, an app icon badge on the Podcasts home screen icon appears, again encouraging me to re-engage with the app in a way that is not intrusive.

<figure class="w-figure">
  <img src="./image21.png" alt="" class="w-screenshot" width="400">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  You can set app icon badges with the <a href="https://web.dev/badging-api/">Badging API</a>.
  This is especially useful when your PWA has some notion of "unread" items or when you need a means
  to unobtrusively draw the user's attention back to the app.
{% endDetails %}

## Media playback trumps energy saver settings

When podcast media is playing, the screen may turn off, but the system will not enter standby mode.
Apps can optionally keep the screen awake, too, for example to display lyrics or captions.

<figure class="w-figure">
  <img src="./image13.png" alt="" class="w-screenshot" width="310">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
  How to do this on the web
{% endDetailsSummary %}
  The <a href="https://web.dev/wakelock/">Screen Wake Lock API</a> allows you to prevent the screen from turning off.
  Media playback on the web prevents the system from entering standby mode.
{% endDetails %}

## Conclusion


---
layout: post
title: App-like Progressive Web Apps
authors:
  - thomassteiner
description: |

date: 2020-04-29
---
When you play PWA buzzword bingo, it is a safe bet to set on "PWAs are just websites". Microsoft's PWA documentation [agrees](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites), we [say it](https://web.dev/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites) on this very site, and even PWA nominators Frances Berriman and Alex Russell [write so](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites), too. But PWAs are more than just websites. If done right, a PWA will not feel like a website, but like a "real" app. Now what does it mean to feel like a real app?

## Capable of running offline

If you take a step back and think of some of the native applications you may have on your mobile phone or desktop computer, one thing clearly stands out: you never get nothing. Even if you are offline, there is always something. Let me illustrate this with Apple's macOS [Podcasts](https://support.apple.com/en-us/HT201859) app. Even when I am offline, the app naturally opens. The "Top Charts" section does not show any content, but a "Can't connect right now" message paired with a "Retry" button.

<figure class="w-figure">
  <img src="./image4.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
How to do this on the web
{% endDetailsSummary %}

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

{% endDetails %}

## Customized menu bar

When you look at the Podcasts app window, you notice that it does not have a classic integrated title bar and toolbar like, for example, the Safari browser window, but a customized experience that looks like a sidebar docked to the main player window.

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

{% endDetails %}

## Snappy animations

In-app animations are snappy and smooth. For example, when I open the Episode Notes drawer on the right, it elegantly slides in. When I remove one episode from my downloads, the remaining episodes float up and consume the screen real estate that was freed by the deleted episode.

<figure class="w-figure">
  <img src="./image14.png" alt="" width="600">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
How to do this on the web
{% endDetailsSummary %}

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

{% endDetails %}

## App icon badging

Whenever there are new episodes available for one of the podcasts I am subscribed to, an app icon badge on the Podcasts home screen icon appears, again encouraging me to re-engage with the app in a non-intrusive way.

<figure class="w-figure">
  <img src="./image13.png" alt="" class="w-screenshot" width="310">
  <figcaption class="w-figcaption"></figcaption>
</figure>

{% Details %}
{% DetailsSummary %}
How to do this on the web
{% endDetailsSummary %}

{% endDetails %}

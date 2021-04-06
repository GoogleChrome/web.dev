---
title: "Adaptive loading: improving web performance on slow devices"
subhead: |
  Learn how to ensure every user gets the best possible experience by
  optimizing your sites for specific hardware and network constraints.
authors:
  - mihajlija
date: 2019-12-16
description: |
  Learn about adaptive loading pattern, how to implement it, and how Facebook, Tinder, eBay, and
  other companies use adaptive loading in production.
hero: image/admin/KVRAyvGzRVa1vS8filbH.png
thumbnail: image/admin/kQJs9KCpVXDSWTtmZO5g.png
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - memory
---

Device capabilities and network connections vary a lot. Sites that delight users
on high-end devices can be
[unusable](https://v8.dev/blog/cost-of-javascript-2019) on low-end ones. Sites
that load smoothly on fast networks can come to a halt on slow ones. Any user
can experience a slow website, that's why developing "one-size fits all"
solutions may not always work.

In their [Chrome Dev Summit talk](https://www.youtube.com/watch?v=puUPpVrIRkc),
Addy Osmani from Google and Nate Schloss from Facebook explore a solution to that problem—a
pattern for delivering pages that better cater to a variety of user
constraints. They call it _**adaptive loading**_.

## What is adaptive loading?

Adaptive loading involves delivering different experiences to different users
based on their network and hardware constraints, specifically:

* A fast core experience for all users (including low-end devices).

* Progressively adding high-end-only features, if a user's network and hardware
  can handle it.

By optimizing for specific hardware and network constraints you enable every
user to get the best possible experience for their device. Tailoring the
experience to users' constraints can include:

* Serving low-quality images and videos on slow networks.

* Throttling the frame-rate of animations on low-end devices.

* Avoiding computationally expensive operations on low-end devices.

* Blocking third-party scripts on slower devices.

* Loading non-critical JavaScript for interactivity only on fast CPUs.

## How to implement adaptive loading

The signals you can use for adaptive loading are:

* Network—for fine-tuning data transfer to use less bandwidth (via
  [`navigator.connection.effectiveType`](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType)).
  You can also leverage the user's Data Saver preferences (via
  [`navigator.connection.saveData`](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data#detecting_the_save-data_setting)).

* Memory—for reducing memory consumption on low-end devices (via
  [`navigator.deviceMemory`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory)).

* CPU core count—for limiting costly JavaScript execution and reducing CPU
  intensive logic when a device can't handle it well (via
  [`navigator.hardwareConcurrency`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)).


There are two places where you can make a decision about what to serve to users:
the client and the server. On the client, you have the JavaScript APIs noted
above. On the server, you can use [client
hints](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints)
to get insight into the user's device capabilities and the network they're
connected to.

### Adaptive loading in React

[React Adaptive Loading Hooks &
Utilities](https://github.com/GoogleChromeLabs/react-adaptive-hooks) is a suite
for the React ecosystem that makes it easier to adapt your sites to lower-end
devices. It includes:

* The `useNetworkStatus()` hook for adapting based on network status (`slow-2g`,
  `2g`, `3g`, or `4g`).

* The `useSaveData()` hook for adapting based on the user's Data Saver
  preferences.

* The `useHardwareConcurrency()` hook for adapting based on the number of
  logical CPU processor cores on the user's device.

* The `useMemoryStatus()` hook for adapting based on the user's device memory
  (RAM).

Each hook accepts an optional argument for setting the initial value. This
option is useful in two scenarios: when the user's browser does not support the
relevant API and for server-side rendering where you can use the client hint
data to set the initial value on the server. For example, the
`useNetworkStatus()` hook can use the initial value passed from client hint for
server-side rendering and, when executed on the client, update itself if the
network effective type changes.

React Adaptive Loading Hooks & Utilities are implemented using web platform APIs
([Network
Information](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API),
[Device Memory](https://developers.google.com/web/updates/2017/12/device-memory)
and [Hardware
Concurrency](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)).
You can use the same APIs to apply adaptive loading concepts to other frameworks
and libraries, such as
[Angular](https://netbasal.com/connection-aware-components-in-angular-3a66bb0bab6f),
[Vue](https://dev.to/vorillaz/serving-adaptive-components-using-the-network-information-api-lbo),
and others.

## Adaptive loading in action

This section explores demos of how you could use adaptive loading and real-world
examples from sites such as Facebook, eBay, Tinder, and others.

The [React
Movie](https://adaptive-loading.web.app/react-movie-network-aware-loading/) demo
shows how to [adapt media serving based on the network
status](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-movie-network-aware-loading).
It's an application for browsing movies that shows posters, summaries, and cast
lists. Based on the user's effective connection type, it serves high-quality
posters on fast connections and low-quality posters on slow ones.

[Twitter has a Data Saver
mode](https://twitter.com/twittersupport/status/1047607749708668928) designed to
reduce the amount of data used. In this mode, preview images load in
low-resolution and large images load only when you tap on the preview. With this
option enabled, users on iOS and Android saved 50% in data-usage from images,
and users on the web saved 80%. Here's a React
[demo](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-twitter-save-data-loading(hook))
that uses the Save Data hook to replicate the Twitter timeline. Try
opening your DevTools **Network** panel and looking at the difference in the amount
of data transferred as you scroll while Save Data is disabled versus when it's
enabled.

  <figure class="w-figure">
    <video controls autoplay loop muted class="w-screenshot">
      <source src="https://storage.googleapis.com/web-dev-assets/adaptive-loading-cds-2019/twitter-save-data.mp4" type="video/mp4">
    </video>
     <figcaption class="w-figcaption">
      A screencast comparing scrolling the Twitter timeline with Data Saver on and off. With Data Saver on, only image previews are loaded and videos don't autoplay.
    </figcaption>
  </figure>

eBay conditionally turns on and off features like zooming when a user's hardware
or network conditions don't support them well. You can achieve this through
adaptive [code-splitting](/reduce-javascript-payloads-with-code-splitting/) and
code loading—a way to conditionally load more highly interactive components or
run more computationally heavy operations on high-end devices, while not sending
those scripts down to users on slower devices. Check out the video at [16
mins](https://youtu.be/puUPpVrIRkc?t=973) where Addy shows this pattern
implemented with [React.lazy() and Suspense](/code-splitting-suspense/) on a
[demo eBay product
page](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-ebay-network-aware-code-splitting).

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gdXBknVxIdd8FcSvIrxw.png", alt="A diagram of modules shipped for a product page on low-end and high-end devices: both versions include \"image viewer\", while the high-end version includes additional \"zoom\" and \"carousel\" modules.", width="800", height="446" %}

Tinder is using a number of adaptive loading patterns in its
[web](https://medium.com/@addyosmani/a-tinder-progressive-web-app-performance-case-study-78919d98ece0)
and [Lite app](https://blog.gotinder.com/introducing-tinder-lite/) to keep the
experience fast for everyone. If a user is on a slow network or has Data Saver
enabled, they disable video autoplay, limit [route prefetching](/link-prefetch/)
and limit loading the next image in the carousel to loading images one at a time
as users swipe. After implementing these optimizations, they've seen significant
improvements in average swipe count in countries such as Indonesia.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/N1xJkEMQ9rE513TNm8va.png", alt="A screenshot of two versions of Tinder chat: with autoplaying video and with a video with play button overlay. A screenshot of a Tinder profile with caption 'Limit carousel images on Data Saver or 3G'. A code snippet for prefetching in-viewport videos only on 4G.", width="800", height="445", style="max-width: 75%" %}
</figure>

### Adaptive loading at Facebook

One issue that comes up in adaptive loading is grouping devices into high-end
and low-end classes based on available signals. On mobile devices the
[user-agent (UA)](https://developer.chrome.com/multidevice/user-agent) string
provides the device name which enables Facebook to use publicly available data
on device characteristics to group mobile devices into classes. However, on
desktop devices the only relevant information the UA provides is the device's
operating system.

For grouping desktop devices, Facebook logs the data about the operating system,
CPU cores (from `navigator.hardwareConcurrency`), and RAM memory
(`navigator.deviceMemory`) in their performance monitoring. Looking at the
relationships between different types of hardware and performance, they
classified devices into five categories. With hardware classes integrated into
performance monitoring, they get a more complete picture of how people use
Facebook products depending on their device and can identify regressions more
easily.

Check out the video at [24 mins](https://youtu.be/puUPpVrIRkc?t=1443), where
Nate walks through how Facebook approaches device grouping and uses adaptive
loading for animations and loading JavaScript.

## Learn more about adaptive loading

Adaptive loading is all about designing your sites with inclusivity in mind.
Build a core experience that works great for everyone, then toggle or layer
features that make it even more awesome if a user has enough memory, CPU, or a
fast network. To learn more about adaptive loading, check out the available
[demos](https://github.com/GoogleChromeLabs/adaptive-loading#full-applications)
and watch the Chrome Dev Summit talk:

{% YouTube 'puUPpVrIRkc' %}

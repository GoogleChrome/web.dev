---
layout: post
title: How to define your install strategy
authors:
  - demianrenzulli
  - petelepage
date: 2020-05-12
updated: 2020-08-20
description: |
  Best practices for combining different installation offerings to increase installation rates and avoid platform competition and cannibalization.
tags:
  - progressive-web-apps
---

{% YouTube '6R9pupbDXYw' %}

In the past, app installs were only possible in the context of platform-specific applications. Today, modern web apps offer installable experiences that provide the same level of integration and reliability as platform-specific apps.

You can achieve this in different ways:

- Installing the PWA [from the browser](/customize-install/).
- Installing the PWA [from the app store](https://developers.google.com/web/android/trusted-web-activity).

Having different distribution channels is a powerful way of reaching a broad number of users, but choosing the right strategy to promote them can be challenging.

This guide explores best practices for combining different installation offerings to increase installation rates and avoid platform competition and cannibalization. The installation offerings covered include PWAs installed from both the browser and the App Store, as well as platform-specific apps.

## Why make your web app installable?

Installed Progressive Web Apps run in a standalone window instead of a browser tab. They're launchable from the user's home screen, dock, taskbar, or shelf. It's possible to search for them on a device and jump between them with the app switcher, making them feel like part of the device they're installed on.

But having both an installable web app and a platform-specific app can be confusing for users. For some users platform-specific apps may be the best choice, but for others they can present some drawbacks:

- **Storage constraints:** Installing a new app might mean deleting others, or cleaning up space, by removing valuable content. This is especially disadvantageous for users on low-end devices.
- **Available bandwidth:** Downloading an app can be a costly and slow process, even more for users on slow connections and expensive data plans.
- **Friction:** Leaving a website and moving to a store to download an app creates additional friction and delays a user action that could be performed directly in the web.
- **Update cycle:** Making changes in platform-specific apps might require going through an app review process, which can slow down changes and experiments (e.g. A/B tests).

In some cases, the percentage of users that won't download your platform-specific app might be large, for example: those that think that they won't use the app very often, or can't justify spending several megabytes of storage or data. You can determine the size of this segment in several ways, for example by using an analytics setup to track the percentage of "mobile web only" users.

If the size of this segment is considerable, that's a good indication that you need to provide alternative ways of installing your experiences.

## Promoting the installing of your PWA through the browser

If you have a high quality PWA, it may be better to promote its installation over your platform-specific app. For example, if the platform-specific app is missing functionality offered by your PWA, or if it hasn't been updated in a while. It can also be helpful to promote installation of your PWA if the platform-specific app wasn't optimized for bigger screens, such as on Chrome OS.

For some apps, driving platform-specific app installations is a key part of the business model, in that case, it makes business sense to show a platform-specific app install promotion. But, some users might be more comfortable staying on the web. If that segment can be identified, the PWA prompt can be shown only to them (what we call "PWA as fallback").

In this section we'll explore different ways of maximizing the installation rate of PWAs installed through the browser.

### PWA as primary installable experience

Once a PWA meets the [installability criteria](/install-criteria/), most browsers will show an indication that the PWA is installable. For example, Desktop Chrome will show an installable icon in the address bar, and on mobile, it will show a mini-infobar:

<figure class="w-figure w-figure--inline-right">
  <img src="a2hs-infobar.png" alt="Standard Chrome install prompt called mini-infobar">
  <figcaption class="w-figcaption">
    The mini-infobar
  </figcaption>
</figure>

While that may be enough for some experiences, if your goal is to drive installations of your PWA, we highly recommend you listen for the [`BeforeInstallPromptEvent`](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent), and follow the [patterns for promoting the installation](/promote-install/) of your PWA.


## Prevent your PWA from cannibalizing your platform-specific app install rate

In some cases, you may choose to promote the installation of your platform-specific app over your PWA, but in this case, we still recommend you provide a mechanism to allow users to install your PWA. This fallback option makes it possible for users who can't, or don't want to install your platform-specific app to get a similar, installed experience.

The first step to implement this strategy is to define a heuristic for when you'll show the user an install promotion for your PWA, for example:

__"A PWA user is a user that has seen the platform-specific app install prompt and not installed the platform-specific app. They have returned to the site at least five times, or they have clicked the app banner, but have continued using the website instead."__

Then, the heuristic can be implemented in the following way:

1. Show the platform-specific app install banner.
1. If a user dismisses the banner, set a cookie with that information (e.g. `document.cookie = "app-install-banner=dismissed"`).
1. Use another cookie to track the number of user visits to the site (e.g. `document.cookie = "user-visits=1"`).
1. Write a function, such as `isPWAUser()`, that uses the information previously stored in the cookies along with the [`getInstalledRelatedApps()`](/get-installed-related-apps/) API to determine if a user is considered a "PWA user".
1. At the moment when the user performs a meaningful action, call `isPWAUser()`. If the function returns true and the PWA install prompt was saved previously, you can show the PWA install button.

## Promoting the installing of your PWA through an app store

Apps that are available in App stores can be built with different technologies, including PWA techniques. In [Blending PWA into native environments](https://youtu.be/V7YX4cZ_Cto) you can find a summary of the technologies that can be used to that end.

In this section we'll classify apps in the store in two groups:

- **Platform-specific apps:** These apps are mostly built with platform-specific code. Their size depends on the platform, but it's usually above 10MB in Android, and 30MB in iOS. You might want to promote your platform-specific app if you don't have a PWA, or if the platform-specific app presents a more complete feature set.
- **Lightweight apps:** These apps can be built with platform-specific code as well, but they are commonly built with web technology, packaged in a platform-specific wrapper. Full PWAs can be uploaded to the stores as well. Some companies opt to provide these as "lite" experiences, and others have used this approach for their flagship (core) apps as well.

### Promoting Lightweight Apps

According to a [Google Play study](https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2), for every 6 MB increase to an APK's size, the install conversion rate decreases by 1%. This means that the download completion rate of an app of 10 MB could be approximately **30% higher than an app of 100 MB!**

To address this, some companies are leveraging their PWA to provide a lightweight version of their app in the Play Store using Trusted Web Activities. [Trusted Web Activities](https://developers.google.com/web/android/trusted-web-activity) make it possible to deliver your PWA in the Play Store, and because it's built using the web, the app size is usually only a few megabytes.

Oyo, one of India's largest hospitality companies, built a [Lite version of their app](/oyo-lite-twa/), and made it available in the Play Store using TWA.  It's only 850 KB, just 7% the size of their Android app. And once installed, it's indistinguishable from their Android app:

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption class="w-figcaption">
    OYO Lite in action.
  </figcaption>
</figure>

Oyo kept both the flagship and "lite" app versions in the store, leaving the final decision to users.

#### Providing a lightweight web experience

Intuitively, users on low-end devices, might be more inclined to download lightweight versions of apps than users on high-end phones. Therefore, if it's possible to identify a user's device, one could prioritize the lightweight app install banner over the heavier platform-specific app version.

On the web, it's possible to obtain device signals and approximately map them to device categories (e.g. "high", "mid", or "low"). You can obtain this information in different ways, using either JavaScript APIs or client hints.

#### Using JavaScript APIs

Using JavaScript APIs like [navigator.hardwareConcurrency](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency), [navigator.deviceMemory](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory), and [navigator.connection](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection) you can get information about the device CPU, memory and network status respectively. For example:

```javascript
const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';`
```

#### Using client hints

Device signals can be also inferred in HTTP request headers, through [client hints](https://developer.mozilla.org/en-US/docs/Glossary/Client_hints). Here's how you can implement the previous code for device memory with client hints:

First, tell the browser you are interested in receiving device memory hints in the header of the HTTP response for any first-party request:

```html
HTTP/1.1 200 OK
Content-Type: text/html
Accept-CH: Device-Memory
```

Then, you'll start receiving Device-Memory information in the request header of HTTP requests:

```html
GET /main.js HTTP/1.1
Device-Memory: 0.5
```

You can use this information in your backends to store a cookie with the category of the user's device:

```javascript
app.get('/route', (req, res) => {
  // Determine device category

 const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';

  // Set cookie
  res.setCookie('Device-Category', deviceCategory);
  …
});
```

Finally, create your own logic to map this information to device categories, and show the corresponding app install prompt on each case:

```javascript
if (isDeviceMidOrLowEnd()) {
   // show "Lite app" install banner or PWA A2HS prompt
} else {
  // show "Core app" install banner
}
```

{% Aside %}
Covering in depth techniques on how to map device signals to device categories is out of the scope of this guide, but you can check out Addy Osmani's [adaptive loading guide](https://dev.to/addyosmani/adaptive-loading-improving-web-performance-on-low-end-devices-1m69), Philip Walton's [The Device Memory API](https://developers.google.com/web/updates/2017/12/device-memory)  and Jeremy Wagner's [Adapting to Users with Client Hints](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints/) for more information on best practices around this.
{% endAside %}

## Conclusion

The ability to have an icon in the user's home screen is one of the most engaging features of applications. Given that historically this was only possible for apps installed from app stores, companies might think that showing an app store install banner would be enough to convince users to install their experiences. Currently there are more options to have the user install an app, including offering lightweight app experiences in the stores, and letting users add PWAs to the homescreen, by prompting them to do it directly from the website.

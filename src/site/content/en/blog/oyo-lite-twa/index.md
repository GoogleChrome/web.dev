---
title: "OYO Lite: a TWA with the best of web and Android apps"
subhead: |
  How a hospitality startup built an Android app that relies on web content
  to dramatically increase user engagement and keep file size low
authors:
  - ajain
  - mfriesenhahn
date: 2019-11-07
updated: 2019-11-08

description: |
  How a hospitality startup built an Android app that relies on web content to
  dramatically increase user engagement and keep file size low.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - twa
  - case-study
---

Founded in 2013, [OYO Rooms](https://www.oyorooms.com/)
has become one of India's largest hospitality companies,
with hotels across hundreds of cities in more than 80 countries.
That success came in part from making their online reservation experience
as fast and easy as possible.

Until recently, the OYO team was offering both a
[Progressive Web App (PWA)](https://developers.google.com/web/progressive-web-apps)
and an Android app to achieve that goal.
The Android app had significantly higher engagement:
users converted three times as often as those using the PWA.
But users also tended to uninstall the Android app over time
because of concerns about storage space.

To reduce the Android app's footprint on users' devices
while keeping the benefits of the Android experience,
the team decided to turn to
[Trusted Web Activities (TWAs)](https://developers.google.com/web/updates/2019/02/using-twa).

## What's a TWA?
Before Chrome 72, Android developers who wanted to display web content in
their platform-specific apps had to use
[WebView](https://developer.android.com/reference/android/webkit/WebView),
which came with some meaningful limitations:
it's not as fast as Chrome and doesn't include all of Chrome's APIs and features.
So, if you wanted behavior that WebView's rendering engine didn't support,
you had to build your own browser around it—which isn't exactly trivial!

[Trusted Web Activities (TWAs)](https://developers.google.com/web/updates/2019/02/using-twa)
address those limitations by showing web content directly in Chrome.
Breaking down the TWA name helps explain its features:
- An _activity_ is one screen or view in an Android app's user interface.
- TWAs use Chrome to display _web_ content for the app's activities.
- A TWA's content is _trusted_ because it uses
  [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)
  to verify that the same person created the Android app
  and the web content that it's displaying.

{% Aside %}
It's easy to confuse PWAs and TWAs.
_PWAs_ use web technologies to create experiences comparable to Android/iOS/desktop apps.
_TWAs_ allow you to display a PWA in an Android app wrapper
that can be downloaded from the Google Play Store.
{% endAside %}

## Why create a TWA rather than a platform-specific app?

More and more Android apps are delivering content from developers' own websites.
TWAs acknowledge that reality by offering the best
of the platform-specific and web app worlds:
- They have all the expected functionality of Android apps,
  including a launcher icon, push notifications, and fullscreen display.
- They offer the performance and features of Chrome.
- They use the version of Chrome installed on the device,
  so they always have the latest APIs and features.
- They use significantly less storage than a platform-specific app,
  which is a concern for many users,
  especially those with lower-end devices.

Running in Chrome also has a number of handy perks.
For example, TWAs share Chrome's storage,
including cookies, passwords, and anything stored using the
[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
One benefit of this setup is that users stay logged in
across the browser and the TWA app.

{% Aside %}
TWA support will soon be available in several Android browsers;
both Samsung and FireFox have committed to TWA.
You can specify what browser you want your app to use,
though it's best to select the user's default browser.
{% endAside %}

## Building OYO Lite

The OYO team wanted to give their users a full-featured app experience
without having to compromise on device storage,
so they decided to create
[OYO Lite](https://play.google.com/store/apps/details?id=com.oyo.consumerlite),
a TWA built on their existing PWA.

Starting with a PWA is essential.
Users expect a full-featured experience in an app they run from the Android launcher,
so web content served in a TWA must provide that experience, including:
- Fast load and response times
- Reliability when the user has limited or no connectivity
- A unified look and feel (by providing, for example, a splash screen and app color)

{% Aside %}
Meeting the [Lighthouse requirements for a PWA](/lighthouse-pwa)
is actually a prerequisite for TWAs.
To learn more about building a PWA,
see the [Installable collection](/installable).
{% endAside %}

If you already have a PWA,
the steps for creating a basic TWA are designed to be low-effort,
even if you've never developed for Android before.
Here's what the OYO team did:
* Created an
   [Android manifest file](https://developer.android.com/guide/topics/manifest/manifest-intro)
   containing a `DEFAULT_URL` and
   [intent filters](https://developer.android.com/guide/components/intents-filters)
   to allow the app to display content from [oyorooms.com](https://oyorooms.com).
* Removed the browser's URL bar using
   [Digital Asset Link](https://developers.google.com/digital-asset-links/v1/getting-started)
   verification.
* Created a launcher icon.
* Created a custom splash screen.

And here's the result:
<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption class="w-figcaption">
    OYO Lite in action.
  </figcaption>
</figure>

For a more detailed walkthrough of building a basic TWA,
check out Peter McLachlan and Andre Bandarra's
[TWA talk from Google I/O 2019](https://youtu.be/6lHBw3F4cWs).

To learn more about how the OYO team created OYO Lite—including
a deep dive into their approach for creating a splash screen
that's accessible to all Android users—take a look at Ankit Jain's
[post on Medium](https://medium.com/@ankitjainaj/3dd327d7afc5).

## How a TWA helped OYO meet the needs of its users

By storing most of their app assets in Chrome's cache,
the OYO team was able to get the initial download size
for OYO Lite down to a svelte 850&nbsp;KB.
That's just 7% the size of their Android app!

That small footprint combined with the amenities of an Android app
downloadable from the Google Play Store led to significant gains
in user engagement:
- A conversion rate three times higher than the PWA's rate
- Three times more logged-in users than the PWA, on average
- A 4.1&nbsp;rating on the Google Play Store

And aside from the user-facing benefits,
going with a TWA meant the team had only one codebase,
which they could easily update without having to wait
for users to download the latest version of the app.

## Build your own TWA
OYO's online reservation platform is only one use case for TWAs.
They can be a great fit for many projects currently built as platform-specific apps or web pages,
from shopping carts and checkout flows to FAQs and contact forms.

Check out these links to get started with TWAs:
- [Using Trusted Web Activities](https://developers.google.com/web/updates/2019/02/using-twa)
- [Taking Chrome Full Screen with Trusted Web Activities (YouTube)](https://youtu.be/6lHBw3F4cWs)
- [A complete guide to Trusted Web Activity (TWA): OYO case study](https://medium.com/@ankitjainaj/3dd327d7afc5)

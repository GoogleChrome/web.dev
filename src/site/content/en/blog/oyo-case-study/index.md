---
title: "A complete guide to Trusted Web Activity(TWA): OYO case study"
subhead: A catchy subhead that previews the content.
authors:
  - ajain

date: 2019-10-29
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27

description: |
  This post is a test to demonstrate all of the components that can go into
  an article. This description appears in the meta tag.
tags:
  - post # post is a required tag for the article to show up in the blog.
---

We all know that users like to keep only those apps that they use regularly.
The primary reason for uninstalls is the size of the app. With the help of TWA,
users will enjoy the native app experience, without having to compromise on the storage factor.
[OYO Lite](https://play.google.com/store/apps/details?id=com.oyo.consumerlite) gave us three times more conversion than our m-web(PWA) similar to that of the native OYO app and three times higher logged in user percentage.

In this blog post, we'll talk about how someone can use their existing web app
to build an Android App with the help of TWA. Let's first see what you are signing up for:

<figure class="w-figure w-figure--center">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite-orig.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite-orig.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption class="w-figcaption">
    <a href="https://play.google.com/store/apps/details?id=com.oyo.consumerlite" rel="noopener">OYO Lite</a> App (Speed: original)
  </figcaption>
</figure>

## What's TWA?

**Trusted Web Activities** are a new way to integrate your web app content
with your Android app using a protocol based on
[Custom Tabs](https://developer.chrome.com/multidevice/android/customtabs).
Although Android apps routinely include web content using a Chrome Custom Tab (with URL bar) or WebView,
a TWA runs your app fullscreen in Chrome
and hence can leverage the features and performance optimizations of the browser.
(Because of recent changes TWA will open in the Chrome browser even if it is not the default.)

{% Aside %}
TWA shares browser data like cookies and `localStorage` inside the app,
so if you are logged into the browser then you'll automatically be logged into TWA app as well.
{% endAside %}

## Why should I care about TWA?

Generally speaking, native apps have better conversion rates and more engagement
than web apps, but they also have some drawbacks, as mentioned below.
TWA reduces the gap between the web and native experiences and
it has features like updating content on the fly
while solving the storage problem for your users.

OYO Lite, OYO's TWA app, is ~850 KB (7% the size of our main app),
so it doesn't have storage issues and can target low-end devices.

### Capabilities available in TWA similar to a native app

- **Available in the launcher:** Since TWA apps are treated similarly
  to any other app in the Android system, they have launcher icons.
- **Works Offline:** With the help of service worker caching, TWA apps work offline.
- **Fast Loading:** All a native app's assets are downloaded when the app is installed,
  but web apps can cache assets like JavaScript and CSS in the browser or service worker cache.
  In general, web app's [Time to Interactive (TTI)](/interactive)
  should be around 5 seconds for a great loading experience.
- **Keep users engaged:** Native apps use push notifications for reengagement;
  web apps can send push notifications using service workers and web APIs.
  (Native push notification support is planned for TWA.)
- **Deep linking:** Any of your domain links can be opened in your TWA app using
  [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)
  pairing and an intent filter in your
  [Android manifest file](https://developer.android.com/guide/topics/manifest/manifest-intro).
- **Run fullscreen:** TWA apps can also run fullscreen with the help of
  digital asset link verification.
  (The app and the site it opens are expected to come from the same developer.)

### Capabilities in TWA better than native apps

- **Rapid updates:** If buggy code is shipped in a native app,
  your only option is to update the whole app.
  Since TWA apps are just a web app in a native wrapper,
  the code can be updated at any time, just like the web.
- **Backward compatibility:** There are no version checks in APIs built for TWA apps as they all will be running the same code.
- **Small file size:** Since native apps ship with all the code they need to run,
  their size usually reaches a few megabytes.
  TWA apps internally run a browser and request a webpage,
  so no code is shipped with the app itself, reducing initial download size to a few hundred kilobytes.

In conclusion, TWA is giving the best of both worlds.
Let's see what it takes to build one.

## Criteria for a web app to be turned into a TWA app

There are currently no requirements for content opened in a TWA app,
so any web app can be used to build a TWA app.
However, users won't expect a browser-like experience in something that appears
to be a native app, so you need to take extra steps to ensure your web app
appears and behaves as though it's native.
Your app should:

- Be accessible when offline
- Have digital asset links set up
- Work as a reliable, fast, and engaging standalone component
  within the launching app's flow

If your web app is already a [Progressive Web App (PWA)](https://developers.google.com/web/progressive-web-apps)
with a good score on [Lighthouse](https://developers.google.com/web/tools/lighthouse),
you just have to set up digital asset links.

## Building a basic TWA

A full TWA has integrated capabilities like Android shortcuts, a splash screen, and deep links.
But to build a basic TWA app, we followed the steps mentioned in [official Google docs](https://developers.google.com/web/updates/2019/02/using-twa).

Here's what we did:

1. Created an [Android manifest file](https://developer.android.com/guide/topics/manifest/manifest-intro)
   containing the `DEFAULT_URL`, i.e., [https://www.oyorooms.com](https://www.oyorooms.com) and intent filters to define that this activity is the launcher and an intent filter that says that this app can handle oyorooms URLs.
1. Removed the browser's URL bar using digital asset link verification.
1. Created a launch icon.

## Adding a splash screen

There is a long delay between launching the app and seeing it on screen
because the browser must be initialized and load yourHTML document.
We can't totally eliminate a delay, but we can show a splash screen
to reduce the perceived load time.

Starting in Chrome 75, there's support for TWA support splash screens;
all you need to do is specify a background color and an image
in the Android manifest file.

But what about users who use other browsers or earlier versions of Chrome?

So we went with the splash screen provided by TWA and also wrote our own custom splash activity which handled the use cases discussed above.

First, we created another activity and made it launcher which means this activity will be started on clicking the app icon.
AndroidManifest.xml:

```xml
<activity
  android:name=".SplashActivity"
  android:theme="@style/AppTheme.NoActionBar">

  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>

  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
      android:host="@string/website_host"
      android:scheme="@string/website_scheme" />`
  </intent-filter>

</activity>
<activity
  android:name="android.support.customtabs.trusted.LauncherActivity"
  android:theme="@style/AppTheme.NoActionBar">
…
  <meta-data
    android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
    android:resource="@color/colorPrimary" />
  <meta-data
    android:name="android.support.customtabs.trusted.SPLASH_IMAGE_DRAWABLE"
    android:resource="@drawable/ic_oyo_lite_white" />
  <meta-data
    android:name="android.support.customtabs.trusted.SPLASH_SCREEN_BACKGROUND_COLOR"
    android:resource="@color/colorPrimary"/>
  <meta-data
    android:name="android.support.customtabs.trusted.SPLASH_SCREEN_FADE_OUT_DURATION"
    android:value="500" />
  <meta-data
    android:name="android.support.customtabs.trusted.FILE_PROVIDER_AUTHORITY"
    android:value="oyo.consumerlite.authority" />
</activity>
```

Now the newly created SplashActivity should do the following tasks:

1. Should check if the splash screen is supported or not. This can be achieved by comparing the installed chrome version with the chrome 75 version.
1. If the splash screen is supported, just launch the trusted launcher activity with the URL. TWA will handle the splash screen. Metadata about the splash screen is provided to TWA in the AndroidManifest.
1. If Splash screen is not supported, then show the custom splash screen layout for some time(somewhere around 400ms seems decent) and then launch the trusted launcher activity.

In this way, users having old or newer chrome versions will get the splash screen. Although the handling of splash by TWA is much better than custom handling as in the latter, we are putting a delay in launching the activity whereas TWA shows the splash screen till the page is rendered behind the scenes and then fades out it which gives a nice experience.

## Let's talk numbers

- Conversion: 3 times higher than our PWA
- PlayStore rating: 4.6
- Percentage of users who logged in: 3 times higher than the PWA
- Realization: 1.5 times higher than the PWA

Apart from the above stats, TWA helps with  product building and marketing:

- Multiple presence on play store- leading to a higher opportunity for user acquisition
- Higher retention rates and stickiness
- Useful in markets with low internet penetration, especially helpful for OYO which has a presence across 80 countries
- Helpful in personalized marketing (to push the most relevant product for the right audience)
- Provides a better platform for CRM activities as compared to normal mobile web
- No incremental releases required around this- easier incremental changes

Congratulations, your commitment to learning something new is impeccable. I am a web engineer and recently started working on android, so please excuse me if anything worth mentioning is missed.

## Resources

- [Deeplinks](https://developer.android.com/training/app-links/deep-linking.html)
- [Official Google Docs](https://developers.google.com/web/updates/2019/02/using-twa)

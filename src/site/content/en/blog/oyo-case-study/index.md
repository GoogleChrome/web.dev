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

In this blog post, we'll talk about how someone can use their existing web app to build an Android App with the help of TWA. Let's first see what you are signing up for:

<figure class="w-figure w-figure--center">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite-orig.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite-orig.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption class="w-figcaption">
    <a href="https://play.google.com/store/apps/details?id=com.oyo.consumerlite" rel="noopener">OYO Lite</a> App (Speed: original)
  </figcaption>
</figure>

## What the heck is TWA?

**Trusted Web Activities** are a new way to integrate your web-app content with your Android app using a protocol based on [Custom Tabs](https://developer.chrome.com/multidevice/android/customtabs). Although Android apps routinely include web content using a Chrome Custom Tab (with URL bar) or WebView, a TWA runs your app full screen in the default browser(After the recent changes, TWA will open chrome browser even if it is not the default) and hence can leverage the features and performance optimizations of the browser.

{% Aside %}
TWA shares the browser data like cookies and localStorage inside app, so if you are logged in inside a browser then you'll automatically be logged in TWA app as well.
{% endAside %}

## Why should I care about TWA?

Generally speaking, the native app has a better conversion rate and more loyal users than the web app, but it has some drawbacks also as mentioned below. TWA app tries to reduce the gap between web and native experience and it can solve problems such as, update content on the fly, whilst solving the storage problem for your end-users.

OYO Lite (our TWA app) is ~850 KB (7% compared to our main app), so it doesn't have storage issues and can be used to target low-end devices.

## Capabilities available in TWA similar to a native app

- **Available at the tap of a button:** Since TWA app will be treated similar to any other app in the Android system, it'll also have a launcher icon.
- **Works Offline:** With the help of service-worker caching, the app will work in offline mode also.
- **Fast Loading:** Native apps come with all the assets bundled in them, the web app can cache its assets(JS, CSS, etc) in the browser or service-worker cache. In general web app's TTI(Time To Interactive) should be around 5 secs for a great loading experience.
- **Keep users engaged:** Apps use Push Notifications for reengagement, the same can be achieved by web apps with service-workers. Native Push Notifications support is also planned for TWA.
- **Deep linking:** Any of your domain links can be opened in your TWA app by [digital asset links](https://developers.google.com/digital-asset-links/v1/getting-started) pairing and an intent filter in your manifest file.
- **Run FullScreen:** TWA apps can also run full screen with the help of digital assets link verification. The app and the site it opens are expected to come from the same developer.

## Capabilities in TWA better than native apps

- **Can update on the fly:** If a buggy code is shipped in a native app, then you can't do anything but wait for your users to update the app. This is not the case with TWA apps since they are just the web app wrapped inside an app, so the code can be updated anytime just like the web.
- **Backward compatibility is not a problem:** There are no version checks in APIs built for TWA apps as they all will be running the same code.
- **Size:** Since native apps ship with all the machinery needed to run, their size usually reaches a few MBs. TWA apps internally run a browser and request for a webpage, no code is shipped with the apk and hence whole app size gets reduced to a few hundred KBs.

In conclusion, TWA is giving the best of both worlds, isn't it? Now let's try to see what it takes to build one.

## Criteria for a web app to be turned into a TWA app

There are currently no qualifications for content opened in the preview of Trusted Web activities. It means any web app can be used to build TWA app, but users won't like your app if it is showing URL bar inside an app, displaying "not connected to internet" message when offline, taking too much time to load or transition between pages are not smooth like a native app. So to make a decent TWA app, bare minimum qualifications should be:

- To be accessible and operable even when offline.
- Should have digital asset links set up.
- To work as a reliable, fast and engaging standalone component within the launching app's flow.

If the web app is already a PWA (Progressive Web App) with a good score on [Lighthouse](https://developers.google.com/web/tools/lighthouse), then you just have to set up digital asset links.

## A very basic TWA

I'll share the challenges faced and how we integrated functionalities like android shortcuts, splash screen, deep links, etc in coming posts, but before that to build a basic TWA app, we followed the steps mentioned in [official Google docs](https://developers.google.com/web/updates/2019/02/using-twa). Our project underwent the following changes:

1. Created an Android Manifest file containing the `DEFAULT_URL`, i.e., [https://www.oyorooms.com](https://www.oyorooms.com) and intent filters to define that this activity is the launcher and an intent filter that says that this app can handle oyorooms URLs.
1. The URL bar is removed with the help of digital asset links verification.
1. Launch Icon is created.

{% Aside %}
There is a long white screen between launching the app and getting anything on the screen. This is the time when the browser is getting initialized and your web app is getting the html document. We can't avoid it completely but can serve something which user is familiar with i.e A Splash Screen.
{% endAside %}

## Adding the Splash Screen: the right way

Splash screen is the screen that generally every native app shows till it loads so that users can know that the app is starting up.

Starting on Chrome 75, Trusted Web Activities have support for Splash Screens and we just have to provide background color and an image. This is sufficient but it won't suffice for all users as:

- Some users would be using browsers other than Chrome.
- All users won't be having the Chrome 75 or newer version.

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
            android:scheme="@string/website_scheme"
            />
    </intent-filter>

</activity>
<activity        android:name="android.support.customtabs.trusted.LauncherActivity"
android:theme="@style/AppTheme.NoActionBar">
.
.
<meta-data
    android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
android:resource="@color/colorPrimary" />
<meta-data
    android:name="android.support.customtabs.trusted.SPLASH_IMAGE_DRAWABLE"
android:resource="@drawable/ic_oyo_lite_white" />
<meta-data android:name="android.support.customtabs.trusted.SPLASH_SCREEN_BACKGROUND_COLOR"
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

- Conversion: 3X of PWA
- PlayStore Rating: 4.6
- Logged-In %: 3X of PWA
- Realization: 1.5X of PWA

Apart from the above stats, TWA helps in product building/marketing in ways :

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

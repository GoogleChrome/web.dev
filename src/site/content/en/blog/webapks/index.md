---
title: WebAPKs on Android
subhead: When the user adds your Progressive Web App to their home screen on Android, Chrome automatically generates an APK for you, which we sometimes call a WebAPK. Being installed via an APK makes it possible for your app to show up in the app launcher, in Android's app settings and to register a set of intent filters.
date: 2017-05-21
updated: 2020-10-14
authors:
  - petelepage
description: |
  When the user adds your Progressive Web App to their home screen on Android, Chrome automatically generates an APK for you, which we sometimes call a WebAPK. Being installed via an APK makes it possible for your app to show up in the app launcher, in Android's app settings and to register a set of intent filters.
tags:
  - blog
---

[Installing a PWA](/progressive-web-apps/) on Android does
more than just add the Progressive Web App to the user's Home Screen. Chrome
automatically generates and installs a special APK of your app. We sometimes
refer to this as a **WebAPK**. Being installed via an APK makes it possible
for your app to show up in the app launcher, in Android's app settings and
to register a set of intent filters.

To
[generate the WebAPK](https://chromium.googlesource.com/chromium/src/+/master/chrome/android/webapk/README.md),
Chrome looks at the [web app manifest](/add-manifest/) and
other metadata. [When an update to the manifest is detected](#update-webapk),
Chrome will need to generate a new APK.

Note: Since the WebAPK is regenerated each time an updated manifest is detected,
we recommend changing it only when necessary. Don't use the manifest to store
user specific identifiers, or other other data that might be customized.
Frequently changing the manifest will increase the overall install time.

## Android intent filters

When a Progressive Web App is installed on Android, it will register a set of
[intent filters](https://developer.android.com/guide/components/intents-filters)
for all URLs within the scope of the app. When a user clicks on a link that
is within the scope of the app, the app will be opened, rather than opening
within a browser tab.

Consider the following partial `manifest.json`:

```text
"start_url": "/",
"display": "standalone",
```

When a web app using it is launched from the app launcher, it would open
`https://example.com/` as a standalone app, without any browser chrome.

The WebAPK would include the following intent filters:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data
    android:scheme="https"
    android:host="example.com"
    android:pathPrefix="/" />
</intent-filter>
```

If the user clicks on a link within an installed app to
`https://example.com/read`, it would be caught by the intent and opened
in the Progressive Web App.

Note: Navigating directly to `https://example.com/app/` from the address bar in
Chrome will work exactly the same as it does for native apps that have an
intent filter. Chrome assumes the user **intended** to visit the site and
will open this site.

### Using `scope` to restrict intent filters

If you don't want your Progressive Web App to handle all URLs within your site,
you can add the [`scope`](/add-manifest/#scope) property to
your web app manifest. The `scope` property tells Android to only open your web
app if the URL matches the `origin` + `scope`. It gives you control over which
URLs will be handled by your app, and which should be opened in the browser.
This is helpful when you have your app and other non-app content on the same
domain.

Consider the following partial `manifest.json`:

```text
"scope": "/app/",
"start_url": "/app/",
"display": "standalone",
```

When launched from the app launcher, it would open `https://example.com/app/`
as a standalone app, without any browser chrome.

Like before, the generated WebAPK would include an intent filter, but with a
different `android:pathPrefix` attribute in the APK's `AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data
    android:scheme="https"
    android:host="example.com"
    android:pathPrefix="/app/" />
</intent-filter>
```

Let's take a look at a few examples:<br>

{% Compare 'better'%}
`https://example.com/app/` - within `/app/`
{% endCompare %}

{% Compare 'better'%}
`https://example.com/app/read/book` - within `/app/`
{% endCompare %}

{% Compare 'worse'%}
`https://example.com/help/` - not in `/app/`
{% endCompare %}

{% Compare 'worse'%}
`https://example.com/about/` - not in `/app/`
{% endCompare %}


See [`scope`](/add-manifest/#scope) for more information about
`scope`, what happens when you don't set it, and how you can use it to define
the scope of your app.

## Managing permissions

Permissions work in the same way as other web apps and cannot be requested at
install time. Instead, they must be requested at run time, ideally only when
you really need them. For example, don't ask for camera permission on first
load, but instead wait until the user attempts to take a picture.

Note: Android normally grants immediate permission to show notifications for
installed apps, but apps installed via WebAPKs are not granted this at install
time; you must request it at runtime within your app.

## Managing storage and app state

Even though the progressive web app is installed via an APK, Chrome uses the
current profile to store any data, and it will not be segregated away. This
allows a shared experience between the browser and the installed app. Cookies
are shared and active, any client side storage is accessible and the service
worker is installed and ready to go.

Note: Keep in mind that if the user clears their Chrome profile, or chooses
to delete site data, that will apply to the WebAPK as well.

## Updating the WebAPK

Information on how a WebAPK is updated has moved to
[How Chrome handles updates to the web app manifest](/manifest-updates/).

## Frequently asked questions

What icons are used to generate the splash screen? :

: We recommend you provide at least two icons:
[192px and 512px](/add-manifest/#splash-screen) for the splash screen.
We heard from you that icons
on the splash screen were too small. WebAPKs generated in Chrome 71 or later
will show a larger icon on the splash screen. No action is required, as
long as the recommended icons are provided.

What happens if the user has already installed the native app for the site?

: Like add to home screen today, users will be able to add a site independent
of any native apps. If you expect users to potentially install both, we
recommend differentiating the icon or name of your site from your native
app.

Will my installed site's storage be cleared if the user clears Chrome's cache?

: Yes.

Will my app be re-installed when I get a new device?

: Not at this time, but we think it is an important area and we are
investigating ways to make it work.

How are permissions handled? Will I see the Chrome prompt or Android's?

: Permissions will still be managed through Chrome. Users will see the Chrome
prompts to grant permissions and will be able to edit them in Chrome
settings.

What versions of Android will this work on?

: Progressive web apps can be installed on all versions of Android that
run Chrome for Android, specifically Jelly Bean and above.

Does this use the WebView?

: No, the site opens in the version of Chrome the user added the site from.

Can we upload the APKs that are created to the Play Store?

: No. If you want to upload your own APK, check out[Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/).

Are these listed in the Play Store?

: No. If you want to upload your own APK for listing in the Play Store, check
out [Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/).

I am a developer of another browser on Android, can I have this seamless install process? :

: No. We prefer to keep our anticompetitive advantage.

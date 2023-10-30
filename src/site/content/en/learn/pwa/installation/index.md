---
title: Installation
description: >
  Installed apps are easy to access and can take advantage of some deeper integrations with the OS. Learn to make your PWA installable and gain those benefits.
authors:
  - firt
date: 2022-01-10
updated: 2022-02-23
---

Once the user installs your PWA, it will:

- Have an icon in the launcher, home screen, start menu, or launchpad.
- Appear as a result when a user searches for the app on their device.
- Have a separate window within the operating system.
- Have support for specific capabilities.

{% Aside %}
While installation differs per browser and operating system, you don't need to create any kind of package or executable for your PWA to be installed from a browser.
{% endAside %}

## Installation criteria

Every browser has a criterion that marks when a website or web app is a Progressive Web App and can be installed for a standalone experience.
The metadata for your PWA is set by a JSON-based file known as the Web App Manifest, which we will cover in detail in the [next module](/learn/pwa/web-app-manifest/).

As a minimum requirement for installability, most browsers that support it use the Web App Manifest file and certain properties such as the name of the app, and configuration of the installed experience. An exception to this is Safari for macOS, which does not support installability.

The requirements to allow installation differ among the different browsers, [this article](/install-criteria/) details the criteria for Google Chrome and includes links to requirements for other browsers.

Because the test that a PWA meets installability requirements can take several seconds, installability itself may not be available as soon as a URLs response is received.

{% Aside %}
The process for uninstalling a PWA is different on each combination of operating system and browser. In most situations, the app can be uninstalled the same as any other platform-specific app; in other situations, the PWA window offers a menu with an uninstall option. Deleting the icon may not clear the storage that a PWA is using.
{% endAside %}

### Desktop installation

Desktop PWA installation is currently supported by Google Chrome and Microsoft Edge on Linux, Windows, macOS, and Chromebooks. These browsers will show an install badge (icon) in the URL bar (see the image below), stating that the current site is installable.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/aNv7ezpI3iO6YpIlHt9J.png", alt="Chrome and Edge on desktop with the install badge in the URL bar", width="800", height="751" %}

When a user is engaged with a site, they may see a popup such as the one below inviting users to install it as an app.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/YVHGuBQDUKGZXT7cGuHO.png", alt="Google chrome in-product help suggesting the PWA installation.", width="800", height="366" %}

The browser's drop-down menu also includes an "Install <name of the app>" item that the user can use:

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/WBZ15ArNciZnrvJY6yUt.png", alt="Chrome and Edge menu items for PWA installation.", width="800", height="533" %}

{% Aside %}
Chromium-based browsers on desktop let you see all the installed PWAs with that browser using `about:apps`.
{% endAside %}

Only standalone and minimal-ui [display modes](/learn/pwa/app-design#display-modes) are supported on desktop operating systems.

PWAs installed on desktops:

- Have an icon in the Start menu or Start screen on Windows PCs, in the dock or desktop in Linux GUIs, in the macOS launchpad, or a Chromebook's app launcher.
- Have an icon in app switchers and docks when the app is active, was recently used, or is opened in the background.
- Appear in the app search, for example, search on Windows or Spotlight on macOS.
- Can set a badge number on their icons, to indicate new notifications. This is done with the [Badging API](https://developer.mozilla.org/docs/Web/API/Badging_API).
- Can set a contextual menu for the icon with [App Shortcuts](https://developer.mozilla.org/docs/Web/Manifest/shortcuts).
- Can't be installed twice with the same browser.

{% Aside %}
Installation may unlock other capabilities that are not available for PWAs running within the browser's tab. We'll talk more about this in the [Capabilities Chapter](/learn/pwa/capabilities).
{% endAside %}

After installing an app on the desktop, users can navigate to `about:apps`, right-click on a PWA, and select "Start App when you Sign In" if they want your app to open automatically on startup.

### iOS and iPadOS installation

A browser prompt to install your PWA doesn't exist On iOS and iPadOS. In these platforms PWAs are also known as *home screen web apps*. These apps have to be added manually to the home screen via a menu that is available only in Safari. It is recommended that you add the tag [`apple-touch-icon`](https://developer.chrome.com/docs/lighthouse/pwa/apple-touch-icon/) to your html.
To define the icon, include the path to your icon to your HTML `<head>` section, like this:

```html
<link rel="apple-touch-icon" href="/icons/ios.png">
```
 Safari will use that information to create the shortcut and if you don't provide a specific icon for Apple devices, the icon on the home screen will be a screenshot of your PWA when the user installed it.

It's important to understand that PWA installation is only available if the user browses your website from Safari. Other browsers available in the App Store, such as Google Chrome, Firefox, Opera, or Microsoft Edge, cannot install a PWA on the home screen.

The steps to add apps to the home screen are:

1. Open the Share menu, available at the bottom or top of the browser.
1. Click **Add to Home Screen**.
1. Confirm the name of the app; the name is user-editable.
1. Click **Add**.
On iOS and iPadOS, bookmarks to websites and PWAs look the same on the home screen.

{% Video src="video/RK2djpBgopg9kzCyJbUSjhEGmnw1/UhWxRAtIB6KQpbMYnDSe.mp4", autoplay="true", controls="true" %}

On iOS and iPadOS, only the standalone [display mode](/learn/pwa/app-design) is supported. Therefore, if you use minimal UI mode, it will fall back to a browser shortcut; if you use fullscreen, it will fall back to standalone.

{% Aside  'caution' %}
On Apple devices, you can install the same PWA multiple times; each installation will have its own isolated storage, and it will be treated as a different app.
{% endAside %}

PWAs installed on iOS and iPadOS:

- Appear in the home screen, Spotlight's search, Siri Suggestions, and App Library search.
- Don't appear in App Gallery's categories folders.
- Lack support for capabilities such as badging and app shortcuts.

Incidentally, Safari uses a native technology known as [Web Clips](https://developer.apple.com/documentation/devicemanagement/webclip) to create the PWA icons in the operating system. They are just XML files in Apple's Property List format stored in the filesystem.

{% Aside 'gotchas' %}
When users use the PWA, they are not using an instance of the Safari app (like they use an instance of Chrome when doing so), they are using something known as *Web.app*, so you should expect slight differences between your PWA rendered in Safari and a PWA window. Both Safari and Web.app use the same core from WebKit and the same JavaScript runtime, but they run in different processes and may have different implementations, such as having isolated storage.
{% endAside %}

### Android installation

On Android, PWA install prompts differ by device and browser. Users may see:

- Variations in the wording of the menu item for install such as **Install** or **Add to Home Screen**.
- Detailed installation dialogs.

In the following image you can see two different versions of an installation dialog, a simple mini-infobar (left) and a detailed installation dialog (right).

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/qqVFLVmurQkr5RGauvGK.png", alt="Mini info bar and installation dialogs on Android.", width="800", height="417" %}

Depending on the device and browser, your PWA will either be installed as a WebAPK, a shortcut, or a QuickApp.

#### WebAPKs

A WebAPK is an Android package (APK) created by a trusted provider of the user's device, typically in the cloud, on a WebAPK _minting server_. This method is used by Google Chrome on devices with Google Mobile Services (GMS) installed, and by Samsung Internet browser, but only on Samsung-manufactured devices, such as a Galaxy phone or tablet. Together, this accounts for the majority of Android users.

When a user installs a PWA from Google Chrome and a WebAPK is used, the minting server "mints" (packages) and signs an APK for the PWA. That process takes time, but when the APK is ready, the browser installs that app silently on the user's device. Because trusted providers (Play Services or Samsung) signed the APK, the phone installs it without disabling security, as with any app coming from the store. There is no need for sideloading the app.

PWAs installed via WebAPK:

- Have an icon in the app launcher and home screen.
- Appear on Settings, Apps.
- Can have several capabilities, such as [badging](/badging-api/), [app shortcuts](/app-shortcuts/), and [capture links within the OS](/declarative-link-capturing/).
- Can [update](/manifest-update) the icon and app's metadata.
- Can't be installed twice.

{% Aside 'gotchas' %}
You, as a PWA developer, don't need to build or sign any package when a WebAPK is used. It's all handled transparently between the browser, device, and minting server.
{% endAside %}

#### Shortcuts

While WebAPKs provide the best experience for Android users, they can't always be created. When they can't, browsers fall back to creating a website shortcut. Because Firefox, Microsoft Edge, Opera, Brave, and Samsung Internet (on non-Samsung devices) don't have minting servers they trust, they'll create shortcuts. Google Chrome will too if the minting service is unavailable or your PWA doesn't meet installation requirements.

PWAs installed with shortcuts:

- Have a browser-badged icon on the home screen (see the following examples).
- Don't have an icon in the Launcher or on **Settings, Apps**.
- Can't use any capabilities that require installation.
- Can't update their icons and app metadata.
- Can be installed many times, even using the same browser; when this happens, all will point to the same instance, and use the same storage.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/79QaL12M28cHhIrJLRyM.png", alt="A PWA installed with different browsers on the same device.", width="800", height="432" %}

#### QuickApps

Some manufacturers, including Huawei and ZTE, offer a platform known as [QuickApps](https://developer.huawei.com/consumer/en/huawei-quickApp/) to create light web apps similar to PWAs but using a different technology stack. Some browsers on these devices, like the Huawei browser, can install PWAs that get packaged as QuickApp, even if you are not using the QuickApp stack.

When your PWA is installed as a QuickApp, users will get a similar experience to the one they would have with shortcuts, but with an icon badged with the QuickApps icon (a lightning image). The app will also be available to launch from the QuickApp Center.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/iHhjBvDriV4hZVnmVapW.png", alt="QuickApps on a Huawei or ZTE home screen.", width="800", height="497" %}

## Prompting for installation

In Chromium-based browsers on desktop and Android devices, it's possible to trigger the browser's installation dialog from your PWA. The [Installation Prompt chapter](/learn/pwa/installation-prompt), will cover [patterns for doing so](/promote-install/) and how to implement them.

{% Aside 'warning' %}
If you provide instructions to the user, remember that menu items' names vary by language.
{% endAside %}

## App catalogs and stores

Your PWA can also be listed in app catalogs and stores to increase its reach and let users find it in the same place they find other apps.
Most app catalogs and stores support technologies that let you publish a package that doesn't include the whole web app (such as your HTML and assets). These technologies let you create just a launcher to a standalone web rendering engine that will load the app and let the service worker cache the necessary assets.

The app catalogs and stores that support publishing a PWA are:

- [Google Play Store for Android and ChromeOS](https://chromeos.dev/en/publish/pwa-in-play), using a [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/).
- Apple App Store for iOS, macOS, and iPadOS, using WKWebView and [App-Bound Domains](https://webkit.org/blog/10882/app-bound-domains/).
- [Microsoft Store for Windows 10 and 11](https://docs.microsoft.com/en-us/windows/uwp/publish/pwa/overview), using APPX packages.
- [Samsung Galaxy Store](https://samsunginternet.github.io/introducing-progressive-web-apps-to-samsung-galaxy-store/), using the Samsung WebAPK minting server.
- Huawei AppGallery, using a [QuickApp container for your HTML application](https://developer.huawei.com/consumer/en/doc/development/quickApp-Guides/quickapp-h5-to-quickapp-introduction-0000001150075595).

If you want to learn more about how to publish a PWA to app catalogs and stores, check out [BubbleWrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) and [PWA Builder](https://pwabuilder.com).

{% Aside 'warning' %}
Some app catalogs and stores have technical or business requirements that before your PWA is accepted for publication. Check each store's requirements before starting.
{% endAside %}

## Resources

- [What does it take to be installable](/install-criteria/)
- [WebAPKs on Android](/webapks/)
- [Patterns for promoting PWA installation](/promote-install/)
- [Using a PWA in your Android app](/using-a-pwa-in-your-android-app/)
- [List your Progressive Web App in Google Play](https://chromeos.dev/en/publish/pwa-in-play)
- [Submit your PWA to the Microsoft Store](https://docs.microsoft.com/en-us/windows/uwp/publish/pwa/overview)
- [Publishing a PWA to App Store](https://firt.dev/pwa-stores/)
- [WebKit: App-Bound Domains](https://webkit.org/blog/10882/app-bound-domains/)

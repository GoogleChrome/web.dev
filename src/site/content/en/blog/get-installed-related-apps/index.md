---
layout: post
title: "Is your app installed? getInstalledRelatedApps() will tell you!"
subhead: |
  The `getInstalledRelatedApps()` method allows your website to check whether
  your iOS/Android/desktop app or PWA is installed on a user's device.
authors:
  - petelepage
description: |
  The getInstalledRelatedApps() API is a web platform API that allows you
  to check whether your iOS/Android/desktop app or PWA is installed on the
  user's device.
date: 2018-12-20
updated: 2021-09-16
tags:
  - blog
  - capabilities
hero: image/admin/v9t93rXITPqFe3L0qlTN.jpg
alt: mobile device with app panel open
feedback:
  - api
---

## What is the getInstalledRelatedApps() API? {: #what }

<figure data-float="right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vjamv2uyz6NxBPxPIm11.jpg", alt="", width="550", height="486" %}
  <figcaption>
    A website using <code>getInstalledRelatedApps()</code> to determine if its
    Android app is already installed.
  </figcaption>
</figure>

The [`getInstalledRelatedApps()`][spec] makes it possible for *your* page to
check if *your* mobile or desktop app, or in some cases, if your Progressive
Web App (PWA) is already installed on a user's device, and allows you to
customize the user experience if it is.

For example, if your app is already installed:

* Redirecting the user from a product marketing page directly into your app.
* Centralizing some functionality like notifications in the other app to
  prevent duplicate notifications.
* Not [promoting the installation](/customize-install/) of your PWA if your
  other app is already installed.

To use the `getInstalledRelatedApps()` API, you need to tell your app about
your site, then tell your site about your app. Once you've defined the
relationship between the two, you can check if the app is installed.

### Supported app types you can check

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>App type</th>
        <th>Checkable from</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="#check-android">Android app</a>
        </td>
        <td>
          Android only<br>
          Chrome 80 or later
        </td>
      </tr>
      <tr>
        <td>
          <a href="#check-windows">Windows (UWP) app</a>
        </td>
        <td>
          Windows only<br>
          Chrome 85 or later<br>
          Edge 85 or later
        </td>
      </tr>
      <tr>
        <td>
          Progressive Web App<br>
          Installed in the <a href="#check-pwa-in-scope">same scope</a> or a
          <a href="#check-pwa-out-of-scope">different scope</a>.
        </td>
        <td>
          Android only<br>
          Chrome 84 or later
        </td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
  The `getInstalledRelatedApps()` API only allows you to check if *your* apps
  are installed. You cannot get a list of all installed apps, or check if other
  3rd party apps are installed.
{% endAside %}

<!--  Android App -->

## Check if your Android app is installed {: #check-android }

Your website can check if your Android app is installed.

{% Compare 'better', 'Supported on' %}
Android: Chrome 80 or later
{% endCompare %}

### Tell your Android app about your website

First, you'll need to update your Android app to define the relationship
between your website and Android application using the
[Digital Asset Links system][dig-asset-links]. This ensures that only your
website can check if your Android app is installed.

In the `AndroidManifest.xml` of your Android app, add an `asset_statements`
entry:

```xml
<manifest>
  <application>
   …
    <meta-data android:name="asset_statements" android:resource="@string/asset_statements" />
   …
  </application>
</manifest>
```

Then, in `strings.xml`, add the following asset statement, updating `site` with
your domain. Be sure to include the escaping characters.

```xml
<string name="asset_statements">
  [{
    \"relation\": [\"delegate_permission/common.handle_all_urls\"],
    \"target\": {
      \"namespace\": \"web\",
      \"site\": \"https://example.com\"
    }
  }]
</string>
```

Once completed, publish your updated Android app to the Play store.

### Tell your website about your Android app

Next, tell your website about your Android app by
[adding a web app manifest](/add-manifest/) to your page. The manifest must
include the `related_applications` property, an array that provides the details
about your app, including `platform` and `id`.

* `platform` must be `play`
* `id` is the GooglePlay application ID for your Android app

```json
{
  "related_applications": [{
    "platform": "play",
    "id": "com.android.chrome",
  }]
}
```

### Check if your app is installed

Finally, call [`navigator.getInstalledRelatedApps()`](#use) to check if your
Android app is installed.

Try the [demo](https://get-installed-apps.glitch.me/)

<!--  Windows App -->

## Check if your Windows (UWP) app is installed {: #check-windows }

Your website can check if your Windows app (built using UWP) is installed.

{% Compare 'better', 'Supported on' %}
Windows: Chrome 85 or later, Edge 85 or later
{% endCompare %}

### Tell your Windows app about your website

You'll need to update your Windows app to define the relationship between your
website and Windows application using [URI Handlers][win-uri-handlers]. This
ensures that only your website can check if your Windows app is installed.

Add the `Windows.appUriHandler` extension registration to your app's manifest
file `Package.appxmanifest`. For example, if your website's address is
`example.com` you would add the following entry in your app's manifest:

```xml
<Applications>
  <Application Id="App" ... >
      ...
      <Extensions>
         <uap3:Extension Category="windows.appUriHandler">
          <uap3:AppUriHandler>
            <uap3:Host Name="example.com" />
          </uap3:AppUriHandler>
        </uap3:Extension>
      </Extensions>
  </Application>
</Applications>
```

Note, you may need to add the [`uap3` namespace][uap3-namespace] to your
`<Package>` attribute.

Then, create a JSON file (without the `.json` file extension) named
`windows-app-web-link` and provide your app's package family name. Place
that file either on your server root, or in the `/.well-known/` directory. You
can find the package family name in the Packaging section in the app manifest
designer.

```json
[{
  "packageFamilyName": "MyApp_9jmtgj1pbbz6e",
  "paths": [ "*" ]
}]
```

See [Enable apps for websites using app URI handlers][win-uri-handlers] for
complete details on setting up URI handlers.

### Tell your website about your Windows app

Next, tell your website about your Windows app by
[adding a web app manifest](/add-manifest/) to your page. The manifest must
include `related_applications` property, an array that provides the details
about your app, including `platform` and `id`.

* `platform` must be `windows`
* `id` is your app's package family name, appended by the `<Application>` `Id`
  value in your `Package.appxmanifest` file.

```json
{
  "related_applications": [{
    "platform": "windows",
    "id": "MyApp_9jmtgj1pbbz6e!App",
  }]
}
```

### Check if your app is installed

Finally, call [`navigator.getInstalledRelatedApps()`](#use) to check if your
Windows app is installed.

<!--  PWA - in scope -->

## Check if your Progressive Web App is already installed (in scope) {: #check-pwa-in-scope }

Your PWA can check to see if it is already installed. In this case, the page
making the request must be on the same domain, and within the [scope][scope]
of your PWA, as defined by the scope in the web app manifest.

{% Compare 'better', 'Supported on' %}
Android: Chrome 84 or later
{% endCompare %}

### Tell your PWA about itself

Tell your PWA about itself by adding a `related_applications` entry in your
PWAs [web app manifest](/add-manifest/).

* `platform` must be `webapp`
* `url` is the full path to the web app manifest of your PWA

```json
{
  …
  "scope": "/",
  "start_url": "/",
  "related_applications": [{
    "platform": "webapp",
    "url": "https://example.com/manifest.json",
  }],
  …
}
```

### Check if your PWA is installed

Finally, call [`navigator.getInstalledRelatedApps()`](#use) from within the
[scope][scope] of your PWA to check if it is installed. If
`getInstalledRelatedApps()` is called outside the scope of your PWA, it will
return false. See the next section for details.

Try the [demo](https://gira-same-domain.glitch.me/pwa/)

<!--  PWA - NOT in scope -->

## Check if your Progressive Web App is installed (out of scope)  {: #check-pwa-out-of-scope }

Your website can check if your PWA is installed, even if the page is outside
the [scope][scope] of your PWA. For example, a landing page served from
`/landing/` can check if the PWA served from `/pwa/` is installed, or if your
landing page is served from `www.example.com` and your PWA is served from
`app.example.com`.

{% Compare 'better', 'Supported on' %}
Android: Chrome 84 or later
{% endCompare %}

### Tell your PWA about your website

First, you'll need to add digital asset links to the server where your PWA is
served from. This will help define the relationship between your website and
your PWA, and ensures that only your website can check if your PWA is installed.

Add an [`assetlinks.json`](https://developers.google.com/digital-asset-links/v1/getting-started)
file to the [`/.well-known/`][well-known] directory
of the domain where the PWA lives, for example `app.example.com`. In the `site`
property, provide the full path to the web app manifest that will perform
the check (not the web app manifest of your PWA).

```json
// Served from https://app.example.com/.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.query_webapk"],
    "target": {
      "namespace": "web",
      "site": "https://www.example.com/manifest.json"
    }
  }
]
```

{% Aside %}
  Double check the file name when you create your `assetlinks.json` file,
  I've wasted many hours debugging, only to realize I'd added an extra 's' in
  the file name.
{% endAside %}

### Tell your website about your PWA

Next, tell your website about your PWA app by
[adding a web app manifest](/add-manifest/) to your page. The manifest must
include the `related_applications` property, an array that provides the details
about your PWA, including `platform` and `url`.

* `platform` must be `webapp`
* `url` is the full path to the web app manifest of your PWA

```json
{
  "related_applications": [{
    "platform": "webapp",
    "url": "https://app.example.com/manifest.json",
  }]
}
```

### Check if your PWA is installed

Finally, call [`navigator.getInstalledRelatedApps()`](#use) to check if your
PWA is installed.

Try the [demo](https://gira-same-domain.glitch.me/)

<!--  Use the API-->

## Calling getInstalledRelatedApps() {: #use }

Calling `navigator.getInstalledRelatedApps()` returns a promise that
resolves with an array of your apps that are installed on the user's device.

```js
const relatedApps = await navigator.getInstalledRelatedApps();
relatedApps.forEach((app) => {
  console.log(app.id, app.platform, app.url);
});
```

To prevent sites from testing an overly broad set of their own apps,
only the first three apps declared in the web app manifest will be
taken into account.

Like most other powerful web APIs, the `getInstalledRelatedApps()` API is
only available when served over **HTTPS**.

## Still have questions? {: #questions }

Still have questions? Check the [`getInstalledRelatedApps` tag on StackOverflow][so-gira]
to see if anyone else has had similar questions. If not, ask your
[question][so-ask-question] there, and be sure to tag it with the
[`progressive-web-apps`][so-tagged-pwa] tag. Our team frequently monitors
that tag and tries to answer your questions.

## Feedback {: #feedback }

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at [https://new.crbug.com][new-bug]. Include as much
  detail as you can, provide simple instructions for reproducing the bug, and
  enter `Mobile>WebAPKs` in the **Components** box. [Glitch](https://glitch.com)
  works great for sharing quick and easy repros.

## Show support for the API

Are you planning to use the `getInstalledRelatedApps()` API? Your public
support helps the Chrome team to prioritize features and shows other
browser vendors how critical it is to support them.

* Share how you plan to use the API on the [WICG Discourse thread][wicg-discourse].
* Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
  [`#getInstalledRelatedApps`](https://twitter.com/search?q=%23getInstalledRelatedApps&src=typed_query&f=live)
  and let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer for `getInstalledRelatedApps()` API][explainer]
* [Spec draft][spec]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`Mobile>WebAPKs`](https://chromestatus.com/features#component%3A%20Mobile%3EWebAPKs)

## Thanks

Special thanks to Sunggook Chue at Microsoft for helping with the details
for testing Windows apps, and Rayan Kanso for help with the Chrome details.

[spec]: https://wicg.github.io/get-installed-related-apps/spec/
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=895854
[cr-status]: https://www.chromestatus.com/feature/5695378309513216
[explainer]: https://github.com/WICG/get-installed-related-apps/blob/main/EXPLAINER.md
[spec]: https://wicg.github.io/get-installed-related-apps/spec/
[wicg-discourse]: https://discourse.wicg.io/t/proposal-get-installed-related-apps-api/1602
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Mobile%3EWebAPKs
[cr-dev-twitter]: https://twitter.com/chromiumdev
[dig-asset-links]: https://developers.google.com/digital-asset-links/v1/getting-started
[well-known]: https://tools.ietf.org/html/rfc5785
[scope]: /add-manifest/#scope
[win-uri-handlers]: https://docs.microsoft.com/en-us/windows/uwp/launch-resume/web-to-app-linking
[uap3-namespace]: https://docs.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-uap3-extension-manual#examples
[so-gira]: https://stackoverflow.com/search?q=getinstalledrelatedapps
[so-ask-question]: https://stackoverflow.com/questions/tagged/progressive-web-apps
[so-tagged-pwa]: https://stackoverflow.com/questions/tagged/progressive-web-apps

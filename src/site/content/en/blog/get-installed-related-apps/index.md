---
title: "Is your native app installed? getInstalledRelatedApps() will tell you!"
subhead: "The `getInstalledRelatedApps()` method allows your web app to check whether your native app is installed on a user's device, and vice versa."
authors:
  - petelepage
description: As the capability gap between web and native gets smaller, it gets easier to offer the same experience for both web and native users. This may lead to cases where users have both web and native versions of the same app installed on the same device. Apps should be able to detect this situation. The getInstalledRelatedApps() API is a new web platform API that allows your web app to check to see if your native app is installed on the users device, and vice versa.
date: 2018-12-20
updated: 2019-12-18
tags:
  - post
  - capabilities
  - fugu
hero: hero.jpg
alt: mobile device with app panel open
---

{% Aside %}
  This API is part of the [capabilities project](https://developers.google.com/web/updates/capabilities).
{% endAside %}

## What is the getInstalledRelatedApps() API? {: #what }

<figure class="w-figure w-figure--inline-right">
  <img src="getinstalled-cropped.jpg" class="w-screenshot" width="550">
  <figcaption class="w-figcaption">
    A web app using <code>getInstalledRelatedApps()</code> to determine if its
    related native app is already installed.
  </figcaption>
</figure>

As the capability gap between web and native gets smaller, it gets easier to
offer the same experience for both web and native users. This may lead to cases
where users have both web and native versions of the same app installed on the
same device. Apps should be able to detect this situation.

The [`getInstalledRelatedApps()`][spec] method allows your web app to check if
your native app is installed on a user's device, and vice versa. With
`getInstalledRelatedApps()`, you can disable some functionality of one app if it
should be provided by the other app instead.

If `getInstalledRelatedApps()` looks familiar, it is. The Chrome team originally
announced this feature in April 2017, when it first went through its first
origin trial. After the origin trial ended, they took stock of the feedback and
iterated on the design.

<div class="w-clearfix"></div>

## Suggested use cases {: #use-cases }

* Checking for the native version of an app and switching to it
* Disabling notifications in the web app when the native app is installed
* Not prompting users to install the web app if the native app is installed

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                         | Status                       |
| -------------------------------------------- | ---------------------------- |
| 1. Create explainer                          | [Complete][explainer]        |
| 2. Create initial draft of specification     | [Complete][spec]             |
| 3. Gather feedback and iterate on design     | Complete                     |
| 4. Origin trial                              | Complete                     |
| 5. **Launch**                                | Chrome 80                    |

</div>

## See it in action

1. Using Chrome 79 or later on Android, open the [`getInstalledRelatedApps()` demo][demo].
2. Install the demo app from the Play store and refresh the [demo][demo] page.
   You should now see the app listed.

## How to use getInstalledRelatedApps() {: #use }

To use `getInstalledRelatedApps()`, you must first create a relationship
between between the web and native versions of your app. This relationship
prevents other apps from using the API to detect if your app is installed and
prevents sites from collecting information about the apps you have installed
on your device.

### Define the relationship to your native app {: #relationship-web }

In your [web app manifest](/add-manifest), add a `related_applications`
property. The `related_applications` property is an array containing an object
for each app that you want to detect. Each app object includes:

* The platform on which the app is hosted
* The unique identifier for your app on that platform
* The URL where your app is hosted (optional)

For example:

```json
{
  …
  "related_applications": [{
    "platform": "play",
    "id": "<package-name>",
    "url": "https://example.com",
  }],
  …
}
```

The `url` property is optional, and the API works fine without it. On Android,
the `platform` value must be `play`. On other devices, the `platform` value will be different.

### Define the relationship to your web app {: #relationship-native }

Each platform has its own method of verifying a relationship. On Android, the
[Digital Asset Links system](https://developers.google.com/digital-asset-links/v1/getting-started)
defines the association between a website and an application. On other
platforms, the way you define the relationship will differ slightly.

In `AndroidManifest.xml`, add an asset statement that links back to your web
app:

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

### Test for the presence of your native app {: #test-native }

Once you've updated your native app and added the appropriate fields to the
web app manifest, add code to check for the presence of your native
app to your web app. Calling `navigator.getInstalledRelatedApps()` returns a
promise that resolves with an array of your apps that are installed on the
user's device.

```js
navigator.getInstalledRelatedApps()
.then((relatedApps) => {
  relatedApps.forEach((app) => {
    console.log(app.id, app.platform, app.url);
  });
});
```

{% Aside %}
Like most other powerful web APIs, the `getInstalledRelatedApps()` API is
only available when served over **HTTPS**.
{% endAside %}

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
* Send a Tweet to [@ChromiumDev][cr-dev-twitter] with the `#getInstalledRelatedApps`
  hashtag and let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer for `getInstalledRelatedApps()` API][explainer]
* [`getInstalledRelatedApps()` API demo][demo] |
  [`getInstalledRelatedApps()` API demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* [Request an origin trial token]({{origin_trial.url}})
* Blink Component: [`Mobile>WebAPKs`](https://chromestatus.com/features#component%3A%20Mobile%3EWebAPKs)

[spec]: https://github.com/WICG/get-installed-related-apps
[demo]: https://get-installed-apps.glitch.me
[demo-source]: https://glitch.com/edit/#!/get-installed-apps
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=895854
[cr-status]: https://www.chromestatus.com/features/5695378309513216
[explainer]: https://github.com/WICG/get-installed-related-apps/blob/master/EXPLAINER.md
[wicg-discourse]: https://discourse.wicg.io/t/proposal-get-installed-related-apps-api/1602
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Mobile%3EWebAPKs
[cr-dev-twitter]: https://twitter.com/chromiumdev

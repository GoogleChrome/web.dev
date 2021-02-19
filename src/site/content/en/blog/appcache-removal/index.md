---
title: Preparing for AppCache removal
subhead: Chrome 85 removes support for AppCache by default. Most developers should migrate off AppCache now, and not wait any longer.
authors:
  - jeffposnick
description: Details of Chrome's and other browsers' plans to remove AppCache.
date: 2020-05-18
updated: 2021-02-01
scheduled: true
tags:
  - appcache
  - blog
  - chrome84
  - deprecation
  - origin-trial
  - removal
  - service-worker
hero: image/admin/YDs2H4gLPhIwPMjPtc8o.jpg
alt: An old-fashioned storage container.
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/1776670052997660673
---

Following up on [previous announcements](https://blog.chromium.org/2020/01/appcache-scope-restricted.html), support for [AppCache](https://developer.mozilla.org/docs/Web/HTML/Using_the_application_cache) will be removed from Chrome and other Chromium-based browsers. We encourage developers to migrate off of AppCache now, rather than waiting any longer.

[Service workers](https://developers.google.com/web/fundamentals/primers/service-workers),
which are widely supported in current browsers, offer an alternative to providing the offline
experience that AppCache had offered. See [Migration strategies](#migration-strategies).

## Timeline

[Recent changes](https://blog.chromium.org/2020/03/chrome-and-chrome-os-release-updates.html) to the Chrome release schedule means that the timing of some of these steps may vary. We will attempt to keep this timeline up-to-date, but at this point, please migrate off of AppCache as soon as possible, instead of waiting for specific milestones.

A "deprecated" feature still exists, but logs warning messages discouraging use. A "removed" feature no longer exists in the browser.

<div class="w-table-wrapper">
  <table>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/UKF8cK0EwMI/m/NLhsIrs-AQAJ">Deprecation in non-secure contexts</a>
    </td>
    <td>Chrome 50 (April 2016)
    </td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/ANnafFBhReY/m/1Xdr53KxBAAJ?pli=1">Removal from non-secure contexts</a>
    </td>
    <td>Chrome 70 (October 2018)
    </td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/0daqyD8kCQAJ">Deprecation in secure contexts</a>
    </td>
    <td>Chrome 79 (December 2019)
    </td>
    </tr>
    <tr>
    <td><a href="https://blog.chromium.org/2020/01/appcache-scope-restricted.html">AppCache scope restriction</a>
    </td>
    <td>Chrome 80 (February 2020)
    </td>
    </tr>
    <tr>
    <td>"Reverse" origin trial begins
    </td>
    <td>Chrome 84 (<a href="https://chromiumdash.appspot.com/schedule">estimated July 2020</a>)
    </td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/AvxoE6JpBgAJ">Removal from secure contexts</a>, except for those opted-in to the origin trial
    </td>
    <td>Chrome 85 (<a href="https://chromiumdash.appspot.com/schedule">estimated August 2020</a>)
    </td>
    </tr>
    <tr>
    <td>Complete removal from secure contexts for everyone, with completion of origin trial
    </td>
    <td>Chrome 93 (<a href="https://chromiumdash.appspot.com/schedule">estimated October 2021</a>)
    </td>
    </tr>
  </table>
</div>

{% Aside %}
This timeline applies to Chrome on **all platforms other than iOS**. There is also an adjusted timeline for AppCache used within an Android [WebView](https://developer.android.com/reference/android/webkit/WebView). For more info, see [The cross-platform story](#the-cross-platform-story) later in this post.
{% endAside %}

## Origin trial

The timeline lists two upcoming milestones for removal. Beginning with Chrome 85, AppCache will no longer be available in Chrome by default. Developers who require additional time to migrate off of AppCache can [sign up](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673) for a "reverse" [origin trial](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) to extend the availability of AppCache for their web apps. The origin trial will start in Chrome 84 (in advance of the default removal in Chrome 85), and will be active through Chrome 89. Starting with Chrome 90, AppCache will be fully removed for everyone, even those who had signed up for the origin trial.

{% Aside %}
Why are we calling this a "reverse" origin trial? Normally, an origin trial allows developers to opt-in to early access to new functionality before it has shipped by default in Chrome. In this case, we're allowing developers to opt-in to using legacy technology even after it's been removed from Chrome, but only temporarily.
{% endAside %}

To participate in the "reverse" origin trial:

<ol>
<li>
<a href="https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673">Request a token</a> for your origin.
</li>
<li>
Add the token to your HTML pages. There are <a href="https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin">two ways</a> to do that:
<ul>
<li>
Add an <code>origin-trial</code> <code>&lt;meta&gt;</code> tag to the head of each page. For example: <code>&lt;meta http-equiv="origin-trial" content="TOKEN_GOES_HERE"&gt;</code>
</li>
<li>
Alternatively, configure your server to return responses containing the <code>Origin-Trial</code> HTTP header. The resulting response header should look something like: <code>Origin-Trial: TOKEN_GOES_HERE</code>
</li>
</ul>
</li>
<li>
Add the same token to your AppCache manifests. Do this via a new field in your manifest, with the format:

```text
ORIGIN-TRIAL:
TOKEN_GOES_HERE
```

(There needs to be a new line between `ORIGIN-TRIAL` and your token.)
</li>
</ol>

{% Aside %}
The token for a manifest **must** be in an `ORIGIN-TRIAL` field of the manifest itself. Unlike an HTML page's token, it can't be provided via an HTTP header.
{% endAside %}

You can see a sample project embedded below that demonstrates adding the correct origin trial tokens into both the `index.html` and `manifest.appcache` files.

{% Glitch {
  id: 'appcache-reverse-ot',
  path: 'manfiest.appcache',
  height: 480
} %}

### Why are tokens needed in multiple places?

The **same origin trial token** needs to be associated with:

- **All of your HTML pages** that use AppCache.
- **All of your AppCache manifests** via the `ORIGIN-TRIAL` manifest field.

If you've participated in origin trials in the past, you might have added the token just to your HTML pages. The AppCache "reverse" origin trial is special in that you need to associate a token with each of your AppCache manifests as well.

Adding the origin trial token to your HTML pages enables the `window.applicationCache` interface from within your web apps. Pages that are not associated with a token won't be able to use `window.applicationCache` methods and events. Pages without a token also won't be able to load resources from the AppCache. Starting with Chrome 85, they will behave as if AppCache did not exist.

Adding the origin trial token to your AppCache manifests indicates that each manifest is still valid. Starting with Chrome 85, any manifests that does not have an `ORIGIN-TRIAL` field will be treated as malformed, and the rules within the manifest will be ignored.

### Origin trial deployment timing and logistics

While the "reverse" origin trial officially starts with Chrome 84, you can [sign up](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673) for the origin trial today and add the tokens to your HTML and AppCache manifests. As your web app's audience gradually upgrades to Chrome 84, any tokens that you've already added will go into effect.

Once you've added a token to your AppCache manifest, visit `chrome://appcache-internals` to confirm that your local instance of Chrome (version 84 or later) has properly associated the origin trial token with your manifest's cached entries. If your origin trial is recognized, you should see a field with `Token Expires: Tue Apr 06 2021...` on that page, associated with your manifest:

<figure class="w-figure">
  {% Img src="image/admin/Xid94kdPT5yGbQzBL4at.jpg", alt="chrome://appcache-internals interface showing a recognized token.", width="550", height="203", class="w-screenshot" %}
</figure>

## Testing prior to removal

We strongly encourage you to migrate off of AppCache as soon as is feasible. If you want to test removal of AppCache on your web apps, use the `chrome://flags/#app-cache` [flag](https://www.chromium.org/developers/how-tos/run-chromium-with-flags) to simulate its removal. This flag is available starting with Chrome 84.

## Migration strategies {: #migration-strategies }

Service workers, which are [widely supported in current browsers](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility), offer an alternative to the offline experience provided by AppCache.

We've provided a [polyfill](https://github.com/GoogleChromeLabs/sw-appcache-behavior) that uses a service worker to replicate some of the functionality of AppCache, though it does not replicate the entire AppCache interface. In particular, it does not provide a replacement for the `window.applicationCache` interface or the related AppCache events.

For more complex cases, libraries like [Workbox](https://developers.google.com/web/tools/workbox/) provide an easy way to create a modern service worker for your web app.

### Service workers and AppCache are mutually exclusive

While working on your migration strategy, please keep in mind that Chrome will disable AppCache functionality on any page that's loaded under the [control](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#scope_and_control) of a service worker. In other words, as soon as you deploy a service worker that controls a given page, you're no longer able to use AppCache on that page.

Because of this, we recommend that you do not attempt to migrate to service workers piece-by-piece. It would be a mistake to deploy a service worker that only contains some of your caching logic. You cannot fall back on AppCache to "fill in the gaps."

Similarly, if you deploy a service worker prior to AppCache removal, and then discover that you need to roll back to your previous AppCache implementation, you need to ensure that you [unregister](https://stackoverflow.com/a/33705250/385997) that service worker. As long as there's a registered service worker in scope for a given page, AppCache will not be used.

## The cross-platform story

We encourage you to follow up with a specific browser vendor if you'd like more information about their plans for AppCache removal.

### Firefox on all platforms

Firefox [deprecated](https://www.fxsitecompat.dev/en-CA/docs/2015/application-cache-api-has-been-deprecated/) AppCache in release 44 (September 2015), and has [removed](https://www.fxsitecompat.dev/en-CA/docs/2019/application-cache-storage-has-been-removed-in-nightly-and-early-beta/) support for it in its Beta and Nightly builds as of September 2019.

### Safari on iOS and macOS

Safari [deprecated](https://bugs.webkit.org/show_bug.cgi?id=181764) AppCache in early 2018.

### Chrome on iOS

Chrome for iOS is a special case, as it uses a different browser engine than Chrome on other platforms: the [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview). Service workers are not currently supported in iOS apps using WKWebView, and Chrome's AppCache removal announcement does not cover the [availability of AppCache on Chrome for iOS](https://webkit.org/status/#specification-application-cache). Please keep this in mind if you know that your web app has a significant Chrome for iOS audience.

### Android WebViews

Some developers of Android applications use Chrome [WebView](https://developer.android.com/reference/android/webkit/WebView) to display web content, and might also use AppCache. However, it's not possible to enable an origin trial for a WebView. In light of that, Chrome WebView will support AppCache without an origin trial until the final removal takes place, expected in Chrome 90.

## Learn more

Here are some resources for developers migrating from AppCache to service workers.

### Articles

- [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
- [The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)
- [Progressive Web Apps Training](https://developers.google.com/web/ilt/pwa)
- [Network Reliability](/reliable/)

### Tools

- [AppCache Polyfill](https://github.com/GoogleChromeLabs/sw-appcache-behavior)
- [Workbox](https://developers.google.com/web/tools/workbox/)
- [PWA Builder](https://www.pwabuilder.com/)

## Getting help

If you run into an issue using a specific tool, open an issue in its GitHub repository.

You can ask a general question about migrating off of AppCache on [Stack Overflow](https://stackoverflow.com/), using the tag <code>[html5-appcache](https://stackoverflow.com/questions/tagged/html5-appcache)</code>.

If you encounter a bug related to Chrome's AppCache removal, please [report it](https://crbug.com/new) using the Chromium issue tracker.

_Hero image based on [Smithsonian Institution Archives, Acc. 11-007, Box 020, Image No. MNH-4477](https://www.si.edu/object/usnm-storage-drawer:siris_arc_391797)._

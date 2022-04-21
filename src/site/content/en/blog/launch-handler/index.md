---
layout: post
title: Control how your app is launched
subhead: >
  Launch handler lets you control how your app is launched, for example, whether it uses an existing or a new
  window and whether the chosen window is navigated to the launch URL. This also enqueues a
  `LaunchParams` object in the launched page's `window.launchQueue`, similar to the File
  Handling API.
authors:
  - thomassteiner
date: 2021-12-14
updated: 2022-03-03
description: >
  Launch handler lets you control how your app is launched, for example, whether it uses an existing
  window and whether the chosen window is navigated to the launch URL.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/xw3fQotYBLeA8AUZAh5O.jpg
alt: Cape Caneveral rocket launch.
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/2978005253598740481
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - progressive-web-apps
  - capabilities
---

{% Aside %} The Launch Handler API is part of the [capabilities project](/fugu-status/) and is
currently in development. This post will be updated as the implementation progresses. {% endAside %}

## What is the Launch Handler API? {: #what }

There are many ways to launch a Progressive Web App. Probably the most common is via the icon on the
home screen or the app drawer of the device. But when you think about it, there are many other ways
a launch can happen:

- A share action when the app is a
  [share target](/web-share-target/).
- A user click in the file explorer opening the PWA, which
  acts as a [file handler](/file-handling/).
- A registered [protocol handler](/protocol-handling/) that the PWA may launch as the
  result of a matching protocol.
- A click on a
  [push notification](/push-notifications-overview/) or an [app icon shortcut](/app-shortcuts/).

There are even more ways, but you get the idea. Given the manifold possibilities for launching PWAs,
what has been missing is a way to let apps customize their launch behavior across all types of app
launch triggers. The `launch_handler` manifest member together with the `window.launchQueue`
interface enables PWAs to do just that.

### Suggested use cases for the Launch Handler API {: #use-cases }

Examples of sites that may use this API include:

- Apps that prefer to only have a single instance of themselves open at any time, with new
  navigations focusing the existing instance. Examples include apps like music players or games,
  where it generally makes sense to only have one instance of the app open at any time.
- Apps that enable multi-document management, but within their own single instance, for example, an
  HTML-implemented tab strip, floating sub-windows, or apps using
  [tabbed application mode](/tabbed-application-mode/).

## Current status {: #status }

<div class="table-wrapper scrollbar">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. **Origin trial**                      | [**Started**][ot]        |
| 5. Launch                                | Not started              |

</div>

## How to use the Launch Handler API {: #use }

### Enabling via about://flags

To experiment with the Launch Handler API locally, without an origin trial token, enable the
`#enable-desktop-pwas-launch-handler` flag in `about://flags`.

### Enabling support during the origin trial phase

Starting in Chromium&nbsp;98, the Launch Handler API will be available as an origin trial in
Chromium. The origin trial is expected to end in Chromium&nbsp;102 (June&nbsp;15, 2022).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Feature detection

To check if the Launch Handler API is supported, use:

```javascript
if ('launchQueue' in window && 'targetURL' in LaunchParams.prototype) {
  // The Launch Handler API is supported.
}
```

### The `launch_handler` manifest member

To declaratively specify the launch behavior of your app, add the `launch_handler` manifest member
to your manifest. It has one subfield, `route_to`. It lets
you control whether a new or an existing client should be launched, and how and if this
client should be navigated. The Web App Manifest excerpt below shows a file with
exemplary values that would always route all launches to a new client.

```json
{
  "launch_handler": {
    "route_to": "new-client"
  }
}
```

If unspecified, `launch_handler` defaults to
`{"route_to": "auto"}`. The allowed values for the sub-fields
are as follows:

- `route_to`:
  - `auto`: The behavior is up to the user agent to decide what works best for the platform. For
    example, mobile devices only support single clients and would use `existing-client-navigate`,
    while desktop devices support multiple windows and would use `new-client` to avoid data loss.
  - `new-client`: A new browsing context is created in a web app window to load the launch's target
    URL.
  - `existing-client-navigate`: The most recently interacted with browsing context in a web app
    window is navigated to the launch's target URL.
  - `existing-client-retain`: The most recently interacted with browsing context in a web app
    window is chosen to handle the launch. A new `LaunchParams` with its `targetURL` set to the
    launch URL will be enqueued in the document's `window.launchQueue`.

The property `route_to` also accepts a list (array) of values, where the first
valid value will be used. This is to allow new values to be added to the spec without breaking
backwards compatibility with existing implementations.

For example, if the hypothetical value `"matching-url-client"` were added, sites would specify
`"route_to": ["matching-url-client", "existing-client-navigate"]` to continue controlling the
behavior of older browsers that did not support `"matching-url-client"`.

### The `window.launchQueue` interface

If the app has declared that it wants to handle launches in an existing client (by specifying
`"route_to": "existing-client-retain"`), it can imperatively do something with incoming launch URLs.
This is where the `launchQueue` comes into play. To access launch target URLs, a site needs to
specify a consumer for the `window.launchQueue` object, which is then passed the target URL via the
`launchParams.targetURL` field. Launches are queued until they are handled by the specified
consumer, which is invoked exactly once for each launch. In this manner, every launch is handled,
regardless of when the consumer was specified. The code snippet below shows a fictive audio player
PWA that extracts a song ID from a target URL that it is potentially passed on launch.

```js
launchQueue.setConsumer((launchParams) => {
  const songID = extractSongId(launchParams.targetURL);
  if (songID) {
    playSong(songID);
  }
});
```

## Demo

You can see a demo of the Launch Handler API in action in the [PWA Launch Handler Demo][demo]. Be
sure to check out the [source code][demo-source] of the application to see how it uses the Launch
Handler API.

<!--lint disable no-literal-urls -->

1. Install the _Musicr 2.0_ app on a ChromeOS device.
1. Send yourself a link in a chat application of the form
   <code>https://launch-handler.glitch.me?track=<strong>https://example.com/music.mp3</strong></code>.
   (You can customize
   <code><strong>https://example.com/music.mp3</strong></code> for any URL pointing to an audio file, for example,
   <a href="https://launch-handler.glitch.me?track=https://cdn.glitch.me/3e952c9c-4d6d-4de4-9873-23cf976b422e%2Ffile_example_MP3_700KB.mp3?v=1638795977190"><code>https://launch-handler.glitch.me?track=https://cdn.glitch.me/3e952c9c-4d6d-4de4-9873-23cf976b422e%2Ffile_example_MP3_700KB.mp3?v=1638795977190</code></a>).
1. Click the link in your chat app and notice how _Musicr 2.0_ opens and plays the track.
1. Click the link in your chat app again and notice that you will not get a second instance of _Musicr 2.0_.
<!--lint enable no-literal-urls -->

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/nFgE69N5VTYBDon1DGmB.png", alt="Musicr 2.0 web application launched and playing music it handled from the launch params.", width="800", height="235" %}

## Security and permissions

The Chromium team designed and implemented the Launch Handler API using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics.

## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the Launch Handler API.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>AppManifest` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Launch Handler API? Your public support helps the Chromium team
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#LaunchHandler`](https://twitter.com/search?q=%23LaunchHandler&src=recent_search_click&f=live) and
let us know where and how you are using it.

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [Launch Handler API Demo][demo] | [Launch Handler API Demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>AppManifest`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/683)
- [Intent to Prototype](https://groups.google.com/a/chromium.org/g/blink-dev/c/8tNe2jrJ78A)

## Acknowledgements

Hero image by [SpaceX](https://unsplash.com/@spacex) on
[Unsplash](https://unsplash.com/photos/-p-KCm6xB9I).

[issues]: https://github.com/WICG/sw-launch/issues
[demo]: https://launch-handler.glitch.me/
[demo-source]: https://glitch.com/edit/#!/launch-handler
[explainer]: https://github.com/WICG/sw-launch/blob/main/launch_handler.md
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=1231886
[cr-status]: https://www.chromestatus.com/feature/5722383233056768
[blink-component]: https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EAppManifest
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot]: https://developer.chrome.com/origintrials/#/view_trial/2978005253598740481

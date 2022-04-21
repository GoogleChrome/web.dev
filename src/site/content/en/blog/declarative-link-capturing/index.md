---
layout: post
title: Choose how in-scope links open your PWA with Declarative Link Capturing
subhead: |
  Declarative Link Capturing is a proposal for a web app manifest property called
  `"capture_links"` that lets developers determine declaratively what should happen when the browser
  navigates to a URL that is within the application's navigation scope, from a context
  outside of the navigation scope.
authors:
  - thomassteiner
date: 2021-05-19
updated: 2021-12-22
description: |
  Declarative Link Capturing is a proposal for a web app manifest property called
  "capture_links" that lets developers determine declaratively what should happen when the browser
  is asked to navigate to a URL that is within the application's navigation scope, from a context
  outside of the navigation scope.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/ynRFiUuv3sccX4qUAAPw.jpg
alt: A hand and several hanging chains, symbolizing links.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - progressive-web-apps
  - web-app-manifest
  - capabilities
---

{% Aside 'caution' %} Declarative Link Capturing was part of the
[capabilities project](/fugu-status/). The engineering team has decided that Declarative Link
Capturing will _not_ launch with its current design. Instead, the feature has been redesigned as
described in [Control how your app is launched](/launch-handler/). If your app implements the
Declarative Link Capturing API, you should
[transition to the replacement Launch Handler API](#migration). {% endAside %}

## What is Declarative Link Capturing? {: #what }

Clicking links on the web can sometimes be a pleasant surprise. For example, clicking a web page
link to YouTube on a mobile device opens the YouTube iOS or Android app, if it is installed. But
when you install the [YouTube PWA](https://www.youtube.com/) on a desktop computer and click a link,
it opens in a browser tab.

But it gets more complex. What if the link appears not in a website, but in a chat message that you
receive in one of Google's chat apps? On desktop operating systems, which have the notion of separate
app windows, if the app is open already, should a new window or tab be created for each link click? When you think about it, there are many ways links and navigations can be
captured, including, but not limited to, the following:

- Clicked links from other web pages.
- URL launches from a platform-specific app in the operating system.
- Navigations originating from the [App Shortcuts API](/app-shortcuts/).
- Links that go through [URL protocol handlers](/url-protocol-handler/).
- Navigations caused by [file handlers](/file-handling/).
- Navigations caused by the [Share Target API](/web-share-target/).
- …and others.

Declarative Link Capturing is a proposal for a web app manifest property called `"capture_links"`
that lets developers determine declaratively what should happen when the browser is asked to
navigate to a URL that is within the application's navigation scope, from a context outside of the
navigation scope. This proposal does not apply if the user is already within the navigation scope
(for instance, if the user has a browser tab open that is within scope, and clicks an internal
link).

{% Aside 'key-term' %} The [navigation scope](/add-manifest/#scope) of a web app
manifest is the `"scope"` item of a processed manifest. The navigation scope restricts the set of
URLs to which an application context can be navigated while the manifest is applied. If the
`"scope"` member is not present in the manifest, it defaults to the parent path of the `"start_url"`
member. {% endAside %}

Some special conditions like middle-clicking a link (or right-clicking and then "open in new tab")
would typically not trigger the link capturing behavior. Whether a link is `target=_self` or
`target=_blank` does not matter, so that links clicked in a browser window (or window of a different
PWA) would be opened in the PWA even if they would normally cause a navigation within the same tab.

## Suggested use cases

Examples of sites that may use this API include:

- PWAs that want to open a window, rather than a browser tab, when the user clicks on a link to
  them. In a desktop environment, it often makes sense to have multiple application windows open at
  a time.
- Single-window PWAs where the developer prefers to only have a single instance of the app open at
  any time, with new navigations focusing the existing instance. Sub-use cases include:
  - Apps for which it make sense to have only one instance running (e.g., a music player, a game).
  - Apps that include multi-document management within a single instance (e.g., an HTML-implemented
    tab strip).

## Current status {: #status }

<div>

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | [In Progress][spec]      |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Complete                 |
| 5. Launch                                | Not started              |

</div>

### Enabling via about://flags

To experiment with Declarative Link Capturing locally, without an origin trial token, enable the
`#enable-desktop-pwas-link-capturing ` flag in `about://flags`.

## How to use Declarative Link Capturing? {: #use }

Developers can declaratively determine how links should be captured by leveraging the additional web
app manifest field `"capture_links"`. It takes a string or a an array of strings as its value. If an
array of strings is given, the user agent chooses the first supported item in the list, defaulting
to `"none"`. The following values are supported:

- `"none"` (the default): No link capturing; links clicked leading to this PWA scope navigate as
  normal without opening a PWA window.
- `"new-client"`: Each clicked link opens a new PWA window at that URL.
- `"existing-client-navigate"`: The clicked link opens in an existing PWA window, if one is
  available, or in a new window if it is not. If more than one PWA window exists, the browser may
  choose one arbitrarily. This behaves like `"new-client"` if no window is currently open. 🚨
  Careful! This option potentially leads to data loss, as pages can be arbitrarily navigated away
  from. Sites should be aware that they are opting into such behavior by choosing this option. This
  option works best for "read-only" sites that do not hold user data in memory, such as music
  players. If the page being navigated away from has a
  [`beforeunload` event](https://developer.mozilla.org/docs/Web/API/WindowEventHandlers/onbeforeunload),
  the user would see the prompt before the navigation completes.

{% Aside %} There is discussion about adding options that do not open a window at all, but instead
fire a `launch` event in a chosen foreground window or the service worker. See the
[`launch` event explainer](https://github.com/WICG/sw-launch/blob/main/explainer.md) for details,
and, more specifically, the sections on
[`existing-client-event`](https://github.com/WICG/sw-launch/blob/main/declarative_link_capturing.md#:~:text=completes-,existing-client-event,-when)
and
[`service-worker`](https://github.com/WICG/sw-launch/blob/main/declarative_link_capturing.md#:~:text=future-,serviceworker,-doesn).
{% endAside%}

## Demo

The demo for Declarative Link Capturing actually consists of two demos that interact together:

1. [https://continuous-harvest-tomato.glitch.me/](https://continuous-harvest-tomato.glitch.me/)
1. [https://hill-glitter-tree.glitch.me/](https://hill-glitter-tree.glitch.me/)

The screencast below shows how the two interact. They show two different behaviors, `"new-client"`
and `"existing-client-navigate"`. Be sure to test the apps in different states, running in a tab or
as an installed PWA, to see the difference in behavior.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/pj3ehpntEg50WcnA2khM.webm", autoplay=true, muted=true, playsinline=true, loop=true %}

## Security and permissions

The Chromium team designed and implemented Declarative Link Capturing using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics. This API allows sites new additional control options. First,
being able to automatically open installed apps in a window. This uses existing UI but makes it
possible for the site to automatically trigger it. Second, the capability to focus an existing
window on its own domain and fire an event containing the clicked URL. This is intended to allow the
site to navigate an existing window to a new page, overriding the default HTML navigation flow.

## Migrate to Launch Handler API {: #migration }

The Declarative Link Capturing API
[origin trial](https://developer.chrome.com/origintrials/#/view_trial/4285175045443026945) is set to
[expire on March&nbsp;30, 2022](https://groups.google.com/a/chromium.org/g/blink-dev/c/2c4bul4V3GQ/m/Anluh1txBQAJ)
for Chromium&nbsp;97 and below. It will be replaced by a set of
[new features and APIs](https://docs.google.com/document/d/1w9qHqVJmZfO07kbiRMd9lDQMW15DeK5o-p-rZyL7twk/edit)
in Chromium&nbsp;98 and above, which includes user-enabled link capturing and
[Launch Handler API](https://github.com/WICG/sw-launch/blob/main/launch_handler.md).

### Link Capturing

In Chromium&nbsp;98, automatic link capturing is now a user opt-in behavior rather than granted at
install time to a web app. To enable link capturing, a user needs to launch an installed app from
the browser using **Open with** and choose **Remember my choice**.

{% Img src="image/ttTommHYbJXsEL29zNB1wXBvH4z1/rbFk5LtzHMlN3zRVpekf.png", alt="Example of an installed app's 'Open with' setting with the 'Remember my choice' option enabled.", width="385", height="277" %}

Alternatively, users can switch link capturing on or off for a specific web app in the app
management settings page.

{% Img src="image/ttTommHYbJXsEL29zNB1wXBvH4z1/WJ2KPqFUjqJABNYQUEN9.png", alt="Example of an installed app's settings page.", width="800", height="449" %}

Link capturing is a ChromeOS-only feature for now; support for Windows, macOS, and Linux is
in progress.

### Launch Handler API

The control of an incoming navigation is migrated to Launch Handler API, which allows web apps to
decide how a web app launches in various situations such as link capturing, share target or file
handling, etc. To migrate from the Declarative Link Capturing API to the Launch Handler API:

1.  Register your site for the
    [Launch Handler origin trial](https://developer.chrome.com/origintrials/#/view_trial/2978005253598740481)
    and place the origin trial key into your web app.
1.  Add a `"launch_handler"` entry to your site's manifest.

    - To use `"capture_links": "new-client"`,
      add:`"launch_handler": { "route_to": "new-client" }`.
    - To use `"capture_links": "existing-client-navigate"`, add:
      `"launch_handler": { "route_to": "existing-client-navigate" }`.
    - To use `"capture_links": "existing-client-event"` (which was never implemented
      in the Declarative Link Capturing origin trial), add:
      `"launch_handler": { "route_to": "existing-client-retain" }`.
      With this option, pages in your app scope will no longer navigate automatically when a link
      navigation is captured. You must handle the `LaunchParams` in JavaScript by calling
      `window.launchQueue.setConsumer()` to enable navigation.

The `capture_links` field and Declarative Link Capturing origin trial registration are good until
March&nbsp;30, 2022. This will ensure users on Chromium&nbsp;97 and below can still launch the
web app at a captured link.

For more details, check out [Control how your app is launched](/launch-handler/).

## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with Declarative Link Capturing.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `UI>Browser>WebAppInstalls` in the **Components**
box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use Declarative Link Capturing? Your public support helps the Chromium team
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#DeclarativeLinkCapturing`](https://twitter.com/search?q=%23DeclarativeLinkCapturing&src=recent_search_click&f=live)
and let us know where and how you are using it.

## Helpful links {: #helpful }

- [Spec draft][spec]
- [Explainer][explainer]
- [Chromium bug](https://crbug.com/1163398)
- [Intent to Prototype](https://groups.google.com/a/chromium.org/g/blink-dev/c/2ZnA1IrSpS8/m/7wx6dENTAwAJ)
- [Intent to Experiment](https://groups.google.com/a/chromium.org/g/blink-dev/c/q6ivDcvAJwQ/m/XTlva-lGBQAJ)
- [ChromeStatus entry](https://chromestatus.com/feature/5734953453092864)

## Acknowledgements

Declarative Link Capturing was specified by [Matt Giuca](https://twitter.com/mgiuca) with input from
Alan Cutter and [Dominick Ng](https://twitter.com/dominickng). The API was implemented by Alan
Cutter. This article was reviewed by [Joe Medley](https://github.com/jpmedley), Matt Giuca, Alan
Cutter, and [Shunya Shishido](https://github.com/sisidovski). Hero image by
[Zulmaury Saavedra](https://unsplash.com/@zulmaury) on
[Unsplash](https://unsplash.com/photos/zh0J32MrJfA).

[explainer]: https://github.com/WICG/sw-launch/blob/main/declarative_link_capturing.md
[issues]: https://github.com/WICG/sw-launch/issues/
[spec]: https://github.com/w3c/manifest/issues/764
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[cr-dev-twitter]: https://twitter.com/ChromiumDev

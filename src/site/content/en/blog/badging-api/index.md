---
title: Badging for app icons
subhead: The App Badging API allows installed web apps to set an application-wide badge on the app icon.
authors:
  - petelepage
description: The App Badging API allows installed web apps to set an application-wide badge, shown in an operating-system-specific place associated with the application, such as the shelf or home screen. Badging makes it easy to subtly notify the user that there is some new activity that might require their attention, or it can be used to indicate a small amount of information, such as an unread count.
date: 2018-12-11
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - progressive-web-apps
  - badging
  - notifications
hero: image/admin/AFvb0uBtN7ZX9qToptEo.jpg
alt: Neon sign with heart and zero
feedback:
  - api
---

## What is the App Badging API? {: #what }

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t7XqI06whZr4oJe0yawc.jpg", alt="Example of Twitter with eight notifications and another app showing a flag type badge.", width="600", height="189" %}
  <figcaption class="w-figcaption">
    Example of Twitter with eight notifications and another app showing a flag
    type badge.
  </figcaption>
</figure>

The App Badging API allows installed web apps to set an application-wide badge,
shown in an operating-system-specific place associated with the application
(such as the shelf or home screen).

Badging makes it easy to subtly notify the user that there is new activity
that might require their attention, or to indicate a small amount of
information, such as an unread count.

Badges tend to be more user-friendly than notifications, and can be updated
with a much higher frequency, since they don't interrupt the user. And,
because they don't interrupt the user, they don't need the user's permission.

### Possible use cases {: #use-cases }

Examples of sites that may use this API include:

* Chat, email, and social apps, to signal that new messages have arrived, or to
  show the number of unread items.
* Productivity apps, to signal that a long-running background task (such as
  rendering an image or video) has completed.
* Games, to signal that a player action is required (e.g., in Chess, when it
  is the player's turn).

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [Complete][spec]             |
| 3. Gather feedback & iterate on design     | Complete                     |
| 4. Origin trial                            | Complete                     |
| **5. Launch**                              | **Complete**                 |

</div>

The App Badging API works on Windows, and macOS, in Chrome 81 or later.
It has also been confirmed to work on Edge 84 or later.
Support for Chrome OS is in development and will be available in a future
release of Chrome. On Android, the Badging API is not supported. Instead,
Android automatically shows a badge on app icon for the installed web app
when there is an unread notification, just as for Android apps.

## Try it

1. Using Chrome 81 or later on Windows or Mac, open the
   [App Badging API demo][demo].
2. When prompted, click **Install** to install the app, or use the Chrome
   menu to install it.
3. Open it as an installed PWA. Note, it must be running as an installed PWA
   (in your task bar or dock).
4. Click the **Set** or **Clear** button to set or clear the badge from the app
   icon. You can also provide a number for the *Badge value*.

## How to use the App Badging API {: #use }

To use the App Badging API, your web app needs to meet
[Chrome's installability criteria](/install-criteria/#criteria),
and users must add it to their home screens.

The Badge API consists of two methods on `navigator`:

* `setAppBadge(`*`number`*`)`: Sets the app's badge. If a value is provided, set the
  badge to the provided value otherwise, display a plain white dot (or other
  flag as appropriate to the platform). Setting *`number`* to `0` is the same as
  calling `clearAppBadge()`.
* `clearAppBadge()`: Removes app's badge.

Both return empty promises you can use for error handling.

The badge can either be set from the current page, or from the registered
service worker. To set or clear the badge (in either the foreground page or
the service worker), call:

```js
// Set the badge
const unreadCount = 24;
navigator.setAppBadge(unreadCount).catch((error) => {
  //Do something with the error.
});

// Clear the badge
navigator.clearAppBadge().catch((error) => {
  // Do something with the error.
});
```

In some cases, the OS may not allow the exact representation of the badge.
In such cases, the browser will attempt to provide the best representation for
that device. For example, because the Badging API isn't supported on Android,
Android only ever shows a dot instead of a numeric value.

Don't assume anything about how the user agent displays the badge.
Some user agents may take a number like "4000" and rewrite it as
"99+". If you saturate the badge yourself (for example by setting it to "99")
then the "+" won't appear. No matter the actual number, just call
`setAppBadge(unreadCount)` and let the user agent deal with
displaying it accordingly.

While the App Badging API *in Chrome* requires an installed app, you shouldn't
make calls to the Badging API dependent on the install state. Just call the
API when it exists, as other browsers may show the badge in other places.
If it works, it works. If not, it simply doesn't.

## Setting and clearing the badge in the background from a service worker

You can also set the app badge in the background using the service worker,
allowing them to be updated even when the app isn't open. Do this either
through the Push API, periodic background sync, or a combination of both.

### Periodic background sync

[Periodic background sync](/periodic-background-sync/) allows a service worker
to periodically poll the server, which could be used to get an updated status,
and call `navigator.setAppBadge()`.

However, the frequency at which the sync is called isn't perfectly reliable,
and is called the at discretion of the browser.

### Web Push API

The [Push API][push-api] allows servers to send messages to service workers,
which can run JavaScript code even when no foreground page is running. Thus,
a server push could update the badge by calling `navigator.setAppBadge()`.

However, most browsers, Chrome included, require a notification to be
displayed whenever a push message is received. This is fine for some use
cases (for example showing a notification when updating
the badge) but makes it impossible to subtly update the badge without
displaying a notification.

In addition, users must grant your site notification permission in order to
receive push messages.

### A combination of both

While not perfect, using Push API and periodic background sync together
provide a good solution. High priority information is delivered via the Push
API, showing a notification and updating the badge. And lower priority
information is delivered by updating the badge, either when the page is open,
or via periodic background sync.

### The future

The Chrome team is investigating ways to more reliably [update the app badge in
the background](https://github.com/w3c/badging/blob/master/explainer.md#background-updates),
and wants to hear from you. Let them know what works best for your
use case by commenting on the
[Notification Background Updates](https://github.com/w3c/badging/issues/28)
issue.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the App Badging API.

### Tell us about the API design

Is there something in the API that doesn't work as you expected? Or are
there missing methods or properties that you need to implement your idea?
Do you have a question or comment on the security model?

* File a spec issue on the [Badging API GitHub repo][issues], or add your
  thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at <https://new.crbug.com>. Be sure to include as much detail as
  you can, simple instructions for reproducing, and set **Components** to
  `UI>Browser>WebAppInstalls`. [Glitch](https://glitch.com) works great for
  sharing quick and easy reproductions.

### Show support for the API

Planning to use the App Badging API on your site? Your public support helps the
Chrome team to prioritize features, and shows other browser vendors how critical
it is to support them.

* Send a tweet to [@ChromiumDev](https://twitter.com/chromiumdev) using the hashtag
  [`#BadgingAPI`](https://twitter.com/search?q=%23BadgingAPI&src=typed_query&f=live)
  and let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [Badging API Demo][demo] | [Badging API Demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: `UI>Browser>WebAppInstalls`

Hero [photo](https://unsplash.com/photos/xv7-GlvBLFw) by
[Prateek Katyal](https://unsplash.com/@prateekkatyal) on
[Unsplash](https://unsplash.com/)

[spec]: https://wicg.github.io/badging/
[issues]: https://github.com/WICG/badging/issues
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=719176
[cr-status]: https://www.chromestatus.com/feature/6068482055602176
[demo]: https://badging-api.glitch.me/
[demo-source]: https://glitch.com/edit/#!/badging-api?path=demo.js
[explainer]: https://github.com/WICG/badging/blob/master/explainer.md
[push-api]: https://www.w3.org/TR/push-api/

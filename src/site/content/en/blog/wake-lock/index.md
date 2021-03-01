---
title: Stay awake with the Screen Wake Lock API
subhead: The Screen Wake Lock API provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.
authors:
  - petelepage
  - thomassteiner
description: To avoid draining the battery, most devices will quickly fall asleep when left idle. While this is fine most of the time, there are some applications that need to keep the screen awake in order to complete some work. The Screen Wake Lock API provides a way to prevent the device from dimming or locking the screen when an application needs to keep running.
date: 2018-12-18
updated: 2021-02-23
hero: image/admin/zMncl9cgWdAc8W24yav3.jpg
hero_position: center
alt: |
  Cat sleeping. Photo by Kate Stone Matheson on Unsplash.
tags:
  - blog
  - capabilities
  - wake-lock
feedback:
  - api
---

{% Aside 'success' %}
  The Screen Wake Lock API, part of Google's
  [capabilities project](https://developers.google.com/web/updates/capabilities),
  launched in Chrome 84.
{% endAside %}

## What is the Screen Wake Lock API? {: #what }

To avoid draining the battery, most devices quickly go to sleep when left
idle. While this is fine most of the time, some applications need to keep the
screen awake to complete their work. Examples include cooking apps
that show the steps of a recipe or a game
like [Ball Puzzle](https://ball-puzzle.appspot.com/), which uses the device
motion APIs for input.

The [Screen Wake Lock API][spec-ed] provides a way to prevent the device from dimming
and locking the screen. This
capability enables new experiences that, until now, required a platform-specific app.

The Screen Wake Lock API reduces the need for hacky and potentially
power-hungry workarounds. It addresses the shortcomings of an older API
that was limited to simply keeping the screen on and had a number of
security and privacy issues.

## Suggested use cases for the Screen Wake Lock API {: #use-cases }

[RioRun](https://www.theguardian.com/sport/2016/aug/06/rio-running-app-marathon-course-riorun),
a web app developed by [The Guardian](https://www.theguardian.com/),
was a perfect use case (though it's no longer available).
The app takes you on a virtual audio tour of Rio, following the route of the 2016
Olympic marathon.
Without wake locks, users' screens would turn off frequently while the tour played,
making it hard to use.

Of course, there are plenty of other use cases:

* A recipe app that keeps the screen on while you bake a cake or cook
  dinner
* A boarding pass or ticket app that keeps the screen
  on until the barcode has been scanned
* A kiosk-style app that keeps the screen on continuously
* A web-based presentation app that keeps the screen
  on during a presentation

{% Aside 'success' %}
  After implementing the Screen Wake Lock API,
  *Betty Crocker*, a major cooking site in the US,
  saw a 300% increase in purchase intent indicators for their users.
  Read more in the 🍰&nbsp;[Betty Crocker case study](/betty-crocker/).
{% endAside %}

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | N/A                          |
| 2. Create initial draft of specification   | [Complete][spec-ed]          |
| 3. Gather feedback and iterate design      | [Complete](#feedback)        |
| 4. Origin trial                            | Complete                     |
| **5. Launch**                              | **Complete**                 |

</div>

{% Aside %}
  Big thanks to the folks at Intel, specifically Mrunal Kapade, for implementing
  this API. Chrome depends on a community of committers
  working together to move the Chromium project forward. Not every Chromium
  committer is a Googler, and these contributors deserve special recognition!
{% endAside %}

## Using the Screen Wake Lock API {: #use }

### Wake lock types {: #wake-lock-types }

The Screen Wake Lock API currently provides just one type of wake lock: `screen`.

#### `screen` wake lock

A `screen` wake lock prevents the device's screen from turning
off so that the user can see the information that's displayed on screen.

{% Aside 'caution' %}
An earlier version of the specification allowed an additional `system` wake lock
that prevents the device's CPU from entering standby mode so
that your app can continue running.
We have decided to not proceed with this type for the moment.
{% endAside %}

### Feature detection

Browser support for the Screen Wake Lock API can be tested as follows:

```js
if ('wakeLock' in navigator) {
  // Screen Wake Lock API supported 🎉
}
```

### Getting a screen wake lock {: #get-wake-lock }

To request a screen wake lock, you need to call the `navigator.wakeLock.request()` method
that returns a `WakeLockSentinel` object.
You pass this method the desired wake lock type as a parameter,
which *currently* is limited to just `'screen'` and therefore is *optional*.
The browser can refuse the request for various reasons (for example,
because the battery charge level is too low),
so it's a good practice to wrap the call in a `try…catch` statement.
The exception's message will contain more details in case of failure.

### Releasing a screen wake lock {: #release-wake-lock }

You also need a way to release the screen wake lock, which is achieved by calling the
`release()` method of the `WakeLockSentinel` object.
If you don't store a reference to the `WakeLockSentinel`, there's no way
to release the lock manually, but it will be released once the current tab is invisible.

If you want to automatically release the screen wake lock
after a certain period of time has passed,
you can use `window.setTimeout()` to call `release()`, as shown in the example below.

```js
// The wake lock sentinel.
let wakeLock = null;

// Function that attempts to request a screen wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request();
    wakeLock.addEventListener('release', () => {
      console.log('Screen Wake Lock released:', wakeLock.released);
    });
    console.log('Screen Wake Lock released:', wakeLock.released);
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

// Request a screen wake lock…
await requestWakeLock();
// …and release it again after 5s.
window.setTimeout(() => {
  wakeLock.release();
  wakeLock = null;
}, 5000);
```

The `WakeLockSentinel` object has a property called `released` that
indicates whether a sentinel has already been released.
Its value is initially `false`, and changes to `true` once a `"release"`
event is dispatched. This property helps web developers know when a lock
has been released so that they do not need to keep track of this manually.
It is available as of Chrome&nbsp;87.

### The screen wake lock lifecycle {: #wake-lock-lifecycle }

When you play with the [screen wake lock demo][demo], you'll notice that screen wake locks
are sensitive to [page visibility][page-visibility-api].
This means that the screen wake lock
will automatically be released when you minimize a
tab or window, or switch away from a tab or window where a screen wake lock is active.

To reacquire the screen wake lock,
listen for the [`visibilitychange`][visibility-change] event
and request a new screen wake lock when they occur:

```js
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
```

## Minimize your impact on system resources {: #best-practices }

Should you use a screen wake lock in your app?
The approach you take depends on the needs of your app. Regardless, you should
use the most lightweight approach possible for your app to minimize its
impact on system resources.

Before adding a screen wake lock to your app, consider whether your use cases could
be solved with one of the following alternative solutions:

* If your app is performing long-running downloads, consider using
  [background fetch](https://developers.google.com/web/updates/2018/12/background-fetch).
* If your app is synchronizing data from an external server, consider using
  [background sync](https://developers.google.com/web/updates/2015/12/background-sync).

{% Aside %}
  Like most other powerful web APIs, the Screen Wake Lock API is only available
  when served over **HTTPS**.
{% endAside %}

### Demo

Check out the [Screen Wake Lock demo][demo] and [demo source][demo-source].
Notice how the screen wake lock is automatically released when you switch tabs
or apps.

### Screen Wake Locks in the OS task manager

You can use your operating system's task manager to see if an application is preventing
your computer from sleeping. The video below shows the macOS
[Activity Monitor](https://support.apple.com/guide/activity-monitor/welcome/mac)
indicating that Chrome has an active screen wake lock that keeps the system awake.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/YDlxREcGrnBUGC8plN15.mp4", autplay="true", loop="true", width="800" %}

## Feedback {: #feedback }

The [Web Platform Incubator Community Group (WICG)](https://www.w3.org/community/wicg/)
and the Chrome team want to hear about your
thoughts and experiences with the Screen Wake Lock API.

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or
are there missing methods or properties that you need to implement your idea?

* File a spec issue on the [Screen Wake Lock API GitHub repo][issues]
  or add your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at [https://new.crbug.com][new-bug]. Be sure to include as much
  detail as you can, provide simple instructions for reproducing the bug, and
  set *Components* to `Blink>WakeLock`. [Glitch](https://glitch.com) works great
  for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Screen Wake Lock API? Your public support helps the
Chrome team prioritize features and shows other browser vendors how
critical it is to support them.

* Share how you plan to use the API on the [WICG Discourse thread][wicg-discourse].
* Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
  [`#WakeLock`](https://twitter.com/search?q=%23WakeLock&src=typed_query&f=live)
  and let us know where and how you're using it.

## Helpful links {: #helpful }

* Specification [Candidate Recommendation][spec-cr] | [Editor's Draft][spec-ed]
* [Screen Wake Lock Demo][demo] | [Screen Wake Lock Demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* [Experimenting with the Wake Lock API](https://medium.com/dev-channel/experimenting-with-the-wake-lock-api-b6f42e0a089f)
* Blink Component: [`Blink>WakeLock`](https://chromestatus.com/features#component%3ABlink%3EWakeLock)

## Acknowledgements

[Hero image](https://unsplash.com/photos/uy5t-CJuIK4) by
[Kate Stone Matheson](https://unsplash.com/@kstonematheson) on Unsplash.
Task manager video courtesy of
[Henry Lim](https://twitter.com/henrylim96/status/1359914993399959559).

[spec-ed]: https://w3c.github.io/wake-lock/
[spec-cr]: https://www.w3.org/TR/wake-lock/
[demo]: https://wake-lock-demo.glitch.me/
[demo-source]: https://glitch.com/edit/#!/wake-lock-demo?path=script.js:1:0
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=257511
[cr-status]: https://www.chromestatus.com/feature/4636879949398016
[issues]: https://github.com/w3c/wake-lock/issues
[wicg-discourse]: https://discourse.wicg.io/t/wake-lock-api-suppressing-power-management-screensavers/769
[page-visibility-api]: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
[visibility-change]: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWakeLock
[cr-dev-twitter]: https://twitter.com/chromiumdev

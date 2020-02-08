---
title: Stay awake with the Wake Lock API
subhead: The Wake Lock API provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.
authors:
  - petelepage
  - thomassteiner
description: To avoid draining the battery, most devices will quickly fall asleep when left idle. While this is fine most of the time, there are some applications that need to keep the screen or the device awake in order to complete some work. The Wake Lock API provides a way to prevent the device from dimming or locking the screen or prevent the device from going to sleep when an application needs to keep running.
date: 2018-12-18
updated: 2019-12-11
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/902971725287784449
tags:
  - post
  - capabilities
  - fugu
  - behind-a-flag
  - wake-lock
---

{% Aside %}
  The Wake Lock API, part of Google's
  [capabilities project](https://developers.google.com/web/updates/capabilities),
  is currently in development. This post will be updated as the
  implementation progresses.
{% endAside %}

## What is the Wake Lock API? {: #what }

To avoid draining the battery, most devices quickly go to sleep when left
idle. While this is fine most of the time, some applications need to keep the
screen or the device awake to complete their work. Examples include a
run-tracking app, which turns the screen off but keeps the system awake, or a game
like [Ball Puzzle](https://ball-puzzle.appspot.com/), which uses the device
motion APIs for input.

The [Wake Lock API][spec-ed] provides a way to prevent the device from dimming
and locking the screen or going to sleep. This
capability enables new experiences that, until now, required a native app.

The Wake Lock API reduces the need for hacky and potentially
power-hungry workarounds. It addresses the shortcomings of an older API
that was limited to simply keeping the screen on and had a number of
security and privacy issues.

## Suggested use cases for the Wake Lock API {: #use-cases }

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

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | N/A                          |
| 2. Create initial draft of specification   | [Complete][spec-ed]          |
| **3. Gather feedback and iterate design**  | [**In Progress**](#feedback) |
| **4. Origin trial**                        | [**In Progress**][ot]        |
| 5. Launch                                  | Not Started                  |

</div>

{% Aside %}
  Big thanks to the folks at Intel, specifically Mrunal Kapade, for implementing
  this API. Chrome depends on a community of committers
  working together to move the Chromium project forward. Not every Chromium
  committer is a Googler, and these contributors deserve special recognition!
{% endAside %}

## Using the Wake Lock API {: #use }

### Enabling support during the origin trial phase
The Wake Lock API will be available as an origin trial in Chrome 79.
The origin trial is expected to end in Chrome 81.

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Enabling via chrome://flags
To experiment with the Wake Lock API locally, without an origin trial token,
enable the `#experimental-web-platform-features` flag in `chrome://flags`.

### Demo

Check out the [Wake Lock demo][demo] and [demo source][demo-source].
Notice how the wake lock gets automatically released when you switch tabs
or switch to a different app.

### Wake lock types {: #wake-lock-types }

The Wake Lock API provides two types of wake locks: `screen` and `system`.
While they are treated independently, one may imply the effects of the other.
For example, a screen wake lock implies that the app should continue running.

#### `screen` wake lock

A `screen` wake lock prevents the device's screen from turning
off so that the user can see the information that's displayed on screen.

#### `system` wake lock

{% Aside 'caution' %}
The `system` wake lock is not currently implemented.
{% endAside %}

A `system` wake lock prevents the device's CPU from entering standby mode so
that your app can continue running.

### Get a wake lock {: #get-wake-lock }

To request a wake lock, you need to call the `navigator.wakeLock.request()` method
that returns a `WakeLockSentinel` object.
You pass this method the desired wake lock type as a parameter,
which *currently* is limited to just `'screen'`.
The browser can refuse the request for various reasons (for example,
because the battery charge level is too low),
so it's a good practice to wrap the call in a `try…catch` statement.
The exception's message will contain more details in case of failure.

You also need a way to release the wake lock, which is achieved by calling the
`release()` method of the `WakeLockSentinel` object.
If you don't store a reference to the `WakeLockSentinel`, there's no way
to release the lock manually, but it will be released once the current tab is invisible.

```js
// The wake lock sentinel.
let wakeLock = null;

// Function that attempts to request a wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });
    console.log('Wake Lock is active');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

// Request a wake lock…
await requestWakeLock();
// …and release it again after 5s.
window.setTimeout(() => {
  wakeLock.release();
  wakeLock = null;
}, 5000);
```

### The wake lock lifecycle {: #wake-lock-lifecycle }

When you play with the [wake lock demo][demo], you'll notice that wake locks
are sensitive to [page visibility][page-visibility-api] and
[full-screen mode][full-screen-api]. This means that the wake lock
will automatically be released when you enter full-screen mode, minimize a
tab or window, or switch away from a tab or window where a wake lock is active.

To reacquire the wake lock,
listen for the [`visibilitychange`][visibility-change] event and
the [`fullscreenchange`][fullscreen-change] event
and request a new wake lock when they occur:

```js
const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('fullscreenchange', handleVisibilityChange);
```

## Minimize your impact on system resources {: #best-practices }

Should you use a wake lock in your app?
The approach you take depends on the needs of your app. Regardless, you should
use the most lightweight approach possible for your app to minimize its
impact on system resources.

Before adding wake lock to your app, consider whether your use cases could
be solved with one of the following alternative solutions:

* If your app is performing long-running downloads, consider using
  [background fetch](https://developers.google.com/web/updates/2018/12/background-fetch).
* If your app is synchronizing data from an external server, consider using
  [background sync](https://developers.google.com/web/updates/2015/12/background-sync).

{% Aside %}
  Like most other powerful web APIs, the Wake Lock API is only available
  when served over **HTTPS**.
{% endAside %}

## Feedback {: #feedback }

The [Web Platform Incubator Community Group (WICG)](https://www.w3.org/community/wicg/)
and the Chrome team want to hear about your
thoughts and experiences with the Wake Lock API.

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or
are there missing methods or properties that you need to implement your idea?

* File a spec issue on the [Wake Lock API GitHub repo][issues]
  or add your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at [https://new.crbug.com][new-bug]. Be sure to include as much
  detail as you can, provide simple instructions for reproducing the bug, and
  set *Components* to `Blink>WakeLock`. [Glitch](https://glitch.com) works great
  for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Wake Lock API? Your public support helps the
Chrome team prioritize features and shows other browser vendors how
critical it is to support them.

* Share how you plan to use the API on the [WICG Discourse thread][wicg-discourse].
* Send a Tweet to [@ChromiumDev][cr-dev-twitter] with `#wakelock` and
  let us know where and how you're using it.

## Helpful links {: #helpful }

* Specification [Candidate Recommendation][spec-cr] | [Editor's Draft][spec-ed]
* [Wake Lock Demo][demo] | [Wake Lock Demo source][demo-source]
* [Origin Trial][ot]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* [Experimenting with the Wake Lock API](https://medium.com/dev-channel/experimenting-with-the-wake-lock-api-b6f42e0a089f)
* Blink Component: [`Blink>WakeLock`](https://chromestatus.com/features#component%3ABlink%3EWakeLock)

[spec-ed]: https://w3c.github.io/wake-lock/
[spec-cr]: https://www.w3.org/TR/wake-lock/
[demo]: https://wake-lock-demo.glitch.me/
[demo-source]: https://glitch.com/edit/#!/wake-lock-demo?path=script.js:1:0
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=257511
[cr-status]: https://www.chromestatus.com/features/4636879949398016
[issues]: https://github.com/w3c/wake-lock/issues
[wicg-discourse]: https://discourse.wicg.io/t/wake-lock-api-suppressing-power-management-screensavers/769
[page-visibility-api]: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
[full-screen-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
[visibility-change]: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
[fullscreen-change]: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#Event_handlers
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWakeLock
[cr-dev-twitter]: https://twitter.com/chromiumdev
[ot]: https://developers.chrome.com/origintrials/#/view_trial/902971725287784449

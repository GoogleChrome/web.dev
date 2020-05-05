---
title: Detect inactive users with the Idle Detection API
subhead: Use the Idle Detection API to find out when the user isn't actively using their device.
authors:
  - thomassteiner
description: |
  The Idle Detection API notifies developers when a user is idle, indicating such things as lack of
  interaction with the keyboard, mouse, screen, activation of a screensaver, locking of the screen,
  or moving to a different screen. A developer-defined threshold triggers the notification.
date: 2020-04-30
tags:
  - post
  - idle-detection
  - fugu
  - capabilities
hero: hero.jpg #https://images.unsplash.com/photo-1544239265-ee5eedde5469?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1900&q=80
alt: Abandoned computer on a bed with someone's leg next to it.
origin_trial:
  url: TODO
---
{% Aside %}
The Idle Detection API is part of the
[capabilities project](https://developers.google.com/web/updates/capabilities)
and is currently in development. This post will be updated as the implementation progresses.
{% endAside %}

## What is the Idle Detection API? {: #what }

The Idle Detection API notifies developers when a user is idle, indicating such things as lack of
interaction with the keyboard, mouse, screen, activation of a screensaver, locking of the screen,
or moving to a different screen. A developer-defined threshold triggers the notification.

### Suggested use cases for the Idle Detection API {: #use-cases }

Examples of sites that may use this API include:

- Chat applications or online social networking sites can use this API to let the user know if
their contacts are currently reachable.
- Publicly exposed kiosk apps, for example in museums, can use this API to return to the "home"
view if no one interacts with the kiosk anymore.
- Apps that require expensive calculations, for example to draw charts,
can limit these calculations to moments when the user interacts with their device.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Not started              |
| 5. Launch                                | Not started              |

</div>

## How to use the Idle Detection API {: #use }

### Enabling via chrome://flags

To experiment with the Idle Detection API locally, without an origin trial token, enable the
`#enable-experimental-web-platform-features` flag in `chrome://flags`.

### Enabling support during the origin trial phase

Starting with Chrome&nbsp;84, the Idle Detection API will be available as an origin trial.
The origin trial is expected to end in Chrome 87.

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Feature detection

To check if the Idle Detection API is supported, use:

```javascript
if ('IdleDetector' in window) {
  // Idle Detector API supported
}
```

### Idle Detection API concepts

The Idle Detection API assumes that there is some level of engagement between the user,
the user agent (that is, the browser), and the operating system of the device in use.
This is represented in two dimensions:

- **The user idle state:**
  `active` or `idle`: the user has or has not
interacted with the user agent for some period of time.
- **The screen idle state:**
  `locked` or `unlocked`: the system has an active screen lock (like a screensaver) preventing
  interaction with the user agent.

Distinguishing `active` from `idle` requires heuristics that may differ across user, user agent,
and operating system. It should also be a reasonably coarse threshold
(see [Security and Permissions](#security-and-permissions)).

The model intentionally does not formally distinguish between interaction with particular content
(that is, the webpage in a tab using the API), the user agent as a whole, or the operating system;
this definition is left to the user agent.

### Using the Idle Detection API

The first step when using the Idle Detection API is to initialize the `IdleDetector`.
It takes an object with the desired idle `threshold` in seconds.
The minimum `threshold` is 60 seconds. You start the idle detection by calling the
`IdleDetector`'s `start()` method, and you can stop it again by calling the `stop()` method.

There are two ways to get updates on the user's idle state: the first is for one-off requests by
checking the `IdleDetector`'s `state` property. The sample below polls the `state`,
which after one minute of inactivity will be reported as the `user` being `"idle"`.

```js
try {
  const idleDetector = new IdleDetector({ threshold: 60 });
  await idleDetector.start();
  console.log("Initial idle state:", idleDetector.state);
  // Every 10 seconds poll the user's idle state
  const interval = setInterval(() => {
    console.log("Current idle state:", idleDetector.state);
  }, 10 * 1000);
  // After 2min, stop the idle detection
  setTimeout(async () => {
    clearInterval(interval);
    await idleDetector.stop();
  }, 120 * 1000);
} catch (err) {
  // Deal with initialization errors like
  // permission denied, running outside of top-level frame, etc.
  console.error(err.name, err.message);
}
```

The second, _and preferred_, way is by subscribing to `change` events via an event listener.

```js
try {
  let idleDetector = new IdleDetector({ threshold: 60 });
  idleDetector.addEventListener("change", (e) => {
    const state = e.target.state;
    console.log(`Idle change: ${state.user}, ${state.screen}`);
  });
  await idleDetector.start();
} catch (err) {
  // Deal with initialization errors like
  // permission denied, running outside of top-level frame, etc.
  console.error(err.name, err.message);
}
```

### Demo

You can see the Idle Detection API in action with the [Ephemeral Canvas demo][demo] that erases its
contents after 60 seconds of inactivity. You could imagine this being deployed in a department
store for kids to doodle on.

![Ephemeral Canvas demo](demo.png)

### Polyfilling

Some aspects of the Idle Detection API are polyfillable
and idle detection libraries like [idle.ts](https://github.com/dropbox/idle.ts) exist,
but these approaches are constrained to a web app's own content area:
The library running in the context of the web app
needs to costly poll for input events or listen to visibility changes.
More restrictively, though, libraries cannot tell today when a user goes idle
outside of its content area (e.g., when a user is on a different tab
or logged out of their computer altogether).

## Security and permissions {: #security-and-permissions }

The Chrome team has designed and implemented the Idle Detection API using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis],
including user control, transparency, and ergonomics.

### User control and privacy

A new [permission](https://w3c.github.io/permissions/), tentatively named `"idle-detection"`
will be associated with this functionality. The permission might be auto-granted by user agents
based on heuristics, such as user engagement, the install state of the web app,
or having granted similar permissions such as [Wake Lock](/wakelock/). In Chrome,
we plan to auto-grant it.

We always want to prevent malicious actors from misusing new APIs. Seemingly independent websites,
but that in fact are controlled by the same entity, might obtain user idle information and
correlate the data to identify unique users across origins. To mitigate these sort of attacks,
the Idle Detection API limits the granularity of the reported idle events and user agents
may choose to fuzz the reported data. In Chrome,
we plan to do this as to render the attack vector useless.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the Idle Detection API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea?
Have a question or comment on the security model?
File a spec issue on the corresponding [GitHub repo][issues],
or add your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>Input` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Idle Detection API? Your public support helps the Chrome team to
prioritize features and shows other browser vendors how critical it is to support them.

Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]
Send a Tweet to [@ChromiumDev][cr-dev-twitter] with the `#idledetection` hashtag
and let us know where and how you're using it.

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [Idle Detection API Demo][demo] | [Idle Detection API Demo source][demo-source]
- [Tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>Input`][blink-component]

## Acknowledgements

The Idle Detection API was implemented by [Sam Goto](https://twitter.com/samuelgoto).
The hero image is by [Fernando Hernandez](https://unsplash.com/@_ferh97) on Unsplash.

[issues]: https://github.com/samuelgoto/idle-detection/issues
[demo]: https://idle-detection.glitch.me/
[demo-source]: https://glitch.com/edit/#!/idle-detection
[explainer]: https://github.com/samuelgoto/idle-detection/blob/master/README.md
[wicg-discourse]: https://discourse.wicg.io/t/idle-detection-api/2959
[cr-bug]: https://crbug.com/878979
[cr-status]: https://chromestatus.com/feature/4590256452009984
[blink-component]: https://chromestatus.com/features#component%3ABlink%3EInput
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md

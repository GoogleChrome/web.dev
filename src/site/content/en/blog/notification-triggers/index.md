---
title: Notification Triggers
subhead:
  Notification Triggers allows you to schedule local notifications that don't require a network
  connection, which makes them ideal for use cases like calendar apps.
authors:
  - thomassteiner
description:
  The Notification Triggers API allows developers to schedule local notifications that don't require
  a network connection, which makes them ideal for use cases like calendar apps.
date: 2019-10-24
updated: 2021-04-01
hero: image/admin/6ZuVN2HFiIqTVrmjN5XC.jpg
hero_position: center
tags:
  - blog
  - capabilities
  - origin-trials
  - notification-triggers
feedback:
  - api
---

{% Aside %} The development of Notification Triggers API, part of Google's
[capabilities project](https://developers.google.com/web/updates/capabilities), is currently in
development. This post will be updated as the implementation progresses. {% endAside %}

## What are Notification Triggers? {: #what }

Web developers can display notifications using the
[Web Notifications API](https://www.w3.org/TR/notifications/). This feature is often used with the
[Push API](https://w3c.github.io/push-api/) to inform the user of time-sensitive information, such
as breaking news events or received messages. Notifications are shown by running JavaScript on the
user's device.

The problem with the Push API is that it's not reliable for triggering notifications which _must_ be
shown when a particular condition, like time or location, is met. An example of a _time-based
condition_ is a calendar notification that reminds you of an important meeting with your boss at
2&nbsp;PM. An example of a _location-based condition_ is a notification that reminds you to buy milk
when you enter the vicinity of your grocery store. Network connectivity or battery-preserving
features like doze mode can delay the delivery of push based notifications.

Notification triggers solve this problem by letting you schedule notifications with their triggering
condition in advance, so that the operating system will deliver the notification at the right time
even if there is no network connectivity or the device is in battery saver mode.

{% Aside %} For now, Chrome only supports _time-based triggers_. Additional triggers, such as
location-based triggers, may be added in the future based on developer demand. {% endAside %}

### Use cases {: #use-cases }

Calendar applications can use time-based notification triggers to remind a user of upcoming
meetings. The default notification scheme for a calendar app could be to show a first heads-up
notification one hour before a meeting and then another more urgent notification five minutes
before.

A TV network might remind users that their favorite TV show is about to start or a conference live
stream is about to begin.

Time zone conversion sites can use time-based notification triggers to let their users schedule
alarms for telephone conferences or video calls.

## Current status {: #status }

| Step                                          | Status                       |
| --------------------------------------------- | ---------------------------- |
| 1. Create explainer                           | [Complete][explainer]        |
| 2. Create initial draft of specification      | Not started                  |
| 3. **Gather feedback and iterate on design.** | **[In progress](#feedback)** |
| 4. Origin trial                               | Complete                     |
| 5. Launch                                     | Not started                  |

## How to use notification triggers {: #use }

### Enabling via chrome://flags

To experiment with the Notification Triggers API locally, without an origin trial token, enable the
`#enable-experimental-web-platform-features` flag in `chrome://flags`.

{% Aside %} Two earlier origin trials for the feature, which gave developers a chance to try out the
proposed API, ran from Chrome&nbsp;80 to&nbsp;83 and from Chrome&nbsp;86 to&nbsp;88. You can read
the summary of the
[feedback obtained](https://docs.google.com/document/d/1Nl1emEqxjTzPLNIAPiS26Vtq3mBdNyCxfMY6QwaD45s/edit)
so far. {% endAside %}

### Feature detection

You can find out if the browser supports Notification Triggers by checking for the existence of the
`showTrigger` property:

```js
if ('showTrigger' in Notification.prototype) {
  /* Notification Triggers supported */
}
```

### Scheduling a notification

Scheduling a notification is similar to showing a regular push notification, except that you need to
pass a `showTrigger` condition property with a `TimestampTrigger` object as the value to the
notification's `options` object.

```js/5
const createScheduledNotification = async (tag, title, timestamp) => {
  const registration = await navigator.serviceWorker.getRegistration();
  registration.showNotification(title, {
    tag: tag,
    body: 'This notification was scheduled 30 seconds ago',
    showTrigger: new TimestampTrigger(timestamp + 30 * 1000),
  });
};
```

{% Aside %} On desktop, notification triggers fire only if Chrome is running. On Android, they fire
regardless. {% endAside %}

### Canceling a scheduled notification

To cancel scheduled notifications, first request a list of all notifications that match a certain
tag through `ServiceWorkerRegistration.getNotifications()`. Note that you need to pass the
`includeTriggered` flag for scheduled notifications to be included in the list:

```js/4
const cancelScheduledNotification = async (tag) => {
  const registration = await navigator.serviceWorker.getRegistration();
  const notifications = await registration.getNotifications({
    tag: tag,
    includeTriggered: true,
  });
  notifications.forEach((notification) => notification.close());
};
```

### Debugging

You can use the [Chrome DevTools Notifications panel][devtools] to debug notifications. To start
debugging, press **Start recording events**
{% Img src="image/admin/vf1pad201b4NM9WjgNQh.png", alt="Start recording events", width="24", height="24" %}
or <kbd>Control</kbd>+<kbd>E</kbd> (<kbd>Command</kbd>+<kbd>E</kbd> on Mac). Chrome DevTools records
all notification events, including scheduled, displayed, and closed notifications, for three days,
even when DevTools is closed.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Fcyc3iFPdNexgqh1peA8.png", alt="A scheduled notification event was logged to the Notifications pane of Chrome DevTools, which is located in the Application panel.", width="800", height="247" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A scheduled notification.
  </figcaption>
</figure>

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7Sj2NxYKbSXv4P894aLh.png", alt="A displayed notification event was logged to the Notifications pane of Chrome DevTools.", width="800", height="247" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A displayed notification.
  </figcaption>
</figure>

### Demo

You can see Notification Triggers in action in the [demo][demo], which allows you to schedule
notifications, list scheduled notifications, and cancel them. The source code is available on
[Glitch][demo-source].

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/admin/WVlem3Tf2GEEFwNVA2L1.png", alt="A screenshot of the Notification Triggers demo web app.", width="800", height="525" %}
  <figcaption class="w-figcaption">The Notification Triggers <a href="https://notification-triggers.glitch.me/">demo</a>.</figcaption>
</figure>

## Security and permissions

The Chrome team has designed and implemented the Notification Triggers API using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics. Because this API requires service workers, it also requires a
secure context. Using the API requires the same permission as regular push notifications.

### User control

This API is only available in the context of a `ServiceWorkerRegistration`. This implies that all
required data is stored in the same context and is automatically deleted when the service worker is
deleted or the user deletes all site data for the origin. Blocking cookies also prevents service
workers from being installed in Chrome, and therefore this API from being used. Notifications can
always be disabled by the user for the site in site settings.

### Transparency

Unlike the Push API, this API does not depend on the network, which implies scheduled notifications
need all required data beforehand, including image resources referenced by the `badge`, `icon` and
`image` attributes. This means showing a scheduled notification is not observable by the developer
and doesn't involve waking up the service worker until the user interacts with the notification.
Consequently, there is currently no known way the developer could obtain information about the user
through potentially privacy-invading approaches like IP address geolocation lookup. This design also
allows the feature to optionally tap into scheduling mechanisms provided by the operating system
like Android's [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager),
which helps preserve battery.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with Notification Triggers.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the [Notification Triggers GitHub repo][issues], or add your thoughts to
an existing issue.

### Problem with the implementation?

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com/). Be sure to include as much detail as you can,
simple instructions for reproducing, and set Components to `UI>Notifications`. Glitch works great
for sharing quick and easy bug reproductions.

### Planning to use the API?

Planning to use Notification Triggers on your site? Your public support helps us to prioritize
features and shows other browser vendors how critical it is to support them. Send a tweet to
[@ChromiumDev](https://twitter.com/chromiumdev) using the hashtag
[`#NotificationTriggers`](https://twitter.com/search?q=%23NotificationTriggers&src=typed_query&f=live)
and let us know where and how you're using it.

## Helpful Links {: #helpful }

- [Public explainer][explainer]
- [Notification Triggers demo][demo] | [Notification Triggers demo source][demo-source]
- [Tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: `UI>Notifications`

## Acknowledgements

Notification Triggers was implemented by [Richard Knoll](https://uk.linkedin.com/in/richardknoll)
and the explainer written by [Peter Beverloo](https://twitter.com/beverloo?lang=en), with
contributions from Richard. The following people have reviewed the article:
[Joe Medley](https://twitter.com/medleyjp), [Pete LePage](https://twitter.com/petele), as well as
Richard and Peter. [Hero image](https://unsplash.com/photos/UAvYasdkzq8) by
[Lukas Blazek](https://unsplash.com/@goumbik) on Unsplash.

[issues]: https://github.com/beverloo/notification-triggers/issues
[demo]: https://notification-triggers.glitch.me/
[demo-source]: https://glitch.com/edit/#!/notification-triggers
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=891339
[cr-status]: https://www.chromestatus.com/feature/5133150283890688
[explainer]: https://github.com/beverloo/notification-triggers/blob/master/README.md
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot]: https://developers.chrome.com/origintrials/#/view_trial/6883752030435803137
[devtools]: https://developers.google.com/web/updates/2019/07/devtools#backgroundservices

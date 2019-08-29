---
layout: post
title: Requests the notification permission on page load
description: |
  Learn how to responsibly request notification permission in a way that provides
  good user experience.
web_lighthouse:
  - notification-on-start
updated: 2019-08-28
---

As explained in
[What Makes a Good Notification](https://developers.google.com/web/fundamentals/push-notifications/),
good notifications are timely, relevant, and precise.
If your page asks for permission to send notifications on page load,
those notifications may not be relevant to your users or precise to their needs.

## How this audit fails

Lighthouse flags pages that request notification permissions on load:

<figure class="w-figure">
  <img class="w-screenshot" src="notification-on-start.png" alt="Lighthouse audit shows page requests notification permissions on load">
</figure>

Lighthouse collects the JavaScript that was executed on page load.
If this code contains calls to `notification.requestPermission()`,
and notification permission was not already granted,
then Lighthouse fails the audit.

Under **URLs**, Lighthouse reports the line and column numbers
where your code is requesting permission to send notifications.
Remove these calls,
and tie the requests to user gestures instead.

If notification permissions was already granted or denied
to a page before Lighthouse's audit,
Lighthouse cannot determine
if the page requests notification permissions on page load.
Reset the permissions and run Lighthouse again.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Ask for user's notification permissions responsibly

A better user experience is to offer to send users a specific type of notification,
and to present the permissions request after they opt-in.

See [Change website permissions](https://support.google.com/chrome/answer/6148059) for more help.

## Resources

[Source code for **Requests the notification permission on page load** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/notification-on-start.js)

---
layout: post
title: Requests the notification permission on page load
description: |
  Learn how to responsibly request notification permission in a way that provides
  good user experience.
web_lighthouse:
  - notification-on-start
date: 2019-05-02
updated: 2019-08-28
---

Good notifications are [timely, relevant, and precise](https://developers.google.com/web/fundamentals/push-notifications/).
If your page asks for permission to send notifications on page load,
those notifications may not be relevant to your users or their needs.

## How the Lighthouse notification audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages that request notification permissions on load:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eKTrQAAdl1v7pQL0GYRc.png", alt="Lighthouse audit shows page requests notification permissions on load", width="800", height="213", class="w-screenshot" %}
</figure>

Lighthouse checks all JavaScript executed on page load.
If the code calls `notification.requestPermission()`,
and notification permission has not already been granted, the audit fails.

If notification permission was granted to a page before the audit,
Lighthouse can't identify any notification permission requests.
So, make sure to [reset permissions](https://support.google.com/chrome/answer/6148059)
before running the audit.

Lighthouse reports the URL and line number
of each request for notification permission.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to ask for users' notification permissions responsibly
Remove all calls to `notification.requestPermission()`
that occur on page load.

To provide a better user experience:
- Offer to send users a specific type of notification.
- Present the permissions request after users opt in to the notification type.

## Resources

- [Source code for **Requests the notification permission on page load** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/notification-on-start.js)
- [Web Push Notifications: Timely, Relevant, and Precise](https://developers.google.com/web/fundamentals/push-notifications/)

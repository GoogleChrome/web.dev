---
layout: post
title: Avoids requesting notification permissions on page load
description: |
  Learn about `notification-on-start` audit.
author: kaycebasques
web_lighthouse:
  - notification-on-start
---

As explained in [What Makes a Good Notification](https://developers.google.com/web/fundamentals/push-notifications/), good notifications are
timely, relevant, and precise. If your page asks for permission to send
notifications on page load, those notifications may not be relevant to your
users or precise to their needs. A better user experience is to offer to send
users a specific type of notification, and to present the permissions request
after they opt-in.

## Recommendations

Under **URLs**, Lighthouse reports the line and column numbers where your
code is requesting permission to send notifications. Remove these calls,
and tie the requests to user gestures instead.

## More information

If notification permissions was already granted or denied to a page before
Lighthouse's audit, Lighthouse cannot determine if the page requests
notification permissions on page load. Reset the permissions and run
Lighthouse again. See [Change website permissions](https://support.google.com/chrome/answer/6148059) for more help.

Lighthouse collects the JavaScript that was executed on page load. If this
code contains calls to `notification.requestPermission()`, and notification
permission was not already granted, then notification permission was requested.

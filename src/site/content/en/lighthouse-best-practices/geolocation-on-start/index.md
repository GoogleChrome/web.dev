---
layout: post
title: Avoids requesting geolocation permission on page load
description: |
  Learn about `geolocation-on-start` audit.
author: kaycebasques
web_lighthouse:
  - geolocation-on-start
---

Users are mistrustful of or confused by pages that automatically request
their location on page load. Rather than automatically requesting a
user's location on page load, tie the request to a user's gesture, such as
a tapping a "Find Stores Near Me" button. Make sure that the gesture clearly
and explicitly expresses the need for the user's location.

## Recommendations

Under **URLs**, Lighthouse reports the line and column numbers where your
code is requesting the user's location. Remove these calls, and tie the
requests to user gestures instead. 

See [Ask permission responsibly](https://developers.google.com/web/fundamentals/native-hardware/user-location/#ask_permission_responsibly) for a list of best practices when
requesting a user's location.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## More information

If geolocation permission was already granted to a page before Lighthouse's
audit, Lighthouse cannot determine if the page requests the user's location
on page load. Reset the permissions and run Lighthouse again. See
[Change website permissions](https://support.google.com/chrome/answer/6148059) for more help.

Lighthouse collects the JavaScript that was executed on page load. If this
code contains calls to `geolocation.getCurrentPosition()` or
`geolocation.watchPosition()`, and geolocation permission was not already
granted, then the user's location was requested.
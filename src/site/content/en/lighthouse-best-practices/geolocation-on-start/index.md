---
layout: post
title: Requests the geolocation permission on page load
description: |
  Learn how to responsibly request geolocation permission in a way that provides
  good user experience.
web_lighthouse:
  - geolocation-on-start
date: 2019-05-02
updated: 2019-08-28
---

Users are mistrustful of or confused by pages
that automatically request their location on page load.

## How the Lighthouse geolocation audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages that request geolocation permission on load:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EKObTXN3729mGBN5bRyv.png", alt="Lighthouse audit showing geolocation request on page load", width="800", height="213", class="w-screenshot" %}
</figure>

Lighthouse checks all JavaScript executed on page load.
If the code calls `geolocation.getCurrentPosition()` or `geolocation.watchPosition()`,
and geolocation permission has not already been granted, the audit fails.

If geolocation permission was granted to a page before the audit,
Lighthouse can't identify any geolocation permission requests.
So, make sure to [reset permissions](https://support.google.com/chrome/answer/6148059)
before running the audit.

Lighthouse reports the URL and line number
of each request for geolocation permission.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to ask for users' locations responsibly
Remove all calls to `geolocation.getCurrentPosition()` and
`geolocation.watchPosition()` that occur on page load.

To provide a better user experience:
- Always request geolocation permission after a user action,
not on page load.
- Clearly indicate that the action will request geolocation permission.
- Assume users won't give you their locations.
- Use a fallback if users don't grant geolocation permission.


See Google's
[User Location](https://developers.google.com/web/fundamentals/native-hardware/user-location/)
article for more information.

## Resources

- [Source code for **Requests the geolocation permission on page load** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/geolocation-on-start.js)
- [User Location](https://developers.google.com/web/fundamentals/native-hardware/user-location/)

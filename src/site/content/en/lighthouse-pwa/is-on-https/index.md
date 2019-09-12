---
layout: post
title: Does not use HTTPS
description: |
  Learn how to protect your website with HTTPS.
web_lighthouse:
  - is-on-https
date: 2019-05-04
updated: 2019-09-19
---

All websites should be protected with HTTPS, even ones that don't handle
sensitive data. HTTPS prevents intruders from tampering with or passively
listening in on the communications between your site and your users.

## How the Lighthouse HTTPS audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that aren't on HTTPS:

<figure class="w-figure">
  <img class="w-screenshot" src="is-on-https.png" alt="Lighthouse audit showing page isn't on HTTPS">
</figure>

Lighthouse waits for an event from the Chrome Debugger Protocol indicating that
the page is running on a secure connection. If the event is not heard within 10
seconds, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to migrate your site to HTTPS

Many hosting platforms, such as
[Firebase](https://firebase.google.com/docs/hosting/) or
[GitHub Pages](https://pages.github.com/), are secure by default.

If you're running your own servers and need a cheap and easy way to generate
certificates, check out [Let's Encrypt](https://letsencrypt.org/). For more help
on enabling HTTPS on your servers, see the following set of docs:
[Enabling HTTPS on Your Servers](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https).

If your page is already running on HTTPS but you're failing this audit, then
you may have problems with mixed content. Mixed content is when a secure site
requests an unprotected (HTTP) resource. Check out the following doc on the
Chrome DevTools Security panel to learn how to debug these situations:
[Understand Security Issues With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/debug/security).

## Why all sites should be on HTTPS

HTTPS is a prerequisite for many new, powerful web platform features, such
as taking pictures or recording audio.

By definition,
an app cannot qualify as a progressive web app if it does not run on HTTPS.
This is because many core progressive web app technologies, such as
service workers, require HTTPS.

For more information on why all sites should be protected with HTTPS, see
[Why You Should Always Use HTTPS](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https).

## Resources

- [Source code for **Does not use HTTPS** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/is-on-https.js)
- [Enabling HTTPS on Your Servers](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https)
- [Understand Security Issues With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/debug/security)

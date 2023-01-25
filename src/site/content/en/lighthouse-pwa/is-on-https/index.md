---
layout: post
title: Does not use HTTPS
description: |
  Learn how to protect your website with HTTPS.
web_lighthouse:
  - is-on-https
date: 2019-05-04
updated: 2020-04-29
---

All websites should be protected with HTTPS, even ones that don't handle
sensitive data. HTTPS prevents intruders from tampering with or passively
listening in on the communications between your site and your users.

A page can't qualify as a [Progressive Web App (PWA)](/discover-installable) if it doesn't run on HTTPS;
many core PWA technologies, such as service workers, require HTTPS.

For more information about why all sites should be protected with HTTPS, see
[Why HTTPS Matters](/why-https-matters/).

## How the Lighthouse HTTPS audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that aren't on HTTPS:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FD2HDFl8SQCgRdhV4tzZ.png", alt="Lighthouse audit showing page isn't on HTTPS", width="800", height="139", class="w-screenshot" %}
</figure>

Lighthouse waits for an event from the [Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol)
indicating that the page is running on a secure connection.
If the event isn't heard within 10&nbsp;seconds, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to migrate your site to HTTPS

Consider hosting your site on a CDN. Most CDNs are secure by default.

To learn how to enable HTTPS on your servers, see Google's
[Enabling HTTPS on Your Servers](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https).
If you're running your own server and need a cheap and easy way to generate
certificates, [Let's Encrypt](https://letsencrypt.org/) is a good option.

If your page is already running on HTTPS but you're failing this audit,
you may have problems with [mixed content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content).
A page has mixed content when the page itself is loaded over HTTPS,
but it requests an unprotected (HTTP) resource. Check out the following doc on the
Chrome DevTools Security panel to learn how to debug these situations:
[Understand Security Issues With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/debug/security).

## Resources

- [Source code for **Does not use HTTPS** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/is-on-https.js)
- [Why You Should Always Use HTTPS](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https)
- [Enabling HTTPS on Your Servers](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https)
- [Understand Security Issues With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/debug/security)
- [What Is Mixed Content?](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content)
- [Let's Encrypt](https://letsencrypt.org/)

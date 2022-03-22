---
layout: post
title: Check site security
date: 2018-08-16
updated: 2018-08-16
authors:
  - samdutton
description: >
  You won't be able to build a PWA without HTTPS. Serving your site over HTTPS is fundamental for security, and many APIs won't work without it. If you need to justify implementation costs, find out why HTTPS matters.
---

You won't be able to build a PWA without HTTPS.

Serving your site over HTTPS is fundamental for security, and many APIs won't work without it. If
you need to justify implementation costs, find out [why HTTPS matters](/web/fundamentals/security/encrypt-in-transit/why-https).

If a site uses HTTP for any assets, users will be warned in the URL bar. Chrome displays a warning
like the following.

<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/OYTYjIbwrPLxQG4riSL5.png", alt="Chrome 'not secure' warning", width="800", height="219" %}
  <figcaption><em>From Chrome 68, the address bar warns if not all assets use HTTPS</em></figcaption>
</figure>

HTTPS should be implemented everywhere — not just, for example, on login or checkout pages. Any
insecure page or asset can be a vector for attack, making your site a liability for your users and
your business.

Site security is easy to check with [Chrome DevTools Security panel](/web/tools/chrome-devtools/security). Keep a record of any
problems.

The site in the following example is not secure, since some assets are served over HTTP.

<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/S19zXkzMqSQxUNJ3FfEW.png", alt="Chrome DevTools Security panel", width="800", height="553" %}
  <figcaption><em>Chrome DevTools Security panel</em></figcaption> 
</figure>

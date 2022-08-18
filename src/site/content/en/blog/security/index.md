---
layout: post
title: Security and Identity
description: Security is a big topic, learn about HTTPS, why it's important and how you can deploy it to your servers.
date: 2015-09-08
updated: 2019-08-18
---

{% YouTube "pgBQn_z3zRE" %}

Security is a big topic, here are a few things to get you started.

## Encrypting Data in Transit

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/aPJXVDTLz1DM7VbnxjW1.jpeg", alt="https", width="800", height="339" %}

One of the most critical security features, and one that is required for many modern
APIs and [progressive web apps](/web/progressive-web-apps/) is
[**HTTPS**](encrypt-in-transit/why-https), sometimes referred to as secure HTTP.

Some people mistakenly believe that the only sites that need HTTPS are sites that handle
some level of sensitive communication, like personal or financial data. But this isn't
true. Every site should be using HTTPS. HTTPS helps to prevent people from listening
in on what's crossing the wire, and helps prevent it from being tampered with while in
transit. Do you want your ISP or school to know every site you were looking at?

And if privacy and security weren't enough of a reason to protect your users, many new
browser features like service workers, the Payment Request API, and even some older
APIs like GeoLocation now require HTTPS.

[Enabling HTTPS on Your Servers](/enabling-https-on-your-servers/)

## Content Security Policy

Content Security Policy or CSP provides a rich set of directives that
enable granular control over the resources a page is allowed to load and
where they're loaded from.
[Learn More](/csp/)

## Prevent Mixed Content

One of the more time-consuming tasks in implementing HTTPS is finding and
fixing content that mixes both HTTPS and HTTP. Fortunately, there are tools
to help you with this.
[Get Started](/prevent-mixed-content/what-is-mixed-content/)

## Related Resources

- [Learn Web Security with Google](https://www.youtube.com/watch?v=tgEIo7ZSkbQ)
- [Getting the Green Lock: HTTPS Stories from the
  Field](https://www.youtube.com/watch?v=GoXgl9r0Kjk)

### Chrome DevTools

- [Understand Security Issues](/web/tools/chrome-devtools/security)

## Feedback {: #feedback }

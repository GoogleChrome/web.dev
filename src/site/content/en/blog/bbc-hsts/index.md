---
title: How the BBC is rolling out HSTS for better security and performance.
subhead: |
  The BBC is rolling out HSTS for their website to improve security and performance. Find out what it means, and how HSTS can help you.
authors:
  - jlwagner
date: 2022-07-25
description: |
  The BBC is rolling out HSTS for their website to improve security and performance. Find out what it means, and how HSTS can help you.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/BbUZ7XxZ991yp4lpD5Tr.png
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ew6tI1HdAi2g3vxQwdfM.png
alt: The BBC logo set on a black background.
tags:
  - blog
  - security
  - performance
---

HTTPS adoption has been steadily increasing in recent years. Per the HTTP Archive's 2021 Web Almanac, [around 91% of all requests for both desktop and mobile were served over HTTPS](https://almanac.httparchive.org/en/2021/security#transport-security). HTTPS isn't just here to stay, it's a necessary prerequisite to use features such as [Service Worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) and modern protocols such as [HTTP/2](/performance-http2/) and [HTTP/3](https://www.cloudflare.com/learning/performance/what-is-http3/).

Recently [Neil Craig](https://twitter.com/tdp_org)&mdash;a lead technical Architect at the BBC&mdash;[tweeted that HTTP Strict Transport Security (HSTS) is being slowly rolled out](https://twitter.com/tdp_org/status/1549028675328573440?s=20&t=S5mm1eEqGUbxZ4jfi-SvtA) for [bbc.com](https://www.bbc.com/). Let's find out what that means for the BBC, and what it could mean for you.

## The problem

Web servers often listen for requests on both ports 80 and 443. Port 80 is for insecure HTTP requests, whereas 443 is for secure HTTPS. This can create a problem, because when you enter an address into your address bar without the `https://` protocol prefix&mdash;like most users tend to do&mdash;some browsers will direct traffic to the insecure HTTP version of a site, for legacy reasons ([though this isn't always the case](https://blog.chromium.org/2021/03/a-safer-default-for-navigation-https.html)).

A common way to ensure users don't access an unsecured version of a website is to place an HTTP-to-HTTPS redirect for all requests. This certainly works, but it kicks off the following chain of events:

1. The server receives a request via HTTP.
2. The server issues a redirect to go to the HTTPS equivalent of the requested resource.
3. The server via HTTPS must negotiate a secure connection with the browser.
4. The content loads as usual.

While redirects work fine, they can be misconfigured in ways that still allow access to the insecure version of a site. Even if everything _is_ configured properly, there is still a security issue in that the user will still connect over insecure HTTP during the redirect phase, which exposes users to the possibility of dangerous [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

## Enter HSTS

{% BrowserCompat 'http.headers.Strict-Transport-Security' %}

[HSTS](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security) is dictated by the `Strict-Transport-Security` HTTP response header for HTTPS requests. When set, return visits to a website will trigger a special redirect known as a "307 Internal Redirect", which is when the browser handles the redirect logic, rather than the server. This prevents the request being intercepted, since it never leaves the browser, so is more secure. As an added bonus, these types of redirect are extremely fast, so any noticeable latency during an HTTP-to-HTTPS hop is eliminated.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/RCCZMoqNd4aLb91Uj1hx.png", alt="A 307 internal redirect from HTTP to HTTPS, triggered by an HSTS header. The 307 redirect only takes 2 milliseconds.", width="800", height="84" %}
</figure>

Similar in syntax to `Cache-Control`'s `max-age` directive, an HSTS header specifies a `max-age` directive. This directive takes a value in seconds that specifies how long the policy is effective for:

```http
Strict-Transport-Security: max-age=3600
```

In the above example, the policy should only take effect for an hour.

## Deploying HSTS

{% Aside 'caution' %}
Take care to read the information in this section **very carefully** before you decide to deploy HSTS! Botching an HSTS deployment can result in serious problems for users!
{% endAside %}

The main drawback of deploying HSTS is if you're not ready to treat your origin as strictly secure. Let's say you have a number of subdomains you're serving resources from, but maybe not all of them are secure. In this scenario, **an HSTS header could break your website.**

The BBC took the right approach to deploying HSTS. As [Neil Craig](https://twitter.com/tdp_org) mentioned in his tweet, the initial value that was set for bbc.com was `max-age=10`.

This approach means that the policy was only initially effective for ten seconds. This doesn't provide much of a benefit, but the idea is to feel out whether there may be issues with applying HSTS at all. As time goes on, you can increase the policy incrementally and see if issues occur. At the time of this writing, bbc.com is specifying an HSTS policy of `max-age=86400`, and that will almost certainly increase over time.

You certainly don't want to come out of the gate with a long `max-age` value when deploying HSTS. You could find yourself suddenly scrambling to fix issues while users experience problems. **Start small, and increment over time!** When you're confident all is well, you can set your `max-age` directive to a much longer period of time. It is [recommended to set `max-age` to one or two years](https://hstspreload.org/#deployment-recommendations) when it is fully rolled out.

## Get safer and faster initial navigations with the HSTS preload list

An HSTS policy only takes effect after the first visit to a website, so the benefits are not present for the first visit to the site. This will still require the insecure redirect. However, you can _preload_ your HSTS policy by submitting your website to the [HSTS preload list](https://hstspreload.org/), which is a hardcoded list of websites that the browser knows are strictly HTTPS. When your site is on the preload list, the first visit is also protected and HTTP-to-HTTPS redirect latency via HSTS will be instantaneous.

{% Aside %}
If you have a domain with a `.dev` top level domain (TLD), your website is already protected by HSTS as the whole `.dev` TLD has been included in preload list. It will already be assumed as strictly secure by the browser and is required to have a valid SSL certificate to function at all.
{% endAside %}

## Try it out for yourself

If the BBC feels comfortable testing out HSTS, there's a good chance that you can do the same for your website. Give it a shot for your website, and&mdash;if you're looking to rev things up&mdash;add it to the HSTS preload list when you're confident there are no bugs to give your users a safer _and_ faster experience.

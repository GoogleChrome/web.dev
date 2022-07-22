---
title: The BBC rolls out HTTP Strict Transport Security (HSTS)
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
  - performance
  - security
---

HTTPS adoption has been steadily increasing in recent years. Per the HTTP Archive's 2021 Web Almanac, [around 91% of all requests for both desktop and mobile were served over HTTPS](https://almanac.httparchive.org/en/2021/security#transport-security). HTTPS isn't just here to stay, it's a necessary prerequisite to use features such as [Service Worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) and modern protocols such as [HTTP/2](/performance-http2/) and [HTTP/3](https://www.cloudflare.com/learning/performance/what-is-http3/).

Recently Neil Craig&mdash;a lead technical Architect at the BBC&mdash;tweeted that [HTTP Strict Transport Security (HSTS)](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security) is being slowly rolled out for [bbc.com](https://www.bbc.com/). Let's find out what that means for the BBC, and what it could mean for you.

## The problem

Web servers these days tend to listen for requests on ports 80 and 443. Port 80 is for insecure HTTP requests, whereas 443 is for secure HTTPS. This can create a problem, because when you enter an address into your address bar without the https:// protocol prefix&mdash;like most users tend to do&mdash;some browsers will direct traffic to the insecure HTTP version of a site.

A common way to ensure users don't access an unsecured version of a website is to place an HTTP-to-HTTPS redirect for all requests. This certainly works, but it kicks off the following chain of events:

1. The server receives a request via HTTP.
2. The server issues a redirect to go to the HTTPS equivalent of the requested resource.
3. The server via HTTPS must negotiate a secure connection with the browser.
4. The content loads as usual.

The problem here is that the 301 redirect delays rendering of content, forcing the user to wait longer, and unless redirects are properly set up, you can still end up sending users to an insecure version of a web site.

## Enter HSTS

{% BrowserCompat 'HTTP.Headers.Strict-Transport-Security' %}

HSTS is dictated by the `Strict-Transport-Security` HTTP response header for HTTPS requests. When set, return visits to a website will trigger a special redirect known as a "307 Internal Redirect", which is when the browser handles the redirect logic. These types of redirect are extremely fast, and add no noticeable latency during an HTTP-to-HTTPS hop.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/J9vQLJCLmnHQPb6spsRe.png", alt="A 307 internal redirect from HTTP to HTTPS, triggered by an HSTS header. The 307 redirect only takes 2 milliseconds.", width="800", height="97" %}
</figure>

Similar in syntax to `Cache-Control`'s `max-age` directive, an HSTS header specifies a `max-age` directive. This directive takes a value in seconds that specifies how long the policy should take effect:

```http
Strict-Transport-Security: max-age=3600
```

In the above example, the policy should only take effect for an hour.

## Deploying HSTS

The main drawback of deploying HSTS is if you're not ready to treat your origin as strictly secure. Let's say you have a number of subdomains you're serving resources from, but maybe not all of them are secure. In this scenario, an HSTS header could break your website.

The BBC took the right approach to deploying HSTS. [As Neil Craig said in his tweet](https://twitter.com/tdp_org/status/1549022691772059649), the initial value that was set for bbc.com was `max-age=10`.

This approach means that the policy was only initially effective for ten seconds. This doesn't provide much of a benefit, but the idea is to feel out whether there may be issues with applying HSTS at all. As time goes on, you can increase the policy incrementally and see if issues occur. At present, bbc.com is specifying an HSTS policy of `max-age=3600`, and that will almost certainly increase.

You certainly don't want to come out of the gate with a long `max-age` value when deploying HSTS. You could find yourself suddenly scrambling to fix issues while users experience issues. Start small, and increment over time! When you're confident, you can set your `max-age` directive to a much longer period of time.

## Get faster initial navigations with the HSTS preload list

An HSTS policy only takes effect after the first visit to a website, so the benefit isn't noticeable until a user comes back. However, you can _preload_ your HSTS policy by submitting your website to the [HSTS preload list](https://hstspreload.org/), which is a hardcoded list of websites that the browser knows are strictly HTTPS. When your site is on the preload list, HTTP-to-HTTPS redirect latency via HSTS will be instantaneous&mdash;**even on the first visit!**

{% Aside %}
If you have a domain with a .dev TLD, your website is required to have a valid SSL certificate to function at all. This means you don't need to add your .dev website to the HSTS preload list&mdash;it will already be assumed as strictly secure by the browser!
{% endAside %}

## Try it out for yourself

If the BBC feels comfortable testing out HSTS, there's a good chance that you can do the same for your website. Give it a shot for your website, and&mdash;if you're really looking to rev things up&mdash;add it to the HSTS preload list when you're confident there are no bugs to give your users a secure _and_ fast experience.

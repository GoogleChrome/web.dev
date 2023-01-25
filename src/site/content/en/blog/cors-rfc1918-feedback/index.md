---
title: "Feedback wanted: CORS for private networks (RFC1918)"
subhead: |
  Mitigate the risks associated with unintentional exposure of devices
  and servers on a client’s internal network to the web at large.
description: |
  Unintentional exposure of devices and servers on a client’s internal network to the web at large makes them
  vulnerable to malicious attacks. CORS-RFC1918 is a proposal to block requests from public networks by default
  on the browser and require internal devices to opt-in to such requests.
authors:
  - agektmr
date: 2020-11-09
hero: image/admin/OPuAZvdfh0W5fLAvB5Rv.jpg
alt: A router with ethernet cables connected.
tags:
  - blog
  - security
  - cors
---

{% Aside %}
  CORS-RFC1918 has been renamed to Private Network Access for clarity.
  An update to this post is published at [developer.chrome.com
  blog](https://developer.chrome.com/blog/private-network-access-update).
{% endAside %}

Malicious websites making requests to devices and servers hosted on a private
network have long been a threat. Attackers may, for example, change a wireless
router's configuration to enable
[Man-in-the-Middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)
attacks. CORS-RFC1918 is a proposal to block such requests by default on the
browser and require internal devices to opt-in to requests from the public
internet.

To understand how this change impacts the web ecosystem, the Chrome team is
looking for feedback from developers who build servers for private networks.

## What's wrong with the status quo?

Many web servers run within a private network—wireless routers, printers,
intranet websites, enterprise services, and Internet of Things (IoT) devices are only part of them.
They might seem to be in a safer environment than the ones exposed to the public
but those servers can be abused by attackers using a web page as a proxy. For
example, malicious websites can embed a URL that, when simply viewed by the
victim (on a JavaScript-enabled browser), attempts to change the DNS server
settings on the victim's home broadband router. This type of attack is called
"[Drive-By
Pharming](https://link.springer.com/chapter/10.1007/978-3-540-77048-0_38)" and
[it happened in
2014](https://securityaffairs.co/wordpress/22743/cyber-crime/soho-pharming-attack.html).
More than 300,000 vulnerable wireless routers were exploited by having their DNS
settings changed and allowing attackers to redirect users to malicious servers.

## CORS-RFC1918

To mitigate the threat of similar attacks, the web community is bringing
[CORS-RFC1918](https://wicg.github.io/cors-rfc1918/)—[Cross Origin Resource
Sharing (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS) specialized
for private networks defined in [RFC1918](https://tools.ietf.org/html/rfc1918).

Browsers that implement CORS check with target
resources whether they are okay being loaded from a different origin. This is
accomplished either with extra headers inline describing the access or by using
a mechanism called preflight requests, depending on the complexity. Read [Cross
Origin Resource Sharing](/cross-origin-resource-sharing/)
to learn more.

With [CORS-RFC1918](https://wicg.github.io/cors-rfc1918/) the browser will block
loading resources over the private network by default except ones that are
explicitly allowed by the server using CORS and through HTTPS. The website
making requests to those resources will need to send CORS headers and the server
will need to explicitly state that it accepts the cross-origin request by
responding with corresponding CORS headers. (The exact [CORS
headers](https://wicg.github.io/cors-rfc1918/) are still under development.)

Developers of such devices or servers will be requested to do two things:

* Make sure the website making requests to a private network is served over
  HTTPS.
* Set up the server support for CORS-RFC1918 and respond with expected HTTP
  headers.

## What kinds of requests are affected?

Affected requests include:
* Requests from the public network to a private network
* Requests from a private network to a local network
* Requests from the public network to a local network

**A private network**
A destination that resolves to the private address space defined in Section 3 of
[RFC1918](https://tools.ietf.org/html/rfc1918) in IPv4, an IPv4-mapped IPv6
address where the mapped IPv4 address is itself private, or an IPv6 address
outside the `::1/128`, `2000::/3` and `ff00::/8` subnets.

**A local network**
A destination that resolves to the "loopback" space (`127.0.0.0/8`) defined in
section 3.2.1.3 of [RFC1122](https://tools.ietf.org/html/rfc1122) of IPv4, the
"link-local" space (`169.254.0.0/16`) defined in
[RFC3927](https://tools.ietf.org/html/rfc3927) of IPv4, the "Unique Local
Address" prefix (`fc00::/7`) defined in Section 3 of
[RFC4193](https://tools.ietf.org/html/rfc4193) of IPv6, or the "link-local"
prefix (`fe80::/10`) defined in section 2.5.6 of
[RFC4291](https://tools.ietf.org/html/rfc4291) of IPv6.

**A public network**
All others.

<figure class="w-figure">
  {% Img src="image/admin/kYpJXAxP6a3hphO4uzZX.png", alt="Relationship between public, private, local networks in CORS-RFC1918", width="800", height="512" %}
  <figcaption class="w-figcaption">Relationship between public, private, local networks in CORS-RFC1918.</figcaption>
</figure>

## Chrome's plans to enable CORS-RFC1918

Chrome is bringing CORS-RFC1918 in two steps:

### Step 1: Requests to private network resources will be allowed only from HTTPS web pages

Chrome 87 adds a flag that mandates public websites making requests to private
network resources to be on HTTPS. You can go to
`chrome://flags#block-insecure-private-network-requests` to enable it. With this
flag turned on, any requests to a private network resource from an HTTP website
will be blocked.

Starting from Chrome 88, CORS-RFC1918 errors will be reported as CORS policy
errors in the console.

<figure class="w-figure">
  {% Img src="image/admin/enzkNhWMHMkSla8q35OB.png", alt="CORS-RFC1918 errors will be reported as CORS policy errors in the console.", width="800", height="377", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">CORS-RFC1918 errors will be reported as CORS policy errors in the <b>Console</b>.</figcaption>
</figure>

In the **Network** panel of Chrome DevTools you can enable the **Blocked Requests**
checkbox to focus in on blocked requests:

<figure class="w-figure">
  {% Img src="image/admin/UM8ynEAc5uawNBdtHizX.png", alt="CORS-RFC1918 errors will also be reported as CORS error errors in the Network panel.", width="800", height="406", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">CORS-RFC1918 errors will also be reported as CORS error errors in the <b>Network</b> panel.</figcaption>
</figure>

In Chrome 87, CORS-RFC1918 errors are only reported in the DevTools Console as
`ERR_INSECURE_PRIVATE_NETWORK_REQUEST` instead.

You can try it out yourself using this [test
website](http://cors-rfc1918-testbed.glitch.me).

### Step 2: Sending preflight requests with a special header

In the future, whenever a public website is trying to fetch resources from a
private or a local network, Chrome will send a preflight request before the
actual request.

The request will include an `Access-Control-Request-Private-Network: true`
header in addition to other CORS request headers. Among other things, these
headers identify the origin making the request, allowing for fine-grained access
control. The server can respond with an `Access-Control-Allow-Private-Network:
true` header to explicitly indicate that it grants access to the resource.

{% Aside %}
These headers are still under development and may change in the future. No action is
currently required.
{% endAside %}

## Feedback wanted

If you are hosting a website within a private network that expects requests from
public networks, the Chrome team is interested in your feedback and use cases. There
are two things you can do to help:

* Go to `chrome://flags#block-insecure-private-network-requests`, turn on the
  flag and see if your website sends requests to the private network resource as
  expected.
* If you encounter any issues or have feedback, file an issue at
  [crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESecurityFeature%3ECORS)
  and set the component to `Blink>SecurityFeature>CORS>RFC1918`.

### Example feedback

> Our wireless router serves an admin website for the same private network but
> through HTTP. If HTTPS is required for websites that embed the admin website,
> it will be mixed content. Should we enable HTTPS on the admin website in a
> closed network?

This is exactly the type of feedback Chrome is looking for. Please file an issue
with your concrete use case at [crbug.com](https://crbug.com). Chrome would love to hear from you.

[Hero image](https://unsplash.com/photos/tN344soypQM) by [Stephen
Philips](https://unsplash.com/@hostreviews) on [Unsplash](https://unsplash.com).

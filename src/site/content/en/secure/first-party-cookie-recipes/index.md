---
layout: post
title: First-party cookie recipes
subhead: |
  Learn how to set first-party cookies to ensure security, cross-browser compatibility, and minimize chances of breakage once third-party cookies are phased out.
authors:
  - mihajlija
date: 2022-06-07
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/7znCv6cME5csfvqZlbZJ.jpg
description: |
  Learn how to set first-party cookies to ensure security, cross-browser compatibility, and minimize chances of breakage once third-party cookies are phased out.
tags:
  - security
  - privacy
  - blog
---


Cookies can be first-party or third-party relative to the user's context; depending on which site the user is on at the time. If the cookie's registrable domain and scheme match the current top-level page, that is, what's displayed in the browser's address bar, the cookie is considered to be from the [same site](/same-site-same-origin/) as the page and it's generally referred to as a first-party cookie.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/bN6n3dyOEkhwnVUFGOUQ.png", alt="", width="800", height="604" %}

Cookies from domains other than the current site are generally referred to as [third-party cookies](/samesite-cookie-recipes/#use-cases-for-cross-site-or-third-party-cookies).

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/HtvSbbHN7Sdj1xJURIqj.png", alt="", width="800", height="693" %}

{% Aside %}
The distinction between first-party and third-party context on the web isn't always obvious and the effect it has on different resources can vary. To address some of the challenges with how browsers treat first-party and third-party cookies, [First-Party Sets](https://developer.chrome.com/docs/privacy-sandbox/first-party-sets/) proposes to allow related domain names owned and operated by the same entity to declare themselves as belonging to the same first party.
{% endAside %}

## The good first-party cookie recipe

If the cookie you're setting is not used across sites, for example, it's used to manage sessions on your site and it's never used in a cross-site iframe, that cookie is always used in a first-party context.

By default, cookies can be shared across sites, accessed by JavaScript, and sent over HTTP connections, which comes with some privacy and security risks. While there's ongoing work to improve the default behavior, through [Privacy Sandbox](https://developer.chrome.com/docs/privacy-sandbox/) and other proposals such as [origin-bound cookies](https://github.com/sbingler/Origin-Bound-Cookies), there's a lot you can do today by setting additional attributes on your cookies.

The following configuration is best practice, ensuring security and cross-browser compatibility for most first-party cookies. It will provide you with a safe foundation, which you can adjust to open up permissions only when necessary. This article also covers recipe variations for some specific use-cases.

### The recipe

```text
Set-Cookie:
__Host-cookie-name=cookie-value;
Secure;
Path=/;
HttpOnly;
Max-Age=7776000;
SameSite=Lax;
```

{% Details %}

{% DetailsSummary %}
Details
{% endDetailsSummary %}

`__Host` is an optional prefix that makes some attributes mandatory and forbids others:

-   `Secure` must be present
-   `Domain` must be omitted
-   `Path` must be `/`

With `__Host` added, you can rely on the browser to check if attributes above are set in line with `__Host` rules and reject the cookie if not.

`Secure` protects cookies from being stolen on insecure networks because it only allows sending cookies over [HTTPS connections](/why-https-matters/). If you haven't fully [migrated your site to HTTPS](/why-https-matters/), make that a priority.

The `Domain` attribute specifies which hosts can receive a cookie. Omitting it restricts the cookie to the current document host, excluding subdomains: the cookie for `example.com` will be sent on every request to `example.com` but not on requests to `images.example.com`. If you have different apps running on different subdomains, this reduces the risk of one compromised domain allowing a door into the others.

`Path` indicates the path that must exist in the requested URL for the browser to send the `Cookie` header. Setting ``Path=/`` means that the cookie is sent to all URL paths on that domain. The combination of no `Domain` and `Path=/` makes the cookie bound to the origin as closely as possible, so it behaves similarly to other client-side storage such as `LocalStorage`—there's no confusion that `example.com/a` might receive different values to `example.com/b`.

The `HttpOnly` attribute adds some protection against malicious third-party scripts on your sites by [restricting JavaScript access](https://developer.mozilla.org/docs/Web/HTTP/Cookies#restrict_access_to_cookies). It allows a cookie to be sent only in request headers and makes them unavailable to JavaScript via `document.cookie`.

{% Aside %}
Even with `HttpOnly`, you can still trigger requests from JavaScript, like fetch or XML HTTP requests⁠—and if you've specified including credentials, cookies (including HTTP only cookies) will be sent⁠ on those requests—they're just not visible to those client-side scripts in any way. If any of those scripts on your site have been compromised or are malicious, their access to potentially sensitive cookie data is limited.
{% endAside %}

`Max-Age` limits the life of a cookie as browser sessions can last a pretty long time and you don't want stale cookies hanging around forever. It's good for short-term cookies, such as user sessions or even shorter ones such as tokens for form submission. `Max-Age` is defined in seconds and in the example above it's set to 7776000 seconds which is 90 days. This is a reasonable default, which you can change depending on your use case.

{% Aside %}
The maximum value of [`Max-Age` must not be greater than 400 days](https://httpwg.org/http-extensions/draft-ietf-httpbis-rfc6265bis.html#name-the-max-age-attribute) (34560000 seconds).  Another way to limit the life of a cookie is specifying the `Expires` attribute which sets an expiration date in the future, instead of an expiration duration. Note that the date and time set in the `Expires` attribute are relative to the client the cookie is being set on, not the server.
{% endAside %}

[`SameSite=Lax`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax) restricts the cookie to only be sent on same-site requests. That is, where the request matches the current browsing context–the top level site the user is currently visiting which is displayed in their location bar. `SameSite=Lax` is the default in modern browsers but it's good practice to specify it for compatibility across browsers which may have different defaults. By explicitly marking the cookie as same-site only, you are restricting it to your first-party contexts, and you should not have to make changes to that cookie when third-party cookies go away.

To learn more about different cookie attributes, check out [`Set-Cookie` documentation on MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie).

{% endDetails %}


## First-party cookie recipe for sites with subdomains

If you have a site with subdomains and want to have one session across all of them, the `Host` prefix can be too restrictive. For example `news.site` could have subdomains for topics, such as `finance.news.site` and `sport.news.site` and you'd want one user session on all of them. In that case, use the `__Secure` prefix instead of `__Host` and specify `Domain`.

### The recipe

```text
Set-Cookie:
__Secure-cookie-name=cookie-value;
Secure;
Domain=news.site;
Path=/;
HttpOnly;
Max-Age=7776000;
SameSite=Lax;
```

{% Details %}

{% DetailsSummary %}
Details
{% endDetailsSummary %}

`__Secure` is an optional prefix which asserts fewer requirements than `__Host`: it only requires that the cookie be set with the `Secure` attribute.

{% Aside %}
The `Secure` attribute restricts the cookie to be sent only over the HTTPS protocol. The `__Secure` prefix tells the browser to check if the cookie is set with the `Secure` attribute and reject it if it's not. This ensures that an attacker can not overwrite secure cookies with another cookie that is missing the `Secure` attribute.\
{% endAside %}

{% endDetails %}


## Restricting first-party cookie access on requests initiated from third-party websites

While `SameSite=Lax` cookies are not sent on cross-site subrequests (for example, when loading embedded images or iframes on a third-party site), they are sent when a user is navigating to the origin site (for example, when following a link from a different site).

You can further restrict cookies access and disallow sending them along with requests initiated from third-party websites with `SameSite=Strict`. This is useful when you have cookies relating to functionality that will always be behind an initial navigation, such as changing a password or making a purchase.

### The recipe

```text
Set-Cookie:
__Host-cookie-name=cookie-value;
Secure;
Path=/;
HttpOnly;
Max-Age=7776000;
SameSite=Strict;
```
---
title: Schemeful Same-Site
subhead: The definition of "same-site" is evolving to include the URL scheme,
  so links between HTTP and HTTPS versions of a site now count as
  cross-site requests. Upgrade to HTTPS by default to avoid issues where
  possible or read on for details of what SameSite attribute values are needed.
description: The definition of "same-site" is evolving to include the URL scheme,
  so links between HTTP and HTTPS versions of a site now count as
  cross-site requests. Upgrade to HTTPS by default to avoid issues where
  possible or read on for details of what SameSite attribute values are needed.
authors:
  - bingler
  - rowan_m
date: 2020-11-20
hero: image/admin/UMxBPy0AKAfbzxwgTroV.jpg
thumbnail: image/admin/3J33n1o98vnkO6fdDFwP.jpg
alt: Two separate plates of cookies. The plates represent the different
  schemes, HTTP and HTTPS. The cookies represent cookies.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %}
This article is part of a series on the `SameSite` cookie attribute changes:
- [SameSite cookies explained](/samesite-cookies-explained/)
- [SameSite cookies recipes](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite)
{% endAside %}

[Schemeful
Same-Site](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.3)
modifies the definition of a (web)site from just the registrable domain to the
scheme + registrable domain. You can find more details and examples in
[Understanding "same-site" and
"same-origin"](/same-site-same-origin/#%22schemeful-same-site%22).

{% Aside 'key-term' %}
This means that the insecure HTTP version of a site, for example,
**http**://website.example, and the secure HTTPS version of that site,
**https**://website.example, are now considered **cross-site** to each other.
{% endAside %}

The good news is: if your website is already fully upgraded to HTTPS then you
don't need to worry about anything. Nothing will change for you.

If you haven't fully upgraded your website yet then this should be the priority.
However, if there are cases where your site visitors will go between HTTP and
HTTPS then some of those common scenarios and the associated `SameSite` cookie
behavior are outlined below.

{% Aside 'warning' %}
The long-term plan is to [phase out support for third-party cookies
entirely](https://blog.chromium.org/2020/10/progress-on-privacy-sandbox-and.html),
replacing them with privacy preserving alternatives. Setting `SameSite=None;
Secure` on a cookie to allow it to be sent across schemes should only be
considered a temporary solution in the migration towards full HTTPS.
{% endAside %}

You can enable these changes for testing in both Chrome and Firefox.

- From Chrome 86, enable `chrome://flags/#schemeful-same-site`. Track progress
  on the [Chrome Status
  page](https://chromestatus.com/feature/5096179480133632).
- From Firefox 79, set `network.cookie.sameSite.schemeful` to `true` via
  `about:config`. Track progress via [the Bugzilla
  issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1651119).

One of the main reasons for the change to `SameSite=Lax` as the default for
cookies was to protect against [Cross-Site Request Forgery
(CSRF)](https://developer.mozilla.org/en-US/docs/Glossary/CSRF). However,
insecure HTTP traffic still presents an opportunity for network attackers to
tamper with cookies that will then be used on the secure HTTPS version of the
site. Creating this additional cross-site boundary between schemes provides
further defense against these attacks.

## Common cross-scheme scenarios

{% Aside 'key-term' %}
In the examples below where the URLs all have the same registrable domain, e.g.
site.example, but different schemes, for example, **http**://site.example vs.
**https**://site.example, they are referred to as **cross-scheme** to each
other.
{% endAside %}

### Navigation

Navigating between cross-scheme versions of a website (for example, linking from
**http**://site.example to **https**://site.example) would previously allow
`SameSite=Strict` cookies to be sent. This is now treated as a cross-site
navigation which means `SameSite=Strict` cookies will be blocked.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yDViqKg9eeEeAEiCNqe4.png", alt="A cross-scheme navigation triggered by following a link on the insecure HTTP version of a site to the secure HTTPS version. SameSite=Strict cookies blocked, SameSite=Lax and SameSite=None; Secure cookies are allowed.", width="800", height="342" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Cross-scheme navigation from HTTP to HTTPS.
  </figcaption>
</figure>

<table>
  <tr>
   <td>
   </td>
   <td><strong>HTTP → HTTPS</strong>
   </td>
   <td><strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td><code>SameSite=Strict</code>
   </td>
   <td>⛔ Blocked
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
  <tr>
   <td><code>SameSite=Lax</code>
   </td>
   <td>✓ Allowed
   </td>
   <td>✓ Allowed
   </td>
  </tr>
  <tr>
   <td><code>SameSite=None;Secure</code>
   </td>
   <td>✓ Allowed
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
</table>

### Loading subresources

{% Aside 'warning' %}
All major browsers block [active mixed
content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
such as scripts or iframes. Additionally, browsers including
[Chrome](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html)
and [Firefox](https://groups.google.com/g/mozilla.dev.platform/c/F163Jz32oYY)
are working toward upgrading or blocking passive mixed content.
{% endAside %}

Any changes you make here should only be considered a temporary fix while you
work to upgrade to full HTTPS.

Examples of subresources include images, iframes, and network requests made with
XHR or Fetch.

Loading a cross-scheme subresource on a page would previously allow
`SameSite=Strict` or `SameSite=Lax` cookies to be sent or set. Now this is
treated the same way as any other third-party or cross-site subresource which
means that any `SameSite=Strict` or `SameSite=Lax` cookies will be blocked.

Additionally, even if the browser does allow resources from insecure schemes to
be loaded on a secure page, all cookies will be blocked on these requests as
third-party or cross-site cookies require `Secure`.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GgR6Yln1f9JGkt04exRC.png", alt="A cross-scheme subresource resulting from a resource from the secure HTTPS version of the site being included on the insecure HTTP version. SameSite=Strict and SameSite=Lax cookies blocked, and SameSite=None; Secure cookies are allowed.", width="800", height="285" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    An HTTP page including a cross-scheme subresource via HTTPS.
  </figcaption>
</figure>

<table>
  <tr>
   <td>
   </td>
   <td><strong>HTTP → HTTPS</strong>
   </td>
   <td><strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td><code>SameSite=Strict</code>
   </td>
   <td>⛔ Blocked
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
  <tr>
   <td><code>SameSite=Lax</code>
   </td>
   <td>⛔ Blocked
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
  <tr>
   <td><code>SameSite=None;Secure</code>
   </td>
   <td>✓ Allowed
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
</table>

### POSTing a form

Posting between cross-scheme versions of a website would previously allow
cookies set with `SameSite=Lax` or `SameSite=Strict` to be sent. Now this is
treated as a cross-site POST—only `SameSite=None` cookies can be sent. You may
encounter this scenario on sites that present the insecure version by default,
but upgrade users to the secure version on submission of the sign-in or
check-out form.

As with subresources, if the request is going from a secure, e.g. HTTPS, to an
insecure, e.g. HTTP, context then all cookies will be blocked on these requests
as third-party or cross-site cookies require `Secure`.

{% Aside 'warning' %}
The best solution here is to ensure both the form page and destination are on a
secure connection such as HTTPS. This is especially important if the user is
entering any sensitive information into the form.
{% endAside %}

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ud9LkDeGJUWHObifD718.png", alt="A cross-scheme form submission resulting from a form on the insecure HTTP version of the site being submitted to the secure HTTPS version. SameSite=Strict and SameSite=Lax cookies blocked, and SameSite=None; Secure cookies are allowed.", width="800", height="376" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Cross-scheme form submission from HTTP to HTTPS.
  </figcaption>
</figure>

<table>
  <tr>
   <td>
   </td>
   <td><strong>HTTP → HTTPS</strong>
   </td>
   <td><strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td><code>SameSite=Strict</code>
   </td>
   <td>⛔ Blocked
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
  <tr>
   <td><code>SameSite=Lax</code>
   </td>
   <td>⛔ Blocked
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
  <tr>
   <td><code>SameSite=None;Secure</code>
   </td>
   <td>✓ Allowed
   </td>
   <td>⛔ Blocked
   </td>
  </tr>
</table>

## How can I test my site?

Developer tooling and messaging are available in Chrome and Firefox.

From Chrome 86, the [Issue tab in
DevTools](https://developers.google.com/web/tools/chrome-devtools/issues) will
include Schemeful Same-Site issues. You may see the following issues highlighted
for your site.

Navigation issues:
  - "Migrate entirely to HTTPS to continue having cookies sent on same-site
    requests"—A warning that the cookie **will be** blocked in a future version
    of Chrome.
  - "Migrate entirely to HTTPS to have cookies sent on same-site requests"—A
    warning that the cookie **has been** blocked.

Subresource loading issues:
  - "Migrate entirely to HTTPS to continue having cookies sent to same-site
    subresources" or "Migrate entirely to HTTPS to continue allowing cookies to
    be set by same-site subresources"—Warnings that the cookie **will be**
    blocked in a future version of Chrome.
  - "Migrate entirely to HTTPS to have cookies sent to same-site subresources"
    or "Migrate entirely to HTTPS to allow cookies to be set by same-site
    subresources"—Warnings that the cookie **has been** blocked. The latter
    warning can also appear when POSTing a form.

More detail is available in [Testing and Debugging Tips for Schemeful
Same-Site](https://www.chromium.org/updates/schemeful-same-site/testing-and-debugging-tips-for-schemeful-same-site).

From Firefox 79, with `network.cookie.sameSite.schemeful` set to `true` via
`about:config` the console will display message for Schemeful Same-Site issues.
You may see the following on your site:

- "Cookie `cookie_name` **will be soon** treated as cross-site cookie against
  `http://site.example/` because the scheme does not match."
- "Cookie `cookie_name` **has been** treated as cross-site against
  `http://site.example/` because the scheme does not match."

## FAQ

### My site is already fully available on HTTPS, why am I seeing issues in my browser's DevTools?

It's possible that some of your links and subresources still point to insecure
URLs.

One way to fix this issue is to use [HTTP
Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
(HSTS) and the `includeSubDomain` directive. With HSTS + `includeSubDomain` even
if one of your pages accidentally includes an insecure link the browser will
automatically use the secure version instead.

### What if I can't upgrade to HTTPS?

While we strongly recommend that you upgrade your site entirely to HTTPS to
protect your users, if you're unable to do so yourself we suggest speaking with
your hosting provider to see if they can offer that option. If you self-host,
then [Let's Encrypt](https://letsencrypt.org/) provides a number of tools to
install and configure a certificate. You can also investigate moving your site
behind a CDN or other proxy that can provide the HTTPS connection.

If that's still not possible then try relaxing the `SameSite` protection on
affected cookies.

- In cases where only `SameSite=Strict` cookies are being blocked you can lower
  the protection to `Lax`.
- In cases where both `Strict` and `Lax` cookies are being blocked and your
  cookies are being sent to (or set from) a secure URL you can lower the
  protections to `None`.
  - This workaround will **fail** if the URL you're sending cookies to (or
    setting them from) is insecure. This is because `SameSite=None` requires the
    `Secure` attribute on cookies which means those cookies may not be sent or
    set over an insecure connection. In this case you will be unable to access
    that cookie until your site is upgraded to HTTPS.
  - Remember, this is only temporary as eventually third-party cookies will be
    phased out entirely.

### How does this affect my cookies if I haven't specified a `SameSite` attribute?

Cookies without a `SameSite` attribute are treated as if they specified
`SameSite=Lax` and the same cross-scheme behavior applies to these cookies as
well. Note that the temporary exception to unsafe methods still applies, see
[the Lax + POST mitigation in the Chromium `SameSite`
FAQ](https://www.chromium.org/updates/same-site/faq) for more information.

### How are WebSockets affected?

WebSocket connections will still be considered same-site if they're the same
secureness as the page.

Same-site:
  - `wss://` connection from `https://`
  - `ws://` connection from `http://`

Cross-site:
  - `wss://` connection from `http://`
  - `ws://` connection from `https://`

_Photo by [Julissa
Capdevilla](https://unsplash.com/photos/wNjgWrEXAL0?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
on
[Unsplash](https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)_

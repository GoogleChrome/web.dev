---
layout: post
title: Same-origin policy
authors:
  - kosamari
date: 2018-11-05
description: |
  A browser can load and display resources from multiple sites. If there is no
  restriction on interactions between those resources, and if a script is
  compromised by an attacker, the script could expose everything on a user's
  browser.
codelabs:
  - codelab-same-origin-fetch
  - codelab-same-origin-iframe
tags:
  - security
---

The same-origin policy is a browser security feature that restricts how
documents and scripts on one origin can interact with resources
on another origin.

A browser can load and display resources from multiple sites at once. You might have
multiple tabs open at the same time, or a site could embed multiple iframes from
different sites. If there is no restriction on interactions between these
resources, and a script is compromised by an attacker, the script could
expose everything in a user's browser.

The same-origin policy prevents this from happening by blocking read access to
resources loaded from a different origin. "But wait," you say, "I load images
and scripts from other origins _all the time_." Browsers allow a few tags to
embed resources from a different origin. This policy is mostly a historical
artifact and can expose your site to vulnerabilities such as [clickjacking using
iframes](#how-to-prevent-clickjacking). You can restrict cross-origin reading
of these tags using a [Content Security
Policy](https://developers.google.com/web/fundamentals/security/csp/).

## What's considered same-origin?

An origin is defined by the scheme (also known as the  protocol, for example
HTTP or HTTPS), port (if it is specified), and host. When all three are the same
for two URLs, they are considered same-origin. For example,
`http://www.example.com/foo` is the same origin as
<code><strong>http</strong>://www.example.com/bar</code>
but not <code><strong>https</strong>://www.example.com/bar</code>
because the scheme is different.

{% Aside 'codelab' %}
[See how the same-origin policy works when fetching resources](/codelab-same-origin-fetch).
{% endAside %}

## What is permitted and what is blocked?

Generally, embedding a cross-origin resource is permitted, while reading a
cross-origin resource is blocked.

<div class="w-table-wrapper">
  <table>
    <tbody>
    <tr>
      <td>iframes</td>
      <td>
        Cross-origin embedding is usually permitted (depending on the <code><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options" rel="noopener">X-Frame-Options</a></code> directive), but cross-origin reading (such as using JavaScript to access a document in an iframe) isn't.
      </td>
    </tr>
    <tr>
      <td>CSS</td>
      <td>
        Cross-origin CSS can be embedded using a <code>&lt;link&gt;</code> element or an <code>@import</code> in a CSS file. The correct <code>Content-Type</code> header may be required.
      </td>
    </tr>
    <tr>
      <td>forms</td>
      <td>
        Cross-origin URLs can be used as the <code>action</code> attribute value of form elements. A web application can write form data to a cross-origin destination.
      </td>
    </tr>
    <tr>
      <td>images</td>
      <td>
        Embedding cross-origin images is permitted. However, reading cross-origin images (such as loading a cross-origin image into a <code>canvas</code> element using JavaScript) is blocked.
      </td>
    </tr>
    <tr>
      <td>multimedia</td>
      <td>
        Cross-origin video and audio can be embedded using <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code> elements.
      </td>
    </tr>
    <tr>
      <td>script</td>
      <td>
        Cross-origin scripts can be embedded; however, access to certain APIs (such as cross-origin fetch requests) might be blocked.
      </td>
    </tr>
    </tbody>
  </table>
</div>

{% Aside 'codelab' %}
[See how the same-origin policy works when accessing data inside an iframe](/codelab-same-origin-iframe).
{% endAside %}

{% Assessment 'self-assessment' %}

### How to prevent Clickjacking

<figure class="w-figure w-figure--inline-right">
  <img src="./clickjacking.png" alt="clickjacking">
  <figcaption class="w-figcaption">
    Figure: Clickjacking mechanism illustrated in 3 separate layers (base site,
    iframed site, transparent button).
  </figcaption>
</figure>

An attack called "clickjacking" embeds a site in an `iframe` and overlays
transparent buttons which link to a different destination. Users are tricked
into thinking they are accessing your application while sending data to
attackers.

To block other sites from embedding your site in an iframe, add a content
security policy with [`frame-ancestors`
directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
to the HTTP headers.

Alternatively, you can add `X-Frame-Options` to the HTTP headers see
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
for list of options.

## Wrap up

Hopefully you feel a little relieved that browsers work hard to be a gatekeeper
of security on the web. Even though browsers try to be safe by blocking access
to resources, sometimes you want to access cross-origin resources in your
applications. In the next guide, learn about Cross-Origin Resource Sharing
(CORS) and how to tell the browser that loading of cross-origin resources is
allowed from trusted sources.

---
title: SameSite cookies explained
subhead: Secure your site by learning how to explicitly mark your cross-site cookies.
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: |
  Learn how to mark your cookies for first-party and third-party usage with the
  SameSite attribute. You can enhance your site's security by using
  SameSite's Lax and Strict values to improve protection against CSRF attacks.
  Specifying the new None attribute allows you to explicitly mark your cookies
  for cross-site usage.
tags:
  - blog
  - security
  - cookies
  - chrome-80
feedback:
  - api
---

{% Aside %}
This article is part of a series on the `SameSite` cookie attribute changes that includes:

<ul>
<li><a href="/understanding-cookies/">Understanding cookies</a></li>
<li><a href="/samesite-cookie-recipes/">SameSite cookies recipes</a></li>
<li><a href="/schemeful-samesite/">Schemeful Same-Site</a></li>
</ul>
{% endAside %}


Each cookie contains a key-value pair along with a number of attributes that control when and where that cookie is used. 

## Explicitly state cookie usage with the `SameSite` attribute

The introduction of the `SameSite` attribute (defined in
[RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00))
allows you to declare if your cookie should be restricted to a first-party or
same-site context. It's helpful to understand exactly what 'site' means here.
The site is the combination of the domain suffix and the part of the domain just
before it. For example, the `www.web.dev` domain is part of the `web.dev` site.

{% Aside 'key-term' %}

If the user is on `www.web.dev` and requests an image from `static.web.dev` then
that is a **same-site** request.

{% endAside %}

The [public suffix list](https://publicsuffix.org/) defines this, so it's not
just top-level domains like `.com` but also includes services like `github.io`.
That enables `your-project.github.io` and `my-project.github.io` to count as
separate sites.

{% Aside 'key-term' %}

If the user is on `your-project.github.io` and requests an image from
`my-project.github.io` that's a **cross-site** request.

{% endAside %}

Introducing the `SameSite` attribute on a cookie provides three different ways
to control this behaviour. You can choose to not specify the attribute, or you
can use `Strict` or `Lax` to limit the cookie to same-site requests.

If you set `SameSite` to `Strict`, your cookie will only be sent in a
first-party context. In user terms, the cookie will only be sent if the site for
the cookie matches the site currently shown in the browser's URL bar. So, if the
`promo_shown` cookie is set as follows:

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

When the user is on your site, then the cookie will be sent with the request as
expected. However when following a link into your site, say from another site or
via an email from a friend, on that initial request the cookie will not be sent.
This is good when you have cookies relating to functionality that will always
be behind an initial navigation, such as changing a password or making a
purchase, but is too restrictive for `promo_shown`. If your reader follows the
link into the site, they want the cookie sent so their preference can be
applied.

That's where `SameSite=Lax` comes in by allowing the cookie to be sent with
these top-level navigations. Let's revisit the cat article example from above
where another site is referencing your content. They make use of your photo of
the cat directly and provide a link through to your original article.

```html
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>
```

And the cookie has been set as so:

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

When the reader is on the other person's blog the cookie **will not be sent**
when the browser requests `amazing-cat.png`. However when the reader follows the
link through to `cat.html` on your blog, that request **will include** the
cookie. This makes `Lax` a good choice for cookies affecting the display of the
site with `Strict` being useful for cookies related to actions your user is
taking.

{% Aside 'caution' %}

Neither `Strict` nor `Lax` are a complete solution for your site's security.
Cookies are sent as part of the user's request and you should treat them the
same as any other user input. That means sanitizing and validating the input.
Never use a cookie to store data you consider a server-side secret.

{% endAside %}

Finally there is the option of not specifying the value which has previously
been the way of implicitly stating that you want the cookie to be sent in all
contexts. In the latest draft of
[RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03) this
is being made explicit by introducing a new value of `SameSite=None`. This means
you can use `None` to clearly communicate that you intentionally want the cookie
sent in a third-party context.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="Three cookies labelled None, Lax, or Strict depending on their context", width="800", height="456", style="max-width: 35vw" %}
  <figcaption>
    Explicitly mark the context of a cookie as <code>None</code>, <code>Lax</code>, or <code>Strict</code>.
  </figcaption>
</figure>

{% Aside %}

If you provide a service that other sites consume such as widgets, embedded
content, affiliate programs, advertising, or sign-in across multiple sites
then you should use `None` to ensure your intent is clear.

{% endAside %}

## Changes to the default behavior without SameSite

While the `SameSite` attribute is widely supported, it has unfortunately not
been widely adopted by developers. The open default of sending cookies
everywhere means all use cases work but leaves the user vulnerable to CSRF and
unintentional information leakage. To encourage developers to state their intent
and provide users with a safer experience, the IETF proposal,
[Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00)
lays out two key changes:

- Cookies without a `SameSite` attribute will be treated as `SameSite=Lax`.
- Cookies with `SameSite=None` must also specify `Secure`, meaning they require
  a secure context.

Chrome implements this default behavior as of version 84.
[Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ)
has them available to test as of Firefox 69 and will make them default behaviors
in the future. To test these behaviors in Firefox, open
[`about:config`](http://kb.mozillazine.org/About:config) and set
`network.cookie.sameSite.laxByDefault`.
[Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ)
also plans to change its default behaviors.

{% Aside %}

This article will be updated as additional browsers announce support.

{% endAside %}

### `SameSite=Lax` by default

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

If you send a cookie without any `SameSite` attribute specified…

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

The browser will treat that cookie as if `SameSite=Lax` was specified.

{% endCompareCaption %}

{% endCompare %}

While this is intended to apply a more secure default, you should ideally set an
explicit `SameSite` attribute rather than relying on the browser to apply that
for you. This makes your intent for the cookie explicit and improves the chances
of a consistent experience across browsers.

{% Aside 'caution' %}

The default behaviour applied by Chrome is slightly more permissive than an
explicit `SameSite=Lax` as it will allow certain cookies to be sent on top-level
POST requests. You can see the exact details on
[the blink-dev announcement](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ).
This is intended as a temporary mitigation, you should still be fixing your
cross-site cookies to use `SameSite=None; Secure`.

{% endAside %}

### `SameSite=None` must be secure

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

Setting a cookie without `Secure` **will be rejected**.

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

You must ensure that you pair `SameSite=None` with the `Secure` attribute.

{% endCompareCaption %}

{% endCompare %}

You can test this behavior as of Chrome 76 by enabling
`about://flags/#cookies-without-same-site-must-be-secure` and from Firefox 69
in [`about:config`](http://kb.mozillazine.org/About:config) by setting
`network.cookie.sameSite.noneRequiresSecure`.

You will want to apply this when setting new cookies and actively refresh
existing cookies even if they are not approaching their expiry date.

{% Aside 'note' %}

If you rely on any services that provide third-party content on your site, you
should also check with the provider that they are updating their services. You
may need to update your dependencies or snippets to ensure that your site picks
up the new behavior.

{% endAside %}

Both of these changes are backwards-compatible with browsers that have correctly
implemented the previous version of the `SameSite` attribute, or just do not
support it at all. By applying these changes to your cookies, you are making
their intended use explicit rather than relying on the default behavior of the
browser. Likewise, any clients that do not recognize `SameSite=None` as of yet
should ignore it and carry on as if the attribute was not set.

{% Aside 'warning' %}

A number of older versions of browsers including Chrome, Safari, and UC browser
are incompatible with the new `None` attribute and may ignore or restrict the
cookie. This behavior is fixed in current versions, but you should check your
traffic to determine what proportion of your users are affected. You can see the
[list of known incompatible clients on the Chromium site](https://www.chromium.org/updates/same-site/incompatible-clients).

{% endAside %}

## `SameSite` cookie recipes

For further detail on exactly how to update your cookies to successfully handle
these changes to `SameSite=None` and the difference in browser behavior, head to
the follow up article, [SameSite cookie recipes](/samesite-cookie-recipes).

_Kind thanks for contributions and feedback from Lily Chen, Malte Ubl, Mike
West, Rob Dodson, Tom Steiner, and Vivek Sekhar_

_Cookie hero image by
[Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on
[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---
title: When to use HTTPS for local development
subhead: Using http://localhost for local development is fine most of the time, except in some special cases. This post explains when you need to run your local development site with HTTPS.
authors:
  - maudn
date: 2021-01-25
hero: image/admin/rIRKS6XfdH4ZU6N1y4zE.jpg
tags:
  - blog
  - security
---

Also see: [How to use HTTPS for local development](/how-to-use-local-https).

_In this post, statements about `localhost` are valid for `127.0.0.1` and `[::1]` as well, since they both describe the local computer address, also called "loopback address". Also, to keep things simple, the port number isn't specified._
_So when you see `http://localhost`, read it as `http://localhost:{PORT}` or `http://127.0.0.1:{PORT}`._

## Summary

When developing locally, use `http://localhost` by default. Service Workers, Web Authentication API, and more will work.
However, in the following cases, you'll need HTTPS for local development:

- Setting Secure cookies in a consistent way across browsers
- Debugging mixed-content issues
- Using HTTP/2 and later
- Using third-party libraries or APIs that require HTTPS
- Using a custom hostname

  <figure class="w-figure">
    {% Img src="image/admin/ifswaep3VUkY7cjArbIc.png", alt="A list of cases when you need to use HTTPS for local development.", width="800", height="450" %}
    <figcaption class="w-figcaption">When to use HTTPS for local development.</figcaption>
  </figure>

{% Aside %}
If you need HTTPS for one of the above use cases, check out [How to use HTTPS for local development](/how-to-use-local-https).
{% endAside %}

✨ This is all you need to know. If you're interested in more details keep reading!

## Why your development site should behave securely

To avoid running into unexpected issues, you want your local development site to behave as much as possible like your production website. So, if your production website uses HTTPS, you want your local development site to behave **like an HTTPS site**.

{% Aside 'warning' %}
If your production website doesn't use HTTPS, [make it a priority](/why-https-matters/).
{% endAside %}

## Use `http://localhost` by default

Browsers treat `http://localhost` in a special way: **although it's HTTP, it mostly behaves like an HTTPS site**.

On `http://localhost`, Service Workers, Sensor APIs, Authentication APIs, Payments, and [other features that require certain security guarantees](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts) are supported and behave exactly like on an HTTPS site.

## When to use HTTPS for local development

You may encounter special cases where `http://localhost` _doesn't_ behave like an HTTPS site—or you may simply want to use a custom site name that's not `http://localhost`.

You need to use HTTPS for local development in the following cases:

- You need to [set a cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) locally that is `Secure`, or `SameSite:none`, or has the `__Host` prefix. `Secure` cookies are set only on HTTPS, but not on `http://localhost` for all browsers. And because `SameSite:none` and `__Host` also require the cookie to be `Secure`, setting such cookies on your local development site requires HTTPS as well.

  {% Aside 'gotchas' %}
  When it comes to setting `Secure` cookies locally, not all browsers behave in the same way! For example, Chrome and Safari don't set `Secure` cookies on localhost, but Firefox does. In Chrome, this is considered a [bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1056543&q=localhost%20secure%20cookie&can=2).
  {% endAside %}

- You need to debug locally an issue that only occurs on an HTTPS website but not on an HTTP site, not even `http://localhost`, such as a [mixed-content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) issue.
- You need to locally test or reproduce a behaviour specific to HTTP/2 or newer. For example, if you need to test loading performance on HTTP/2 or newer. Insecure HTTP/2 or newer is not supported, not even on `localhost`.
- You need to locally test third-party libraries or APIs that require HTTPS (for example OAuth).
- You're not using `localhost`, but a custom host name for local development, for example `mysite.example`. Typically, this means you've overridden your local hosts file:
  <figure class="w-figure">
    {% Img src="image/admin/i7dPGFARXLbg9oIAUol2.jpg", alt="Screenshot of a terminal editing a hosts file", width="740", height="318" %}
    <figcaption class="w-figcaption">Editing a hosts file to add a custom hostname.</figcaption>
  </figure>

  In this case, Chrome, Edge, Safari, and Firefox by default do _not_ consider `mysite.example` to be secure, even though it's a local site. So it won't behave like an HTTPS site.

- Other cases! This is not an exhaustive list, but if you encounter a case that's not listed here, you'll know: things will break on `http://localhost`, or it won't quite behave like your production site. 🙃

**In all of these cases, you need to use HTTPS for local development.**

## How to use HTTPS for local development

If you need to use HTTPS for local development, head over to [How to use HTTPS for local development](/how-to-use-local-https).

## Tips if you're using a custom hostname

**If you're using a custom hostname, for example, editing your hosts file:**

- Don't use a bare hostname like `mysite` because if there's a [top-level domain (TLD)](https://en.wikipedia.org/wiki/Top-level_domain) that happens to have the same name (`mysite`), you'll run into issues. And it's not that unlikely: in 2020, there are over 1,500 TLDs, and the list is growing. `coffee`, `museum`, `travel`, and many large company names (maybe even the company you're working at!) are TLDs. [See the full list here](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
- Only use domains that are yours, or that are reserved for this purpose. If you don't have a domain of your own, you can use either `test` or `localhost` (`mysite.localhost`). `test` doesn't have special treatment in browsers, but `localhost` does: Chrome and Edge support `http://<name>.localhost` out of the box, and it will behave securely when localhost does. Try it out: run any site on localhost and access `http://<whatever name you like>.localhost:<your port>` in Chrome or Edge. This may soon be possible in Firefox and [Safari](https://bugs.webkit.org/show_bug.cgi?id=160504) as well. The reason you can do this (have subdomains like `mysite.localhost`) is because `localhost` is not just a hostname: it's also a full TLD, like `com`.

## Learn more

- [Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
- [localhost as a secure context](https://www.w3.org/TR/secure-contexts/#localhost)
- [localhost as a secure context in Chrome](https://www.chromestatus.com/feature/6269417340010496)

_With many thanks for contributions and feedback to all reviewers—especially Ryan Sleevi,
Filippo Valsorda, Milica Mihajlija, Rowan Merewood and Jake Archibald. 🙌_

_Hero image by [@moses_lee](https://unsplash.com/@moses_lee) on [Unsplash](https://unsplash.com/photos/Q2Xy_hYzrgg), edited._

---
title: SameSite cookie recipes
subhead:
  Update your site's cookies to prepare for the upcoming changes to the SameSite
  attribute's behavior.
authors:
  - rowan_m
date: 2019-10-15
hero: cookie-hero.jpg
description: |
  With the introduction of the new SameSite=None attribute value, sites can now
  explicitly mark their cookies for cross-site usage. Browsers are moving to
  make cookies without a SameSite attribute act as first-party by default, a
  safer and more privacy preserving option than the current open behavior.
  Learn how to mark up your cookies to ensure your first-party and third-party
  cookies continue to work once this change comes into effect.
tags:
  - post
  - security
  - cookies
---

{% Aside %}
If you need a refresher on cookies and the `SameSite` attribute,
head over to the earlier companion article,
["SameSite cookies explained"](/samesite-cookies-explained).
{% endAside %}

To recap from before: [Chrome](https://www.chromium.org/updates/same-site),
[Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ),
[Edge](https://textslashplain.com/2019/09/30/same-site-cookies-by-default/), and
others will be changing their default behavior so that:

1. cookies without a `SameSite` attribute will be treated as `SameSite=Lax`, or
   restricted to first-party contexts
2. cookies for cross-site or third-party usage must specify
   `SameSite=None; Secure`

## Use cases for cross-site or third-party cookies

There are a number of common use cases and patterns where cookies need to be
sent in a third-party context. If you provide or depend on one of these use
cases then you will need to ensure that either you or the provider are updating
their cookies to ensure the service continues to function correctly.

### Content within an `<iframe>`

When content is displayed within an `<iframe>` this qualifies as a third-party
context. Standard use cases here are:

- embedded content shared from other sites, such as videos, maps, code samples,
  social posts
- widgets from external services such as payments, calendars, booking /
  reservation services
- widgets such as social buttons or anti-fraud services that create less obvious
  `<iframes>`

Cookies may be used here to personalize content if the current user has an
existing account on the remote site, maintain a session state, store general
preferences, enable usage statistics, and more.

<figure class="w-figure  w-figure--center">
  <img src="iframe.png"
      alt="Diagram of a browser window where the URL of embedded content does
        not match the URL of the page."
      style="max-width: 35vw;">
  <figcaption class="w-figcaption">
    If the embedded content doesn't come from the same site as the top-level
    browsing context, it's third-party content.
  </figcaption>
</figure>

Additionally, as the web is inherently composable, `<iframes>` are used to embed
content that is also viewed in a top-level or first-party context. Any cookies
used by that site will be considered as third-party cookies when the site is
displayed within the frame. If you're creating sites that you intend to be
easily composed that also rely on cookies to function, you will also need to
ensure those are marked for cross-site usage or that you can gracefully fallback
without them.

### "Unsafe" requests across sites

While "unsafe" may sound slighly concerning here, this refers to any request
that may be intended to change state and on the web that's primarily POST
requests. Cookies marked as `SameSite=Lax` will be sent on safe top-level
navigations, e.g. clicking a link to go to a different site. However something
like a `<form>` submission via POST to a different site would not include
cookies.

<figure class="w-figure  w-figure--center">
  <img src="safe-navigation.png"
      alt="Diagram of a request moving from one page to another."
      style="max-width: 35vw;">
  <figcaption class="w-figcaption">
    If the incoming request uses a "safe" method then the cookies will be sent.
  </figcaption>
</figure>

This pattern is used for sites that may redirect the user out to a remote
service to perform some operation before returning, for example redirecting to a
third-party identity provider. Before the user leaves the site, a cookie is set
containing a single use token with the expectation that this token can be
checked on the returning request to mitigate CSRF attacks. If that returning
request comes via POST then it will be necessary to mark the cookies as
`SameSite=None; Secure`.

### Remote resources

Any remote resource on a page may be relying on cookies to be sent with that
request, from `<img>` tags, `<script>` tags, and so on. Common use cases here
include tracking pixels and personalizing content.

This also applies to
[`fetch` requests](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included)
from the page. If you see the `credentials: 'include'` option in the
configuration this is a good indication that cookies may well be expected on
those requests. Those cookies will need to be appropriate marked to be included.

## How to implement `SameSite` today

For cookies where you know they are only needed in a first-party context you
should ideally mark them as `SameSite=Lax` or `SameSite=Strict` depending on
your needs. You can also choose to do nothing and just allow the browser to
enforce its default, but this comes with the risk of inconsistent behavior
across browsers and potential console warnings for each cookie.

```text
Set-Cookie: first_party_var=value; SameSite=Lax
```

For cookies needed in a third-party context, you will need to ensure thet are
marked as `SameSite=None; Secure`. Note that you need both attributes together.
If you just specify `None` without `Secure` the cookie will be rejected. There
are some mutually incompatible differences in browser implementations here
though, so you may need to use some of the mitigating strategies described in
["Handling incompatible clients"](#handling-incompatible-clients) below.

```text
Set-Cookie: third_party_var=value; SameSite=None; Secure
```

### Identifying cookie usage

As of Chrome 77, you will be able to see warnings in the console cross-site
cookies that do not currently have a `SameSite` attribute and cookies that have
been marked with `SameSite=None` but are missing `Secure`.

<figure class="w-figure  w-figure--center">
  <img src="chrome-console-warning.png"
      alt="Chrome console warnings for SameSite cookie misconfiguration"
      style="max-width: 35vw;">
  <figcaption class="w-figcaption">
    Chrome console warnings for <tt>SameSite</tt> cookie misconfiguration.
  </figcaption>
</figure>

For missing `SameSite` attributes you will see:

> "A cookie associated with a cross-site resource at (cookie domain) was set
> without the `SameSite` attribute. A future release of Chrome will only deliver
> cookies with cross-site requests if they are set with `SameSite=None` and
> `Secure`. You can review cookies in developer tools under
> Application>Storage>Cookies and see more details at
> [https://www.chromestatus.com/feature/5088147346030592](https://www.chromestatus.com/feature/5088147346030592)
> and
> [https://www.chromestatus.com/feature/5633521622188032](https://www.chromestatus.com/feature/5633521622188032)."

And for `None` without `Secure`, you will see:

> "A cookie associated with a resource at (cookie domain) was set with
> `SameSite=None` but without `Secure`. A future release of Chrome will only
> deliver cookies marked `SameSite=None` if they are also marked `Secure`. You
> can review cookies in developer tools under Application>Storage>Cookies and
> see more details at
> [https://www.chromestatus.com/feature/5633521622188032](https://www.chromestatus.com/feature/5633521622188032)."

Each of these warnings will contain the cookie domain. If you're responsible for
that domain, then you will need to update the cookies. Otherwise, you may need
to contact the owner of the site or service responsible for that cookie to
ensure they making the necessary changes. The warnings themselves do not affect
the functionality of the site, this is purely to inform developers of the
upcoming changes.

### Handling incompatible clients

As these changes to include `None` and update default behavior are still
relatively new, there are inconsistencies amongst browsers as to how these
changes are handled. You can refer to the
[updates page on chromium.org](https://www.chromium.org/updates/same-site/incompatible-clients)
for the issues currently known, however it's not possible to say if this is
exhaustive. While this is not ideal, there are workarounds you can employ during
this transitionary phase. The general rule though is to treat incompatible
clients as the special case - do not create an exception for browsers
implementing the newer rules.

The first option is to set both the new and old style cookies:

```text
Set-cookie: 3pcookie=value; SameSite=None; Secure
Set-cookie: 3pcookie-legacy=value; Secure
```

Browsers implementing the newer behavior will set the cookie with the `SameSite`
value, while other browsers may ignore or incorrectly set it. However, those
same browsers will set the `3pcookie-legacy` cookie. When processing included
cookies, the site should first check for the presence of the new style cookie
and if it's not found, then fallback to the legacy cookie.

The example below shows how to do this in Node.js making use of the
[Express framework](https://expressjs.com) and its
[cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware.

```javascript
const express = require('express');
const cp = require('cookie-parser');
const app = express();
app.use(cp());

app.get('/set', (req, res) => {
  // Set the new style cookie
  res.cookie('3pcookie', 'value', { sameSite: 'none', secure: true });
  // And set the same value in the legacy cookie
  res.cookie('3pcookie-legacy', 'value', { secure: true });
  res.end();
});

app.get('/', (req, res) => {
  let cookieVal = null;

  if (req.cookies['3pcookie']) {
    // check the new style cookie first
    cookieVal = req.cookies['3pcookie'];
  } else if (req.cookies['3pcookie-legacy']) {
    // otherwise fall back to the legacy cookie
    cookieVal = req.cookies['3pcookie-legacy'];
  }

  res.end();
});

app.listen(process.env.PORT);
```

The downside is that this involves setting redundant cookies to cover all
browsers and requires making changes both at the point of setting and reading
the cookie. However, this approach should cover all browsers regardless of their
behavior and ensure third-party cookies continue to function as before.

Alternatively at the point of sending the `Set-Cookie` header, you can choose to
detect the client via the user agent string. For example, this snippet shows
detecting iOS 12 or Safari on Mac OS X 10.14 and serving a cookie without the
`SameSite` attribute to those browsers. This makes use of the
[ua-parser-js](https://www.npmjs.com/package/ua-parser-js) library for Node.js,
it's advisable to find a library to handle user agent detection as you most
probably don't want to write those regular expressions yourself.

```javascript
const http = require('http');
const parser = require('ua-parser-js');

http
  .createServer((req, res) => {
    const ua = parser(req.headers['user-agent']);

    if (
      // iOS 12 browsers
      (ua.os.name == 'iOS' && ua.os.version.startsWith('12')) ||
      // or MacOS 10.14
      (ua.os.name == 'Mac OS' && ua.os.version.startsWith('10.14'))
    ) {
      // Don't send SameSite=None for affected browsers
      res.setHeader('Set-Cookie', '3pcookie=value; Secure');
    } else {
      // Default is the new SameSite=None attribute
      res.setHeader('Set-Cookie', '3pcookie=value; SameSite=None; Secure');
    }

    res.end();
  })
  .listen(process.env.PORT);
```

The benefit of this approach is that it only requires making one change at the
point of setting the cookie. However, the necessary warning here is that user
agent sniffing is inherently fragile and may not catch all of the affected
users.

{% Aside %}
Regardless of the choosen option here, it's advisable to ensure you
have a way of logging the levels of traffic that are going through the legacy
route. Make sure you have a reminder or alert to remove this workaround once
those levels drop below an acceptable threshold for your site.
{% endAside %}

## Support for `SameSite=None` in languages, libraries, and frameworks

The majority of languages and libraries support the `SameSite` attribute for
cookies, however the addition of `SameSite=None` is still relatively new which
means that you may need to work around some of the standard behavior for now.
These are documented in the
[`SameSite` examples repo on GitHub](https://github.com/GoogleChromeLabs/samesite-examples).

## Getting help

Cookies are all over the place and it's rare for any site to have completely
audited where they're set and used, especially once you throw cross-site use
cases in the mix. When you encounter an issue, it may well be the first time
anyone has encountered it - so don't hesitate to reach out:

- Raise an issue on the
  [`SameSite` examples repo on GitHub](https://github.com/GoogleChromeLabs/samesite-examples)
- Post a question on the
  ["samesite" tag on StackOverflow](https://stackoverflow.com/questions/tagged/samesite).
- For issues with Chromium's behavior, raise a bug via the
  [\[SameSite cookies\] issue template](https://bit.ly/2lJMd5c).

_Cookie hero image by
[Cayla1](https://unsplash.com/@calya1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on
[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

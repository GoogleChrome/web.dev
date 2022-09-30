---
title: User preference media features client hints headers
subhead:
  A set of client hint headers allows sites to obtain the user's media preferences optionally
  at request time, allowing servers to inline the right CSS for performance reasons.
authors:
  - thomassteiner
  - beaufortfrancois
date: 2021-08-02
updated: 2022-09-30
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/8O1JKZ6YxdA0IIuYtECB.jpg
alt: Sun and moon
tags:
  - blog
  # - dark-mode
  # - dark-theme
  # - prefers-color-scheme
  # - color-scheme
  - css
---

CSS media queries, and specifically
[user preference media features](https://drafts.csswg.org/mediaqueries-5/#mf-user-preferences) like
[`prefers-color-scheme`](/prefers-color-scheme/) or
[`prefers-reduced-motion`](/prefers-reduced-motion/), have a potentially
[significant impact](https://webkit.org/blog/8892/dark-mode-in-web-inspector/#:~:text=Implementing%20Dark%20Mode%20took%20over%201%2C000%20lines%20of%20CSS.)
on the amount of CSS that needs to be delivered by a page, and on the experience the user is going
to have when the page loads.

Focusing on `prefers-color-scheme`—but highlighting that the reasoning applies to other user
preference media features as well—it is a best practice to not load CSS for the particular
non-matching color scheme in the critical rendering path, and instead to initially only load the
currently relevant CSS. One way of doing so is
[via `<link media>`](/prefers-color-scheme/#loading-strategy).

However, high-traffic sites like [Google Search](https://www.google.com/) that wish to honor user
preference media features like `prefers-color-scheme` and that inline CSS for performance reasons,
need to know about the preferred color scheme (or other user preference media features respectively)
ideally at request time, so that the initial HTML payload already has the right CSS inlined.

Additionally, and specifically for `prefers-color-scheme`, sites by all means want to avoid a
[flash of inaccurate color theme](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/).

The `Sec-CH-Prefers-Color-Scheme` and `Sec-CH-Prefers-Reduced-Motion` client hint headers are the first of a
[series of user preference media features client hints headers](https://wicg.github.io/user-preference-media-features-headers/)
that aims to solve this issue.

### Background on client hints

[HTTP Client Hints](https://datatracker.ietf.org/doc/html/rfc8942) defines an `Accept-CH` response
header that servers can use to advertise their use of request headers for proactive content
negotiation, colloquially referred to as client hints. The
[User Preference Media Features Client Hints Headers](https://wicg.github.io/user-preference-media-features-headers/)
proposal defines a set of client hints aimed at conveying user preference media features. These
client hints are named after the corresponding user preference media feature that they report on.
For example, the currently preferred color scheme as per `prefers-color-scheme` is reported via the
aptly named `Sec-CH-Prefers-Color-Scheme` client hint.

### Background on critical client hints

The client hints proposed in
[User Preference Media Features Client Hints Headers](https://wicg.github.io/user-preference-media-features-headers/)
will presumably most commonly be used as
[Critical Client Hints](https://tools.ietf.org/html/draft-davidben-http-client-hint-reliability-02).
Critical Client Hints are Client Hints which meaningfully change the resulting resource. Such a
resource should be fetched consistently across page loads (including the _initial_ page load) to
avoid jarring user-visible switches.

### Client hint syntax

User preference media features consist of a name (like `prefers-reduced-motion`) and allowed values
(like `no-preference` or `reduce`). Each client hint header field is represented as
[Structured Headers for HTTP](https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-15)
object containing an
[item](https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-15#section-3.3) whose value
is a [string](https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-15#section-3.3.3). For
example, to convey that the user prefers a dark theme and reduced motion, the client hints look like
in the example below.

```bash
GET / HTTP/2
Host: example.com
Sec-CH-Prefers-Color-Scheme: "dark"
Sec-CH-Prefers-Reduced-Motion: "reduce"
```

The CSS equivalent of the information conveyed in the above client hints is
`@media (prefers-color-scheme: dark) {}` and `@media (prefers-reduced-motion: reduce) {}`
respectively.

## Complete list of the client hints

{% Aside %} While the
[User Preference Media Features Client Hints Headers](https://wicg.github.io/user-preference-media-features-headers/)
proposal defines a set of client hints, Chromium at the time of writing only supports
`Sec-CH-Prefers-Color-Scheme` and `Sec-CH-Prefers-Reduced-Motion`. {% endAside %}

The list of the client hints is modeled after the
[user preference media features](https://drafts.csswg.org/mediaqueries-5/#mf-user-preferences) in
[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-color-scheme).

| Client Hint                           | Allowed Values                                                                                                                                                                                                                                                                                                                                                                   | Corresponding User Preference Media Feature                                                             |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Sec-CH-Prefers-Reduced-Motion`       | [`no-preference`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-motion-no-preference), [`reduce`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-motion-reduce)                                                                                                                                                                   | [`prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion)             |
| `Sec-CH-Prefers-Reduced-Transparency` | [`no-preference`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-transparency-no-preference), [`reduce`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-transparency-reduce)                                                                                                                                                       | [`prefers-reduced-transparency`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-transparency) |
| `Sec-CH-Prefers-Contrast`             | [`no-preference`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-no-preference), [`less`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-less), [`more`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-more), [`custom`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-contrast-custom) | [`prefers-contrast`](https://drafts.csswg.org/mediaqueries-5/#prefers-contrast)                         |
| `Sec-CH-Forced-Colors`                | [`active`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-forced-colors-active), [`none`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-forced-colors-none)                                                                                                                                                                                                       | [`forced-colors`](https://drafts.csswg.org/mediaqueries-5/#forced-colors)                               |
| `Sec-CH-Prefers-Color-Scheme`         | [`light`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-color-scheme-light), [`dark`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-color-scheme-dark)                                                                                                                                                                                           | [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)                 |
| `Sec-CH-Prefers-Reduced-Data`         | [`no-preference`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-data-no-preference), [`reduce`](https://drafts.csswg.org/mediaqueries-5/#valdef-media-prefers-reduced-data-reduce)                                                                                                                                                                       | [`prefers-reduced-data`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-data)                 |

## Browser support

The `Sec-CH-Prefers-Color-Scheme` client hint header is supported on Chromium&nbsp;93.
The `Sec-CH-Prefers-Reduced-Motion` client hint header is supported on Chromium&nbsp;108.
Other vendors' feedback, namely [WebKit's](https://lists.webkit.org/pipermail/webkit-dev/2021-May/031856.html)
and [Mozilla's](https://github.com/mozilla/standards-positions/issues/526), is pending.

## Demo of `Sec-CH-Prefers-Color-Scheme`

Try the [demo](https://sec-ch-prefers-color-scheme.glitch.me/) in Chromium&nbsp;93 and notice how
the inlined CSS changes according to the user's preferred color scheme.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/pKAKyrN18CjhAYUNpJyk.png", alt="Sec-CH-Prefers-Color-Scheme: dark", width="800", height="541" %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/6Xujcgyveo0QY0E3LQOF.png", alt="Sec-CH-Prefers-Color-Scheme: light", width="800", height="541" %}

## Demo of `Sec-CH-Prefers-Reduced-Motion`

Try the [demo](https://sec-ch-prefers-reduced-motion.glitch.me/) in Chromium&nbsp;108 and notice how
the inlined CSS changes according to the user's motion preferences.

## How it works

1. The client makes an initial request to the server.
   ```bash
   GET / HTTP/2
   Host: example.com
   ```
1. The server responds, telling the client via `Accept-CH` that it accepts the
   `Sec-CH-Prefers-Color-Scheme` and the `Sec-CH-Prefers-Contrast` Client Hints, out of which as per
   `Critical-CH` it considers `Sec-CH-Prefers-Color-Scheme` a Critical Client Hint that it also
   varies the response on as conveyed by `Vary`.
   ```bash
   HTTP/2 200 OK
   Content-Type: text/html
   Accept-CH: Sec-CH-Prefers-Color-Scheme, Sec-CH-Prefers-Contrast
   Vary: Sec-CH-Prefers-Color-Scheme
   Critical-CH: Sec-CH-Prefers-Color-Scheme
   ```
1. The client then retries the request, telling the server via `Sec-CH-Prefers-Color-Scheme` that it
   has a user preference for dark-schemed content.
   ```bash
   GET / HTTP/2
   Host: example.com
   Sec-CH-Prefers-Color-Scheme: "dark"
   ```
1. The server can then tailor the response to the client's preferences accordingly and, for example,
   inline the CSS responsible for the dark theme into the response body.

## Node.js example

The Node.js example below, written for the popular Express.js framework, shows how
dealing with the `Sec-CH-Prefers-Color-Scheme` client hint header could look like in practice.
This code is what actually powers the [demo](#demo-of-sec-ch-prefers-color-scheme) above.

```js
app.get("/", (req, res) => {
  // Tell the client the server accepts the `Sec-CH-Prefers-Color-Scheme` client hint…
  res.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
  // …and that the server's response will vary based on its value…
  res.set("Vary", "Sec-CH-Prefers-Color-Scheme");
  // …and that the server considers this client hint a _critical_ client hint.
  res.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");
  // Read the user's preferred color scheme from the headers…
  const prefersColorScheme = req.get("sec-ch-prefers-color-scheme");
  // …and send the adequate HTML response with the right CSS inlined.
  res.send(getHTML(prefersColorScheme));
});
```

## Privacy and security considerations

The Chromium team designed and implemented User Preference Media Features Client Hints Headers
using the core principles defined in [Controlling Access to Powerful Web Platform
Features][powerful-apis], including user control, transparency, and ergonomics.

The [Security Considerations](https://datatracker.ietf.org/doc/html/rfc8942#section-4) of HTTP
Client Hints and the
[Security Considerations](https://tools.ietf.org/html/draft-davidben-http-client-hint-reliability-02#section-5)
of Client Hint Reliability likewise apply to this proposal.

## References

- [Spec draft](https://wicg.github.io/user-preference-media-features-headers/)
- [Explainer](https://github.com/WICG/user-preference-media-features-headers#readme)
- [Sec-CH-Prefers-Color-Scheme - Chrome Status entry](https://chromestatus.com/feature/5642300464037888)
- [Sec-CH-Prefers-Color-Scheme - Chromium bug](https://crbug.com/1207897)
- [Sec-CH-Prefers-Reduced-Motion - Chrome Status entry](https://chromestatus.com/feature/5141804190531584)
- [Sec-CH-Prefers-Reduced-Motion - Chromium bug](https://crbug.com/1361871)
- [WebKit thread](https://lists.webkit.org/pipermail/webkit-dev/2021-May/031856.html)
- [Mozilla Standards Position](https://github.com/mozilla/standards-positions/issues/526)
- [Client Hints](https://datatracker.ietf.org/doc/html/rfc8942)
- [Client Hint Reliability](https://tools.ietf.org/html/draft-davidben-http-client-hint-reliability-02)
- [Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-color-scheme)
- [Structured Headers for HTTP](https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-19)

## Acknowledgements

Many thanks for valuable feedback and advice from
[Yoav Weiss](https://github.com/yoavweiss).
Hero image by [Tdadamemd](https://commons.wikimedia.org/wiki/User:Tdadamemd) on
[Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Sun%26Moon_apparent_sizes_(min-max_halved).jpg>).

[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md

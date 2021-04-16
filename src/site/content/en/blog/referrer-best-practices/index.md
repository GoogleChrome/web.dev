---
title: Referer and Referrer-Policy best practices
subhead: Best practices to set your Referrer-Policy and use the referrer in incoming requests.
authors:
  - maudn
date: 2020-07-30
updated: 2020-09-23
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: |
  Consider setting a referrer policy of `strict-origin-when-cross-origin`. It retains much of the referrer's usefulness, while mitigating the risk of leaking data cross-origins.
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## Summary

- Unexpected cross-origin information leakage hinders web users' privacy. A protective referrer
  policy can help.
- Consider setting a referrer policy of `strict-origin-when-cross-origin`. It retains much of the
  referrer's usefulness, while mitigating the risk of leaking data cross-origins.
- Don't use referrers for Cross-Site Request Forgery (CSRF) protection. Use [CSRF
  tokens](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)
  instead, and other headers as an extra layer of security.

{% Aside %} Before we start:

- If you're unsure of the difference between "site" and "origin", check out [Understanding
  "same-site" and "same-origin"](/same-site-same-origin/).
- The `Referer` header is missing an R, due to an original misspelling in the spec. The
  `Referrer-Policy` header and `referrer` in JavaScript and the DOM are spelled correctly. {%
  endAside %}

## Referer and Referrer-Policy 101

HTTP requests may include the optional [`Referer`
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer), which indicates the
origin or web page URL the request was made from. The [`Referrer-Policy`
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) defines what data
is made available in the `Referer` header.

In the example below, the `Referer` header includes the complete URL of the page on `site-one` from
which the request was made.

<figure class="w-figure">
  {% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="HTTP request including a Referer header.", width="800", height="573" %}
</figure>

The `Referer` header might be present in different types of requests:

- Navigation requests, when a user clicks a link
- Subresource requests, when a browser requests images, iframes, scripts, and other resources that a
  page needs.

For navigations and iframes, this data can also be accessed via JavaScript using
`document.referrer`.

The `Referer` value can be insightful. For example, an analytics service might use the value to
determine that 50% of the visitors on `site-two.example` came from `social-network.example`.

But when the full URL including the path and query string is sent in the `Referer` **across
origins**, this can be **privacy-hindering** and pose **security risks** as well. Take a look at
these URLs:

<figure class="w-figure">
  {% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="URLs with paths, mapped to different privacy and security risks.", width="800", height="370" %}
</figure>

URLs #1 to #5 contain private information—sometimes even identifying or sensitive. Leaking these
silently across origins can compromise web users' privacy.

URL #6 is a [capability URL](https://www.w3.org/TR/capability-urls/). You don't want it to fall in
the hands of anyone other than the intended user. If this were to happen, a malicious actor could
hijack this user's account.

**In order to restrict what referrer data is made available for requests from your site, you can set
a referrer policy.**

## What policies are available and how do they differ?

You can select one of eight policies. Depending on the policy, the data available from the `Referer`
header (and `document.referrer`) can be:

- No data (no `Referer` header is present)
- Only the [origin](/same-site-same-origin/#origin)
- The full URL: origin, path, and query string

<figure class="w-figure">
  {% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Data that can be contained in the Referer header and document.referrer.", width="800", height="255" %}
</figure>

Some policies are designed to behave differently depending on the **context**: cross-origin or
same-origin request, security (whether the request destination is as secure as the origin), or both.
This is useful to limit the amount of information shared across origins or to less secure
origins—while maintaining the richness of the referrer within your own site.

Here is an overview showing how referrer policies restrict the URL data available from the Referer
header and `document.referrer`:

<figure class="w-figure">
  {% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="Different referrer policies and their behaviour, depending on the security and cross-origin context.", width="800", height="537" %}
</figure>

MDN provides a [full list of policies and behavior
examples](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#Directives).

Things to note:

- All policies that take the scheme (HTTPS vs. HTTP) into account (`strict-origin`,
  `no-referrer-when-downgrade` and `strict-origin-when-cross-origin`) treat requests from an HTTP
  origin to another HTTP origin the same way as requests from an HTTPS origin to another HTTPS
  origin—even if HTTP is less secure. That's because for these policies, what matters is whether a
  security **downgrade** takes place, i.e. if the request can expose data from an encrypted origin
  to an unencrypted one. An HTTP → HTTP request is unencrypted all along, so there is no downgrade.
  HTTPS → HTTP requests, on the contrary, present a downgrade.
- If a request is **same-origin**, this means that the scheme (HTTPS or HTTP) is the same; hence
  there is no security downgrade.

## Default referrer policies in browsers

_As of July 2020_

**If no referrer policy is set, the browser's default policy will be used.**

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Browser</th>
        <th>Default <code>Referrer-Policy</code> / Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>
          Planning to switch to <code>strict-origin-when-cross-origin</code> in <a href="https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default">version 85</a> (previously <code>no-referrer-when-downgrade</code>)
        </td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">Considering </a><code>strict-origin-when-cross-origin</code>
            </li>
            <li><code>strict-origin-when-cross-origin</code> in Private Browsing and for trackers</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Edge</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li><a href="https://github.com/privacycg/proposals/issues/13">Experimenting</a> with <code>strict-origin-when-cross-origin</code>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>
          Similar to <code>strict-origin-when-cross-origin</code>. See
          <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">Preventing Tracking Prevention Tracking</a> for details.
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Setting your referrer policy: best practices

{% Aside 'objective' %} Explicitly set a privacy-enhancing policy, such as
`strict-origin-when-cross-origin`(or stricter). {% endAside %}

There are different ways to set referrer policies for your site:

- As an HTTP header
- Within your
  [HTML](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML)
- From JavaScript on a [per-request
  basis](https://javascript.info/fetch-api#referrer-referrerpolicy)

You can set different policies for different pages, requests or elements.

The HTTP header and the meta element are both page-level. The precedence order when determining an
element's effective policy is:

1. Element-level policy
1. Page-level policy
1. Browser default

**Example:**

`index.html`:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

The image will be requested with a `no-referrer-when-downgrade` policy, while all other subresource
requests from this page will follow the `strict-origin-when-cross-origin` policy.

## How to see the referrer policy?

[securityheaders.com](https://securityheaders.com/) is handy to determine the policy a specific site
or page is using.

You can also use the developer tools of Chrome, Edge, or Firefox to see the referrer policy used for
a specific request. At the time of this writing, Safari doesn't show the `Referrer-Policy` header
but does show the `Referer` that was sent.

<figure class="w-figure">
  {% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="A screenshot of the Network panel of Chrome DevTools, showing Referer and Referrer-Policy.", width="800", height="416" %}
  <figcaption class="w-figcaption">
    Chrome DevTools, <b>Network</b> panel with a request selected.
  </figcaption>
</figure>

## Which policy should you set for your website?

Summary: Explicitly set a privacy-enhancing policy such as `strict-origin-when-cross-origin` (or
stricter).

### Why "explicitly"?

If no referrer policy is set, the browser's default policy will be used—in fact, websites often
defer to the browser's default. But this is not ideal, because:

- Browser default policies are either `no-referrer-when-downgrade`,
  `strict-origin-when-cross-origin`, or stricter—depending on the browser and mode
  (private/incognito). So your website won't behave predictably across browsers.
- Browsers are adopting stricter defaults such as `strict-origin-when-cross-origin` and mechanisms
  such as [referrer trimming](https://github.com/privacycg/proposals/issues/13) for cross-origin
  requests. Explicitly opting into a privacy-enhancing policy before browser defaults change gives
  you control and helps you run tests as you see fit.

### Why `strict-origin-when-cross-origin` (or stricter)?

You need a policy that is secure, privacy-enhancing, and useful—what "useful" means depends on what
you want from the referrer:

- **Secure**: if your website uses HTTPS ([if not, make it a
  priority](/why-https-matters/)), you don't want your website's URLs to leak in
  non-HTTPS requests. Since anyone on the network can see these, this would expose your users to
  person-in-the-middle-attacks. The policies `no-referrer-when-downgrade`,
  `strict-origin-when-cross-origin`, `no-referrer` and `strict-origin` solve this problem.
- **Privacy-enhancing**: for a cross-origin request, `no-referrer-when-downgrade` shares the full
  URL—this is not privacy-enhancing. `strict-origin-when-cross-origin` and `strict-origin` only
  share the origin, and `no-referrer` shares nothing at all. This leaves you with
  `strict-origin-when-cross-origin`, `strict-origin`, and `no-referrer` as privacy-enhancing
  options.
- **Useful**: `no-referrer` and `strict-origin` never share the full URL, even for same-origin
  requests—so if you need this, `strict-origin-when-cross-origin` is a better option.

All of this means that **`strict-origin-when-cross-origin`** is generally a sensible choice.

**Example: Setting a `strict-origin-when-cross-origin` policy:**

`index.html`:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

Or server-side, for example in Express:

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### What if `strict-origin-when-cross-origin` (or stricter) doesn't accommodate all your use cases?

In this case, take a **progressive approach**: set a protective policy like
`strict-origin-when-cross-origin` for your website and if need be, a more permissive policy for
specific requests or HTML elements.

### Example: element-level policy

`index.html`:

```html/6
<head>
  <!-- document-level policy: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- policy on this <a> element: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

Note that Safari/WebKit may cap `document.referrer` or the `Referer` header for
[cross-site](/same-site-same-origin/#same-site-cross-site) requests.
See [details](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).

### Example: request-level policy

`script.js`:

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### What else should you consider?

Your policy should depend on your website and use cases—this is up to you, your team, and your
company. If some URLs contain identifying or sensitive data, set a protective policy.

{% Aside 'warning' %} Data that might not look sensitive to you can be sensitive for your users, or
is simply not data they want or expect to silently leak cross-origin. {% endAside %}

## Using the referrer from incoming requests: best practices

### What to do if your site's functionality uses the referrer URL of incoming requests?

#### Protect users' data

The `Referer` may contain private, personal, or identifying data—so make sure you treat it as such.

#### Keep in mind that the `Referer` you receive may change

Using the referrer from incoming cross-origin requests has a few limitations:

- If you have no control over the request emitter's implementation, you can't make assumptions about
  the `Referer` header (and `document.referrer`) you receive. The request emitter may decide anytime
  to switch to a `no-referrer` policy, or more generally to a stricter policy than what they used
  before—meaning you'll get less data via the `Referer` than you used to.
- Browsers are increasingly using the Referrer-Policy `strict-origin-when-cross-origin` by default.
  This means that you may now receive only the origin (instead of full referrer URL) in incoming
  cross-origin requests, if the site that sends these has no policy set.
- Browsers may change the way they manage `Referer`; for example, in the future, they may decide to
  always trim referrers to origins in cross-origin subresource requests, in order to protect user
  privacy.
- The `Referer` header (and `document.referrer`) may contain more data than you need, for example a
  full URL when you only want to know if the request is cross-origin.

#### Alternatives to `Referer`

You may need to consider alternatives if:

- An essential functionality of your site uses the referrer URL of incoming cross-origin requests;
- And/or if your site is not receiving anymore the part of the referrer URL it needs in a
  cross-origin request. This happens when the request emitter changed their policy or when they have
  no policy set and the browser default's policy changed (like in [Chrome
  85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)).

To define alternatives, analyze first what part of the referrer you're using.

**If you only need the origin (`https://site-one.example`):**

- If you're using the referrer in a script that has top-level access to the page,
  `window.location.origin` is an alternative.
- If available, headers like
  [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) and
  [`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) give
  you the `Origin` or describe whether the request is cross-origin, which may be exactly what you need.

**If you need other elements of the URL (path, query parameters…):**

- Request parameters may address your use case and this saves you the work of parsing the
  referrer.
- If you're using the referrer in a script that has top-level access to the page,
  `window.location.pathname` may be an alternative. Extract only the path section of the URL and
  pass it on as an argument, so any potentially sensitive information in the URL parameters isn't
  passed on.

**If you can't use these alternatives:**

- Check if your systems can be changed to expect the request emitter (`site-one.example`) to
  explicitly set the information you need in a configuration of some sort. Pro: more explicit, more
  privacy-preserving for `site-one.example` users, more future-proof. Con: potentially more work
  from your side or for your system's users.
- Check whether the site that emits the requests may agree to set a per-element or per-request
  Referrer-Policy of `no-referrer-when-downgrade`. Con: potentially less privacy-preserving for
  `site-one.example` users, potentially not supported in all browsers.

### Cross-Site Request Forgery (CSRF) protection

Note that a request emitter can always decide not to send the referrer by setting a `no-referrer`
policy (and a malicious actor could even spoof the referrer).

Use [CSRF
tokens](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)
as your primary protection. For extra protection, use
[SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites)—and instead
of `Referer`, use headers such as
[`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) (available on POST and
CORS requests) and
[`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) (if
available).

### Logging

Make sure to protect users' personal or sensitive data that may be in the `Referer`.

If you're only using the origin, check if the
[`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) header could be an
alternative. This may give you the information that you need for debugging purposes in a simpler way
and without needing to parse the referrer.

### Payments

Payment providers may rely on the `Referer` header of incoming requests for security checks.

For example:

- The user clicks a **Buy** button on `online-shop.example/cart/checkout`.
- `online-shop.example` redirects to `payment-provider.example` to manage the transaction.
- `payment-provider.example` checks the `Referer` of this request against a list of allowed
  `Referer` values set up by the merchants. If it doesn't match any entry in the list,
  `payment-provider.example` rejects the request. If it does match, the user can proceed to the
  transaction.

#### Best practices for payment flow security checks

**Summary: as a payment provider, you can use the `Referer` as a basic check
against naive attacks—but you should absolutely have another, more
reliable verification method in place.**

The `Referer` header alone isn't a reliable basis for a check: the requesting site, whether they're
a legitimate merchant or not, can set a `no-referrer` policy which will make the `Referer`
information unavailable to the payment provider. However, as a payment provider, looking at the
`Referer` may help you catch naive attackers who did not set a `no-referrer` policy. So you can
decide to use the `Referer` as a first basic check. If you do so:

- **Do not expect the `Referer` to always be present; and if it's present, only check against the
  piece of data it will include at the minimum: the origin**. When setting the list of allowed
  `Referer` values, make sure that no path is included, but only the origin. Example: the allowed
  `Referer` values for `online-shop.example` should be `online-shop.example`, not
  `online-shop.example/cart/checkout`. Why? Because by expecting either no `Referer` at all or a
  `Referer` value that is the origin of the requesting website, you prevent unexpected errors since
  you're **not making assumptions about the `Referrer-Policy`** your merchant has set or about the
  browser's behavior if the merchant has no policy set. Both the site and the browser could strip
  the `Referer` sent in the incoming request to only the origin or not send the `Referer` at all.
- If the `Referer` is absent or if it's present and your basic `Referer` origin check was
  successful: you can move onto your other, more reliable verification method (see below).

**What is a more reliable verification method?**

One reliable verification method is to let the requester **hash the request parameters** together
with a unique key. As a payment provider, you can then **calculate the same hash on your side** and
only accept the request if it matches your calculation.

**What happens to the `Referer` when an HTTP merchant site with no referrer policy redirects to an
HTTPS payment provider?**

No `Referer` will be visible in the request to the HTTPS payment provider, because [most
browsers](#default-referrer-policies-in-browsers) use `strict-origin-when-cross-origin` or
`no-referrer-when-downgrade` by default when a website has no policy set. Also note that [Chrome's
change to a new default
policy](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) won't
change this behaviour.

{% Aside %}

If your website uses HTTP, [migrate to HTTPS](/why-https-matters/).

{% endAside %}

## Conclusion

A protective referrer policy is a great way to give your users more privacy.

To learn more about different techniques to protect your users, check out web.dev's [Safe and
secure](/secure/) collection!

_With many thanks for contributions and feedback to all reviewers - especially Kaustubha Govind,
David Van Cleve, Mike West, Sam Dutton, Rowan Merewood, Jxck and Kayce Basques._

## Resources

- [Understanding "same-site" and "same-origin"](/same-site-same-origin/)
- [A new security header: Referrer Policy
  (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [Referrer-Policy on
  MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
- [Referer header: privacy and security concerns on
  MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Chrome change: Blink intent to
  implement](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Chrome change: Blink intent to
  ship](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Chrome change: status entry](https://www.chromestatus.com/feature/6251880185331712)
- [Chrome change: 85 beta
  blogpost](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [Referrer trimming GitHub thread: what different browsers
  do](https://github.com/privacycg/proposals/issues/13)
- [Referrer-Policy Spec](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)

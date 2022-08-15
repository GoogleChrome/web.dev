---
layout: post
title: Security headers quick reference
subhead: Learn more about headers that can keep your site safe and quickly look up the most important details.
authors:
  - agektmr
  - maudn
  - arturjanc
date: 2021-05-18
updated: 2022-02-14
hero: image/YLflGBAPWecgtKJLqCJHSzHqe2J2/E3BVnrBFNV6w2Uqxn3bQ.jpg
alt: A keylock in front of compressed code
description: |
  This article lists the most important security headers you can use to protect
  your website. Use it to understand web-based security features, learn how to
  implement them on your website, and as a reference for when you need a reminder.
tags:
  - blog
  - security
---

This article lists the most important security headers you can use to protect
your website. Use it to understand web-based security features, learn how to
implement them on your website, and as a reference for when you need a reminder.

Security headers recommended for websites that handle sensitive user data:
: [Content Security Policy (CSP)](#csp)
: [Trusted Types](#tt)

Security headers recommended for all websites:
: [X-Content-Type-Options](#xcto)
: [X-Frame-Options](#xfo)
: [Cross-Origin Resource Policy (CORP)](#corp)
: [Cross-Origin Opener Policy (COOP)](#coop)
: [HTTP Strict Transport Security (HSTS)](#hsts)

Security headers for websites with advanced capabilities:
: [Cross-Origin Resource Sharing (CORS)](#cors)
: [Cross-Origin Embedder Policy (COEP)](#coep)

{% Details %}
{% DetailsSummary %}

Known threats on the web

Before diving into security headers, learn about known threats on the web
and why you'd want to use these security headers.

{% endDetailsSummary %}

Before diving into security headers, learn about known threats on the web
and why you'd want to use these security headers.

### Protect your site from injection vulnerabilities

Injection vulnerabilities arise when untrusted data processed by your
application can affect its behavior and, commonly, lead to the execution of
attacker-controlled scripts. The most common vulnerability caused by injection
bugs is [cross-site
scripting](https://portswigger.net/web-security/cross-site-scripting) (XSS) in
its various forms, including [reflected
XSS](https://portswigger.net/web-security/cross-site-scripting/reflected),
[stored XSS](https://portswigger.net/web-security/cross-site-scripting/stored),
[DOM-based
XSS](https://portswigger.net/web-security/cross-site-scripting/dom-based), and
other variants.

An XSS vulnerability can typically give an attacker complete access to user data
processed by the application and any other information hosted in the same [web
origin](/same-site-same-origin/#origin).

Traditional defenses against injections include consistent use of autoescaping
HTML template systems, avoiding the use of [dangerous JavaScript
APIs](https://domgo.at/cxss/sinks), and properly processing user data by hosting
file uploads in a separate domain and sanitizing user-controlled HTML.

* Use [Content Security Policy (CSP)](#csp) to control which scripts can be
  executed by your application to mitigate the risk of injections.
* Use [Trusted Types](#tt) to enforce sanitization of data passed into dangerous
  JavaScript APIs.
* Use [X-Content-Type-Options](#xcto) to prevent the browser from
  misinterpreting the MIME types of your website's resources, which can lead to
  script execution.

### Isolate your site from other websites

The openness of the web allows websites to interact with each other in ways that
can violate an application's security expectations. This includes unexpectedly
making authenticated requests or embedding data from another application in the
attacker's document, allowing the attacker to modify or read application data.

Common vulnerabilities that undermine web isolation include
[clickjacking](https://portswigger.net/web-security/clickjacking), [cross-site
request forgery](https://portswigger.net/web-security/csrf) (CSRF), [cross-site
script inclusion](https://www.scip.ch/en/?labs.20160414) (XSSI), and various
[cross-site leaks](https://xsleaks.dev).

* Use [X-Frame-Options](#xfo) to prevent your documents from being embedded by a
  malicious website.
* Use [Cross-Origin Resource Policy (CORP)](#corp) to prevent your website's
  resources from being included by a cross-origin website.
* Use [Cross-Origin Opener Policy (COOP)](#coop) to protect your website's
  windows from interactions by malicious websites.
* Use [Cross-Origin Resource Sharing (CORS)](#cors) to control access to your
  website's resources from cross-origin documents.

[Post-Spectre Web
Development](https://www.w3.org/TR/post-spectre-webdev/) is a great read
if you are interested in these headers.

### Build a powerful website securely

[Spectre](https://ieeexplore.ieee.org/document/8835233) puts any data loaded
into the same [browsing context group](/why-coop-coep/) potentially readable
despite [same-origin policy](/same-origin-policy/). Browsers restrict features
that may possibly exploit the vulnerability behind a special environment called
"[cross-origin isolation](/coop-coep/)". With cross-origin isolation, you can
use powerful features such as `SharedArrayBuffer`.

* Use [Cross-Origin Embedder Policy (COEP)](#coep) along with [COOP](#coop) to
  enable cross-origin isolation.

### Encrypt traffic to your site

Encryption issues appear when an application does not fully encrypt data in
transit, allowing eavesdropping attackers to learn about the user's interactions
with the application.

Insufficient encryption can arise in the following cases: not using HTTPS,
[mixed content](/what-is-mixed-content/), setting cookies without the [`Secure`
attribute](https://developer.mozilla.org/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
(or [`__Secure`
prefix](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Cookie_prefixes)),
or [lax CORS validation
logic](https://blog.detectify.com/2018/04/26/cors-misconfigurations-explained/).

* Use [HTTP Strict Transport Security (HSTS)](#hsts) to consisitently serve your
  contents through HTTPS.

{% endDetails %}

## Content Security Policy (CSP) {: #csp}

[Cross-Site Scripting
(XSS)](https://www.google.com/about/appsecurity/learning/xss/) is an attack
where a vulnerability on a website allows a malicious script to be injected and
executed.

`Content-Security-Policy` provides an added layer to mitigate XSS attacks by
restricting which scripts can be executed by the page.

It's recommended that you enable strict CSP using one of the following approaches:

* If you render your HTML pages on the server, use **a nonce-based strict CSP**.
* If your HTML has to be served statically or cached, for example if it's a
  single-page application, use **a hash-based strict CSP**.

{% Label %}Example usage: A nonce-based CSP{% endLabel%}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

{% Details %}
{% DetailsSummary %}

How to use CSP

{% endDetailsSummary %}

### Recommended usages

{% Aside %}

A CSP can be an *extra* protection against XSS attacks; you should still make
sure to escape (and sanitize) user input.

{% endAside %}

#### 1. Use a nonce-based strict CSP {: #nonce-based-csp}

If you render your HTML pages on the server, use **a nonce-based strict CSP**.

{% Aside 'caution' %}

A nonce is a random number used only once. A nonce-based CSP is only secure if
you can generate a different nonce for each response. If you can't do this, use
[a hash-based CSP](#hash-based-csp) instead.

{% endAside %}

Generate a new script nonce value for every request on the server side and set
the following header:

{% Label %}server configuration file{% endLabel %}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

In HTML, in order to load the scripts, set the `nonce` attribute of all
`<script>` tags to the same `{RANDOM1}` string.

{% Label %}index.html{% endLabel %}

```html
<script nonce="{RANDOM1}" src="https://example.com/script1.js"></script>
<script nonce="{RANDOM1}">
  // Inline scripts can be used with the `nonce` attribute.
</script>
```

[Google Photos](https://photos.google.com/) is a good nonce-based strict CSP
example. Use DevTools to see how it's used.

#### 2. Use a hash-based strict CSP {: #hash-based-csp}

If your HTML has to be served statically or cached, for example if you're
building a single-page application, use **a hash-based strict CSP**.

{% Label %}server configuration file{% endLabel %}

```http
Content-Security-Policy:
  script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

In HTML, you'll need to inline your scripts in order to apply a hash-based
policy, because [most browsers don't support hashing external
scripts](https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned).

{% Label %}index.html{% endLabel %}

```html
<script>
...// your script1, inlined
</script>
<script>
...// your script2, inlined
</script>
```

To load external scripts, read "Load sourced scripts dynamically" under
[Option B: Hash-based CSP Response Header](/strict-csp/#hash-based-csp) section.

[CSP Evaluator](https://csp-evaluator.withgoogle.com/) is a good tool to
evaluate your CSP, but at the same time a good nonce-based strict CSP example.
Use DevTools to see how it's used.

### Supported browsers

{% BrowserCompat 'http.headers.csp.Content-Security-Policy' %}

{% Aside 'gotchas' %}

* `https:` is a fallback for Safari and `unsafe-inline` is a fallback for very
  old browser versions. `https:` and `unsafe-inline` don't make your policy less
  safe because they will be ignored by browsers who support `strict-dynamic`.
  Read more in [Add fallbacks to support Safari and older
  browsers](/strict-csp/#step-4:-add-fallbacks-to-support-safari-and-older-browsers).
* Safari does *not* support `strict-dynamic` yet. But a strict CSP like in the
  examples above is safer than an allowlist CSP (and much safer than no CSP at
  all) for all of your users. Even in Safari, a strict CSP protects your site
  from some types of XSS attacks, because the presence of the CSP disallows
  certain unsafe patterns.

{% endAside %}

### Other things to note about CSP

* [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
  directive protects your site from clickjacking—a risk that arises if you allow
  untrusted sites to embed yours. If you prefer simpler solution, you can use
  [`X-Frame-Options`](#xfo) to block being loaded, but `frame-ancestors` gives
  you an advanced configuration to only allow specific origins as embedders.
* You may have used [a CSP to ensure that all of your site's resources are
  loaded over HTTPS](/fixing-mixed-content/#content-security-policy). This has
  become less relevant: nowadays, most browsers block
  [mixed-content](/what-is-mixed-content/).
* You can also set a CSP in [report-only
  mode](/strict-csp/#step-2:-set-a-strict-csp-and-prepare-your-scripts).
* If you can't set a CSP as a header server-side, you can also set it as a meta
  tag. Note that you can't use **report-only** mode for meta tags (though
  [this may change](https://github.com/w3c/webappsec-csp/issues/277)).

### Learn more

* [Mitigate XSS with a Strict Content Security Policy (CSP)](/strict-csp)
* [Content Security Policy Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

{% endDetails %}

## Trusted Types {: #tt}

[DOM-based
XSS](https://portswigger.net/web-security/cross-site-scripting/dom-based) is an
attack where a malicious data is passed into a sink that supports dynamic code
execution such as `eval()` or `.innerHTML`.

Trusted Types provide the tools to write, security review, and maintain
applications free of DOM XSS. They can be enabled via [CSP](#csp) and make
JavaScript code secure by default by limiting dangerous web APIs to only accept
a special object—a Trusted Type.

To create these objects you can define security policies in which you can ensure
that security rules (such as escaping or sanitization) are consistently applied
before the data is written to the DOM. These policies are then the only places
in code that could potentially introduce DOM XSS.

{% Label %}Example usages{% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script'
```

```javascript
// Feature detection
if (window.trustedTypes && trustedTypes.createPolicy) {
  // Name and create a policy
  const policy = trustedTypes.createPolicy('escapePolicy', {
    createHTML: str => {
      return str.replace(/\</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
}
```

```javascript
// Assignment of raw strings is blocked by Trusted Types.
el.innerHTML = 'some string'; // This throws an exception.

// Assignment of Trusted Types is accepted safely.
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
```

{% Details %}
{% DetailsSummary %}

How to use Trusted Types

{% endDetailsSummary %}

### Recommended usages

1. Enforce Trusted Types for dangerous DOM sinks
    {% Label %}CSP and Trusted Types header:{% endLabel %}

    ```http
    Content-Security-Policy: require-trusted-types-for 'script'
    ```

    Currently `'script'` is the only acceptable value for
    `require-trusted-types-for` directive.

    Of course, you can combine Trusted Types with other CSP directives:

    {% Label %}
    Merging a nonce-based CSP from above with Trusted Types:
    {% endLabel %}

    ```http
    Content-Security-Policy:
      script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
      object-src 'none';
      base-uri 'none';
      require-trusted-types-for 'script';
    ```

    {% Aside %}

    You may limit allowed Trusted Types policy names by setting an additional
    `trusted-types` directive (for example, `trusted-types myPolicy`). However, this is
    not a requirement.

    {% endAside %}

2. Define a policy

    {% Label %}Policy:{% endLabel %}

    ```javascript
    // Feature detection
    if (window.trustedTypes && trustedTypes.createPolicy) {
      // Name and create a policy
      const policy = trustedTypes.createPolicy('escapePolicy', {
        createHTML: str => {
          return str.replace(/\</g, '&lt;').replace(/>/g, '&gt;');
        }
      });
    }
    ```

    {% Aside %}

    You can define policies with arbitrary names unless you limit the names of
    allowed Trusted Types policies by setting the `trusted-types` directive.

    {% endAside %}

3. Apply the policy

    {% Label %}Use the policy when writing data to the DOM:{% endLabel %}

    ```javascript
    // Assignment of raw strings are blocked by Trusted Types.
    el.innerHTML = 'some string'; // This throws an exception.

    // Assignment of Trusted Types is accepted safely.
    const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
    el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
    ````

    With `require-trusted-types-for 'script'`, using a trusted type is a
    requirement. Using any dangerous DOM API with a string will result in an
    error.

### Supported browsers

{% BrowserCompat 'http.headers.csp.Content-Security-Policy.trusted-types' %}

### Learn more

* [Prevent DOM-based cross-site scripting vulnerabilities with Trusted
  Types](/trusted-types/)
* [CSP: require-trusted-types-for - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
* [CSP: trusted-types - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
* [Trusted Types demo](https://www.compass-demo.com/trusted-types/)—open DevTools Inspector and see
  what is happening

{% endDetails %}

## X-Content-Type-Options {: #xcto}

When a malicious HTML document is served from your domain (for example, if an
image uploaded to a photo service contains valid HTML markup), some browsers
will treat it as an active document and allow it to execute scripts in the
context of the application, leading to a [cross-site scripting
bug](https://www.google.com/about/appsecurity/learning/xss/).

`X-Content-Type-Options: nosniff` prevents it by instructing the browser that
the [MIME type](https://mimesniff.spec.whatwg.org/#introduction) set in the
`Content-Type` header for a given response is correct. This header is
recommended for **all of your resources**.

{% Label %}Example usage{% endLabel%}

```http
X-Content-Type-Options: nosniff
```

{% Details %}
{% DetailsSummary %}

How to use X-Content-Type-Options

{% endDetailsSummary %}

### Recommended usages

`X-Content-Type-Options: nosniff` is recommended for all resources served from
your server along with the correct `Content-Type` header.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/IWqRWe9R1mOJImmMbLoM.png",
alt="X-Content-Type-Options: nosniff", width="800", height="237" %}

{% Label %}Example headers sent with a document HTML{% endLabel %}

```http
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
```

### Supported browsers

{% BrowserCompat 'http.headers.X-Content-Type-Options' %}

### Learn more

* [X-Content-Type-Options - HTTP MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)

{% endDetails %}

## X-Frame-Options {: #xfo}

If a malicious website can embed your site as an iframe, this may allow
attackers to invoke unintended actions by the user with
[clickjacking](https://portswigger.net/web-security/clickjacking). Also, in some
cases [Spectre-type
attacks](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) give
malicious websites a chance to learn about the contents of an embedded document.

`X-Frame-Options` indicates whether or not a browser should be allowed to render
a page in a `<frame>`, `<iframe>`, `<embed>`, or `<object>`. **All documents**
are recommended to send this header to indicate whether they allow being
embedded by other documents.

{% Aside %}

If you need more granular control such as allowing only a specific origin to
embed the document, use the [CSP](#csp)
[`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
directive.

{% endAside %}

{% Label %}Example usage{% endLabel%}

```http
X-Frame-Options: DENY
```

{% Details %}
{% DetailsSummary %}

How to use X-Frame-Options

{% endDetailsSummary %}

### Recommended usages

All documents that are not designed to be embedded should use `X-Frame-Options` header.

You can try how the following configurations affect loading an iframe on [this
demo](https://cross-origin-isolation.glitch.me/). Change the `X-Frame-Options`
dropdown menu and click the **Reload the iframe** button.

#### Protects your website from being embedded by any other websites

Deny being embedded by any other documents.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2ZM5obgGK38CMcZ75PkH.png",
alt="X-Frame-Options: DENY", width="800", height="237" %}

```http
X-Frame-Options: DENY
```

#### Protects your website from being embedded by any cross-origin websites

Allow being embedded only by same-origin documents.

```http
X-Frame-Options: SAMEORIGIN
```

{% Aside 'gotchas' %}

Documents being embeddable by default means the web developers need to
explicitly send `DENY` or `SAMEORIGIN` to stop being embedded and protect
themselves from side-channel attacks. The Chrome team is considering switching
to block document embeds by default so that websites will be secure even if they
don't explicitly set the header. In that new world, documents would need to
explicitly opt-in to be embedded.

{% endAside %}

### Supported browsers

{% BrowserCompat 'http.headers.X-Frame-Options' %}

### Learn more

* [X-Frame-Options - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options)

{% endDetails %}

## Cross-Origin Resource Policy (CORP) {: #corp}

An attacker can embed resources from another origin, for example from your site,
to learn information about them by exploiting web-based [cross-site
leaks](https://xsleaks.dev/).

`Cross-Origin-Resource-Policy` mitigates this risk by indicating the set of
websites it can be loaded by. The header takes one of three values:
`same-origin`, `same-site`, and `cross-origin`. **All resources** are
recommended to send this header to indicate whether they allow being loaded by
other websites.

{% Label %}Example usage{% endLabel%}

```http
Cross-Origin-Resource-Policy: same-origin
```

{% Details %}
{% DetailsSummary %}

How to use CORP

{% endDetailsSummary %}

### Recommended usages

It is recommended that **all** resources are served with one of the following
three headers.

You can try how the following configurations affect loading resources under a
[`Cross-Origin-Embedder-Policy: require-corp` environment](#coep) on [this
demo](https://cross-origin-isolation.glitch.me/?coep=require-corp&). Change the
**Cross-Origin-Resource-Policy** dropdown menu and click the **Reload the
iframe** or **Reload the image** button to see the effect.

#### Allow resources to be loaded `cross-origin`

It's recommended that CDN-like services apply `cross-origin` to resources
(since they are usually loaded by cross-origin pages), unless they are already served
through [CORS](#cors) which has a similar effect.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/qP2mspVMC6RazxDjWUrL.png",
alt="Cross-Origin-Resource-Policy: cross-origin", width="800", height="234" %}

```http
Cross-Origin-Resource-Policy: cross-origin
```

#### Limit resources to be loaded from the `same-origin`

`same-origin` should be applied to resources that are intended to be loaded only
by same-origin pages. You should apply this to resources that include sensitive
information about the user, or responses of an API that is intended to be called
only from the same origin.

Keep in mind that resources with this header can still be loaded directly, for
example by navigating to the URL in a new browser window. Cross-Origin Resource
Policy only protects the resource from being embedded by other websites.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/7UzYMWsbKkh89m5ZImvj.png",
alt="Cross-Origin-Resource-Policy: same-origin", width="800", height="238" %}

```http
Cross-Origin-Resource-Policy: same-origin
```

#### Limit resources to be loaded from the `same-site`

`same-site` is recommended to be applied to resources that are similar to above
but are intended to be loaded by other subdomains of your site.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/R9yNRGSJ4xABc560WRJI.png",
alt="Cross-Origin-Resource-Policy: same-site", width="800", height="233" %}

```http
Cross-Origin-Resource-Policy: same-site
```

{% Aside %}

To learn more about the difference between same-origin and same-site, check out
[Understanding "same-site" and "same-origin"](/same-site-same-origin/).

{% endAside %}

### Supported browsers

{% BrowserCompat 'http.headers.Cross-Origin-Resource-Policy' %}

### Learn more

* [Consider deploying cross-origin resource policy](https://resourcepolicy.fyi/)
* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)

{% endDetails %}

## Cross-Origin Opener Policy (COOP) {: #coop}

An attacker's website can open another site in a popup window to learn
information about it by exploiting web-based [cross-site
leaks](https://xsleaks.dev/). In some cases, this may also allow the
exploitation of side-channel attacks based on
[Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)).

The `Cross-Origin-Opener-Policy` header provides a way for a document to isolate
itself from cross-origin windows opened through `window.open()` or a link with
`target="_blank"` without `rel="noopener"`. As a result, any cross-origin opener
of the document will have no reference to it and will not be able to interact
with it.

{% Label %}Example usage{% endLabel%}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

{% Details %}
{% DetailsSummary %}

How to use COOP

{% endDetailsSummary %}

### Recommended usages

You can try how the following configurations affect communication with a
cross-origin popup window on [this demo](https://cross-origin-isolation.glitch.me/).
Change the **Cross-Origin-Opener-Policy** dropdown menu for both the document
and the popup window, click the **Open a popup** button then click **Send a
postMessage** to see if the message is actually delivered.

#### Isolate a document from cross-origin windows

Setting `same-origin` puts the document to be isolated from cross-origin
document windows.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/mSDG9auD7r5asxGJvJjg.png",
alt="Cross-Origin-Opener-Policy: same-origin", width="800",
height="235" %}

```http
Cross-Origin-Opener-Policy: same-origin
```

#### Isolate a document from cross-origin windows but allow popups

Setting `same-origin-allow-popups` allows a document to retain a reference to
its popup windows unless they set COOP with `same-origin` or
`same-origin-allow-popups`. This means `same-origin-allow-popups` can still
protect the document from being referenced when opened as a popup window, but
allow it to communicate with its own popups.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2uJZ0s2VnjxJUcBI2Ol9.png",
alt="Cross-Origin-Opener-Policy: same-origin-allow-popups", width="800",
height="233" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

#### Allow a document to be referenced by cross-origin windows

`unsafe-none` is the default value but you can explicitly indicate that this
document can be opened by a cross-origin window and retain mutual access.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/oSco89ZT3RP7gZzNKDjY.png",
alt="Cross-Origin-Opener-Policy: unsafe-none", width="800", height="233" %}

{% Aside 'gotchas' %}

`unsafe-none` being the default means the web developers need to send
`same-origin` or `same-origin-allow-popups` explicitly to protect their website
from side-channel attacks.

{% endAside %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

{% Aside %}

Features such as `SharedArrayBuffer` or
`performance.measureUserAgentSpecificMemory()` are disabled by default. Some
browsers allow you to use them in "cross-origin isolated" contexts, which
require you to set [COOP](#coop) and [COEP](#coep) headers.

To learn more, read [Making your website "cross-origin isolated" using COOP and
COEP](/coop-coep/).

{% endAside %}

#### Report patterns incompatible with COOP

You can receive reports when COOP prevents cross-window interactions with the
Reporting API.

```http
Cross-Origin-Opener-Policy: same-origin; report-to="coop"
```

COOP also supports a report-only mode so you can receive reports without
actually blocking communication between cross-origin documents.

```http
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop"
```

### Supported browsers

{% BrowserCompat 'http.headers.Cross-Origin-Opener-Policy' %}

### Learn more

* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)

{% endDetails %}

## Cross-Origin Resource Sharing (CORS) {: #cors}

Unlike other items in this article, Cross-Origin Resource Sharing (CORS) is not
a header, but a browser mechanism that requests and permits access to
cross-origin resources.

By default, browsers enforce [the same-origin policy](/same-origin-policy/) to
prevent a web page from accessing cross-origin resources. For example, when a
cross-origin image is loaded, even though it's displayed on the web page
visually, the JavaScript on the page doesn't have access to the image's data.
The resource provider can relax restrictions and allow other websites to read
the resource by opting-in with CORS.

{% Label %}Example usage{% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

{% Details %}
{% DetailsSummary %}

How to use CORS

{% endDetailsSummary %}

Before looking into how to configure CORS, it's helpful to understand the
distinction between request types. Depending on request details, a request will
be classified as a **simple request** or a **preflighted request**.

Criteria for a simple request:

* The method is `GET`, `HEAD`, or `POST`.
* The custom headers only include `Accept`, `Accept-Language`,
  `Content-Language`, and `Content-Type`.
* The `Content-Type` is `application/x-www-form-urlencoded`,
  `multipart/form-data`, or `text/plain`.

Everything else is classified as a preflighted request. For more details,
check out [Cross-Origin Resource Sharing (CORS) - HTTP |
MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS#simple_requests).

### Recommended usages

#### Simple request

When a request meets the simple request criteria, the browser sends a
cross-origin request with an `Origin` header that indicates the requesting
origin.

{% Label %}Example request header{% endLabel %}

```http
Get / HTTP/1.1
Origin: https://example.com
```

{% Label %}Example response header{% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

* `Access-Control-Allow-Origin: https://example.com` indicates that the
  `https://example.com` can access the contents of the response. Resources meant
  to be readable by any site can set this header to `*`, in which case the
  browser will only require the request to be made [without
  credentials](https://developer.mozilla.org/docs/Web/API/Request/credentials#value).
* `Access-Control-Allow-Credentials: true` indicates that requests which carry
  credentials (cookies) are allowed to load the resource. Otherwise,
  authenticated requests will be rejected even if the requesting origin is
  present in the `Access-Control-Allow-Origin` header.

You can try how the simple request affect loading resources under a
[`Cross-Origin-Embedder-Policy: require-corp` environment](#coep) on [this
demo](https://cross-origin-isolation.glitch.me/?coep=require-corp&). Click the
**Cross-Origin Resource Sharing** checkbox and click the **Reload the image**
button to see the effect.

#### Preflighted requests

A preflighted request is preceded with an `OPTIONS` request to check if the
subsequent request is allowed to be sent.

{% Label %}Example request header{% endLabel %}

```http
OPTIONS / HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

* `Access-Control-Request-Method: POST` allows the following request to be made
  with the  `POST` method.
* `Access-Control-Request-Headers: X-PINGOTHER, Content-Type` allows the
  requester to set the `X-PINGOTHER` and `Content-Type` HTTP headers in the
  subsequent request.

{% Label %}Example response headers{% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

* `Access-Control-Allow-Methods: POST, GET, OPTIONS` indicates that subsequent
  requests can be made with the  `POST`, `GET` and `OPTIONS` methods.
* `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type` indicates subsequent
  requests can include the `X-PINGOTHER` and `Content-Type` headers.
* `Access-Control-Max-Age: 86400`  indicates that the result of the preflighted
  request can be cached for 86400 seconds.

### Supported browsers

{% BrowserCompat 'http.headers.Access-Control-Allow-Origin' %}

### Learn more

* [Cross-Origin Resource Sharing (CORS)](/cross-origin-resource-sharing/)
* [Cross-Origin Resource Sharing (CORS) - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)

{% endDetails %}

## Cross-Origin Embedder Policy (COEP) {: #coep}

To reduce the ability of [Spectre-based
attacks](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) to
steal cross-origin resources, features such as `SharedArrayBuffer` or
`performance.measureUserAgentSpecificMemory()` are disabled by default.

`Cross-Origin-Embedder-Policy: require-corp` prevents documents and workers from
loading cross-origin resources such as images, scripts, stylesheets, iframes and
others unless these resources explicitly opt into being loaded via [CORS](#cors)
or [CORP](#corp) headers. COEP can be combined with`Cross-Origin-Opener-Policy`
to opt a document into [cross-origin isolation](/cross-origin-isolation-guide/).

Use `Cross-Origin-Embedder-Policy: require-corp` when you want to enable
[cross-origin isolation](/coop-coep/) for your document.

{% Label %}Example usage{% endLabel %}

```http
Cross-Origin-Embedder-Policy: require-corp
```

{% Details %}
{% DetailsSummary %}

How to use COEP

{% endDetailsSummary %}

### Example usages

COEP takes a single value of `require-corp`. By sending this header, you can
instruct the browser to block loading resources that do not opt-in via
[CORS](#cors) or [CORP](#corp).

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="How COEP works",
width="800", height="410" %}

You can try how the following configurations affect loading resources on [this
demo](https://cross-origin-isolation.glitch.me/). Change the
**Cross-Origin-Embedder-Policy** dropdown menu, the
**Cross-Origin-Resource-Policy** dropdown menu, the **Report Only** checkbox etc
to see how they affect loading resources. Also, open [the reporting endpoint
demo](https://reporting-endpoint.glitch.me/) to see if the blocked resources are
reported.

#### Enable cross-origin isolation

Enable [cross-origin isolation](/coop-coep) by sending
`Cross-Origin-Embedder-Policy: require-corp` along with
`Cross-Origin-Opener-Policy: same-origin`.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

#### Report resources incompatible withn COEP

You can receive reports of blocked resources caused by COEP with the Reporting
API.

```http
Cross-Origin-Embedder-Policy: require-corp; report-to="coep"
```

COEP also supports report-only mode so you can receive reports without actually
blocking loading resources.

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="coep"
```

### Supported browsers

{% BrowserCompat 'http.headers.Cross-Origin-Embedder-Policy' %}

### Learn more
* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)
* [A guide to enable cross-origin isolation](/cross-origin-isolation-guide/)

{% endDetails %}

## HTTP Strict Transport Security (HSTS) {: #hsts}

Communication over a plain HTTP connection is not encrypted, making the
transferred data accessible to network-level eavesdroppers.

`Strict-Transport-Security` header informs the browser that it should never load
the site using HTTP and use HTTPS instead. Once it's set, the browser will use
HTTPS instead of HTTP to access the domain without a redirect for a duration
defined in the header.

{% Label %}Example usage{% endLabel%}

```http
Strict-Transport-Security: max-age=31536000
```

{% Details %}
{% DetailsSummary %}

How to use HSTS

{% endDetailsSummary %}

### Recommended usages

All websites that transition from HTTP to HTTPS should respond with a
`Strict-Transport-Security` header when a request with HTTP is received.

```http
Strict-Transport-Security: max-age=31536000
```

### Supported browsers

{% BrowserCompat 'http.headers.Strict-Transport-Security' %}

### Learn more
* [Strict-Transport-Security -
  HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)

{% endDetails %}

## Further reading

* [Post-Spectre Web Development](https://www.w3.org/TR/post-spectre-webdev/)

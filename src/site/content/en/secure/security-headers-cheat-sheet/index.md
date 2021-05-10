---
layout: post
title: Security headers quick reference
authors:
  - agektmr
  - arturjanc
date: 2021-05-18
description: 
tags:
  - security
---

This article lists the most important security headers and their quick guides so
you can get started with protecting your website with those headers.

Security headers recommended for websites with user inputs:
: [Content Security Policy (CSP)](#csp)
: [Trusted Types](#tt)
: [X-Content-Type-Options](#xcto)

Security headers recommended for all websites:
: [X-Frame-Options](#xfo)
: [Cross-Origin Resource Policy (CORP)](#corp)
: [Cross-Origin Opener Policy (COOP)](#coop)
: [Cross-Origin Resource Sharing (CORS)](#cors)
: [HTTP Strict Transport Security (HSTS)](#hsts)

Security headers needed for websites with advanced features (e.g. `SharedArrayBuffer`):
: [Cross-Origin Embedder Policy (COEP)](#coep)

{% Details %}
{% DetailsSummary %}

Learn known threats on the web

Before diving into security headers, learn what are known threats and understand
why you'd want to use these security headers.

{% endDetailsSummary %}

Before diving into security headers, learn what are known threats and understand
why you'd want to use these security headers.

### Protect your site from injection vulnerabilities

Injection vulnerabilities arise when untrusted data processed by your application can affect its behavior and, commonly, lead to the execution of attacker-controlled scripts. The most common result of injection bugs is [cross-site scripting](https://portswigger.net/web-security/cross-site-scripting) (XSS) in its various forms, including [reflected XSS](https://portswigger.net/web-security/cross-site-scripting/reflected), [stored XSS](https://portswigger.net/web-security/cross-site-scripting/stored), [DOM-based XSS](https://portswigger.net/web-security/cross-site-scripting/dom-based), and other variants.

An XSS vulnerability can typically give an attacker complete access to user data processed by the application and any other information hosted in the same [web origin](/same-site-same-origin/#origin).

Traditional defenses against injections include consistent use of autoescaping HTML template systems, avoiding the use of [dangerous JavaScript APIs](https://domgo.at/cxss/sinks), and properly processing user data by hosting file uploads in a separate domain and sanitizing user-controlled HTML.

* Use [Content Security Policy (CSP)](#csp) to fundamentally restrict scripts to
  be loaded to mitigate the risk.
* Use [Trusted Types](#tt) to enforce sanitization of data passed into a
  dangerous JavaScript API.
* Use [X-Content-Type-Options](#xcto) to prevent the browser from
  misinterpreting malicious scripts.

### Isolate your site from other websites

The openness of the web allows websites to interact with each other in ways that can violate an 
application's security expectations. This includes unexpectedly making authenticated requests or embedding data from another application in the attacker's document, allowing the attacker to modify or read application data.

Common vulnerabilities that undermine web isolation include [clickjacking](https://portswigger.net/web-security/clickjacking), [cross-site request forgery](https://portswigger.net/web-security/csrf) (CSRF), [cross-site script inclusion](https://www.scip.ch/en/?labs.20160414) (XSSI), and various [cross-site leaks](https://xsleaks.dev).

* Use [X-Frame-Options](#xfo) to prevent your documents from being embedded by a
  malicious website.
* Use [Cross-Origin Resource Policy (CORP)](#corp) to prevent your website's
  resources from being embedded by a cross-origin website.
* Use [Cross-Origin Opener Policy (COOP)](#coop) to prevent your website's
  documents from being opened and eavesdropped by a malicious website.
* Use [Cross-Origin Resource Sharing (CORS)](#cors) to control access to your
  website's resources from cross-origin documents. 

### Build a powerful website securely

[Spectre](https://ieeexplore.ieee.org/document/8835233) puts any data loaded
onto the same browsing context group potentially readable despite [same-origin
policy](/same-origin-policy/). Browsers restrict features that may possibly
exploit the vulnerability behind a special environment called "[cross-origin
isolation](/coop-coep/)". With cross-origin isolation, you can use powerful
features such as `SharedArrayBuffer`.

* Use [Cross-Origin Embedder Policy (COEP)](#coep) along with [COOP](#coop) to
  enable cross-origin isolation.

### Encrypt traffic to your site

Encryption issues appear when an application does not fully encrypt data in transit, allowing eavesdropping attackers to learn about the user's interactions with the application.

Insufficient encryption can arise as a result of [mixed content](/what-is-mixed-content/), setting cookies without the [`Secure` attribute](https://developer.mozilla.org/docs/Web/HTTP/Cookies#restrict_access_to_cookies) (or [`__Secure` prefix](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Cookie_prefixes)), or [lax CORS validation logic](https://blog.detectify.com/2018/04/26/cors-misconfigurations-explained/).

* Use [HTTP Strict Transport Security (HSTS)](#hsts) to consisitently serve your
  contents through HTTPS.

{% endDetails %}

## Content Security Policy (CSP) {: #csp}

[Cross-Site Scripting (XSS)](#xss) is an attack where a vulnerability on a
website allows a malicious script to be injected and executed.

`Content-Security-Policy` provides an added layer to mitigate XSS attacks by
restricting resources that can be loaded to the page.

{% Label %}Example usage{% endLabel%}

```http
Content-Security-Policy:
  script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

{% Details %}
{% DetailsSummary %}

Learn more how to use CSP

{% endDetailsSummary %}

### Recommended usages

{% Aside %}

A CSP can be an *extra* protection against XSS attacks; you should still make
sure to escape (and sanitize) user input.

{% endAside %}

#### 1. Use a nonce-based CSP {: #nonce-based-csp}

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

#### 2. Use a hash-based CSP {: #hash-based-csp}

If your HTML has to be served statically or cached, for example if it's a
single-page application, use **a hash-based strict CSP**.

{% Label %}server configuration file{% endLabel %}

```http
Content-Security-Policy:
  script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

In HTML, you'll need to inline your scripts in order to apply a hash-based
policy, because [most browsers don't support hashing external scripts](
https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned).


{% Label %}index.html{% endLabel %}

```html
<script>
...// your script1, inlined
</script>
<script>
...// your script2, inlined
</script>
```

### Supported browsers

Chrome, Firefox, Edge, Safari

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
* You can also set a CSP in [**Report-Only
  mode**](/strict-csp/#step-2:-set-a-strict-csp-and-prepare-your-scripts) 
* If you can't set a CSP as a header server-side, you can also set it as a meta
  tag. Note that you can't use **Report-Only** mode for meta tags (even though
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

Trusted Types provides the tools to write, security review, and maintain
applications free of DOM XSS. They can be enabled via [CSP](#csp) and make
JavaScript secure by default by limiting dangerous web APIs to only accept a
special object - a Trusted Type.

To create these objects you can define security policies in which you can ensure
that security rules (such as escaping or sanitization) are consistently applied
before the data is written to the DOM.

{% Label %}Example usages{% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script'
```

```javascript
// Feature detection
if (window.trustedTypes && trustedTypes.createPolicy) {
  // Name and create a policy
  const policy = trustedTypes.createPolicy('htmlPolicy', {
    createHTML: str => {
      return str.replace(/\</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
}
```

```javascript
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
```

{% Details %}
{% DetailsSummary %}

Learn more how to use Trusted Types

{% endDetailsSummary %}

### Recommended usages

1. Enforce Trusted Types for dangerous DOM sinks
    {% Label %}CSP and Trusted Types header:{% endLabel %}

    ```http
    Content-Security-Policy: require-trusted-types-for 'script'
    ```

    Currently `'script'` is the only acceptable value for
    `require-trusted-types-for` directive.

    {% Aside %}

    You may limit allowed Trusted Types policy names by setting an additional
    `trusted-types` directive (e.g. `trusted-types myPolicy`). However, this is
    not a requirement.

    {% endAside %}

2. Define a policy

    {% Label %}Define a policy:{% endLabel %}

    ```javascript
    // Feature detection
    if (window.trustedTypes && trustedTypes.createPolicy) {
      // Name and create a policy
      const policy = trustedTypes.createPolicy('htmlPolicy', {
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
    const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
    el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
    ```

    With `require-trusted-types-for: 'script'`, using a trusted type is a
    requirement. Using any dangerous DOM API with a string will result in an
    error.

### Supported browsers

Chrome, Edge

### Learn more

* [Prevent DOM-based cross-site scripting vulnerabilities with Trusted
  Types](/trusted-types/)
* [CSP: require-trusted-types-for - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
* [CSP: trusted-types - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
* [DEMO](https://www.compass-demo.com/trusted-types/) (Open Inspector and see
  what is happening)
 
{% endDetails %}

## X-Content-Type-Options {: #xcto}

When a malicious HTML document disguised as an image is uploaded to a photo
service, some browsers will treat it as an active document and allow it to
execute scripts in the context of the application,  causing a [cross-site
scripting attack](#xss).

`X-Content-Type-Options: nosniff` prevents it by instructing the browser not to
[sniff that the MIME type](https://mimesniff.spec.whatwg.org/#introduction) set
in the  `Content-Type` header for a given response is correct.  This header is
recommended for **all of your resources**.

{% Label %}Example usage{% endLabel%}

```http
X-Content-Type-Options: nosniff
```

{% Details %}
{% DetailsSummary %}

Learn more how to use X-Content-Type-Options

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

Chrome, Firefox, Safari, Edge

### Learn more

* [X-Content-Type-Options - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)

{% endDetails %}

## X-Frame-Options {: #xfo}

Being embedded in a malicious website may allow attackers to invoke unintended
actions by the user with
[clickjacking](https://portswigger.net/web-security/clickjacking). Also,
Spectre-type attacks give malicious websites a chance to eavesdrop the content
of an embedded website.

`X-Frame-Options` indicates whether or not a browser should be allowed to render
a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>`. **All documents**
are recommended sending this header to indicate whether it allows being embedded
by other documents.

{% Aside %}

If you need more granular control such as allowing only specific origin to embed
the document, use the [CSP](#csp)
[`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
directive.

{% endAside %}

{% Label %}Example usage{% endLabel%}

```http
X-Frame-Options: DENY
```

{% Details %}
{% DetailsSummary %}

Learn more how to use X-Frame-Options

{% endDetailsSummary %}

### Recommended usages

All documents that are not designed to be embedded should use this header.

#### Protects your website from being embedded by any websites

Deny being embedded by any other documents.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2ZM5obgGK38CMcZ75PkH.png",
alt="X-Frame-Options: DENY", width="800", height="237" %}

```http
X-Frame-Options: DENY
```

#### Protects your website from being embedded by all cross-origin websites

Allow being embedded only by same-origin documents.

```http
X-Frame-Options: SAMEORIGIN
```

{% Aside 'gotchas' %}

Documents being embeddable by default means the web developers need to
explicitly send `DENY` or `SAMEORIGIN` to stop being embedded and protect itself
from side-channel attacks. The Chrome team is considering switching to block
document embeds by default so those websites will be secure by default. In that
new world, documents will need to explicitly opt-in to be embedded.

{% endAside %}

### Supported browsers

Chrome, Firefox, Safari, Edge

### Learn more

* [X-Frame-Options - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options)

{% endDetails %}

## Cross-Origin Resource Policy (CORP) {: #corp}

An attacker website can embed documents from another origin to learn information about it by exploiting web-based [cross-site leaks](https://xsleaks.dev/).

`Cross-Origin-Resource-Policy` mitigates it by indicating the set of websites it can be loaded by. The header takes one of three values: `same-origin`, `same-site`, and `cross-origin`. **All documents** are recommended sending this header to indicate whether it allows being loaded by which origin's documents.

{% Label %}Example usage{% endLabel%}

```http
Cross-Origin-Resource-Policy: cross-origin
```

{% Details %}
{% DetailsSummary %}

Learn more how to use CORP

{% endDetailsSummary %}

### Recommended usages

It is recommended that **all** resources are served with one of the following
three headers.

#### Allow the resource to be loaded `cross-origin`

`cross-origin` is recommended to be applied by CDN-like services whose resources
are assumed to be loaded by cross-origin pages unless they are already served
through [CORS](#cors).

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/qP2mspVMC6RazxDjWUrL.png",
alt="Cross-Origin-Resource-Policy: cross-origin", width="800", height="234" %}

```http
Cross-Origin-Resource-Policy: cross-origin
```

#### Limit the resource to be loaded from the `same-origin`

`same-origin` should be applied to resources that are intended to be loaded only
by same-origin pages. You may apply this to a resource that includes sensitive
information about the user, or response of an API that is intended for the same
origin.

Beware that even with this header the resource is still accessible from random
requests so don't consider this as an ACL. It's just the browser will not load
it on a cross-origin context. By "load" here means either the browser renders
the content on the page or the JavaScript can read the content.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/7UzYMWsbKkh89m5ZImvj.png",
alt="Cross-Origin-Resource-Policy: same-origin", width="800", height="238" %}

```http
Cross-Origin-Resource-Policy: same-origin
```

#### Limit the resource to be loaded from the `same-site`

`same-site` is recommended to be applied to resources similar to above but are
intended to be loaded by same-site pages.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/R9yNRGSJ4xABc560WRJI.png",
alt="Cross-Origin-Resource-Policy: same-site", width="800", height="233" %}

```http
Cross-Origin-Resource-Policy: same-site
```

{% Aside %}

Learn the difference between same-origin and same-site at [Understanding
"same-site" and "same-origin" "same-site"](/same-site-same-origin/).

{% endAside %}

### Supported browsers

Chrome, Firefox, Safari, Edge

### Learn more

* [Consider deploying cross-origin resource policy!](https://resourcepolicy.fyi/)
* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)

{% endDetails %}

## Cross-Origin Opener Policy (COOP) {: #coop}

An attacker website can open another site in a popup window to learn information
about it by exploiting web-based [cross-site leaks](https://xsleaks.dev/). This
also may cause side-channel attacks exploiting [Spectre](#spectre).

A `Cross-Origin-Opener-Policy` header provides a way for a document to isolate
itself from cross-origin windows opened through `window.open()` or a link with
`target="_blank"` without `rel="noopener"`. As a result, the document will have
no reference with a cross-origin document window mutually.

{% Label %}Example usage{% endLabel%}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

{% Details %}
{% DetailsSummary %}

Learn more how to use COOP

{% endDetailsSummary %}

### Recommended usages

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
`same-origin-allow-popups`. This in reverse means `same-origin-allow-popups` can
still prevent being referenced when opened as a popup window, but can open a
popup window that has `unsafe-none` which is default.

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
from side-channel attacks. The Chrome team is considering to switch the default
to `same-origin-allow-popups` so those websites will be secure by default.

{% endAside %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

{% Aside %}

Features such as `SharedArrayBuffer`,
`performance.measureUserAgentSpecificMemory()` or JS Self Profiling API are
disabled by default. Some browsers allow you to use them by enabling a
"cross-origin isolation" environment which requires [COOP](#coop) and
[COEP](#coep) headers.

To learn more, read [Making your website "cross-origin isolated" using COOP and
COEP](/coop-coep/)

{% endAside %}

#### Report patterns incompatible with COOP

You can receive reports when COOP prevents cross-window interactions with the
Reporting API.

```http
Cross-Origin-Opener-Policy: same-origin; report-to="coop"
```

COOP also supports report-only mode so you can receive reports without actually
blocking communication between cross-origin documents.

```http
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop"
```

### Supported browsers

Chrome, Firefox, Edge

### Learn more

* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)

{% endDetails %}

## Cross-Origin Resource Sharing (CORS) {: #cors}

Cross-Origin Resource Sharing (CORS) is a browser mechanism that requests and
permits access to cross-origin resources.

Browsers enforce [the same-origin policy](/same-origin-policy/) to prevent a web
page programmatic access to cross-origin resources. For example, when a
cross-origin image is loaded, even though it's displayed on the web page
visually, the JavaScript on the page doesn't have access to the image's data.
This is called an **opaque** response and [applied differently depending on the
resource type](/same-origin-policy/#what-is-permitted-and-what-is-blocked). The
resource provider can relax restrictions and allow other websites to read the
resource by opting-in with CORS.

{% Label %}Example usage{% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

{% Details %}
{% DetailsSummary %}

Learn more how to use CORS

{% endDetailsSummary %}

### Recommended usages

Depending on request details, a request will be classified as a **simple
request** or a **preflighted request**.

Criteria for a simple request:

* The method is one of: `GET`, `HEAD`, `POST`
* The custom headers only include: `Accept`, `Accept-Language`,
  `Content-Language`, `Content-Type`
* The `Content-Type` is one of: `application/x-www-form-urlencoded`,
  `multipart/form-data`, `text/plain`

Everything else is classified as a preflighted request. More nuances can be
found at [Cross-Origin Resource Sharing (CORS) - HTTP |
MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS#simple_requests).

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
  `https://example.com` can access the contents of the response. You may use a
  wildcard `*` but be careful about potential abuse.
* `Access-Control-Allow-Credentials: true` indicates that the browser may store
  the credential (`Set-cookie` header) in the response. Otherwise the cookie
  will be ignored by the browser.

#### Preflighted request

A preflighted request is preceded with an `OPTIONS` request to check if the
subsequent request is allowed to be sent. 

{% Label %}Example request header{% endLabel %}

```http
OPTIONS / HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

* `Access-Control-Request-Method: POST` requests to allow including `POST` in
  subsequent requests.
* `Access-Control-Request-Headers: X-PINGOTHER, Content-Type` request to allow
  including `X-PINGOTHER` and `Content-Type` in subsequent requests.


{% Label %}Example response header{% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

* `Access-Control-Allow-Methods: POST, GET, OPTIONS` indicates that subsequent
  requests can include `POST`, `GET` and `OPTIONS`.
* `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type` indicates subsequent
  requests can include `X-PINGOTHER` and `Content-Type` header.
* `Access-Control-Max-Age: 86400`  indicates that the result of the preflighted
  request can be cached for 86400 seconds.

### Supported browsers

Chrome, Firefox, Safari, Edge

### Learn more

* [Cross-Origin Resource Sharing (CORS)](/cross-origin-resource-sharing/)
* [Cross-Origin Resource Sharing (CORS) - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)

{% endDetails %}

## Cross-Origin Embedder Policy (COEP) {: #coep}

To reduce the efficiency of [Spectre](#spectre) to steal cross-origin resources,
features such as `SharedArrayBuffer`,
`performance.measureUserAgentSpecificMemory()` or JS Self Profiling API that
involves high-precision timers are disabled by default.

`Cross-Origin-Embedder-Policy: require-corp` prevents the documents and workers
from loading cross-origin resources such as images, scripts, stylesheets,
iframes and others unless they explicitly allow loading via [CORS](#cors) or
[CORP](#corp) and isolate itself. By combining with
`Cross-Origin-Opener-Policy`, they can opt into [cross-origin
isolation](/cross-origin-isolation-guide/).

Use `Cross-Origin-Embedder-Policy: require-corp` when you want to enable
[cross-origin isolation](/coop-coep/) on the document.

{% Label %}Example usage{% endLabel %}

```http
Cross-Origin-Embedder-Policy: require-corp
```

{% Details %}
{% DetailsSummary %}

Learn more how to use COEP

{% endDetailsSummary %}

### Example usages

COEP takes a single value of `require-corp`. By sending this header, you can
instruct the browser to block loading resources that do not opt-in via
[CORS](#cors) or [CORP](#corp). 

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="How COEP works",
width="800", height="410" %}

#### Enable cross-origin isolation

Sites that want to use Shared Array Buffer,
`performance.measureUserAgentSpecificMemory()` or JS Self Profiling API need to
enable [cross-origin isolation](/coop-coep) by sending
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

Chrome, Firefox, Edge

### Learn more
* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)
* [A guide to enable cross-origin isolation](/cross-origin-isolation-guide/)

{% endDetails %}

## HTTP Strict Transport Security (HSTS) {: #hsts}

Communication over an HTTP connection is not encrypted, therefore the content
exchanged over such a network can be eavesdropped or sniffed.

`Strict-Transport-Security` header informs the browser that it should never load
the site using HTTP and use HTTPS instead. Once it's set, the browser will use
HTTPS instead of HTTP to access the domain without a redirect for a duration
defined in the header.

{% Label %}Example usage{% endLabel%}

```http
Strict-Transport-Security: max-age=36000
```

{% Details %}
{% DetailsSummary %}

Learn more how to use HSTS

{% endDetailsSummary %}

### Recommended usages

All websites that transition from HTTP to HTTPS should respond with a `Strict-Transport-Security` header when a request with HTTP is received.

```http
Strict-Transport-Security: max-age=36000
```

### Supported browsers

Chrome, Firefox, Safari, Edge

### Learn more
* [Strict-Transport-Security - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)

{% endDetails %}

## Further reading

* [Post-Spectre Web Development](https://www.w3.org/TR/post-spectre-webdev/)

---
layout: post
title: Security headers cheat sheet
authors:
  - agektmr
date: 2021-03-01
description: 
tags:
  - security
---

Use this document to remind yourself of important security headers and check
if you have examined whether they should be applied or not.

## Protecting your site from injection vulnerabilities

Injection vulnerabilities arise when untrusted data processed by your
application can affect its behavior and, commonly, lead to the execution of
attacker-controlled scripts. The most common result of injection bugs is
[cross-site
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

Websites with sensitive information (e.g. personal information) should use the
following headers.

* [CSP](#csp)
* [Trusted Types](#tt)
* [X-Content-Type-Options](#xcto)

### Content Security Policy (CSP) {: #csp}

A content security policy primarily helps to mitigate
[XSS](https://owasp.org/www-community/attacks/xss/) attacks by restricting
resources that can be loaded to the page.

{% Aside 'gotchas' %}

* A CSP can be an *extra* protection against XSS attacks; you should still make
  sure to escape (and sanitize) user input.
* To protect your site from clickjacking—a risk that arises if you allow
  untrusted sites to embed yours—use [`X-Frame-Options`](#xfo) to block being
  loaded. If you need a more advanced configuration to only allow specific
  origins as embedders, the CSP directive called
  [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
  is what you need.
* You may have used a CSP to ensure that all of your site's resources are loaded
  over HTTPS. This has become less relevant: nowadays, most browsers block
  [mixed-content](/what-is-mixed-content/).

{% endAside %}

#### Example usages

1. If you render your HTML pages on the server, use **a nonce-based strict CSP**.

    {% Label %}HTTP header sent with the document{% endLabel %}
    
    ```http
    Content-Security-Policy:
      script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
      object-src 'none';
      base-uri 'none';
    ```

    {% Label %}The document HTML{% endLabel %}
    
    ```html
    <script nonce="{RANDOM1}" src="https://example.com/script1.js"></script>
    <script nonce="{RANDOM1}">
      // Inline scripts can be used with the `nonce` attribute.
    </script>
    ```

2. If your HTML has to be served statically or cached, for example if it's a
   single-page application, use **a hash-based strict CSP**.

    {% Label %}HTTP header sent with the document{% endLabel %}

    ```http
    Content-Security-Policy:
      script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
      object-src 'none';
      base-uri 'none';
    ```

    {% Label %}The document HTML{% endLabel %}

    ```html
    <script>
    … // your script1, inlined
    </script>
    <script>
    … // your script2, inlined
    </script>
    ```

{% Details %}
{% DetailsSummary %}

Learn more how to use CSP

{% endDetailsSummary %}

#### Recommended usages

##### 1. Use a nonce-based CSP

If you render your HTML pages on the server, use **a nonce-based strict CSP**.

{% Aside 'caution' %}

A nonce is a random number used only once. A nonce-based CSP is only secure if
you can generate a different nonce for each response. If you can't do this, use
a hash-based CSP instead.

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

##### 2. Use a hash-based CSP

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

{% Aside %}

Wait, what about the other benefits of using a CSP?
* To protect your site from clickjacking—a risk that arises if you allow
  untrusted sites to embed yours—use [`X-Frame-Options`](#xfo) to block being
  loaded. If you need a more advanced configuration to only allow specific
  origins as embedders, the CSP directive called
  [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
  is what you need.
* You may have used a CSP to ensure that all of your site's resources are loaded
  over HTTPS. This has become less relevant: nowadays, most browsers block
  [mixed-content](/what-is-mixed-content/).

{% endAside %}

#### Supported browsers

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

#### Other things to note about CSP

* You can also set a CSP in [**Report-Only
  mode**](/strict-csp/#step-2:-set-a-strict-csp-and-prepare-your-scripts) 
* If you can't set a CSP as a header server-side, you can also set it as a meta
  tag. Note that you can't use **Report-Only** mode for meta tags (even though
  [this may change](https://github.com/w3c/webappsec-csp/issues/277)).

#### Learn more

* [Mitigate XSS with a Strict Content Security Policy (CSP)](/strict-csp)
* [Content Security Policy Cheat
  Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

{% endDetails %}

### Trusted Types {: #tt}

Trusted Types can be enabled via [CSP](#csp) and provides the tools to write,
security review, and maintain applications free of [DOM XSS](TODO)
vulnerabilities. They make JavaScript secure by default by limiting dangerous
web APIs (such as `eval()`) to only accept a special object - a Trusted Type.
To create these objects you can define security policies in which you can ensure
that security rules (such as escaping or sanitization) are consistently applied
before the data is written to the DOM.

#### Example usages

{% Label %}CSP and Trusted Types header:{% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script'
```

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

{% Label %}Use the policy when writing data to the DOM:{% endLabel %}

```javascript
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
```


{% Details %}
{% DetailsSummary %}

Learn more how to use Trusted Types

{% endDetailsSummary %}

#### Recommended usages

##### Enforce Trusted Types for dangerous DOM sinks

{% Label %}CSP and Trusted Types header:{% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script'
```

Currently `'script'` is the only acceptable value for `require-trusted-types-for` directive.

{% Aside %}

You may limit allowed Trusted Types policy names by setting an additional
`trusted-types` directive (e.g. `trusted-types myPolicy`). However, this is not
a requirement.

{% endAside %}

##### Define a policy

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

##### Apply the policy

{% Label %}Use the policy when writing data to the DOM:{% endLabel %}

```javascript
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
```

With `require-trusted-types-for: 'script'`, using a trusted type is a
requirement. Using any dangerous DOM API with a string will result in an error.

#### Supported browsers

Chrome, Edge

#### Learn more

* [DEMO](https://www.compass-demo.com/trusted-types/) (Open Inspector and see
  what is happening)
* [Prevent DOM-based cross-site scripting vulnerabilities with Trusted
  Types](/trusted-types/)
* [CSP: require-trusted-types-for - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
* [CSP: trusted-types - HTTP |
  MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
 
{% endDetails %}

### X-Content-Type-Options

`X-Content-Type-Options: nosniff` instructs the browser not to sniff that the
MIME type set in the  `Content-Type` header for a given response is correct. It
instructs the browser to not attempt to use the response as a different content
type (also known as _sniffing_ the resource)

This is useful for example when a photo uploading service receives an image that
can be parsed as an HTML file which includes malicious inline JavaScript code.
When a page loads the image but rendered as HTML by the browser's MIME sniffing
feature, it will execute the JavaScript code. `X-Content-Type-Options: nosniff`
prevents the browser from altering the MIME type by its content.

#### Example usages

Apply the following header to all of your resources.

```http
X-Content-Type-Options: nosniff
```

{% Details %}
{% DetailsSummary %}

Learn more how to use X-Content-Type-Options

{% endDetailsSummary %}

#### Recommended usages

`X-Content-Type-Options: nosniff` is recommended for all resources served from
your server along with the correct `Content-Type` header.

```http
X-Content-Type-Options: nosniff
```

#### Supported browsers

Chrome, Firefox, Safari, Edge

#### Learn more

* [X-Content-Type-Options - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)

{% endDetails %}

## Isolating your site from other websites

The openness of the web allows websites to interact with each other in ways that
can violate an application's security expectations. This includes unexpectedly
making authenticated requests or embedding data from another application in the
attacker's document, allowing the attacker to modify or read application data.

Common vulnerabilities that undermine web isolation include
[clickjacking](https://portswigger.net/web-security/clickjacking), [cross-site
request forgery](https://portswigger.net/web-security/csrf) (CSRF), [cross-site
script inclusion](https://www.scip.ch/en/?labs.20160414) (XSSI), and various
[cross-site leaks](https://xsleaks.dev).

### X-Frame-Options {: #xfo}

The `X-Frame-Options` header indicates whether or not a browser should be allowed to render a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>`.

Being embedded in a malicious website may allow attackers to invoke unintended actions by the user with clickjacking. Also, Spectre is now another reason for websites with sensitive information to prevent being embedded.


{% Details %}
{% DetailsSummary %}

Learn more how to use X-Frame-Options

{% endDetailsSummary %}

#### Recommended usages

All documents that are not designed to be embedded should use this header.

##### Protects your website from being embedded by any websites

```http
X-Frame-Options: DENY
```

Deny being embedded by any other documents.

##### Protects your website from being embedded by all cross-origin websites

```http
X-Frame-Options: SAMEORIGIN
```

Allow being embedded only by same-origin documents.

#### Supported browsers

Chrome, Firefox, Safari, Edge

#### Learn more

* [X-Frame-Options - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options)

{% endDetails %}

### Cross-Origin Resource Policy (CORP) {: #corp}

With the `Cross-Origin-Resource-Policy` header, you can ensure the resource can be loaded by the expected set of websites. The header takes three possible values: `same-origin`, `same-site`, and `cross-origin`.

Ensuring that a resource cannot be loaded by other websites protects it from attacks where an attacker embeds it on another site and attempts to learn information about it by exploiting web-based [cross-site leaks](https://xsleaks.dev/).


{% Details %}
{% DetailsSummary %}

Learn more how to use CORP

{% endDetailsSummary %}

#### Recommended usages
It is recommended that **all** resources are served with one of the following three headers.

##### Allow the resource to be loaded `cross-origin`

`cross-origin` is recommended to be applied by CDN-like services whose resources are assumed to be loaded by cross-origin pages unless they are already served through CORS.

```http
Cross-Origin-Resource-Policy: cross-origin
```

##### Limit the resource to be loaded from the `same-origin`

`same-origin` should be applied to resources that are intended to be loaded only by same-origin pages. You may apply this to a resource that includes sensitive information about the user, or response of an API that is intended for the same origin.

Beware that even with this header the resource is still accessible from random requests so don't consider this as an ACL. It's just the browser will not load it on a cross-origin context. By "load" here means either the browser renders the content on the page or the JavaScript can read the content.

```http
Cross-Origin-Resource-Policy: same-origin
```

##### Limit the resource to be loaded from the `same-site`

`same-site` is recommended to be applied to resources similar to above but are intended to be loaded by same-site pages.

```http
Cross-Origin-Resource-Policy: same-site
```

Learn the difference between same-origin and same-site at Understanding "same-site" and "same-origin" "same-site".

#### Supported browsers

Chrome, Firefox, Safari, Edge

#### Learn more
* [Consider deploying cross-origin resource policy!](https://resourcepolicy.fyi/)
* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)

{% endDetails %}

### Cross-Origin Opener Policy (COOP) {: #coop}

A `Cross-Origin-Opener-Policy` header provides a way for a document to isolate itself from cross-origin windows. As a result, the document will have no reference with a cross-origin document window opened through `window.open()` mutually. COOP was introduced to mitigate [Spectre attacks](#spectre).


{% Details %}
{% DetailsSummary %}

Learn more how to use COOP

{% endDetailsSummary %}

#### Recommended usages

##### Isolate a document from cross-origin windows

Setting `same-origin` puts the document to be isolated from cross-origin document windows.

```http
Cross-Origin-Opener-Policy: same-origin
```

##### Isolate a document from cross-origin windows but allow popups

Setting `same-origin-allow-popups` allows a document to retain a reference to its popup windows unless they set COOP with `same-origin` or `same-origin-allow-popups`. This in reverse means `same-origin-allow-popups` can still prevent being referenced when opened as a popup window, but can open a popup window that has `unsafe-none` which is default.

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

##### Allow a document to be referenced by cross-origin windows

`unsafe-none` is the default value but you can explicitly indicate that this document can be opened by a cross-origin window and retain mutual access.

```http
Cross-Origin-Opener-Policy: unsafe-none
```

{% Aside %}

##### Enable cross-origin isolation

Sites that want to use Shared Array Buffer, `performance.measureUserAgentSpecificMemory()` or JS Self Profiling API need to enable cross-origin isolation by sending `Cross-Origin-Embedder-Policy: require-corp` along with `Cross-Origin-Opener-Policy: same-origin`.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

{% endAside %}

##### Report patterns incompatible with COOP

You can receive reports when COOP prevents cross-window interactions with the Reporting API.

```http
Cross-Origin-Opener-Policy: same-origin; report-to="coop"
```

COOP also supports report-only mode so you can receive reports without actually blocking communication between cross-origin documents.

```http
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop"
```

#### Supported browsers

Chrome, Firefox, Edge

#### Learn more

* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)

{% endDetails %}

## Encrypting traffic to your site

Encryption issues appear when an application does not fully encrypt data in
transit, allowing eavesdropping attackers to learn about the user's interactions
with the application.

Insufficient encryption can arise as a result of [mixed
content](/what-is-mixed-content/), setting cookies without the [Secure
attribute](https://developer.mozilla.org/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
(or [__Secure
prefix](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Cookie_prefixes)),
or [lax CORS validation
logic](https://blog.detectify.com/2018/04/26/cors-misconfigurations-explained/).

### HTTP Strict Transport Security (HSTS) {: #hsts}

Inform the browser that it should never load the site using HTTP and use HTTPS instead.

Communication over an HTTP connection is not encrypted, therefore the content exchanged over such a network can be eavesdropped or sniffed. Once an application sets a `Strict-Transport-Security` header, the browser will use HTTPS instead of HTTP to access the domain without a redirect for a duration defined in the header.


{% Details %}
{% DetailsSummary %}

Learn more how to use HSTS

{% endDetailsSummary %}

#### Recommended usages

All websites that transition from HTTP to HTTPS should respond with a `Strict-Transport-Security` header when a request with HTTP is received.

```http
Strict-Transport-Security: max-age=36000
```

#### Supported browsers

Chrome, Firefox, Safari, Edge

#### Learn more
* [Strict-Transport-Security - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)

{% endDetails %}

## Securely building a powerful website

### Cross-Origin Resource Sharing (CORS) {: #cors}

Cross-Origin Resource Sharing (CORS) is a browser mechanism that requests and permits access to cross-origin resources.

Browsers enforce [the same-origin policy](/same-origin-policy/) to prevent a web page programmatic access to cross-origin resources. For example, when a cross-origin image is loaded, even though it's displayed on the web page visually, the JavaScript on the page doesn't have access to the image's data. This is called an **opaque** response and [applied differently depending on the resource type](/same-origin-policy/#what-is-permitted-and-what-is-blocked). The resource provider can relax restrictions and allow other websites to read the resource by opting-in with CORS.

{% Details %}
{% DetailsSummary %}

Learn more how to use CORS

{% endDetailsSummary %}

#### Recommended usages

Depending on request details, a request will be classified as a **simple request** or a **preflighted request**.

Criteria for a simple request:
* The method is one of: `GET`, `HEAD`, `POST`
* The custom headers only include: `Accept`, `Accept-Language`, `Content-Language`, `Content-Type`
* The `Content-Type` is one of: `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`

Everything else is classified as a preflighted request. More nuances can be found at [Cross-Origin Resource Sharing (CORS) - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS#simple_requests).

##### Simple request

When a request meets the simple request criteria, the browser sends a cross-origin request with an `Origin` header that indicates the requesting origin.

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

* `Access-Control-Allow-Origin: https://example.com` indicates that the `https://example.com` can access the contents of the response. You may use a wildcard `*` but be careful about potential abuse.
* `Access-Control-Allow-Credentials: true` indicates that the browser may store the credential (`Set-cookie` header) in the response. Otherwise the cookie will be ignored by the browser.

##### Preflighted request

A preflighted request is preceded with an `OPTIONS` request to check if the subsequent request is allowed to be sent. 

{% Label %}Example request header{% endLabel %}

```http
OPTIONS / HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

* `Access-Control-Request-Method: POST` requests to allow including `POST` in subsequent requests.
* `Access-Control-Request-Headers: X-PINGOTHER, Content-Type` request to allow including `X-PINGOTHER` and `Content-Type` in subsequent requests.


{% Label %}Example response header{% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

* `Access-Control-Allow-Methods: POST, GET, OPTIONS` indicates that subsequent requests can include `POST`, `GET` and `OPTIONS`.
* `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type` indicates subsequent requests can include `X-PINGOTHER` and `Content-Type` header.
* `Access-Control-Max-Age: 86400`  indicates that the result of the preflighted request can be cached for 86400 seconds.

#### Supported browsers

Chrome, Firefox, Safari, Edge

#### Learn more
* [Cross-Origin Resource Sharing (CORS)](/cross-origin-resource-sharing/)
* [Cross-Origin Resource Sharing (CORS) - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)

{% endDetails %}

### Cross-Origin Embedder Policy (COEP) {: #coep}

A `Cross-Origin-Embedder-Policy: require-corp` header prevents documents and workers from loading cross-origin resources such as images, scripts, stylesheets, iframes and others unless they explicitly allow loading via CORS or CORP.

COEP was introduced to mitigate [Spectre attacks](#spectre) and is assumed to be used along with `Cross-Origin-Opener-Policy` to opt into [cross-origin isolation](/cross-origin-isolation-guide/).

{% Details %}
{% DetailsSummary %}

Learn more how to use COEP

{% endDetailsSummary %}

#### Recommended usages

COEP takes a single value `require-corp`. By sending this header, you can instruct the browser to block loading resources that do not opt-in via CORS or CORP. 

```http
Cross-Origin-Embedder-Policy: require-corp
```

##### Enable cross-origin isolation

Sites that want to use Shared Array Buffer, `performance.measureUserAgentSpecificMemory()` or JS Self Profiling API need to enable [cross-origin isolation](/coop-coep) by sending `Cross-Origin-Embedder-Policy: require-corp` along with `Cross-Origin-Opener-Policy: same-origin`.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

##### Report resources incompatible withn COEP

You can receive reports of blocked resources caused by COEP with the Reporting API.

```http
Cross-Origin-Embedder-Policy: require-corp; report-to="coep"
```

COEP also supports report-only mode so you can receive reports without actually blocking loading resources.

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="coep"
```

#### Supported browsers

Chrome, Firefox, Edge

#### Learn more
* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)
* [A guide to enable cross-origin isolation](/cross-origin-isolation-guide/)

{% endDetails %}

### Timing-Allow-Origin {: #tao}

Specifies origins that are allowed to see values of attributes retrieved via features of the [Resource Timing API](https://developer.mozilla.org/docs/Web/API/Resource_Timing_API). Without `Timing-Allow-Origin` header only the same-origin script can read the value.

TODO: Security reasons?

{% Details %}
{% DetailsSummary %}

Learn more how to use Timing-Allow-Origin

{% endDetailsSummary %}

#### Recommended usages
Websites that collect performance data.

Allow all domains to read values from the Resource Timing API.

```http
Timing-Allow-Origin: *
```

Allow `https://example.com` to read values from the Resource Timing API.

```http
Timing-Allow-Origin: https://example.com
```

#### Supported browsers

Chrome, Firefox, Safari, Edge

#### Learn more
* [Timing-Allow-Origin - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin)

{% endDetails %}

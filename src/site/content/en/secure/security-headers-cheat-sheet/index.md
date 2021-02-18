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

{% Details %}
{% DetailsSummary %}
Content Security Policy (CSP)
A content security policy primarily helps to mitigate
[XSS](https://owasp.org/www-community/attacks/xss/) attacks.
{% endDetailsSummary %}

A content security policy primarily helps to mitigate
[XSS](https://owasp.org/www-community/attacks/xss/) attacks.

{% Aside %}
A CSP can be an **extra** protection against XSS attacks; you should still make
sure to escape (and sanitize) user input.
{% endAside %}

### Recommended for:

Websites with sensitive information.

### Example usage:

* If you render your HTML pages on the server, use a nonce-based strict CSP. 
* If your HTML has to be served statically or cached, for example if you have a single-page application, use a hash-based strict CSP. 

{% Aside 'caution' %}
A nonce is a random number used only once. A nonce-based CSP is only secure if you can generate a different nonce for each response. If you can't do this, use a hash-based CSP instead.
{% endAside %}

#### Protect your site from XSS with a nonce-based CSP:

Determine the script nonces on the server side and set the following header:

{% Label %}server configuration file{% endLabel %}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```
Note: `https:` is a fallback for Safari and `unsafe-inline` is a fallback for very old browser versions. `https:` and `unsafe-inline` don't make your policy less safe because they will be ignored by browsers who support `strict-dynamic`. Read more in [](link to lwe@'s article/#relevant section).

In HTML, in order to load the scripts, use the same `{RANDOM1}` string as the `nonce` attributes.

{% Label %}index.html{% endLabel %}

```html
<script nonce="{RANDOM1}" src="https://example.com/script1.js"></script>
<script nonce="{RANDOM1}" src="https://example.com/script2.js"></script>
```

#### Protect your site from XSS with a hash-based CSP:

{% Label %}server configuration file{% endLabel %}

```http
Content-Security-Policy:
  script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```
Note: `https:` is a fallback for Safari and `unsafe-inline` is a fallback for very old browser versions. `https:` and `unsafe-inline` don't make your policy less safe because they will be ignored by browsers who support `strict-dynamic`. Read more in [](link to lwe@'s article/#relevant section).

In HTML, you'll need to inline your scripts in order to apply a hash-based policy, because [most browsers don't support hashing external scripts]( https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned). 

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
* To protect your site from  clickjacking—a risk that arises if you allow untrusted sites to embed yours—use [X-Frame-Options](#xfo) or [CORP](#corp). If you need a more advanced configuration to only allow specific origins as embedders, the CSP directive called [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) is what you need.
* You may have used a CSP to ensure that all of your site's resources are loaded over HTTPS. This has become less relevant: nowadays, most browsers block [mixed-content](/what-is-mixed-content/).
{% endAside %}

### Supported browsers:

Chrome, Firefox, Edge, Safari

{% Aside 'gotchas' %}
Safari does *not* support `strict-dynamic` yet. But a strict CSP like in the examples above is safer than an allowlist CSP (and much safer than no CSP at all) for all of your users. Even in Safari, a strict CSP protects your site from some types of XSS attacks, because the presence of the CSP disallows certain unsafe patterns.
{% endAside %}

Other things to note about this header:

* You can also set a CSP in Report-Only mode 
* If you can't set a CSP as a header server-side, you can also set it as a meta tag. Note that you can't use Report-Only mode for meta tags (even though this may change).

### Learn more:

* [Mitigate XSS with a Strict Content Security Policy (CSP)](web.dev/...)
* [Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

{% endDetails %}

{% Details %}
{% DetailsSummary %}
Trusted Types

Trusted Types is one of CSP's directives that can prevent XSS on DOM manipulation. You can define policies that enforce sanitization to a given string before being applied to a DOM.
{% endDetailsSummary %}

Trusted Types is one of CSP's directives that can prevent XSS on DOM manipulation. You can define policies that enforce sanitization to a given string before being applied to a DOM.

### Recommended usage:

Websites with sensitive information should use Trusted Types.

Declare that the trusted types is a requirement:

{% Label %}CSP and Trusted Types header:{% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script';
```

{% Label %}Define a policy:{% endLabel %}

```javascript
// Feature detection
if (window.trustedTypes && trustedTypes.createPolicy) {
  const policy = trustedTypes.createPolicy('htmlPolicy', {
    createHTML: str => {
      return str.replace(/\</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
}
```

{% Label %}Use the policy:{% endLabel %}

```javascript
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
```

### Supported browsers:

Chrome, Edge

### Learn more:
* [DEMO](https://www.compass-demo.com/trusted-types/) (Open Inspector and see what is happening)
* [Prevent DOM-based cross-site scripting vulnerabilities with Trusted Types](https://web.dev/trusted-types/)
* [Trusted Types](https://w3c.github.io/webappsec-trusted-types/dist/spec/)

{% endDetails %}

{% Details %}
{% DetailsSummary %}
X-Content-Type-Options

`X-Content-Type-Options` informs the browser that MIME types advertised in the
`Content-Type` headers should not be changed and be followed.

{% endDetailsSummary %}

`X-Content-Type-Options` informs the browser that MIME types advertised in the
`Content-Type` headers should not be changed and be followed.

### Recommended for:

Appending `X-Content-Type-Options: nosniff` is recommended for all resources
unless their MIME type is explicitly expected to be altered by the browser.

### Example usage:

```http
X-Content-Type-Options: nosniff
```

### Supported browsers:

Chrome, Firefox, Safari and Edge

### Learn more:

* [X-Content-Type-Options - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)

{% endDetails %}

{% Details %}
{% DetailsSummary %}
HTTP Strict Transport Security (HSTS)

Inform the browser that it should never load the site using HTTP and use HTTPS instead.
{% endDetailsSummary %}

### Recommended for:

All websites that transitioned from HTTP to HTTPS.

### Example usage:

```http
Strict-Transport-Security: max-age=3600
```

### Supported browsers:

* Chrome
* Firefox
* Safari
* Edge

### Supports:

* Reporting API: false
* Report-Only mode: false
* meta tag: false

### Learn more:

* [Strict-Transport-Security - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)

{% endDetails %}

{% Details %}
{% DetailsSummary %}
Cross-Origin Resource Policy (CORP)

With the `Cross-Origin-Resource-Policy` header, you can inform the browser which domain context it can load the resource, from cross-origin, same-site or same-origin.
{% endDetailsSummary %}

With the `Cross-Origin-Resource-Policy` header, you can inform the browser which domain context it can load the resource, from cross-origin, same-site or same-origin.

This is a robust defense against attacks like Spectre, as it allows browsers to
block a given response before it enters an attacker's process. It is a
requirement for the resource to explicitly allow being loaded into the context
with CORP or CORS so that the page can enable [cross-origin
isolation](/coop-coep) and use the features such as SharedArrayBuffer,
`performance.measureUserAgentSpecificMemory()`, etc.

### Recommended usages:
It is recommended that **all** resources are served with one of the following three headers.

#### Allow the resource to be loaded `cross-origin`

`cross-origin` is recommended to be applied by CDN-like services whose resources are assumed to be loaded by cross-origin pages unless they are already served through CORS. When a website adopts cross-origin isolation, they will not be able to load the cross-origin resources without applying this header or CORS.

```http
Cross-Origin-Resource-Policy: cross-origin
```

#### Limit the resource to be loaded from the `same-origin`

`same-origin` is recommended to be applied to resources that are intended to be loaded only by same-origin pages. You may apply this to a resource that includes sensitive information about the user, or response of an API that is intended for the same origin.

Beware that even with this header the resource is still accessible from random requests so don't consider this as an ACL. It's just the browser will not load it on a cross-origin context. By "load" here means either the browser renders the content on the page or the JavaScript can read the content.

```http
Cross-Origin-Resource-Policy: same-origin
```

#### Limit the resource to be loaded from the `same-site`

`same-site` is recommended to be applied to resources similar to above but are intended to be loaded by same-site pages.

```http
Cross-Origin-Resource-Policy: same-site
```

Learn the difference between same-origin and same-site at [Understanding "same-site" and "same-origin" "same-site"](/same-site-same-origin/).

### Supported browsers:
Chrome, Firefox, Safari, Edge

### Learn more:

* [Consider deploying cross-origin resource policy!]()

{% endDetails %}

{% Details %}
{% DetailsSummary %}
Cross-Origin Embedder Policy (COEP)

Prevents documents and workers from loading non-same-origin requests unless explicitly allowed via CORS or CORP.
{% endDetailsSummary %}

### Recommended for:

Sites that want to use powerful features such as Shared Array Buffer, WASM Thread, JS Self Profiling API or performance.measureMemory().

### Example usage:

```http
Cross-Origin-Embedder-Policy: require-corp
```

### Supported browsers:

* Chrome
* Firefox
* Safari
* Edge

### Supports:

Reporting API: true
Report-Only mode: true
meta tag: false

### Learn more:
Making your website "cross-origin isolated" using COOP and COEP
Why you need "cross-origin isolated" for powerful features

{% endDetails %}

{% Details %}
{% DetailsSummary %}
Cross-Origin Opener Policy (COOP)

Provides a way for a document to request a new browsing context group to better isolate itself from other untrustworthy origins.
{% endDetailsSummary %}

### Recommended for:
Sites that want to use powerful features such as Shared Array Buffer, WASM Thread, JS Self Profiling API or performance.measureMemory().

### Example usage:
```http
Cross-Origin-Opener-Policy: same-origin
```

### Supported browsers:

* Chrome
* Firefox
* Safari
* Edge

### Supports:

* Reporting API: true
* Report-Only mode: true
* meta tag: false

### Learn more:

* Making your website "cross-origin isolated" using COOP and COEP
* Why you need "cross-origin isolated" for powerful features

{% endDetails %}

{% Details %}
{% DetailsSummary %}
X-Frame-Options
Indicate whether or not a browser should be allowed to render a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>` to prevent clickjacking attacks.
{% endDetailsSummary %}

### Recommended for:

### Example usage:
Protects your website from being embedded by any websites.
```http
X-Frame-Options: DENY
```

Protects your website from being embedded by all cross-origin websites.
```http
X-Frame-Options: SAMEORIGIN
```

### Supported browsers:

* Chrome
* Firefox
* Safari
* Edge

### Supports:

* Reporting API: false
* Report-Only mode: false
* meta tag: false

### Learn more:

* X-Frame-Options - HTTP

{% endDetails %}

{% Details %}
{% DetailsSummary %}
Timing-Allow-Origin

Specifies origins that are allowed to see values of attributes retrieved via features of the Resource Timing API. Without `Timing-Allow-Origin` header only the same-origin script can read the value.
{% endDetailsSummary %}

### Recommended for:

Websites that collect performance data.

### Example usage:

Allow all subresources to read values from the Resource Timing API.

```http
Timing-Allow-Origin: *
```

Allow https://example.com to read values from the Resource Timing API.
```http
Timing-Allow-Origin: https://example.com
```

### Supported browsers:

* Chrome
* Firefox
* Safari
* Edge

### Supports:

* Reporting API: false
* Report-Only mode: false
* meta tag: false

### Learn more:

* Timing-Allow-Origin - HTTP
{% endDetails %}


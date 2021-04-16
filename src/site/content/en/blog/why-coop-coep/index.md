---
title: Why you need "cross-origin isolated" for powerful features
subhead: >
  Learn why cross-origin isolation is needed to use powerful features such as
  `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()`, high
  resolution timer with better precision and the JS Self-Profiling API.
description: >
  Some web APIs increase the risk of side-channel attacks like Spectre. To
  mitigate that risk, browsers offer an opt-in-based isolated environment called
  cross-origin isolated. Learn why cross-origin isolation is needed to use
  powerful features such as `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()`,
  high resolution timer with better precision and the JS Self-Profiling API.
authors:
  - agektmr
  - domenic
hero: image/admin/h8g1TQjkfkJSpWJrPakB.jpg
date: 2020-05-04
updated: 2021-04-12
tags:
  - blog
  - security
feedback:
  - api
---
## Introduction
In [Making your website "cross-origin isolated" using COOP and
COEP](/coop-coep/) we explained how to adopt to "cross-origin
isolated" state using COOP and COEP. This is a companion article that explains
why cross-origin isolation is required to enable powerful features on the browser.

{% Aside 'key-term' %}
This article uses many similar-sounding terminologies. To make things
clearer, let's define them:

* [COEP: Cross Origin Embedder
  Policy](https://wicg.github.io/cross-origin-embedder-policy/)
* [COOP: Cross Origin Opener
  Policy](https://github.com/whatwg/html/pull/5334/files)
* [CORP: Cross Origin Resource
  Policy](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
* [CORS: Cross Origin Resource
  Sharing](https://developer.mozilla.org/docs/Web/HTTP/CORS)
* [CORB: Cross Origin Read
  Blocking](https://www.chromium.org/Home/chromium-security/corb-for-developers)
{% endAside %}

## Background

The web is built on the [same-origin
policy](/same-origin-policy/): a security feature that restricts
how documents and scripts can interact with resources from another origin. This
principle restricts the ways websites can access cross-origin resources. For
example, a document from `https://a.example` is prevented from accessing data
hosted at `https://b.example`.

However, the same-origin policy has had some historical exceptions. Any website can:
* Embed cross-origin iframes
* Include cross-origin resources such as images or scripts
* Open cross-origin popup windows with a DOM reference

If the web could be designed from scratch, these exceptions wouldn't exist.
Unfortunately, by the time the web community realized the key benefits of a
strict same-origin policy, the web was already relying on these exceptions.

The security side-effects of such a lax same-origin policy were patched in two
ways. One way was through the introduction of a new protocol called [Cross
Origin Resource Sharing (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS)
whose purpose is to make sure that the server allows sharing a resource with a
given origin. The other way is by implicitly removing direct script access to
cross-origin resources while preserving backward compatibility. Such
cross-origin resources are called "opaque" resources. For example, this is why
manipulating the pixels of a cross-origin image via `CanvasRenderingContext2D`
fails unless CORS is applied to the image.

All these policy decisions are happening within a browsing context group.

{% Img src="image/admin/z1Gr4mmJMo383dR9FQUk.png", alt="Browsing Context Group", width="800", height="469" %}

For a long time, the combination of CORS and opaque resources was enough to make
browsers safe. Sometimes edge cases (such as [JSON
vulnerabilities](https://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/))
were discovered, and needed to be patched, but overall the principle of not
allowing direct read access to the raw bytes of cross-origin resources was
successful.

This all changed with
[Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)), which
makes any data that is loaded to the same browsing context group as your code
potentially readable. By measuring the time certain operations take, attackers
can guess the contents of the CPU caches, and through that, the contents of the
process' memory. Such timing attacks are possible with low-granularity timers
that exist in the platform, but can be sped up with high-granularity timers,
both explicit (like `performance.now()`) and implicit (like
`SharedArrayBuffer`s). If `evil.com` embeds a cross-origin image, they can use a
Spectre attack to read its pixel data, which makes protections relying on
"opaqueness" ineffective.

{% Img src="image/admin/wN636enwMtBrrOfhzEoq.png", alt="Spectr", width="800", height="500" %}

Ideally, all cross-origin requests should be explicitly vetted by the server
that owns the resource. If vetting is not provided by
the resource-owning server, then the data will never make it into the browsing
context group of an evil actor, and therefore will stay out of reach of any Spectre
attacks a web page could carry out. We call it a cross-origin isolated state.
This is exactly what COOP+COEP is about.

Under a cross-origin isolated state, the requesting site is considered less
dangerous and this unlocks powerful features such as `SharedArrayBuffer`,
`performance.measureUserAgentSpecificMemory()`, [high resolution
timers](https://www.w3.org/TR/hr-time/) with better precision and the JS
Self-Profiling API which could otherwise be used for Spectre-like attacks. It
also prevents modifying `document.domain`.

### Cross Origin Embedder Policy {: #coep }
[Cross Origin Embedder
Policy (COEP)](https://wicg.github.io/cross-origin-embedder-policy/) prevents a
document from loading any cross-origin resources that don't explicitly grant
the document permission (using CORP or CORS). With this feature, you can declare
that a document cannot load such resources.

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="How COEP works", width="800", height="410" %}

To activate this policy, append the following HTTP header to the document:

```http
Cross-Origin-Embedder-Policy: require-corp
```

The `require-corp` keyword is the only accepted value for COEP. This enforces
the policy that the document can only load resources from the same origin, or
resources explicitly marked as loadable from another origin.

For resources to be loadable from another origin, they need to support either
Cross Origin Resource Sharing (CORS) or Cross Origin Resource Policy (CORP).

### Cross Origin Resource Sharing {: #cors }
If a cross origin resource supports [Cross Origin Resource Sharing
(CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), you may use the
[`crossorigin`
attribute](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin)
to load it to your web page without being blocked by COEP.

```html
<img src="https://third-party.example.com/image.jpg" crossorigin>
```

For example, if this image resource is served with CORS headers, use the
`crossorigin` attribute so that the request to fetch the resource will use [CORS
mode](https://developer.mozilla.org/docs/Web/API/Request/mode). This also
prevents the image from being loaded unless it sets CORS headers.

Similarly, you may fetch cross origin data through the `fetch()` method, which
doesn't require special handling as long as the server responds with [the right
HTTP
headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers).

### Cross Origin Resource Policy {: #corp }
[Cross Origin Resource Policy
(CORP)](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_%28CORP%29)
was originally introduced as an opt-in to protect your resources from being
loaded by another origin. In the context of COEP, CORP can specify the resource
owner's policy for who can load a resource.

The `Cross-Origin-Resource-Policy` header takes three possible values:

```http
Cross-Origin-Resource-Policy: same-site
```

Resources that are marked `same-site` can only be loaded from the same site.

```http
Cross-Origin-Resource-Policy: same-origin
```

Resources that are marked `same-origin` can only be loaded from the same origin.

```http
Cross-Origin-Resource-Policy: cross-origin
```

Resources that are marked `cross-origin` can be loaded by any website. ([This
value](https://mikewest.github.io/corpp/#integration-fetch) was added to the
CORP spec along with COEP.)

{% Aside %}
Once you add the COEP header, you won't be able to bypass the restriction by
using service workers. If the document is protected by a COEP header, the policy
is respected before the response enters the document process, or before it
enters the service worker that is controlling the document.
{% endAside %}

### Cross Origin Opener Policy {: #coop }
[Cross Origin Opener Policy
(COOP)](https://github.com/whatwg/html/pull/5334/files) allows you to ensure
that a top-level window is isolated from other documents by putting them in a
different browsing context group, so that they cannot directly interact with the
top-level window. For example, if a document with COOP opens a pop-up, its
`window.opener` property will be `null`. Also, the `.closed` property of the
opener's reference to it will return `true`.

{% Img src="image/admin/eUu74n3GIlK1fj9ACxF8.png", alt="COOP", width="800", height="452" %}

The `Cross-Origin-Opener-Policy` header takes three possible values:

```http
Cross-Origin-Opener-Policy: same-origin
```

Documents that are marked `same-origin` can share the same browsing context
group with same-origin documents that are also explicitly marked `same-origin`.

{% Img src="image/admin/he8FaRE2ef67lamrFG60.png", alt="COOP", width="800", height="507" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

A top-level document with `same-origin-allow-popups` retains references to any
of its popups which either don't set COOP or which opt out of isolation by
setting a COOP of `unsafe-none`.

{% Img src="image/admin/AJdm6vFq4fQXUWOTFeFa.png", alt="COOP", width="800", height="537" %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

`unsafe-none` is the default and allows the document to be added to its opener's
browsing context group unless the opener itself has a COOP of `same-origin`.

{% Aside %}
The
[`noopener`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features)
attribute has a similar effect to what you would expect from COOP except that it
works only from the opener side. (You can't disassociate your window when it is opened
by a third party.) When you attach `noopener` by doing something such as
`window.open(url, '_blank', 'noopener')` or `<a target="_blank"
rel="noopener">`, you can deliberately disassociate your window from the opened
window.

While `noopener` can be replaced by COOP, it's still useful for when you want to
protect your website in browsers that don't support COOP.
{% endAside %}

## Summary {: #summary }

If you want guaranteed access to powerful features like `SharedArrayBuffer`,
`performance.measureUserAgentSpecificMemory()`, [high resolution
timers](https://www.w3.org/TR/hr-time/) with better precision or JS
Self-Profiling API, just remember that your document needs to use both COEP with
the value of `require-corp` and COOP with the value of `same-origin`. In the
absence of either, the browser will not guarantee sufficient isolation to safely
enable those powerful features. You can determine your page's situation by
checking if
[`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated)
returns `true`.

Learn the steps to implement this at [Making your website "cross-origin
isolated" using COOP and COEP](/coop-coep/).

## Resources
* [COOP and COEP
  explained](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)
* [Planned changes to shared memory - JavaScript |
  MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes)

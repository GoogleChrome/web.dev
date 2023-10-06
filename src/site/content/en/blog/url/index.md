---  
title: What are the parts of a URL?  
subhead: "What's the difference between a host, site and origin? What's an eTLD? This article explains."
authors:
  - samdutton
date: 2023-10-05
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/EAQ6QLeBBonbpyqeGWPb.jpg
alt:
tags:
    - blog
    - html
    - network
    - privacy
---

Most of the time it's fine to say things like "I bought a domain" or "Our images are hosted on a
different site", even if that's not strictly true. However, in some contexts it's necessary to be
more precise. For example, when dealing with cookies, you need to understand the difference between
[site](#site) and
[origin](#origin).

Names for URL parts are specified in a standard, which also defines a JavaScript API:

-  The [URL standard](https://url.spec.whatwg.org/) defines URLs and related concepts to enable
    engineers to build interoperable web browsers.
-  The [URL API](https://developer.mozilla.org/docs/Web/API/URL_API) component of the standard
    defines methods to provide access to parts of a URL string, such as the
    [scheme](#scheme) or [origin](#origin).

This article explains a range of terms used with HTTP or HTTPS URL strings. It does not cover other types
of URL such as file or data URLs. For terms such as `host` and `origin`, accurate definitions are
inherently complex, so this article provides examples and links to the URL standard, rather than
attempting full explanations.

You can use JavaScript to get the names of URL components that are defined by the URL API. For example:

```javascript
let url = new URL('https://foo.com.au:1234/bar/foo.html#bar');
console.log(url);
```

Edit the URL in the Glitch below to see how parts of the URL string are named. You can also open
this in a separate tab at [url-parts.glitch.me](https://url-parts.glitch.me/).

{% Glitch 'url-parts' %}

<br>

Names for URL parts are listed alphabetically below.

## Country-code top-level domain (ccTLD)  {: #cctld}

A [top-level domain](#tld) defined in
the [ISO 3166-1 Country Codes list](https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes).

-  For `https://example.com.au`, the ccTLD is [`au`](https://en.wikipedia.org/wiki/.au).
-  For `https://example.io`, the ccTLD is [`io`](https://en.wikipedia.org/wiki/.io).

## Domain name {: #domain-name}

The parts of an HTTP or HTTPS URL separated by dots: everything after the [scheme](#scheme), but
before the [path](#pathname) or [port](#port) (if specified). Each part of the domain name is known
as a [label](https://www.icann.org/en/icann-acronyms-and-terms/label-en).

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><strong>Domain name</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://example.github.io/path</td>
      <td>example.github.io</td>
    </tr>
    <tr>
      <td>https://support.example.com.au:443</td>
      <td>support.example.com.au</td>
    </tr>
  </tbody>
</table>

## Effective top-level domain (eTLD) {: #etld}

An entry in the [Public Suffix List](https://publicsuffix.org/list/), including a [TLD](#tld) and
(for eTLDs with multiple parts) additional domains below that: second-level, third-level, and so on.

-  For example: `com`, `com.au`, `github.io`, `sa.edu.au`, `schools.nsw.edu.au`.

A "public suffix", such as these examples,  is a name under which domains can be registered. The Public Suffix List is a list of all known public suffixes, and is frequently updated. Browsers including [Chromium](https://chromium.googlesource.com/chromium/src/+/master/net/base/registry_controlled_domains/effective_tld_names.dat)
and [Firefox](https://github.com/mozilla/gecko-dev/blob/master/netwerk/dns/effective_tld_names.dat)
use the list in their builds.

{% Aside %}
As well as one-part and two-part eTLDs such as `com`, `com.au` or `github.io`, the Public
Suffix List also includes three-part, four-part and even five-part eTLDs.

The list also includes suffixes such as `github.io` and `glitch.me`. Names under these, such as
`example.github.io` and `example.glitch.me`, can be used for site hosting but cannot be "registered"
by a developer. GitHub and Glitch act as registrars in these examples.
{% endAside %}

## eTLD+1 {: #etld1}

See [registrable domain](#registrable-domain).

An [eTLD](#etld) plus the subdomain that precedes it.

-  For example: `example.com`, `example.com.au`, `example.github.io`, `example.sa.edu.au`,
    `example.schools.nsw.edu.au`.

## Fragment (or hash)  {: #fragment}

A string following a # character at the end of a URL that provides a
[fragment identifier](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#anchor).
(In [some contexts](https://developer.mozilla.org/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#anchor)
this is referred to as an "anchor".)

-  For example: the URL `https://example.com/cats#tabby` has a fragment identifier (hash) value
    of `tabby`.

{% Aside "important" %}
The fragment (hash) value is not passed when an HTTP request is made to a server.
{% endAside %}

You can also link to and highlight a [text fragment](/text-fragments) within a document. For example, to link to the first occurrence of the text "fragment" in this article, use the URL `https://web.dev/url#:~:text=fragment`.

-  [Spec](https://url.spec.whatwg.org/#dom-url-hash)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/hash)

## Fully-qualified domain name (FQDN) {: #fqdn}

A complete address for a website or a server, that maps to an
[IP address](https://en.wikipedia.org/wiki/IP_address).

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><strong>FQDN</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://example.com:1234/cats</td>
      <td>example.com</td>
    </tr>
    <tr>
      <td>https://api.example.github.io</td>
      <td>api.example.github.io</td>
    </tr>
  </tbody>
</table>

The FQDN for a URL does not include the [port](#port), even if a non-default port is used.

## Hash

See [fragment](#fragment).

## Host {: #host}

As defined in the [URL standard](https://url.spec.whatwg.org/#host-representation), a host can be a
[domain name](#domain-name), IP v4 address, IPv6 address, opaque host, or empty host.

-  The URL standard's definition of `host` does not include the [port](#port).
-  [`URL.host`](https://developer.mozilla.org/docs/Web/API/URL/host) includes the port, unless
the port is the default for the scheme.
-  [`URL.hostname`](https://developer.mozilla.org/docs/Web/API/URL/hostname) does not include
the port.

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><code>URL.host</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="vertical-align: top;">https://www.example.com:443/cat</td>
      <td style="vertical-align: top;"><code>www.example.com<br>
// 443 is the default port for the scheme</code></td>
    </tr>
    <tr>
      <td>https://www.example.com:1234/cat</td>
      <td><code>www.example.com:1234</code></td>
    </tr>
    <tr>
      <td>https://cat.example.github.io</td>
      <td><code>cat.example.github.io</code></td>
    </tr>
  </tbody>
</table>

-  [Spec](https://url.spec.whatwg.org/#dom-url-host)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/host)

## Hostname {: #hostname}

Hostname is defined by the JavaScript `URL` API, but not elsewhere by the URL standard. See
[host representation](https://url.spec.whatwg.org/#concept-domain) for more detail.

[`URL.hostname`](https://developer.mozilla.org/docs/Web/API/URL/hostname) returns the
[host](#host) without the [port](#port).

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><code>URL.hostname</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://www.example.com:443/cat</td>
      <td><code>www.example.com</code></td>
    </tr>
    <tr>
      <td>https://www.example.com:1234/cat</td>
      <td><code>www.example.com</code></td>
    </tr>
    <tr>
      <td>https://cat.example.github.io</td>
      <td><code>cat.example.github.io</code></td>
    </tr>
  </tbody>
</table>

-  [Spec](https://url.spec.whatwg.org/#dom-url-hostname)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/hostname)

## Origin {: #origin}

The URL standard [defines `origin`](https://url.spec.whatwg.org/#origin), and links to the
[HTML standard](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) for background.

For HTTP or HTTPS URLs, [`URL.origin`](https://developer.mozilla.org/docs/Web/API/URL/origin)
returns the [scheme](#scheme), the [host](#host), and [port](#port) (unless the port is the default
for the scheme).

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><code>URL.origin</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://www.example.com:443/cat</td>
      <td><code>https://www.example.com</code></td>
    </tr>
    <tr>
      <td>https://www.example.com:1234/cat</td>
      <td><code>https://www.example.com:1234</code></td>
    </tr>
    <tr>
      <td>https://cat.example.github.io</td>
      <td><code>https://cat.example.github.io</code></td>
    </tr>
  </tbody>
</table>

-  [Spec](https://url.spec.whatwg.org/#dom-url-origin)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/origin)

## Parameter {: #parameter}

Not defined in the URL standard, and not part of the URL API, but commonly used to refer to an item
of data passed in a [search string](#search) (also known as a "query string").

-  For example: for `https://example.com/cats?pattern=tabby&mood=bonkers`, the search string has
two parameters: `pattern=tabby` and `mood=bonkers`.

See also [URL.searchParams](https://developer.mozilla.org/docs/Web/API/URL/searchParams).

## Pathname {: #pathname}

For an HTTP or HTTPS URL, the part after the domain and port (if defined), including a filename (if
defined) but not including the [search string](#search) or [hash](#hash).

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><code>URL.pathname</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://example.com</td>
      <td><code>[empty string]</code></td>
    </tr>
    <tr>
      <td>https://example.com:8000/search?q=tabby</td>
      <td><code>/search</code></td>
    </tr>
    <tr>
      <td>https://example.github.io/cat/pattern#tabby</td>
      <td><code>/cat/pattern</code></td>
    </tr>
    <tr>
      <td>https://example.github.io/README.md</td>
      <td><code>/README.md</code></td>
    </tr>
  </tbody>
</table>

"Path" is sometimes used to refer to the pathname without the filename. For example, for the URL
`https://example.com/cat/pattern/tabby.html`, the "path" is `/cat/pattern`.

-  [Spec](https://url.spec.whatwg.org/#dom-url-pathname)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/pathname)

## Port {: #port}

The number after a `:` in a URL that identifies a network port. For example: for the URL
`https://example.com:1234/tabby` the port number is 1234.

The port number must be a [16-bit unsigned integer](https://url.spec.whatwg.org/#concept-url-port):
in other words, an integer between 0 and 65535 inclusive.

For an HTTP URL, the default port is 80; for HTTPS, the default is 443. A URL does
not need to specify the port number unless a non-default port is used.

The API returns an empty string if the port is the default for the scheme.

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><code>URL.port</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://example.com</td>
      <td><code>// empty string</code></td>
    </tr>
    <tr>
      <td>https://example.com:443/foo</td>
      <td><code>// empty string: port is default for scheme</code></td>
    </tr>
    <tr>
      <td>https://www.example.com:1234/foo</td>
      <td><code>1234</code></td>
    </tr>
  </tbody>
</table>

-  [Spec](https://url.spec.whatwg.org/#dom-url-port)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/port)

## Registrable domain {: #registrable-domain}

-  For a URL with a single-part [eTLD](#etld) such as `com` or `org` (i.e. an
    eTLD that corresponds to a [TLD](#tld)), the domain and the
    [second-level domain](#sld) before it: for example, `example.com` or `example.org`.
-  For a URL with a two-part eTLD where only third-level registration is allowed (i.e. entries
    in the [Public Suffix List](https://publicsuffix.org/list/) such as `com.au` and, `github.io`)
    the two-part top-level domain ("public suffix") and the third-level domain name just before
    that. For example: `example.com.au` or `example.github.io`.
-  For eTLDs with three or more parts, the eTLD and the domain before that.

{% Aside %}
Confusingly, perhaps, domains such as `example.github.io` or `example.glitch.me` are
[defined as "registrable domains"](https://url.spec.whatwg.org/#host-registrable-domain) though they
cannot be "registered" by a developer. GitHub and Glitch act as registrars for these examples.
{% endAside %}

## Scheme {: #scheme}

The part of the URL (before `://`) that defines the
[network protocol](https://developer.mozilla.org/docs/Glossary/Protocol) (or action to be taken by
the user agent) when a request is made to a URL. For example, a request to a URL with an `https`
scheme should be made using the [HTTPS protocol](https://en.wikipedia.org/wiki/HTTPS). For a request
to a URL with a scheme such as `file`, `mailto` or `git` that doesn't correspond to a network
protocol, behavior depends on the user agent. For example, when a user clicks on a `mailto` link,
most browsers open their default email application, using the values in the link's `href` URL.

-  [Spec](https://url.spec.whatwg.org/#dom-url-protocol)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/protocol)

## Search (or "query string") {: #search}

A series of key/value pairs that represent [parameters](#parameter) and their values, at the end of
a URL after a question mark.

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><strong><code>URL.search</code></strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://example.com/cats?pattern=tabby&mood=bonkers</td>
      <td><code>?pattern=tabby&mood=bonkers</code></td>
    </tr>
    <tr>
      <td>https://example.com/cats:443?pattern=tabby</td>
      <td><code>?pattern=tabby</code></td>
    </tr>
  </tbody>
</table>

See also [URL.searchParams](https://developer.mozilla.org/docs/Web/API/URL/searchParams).

-  [Spec](https://url.spec.whatwg.org/#dom-url-search)
-  [API](https://developer.mozilla.org/docs/Web/API/URL/search)

## Second-level domain {: #sld}

The domain before a [top-level domain](#tld).

-  For the URL `https://www.example.com`, the second-level domain is `example.com`, a
[subdomain](#subdomain) of the top-level domain `com`.

-  For `https://example.com.au`, the top-level domain is `au`, the second-level domain is `com`
and the third-level domain is `example`. In this example, `com.au` is a subdomain of `au` and
`example.com.au` is a subdomain of `com.au`.

## Site {: #site}

[Site](https://html.spec.whatwg.org/multipage/browsers.html#sites) is defined by the HTML standard,
along with [same-site](https://html.spec.whatwg.org/multipage/browsers.html#same-site), which
[includes scheme](https://github.com/whatwg/url/issues/448), and
[schemeless same-site](https://html.spec.whatwg.org/multipage/browsers.html#schemelessly-same-site).
Site is not defined in the URL standard or the URL JavaScript API.

In this context:

-  For an HTTP or HTTPS URL with a single-part [eTLD](#tld) such as
    `https://example.com`, the site consists of the `scheme`, the eTLD and the
    [label](https://www.icann.org/en/icann-acronyms-and-terms/label-en) before that. For example:
    for the URL `https://www.example.com/cat`, the site is `https://example.com`. (For this URL,
    the eTLD is the same as the [top-level domain](#tld).)
-  For multipart [eTLD](#tld)s such as `co.uk`, `github.io` or `sa.edu.au`, the "site" consists of
    the `scheme`, the [eTLD](#tld) and the
    [label](https://www.icann.org/en/icann-acronyms-and-terms/label-en) before that. For example:
    for the URL `https://cat.example.co.uk/tabby`, the site is `https://example.co.uk`, and for
    `https://www.education.sa.gov.au` the site is `https://education.sa.gov.au`.

<table>
  <thead>
    <tr>
      <th><strong>URL</strong></th>
      <th><strong>Site (with scheme)</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://cat.example.com/tabby</td>
      <td>https://example.com</td>
    </tr>
    <tr>
      <td>https://cat.example.co.uk/tabby</td>
      <td>https://example.co.uk</td>
    </tr>
  </tbody>
</table>

Unlike [origin](#origin), site does not include [port](#port).

{% Aside %}
The concept of "site" is important in terms of "same-site", because certain security restrictions
apply to subdomains that are considered "same-site" even if they are not "same-origin".
[Understanding "same-site" and "same-origin"](https://deploy-preview-9613--web-dev-staging.netlify.app/same-site-same-origin/) provides further information.
{% endAside %}

-  [Spec](https://html.spec.whatwg.org/multipage/browsers.html#sites)

## Subdomain {: #subdomain}

A domain within a higher-level domain.

For sites with single-part top-level domains such as `com` or `org`, the parts before the top-level
domain, each of which is separated by a dot.

-  `www.example.com` is a subdomain of `example.com`.
-  `support.api.example.org` is a subdomain of `api.example.org`, which is a subdomain of
    `example.org`.

For two-part eTLDs where only third-level registrations are allowed (i.e. entries in the
[Public Suffix List](https://publicsuffix.org/list/) such as `co.uk` and `github.io`) the subdomains
are the parts of the domain name before that.

-  For example: `cat.example.co.uk` is a subdomain of `example.co.uk`.

## Top-level domain (TLD) {: #tld}

A domain name listed in the [Root Zone Database](https://www.iana.org/domains/root/db) such as
[`com`](https://www.iana.org/domains/root/db/com.html) or [`org`](https://www.iana.org/domains/root/db/org.html). Some top-level domains are [country code top-level domains](#cctld),
such as [`uk`](https://www.iana.org/domains/root/db/uk.html) and
[`tv`](https://www.iana.org/domains/root/db/tv.html).

When describing the parts of an HTTP or HTTPS URL, the TLD is the domain name that follows the final
dot.

-  For `https://example.com`, the URL's top-level domain is `com`.
-  For `https://example.com.au`, the URL's top-level domain is `au`, and `com` is a
[second-level domain](#sld) (even though `com` is also a top-level domain). `com.au` is a two-part
[eTLD](#etld).

The [Public Suffix List](https://publicsuffix.org/list/) of [eTLD](#etld)s includes domains with
one, two or more parts, so a TLD can also be an eTLD. For example:

-  For `https://example.com`, the URL's eTLD is `com`, which is also a TLD.

---

## Find out more {: #more}

-  [WHATWG: URL Living Standard](https://url.spec.whatwg.org/)
-  [WHATWG: HTML Living Standard](https://html.spec.whatwg.org/)
-  [URL API](https://developer.mozilla.org/docs/Web/API/URL_API)
-  [Understanding "same-site" and "same-origin"](https://deploy-preview-9613--web-dev-staging.netlify.app/same-site-same-origin/)
-  [RFC: Uniform Resource Locators (URL)](https://www.rfc-editor.org/rfc/rfc1738)
-  [RFC: URIs, URLs and URNs](https://datatracker.ietf.org/doc/html/rfc3305)
-  [Root Zone Database](https://www.iana.org/domains/root/db) (directory of
    [TLDs](#tld))
-  [Public Suffix List](https://publicsuffix.org/list/) (directory of
    [eTLDs](#etld): "A public suffix
    is a set of DNS names or wildcards concatenated with dots. It represents the part of a domain
    name which is not under the control of the individual registrant.")
-  [ICANN glossary](https://www.icann.org/en/icann-acronyms-and-terms?nav-letter=r&page=1)
-  [What is a Fully Qualified Domain Name?](https://datatracker.ietf.org/doc/html/rfc1594#section-5)
-  [How many ways can you slice a URL and name the pieces?](https://tantek.com/2011/238/b1/many-ways-slice-url-name-pieces)
-  [MDN Web Docs Glossary](https://developer.mozilla.org/docs/Glossary)
-  [What is a URL?](https://developer.mozilla.org/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL)

Photo by [Mathyas Kurmann](https://unsplash.com/@mathyaskurmann) on
[Unsplash](https://unsplash.com/photos/fb7yNPbT0l8).
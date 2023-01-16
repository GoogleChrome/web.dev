---  
title: What are the parts of a URL?  
subhead: "What's the difference between a domain name, hostname, site and origin? This article explains."
authors:  
  - samdutton  
date: 2023-01-19  
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/CVV3xEIQFGopaQCq0JJW.png
alt:   
tags:  
    - blog
    - html
    - network
    - privacy
---

Most of the time it's fine to be relaxed about naming when talking about websites and URLs. It's
usually OK to say things like "I bought a domain name"' or "Our images are hosted on a different
site"—even if that's not strictly true.

However, in some contexts it's crucial to be accurate and specific when referring to the parts of a
URL. For example, when dealing with cookies, you need to understand the difference between
[site](#site)
and
[origin](#origin).
 This article is designed to help with that.

The examples here are only intended as a guide. [The URL Living
Standard](https://url.spec.whatwg.org/) provides formal definitions of URL parts.

{% Aside 'caution' %}  
The named parts of a URL may coincide, but that doesn't mean they're equivalent!   
  
In the first example below,  the FQDN, eTLD+1, hostname, site and registrable domain are all the
same, but each term has a different meaning.  
{%  endAside %}

## Examples

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/CVV3xEIQFGopaQCq0JJW.png", alt="ALT_TEXT_HERE", width="800", height="177" %}

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/oqP4zn3qBkZChbjNaVCQ.png", alt="ALT_TEXT_HERE", width="800", height="177" %}

## Glossary

**Anchor** {: #anchor}

See
[hash](#hash).

**Country-code top-level domain** (ccTLD) {: #cctld}

A
[top-level domain](#tld)
defined in the [ISO 3166-1 Country Codes
list](https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes). 

-  For `https://example.com.au`, the ccTLD is `au`.

**Domain name ** {: #domain-name}

The parts of a URL separated by dots: everything after the [scheme](#scheme), but before the
[path](#pathname) or [port](#port) (if specified).

-  For `https://example.github.io/path`, the domain name is `example.github.io`. 
-  For `https://support.example.com.au:443`, the domain name is `support.example.com.au`.
-  Each part of the domain name is known as a
    [label](https://www.icann.org/en/icann-acronyms-and-terms/label-en).

**Effective top-level domain** (eTLD) {: #etld}

An entry in the [Public Suffix List](https://publicsuffix.org/list/), including a
[TLD](#tld) and
a
[second-level domain](#sld).

-  For example: `github.io`, `com.au`. 

**eTLD+1** {: #etld1}

An [eTLD](#etld)
plus the subdomain that precedes it. 

-  For example: `example.github.io`, `example.com.au`.

**Fully-qualified domain name** (FQDN) {: #fqdn}

A complete address for a website or a server, that maps to an [IP address](https://en.wikipedia.org/wiki/IP_address).

-  For `https://example.com:443/cats` the FQDN is `example.com`.
-  For `https://api.example.github.io`, the FQDN is `api.example.github.io`.

{% Aside %}  
The FQDN for a URL does not include the [port](#port), even if the port is provided in the URL.
{% endAside %}

**Hash** {: #hash}

Also known as "anchor".  

A string following a `#` character at the end of a URL that provides a
[fragment identifier](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#anchor).
For example, the URL `https://example.com/cats#tabby` has the hash value (anchor) `tabby`. 

URL spec: [hash](https://url.spec.whatwg.org/#dom-url-hash)  
URL API: [hash](https://developer.mozilla.org/docs/Web/API/URL/hash)

{% Aside %}  
The hash value is not passed when an HTTP request is made to a server.  
{% endAside %}

**Host** {: #host}

The [domain name](#domain-name), followed by the port if defined.

-  For `https://www.example.com:443/foo`, the host is `www.example.com:443`.
-  For `https://support.example.github.io`, the host is `support.example.github.io`. 

URL spec: [host](https://url.spec.whatwg.org/#dom-url-host)  
URL API: [host](https://developer.mozilla.org/docs/Web/API/URL/host)

**Hostname** {: #hostname}

Generally equivalent to [domain name](#domain-name), but see
[Host representation](https://url.spec.whatwg.org/#concept-domain) in the WHATWG URL standard for
more detail.

URL spec: [hostname](https://url.spec.whatwg.org/#dom-url-hostname)  
URL API: [hostname](https://developer.mozilla.org/docs/Web/API/URL/hostname)

{% Aside %}  
Unlike [host](#host), the hostname of a URL does not include the [port](#port).
{% endAside %}

**Origin** {: #origin}

The [scheme](#scheme) followed by the [host](#host).

-  For `https://www.example.com:443/foo`, the origin is `https://www.example.com:443`.
-  For `https://support.example.github.io`, the origin is `https://support.example.github.io:443`. 

URL spec: [origin](https://url.spec.whatwg.org/#dom-url-origin)  
URL API: [origin](https://developer.mozilla.org/docs/Web/API/URL/origin)

{% Aside %}  
Unlike [site](#site), origin includes the [scheme](#scheme) and [port](#port) (if provided in the
URL).
{% endAside %}

**Parameter** {: #parameter}

An item of data passed in a [query string](#query-string).

-  For `https://example.com/cats?pattern=tabby&mood=bonkers`, the query string has two
    parameters: `pattern=tabby` and `mood=bonkers`.

URL spec: [searchParams](https://url.spec.whatwg.org/#dom-url-searchparams)  
URL API: [searchParams](https://developer.mozilla.org/docs/Web/API/URL/searchParams)

**Pathname** {: #pathname}

The part of a URL after the domain and port (if defined), including a filename (if defined) but not
including the [query string](#query-string) or [hash](#hash).

-  For `https://example.com:8000/search?q=tabby`, the pathname is `/search`.
-  For `example.github.io/foo`, the pathname is `/foo`.
-  For `example.github.io/README.md`, the pathname is `/README.md`.
-  For `example.com`, the pathname is an empty string.

The 'path' component of a URL is sometimes used to refer to the pathname without the filename.

URL spec: [pathname](https://url.spec.whatwg.org/#dom-url-pathname)  
URL API: [pathname](https://developer.mozilla.org/docs/Web/API/URL/pathname)

**Port** {: #port}

A string following a `:` in a URL providing an integer that identifies a network port. For example,
in the URL `https://example.com:443/tabby`, the port number is 443.

URL spec: [port](https://url.spec.whatwg.org/#dom-url-port)  
URL API: [port](https://developer.mozilla.org/docs/Web/API/URL/port)

**Query string** {: #query-string}

Also known as search string.

A series of key/value pairs that represent [parameters](#parameter), at the end of a URL after a
question mark.

-  For `https://example.com/cats?pattern=tabby&mood=bonkers`, the query string is
    `pattern=tabby&mood=bonkers`.

URL spec: [search](https://url.spec.whatwg.org/#dom-url-search)  
URL API: [search](https://developer.mozilla.org/docs/Web/API/URL/search)

**Registrable domain** {: #registrable-domain}

-  For a site with a single-part top-level domain such as `com` or `org`, the top-level domain
    and the [second-level domain](#sld) before it: for example, `example.com` or `example.org`.
-  For a top-level domain where only third-level registration is allowed (i.e. entries in the
    [Public Suffix List](https://publicsuffix.org/list/) such as `co.uk` and, `github.io`) the
    two-part top-level domain ('public suffix') and the third-level domain name just before that:
    for example, `example.co.uk` or `example.com.au`. (Confusingly, perhaps, domains such as
    `example.github.io` or `example.glitch.me` are  [defined as 'registrable domains'](https://url.spec.whatwg.org/#host-registrable-domain) though they cannot be registered via a domain name registrar.)

**Scheme** {: #scheme}

The part of the URL (before `://`) that defines the [protocol](https://developer.mozilla.org/docs/Glossary/Protocol)
(or action to be taken by the user agent) when a request is made to a URL. For example, a request
to a URL with an `https` scheme should be made using the [HTTPS protocol](https://en.wikipedia.org/wiki/HTTPS).
For a request to a URL with a scheme such as `file`, `mailto` or `git` that doesn't correspond to a
network protocol, the behaviour depends on the user agent. For example, when a user clicks on a
`mailto` link, the browser might open its default email application, using the values in the link
URL.

URL API: [protocol](https://developer.mozilla.org/docs/Web/API/URL/protocol)
URL spec: [protocol](https://url.spec.whatwg.org/#dom-url-protocol)

**Second-level domain** {: #sld}

The domain before the [top-level domain](#tld):

-  For the URL `https://www.example.com`, `example.com` is the second-level domain, a
    [subdomain](#subdomain) of the top-level domain `com`.
-  For `https://example.com.au`, the top-level domain is `au`, the second-level domain is `com`
    and the third-level domain is `example`. In this example, `com.au` is a subdomain of `au` and
    `example.com.au` is a subdomain of `com.au`.

**Site** {: #site}

-  For a site such as `example.com` with a single-part top-level domain: the top-level domain
    and the part before it. For example, for the URL `https://www.example.com/foo`, the site is
    `example.com`. 
-  For an [eTLD](#tld)
    where only third-level registrations are allowed (such as `co.uk` or `github.io`) the top-level
    domain ('public suffix') and the part of the domain name just before that. For example, for the
    URL `https://www.example.co.uk/foo`, the site is  `example.co.uk`. (Confusingly, perhaps,
    domains such as `example.github.io` or `example.glitch.me` are also
    [defined as 'registrable domains'](https://url.spec.whatwg.org/#host-registrable-domain) though
    they cannot be registered via a domain name registrar.)

{% Aside %}  
Unlike [origin](#origin), site does not include the [scheme](#scheme) or [port](#port).
{% endAside %}

**Subdomain**{: #subdomain}

A domain within a higher-level domain.

For sites with single-part top-level domains such as `.com` or `.org`, the parts before the
top-level domain, each of which is separated by a dot.
-  `www.example.com` is a subdomain of `example.com`.
-  `support.api.example.org` is a subdomain of `api.example.org`, which is a subdomain
        of `example.org`. 

For top-level domains where only third-level registrations are allowed (i.e. entries in the
[Public Suffix List](https://publicsuffix.org/list/) such as co.uk and github.io) the parts of
the domain name before that.
-  For example, `support.example.co.uk`, is a subdomain of `example.co.uk`.

**Top-level domain** (TLD) {: #tld}

-  A domain name listed in the [Root Zone Database](https://www.iana.org/domains/root/db) such
    as `com`, `io` or `org`. 
-  Some top-level domains are [country code top-level domains](#cctld), such as
`[uk](https://www.iana.org/domains/root/db/uk.html)` and `[tv](https://www.iana.org/domains/root/db/tv.html)`.
-  When describing the parts of a URL, the domain name that follows the final dot. 
    -  For `https://example.com`, the URL's top-level domain is `com`.
    -  For `https://example.com.au`, the URL's top-level domain is `au`, and `com` is a
        [second-level domain](#sld) (even though `com` is also a potential top-level domain!)

## Find out more

-  [WHATWG: URL Living Standard](https://url.spec.whatwg.org/)
-  [URL API](https://developer.mozilla.org/docs/Web/API/URL_API)
-  [RFC: Uniform Resource Locators (URL)](https://www.rfc-editor.org/rfc/rfc1738)
-  [RFC: URIs, URLs and URNs](https://datatracker.ietf.org/doc/html/rfc3305)
-  [Root Zone Database](https://www.iana.org/domains/root/db) (directory of [TLDs](#tld))
-  [Public Suffix List](https://publicsuffix.org/list/) (directory of [eTLDs](#etld))
-  [ICANN glossary](https://www.icann.org/en/icann-acronyms-and-terms?nav-letter=r&page=1)
-  [What is a Fully Qualified Domain Name?](https://datatracker.ietf.org/doc/html/rfc1594#section-5)
-  [How many ways can you slice a URL and name the pieces?](https://tantek.com/2011/238/b1/many-ways-slice-url-name-pieces)
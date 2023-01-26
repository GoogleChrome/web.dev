---
layout: post
title: Understanding "same-site" and "same-origin"
authors:
  - agektmr
date: 2020-04-15
updated: 2023-01-25
description: |
  "same-site" and "same-origin" are frequently cited but often misunderstood
  terms. This article helps you understand what they are and how they are
  different.
tags:
  - security
---

"same-site" and "same-origin" are frequently cited but often misunderstood
terms. For example, they are mentioned in the context of page transitions,
`fetch()` requests, cookies, opening popups, embedded resources, and
iframes.

## Origin

{%
  Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/Zn352nyD12uz6ORlLZiT.png",
  alt="Origin", width="800", height="130"
%}

"Origin" is a combination of a
[scheme](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)
(also known as the
[protocol](https://developer.mozilla.org/docs/Glossary/Protocol), for
example [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP) or
[HTTPS](https://developer.mozilla.org/docs/Glossary/HTTPS)),
[hostname](https://en.wikipedia.org/wiki/Hostname), and
[port](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port)
(if specified). For example, given a URL of `https://www.example.com:443/foo` ,
the "origin" is `https://www.example.com:443`.

### "same-origin" and "cross-origin" {: #same-origin-and-cross-origin }
Websites that have the combination of the same scheme, hostname, and port are
considered "same-origin". Everything else is considered "cross-origin".

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Origin A</th>
        <th>Origin B</th>
        <th>Explanation of whether Origin A and B are "same-origin" or "cross-origin"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-origin: different domains</td>
      </tr>
      <tr>
        <td>https://<strong>example.com</strong>:443</td>
        <td>cross-origin: different subdomains</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td>cross-origin: different subdomains</td>
      </tr>
      <tr>
        <td><strong>http</strong>://www.example.com:443</td>
        <td>cross-origin: different schemes</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong></td>
        <td>cross-origin: different ports</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>same-origin: exact match</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>same-origin: implicit port number (443) matches</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Site

{% Aside 'important' %}

The definition of "site" has evolved and it now includes the scheme. This
effectively changes the definition of "same-site" and "cross-site" as well. What
has been called "[schemeful same-site](/schemeful-samesite/)" is now "same-site"
and a new concept of "schemeless same-site" emerged. Read on to learn more.

{% endAside %}

{%
  Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GbXtpqme6JcvlxpWRcYf.png",
  alt="Site (TLD+1)", width="800", height="165"
%}

[Top-level domains (TLDs)](https://developer.mozilla.org/docs/Glossary/TLD) such
as `.com` and `.org` are listed in the [Root Zone
Database](https://www.iana.org/domains/root/db). In the example above, "site" is
the combination of the
[scheme](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol),
the [TLD](https://developer.mozilla.org/docs/Glossary/TLD) and the part of the
domain just before it (We call it TLD+1). For example, given a URL of
`https://www.example.com:443/foo` , the "site" is `https://example.com`.

### Public Suffix List and eTLD

For domains that include things such as `.co.jp` or `.github.io`, just using
`.jp` or `.io` is not granular enough to identify the "site". There is no way to
algorithmically determine the level of registrable domains for a particular TLD.
 That's why a list of public suffixes defined in the [Public Suffix
List](https://wiki.mozilla.org/Public_Suffix_List) was created. These public
suffixes are also called *effective TLDs (eTLDs)*. The list of eTLDs is
maintained at [publicsuffix.org/list](https://publicsuffix.org/list/).

To identify the "site" part of a domain that includes an eTLD, apply the same
practice as the example with `.com`. Taking
`https://www.project.github.io:443/foo` as an example, the scheme is `https`,
the eTLD is `.github.io` and the eTLD+1 is `project.github.io`, so
`https://project.github.io` is considered the "site" for this URL.

{%
  Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/7ihtYJeEPX4epAe37onN.png",
  alt="Site (eTLD+1)", width="800", height="157"
%}

### "same-site" and "cross-site" {: #same-site-cross-site }

Websites that have the same scheme and the same eTLD+1 are considered
"same-site". Websites that have a different scheme or a different eTLD+1 are
"cross-site".

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Origin A</th>
        <th>Origin B</th>
        <th>Explanation of whether Origin A and B are "same-site" or "cross-site"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-site: different domains</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>same-site: different subdomains don't matter</strong></td>
      </tr>
      <tr>
        <td><strong>http</strong>://www.example.com:443</td>
        <td>cross-site: different schemes</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong></td>
        <td><strong>same-site: different ports don't matter</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>same-site: exact match</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>same-site: ports don't matter</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### "schemeless same-site"

{%
  Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/G2VfM8BA5Q5LTaz22Puu.png",
  alt="schemeless same-site", width="800", height="123"
%}

The definition of "same-site" evolved to consider the URL scheme as part of the
site in order to prevent HTTP being used as [a weak
channel](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8).
The older concept of "same-site" without scheme comparison is now called
"schemeless same-site". For example, `http://www.example.com` and
`https://www.example.com` are considered schemelses same-site but not same-site,
because only the eTLD+1 part matters and the scheme is not taken into account.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Origin A</th>
        <th>Origin B</th>
        <th>Explanation of whether Origin A and B are "schemeless same-site"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-site: different domains</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>schemeless same-site: different subdomains don't matter</strong></td>
      </tr>
      <tr>
        <td><strong>http</strong>://www.example.com:443</td>
        <td><strong>schemeless same-site: different schemes don't matter</strong></td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong></td>
        <td><strong>schemeless same-site: different ports don't matter</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>schemeless same-site: exact match</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>schemeless same-site: ports don't matter</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## How to check if a request is "same-site", "same-origin", or "cross-site"

All modern browsers (Safari support [landing
soon](https://bugs.webkit.org/show_bug.cgi?id=238265)) send requests along with
a [`Sec-Fetch-Site` HTTP
header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site). The
header has one of the following values:

* `cross-site`
* `same-site`
* `same-origin`
* `none`

{% Aside %}

`same-site` here means schemeful same-site, rather than schemeless same-site.

{% endAside %}

By examining the value of `Sec-Fetch-Site`, you can determine if the request is
"same-site", "same-origin", or "cross-site".

{% Aside 'important' %}

You can reasonably trust the value of `Sec-Fetch-Site` header because:
<ul>
  <li>[HTTP headers starting with `Sec-` can not be modified by
   JavaScript](https://www.w3.org/TR/fetch-metadata/#sec-prefix).</li>
  <li>These headers are always set by the browser.</li>
</ul>

Even if a server receives a manipulated value for the `Sec-Fetch-Site`
header, sent by a random HTTP client, no user or browser will be
harmed by breaking the same-origin policy.

{% endAside %}

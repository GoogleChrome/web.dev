---
layout: post
title: Understanding "same-site" and "same-origin"
authors:
  - agektmr
date: 2020-04-15
updated: 2020-06-10
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

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="Origin", width="680", height="100" %}

"Origin" is a combination of a
[scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)
(also known as the
[protocol](https://developer.mozilla.org/en-US/docs/Glossary/Protocol), for
example [HTTP](https://developer.mozilla.org/en-US/docs/Glossary/HTTP) or
[HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)),
[hostname](https://en.wikipedia.org/wiki/Hostname), and
[port](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port)
(if specified). For example, given a URL of `https://www.example.com:443/foo` ,
the "origin" is `https://www.example.com:443`.

### "same-origin" and "cross-origin" {: #same-origin-and-cross-origin }
Websites that have the combination of the same scheme, hostname, and port are
considered "same-origin". Everything else is considered "cross-origin".

<div class="w-table-wrapper">
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

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="Site", width="680", height="142" %}

Top-level domains (TLDs) such as `.com` and `.org` are listed in the [Root Zone
Database](https://www.iana.org/domains/root/db). In the example above, "site" is
the combination of the TLD and the part of the domain just before it. For
example, given a URL of `https://www.example.com:443/foo` , the "site" is
`example.com`.

However, for domains such as `.co.jp` or `.github.io`, just using the TLD of
`.jp` or `.io` is not granular enough to identify the "site". And there is no
way to algorithmically determine the level of registrable domains for a
particular TLD. That's why a list of "effective TLDs"(eTLDs) was created. These
are defined in the [Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List).
 The list of eTLDs is maintained at
[publicsuffix.org/list](https://publicsuffix.org/list/).

The whole site name is known as the eTLD+1. For example, given a URL of
`https://my-project.github.io` , the eTLD is `.github.io` and the eTLD+1 is
`my-project.github.io`, which is considered a "site". In other words, the eTLD+1
is the effective TLD and the part of the domain just before it.

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### "same-site" and "cross-site" {: #same-site-cross-site }

Websites that have the same eTLD+1 are considered "same-site". Websites that
have a different eTLD+1 are "cross-site".

<div class="w-table-wrapper">
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
        <td><strong>same-site: different schemes don't matter</strong></td>
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

### "schemeful same-site"

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

The definition of "same-site" is evolving to consider the URL scheme as part of
the site in order to prevent HTTP being used as [a weak
channel](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8).
As browsers move to this interpretation you may see references to "scheme-less
same-site" when referring to the older definition and "[schemeful
same-site](/schemeful-samesite/)" referring to the stricter definition. In that
case, `http://www.example.com` and `https://www.example.com` are considered
cross-site because the schemes don't match.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Origin A</th>
        <th>Origin B</th>
        <th>Explanation of whether Origin A and B are "schemeful same-site"</th>
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
        <td><strong>schemeful same-site: different subdomains don't matter</strong></td>
      </tr>
      <tr>
        <td><strong>http</strong>://www.example.com:443</td>
        <td>cross-site: different schemes</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong></td>
        <td><strong>schemeful same-site: different ports don't matter</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>schemeful same-site: exact match</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>schemeful same-site: ports don't matter</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## How to check if a request is "same-site", "same-origin", or "cross-site"

Chrome sends requests along with a `Sec-Fetch-Site` HTTP header. No other
browsers support `Sec-Fetch-Site` as of April 2020. This is part of a larger [Fetch Metadata
Request Headers](https://www.w3.org/TR/fetch-metadata/)
proposal. The header will have one of the following values:

* `cross-site`
* `same-site`
* `same-origin`
* `none`

By examining the value of `Sec-Fetch-Site`, you can determine if the request is
"same-site", "same-origin", or "cross-site" ("schemeful-same-site" is not
captured in `Sec-Fetch-Site`).

---
layout: post
title: robots.txt is not valid
description: |
  Learn about the "robots.txt is not valid" Lighthouse audit.
web_lighthouse:
  - robots-txt
---

The `robots.txt` file tells search engines which of your site's pages they can
crawl. An invalid `robots.txt` configuration can cause two types of problems:

- It can keep search engines from crawling public pages, causing your
content to show up less often in search results.
- It can cause search engines to crawl private pages, exposing information you
may not want shown in search results.

Lighthouse flags invalid `robots.txt` files:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="robots-txt.png" alt="Lighthouse audit showing invalid robots.txt">
</figure>

{% Aside %}
Most Lighthouse audits only apply to the page that you're currently on.
However, since `robots.txt` is defined at the domain level,
this audit applies to your entire domain (or subdomain).
{% endAside %}

## How this audit fails

Expand the **`robots.txt` is not valid** audit in your report
to learn why your `robots.txt` file is invalid.

Common errors include:

- `No user-agent specified`
- `Pattern should either be empty, start with "/" or "*"`
- `Unknown directive`
- `Invalid sitemap URL`
- `"$" should only be used at the end of the pattern`

Lighthouse doesn't check that your `robots.txt` file is
in the correct location. To function correctly, the file must be in the root of
your domain or subdomain.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to fix the errors in `robots.txt`

- Make sure the `robots.txt` doesn't return `HTTP 50X`.
- Make sure the `robots.txt` file is smaller than 500 KB.
- Review the format.
- Make sure there are no `allow` or `disallow` directives before `user-agent`.
- Make sure there's a value for `user-agent`.
- Provide an absolute URL for `sitemap` with http/https/ftp scheme.

See the [Fix `robots.txt` errors](/fix-robot-errors) post for more information.

## More information

- [**`robots.txt` is not valid** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/robots-txt.js)
- [Create a `robots.txt file`](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)

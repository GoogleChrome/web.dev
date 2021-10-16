---
layout: post
title: "`robots.txt` is not valid"
description: |
  Learn about the "robots.txt is not valid" Lighthouse audit.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robots-txt
---

The `robots.txt` file tells search engines which of your site's pages they can
crawl. An invalid `robots.txt` configuration can cause two types of problems:

- It can keep search engines from crawling public pages, causing your
  content to show up less often in search results.
- It can cause search engines to crawl pages you may not want shown in search
  results.

## How the Lighthouse `robots.txt` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags invalid
`robots.txt` files:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="Lighthouse audit showing invalid robots.txt", width="800", height="203", class="w-screenshot w-screenshot" %}
</figure>

{% Aside %}
Most Lighthouse audits only apply to the page that you're currently on.
However, since `robots.txt` is defined at the host-name level,
this audit applies to your entire domain (or subdomain).
{% endAside %}

Expand the **`robots.txt` is not valid** audit in your report
to learn what's wrong with your `robots.txt`.

Common errors include:

- `No user-agent specified`
- `Pattern should either be empty, start with "/" or "*"`
- `Unknown directive`
- `Invalid sitemap URL`
- `$ should only be used at the end of the pattern`

Lighthouse doesn't check that your `robots.txt` file is
in the correct location. To function correctly, the file must be in the root of
your domain or subdomain.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to fix problems with `robots.txt`

### Make sure `robots.txt` doesn't return an HTTP 5XX status code

If your server returns a server error (an [HTTP status code](/http-status-code)
in the 500s) for `robots.txt`, search engines won't know which pages should be
crawled. They may stop crawling your entire site, which would prevent new
content from being indexed.

To check the HTTP status code, open `robots.txt` in Chrome and
[check the request in Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network/reference#analyze).

### Keep `robots.txt` smaller than 500 KiB

Search engines may stop processing `robots.txt` midway through if the file is
larger than 500 KiB. This can confuse the search engine, leading to incorrect
crawling of your site.

To keep `robots.txt` small, focus less on individually excluded pages and more
on broader patterns. For example, if you need to block crawling of PDF files,
don't disallow each individual file. Instead, disallow all URLs containing
`.pdf` by using `disallow: /*.pdf`.

### Fix any format errors

- Only empty lines, comments, and directives matching the "name: value" format are
allowed in `robots.txt`.
- Make sure `allow` and `disallow` values are either empty or start with `/` or `*`.
- Don't use `$` in the middle of a value (for example, `allow: /file$html`).

#### Make sure there's a value for `user-agent`

User-agent names to tell search engine crawlers which directives to follow. You
must provide a value for each instance of `user-agent` so search engines know
whether to follow the associated set of directives.

To specify a particular search engine crawler, use a user-agent name from its
published list. (For example, here's
[Google's list of user-agents used for crawling](https://support.google.com/webmasters/answer/1061943).)

Use `*` to match all otherwise unmatched crawlers.

{% Compare 'worse', 'Don\'t' %}
```text
user-agent:
disallow: /downloads/
```
No user agent is defined.
{% endCompare %}

{% Compare 'better', 'Do' %}
```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```
A general user agent and a `magicsearchbot` user agent are defined.
{% endCompare %}

#### Make sure there are no `allow` or `disallow` directives before `user-agent`

User-agent names define the sections of your `robots.txt` file. Search engine
crawlers use those sections to determine which directives to follow. Placing a
directive _before_ the first user-agent name means that no crawlers will follow
it.

{% Compare 'worse', 'Don\'t' %}
```text
# start of file
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```
No search engine crawler will read the `disallow: /downloads` directive.
{% endCompare %}

{% Compare 'better', 'Do' %}
```text
# start of file
user-agent: *
disallow: /downloads/
```
All search engines are disallowed from crawling the `/downloads` folder.
{% endCompare %}

Search engine crawlers only follow directives in the section with the most
specific user-agent name. For example, if you have directives for
`user-agent: *` and  `user-agent: Googlebot-Image`, Googlebot Images will only
follow the directives in the `user-agent: Googlebot-Image` section.

#### Provide an absolute URL for `sitemap`

[Sitemap](https://support.google.com/webmasters/answer/156184) files are a
great way to let search engines know about pages on your website. A sitemap file generally includes a list of
the URLs on your website, together with information about when they were last
changed.

If you choose to submit a sitemap file in `robots.txt`, make sure to
use an [absolute URL](https://tools.ietf.org/html/rfc3986#page-27).

{% Compare 'worse', 'Don\'t' %}
```text
sitemap: /sitemap-file.xml
```
{% endCompare %}

{% Compare 'better', 'Do' %}
```text
sitemap: https://example.com/sitemap-file.xml
```
{% endCompare %}

## Resources

- [Source code for **`robots.txt` is not valid** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/robots-txt.js)
- [Create a `robots.txt file`](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
- [Learn about sitemaps](https://support.google.com/webmasters/answer/156184)
- [Google crawlers (user agents)](https://support.google.com/webmasters/answer/1061943)

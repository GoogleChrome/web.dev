---
layout: post
title: Fix robots.txt errors
authors:
  - ekharvey
date: 2018-11-05
description: |
  The robots.txt file tells search engines which URLs of your site they can
  crawl. An invalid robots.txt file can cause problems with indexing.
---

## Why does this matter?

The [robots.txt file](https://developers.google.com/search/reference/robots_txt)
tells search engines which URLs of your site they can crawl. An invalid
robots.txt file can cause two general types of problems:

+  Not crawling public pages, causing your pages to not show up in search
    results.
+  Unwanted crawling of pages, exposing information you may not want shown
    in search results.

## Measure

Lighthouse displays the following failed audit if there's an issue with your
robots.txt file: **robots.txt is not valid**.

Most Lighthouse audits only apply to the page that you're currently on. However,
since robots.txt is defined at the host-name level, this audit applies to your
entire domain or subdomain.

## Make sure the robots.txt doesn't return HTTP 50X

If the server returns a server error (HTTP `50X` result code) for the
robots.txt, search engines won't know which URLs are allowed to be crawled or
not. They may stop all crawling of the website, which would prevent new content
from being indexed. To check the HTTP status code, open the robots.txt file in
Chrome and [check the request in Chrome
DevTools](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#analyze).

## Make sure the robots.txt file is smaller than 500 KB

Search engines may stop processing robots.txt files when they get too large.
If a search engine stops processing in the middle of a directive, it's
impossible to follow that directive properly, and could result in the search
engine getting needlessly confused. Also, large robots.txt files are a hassle
to maintain.

One way to make a robots.txt file smaller is to focus less on individually
excluded pages, and more on broader patterns. For example, if you need to block
crawling of PDF files, don't list these files with individual disallow
directives. Instead, use a broader match like `disallow: /*.pdf` to disallow
crawling of all URLs containing `.pdf`.

## Review the format

Review the format of the robots.txt file. Only empty lines, comments, and
directives matching the "name: value" format are allowed.

Make sure `allow` and `disallow` values are either empty or start with `/` or
`*`. Make sure they don't use `$` in the middle of a value (for example,
`allow: /file$html`). Here's an example:

```text
user-agent: *
disallow: /downloads/
```
{% Compare 'better' %}
Do this
{% endCompare %}

```text
user-agent: *

# missing "/"
disallow: downloads

# incorrect directive name
dis-allow downloads

# invalid character in the value provided
disallow: /OffersFor$5
```
{% Compare 'worse' %}
Don't do this
{% endCompare %}

Use comments in the robots.txt file to explain what you're trying to allow or
disallow. While robots.txt directives look simple, in combination they can be
surprisingly complex. Here's an example of how to use comments in a robots.txt
file:

```text
user-agent: *

# block crawling of all download URLs
disallow: /downloads/

# allow crawling of our whitepaper as per marketing team's request
allow: /downloads/whitepaper.pdf
```

## Make sure there are no `allow` or `disallow` directives before `user-agent`

```text
# start of file
user-agent: *
disallow: /downloads/
```
{% Compare 'better' %}
Do this
{% endCompare %}

```text
# start of file
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```
{% Compare 'worse' %}
Don't do this
{% endCompare %}

All `allow` and `disallow` directives must apply to specific user-agents (also
known as crawlers), so they are only valid if they're in a section for a given
user-agent. For user-agents, crawlers only use the section with the most
specific user-agent to determine which URLs are disallowed from crawling.

For example, if you have `user-agent: *` and `user-agent: magicsearchbot`
sections, MagicSearchBot won't follow any of the directives in the generic
(`user-agent: *`) section and will only follow the directive in its own section.

## Make sure there's a value for `user-agent`

In order for a search engine crawler to find the appropriate user-agent section
to follow, you must provide a user-agent name, or use `*` to match all otherwise
unmatched crawlers. Search engines will generally publish the user-agent names
that they use; for example, here's
[Google's list of user-agents used for crawling](https://support.google.com/webmasters/answer/1061943).

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```
{% Compare 'better' %}
Do this
{% endCompare %}

```text
user-agent:
disallow: /downloads/
```
{% Compare 'worse' %}
Don't do this
{% endCompare %}

## Provide an absolute URL for `sitemap` with http/https/ftp scheme

[Sitemap](https://sitemaps.org/) files are a great way to let search engines
know about the pages on a website. A sitemap file generally includes a list of
the URLs on your website, together with information about when they were last
changed. If you choose to refer to submit a sitemap file through the robots.txt
file, make sure to use a [fully-qualified/absolute
URL](https://tools.ietf.org/html/rfc3986#page-27).

```text
sitemap: https://example.com/sitemap-file.xml
```
{% Compare 'better' %}
Do this
{% endCompare %}

```text
sitemap: /sitemap-file.xml
```
{% Compare 'worse' %}
Don't do this
{% endCompare %}

## Add additional control (optional step)

See
[Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
for details about exactly how you can configure your meta tags and HTTP headers
to get more control over how search engines crawl your page. As mentioned in the
beginning, don't use robots.txt as a way of limiting access to your private
content.

Keep in mind that robots.txt prevents crawling, and with that, the indexing of
the content, but URLs can be indexed without any known content. If you need to
keep URLs from appearing in search (rather than just preventing crawling, or
preventing indexing of the content on the pages), use the
[`noindex` robots meta tag](https://developers.google.com/search/reference/robots_meta_tag)
instead.

## Remember to keep it simple

A robots.txt file can be surprisingly complex and hard to understand by us
humans. Keep things as simple as possible to avoid search engines having to
guess at the outcome. Take advantage of the various robots.txt testing tools
available. Put as much of the page-level logic into the pages themselves (using
authentication or robots meta tags as needed) to help with keeping the
robots.txt file in an easily understandable size.

## Verify

Run the Lighthouse SEO Audit (**Lighthouse > Options > SEO**) and look for the
results of the audit **robots.txt is not valid**.

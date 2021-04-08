---
title: Web developer tools for debugging JavaScript issues in Google Search
subhead: >
  How to debug SEO issues on individual pages or across an entire site.
authors:
  - martinsplitt
date: 2020-06-25
hero: image/admin/yUVYFuA1d5E33nfvT0fs.png
thumbnail: image/admin/AsANZF0n2e4eNv11AwJH.png
alt: A screenshot of the Core Web Vitals report.
description: >
  How to debug SEO issues on individual pages or across an entire site.
tags:
  - blog
  - seo
  - web-vitals
  - javascript
  - performance
  - lighthouse
---

Google provides a lot of tools to help you debug JavaScript SEO issues in Google Search. This guide
gives you an overview of the available tools and suggestions on when to use each tool.

## Find basic SEO issues with Lighthouse

Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) for your first investigation.
It comes with a bunch of [SEO audits](/pass-lighthouse-seo-audit/).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/c6SfL83IXMmBArczs9Le.png", alt="A screenshot of SEO audits in Lighthouse.", width="800", height="74", class="w-screenshot" %}
</figure>

The Lighthouse SEO audits are very basic first checks for a single page of your website. They catch
the most common mistakes and give you a first impression on how your website is doing in terms of
search engine discoverability. Note that Lighthouse runs in your browser, which is not an accurate
representation of how Googlebot might see a web page. For instance, browsers (and Lighthouse) don't
use `robots.txt` to decide if they can fetch resources from the network, while Googlebot does. So when
Lighthouse identifies potential problems, you should fix them, but you may have to use other tools
to debug issues further.

## Validate pages with Google Search testing tools

Google Search provides
[a set of tools for testing how Googlebot sees your web content](https://developers.google.com/search/tools).  
Some of these tools are particularly useful when testing from your development environment:

+   The [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) ensures that a
    page is mobile-friendly, which has been a
    [Google Search ranking signal since 2015](https://webmasters.googleblog.com/2015/02/finding-more-mobile-friendly-search.html)
+   The [Rich Results Test](https://search.google.com/test/rich-results) validates that a page
    is eligible for [rich results](https://developers.google.com/search/docs/guides/search-gallery)
    based on the structured data that it provides
+   The [AMP Test](https://search.google.com/test/amp) validates your AMP HTML

In combination with
[tools like local-tunnel or ngrok](https://developers.google.com/search/docs/guides/debug#testing-firewalled-pages)
you can create a temporary public URL from your local development environment and iterate quickly
while you are testing with Google's testing tools.

These testing tools provide you with multiple helpful pieces of information, like:

+   The rendered HTML that Googlebot will use for indexing
+   An overview of the resources loaded and explanations of why resources can't be loaded
+   Console log messages and JavaScript errors with stack traces

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HxpuDusVnyVm21QSD20b.png", alt="A screenshot of the Mobile-Friendly Test.", width="800", height="492", class="w-screenshot" %}
</figure>

The Google Search Console [URL Inspection
Tool](https://support.google.com/webmasters/answer/9012289) can also give you detailed
information about the status of a page.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jyUDvp0zvkpUEgDjEULN.png", alt="A screenshot of the URL Inspection Tool.", width="800", height="590", class="w-screenshot" %}
</figure>

Here you can find out:

+   If the URL is in the Google Search index or can be indexed in the future
+   What the rendered HTML from the most recent crawl looks like
+   What the rendered HTML looks like for a fresh crawl of the page
+   Information about page resources
+   JavaScript log messages and errors with stack traces
+   A screenshot
+   Mobile usability issues
+   What structured data was detected on the page and if it's valid

Using these tools you can identify most issues and resolve them. Google Search also provides
documentation for
[fixing Google Search-related JavaScript problems](https://developers.google.com/search/docs/guides/fix-search-javascript)
for more guidance on what to do once you identified the cause of a problem.

## Investigate site health with Google Search Console

The tools from the last section are great at resolving specific issues on a single page of your
website, but if you want to get a better overview of your entire website, the [Google Search
Console](https://search.google.com/search-console/about) is where you need to go.

### Coverage report

The [Coverage report](https://support.google.com/webmasters/answer/7440203) shows you which
pages of your website are indexed and which ones have problems.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A1KZQbjh96n9uv48fBCT.png", alt="A screenshot of the Coverage report.", width="754", height="567", class="w-screenshot" %}
</figure>

### Core Web Vitals report

The [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520) helps you
get an overview of how the pages of your website are performing in terms of the [Core Web
Vitals](/vitals/#core-web-vitals).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LL7U1EcPCyuDcmjPD13c.png", alt="A screenshot of the Core Web Vitals report.", width="744", height="596", class="w-screenshot" %}
</figure>

## Make these tools part of your developer tooling

In this article, we've seen a series of tools for various purposes from testing a page before
publishing it to monitoring the pages on a live website that give you transparency on how your
website does in terms of discoverability for Google Search. Some of these tools might become useful
parts of your development toolkit, others might be more like ad-hoc tools to identify the cause of a
problem and fix affected pages. To learn more about Google Search for developers or [JavaScript
SEO](https://developers.google.com/search/docs/guides/javascript-seo-basics), check out the official
[Search for developers](https://developers.google.com/search) documentation.
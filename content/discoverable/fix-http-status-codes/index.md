---
page_type: guide
title: Fix unsuccessful HTTP status codes
author: ekharvey
web_lighthouse:
- http-status-code
wf_blink_components: N/A
---

# Fix unsuccessful HTTP status codes

## Why does this matter?

HTTP status codes indicate the response given by a server for a request to a
URL. 4XX status codes signal to search engines that a page does not provide any
content. For example, 404 indicates the page isn't found; 403 indicates the
content is restricted. In both cases, search engines assume there's nothing to
show in search results, and may not index the page.

## Measure

Lighthouse displays the following failed audit if search engines have trouble
indexing your page: "Page has unsuccessful HTTP status code".

## Determine if you actually want search engines to crawl this page

Some HTTP status codes tell crawlers that a page isn't available. That means
search engines won't index the page and therefore won't include it in search
results. This makes sense for any URLs that show errors, or which don't exist on
your website.

## Fix the error on your server

To fix the error, refer to the documentation for your specific server or hosting
provider to make sure that your server returns a 2XX HTTP status code for all
valid URLs, or a 3XX status code if the page has moved to another URL.   
You can also try out our [interactive example](www.example.com) and learn
how to fix the error in an express.js application.

## Verify

Run the Lighthouse SEO Audit (Lighthouse > Options > SEO) and look for the
results of the audit "Page has unsuccessful HTTP status code".

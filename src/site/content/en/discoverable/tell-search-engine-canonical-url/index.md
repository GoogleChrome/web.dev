---
layout: post
title: Tell search engines which version of a page to crawl
authors:
  - ekharvey
date: 2018-11-05
description: |
  When multiple pages have the same or significantly similar content, search
  engines consider them duplicate versions of the same page. Providing
  search engines information about your preferred canonical URL helps search
  engines display the correct URL to users.
web_lighthouse:
  - canonical
---

## Why does this matter?

When multiple pages have the same or significantly similar content, search
engines consider them duplicate versions of the same page. For example, desktop
and mobile versions of a product page are often considered duplicates.   
Search engines select one of the pages as the primary, **canonical**, version
and crawl that one more, while crawling the other ones less frequently. Crawling
is how search engines update their index of content on the web, and by providing
search engines information about your preferred canonical URL you're helping
search engines display the correct URL to users.

## Measure

Lighthouse displays the following failed audit if your duplicate URLs are
difficult for search engines to understand: "Document doesn't have a valid
rel=canonical".

## Decide which URL is the canonical version

First, decide which URL should be the canonical version of your content. Make
sure that the canonical URL is not blocked from crawling with a `robots.txt`
file, not blocked from indexing with a robots meta element, and publicly
accessible. Ideally, use HTTPS URLs instead of HTTP URLs if you have a choice.
If you use [hreflang
links](https://support.google.com/webmasters/answer/189077), make sure that the
canonical URL points to the proper page for that respective language or country.

Also, watch out for the following problems:

+  Don't point the canonical URL to a different domain. While Google
    allows this, Yahoo and Bing don't allow it.
+  Don't point lower-level pages to the site's root page, unless the content
    is the same. 

## Specify the canonical link

There are two ways you can specify a canonical link: 

+  `link rel=canonical` element in the `<head>` of a page
+  Link header in the HTTP response

For a list of pros and cons, see
[Google's guide to duplicate URLs](https://support.google.com/webmasters/answer/139066).

**Option 1. Add a canonical link element to the head of the HTML**

```html
<!doctype html>
<html lang="en">
<head>
  <link rel="canonical" href="https://copycat.com/"/>
  ...
```


**Option 2. Add Link header to the HTTP response**

```
Link: https://copycat.com/; rel=canonical
```

Here's a full example of what the `<head>` should include. 

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Mary's Maple Bar Fast-Baking recipe</title>
    <meta name="Description" content="Mary's maple bar
    recipe is simple and sweet, with just a touch of
    serendipity. Topped with bacon, this sticky donut
    is to die for.">
    <link rel="canonical"
          href="https://donut-be-crazy.com/recipes/maple-bar-recipe"/>
  </head>
  <body>
    ...
  </body>
</html>
```

## Verify

Run the Lighthouse SEO Audit (**Lighthouse > Options > SEO**) and look for the
results of the audit **Document doesn't have a valid rel=canonical**.



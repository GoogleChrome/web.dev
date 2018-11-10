---
page_type: guide
title: Tell search engines which version of a page to crawl
author: ekharvey
web_lighthouse:
- canonical
wf_blink_components: N/A
---

# Tell search engines which version of a page to crawl

## Why does this matter?

When multiple pages have the same or significantly similar content, search
engines consider them duplicate versions of the same page. For example, desktop
and mobile versions of a product page are often considered duplicates.   
Search engines select one of the pages as the primary, canonical, version and
crawl that one more, while crawling the other ones less frequently. Crawling is
how search engines update their index of content on the web. You can give search
engines information about your preferred canonical URL.  

## Measure

Lighthouse displays the following failed audit if your content is difficult for
search engines to understand: "Document doesn't have a valid rel=canonical".

## Decide which URL is the canonical version

First, decide which URL should be the canonical version of your content. Make
sure that the canonical URL is not blocked from crawling with a robots.txt file,
not blocked from indexing with a robots meta tag, and publicly accessible.
Ideally, use HTTPS URLs instead of HTTP URLs if you have a choice. If you use
[hreflang links](https://support.google.com/webmasters/answer/189077), make sure
that the canonical URL points to the proper page for that respective language or
country.  
Also, watch out for the following problems:

+  Don't point the canonical URL to a different domain. While Google
    allows this, Yahoo and Bing don't allow it.
+  Don't point lower-level pages to the site's root page, unless the content
    is the same. 

## Specify the canonical link

There are two ways you can specify a canonical link: 

+  `link rel=canonical` element in the &lt;head&gt; of a page
+  Link header in the HTTP response

For a list of pros and cons, see
[Google's guide to duplicate URLs](https://support.google.com/webmasters/answer/139066).

<table>
<thead>
<tr>
<th><strong>Option</strong></th>
<th><strong>Example</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Add a canonical link element to the head of the HTML</td>
<td><p><pre>
<!doctype html>
<html lang="en">
  <head>
    …
    <link rel="canonical" href="https://copycat.com/"/>
    …
</pre></p>

</td>
</tr>
<tr>
<td>Add Link header to the HTTP response</td>
<td><p><pre>
Link: https://copycat.com/; rel=canonical
</pre></p>

</td>
</tr>
</tbody>
</table>

Here's a full example of what the <head> should include. 

```
<!doctype html>
<html lang="en">
  <head>
    <title>Mary's Maple Bar Fast-Baking recipe</title>
    <meta name="description" content="Mary's maple bar recipe is simple and sweet, with just a touch of serendipity. Topped with bacon, this sticky donut is to die for.">
    <link rel="canonical" href="https://donut-be-crazy.com/recipes/maple-bar-recipe"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- import the webpage's stylesheet -->
    <link rel="stylesheet" href="/style.css">
    <!-- import the webpage's javascript file -->
    <script src="/script.js" defer></script>
  </head>
  <body>
    <h1>Hi there!</h1>   
    <p>
      I'm your cool new webpage. Made with <a href="https://glitch.com">Glitch</a>!
    </p>
    <!-- include the Glitch button to show what the webpage is about and
          to make it easier for folks to view source and remix -->
    <div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>
    <script src="https://button.glitch.me/button.js"></script>
  </body>
</html>
```

## Verify

Run the Lighthouse SEO Audit (Lighthouse > Options > SEO) and look for the
results of the audit "Document doesn't have a valid rel=canonical".



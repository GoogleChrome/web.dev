---
page_type: guide
title: Tell search engines translated pages are equivalent
author: ekharvey
web_lighthouse:
  - hreflang
wf_blink_components: N/A
---

# Tell search engines translated pages are equivalent

## Why does this matter?

If you have a page that's translated into multiple languages, add `link`
elements with  `hreflang` attributes. This lets search engines know your page is
translated, allowing them to display the correct language to users.

## Measure

Lighthouse displays the following failed audit if your page uses hreflang
incorrectly: "Document doesn't have a valid hreflang".

## Define an `hreflang` link for each language version of a URL

You can tell search engines that a page has equivalent versions in multiple
languages. There are three ways to do this. Choose whichever method is easiest
to implement or maintain for your website:

+  Add the hreflang link for each language.
+  Add [Link
    headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) to the
    HTTP response (though this requires you to configure HTTP responses and may
    take longer to implement).
+  [Update the sitemap](https://support.google.com/webmasters/answer/156184)
    (though this requires a sitemap).

**Option 1. Add the `hreflang` link for each language**

<pre class="prettyprint">
&lt;link rel="alternate" hreflang="en" 
href="https://donut-be-hangry.com/recipes/maple-bar-recipe" />

&lt;link rel="alternate" hreflang="es" 
href="https://es.donut-be-hangry.com/recipes/maple-bar-recipe" />

&lt;link rel="alternate" hreflang="de" 
href="https://de.donut-be-hangry.com/recipes/maple-bar-recipe" />
</pre>

**Option 2. Add Link headers to your HTTP response**

<pre class="prettyprint">
Link: 
&lt;https://donut-be-hangry.com/recipes/maple-bar-recipe&gt;;
rel="alternate"; hreflang="en", 

&lt;https://es.donut-be-hangry.com/recipes/maple-bar-recipe&gt;;
rel="alternate"; hreflang="es", 

&lt;https://de.donut-be-hangry.com/recipes/maple-bar-recipe&gt;;
rel="alternate"; hreflang="de"
</pre>

**Option 3. Add language version information to your sitemap**

<div class="aside note">
For more information, see
Google's <a href="https://support.google.com/webmasters/answer/189077">
documentation for localized pages</a>.
</div>

 <pre class="prettyprint">
&lt;url&gt;
&lt;loc&gt;https://donut-be-hangry.com/recipes/maple-bar-recipe&lt;/loc&gt;

&lt;xhtml:link rel="alternate" hreflang="de"
href="https://de.donut-be-hangry.com/recipes/maple-bar-recipe"/&gt;

&lt;xhtml:link rel="alternate" hreflang="es"
href="https://es.donut-be-hangry.com/recipes/maple-bar-recipe"/&gt;

&lt;/url&gt;
</pre>

Each page should specify all the different language versions, including itself.
Pages must always link to each other. When page A links to page B using
`hreflang`, page B must also link back to page A, or else search engines may
ignore the `hreflang` links or interpret them incorrectly.

## Simple example of `hreflang` links in HTML

Here's a simple example of `hreflang` attributes in HTML:

```
<!doctype html>
<html lang="en">
  <head>
    <title>Mary's Maple Bar Fast-Baking Recipe</title>
    <meta name="Description" content="Mary's maple bar
    recipe is simple and sweet, with just a touch of
    serendipity. Topped with bacon, this sticky donut
    is to die for.">
    <link rel="alternate" hreflang="en" 
    href="https://donut-be-hangry.com/recipes/maple-bar-recipe"/>
    <link rel="alternate" hreflang="es" 
    href="https://es.donut-be-hangry.com/recipes/maple-bar-recipe" />
    <link rel="alternate" hreflang="de" 
    href="https://de.donut-be-hangry.com/recipes/maple-bar-recipe" />
  </head>
  <body>
    ...
  </body>
</html>
```

## Specify language codes in the ISO 639-1 format

The `hreflang` value must always specify a language code. The language code must
follow [ISO 639-1](https://wikipedia.org/wiki/List_of_ISO_639-1_codes) format.
The `hreflang` value can also include an optional regional code. For example,
`es-mx` is for Spanish speakers in Mexico, whereas `es-cl` is for Spanish
speakers in Chile. The region code must follow [ISO 3166-1
alpha-2](https://wikipedia.org/wiki/ISO_3166-1_alpha-2) format.

## Verify

Run the Lighthouse SEO Audit (Lighthouse > Options > SEO) and look for the
results of the audit "Document doesn't have a valid hreflang".

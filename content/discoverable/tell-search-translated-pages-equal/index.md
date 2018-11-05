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

## Define an hreflang tag for each language version of a URL

You can tell search engines that a page has equivalent versions in multiple
languages. There are three ways to do this. Choose whichever method is easiest
to implement or maintain for your website:

+  Add the hreflang element for each language.
+  Add [Link
    headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) to the
    HTTP response (though this requires you to configure HTTP responses and may
    take longer to implement).
+  [Update the sitemap](https://support.google.com/webmasters/answer/156184)
    (though this requires a sitemap).

<table>
<thead>
<tr>
<th><strong>Option</strong></th>
<th><strong>Example</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Add link elements to the head of your page</td>
<td><p><pre>
<link rel="alternate" hreflang="en" href="https://donut-be-crazy.com/recipes/maple-bar-recipe" />
<link rel="alternate" hreflang="es" href="https://es.donut-be-crazy.com/recipes/maple-bar-recipe" />
<link rel="alternate" hreflang="de" href="https://de.donut-be-crazy.com/recipes/maple-bar-recipe" />
</pre></p>

</td>
</tr>
<tr>
<td>Add Link headers to your HTTP response</td>
<td><p><pre>
Link: <https://donut-be-crazy.com/recipes/maple-bar-recipe>; rel="alternate"; hreflang="en", <https://es.donut-be-crazy.com/recipes/maple-bar-recipe>;
rel="alternate"; hreflang="es", <https://de.donut-be-crazy.com/recipes/maple-bar-recipe>; rel="alternate"; hreflang="de"
</pre></p>

</td>
</tr>
<tr>
<td>Add language version information to your sitemap. For more information, see
Google's<a
href="https://support.google.com/webmasters/answer/189077?hl=en">
documentation for localized pages</a>.</td>
<td><url><br>
 
<loc><code>https://donut-be-crazy.com/recipes/maple-bar-recipe</code></loc><br>

 <code><xhtml:link rel="alternate" hreflang="<em>de</em>"
href="https://de.donut-be-crazy.com/recipes/maple-bar-recipe"
/></code><br>
 <code><xhtml:link rel="alternate" hreflang="<em>es</em>"
href="https://es.donut-be-crazy.com/recipes/maple-bar-recipe"
/></code><br>
<br>
</url></td>
</tr>
</tbody>
</table>

Each page should specify all the different language versions, including itself.
Pages must always link to each other. When page A links to page B using
hreflang, page B must also link back to page A, or else search engines may
ignore the hreflang links or interpret them incorrectly.

## Simple example of hreflang tags in HTML

Here's a simple example of hreflang tags in HTML:

```
<!doctype html>
<html lang="en">
  <head>
    <title>Mary's Maple Bar Fast-Baking Recipe</title>
    <meta name="Description" content="Mary's maple bar recipe is simple and sweet, with just a touch of serendipity. Topped with bacon, this sticky donut is to die for.">
</pre></p>

<br>
        <code><link rel="alternate" hreflang="en"
href="https://donut-be-crazy.com/recipes/maple-bar-recipe" /></code><br>
<p><pre>
    <link rel="alternate" hreflang="es" href="https://es.donut-be-crazy.com/recipes/maple-bar-recipe" />
    <link rel="alternate" hreflang="de" href="https://de.donut-be-crazy.com/recipes/maple-bar-recipe" />
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- import the webpage's stylesheet -->
    <link rel="stylesheet" href="/style.css">
    <!-- import the webpage's javascript file -->
  </head>
  <body>
    <h1>Hi there!</h1>   
  </body>
</html>
```

## Specify language codes in the ISO 639-1 format

The hreflang value must always specify a language code. The language code must
follow [ISO 639-1](https://wikipedia.org/wiki/List_of_ISO_639-1_codes) format.
The hreflang value can also include an optional regional code. For example,
es-mx is for Spanish speakers in Mexico, whereas es-cl is for Spanish speakers
in Chile. The region code must follow [ISO 3166-1
alpha-2](https://wikipedia.org/wiki/ISO_3166-1_alpha-2) format.

## Verify

Run the Lighthouse SEO Audit (Lighthouse > Options > SEO) and look for the
results of the audit "Document doesn't have a valid hreflang".

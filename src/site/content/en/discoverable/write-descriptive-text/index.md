---
layout: post
title: Write descriptive titles, descriptions, and link text
authors:
  - ekharvey
date: 2018-11-05
description: |
  Search engines rely heavily on document titles, descriptions, and link text
  within a document. High-quality, unique descriptions, titles, and link text
  can appear in search results, and show how your pages are relevant to users,
  which in turn can increase your search traffic.
web_lighthouse:
  - document-title
  - meta-description
  - link-text
---

## Why does this matter?

Search engines rely heavily on document titles, descriptions, and link text
within a document. High-quality, unique descriptions, titles, and link text can
appear in search results, and show how your pages are relevant to users, which
in turn can increase your search traffic.

## Measure

Lighthouse displays failed audits, like the ones below, if your content is difficult for
search engines to understand:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th><strong>Failed audit</strong></th>
        <th><strong>How to fix it</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Document does not have a meta description</td>
        <td>
          <a href="#add-tags-to-the-head-of-the-page">Add tags to the head of the page</a>
        </td>
      </tr>
      <tr>
        <td>Document does not have a title element</td>
        <td>
          <a href="#add-tags-to-the-head-of-the-page">Add tags to the head of the page</a>
        </td>
      </tr>
      <tr>
        <td>Links don't have descriptive text</td>
        <td>
          <a href="#add-descriptive-link-text">Add descriptive link text</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Add tags to the head of the page

Add a meta description and title for every page on your site. Here's a full
example of what the `<head>` of each page should include:

```html
<!doctype html>
<html lang="en">
<head>
  <title>Mary's Maple Bar Fast-Baking Recipe</title>
  <meta name="Description" content="Mary's maple bar recipe is simple
  and sweet, with just a touch of serendipity. Topped with bacon,
  this sticky donut is to die for.">
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- import the webpage's stylesheet -->
  <link rel="stylesheet" href="/style.css">
  <!-- import the webpage's javascript file -->
  <script src="/script.js" defer></script>
</head>
<body>
  ...
</body>
</html>
```

Here are some examples of good vs bad titles and descriptions:

```html
<title>Donut recipe</title>
<meta name="description" content="A donut recipe.">
```

{% Compare 'worse' %}
too vague
{% endCompare %}

```html
<title>Mary's Maple Bar Fast-Baking Recipe</title>
<meta
  name="description"
  content="Mary's maple bar recipe is simple and sweet,
           with just a touch of serendipity. Topped with
           bacon, this sticky donut is to die for.">
```

{% Compare 'better' %}
precise!
{% endCompare %}

Here are some best practices to keep in mind when you're writing descriptions
and titles:

+  Make them descriptive and concise. Avoid vague titles like "Home" and
    link text like "click here".
+  Avoid [keyword
    stuffing](https://support.google.com/webmasters/answer/66358). Cramming
    your content with keywords isn't helpful to users, and search engines may
    mark the page as spam.
+  Avoid repeated or boilerplate titles and descriptions for each page. If you
    have a big site, use the
    [HTML Improvements Report](https://support.google.com/webmasters/answer/80407)
    to crawl the site and discover any page that's missing a title.

See
[Create descriptive page titles](https://support.google.com/webmasters/answer/35624)
and
[Create good meta descriptions](https://support.google.com/webmasters/answer/35624#1)
for more tips.

## Add descriptive link text

Replace generic descriptions, such as "click here" and "learn more" with
specific descriptions. You'll need to read the context of the page and write
relevant text that makes sense with the rest of the content. Here's an example
of good vs bad link descriptions:

```html
<p>
  Get cooking and learn how to make a maple bar
  <a href="https://donut-be-crazy.com/recipes/maple-bar-recipe">
    here
  </a>.
</p>
```

{% Compare 'worse' %}
too vague
{% endCompare %}

```html
<p>
  Get cooking and learn how to
  <a href="https://donut-be-crazy.com/recipes/maple-bar-recipe">
    make a delicious maple bar with Mary
  </a>!
</p>
```

{% Compare 'better' %}
precise!
{% endCompare %}

Here are some best practices to keep in mind when you're writing descriptive
link text:

+  Stay on topic. Don't use text that has no relation to the page's content.
+  Don't use the page's URL as the link description, unless you have a good
    reason to do so, such as referencing a site's new address.
+  Keep descriptions concise. Aim for a few words or a short phrase.
+  Format links so that users can easily spot them.
+  Pay attention to your internal links, too. Improving the quality of
    internal links can help users and search engines navigate your site.

See
[Use links wisely](https://support.google.com/webmasters/answer/7451184#uselinkswisely)
for more tips.

## Verify

Run the Lighthouse SEO Audit (Lighthouse > Options > SEO) and look for the
results of the following audits:

+  Document does not have a meta description
+  Document does not have a title element
+  Links don't have descriptive text
If you fixed the issue(s), the audits display in the "passed audits" section of the report.

---
page_type: guide
title: Fix the viewport meta tag
author: ekharvey
web_lighthouse:
- viewport
wf_blink_components: N/A
---

# Fix the viewport meta tag

## Why does this matter?

Without a
[viewport meta tag](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag),
mobile devices render pages at typical desktop screen widths, and then scale the
pages to fit mobile screens. Setting the viewport enables you to control the
width and scaling of the viewport. 

## Measure

Lighthouse displays the following failed audit if your content has a scaling
issue when displaying on mobile devices: "Has a Viewport Meta Tag With width Or
initial-scale".

## Add a viewport tag to the head of your page

Add a viewport `<meta>` tag in the `<head>` of your page.

```
<!doctype html>
<html lang="en">
  <head>
    <title>Mary's Maple Bar Fast-Baking Recipe</title>
    <meta name="Description" content="Mary's maple bar recipe
    is simple and sweet, with just a touch of serendipity. Topped
    with bacon, this sticky donut is to die for.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- import the webpage's stylesheet -->
    <link rel="stylesheet" href="/style.css">
    <!-- import the webpage's javascript file →
    <script src="/script.js" defer></script>
</head>
  <body>
    <h1>Hi there!</h1>   
  </body>
</html>
```

Here's what each key value pair does:

<table>
<thead>
<tr>
<th>Key value pair</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
  
    width=device-width
  
</td>
<td>Sets the width of the viewport to the width of the device.</td>
</tr>
<tr>
<td>

    initial-scale=1

</td>
<td>Sets the initial zoom level when visiting the page.</td>
</tr>
</tbody>
</table>

Don't use a maximum scale value, since that disables zoom. Also, keep in mind
that adding a meta viewport tag like this will break layouts for non-responsive
sites that use fixed widths.

## Verify

Run the Lighthouse SEO Audit (Lighthouse > Options > SEO) and look for the
results of the audit "Has a Viewport Meta Tag width Or initial-scale".

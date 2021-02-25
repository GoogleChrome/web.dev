---
layout: codelab
title: Preload web fonts to improve loading speed
authors:
  - gmimani
description: |
  In this codelab, learn how to improve the performance of a page by preloading
  web fonts.
date: 2018-04-23
glitch: web-dev-preload-webfont?path=index.html
related_post: preload-critical-assets
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

This codelab shows you how to preload web fonts using `rel="preload"` to remove
any flash of unstyled text (FOUT).

## Measure

First measure how the website performs before adding any optimizations.
{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}

The Lighthouse report that is generated will show you the fetching sequence of resources under **Maximum critical path latency**.

{% Img src="image/admin/eperh8ZUnjhsDlnJdNIG.png", alt="Webfonts are present in the critical request chain.", width="704", height="198", class="w-screenshot" %}

In the above audit the web fonts are part of the critical request chain and fetched last. The [**critical request chain**](/critical-request-chains) represents the order of resources that are prioritized and fetched by the browser. In this application, the web fonts (Pacfico and Pacifico-Bold) are defined using the [@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face) rule and are the last resource fetched by the browser in the critical request chain. Typically, webfonts are lazy loaded which means that they are not loaded until the critical resources are downloaded (CSS, JS).

Here is the sequence of the resources fetched in the application:

{% Img src="image/admin/9oBNjZORrBj6X8RVlr9t.png", alt="Webfonts are lazy loaded.", width="583", height="256", class="w-screenshot" %}

## Preloading Web fonts
In order to avoid FOUT, you can preload web fonts that are required immediately. Add the `Link` element for this application at the head of the document:

```html
<head>
 <!-- ... -->
 <link rel="preload" href="/assets/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

The `as="font" type="font/woff2"` attributes tell the browser to download this resource as a font and helps in prioritization of the re­source queue.

The `crossorigin` attribute indicates whether the resource should be fetched with a CORS request as the font may come from a different domain. Without this attribute, the preloaded font is ignored by the browser.

Since Pacifico-Bold is used in the page header, we added a preload tag to fetch it even sooner. It isn't important to preload the Pacifico.woff2 font because it styles the text that is below the fold.

Reload the application and run lighthouse again. Check the **Maximum critical path latency** section.

{% Img src="image/admin/lC85s7XSc8zEXgtwLsFu.png", alt="Pacifico-Bold webfont is preloaded and removed from the cricical request chain", width="645", height="166", class="w-screenshot" %}

Notice how the `Pacifico-Bold.woff2` is removed from the critical request chain. It is fetched earlier in the application.

{% Img src="image/admin/BrXidcKZfCbbUbkcSwas.png", alt="Pacifico-Bold webfont is preloaded", width="553", height="254", class="w-screenshot" %}

 With preload, the browser knows that it needs to download this file earlier. It is important to note that if not used correctly, preload can harm performance by making unnecessary requests for resources that are not used.

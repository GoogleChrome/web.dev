---
layout: post
title: Extract critical CSS
subhead: Learn how to improve render times with critical CSS technique.
authors:
  - mihajlija
date: 2019-05-29
hero: image/admin/ZC6iWHhgnrSZtPJMfwMh.jpg
alt: A flatlay photo of wrenches and screwdrivers.
description: |
  Learn how to improve render times with critical CSS technique and how to choose the best tool for your project.
codelabs: codelab-extract-and-inline-critical-css
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - css
---

The browser must download and parse CSS files before it can show the page, which makes CSS a render-blocking resource. If CSS files are big, or network conditions are poor, requests for CSS files can significantly increase the time it takes for a web page to render.

{% Aside 'key-term' %}
Critical CSS is a technique that extracts the CSS for above-the-fold content in order to render content to the user as fast as possible.
{% endAside %}

<figure class="w-figure">
  {% Img src="image/admin/t3Kkvh265zi6naTBga41.png", alt="An illustration of a laptop and a mobile device with web pages overflowing the edges of screens", width="800", height="469", class="" %}
</figure>

{% Aside 'note' %}
Above-the-fold is all the content a viewer sees on page load, before scrolling. There is no universally defined pixel height of what is considered above the fold content since there is a myriad of devices and screen sizes.
{% endAside %}

Inlining extracted styles in the `<head>` of the HTML document eliminates the need to make an additional request to fetch these styles. The remainder of the CSS can be loaded asynchronously.

<figure class="w-figure">
    {% Img src="image/admin/RVU3OphqtjlkrlAtKLEn.png", alt="HTML file with critical CSS inlined in the head", width="800", height="325", class="w-screenshot" %}
    <figcaption class="w-figcaption">
    Inlined critical CSS
    </figcaption>
</figure>

Improving render times can make a huge difference in [perceived performance](https://developers.google.com/web/fundamentals/performance/rail#ux), especially under poor network conditions. On mobile networks, high latency is an issue regardless of bandwidth.

<figure class="w-figure">
  {% Img src="image/admin/NdQz49RVgdHoh3Fff0yr.png", alt="Filmstrip view comparison of loading a page with render-blocking CSS (top) and the same page with inlined critical CSS (bottom) on a 3G connection. Top filmstrip shows six blank frames before finally displaying content. Bottom filmstrip displays meaningful content in the first frame.", width="800", height="363", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Comparison of loading a page with render-blocking CSS (top) and the same page with inlined critical CSS (bottom) on a 3G connection
  </figcaption>
</figure>

If you have poor [First Contentful Paint (FCP)](/first-contentful-paint) and see "Eliminate render-blocking resource" opportunity in Lighthouse audits it's a good idea to give critical CSS a go.

{% Img src="image/admin/0xea7menL90lWHwbjZoP.png", alt="Lighthouse audit with 'Eliminate render-blocking resource' or 'Defer unused CSS' opportunities", width="743", height="449", class="w-screenshot" %}

{% Aside 'gotchas' %}
Keep in mind that if you inline a large amount of CSS, it delays the transmission of the rest of the HTML document. If everything is prioritized then nothing is. Inlining also has some downsides in that it prevents the browser from caching the CSS for reuse on subsequent page loads, so it's best to use it sparingly.
{% endAside %}

<p id="14KB">To minimize the number of roundtrips to first render, aim to keep above-the-fold content under <strong>14 KB</strong> (compressed).</p>

{% Aside 'note' %}
New [TCP](https://hpbn.co/building-blocks-of-tcp/) connections cannot immediately use the full available bandwidth between the client and the server, they all go through [slow-start](https://hpbn.co/building-blocks-of-tcp/#slow-start) to avoid overloading the connection with more data than it can carry. In this process, the server starts the transfer with a small amount of data and if it reaches the client in perfect condition, doubles the amount in the next roundtrip. For most servers, 10 packets or approximately 14 KB is the maximum that can be transferred in the first roundtrip.
{% endAside %}

The performance impact you can achieve with this technique depends on the type of your website. Generally speaking, the more CSS a site has, the greater the possible impact of inlined CSS.

## Overview of tools

There are a number of great tools that can automatically determine the critical CSS for a page. This is good news because doing this manually would be a tedious process. It requires analysis of the entire DOM to determine the styles that are applied to each element in the viewport.

### Critical

[Critical](https://github.com/addyosmani/critical) extracts, minifies and inlines above-the-fold CSS and is available as [npm module](https://www.npmjs.com/package/critical). It can be used with Gulp (directly) or with Grunt (as a [plugin](https://github.com/bezoerb/grunt-critical)) and there's a [webpack plugin](https://github.com/anthonygore/html-critical-webpack-plugin) too.

It's a simple tool that takes a lot of thinking out of the process. You don't even have to specify the stylesheets, Critical automatically detects them. It also supports extracting critical CSS for multiple screen resolutions.

### criticalCSS

[CriticalCSS](https://github.com/filamentgroup/criticalCSS) is another [npm module](https://www.npmjs.com/package/criticalcss) that extracts above-the-fold CSS. It is also available as a CLI.

It doesn't have options to inline and minify critical CSS, but it does let you force-include rules that don't actually belong in critical CSS and gives you more granular control over including `@font-face` declarations.

### Penthouse

[Penthouse](https://github.com/pocketjoso/penthouse) is a good choice if your site or app has a large number of styles or styles which are being dynamically injected into the DOM (common in Angular apps). It uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) under the hood and even features an [online hosted version](https://jonassebastianohlsson.com/criticalpathcssgenerator/) too.

Penthouse doesn't detect stylesheets automatically, you have to specify the HTML and CSS files that you want to generate critical CSS for. The upside is that it's good at running many jobs in parallel.

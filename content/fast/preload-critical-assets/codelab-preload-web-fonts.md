---
page_type: glitch
title: Preload web fonts to improve loading speed
author: garima
description: |
  In this codelab, learn how to improve the performance of a page by preloading
  web fonts.
web_updated_on: 2018-12-06
web_published_on: 2018-11-05
glitch: web-dev-preload-webfont
---

This codelab shows you how to preload web fonts using rel="preload" to remove any flash of unstyled text (FOUT).


## Measure

First measure how the website performs before adding any optimizations.
1. Click on the **Show Live** button to view the live version of the your Glitch.
2. Open DevTools by pressing `CMD + OPTION + i `/ `CTRL + SHIFT + i`.
3. Click on the **Audits** panel.
4. Select the **Performance** checkbox.
5. Click Run **Audits** to generate a report.

The Lighthouse report that is generated will show you the fetching sequence of resources under **Maximum critical path latency**.

<img class="screenshot" src="./lighthouse-before.png" alt="Webfonts are present in the critical request chain.">

In the above audit the web fonts are part of the critical request chain and fetched last. The [**critical request chain**](https://developers.google.com/web/tools/lighthouse/audits/critical-request-chains) represents the order of resources that are prioritized and fetched by the browser. In this application, the web fonts (Pacfico and Pacifico-Bold) are defined using the [@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face) rule and are the last resource fetched by the browser in the critical request chain. Typically, webfonts are lazy loaded which means that they are not loaded until the critical resources are downloaded (CSS, JS).

Here is the sequence of the resources fetched in the application:

<img class="screenshot" src="./network-request-before.png" alt="Webfonts are lazy loaded.">
 
## Preloading Web fonts.
In order to avoid FOUT, you can preload web fonts that are required immediately. Add the `Link` element for this application at the head of the document:

<pre class="prettyprint">
&lt;head&gt;
 &lt;!-- ... -->
 <strong>&lt;link rel=&quot;preload&quot; href=&quot;/assets/Pacifico-Bold.woff2&quot; as=&quot;font&quot; type=&quot;font/woff2&quot; crossorigin&gt;</strong>
&lt;/head&gt;
</pre>

The `as="font" type="font/woff2"` attributes tell the browser to download this resource as a font and helps in prioritization of the re­source queue. 

The `crossorigin` attribute indicates whether the resource should be fetched with a CORS request as the font may come from a different domain. Without this attribute, the preloaded font is ignored by the browser.

Since Pacifico-Bold is used in page header, we added a preload tag to fetch it even sooner. It isn’t important to preload the Pacifico.woff2 font because it styles the text that is below the fold. 

Reload the application and run lighthouse again. Check the **Maximum critical path latency** section.



<img class="screenshot" src="./lighthouse-after.png" alt="Pacifico-Bold webfont is preloaded and removed from the cricical request chain">

Notice how the `Pacifico-Bold.woff2` is removed from the critical request chain. It is fetched earlier in the application.

<img class="screenshot" src="./network-after.png" alt="Pacifico-Bold webfont is preloaded">

 With preload, the browser knows that it needs to download this file earlier. It is important to note that if not used correctly, preload can harm performance by making unnecessary requests for resources that are not used.
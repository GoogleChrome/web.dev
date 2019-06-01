---
title: JavaScript and Google Search
subhead: Get the latest updates and insights from Google I/O 2019.
authors:
  - martinsplitt
  - ekharvey
date: 2019-06-03
hero: hero.png
alt: A pile of gears.
description: |
  We introduced a new Googlebot at Google I/O and took this opportunity to discuss improvements and best practices for JavaScript web apps in Google Search.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - seo
  - discoverability
  - javascript
---

## Meet the evergreen Googlebot

This year we announced the much-awaited [new evergreen Googlebot](https://webmasters.googleblog.com/2019/05/the-new-evergreen-googlebot.html).

<figure class="w-figure w-figure--center">
  <img src="evergreen-googlebot.png" alt="Googlebot holding the Chrome logo" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Googlebot is now running a modern Chromium rendering engine.
  </figcaption>
</figure>

Googlebot now uses a modern Chromium engine to render websites for Google Search. On top of that, we test newer versions of Chromium to keep Googlebot updated in the future. We will update Googlebot within a few weeks of a stable Chrome release. This announcement is big news for web developers and SEOs, because it marks the arrival of [1000+ new features](https://caniuse.com/#compare=chrome+41,chrome+74), such as ES6+, IntersectionObserver, and Web Components v1 in Googlebot. 

While the [session on new and upcoming features in Google Search](https://www.youtube.com/watch?v=ufcijo46LCU&list=PLKoqnv2vTMUPsSoDoVlUlgVkyh0OfjB-x) focused on new and upcoming features, we also had a session on JavaScript and Google Search. In this session we shared more details on improving JavaScript-driven web apps. We looked at:

*   Feature detection and error handling
*   Googlebot's pipeline for crawling, rendering and indexing
*   Rendering strategies
*   Testing tools for your website in Google Search
*   Common challenges and possible solutions
*   Best practices for SEO in JavaScript web apps

Here's the full video:

<div style="width:100%; padding-top: 56.25%; position: relative;">
  <iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://www.youtube.com/embed/Ey0N1Ry0BPM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Use feature detection and handle errors

The evergreen Googlebot has lots of new features, but some features are still not supported. Relying on unsupported features or not handling errors properly can mean Googlebot can't render or index your content. 

Let's look at an example:

```html
 <body>
   <script>
     navigator.geolocation.getCurrentPosition(function onSuccess(position) {
       loadLocalContent(position);
     });
   </script>
 </body>
```

This page might not show any content in some cases. The code doesn't handle when the user declines the permission or when getCurrentPosition call returns an error. Googlebot declines permission requests like this by default. This is a better solution:

```html
 <body>
   <script>
     if (navigator.geolocation) {
       // this browser supports the Geolocation API, request location!
       navigator.geolocation.getCurrentPosition(
         function onSuccess(position) {
           // we successfully got the location, show local content
           loadLocalContent(position);
         }, function onError() {
           // we failed to get the location, show fallback content
           loadGlobalContent();
         });
     } else {
       // this browser does not support the Geolocation API, show fallback content
       loadGlobalContent();
     }
   </script>
 </body>

```

If you have problems with your JavaScript site, [walk through our troubleshooting guide](https://developers.google.com/search/docs/guides/fix-search-javascript) to find solutions.

## Learn how Googlebot works

Googlebot is a pipeline with different components. Let's take a look at this pipeline to understand how Googlebot indexes pages for Google Search.

<figure class="w-figure w-figure--center w-figure--fullbleed">
  <img src="googlebot-process.png" alt="A diagram showing a URL moving from a crawling queue to a processing step that extracts linked URLs and adds them to the crawling queue, a rendering queue that feeds into a renderer which produces HTML. The processor uses this HTML to extract linked URLs again and index the content.">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Fig. 1 — Googlebot's pipeline for crawling, rendering and indexing a page.
  </figcaption>
</figure>

The process works like this:

1. Googlebot queues URLs for crawling.
2. It then fetches the URLs with an HTTP request based on the [crawl budget](https://webmasters.googleblog.com/2017/01/what-crawl-budget-means-for-googlebot.html).
3. Googlebot's next stage is scanning the HTML for links and queues the discovered links for crawling.
4. Googlebot then queues the page for rendering.
5. As soon as possible, a headless Chromium instance renders the page (JavaScript is executed here).
6. Googlebot uses the rendered HTML to index the page.

Your technical setup can influence the process of crawling, rendering, and indexing. For example, slow response times or server errors can impact the [crawl budget](https://webmasters.googleblog.com/2017/01/what-crawl-budget-means-for-googlebot.html) and links that are only rendered with JavaScript can lead to a slower discovery of these links.

## Choose the right rendering strategy for your web app

The default rendering strategy for single-page apps today is client-side rendering. The HTML loads the JavaScript which generates the content in the browser as it executes. 

<figure class="w-figure">
  <img src="spa-kittens.png" alt="A code box showing HTML that loads some scripts. A screenshot of a web page on mobile that shows placeholder images while loading the actual content.">
  <figcaption class="w-figcaption">
    The rendering strategy influences the performance and robustness of your web apps.
  </figcaption>
</figure> 

The rendering strategy of your website influences performance. It also has an impact on how bots like Googlebot interact with it. Server-side rendering or pre-rendering can improve the performance for users and crawlers. Those strategies execute JavaScript on the server to generate the initial HTML content. The browser can start rendering the HTML as it arrives over the network, making the page load faster.  The [rendering session at I/O](https://www.youtube.com/watch?v=k-A2VfuUROg)  or [the blog post about rendering on the web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) shows how server-side rendering and hydration can improve the performance and user experience of web apps with more examples of how these strategies are implemented.

If you are looking for a workaround to help crawlers that don't execute JavaScript or cannot make changes to your frontend codebase, consider [dynamic rendering](https://developers.google.com/search/docs/guides/dynamic-rendering) - we also have [a codelab that you can try out](https://codelabs.developers.google.com/codelabs/dynamic-rendering). Unlike server-side rendering or pre-rendering you won't get the user experience or performance benefits as dynamic rendering only serves static HTML to crawlers, so it's a workaround rather than a long-term strategy.

## Test your pages

While most pages generally work fine with Googlebot, we recommend testing your pages regularly to make sure your content is available to Googlebot and there are no problems. There are several great tools to help you do that.

The easiest way to do a quick check of a page is the [Mobile-Friendly Test](https://g.co/mobilefriendly). Besides showing you issues with mobile-friendliness, it also gives you a screenshot of the above-the-fold content and the rendered HTML as Googlebot sees it.

<figure class="w-figure">
  <img class="w-screenshot" src="mobile-friendly-test-rendered-html.png" alt="The mobile-friendly test shows the rendered HTML Googlebot sees after rendering the page">
  <figcaption class="w-figcaption">
    The mobile-friendly test shows you the rendered HTML Googlebot uses.
  </figcaption>
</figure>

You can also find out if there are resource loading issues or JavaScript errors.

<figure class="w-figure">
  <img class="w-screenshot" src="mobile-friendly-test-js-error.png" alt="The Mobile-Friendly Test shows JavaScript errors and a stack trace.">
  <figcaption class="w-figcaption">
    You can use the mobile-friendly test as well to find loading issues or JavaScript errors.
  </figcaption>
</figure>

We recommend to verify your domain in [Google Search Console](https://g.co/searchconsole) so you can use the URL inspection tool to find out more about the crawling and indexing state of a URL, receive messages when we detect issues and find out more details of how your site performs in Google Search.

<figure class="w-figure">
  <img class="w-screenshot" src="search-console-url-inspection-tool.png" alt="The URL inspection tool showing a page that is indexed with information on discovery, crawling and indexing for one URL">
  <figcaption class="w-figcaption">
    The URL Inspection Tool in Search Console shows the status of a page in crawling, rendering, and indexing.
  </figcaption>
</figure>

For general SEO tips and guidance, you can use the SEO audits in Lighthouse. To integrate SEO audits into your testing suite, use the [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-cli) or the [Lighthouse CI bot](https://github.com/GoogleChromeLabs/lighthousebot).

<figure class="w-figure">
  <img class="w-screenshot" src="lighthouse-seo-audit-report.png" alt="A lighthouse SEO report with a score of 44 and warnings about mobile-friendliness as well as warnings about content best practices">
  <figcaption class="w-figcaption">
    Lighthouse shows general SEO recommendations for a page.
  </figcaption>
</figure>

These tools help you identify, debug, and fix issues with pages in Google Search and should be part of your development routine.

## Stay up to date and get in touch

To stay up to date with announcements and changes to Google Search, keep an eye on our [Webmasters Blog](https://webmasters.googleblog.com), the [Google Webmasters Youtube channel](https://youtube.com/GoogleWebmasterHelp), and our [Twitter account](https://twitter.com/googlewmc).
Also check out our [developer guide to Google Search](http://developers.google.com/search/docs/guides/) and our [JavaScript SEO video series](https://www.youtube.com/watch?v=LXF8bM4g-J4&list=PLKoqnv2vTMUPOalM1zuWDP9OQl851WMM9) to learn more about SEO and JavaScript.

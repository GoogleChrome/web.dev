---
title: Making JavaScript and Google Search work together
subhead: Get the latest updates and insights from Google I/O 2019.
authors:
  - martinsplitt
  - ekharvey
date: 2019-06-05
hero: image/admin/k1FlFDvBm4ERrbUiVws4.png
alt: A pile of gears.
description: |
  We introduced a new Googlebot at Google I/O and took the opportunity to discuss improvements and best practices for making JavaScript web apps work well with Google Search.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - seo
  - discoverability
  - javascript
---

Great things are happening with Google Search, and we were excited to share them at Google I/O 2019!

{% YouTube 'ufcijo46LCU' %}

In this post we'll focus on best practices for making JavaScript web apps discoverable in Google Search, including:

*   The new evergreen Googlebot
*   Googlebot's pipeline for crawling, rendering and indexing
*   Feature detection and error handling
*   Rendering strategies
*   Testing tools for your website in Google Search
*   Common challenges and possible solutions
*   Best practices for SEO in JavaScript web apps

## Meet the evergreen Googlebot

This year we announced the much-awaited [new evergreen Googlebot](https://webmasters.googleblog.com/2019/05/the-new-evergreen-googlebot.html).

<figure class="w-figure">
  {% Img src="image/admin/q6RSuwuwLT7mcgE9Joqp.png", alt="Googlebot holding the Chrome logo", width="400", height="401" %}
  <figcaption class="w-figcaption">Googlebot is now running a modern Chromium rendering engine.</figcaption>
</figure>

Googlebot now uses a modern Chromium engine to render websites for Google Search. On top of that, we will test newer versions of Chromium to _keep_ Googlebot updated, usually within a few weeks of each stable Chrome release. This announcement is big news for web developers and SEOs because it marks the arrival of [1000+ new features](https://caniuse.com/#compare=chrome+41,chrome+74)—such as ES6+, `IntersectionObserver`, and Web Components v1—in Googlebot.

## Learn how Googlebot works

Googlebot is a pipeline with several components. Let's take a look to understand how Googlebot indexes pages for Google Search.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/admin/zu4wDqHHxpU0dbwSajqA.png", alt="A diagram showing a URL moving from a crawling queue to a processing step that extracts linked URLs and adds them to the crawling queue, a rendering queue that feeds into a renderer which produces HTML. The processor uses this HTML to extract linked URLs again and index the content.", width="800", height="446" %}
  <figcaption class="w-figcaption">Googlebot's pipeline for crawling, rendering, and indexing a page.</figcaption>
</figure>

The process works like this:

1. Googlebot queues URLs for crawling.
2. It then fetches the URLs with an HTTP request based on the [crawl budget](https://webmasters.googleblog.com/2017/01/what-crawl-budget-means-for-googlebot.html).
3. Googlebot scans the HTML for links and queues the discovered links for crawling.
4. Googlebot then queues the page for rendering.
5. As soon as possible, a headless Chromium instance renders the page, which includes JavaScript execution.
6. Googlebot uses the rendered HTML to index the page.

Your technical setup can influence the process of crawling, rendering, and indexing. For example, slow response times or server errors can impact the [crawl budget](https://webmasters.googleblog.com/2017/01/what-crawl-budget-means-for-googlebot.html). Another example would be requiring JavaScript to render the links can lead to a slower discovery of these links.

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

This page might not show any content in some cases because the code doesn't handle when the user declines the permission or when getCurrentPosition call returns an error. Googlebot declines permission requests like this by default.

This is a better solution:

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

If you have problems with getting your JavaScript site indexed, [walk through our troubleshooting guide](https://developers.google.com/search/docs/guides/fix-search-javascript) to find solutions.

## Choose the right rendering strategy for your web app

The default rendering strategy for single-page apps today is client-side rendering. The HTML loads the JavaScript, which then generates the content in the browser as it executes.

Let's look at a web app that shows a collection of cat images and uses JavaScript to render entirely in the browser.

<figure class="w-figure">
  {% Img src="image/admin/lzijYVwo1DPX3Fa2liXk.png", alt="A code box showing HTML that loads some scripts. A screenshot of a web page on mobile that shows placeholder images while loading the actual content.", width="800", height="447" %}
  <figcaption class="w-figcaption">The rendering strategy influences the performance and robustness of your web apps.</figcaption>
</figure>

If you're free to choose your rendering strategy, consider server-side rendering or pre-rendering. They execute JavaScript on the server to generate the initial HTML content, which can improve performance for both users and crawlers. These strategies allow the browser to start rendering HTML as it arrives over the network, making the page load faster.  The [rendering session at I/O](https://www.youtube.com/watch?v=k-A2VfuUROg)  or [the blog post about rendering on the web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) shows how server-side rendering and hydration can improve the performance and user experience of web apps and provides more code examples for these strategies.

If you're looking for a workaround to help crawlers that don't execute JavaScript—or if you can't make changes to your frontend codebase—consider [dynamic rendering](https://developers.google.com/search/docs/guides/dynamic-rendering), which you can try out in [this codelab](https://codelabs.developers.google.com/codelabs/dynamic-rendering). Note, though, that you won't get the user experience or performance benefits that you would with server-side rendering or pre-rendering because dynamic rendering only serves static HTML to crawlers. That makes it a stop-gap rather than a long-term strategy.

## Test your pages

While most pages generally work fine with Googlebot, we recommend testing your pages regularly to make sure your content is available to Googlebot and there are no problems. There are several great tools to help you do that.

The easiest way to do a quick check of a page is the [Mobile-Friendly Test](https://g.co/mobilefriendly). Besides showing you issues with mobile-friendliness, it also gives you a screenshot of the above-the-fold content and the rendered HTML as Googlebot sees it.

<figure class="w-figure">
  {% Img src="image/admin/15IgtDchchBvLsVyzmG2.png", alt="The mobile-friendly test shows the rendered HTML Googlebot sees after rendering the page", width="800", height="414" %}
  <figcaption class="w-figcaption">The mobile-friendly test shows you the rendered HTML Googlebot uses.</figcaption>
</figure>

You can also find out if there are resource loading issues or JavaScript errors.

<figure class="w-figure">
  {% Img src="image/admin/22ttektRnHrbGT0zvbHK.png", alt="The Mobile-Friendly Test shows JavaScript errors and a stack trace.", width="800", height="414", class="w-screenshot" %}
</figure>

It's recommended to verify your domain in [Google Search Console](https://g.co/searchconsole) so you can use the URL inspection tool to find out more about the crawling and indexing state of a URL, receive messages when Search Console detects issues and find out more details of how your site performs in Google Search.

<figure class="w-figure">
  {% Img src="image/admin/JYsPy8FXL3E86gCzekQ3.png", alt="The URL inspection tool showing a page that is indexed with information on discovery, crawling and indexing for one URL", width="800", height="655", class="w-screenshot" %}
  <figcaption class="w-figcaption">The URL Inspection Tool in Search Console shows the status of a page in crawling, rendering, and indexing.</figcaption>
</figure>

For general SEO tips and guidance, you can use the SEO audits in Lighthouse. To integrate SEO audits into your testing suite, use the [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-cli) or the [Lighthouse CI bot](https://github.com/GoogleChromeLabs/lighthousebot).

<figure class="w-figure">
  {% Img src="image/admin/ctch0ql8UQZiaKaWy34u.png", alt="A lighthouse SEO report with a score of 44 and warnings about mobile-friendliness as well as warnings about content best practices", width="800", height="443", class="w-screenshot" %}
  <figcaption class="w-figcaption">Lighthouse shows general SEO recommendations for a page.</figcaption>
</figure>

These tools help you identify, debug, and fix issues with pages in Google Search and should be part of your development routine.

## Stay up to date and get in touch

To stay up to date with announcements and changes to Google Search, keep an eye on our [Webmasters Blog](https://webmasters.googleblog.com), the [Google Webmasters Youtube channel](https://youtube.com/GoogleWebmasterHelp), and our [Twitter account](https://twitter.com/googlewmc).
Also check out our [developer guide to Google Search](http://developers.google.com/search/docs/guides/) and our [JavaScript SEO video series](https://www.youtube.com/watch?v=LXF8bM4g-J4&list=PLKoqnv2vTMUPOalM1zuWDP9OQl851WMM9) to learn more about SEO and JavaScript.

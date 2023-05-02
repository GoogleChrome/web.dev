---
layout: post
title: Use tools to measure performance
authors:
  - samdutton
date: 2018-08-16
updated: 2018-09-02
description: >
  There are several core objectives for building a performant, resilient site with low data cost. For each objective, you need an audit.
---

There are several core objectives for building a performant, resilient site with low data cost.

For each objective, you need an audit.

<table data-alignment="top">
<thead>
<tr>
<th><strong>Objective</strong></th>
<th><strong>Why?</strong></th>
<th><strong>What to test for?</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Ensure privacy, security and data integrity, and enable powerful API usage</td>
<td><a href="https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https">Why HTTPS Matters</a></td>
<td>HTTPS implemented for all site pages/routes and assets.</td>
</tr>
<tr>
<td>Improve load performance</td>
<td><a href="https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/">53% of users
abandon sites</a> that take longer than three seconds to load</td>
<td>JavaScript and CSS that could be loaded asynchronously or deferred. Set goals for time to
  interactive and payload size: for example TTI on 3G. <a href="https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/">Set a performance budget</a>.</td>
</tr>
<tr>
<td>Reduce page weight</td>
<td>• Reduce data cost for users with capped data plans
• Reduce web app storage requirements — particularly important for users on low-spec devices
• Reduce hosting and serving costs
• Improve serving performance, reliability and resilience</td>
<td>Set a page weight budget: for example, first load under 400 kB. Check for heavy JavaScript.
  Check file sizes to find bloated images, media, HTML, CSS and JavaScript. Find images that could
  be lazy loaded, and check for unused code with
  <a href="https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage">coverage tools</a>.</td>
</tr>
<tr>
<td>Reduce resource requests</td>
<td>• Reduce
  <a href="https://www.igvita.com/2012/07/19/latency-the-new-web-performance-bottleneck/">latency issues</a>
• Reduce serving costs
• Improve serving performance, reliability and resilience</td>
<td>Look for excessive or unnecessary requests for any type of resource. For example: files that are
loaded repeatedly, JavaScript that is loaded in multiple versions, CSS that is never used, images
that are never viewed (or could be lazy loaded). </td>
</tr>
<tr>
<td>Optimize memory usage </td>
<td><a href="https://timkadlec.com/2013/11/why-we-need-responsive-images-part-deux/">Memory can
become the new bottleneck</a>, especially on mobile devices</td>
<td>Use the Chrome Task Manager to compare your site against others for memory usage when loading
the home page and using other site features. </td>
</tr>
<tr>
<td>Reduce CPU load</td>
<td>Mobile devices have limited CPU, especially low-spec devices</td>
<td>Check for heavy JavaScript. Find unused JavaScript and CSS with
  <a href="https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage">coverage tools</a>.
  Check for <a href="https://developers.google.com/web/tools/lighthouse/audits/dom-size">excessive
  DOM size</a> and scripts that run unnecessarily on first load. Look for JavaScript loaded in
multiple versions, or libraries that could be avoided with minor refactoring. </td>
</tr>
</tbody>
</table>

There is a wide range of tools and techniques for auditing websites:

- System tools
- Built-in browser tools
- Browser extensions
- Online test applications
- Emulation tools
- Analytics
- Metrics provided by servers and business systems
- Screen and video recording
- Manual tests

Below you'll learn which approach is relevant for each type of audit.

{% Aside %}
**Images constitute by far the [most weight](http://httparchive.org/interesting.php#bytesperpage) and [most requests](http://httparchive.org/trends.php#bytesImg&reqImg) for most web pages.**

[Latency gets worse as connectivity gets worse](https://www.igvita.com/2012/07/19/latency-the-new-web-performance-bottleneck/) so excessive image file requests are an increasing
problem as the web goes mobile. Images also consume power: more image requests, more radio usage,
more flat batteries. [Even just to render images takes power](http://httparchive.org/trends.php#bytesImg&reqImg) – and this is proportional to the size and quantity of images.

Likewise for memory: small increases in pixel dimensions result in big increases in memory
usage. With images on mobile — especially on low-spec devices — [memory can become the new bottleneck](https://timkadlec.com/2013/11/why-we-need-responsive-images-part-deux/). Bloated images are also problematic for users on capped data
plans.

[Remove redundant images](https://developers.google.com/web/fundamentals/design-and-ui/responsive/content#viewport)! If you can't get rid of them, optimize: increase compression as much as possible, reduce pixel dimensions, and use the format that gives you the smallest file sizes.
Optimizing 'hero images' such as banners and backgrounds is an easy, one-off win.
{% endAside %}

## Record resource requests: number, size, type and timing

A good place to start when auditing a site is to check pages with your browser's network tools.
If you're not sure how to do this, work through the Chrome DevTools network panel
[Get Started Guide](/web/tools/chrome-devtools/network-performance/).
Similar tools are available for
[Firefox](https://developer.mozilla.org/docs/Tools/Network_Monitor),
[Safari](https://developer.apple.com/library/content/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/Instruments/Instruments.html#//apple_ref/doc/uid/TP40007874-CH4-SW1),
[Internet Explorer](<https://msdn.microsoft.com/library/gg130952(v=vs.85).aspx>) and
[Edge](https://docs.microsoft.com/microsoft-edge/f12-devtools-guide/network).

Remember to keep a record of results before you make changes. For network requests, that can be as
simple as a screenshot — you can also
[save profile data](/web/tools/chrome-devtools/evaluate-performance/timeline-tool#save_and_load_recordings) as a JSON file. There's more information below about [how to save and share test results](#save-the-results).

Before you begin auditing network usage, make sure to
[disable the browser cache](/web/tools/chrome-devtools/network-performance/#emulate)
to ensure you get accurate statistics for first-load performance. If you already do caching via a
service worker,
[clear Cache API storage](/web/tools/chrome-devtools/progressive-web-apps).
You may want to use an Incognito (Private) window, so that you don't have to worry about disabling
the browser cache or removing previously cached entries.

Here are some core features and metrics you should check with browser tools:

- Load performance: [Lighthouse](/web/tools/lighthouse/#devtools)
  provides a summary of load metrics. Addy Osmani has written a great summary of [key user moments](https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-2-page-load-performance-33b932d97cf2)
  for page load.
- [Timeline events](/web/tools/chrome-devtools/evaluate-performance/timeline-tool)
  for loading and parsing resources, and memory usage. If you want to go deeper, run memory and
  JavaScript [profiling](/web/tools/chrome-devtools/evaluate-performance/timeline-tool#profile-js).
- Total page weight and number of files.
- Number and weight of JavaScript files.
- Any particularly large individual JavaScript files (over, say, 100KB).
- Unused JavaScript. You can check using the Chrome
  [coverage tool](/web/updates/2017/04/devtools-release-notes).
- Total number and weight of image files.
- Any particularly large individual image files.
- Image formats: are there
  [PNGs that could be JPEGs or SVGs](/web/fundamentals/performance/optimizing-content-efficiency/image-optimization)? Is WebP used with fallbacks?
- Whether responsive image techniques (such as
  [srcset](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/))
  are used.
- HTML file size.
- Total number and weight of CSS files.
- Unused CSS. (In Chrome, use the
  [coverage panel](https://umaar.com/dev-tips/121-css-coverage/).)
- Check for problematic usage of other assets such as Web Fonts (including icon fonts).
- Check the DevTools timeline for anything that blocks page load.

If you're working from fast wifi or a fast cellular connection, test with [low bandwidth and high
latency emulation](/web/tools/chrome-devtools/network-performance/network-conditions).
Remember to test on mobile as well as desktop — some sites use UA sniffing to deliver different
assets and layouts for different devices. You may need to test on actual hardware using
[remote debugging](/web/tools/chrome-devtools/remote-debugging/),
not just with device simulation.

{% Aside %}

**You can often use browser tools to spot problems simply by checking network responses and ordering by size.**

For example: the 349KB PNG here looked like it could be a problem:

<figure>
{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/ajIej5qg2qPKZGnwgbyk.png", alt="Chrome DevTools Network panel showing a large file", width="479", height="242" %}
</figure>

Sure enough, it turned out the image was 1600px wide, whereas the maximum display width of the
element was only 400px. Decompressed, the image needed over 4MB of memory, which is a lot on a
mobile phone.

Resaving the image as an 800px wide JPEG (to cope with 400px display width on 2x screens) and
optimizing with [ImageOptim](https://imageoptim.com/) resulted in a 17KB file:
compare the [original PNG](https://drive.google.com/open?id=0B9xlQg9Xpugsb0VpQldsN3YwSEE) with the [optimized JPEG](https://drive.google.com/open?id=0B9xlQg9XpugsTlBVNlQ1bUdQa0U).</p>

That's a 95% improvement!

{% endAside %}

## Check memory and CPU load

Before you make changes, keep a record of memory and CPU usage.

In Chrome you can access the Task Manager from the Window menu. This is a simple way to check a
web page's requirements.

<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/BwWPMsK66mrAbfewiEpA.png", alt="Chrome Task Manager showing memory and CPU usage for
  the four open browser tabs", width="655", height="278" %}
  <figcaption>Chrome's Task Manager — watch out for memory and CPU hogs!</figcaption>
</figure>

## Test first and subsequent load performance

[Lighthouse](/web/tools/lighthouse/),
[WebPagetest](https://www.webpagetest.org/easy) and
[Pagespeed Insights](https://developers.google.com/speed/pagespeed/insights/) are useful for analyzing speed, data cost and resource usage. WebPagetest will also check static-content
caching, time to first byte, and if your site makes effective use of CDNs.

{% Aside %}

**It's simple to enable static-content caching so browsers can cache assets the first
time they're requested, by configuring your server to include appropriate headers.**

If a browser can cache resources, it won't need to retrieve them from the network on subsequent
visits. This improves load speed, cuts data cost and reduces network and server load — even for
browsers that don't support caching via a service worker.
[Even if you're using the Cache API](https://jakearchibald.com/2016/caching-best-practices/) it's important to enable browser caching.

To find out more, take a look at [PageSpeed Tools](https://developers.google.com/speed/docs/insights/LeverageBrowserCaching) and the resources on [Web Fundamentals](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) (in particular, the 'Invalidating and updating cached responses' section).

{% endAside %}

## Save the results

- **WebPagetest**: [test results each have their own URL](https://www.webpagetest.org/result/170428_NW_cc5afd75a2041f7e09984f33e4a4ae14/).
- **Pagespeed Insights**: the [online](https://developers.google.com/speed/pagespeed/insights)
  Pagespeed Insights tool [now includes Chrome User Experience report data](https://webmasters.googleblog.com/2018/01/real-world-data-in-pagespeed-insights.html?m=1)
  highlighting real-world performance stats.
- **Lighthouse**: save reports from the Chrome DevTools Audit panel by clicking on the
download button:
<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/fcXsYtUzSNLnYZgZAwQN.png", alt="Chrome Lighthouse button for downloading reports", width="800", height="225" %}
</figure>

## Test for core Progressive Web App requirements

[Lighthouse](/web/tools/lighthouse/) helps you test security,
functionality, accessibility, performance and search engine performance. In particular, Lighthouse
checks if your site successfully implements PWA features such as service workers and a Web App manifest.

Lighthouse also tests whether your site can provide an acceptable offline experience.

You can download a Lighthouse report as JSON or, if you're using the
[Lighthouse Chrome Extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk),
share the report as a GitHub Gist: click on the share button, select Open in Viewer, then click on
the share button again in the new window and Save as Gist.

<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/pKYiZ9JL0bI1FfqUkC2u.png", alt="Screenshot showing how to export a Chrome Lighthouse
  report as a gist", width="800", height="346" %}
  <figcaption>Export a report to a gist from the Lighthouse Chrome Extension — click the share button</figcaption>
</figure>

## Use analytics, event tracking and business metrics to track real-world performance

If you can, keep a record of analytics data before you implement changes: bounce rates, time on
page, exit pages: whatever's relevant to your business requirements.

If possible, record business and technical metrics that might be affected, so you can compare
results after making changes. For example: an e-commerce site might track orders-per-minute or
record stats for stress and endurance testing. Back-end storage costs, CPU requirements, serving
costs and resilience are likely to improve if you cut page weight and resource requests.

If analytics aren't implemented, now is the time! Business metrics and analytics are the final
arbiter of whether or not your site is working. If appropriate, incorporate
[event tracking](/analytics/devguides/collection/analyticsjs/events)
for user actions such as button clicks and video plays. You may also want to implement
[goal flow analysis](https://support.google.com/analytics/answer/2520139?ref_topic=1649581):
the paths by which your users navigate towards 'conversions'.

You can keep an eye on Google Analytics
[Site Speed](https://support.google.com/analytics/answer/1205784) to check how
performance metrics correlate with business metrics. For example: 'how fast did the homepage load?'
compared to 'did entry via the home page result in a sale?'

<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/jw1eTOeLv1S7jqrgQxlU.png", alt="Screenshot showing Google Analytics Site Speed", width="800", height="417" %}
</figure>

Google Analytics uses data from the
[Navigation Timing API](https://developer.mozilla.org/docs/Web/API/Navigation_timing_API).

You may want to record data using one of the
[JavaScript performance APIs](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)
or your own metrics, for example:

```js
    const subscribeBtn = document.querySelector('#subscribe');

    subscribeBtn.addEventListener('click', (event) => {
     // Event listener logic goes here...

     const lag = performance.now() - event.timeStamp;
     if (lag > 100) {
      ga('send', 'event', {
       eventCategory: 'Performance Metric'
       eventAction: 'input-latency',
       eventLabel: '#subscribe:click',
       eventValue: Math.round(lag),
       nonInteraction: true,
      });
     }
    });
```

You can also use ReportingObserver to check for browser deprecation and intervention warnings.
This is one of [many APIs for getting real-world, live measurements from actual users](/web/updates/2018/07/reportingobserver).

## Real-world experience: screen and video recording

Make a video recording of page load on mobile and desktop. This works even better at high frame
rates and if you add a timer display.

You may also want to save screencasts. There are many screencast recording apps for Android, iOS,
and desktop platforms (and
[scripts to do the same](https://paul.kinlan.me/android-screen-recording/)).

Video-recording page load works much like the
[filmstrip view](http://www.webpagetest.org/video/compare.php?tests=170427_61_14ZR-r:1-c:0) in
WebPagetest or
[Capture Screenshots](/web/updates/2015/07/devtools-digest-film-strip-and-a-new-home-for-throttling)
in Chrome DevTools. You get a real-world record of page component load speed: what's fast and what's
slow. Save video recordings and screencasts to compare against later improvements.

A side-by-side before-and-after comparison can be a great way to demonstrate improvements!

## What else?

If relevant, get a [Web Bloat Score](http://www.webbloatscore.com/). This is a fun
test, but it can also be a compelling way to demonstrate code bloat — or to show you've
made improvements.

[What Does My Site Cost?](https://whatdoesmysitecost.com/test/170427_KK_6aecf8c8a21c22e9f59b2b65e8371569#gniCost),
shown below, gives a rough guide to the financial cost of loading your site in different regions.

<figure>
  {% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/GzHcuWgCpknwNSMlj3A7.png", alt="Screenshot from whatdoesmysitecost.com", width="800", height="586" %}
</figure>

Many other standalone and online tools are available: take a look at
[perf.rocks/tools](http://perf.rocks/tools).

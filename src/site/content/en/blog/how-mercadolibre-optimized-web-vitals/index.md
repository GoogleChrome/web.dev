---
layout: post
title: How Mercado Libre optimized for Web Vitals (TBT/FID)
subhead: Optimizing interactivity of product details pages for a 90% reduction in Max Potential FID in Lighthouse and a 9% improvement in FID in Chrome User Experience Report.
authors:
  - demianrenzulli
  - aranhacarlos
  - joanbaca
date: 2020-09-21
hero: image/admin/YTkCg2CmNZVG1djjVnvu.jpg
thumbnail: image/admin/dSiMshQ9MRT9zgDybdmJ.jpg
description: Summary of the work done by Mercado Libre's frontend architecture team to optimize FID, using TBT as a proxy metric.
tags:
  - blog
  - performance
  - web-vitals
  - case-study
  - lighthouse
  - chrome-ux-report
  - javascript
---

Mercado Libre is the largest e-commerce and payments ecosystem in Latin America. It is present in 18
countries and is a market leader in Brazil, Mexico, and Argentina (based on unique visitors and
pageviews).

Web performance has been a focus for the company for a long time, but they recently formed a team to
monitor performance and apply optimizations across different parts of the site.

This article summarizes the work done by [Guille Paz](https://twitter.com/pazguille), [Pablo
Carminatti](https://www.linkedin.com/in/pcarminatti/), and [Oleh
Burkhay](https://twitter.com/oburkhay) from Mercado Libre's frontend architecture team to optimize
one of the Core Web Vitals: [First Input Delay (FID)](/fid/) and its lab proxy,
[Total Blocking Time (TBT)](/tbt/).

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">90<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Reduction in Max Potential FID in Lighthouse</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">9<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">More users perceiving FID as "Fast" in CrUX</p>
  </div>
</div>

## Long tasks, First Input Delay, and Total Blocking Time

Running expensive JavaScript code can lead to [long tasks](/long-tasks-devtools/),
which are those that run for more than **50ms** in the browser's main thread.

FID (First Input Delay) measures the time from when a user first interacts with a page (e.g. when
they click on a link) to the time when the browser is actually able to begin processing event
handlers in response to that interaction. A site that executes expensive JavaScript code will likely
have several long tasks, which will end up negatively impacting FID.

To provide a good user experience, sites should strive to have a First Input Delay of less than 100
milliseconds:

<picture>
  <source srcset="../vitals/fid_8x2.svg" media="(min-width: 640px)">
  <img class="w-screenshot w-screenshot--filled"
      src="../vitals/fid_4x3.svg"
      alt="Good fid values are 2.5 seconds, poor values are greater than 4.0
            seconds and anything in between needs improvement">
</picture>

While Mercado Libre's site was performing well in most sections, they found in the [Chrome User
Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report) that
product detail pages had a poor FID. Based on that information, they decided to focus their efforts
on improving the interactivity for product pages in the site.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gg8ohXTbFgr6Msacklt0.png", alt="Mobile and Desktop versions of a Mercado Libre product detail page.", width="800", height="346", class="w-screenshot" %}
   <figcaption class="w-figcaption">
      Mobile and Desktop versions of a Mercado Libre product detail page.
  </figcaption>
</figure>

These pages allow the user to perform complex interactions, so the goal was interactivity
optimization, without interfering with valuable functionality.

## Measure interactivity of product detail pages

FID requires a real user and thus cannot be measured in the lab. However, the [Total Blocking Time
(TBT)](/tbt/) metric is lab-measurable, correlates well with FID in the field, and
also captures issues that affect interactivity.

In the following trace, for example, while the **total time** spent running tasks on the main thread
is 560 ms, only 345 ms of that time is considered **total blocking time** (the sum of the portions
of each task that exceeds 50ms):

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/us8USZRiCh9sg1X2zEpN.svg", alt="A tasks timeline on the main thread showing blocking time", width="800", height="156", linkTo=true %}

Mercado Libre took TBT as a proxy metric in the lab, in order to measure and improve the
interactivity of product detail pages in the real world.

Here's the general approach they took:

- Use [WebPageTest](https://www.webpagetest.org/) to determine exactly which scripts were keeping
  the main thread busy on a real device.
- Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to determine the impact of
  the changes in [Max Potential First Input Delay (Max Potential
  FID)](/lighthouse-max-potential-fid/).

{% Aside %} During this project Mercado Libre used [Max Potential
FID](/lighthouse-max-potential-fid/) in Lighthouse because that was the tool's main
metric for measuring interactivity at that time. Lighthouse now recommends using [Total Blocking
Time](/tbt/) instead. {% endAside %}

## Use WebPageTest to visualize long tasks

WebPageTest (WPT) is a web performance tool that allows you to run tests on real devices in
different locations around the world.

Mercado Libre used WPT to reproduce the experience of their users by choosing a device type and
location similar to real users. Specifically, they chose a **Moto 4G device** and **Dulles,
Virginia**, because they wanted to approximate the experience of Mercado Libre users in Mexico. By
observing the main thread view of WPT, Mercado Libre found that there were several consecutive long
tasks blocking the main thread for 2 seconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/NbVmhDK9MLvyvEBbBYAZ.png", alt="Main thread view of Mercado Libre's product detail pages.", width="800", height="188", class="w-screenshot" %}
   <figcaption class="w-figcaption">
      Main thread view of Mercado Libre's product detail pages.
  </figcaption>
</figure>

Analyzing the corresponding waterfall they found that a considerable part of those two seconds came
from their analytics module. The main bundle size of the application was large (950KB) and took a
long time to parse, compile, and execute.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7QHKOutyGzfXN52hPOOz.png", alt="Waterfall view of product detail pages.", width="800", height="363", class="w-screenshot" %}
   <figcaption class="w-figcaption">
      Waterfall view of Mercado Libre's product detail pages.
  </figcaption>
</figure>

## Use Lighthouse to determine Max Potential FID

Lighthouse doesn't allow you to choose between different devices and locations, but it's a very
useful tool for diagnosing sites and obtaining performance recommendations.

When running Lighthouse on product detail pages, Mercado Libre found that the **Max Potential FID**
was the only metric marked in red, with a value of **1710ms**.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rufTQY4scq1V3ghVIQPy.png", alt="Lighthouse metrics in a PSI report for Mercado Libre's product detail pages.", width="800", height="235" %}
</figure>

Based on this, Mercado Libre set a goal to improve their Max Potential FID score in a laboratory
tool like Lighthouse and WebPageTest, under the assumption that these improvements would affect
their real users, and therefore, show up in real user monitoring tools like the Chrome User
Experience Report.

## Optimize long tasks

### First iteration

Based on the main thread trace, Mercado Libre set the goal of optimizing the two modules that were
running expensive code.

They started optimizing the performance of the internal tracking module. This module contained a
CPU-heavy task that wasn't critical for the module to work, and therefore could be safely removed.
This led to a 2% reduction in JavaScript for the whole site.

After that they started to work on **improving the general bundle size**:

Mercado Libre used
[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) to detect
opportunities for optimization:

- Initially they were requiring the full [Lodash module](https://lodash.com/). This was replaced
  with a [per-method require](https://lodash.com/per-method-packages) to load only a subset of
  Lodash instead of the whole library, and used in conjunction with
  [lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin) to shrink Lodash even
  further.

They also applied the following [Babel](https://babeljs.io/) optimizations:

- Using [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
  to reuse Babel's helpers throughout the code, and reduce the size of the bundle considerably.
- Using
  [babel-plugin-search-and-replace](https://github.com/jean-smaug/babel-plugin-search-and-replace#readme)
  to replace tokens at build time, in order to remove a large configuration file inside the main
  bundle.
- Adding
  [babel-plugin-transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types#readme)
  to save some extra bytes by removing the prop types.

As a result of these optimizations, the bundle size was reduced **by approximately 16%**.

## Measure impact

The changes lowered Mercado Libre's consecutive long tasks **from two seconds to one second**:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/17At96aKcPrvNTWgb3FU.png", alt="Main thread view of Mercado Libre's product detail pages after first round of optimizations.", width="800", height="315", class="w-screenshot" %}
   <figcaption class="w-figcaption">
      In the top waterfall of WPT there’s a long red bar (in the <b>Page is Interactive</b> row) between seconds 3 and 5. In the bottom waterfall, the bar has been broken into smaller pieces, occupying the main thread for shorter periods of time.
  </figcaption>
</figure>

Lighthouse showed a **57% reduction** in Max Potential First Input Delay:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Sxa1wKCXVfsHZNbfQ1ZZ.png", alt="Lighthouse metrics in a PSI report for Mercado Libre's product detail pages after first round of optimizations.", width="800", height="252" %}
</figure>

## Second iteration

The team continued digging into long tasks in order to find subsequent improvements.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tlMIQRWDAeEY7UV4cFQo.png", alt="Detailed view of main thread view of Mercado Libre's product detail pages after first round of optimizations.", width="800", height="259", class="w-screenshot" %}
   <figcaption class="w-figcaption">
      The Waterfall (not pictured) helped Mercado Libre identify which libraries were using the main thread heavily (<b>Browser Main Thread</b> row) and the <b>Page is Interactive</b> row clearly shows that this main thread activity is blocking interactivity.
  </figcaption>
</figure>

Based on that information they decided to implement the following changes:

- Continue reducing the main bundle size to optimize compile and parse time (e.g. by removing
  duplicate dependencies throughout the different modules).
- Apply [code splitting](/reduce-javascript-payloads-with-code-splitting/) at
  component level, to divide JavaScript in smaller chunks and allow for smarter loading of the
  different components.
- Defer [component
  hydration](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#rehydration) to
  allow for a smarter use of the main thread. This technique is commonly referred to as [partial
  hydration](https://addyosmani.com/blog/rehydration/).

## Measure impact

The resulting WebPageTest trace showed even smaller chunks of JS execution:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gAvo2VXimablQ8OhFDdn.png", alt="Main thread view of Mercado Libre's product detail pages after secoond round of optimizations.", width="800", height="150", class="w-screenshot" %}
</figure>

And their Max Potential FID time in Lighthouse was reduced **by an additional 60%**:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7W672LOor2SgqZsmK3BL.png", alt="Lighthouse metrics in a PSI report for Mercado Libre's product detail pages after first round of optimizations.", width="800", height="345", class="w-screenshot" %}
</figure>

## Visualize progress for real users

While laboratory testing tools like WebPageTest and Lighthouse are great for iterating on solutions
during development, the true goal is to improve the experience for real users.

The [Chrome User Experience
Report](https://developers.google.com/web/tools/chrome-user-experience-report) provides user
experience metrics for how real-world Chrome users experience popular destinations on the web. The
data from the report can be obtained by [running queries in
BigQuery](/chrome-ux-report-bigquery/),
[PageSpeedInsights](https://developers.google.com/speed/pagespeed/insights/), or the [CrUX
API](/chrome-ux-report-api/).

The [CrUX
dashboard](https://datastudio.google.com/c/datasources/create?connectorId=AKfycbxk7u2UtsqzgaA7I0bvkaJbBPannEx0_zmeCsGh9bBZy7wFMLrQ8x24WxpBzk_ln2i7)
is an easy way to visualize the progress of core metrics:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3bUj9l2ISMr3mojaUG4o.png", alt=".", width="800", height="163" %}
    <figcaption class="w-figcaption">
      Mercado Libre's FID progress between Jan 2020 and April 2020. Before the optimization project, 82% of the users were perceiving FID as fast (below 100ms). After, more than 91% of the users were perceiving the metric as fast.
    </figcaption>
</figure>

## Next steps

Web performance is never a finished task, and Mercado Libre understands the value these
optimizations bring to their users. While they continue applying several optimizations across the
site, including [prefetching](/instant-navigation-experiences/#production-cases) in
product listing pages, image optimizations, and others, they continue adding improvements to product
listing pages to reduce Total Blocking Time (TBT), and by proxy FID, even more. These optimizations
include:

- Iterating on the code splitting solution.
- Improving the execution of third-party scripts.
- Continuing improvements in asset bundling at the bundler level
  ([webpack](https://webpack.js.org/)).

Mercado Libre has a holistic view of performance, so while they continue optimizing interactivity in
the site, they have also started assessing opportunities for improvement on the other two current
[Core Web Vitals](/vitals/): [LCP (Largest Contentful Paint)](/lcp/)
and [CLS (Cumulative Layout Shift)](/cls/) even more.

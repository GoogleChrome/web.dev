---
layout: post
title: Your first performance budget
authors:
  - mihajlija
description: |
  Ensure your site loads fast with a step-by-step guide to defining thresholds
  for performance metrics that are meaningful for your site.
date: 2018-11-05
tags:
  - performance
---

When you set a personal, business or family budget, you are setting a limit to your spending and making sure you stay within it. [Performance budgets](/performance-budgets-101) work in the same way, but for metrics that affect website performance.

With a performance budget established and enforced you can be sure that your site will render as quickly as possible. This will provide a better experience for your visitors and positively impact business metrics.

Here's how to define your first performance budget in a few simple steps.

## Preliminary analysis

If you are trying to improve the performance of an existing site, start by identifying the most important pages. For example, these could be pages that have the highest amount of user traffic or a product landing page.

After you identify your key pages, it's time to analyze them. First, we'll focus on the timing milestones that best measure the user experience.

Under the Audits panel in Chrome DevTools, you'll find [Lighthouse](https://developers.google.com/web/tools/lighthouse/). Run audits on each page in a [Guest window](https://support.google.com/chrome/answer/6130773?co=GENIE.Platform%3DDesktop&hl=en) to record these two times:

* [First Contentful Paint (FCP)](/first-contentful-paint)
* [Time to Interactive (TTI)](/interactive)

{% Aside %}
Using a Guest window gives you a clean testing environment without any Chrome
extensions that could interfere with the audit.
{% endAside %}

{% Img src="image/admin/VUtkCadH9vjnKSzGzd0S.png", alt="Lighthouse panel in Chrome DevTools", width="800", height="637" %}

Let's take a highly specialized search engine, doggos.io, as an example. Doggos.io aims to index all dog-related things on the internet, and its most important pages are the home and results pages. Here are the FCP and TTI numbers measured for the site on desktop and mobile.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Desktop</th>
        <th>FCP</th>
        <th>TTI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Homepage</td>
        <td>1,680 ms</td>
        <td>5,550 ms</td>
      </tr>
      <tr>
        <td>Results page</td>
        <td>2,060 ms</td>
        <td>6,690 ms</td>
      </tr>
    </tbody>
    <caption>Desktop analysis of doggos.io</caption>
  </table>
</div>

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Mobile</th>
        <th>FCP</th>
        <th>TTI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Homepage</td>
        <td>1,800 ms</td>
        <td>6,150 ms</td>
      </tr>
      <tr>
        <td>Results page</td>
        <td>1,100 ms</td>
        <td>7,870 ms</td>
      </tr>
    </tbody>
    <caption>Mobile analysis of doggos.io</caption>
  </table>
</div>

## Competitive analysis

Once you've analyzed your own site, it's time to analyze your competitors' sites. Comparing results from websites similar to yours is a great way to figure out a performance budget. Whether you are working on an established project or starting from scratch, this is an important step. You get competitive advantage when you are faster than your competitors.

If you are not sure which sites to look at, here are a few tools to try:

1. Google search's "related:" keyword
2. [Alexa's similar sites](https://www.alexa.com/find-similar-sites) feature
3. [SimilarWeb](https://www.similarweb.com)

{% Img src="image/admin/EzpGvSgVJYC2y3rsnHRk.png", alt="Screenshot of Google search with the related keyword", width="775", height="336", class="w-screenshot" %}


For a realistic picture, try to **find 10 or so competitors**.

### Budget for timing milestones

Our niche search engine in this example has a handful of competitors and we'll focus on optimizing the homepage for mobile devices. Over [half of the internet traffic](https://www.statista.com/statistics/277125/share-of-website-traffic-coming-from-mobile-devices/) today happens on mobile networks and using mobile numbers as default will benefit not only your mobile users, but your desktop users as well.

Create a chart with FCP and TTI times for all the similar websites and highlight the fastest in the bunch. A chart like this one gives you a clearer picture of how your website is doing compared to the competition.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Site/Homepage</th>
        <th>FCP</th>
        <th>TTI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>goggles.com</td>
        <td bgcolor="yellow"><strong>880 ms</strong></td>
        <td bgcolor="yellow"><strong>3,150 ms<strong></td>
      </tr>
      <tr>
        <td>doggos.io</td>
        <td>1,800 ms</td>
        <td>6,500 ms</td>
      </tr>
      <tr>
        <td>quackquackgo.com</td>
        <td>2,680 ms</td>
        <td>4,740 ms</td>
      </tr>
      <tr>
        <td>ding.xyz</td>
        <td>2,420 ms</td>
        <td>7,040 ms</td>
      </tr>
    </tbody>
    <caption>Competitive analysis of doggos.io on 3G network</caption>
  </table>
</div>

<figure>
  {% Img src="image/admin/Mfzr0dmMxHij9KrJraHD.jpg", alt="Doggo at a computer", width="800", height="600", class="w-screenshot" %}
  <figcaption>
    Doggos.io seems to be doing okay on the FCP metric but seriously lagging behind in TTI
  </figcaption>
</figure>


There's room for improvement and a good guideline for that is the [20% rule](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/#the-need-for-performance-optimization-the-20-rule). Research states that users recognize a difference in response times when it's greater than 20%. This means that if you want to be noticeably better than the best comparable site, you have to **be at least 20% faster**.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Measure</th>
        <th>Current time</th>
        <th>Budget (20% faster than competition)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FCP</td>
        <td>1,800 ms</td>
        <td>704 ms</td>
      </tr>
      <tr>
        <td>TTI</td>
        <td>6,500 ms</td>
        <td>2,520 ms</td>
      </tr>
    </tbody>
    <caption>Performance budget that would get doggos.com ahead of the competition</caption>
  </table>
</div>

If you are trying to optimize an existing site that goal may seem impossible to reach. This is not a sign for you to give up. Start with small steps and set a budget at 20% faster than your current speed. Keep optimizing from there.

For doggos.io, a revised budget could look like this.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Measure</th>
        <th>Current time</th>
        <th>Initial budget
    (20% faster than the current time)</th>
        <th>Long-term goal
    (20% faster than competition)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FCP</td>
        <td>1,800 ms</td>
        <td>1,440 ms</td>
        <td>704 ms</td>
      </tr>
      <tr>
        <td>TTI</td>
        <td>6,500 ms</td>
        <td>5,200 ms</td>
        <td>2,520 ms</td>
      </tr>
    </tbody>
    <caption>Revised doggos.io performance budget</caption>
  </table>
</div>

## Combine different metrics

A solid performance budget combines different types of metrics. We've already defined the budget for milestone timings and now we'll add two more to the mix:

* quantity-based metrics
* rule-based metrics

### Budget for quantity-based metrics

Whatever total page weight number you come up with, try to **deliver** under 170 KB of **[critical-path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) resources** (compressed/minified). This guarantees your website will be fast even on [inexpensive devices and slow 3G](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/).

You can have a bigger budget for the desktop experience, but don't go wild. The median page weight on both desktop and mobile is over 1MB according to the [HTTP Archive](https://httparchive.org/reports/page-weight) data for the last year. To get a performant website you have to aim well below these median numbers.

Here are a few examples based on TTI budgets:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Network</th>
        <th>Device</th>
        <th>JS</th>
        <th>Images</th>
        <th>CSS</th>
        <th>HTML</th>
        <th>Fonts</th>
        <th>Total</th>
        <th>Time to Interactive budget</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Slow 3G</td>
        <td>Moto G4</td>
        <td>100</td>
        <td>30</td>
        <td>10</td>
        <td>10</td>
        <td>20</td>
        <td>~170 KB</td>
        <td>5s</td>
      </tr>
      <tr>
        <td>Slow 4G</td>
        <td>Moto G4</td>
        <td>200</td>
        <td>50</td>
        <td>35</td>
        <td>30</td>
        <td>30</td>
        <td>~345 KB</td>
        <td>3s</td>
      </tr>
      <tr>
        <td>WiFi</td>
        <td>Desktop</td>
        <td>300</td>
        <td>250</td>
        <td>50</td>
        <td>50</td>
        <td>100</td>
        <td>~750 KB</td>
        <td>2s</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
  The recommended sizes are for the critical-path resources.
{% endAside %}

Defining a budget based on quantity metrics is a tricky business. An e-commerce website with loads of product photos is very different from a news portal which is mostly text. If you have ads or analytics on your site, that increases the amount of JavaScript you're shipping.

Use the table above as a starting point and adjust based on the type of content you are working with. Define what your pages will include, review your research and take an educated guess for individual asset sizes. For example, if you are building a website with a lot of images, put stricter limits to JS size.

Once you have a working website, check how you are doing on user-centric performance metrics and adjust your budget.

### Budget for rule-based metrics

Very effective rule-based metrics are [Lighthouse](https://developers.google.com/web/tools/lighthouse/) scores. Lighthouse grades your app in 5 categories and one of those is performance. Performance scores are calculated based on [5 different metrics](https://developers.google.com/web/tools/lighthouse/scoring#perf-audits), including First Contentful Paint and Time to Interactive.

When you try to build a great site, **set Lighthouse performance score budget to at least 85 (out of 100)**. Use [Lighthouse CI](https://github.com/ebidel/lighthouse-ci) to enforce it on pull-requests.

## Prioritize

Ask yourself what level of interaction you expect on your site. If it's a news website, users' primary goal is to read content so you should focus on rendering quickly and keeping FCP low. Doggos.com visitors want to click on relevant links as soon as possible, so the top priority is low TTI.

Find out exactly what part of your audience browses on desktop vs. on mobile devices and prioritize accordingly. One way to figure this out is to check what your audience is doing on competitors' websites, through the [Chrome User Experience report](https://developers.google.com/web/updates/2018/08/chrome-ux-report-dashboard) dashboard.

<figure class="w-figure">
  {% Img src="image/admin/ycZwOrFNzjdjquriM9rJ.png", alt="Device distribution data from Chrome User Experience report", width="800", height="530" %}
  <figcaption class="w-figcaption">
    Device distribution data from Chrome User Experience report
  </figcaption>
</figure>

## Next steps

Make sure your performance budget is enforced throughout the project and incorporate it into your build process.

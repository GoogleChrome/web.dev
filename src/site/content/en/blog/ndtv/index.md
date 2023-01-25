---
title: NDTV achieved a 55% improvement in LCP by optimizing for Core Web Vitals
subhead: >
  NDTV enhanced user experience and thus retention by optimizing for Web Vitals.
date: 2020-10-27
updated: 2020-10-28
hero: image/admin/55a7gPUzz2ORKgMIfodA.png
thumbnail: image/admin/56g0OKl7nSua44OGsd7l.png
alt: An illustration of icons related to website performance and the text 'scale on web' and 'NDTV'.
description: >
  Using tools like PageSpeed Insights , web.dev/measure, and WebPageTest,
  the NDTV team analyzed potential improvement areas and invested in Core Web Vitals
  to achieve business success.
tags:
  - blog
  - case-study
  - performance
  - web-vitals
  - scale-on-web
---

[NDTV](https://ndtv.com) is one of India's leading news stations and websites. By following the [Web
Vitals](/vitals/) program, they improved one of their most important user metrics,
[Largest Contentful Paint](/lcp/) (LCP), by 55% in just a month. This was correlated
with a 50% reduction in bounce rates.

{% Aside %}
  NDTV made other product changes while they optimized for Web Vitals
  so it is not possible to conclusively say that optimizing for Web Vitals was
  the only cause of the bounce rate reduction.
{% endAside %}

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">55<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Improvement in LCP</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">50<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Reduction in bounce rates</p>
  </div>
</div>

## Highlighting the opportunity

With close to 200M unique users every month, it was critical for NDTV to optimize for quality of
user experience. Although their engagement rates were well over industry average and the highest
amongst their peers, the NDTV team still saw room for improvement and decided to invest in Web
Vitals along with other product changes to further improve their engagement rates.

## The approach they used

With the help of tools like [PageSpeed
Insights](/chrome-ux-report-pagespeed-insights/),
[web.dev/measure](/measure), and [WebPageTest](https://www.webpagetest.org/) the NDTV
team analyzed potential improvement areas on the site. These clearly defined optimization ideas
helped them re-prioritize high-impact tasks and achieve immediate results in the improvement of Core
Web Vitals. Optimizations included:

<div class="w-columns">
  <ul>
    <li>
      <b>Prioritizing the largest content block</b> by
      <a href="/efficiently-load-third-party-javascript/#use-async-or-defer">delaying third-party requests</a>,
      including ad calls for below-the-fold ad slots, and social network embeds, which are also
      below-the-fold.
    </li>
    <li>
      <b>Increasing the <a href="/uses-long-cache-ttl/">caching</a></b> of static content from a
      few minutes to 30 days.
    </li>
    <li>
      <b>Using <a href="/avoid-invisible-text/"><code>font-display</code></a></b>
      to display text sooner while fonts are downloaded.
    </li>
    <li>
      <b>Using vector graphics for icons</b> instead of TrueType Fonts (TTF).
    </li>
    <li>
      <b>Lazy loading
      <a href="/efficiently-load-third-party-javascript/#lazy-load-third-party-resources">JavaScript</a>
      and <a href="https://css-tricks.com/native-lazy-loading/">CSS</a></b>: loading the page with the minimum
      possible JS and CSS and then lazy loading the remaining JS and CSS on page scroll.
    </li>
    <li>
      <b><a href="/uses-rel-preconnect/">Preconnecting</a></b> to origins delivering critical assets.
    </li>
  </ul>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/h8k2D4AqsGbeDtpjsfNe.png", alt="A summary of the optimizations: Largest Contentful Paint, Caching, CSS, vector graphics, lazily loaded JS and CSS, preconnecting.", width="800", height="920", class="w-screenshot" %}
  </figure>
</div>

## Impact

Web Vitals equipped the team with metric-driven signals to expedite the
process of improving user experience.

<div class="w-columns">
  <p>
    Before beginning the optimization project, the NDTV team benchmarked their LCP
    score at 3.0 seconds (for the 75th percentile of their users, based on
    <a href="/chrome-ux-report/">Chrome User Experience Report</a> field data).
    After the optimization project, it was down to 1.6 seconds.
    They also reduced their <a href="/cls">Cumulative Layout Shift</a> (CLS) score to
    0.05. Other metrics on WebPageTest like
    "<a href="/time-to-first-byte">First Byte Time</a>" and "Effective use of
    <a href="/content-delivery-networks/">CDN</a>" improved to an A grade.
  </p>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WSQ9ATmLBzHmNtTWBIf8.png", alt="0.05 CLS score.", width="800", height="370", class="w-screenshot" %}
  </figure>
</div>

{% Aside %}
  When optimizing your site, remember that it's important to not think of your
  metric scores as single values, but rather a distribution of field data values
  from real users. You'll want to make sure that the distribution overall is improving.
  See [Web Performance: Leveraging The Metrics That Most Affect UX](https://youtu.be/6Ljq-Jn-EgU?t=120)
  for more information.
{% endAside %}

## Return on investment

Despite the complexity and depth of [ndtv.com](https://ndtv.com), the site was
already achieving decent FID and CLS scores, thanks to the team's longstanding
focus on performance and UX best practices. To further improve their user
experience, the team focused on LCP and managed to meet the threshold within a
few weeks of kicking off their optimization work.

## Overall business results

<div class="w-columns">
  <ul>
    <li>55% improvement in LCP as a result of optimizing for Core Web Vitals.</li>
    <li>
      50% reduction in bounce rate on the website after optimizing for Core Web Vitals, along with
      other product changes.
    </li>
    <li>
      Increased engagement and consumption of content directly, and proportionally increased
      revenue for their website.
    </li>
  </ul>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lN46T0iOTj45lSOkE8mo.png", alt="55% improvement in LCP. 50% reduction in bounce rate. Increased engagement and consumption.", width="800", height="825", class="w-screenshot" %}
  </figure>
</div>

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">
    NDTV has long followed best practices to deliver a top-quality user experience. We consider
    measuring Web Vitals to be an integral part of our product development now, and the engagement
    uplift we've seen makes it a good ROI.
  </p>
  <cite>Kawaljit Singh Bedi, Chief Technology and Product Officer, NDTV Group</cite>
</blockquote>

Check out the [Scale on web case studies](/scale-on-web) page for more success
stories from India and Southeast Asia.

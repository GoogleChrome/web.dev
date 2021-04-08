---
title: How CLS optimizations increased Yahoo! JAPAN News's page views per session by 15%
subhead: >
  Optimizing CLS by 0.2 led to a 15% increase in page
  views per session, 13% longer session durations, and a 1.72
  percentage point decrease in bounce rate.
description: |
    Using Search Console and Lighthouse to monitor Core Web Vitals, they discovered
    opportunities for optimizing CLS score by 0.2 which led to 15% increase in page
    views per session, 13% longer session duration, and 1.72 percentage point
    decrease in bounce rate.
authors:
  - sisidovski
  - gladenjoy
  - mihajlija
date: 2021-03-09
updated: 2021-03-15
hero: image/iEYkFAI5LNQv7oLlIBv9DuB265a2/CT42V29q9DyjsktM03Wi.png
thumbnail: image/iEYkFAI5LNQv7oLlIBv9DuB265a2/SYCpuPDC7QTj1runSA2C.png
alt: 
tags:
  - blog
  - case-study
  - web-vitals
---

[Yahoo! JAPAN](https://www.yahoo.co.jp) is one of the largest media companies in Japan,
providing over 79 billion page views per month. Their news platform, [Yahoo!
JAPAN News](https://news.yahoo.co.jp) has more than 22 billion page views per
month and an engineering team dedicated to improving the user experience. 

By continuously monitoring Core Web Vitals (CWV), they correlated the site's
improved [Cumulative Layout Shift (CLS)](/cls) score with a 15%
increase in page views per session and 13% increase in session duration.


<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">0.2</p>
    <p class="w-stat__desc">CLS improvement</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">15.1<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">More page views per session</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">13.3<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Longer session duration</p>
  </div>
</div>

{% Aside `keyterm` %}  
[Cumulative Layout Shift](/cls) measures how visually stable a
website is—it helps quantify how often users experience unexpected layout
shifts.  
{% endAside %} 

Page content moving around unexpectedly often causes accidental clicks,
disorientation on the page, and ultimately user frustration. Frustrated users
tend not to stick around for long. To keep users happy, the page layout should
stay stable through the entire lifecycle of the user journey. For Yahoo! JAPAN
News this improvement had a significant positive impact on business critical
engagement metrics.

For technical details on how they improved the CLS, read the
[Yahoo! JAPAN News engineering team's post](https://techblog.yahoo.co.jp/entry/2021022230076263/).

## Identifying the issue

Monitoring Core Web Vitals, including CLS, is crucial in catching issues and
identifying where they're coming from. At Yahoo! JAPAN News, [Search
Console](https://search.google.com/search-console/about) provided a great
overview of groups of pages with performance issues and
[Lighthouse](/learn/#lighthouse) helped identify per-page
opportunities to improve page experience. Using these tools, they discovered
that the article detail page had poor CLS.

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/GhORGAous9gyou5yTmHj.png", alt="Google Search Console Core Web Vitals Report showing high CLS for article details page.", class="w-screenshot", width="800", height="719" %}
  <figcaption class="w-figcaption">
    Google Search Console Core Web Vitals Report.
  </figcaption>
</figure>

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/3YwmCzVBl78a9TdOKu90.png", alt="Lighthouse Avoid large layout shifts audit showing DOm elements that contribute the most to the CLS on the page.", class="w-screenshot", width="800", height="265" %}
  <figcaption class="w-figcaption">
    Lighthouse "Avoid large layout shifts" audit shows which elements are
    contributing to CLS score and how much.
  </figcaption>
</figure>

It's important to keep in mind the _cumulative_ part of the Cumulative Layout
Shift—the score is captured through the entire page lifecycle. In the
real-world, the score can include shifts that happen as a result of user
interactions such as scrolling a page or tapping a button. To collect CLS scores
from the [field
data](/how-to-measure-speed/#lab-data-vs-field-data), the team
integrated [web-vitals](https://github.com/GoogleChrome/web-vitals/) JavaScript
library reporting.

{% Aside %}  
As a part of performance monitoring strategy, they're also working on building
an internal tool with [Lighthouse CI](/lighthouse-ci/) to
continuously audit performance across businesses in the company.  
{% endAside %}

The team used Chrome DevTools to identify which elements were making layout
shifts on the page.
[Layout Shift Regions](https://developers.google.com/web/updates/2019/07/devtools)
in DevTools visualizes elements that contribute to CLS by highlighting them with
a blue rectangle whenever a layout shift happens. 

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/scvRgLxkZVQoGfOtjZ4z.png", alt="Article details page with blue rectangles overlayed on the hero image and the text.", class="w-screenshot", width="376", height="668" %}
  <figcaption class="w-figcaption">
    Visualized layout shifts.
  </figcaption>
</figure>

They figured out that a layout shift occurred after the hero image at the top of
the article was loaded for the first view. 

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/HdGiCh7O8ZhqcOkfVGEv.jpg", alt="Screenshots of the article details page showing side by side comparison before and after layout shift.", class="w-screenshot", width="798", height="455" %}
  <figcaption class="w-figcaption">
    Layout shift on the article detail page.
  </figcaption>
</figure>


In the example above, when the image finishes loading, the text gets pushed down
(the position change is indicated with the red line).

## Improving CLS for images

For fixed-size images, layout shifts can be prevented by specifying the `width`
and `height` attributes in the `img` element and using the CSS
[`aspect-ratio`](/aspect-ratio)
property available in modern browsers. However, Yahoo! JAPAN News needed to
support not only modern browsers, but also browsers installed in relatively old 
operating systems such as iOS 9.

They used [Aspect Ratio Boxes](https://css-tricks.com/aspect-ratio-boxes/)—a
method which uses markup to reserve the space on the page before the image is
loaded. This method requires knowing the aspect ratio of the image in advance,
which they were able to get from the backend API.

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/gUbS3jB6zMBZwEU3wmW6.jpg", alt="Screenshots of the article details page showing side by side comparison before and after CLS optimization.", class="w-screenshot", width="800", height="439" %}
  <figcaption class="w-figcaption">
    Left: reserved blank space for the image at the top of the page; right: the
    hero image loaded in the reserved space without layout shifts.
    </figcaption>
</figure>

## Results

The number of URLs with poor performance in Search Console decreased by 98% and
CLS in lab data decreased from about 0.2 to 0. More importantly, there were
several
[correlated improvements in business metrics](https://nicj.net/cumulative-layout-shift-in-the-real-world/).

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Q5pRaIvOgzb4tqgv5dWo.png", alt="Search Console report showing a significant drop in pages with performance issues.", class="w-screenshot", width="800", height="509" %}
  <figcaption class="w-figcaption">
    Search Console after improvements.
  </figcaption>
</figure>


{% Aside %}  
Search Console doesn't reflect improvements in real-time.  
{% endAside %}

When Yahoo! JAPAN News compared user engagement metrics before and after CLS
optimization, they saw multiple improvements:

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">15.1<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">More page views per session</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">13.3<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Longer session duration</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">1.72<sub class="w-stat__sub">%*</sub></p>
    <p class="w-stat__desc">Lower bounce rate (*percentage points)</p>
  </div>
</div>


By improving CLS and other Core Web Vitals metrics, Yahoo! JAPAN News also got
the
["Fast page" label](https://blog.chromium.org/2020/08/highlighting-great-user-experiences-on.html)
in the context menu of Chrome Android.

<figure class="w-figure">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/ivyeENjT9NKZLhdn9WJm.png", alt="Fast page label in Chrome on Android.", class="w-screenshot", width="400", height="600" %}
  <figcaption class="w-figcaption">
    "Fast page" label in Chrome on Android.
  </figcaption>
</figure>

Layout shifts are frustrating and discourage users from reading more pages, but
that can be improved by using the appropriate tools, identifying issues, and
applying best practices. Improving CLS is a chance to improve your business.

For more information, read the
[Yahoo! JAPAN engineering team's post](https://techblog.yahoo.co.jp/entry/2021022230076263/).

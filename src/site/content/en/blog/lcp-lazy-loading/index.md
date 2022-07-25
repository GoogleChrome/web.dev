---
layout: post
title: The performance effects of too much lazy-loading
subhead: Data-driven advice for lazy-loading images with Core Web Vitals in mind.
description: "Eagerly loading images within the initial viewport—while liberally lazy-loading the rest—can improve Web Vitals while loading fewer bytes."
authors:
  - rviscomi
  - felixarntz
date: 2021-07-15
updated: 2022-07-18
hero: image/STd8eW8CSiNp5B1bX0R6Dww2eH32/Hdl5V6rz7DOLmC7LkYaX.jpg
alt: Photograph of a prickly pear cactus, whose sharp thorns guard a succulent fruit.
tags:
  - blog
  - web-vitals
  - performance
  - images
---

Lazy-loading is a technique to defer downloading a resource until it's needed, which conserves data
and reduces network contention for critical assets. It became a web standard in
[2019](/browser-level-image-lazy-loading/) and today `loading="lazy"` for images is
[supported](https://caniuse.com/loading-lazy-attr) by most major browsers. That sounds great,
but is there such a thing as too much lazy loading?

This post summarizes how we analyzed publicly available web transparency data and ad hoc A/B testing
to understand the adoption and performance characteristics of native image lazy-loading. What we
found is that lazy-loading can be an amazingly effective tool for reducing unneeded image bytes, but
overuse can negatively affect performance. Concretely, our analysis shows that more eagerly
loading images within the initial viewport—while liberally lazy-loading the rest—can give us the
best of both worlds: fewer bytes loaded and improved [Core Web Vitals](/vitals/#core-web-vitals).

## Adoption

According to the most recent data in [HTTP Archive](https://httparchive.org/),
native image lazy-loading is used by [17%](https://httparchive.org/reports/state-of-images?start=2020_01_01&end=2021_06_01#imgLazy)
of websites and adoption is growing rapidly. This much of a foothold in the ecosystem is remarkable
for a relatively new API.

<figure>
  {% Img
    src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/9RDh3CEC9vb1jCjVAIIi.png",
    alt="Pie chart showing WordPress making up 84.1% of lazy-loading adoption, other CMSs 2.3%, and non-CMSs 13.5%.",
    width="800",
    height="491" %}
  <figcaption>
    Breakdown of the types of websites that make use of native image lazy-loading.
    <em>(<a href="https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-wp-cms-sql">Source</a>)</em>
  </figcaption>
</figure>

[Querying](https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-wp-cms-sql)
the raw data in the HTTP Archive project gives us a clearer understanding of what kinds of websites
are driving adoption: 84% of sites that use native image lazy-loading use WordPress, 2% use another
CMS, and the remaining 14% don't use a known CMS. These results make clear how
[WordPress is leading the charge](https://make.wordpress.org/core/2020/07/14/lazy-loading-images-in-5-5/)
in adoption.

<figure>
  {% Img
    src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/XgHvIF8JyybNZCNwXL35.png",
    alt="Timeseries chart of lazy-loading adoption with WordPress being the predominant player compared to other CMSs and non-CMSs, with similar proportions to the previous chart. Total adoption is shown to have rapidly increased from 1% to 17% from July 2020 to June 2021.",
    width="800",
    height="507" %}
  <figcaption>
    Breakdown of the types of websites that make use of native image lazy-loading.
    <em>(<a href="https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-wp-cms-timeseries-sql">Source</a>)</em>
  </figcaption>
</figure>

The
[rate of adoption](https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-wp-cms-timeseries-sql)
is also worth noting. One year ago in July 2020, WordPress sites that use lazy-loading made up tens
of thousands websites in the corpus of about 6 million (1% of total). Lazy-loading adoption in
WordPress alone has since grown to over 1 million websites (14% of total).

## Correlational performance

[Digging deeper](https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-crux-lcp-sql)
into HTTP Archive, we can compare how pages with and without native image lazy loading perform with
the [Largest Contentful Paint](/lcp/) (LCP) metric. The LCP data comes from real-user
experiences from the [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) (CrUX) as opposed to synthetic testing in the lab. The chart
below uses a box-and-whisker plot to visualize the distributions of each pages' 75th percentile LCP:
the lines represent the 10th and 90th percentiles and the boxes represent the 25th and 75th
percentiles.

<figure>
  {% Img
    src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/W8gsHQn1IjlRuAgnSizY.png",
    alt="Box and whisker chart showing the 10, 25, 75, and 90th percentiles for pages that do and do not use native image lazy-loading. Comparatively, the LCP distribution of pages that do not use it is faster than those that do.",
    width="800",
    height="488" %}
  <figcaption>
    Distribution of all pages' 75th percentile LCP experience, broken down by whether they use native image lazy-loading.
    <em>(<a href="https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-crux-lcp-sql">Source</a>)</em>
  </figcaption>
</figure>

The median page without lazy-loading has a 75th percentile LCP of 2,922 ms, compared to 3,546 ms for
the median page with lazy-loading. Overall, websites that use lazy-loading tend to have worse LCP
performance.

It's important to point out that these are _correlational_ results and they don't necessarily point
to lazy-loading as being the _cause_ of the slower performance. Hypothetically, if WordPress sites
tend to be a bit slower, and given how much they make up the lazy-loading cohort, that could explain
the difference. So let's try to eliminate that variability by looking only at WordPress sites.

<figure>
  {% Img
    src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/k1YlIULhqpx3CJV2OPYc.png",
    alt="Box and whisker chart showing the 10, 25, 75, and 90th percentiles for WordPress pages that do and do not use native image lazy-loading. Comparatively, the LCP distribution of pages that do not use it is faster than those that do, similar to the previous chart.",
    width="800",
    height="488" %}
  <figcaption>
    Distribution of WordPress pages' 75th percentile LCP experience, broken down by whether they use native image lazy-loading.
    <em>(<a href="https://gist.github.com/rviscomi/44d80c1a0f4dec9cbafb37347c770278#file-lazy-loading-crux-lcp-wordpress-sql">Source</a>)</em>
  </figcaption>
</figure>

Unfortunately, the same pattern emerges when we drill down into WordPress pages; those that use
lazy-loading tend to have slower LCP performance. The median WordPress page without lazy-loading has
a 75th percentile LCP of 3,495 ms, compared to 3,768 ms for the median page with lazy-loading.

This still doesn't prove that lazy-loading _causes_ pages to get slower, but using it does coincide
with having slower performance. To try to answer the causality question, we set up a lab-based A/B
test.

## Causal performance

The goal for the A/B test was to prove or disprove the hypothesis that native image lazy-loading, as
implemented in WordPress core, resulted in slower LCP performance and fewer image bytes. The
methodology we used was to test a demo WordPress website with the [twentytwentyone](https://wordpress.org/themes/twentytwentyone/)
theme. We tested
both archive and single page types, which are like the home and article pages, on desktop and
emulated mobile devices using [WebPageTest](https://webpagetest.org/). We tested each combination of
pages with and without lazy-loading enabled and ran each test nine times to get the median LCP value
and number of image bytes.

<div>
  <table>
    <thead>
      <tr>
        <th>Series</th>
        <th>default</th>
        <th>disabled</th>
        <th>Difference from default</th>
      </tr>
      </thead>
    <tbody>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcQM_859caf47f070026732f4da3f70b8afe3-l:fix,210625_BiDcPT_2b89f12170b7180acf06cb35d3125d6a-l:disabled,210625_AiDc28_df202856ac4f0da4748c7a84a7a455a8-l:default">twentytwentyone-archive-desktop</a></td>
        <td style="text-align: right;">2,029</td>
        <td style="text-align: right;">1,759</td>
        <td style="text-align: right; background-color: #8fd1b1;">-13%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcV5_003a2ee20d6ee7323fca102afe3ef511-l:fix,210625_BiDcET_810fe76322f8a6003c38f0bc901e4025-l:disabled,210625_BiDc99_44b0562e9077eb01e1e18dceec69bca9-l:default">twentytwentyone-archive-mobile</a></td>
        <td style="text-align: right;">1,657</td>
        <td style="text-align: right;">1,403</td>
        <td style="text-align: right; background-color: #7ecaa5;">-15%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_AiDcR8_47e248c3211951b7af3bc9a87f205cc7-l:fix,210625_AiDcXB_3d9db18bf36397fcdc5d3db207d0d9e7-l:disabled,210625_AiDc2G_ee59429fac9a388b2184758078610b61-l:default">twentytwentyone-single-desktop</a></td>
        <td style="text-align: right;">1,655</td>
        <td style="text-align: right;">1,726</td>
        <td style="text-align: right; background-color: #fae3e1;">4%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcR1_c349d38d4c7151772f2678fa7767ff42-l:fix,210625_AiDcD9_502bb504fc87aebafc5f8c9aaa70faa5-l:disabled,210625_BiDcPS_de2a3e5a526e470287d850d1dbc96fb7-l:default">twentytwentyone-single-mobile</a></td>
        <td style="text-align: right;">1,352</td>
        <td style="text-align: right;">1,384</td>
        <td style="text-align: right; background-color: #fdf0ef;">2%</td>
      </tr>
    </tbody>
    <caption>Change in LCP (ms) by disabling native image lazy-loading on sample WordPress pages.</caption>
  </table>
</div>

The results above compare the median LCP in milliseconds for tests on archive and single pages for
desktop and mobile. When we disabled lazy-loading on archive pages, we observed LCP improving by a
significant margin. On single pages, however, the difference was more neutral.

It's worth noting that the effect of disabling lazy-loading actually appears to make the single
pages slightly faster. However, the difference in LCP is less than one standard deviation for both
desktop and mobile tests, so we attribute this to variance and consider the change neutral overall.
By comparison, the difference for archive pages is more like two to three standard deviations.

<div>
  <table>
    <thead>
      <tr>
        <th>Series</th>
        <th>default</th>
        <th>disabled</th>
        <th>Difference from default</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcQM_859caf47f070026732f4da3f70b8afe3-l:fix,210625_BiDcPT_2b89f12170b7180acf06cb35d3125d6a-l:disabled,210625_AiDc28_df202856ac4f0da4748c7a84a7a455a8-l:default">twentytwentyone-archive-desktop</a></td>
        <td style="text-align: right;">577</td>
        <td style="text-align: right;">1173</td>
        <td style="text-align: right; background-color: #e67c73;">103%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcV5_003a2ee20d6ee7323fca102afe3ef511-l:fix,210625_BiDcET_810fe76322f8a6003c38f0bc901e4025-l:disabled,210625_BiDc99_44b0562e9077eb01e1e18dceec69bca9-l:default">twentytwentyone-archive-mobile</a></td>
        <td style="text-align: right;">172</td>
        <td style="text-align: right;">378</td>
        <td style="text-align: right; background-color: #e67c73;">120%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_AiDcR8_47e248c3211951b7af3bc9a87f205cc7-l:fix,210625_AiDcXB_3d9db18bf36397fcdc5d3db207d0d9e7-l:disabled,210625_AiDc2G_ee59429fac9a388b2184758078610b61-l:default">twentytwentyone-single-desktop</a></td>
        <td style="text-align: right;">301</td>
        <td style="text-align: right;">850</td>
        <td style="text-align: right; background-color: #e67c73;">183%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcR1_c349d38d4c7151772f2678fa7767ff42-l:fix,210625_AiDcD9_502bb504fc87aebafc5f8c9aaa70faa5-l:disabled,210625_BiDcPS_de2a3e5a526e470287d850d1dbc96fb7-l:default">twentytwentyone-single-mobile</a></td>
        <td style="text-align: right;">114</td>
        <td style="text-align: right;">378</td>
        <td style="text-align: right; background-color: #e67c73;">233%</td>
      </tr>
    </tbody>
    <caption>Change in the number of image bytes (KB) by disabling native image lazy-loading on sample WordPress pages.</caption>
  </table>
</div>

The results above compare the median number of image bytes (in KB) for each test. As expected,
lazy-loading has a very clear positive effect on reducing the number of image bytes. If a real user
were to scroll the entire page down, all images would load anyway as they cross into the viewport,
but these results show the improved performance of the initial page load.

To summarize the results of the A/B test, the lazy-loading technique used by WordPress very clearly
helps reduce image bytes but at the cost of a delayed LCP.

## Testing a fix

Before we get into how the fix was implemented, let's look at how lazy-loading works in WordPress
today. The most important aspect of the current implementation is that it lazy-loads images above
the fold (within the viewport). The CMS blog post
[acknowledges](/browser-level-lazy-loading-for-cmss/#avoid-lazy-loading-above-the-fold-elements)
this as a pattern to avoid, but experimental data at the time indicated that the effect on LCP was
minimal and worth simplifying the implementation in WordPress core.

Given this new data, we created an experimental fix that avoids lazy-loading images that are above
the fold and we tested it under the same conditions as the first A/B test.

<div>
  <table>
    <thead>
      <tr>
        <th>Series</th>
        <th>default</th>
        <th>disabled</th>
        <th>fix</th>
        <th>Difference from default</th>
        <th>Difference from disabled</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcQM_859caf47f070026732f4da3f70b8afe3-l:fix,210625_BiDcPT_2b89f12170b7180acf06cb35d3125d6a-l:disabled,210625_AiDc28_df202856ac4f0da4748c7a84a7a455a8-l:default">twentytwentyone-archive-desktop</a></td>
        <td style="text-align: right;">2,029</td>
        <td style="text-align: right;">1,759</td>
        <td style="text-align: right;">1,749</td>
        <td style="text-align: right; background-color: #8bd0ae;">-14%</td>
        <td style="text-align: right; background-color: #fafdfb;">-1%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcV5_003a2ee20d6ee7323fca102afe3ef511-l:fix,210625_BiDcET_810fe76322f8a6003c38f0bc901e4025-l:disabled,210625_BiDc99_44b0562e9077eb01e1e18dceec69bca9-l:default">twentytwentyone-archive-mobile</a></td>
        <td style="text-align: right;">1,657</td>
        <td style="text-align: right;">1,403</td>
        <td style="text-align: right;">1,352</td>
        <td style="text-align: right; background-color: #64c093;">-18%</td>
        <td style="text-align: right; background-color: #e0f2e9;">-4%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_AiDcR8_47e248c3211951b7af3bc9a87f205cc7-l:fix,210625_AiDcXB_3d9db18bf36397fcdc5d3db207d0d9e7-l:disabled,210625_AiDc2G_ee59429fac9a388b2184758078610b61-l:default">twentytwentyone-single-desktop</a></td>
        <td style="text-align: right;">1,655</td>
        <td style="text-align: right;">1,726</td>
        <td style="text-align: right;">1,676</td>
        <td style="text-align: right; background-color: #fef7f7;">1%</td>
        <td style="text-align: right; background-color: #e6f5ee;">-3%</td>
      </tr>
      <tr>
        <td><a
        href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcR1_c349d38d4c7151772f2678fa7767ff42-l:fix,210625_AiDcD9_502bb504fc87aebafc5f8c9aaa70faa5-l:disabled,210625_BiDcPS_de2a3e5a526e470287d850d1dbc96fb7-l:default">twentytwentyone-single-mobile</a></td>
        <td style="text-align: right;">1,352</td>
        <td style="text-align: right;">1,384</td>
        <td style="text-align: right;">1,342</td>
        <td style="text-align: right; background-color: #f8fcfa;">-1%</td>
        <td style="text-align: right; background-color: #e6f5ee;">-3%</td>
      </tr>
    </tbody>
    <caption>Change in LCP (ms) by the proposed fix for native image lazy-loading on sample WordPress pages.</caption>
  </table>
</div>

These results are much more promising. Lazy-loading only the images below the fold results in a
complete reversal of the LCP regression and possibly even a slight _improvement_ over disabling LCP
entirely. How could it be faster than not lazy-loading at all? One explanation is that by not
loading below-the-fold images, there's less network contention with the LCP image, which enables it
to load more quickly.

<div>
  <table>
  <thead>
    <tr>
      <th>Series</th>
      <th>default</th>
      <th>disabled</th>
      <th>fix</th>
      <th>Difference from default</th>
      <th>Difference from disabled</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a
      href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcQM_859caf47f070026732f4da3f70b8afe3-l:fix,210625_BiDcPT_2b89f12170b7180acf06cb35d3125d6a-l:disabled,210625_AiDc28_df202856ac4f0da4748c7a84a7a455a8-l:default">twentytwentyone-archive-desktop</a></td>
      <td style="text-align: right;">577</td>
      <td style="text-align: right;">1173</td>
      <td style="text-align: right;">577</td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right; background-color: #a9dcc3;">-51%</td>
    </tr>
    <tr>
      <td><a
      href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcV5_003a2ee20d6ee7323fca102afe3ef511-l:fix,210625_BiDcET_810fe76322f8a6003c38f0bc901e4025-l:disabled,210625_BiDc99_44b0562e9077eb01e1e18dceec69bca9-l:default">twentytwentyone-archive-mobile</a></td>
      <td style="text-align: right;">172</td>
      <td style="text-align: right;">378</td>
      <td style="text-align: right;">172</td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right; background-color: #a3d9bf;">-54%</td>
    </tr>
    <tr>
      <td><a
      href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_AiDcR8_47e248c3211951b7af3bc9a87f205cc7-l:fix,210625_AiDcXB_3d9db18bf36397fcdc5d3db207d0d9e7-l:disabled,210625_AiDc2G_ee59429fac9a388b2184758078610b61-l:default">twentytwentyone-single-desktop</a></td>
      <td style="text-align: right;">301</td>
      <td style="text-align: right;">850</td>
      <td style="text-align: right;">301</td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right; background-color: #92d3b3;">-65%</td>
    </tr>
    <tr>
      <td><a
      href="https://www.webpagetest.org/video/compare.php?medianMetric=chromeUserTiming.LargestContentfulPaint&highlightLCP=1&thumbSize=200&ival=100&end=visual&tests=210625_BiDcR1_c349d38d4c7151772f2678fa7767ff42-l:fix,210625_AiDcD9_502bb504fc87aebafc5f8c9aaa70faa5-l:disabled,210625_BiDcPS_de2a3e5a526e470287d850d1dbc96fb7-l:default">twentytwentyone-single-mobile</a></td>
      <td style="text-align: right;">114</td>
      <td style="text-align: right;">378</td>
      <td style="text-align: right;">114</td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right; background-color: #89cfad;">-70%</td>
    </tr>
    </tbody>
    <caption>Change in the number of image bytes (KB) by the proposed fix for native image lazy-loading on sample WordPress pages.</caption>
  </table>
</div>

In terms of image bytes, the fix has absolutely no change as compared to the default behavior. This
is great because that was one of the strengths of the current approach.

There are some caveats with this fix. WordPress determines which images to lazy-load on the
server-side, which means that it doesn't know anything about the user's viewport size or whether
images will initially load within it. So the fix uses heuristics about the images' relative location
in the markup to guess whether it will be in the viewport. Specifically, if the image is the first
featured image on the page or the first image in the main content, it's assumed to be above the fold
(or close to it), and it will not be lazy-loaded. Page-level conditions like the number of words in
the heading or the amount of paragraph text early in the main content may affect whether the image
is within the viewport. There are also user-level conditions that may affect the accuracy of the
heuristics, especially the viewport size and the usage of anchor links that change the scroll
position of the page. For those reasons, it's important to acknowledge that the fix is only
calibrated to provide good performance in the general case and fine-tuning may be needed to make
these results applicable to all real-world scenarios.

## Rolling it out

Now that we've identified a better way to lazy-load images, all of the image savings and faster LCP
performance, how can we get sites to start using it? The highest priority change is to submit a
patch to WordPress core to implement the experimental fix. We'll also be updating the guidance in
the [Browser-level lazy-loading for CMSs](/browser-level-lazy-loading-for-cmss/) blog
post to clarify the negative effects of above-the-fold lazy-loading and how CMSs can use heuristics
to avoid it.

Since these best practices are applicable to all web developers, it may also be worth flagging
lazy-loading antipatterns in tools like Lighthouse. Refer to the [feature
request](https://github.com/GoogleChrome/lighthouse/issues/12785) on GitHub if you're interested to
follow along with progress on that audit. Until then, one thing developers could do to find
instances of LCP elements being lazy-loaded is to add more detailed logging to their field data.

```js
webVitals.getLCP(lcp => {
  const latestEntry = lcp.entries[lcp.entries.length - 1];
  if (latestEntry?.element?.getAttribute('loading') == 'lazy') {
    console.warn('Warning: LCP element was lazy loaded', latestEntry);
  }
});
```

The JavaScript snippet above will evaluate the most recent LCP element and log a warning if it was
lazy-loaded.

This also highlights a sharp edge of the lazy-loading technique and the potential for API
improvements at the platform level. For example, there's an open issue in Chromium to
[experiment](https://bugs.chromium.org/p/chromium/issues/detail?id=996963) with natively loading the
first few images eagerly, similar to the fix, despite the `loading` attribute.

## Wrapping it up

If your site uses native image lazy-loading, check how it's implemented and run A/B tests to better
understand its performance costs. It may benefit from more eagerly loading images above the fold. If
you have a WordPress site, there will hopefully be a patch landing in WordPress core soon. And if
you're using another CMS, make sure they're aware of the potential performance issues described
here.

Trying out relatively new web platform APIs can come with both risks and rewards—they're called
cutting edge features for a reason. While we're starting to get a sense of the thorniness of native
image lazy-loading, we're also seeing the upsides of how to use it to achieve better performance.

<small>_Photo by <a href="https://unsplash.com/@frankielopez?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Frankie Lopez</a> on <a href="https://unsplash.com/s/photos/prickly-pear?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>_</small>

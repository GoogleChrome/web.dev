---
layout: post
title: How QuintoAndar increased conversion rates and pages per session by improving page performance
subhead: A project focused on optimizing Core Web Vitals and migrating to Next.js resulted in a 5% increase in conversion rates and a 87% increase in pages per session.
authors:
  - danielasy
date: 2021-12-10
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/VQrzs5OoWZT2qS8yTzGW.jpg
alt: A picture of a city skyline on a clear, sunny day. At center is the QuintoAndar logo in white.
description: |
  A project focused on optimizing Core Web Vitals and migrating to Next.js resulted in a 5% increase in conversion rates and a 87% increase in pages per session.
tags:
  - blog
  - case-study
  - web-vitals
---

QuintoAndar is a Brazilian proptech company whose products offer digital end-to-end solutions for real estate. This year, we carried out a project focused on improving the performance of a content hub in our app, and had encouraging results in increasing user traffic and conversion metrics.

<div class="stats">
 <div class="stats__item">
   <p class="stats__figure">46<sub>%</sub></p>
   <p>reduction in bounce rate</p>
 </div>
 <div class="stats__item">
   <p class="stats__figure">87<sub>%</sub></p>
   <p>increase in pages per session</p>
 </div>
 <div class="stats__item">
   <p class="stats__figure">5<sub>%</sub></p>
   <p>improvement in conversion during validation phase</p>
 </div>
</div>

## Challenges

Our app has a condominium content hub with over 40,000 pages, where users can get information about their properties, check photos of the common areas, read about the neighborhood, and find available listings for rent or sale. These pages are very important for QuintoAndar:

- They are an important source of [organic traffic](https://en.wikipedia.org/wiki/Organic_search_results), with a steadily increasing number of users coming from search engine results.
- They have high conversion rates in the medium to long-term compared to other pages.

However, there were challenges when it came to the performance and user experience in these pages:

- Their performance as measured by [Core Web Vitals](/vitals/) was not optimized, and there were known issues regarding slow page loads, slow responsiveness to user input, and layout instability.
- Their [bounce rates](https://en.wikipedia.org/wiki/Bounce_rate) were high, even if we expected them to be higher than in other parts of the app.
- The [page experience update in Google Search](https://developers.google.com/search/blog/2020/11/timing-for-page-experience)&mdash;which, at that time, was not yet released&mdash;would include Core Web Vitals into the ranking algorithm, which meant page performance could affect how search results were going to be displayed.

At the same time, we identified some developer experience opportunities that could unlock gains in other projects across the company:

- Our server-side rendering logic&mdash;which renders all high-traffic pages, including condominium pages&mdash;was created in-house, and became too complex to maintain and onboard new hires.
- Essential features to achieve good app performance, such as [code splitting](https://developer.mozilla.org/docs/Glossary/Code_splitting), also required a custom setup plus manual work from the developers.
- QuintoAndar has over 30 [React](https://reactjs.org) web applications. Delivering updates to these applications and maintaining them in accordance to best practices is an arduous task.

## Approach

We began a performance optimization project of the condominium content hub to improve its user experience, as these improvements could lead to conversion gains, better SEO, and better usability. This initiative was also a fitting opportunity to improve the developer experience as well.

### Migrating to Next.js

The new version of the condominium page was implemented with [Next.js](http://nextjs.org/). Being largely independent from other parts of the app, the condominium content hub seemed like a good candidate for trying out a new framework. We would be able to understand the magnitude of migration efforts and evaluate how its features could help without affecting the other React apps in QuintoAndar.

A hard requirement was to ensure pages remained crawlable by search engines. Next.js meets this requirement by supporting server-side rendering out-of-the-box, and removes the need for a custom setup. The documentation makes it much easier to share knowledge on how to do tasks such as [data fetching](https://nextjs.org/docs/basic-features/data-fetching) on the server and onboard new developers. Server-side rendering is also known to [improve performance](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) metrics such as [First Contentful Paint](/fcp/) (FCP).

The framework provides other performance-friendly features such as automatic [code splitting](/reduce-javascript-payloads-with-code-splitting/) and [prefetching](/link-prefetch/). Even though the existing structure already provided such features, the additional work required from developers stalled their adoption. For example, code splitting at page or component-level had to be done manually.

### Optimizing JavaScript resources

The first step was to [remove unused code](/remove-unused-code/). We looked at the [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) reports, which shows the contents of each JS bundle, and carefully reviewed all third-party scripts. As a result, we were able to clean up some tracking libraries that were not used in this specific page.

Our team went further and evaluated the performance cost of existing features. For instance, the "like" button required quite a lot of JS to work. However, in the condominium page, less than 0.5% of the users interacted with the button, which is available and used more frequently in other parts of our app. After a discussion involving both Engineering and Product, we decided to remove this feature.

<figure>
  {% Video src="video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/2uEL2YxbuGGlmJDlvW9F.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}
  <figcaption>
    An animation showing the “like” button feature. There is a card about an apartment available for rent. In the bottom right corner of the card, there is a grey heart-shaped button that turns blue when clicked.
  </figcaption>
</figure>

Other JS optimizations were already in place, such as [static compression with Brotli](/reduce-network-payloads-using-text-compression/#static-compression), which was done at build time using [`BrotliWebpackPlugin`](https://github.com/mynameiswhm/brotli-webpack-plugin), and was also applied to other types of static resources. At first, we were relying on the compression provided by the CDN, and Brotli reduced JS size by 18% compared to gzip. But then, we switched to Brotli compression at build time, and were able to achieve a 24% reduction.

### Optimizing image resources

There is a hero image occupying most of the area above the fold in the mobile version. It also happens to be the [Largest Contentful Paint](/lcp/) (LCP) of the page.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/W7koRinBm3QXErIzwGP8.png", alt="The condominium page for Edifício Copan (São Paulo, Brazil). A photo taken from the ground level shows the curves of the building structure.", width="360", height="640" %}
  <figcaption>
    The hero image of a condominium page.
  </figcaption>
</figure>

Previously, all images already had `srcset` and `sizes` attributes to [serve responsive images](/serve-responsive-images/). We also used [Thumbor](https://github.com/thumbor/thumbor) to resize images on-demand and configured our CDN to cache them efficiently.

Modern mobile devices have displays with very high pixel density, meaning the browser would render 3x or 4x versions of the image, if available. As resolution increases, it gets harder for the human eye to perceive the differences, but file sizes will increase regardless. [Capping the maximum image resolution](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices) improved image size without compromising the user experience. We limited the hero image to serve its 2x version at most, which is approximately 35% smaller than the 3x version and 50% smaller than the 4x one.

To finish, we used a [preloading](/preload-critical-assets/) strategy to download and display it as soon as possible, looking forward to improving the LCP metric.

```html
<link rel="preload" href="/img/450x450/892847321-143.0038687080606IMG20180420WA0037.jpg" as="image">
```

The [Next.js built-in image component](https://nextjs.org/docs/basic-features/image-optimization) includes many of these optimizations such as responsive resizing and prioritized loading. During this project, we did not migrate the existing images to use this component, but we are planning to adopt it in new features.

### Reducing layout shift

The condominium page had a few issues with [Cumulative Layout Shift](/cls/) (CLS). The elements responsible for the layout shifts were rendered only in the client&mdash;for instance, hydrating server-side markup with client-rendered components, or images without defined `width` and `height` attributes.

To solve these problems, we set exact dimensions for these elements when possible, or estimated values with `min-height`. There are more options, such as using the [`aspect-ratio` CSS property](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio). We also created placeholders to prevent dynamically rendered components from causing layout shifts.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/VqFwUiJOtNmyNc14xljP.png", alt="An image showing an urban area in Google Maps with a red marker in the center.", width="397", height="174" %}
  <figcaption>
    Defining dimensions for elements such as the map image reduced the CLS.
  </figcaption>
</figure>

### Progressively rolling out changes

Our team wanted to validate that the optimized version of the condominium hub page to make sure the user experience would be better. To achieve this, we adopted a progressive rollout strategy:

1. In the first phase, the new version was published for a few hand-picked URLs, so only a few hundreds of users per day would see them;
2. In the second phase, it was published for more pages, accounting to a few thousand users per day;
3. In the third and final phase, it was published for all pages, and the roll-out was completed for all users.

During this period, the engineering team continuously measured page performance in production and kept working on improvements. Additionally, the team compared business metrics between the new and previous versions. The results in this validation period were promising.

## Results

The team used [SpeedCurve](https://speedcurve.com) to continuously run [lab tests](/user-centric-performance-metrics/#how-metrics-are-measured) against the condominium page. These are the results for the mobile version:

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Lab metric</th>
        <th>Before</th>
        <th>After</th>
        <th>Difference</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Largest Contentful Paint (LCP)</td>
        <td>2.41 seconds</td>
        <td>1.48 seconds</td>
        <td>-39%</td>
      </tr>
      <tr>
        <td>Time to Interactive (TTI)</td>
        <td>12.16 seconds</td>
        <td>7.48 seconds</td>
        <td>-39%</td>
      </tr>
      <tr>
        <td>Total Blocking Time (TBT)</td>
        <td>1124 milliseconds</td>
        <td>1056 milliseconds</td>
        <td>-4%</td>
      </tr>
      <tr>
        <td>Cumulative Layout Shift (CLS)</td>
        <td>0.0402</td>
        <td>0.0093</td>
        <td>-77%</td>
      </tr>
    </tbody>
    <caption>
      Lab metrics results collected with SpeedCurve.
    </caption>
  </table>
</div>

We also wanted to check the impact on our real users. Using field data collected with [Instana Website Monitoring](https://www.instana.com/website-end-user-monitoring/), we looked at the 1-month period before and after the roll-out. Comparing the 75th percentile for mobile users, we found that LCP decreased by 26%, and FID decreased by 72%.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/IAVpmg7O1Moxk8qA7zcq.png", alt="A line graph with LCP values comparing the new and previous versions during the current and past month. The curve for the new version floats between 2 and 4 seconds, staying below the curve for the previous version most of the time.", width="800", height="495" %}
</figure>

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/QWkHnGHi4YTdBR6q17sw.png", alt="A line graph with FID values comparing the new and previous versions during the current and past month. The curve for the new version stays below 100ms most of the time, while in the curve for the previous version there are a few spikes crossing 250ms.
", width="800", height="494" %}
  <figcaption>
    Field metrics results collected with Instana.
  </figcaption>
</figure>

[PageSpeed Insights](https://pagespeed.web.dev/) provides a field data report for the last 28 days. [The most accessed condominium page](https://www.quintoandar.com.br/condominio/ed-copan-centro-historico-de-sao-paulo-sao-paulo-ndv7sq7j2d) alone had enough data to generate a report for mobile users. As of November 2021, all Core Web Vitals are in the "good" bucket.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/83nulYFqSAAWNLLPHXut.png", alt="A screenshot of the PageSpeed Insights report focusing on the Field Data section. All Core Web Vitals metrics (FCP, FID, LCP, CLS) are in the good bucket.", width="800", height="483" %}
  <figcaption>
    PageSpeed Insights shows that mobile users are having a good experience in the most accessed condominium page.
  </figcaption>
</figure>

During the progressive roll-out, we noticed a drop in bounce rates. By the time we had finished the release for all pages, [Google Analytics](https://analytics.google.com/) showed a 46% decrease in bounce rate, a 87% increase in pages per session, and a 49% increase in average session duration. The bounce rate reduction was even bigger for paid searches, reaching a 59% drop — a positive sign when it comes to the investments in [pay-per click](https://en.wikipedia.org/wiki/Pay-per-click) (PPC) ads.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/f31hvBafirHtDBlKINwI.png", alt="A screenshot of a graph from Google Analytics. It compares the bounce rates between two distinct periods in March 2021. Starting from March 17th, there is a slight drop in the bounce rate. The drop is accentuated on March 24th.", width="800", height="169" %}
  <figcaption>
    Google Analytics shows the bounce rate decreasing as we rolled-out the new version in more pages.
  </figcaption>
</figure>

As for the impact in business metrics, we analyzed conversion rates for transactions like scheduling a tour and applying to rent or buy an estate. While improvements were still being rolled out, our team compared the conversion between the previous and new versions. In the same week, the group of pages with the new version showed a 5% conversion increase, while the other pages had a slight decrease in the same metric.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/8duPNi2huaphIWCU7DBb.png", alt="Two line graphs side-by-side, each one comparing the conversion between the current and previous week. The left one is for the previous version of the page, showing the conversion curve for the current week is a bit below the one for the previous week. The right one is for the new version, and the conversion curve for the current week is a bit above the one for the previous week.", width="800", height="447" %}
  <figcaption>
    In the same week, the conversion for the new version increased, while the previous version had a small decrease.
  </figcaption>
</figure>

## Conclusion

This project is the first part of a long-term migration effort from framework-less React to Next.js. The teams who worked on the condominium page since then gave positive feedback about the improved developer experience. Other teams who had to bootstrap new web apps have already done so with Next.js. We believe Next.js will simplify maintenance efforts and establish a common ground between different apps.

Overall, the condominium content hub has been continuously growing in terms of absolute number of users and transactions. In the long-term analysis, there are many factors contributing to this, like the expansion of QuintoAndar’s operation and SEO initiatives such as improved page indexing. During this project, we have seen that page performance is also one of these factors with great potential for positive conversion impact.

_Special thanks to [Pedro Carmo](https://www.linkedin.com/in/pasrcarmo/), Product Manager of the SEO team, for diving into the user data and creating all the conversion analysis seen in this case study._

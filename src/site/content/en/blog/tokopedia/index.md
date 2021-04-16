---
title: How focusing on web performance improved Tokopedia's click-through rate by 35%
subhead: >
  Creating a web performance dashboard and optimizing JavaScript, resources, and the
  homepage to achieve business success.
date: 2020-10-13
hero: image/admin/MaUpfoZXyw4uhTEBLuV1.png
thumbnail: image/admin/SI5jNv7NqnjkfIIXyZOa.png
alt: An illustration of e-commerce icons next to the text "Scale on web"
description: >
  Creating a web performance dashboard and optimizing JavaScript, resources, and the
  homepage to achieve business success.
tags:
  - blog
  - case-study
  - performance
  - web-vitals
  - scale-on-web
---

Tokopedia is one of the largest e-commerce companies in Indonesia. With 2.7M+ nationwide merchant
networks, 18M+ product listings, and 50M+ monthly visitors, the web team knew  that investment in
web performance was essential. By building a performance-first culture, they achieved a 35% increase
in click-through rates (CTR) and an 8% increase in conversions (CVR).

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">35<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in CTR</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">8<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in CVR</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">4<sub class="w-stat__sub">sec</sub></p>
    <p class="w-stat__desc">Improvement in TTI</p>
  </div>
</div>

## Highlighting the opportunity

The web team talked to their leadership team on the importance of investing in web performance to
improve user experience and engagement, and also showed the impact of performance using advanced
patterns and APIs.

{% Aside %}
Check out web.dev's [Build a performance culture](/fast/#build-a-performance-culture)
collection for tips on how to persuade your cross-functional stakeholders to focus on website
performance.
{% endAside %}

## The approach they used

### JavaScript and resource optimization

<div class="w-columns">
  <div>
    <p>
      Render-blocking or long-running <a href="/fast/#optimize-your-javascript">JavaScript</a>
      is a common cause of performance issues. The team took several steps to minimize this:
    </p>
    <ul>
      <li>
        Built a script controller library to selectively load third-party scripts to optimize for
        critical rendering path.
      </li>
      <li>
        Replaced heavier libraries with lighter ones.
      </li>
      <li>
        Implemented <a href="/reduce-javascript-payloads-with-code-splitting/">code splitting</a>
        and optimized for above-the-fold content.
      </li>
      <li>
        Implemented <a href="/adaptive-loading-cds-2019/">adaptive loading</a>, e.g. only
        loading high-quality images for devices on fast networks and using lower-quality images for
        devices on slow networks.
      </li>
      <li>
        <a href="/lazy-loading-images/">Lazy-loaded</a> below-the-fold images.
      </li>
      <li>
        Deferred loading of non-critical JavaScript.
      </li>
    </ul>
  </div>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/G8s0LNl7BwXuNJkCsPwV.png", alt="Script controller library improved TTI by 4 seconds", width="800", height="707", class="w-screenshot" %}
  </figure>
</div>

### Homepage optimization

<div class="w-columns">
  <p>
    The team used <a href="https://svelte.dev/">Svelte</a> to build a lite version of the homepage
    for first-time visitors, ensuring a fast website experience. This version also used a service
    worker to cache the non-lite assets in the background.
  </p>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gSJXd2GT8nT7Uzsth4Gg.png", alt="Reduced app JavaScript size by 88% (from 320 KB to 37 KB). Boosted Lighthouse score by 90 points. Achieved FCP of less than 1 second. 35% CTR increase. 8% CVR increase.", width="800", height="657", class="w-screenshot" %}
  </figure>
</div>

### Performance budgeting and monitoring

<div class="w-columns">
  <div>
    <p>
      The team built a performance monitoring dashboard using
      <a href="/lighthouse-whats-new-6.0/">Lighthouse</a>
      and other tools to improve the quality of web pages:
    </p>
    <ul>
      <li>
        Measures network quality, infrastructure monitoring, frontend performance, and server
        performance.
      </li>
      <li>
        Uses a combination of web platform APIs (such as the
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API">
          Resource Timing API
        </a> and the
        <code><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing">Server-Timing</a></code>
        header), the <a href="https://developers.google.com/speed/docs/insights/v5/get-started">
          PageSpeed Insights (PSI) API</a>, and
        <a href="https://developers.google.com/web/tools/chrome-user-experience-report">
          Chrome User Experience Report</a> data to monitor field and lab metrics.
      </li>
      <li>
        Analyzes images from Lighthouse to help identify image optimization opportunities.
      </li>
      <li>
        Enforces a bundle-size budget during continuous integration (CI). The CI run fails if the
        bundle size is over budget.
      </li>
    </ul>
  </div>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gObv2y7p7ozM190w61M3.png", alt="2.2 second TTI score on the homepage (Lighthouse score: 88). 1.9 second TTI score on product pages (Lighthouse score: 86).", width="800", height="1097", class="w-screenshot" %}
  </figure>
</div>

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">
    Being an e-commerce business, user acquisition is at the heart of our success. We acknowledge
    the importance of the web and thus we are passionate about investing in all
    the tools and features that will give the best user experience to our users.
  </p>
  <cite>Dendi Sunardi, Engineering Manager, Web Platform, Tokopedia</cite>
</blockquote>

Check out the [Scale on web case studies](/scale-on-web) page for more success
stories from India and Southeast Asia.

---
layout: post
title: Keep request counts low and transfer sizes small
description: |
  An overview of how high resource counts and large transfer sizes affect load performance, 
  and strategies for reducing request counts and transfer sizes.
updated: 2019-08-27
web_lighthouse:
  - resource-summary
---

The **Keep request counts low and transfer sizes small** audit tells you how many network requests 
were made while your page loaded, as well as the total amount of data transferred.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="resource-summary.jpg" 
       alt="Keep request counts low and transfer sizes small">
  <figcaption class="w-figcaption">
    <b>Keep request counts low and transfer sizes small</b>
  </figcaption>
</figure>

{% Aside %}
  The **Requests** and **Transfer Size** values for the **Total** row is computed by adding the values
  for the **Image**, **Script**, **Font**, **Stylesheet**, **Other**, **Document**, and **Media**
  rows. The **Third-party** column does not factor into the **Total** row's values. Its purpose is
  to make you aware of how many of the total requests and how much of the total transfer size came
  from third-party domains. The third-party requests could be a combination of any of the other
  resource types.
{% endAside %}

{% Aside %}
  Like all of the **Diagnostics** audits, the **Keep request counts low and transfer sizes small**
  audit does not directly affect your **Performance** score. However, reducing request counts or
  transfer sizes may improve any or all of your **Performance** metrics, which does have a direct
  effect on your **Performance** score.
{% endAside %}

## How high resource counts and large transfer sizes affect load performance

The effect of high resource counts or large transfer sizes on load performance depends on what
type of resource is being requested.

### CSS and JavaScript

{% Aside %}
  This section covers both CSS and JavaScript because their impact on load performance
  and optimization strategies are largely the same.
{% endAside %}

Requests for CSS and JavaScript files are render-blocking by default. In other words, 
**browsers can't render content to the screen until all CSS and JavaScript requests are finished.** 
If any of these files is hosted on a slow server, that single slow server can delay the entire
rendering process. See [Render-Blocking CSS][css] and [Parser-blocking versus asynchronous 
JavaScript][js] for more details on why CSS and JavaScript are render-blocking.
See [Optimize your JavaScript](/fast#optimize-your-javascript), [Optimize your third-party
resources](/fast#optimize-your-third-party-resources), and [Optimize your 
CSS](/fast#optimize-your-css) to learn about the various strategies for only shipping the code
that you actually need for the initial page render, which can improve all of your [performance
metrics][metrics].

### Images

Requests for images aren't render-blocking like CSS and JavaScript, but they can still negatively
affect load performance. A common problem is when a mobile user loads a page and sees that images
have started loading but will take a while to finish. [Optimizing your images](/fast#optimize-your-images)
to reduce their transfer sizes helps them finish loading faster, which can improve your
[First Contentful Paint][fcp], [First Meaningful Paint][fmp], and [Speed Index][si] metrics.

### Fonts

Inefficient loading of font files can cause invisible text during the page load.
[Optimizing your fonts](/fast/#optimize-web-fonts) to default to a font that's available on the
user's device and then switching over to your custom font when it has finished downloading can
improve your [First Contentful Paint][fcp] metric.

### Documents

If your HTML file is large, the browser has to spend more time parsing the HTML and
constructing the DOM tree from the parsed HTML. Shipping less HTML may therefore improve your
[First Contentful Paint][fcp] metric.

### Media

GIF files are often very large. [Replacing GIFs with videos](/replace-gifs-with-videos/)
can help the browser render the initial frames of the animation faster, which can improve your 
[First Contentful Paint][fcp] metric. But perhaps more importantly, since the video file will
likely be much smaller than the GIF, users will be able to watch the complete video faster.

## Use performance budgets to prevent regressions

Once you've optimized your code to reduce request counts and transfer sizes, set up 
[performance budgets](https://web.dev/fast#set-performance-budgets) to prevent regressions.

## Resources

- [Source code for the **Keep request counts low and transfer sizes small** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/resource-summary.js)

[coverage]: https://developers.google.com/web/tools/chrome-devtools/coverage/
[css]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css
[js]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript#parser_blocking_versus_asynchronous_javascript
[fcp]: https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint
[si]: https://developers.google.com/web/tools/lighthouse/audits/speed-index
[fmp]: https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint
[metrics]: /lighthouse-performance#metrics
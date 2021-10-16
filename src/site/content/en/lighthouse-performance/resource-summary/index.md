---
layout: post
title: Keep request counts low and transfer sizes small
description: |
  Learn how high resource counts and large transfer sizes affect load performance.
  Get strategies for reducing request counts and transfer sizes.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - resource-summary
---

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
reports how many network requests were made and
how much data was transferred while your page loaded:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eodyrn28QIAVHKM6D2fo.png", alt="A screenshot of the Lighthouse Keep request counts low and transfer sizes small audit", width="800", height="459", class="w-screenshot" %}
</figure>

* The **Requests** and **Transfer Size** values for the **Total** row are computed by adding the values
  for the **Image**, **Script**, **Font**, **Stylesheet**, **Other**, **Document**, and **Media**
  rows.
* The **Third-party** column does not factor into the **Total** row's values. Its purpose is
  to make you aware of how many of the total requests and how much of the total transfer size came
  from third-party domains. The third-party requests could be a combination of any of the other
  resource types.

{% Aside %}
  Like all of the **Diagnostics** audits, the **Keep request counts low and transfer sizes small**
  audit does not directly affect your **Performance** score. However, reducing request counts or
  transfer sizes may improve other **Performance** metrics.
{% endAside %}

## How to reduce resource counts and transfer sizes

The effect of high resource counts or large transfer sizes on load performance depends on what
type of resource is being requested.

### CSS and JavaScript

Requests for CSS and JavaScript files are render-blocking by default. In other words,
browsers can't render content to the screen until all CSS and JavaScript requests are finished.
If any of these files are hosted on a slow server, that single slow server can delay the entire
rendering process. See [Optimize your JavaScript][js], [Optimize your third-party resources][3p],
and [Optimize your CSS][css] to learn how to only ship the code that you actually need.

Affected metrics: [All][metrics]

### Images

Requests for images aren't render-blocking like CSS and JavaScript, but they can still negatively
affect load performance. A common problem is when a mobile user loads a page and sees that images
have started loading but will take a while to finish. See [Optimize your images][images]
to learn how to load images faster.

Affected metrics: [First Contentful Paint][fcp], [First Meaningful Paint][fmp], [Speed Index][si]

### Fonts

Inefficient loading of font files can cause invisible text during the page load. See
[Optimize your fonts][fonts] to learn how to default to a font that's
available on the user's device and then switch to your custom font when it has finished downloading.

Affected metrics: [First Contentful Paint][fcp]

### Documents

If your HTML file is large, the browser has to spend more time parsing the HTML and
constructing the DOM tree from the parsed HTML.

Affected metrics: [First Contentful Paint][fcp]

### Media

Animated GIF files are often very large.
See [Replace GIFs with videos][gifs] to learn how to load animations faster.

Affected metrics: [First Contentful Paint][fcp]

## Use performance budgets to prevent regressions

Once you've optimized your code to reduce request counts and transfer sizes, see
[Set performance budgets](/fast#set-performance-budgets) to learn how to prevent regressions.

## Resources

[Source code for **Keep request counts low and transfer sizes small** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/resource-summary.js)

[css]: /fast#optimize-your-css
[js]: /fast#optimize-your-javascript
[3p]: /fast#optimize-your-third-party-resources
[metrics]: /lighthouse-performance#metrics
[images]: /fast#optimize-your-images
[fcp]: /first-contentful-paint
[fmp]: /first-meaningful-paint
[si]: /speed-index
[fonts]: /fast/#optimize-web-fonts
[gifs]: /replace-gifs-with-videos/

---
title: Eliminate unnecessary downloads
description: |
  You should audit your resources periodically to ensure that each resource is helping deliver a better user experience.
authors:
  - ilyagrigorik
  - jlwagner
date: 2014-03-31
updated: 2023-07-07
---

The fastest and best-optimized resource is a resource not sent. You should eliminate unnecessary resources from your application. It's a good practice to question—and periodically revisit—the implicit and explicit assumptions with your team. Here are a few examples:

- You've always included resource X on your pages, but does the cost of downloading and displaying it offset the value it delivers to the user? Can you measure and prove its value?
- Does the resource (especially if it's a third-party resource) deliver consistent performance? Is this resource in the critical path, or need to be? If the resource is in the critical path, could it be a single point of failure for the site? That is, if the resource is unavailable, does it affect performance and the user experience of your pages?
- Does this resource need or have an SLA? Does this resource follow performance best practices: compression, caching, and so on?

Too often, pages contain resources that are unnecessary, or worse, that hinder page performance without delivering much value to the visitor or to the site they're hosted on. This applies equally to first-party and third-party resources and widgets:

- Site A has decided to display a photo carousel on its homepage to allow the visitor to preview multiple photos with a quick click. All of the photos are loaded when the page is loaded, and the user advances through the photos.
  - **Question:** Have you measured how many users view multiple photos in the carousel? You might be incurring high overhead by downloading resources that most visitors never view.
- Site B has decided to install a third-party widget to display related content, improve social engagement, or provide some other service.
  - **Question:** Have you tracked how many visitors use the widget or click-through on the content that the widget provides? Is the engagement that this widget generates enough to justify its overhead? Furthermore, is it feasible for you to use a loading strategy to ensure [the script isn't loaded until it's needed](/reduce-javascript-payloads-with-code-splitting/)?

Determining whether to eliminate unnecessary downloads often requires a lot of careful thinking and measurement. For best results, periodically inventory and revisit these questions for every asset on your pages.

## Effects on Core Web Vitals

The Core Web Vitals initative was introduced by Google to provide a set of metrics that reflect what users are experiencing as they use the web. While there are many optimization strategies for Core Web Vitals, questioning whether to load a particular resource on a page may light a path for you to improve these metrics on your website. Below are a few examples—grouped by each Core Web Vital—that are worth your consideration. Though this isn't an exhaustive list of examples (and there are many!), reading them over may give you food for thought.

### Largest Contentful Paint (LCP)

[Largest Contentful Paint (LCP)](/lcp/) measures when the largest content (for example a hero image, or a headline) is loaded. It's considered an important perceptual metric that gives the user the impression that a site is loading quickly.

In general, downloading less resources means that the bandwidth the user does have will be allocated across less resources, and may translate to an improvement in LCP. A classic example is that of lazy loading, where images outside of the viewport during page load will not be downloaded until the browser has determined the user is more likely to see them. If you have a large thumbnail gallery of, say, 50 images, lazy loading all but the top ten of them means that the browser can make more efficient use of the bandwidth available to it, and the first images the user will see will load more quickly.

However, it's not just about loading less _images_, necessarily. The browser has an internal prioritization scheme that determines how much bandwidth each resource should receive. However, even with this _all_ resources—particularly those downloaded at high priority—have the potential to deprive a potential LCP element's dependent resource. This is especially true on slow network connections. That dependent resource may be an image file that represents the page's LCP element, but it could also very well be a web font resource that the browser needs to render a text node that may be determined as the page's LCP element.

If your website is heavy on text, it may be the case that a page's LCP element is a text node. While there are many [good font optimization and loading strategies](/font-best-practices/), it may be worth considering whether a system font is sufficient for your website's needs, so that LCP elements which are text nodes can load without a dependency on a web font resource and paint almost immediately as the CSS and HTML arrives from the server.

### Cumulative Layout Shift (CLS)

Every resource you load has the potential to contribute to a page's [Cumulative Layout Shift (CLS)](/cls/), particularly if has not finished downloading by the time of the initial paint. For images, avoid CLS involves practices such as setting explicit dimensions. For fonts, managing font loading and potentially fallback font matching can minimize shifts during a web font's swap period. For JavaScript, it could be managing how that script manipulates the DOM so that layout shifts are reduced to an acceptable amount.

Every resource that contributes to a page's CLS requires some amount of work to ensure page layout is sufficiently stable. By questioning whether or not you need a specific resource, you're not just speeding up page loads, you're also reducing the cognitive effort necessary to preserve layout stability. That leads to not only a much less frustrating user experience, but a less frustrating developer experience, as you'll have more time to pursue other goals in your projects.

### Interaction to Next Paint (INP) and First Input Delay (FID)

[Interaction to Next Paint (INP)](/inp/) and [First Input Delay (FID)](/fid/) are metrics that measure responsiveness to user inputs. [While INP is slated to replace FID as a Core Web Vital](/inp-cwv/) in March of 2024, optimization strategies for FID tend to also apply to INP. Furthermore, INP is generally more difficult to optimize for than FID, as it tracks the full interaction latency for _all_ page interactions, not just the input delay of the first interaction as FID measures.

INP and FID tend to be most affected by JavaScript, as JavaScript is what drives most of the interactivity one experiences across the web. For both INP and FID, the amount of script resources downloaded during page load will kick off potentially expensive work involved in [script evaluation and compilation](/script-evaluation-and-long-tasks/). The less JavaScript you load during startup, the less work the browser has to do at that critical point in the page experience.

While there are strategies for reducing the _size_ of JavaScript resources downloaded during startup—such as code splitting and tree shaking—it's worth auditing the packages you use in your projects to see if they're necessary at all. For example, [lodash](https://lodash.com/) has many methods that are still useful today, but ships with methods that the browser provides out of the box, such as `Array`-specific functions for [mapping](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [reducing](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), and [filtering](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), and [many others](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array).

Progressive enhancement is also [a useful approach](/adaptive-serving-based-on-network-quality/) to JavaScript, as it enables you to serve a baseline (but still functional) experience for users that you can add to for users with more powerful devices and faster network connections. Whether you adhere to the principle of progressive enhancement or not, the point remains: Every JavaScript resource you can avoid downloading can result in an experience that responds faster to user interactions, which is a vital aspect of web performance.

## Conclusion

Auditing your website for unnecessary downloads may be just one aspect of delivering fast user experiences, but it's one that has the potential for high impact. To recap:

- Inventory your own assets and third-party assets on your pages.
- Measure the performance of each asset: its value and its technical performance.
- Determine if the resources are providing sufficient value.
- Understand the effect of unnecessary downloads on [Core Web Vitals](/vitals/) and supporting metrics.

By optimizing content efficiency in this way, you're not only improving performance overall, you're also taking care not to waste users' bandwidth, as well as potentially improving user-centric metrics and delivering a better user experience.

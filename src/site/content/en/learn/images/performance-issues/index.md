---
title: 'Key performance issues'
authors:
  - matmarquis
description: Learn ways to ensure that your image requests are as small and performant as possible. 
date: 2023-02-01
tags:
  - images
---

As it stands now, images are the web's biggest assets in terms of both [total transfer size](https://almanac.httparchive.org/en/2022/page-weight#fig-8)
and [number of requests](https://almanac.httparchive.org/en/2022/page-weight#fig-3) per page. The median webpage's total transfer size is roughly
[2MB, as of June 2022](https://httparchive.org/reports/page-weight), with images alone accounting for nearly half of that. It's no exaggeration
to say that optimizing image requests may be the single biggest performance optimization you can make.

Later, you'll learn how responsive images have evolved to help with the issues created by trying to serve one image for all eventualities.
In this section, discover key performance metrics that relate to images, and how to improve them.

## Deferring image requests

While you're about to learn a number of ways to ensure your image requests are as small and efficient as possible, the fastest image request
will always be the one that never gets made. So, right up front, I want to share what may be the most impactful change you can make to the way
you deliver image assets to your users: the `loading="lazy"` attribute.

```html
<img src="image.jpg" loading="lazy" alt="…">
```

This attribute ensures that requests for images aren't made until they fall close to the user's viewport, deferring them from the initial
page load—the time when the browser is at its busiest—and removing those requests from the critical rendering path.

Simple as it may be in practice, using this attribute can have a huge positive impact on performance: an image that never falls within
the user's viewport will never be requested, and no bandwidth will be wasted on images that the user will never see.

There's a catch, however: deferring those requests means not taking advantage of browsers' hyper-optimized processes for requesting
images as early as possible. If `loading="lazy"` is used on `img` elements toward the top of the layout—and thus more likely
to be in the user's viewport when the page is first loaded—these images can feel significantly slower to the end user.

## Priority hints

The `loading` attribute is an example of a larger web standards effort to give developers more power over how web browsers
prioritize requests.

You're likely aware of browsers' [basic approaches to fetch priority](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit#):
for example, a request for an external CSS file in the `<head>` of a document is considered essential enough to block render, while a request for an
external JavaScript file just above `</body>` will be deferred until render is complete. If the value of a `loading` attribute on an `<img>` is 'lazy',
the associated image request will be deferred until the browser determines that it will be shown to a user. Otherwise, that image will have the same
priority as any other image on the page.

The [experimental](https://caniuse.com/mdn-html_elements_img_fetchpriority) `fetchpriority` attribute is intended to give
developers [finer-grained control over the priority of assets](/priority-hints/), allowing you to flag resources
as 'high' and 'low' priority relative to resources of the same type. The use cases for `fetchpriority` are similar to the `loading`
attribute, though much more broad. For example, you might use `fetchpriority="low"` on an image only revealed following user interaction
(whether that image falls within the user's viewport or not) in order to prioritize visible images elsewhere on the page, or `fetchpriority="high"`
to prioritize an image you know will be immediately visible in the viewport as soon as the page is rendered.

Note that `fetchpriority` differs from `loading` in that it doesn't fundamentally change browser behavior. It doesn't instruct the browser
to load certain assets before others, instead giving it vital context for the decisions it makes around requesting assets.

## Measuring the impact of images

When optimizing image assets, _perceived_ performance is often more important, and more difficult to measure, than total transfer
size alone.

Web Vitals provide measurable, actionable metrics and guidance for improving users' experience of the web, highlighting problems such
as slow response time from a web server, rendering issues, and interactivity delays. Core Web Vitals are a subset of these goals, laser-focused
on the user's direct experience of an individual page—a set of technical measurements that, together, determine how fast an experience _feels_ to a user.

### Cumulative Layout Shift

[Cumulative Layout Shift](/cls/) (CLS) is a measure of visual stability. It is a metric for capturing how much
the layout of the content on a page shifts as assets are loaded and the page is rendered. Anyone that has spent a significant amount
of time using the web has lost their place in a long run of text due to a page "jumping" as a delayed webfont or image source is suddenly
rendered—or had an interactive element suddenly moved away from your pointer. A high CLS is a nuisance at best, and cause of
user error at worst—a "cancel" button shifting to a space previously occupied by a "confirm" button just as the user clicks, for example.

With high load times and the amount of space they can occupy in a layout, it stands to reason that images are a common cause
of high CLS scores.

{% Codepen {
user: 'web-dot-dev',
id: 'NWBbxqo',
height: 500,
theme: dark,
tab: 'css,result'
} %}

Thanks to relatively recent changes in modern browsers, it's easier than you might think to avoid high CLS scores due to images.

If you've been working on the frontend for a few years now, you'll be familiar with the `width` and `height` attributes on `<img>`:
prior to the widespread adoption of CSS, these were the only way to control the size of an image.

```html
<img src="image.jpg" height="200" width="400" alt="…">
```

These attributes fell out of use in an effort to keep our styling concerns separate from our markup, especially as responsive
web design made it necessary to specify percentage-based sizing via CSS. In the early days of responsive web design, "remove
the unused `width` and `height` attributes" was common advice, as the values we specified in our CSS—`max-width: 100%` and
`height: auto`—would override them.

```html
<img src="image.jpg" alt="…">
```

```css
img {
  max-width: 100%;
  height: auto;
}
```

Having removed the `height` and `width` attributes as in the previous example, the only method the browser has for determining
the height of the image in this situation is to request the source, parse it, and render it at its intrinsic aspect ratio, based the
width of the space it occupies in the layout once stylesheets have been applied. Much of this process takes place after the page has been
rendered, with the newly calculated height causing additional layout shifts.

[Starting in 2019](https://caniuse.com/mdn-html_elements_img_aspect_ratio_computed_from_attributes
), browser behavior was updated to handle the `width` and `height` attributes differently. Rather than using the values of these
attributes to determine the fixed, pixel-based size of an `img` element in the layout, these attributes can be thought to represent
the _aspect ratio_ of the image, though the syntax is the same. Modern browsers will divide these values against each other in order to
determine an `img` element's intrinsic _aspect ratio_ prior to the page being rendered, allowing it to reserve the space the image will occupy as the layout is rendered.

As a rule, you should always use `height` and `width` attributes on `<img>`, with values matching the intrinsic size of your image source—so
long as you make sure that you've specified `height: auto` alongside `max-width: 100%` to override the height from the HTML attribute.

```html
<img src="image.jpg" height="200" width="400" alt="…">
```

```css
img {
  max-width: 100%;
  height: auto;
}
```

By using the `width` and `height` attributes on your `<img>` elements, you'll avoid a high CLS score due to images.

{% Codepen {
user: 'web-dot-dev',
id: 'YzjpwyE',
height: 300,
theme: dark,
tab: 'html,result'
} %}

It's important to note that there's no downside to this approach, as it leans on long-established browser behavior—any browser
with support for basic CSS will work the way it always has, with the `height` and `width` attributes in your markup overridden by your styles.

While `width` and `height` attributes deftly avoid CLS issues by reserving the necessary layout space for your images, presenting
users with an empty gap or [low-quality placeholder](https://www.guypo.com/introducing-lqip-low-quality-image-placeholders) while
they wait for an image to transfer and render isn't ideal either. While there are things you can do to mitigate the measurable and perceptible
impact of slow-to-load images, the only way to present a fully-rendered image to a user more quickly is by reducing its transfer size.

### Largest Contentful Paint

Largest Contentful Paint (LCP) measures the time it takes to render the largest “contentful” element visible in the user's viewport—the
content element that occupies the largest percentage of the visible page. It may seem like an overly specific metric on the surface, but that
element serves as a practical proxy for the point where the majority of the page has been rendered, from the user's perspective. LCP is a vital
measure of (perceived) performance.

Metrics like `DOMContentLoaded` or the `window.onload` event can be useful for determining when the process of loading the current page
has technically completed, but they don't necessarily correspond to a user's experience of the page. A slight delay in rendering an element
outside the user's viewport would be factored into either of these metrics, but would likely go completely undetected by a real-world user.
A long LCP means the user's first impression of a page—the most important content inside the current viewport—is that the page is slow,
or broken outright.

The user perception captured by LCP has a direct impact on user experience. [An experiment done by Vodafone](/vodafone/) just last year
found that a 31% improvement in LCP not only led to 8% more sales—a strong result on its own—but of their total number of users, found a 15%
improvement in the number of visitors who became prospective customers ("visitor-to-lead rate") and a 11% improvement in the number of users
who visited their cart ("cart to visit rate").

On more than [70%](https://almanac.httparchive.org/en/2021/media#images) of webpages, the largest element in the initial
viewport involves an image, either as a stand-along `<img>` element or an element with a background image. In other words,
70% of pages' LCP scores are based on image performance. It doesn't take much imagination to see why: big, attention-grabbing
images and logos are very likely to be found "above the fold."

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/KrYcABGs7oYi9oHHZPJW.png", alt="LCP highlighted in the console of a web.dev page", width="800", height="407" %}

There are a few steps you can take to avoid LCP delays: first, never specify `loading="lazy"` on an "above the fold" image,
as delaying the request until after the page has been rendered will likely have a massive negative impact on your LCP score.
Second, using `fetchpriority="high"` can inform the browser that the transfer of this image should be prioritized above images elsewhere on the page.

With those rules squarely in mind, the most important thing you can do to improve a page's LCP score is reduce the amount of time
it takes to transfer and render those images. In order to do that, you'll need to keep your image sources as small and efficient as
possible (without sacrificing their quality, of course) and ensure that users are only getting the image assets that make the most
sense for their browsing contexts.

### Conclusion

Images assets are the biggest drain on your users' bandwidth—bandwidth taken away from transferring every other asset necessary
to render a page. Images introduce significant issues in terms of perceived performance, both during and after the surrounding page
layout has been rendered. In short: image assets do _damage_.

Daunting as that may be, while "the web would be better off with fewer images" would certainly be true in terms of performance alone,
it would also do its users a tremendous disservice. Images are a vital part of the web, and you shouldn't compromise on the quality of
meaningful content for the sake of performance alone.

In the rest of this course, you'll learn about the technologies that power our image assets and techniques for mitigating their
performance impacts, without compromising on quality.

---
layout: post
title: Best practices for carousels
subhead: Optimize carousels for performance and usability.
authors:
  - katiehempenius
description:  Learn how to optimize carousels for performance and usability.
date: 2021-01-26
hero: image/admin/i7tjE04MYo7xJOZKkyQI.jpg
tags:
  - blog
  - fast
  - performance
  - web-vitals
---

A carousel is a UX component that displays content in slideshow-like manner.
Carousels can "autoplay" or be navigated manually by users. Although carousels
can be used elsewhere, they are most frequently used to display images,
products, and promotions on homepages.

This article discusses performance and UX best practices for carousels.

<figure class="w-figure">
  {% Img src="image/admin/u2FlXalClwBeDOBBiwxu.png", alt="Image showing a carousel", width="629", height="420", class="w-screenshot" %}
</figure>

## Performance

A well-implemented carousel, in and of itself, should have very minimal or no
impact on performance. However, carousels often contain large media assets.
Large assets can impact performance regardless of whether they are displayed in
a carousel or elsewhere.


*   **LCP (Largest Contentful Paint)**

    Large, above-the-fold carousels often contain the page's LCP element, and
    therefore can have a significant impact on LCP. In these scenarios,
    optimizing the carousel may significantly improve LCP. For an in-depth
    explanation of how LCP measurement works on pages containing carousels,
    refer to the [LCP measurement for carousels](#lcp-measurement-for-carousels)
    section.

*   **FID (First Input Delay)**

    Carousels have minimal JavaScript requirements and therefore should not
    impact page interactivity. If you discover that your site's carousel has
    long-running scripts, you should consider replacing your carousel tooling.

*   **CLS (Cumulative Layout Shift)**

    A surprising number of carousels use janky, non-composited animations that
    can contribute to CLS. On pages with autoplaying carousels, this has the
    potential to cause infinite CLS. This type of CLS typically isn't apparent
    to the human eye, which makes the issue easy to overlook. To avoid this
    issue, [avoid using non-composited animations](/non-composited-animations/)
    in your carousel (for example, during slide transitions).


## Performance best practices

### Load carousel content using HTML

Carousel content should be loaded via the page's HTML markup so that it is
discoverable by the browser early in the page load process. Using JavaScript to
initiate the loading of carousel content is probably the single biggest
performance mistake to avoid when using carousels. This delays image loading and
can negatively impact LCP.


{% Compare 'better' %}
```html
<div class="slides">
  <img src="https://example.com/cat1.jpg">
  <img src="https://example.com/cat2.jpg">
  <img src="https://example.com/cat3.jpg">
</div>
```

{% endCompare %}

{% Compare 'worse' %}
```javascript
const slides = document.querySelector(".slides");
const newSlide = document.createElement("img");
newSlide.src = "htttp://example.com/cat1.jpg";
slides.appendChild(newSlide);
```

{% endCompare %}

For advanced carousel optimization, consider loading the first slide statically,
then progressively enhancing it to include navigation controls and additional
content. This technique is most applicable to environments where you have a
user's prolonged attention—this gives the additional content time to load. In
environments like home pages, where users may only stick around for a second or
two, only loading a single image may be similarly effective.


### Avoid layout shifts

{% Aside %}

Chrome 88-90 shipped a variety of [bug
fixes](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/cls.md)
related to how layout shifts are calculated. Many of these bug fixes are
relevant to carousels. As a result of these fixes, sites should expect to see
lower carousel-related layout shift scores in later versions of Chrome.

{% endAside %}


Slide transitions and navigation controls are the two most common sources of
layout shifts in carousels:


- **Slide transitions:** Layout shifts that occur during slide transitions are
  usually caused by updating the layout-inducing properties of DOM elements.
  Examples of some of these properties include: `left`, `top`, `width`, and
  `marginTop`. To avoid layout shifts, instead use the CSS
  [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
  property to transition these elements. This
  [demo](https://glitch.com/~basic-carousel) shows how to use `transform` to
  build a basic carousel.

- **Navigation controls:** Moving or adding/removing carousel navigation
  controls from the DOM can cause layout shifts depending on how these changes
  are implemented. Carousels that exhibit this behavior typically do so in
  response to user hover.

These are some of the common points of confusion regarding CLS measurement for
carousels:

- **Autoplay carousels:** Slide transitions are the most common source of
  carousel-related layout shifts. In a non-autoplay carousel these layout shifts
  typically occur within 500ms of a user interaction and [therefore do not count
  towards Cumulative Layout Shift
  (CLS)](/cls/#expected-vs.-unexpected-layout-shifts). However,
  for autoplay carousels, not only can these layout shifts potentially count
  towards CLS - but they can also repeat indefinitely. Thus, it is particularly
  important to verify that an autoplay carousel is not a source of layout
  shifts.

- **Scrolling:** Some carousels allow users to use scrolling to navigate through
  carousel slides. If an element's start position changes but its scroll offset
  (that is,
  [`scrollLeft`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft)
  or
  [`scrollTop`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop))
  changes by the same amount (but in the opposite direction) this is not
  considered a layout shift provided that they occur in the same frame.

For more information on layout shifts, see [Debug layout
shifts](/debug-layout-shifts/#identifying-the-cause-of-a-layout-shift).


### Use modern technology

Many sites use [third-party JavaScript](/third-party-javascript) libraries to
implement carousels. If you currently use older carousel tooling, you may be
able to improve performance by switching to newer tooling. Newer tools tend to
use more efficient APIs and are less likely to require additional dependencies
like jQuery.


However, dependng on the type of carousel you are building, you may not need
JavaScript at all. The new [Scroll
Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap) API
makes it possible to implement carousel-like transitions using only HTML and
CSS.

Here are some resources on using `scroll-snap` that you may find helpful:

*   [Building a Stories component (web.dev)](/building-a-stories-component/)
*   [Next-generation web styling: scroll snap (web.dev)](/next-gen-css-2019/#scroll-snap)
*   [CSS-Only Carousel (CSS Tricks)](https://css-tricks.com/css-only-carousel/)
*   [How to Make a CSS-Only Carousel (CSS Tricks)](https://css-tricks.com/how-to-make-a-css-only-carousel/)


### Optimize carousel content

Carousels often contain some of a site's largest images, so it can be worth your
time to make sure that these images are fully optimized. Choosing the right
image format and compression level, [using an image CDN](/image-cdns), and
[using srcset to serve multiple image
versions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap) are
all techniques that can reduce the transfer size of images.


## Performance measurement

This section discusses LCP measurement as it relates to carousels. Although
carousels are treated no differently than any other UX element during LCP
calculation, the mechanics of calculating LCP for autoplaying carousels is a
common point of confusion.


### LCP measurement for carousels

These are the key points to understanding how LCP calculation works for carousels:


*   LCP considers page elements as they are painted to the frame. New candidates
    for the LCP element are no longer considered once the user interacts (taps,
    scrolls, or keypresses) with the page. Thus, any slide in an autoplaying
    carousel has the potential to be the final LCP element—whereas in a static
    carousel only the first slide would be a potential LCP candidate.
*   If two equally sized images are rendered, the first image will be considered
    the LCP element. The LCP element is only updated when the LCP candidate is
    larger than the current LCP element. Thus, if all carousel elements are
    equally sized, the LCP element should be the first image that is displayed.
*   When evaluating LCP candidates, LCP considers the "[visible size or the
    intrinsic size, whichever is smaller](/lcp)." Thus, if an autoplaying
    carousel displays images at a consistent size, but contains images of
    varying [intrinsic
    sizes](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)
    that are smaller than the display size, the LCP element may change as new
    slides are displayed. In this case, if all images are displayed at the same
    size, the image with the largest intrinsic size will be considered the LCP
    element. To keep LCP low, you should ensure that all items in an autoplaying
    carousel are the same intrinsic size.


### Changes to LCP calculation for carousels in Chrome 88

As of [Chrome
88](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md),
images that are later removed from the DOM are considered as potential largest
contentful paints. Prior to Chrome 88, these images were excluded from
consideration. For sites that use autoplaying carousels, this definition change
will either have a neutral or positive impact on LCP scores.

This change was made in response to the
[observation](https://github.com/anniesullie/LCP_Examples/tree/master/removed_from_dom)
that many sites implement carousel transitions by removing the previously
displayed image from the DOM tree. Prior to Chrome 88, each time that a new
slide was presented, the removal of the previous element would trigger an LCP
update. This change only affects autoplaying carousels-by definition, potential
largest contentful paints can only occur before a user first interacts with the
page.


## Other considerations

This section discusses UX and product best practices that you should keep in
mind when implementing carousels. Carousels should advance your business goals
and present content in a way that is easy to navigate and read.


### Navigation best practices


#### Provide prominent navigation controls

Carousel navigation controls should be easy to click and highly visible. This is
something that is rarely done well-most carousels have navigation controls that
are both small and subtle. Keep in mind that a single color or style of
navigation control will rarely work in all situations. For example, an arrow
that is clearly visible against a dark background might be difficult to see
against a light background.


#### Indicate navigation progress

Carousel navigation controls should provide context about the total number of
slides and the user's progress through them. This information makes it easier
for the user to navigate to a particular slide and understand which content has
already been viewed. In some situations providing a preview of upcoming
content—whether it be an excerpt of the next slide or a list of thumbnails-can
also be helpful and increase engagement.


#### Support mobile gestures

On mobile, swipe gestures should be supported in addition to traditional
navigation controls (such as on screen buttons).


#### Provide alternate navigation paths

Because it's unlikely that most users will engage with all carousel content, the
content that carousel slides link to should be accessible from other navigation
paths.


### Readability best practices


#### Don't use autoplay

The use of autoplay creates two almost paradoxical problems: on-screen
animations tend to distract users and move the eyes away from more important
content; simultaneously, because users often associate animations with ads, they
will ignore carousels that autoplay.

Thus, it's a rare that autoplay is a good choice. If content is important, not
using autoplay will maximize its exposure; if carousel content is not important,
then the use of autoplay will detract from more important content. In addition,
autoplaying carousels can be difficult to read (and annoying, too). People read
at different speeds, so it's rare that a carousel consistently transitions at
the "right" time for different users.


Ideally, slide navigation should be user-directed via navigation controls. If
you must use autoplay, autoplay should be disabled on user hover. In addition,
the slide transition rate should take slide content into account-the more text
that a slide contains, the longer it should be displayed on screen.


#### Keep text and images separate

Carousel text content is often "baked into" the corresponding image file, rather
than displayed separately using HTML markup. This approach is bad for
accessibility, localization, and compression rates. It also encourages a
one-size-fits-all approach to asset creation. However, the same image and text
formatting is rarely equally readable across desktop and mobile formats.


#### Be concise

You only have a fraction of a second to catch a user's attention. Short,
to-the-point copy will increase the odds that your message gets across.


### Product best practices

Carousels work well in situations where using additional vertical space to
display additional content is not an option. Carousels on product pages are
often a good example of this use case.

However, carousels are not always used effectively.


*   Carousels, particularly if they contain promotions or advance automatically,
    are easily [mistaken](https://www.nngroup.com/articles/auto-forwarding/) for
    advertisements by users. Users tend to ignore advertisements—a phenomenon
    known as [banner
    blindness](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/).
*   Carousels are often used to placate multiple departments and avoid making
    decisions about business priorities. As a result, carousels can easily turn
    into a dumping ground for ineffective content.


#### Test your assumptions

The business impact of carousels, particularly those on homepages, should be
evaluated and tested. Carousel clickthrough rates can help you determine whether
a carousel and its content is effective.


#### Be relevant

Carousels work best when they contain interesting and relevant content that is
presented with a clear context. If content wouldn't engage a user outside of a
carousel—placing it in a carousel won't make it perform any better. If you must
use a carousel, prioritize content and ensure that each slide is sufficiently
relevant that a user would want to click through to the subsequent slide.

---
title: CSS for Web Vitals
subhead: CSS-related techniques for optimizing Web Vitals
authors:
  - katiehempenius
  - una
date: 2021-06-02
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/uq7JQlKJo7KBETXnVuTf.jpg
alt: Multi-colored gradient

description:
  This article covers CSS-related techniques for optimizing Web Vitals.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - css
---

The way you write your styles and build layouts can have a major impact on [Core
Web Vitals](/learn-core-web-vitals/). This is particularly true for
[Cumulative Layout Shift (CLS)](/cls) and [Largest Contentful
Paint (LCP)](/lcp).

This article covers CSS-related techniques for optimizing Web Vitals. These
optimizations are broken down by different aspects of a page: layout, images,
fonts, animations, and loading. Along the way, we'll explore improving an
[example page](https://codepen.io/una/pen/vYyLKvY):



{% Img
  src="image/j2RDdG43oidUy6AL6LovThjeX9c2/pgmpMOmweK7BVBsVkQ5g.png",
  alt="Screenshot of example site",
  width="800",
  height="646"
%}


## Layout


### Inserting content into the DOM

Inserting content into a page after the surrounding content has already loaded
pushes everything else on the page down. This causes [layout
shifts](/cls/#layout-shifts-in-detail).

[Cookie notices](/cookie-notice-best-practices/), particularly
those placed at the top of the page, are a common example of this problem. Other
page elements that often cause this type of layout shift when they load include
ads and embeds.


#### Identify

The Lighthouse "Avoid large layout shifts" audit identifies page elements that
have shifted. For this demo, the results look like this:



{% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/jaHtgwzDXCjx3vAFOO33.png",
    alt="Lighthouse's 'Avoid large layout shifts' audit",
    width="800",
    height="500"
%}


The cookie notice is not listed in these findings because the cookie notice
itself isn't shifting when it loads. Rather, it causes the items below it on the
page (that is, `div.hero` and `article`) to shift. For more information on
identifying and fixing layout shifts, see [Debugging Layout
Shifts](/debugging-layout-shifts).

{% Aside %}

Lighthouse only analyzes a page's performance up until the "page load" event.
Cookie banners, ads, and other widgets sometimes do not load until after page
load. These layout shifts still affect users—even if they are not flagged by
Lighthouse.

{% endAside %}


#### Fix

Place the cookie notice at the bottom of the page using absolute or fixed
positioning.



{% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/YBYLT9jJ9AXrbsaRNVoa.png",
    alt="Cookie notice displayed at bottom of page",
    width="800",
    height="656"
%}


Before:

```css
.banner {
  position: sticky;
  top: 0;
}
```

After:

```css
.banner {
  position: fixed;
  bottom: 0;
}
```

Another way to fix this layout shift would be to reserve space for the cookie
notice at the top of the screen. This approach is equally effective. For more
information, see [Cookie notice best
practices](/cookie-notice-best-practices/).

{% Aside %}

The cookie notice is one of multiple page elements that are triggering layout
shifts when it loads. To help us get a closer look at these page elements,
subsequent demo steps will not include the cookie notice.

{% endAside %}


## Images


### Images and Largest Contentful Paint (LCP)

Images are commonly the Largest Contentful Paint (LCP) element on a page. Other
[page elements that can be the LCP
element](/lcp/#what-elements-are-considered) include text blocks
and video poster images. The time at which the LCP element loads determines LCP.

It's important to note that a page's LCP element can vary from page load to page
load depending on the content that is visible to the user when the page is first
displayed. For example, in this demo, the background of the cookie notice, the
hero image, and the article text are some of the potential LCP elements.



{% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bMoAoohyLOgTqV6B7lHr.png",
    alt="Diagram highlighting the page's LCP element in different scenarios.",
    width="800",
    height="498"
%}


In the example site, the background image of the cookie notice is actually a
large image. To improve LCP, you could instead paint the gradient in CSS, rather
than load an image to create the effect.


#### Fix



Change the `.banner` CSS to use a CSS gradient rather than an image:

Before:

```css
background: url("https://cdn.pixabay.com/photo/2015/07/15/06/14/gradient-845701\_960\_720.jpg")
```

After:

```css
background: linear-gradient(135deg, #fbc6ff 20%, #bdfff9 90%);
```


### Images and layout shifts

Browsers can only determine the size of an image once the image loads. If the
image load occurs after the page has been rendered, but no space has been
reserved for the image, a layout shift occurs when the image appears. In the
demo, the hero image is causing a layout shift when it loads.

{% Aside %}
The phenomenon of images causing layout shifts is more obvious in
situations where images are slow to load - for example, on a slow connection or
when loading an image with a particularly large file size.
{% endAside %}

#### Identify

To identify images without explicit `width` and `height`, use Lighthouse's
"Image elements have explicit width and height" audit.



{% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wDGRVi7JaUOTjD9ODOk9.png",
    alt="Lighthouse's 'Image elements have explicit width and height' audit",
    width="800",
    height="274"
%}


In this example, both the hero image and article image are missing `width` and
`height` attributes.


#### Fix

Set the `width` and `height` attributes on these images to avoid layout shifts.

Before:

```html
<img src="https://source.unsplash.com/random/2000x600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" alt="image to load in">
```

After:

```html
<img src="https://source.unsplash.com/random/2000x600" width="2000" height="600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" width="800" height="600" alt="image to load in">
```


<figure>
  {% Video src="video/j2RDdG43oidUy6AL6LovThjeX9c2/fLUscMGOlGhKnNHef2py.mp4" %}
  <figcaption>
    The image now loads without causing a layout shift.
  </figcaption>
</figure>


{% Aside %}
Another approach to loading images is to use the
[`srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)
and
[`sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)
attributes in conjunction with specifying `width` and `height` attributes. This
has the additional performance advantage of allowing you to serve different
sized images to different devices. For more information, see [Serve responsive
images](/serve-responsive-images/).
{% endAside %}


## Fonts

Fonts can delay text rendering and cause layout shifts. As a result, it is
important to deliver fonts quickly.

### Delayed text rendering

By default, a browser will not immediately render a text element if its
associated web fonts have not loaded yet. This is done to prevent a ["flash of
unstyled text" (FOUT)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).
In many situations, this delays [First Contentful Paint
(FCP)](/fcp). In some situations, this delays Largest Contentful
Paint (LCP).

{% Aside %}

By default, Chromium-based and Firefox browsers will [block text rendering for
up to 3 seconds](https://developer.chrome.com/blog/font-display/)
if the associated web font has not loaded; Safari will block text rendering
indefinitely. The [block
period](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#the_font_display_timeline)
begins when the browser requests a web font. If the font has still not loaded by
the end of the block period, the browser will render the text using a fallback
font and swap in the web font once available.

{% endAside %}

### Layout shifts

Font swapping, while excellent for displaying content to the user quickly, has
the potential to cause layout shifts. These layout shifts occur when a web font
and its fallback font take up different amounts of space on the page. Using
similarly proportioned fonts will minimize the size of these layout shifts.

<figure>
  {% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png",
    alt="Diagram showing a layout shift caused by a font swap",
    width="800",
    height="452"
  %}
  <figcaption>
    In this example, font swapping caused page elements to shift upwards by five pixels.
  </figcaption>
</figure>

#### Identify

To see the fonts that are being loaded on a particular page, open the
**Network** tab in DevTools and filter by **Font**. Fonts can be large files, so
only using fewer fonts is generally better for performance.

{% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Ts38bQtR6x0SDgufA9vz.png",
    alt="Screenshot of a font displayed in DevTools",
    width="800",
    height="252"
%}


To see how long it takes for the font to be requested, click on the **Timing**
tab. The sooner that a font is requested, the sooner it can be loaded and used.

{% Img
  src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wfS7qVThKMkGA7SHd439.png",
  alt="Screenshot of 'Timing' tab in DevTools",
  width="800",
  height="340"
%}


To see the request chain for a font, click on the  **Initiator** tab.
Generally speaking, the shorter the request chain, the sooner the font can be
requested.

{% Img
  src="image/j2RDdG43oidUy6AL6LovThjeX9c2/0tau1GQnZfj5vPhzwnIQ.png",
  alt="Screenshot of 'Initiator' tab in DevTools",
  width="800",
  height="189"
%}

#### Fix

This demo uses the Google Fonts API. Google Fonts provides the option to load
fonts via `<link>` tags or an `@import` statement. The `<link>` code snippet
includes a `preconnect` resource hint. This should result in faster
stylesheet delivery than using the `@import` version.

At a very high-level, you can think of [resource
hints](https://www.w3.org/TR/resource-hints/#resource-hints) as a way to hint
to the browser that it will need to set up a particular connection or download a
particular resource. As a result, the browser will prioritize these actions.
When using resource hints, keep in mind that prioritizing a particular action
takes away browser resources from other actions. Thus, resource hints should be
used thoughtfully and not for everything. For more information, see [Establish
network connections early to improve perceived page
speed](/preconnect-and-dns-prefetch/).

Remove the following `@import` statement from your stylesheet:

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&family=Roboto:wght@300&display=swap');
```

Add the following `<link>` tags to the `<head>` of the document:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
```

These link tags instruct the browser to establish an early connection to
the origins used by Google Fonts and to load the stylesheet that
contains the font declaration for Montserrat and Roboto. These `<link>` tags
should be placed as early in the `<head>` as possible.


{% Aside %}

To only load a subset of a font from Google Fonts, add the
[`?text=`](https://developers.google.com/fonts/docs/getting_started) API
parameter. For example, `?text=ABC` loads only the characters necessary to
render "ABC". This is a good way to reduce the file size of a font.

{% endAside %}


## Animations

The primary way that animations affect Web Vitals is when they cause layout
shifts. There are two types of animations that you should avoid using:
[animations that trigger layout](/animations-guide/#triggers) and
"animation-like" effects that move page elements. Typically these animations can
be replaced with more performant equivalents by using CSS properties like
[`transform`](https://developer.mozilla.org/docs/Web/CSS/transform),
[`opacity`](https://developer.mozilla.org/docs/Web/CSS/opacity), and
[`filter`](https://developer.mozilla.org/docs/Web/CSS/filter). For more
information, see [How to create high-performance CSS
animations](/animations/).


### Identify

The Lighthouse "Avoid non-composited animations" audit may be helpful for
identifying non-performant animations.



{% Img
    src="image/j2RDdG43oidUy6AL6LovThjeX9c2/mXgypW9x3qgvmWDLbIZx.png",
    alt="Lighthouse's 'Avoid non-composited animations' audit",
    width="512",
    height="132"
%}


{% Aside 'caution' %}

The Lighthouse "Avoid non-composited animations" audit only identifies
non-performant _CSS animations_; JavaScript-driven animations (for example,
using
[`setInterval()`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
to "animate" an element) are bad for performance but will not be flagged by this
audit.

{% endAside %}


### Fix

Change the `slideIn` animation sequence to use `transform: translateX()` rather
than transitioning the`margin-left` property.

Before:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}
```

After:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
```


## Critical CSS

Stylesheets are render-blocking. This means that the browser encounters a
stylesheet, it will stop downloading other resources until the browser has
downloaded and parsed the stylesheet. This may delay LCP. To improve
performance, consider [removing unused
CSS](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/),
[inlining critical CSS](/extract-critical-css/), and [deferring
non-critical CSS](/defer-non-critical-css/#optimize).


## Conclusion

Although there is still room for further improvements (for example, using [image
compression](/use-imagemin-to-compress-images/) to deliver images
more quickly), these changes have significantly improved the Web Vitals of this
site. If this were a real site, the next step would be to [collect performance
data from real
users](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data)
to assess whether it is [meeting the Web Vitals thresholds for most
users](/vitals-measurement-getting-started/#data-interpretation).
For more information about Web Vitals, see [Learn Web
Vitals](/learn-core-web-vitals/).

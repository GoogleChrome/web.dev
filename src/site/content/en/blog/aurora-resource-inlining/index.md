---
title: 'Resource inlining in JavaScript frameworks'
subhead: Improving Largest Contentful Paint across the JavaScript ecosystem.
authors:
  - mgechev
date: 2021-06-28
hero: image/S838B7UEsdXmwrD8q5gvNlWTHHP2/yXASsFeUg39y0K7aFJIY.jpg
alt: A labyrinth.
description: Learn about the latest optimizations implemented in JavaScript frameworks in collaboration with project Aurora.
tags:
  - blog
  - angular
  - web-vitals
---

As part of project [Aurora](/introducing-aurora/), Google has been working with popular web
frameworks to ensure they perform well according to [Core Web Vitals](/vitals). Angular and Next.js
have already landed font inlining, which is explained in the first part of this article. The second
optimization we will cover is critical CSS inlining which is now enabled by default in Angular CLI
and has a work in progress implementation in Nuxt.js.

## Font inlining

After analyzing hundreds of applications, the Aurora team found that developers often include fonts
in their applications by referencing them in the `<head>` element of `index.html`. Here's an example
of how this would look like when including Material Icons:

```html
<!doctype html>
<html lang="en">
<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  ...
</html>
```
Even though this pattern is completely valid and functional, it blocks the application's rendering
and introduces an extra request. To better understand what is going on, take a look at the source
code of the stylesheet referenced in the HTML above:

```css
/* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/font.woff2) format('woff2');
}

.material-icons {
  /*...*/
}
```
Notice how the `font-face` definition references an external file hosted on `fonts.gstatic.com`.
When loading the application, the browser first has to download the original stylesheet referenced
in the head.

<figure class="w-figure">
  {% Img
  src="image/S838B7UEsdXmwrD8q5gvNlWTHHP2/46NStJqOoW7xsrDe12Uf.png",
  alt="An image showing how the website has to make a request to the server and download the external stylesheet",
  width="800", height="267" %}
  <figcaption class="w-figcaption">First, the website loads the font stylesheet.</figcaption>
</figure>

Next, the browser downloads the `woff2` file, then finally, it's able to proceed with rendering the
application.

<figure class="w-figure">
  {% Img src="image/S838B7UEsdXmwrD8q5gvNlWTHHP2/V1uQUNEvw4vHwAW1ekPk.png",
  alt="An image showing the two requests made, one for the font stylesheet, the second for the font file.",
  width="800", height="281" %}
  <figcaption class="w-figcaption">Next, a request is made to load the font.</figcaption>
</figure>

An opportunity for optimization is to download the initial stylesheet at build time and inline it in
`index.html`. This skips an entire round trip to the CDN at runtime, reducing the blocking time.

When building the application, a request is sent to the CDN, this fetches the stylesheet and inlines
it in the HTML file, adding a `<link rel=preconnect>` to the domain. Applying this technique, we'd
get the following result:

```html
<!doctype html>
<html lang="en">
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin >
  <style type="text/css">
  @font-face{font-family:'Material Icons';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/font.woff2) format('woff2');}.material-icons{/*...*/}</style>
  ...
</html>
```

### Font inlining is now available in Next.js and Angular

When framework developers implement optimization in the underlying tooling, they make it easier for
existing and new applications to enable it, bringing the improvement to the entire ecosystem.

This improvement is enabled by default from Next.js v10.2 and Angular v11. Both have support for
inlining Google and Adobe fonts. Angular is expecting to introduce the latter in v12.2.

You can find the implementation of [font inlining in Next.js on
GitHub](https://github.com/vercel/next.js/pull/14746), and check out the [video explaining this optimization in the
context of Angular](https://www.youtube.com/watch?v=yOpy9UMQG-Y).

## Inlining critical CSS

Another enhancement involves improving the [First Contentful Paint (FCP)](/fcp) and [Largest
Contentful Paint (LCP)](/lcp) metrics by inlining critical CSS. The critical CSS of a page includes
all of the styles used at its initial rendering. To learn more about the topic, check out
[Defer non-critical CSS](/defer-non-critical-css/).

We observed that many applications are loading styles synchronously, which blocks application
rendering. A quick fix is to load the styles asynchronously. Rather than loading the scripts with
`media="all"`, set the value of the `media` attribute to `print`, and once the loading completes,
replace the attribute value to `all`:

```html
<link rel="stylesheet" href="..." media="print" onload="this.media='all'">
```

This practice, however, can cause flickering of unstyled content.

<figure class="w-figcaption">
  {% Video
    src=["video/S838B7UEsdXmwrD8q5gvNlWTHHP2/6ZSZwK3Z0bzK90aunxrW.mp4"],
    autoplay=true,
    loop=true,
    muted=true,
    playsinline=true
  %}
  <figcaption style="text-align: center;">
    The page appears to flicker as the styles load in.
  </figcaption>
</figure>

The video above shows the rendering of a page, which loads its styles asynchronously. The flicker
happens because the browser first starts downloading the styles, then renders the HTML which
follows. Once the browser downloads the styles, it triggers the `onload` event of the link element,
updating the `media` attribute to `all`, and applies the styles to the DOM.

During the time between rendering the HTML and applying the styles the page is partially unstyled.
When the browser uses the styles, we see flickering, which is a bad user experience and results in
regressions in [Cumulative Layout Shift (CLS)](/cls/).

[Critical CSS inlining](/extract-critical-css/), along with asynchronous style loading, can improve
the loading behavior. The [critters](http://npmjs.com/package/critters) tool finds which styles are
used on the page, by looking at the selectors in a stylesheet and matching them against the HTML.
When it finds a match, it considers the corresponding styles as part of the critical CSS, and
inlines them.

Let's look at an example:

{% Compare 'worse', 'Example before inlining' %}
```html
<head>
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
<section>
 <button class="primary"></button>
</section>
```

```css
/* styles.css */
section button.primary {
  /* ... */
}
.list {
  /* ... */
}
```
{% endCompare %}

In the example above, critters will read and parse the content of `styles.css`, after that it
matches the two selectors against the HTML and discovers that we use `section button.primary`.
Finally critters will inline the corresponding styles in the `<head>` of the page resulting in:

{% Compare 'better', 'Example after inlining' %}
```html
<head>
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
<style>
section button.primary {
  /* ... */
}
</style>
</head>
<section>
 <button class="primary"></button>
</section>
```
{% endCompare %}

After inlining the critical CSS in the HTML you will find that the flickering of the page is gone:

<figure class="w-figcaption">
  {% Video
    src=["video/S838B7UEsdXmwrD8q5gvNlWTHHP2/TPbZ9TZiDzFEYfybaPoz.mp4"],
    autoplay=true,
    loop=true,
    muted=true,
    playsinline=true
  %}
  <figcaption style="text-align: center;">
    The page loading after CSS inlining.
  </figcaption>
</figure>

Critical CSS inlining is now available in Angular and enabled by default in v12. If you're on v11,
turn it on by [setting the `inlineCritical` property to
`true`](https://angular.io/guide/workspace-config#styles-optimization-options) in `angular.json`. To
opt into this feature in Next.js add `experimental: { optimizeCss: true }` to your `next.config.js`.

{% Aside %} Enabling the critical CSS and font inlining on angular.io improved the Lighthouse score
by 27 points on a slow 3G network. {% endAside %}

## Conclusions

In this post we touched on some of the collaboration between Chrome and web frameworks. If you're a
framework author and recognize some of the problems we tackled in your technology, we hope our
findings inspire you to apply similar performance optimizations.

Find out more about the improvements at [web.dev/aurora](/aurora). You can find a comprehensive list
of the optimization work we've been doing for Core Web Vitals in the post [Introducing
Aurora](/introducing-aurora/#what-has-our-work-unlocked-so-far).

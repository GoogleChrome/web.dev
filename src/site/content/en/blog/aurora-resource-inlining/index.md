---
title: 'Resource Inlining in JavaScript frameworks'
subhead: Improving Largest Contentful Paint across the JavaScript ecosystem.
authors:
  - mgechev
date: 2021-06-28
hero: image/S838B7UEsdXmwrD8q5gvNlWTHHP2/yXASsFeUg39y0K7aFJIY.jpg
alt: A labyrinth.
description: Learn what are the latest optimizations JavaScript frameworks implemented in collaboration with project Aurora.
tags:
  - blog
  - angular
  - next.js
  - nuxt.js
  - cwv
  - lcp
---

As part of project [Aurora](/introducing-aurora/), Google has been working with popular Web
frameworks to ensure they perform well according to [Core Web Vitals](/vitals). Angular and Next.js
have already landed font inline, which is explained in the first part of this article. The second
optimization we will cover is critical CSS inlining which is now enabled by default in Angular CLI
and has a work in progress implementation in Nuxt.js.

## Font inlining

After analyzing hundreds of applications, our team found that developers often include fonts in
their applications by referencing them in the `<head>` element of `index.html`. Here's an example of
how this would look like by including Material Icons:

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
code of the stylesheet referenced in `index.html` above:

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

Next, the browser downloads the `woff2` file, then finally, it's able to proceed with rendering the application.

<figure class="w-figure">
  {% Img src="image/S838B7UEsdXmwrD8q5gvNlWTHHP2/V1uQUNEvw4vHwAW1ekPk.png",
  alt="An image showing the two requests made, one for the font stylesheet, the second for the font file.",
  width="800", height="281" %}
  <figcaption class="w-figcaption">Next, a request is made to load the font.</figcaption>
</figure>

An opportunity for optimization is to download the initial stylesheet at build time and inline it in
`index.html`. This skips an entire round trip to the CDN at runtime, reducing the blocking time.

When building the application, a request is sent to the CDN, this fetches the stylesheet and inlines
it in `index.html`, adding a `<link rel=preconnect>` to the domain. Applying this technique, we'd
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
Google and Adobe fonts inlining. Angular is expecting to introduce the latter in v12.2.

You can find the implementation of [font inlining in Next.js on
GitHub](https://github.com/vercel/next.js/pull/14746), and learn more about the optimization in the
context of Angular in this [video](https://www.youtube.com/watch?v=yOpy9UMQG-Y).

## Inlining critical CSS

Another enhancement involves improving the [First Contentful Paint (FCP)](/fcp) and [Largest
Contentful Paint (LCP)](/lcp) metrics by inlining critical CSS. We define the critical CSS of a page
as all the styles that are used at its initial rendering. You can read more about the topic in the
article [Defer non-critical CSS](/defer-non-critical-css/).

We observed that many applications are loading styles synchronously, which blocks application
rendering. A quick fix is to load the styles asynchronously. Rather than loading the scripts with
`media="all"`, set the value of the media attribute to print, and once the loading completes,
replace the attribute value to all:

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
happens because the browser first starts downloading the styles, then renders the HTML
which follows. Once the browser downloads the styles, it triggers the `onload` event of the link
element, updating the `media` attribute to `all`, and applies the styles to the DOM.

During the time between rendering the HTML and applying the styles the page is partially unstyled.
When the browser uses the styles, we see flickering, which is a bad user experience and results in
regressions in [Cumulative Layout Shift (CLS)](/cls/).

To improve the loading behavior, together with asynchronous style loading, we use [critical CSS
inlining](/extract-critical-css/). The [critters](http://npmjs.com/package/critters) tool can find
which styles are used on the page, by looking at the selectors in a stylesheet and matching them
against the HTML. When it finds a match, it considers the corresponding styles as part of the
critical CSS, and inlines them.

Let's look at an example:

```html
<head>
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
<style>
section button.primary {
  /* ... */
}
</style>
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
In the example above, critters will read and parse the content of `styles.css`, after that it
matches the two selectors against the HTML and discovers that we use `select button.primary`.
Finally critters will inline the corresponding styles in the `<head>` of the page resulting in:

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

Critical CSS inlining is now available in Angular and enabled by default in v12. If you're on v11,
you can turn it on by [setting the `inlineCritical` property to
`true`](https://angular.io/guide/workspace-config#styles-optimization-options) in `angular.json`. To
opt into this feature in Next.js add `experimental: { optimizeCss: true }` to your `next.config.js`.

{% Aside %} Enabling the critical CSS and font inlining on angular.io improved the Lighthouse score
by 27 points on a slow 3G network. {% endAside %}

## Conclusions

In this post we touched on some of the collaboration between Chrome and Web frameworks. If you're a
framework author and you recognize some of the problems we tackled in your technology, we hope our
findings would inspire you to apply similar performance optimizations.

For a comprehensive list of the improvements we've been working on check web.dev/aurora. There you
can find a comprehensive list of the work we've been doing in the space of optimization for Core Web
Vitals in the post [Introducing Aurora](/introducing-aurora/#what-has-our-work-unlocked-so-far).

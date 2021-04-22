---
layout: post
title: Preloading responsive images
subhead: Starting in Chrome 73, link rel="preload" and responsive images can be combined in order to load images faster.
authors:
  - yoavweiss
description: |
  Learn about new and exciting possibilities for preloading responsive images to ensure great user experience.
hero: image/admin/QDCTiiyXE11bYSZMP3Yt.jpg
alt: A wall with a bunch of image frames in different sizes.
date: 2019-09-30
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - images
feedback:
  - api
---

This article gives me an opportunity to discuss two of my favorite things: responsive images *and* preload. As someone who was heavily involved in developing both of those features, I'm super excited to see them working together!

## Responsive images overview

Suppose you're browsing the web on a screen that's 300 pixels wide, and the page just requested an image that's 1500 pixels wide. That page just wasted a lot of your cellular data because your screen can't do anything with all of that extra resolution. Ideally, the browser should fetch a version of the image that's just a *little* wider than your screen size, say 325 pixels. This ensures a high-resolution image without wasting data. And, even better, the image will load faster. [Responsive images](/serve-responsive-images/#serve-multiple-image-versions) enable browsers to fetch different image resources to different devices. If you don't use an [image CDN](/image-cdns/) you need to save multiple dimensions for each image and specify them in the `srcset` attribute. The `w` value tells the browser the width of each version. Depending on the device, the browser can choose the appropriate one:

```html
<img src="small.jpg" srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w" alt="…">
```

## Preload overview

[Preload](/preload-critical-assets) lets you tell the browser about critical resources that you want to load as soon as possible, before they are discovered in HTML. This is especially useful for resources that are not easily discoverable, such as fonts included in stylesheets, background images, or resources loaded from a script.

```html
<link rel="preload" as="image" href="important.png">
```

## Responsive images + preload = faster image loads

Responsive images and preload have been available for the last few years, but at the same time something was missing: there was no way to preload responsive images. [Starting in Chrome 73](https://developers.google.com/web/updates/2019/03/nic73#more), the browser can preload the right variant of responsive images specified in `srcset` before it discovers the `img` tag!

Depending on your site's structure, that could mean significantly faster image display! We ran tests on a site that uses JavaScript to lazy-load responsive images. Preloading resulted in images loading 1.2 seconds faster.

{% Aside %}

Responsive images are [supported in all modern browsers](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Browser_compatibility) while preloading them is [supported only in Chromium-based browsers](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#Browser_compatibility).

{% endAside %}

## `imagesrcset` and `imagesizes`

To preload responsive images, new attributes were recently added to the `<link>` element: `imagesrcset` and `imagesizes`.  They are used with `<link rel="preload">` and match the `srcset` and `sizes` syntax used in `<img>` element.

For example, if you want to preload a responsive image specified with:

 ```html
 <img src="wolf.jpg" srcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w" sizes="50vw" alt="A rad wolf">
 ```

You can do that by adding the following to your HTML's `<head>`:

```html
<link rel="preload" as="image" href="wolf.jpg" imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w" imagesizes="50vw">
```

This kicks off a request using the same resource selection logic that `srcset` and `sizes` will apply.

## Use cases

### Preloading dynamically-injected responsive images

Let's say you're dynamically-loading hero images as part of a slideshow and know which image will be displayed first. In that case, you probably want to avoid waiting for the script before loading the image in question, as that would delay when users can see it.

You can inspect this issue on a website with a dynamically-loaded image gallery:

1. Open [this example website](https://responsive-preload.glitch.me/no_preload.html) in a new tab.

{% Instruction 'devtools-network', 'ol' %}

1. In the **Throttling** drop-down list, select **Fast 3G**.

1. Disable the **Disable cache** checkbox.

1. Reload the page.

<figure class="w-figure">
{% Img src="image/admin/cyocwRmB3XlfY26vUZ5h.png", alt="Screenshot of Chrome DevTools Network panel.", width="800", height="481" %}
<figcaption class="w-figcaption">This waterfall shows that the images only start loading after the browser has finished running the script, introducing unnecessary delay to the time the image is initially displayed to the user.</figcaption>
</figure>

Using `preload` helps here because the image starts loading ahead of time and is likely to already be there when the browser needs to display it.


<figure class="w-figure">
{% Img src="image/admin/rIRdFypLWf1ljMaXCVCs.png", alt="Screenshot of Chrome DevTools Network panel.", width="800", height="481" %}
<figcaption class="w-figcaption">This waterfall shows that the first image started loading at the same time as the script, avoiding unnecessary delays and resulting in faster displaying images.</figcaption>
</figure>

To see the difference that preloading makes, you can inspect the same dynamically-loaded image gallery but [with preloaded first image](https://responsive-preload.glitch.me/preload.html) by following the steps from the first example.

{% Aside %}
An alternative way to avoid the problem would be to use a markup-based carousel and have the [browser's preloader](https://hacks.mozilla.org/2017/09/building-the-dom-faster-speculative-parsing-async-defer-and-preload/) pick up the required resources. However, this approach may not always be practical. (For example, if you are reusing an existing component, which is not markup-based.)
{% endAside %}

### Preloading background images using image-set

If you have different background images for different screen densities, you can specify them in your CSS with the `image-set` syntax. The browser can then choose which one to display based on the screen's [DPR](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).

```css
background-image: image-set( "cat.png" 1x, "cat-2x.png" 2x);
```

{% Aside %}

The above syntax ignores the fact that vendor prefixes are needed for this feature in both Chromium and WebKit based browsers. If you're planning to use this feature, you should consider using [Autoprefixer](https://github.com/postcss/autoprefixer) to address that automatically.

{% endAside %}

The problem with CSS background images is that they are discovered by the browser only after it has downloaded and processed all the CSS in the page's `<head>`, which can be a lot of CSS…

You can inspect this issue on an example website with [responsive background image](https://responsive-preload.glitch.me/background_no_preload.html).

<figure class="w-figure">
{% Img src="image/admin/7sjFt1RsoEOKn5zlS5zb.png", alt="Screenshot of Chrome DevTools Network panel.", width="800", height="451" %}
<figcaption class="w-figcaption">In this example, the image download doesn't start until the CSS is fully downloaded, resulting in unnecessary lag to the image's display.</figcaption>
</figure>

Responsive image preloading provides a simple and hack-free way to load those images faster.

```html
<link rel=preload href=cat.png as=image imagesrcset="cat.png 1x, cat-2x.png 2x">
```

You can inspect how the previous example behaves with [preloaded responsive background image](https://responsive-preload.glitch.me/background_preload.html).

<figure class="w-figure">
{% Img src="image/admin/dOI6EmChfahBujnZOke7.png", alt="Screenshot of Chrome DevTools Network panel.", width="800", height="439" %}
<figcaption class="w-figcaption">Here the image and CSS start downloading at the same time, avoiding delays and resulting in a faster loading image.</figcaption>
</figure>

## Preloading responsive images in action

Preloading your responsive images can speed them up in theory, but what does it do in practice?

To answer that I created two copies of a [demo PWA shop](https://github.com/GoogleChromeLabs/sample-pie-shop): [one that does not preload images](https://20190710t144416-dot-pie-shop-app.appspot.com/apparel), and [one that preloads some of them](https://20190710t132936-dot-pie-shop-app.appspot.com/apparel). Since the site lazy loads images using JavaScript, it's likely to benefit from preloading the ones that will be in the initial viewport.

That gave me the following results for [no preload](https://www.webpagetest.org/result/190710_VM_30b9d4c993a1e60befba17e1261ba1ca/) and for [image preload](https://www.webpagetest.org/result/190710_7B_a99e792121760f81a270b4b9c847797b/). Looking at the raw numbers we see that [Start Render](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Quick%20Start%20Guide.md#start-render) stayed the same, [Speed Index](/speed-index/) slightly improved (273 ms, as images arrive faster, but don't take up a huge chunk of the pixel area), but the real metric which captures the difference is the [Last Painted Hero](https://github.com/WPO-Foundation/webpagetest/blob/master/docs/Metrics/HeroElements.md) metric, which improved by 1.2 seconds. 🎉🎉

Of course, nothing captures the visual difference quite like a filmstrip comparison:
<figure class="w-figure">
{% Img src="image/admin/sXyZOvsNoAY0K2NRqT4U.png", alt="Screenshot of WebPageTest filmstrip comparison showing preloaded images are displayed about 1.5 seconds faster.", width="800", height="328" %}
<figcaption class="w-figcaption">The filmstrip shows that images arrive significantly faster when preloaded, resulting in a hugely-improved user experience.</figcaption>
</figure>

## Preload and `<picture>`?

If you're familiar with responsive images, you may be wondering "What about [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)?".

The Web Performance Working Group is talking about adding a preload equivalent for `srcset` and `sizes`, but not the `<picture>` element, which tackles the ["art direction"](/codelab-art-direction/) use-case.

Why is this use-case being "neglected"?

While there's interest in solving that use case as well, there are still a number of [technical issues to sort out](https://calendar.perfplanet.com/2018/how-the-sausage-is-made-webperfwg-meeting-summary/) which means that a solution here would have significant complexity. On top of that, it seems like for the most part, the use-case can be addressed today, even if in a hacky way (see below).

Given that, the Web Performance WG decided to ship `srcset` first and see if the demand for equivalent `picture` support arises.

If you do find yourself in a position to preload `<picture>` you may be able to use the following technique as a workaround.

Given the following scenario:

```html
<picture>
    <source src="small_cat.jpg" media="(max-width: 400px)">
    <source src="medium_cat.jpg" media="(max-width: 800px)">
    <img src="huge_cat.jpg">
</picture>
```

The `<picture>` element's logic (or the image source selection logic, to be precise), would be to go over the `media` attributes of the `<source>` elements in order, find the first one that matches, and use the attached resource.

Because responsive preload has no notion of "order" or "first match", the breakpoints need to be translated into something like:

```html
<link rel="preload" href="small_cat.jpg" as="image" media="(max-width: 400px)">
<link rel="preload" href="medium_cat.jpg" as="image" media="(min-width: 400.1px) and (max-width: 800px)">
<link rel="preload" href="large_cat.jpg" as="image" media="(min-width: 800.1px)">
```

## Summary

Responsive image preload gives us new and exciting possibilities to preload responsive images in ways that were previously only possible using hacks. It's an important new addition to the speed-conscious developer's toolbox and enables us to make sure the important images we want to get in front of our users as soon as possible will be there when we need them.

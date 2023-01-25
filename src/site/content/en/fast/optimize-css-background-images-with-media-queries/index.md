---
layout: post
title: Optimize CSS background images with media queries
authors:
  - demianrenzulli
description: |
  Use media queries to send images that are only as large as they need to be,
  a technique commonly known as responsive images.
date: 2020-03-05
updated: 2020-03-05
tags:
  - performance
---

Many sites request heavy resources, like images, that are not optimized for certain screens, and send large CSS files containing styles that some devices will never use. Using media queries is a popular technique for delivering tailored stylesheets and assets to different screens to reduce the amount of data transferred to users and improve page load performance. This guide shows you how to use media queries to send images that are only as large as they need to be, a technique commonly known as **responsive images**.

## Prerequisites

This guide assumes that you're familiar with [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools). You can use another browser's DevTools instead if you prefer. You'll just need to map the Chrome DevTools screenshots in this guide back to the relevant features in your browser of choice.

## Understand responsive background images

First, analyze the network traffic of the unoptimized demo:

1. Open the [unoptimized demo](https://use-media-queries-unoptimized.glitch.me/) in a new Chrome tab.
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'reload-page', 'ol' %}

{% Aside %}
Check out [Inspect Network Activity With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network/) if you need more help with DevTools.
{% endAside %}

You'll see that the only image that's being requested is `background-desktop.jpg`, which has a size of **1006KB**:

<figure>
  {% Img src="image/admin/K8P4MHp2FSnZYTw3ZVkG.png", alt="DevTools network trace for the unoptimized background image.", width="800", height="126", class="w-screenshot" %}
</figure>

Resize the browser window and notice that the Network Log isn't showing any new requests being made by the page. This means that the same image background is being used for all screen sizes.

You can see the styles that control the background image in [style.css](https://use-media-queries-unoptimized.glitch.me/style.css):

```css
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

Here's the meaning of each of the properties used:

- `background-position: center center`: Center the image vertically and horizontally.
- `background-repeat: no-repeat`: Show the image only once.
- `background-attachment: fixed`: Avoid making the background image scroll.
- `background-size: cover`: Resize the image to cover the entire container.
- `background-image: url(images/background-desktop.jpg)`: The URL of the image.

When combined, these styles tell the browser to adapt the background image to different screen heights and widths. This is the first step towards achieving a responsive background.

Using a single background image for all screen sizes has some limitations:

- The same amount of bytes are sent, regardless of the screen size, even when, for some devices, like phones, a smaller and more lightweight image background would look just as good. In general, you want to send the smallest possible image that still looks good on the user's screen to improve performance and save user data.
- In smaller devices the image will be stretched or cut to cover the entire screen, potentially hiding relevant parts of the background to users.

In the next section, you'll learn how to apply an optimization to load different background images, according to the user's device.

## Use media queries

Using media queries is a common technique to declare stylesheets that will only apply to certain media or device types. They are implemented by using [@media rules](https://developer.mozilla.org/en-US/docs/Web/CSS/@media), which let you define a set of breakpoints, where specific styles are defined.
When the conditions defined by the `@media` rule are met (for example, a certain screen width), the group of styles defined inside the breakpoint will be applied.

The following steps can be used to apply media queries to [the site](https://use-media-queries-unoptimized.glitch.me/) so that different images are used, depending on the maximum width of the device requesting the page.

- In `style.css` remove the line that contains the background image URL:

```css//4
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

- Next, create a breakpoint for each screen width, based on the common dimensions in pixels that mobile, tablet, and desktop screens usually have:

For mobile:

```css
@media (max-width: 480px) {
    body {
        background-image: url(images/background-mobile.jpg);
    }
}
```

For tablets:

```css
@media (min-width: 481px) and (max-width: 1024px) {
    body {
        background-image: url(images/background-tablet.jpg);
    }
}
```

For desktop devices:

```css
@media (min-width: 1025px) {
    body {
	    background-image: url(images/background-desktop.jpg);
   }
}
```

Open the optimized version of [style.css](https://use-media-queries-optimized.glitch.me/style.css) in your browser to see the changes made.

{% Aside %}
The images used in the optimized demo are already resized to fit into different screen sizes. Showing how to resize images is out of the scope of this guide, but if you want to know more about this, the [Serve responsive images guide](/serve-responsive-images/) covers some useful tools, like the [sharp npm package](https://www.npmjs.com/package/sharp) and the [ImageMagick CLI](https://www.imagemagick.org/script/index.php).
{% endAside %}

## Measure for different devices

Next visualize the resulting site in different screen sizes and in simulated mobile devices:

1. Open the [optimized site](https://use-media-queries-optimized.glitch.me/) in a new Chrome tab.
1. Make your viewport narrow (less than `480px`).
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'reload-page', 'ol' %}
Notice how the `background-mobile.jpg` image was requested.
1. Make your viewport wider. Once it's wider than `480px` notice how `background-tablet.jpg` is requested. Once it's wider than `1025px` notice how `background-desktop.jpg` is requested.

When the width of the browser screen is changed, new images are requested.

In particular when the width is below the value defined in the mobile breakpoint (480px), you see the following Network Log:

<figure>
  {% Img src="image/admin/jd2kHIefYf91udpFEmvx.png", alt="DevTools network trace for the optimized background image.", width="800", height="125", class="w-screenshot" %}
</figure>

The size of the new mobile background is **67% smaller** than the desktop one.

## Summary

In this guide you've learned to apply media queries to request background images tailored to specific screen sizes and save bytes when accessing the site on smaller devices, like mobile phones.
You used the `@media` rule to implement a responsive background. This technique is widely supported by all browsers.
A new CSS feature: [image-set()](https://drafts.csswg.org/css-images-4/#image-set-notation), can be used for the same purpose with fewer lines of code. At the time of this writing, this feature is not supported in all browsers, but you might want to keep an eye on how adoption evolves, as it can represent an interesting alternative to this technique.

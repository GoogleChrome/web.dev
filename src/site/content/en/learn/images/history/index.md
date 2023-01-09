---
title: 'A brief history of images on the web'
authors:
  - matmarquis
description: A history of images on the web, starting with `<img>` back in 1993
date: 2023-01-10
tags:
  - images
---

No matter how far along you are in learning to design and develop for the web, the `<img>` element needs very little introduction.
[Launched in Netscape (“Mosaic,” at the time) in 1993](https://www.wired.com/2010/04/0422mosaic-web-browser/) and added to the HTML
specification in 1995, `<img>` has long played a simple but powerful role within the web platform. The developer adds a "source" image
file with the `src` attribute and provides a text alternative with the `alt` attribute in the event that the image cannot be rendered or
assistive technologies request an alternative. From there, the browser has only one job: get the image data, then render it as quickly as possible.

{% Codepen {
user: 'web-dot-dev',
id: 'jOpVPJa',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

For most of web development history, working with images didn't get much more complicated than that. And, despite the modern
web's complexity, the fundamentals of working with images haven't changed: use a web-friendly image format for compatibility,
sensible compression to conserve bandwidth, and dimensions that suit the space the image is going to occupy in the page's layout.

Using fixed-width layouts, like we did back when we thought we had more say in how users experienced the web,
made this an uncomplicated process. It was particularly easy to set the size of the image source. For an image that occupied a space five
hundred pixels wide and three hundred pixels tall, it was a case of specifying a source image at that same size.

## Images in a responsive layout

Alongside a flexible layout and use of CSS media queries, "flexible images and media" are one of the three defining facets
of [responsive web design](/learn/design/). To make an image flexible, developers began using CSS to set `max-width: 100%` on the image
(or all images, site-wide) to tell the browser's rendering engine to prevent an image from ever overflowing its parent container by
scaling it down. Visually, this works perfectly–downscaling a [raster image](/learn/images/raster-images/) is visually seamless. With a line or two of CSS,
a scaled-down image will always look as though we've specified an image source that was meant to be displayed at that size.
When rendering engines are given more image data than necessary for the space the image occupies in a layout, they are able
to make informed decisions about how to render the reduced image, and can do so without introducing any visual artifacts or blurring.

{% Codepen {
user: 'web-dot-dev',
id: 'YzjpXBP',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

You wouldn't typically want to _upscale_ an image—that is, render the `<img>` at a size larger than the intrinsic size of the source image.
The displayed image would appear blurry and grainy-looking.

{% Codepen {
user: 'web-dot-dev',
id: 'XWBNbOx',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

Using `img { max-width: 100% }` means that as a flexible container resizes, images will be downscaled as appropriate.
Unlike setting a more rigid `width: 100%`, this also ensures that the image won't be scaled up beyond its intrinsic size.
For a long time, that was it for the rules of working with images: use a format browsers understand, use a sensible level of
compression, and never scale images upwards.

{% Codepen {
user: 'web-dot-dev',
id: 'gOjLpEM',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

But as simple and effective as this approach was visually, it came at a huge performance cost. As `<img>` only supported a
single source for the image data, this approach required us to provide an image asset with an intrinsic size as large as
the largest size at which it could be displayed. An image meant to occupy a space in a layout that could be anywhere
from `300px` to `2000px` wide, depending on the user's viewport size, required an image source with an intrinsic width of
at least `2000px`. For a user who only views the page by way of a small viewport, everything would look as expected—the
image would scale just fine. In the rendered page, a massive but scaled-down source image would _look_ no different from an
appropriately-sized one. However, they would still be transferring and rendering a `2000px` wide image, burning through a huge
amount of bandwidth and processing power with no tangible benefit.

Things got much worse with the advent of the first "Retina" devices, as display _density_ became a concern alongside viewport
size. An image source needs a much larger intrinsic width in order to suit a high density display. In simple terms, a display with
double the density requires twice as many image pixels to render the image as sharply as possible.

Here, developers were again able to rely on rendering engines' ability to downscale images visually. By providing the browser with
an `800px` wide source image in `src`, then specifying that it should be displayed at `400px` wide with CSS, the result is an image
rendered at double the pixel density:

{% Codepen {
user: 'web-dot-dev',
id: 'QWBKrjX',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

A single source image, cut to suit the largest possible space in your layout and high-density displays, works for all users _visually_,
of course. A huge, high resolution image source rendered on a small, low density display will look like any other small, low density image,
but feel far slower. The user will be left bearing all the performance costs of that massive, 4000px-wide image source, to no benefit.

For a long time, `<img>` largely did one thing— it "got image data and put it on the screen." It did that reasonably well, for certain,
but `img` wasn't up to the task of accommodating the radical shifts in browsing context we were experiencing. While responsive web design
became a mainstream development practice, browsers optimized the performance of `img` for nearly twenty years—but for all but the most privileged
users, the image _content_ of pages was inefficient from the outset. No matter how quickly the browser managed to request, parse, and render
an image source, that asset would likely be far bigger than the user needed.

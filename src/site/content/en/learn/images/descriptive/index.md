---
title: 'Descriptive syntaxes'
authors:
  - matmarquis
description: Using srcset and sizes to provide the browser with information about image sources and how they'll be used.
date: 2023-01-31
tags:
  - images
---

In this module, you'll learn how to give the browser a choice of images so that it can make the best decisions about what to display. `srcset`
isn't a method for swapping image sources at specific breakpoints, and it isn't meant to swap one image for another. These syntaxes allow the
browser to solve a very difficult problem, independent of us: seamlessly requesting and rendering an image source tailored to a user's browsing context,
including viewport size, display density, user preferences, bandwidth, and countless other factors.

It's a big ask—certainly more than we want to consider when we're simply marking up an image for the web, and doing it well involves more
information than we can access.

## Describing density with `x`

An `<img>` with a fixed width will occupy the same amount of the viewport in any browsing context, regardless of the _density_ of a user's
display—the number of physical pixels that make their screen. For example, an image with an inherent width of `400px` will occupy almost
the entire browser viewport on both the original Google Pixel and much newer Pixel 6 Pro—both devices have a normalized `412px`
[logical pixel](https://developer.mozilla.org/docs/Glossary/CSS_pixel) wide viewport.

The Pixel 6 Pro has a much _sharper_ display, however: the 6 Pro has a _physical_ resolution of 1440 × 3120 pixels, while the
Pixel is 1080 × 1920 pixels—that is, the number of hardware pixels that make up the screen itself.

The ratio between a device's logical pixels and physical pixels is the _device pixel ratio_ for that display (DPR). DPR is
calculated by dividing a viewport's CSS pixels by the device's actual screen resolution.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/2YTBM6TXRoEE2Q3XbFhX.png", alt="A DPR of 2 displayed in a console window", width="800", height="277" %}

So, the original Pixel has a DPR of 2.6, while the Pixel 6 Pro has a DPR of 3.5.

The iPhone 4, the first device with a DPR greater than 1, reports a device pixel ratio of 2—the physical resolution of the screen is
double the logical resolution. Any device prior to the iPhone 4 had a DPR of 1: one logical pixel to one physical pixel.

If you view that `400px`-wide image on a display with a DPR of `2`, each logical pixel is being rendered across four of the
display's physical pixels: two horizontal and two vertical. The image doesn't benefit from the high-density display—it will look the
same as it would on a display with a DPR of `1`. Of course, anything “drawn” by the browser's rendering engine—text, CSS shapes, or SVGs,
for example—will be drawn to suit the higher-density display. But as you learned from [Image Formats and Compression](/learn/images/raster-images/), raster images are fixed
grids of pixels. While it may not always be glaringly obvious, a raster image upscaled to suit a higher-density display will look
low-resolution compared to the surrounding page.

In order to prevent this upscaling, the image being rendered has to have an intrinsic width of at least `800` pixels. When scaled down
to fit a space in a layout 400 logical pixels wide, that 800-pixel image source has double the pixel density—on a display with a DPR of `2`,
it'll look nice and sharp.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/IoJjwpreGIT7LwRThaWn.png", alt="Close up of a flower petal showing disparity in density", width="800", height="417" %}

{% Codepen {
user: 'web-dot-dev',
id: 'QWBGVyo',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

Since a display with a DPR of `1` can't make use of the increased density of an image, it will be _downscaled_ to match the
display—and as you know, a _downscaled_ image will look just fine. On a low-density display, an image suitable for higher-density
displays will look like any other low-density image.

As you learned in [Images and Performance](#), a user with a low-density display viewing an image source scaled down to `400px`
will only _need_ a source with an inherent width of `400px`. While a much larger image would work for all users visually, a huge,
high resolution image source rendered on a small, low density display will _look_ like any other small, low density image, but _feel_ far slower.

As you might guess, _mobile_ devices with a DPR of 1 are [vanishingly rare](https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/),
though it is still [common in “desktop” browsing contexts](https://twitter.com/TimVereecke/status/1587878439729725442). According to data
shared by [Matt Hobbs](nooshu.com), approximately 18% of  [GOV.UK](https://www.gov.uk/) browsing sessions from November 2022 report a DPR of 1. While h
igh-density images would _look_ the way those users might expect, they'll come at a much higher bandwidth and processing cost—of
particular concern to users on the older and less powerful devices still likely to have low-density displays.

Using `srcset` ensures that only devices with high-resolution displays receive image sources large enough to look sharp, without passing that same
bandwidth cost along to users with lower-resolution displays.

The `srcset` attribute identifies one or more comma-separated _candidates_ for rendering an image. Each candidate is made up of
two things: a URL, just like you would use in `src`, and a syntax that _describes_ that image source. Each candidate in `srcset`
is described by its inherent _width_ (“`w` syntax”) or intended _density_ (“`x` syntax”).

The `x` syntax is a shorthand for “this source is appropriate for a display with this density”—a candidate followed by `2x` is
appropriate for a display with a DPR of 2.

```html
<img src="low-density.jpg" srcset="double-density.jpg 2x" alt="...">
```

Browsers that support `srcset` will be presented with two candidates: `high-density.jpg`, which `2x` describes as appropriate
for displays with a DPR of 2, and `low-density.jpg` in the `src` attribute—the candidate selected if nothing more appropriate is
found in `srcset`. For browsers without support for `srcset`, the attribute and its contents will be ignored—the contents of `src`
will be requested, as usual.

It's easy to mistake the  values specified in the `srcset` attribute for instructions. That `2x` informs the browser that the
associated source file would be suitable for use on a display with a DPR of 2—information about the source itself. It doesn't tell
the browser how to use that source, just informs the browser how the source could be used. It's a subtle but important distinction: this
is a double density _image_, not an image for use on a double density _display_.

The difference between a syntax that says “this source is appropriate for `2x` displays” and one that says “use this source on `2x` displays”
is slight in print, but display density is only one of a huge number of interlinked factors that the browser uses to decide on the candidate
to render, only some of which you can know. For example: individually, it's possible for you to determine that a user has enabled a
bandwidth-saving browser preference through the `prefers-reduced-data` media query, and use that to always opt users into low-density images
regardless of their display density—but unless implemented consistently, by every developer, on every website, it wouldn't be of much use to a user.
They might have their preference respected on one site, and run into a bandwidth-obliterating wall of images on the next.

The deliberately vague resource selection algorithm used by `srcset`/`sizes` leaves room for browsers to decide to select lower density
images with bandwidth dips, or based on a preference to minimize data usage, without us taking on responsibility for how, or when, or at
what threshold. There's no sense in taking on responsibilities—and additional work—that the browser is better equipped to handle for you.

## Describing widths with `w`

`srcset` accepts a second type of descriptor for image source candidates. It's a far more powerful one—and for our purposes, a
great deal easier to understand. Rather than flagging a candidate as having the appropriate dimensions for a given display density,
the `w` syntax describes the inherent width of each candidate source. Again, each candidate is identical save for their dimensions—the same
content, the same cropping, and the same aspect ratio. But in this case, you want the user's browser to choose between two candidates:
small.jpg, a source with an inherent width of 600px, and large.jpg, a source with an inherent width of 1200px.

```html
srcset="small.jpg 600w, large.jpg 1200w"
```

This doesn't tell the browser what to _do_ with this information—just supplies it with a list of candidates for displaying the image.
Before the browser can make a decision about which source to render, you need to provide it with a little more information: a
description of how the image will be rendered on the page. To do that, use the `sizes` attribute.

## Describing usage with `sizes`

Browsers are incredibly performant when it comes to transferring images. Requests for image assets will be initiated long
before requests for stylesheets or JavaScript—oftentimes even before the markup has been fully parsed. When the browser
makes these requests, it has no information about the page itself, apart from the markup—it may not have even initiated requests
for external stylesheets yet, let alone applied them. At the time the browser parses your markup and starts making external
requests, it only has browser-level information: the size of the user's viewport, the pixel density of the user's display,
user preferences, and so on.

This doesn't tell us anything about how an image is intended to be rendered in the page layout—it can't even use the viewport
as a proxy for the upper bound of the `img` size, as it may occupy a horizontally scrolling container. So we need to
provide the browser with this information and do it using markup. That is all we'll be able to use for these requests.

Like `srcset`, `sizes` is intended to make information about an image available as soon as the markup is parsed. Just as the `srcset`
attribute is shorthand for “here are the source files and their inherent sizes,” the `sizes` attribute is shorthand for “here
is the size of the rendered image _in the layout_.” The way you describe the image is relative to the viewport—again, viewport
size is the only layout information the browser has when the image request is made.

That may sound a little convoluted in print, but it's far easier to understand in practice:

```html
<img
 sizes="80vw"
 srcset="small.jpg 600w, medium.jpg 1200w, large.jpg 2000w"
 src="fallback.jpg"
 alt="...">
```

Here, this `sizes` value informs the browser that the space in our layout that the `img` occupies has a width of `80vw`—80% of
the viewport. Remember, this isn't an _instruction_, but a description of the image's size in the page layout. It doesn't say “make this
image occupy 80% of the viewport,” but “this image will end up occupying 80% of the viewport once the page has rendered.”

{% Codepen {
user: 'web-dot-dev',
id: 'PoBWLYP',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

As a developer, your job is done. You've accurately described a list of candidate sources in `srcset` and the width of your image
in `sizes`, and, just as with the `x` syntax in `srcset`, the rest is up to the browser.

But in the interest of fully understanding how this information is used, let's take a moment to walk through the decisions that
a user's browser makes upon encountering this markup:

You've informed the browser that this image will take up 80% of the available viewport—so, if we were to render this `img` on a
device with a 1000-pixel-wide viewport, this image will occupy 800 pixels. The browser will then take that value and divide against
it the widths of each of the image source candidates we specified in `srcset`. The smallest source has an inherent size of 600 pixels,
so: 600 ÷ 800 = .75. Our medium image is 1200 pixels wide: 1200 ÷ 800 = 1.5. Our largest image is 2000 pixels wide: 2000 ÷ 800 = 2.5.

The results of those calculations (`.75`, `1.5`, and `2.5`) are, effectively, DPR options _specifically tailored to the user's
viewport size_. Since the browser also has information on the user's display density at hand, it makes a series of decisions:

At this viewport size, the `small.jpg` candidate is discarded regardless of the user's display density—with a calculated DPR lower
than `1`, this source would require upscaling for any user, so it isn't appropriate. On a device with a DPR of `1`, `medium.jpg` provides the
closest match—that source is appropriate for display at a DPR of `1.5`, so it is a little larger than necessary, but remember that downscaling is
a visually seamless process. On a device with a DPR of 2,`large.jpg` is the closest match, so it gets selected.

If the same image is rendered on a 600 pixel wide viewport, the result of all that math would be completely different: 80vw is now 480px.
When we divide our sources' widths against that, we get `1.25`, `2.5`, and `4.1666666667`. At this viewport size, `small.jpg` will be chosen
on 1x devices, and `medium.jpg` will match on 2x devices.

This image will look identical in all of these browsing contexts: all our source files are exactly the same apart from their dimensions,
and each one is being rendered as sharply as the user's display density will allow. However, instead of serving `large.jpg` to every user
in order to accommodate the largest viewports and the highest density displays, users will always be served the smallest suitable candidate.
By using a descriptive syntax rather than a prescriptive one, you don't need to manually set breakpoints and consider future viewports and
DPRs—you simply supply the browser with information and allow it to determine the answers for you.

Because our `sizes` value is relative to the viewport and completely independent of the page layout, it adds a layer of complication.
It's rare to have an image that _only_ occupies a percentage of the viewport, without any fixed-width margins, padding, or influence
from other elements on the page. You'll frequently need to express the width of an image using a combination of units; percentages, `em`, `px`, and so on.

Fortunately, you can use `calc()` here—any browser with native support for responsive images will support `calc()` as well, allowing us to
mix-and-match CSS units—for example, an image that occupies the full width of the user's viewport, minus a `1em` margin on either side:

```html
<img
	sizes="calc(100vw-2em)"
	srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1600w, x-large.jpg 2400w"
	src="fallback.jpg"
	alt="...">
```

## Describing breakpoints

If you've spent much time working with responsive layouts, you've likely noticed something missing from these examples:
the space an image occupies in a layout is very likely to change across our layout's breakpoints. In that case, you need
to pass a little more detail along to the browser: `sizes` accepts a comma-separated set of candidates for the rendered size of the
image, just like `srcset` accepts comma-separated candidates for image sources. Those conditions use the familiar media query syntax.
This syntax is first-match: as soon as a media condition matches. the browser stops parsing the `sizes` attribute, and the value
specified is applied.

Say you have an image meant to occupy 80% of the viewport, minus one `em` of padding on either side, on viewports above 1200px—on
smaller viewports, it occupies the full width of the viewport.

```html
  <img
     sizes="(min-width: 1200px) calc(80vw - 2em), 100vw"
     srcset="small.jpg 600w, medium.jpg 1200w, large.jpg 2000w"
     src="fallback.jpg"
     alt="...">
```
{% Codepen {
user: 'web-dot-dev',
id: 'RwBoYRx',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

If the user's viewport is greater than 1200px, `calc(80vw - 2em)` describes the width of the image in our layout. If the
`(min-width: 1200px)` condition _doesn't_ match, the browser moves on to the next value. Because there isn't a specific
media condition tied to this value, `100vw` is used as a  default. If you were to write this `sizes` attribute using
`max-width` media queries:

```html
  <img
     sizes="(max-width: 1200px) 100vw, calc(80vw - 2em)"
     srcset="small.jpg 600w, medium.jpg 1200w, large.jpg 2000w"
     src="fallback.jpg"
     alt="...">
```
{% Codepen {
user: 'web-dot-dev',
id: 'BaPQOzO',
height: 300,
theme: dark,
tab: 'html,css,result'
} %}

In plain language: “does `(max-width: 1200px)` match? If not, move on. The next value—`calc(80vw - 2em)`—has no qualifying condition,
so this is the one selected.

Now that you've provided the browser with all this information about your `img` element—potential sources,  inherent widths,
and how you intend to present the image to the user—the browser uses a fuzzy set of rules for determining what to do with
that information. If that sounds vague, well, that's because it is—by design. The source-selection algorithm encoded in the
HTML specification is _explicitly_ vague on how a source should be chosen. Once the sources, their descriptors, and how
the image will be rendered has all been parsed, the browser is free to do whatever it wants—you _can't_ know for certain which
source the browser will choose.

A syntax that says "use this source on a high-resolution display" would be predictable, but it wouldn't address the core problem
with images in a responsive layout: conserving user bandwidth. A screen's pixel density is only tangentially related to internet
connection speed, if at all. If you are using a top-of-the-line laptop, but browsing the web by way of a metered connection, tethered
to your phone, or using a shaky airplane wifi connection—you might want to opt out of high-resolution image sources, regardless of
the quality of your display.

Leaving the final say to the browser allows for far more performance improvements than we could manage with a strictly prescriptive
syntax. For example: in most browsers, an `img` using the `srcset`/`sizes` syntax will never bother requesting a source with smaller
dimensions than one that the user already has in their browser's cache. What would be the point in making a new request for a source
that would look identical, when the browser can seamlessly downscale the image source it already has? But if the user scales their
viewport up to the point where a new image is needed in order to avoid upscaling, _that_ request will still get made, so everything
looks the way you expect.

That lack of explicit control can sound a little scary at face value, but because you're using source files with identical
content, we're no more likely to present users with a “broken” experience than we would with a single-source `src`, regardless of
the decisions made by the browser.

## Using `sizes` and `srcset`

This is a lot of information—both for you, the reader, and for the browser. `srcset` and `sizes` are both dense syntaxes,
describing a shocking amount of information in relatively few characters. That is, for better or worse, by design: making
these syntaxes less terse—and more easily parsed by us humans—could have made them more difficult for a _browser_ to parse. The
more complexity added to a string, the more potential there is for parser errors or unintentional differences in behavior
from one browser to another. There's an upside here, however: a syntax more easily read by machines is a syntax more easily written
by them.

`srcset` is a clear-cut case for automation. It's rare that you'll be hand-crafting multiple versions of your images for a
production environment, instead automating the process using a task runner like Gulp, a bundler like Webpack, a third-party
CDN like Cloudinary, or functionality already built into your CMS of choice. Given enough information to generate our sources
in the first place, a system would have enough information to write them into a viable `srcset` attribute.

`sizes` is a little more difficult to automate. As you know, the only way a system can calculate the size of an image in a
rendered layout is to have _rendered_ the layout. Fortunately, a number of developer tools have popped up to abstract away
the process of hand-writing `sizes` attributes—with an efficiency you could never match by hand.
[respImageLint](https://github.com/ausi/respimagelint), for example, is a snippet of code intended to vet your `sizes` attributes
for accuracy and provide suggestions for improvement. The [Lazysizes](https://github.com/aFarkas/lazysizes) project compromises
some speed for efficiency by deferring image requests until after the layout has been established, allowing JavaScript to
generate  `sizes` values for you. If you're using a fully client-side rendering framework such as React or Vue, there are a
number of solutions for authoring and/or generating `srcset` and `sizes` attributes, which we'll discuss further in [CMS and Frameworks](cms).

---
title: 'Automating compression and encoding'
authors:
  - matmarquis
description: Make generating highly performant image sources a seamless part of your development process.
date: 2023-01-31
tags:
  - images
---

All of the syntaxes in this course—from the encoding of image data to the information-dense
markup that powers [responsive images](/learn/images/responsive-images/)—are methods for machines to communicate with machines. You have
discovered a number of ways for a client browser to communicate its needs to a server, and a server to respond in kind.
Responsive image markup (`srcset` and `sizes`, in particular) manage to describe a shocking amount of information in relatively
few characters. For better or worse, that brevity is by design: making these syntaxes less terse, and so easier for developers
to parse, could have made them more difficult for a _browser_ to parse. The more complexity added to a string, the more
potential there is for parser errors, or unintentional differences in behavior from one browser to another.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/24qgm41BZl5a2gstQQfi.png", alt="An automated image encoding window", width="800", height="472" %}

However, the same trait that can make these subjects feel so intimidating can also provide you with solutions: a syntax easily
_read_ by machines is a syntax more easily _written_ by them. You’ve almost certainly encountered many examples of automated
image encoding and compression as a user of the web: any image uploaded to the web through social media platforms, content
management systems (CMS), and even email clients will almost invariably pass through a system that resizes, re-encodes,
and compresses them.

Likewise, whether through plugins, external libraries, standalone build process tools, or responsible use of client-side scripting,
responsive image markup readily lends itself to automation.

Those are the two primary concerns around automating image performance: managing the creation of images—their encodings,
compression, and the alternate sources you’ll use to populate an `srcset` attribute—and generating our user-facing markup.
In this module, you’ll learn about a few common approaches to managing images as part of a modern workflow, whether as an
automated phase in your development process, through the framework or content management system that powers your site, or
almost fully abstracted away by a dedicated content delivery network.

## Automating compression and encoding

You’re unlikely to find yourself in a position where you can take the time to manually determine the ideal encoding and level
of compression for each individual image destined for use on a project—nor would you want to. As
[important as it is to keep your image transfer sizes as small as possible](#ImagesandPerformance) , fine-tuning your
compression settings and re-saving alternate sources for every image asset destined for a production website would introduce
a huge bottleneck in your daily work.

As you learned in [Image Formats and Compression](#), the most efficient encoding for an image will always be dictated by
its content, and as you learned in [Responsive Images](#), the alternate sizes you’ll need for your image sources will be
dictated by the position those images occupy in the page layout. In a modern workflow, you’ll approach these decisions
holistically rather than individually—determining a set of sensible defaults for images, to best suit the contexts in which
they’re meant to be used.

When choosing encodings for a directory of photographic images, AVIF is the clear winner for quality and transfer size
but has limited support, WebP provides an optimized, modern fallback, and JPEG is the most reliable default. The alternate
sizes we need to produce for images meant to occupy a sidebar in a page layout will vary a great deal from images meant
to occupy the entire browser viewport at our highest breakpoints. Compression settings will require an eye toward blurring
and compression artifacts across multiple resulting files—leaving less room to carve every possible byte from each image
in exchange for a more flexible and reliable workflow. In sum, you’ll be following the same decision making process you’ve
come to understand from this course, writ large.

As for the processing itself, there are a huge number of open source image processing libraries that provide methods of
converting, modifying, and editing images in batches, competing on speed, efficiency, and reliability. These processing
libraries will allow you to apply encoding and compression settings to whole directories of images at once, without the
need to open image editing software, and in a way that preserves your original image sources should those settings need
to be adjusted on-the-fly. They’re intended to run in a range of contexts, from your local development environment to the
web server itself—for example, the compression-focused [ImageMin](https://web.dev/use-imagemin-to-compress-images/) for
Node.js can be extended to suit specific applications through an array of [plugins](https://www.npmjs.com/search?q=keywords:imageminplugin),
while the cross-platform [ImageMagick](https://imagemagick.org/) and the Node.js based [Sharp](https://sharp.pixelplumbing.com/)
come with a staggering number of features right out of the box.

These image processing libraries make it possible for developers to build tools dedicated to seamlessly optimizing images
as part of your standard development processes—ensuring that your project will always be referencing production-ready image
sources with as little overhead as possible.

## Local development tools and workflows

[Task-runners and bundlers like Grunt, Gulp, or Webpack](/use-imagemin-to-compress-images/) can be used to
optimize image assets alongside other common performance-related tasks, such as minification of CSS and JavaScript. To
illustrate, let’s take a relatively simple use case: a directory in your project contains a dozen photographic images,
meant to be used on a public-facing website.

First, you’ll need to ensure consistent, efficient encoding for these images. As you’ve learned in the previous modules,
WebP is an efficient default for photographic images in terms of both quality and file size. WebP is _well_ supported,
but not _universally_ supported, so you’ll also want to include a fallback in the form of a progressive JPEG. Then,
in order to make use of the `srcset` attribute for efficient delivery of these assets, you’ll need to produce multiple
alternate sizes for each encoding.

While this would be a repetitive and time-consuming chore if done with image editing software, task runners like
[Gulp](https://gulpjs.com/) are designed to automate exactly this sort of repetition. The [gulp-responsive](https://www.npmjs.com/package/gulp-responsive)
plugin, which makes use of [Sharp](https://www.npmjs.com/package/sharp), is one option of many that all follow a similar pattern:
collecting all the files in a source directory, re-encode them, and compress them based on the same standardized "quality"
shorthand you learned about in [Image Formats and Compression](/learn/images/png/). The resulting files are then output to a path you define,
ready to be referenced in the `src` attributes of your user-facing `img` elements while leaving your original files intact.

```javascript
const { src, dest } = require('gulp');
const respimg = require('gulp-responsive');

exports.webp = function() {
  return src('./src-img/*')
    .pipe(respimg({
      '*': [{
        quality: 70,
        format: ['webp', 'jpeg'],
        progressive: true
      }]
  }))
  .pipe(dest('./img/'));
}
```

With a process like this in place, no harm would be done to a production environment if someone on the project inadvertently
added a photograph encoded as a massive truecolor PNG to the directory containing your original image sources—regardless of
the original image’s encoding, this task will produce an efficient WebP and reliable progressive JPEG fallback, and at a
compression level that can be easily adjusted on-the-fly. Of course, this process also ensures that your original image
files will be retained within the project’s development environment, meaning that these settings can be adjusted at any
time with only the automated output overwritten.

In order to output multiple files, you pass along multiple configuration objects—all the same, apart from the addition of
a `width` key and a value in pixels:

```javascript
const { src, dest } = require('gulp');
const respimg = require('gulp-responsive');

exports.default = function() {
  return src('./src-img/*')
	.pipe(respimg({
  	'*': [{
          	width: 1000,
          	format: ['jpeg', 'webp'],
          	progressive: true,
          	rename: { suffix: '-1000' }
        	},
        	{
          	width: 800,
          	format: ['jpeg', 'webp'],
          	progressive: true,
          	rename: { suffix: '-800' }
        	},
        	{
          	width: 400,
          	format: ['jpeg', 'webp'],
          	progressive: true,
          	rename: { suffix: '-400' },
      	}]
    	})
	)
	.pipe(dest('./img/'));
}
```

In the case of the example above, the original image (monarch.png) was more than 3.3MB. The largest file generated by
this task (monarch-1000.jpeg) is approximately 150KB. The smallest, monarch-400.web, is only 32KB.

```shell
[10:30:54] Starting 'default'...
[10:30:54] gulp-responsive: monarch.png -> monarch-400.jpeg
[10:30:54] gulp-responsive: monarch.png -> monarch-800.jpeg
[10:30:54] gulp-responsive: monarch.png -> monarch-1000.jpeg
[10:30:54] gulp-responsive: monarch.png -> monarch-400.webp
[10:30:54] gulp-responsive: monarch.png -> monarch-800.webp
[10:30:54] gulp-responsive: monarch.png -> monarch-1000.webp
[10:30:54] gulp-responsive: Created 6 images (matched 1 of 1 image)
[10:30:54] Finished 'default' after 374 ms
```

Of course, you’ll want to carefully examine the results for visible compression artifacts, or possibly increase compression
for additional savings. Since this task is non-destructive, these settings can be changed easily.

All told, in exchange for the few kilobytes you could carve away with careful manual micro-optimization, you gain a process
that is not only efficient, but  _resilient_—a tool that seamlessly applies your knowledge of high-performance image assets
to an entire project, without any manual intervention.

### Responsive image markup in practice

Populating `srcset` attributes will typically be a straightforward manual process, as the attribute really only captures
information about the configuration you’ve already done when generating your sources. In the tasks above, we’ve established
the file names and width information that our attribute will follow:

```html
srcset="filename-1000.jpg 1000w, filename-800.jpg 800w, filename-400.jpg 400w"
```

Remember that the contents of the `srcset` attribute are descriptive, not prescriptive. There’s no harm in overloading an
`srcset` attribute, so long as the aspect ratio of every source is consistent. An `srcset` attribute can contain the URI
and width of every alternate cut generated by the server without causing any unnecessary requests, and the more candidate
sources we provide for a rendered image, the more efficiently the browser will be able to tailor requests.

As you learned in [Responsive Images](#), you’ll want to make use of the `<picture>` element to seamlessly handle the WebP
or JPEG fallback pattern. In this case, you’ll be using the `type` attribute in concert with `srcset`.

```html
<picture>
  <source type="image/webp" srcset="filename-1000.webp 1000w, filename-800.webp 800w, filename-400.webp 400w">
  <img srcset="filename-1000.jpg 1000w, filename-800.jpg 800w, filename-400.jpg 400w" sizes="…" alt="…">
</picture>
```

As you’ve learned, browsers that support WebP will recognize the contents of the `type` attribute, and select that `<source>`
element’s `srcset` attribute as the list of image candidates. Browsers that don’t recognize `image/webp` as a valid media
type will ignore this `<source>`, and instead use the inner `<img>` element’s `srcset` attribute.

There’s one more consideration in terms of browser support: browsers without support for any responsive image markup will
still need a fallback, or we could run the risk of a broken image in especially old browsing contexts. Because `<picture>`,
`<source>`, and `srcset` are all ignored in these browsers, we’ll want to specify a default source in the inner `<img>`’s
`src` attribute.

Because scaling an image downwards is _visually_ seamless and JPEG encoding is universally supported, the largest JPEG is
a sensible choice.

```html
<picture>
  <source type="image/webp" srcset="filename-1000.webp 1000w, filename-800.webp 800w, filename-400.webp 400w">
  <img src="filename-1000.jpg" srcset="filename-1000.jpg 1000w, filename-800.jpg 800w, filename-400.jpg 400w" sizes="…" alt="…">
</picture>
```

`sizes` can be a little more difficult to deal with. As you've [learned](/learn/images/responsive-images), `sizes` is necessarily contextual—you
can’t populate the attribute without knowing the amount of space the image is meant to occupy in the rendered layout. For
the most efficient possible requests, an accurate `sizes` attribute needs to be in our markup at the time those requests
are made by the end user, long before the styles that govern the page layout have been requested. Omitting `sizes` altogether
is not only a violation of the HTML specification, but results in default behavior equivalent to `sizes="100vw"`—informing
the browser that this image is only constrained by the viewport itself, resulting in the largest possible candidates sources
being selected.

As is the case with any particularly burdensome web development task, a number of tools have been created to abstract away
the process of hand-writing `sizes` attributes. [`respImageLint`](https://ausi.github.io/respimagelint/) is an absolutely
essential snippet of code intended to vet your `sizes` attributes for accuracy and provide suggestions for improvement.
It runs as a bookmarklet—a tool you run in your browser, while pointed at the fully rendered page containing your image
elements. In a context where the browser has full understanding of the page layout, it will also have nearly pixel-perfect
awareness of the space an image is meant to occupy in that layout at every possible viewport size.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/Yr5VQ7rAATnPzHYyxcGF.png", alt="Responsive image report showing size/width mismatch", width="800", height="861" %}

A tool for linting your `sizes` attributes is certainly useful, but it has even more value as a tool to generate them wholesale.
As you know, `srcset` and `sizes` syntax is intended to optimize requests for image assets in a visually seamless way. Though
not something that should ever be used in production, a default `sizes` placeholder value of `100vw` is perfectly reasonable
while working on a page’s layout in your local development environment. Once layout styles are in place, running `respImageLint`
will provide you with tailored `sizes` attributes that you can copy and paste into your markup, at a level of detail far greater
than one written by hand:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/fst6DoueH9kN4VEV6hU4.png", alt="Responsive image report with suggested dimensions", width="800", height="861" %}

Though image requests initiated by server-rendered markup happen too quickly for JavaScript to generate a client-side `sizes` attribute,
the same reasoning doesn’t apply if those requests are _initiated_ client-side. The [Lazysizes](https://github.com/aFarkas/lazysizes) project,
for example, allows you to fully defer image requests until after the layout has been established, allowing JavaScript to generate
our `sizes` values for us—a huge convenience for you, and a guarantee of the most efficient possible requests for your users.
Keep in mind, however, that this approach does mean sacrificing the reliability of server-rendered markup and the speed
optimizations built into browsers, and initiating these requests only after the page has been rendered will have an outsized
negative impact on your LCP score.

Of course, if you’re already depending on a client-side rendering framework such as React or Vue, that’s a debt you’ll already
be incurring—and in those cases, using Lazysizes means your `sizes` attributes can be almost completely abstracted away.
Better still: as [`sizes="auto"`](https://github.com/whatwg/html/pull/8008) on lazy loaded images gains consensus and
native implementations, Lazysizes will effectively become a polyfill for that newly standardized browser behavior.

---
title: 'Image formats: GIF'
authors:
  - matmarquis
description: Understand the GIF image format, along with an explanation of how image encoding works. 
date: 2023-01-31
tags:
  - images
---

While not terribly useful on the modern web, GIF (Graphics Interchange Format) provides a solid introduction to the core
concepts of image encoding.

GIF can be thought of as a wrapper for image data. It has a viewport, of sorts, called a "logical screen," to which individual
frames of image data are drawn—a bit like layers in a Photoshop document. That's how GIF supports its flipbook-like animation:
a single frame is drawn to the logical screen, then replaced by another, then another. Of course, this distinction isn't important
when we're dealing with a static GIF, made up of a single frame drawn to the logical screen.

GIF uses a lossless data compression method—a variant of the "[Lempel–Ziv–Welch](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch)"
algorithm, if you're curious. The finer details of how this algorithm works are more than we need to get into here, but at a high level: it
works a bit like "Uglifying" JavaScript, where repeated strings of characters throughout the file are saved to a sort of internal dictionary,
so they can be referenced rather than repeated every time they appear.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/AWgIX677XevD9J0ZUBo3.png", alt="Visualization of the gif reference using a four-by-four grid.", width="800", height="873" %}

Granted, the [algorithm isn't quite as simple](https://giflib.sourceforge.net/whatsinagif/lzw_image_data.html) as a paint-by-number. It steps
again through the generated table of color codes to find repeated sequences of pixel colors and creates a second table of referencable codes. At no
point is any image data lost, however—just sorted and reorganized in a way that can be read without fundamentally changing it.

While GIF technically uses lossless _compression_, it does have a major limitation that severely impacts the quality of the images:
saving an image as a GIF will always result in reduced fidelity, unless the image already uses 256 colors or less.

Each frame drawn to the GIF's logical screen can only contain a maximum of 256 colors. GIF also supports “index transparency,” where a
transparent pixel will reference the index of a transparent “color” in the color table.

The practice of reducing a range of values to a smaller, approximated set of output values is called _quantization_, a term you'll be seeing a lot
when learning about image encodings. The results of this palette quantization are usually obvious:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/PjWX2BD4QXqj3efvX7MP.png", alt="Static gif example", width="393", height="399" %}

To better understand this process, think back to the raster image grid you were able to recreate from my description.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/pwUWoFFo7MVq58e05NnK.png", alt="Three horizontal blue boxes followed by one red box", width="652", height="204" %}

This time around, add a little more detail to that original image: a few more pixels, one of which is a slightly darker shade of blue:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/m9BkyRb7yy1zLBlvlHka.png", alt="Blue to red horizontal boxes in a two-by-four configuration, with one blue box shaded darker than the others", width="752", height="400" %}

Absent any compression—so to speak—you could describe this grid as:

> Row one, column one is #0000FF. Row one, column two is #0000FF. Row one, column three is #0000FF. Row one, column four is #FF0000. Row two, column one is #0000FF. Row two, column two is #000085. Row two, column three is #0000FF. Row two, column four is #FF0000.

Using something akin to GIF's lossless data compression and color indexing, you might describe it as:

> A: #0000FF
> B: #FF0000
> C: #000085
> Row one, columns one through three are A. Row one, column four is B. Row two, column one is A. Row two, column two is C. Row two, column three is A. Row two, column four is B.

This manages to condense the pixel-by-pixel description in a few places (“columns one through three are…”), and saves a
few characters by defining the repeated colors in a dictionary, of sorts, up front. There's no change to the visual fidelity.
The information has been compressed without any loss.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/nNmCqD5iYi1QEEbDeL4M.png", alt="Blue to red horizontal boxes", width="752", height="400" %}

As you can see, however, the single dark blue pixel is having an outsized impact on the size of our encoding. If I were to
limit myself to a quantized color palette, it could be reduced much further:

> A: #0000FF
> B: #FF0000
> Row one, columns one through three are A. Row one, column four is B. Row two, columns one through three are A. Row two, column four is B.

The unfortunate end result of those saved bytes is that you've lost pixel-perfection.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/ZW6SBDsulfvJxC3iZRqd.png", alt="Blue to red horizontal boxes", width="752", height="400" %}

Of course, you, the rendering engine, don't know that—the detail of the darker blue pixel was left out of how I encoded my source image.
You've rendered the image exactly as I've encoded it, based on our shared understanding of the colors we have at hand.

Now, in this exaggerated example, reducing three colors to two makes for an obvious difference in quality. Across a larger and
more detailed image the effects might not be quite as noticeable, but they would still be visible.

When encoded as a GIF, subtle gradients like shadows become mottled, with individual pixels standing out from their surroundings:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/ncTFXA6KsRGAK7Rdvyoi.png", alt="Pink flowers on a green background", width="800", height="595" %}

In practice, the combination of lossless compression and palette quantization means that GIF isn't very useful in modern
web development. Lossless compression doesn't do enough to reduce file sizes, and a reduced palette means an obvious reduction in quality.

Ultimately, GIF is only an efficient format for encoding simple images that already use limited color palettes, hard edges
rather than anti-aliasing, and solid colors rather than gradients—all use cases that are far better served by other formats.
The smaller and more featured PNG is often a better choice for raster images, though both are far inferior to SVG in terms of file
size and visual fidelity for use cases like icons or line art, where vector shines. The most commonly seen modern use case for GIF is
animation, but there are far more efficient—and accessible—modern video formats to serve that purpose.

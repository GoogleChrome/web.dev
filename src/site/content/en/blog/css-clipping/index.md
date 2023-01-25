---
title: Create interesting image shapes with CSS's clip-path property
subhead: >
  Using clipping in CSS can help us move away from everything in our designs looking like a box.
  By using various basic shapes, or an SVG, you can create a clip path.
  Then cut away the parts of an element you don't want to show.
description: >
  Using clipping in CSS can help us move away from everything in our designs looking like a box.
  By using various basic shapes, or an SVG, you can create a clip path.
  Then cut away the parts of an element you don't want to show.
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/Pl4AScfj5y8ovHD1pi64.jpg
alt: Scissors hanging on a wall.
tags:
  - blog
  - css
feedback:
  - api
---

Elements on web pages are all defined inside a rectangular box.
However that doesn't mean that we have to make everything look like a box.
You can use the CSS `clip-path` property to clip away parts of an image or other element,
to create interesting effects.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path?path=README.md&previewSize=100"
    title="clip-path on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

In the example above, the balloon image is square ([source](https://cdn.glitch.com/5984697d-c5e8-4a63-a765-7e7ac3916fc0%2Fround-balloon.jpg?v=1597216988521)).
Using `clip-path` and the basic shape value of `circle()`
the additional sky around the balloon is clipped away leaving a circular image on the page.

As the image is a link you can see something else about the `clip-path` property.
Only the visible area of the image can be clicked on,
as events do not fire on the hidden parts of the image.

Clipping can be applied to any HTML element, not just images.
There are a few different ways to create a `clip-path`, in this post we will take a look at them.

## Browser compatibility

Other than the box values as explained later in the post,
the various values of `clip-path` demonstrated have [excellent browser support](https://caniuse.com/#feat=css-clip-path).
For legacy browsers a fallback may be to allow the browser to ignore the `clip-path` property and show the unclipped image.
If this is a problem you could test for `clip-path` in a feature query and offer an alternate layout for unsupporting browsers.

```css
@supports(clip-path: circle(45%)) {
  /* code that requires clip-path here. */
}
```

## Basic shapes

The `clip-path` property can take a number of values.
The value used in the initial example was `circle()`.
This is one of the basic shape values, which are defined in the
[CSS Shapes specification](https://www.w3.org/TR/css-shapes-1/#basic-shape-functions).
This means that you can clip an area,
and also use the same value for `shape-outside` to cause text to wrap around that shape.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-with-shape?path=README.md&previewSize=100"
    title="clip-path-with-shape on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

{% Aside %}
Note that CSS Shapes can only be applied to floated elements.
The `clip-path` property does not require the element to be floated.
{% endAside %}

The full list of basic shapes is:

- [`inset()`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes/Basic_Shapes#inset)
- [`circle()`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes/Basic_Shapes#circle)
- [`ellipse()`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes/Basic_Shapes#ellipse)
- [`polygon()`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes/Basic_Shapes#polygon)

### `inset()`

The `inset()` value insets the clipped area from the edge of the element,
and can be passed values for the top, right, bottom, and left edges.
A `border-radius` can also be added to curve the corners of the clipped area,
by using the `round` keyword.

In my example I have two boxes both with a class of `.box`.
The first box has no clipping, the second is clipped using `inset()` values.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-inset?path=README.md&previewSize=100"
    title="clip-path-inset on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### `circle()`

As you have seen, the `circle()` value creates a circular clipped area.
The first value is a length or a percentage and is the radius of the circle.
A second optional value allows you to set the center of the circle.
In the example below I am using keyword values to set my clipped circle top right.
You could also use lengths or percentages.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-circle?path=README.md&previewSize=100"
    title="clip-path-circle on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

#### Watch out for flat edges!

Be aware with all of these values that the shape will be clipped by the margin box on the element.
If you create a circle on an image,
and that shape would extend outside of the natural size of the image, you will get a flat edge.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sQPOF6oaR31kjSVGzztu.jpg", alt="A clipped circle with flat edges", width="800", height="427", class="w-screenshot",style="max-inline-size: 480px" %}
  <figcaption>The image used earlier now has <code>circle(50%)</code> applied. As the image is not square, we hit the margin box at the top and bottom and the circle is clipped.</figcaption>
</figure>

### `ellipse()`

An ellipse is essentially a squashed circle,
and so acts very much like `circle()` but accepts a radius for x and a radius for y,
plus the value for the center of the ellipse.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-ellipse?path=README.md&previewSize=100"
    title="clip-path-ellipse on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### `polygon()`

The `polygon()` value can help you create fairly complex shapes,
defining as many points as you need,
by setting the coordinates of each point.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-polygon?path=README.md&previewSize=100"
    title="clip-path-polygon on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

To help you create polygons and see what is possible check out [Clippy](https://bennettfeely.com/clippy/),
a `clip-path` generator,
then copy and paste the code into your own project.

## Shapes from box values

Also defined in CSS Shapes are shapes from [box values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes/From_box_values).
These relate to the CSS Box Model -- the content box, padding box, border box,
and margin box with keyword values of `content-box`, `border-box`, `padding-box`, and `margin-box`.

These values can be used alone, or alongside a basic shape to define the reference box used by the shape.
For example, the following would clip the shape to the edge of the content.

```css
.box {
  clip-path: content-box;
}
```

In this example the circle would use the `content-box` as the reference box rather than the `margin-box` (which is the default).

```css
.box {
  clip-path: circle(45%) content-box;
}
```

Currently browsers do not support the use of box values for the `clip-path` property.
They are supported for `shape-outside` however.

## Using an SVG element

For more control over your clipped area than is possible with basic shapes,
use an SVG `clipPath` element.
Then reference that ID, using `url()` as the value for `clip-path`.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-svg?path=README.md&previewSize=100"
    title="clip-path-svg on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Animating the clipped area

CSS transitions and animations can be applied to the `clip-path` to create some interesting effects.
In this next example I am animating a circle on hover by transitioning between two circles with a different radius value.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/clip-path-animated?path=README.md&previewSize=100"
    title="clip-path-animated on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

There are lots of creative ways in which animation can be used with clipping.
[Animating with clip-path](https://css-tricks.com/animating-with-clip-path/) on CSS Tricks runs through some ideas.

_Photo by [Matthew Henry](https://burst.shopify.com/@matthew_henry) on Burst._

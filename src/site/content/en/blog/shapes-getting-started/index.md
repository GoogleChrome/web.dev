---
layout: post
title: Getting Started with CSS Shapes
subhead: Wrapping content around custom paths
authors:
  - razvancaliman
date: 2014-09-16
updated: 2014-09-17
tags:
  - blog
---

For a long time, web designers have been forced to create within the constraints of the rectangle. Most content on the web is still trapped in simple boxes because most creative ventures into non-rectangular layout end in frustration. That is about to change with the introduction of CSS Shapes, available starting with Chrome 37.
CSS Shapes allow web designers to wrap content around custom paths, like circles, ellipses and polygons, thus breaking free from the constraints of the rectangle.

Shapes can be defined manually or they can be inferred from images.

Let's look at a very simple example.

Perhaps you've been as naïve as me when first floating an image with transparent parts expecting the content to wrap and fill the gaps, only to be disappointed by the rectangular wrap shape persisting around the element. CSS Shapes can be used to solve this problem.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/xi3LbvT89PfuyhpK4aHh.jpg", alt="Extracting a shape from an image", width="660", height="400" %}
</figure>

```html
<img class="element" src="image.png" />
<p>Lorem ipsum…</p>

<style>
.element{
  shape-outside: url(image.png);
  shape-image-threshold: 0.5;
  float: left;
}
</style>
```

The `shape-outside: url(image.png)` CSS declaration tells the browser to extract a shape from the image.

The `shape-image-threshold` property defines the minimum opacity level of pixels that will be used to create the shape. Its value must be in the range between `0.0` (fully transparent) and `1.0` (fully opaque). So, `shape-image-threshold: 0.5` means that only pixels with opacity 50% and above will be used to create the shape.

The `float` property is key here. While the `shape-outside` property defines the shape of the area around which content will wrap, without the float, you won't see the effects of the shape.

Elements have a float area on the opposite side of their `float` value. For example, if an element with a coffee cup image is being floated left, the float area will be created to the right of the cup. Even though you can engineer an image with gaps on both sides, content will only wrap around the shape on the opposite side designated by the float property, left or right, never both.

In the future, it will be possible to use `shape-outside` on elements which are not floated with the introduction CSS Exclusions.

## Creating shapes manually

Beyond extracting shapes from images, you can also code them manually. You can choose from a few functional values to create shapes: `circle()`, `ellipse()`, `inset()` and `polygon()`. Each shape function accepts a set of coordinates and it is paired with a reference box which establishes the coordinate system. More about reference boxes in a moment.

## The circle() function

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/jnKehwelADiEqVH9NMmX.png", alt="Illustration of the circle() shape value", width="660", height="220" %}
</figure>

The full notation for a circle shape value is `circle(r at cx cy)` where `r` is the radius of the circle, while `cx` and `cy` are coordinates of the circle center on the X-axis and Y-axis. The coordinates for the circle center are optional. If you omit them, the center of the element (the intersection of its diagonals) will be used as the default.

```css
.element{
  shape-outside: circle(50%);
  width: 300px;
  height: 300px;
  float: left;
}
```

In the example above, content will wrap around the outside of a circular path. The single argument `50%` specifies the radius of the circle, which, in this specific case, amounts to half of the element's width or height. Changing the dimensions of the element will influence the radius of the circle shape. This is a basic example of how CSS Shapes can be responsive.

Before going further, a quick aside: it is important to remember that CSS Shapes influence only the shape of the float area around an element. If the element has a background, that will not be clipped by the shape. To achieve that effect, you must use properties from [CSS Masking](http://www.html5rocks.com/en/tutorials/masking/adobe/) - either [clip-path](http://docs.webplatform.org/wiki/css/properties/clip-path) or [mask-image](http://docs.webplatform.org/wiki/css/properties/mask-image). The `clip-path` property comes in very handy because it follows the same notation as CSS Shapes, so you can reuse values.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/zAHfcfEKxoEa9q8p6kE0.png", alt="Illustration of `circle()` shape + clip-path", width="660", height="290" %}
</figure>

Illustrations throughout this document use clipping to highlight the shape and help you understand the effects.

Back to the circle shape.

When using percentages for the circle radius, the value is actually computed with a slightly more complex [formula](http://www.w3.org/TR/css-shapes/#funcdef-circle): sqrt(width^2 + height^2) / sqrt(2). It's useful to understand this because it will help you imagine what the resulting circle shape will be if the element's dimensions are not equal.

All CSS unit types can be used in shape function coordinates - px, em, rem, vw, vh, and so forth. You can pick the one which is flexible or rigid enough for your needs.

You can adjust the circle's position by setting explicit values for the coordinates of its center.

```css
.element{
  shape-outside: circle(50% at 0 0);
}
```

This positions the circle center at the origin of the coordinate system. What is the coordinate system? This is where we introduce reference boxes.

## Reference boxes for CSS Shapes

The reference box is a virtual box around the element, which establishes the coordinate system used to draw and position the shape. The origin of the coordinate system is at its upper-left corner with the X-axis pointing to the right and the Y-axis pointing down.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/UY8jOJVxbglzUnVTr5rH.png", alt="Coordinate system for CSS Shapes", width="660", height="310" %}
</figure>

Remember that `shape-outside` alters the shape of the float area around which content will wrap. The float area extends to the outer edges of the box defined by the `margin` property. This is called the `margin-box` and it is the default reference box for a shape if none is explicitly mentioned.

The following two CSS declarations have identical results:

```css
.element{
  shape-outside: circle(50% at 0 0);
  /* identical to: */
  shape-outside: circle(50% at 0 0) margin-box;
}
```

We have not yet set a margin on the element. At this point it is safe to assume that the origin of the coordinate system and the circle center are at the upper-left corner of the element's content area. This changes when you do set a margin:

```css
.element{
  shape-outside: circle(50% at 0 0) margin-box;
  margin: 100px;
}
```

The origin of the coordinate system now lies outside the element's content area (100px up and 100px left), as does the circle center. The computed value of the circle radius also grows to account for the increased surface of the coordinate system established by the `margin-box` reference box.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/90l2cTKm1tLgSajkStCu.png", alt="Margin-box coordinate system with and without margin", width="660", height="500" %}
<figure>

There are a few reference box options to choose from: `margin-box`, `border-box`, `padding-box` and `content-box`. Their names imply their boundaries. We previously explained the `margin-box`. The `border-box` is constrained by the outer edges of the element's borders, the `padding-box` is constrained by the element's padding, while the `content-box` is identical to the actual surface area used by the content within an element.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/NWIXGzzRmUcWtS863jCu.png", alt="Illustration of all reference boxes", width="800", height="350" %}
</figure>

Only one reference box can be used at a given time with a `shape-outside` declaration. Each reference box will influence the shape in a different and sometimes subtle way. There is another article which delves deeper and helps you [understand reference boxes for CSS Shapes](http://razvancaliman.com/writing/css-shapes-reference-boxes).

## The ellipse() function

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/FarSgibjiuXojpuukfsX.png", alt="Illustration of ellipse() shape value", width="660", height="240" %}
</figure>

Ellipses look like squished circles. They are defined as `ellipse(rx ry at cx cy)`, where `rx` and `ry` are the radii for the ellipse on the X-axis and Y-axis, while `cx` and `cy` are the coordinates for the center of the ellipse.

```css
.element{
  shape-outside: ellipse(150px 300px at 50% 50%);
  width: 300px;
  height: 600px;
}
```

Percentage values will be computed from the dimensions of the coordinate system. No funny maths required here. You can omit the coordinates for the ellipse center and they will be inferred from the center of the coordinate system.

Radii on the X and Y axes may also be defined with keywords: `farthest-side` yields a radius equal to the distance between the ellipse center and the side of the reference box farthest away from it, while `closest-side` means the exact opposite - use the shortest distance between the center and a side.

```css
.element{
  shape-outside: ellipse(closest-side farthest-side at 50% 50%);
  /* identical to: */
  shape-outside: ellipse(150px 300px at 50% 50%);
  width: 300px;
  height: 600px;
}
```

This may come in handy when the element's dimensions (or the reference box) may change in unpredictable ways, but you want the ellipse shape to adapt.

The same `farthest-side` and `closest-side` keywords can also be used for the radius in the `circle()` shape function.

## The polygon() function

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/nXbsN26mVG6KDsuGEf5u.jpg", alt="Illustration of polygon() shape value", width="660", height="480" %}
</figure>

If circles and ellipses are too limiting, the polygon shape function opens up a world of options. The format is `polygon(x1 y1, x2 y2, ...)` where you specify pairs of x y coordinates for each vertex (point) of a polygon. The minimum number of pairs to specify a polygon is three, a triangle.

```css
.element{
  shape-outside: polygon(0 0, 0 300px, 300px 600px);
  width: 300px;
  height: 600px;
}
```

Vertices are placed on the coordinate system. For responsive polygons you can use percentage values for some or all of the coordinates.

```css
.element{
  /* polygon responsive to font-size*/
  shape-outside: polygon(0 0, 0 100%, 100% 100%);
  width: 20em;
  height: 40em;
}
```

There is an optional `fill-rule` parameter, [imported from SVG](http://www.w3.org/TR/SVG/painting.html#FillRuleProperty), which instructs the browser how to consider the “insideness” of a polygon in case of self-intersecting paths or enclosed shapes. Joni Trythall explains very well [how the fill-rule property works](http://www.sitepoint.com/understanding-svg-fill-rule-property/) in SVG. If not defined, the `fill-rule` defaults to `nonzero`.

```css
.element{
  shape-outside: polygon(0 0, 0 100%, 100% 100%);
  /* identical to: */
  shape-outside: polygon(nonzero, 0 0, 0 100%, 100% 100%);
}
```

## The inset() function

The `inset()` shape function allows you create rectangular shapes around which to wrap content. This might sound counter-intuitive considering the initial premise that CSS Shapes free web content from simple boxes. It may very well be. I have yet to find a use case for `inset()` which isn't already achievable with floats and margins or with a `polygon()`. Though `inset()` does provide a more readable expression for rectangular shapes than `polygon()`.

The full notation for an inset shape function is `inset(top right bottom left border-radius)`. The first four position arguments are offsets inwards from the element's edges. The last argument is the border radius for the rectangular shape. It is optional, so you can leave it out. It follows the `border-radius` shorthand notation you already use in CSS.

```css
.element{
  shape-outside: inset(100px 100px 100px 100px);
  /* yields a rectangular shape which is 100px inset on all sides */
  float: left;
}
```

## Creating shapes from reference-boxes

If you don't specify a shape function to the `shape-outside` property, you can allow the browser to derive a shape from the element's reference box. The default reference box is `margin-box`. Nothing exotic so far, that's how floats already work. But applying this technique, you can reuse the geometry of an element. Let's look at the `border-radius` property.

If you use it to round the corners of a floated element, you get the clipping effect, but the float area remains rectangular. Add `shape-outside: border-box` to wrap around the contour created by the `border-radius`.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/YWeagoH1SuHlaw52AVjX.png", alt="Extracting a shape from an element's border-radius using the border-box reference box", width="660", height="390" %}
</figure>

```css
.element{
  border-radius: 50%;
  shape-outside: border-box;
  float: left;
}
```

Of course, you can use all the reference boxes in this manner. Here's another use for derived shapes - offset pull-quotes.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/24DvVC5KcEqNwhtstFS5.png", alt="Creating an offset pull-quote using the content-box reference box", width="660", height="380" %}
</figure>

It is possible to achieve the offset pull-quote effect by using only float and margin properties. But that requires you to position the quote element in the HTML tree at the point you want it to render.

Here's how to achieve the same offset pull-quote effect with added flexibility:

```css
.pull-quote{
  shape-outside: content-box;
  margin-top: 200px;
  float: left;
}
```

We explicitly set the `content-box` reference box for the shape's coordinate system. In this case, the amount of content in the pull-quote defines the shape around which outside content will wrap. The `margin-top` property is used here to position (offset) the pull-quote, regardless of its position in the HTML tree.

## Shape margin

You'll notice that wrapping content around a shape can make it rub too closely against the element. You can add spacing around the shape with the `shape-margin` property.

```css
.element{
  shape-outside: circle(40%);
  shape-margin: 1em;
  float: left;
}
```

The effect is similar to what you're used to from using the regular `margin` property, but the `shape-margin` affects only the space around `shape-outside` value. It will add spacing around the shape only if there is room for it in the coordinate system. That's why in the example above the circle radius is set to 40%, not 50%. If the radius was set to 50%, the circle would have taken up all the space in the coordinate system leaving no room for the effect of `shape-margin`. Remember, the shape is ultimately constrained to the element’s `margin-box` (the element plus its surrounding `margin`). If the shape is larger and overflows, it will be clipped to the `margin-box` and you will end up with a rectangular shape.

It's important to understand that `shape-margin` accepts only a single positive value. It does not have a long-hand notation. What is a shape-margin-top for a circle, anyway?

## Animating shapes

You can mix CSS shapes with many other CSS features, such as transitions and animations. Though, I must stress that users find it very annoying when text layout changes while they're reading. Pay close attention to the experience if you do decide in favor of animating shapes.

You can animate the radii and centers for `circle()` and `ellipse()` shapes as long as they're defined in values that the browser can interpolate. Going from `circle(30%)` to `circle(50%)` is possible. However, animating between `circle(closest-side)` to `circle(farthest-side)` will choke the browser.

```css
.element{
  shape-outside: circle(30%);
  transition: shape-outside 1s;
  float: left;
}

.element:hover{
  shape-outside: circle(50%);
}
```
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/9u9cOCEXbNZxmi0lwnTg.gif", alt="GIF of animated circle", width="660", height="220" %}
</figure>

More interesting effects can be achieved when animating `polygon()` shapes, with the important note that the polygon must have the same number of vertices between the two animation states. The browser can't interpolate if you add or remove vertices.

One trick is to add the maximum amount of vertices you need and position them clustered together in the animation state where you want fewer perceived edges to the shape.

```css
.element{
  /* four vertices (looks like rectangle) */
  shape-outside: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  transition: shape-outside 1s;
}

.element:hover{
  /* four vertices, but second and third overlap (looks like triangle) */
  shape-outside: polygon(0 0, 100% 50%, 100% 50%, 0 100%);
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/R7mVYgZXuzOpG6TqoJY5.gif", alt="GIF of animated triangle", width="660", height="220" %}
</figure>

## Wrapping content inside a shape

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/QeB4NkU6zfkEM8MjdVkC.jpg", alt="Screenshot of Alice in Wonderland demo using CSS Shapes to wrap content", width="660", height="447" %}
</figure>

The initial draft of the CSS Shapes specification included a `shape-inside` property which allowed you to wrap content inside of a shape. There were even implementations in Chrome and Webkit for a while. But wrapping arbitrarily-positioned content inside a custom path requires much more effort and research to cover all possible scenarios and avoid bugs. That's why the `shape-inside` property has been deferred to [CSS Shapes Level 2](http://dev.w3.org/csswg/css-shapes-2/) and implementations for it have been withdrawn.

However, with some effort and a bit of compromise, you can still achieve the effect of wrapping content inside a custom shape. The hack is to use two floated elements with `shape-outside`, positioned at opposite sides of a container. The compromise is that you have to use one or two empty elements which have no semantic meaning, but serve as the struts to create the illusion of a shape inside.

```html
<div>
  <div class='left-shape'></div>
  <div class='right-shape'></div>

  Lorem ipsum...
</div>
```

The position of the `.left-shape` and `.right-shape` strut elements at the top of the container is important because they will be floated to the left and to right in order to flank the content.

```css
.left-shape{
  shape-outside: polygon(0 0, ...);
  float: left;
  width: 50%;
  height: 100%;
}

.right-shape{
  shape-outside: polygon(50% 0, ...);
  float: right;
  width: 50%;
  height: 100%;
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/fvFledoh6z5Z4lGVmAKY.jpg", alt="Illustration of workaround for shape-inside for Alice demo", width="660", height="447" %}
</figure>

This styling makes the two floated struts take up all the space within the element, but the `shape-outside` properties carve out space for the rest of the content.

If CSS Shapes are not supported by the browser, this will yield ugly effects by pushing all of the content down. That's why it's important to use the feature in a progressively enhanced manner.

In the earlier shape animation examples, you'll notice that text shifting around can be bothersome. Not all use cases warrant an animated shape. But you can animate other properties which interact with CSS Shapes to add effect where it makes sense.

In the [Alice in Wonderland](http://adobe-webplatform.github.io/Demo-for-Alice-s-Adventures-in-Wonderland) demonstration of CSS Shapes, we used the scroll position to change the top margin of the content. The text is squeezed between two floated elements. As it moves down, it has to relayout according to the `shape-outside` of the two floated elements. This gives the impression that the text is going down the rabbit hole and it adds to the storytelling experience. Borderline gratuitous? Maybe. But it does look cool.

Because the text layout is done natively by the browser, the performance is better than using a JavaScript solution. But changing the margin-top on scroll does trigger lots of relayout and paint events, and that may noticeably reduce performance. Use with caution! However, using CSS Shapes without animating them does not come with a perceivable performance hit.

## Progressive enhancement

Start off by assuming that the browser does not have CSS Shapes support and build up on that when you do detect the feature. [Modernizr](http://modernizr.com/) is a good solution to do feature detection and there is a test for CSS Shapes in the ['Non-core detects'](http://modernizr.com/download/#-css_shapes) section.

Some browsers provide feature detection in CSS via the `@supports` rule without the need for external libraries. Google Chrome, which also supports CSS Shapes, understands the `@supports` rule. This is how you use it to progressively enhance:

```css
.element{
  /* styles for all browsers */
}

@supports (shape-outside: circle(50%)){
  /* styles only for browsers which support CSS Shapes */
  .element{
    shape-outside: circle(50%);
  }
}
```

[Lea Verou](https://twitter.com/leaverou) has written more about [how to use the CSS @supports rule](http://www.creativebloq.com/css3/how-use-supports-rule-your-css-11410545).

## Disambiguation from CSS Exclusions

What we know today as CSS Shapes used to be called CSS Exclusions and Shapes in the early days of the spec. The switch in naming might seem as a nuance, but it is actually very important. [CSS Exclusions](http://dev.w3.org/csswg/css-exclusions/), now a separate spec, enables wrapping content around elements positioned arbitrarily, without the need for a float property. Imagine wrapping content around an absolutely-positioned element; that's a use case for CSS Exclusions. CSS Shapes just define the path around which the content will wrap.

So, shapes and exclusions are not the same thing, but they do complement each other. CSS Shapes are available in browsers today, while CSS Exclusions are not yet implemented with shapes interaction.

## Tools for working with CSS Shapes

You can create paths in classic image authoring tools, but none of them, at the time of this writing, exports the required syntax for CSS Shapes values. Even if they did, working like that wouldn't be too practical.

CSS Shapes are meant to be used in the browser, where they react to other elements on the page. It's very useful to visualize the effects of editing the shape on the content which surrounds it. There are a few tools to help you with this workflow:

**Brackets**: The [CSS Shapes Editor extension for Brackets](http://blog.brackets.io/2014/04/17/css-shapes-editor/) uses the code editor's live preview mode to overlay an interactive editor for editing shape values.

**Google Chrome**: The [CSS Shapes Editor extension for Google Chrome](https://chrome.google.com/webstore/detail/css-shapes-editor/nenndldnbcncjmeacmnondmkkfedmgmp) extends the browser's Developer Tools with controls to create and edit shapes. It places an interactive editor on top of the selected element.

The inspector in Google Chrome has built-in support for highlighting shapes. Hover over an element with a `shape-outside` property and it will light up to illustrate the shape.

**Shapes from images**: If you prefer to generate images and have the browser extract shapes from them, Rebecca Hauck has written a good [tutorial for Photoshop](http://blogs.adobe.com/webplatform/2014/03/11/add-shape-and-depth-to-your-layout-with-photoshop-and-css-shapes/).

**Polyfill**: Google Chrome is the first major browser to ship CSS Shapes. There is upcoming support for the feature on Apple's iOS 8 and Safari 8. Other browser vendors may consider it in the future. Until then, there is a [CSS Shapes polyfill](https://github.com/adobe-webplatform/css-shapes-polyfill) to provide basic support.

## Conclusion

In a web where content is mostly trapped in simple boxes, CSS Shapes provide a way to create expressive layout, bridging the fidelity gap between web and print design. Of course, shapes can be abused and create distractions. But, when applied with taste and good judgement, shapes can enhance the content presentation and focus the user’s attention in a way which is unique to them.

I leave you with a [collection of work](https://www.behance.net/collection/25035325/Shapes) by others, mostly from print, which demonstrates interesting uses for non-rectagular layout. I hope this inspires you to try CSS Shapes and experiment with new design ideas.

Many thanks to Pearl Chen, Alan Stearns and Zoltan Horvath for reviewing this article and providing valuable insight.


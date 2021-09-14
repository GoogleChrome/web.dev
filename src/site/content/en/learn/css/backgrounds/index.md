---
title: Backgrounds
description: >
  In this module learn the ways you can style backgrounds of CSS boxes using CSS
audio:
  title: The CSS Podcast - 053: Background
  src: https://traffic.libsyn.com/secure/thecsspodcast/TCP052_v1.mp3?dest-id=1891556
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
 - lozandier
date: 2021-9-15

---

# Backgrounds

Behind every CSS box is a specialized layer behind the content called the background layer. CSS provides a variety of ways to make meaningful changes to it–including allowing multiple layers.

This module overviews the ways CSS authors can control the styles of this space.

Background layers are furthest from the user, rendered behind the contents of a CSS box starting from its `padding-box` region. This enables the background layer to not overlap with borders at all.

{% Codepen {
  user: 'argyleink',
  id: 'BaLedvd',
  tab: 'css,result'
} %}

By default, the background layer is directly behind the `border-box` region of a CSS box, a border specified for a CSS box is therefore rendered on top of the background layer, even when a background layer is extended to cover the `border-box`.

## Background Color

One of the simplest effects you can apply to a background layer is set a [valid CSS color](). The initial value of `background-color` is `transparent`, which allows the contents of a parent to be seen through a CSS box.

A color set on a background layer sits behind other things painted on a CSS box. This includes borders and outlines (editor’s note: Will deliberately set background-origin to border-box). The demo below demonstrates this.

{% Codepen {
  user: 'web-dot-dev',
  id: 'XWgRRMQ',
  tab: 'css,result'
} %}

A `background-color` is also guaranteed to sit behind other layers you can create with background-related CSS properties such as a background-image. More on that next.

## Background Image

On top of the `background-color` is a background image, added with the `background-image` property. A `background-image` accepts the following:

* A URL or data URLI using the `url` CSS function.
* An image dynamically created by a gradient CSS function.

### Setting a background-image with the `url` CSS function.

The `url()` CSS  function enables CSS authors to reference a resource as an absolute URL, relative URL, or embed a resource itself in a CSS document by referencing the resource as a  data URI.

The following demo demonstrates this:
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjJNNro',
  tab: 'css,result'
} %}

{% Aside %}
What’s the difference between  absolute URls, relative URLs, and data URIs?

URL is short for uniform resource locator a standardized way to find resources on the web.

*Absolute URLs* are URLs with all the information needed for a browser to fetch a resource at a particular location on the web regardless where the request originated from.


```
#someElement {
  background-image: url('https://images.unsplash.com/photo-1536707076730-0615b7f5b49a');
}
```

Whether in this stylesheet or referenced directly in a browser address bar, `https://images.unsplash.com/photo-1536707076730-0615b7f5b49a` is a URL that can be used to consistently & securely fetch a particular image from images.unsplash.com.

*Relative URLs* are URLs that instruct the browser to attempt to fetch a resource relative to the file the URL was embedded in.

```
#anotherElement {
  background-image: url(‘.../some-relative-path/image.png’)
}
```

The `.../some-relative-path/image.png` URL within the stylesheet enables an image to be reliably fetched assuming the location of both the stylesheet & image does not change.

**Data URIs** are a means of describing a resource as bytes of data embedded where it is described; when used by the URL function, you're effectively “inling” the file.


A data URL represents an image as a base64 encoded string. This leads to often a very long string necessary to represent the image accurately:

```
#demoBox {
    background: url('data:image/jpeg;base64,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');
  }
  ```
{% endAside %}


### Setting a background-image with CSS gradient functions

Several gradient CSS functions exist to allow you to generate a background-image, when passed two or more colors.

To learn more about the different types of gradients available, see the [CSS module on gradients](https://web.dev/learn/css/gradients/). You can use any of the gradient types as the value for `background-image`.


Regardless of which gradient CSS function is used, the resulting image is [intrinsically sized](https://web.dev/learn/css/box-model/#content-and-sizing) to match the amount of space a background is taking up behind a CSS box.

{% Codepen {
  user: 'web-dot-dev',
  id: 'JjJNNro',
  tab: 'result'
} %}

## Background Repeat

By default, background images are repeated horizontally and vertically to fill the entire space the background layer occupies.

This can be changed by using the `background-repeat` property. The property offers many options to accommodate a variety of use cases.

* `repeat` repeats an image as much as possible within the space available, cropping as necessary.


{% Codepen {
  user: 'web-dot-dev',
  id: 'NWgjgVP',
  tab: 'result'
} %}

{% Codepen {
  r
  user: 'lozandier',
  id: 'PojmJyE',
  tab: 'result'
} %}

* `round` repeats an image horizontally and vertically to fit as many instances of the image into the space available, without cropping, compressing, or stretching instances of the image.

{% Codepen {
  user: 'web-dot-dev',
  id: 'NWgjgYQ',
  tab: 'result'
} %}

* `space` repeats an image horizontally and vertically to fit as many instances of the image within the space available to the background layer without cropping—spacing out instances of the image as needed. This behavior will have instances of repeating images touching edges of the space a background layer occupies, with white space evenly distributed between all instances:
```
[Demo] Demonstrating the use of the  space property with a round/rectangular image (ideally the same image used in previous code snippet) to illustrate the difference
```

* `no-repeat` ensures the image is not repeated.

{% Codepen {
  user: 'web-dot-dev',
  id: 'yLXbzeq',
  tab: 'result'
} %}

{% Codepen {
  user: 'lozandier',
  id: 'vYZmZvV',
  tab: 'result'
} %}



The `background-repeat` property allows you to leverage such options for for the x and y axis independently by default. The first parameter sets the horizontal repeat behavior, and the second parameter sets the vertical repeat behavior.

If you use a single value, it will be applied to both the horizontal and vertical repeats.

The shorthand also has the following convenient one-word options to make clearer your intent.

* `repeat-x`  repeats an image only horizontally; this is equivalent to `repeat no-repeat`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'jOwmaWo',
  tab: 'result'
} %}

* `repeat-y`:  repeats an image only vertically; this is equivalent to `no-repeat repeat`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNwWomd',
  tab: 'result'
} %}

The following demo shows all of the one-word options.
{% Codepen {
  user: 'web-dot-dev',
  id: 'powPdMb',
  tab: 'result'
} %}

## Background Position
You may have noticed that when set to `no-repeat`, the image displayed at the top left .

This is the default position of images on the background-layer. The `background-position` allows you to change this behavior by offsetting the image position.


As with `background-repeat`,  the `background-position` property allows you to position images along the x and y axis independently with two values by default.

When CSS lengths and percentages are used, the first parameter corresponds to the horizontal axis while the second parameter corresponds to the vertical axis.

When keywords are used the order of the keywords does not matter:

```css
#foo {
  // Works
  background-position: left 50%

// works
background-position: top left;

// Works
background-position: left top;

 //won't work
  background-position: 50% left;
}
```

The `background-position` property also has a convenient one value shorthand; the omitted value resolves to `50%`.  Here’s an example that demonstrates this using the keywords the `background-position` property accepts:

{% Codepen {
  user: 'web-dot-dev',
  id: 'eYRWyZE',
  tab: 'result'
} %}



When three or four parameters are used, a CSS length or percentage must be preceded by the `top`, `left`, `right`, or `bottom` keywords in order for the browser to calculate which edge of the CSS box the offset should originate from.

When three parameters are used, a CSS length or value can be the second or third parameter with the other two being keywords; the keyword it succeeds will be used to determine the edge the CSS length or value corresponds to being the offset of. The offset of the other keyword specified is set to 0.

The following code snippet demonstrates these two points

```css
/* Works */
background-position: bottom 88% right;

/* Works */
background-position: right bottom 88%;

/* Doesn't work; CSS length value must be preceded by the 'top', 'right', 'bottom', or 'left keywords when using 3 or more parameters */
background-position: 88% bottom right;

/* Works */
background-position: bottom 88% right 33%;

/* Works */
background-position: right 33% bottom 88%;

/* Doesn't work; CSS length value must be preceded by the 'top', 'right', 'bottom', or 'left keywords when using 3 or more parameters */
background-position: 88% 33% bottom left;
```

If `background-position: top left 20%` declaration is applied to a CSS background image, the `20%` value represents the 20% X offset from the left of the CSS box, in addition to the image being placed at the very top of the CSS box.

{% Codepen {
  user: 'web-dot-dev',
  id: 'GREmymK',
  tab: 'result'
} %}

 If `background-position: top 20% left` declaration is applied to a CSS background image, the 20% value represents the 20% Y offset from the top of the CSS box, in addition to the image being at the very left of the CSS box.

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNwmpYJ',
  tab: 'result'
} %}

When four parameters are used, the two keywords are paired with two values corresponding to an offset against the origins of each keyword specified. If `background-position: bottom 20% right 30%` is applied to a background-image, the background-image is positioned 20% from the bottom of the CSS box and and 30% away from the right of the CSS box.

{% Codepen {
  user: 'web-dot-dev',
  id: 'jOwwxXy',
  tab: 'result'
} %}

Here are more examples of using the background-position property using a mix of CSS and keyword values:

{% Codepen {
  user: 'web-dot-dev',
  id: 'ZEyyREr',
  tab: 'result'
} %}

## Background Size
The `background-size` property enables you to set the size of background images; By default background images are sized based on their intrinsic (actual) width, height, and aspect ratio.

 The `background-size` can be changed with CSS length and percentage values or specific keywords.  The property accepts up to two parameters corresponding to allowing you to change width and height of a background independently. With the exception of certain keywords, one parameter used translates to the width of a background image being calculated based on that parameter. The height of the background image is calculated based on the calculated width from that ratio taking into account the aspect ratio of the image.

Background-size accepts the following keywords:


* `auto` The default behavior of the `background-size` property, enabling sizing to be based on the intrinsic proportions of an image. When used independently, the background image is sized based on its intrinsic width and height; when `auto` is used alongside another CSS value for the width (first parameter) or height (second parameter) of an image, the auto-sized width or height is sized as needed to maintain the natural aspect ratio of the image.

* `cover`: Sizes the image, with its intrinsic aspect ratio in mind, to cover the entire area of the background layer. This may mean the image is stretched or cropped.


* `contain`:  Sizes the image, with its intrinsic aspect ratio in mind,  as large as it can without stretching or cropping. As a result, empty space can remain that will cause the image to repeat as needed to occupy that space as usual unless the default behavior of `background-repeat` is changed

The latter 2 are intended to be used in a standalone fashion without another parameter.

The following demo demonstrates these keywords in action:

{% Codepen {
  user: 'web-dot-dev',
  id: 'XWggxJY',
  tab: 'result'
} %}

## Background Attachment
The `background-attachment` property enables you to modify the fixed position behavior of background images (images part of a background layer) once the layer is visible on a screen.

It accepts 3 keywords: `scroll`, `fixed`, and `local`.

* `scroll`: The default behavior of the `background-attachment` property. The position of background images within the background layer are fixed to the CSS box. Once the space of the background layer images originally takes up needs to be scrolled (or rendered) offscreen, the images move with that space within the background layer determined by the bounds of the CSS box.

{% Codepen {
  user: 'web-dot-dev',
  id: 'mdwwzOe',
  tab: 'result'
} %}

* `fixed`: The use of this keyword fixes the position of background images to the viewport.  Background images continually take up the space they’re specified to occupy on a background layer regardless of how much of the background-layer is actually visible on the viewport .

Once the space of the background layer images originally takes up needs to be scrolled (or rendered) offscreen, images within the background layer stay fixed in the original position the background layer enabled them to be until the entire layer is scrolled off screen by the viewport.

{% Codepen {
  user: 'web-dot-dev',
  id: 'MWoozvN',
  tab: 'result'
} %}

`local` : The use of this keyboard enables the position of background images to be fixed relative to the element’s contents. The position surface area of the background layer is now determined by a CSS box’s entire contents in mind instead of the bounds of the CSS box. Background images accordingly now move along the space they occupy as that space renders inside and outside the bounds of the CSS box (usually as a result of scrolling or 2D/3D transformations).

## Background Origin
The `background-origin` property enables you to modify the area of the background layer of a box. The most useful values for this property correspond to the `border-box` , `padding-box`, and `content-box` regions of a box.

The `background-origin` property enables you to modify the area of backgrounds associated with a particular CSS box. The values the property accepts correspond to the `border-box` , `padding-box`, and `content-box` regions of a CSS box .

* `padding-box`: Backgrounds are rendered behind the contents of a CSS box starting from the `padding-box`  region of a CSS box.  This enables the background layer to not overlap with borders at all. This is the default area of backgrounds.


*  `border-box`: Backgrounds are rendered behind the contents of a CSS box starting from the `border-box` region of a CSS box. When a background layer originates from the border-box, the background layer is directly behind the border of a CSS box. Borders are painted on top of the background-layer.


 * `content-box`:  Backgrounds are rendered behind the contents of a CSS box starting from the `content-box` region of a CSS box. This is the smallest area backgrounds can occupy within a CSS box.

Try these options out using the following demo:

{% Codepen {
  user: 'web-dot-dev',
  id: 'OJggqJO',
  tab: 'result'
} %}

## Background Clip
The `background-clip` property allows you to control what is visually seen from a background layer regardless of the bounds created by the `background-origin` property.

This enables you to set-up the visual representation of a background layer prior to constraining what is seen from that arrangement for a variety of interesting effects.

Like `background-origin` the regions that can be specified are `border-box`, `padding-box`, and `content-box` corresponding to where a CSS background layer can be rendered. When these keywords are used, any rendering of the background further than the CSS box region specified will be cropped or clipped.

{% Codepen {
  user: 'web-dot-dev',
  id: 'vYZZPjp',
  tab: 'result'
} %}

The `background-clip` property also accepts a  `text` keyword that clips the background to be no further than the text within the content box.  For this effect to be evident in the actual text within a CSS box, the text must be partially or completely transparent.

A relatively new property, at the time of this writing, Chrome and most browsers require the `-webkit-` prefix to use this property. For up-to-date information about the browsers that support this option for `background-clip`, [check out this compatability table](https://caniuse.com/background-clip-text).

{% Codepen {
  user: 'web-dot-dev',
  id: 'qBjjweL',
  tab: 'result'
} %}


{% Aside %}
It should be also noted this property is not compatible with `background-clip: text` being simultaneously set on a CSS box.
{% EndAside %}

## Multiple Backgrounds
As mentioned at the beginning of the module, the background layer allows multiple sublayers to be defined. For brevity, I’ll refer to these sublayers as merely backgrounds.

Multiple backgrounds are defined top to bottom; The first background is the closest to the user, while the bottommost background is the furthest from the user.

The only background defined or the bottommost layer is designated the *final background layer* by the browser.

{% Aside 'caution' %}
This is important to keep in mind about the final background layer. With the unpredictability of the web in mind, a background-image may fail to load; Accordingly, it’s a good idea to consider setting a background-color on the final layer that ensures good contrast for the text if important background layers fail to load.
{% EndAside %}

The final layer is allowed  to assign a `background-color` while other layers above the final layer do not.

Multiple layers can be individually configured with most background-related CSS properties separating each configuration with a comma, as demonstrated in the code snippet and live demo below.

{% Codepen {
  user: 'web-dot-dev',
  id: 'dyRzQBz',
  tab: 'result'
} %}

## Background Shorthand

To make it less arduous to style the background layer of a CSS box
-especially when multiple background layers are desired–there is a shorthand that follows the following specific pattern:


```css
background:
  <background-image>
  <background-position> / <background-size>?
  <background-repeat>
  <background-attachment>
  <background-origin>
  <background-clip>
  <background-color>?
```

{% Aside 'gotchas' %}
It's important to note–while at times convenient–the background properties omitted in the shorthand are set to their defaults.
{% EndAside %}

Order is strategically meaningful with the shorthand form of declaring multiple backgrounds. The position and size of background are required to be paired with one another separated by a slash (`/`). Declaring the origin and clip behavior of a background image are required to be done in that order in the shorthand to allow you take advantage of keywords that are valid for both can be set both simultaneously

The following declaration sets a CSS box to have the background clipped and originating from the content box

```css
#element {
background: url("https://assets.codepen.io/7518/blob.svg") 50% 50% / contain no-repeat content-box;
}
```

With these shorthand semantics in mind, the previous background-related declarations of the snippet in the previous section that took into account multiple backgrounds could be rewritten as the following:

```css
#element {
  background: url("https://assets.codepen.io/7518/pngaaa.com-1272986.png") 50% 50%/contain no-repeat padding-box, url("https://assets.codepen.io/7518/blob.svg") 10% 50% / cover border-box, linear-gradient(hsl(191deg, 40%, 86%), hsla(191deg, 96%, 96%, 0.5) ) 0% 0% / cover no-repeat content-box;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'YzQxgLV',
  tab: 'result'
} %}

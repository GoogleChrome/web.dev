---
title: Media queries
description: >
  Adapt your designs to different screen sizes using CSS media queries. 
authors:
  - adactio
date: 2021-11-03
updated: 2021-02-08
---

Designers can adjust their designs to accommodate users. 
The clearest example of this is the form factor of a user's device; its width, 
the device aspect ratio, and so on. Using media queries, designers can respond to these different form factors.

Media queries are initiated with the `@media` keyword (a CSS at-rule), and can be used for a variety of use cases.

## Target different types of output

Websites are often displayed on screens but CSS can also be used to style websites for other outputs too. 
You might want your web pages to look one way on a screen but different when printed out. 
Querying media types makes this possible.

In this example, the background color is set to grey. 
But if the page is printed, the background color should be transparent. 
This saves the user's printer ink.

```css
body {
  color: black;
  background-color: grey;
}

@media print {
  body {
    background-color: transparent;
  }
}
```

You can use the `@media` at-rule in your stylesheet like that, 
or you can make a separate stylesheet and use the `media` attribute on a `link` element:

```html
<link rel="stylesheet" href="global.css">
<link rel="stylesheet" href="print.css" media="print">
```

If you don't specify any media type for your CSS, 
it will automatically have a media type value of `all`. These two blocks of CSS are equivalent:

```css
body {
  color: black;
  background-color: white;
}
```

```css
@media all {
   body {
     color: black;
     background-color: white;
   }
}
```

These two lines of HTML are also equivalent:

```html
<link rel="stylesheet" href="global.css">
```

```html
<link rel="stylesheet" href="global.css" media="all">
```


### Query conditions

You can add conditions to media types. These are called media queries. 
The CSS is applied only if the media type matches and the condition is also true. 
These conditions are called _media features_.

This is the syntax for media queries:

```css
@media type and (feature)
```

You can use media queries on a `link` element if your styles are in a separate stylesheet:

```html
<link rel="stylesheet" href="specific.css" media="type and (feature)">
```

Let's say you want to apply different styles depending on whether the browser window is in landscape mode 
(the viewport width is greater than its height) or portrait mode 
(the viewport height is greater than its width). 
There's a media feature called `orientation` you can use to test that:

```css
@media all and (orientation: landscape) {
   // Styles for landscape mode.
}
@media all and (orientation: portrait) {
   // Styles for portrait mode.
}
```

Or if you prefer to have separate stylesheets:

```html
<link rel="stylesheet" href="landscape.css" media="all and (orientation: landscape)">
<link rel="stylesheet" href="portrait.css" media="all and (orientation: portrait)">
```

In this case the media type is `all`. Because that's the default value, you can leave it out if you want:

```css
@media (orientation: landscape) {
   // Styles for landscape mode.
}
@media (orientation: portrait) {
   // Styles for portrait mode.
}
```

Or using separate stylesheets:

```html
<link rel="stylesheet" href="landscape.css" media="(orientation: landscape)">
<link rel="stylesheet" href="portrait.css" media="(orientation: portrait)">
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'qBXVowV',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/gtBzPVsBu5mtnX8RuSqJ.mp4", autoplay=true, controls=true, loop=true %}

While using separate stylesheets for different media _types_—like `print`—might be okay, 
it's probably not a good idea to use a separate stylesheet for every media _query_. Use `@media` at-rules instead.

## Adjust styles based on viewport size

For responsive design, one of the most useful media features involves the dimensions of the browser viewport. 
To apply styles when the browser window is wider than a certain width, use `min-width`.

```css
@media (min-width: 400px) {
  // Styles for viewports wider than 400 pixels.
}
```

Use the `max-width` media feature to apply styles below a certain width:

```css
@media (max-width: 400px) {
  // Styles for viewports narrower than 400 pixels.
}
```

You can use any CSS [length units](https://developer.mozilla.org/docs/Web/CSS/length) in your media queries. 
If your content is mostly image-based, pixels might make the most sense. 
If your content is mostly text-based, 
it probably makes more sense to use a [relative unit](/learn/css/sizing/#relative-lengths) that's based on text size, like `em` or `ch`:

```css
@media (min-width: 25em) {
  // Styles for viewports wider than 25em.
}
```

You can also combine media queries to apply more than one condition. 
Use the word `and` to combine your media queries:

```css
@media (min-width: 50em) and (max-width: 60em) {
  // Styles for viewports wider than 50em and narrower than 60em.
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'GRvOxaw',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/eDf5v1QMwLX19pcJAgYE.mp4", autoplay=true, controls=true, loop=true %}

## Choose breakpoints based on the content

The point at which a media feature condition becomes true is called a breakpoint. 
It's best to choose your breakpoints based on your content rather than popular device sizes, 
as those are subject to change with every technology release cycle.

In this example, `50em` is the point at which the lines of text become uncomfortably long. 
So a breakpoint is created to make the interface more legible. 
Using the `column-count` property, the text is divided into two columns from that point on.

```css
@media (min-width: 50em) {
  article {
    column-count: 2;
  }
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'oNeodgd',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/mrQlcyih7IcZxswI1lMx.mp4", autoplay=true, controls=true, loop=true %}

## Combinations

You can use media queries based on the height of the viewport, not just the width. 
This could be useful for optimizing interface content "above the fold". In the previous example, 
if readers are using a wide but short browser window, 
they have to scroll down one column and then scroll back up to get to the top of the second column. 
It would be safer to only apply the columns when the viewport is both wide enough and tall enough.

You can combine media queries so that the styles only apply when all the conditions are true. 
In this example, the viewport must be at least `50em` wide and `60em` tall in order for the column styles to be applied. 
Those breakpoints were chosen based on the amount of content.

```css
@media (min-width: 50em) and (min-height: 60em) {
  article {
    column-count: 2;
  }
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'JjyOvdM',
 height: 1000,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/oKRBxhrHzAzebYwxptsv.mp4", autoplay=true, controls=true, loop=true %}

These examples show how media queries can be used to adapt designs to the form factor of a user's device, 
but these just scratch the surface of possibilities. Media queries can go far beyond width and height, 
accessing user preferences for accessibility features and theme colors. 
Using media queries to make layout adjustments is a great start to a responsive design, which builds on these features and more.

{% Assessment 'media-queries' %}

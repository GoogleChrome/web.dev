---
title: Ten modern layouts in one line of CSS
subhead: This post highlights a few powerful lines of CSS that do some serious heavy lifting and help you build robust modern layouts.
authors:
  - una
description: This post highlights a few powerful lines of CSS that do some serious heavy lifting and help you build robust modern layouts.
date: 2020-07-07
hero: image/admin/B07IzuMeRRGRLH9UQkwd.png
alt: Holy grail layout.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - css
  - layout
  - mobile
---

{% YouTube 'qm0IfG1GyZU' %}

Modern CSS layouts enable developers to write really meaningful and robust styling rules with just a few keystrokes. The talk above and this subsequent post examine 10 powerful lines of CSS that do some serious heavy lifting.

{% Glitch {
  id: '1linelayouts',
  path: 'README.md',
  height: 480
} %}

To follow along or play with these demos on your own, check out the Glitch embed above, or visit [1linelayouts.glitch.me](https://1linelayouts.glitch.me).

## 01. Super Centered: `place-items: center`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/01-place-items-center.mp4'>
  </video>
</figure>

For the  first 'single-line' layout, let's solve the biggest mystery in all of the CSS land: centering things. I want you to know that it's easier than you think with [`place-items: center`](https://developer.mozilla.org/en-US/docs/Web/CSS/place-items).

First specify `grid` as the `display` method, and then write `place-items: center` on the same element. `place-items` is a shorthand to set both `align-items` and `justify-items` at once. By setting it to `center`, both `align-items` and `justify-items` are set to  `center`.

```css/2
.parent {
  display: grid;
  place-items: center;
}
```

This enables the content to be perfectly centered within the parent, regardless of intrinsic size.

## 02. The Deconstructed Pancake: `flex: <grow> <shrink> <baseWidth>`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4'>
  </video>
</figure>

Next we have the deconstructed pancake! This is a common layout for marketing sites, for example, which may have a row of 3 items, usually with an image, title, and then some text, describing some features of a product. On mobile, we'll want those to stack nicely, and expand as we increase the screen size. 

By using Flexbox for this effect, you won't need media queries to adjust the placement of these elements when the screen resizes.

The [`flex`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) shorthand stands for: `flex: <flex-grow> <flex-shrink> <flex-basis>`.

Because of this, if you want your boxes to fill out to their `<flex-basis>` size, shrink on smaller sizes, but not *stretch* to fill any additional space, write: `flex: 0 1 <flex-basis>`. In this case, your `<flex-basis>` is `150px` so it looks like:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

If you *do* want the boxes to stretch and fill the space as they wrap to the next line, set the `<flex-grow>` to `1`, so it would look like:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```
<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4'>
  </video>
</figure>

Now, as you increase or decrease the screen size,  these flex items both shrink and grow.

## 03. Sidebar Says: `grid-template-columns: minmax(<min>, <max>) …)`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/03-sidebar-says.mp4'>
  </video>
</figure>

This demo takes advantage of the [minmax](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) function for grid layouts. What we're doing here is setting the minimum sidebar size to be `150px`, but on larger screens, letting that stretch out to `25%`. The sidebar will always take up `25%` of its parent's horizontal space until that `25%` becomes smaller than `150px`.

Add this as a value of grid-template-columns with the following value:
`minmax(150px, 25%) 1fr`. The item in the first column (the sidebar in this case) gets a `minmax` of `150px` at `25%`, and the second item (the `main` section here) takes up the rest of the space as a single `1fr` track.

```css/2
.parent {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
}
```

## 04. Pancake Stack: `grid-template-rows: auto 1fr auto`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/04-pancake-stack.mp4'>
  </video>
</figure>

Unlike the Deconstructed Pancake, this example does not wrap its children when the screen size changes. Commonly referred to as a [sticky footer](https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Sticky_footers), this layout is often used for both websites and apps, across mobile applications (the footer is commonly a toolbar), and websites (single page applications often use this global layout).

Adding `display: grid` to the component will give you a single column grid, however the main area will only be as tall as the content with the footer below it.

To make the footer stick to the bottom,  add: 

```css/2
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

This sets the header and footer content to automatically take the size of its children, and applies the remaining space (`1fr`) to the main area, while the `auto` sized row will take the size of the minimum content of its children, so as that content increases in size, the row itself will grow to adjust.

## 05. Classic Holy Grail Layout: `grid-template: auto 1fr auto / auto 1fr auto`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/05-holy-grail.mp4'>
  </video>
</figure>

For this classic holy grail layout, there is a header, footer, left sidebar, right sidebar, and main content. It's similar to the previous layout, but now with sidebars!

To write this entire grid using a single line of code, use the `grid-template` property. This enables you to set both the rows and columns at the same time.

The property and value pair is: `grid-template: auto 1fr auto / auto 1fr auto`. The slash in between the first and second space-separated lists is the break between rows and columns.

```css/2
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
```

As in the last example, where the header and footer had auto-sized content, here the left and right sidebar are automatically sized based on their children's intrinsic size. However, this time it is horizontal size (width) instead of vertical (height).

## 06. 12-Span Grid: `grid-template-columns: repeat(12, 1fr)`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-1.mp4'>
  </video>
</figure>

Next we have another classic: the 12-span grid. You can quickly write grids in CSS with the `repeat()` function. Using: `repeat(12, 1fr);` for the grid template columns gives you 12 columns each of `1fr`.

```css/2,6
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```

Now you have a 12 column track grid, we can place our children on the grid. One way to do this would be to place them using grid lines. For example, `grid-column: 1 / 13` would span all the way from the first line to the last (13th) and span 12 columns. `grid-column: 1 / 5;` would span the first four.

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-2.mp4'>
  </video>
</figure>

Another way to write this is by using the `span` keyword. With `span`, you set the starting line and then how many columns to span into from that starting point. In this case, `grid-column: 1 / span 12` would be equivalent to `grid-column: 1 / 13`, and `grid-column: 2 / span 6` would be equivalent to `grid-column: 2 / 8`.

```css/1
.child-span-12 {
  grid-column: 1 / span 12;
}
```

## 07. RAM (Repeat, Auto, MinMax): `grid-template-columns(auto-fit, minmax(<base>, 1fr))`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-1.mp4'>
  </video>
</figure>

For this seventh example, combine some of the concepts you've already learned about to create a responsive layout with automatically-placed and flexible children. Pretty neat. The key terms to remember here are `repeat`, `auto-(fit|fill)`, and `minmax()'`, which you remember by the acronym RAM.

All together, it looks like:

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

You are using repeat again, but this time, using the `auto-fit` keyword instead of an explicit numeric value. This enables auto-placement of these child elements. These children also have a base minimum value of `150px` with a maximum value `1fr`, meaning on smaller screens, they will take up the full `1fr` width, and as they reach `150px` wide each, they will start to flow onto the same line.

With `auto-fit`, the boxes will stretch as their horizontal size exceeds 150px to fill the entire remaining space. However, if you change this to `auto-fill`, they will not stretch when their base size in the minmax function is exceeded:

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-2.mp4'>
  </video>
</figure>

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
```

## 08. Line Up: `justify-content: space-between`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4'>
  </video>
</figure>

For the next layout, the main point to demonstrate here is `justify-content: space-between`, which places the first and last child elements at the edges of their bounding box, with the remaining space evenly distributed between the elements. For these cards, they are placed in a Flexbox display mode, with the direction being set to column using `flex-direction: column`.

This places the title, description, and image block in a vertical column inside of the parent card. Then, applying `justify-content: space-between` anchors the first (title) and last (image block) elements to the edges of the flexbox, and the descriptive text in between those gets placed with equal spacing to each endpoint.

```css/3
.parent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

## 09. Clamping My Style: `clamp(<min>, <actual>, <max>)`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/09-clamping.mp4'>
  </video>
</figure>

Here's where we get into some techniques with [less browser support](https://caniuse.com/#feat=css-math-functions), but have some really exciting implications for layouts and responsive UI design. In this demo, you are setting the width using clamp like so: `width: clamp(<min>, <actual>, <max>)`.

This sets an absolute min and max size, and an actual size. With values, that can look like:

```css/1
.parent {
  width: clamp(23ch, 50%, 46ch);
}
```

The minimum size here is `23ch` or 23 character units, and the maximum size is `46ch`, 46 characters. [Character width units](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/) are based on the font size of the element (specifically the width of the `0` glyph). The 'actual' size is 50%, which represents 50% of this element's parent width.

What the `clamp()` function is doing here is enabling this element to retain a 50% width *until* 50% is either greater than `46ch` (on wider viewports), or smaller than `23ch` (on smaller viewports). You can see that as I stretch and shrink the parent size, the width of this card increases to its clamped maximum point and decreases to its clamped minimum. It then stays centered in the parent since we've applied additional properties to center it. This enables more legible layouts, as the text won't be too wide (above `46ch`) or too squished and narrow (less than `23ch`).

This is also a great way to implement responsive typography. For example, you could write: `font-size: clamp(1.5rem, 20vw, 3rem)`. In this case, the font-size of a headline would always stay clamped between `1.5rem` and `3rem` but would grow and shrink based on the `20vw` actual value to fit the width of of the viewport.

This is a great technique to ensure legibility with a minimum and maximum size value, but remember it is not supported in all modern browsers so make sure you have fallbacks and do your testing.

## 10. Respect for Aspect: `aspect-ratio: <width> / <height>`

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/10-aspectratio.mp4'>
  </video>
</figure>

And finally, this last layout tool is the most experimental of the bunch. It was recently introduced to Chrome Canary in Chromium 84, and there is active effort from Firefox in getting this implemented, but it is not currently in any stable browser editions.

I do want to mention this, though, because it is such a frequently met problem. And that is just simply maintaining the aspect ratio of an image. 

With the `aspect-ratio` property, as I resize the card, the green visual block maintains this 16 x 9 aspect ratio. We are Respecting the Aspect Ratio with `aspect-ratio: 16 / 9`. 

```css/1
.video {
  aspect-ratio: 16 / 9;
}
```

To maintain a 16 x 9 aspect ratio without this property, you'd need to use a [`padding-top` hack](https://css-tricks.com/aspect-ratio-boxes/) and give it a padding of `56.25%` to set a top-to-width ratio. We will soon have a property for this to avoid the hack and the need to calculate the percentage. You can make a square with `1 / 1` ratio, a 2 to 1 ratio with `2 / 1`, and really just anything you need for this image to scale with a set size ratio.


```css/1
.square {
  aspect-ratio: 1 / 1;
}
```

While this feature is still up and coming, it it a good one to know about as it resolves a lot of developer strife that I have faced many times myself, especially when it comes to video and iframes.

## Conclusion

Thank you for following this journey through 10 powerful lines of CSS. To learn more, watch [the full video](https://youtu.be/qm0IfG1GyZU), and try out [the demos](https://1linelayouts.glitch.me) yourself.

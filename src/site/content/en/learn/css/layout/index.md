---
title: Layout
description:
authors:
  - andybell
date: 2021-04-20
tags:
  - css
---

# Layout

Imagine you're working as a developer,
and a designer colleague hands you a design for a brand new website.
The design has all sorts of interesting layouts and compositions:
two-dimensional layouts that are considerate of viewport width and height,
as well as layouts that need to be fluid and flexible.
How do you decide the best way to style these with CSS?

CSS provides us with various ways to solve layout problems,
on a horizontal axis, vertical axis, or even both.
Choosing the right layout method for a context can be hard,
and often you may need more than one layout method to solve your problem.
To help with this, in the following modules,
you'll learn about the unique features of each CSS layout mechanism to inform those decisions.

## Layout: a brief history

In the early days of the web,
designs more complex than a simple document were laid out with `<table>` elements.
Separating HTML from visual styles was made easier when CSS was widely adopted by browsers in the late '90s.
CSS opened the door to developers being able to completely change the look and feel of a website without ever touching HTML.
This new capability inspired projects such as [The CSS Zen Garden](http://www.csszengarden.com),
which was created to demonstrate the power of CSS to encourage more developers to learn it.

CSS has evolved as our needs for web design and browser technology have evolved.
You can read how CSS layout and our approach to layout has evolved over time in
[this article by Rachel Andrew](https://24ways.org/2019/a-history-of-css-through-15-years-of-24-ways/).

{% Img
  src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/vDDoFFoPVgJEuEaqcP4H.svg",
  alt="A timeline showing how CSS has evolved over the years, starting in 1996 up to 2021",
  width="760",
  height="270"
%}

## Layout: the present and future

Modern CSS has exceptionally powerful layout tooling.
We have dedicated systems for layout and we're going to have a high-level look at what we have at our disposal,
before digging into more detail of Flexbox and Grid in the next modules.

## Understanding the `display` property

The `display` property does two things.
The first thing it does is determine if the box it is applied to acts as inline or block.

```css
.my-element {
  display: inline
}
```

Inline elements behave like words in a sentence.
They sit next to each other in the inline direction.
Elements such as `<span>` and `<strong>`,
which are typically used to style pieces of text within containing elements like a `<p>` (paragraph),
are inline by default.
They also preserve surrounding whitespace.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/GezxDZXkJgkMevkKg39M.png", alt="A diagram showing all the different sizes of a box and where each sizing section starts and ends", width="800", height="559" %}

You can't set an explicit width and height on inline elements.
Any block level margin and padding will be ignored by the surrounding elements.

```css
.my-element {
	display: block;
}
```

Block elements don't sit alongside each other.
They create a new line for themselves and unless changed by other CSS code.
A block element will expand to the size of the inline dimension,
therefore spanning the full width in a horizontal writing mode.
The margin on all sides of a block element will be respected.

```css
.my-element {
	display: flex;
}
```

The `display` property also determines how an element's children should behave.
For example,
setting the `display` property to `display: flex` makes the box a block-level box,
and also converts its children to flex items.
This enables the flex properties that control alignment, ordering and flow.

## Flexbox and Grid

There are two main layout mechanisms that create layout rules for multiple elements, *[flexbox](/learn/css/flexbox)* and *[grid](/learn/css/grid)*.
They share similarities, but are designed to solve different layout problems.


{% Aside %}
We will be going into much more detail for both of these in future modules, but here is a high-level overview of what both are and what they are useful for.
{% endAside %}

### Flexbox

```css
.my-element {
	display: flex;
}
```

Flexbox is a layout mechanism for one-dimensional layouts.
Layout across a single axis, either horizontally or vertically.
By default, flexbox will align the element's children next to each other,
in the inline direction,
and stretch them in the block direction, so they're all the same height.

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNjxmor'
} %}


Items will stay on the same axis and not wrap when they run out of space.
Instead they will try to squash onto the same line as each other.
This behaviour can be changed using the `align-items`, `justify-content` and `flex-wrap` properties.

{% Codepen {
  user: 'web-dot-dev',
  id: 'jOyWLmg'
} %}


Flexbox also converts the child elements to be **flex items**,
which means you can write rules on how they behave inside a flex container.
You can change alignment, order and justification on an individual item.
You can also change how it shrinks or grows using  the `flex` property.

```css
.my-element div {
 	flex: 1 0 auto;
}
```

The `flex` property is a shorthand for `flex-grow`, `flex-shrink` and `flex-basis`.
 You can expand the above example like this:

```css
.my-element div {
 flex-grow: 1;
 flex-shrink: 0;
 flex-basis: auto;
}
```

Developers provide these low-level rules to hint a browser how the layout should behave
when it is challenged by content and viewport dimensions.
This makes it a very useful mechanism for responsive web design.

### Grid

```css
.my-element {
	display: grid;
}
```

Grid is similar in a lot of ways to **flexbox**,
but it is designed to control multi-axis layouts instead of single-axis layouts (vertical or horizontal space).

Grid enables you to write layout rules on an element that has `display: grid`,
and introduces a few new primitives for layout styling,
such as the `repeat()` and `minmax()` functions.
One useful grid unit is the  `fr` unit—which is a fraction of remaining space—you can build traditional 12 column grids,
with a gap between each item, with 3 CSS properties:

```css
.my-element {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNjxGVz'
} %}

This example above shows a single axis layout.
Where flexbox mostly treats items as a group,
grid gives you precise control over their placement in two dimensions.
We could define that the first item in this grid takes up 2 rows and 3 columns:

```css
.my-element :first-child {
  grid-row: 1/3;
  grid-column: 1/4;
}
```

The `grid-row` and `grid-column` properties instruct the first element in the grid to span to the start of the fourth column,
from the first column, then span to the third row, from the first row.

{% Codepen {
  user: 'web-dot-dev',
  id: 'YzNwrwB'
} %}


## Flow layout

If not using grid or flexbox,
your elements display in normal flow.
There are a number of layout methods that you can use to adjust the behavior and position of items when in normal flow.

### Inline block

Remember how surrounding elements don't respect block margin and padding on an inline element?
With `inline-block` you *can* cause that to happen.

```css
p span {
	display: inline-block;
}
```

Using `inline-block` gives you a box that has some of the characteristics of a block-level element,
but still flows inline with the text.

```css
p span {
	margin-top: 0.5rem;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'PoWZJKw'
} %}


### Floats

If you have an image that sits within a paragraph of text,
wouldn't it be handy for that text to wrap around that image like you might see in a newspaper?
You can do this with floats.

```css
img {
	float: left;
	margin-right: 1em;
}
```

The `float` property instructs an element to "float" to the direction specified.
The image in this example is instructed to float left,
which then allows sibling elements to "wrap" around it.
You can instruct an element to float `left`, `right` or `inherit`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'VwPaLMg'
} %}


{% Aside 'warning' %}
When you use `float`, keep in mind that any elements following the floated element may have their layout adjusted.
To prevent this, you can clear the float,
either by using `clear: both` on an element that follows your floated element
*or* with `display: flow-root` on the parent of your floated elements.

Find out more in the article
[The end of the clearfix hack](https://rachelandrew.co.uk/archives/2017/01/24/the-end-of-the-clearfix-hack/).
{% endAside %}

### Multicolumn layout

If you have a really long list of elements,
such as a list of all of the countries of the world,
it can result in _a lot_ of scrolling and time wasted for a user.
It can also create excess whitespace on the page.
With CSS multicolumn,
you can split this into multiple columns to help with both of these issues.

```html
<h1>All countries</h1>
<ul class="countries">
  <li>Argentina</li>
  <li>Aland Islands</li>
  <li>Albania</li>
  <li>Algeria</li>
  <li>American Samoa</li>
  <li>Andorra</li>
  …
</ul>
```

```css
.countries {
	column-count: 2;
	column-gap: 1em;
}
```

This automatically splits that long list into two columns and adds a gap between the two columns.

{% Codepen {
  user: 'web-dot-dev',
  id: 'gOgrpzO'
} %}


```css
.countries {
	width: 100%;
	column-width: 260px;
	column-gap: 1em;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'jOyqPvB'
} %}


Instead of setting the number of columns that the content is split into,
you can also define a minimum desired width, using `column-width`.
As more space is made available in the viewport,
more columns will automatically be created and as space is reduced,
columns will also reduce.
This is very useful in responsive web design contexts.

### Positioning

Last on this overview of layout mechanisms is positioning.
The `position` property changes how an element behaves in the normal flow of the document,
and how it relates to other elements.
The available options are `relative`, `absolute`, `fixed` and `sticky` with the default value being `static`.

```css
.my-element {
  position: relative;
  top: 10px;
}
```

This element is nudged 10px down based on its current position in the document,
as it is positioned relative to itself.
Adding `position: relative` to an element also makes it the containing block of any child elements with `position: absolute`.
This means that its child will now be repositioned to this particular element,
instead of the topmost relative parent, when it has an absolute position applied to it.

```css
.my-element {
  position: relative;
  width: 100px;
  height: 100px;
}

.another-element {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 50px;
	height: 50px;
}
```

When you set `position` to `absolute`,
it breaks the element out of the current document flow.
This means two things:

1. You can position this element wherever you like, using `top`, `right`, `bottom` and `left` in its nearest relative parent.
1. All of the content surrounding an absolute element reflows to fill the remaining space left by that element.

An element with a `position` value of `fixed` behaves in a similar way to `absolute`,
with its parent being the root `<html>` element.
Fixed position elements stay anchored from the top left based on the `top`, `right`, `bottom` and `left` values that you set.

You can achieve the anchored,
fixed aspects of `fixed` and the more predictable document flow-honoring aspects of `relative` by using `sticky`.
With this value, as the viewport scrolls past the element,
it stays anchored to the `top`, `right`, `bottom` and `left` values that you set.

{% Codepen {
  user: 'web-dot-dev',
  id: 'NWdNGZB'
} %}


## Wrap-up

There's a lot of choice and flexibility with CSS layout.
To dive further into the power of CSS [Flexbox](/learn/css/flexbox) and [Grid](/learn/css/grid), continue into the next few modules.


@@TO DO -- self assessment

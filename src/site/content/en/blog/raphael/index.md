---
layout: post
title: Introduction to Raphaël.js
authors:
  - jameswilliams
date: 2011-09-08
updated: 2013-10-29
tags:
  - blog
---

## Introduction
SVG, short for Scalable Vector Graphics, is a XML-based language for
describing objects and scenes. SVG elements can fire events and can be
scripted with JavaScript. SVG comes with several built-in primitive types such
as circles and rectangles as well as being able to display text. While SVG as
a technology is not new, HTML5 now enables SVG objects
to be embedded in a page directly without the use of a `<object>`
or `<embed> `tag bringing it in line with what is currently
available with the canvas. [Raphaël.js](http://raphaeljs.com)
is a JavaScript library that allows you to create SVG scenes programmatically.
It uses a unified API to create SVG scenes where it is supported or
VML(Vector Modeling Language) where it is now, namely Internet Explorer
versions before IE9.

## Drawing Your First Scene

Let's begin by drawing a simple scene with Raphaël. We begin drawing the
scene by instantiating a Raphaël object. In this case,
I used the constructor that inserts it into a given HTML element with a given
width and height but you could also have Raphaël append the object to the DOM
(Document Object Model). Next, I created a rectangle by supplying the desired
x and y positions with the width and height. Next, I created a circle by
giving the desired coordinates and radius. Finally, I used the attribute function
(attr) to assign colors to the objects.

Each SVG object can have attributes
assigned to it for things like the the color, rotation, stroke color and size,
etc. You can find a detailed list of assignable attributes [here](http://raphaeljs.com/reference.html#attr).

```js
var paper = Raphael("sample-1", 200, 75);
var rect = paper.rect(10, 10, 50, 50);
var circle = paper.circle(110, 35, 25);

rect.attr({fill: "green"});
circle.attr({fill: "blue"});
```

## Drawing Advanced Shapes with Paths

A path is a series of instructions used by the renderer to create objects.
Drawing with a path is like drawing with a pen on a giant piece of graph paper.
You can instruct the pen to be lifted from the paper and move to a different
position(move to), to draw a line(line to), or to draw a curve(arc to). Paths
enable SVG to create objects with the same level of detail regardless of the
scale. When you issue an instruction to say, draw a curve, SVG takes into
account the original and final desired size of the curve (after scaling), it
mathematically computes the intermediary points to render a smooth curve.

The code and figure below show a rectangle and closed curved drawn with paths.
The letter M followed by coordinates moves the pen to that position, L followed
by coordinate pair draws a line from that the current position to that position.
s draws a smooth Bezier curve with a given control point and endpoint with
relative coordinates. Z closes a path. Generally, using an uppercase letter issues the command
with absolute coordinates, lowercase uses relative coordinates. M/m and Z/z,
respectively, issue the same command for uppercase or lowercase.
You can view a list of all the path instructions [here](http://www.w3.org/TR/SVG/paths.html).

```js
var paper = Raphael("sample-2", 200, 100);
var rectPath = paper.path("M10,10L10,90L90,90L90,10Z");
var curvePath = paper.path("M110,10s55,25 40,80Z");

rectPath.attr({fill:"green"});
curvePath.attr({fill:"blue"});
```

## Drawing Text

Having illustrations without the ability to draw text would be really boring,
luckily, Raphaël provides two methods to draw text. The first method, text,
takes a x and y coordinates along with the string to draw. The text method
doesn't give you much control over the font or other effects. It draws in the
default font with the default size.

The second method, print, draws the text as a collection of paths. As a result,
we are able to modify individual letters. In the example below, we colored the
numeral 5 with an orange fill, colored "ROCKS" with a bluish fill and made the
stroke thicker to simulate bold text. We did this using a custom font with a
font size of 40pts.

```js
var paper = Raphael("sample-4", 600, 100);
var t = paper.text(50, 10, "HTML5ROCKS");

var letters = paper.print(50, 50, "HTML5ROCKS", paper.getFont("Vegur"), 40);

letters[4].attr({fill:"orange"});
for (var i = 5; i < letters.length; i++) {
letters[i].attr({fill: "#3D5C9D", "stroke-width": "2", stroke: "#3D5C9D"});
}
```

The Vegur font isn't in Raphaël, nor is any font for that matter. And besides,
most fonts use TrueType(TTF) or OpenType(OTF) format. To get from those formats
into something that is usable by Raphaël, we need to convert them using a tool
called [Cufon](https://github.com/sorccu/cufon/wiki/about). Cufon allows you export the different font styles
of a given font (regular, bold, italic, bold italic, etc) for use with Raphaël.
It is outside the scope of this tutorial to cover Cufon in detail. Check
the aforemention link for more details. A great source of unemcumbered fonts for
your applications is the [Google Font Directory](http://www.google.com/webfonts).

## Events

SVG elements can directly subscribe to all the traditional mouse-based events:
__click, dblclick, mousedown, mousemove, mouseout, mouseover, mouseup, and hover__.
Raphaël provides the ability to add your own methods to either the canvas or
individual elements, so in theory there is nothing preventing you from adding
gestures for mobile browsers.

The snippet below binds a function to rotate a given letter in "ROCKS" 45
degrees when it is clicked.

```js
for (var i = 5; i < letters.length; i++) {
letters[i].attr({fill: "#3D5C9D", "stroke-width": "2", stroke: "#3D5C9D"});

letters[i].click(function(evt) {
this.rotate(45);
});
}
```

## SVG vs Canvas

Given that they are both methods to draw objects on the screen, it's often
not immediately clear why you should use one over the other. The two mediums
have vastly different approaches. Canvas is an immediate mode API is much like
drawing with crayons. You can clear or destroy part
of the drawing but you can't by default revert or alter a previous stroke. Canvas
is also a raster bitmap so it is is very much subject to pixelation when images
are scaled. SVG on the other hand, as previously mentioned can serve multiple
resolutions with the same level of detail and can be scripted.

Whether to use SVG or Canvas for game programming is fairly simple. Besides
the normal constraints of whether you plan to deploy to desktop or mobile, it
really comes down to sprite count. SVG lends itself to what I'd call low-fidelty
games. I describe those as games that have limited concurrent movement of objects
and sprite removal and creation. Many board games like Chess, Checkers, or Battleship, as
well as card games like BlackJack, Poker, and Hearts fall into this category.
Another unifying thread is that in many of these games, a player will need
to move an arbitrary object and SVG's scriptability makes object picking
easy.

## Authoring Tools for SVG

Using SVG doesn't mean at all that you have to create paths by hand. There
are several tools, both open source and commercial, that allow you to export to
SVG. The two tools I have used extensively and highly recommend are
[Inkscape](http://inkscape.org) and [svg-edit](http://code.google.com/p/svg-edit).

### svg-edit

svg-edit is a browser-based SVG editor written in JavaScript.
It provides a limited user interface reminiscent of GIMP or MS Paint. Unless the
level of detail was relatively low, I've mostly used svg-edit to tweak SVG
drawings rather than create them. svg-edit allows you to create objects graphically
or with SVG code.

### Inkscape

Inkscape is a cross-platform full-fledged vector graphics editor similar to CorelDraw,
Adobe Illustrator, and Xara. Inkscape benefits from a vibrant plugin community and a
mature codebase. The predecessor to Inkscape, from which Inkscape forked, was
developed in 1999. Inkscape is my go-to application for vector-based and bitmap
assets.

## A Minor Aside

SVG is not supported on Windows in Internet Explorer versions before IE9.
IE uses a vector graphics format called VML, Vector Markup Language, which
provides much of the same functionality as SVG. Raphaël
can create scenes that use SVG or VML where it is supported. Using Raphaël
is an easy way to provide cross-platform support.

## References

- Rapahël.js: [http://raphaeljs.com](http://raphaeljs.com)
- Raphaël Documentation: [http://raphaeljs.com/reference.html](http://raphaeljs.com/reference.html)

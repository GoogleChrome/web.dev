---
layout: post
title: Case Study - Page Flip Effect from 20thingsilearned.com
authors:
  - hakimelhattab
date: 2011-01-20
tags:
  - blog
  - case-study
---
## Introduction

In 2010, [F-i.com](http://www.f-i.com) and the
Google Chrome team collaborated on an HTML5-based educational web app called
20 Things I Learned about Browsers and the Web
([www.20thingsilearned.com](http://www.20thingsilearned.com)).
One of the key ideas behind this project was that it would best be presented
in the [context of a book](http://chrome.blogspot.com/2010/11/curious-guide-to-browsers-and-web.html).
Since the contents of the book is very much about open web
technologies we felt it was important to stay true to that by making the
container itself an example of what these technologies allow us to
accomplish today.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/o5841WYMvQebTxtGDvU3.png", alt="Book cover and homepage of '20 Things I Learned About Browsers and the Web'", width="500", height="347" %}
<figcaption>Book cover and homepage of "20 Things I Learned About Browsers and the Web" (<a href="http://www.20thingsilearned.com" target="_blank">www.20thingsilearned.com</a>)</figcaption>
</figure>

We decided that the best way to achieve the feeling of a real world
book is to simulate the good parts of the analogue reading experience
while still leveraging the benefits of the digital realm in areas such
as navigation. A lot of effort went into the graphical and interactive
treatment of the reading flow - especially how the pages of the books
flip from one page to another.

## Getting Started

This tutorial will take you through the process of creating your own
page flip effect using the canvas element and plenty of JavaScript. Some
of the rudimentary code, such as variable declarations and event listener
subscription, has been left out of the snippets in this article so remember
to reference the working example.

Before we get started it's a good idea to [check out the demo](https://www.html5rocks.com/static/demos/20things_pageflip/example/index.html) so that you know what we're aiming to build.

## Markup

It's always important to remember that what we draw on canvas can't be
indexed by search engines, selected by a visitor or found by in-browser
searches. For that reason, the content we will be working with is put
directly in the DOM and then manipulated by JavaScript if it is available.
The markup required for this is minimal:

```html
<div id='book'>
<canvas id='pageflip-canvas'></canvas>
<div id='pages'>
<section>
    <div> <!-- Any type of contents here --> </div>
</section>
<!-- More <section>s here -->
</div>
</div>
```

We have one main container element for the book, which in turn contains
the different pages of our book and the `canvas` element that we will be
drawing the flipping pages on. Inside of the `section` element there is a
`div` wrapper for the content - we need this to be able to change the width
of the page without affecting the layout of its contents. The `div` has a
fixed width and the `section` is set to hide its overflow, this results in
the width of the `section` acting as a horizontal mask for the `div`.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/60Tx7hRxSZhnDKhJc0Ri.png", alt="Open Book.", width="500", height="172" %}
<figcaption>A background image containing the paper texture and brown book jacket is added to the book element.</figcaption>
</figure>

## Logic

The code required to power the page flip is not very complex, but it
is quite extensive since it involves a lot of procedurally generated
graphics. Let's start by looking at the description of the constant
values we'll be using throughout the code.

```js
var BOOK_WIDTH = 830;
var BOOK_HEIGHT = 260;
var PAGE_WIDTH = 400;
var PAGE_HEIGHT = 250;
var PAGE_Y = ( BOOK_HEIGHT - PAGE_HEIGHT ) / 2;
var CANVAS_PADDING = 60;
```

The `CANVAS_PADDING` is added around the canvas so that we can have
the paper extend outside of the book when flipping. Note that some the
constants defined here are also set in CSS, so if you want to change the
size of the book you will also need to update the values there.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/TQrEg4tSBisQAv5GXyrG.png", alt="Constants.", width="500", height="172" %}
<figcaption>The constant values used throughout the code to track interaction and draw the page flip.</figcaption>
</figure>

Next we need to define a flip object for each page, these will
constantly be updated as we interact with the book to reflect the
current status of the flip.

```js
// Create a reference to the book container element
var book = document.getElementById( 'book' );

// Grab a list of all section elements (pages) within the book
var pages = book.getElementsByTagName( 'section' );

for( var i = 0, len = pages.length; i < len; i++ ) {
pages[i].style.zIndex = len - i;

flips.push( {
progress: 1,
target: 1,
page: pages[i],
dragging: false
});
}
```

First we need to make sure the pages are layered correctly by
organizing the z-indexes of the section elements so that the first
page is on top and the last page is in the bottom. The most important
properties of the flip objects are the `progress` and `target` values.
These are used to determine how far the page should currently be
folded, -1 means all the way to the left, 0 means the dead center
of the book and +1 means the right most edge of the book.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3ESKJMS6s4rSL5zK49cb.png", alt="Progress.", width="500", height="172" %}
<figcaption>The progress and target values of the flips are used
to determine where the folding page should be drawn on a <samp>-1</samp> to <samp>+1</samp>
scale.</figcaption>
</figure>

Now that we have a flip object defined for each page we need to
start capturing and using the users input to update the state of the
flip.

```js
function mouseMoveHandler( event ) {
// Offset mouse position so that the top of the book spine is 0,0
mouse.x = event.clientX - book.offsetLeft - ( BOOK_WIDTH / 2 );
mouse.y = event.clientY - book.offsetTop;
}

function mouseDownHandler( event ) {
// Make sure the mouse pointer is inside of the book
if (Math.abs(mouse.x) < PAGE_WIDTH) {
if (mouse.x < 0 &amp;&amp; page - 1 >= 0) {
    // We are on the left side, drag the previous page
    flips[page - 1].dragging = true;
}
else if (mouse.x > 0 &amp;&amp; page + 1 < flips.length) {
    // We are on the right side, drag the current page
    flips[page].dragging = true;
}
}

// Prevents the text selection
event.preventDefault();
}

function mouseUpHandler( event ) {
for( var i = 0; i < flips.length; i++ ) {
// If this flip was being dragged, animate to its destination
if( flips[i].dragging ) {
    // Figure out which page we should navigate to
    if( mouse.x < 0 ) {
    flips[i].target = -1;
    page = Math.min( page + 1, flips.length );
    }
    else {
    flips[i].target = 1;
    page = Math.max( page - 1, 0 );
    }
}

flips[i].dragging = false;
}
}
```

The `mouseMoveHandler` function updates the `mouse` object so that we
are always working towards the most recent cursor location.

In `mouseDownHandler` we start by checking if the mouse was pressed
down on either the left or the right page so that we know which
direction we want to start flipping towards. We also ensure that
another page exists in that direction since we might be on the first
or last page. If a valid flip option is available after these checks,
we set the `dragging` flag of the corresponding flip object to `true`.

Once we reach the `mouseUpHandler` we go through all of the `flips`
and check if any of them were flagged as `dragging` and should now be
released. When a flip is released we set its target value to match
the side it should flip to depending on the current mouse position.
The page number is also update to reflect this navigation.

## Rendering

Now that most of our logic is in place we'll go through how to
render the folding paper onto the canvas element. Most of this happens
inside of the `render()` function, which is called 60 times
per second to update and draw the current state of all active flips.

```js
function render() {
// Reset all pixels in the canvas
context.clearRect( 0, 0, canvas.width, canvas.height );

for( var i = 0, len = flips.length; i < len; i++ ) {
var flip = flips[i];

if( flip.dragging ) {
    flip.target = Math.max( Math.min( mouse.x / PAGE_WIDTH, 1 ), -1 );
}

// Ease progress towards the target value
flip.progress += ( flip.target - flip.progress ) * 0.2;

// If the flip is being dragged or is somewhere in the middle
// of the book, render it
if( flip.dragging || Math.abs( flip.progress ) < 0.997 ) {
    drawFlip( flip );
}

}
}
```

Before we start rendering the `flips`, we reset the
canvas by using the `clearRect(x,y,w,h)` method. Clearing the whole canvas
comes at a big performance expense and it would be much more effecient
to clear only the regions that we are drawing on. For the sake of
keeping this tutorial on topic, we'll leave it at clearing the whole
canvas.

If a flip is being dragged we update its `target` value to match the
mouse position but on a -1 to 1 scale rather than actual pixels.
We also increment the `progress` by a fraction of the distance to
the `target`, this will result in a smooth and animated progression
of the flip since it updates on every frame.

Since we are going over all of the `flips` on every frame, we need to
make sure we only redraw the ones that are active. If a flip is not
very close to the book edge (within 0.3% of `BOOK_WIDTH`), or if it is
flagged as `dragging`, it is considered active.

Now that all of the logic is in place, we need to draw the graphical
representation of a flip depending on its current state. It's time to
look at the first part of the `drawFlip(flip)` function.

```js
// Determines the strength of the fold/bend on a 0-1 range
var strength = 1 - Math.abs( flip.progress );

// Width of the folded paper
var foldWidth = ( PAGE_WIDTH * 0.5 ) * ( 1 - flip.progress );

// X position of the folded paper
var foldX = PAGE_WIDTH * flip.progress + foldWidth;

// How far outside of the book the paper is bent due to perspective
var verticalOutdent = 20 * strength;

// The maximum widths of the three shadows used
var paperShadowWidth = (PAGE_WIDTH*0.5) * Math.max(Math.min(1 - flip.progress, 0.5), 0);
var rightShadowWidth = (PAGE_WIDTH*0.5) * Math.max(Math.min(strength, 0.5), 0);
var leftShadowWidth = (PAGE_WIDTH*0.5) * Math.max(Math.min(strength, 0.5), 0);

// Mask the page by setting its width to match the foldX
flip.page.style.width = Math.max(foldX, 0) + 'px';
```

This section of the code starts by calculating a number of visual
variables that we need to draw the fold in a realistic manner. The
`progress` value of the flip we are drawing plays a big part here, since
that is where we want the page fold to appear. To add depth to the page
flip effect we make the paper extend outside of the top and bottom
edges of the book, this effect is at its peak when a flip is close to
the book's spine.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/73JKSfkcxMnLw661RnKA.png", alt="Flip", width="500", height="172" %}
<figcaption>This is what the page fold looks like when the page is flipping or being dragged.</figcaption>
</figure>

Now that all of the values are prepared, all that remains is drawing the paper!

```js
context.save();
context.translate( CANVAS_PADDING + ( BOOK_WIDTH / 2 ), PAGE_Y + CANVAS_PADDING );

// Draw a sharp shadow on the left side of the page
context.strokeStyle = `rgba(0,0,0,`+(0.05 * strength)+`)`;
context.lineWidth = 30 * strength;
context.beginPath();
context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
context.lineTo(foldX - foldWidth, PAGE_HEIGHT + (verticalOutdent * 0.5));
context.stroke();

// Right side drop shadow
var rightShadowGradient = context.createLinearGradient(foldX, 0,
            foldX + rightShadowWidth, 0);
rightShadowGradient.addColorStop(0, `rgba(0,0,0,`+(strength*0.2)+`)`);
rightShadowGradient.addColorStop(0.8, `rgba(0,0,0,0.0)`);

context.fillStyle = rightShadowGradient;
context.beginPath();
context.moveTo(foldX, 0);
context.lineTo(foldX + rightShadowWidth, 0);
context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
context.lineTo(foldX, PAGE_HEIGHT);
context.fill();

// Left side drop shadow
var leftShadowGradient = context.createLinearGradient(
foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
leftShadowGradient.addColorStop(0, `rgba(0,0,0,0.0)`);
leftShadowGradient.addColorStop(1, `rgba(0,0,0,`+(strength*0.15)+`)`);

context.fillStyle = leftShadowGradient;
context.beginPath();
context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
context.lineTo(foldX - foldWidth, 0);
context.lineTo(foldX - foldWidth, PAGE_HEIGHT);
context.lineTo(foldX - foldWidth - leftShadowWidth, PAGE_HEIGHT);
context.fill();

// Gradient applied to the folded paper (highlights &amp; shadows)
var foldGradient = context.createLinearGradient(
foldX - paperShadowWidth, 0, foldX, 0);
foldGradient.addColorStop(0.35, `#fafafa`);
foldGradient.addColorStop(0.73, `#eeeeee`);
foldGradient.addColorStop(0.9, `#fafafa`);
foldGradient.addColorStop(1.0, `#e2e2e2`);

context.fillStyle = foldGradient;
context.strokeStyle = `rgba(0,0,0,0.06)`;
context.lineWidth = 0.5;

// Draw the folded piece of paper
context.beginPath();
context.moveTo(foldX, 0);
context.lineTo(foldX, PAGE_HEIGHT);
context.quadraticCurveTo(foldX, PAGE_HEIGHT + (verticalOutdent * 2),
                        foldX - foldWidth, PAGE_HEIGHT + verticalOutdent);
context.lineTo(foldX - foldWidth, -verticalOutdent);
context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);

context.fill();
context.stroke();

context.restore();
```

The canvas API's `translate(x,y)` method is used to offset the
co-ordinate system so that we can draw our page flip with the top of the
spine acting as the 0,0 position. Note that we also need to `save()` the
current transformation matrix of the canvas and `restore()` to it
when we are done drawing.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/73JKSfkcxMnLw661RnKA.png", alt="Translate", width="500", height="172" %}
<figcaption>This is the point from which we draw the page flip. The
original 0,0 point is in the top left of the image but by changing that,
via translate(x,y), we simplify the drawing logic.</figcaption>
</figure>

The `foldGradient` is what we will fill the shape of the folded paper with
to give it realistic highlights and shadows. We also add a very thin line
around the paper drawing so that the paper doesn't disappear when put
against light backgrounds.

All that remains now is drawing the shape of the folded paper using the
properties we defined above. The left and right sides of our paper is drawn
as straight lines and the top and bottom sides are curved to bring that bent
feeling of a folding paper across. The strength of this paper bend is
determined by the `verticalOutdent` value.

That's it! You've now got a fully functional page flip navigation in
place.

## Page Flip Demo

The page flip effect is all about communicating the right interactive
feel so looking at images of it doesn't exactly do it justice. 

## Next Steps

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/5Aepb68RaR7M21gPfSCT.png", alt="Hard-flip", width="500", height="347" %}
<figcaption>The soft page flip in this tutorial becomes even more powerful
when paired with other book-like features such as an interactive hard
cover.</figcaption>
</figure>

This is only one example of what can be accomplished by utilizing HTML5
features such as the canvas element. I recommend you have a look at the more
refined book experience from which this technique is an excerpt at:
[www.20thingsilearned.com](http://www.20thingsilearned.com). There
you will see how the page flips can be applied in a real application and how
powerful it becomes when paired with other HTML5 features.

## References

- [Canvas](http://developers.whatwg.org/the-canvas-element.html#the-canvas-element) API specification

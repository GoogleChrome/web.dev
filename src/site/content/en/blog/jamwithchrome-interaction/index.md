---
layout: post
title: Case-study - JAM with Chrome
subhead: How we made the UI rock
authors:
  - fredchasen
date: 2012-12-05
tags:
  - blog
  - case-study
---

## Introduction


[JAM with Chrome](http://www.jamwithchrome.com) is a web based musical project created by Google. JAM with Chrome lets people from all over the world form a band and JAM in real time inside the browser. [DinahMoe](http://www.dinahmoe.com/) pushed the boundaries of what was possible with [Chrome’s Web Audio API](http://www.html5rocks.com/en/tutorials/casestudies/jamwithchrome-audio/), our team at [Tool of North America](http://www.toolofna.com/) crafted the interface for strumming, drumming and playing your computer as though it was a musical instrument.



With Google Creative Lab’s creative direction, illustrator [Rob Bailey](http://robbailey.co.uk/) created intricate illustrations for each of the 19 instruments available to JAM with. Working off those, Interactive Director [Ben Tricklebank](http://www.toolofna.com/#/main/intdirectors/Ben%20Tricklebank) and our design team at Tool created an easy and pro interface for each instrument.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/cNz6JC9Vd5D4pZuy514u.png", alt="Full jam montage", width="800", height="313" %}
</figure>

As each instrument is visually unique, Tool’s Technical Director [Bartek Drozdz](http://www.toolofna.com/#/main/digital/1) and I stitched them together using combinations of PNG images, CSS, SVG and Canvas elements.

Many of the instruments had to handle different methods of interaction (such as clicks, drags and strums - all the things that you would expect to do with an instrument) while keeping the interface with DinahMoe’s sound engine the same.  We found that we needed more than just JavaScript’s mouseup and mousedown to be able to provide a beautiful playing experience.

To deal with all this variation, we created a “Stage” element that covered the playable area, handling clicks, drags and strums across all the different instruments.

## The Stage

The Stage is our controller that we use to setup function across an instrument. Such as adding different parts of the instruments that the user will interact with. As we add more interactions (such as a “hit”) we can add them to the Stage’s prototype.

```js
function Stage(el) {

  // Grab the elements from the dom
  this.el = document.getElementById(el);
  this.elOutput = document.getElementById("output-1");

  // Find the position of the stage element
  this.position();

  // Listen for events
  this.listeners();

  return this;
}

Stage.prototype.position = function() {
  // Get the position
};

Stage.prototype.offset = function() {
  // Get the offset of the element in the window
};

Stage.prototype.listeners = function() {
  // Listen for Resizes or Scrolling
  // Listen for Mouse events
};
```

## Getting the element and mouse position

Our first task is to translate mouse coordinates in the browser window to be relative to our Stage element. To do this we needed to take into account where our Stage is in the page.

As we need to find where the element is relative to the whole window, not just its parent element, it’s slightly more complicated than just looking at the elements offsetTop and offsetLeft. The easiest option is to use getBoundingClientRect, which gives the position relative to the window, just like mouse events and it is well [supported in newer browsers](http://www.quirksmode.org/dom/w3c_cssom.html).

```js
Stage.prototype.offset = function() {
  var _x, _y,
      el = this.el;

  // Check to see if bouding is available
  if (typeof el.getBoundingClientRect !== "undefined") {

    return el.getBoundingClientRect();

  } else {
    _x = 0;
    _y = 0;

    // Go up the chain of parents of the element
    // and add their offsets to the offset of our Stage element

    while (el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft;
      _y += el.offsetTop;
      el = el.offsetParent;
    }

    // Subtract any scrolling movment
    return {top: _y - window.scrollY, left: _x - window.scrollX};
  }
};
```

If getBoundingClientRect does not exist, we have a simple function that will just add up offsets, moving up the chain of the element parents until it reaches the body. Then we subtract how far the window has been scrolled to get the position relative to the window. If you are using jQuery the offset() function does a great job of handling the complexity of figuring out the location across platforms, but you will still need to subtract the amount scrolled.

Whenever the page is scrolled or resized it’s possible that the element’s position has changed. We can listen for these events and check for the position again. These events are fired many times on a typical scroll or resize, so in a real application it’s probably best to limit how often you recheck the position. There are many ways to do this, but HTML5 Rocks has an article for [debouncing scroll events](http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events) using requestAnimationFrame which will work well here.

Before we handle any hit detection, this first example will just output the relative x and y whenever the mouse is moved in the Stage area.

```js
Stage.prototype.listeners = function() {
  var output = document.getElementById("output");

  this.el.addEventListener('mousemove', function(e) {
      // Subtract the elements position from the mouse event's x and y
      var x = e.clientX - _self.positionLeft,
          y = e.clientY - _self.positionTop;

      // Print out the coordinates
      output.innerHTML = (x + "," + y);

  }, false);
};
```

To start watching the mouse movement, we will create a new Stage object and pass it the id of the div that we want to use as our Stage.

```js
//-- Create a new Stage object, for a div with id of "stage"
var stage = new Stage("stage");
```

## Simple hit detection

In JAM with Chrome not all of the instrument interfaces are complex. Our drum machine pads are just simple rectangles, making it easy to detect if a click falls within their bounds.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/CQYbmA4Q36OAXB1dNojv.png", alt="Drum machine", width="800", height="195" %}
</figure>

Starting with rectangles, we will setup some base types of shapes. Each shape object needs to know its bounds and have the ability to check if a point is within it.

```js
function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  return this;
}

Rect.prototype.inside = function(x, y) {
  return x >= this.x && y >= this.y
      && x <= this.x + this.width
      && y <= this.y + this.height;
};
```

Each new shape type we add will need a function within our Stage object to register it as a hit zone.

```js
Stage.prototype.addRect = function(id) {
  var el = document.getElementById(id),
      rect = new Rect(
        el.offsetLeft,
        el.offsetTop,
        el.offsetWidth,
        el.offsetHeight
      );

  rect.el = el;

  this.hitZones.push(rect);
  return rect;
};
```

On mouse events, each shape instance will handle checking if the passed mouse x and y are a hit for it and return true or false.

We can also add an "active" class to the stage element that will change the mouse cursor to be a pointer when rolling over the square.

```js
this.el.addEventListener ('mousemove', function(e) {
  var x = e.clientX - _self.positionLeft,
      y = e.clientY - _self.positionTop;

  _self.hitZones.forEach (function(zone){
    if (zone.inside(x, y)) {
      // Add class to change colors
      zone.el.classList.add('hit');
      // change cursor to pointer
      this.el.classList.add('active');
    } else {
      zone.el.classList.remove('hit');
      this.el.classList.remove('active');
    }
  });

}, false);
```

## More shapes

As shapes get more complicated, the math to find if a point is inside of them becomes more complex. However, these equations are well established and documented in great detail in many places online. Some of the best JavaScript examples I have seen are from Kevin Lindsey’s [geometry library](http://www.kevlindev.com/geometry/index.htm).

Fortunately in building JAM with Chrome we never had to go beyond circles and rectangles, relying on combinations of shapes and layering to handle any extra complexity.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/m6GOvjI8ZWe9plhlBeIX.png", alt="Drum shapes", width="400", height="315" %}
</figure>

### Circles

To check if a point is within a circular drum we will need to create a circle base shape. Though it is quite similar to the rectangle, it will have its own methods for determining bounds and checking if the point is inside of the circle.

```js
function Circle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  return this;
}

Circle.prototype.inside = function(x, y) {
  var dx = x - this.x,
      dy = y - this.y,
      r = this.radius;
  return dx * dx + dy * dy <= r * r;
};
```

Instead of changing the color, adding the hit class will trigger a CSS3 animation. Background size gives us a nice way of quickly scaling the image of the drum, without affecting its position. You will need to add other browser’s prefixes for this work with them (-moz, -o and -ms) and might want to add a un-prefixed version as well.

```css
#snare.hit{
  { % mixin animation: drumHit .15s linear infinite; % }
}

@{ % mixin keyframes drumHit % } {
  0%   { background-size: 100%;}
  10%  { background-size: 95%; }
  30%  { background-size: 97%; }
  50%  { background-size: 100%;}
  60%  { background-size: 98%; }
  70%  { background-size: 100%;}
  80%  { background-size: 99%; }
  100% { background-size: 100%;}
}
```

## Strings

Our GuitarString function will take a canvas id and Rect object and draw a line across the center of that rectangle.

```js
function GuitarString(rect) {
  this.x = rect.x;
  this.y = rect.y + rect.height / 2;
  this.width = rect.width;
  this._strumForce = 0;
  this.a = 0;
}
```

When we want to have it vibrate, we will call our strum function to set the string in motion. Every frame we render will reduce the force it was strummed with slightly and increase a counter that will cause the string to oscillate back and forth.

```js
GuitarString.prototype.strum = function() {
  this._strumForce = 5;
};

GuitarString.prototype.render = function(ctx, canvas) {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.bezierCurveTo(
      this.x, this.y + Math.sin(this.a) * this._strumForce,
      this.x + this.width, this.y + Math.sin(this.a) * this._strumForce,
      this.x + this.width, this.y);
  ctx.stroke();

  this._strumForce *= 0.99;
  this.a += 0.5;
};
```

## Intersections and Strumming

Our hit area for the string is just going to be a box again. Clicking within that box should trigger the string animation. But who wants to click a guitar?

To add strumming we need to check the intersection of the strings box and the line that the user’s mouse is traveling.

To get enough distance between the mouse’s previous and current position,  we will need to slow down the rate at which we get the mouse move events. For this example, we will simply set a flag to ignore mousemove events for 50 milliseconds.

```js
document.addEventListener('mousemove', function(e) {
  var x, y;

  if (!this.dragging || this.limit) return;

  this.limit = true;

  this.hitZones.forEach(function(zone) {
    this.checkIntercept(
      this.prev[0],
      this.prev[1],
      x,
      y,
      zone
    );
  });

  this.prev = [x, y];

  setInterval(function() {
    this.limit = false;
  }, 50);
};
```

Next we will need to rely on some intersection code that Kevin Lindsey wrote to see if the line of mouse movement intersect the middle of our rectangle.

```js
Rect.prototype.intersectLine = function(a1, a2, b1, b2) {
  //-- http://www.kevlindev.com/gui/math/intersection/Intersection.js
  var result,
      ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
      ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
      u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

  if (u_b != 0) {
    var ua = ua_t / u_b;
    var ub = ub_t / u_b;

    if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
      result = true;
    } else {
      result = false; //-- No Intersection
    }
  } else {
    if (ua_t == 0 || ub_t == 0) {
      result = false; //-- Coincident
    } else {
      result = false; //-- Parallel
    }
  }

  return result;
};
```

Finally we will add a new Function to create a String Instrument. It will create the new Stage, set up a number of strings and get the context of the Canvas that thw will be drawn on.

```js
function StringInstrument(stageID, canvasID, stringNum){
  this.strings = [];
  this.canvas = document.getElementById(canvasID);
  this.stage = new Stage(stageID);
  this.ctx = this.canvas.getContext('2d');
  this.stringNum = stringNum;

  this.create();
  this.render();

  return this;
}
```

Next we will position the hit areas of the strings and then add them to the Stage element.

```js
StringInstrument.prototype.create = function() {
  for (var i = 0; i < this.stringNum; i++) {
    var srect = new Rect(10, 90 + i * 15, 380, 5);
    var s = new GuitarString(srect);
    this.stage.addString(srect, s);
    this.strings.push(s);
  }
};
```

Finally the StringInstrument's render function will loop through all our strings and call their render methods. It runs all the time, a quickly as requestAnimationFrame sees fit. You can read more about requestAnimationFrame in Paul Irish's article [requestAnimationFrame for smart animating](http://paulirish.com/2011/requestanimationframe-for-smart-animating/).

In a real application you might want to set a flag when no animation is occurring to stop drawing a new canvas frame.

```js
StringInstrument.prototype.render = function() {
  var _self = this;

  requestAnimFrame(function(){
    _self.render();
  });

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (var i = 0; i < this.stringNum; i++) {
    this.strings[i].render(this.ctx);
  }
};
```

## Wrap up

Having a common Stage element to handle all our interaction isn’t without its drawbacks. It’s computationally more complex, and cursor pointer events are limited with out adding extra code to change them.
However, for JAM with Chrome, the benefits of being able to abstract mouse events away from the individual elements worked really well. It let us experiment more with the interface design, switch between methods of animating elements, use SVG to replace images of basic shapes, easily disable hit areas and more.

To see the Drums and Stings in action start your own [JAM](http://jamwithchrome.com) and select the __Standard Drums__ or the __Classic Clean Electric Guitar__.

<figure>
<a href="http://jamwithchrome.com">
 {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/MzsBxbwuqN7OZHHvY0DL.png", alt="Jam Logo", width="220", height="78" %}

</figure>
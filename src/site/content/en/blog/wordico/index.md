---
layout: post
title: Case Study - Converting Wordico from Flash to HTML5
authors:
  - adammark
  - adriangould
date: 2011-03-10
tags:
  - blog
  - case-study
---
## Introduction

When we converted our [Wordico](http://www.wordico.com) crossword game from Flash to HTML5, our first task was to unlearn everything we knew about creating a rich user experience in the browser. While Flash offered a single, comprehensive API for all aspects of application development - from vector drawing to polygon hit detection to XML parsing - HTML5 offered a jumble of specifications with varying browser support. We also wondered if HTML, a document-specific language, and CSS, a box-centric language, were suitable for building a game. Would the game display uniformly across browsers, as it did in Flash, and would it look and behave as nicely? For Wordico, the answer was <i>yes.</i>

## What's your vector, Victor?

We developed the original version of Wordico using only vector graphics: lines, curves, fills, and gradients. The result was both highly compact and infinitely scalable:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3eBecIcEkaaVpW7bo4Ng.jpg", alt="Wordico Wireframe", width="600", height="400" %}
<figcaption>In Flash, every display object was made of vector shapes.</figcaption>
</figure>

We also took advantage of the Flash timeline to create objects having multiple states. For example, we used nine named keyframes for the `Space` object:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Ea3v3u4mPkuT0kcIARwl.png", alt="A triple-letter space in Flash.", width="472", height="469" %}
<figcaption>A triple-letter space in Flash.</figcaption>
</figure>

In HTML5, however, we use a bitmapped sprite:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ng5ulpGG0pXwOBMLgOu3.png", alt="A PNG sprite showing all nine spaces.", width="630", height="70" %}
<figcaption>A PNG sprite showing all nine spaces.</figcaption>
</figure>

To create the 15x15 gameboard from individual spaces, we iterate over a 225-character string notation in which each space is represented by a different character (such as "t" for triple letter and "T" for triple word). This was a straightforward operation in Flash; we simply stamped out spaces and arranged them in a grid:

```js
var spaces:Array = new Array();

for (var i:int = 0; i < 225; i++) {
  var space:Space = new Space(i, layout.charAt(i));
  ...
  spaces.push(addChild(space));
}

LayoutUtil.grid(spaces, 15);
```

In HTML5, it's a bit more complicated. We use the [`<canvas>` element](http://diveintohtml5.info/canvas.html), a bitmap drawing surface, to paint the gameboard one square at a time. The first step is to load the image sprite. Once it's loaded, we iterate through the layout notation, drawing a different portion of the image with each iteration:

```js
var x = 0;  // x coordinate
var y = 0;  // y coordinate
var w = 35; // width and height of a space

for (var i = 0; i < 225; i++) {
  if (i && i % 15 == 0) {
    x = 0;
    y += w;
  }

  var imageX = "_dDFtTqQxm".indexOf(layout.charAt(i)) * 70;

  canvas.drawImage("spaces.png", imageX, 0, 70, 70, x, y, w, w);

  x += w;
}
```

Here's the result in the web browser. Note that the canvas itself has a CSS drop shadow:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/T5036Q7IziNYCm9K96Nl.png", alt="In HTML5, the gameboard is a single canvas element.", width="280", height="242" %}
<figcaption>In HTML5, the gameboard is a single canvas element.</figcaption>
</figure>

Converting the tile object was a similar exercise. In Flash, we used [text fields](http://livedocs.adobe.com/flash/9.0/ActionScriptLangRefV3/flash/text/TextField.html) and vector shapes:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/WD1gT3k3AwTwnrZ9JCgA.png", alt="The Flash tile was a combination of text fields and vector shapes", width="165", height="168" %}
<figcaption>The Flash tile was a combination of text fields and vector shapes.</figcaption>
</figure>

In HTML5, we combine three image sprites on a single `<canvas>` element at runtime:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/FT43exDZpzqZ88og01l0.png", alt="The HTML tile is a composite of three images.", width="600", height="89" %}
<figcaption>The HTML tile is a composite of three images.</figcaption>
</figure>

Now we have 100 canvases (one for each tile) plus a canvas for the gameboard. Here's the markup for an "H" tile:

```html
<canvas width="35" height="35" class="tile tile-racked" title="H-2"/>
```

Here's the corresponding CSS:

```css
.tile {
  width: 35px;
  height: 35px;
  position: absolute;
  cursor: pointer;
  z-index: 1000;
}

.tile-drag {
  -moz-box-shadow: 1px 1px 7px rgba(0,0,0,0.8);
  -webkit-box-shadow: 1px 1px 7px rgba(0,0,0,0.8);
  -moz-transform: scale(1.10);
  -webkit-transform: scale(1.10);
  -webkit-box-reflect: 0px;
  opacity: 0.85;
}

.tile-locked {
  cursor: default;
}

.tile-racked {
  -webkit-box-reflect: below 0px -webkit-gradient(linear, 0% 0%, 0% 100%,  
    from(transparent), color-stop(0.70, transparent), to(white));
}
```

We apply CSS3 effects when the tile is being dragged (shadow, opacity, and scaling) and when the tile is sitting on the rack (reflection):

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/MzE7dGX78tZvynN3EGmZ.png", alt="The dragged tile is slightly larger, slightly transparent, and has a drop shadow.", width="371", height="112" %}
<figcaption>The dragged tile is slightly larger, slightly transparent, and has a drop shadow.</figcaption>
</figure>

Using raster images has some obvious advantages. First, the result is pixel-precise. Second, these images can be cached by the browser. Third, with a little extra work, we can swap out the images to create new tile designs - such as a metal tile - and this design work can be done in Photoshop instead of in Flash.

The downside? By using images, we give up programmatic access to the text fields. In Flash, it was a simple operation to change the color or other properties of the type; in HTML5, these properties are baked into the images themselves. (We tried HTML text, but it required a lot of extra markup and CSS. We also tried canvas text, but the results were inconsistent across browsers.)

## Fuzzy logic

We wanted to make full use of the browser window at any size - and avoid scrolling. This was a relatively simple operation in Flash, since the entire game was drawn in vectors and could be scaled up or down without losing fidelity. But it was trickier in HTML. We tried using CSS scaling but ended up with a blurred canvas:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/UUqxfXDXcVPaHcHTh3jb.png", alt="CSS scaling (left) vs. redrawing (right).", width="301", height="149" %}
<figcaption>CSS scaling (left) vs. redrawing (right).</figcaption>
</figure>

Our solution is to redraw the gameboard, rack, and tiles whenever the user resizes the browser:

```js
window.onresize = function (evt) {
...
gameboard.setConstraints(boardWidth, boardWidth);

...
rack.setConstraints(rackWidth, rackHeight);

...
tileManager.resizeTiles(tileSize);
});
```

We end up with crisp images and pleasing layouts at any screen size:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oaQ9mopWjWipGwcTTeVS.jpg", alt="The gameboard fills the vertical space; other page elements flow around it.", width="745", height="191" %}
<figcaption>The gameboard fills the vertical space; other page elements flow around it.</figcaption>
</figure>

## Get to the point

Since each tile is absolutely positioned and must align precisely with the gameboard and rack, we need a reliable positioning system. We use two functions, `Bounds` and `Point`, to help manage the location of elements in the global space (the HTML page). `Bounds` describes a rectangular area on the page, while `Point` describes an <i>x,y</i> coordinate relative to the top left corner of the page (0,0), otherwise known as the registration point.

With `Bounds`, we can detect the intersection of two rectangular elements (such as when a tile crosses the rack) or whether a rectangular area (such as a double-letter space) contains an arbitrary point (such as the center point of a tile). Here's the implementation of Bounds:

```js
// bounds.js
function Bounds(element) {
var x = element.offsetLeft;
var y = element.offsetTop;
var w = element.offsetWidth;
var h = element.offsetHeight;

this.left = x;
this.right = x + w;
this.top = y;
this.bottom = y + h;
this.width = w;
this.height = h;
this.x = x;
this.y = y;
this.midx = x + (w / 2);
this.midy = y + (h / 2);
this.topleft = new Point(x, y);
this.topright = new Point(x + w, y);
this.bottomleft = new Point(x, y + h);
this.bottomright = new Point(x + w, y + h);
this.middle = new Point(x + (w / 2), y + (h / 2));
}

Bounds.prototype.contains = function (point) {
return point.x > this.left &amp;&amp;
point.x < this.right &amp;&amp;
point.y > this.top &amp;&amp;
point.y < this.bottom;
}

Bounds.prototype.intersects = function (bounds) {
return this.contains(bounds.topleft) ||
this.contains(bounds.topright) ||
this.contains(bounds.bottomleft) ||
this.contains(bounds.bottomright) ||
bounds.contains(this.topleft) ||
bounds.contains(this.topright) ||
bounds.contains(this.bottomleft) ||
bounds.contains(this.bottomright);
}

Bounds.prototype.toString = function () {
return [this.x, this.y, this.width, this.height].join(",");
}
```

We use `Point` to determine the absolute coordinate (top-left corner) of any element on the page or of a mouse event. `Point` also contains methods for calculating distance and direction, which are necessary for creating animation effects. Here's the implementation of `Point`:

```js
// point.js

function Point(x, y) {
this.x = x;
this.y = y;
}

Point.prototype.distance = function (point) {
var a = point.x - this.x;
var b = point.y - this.y;

return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

Point.prototype.distanceX = function (point) {
return Math.abs(this.x - point.x);
}

Point.prototype.distanceY = function (point) {
return Math.abs(this.y - point.y);
}

Point.prototype.interpolate = function (point, pct) {
var x = this.x + ((point.x - this.x) * pct);
var y = this.y + ((point.y - this.y) * pct);

return new Point(x, y);
}

Point.prototype.offset = function (x, y) {
return new Point(this.x + x, this.y + y);
}

Point.prototype.vector = function (point) {
return new Point(point.x - this.x, point.y - this.y);
}

Point.prototype.toString = function () {
return this.x + "," + this.y;
}

// static
Point.fromElement = function (element) {
return new Point(element.offsetLeft, element.offsetTop);
}

// static
Point.fromEvent = function (evt) {
return new Point(evt.x || evt.clientX, evt.y || evt.clientY);
}
```

These functions form the basis of drag-and-drop and animation capabilities. For example, we use `Bounds.intersects()` to determine if a tile overlaps a space on the gameboard; we use `Point.vector()` to determine the direction of a dragged tile; and we use `Point.interpolate()` in combination with a timer to create a motion tween, or easing effect.

## Go with the flow

While fixed-size layouts are easier to produce in Flash, fluid layouts are much easier to generate with HTML and the CSS box model. Consider the following grid view, with its variable width and height:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/rKTDof6hhP0GxiPmORR5.jpg", alt="This layout has no fixed dimensions: thumbnails flow left to right, top to bottom.", width="500", height="403" %}
<figcaption>This layout has no fixed dimensions: thumbnails flow left to right, top to bottom.</figcaption>
</figure>

Or consider the chat panel. The Flash version required multiple event handlers to respond to mouse actions, a mask for the scrollable area, math for computing the scroll position, and a lot of other code to glue it together.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/bdp0fUK8kmWEM0BY45ad.jpg", alt="The chat panel in Flash was pretty but complex.", width="259", height="317" %}
<figcaption>The chat panel in Flash was pretty but complex.</figcaption>
</figure>

The HTML version, by comparison, is just a `<div>` with a fixed height and the overflow property set to hidden. Scrolling costs us nothing.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/tj47VhDgbeFG6PDiutB1.jpg", alt="The CSS box model at work.", width="284", height="323" %}
<figcaption>The CSS box model at work.</figcaption>
</figure>

In cases like this - ordinary layout tasks - HTML and CSS outshine Flash.

## Can you hear me now?

We struggled with the `<audio>` tag - it simply wasn't capable of playing short sounds effects repeatedly in certain browsers. We tried two workarounds. First, we padded the sound files with dead air to make them longer. Then we tried alternating playback across multiple audio channels. Neither technique was completely effective or elegant.

Ultimately we decided to roll our own Flash audio player and use HTML5 audio as a fallback. Here's the basic code in Flash:

```js
var sounds = new Array();

function playSound(path:String):void {
var sound:Sound = sounds[path];

if (sound == null) {
sound = new Sound();
sound.addEventListener(Event.COMPLETE, function (evt:Event) {
    sound.play();
});
sound.load(new URLRequest(path));
sounds[path] = sound;
}
else {
sound.play();
}
}

ExternalInterface.addCallback("playSound", playSound);
```

In JavaScript, we attempt to detect the embedded Flash player.  If that fails, we create an `<audio>` node for each sound file:

```js
function play(String soundId) {
var src = "/audio/" + soundId + ".mp3";

// Flash
try {
var swf = window["swfplayer"] || document["swfplayer"];
swf.playSound(src);
}
// or HTML5 audio
catch (e) {
var sound = document.getElementById(soundId);
if (sound == null || sound == undefined) {
    var sound = document.createElement("audio");
    sound.id = soundId;
    sound.src = src;
    document.body.appendChild(sound);
}
sound.play();
}
}
```

Note that this works for MP3 files only - we never bothered to support OGG. We hope the industry will settle on a single format in the near future.

## Poll position

We use the same technique in HTML5 as we did in Flash to refresh the game state: every 10 seconds, the client asks the server for updates. If the game state has changed since the last poll, the client receives and handles the changes; otherwise, nothing happens. This traditional polling technique is acceptable, if not quite elegant. However, we'd like to switch to [long polling](http://en.wikipedia.org/wiki/Long_polling#Long_polling) or [WebSockets](http://en.wikipedia.org/wiki/Web_Sockets) as the game matures and users come to expect real-time interaction over the network. WebSockets, in particular, would present many opportunities to enhance the game play.

## What a tool!

We used [Google Web Toolkit](http://code.google.com/webtoolkit/) (GWT) to develop both the front-end user interface and back-end control logic (authentication, validation, persistence, and so on). The JavaScript itself is compiled from Java source code. For example, the Point function is adapted from `Point.java`:

```js
package com.wordico.client.view.layout;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.DomEvent;

public class Point {
public double x;
public double y;

public Point(double x, double y) {
this.x = x;
this.y = y;
}

public double distance(Point point) {
double a = point.x - this.x;
double b = point.y - this.y;

return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
...
}
```

Some UI classes have corresponding template files in which page elements are "bound" to class members. For example, `ChatPanel.ui.xml` corresponds to `ChatPanel.java`:

```html
<!DOCTYPE ui:UiBinder SYSTEM "http://dl.google.com/gwt/DTD/xhtml.ent">

<ui:UiBinder
xmlns:ui="urn:ui:com.google.gwt.uibinder"
xmlns:g="urn:import:com.google.gwt.user.client.ui"
xmlns:w="urn:import:com.wordico.client.view.widget">

<g:HTMLPanel>
<div class="palette">
<g:ScrollPanel ui:field="messagesScroll">
    <g:FlowPanel ui:field="messagesFlow"></g:FlowPanel>
</g:ScrollPanel>
<g:TextBox ui:field="chatInput"></g:TextBox>
</div>
</g:HTMLPanel>

</ui:UiBinder>
```

The full details are beyond the scope of this article, but we encourage you to check out GWT for your next HTML5 project.

Why use Java? First, for strict typing. While dynamic typing is useful in JavaScript - for example, the ability of an array to hold values of different types - it can be a headache in large, complex projects. Second, for refactoring capabilities. Consider how you'd change a JavaScript method signature across thousands of lines of code - not easily! But with a good Java IDE, it's a snap. Finally, for testing purposes. Writing unit tests for Java classes beats the time-honored technique of "save and refresh."

## Summary

Except for our audio troubles, HTML5 greatly exceeded our expectations. Not only does Wordico look as good as it did in Flash, it's every bit as fluid and responsive. We couldn't have done it without Canvas and CSS3. Our next challenge: adapting Wordico for mobile use.

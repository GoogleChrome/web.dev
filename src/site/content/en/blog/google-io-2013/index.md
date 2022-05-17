---
layout: post
title: Case Study - Google I/O 2013 Experiment
date: 2013-04-12
updated: 2013-04-17
authors:
  - thomasreynolds
tags:
  - blog
  - case-study
---

## Introduction

To build developer interest on the Google I/O 2013 website before conference registration opened, we developed a series of mobile-first experiments and games focusing on touch interactions, generative audio and the joy of discovery. Inspired by the potential of code and the power of play, this interactive experience begins with the simple sounds of "I" and "O" when you tap the new I/O logo.

## Organic Motion

We decided to implement the I and O animations in a wobbly, organic effect that isn't often seen in HTML5 interactions. Dialing in the options to make it feel fun and reactive took a little time. 

### Bouncy Physics Code Example

To accomplish this effect, we used a simple physics simulation on a series of points representing the edges of the two shapes. When either shape is tapped, all the points are accelerated out from the location of the tap. They stretch out and away before they are pulled back in.

On instantiation, each point gets a random acceleration amount and rebound "bounciness" so they do not animate uniformly, as you can see in this code:

```js
this.paperO_['vectors'] = [];

// Add an array of vector points and properties to the object.
for (var i = 0; i < this.paperO_['segments'].length; i++) {
  var point = this.paperO_['segments'][i]['point']['clone']();
  point = point['subtract'](this.oCenter);

  point['velocity'] = 0;
  point['acceleration'] = Math.random() * 5 + 10;
  point['bounce'] = Math.random() * 0.1 + 1.05;

  this.paperO_['vectors'].push(point);
}
```

Then, when tapped, they are accelerated outwards from the position of the tap using the code here:

```js
for (var i = 0; i < path['vectors'].length; i++) {
  var point = path['vectors'][i];
  var vector;
  var distance;

  if (path === this.paperO_) {
    vector = point['add'](this.oCenter);
    vector = vector['subtract'](clickPoint);
    distance = Math.max(0, this.oRad - vector['length']);
  } else {
    vector = point['add'](this.iCenter);
    vector = vector['subtract'](clickPoint);
    distance = Math.max(0, this.iWidth - vector['length']);
  }

  point['length'] += Math.max(distance, 20);
  point['velocity'] += speed;
}
```

Finally, every particle is decelerated on every frame and slowly returns to equilibrium with this approach in code:

```js
for (var i = 0; i < path['segments'].length; i++) {
  var point = path['vectors'][i];
  var tempPoint = new paper['Point'](this.iX, this.iY);

  if (path === this.paperO_) {
    point['velocity'] = ((this.oRad - point['length']) /
      point['acceleration'] + point['velocity']) / point['bounce'];
  } else {
    point['velocity'] = ((tempPoint['getDistance'](this.iCenter) -
      point['length']) / point['acceleration'] + point['velocity']) /
      point['bounce'];
  }

  point['length'] = Math.max(0, point['length'] + point['velocity']);
}
```

### Organic Motion Demo

Here is the I/O home mode for you to play with. We've also exposed a bunch of additional options in this implementation. If you turn on "show points" you will see the individual points that the physics simulation and forces are acting on. 

## Reskinning

Once we were happy with the home mode motion, we wanted to use that same effect for two retro modes: Eightbit and Ascii.

To accomplish this reskinning, we used the same canvas from the home mode and use the pixel data to generate each of the two effects. This approach is reminiscent of an OpenGL fragment shader where each pixel of the scene is inspected and manipulated. Let's dive into this more.

### Canvas "Shader" Code Example

Pixels on a Canvas can be read using the `getImageData` method. The returned array contains 4 values per-pixel representing each pixels RGBA value. These pixels are strung together in a massive array-like structure. For example, a 2x2 canvas would have 4 pixels and 16 entries in its imageData array.

Our canvas is full screen, so if we pretend the screen is 1024x768 (like on an iPad), then the array has 3,145,728 entries. Because this is an animation, this entire array is updated 60 times a second. Modern javascript engines can handle looping and acting on this much data quickly enough to keep the framerate consistent. (Tip: don't try logging that data to the developer console, as it will slow your browser to a crawl or crash it entirely.)

Here's how our Eightbit mode reads the home mode canvas and blows up the pixels to have a blockier effect:

```js
var pixelData = pctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

// tctx is the Target Context for the output Canvas element
tctx.clearRect(0, 0, targetCanvas.width + 1, targetCanvas.height + 1);

var size = ~~(this.width_ * 0.0625);

if (this.height_ * 6 < this.width_) {
 size /= 8;
}

var increment = Math.min(Math.round(size * 80) / 4, 980);

for (i = 0; i < pixelData.data.length; i += increment) {
  if (pixelData.data[i + 3] !== 0) {
    var r = pixelData.data[i];
    var g = pixelData.data[i + 1];
    var b = pixelData.data[i + 2];
    var pixel = Math.ceil(i / 4);
    var x = pixel % this.width_;
    var y = Math.floor(pixel / this.width_);

    var color = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';

    tctx.fillStyle = color;

    /**
     * The ~~ operator is a micro-optimization to round a number down
     * without using Math.floor. Math.floor has to look up the prototype
     * tree on every invocation, but ~~ is a direct bitwise operation.
     */
    tctx.fillRect(x - ~~(size / 2), y - ~~(size / 2), size, size);
  }
}
```

### Eightbit Shader Demo

Below, we strip away the Eightbit overlay and see the original animation beneath. The "kill screen" option will show you a strange effect we stumbled upon by incorrectly sampling the source pixels. We ended up using it as a "responsive" easter egg when the Eightbit mode is resized to unlikely aspect ratios. Happy accident!

## Canvas Compositing

It's pretty amazing what you can accomplish by combining multiple render steps and masks. We built a [2D metaball](http://en.wikipedia.org/wiki/Metaballs) which requires that each ball have its own radial gradient and those gradients be blended together where the balls overlap. (You can see this in the demo below.)

To accomplish this, we used two separate canvases. The first canvas calculates and draws the metaball shape. A second canvas draws radial gradients at each ball position. Then the shape masks the gradients and we render the final output.

### Compositing Code Example

Here's the code that makes everything happen:

```js
// Loop through every ball and draw it and its gradient.
for (var i = 0; i < this.ballCount_; i++) {
  var target = this.world_.particles[i];

  // Set the size of the ball radial gradients.
  this.gradSize_ = target.radius * 4;

  this.gctx_.translate(target.pos.x - this.gradSize_,
    target.pos.y - this.gradSize_);

  var radGrad = this.gctx_.createRadialGradient(this.gradSize_,
    this.gradSize_, 0, this.gradSize_, this.gradSize_, this.gradSize_);

  radGrad.addColorStop(0, target['color'] + '1)');
  radGrad.addColorStop(1, target['color'] + '0)');

  this.gctx_.fillStyle = radGrad;
  this.gctx_.fillRect(0, 0, this.gradSize_ * 4, this.gradSize_ * 4);
};
```

Then, set up the canvas for masking and draw:

```js
// Make the ball canvas the source of the mask.
this.pctx_.globalCompositeOperation = 'source-atop';

// Draw the ball canvas onto the gradient canvas to complete the mask.
this.pctx_.drawImage(this.gcanvas_, 0, 0);
this.ctx_.drawImage(this.paperCanvas_, 0, 0);
```

## Conclusion

The variety of techniques we got to use and technologies we implemented (such as Canvas, SVG, CSS Animation, JS Animation, Web Audio, etc.) made the project incredibly fun to develop.

There is way more to explore than what you see here, even. Keep tapping at the I/O logo and the correct sequences will unlock more mini-experiments, games, trippy visuals and perhaps even some breakfast foods. We suggest you try it on your smartphone or tablet for the best experience.

Here's a combination to get your started: O-I-I-I-I-I-I-I. Try it now: [google.com/io](http://google.com/io)

## Open Source

We've open sourced our code Apache 2.0 license. You can find it on our Github at: [http://github.com/Instrument/google-io-2013](http://github.com/Instrument/google-io-2013).

## Credits

Developers:

- Thomas Reynolds
- Brian Hefter
- Stefanie Hatcher
- Paul Farning

Designers:

- Dan Schechter
- Sage Brown
- Kyle Beck

Producers:

- Amie Pascal
- Andrea Nelson

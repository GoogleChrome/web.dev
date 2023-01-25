---
layout: post
title: Image filters with canvas
date: 2011-05-25
authors:
  - ilmariheikkinen
tags:
  - blog
---

## Introduction

The HTML5 canvas element can be used to write image filters. What you
need to do is draw an image onto a canvas, read back the canvas pixels,
and run your filter on them. You can then write the result onto a new
canvas (or heck, just reuse the old one.)

Sounds simple? Good. Let's get cracking!

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ZyDo02gmIzf8LOpnofJ4.png", alt="The original test image", width="600", height="337" %}
  <figcaption>The original test image</figcaption>
</figure>

## Processing pixels

First, retrieve the image pixels:

```js
Filters = {};
Filters.getPixels = function(img) {
var c = this.getCanvas(img.width, img.height);
var ctx = c.getContext('2d');
ctx.drawImage(img);
return ctx.getImageData(0,0,c.width,c.height);
};

Filters.getCanvas = function(w,h) {
var c = document.createElement('canvas');
c.width = w;
c.height = h;
return c;
};
```

Next, we need a way to filter images. How about a `filterImage`
method that takes a filter and an image and returns the filtered pixels?

```js
Filters.filterImage = function(filter, image, var_args) {
var args = [this.getPixels(image)];
for (var i=2; i&lt;arguments.length; i++) {
args.push(arguments[i]);
}
return filter.apply(null, args);
};
```

## Running simple filters

Now that we have the pixel processing pipeline put together, it's time to
write some simple filters. To start off, let's convert the image to grayscale.

```js
Filters.grayscale = function(pixels, args) {
var d = pixels.data;
for (var i=0; i&lt;d.length; i+=4) {
var r = d[i];
var g = d[i+1];
var b = d[i+2];
// CIE luminance for the RGB
// The human eye is bad at seeing red and blue, so we de-emphasize them.
var v = 0.2126*r + 0.7152*g + 0.0722*b;
d[i] = d[i+1] = d[i+2] = v
}
return pixels;
};
```

Adjusting brightness can be done by adding a fixed value to the pixels:

```js
Filters.brightness = function(pixels, adjustment) {
var d = pixels.data;
for (var i=0; i&lt;d.length; i+=4) {
d[i] += adjustment;
d[i+1] += adjustment;
d[i+2] += adjustment;
}
return pixels;
};
```
Thresholding an image is also quite simple. You just compare the grayscale
value of a  pixel to the threshold value and set the color based on that:

```js
Filters.threshold = function(pixels, threshold) {
var d = pixels.data;
for (var i=0; i&lt;d.length; i+=4) {
var r = d[i];
var g = d[i+1];
var b = d[i+2];
var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
d[i] = d[i+1] = d[i+2] = v
}
return pixels;
};
```

## Convolving images

[Convolution filters](http://en.wikipedia.org/wiki/Convolution) are very useful generic filters for image processing.
The basic idea is that you take the weighed sum of a
rectangle of pixels from the source image and use that as the output value.
Convolution filters can be used for blurring, sharpening, embossing,
edge detection and a whole bunch of other things.

```js
Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function(w,h) {
return this.tmpCtx.createImageData(w,h);
};

Filters.convolute = function(pixels, weights, opaque) {
var side = Math.round(Math.sqrt(weights.length));
var halfSide = Math.floor(side/2);
var src = pixels.data;
var sw = pixels.width;
var sh = pixels.height;
// pad output by the convolution matrix
var w = sw;
var h = sh;
var output = Filters.createImageData(w, h);
var dst = output.data;
// go through the destination image pixels
var alphaFac = opaque ? 1 : 0;
for (var y=0; y&lt;h; y++) {
for (var x=0; x&lt;w; x++) {
  var sy = y;
  var sx = x;
  var dstOff = (y*w+x)*4;
  // calculate the weighed sum of the source image pixels that
  // fall under the convolution matrix
  var r=0, g=0, b=0, a=0;
  for (var cy=0; cy&lt;side; cy++) {
    for (var cx=0; cx&lt;side; cx++) {
      var scy = sy + cy - halfSide;
      var scx = sx + cx - halfSide;
      if (scy >= 0 && scy &lt; sh && scx >= 0 && scx &lt; sw) {
        var srcOff = (scy*sw+scx)*4;
        var wt = weights[cy*side+cx];
        r += src[srcOff] * wt;
        g += src[srcOff+1] * wt;
        b += src[srcOff+2] * wt;
        a += src[srcOff+3] * wt;
      }
    }
  }
  dst[dstOff] = r;
  dst[dstOff+1] = g;
  dst[dstOff+2] = b;
  dst[dstOff+3] = a + alphaFac*(255-a);
}
}
return output;
};
```

Here's a 3x3 sharpen filter. See how it focuses the weight on the center pixel.
To maintain the brightness of the image, the sum of the matrix values should
be one.

```js
Filters.filterImage(Filters.convolute, image,
[  0, -1,  0,
-1,  5, -1,
  0, -1,  0 ]
);
```

Here's an another example of a convolution filter, the box blur. The box
blur outputs the average of the pixel values inside the convolution matrix.
The way to do that is to create a convolution matrix of size NxN where
each of the weights is 1 / (NxN). That way each of the pixels inside the
matrix contributes an equal amount to the output image and the sum of the
weights is one.

```js
Filters.filterImage(Filters.convolute, image,
[ 1/9, 1/9, 1/9,
1/9, 1/9, 1/9,
1/9, 1/9, 1/9 ]
);
```

We can make more complex image filters by combining existing filters. For
example, let's write a [Sobel filter](http://en.wikipedia.org/wiki/Sobel_filter). A Sobel filter computes the vertical
and horizontal gradients of the image and combines the computed images to
find edges in the image.
The way we implement the Sobel filter here is by first grayscaling the image,
then taking the horizontal and vertical gradients and finally
combining the gradient images to make up the final image.


Regarding terminology, "gradient" here means the change
in pixel value at an image position. If a pixel has a left neighbour with
value 20 and a right neighbour with value 50, the horizontal gradient at
the pixel would be 30. The vertical gradient has the same idea but
uses the above and below neighbours.

```js
var grayscale = Filters.filterImage(Filter.grayscale, image);
// Note that ImageData values are clamped between 0 and 255, so we need
// to use a Float32Array for the gradient values because they
// range between -255 and 255.
var vertical = Filters.convoluteFloat32(grayscale,
[ -1, 0, 1,
-2, 0, 2,
-1, 0, 1 ]);
var horizontal = Filters.convoluteFloat32(grayscale,
[ -1, -2, -1,
  0,  0,  0,
  1,  2,  1 ]);
var final_image = Filters.createImageData(vertical.width, vertical.height);
for (var i=0; i&lt;final_image.data.length; i+=4) {
// make the vertical gradient red
var v = Math.abs(vertical.data[i]);
final_image.data[i] = v;
// make the horizontal gradient green
var h = Math.abs(horizontal.data[i]);
final_image.data[i+1] = h;
// and mix in some blue for aesthetics
final_image.data[i+2] = (v+h)/4;
final_image.data[i+3] = 255; // opaque alpha
}
```

And there's a whole bunch of other cool convolution filters out there
just waiting for you to discover them.
For instance, try implementing a [Laplace filter](http://en.wikipedia.org/wiki/Discrete_Laplace_operator#Implementation_in_Image_Processing)
in the convolution toy above and see what it does.

## Conclusion

I hope this small article was useful in introducing the basic concepts
of writing image filters in JavaScript using the HTML canvas tag. I
encourage you to go and implement some more image filters, it's quite
fun!

If you need better performance from your filters, you can usually
port them to use WebGL fragment shaders to do the image processing.
With shaders, you can run most simple filters in realtime, which allows
you to use them for post-processing video and animations.

---
title: WebGL transforms
authors:
  - gman
date: 2012-04-18
tags:
  - blog
---

## WebGL 2D Translation

Before we move on to 3D let's stick with 2D for a little while longer. Bear with me please. This article might seem exceedingly obvious to some but I'll build up to a point in a few articles.

This article is a continuation of a series starting with [WebGL Fundamentals](https://www.html5rocks.com/tutorials/webgl/webgl_fundamentals/). If you haven't read it I suggest you read at least the first chapter then come back here.
Translation is some fancy math name that basically means "to move" something. I suppose moving a sentence from English to Japanese fits as well but in this case we're talking about moving geometry. Using the sample code we ended up with in [the first post](https://www.html5rocks.com/tutorials/webgl/webgl_fundamentals/) you could easily translate our rectangle just by changing the values passed to setRectangle right? Here's a sample based on our [previous sample](https://www.html5rocks.com/tutorials/webgl/webgl_fundamentals/).

```js
  // First lets make some variables 
  // to hold the translation of the rectangle
  var translation = [0, 0];
  // then let's make a function to
  // re-draw everything. We can call this
  // function after we update the translation.
  // Draw the scene.
  function drawScene() {
     // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Setup a rectangle
    setRectangle(gl, translation[0], translation[1], width, height);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
```

So far so good. But now imagine we wanted to do the same thing with a more complicated shape.
Let's say we wanted to draw an 'F' that consists of 6 triangles like this.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/FP0CiVAJKRd0rC2TrPF6.svg", alt="F letter", width="182", height="254" %}
</figure>

Well, following are current code we'd have to change setRectangle to something more like this.

```js
// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl, x, y) {
  var width = 100;
  var height = 150;
  var thickness = 30;
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          x, y,
          x + thickness, y,
          x, y + height,
          x, y + height,
          x + thickness, y,
          x + thickness, y + height,

          // top rung
          x + thickness, y,
          x + width, y,
          x + thickness, y + thickness,
          x + thickness, y + thickness,
          x + width, y,
          x + width, y + thickness,

          // middle rung
          x + thickness, y + thickness * 2,
          x + width * 2 / 3, y + thickness * 2,
          x + thickness, y + thickness * 3,
          x + thickness, y + thickness * 3,
          x + width * 2 / 3, y + thickness * 2,
          x + width * 2 / 3, y + thickness * 3]),
      gl.STATIC_DRAW);
}
```

You can hopefully see that's not going to scale well. If we want to draw some very complex geometry with hundreds or thousands of lines we'd have to write some pretty complex code. On top of that, every time we draw JavaScript has to update all the points.
There's a simpler way. Just upload the geometry and do the translation in the shader.
Here's the new shader

```html
<script id="2d-vertex-shader" type="x-shader/x-vertex">
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
   // Add in the translation.
   vec2 position = a_position + u_translation;

   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = position / u_resolution;
   ...
```

and we'll restructure the code a little. For one we only need to set the geometry once. 

```js
// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90]),
      gl.STATIC_DRAW);
}
```

Then we just need to update `u_translation` before we draw with the translation that we desire.

```js
  ...
  var translationLocation = gl.getUniformLocation(
             program, "u_translation");
  ...
  // Set Geometry.
  setGeometry(gl);
  ..
  // Draw scene.
  function drawScene() {
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the translation.
    gl.uniform2fv(translationLocation, translation);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 18);
  }
```

Notice `setGeometry` is called only once. It is no longer inside drawScene.

Now when we draw WebGL is doing practically everything. All we are doing is setting a translation and asking it to draw. Even if our geometry had tens of thousands of points the main code would stay the same.

## WebGL 2D Rotation

I'm going to admit right up front I have no idea if how I explain this will make sense but what the heck, might as well try.

First I want to introduce you to what's called a "unit circle". If you remember your junior high school math (don't go to sleep on me!) a circle has a radius. The radius of a circle is the distance from the center of the circle to the edge. A unit circle is a circle with a radius of 1.0.

If you remember from basic 3rd grade math if you multiply something by 1 it stays the same. So 123 * 1 = 123. Pretty basic right? Well, a unit circle, a circle with a radius of 1.0 is also a form of 1. It's a rotating 1.  So you can multiply something by this unit circle and in a way it's kind of like multiplying by 1 except magic happens and things rotate.
We're going to take that X and Y value from any point on the unit circle and we'll multiply our geometry by them from <a href="webgl-2d-translation.html">our previous sample</a>.
Here's are the updates to our shader.

```html
<script id="2d-vertex-shader" type="x-shader/x-vertex">
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

void main() {
  // Rotate the position
  vec2 rotatedPosition = vec2(
     a_position.x * u_rotation.y + a_position.y * u_rotation.x,
     a_position.y * u_rotation.y - a_position.x * u_rotation.x);

  // Add in the translation.
  vec2 position = rotatedPosition + u_translation;
```

And we update the JavaScript so that we can pass those 2 values in. 

```js
  ...
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");
  ...
  var rotation = [0, 1];
  ..
  // Draw the scene.
  function drawScene() {
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the translation.
    gl.uniform2fv(translationLocation, translation);

    // Set the rotation.
    gl.uniform2fv(rotationLocation, rotation);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 18);
  }
```

Why does it work? Well, look at the math. 

```js
rotatedX = a_position.x * u_rotation.y + a_position.y * u_rotation.x;
rotatedY = a_position.y * u_rotation.y - a_position.x * u_rotation.x;
```

Let's stay you have a rectangle and you want to rotate it. Before you start rotating it the top right corner is at 3.0, 9.0. Let's pick a point on the unit circle 30 degrees clockwise from 12 o'clock.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/GDnYKnGcbHiAp85M75mg.png", alt="30deg rotation", width="201", height="201" %}
</figure>

The position on the circle there is 0.50 and 0.87

```js
3.0 * 0.87 + 9.0 * 0.50 = 7.1
9.0 * 0.87 - 3.0 * 0.50 = 6.3
```

That's exactly where we need it to be

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/9A1VokxUGUC6qERlujsQ.svg", alt="Rotation drawing", width="588", height="182" %}
</figure>

The same for 60 degrees clockwise

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/jw7iICMtFr2D8Dys9BFo.png", alt="60deg rotation", width="201", height="201" %}
</figure>

The position on the circle there is 0.87 and 0.50

```js
3.0 * 0.50 + 9.0 * 0.87 = 9.3
9.0 * 0.50 - 3.0 * 0.87 = 1.9
```
You can see that as we rotate that point clockwise to the right the X value gets bigger and the Y gets smaller. If kept going past 90 degrees X would start getting smaller again and Y would start getting bigger. That pattern gives us rotation.
There's another name for the points on a unit circle. They're call the sine and cosine. So for any given angle we can just look up the sine and cosine like this.

```js
function printSineAndCosineForAnAngle(angleInDegrees) {
  var angleInRadians = angleInDegrees * Math.PI / 180;
  var s = Math.sin(angleInRadians);
  var c = Math.cos(angleInRadians);
  console.log("s = " + s + " c = " + c);
}
```

If you copy and paste the code into your JavaScript console and type `printSineAndCosignForAngle(30)` you see it prints `s = 0.49 c= 0.87` (note: I rounded off the numbers.)
If you put it all together you can rotate your geometry to any angle you desire. Just set the rotation to the sine and cosine of the angle you want to rotate to.

```js
  ...
  var angleInRadians = angleInDegrees * Math.PI / 180;
  rotation[0] = Math.sin(angleInRadians);
  rotation[1] = Math.cos(angleInRadians);
```

I hope that made some sense. Next up a simpler one. Scale.

### What are radians?

Radians are a unit of measurement used with circles, rotation and angles. Just like we can measure distance in inches, yards, meters, etc we can measure angles in degrees or radians. 


You're probably aware that math with metric measurements is easier than math with imperial measurements. To go from inches to feet we divide by 12. To go from inches to yards we divide by 36. I don't know about you but I can't divide by 36 in my head. With metric it's much easier. To go from millimeters to centimeters we divide by 10. To from millimeters to meters we divide by 1000. I **can** divide by 1000 in my head.


Radians vs degrees are similar. Degrees make the math hard. Radians make the math easy. There are 360 degrees in a circle but there are only 2π radians. So a full turn is 2π radians. A half turn is π radians. A 1/4 turn, ie 90 degress is π/2 radian. So if you want to rotate something 90 degrees just use `Math.PI * 0.5`. If you want to rotate it 45 degrees use `Math.PI * 0.25` etc.


Nearly all math involving angles, circles or rotation works very simply if you start thinking in radians. So give it try. Use radians, not degrees except in UI displays.

## WebGL 2D Scale

Scaling is just as easy as translation.

We multiply the position by our desired scale. Here are the changes from our previous sample.

```html
<script id="2d-vertex-shader" type="x-shader/x-vertex">
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  // Scale the positon
  vec2 scaledPosition = a_position * u_scale;

  // Rotate the position
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y +
        scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y -
        scaledPosition.x * u_rotation.x);

  // Add in the translation.
  vec2 position = rotatedPosition + u_translation;
```

and we add the JavaScript needed to set the scale when we draw.

```js
  ...
  var scaleLocation = gl.getUniformLocation(program, "u_scale");
  ...
  var scale = [1, 1];
  ...
  // Draw the scene.
  function drawScene() {
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the translation.
    gl.uniform2fv(translationLocation, translation);

    // Set the rotation.
    gl.uniform2fv(rotationLocation, rotation);

    // Set the scale.
    gl.uniform2fv(scaleLocation, scale);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 18);
  }
```

One thing to notice is that scaling by a negative value flips our geometry.
I hope these last 3 chapters were helpful in understanding translation, rotation and scale. Next we'll go over the magic that is matrices that combine all 3 of these into a much simpler and often more useful form.

### Why an 'F'?

The first time I saw someone use a 'F' was on a texture. The 'F' itself is not important. What is important is that you can tell its orientation from any direction. If we used a heart ♥ or a triangle △ for example we couldn't tell if it was flipped horizontally. A circle ○ would be even worse. A colored rectangle would arguably work with different colors on each corner but then you'd have to remember which corner was which. An F's orientation is instantly recognizable. 

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/gFSxjWiFNX7ApENi3BDC.svg", alt="F orientation", width="427", height="63" %}
</figure>

Any shape that you can tell the orientation of would work, I've just used 'F' ever since I was 'F'irst introduced to the idea.

## WebGL 2D Matrices

In the last 3 chapters we went over how to translate geometry, rotate geometry, and scale geometry. Translation, rotation and scale are each considered a type of 'transformation'. Each of these transformations required changes to the shader and each of the 3 transformations was order dependent. 

For example here is a scale of 2, 1, rotation of 30%, and translation of 100, 0.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/2ewvFl4YaHvWoCnhbxTn.svg", alt="F rotation and translation", width="800", height="379" %}
</figure>

And here is a translation of 100,0, rotation of 30% and scale of 2, 1

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/nJ9PbNzsB7v70ZGJKXvn.svg", alt="F rotation and scale", width="800", height="380" %}
</figure>

The results are completely different. Even worse, if we needed the second example we'd have to write a different shader that applied the translation, rotation, and scale in our new desired order.
Well, some people way smarter than me, figured out that you can do all the same stuff with matrix math. For 2d we use a 3x3 matrix. A 3x3 matrix is like grid with 9 boxes. 

<table>
<tbody>
    <tr>
        <td>1.0</td>
        <td>2.0</td>
        <td>3.0</td>
    </tr>
    <tr>
        <td>4.0</td>
        <td>5.0</td>
        <td>6.0</td>
    </tr>
    <tr>
        <td>7.0</td>
        <td>8.0</td>
        <td>9.0</td>
    </tr>
</tbody>
</table>

To do the math we multiply the position down the columns of the matrix and add up the results. Our positions only have 2 values, x and y but to do this math we need 3 values so we'll use 1 for the third value.
in this case our result would be

```js
newX = x * 1.0 + y * 4.0 + 1 * 7.0

newY = x * 2.0 + y * 5.0 + 1 * 8.0

extra = x * 3.0 + y * 6.0 + 1 * 9.0
```

You're probably looking at that and thinking "WHAT'S THE POINT". Well, Let's assume we have a translation. We'll call the amount we want to translate tx and ty. Let's make a matrix like this

<table>
    <tbody>
        <tr><td>1.0</td><td>0.0</td><td>0.0</td></tr>
        <tr><td>0.0</td><td>1.0</td><td>0.0</td></tr>
        <tr><td>tx</td><td>ty</td><td>1.0</td></tr>
    <tbody>
</table>

And now check it out

```js
newX = x * 1.0 + y * 0.0 + 1 * tx

newY = x * 0.0 + y * 1.0 + 1 * ty

extra = x * 0.0 + y * 0.0 + 1 * 1
```

If you remember your algebra, we can delete any place that multiplies by zero. Multiplying by 1 effectively does nothing so let's simplify to see what's happening

```js
newX = x + tx;
newY = y + ty;
```

And extra we don't really care about. That looks surprisingly like the translation code from our translation example.
Similarly let's do rotation. Like we pointed out in the rotation post we just need the sine and cosine of the angle at which we want to rotate so.

```js
s = Math.sin(angleToRotateInRadians);
c = Math.cos(angleToRotateInRadians);
```

And we build a matrix like this

<table>
    <tbody>
        <tr><td>c</td><td>-s</td><td>0.0</td></tr>
        <tr><td>s</td><td>c</td><td>0.0</td></tr>
        <tr><td>0.0</td><td>0.0</td><td>1.0</td></tr>
    </tbody>
</table>

Applying the matrix we get this

```js
newX = x * c + y * s + 1 * 0

newY = x * -s + y * c + 1 * 0

extra = x * 0.0 + y * 0.0 + 1 * 1
```

Blacking out all multiply by 0s and 1s we get

```js
newX = x *  c + y * s;
newY = x * -s + y * c;
```

Which is exactly what we had in our rotation sample.
And lastly scale. We'll call our 2 scale factors sx and sy
And we build a matrix like this

<table>
    <tbody>
        <tr><td>sx</td><td>0.0</td><td>0.0</td></tr>
        <tr><td>0.0</td><td>sy</td><td>0.0</td></tr>
        <tr><td>0.0</td><td>0.0</td><td>1.0</td></tr>
    </tbody>
</table>

Applying the matrix we get this

```js
newX = x * sx + y * 0 + 1 * 0

newY = x * 0 + y * sy + 1 * 0

extra = x * 0.0 + y * 0.0 + 1 * 1
```

which is really

```js
newX = x * sx;
newY = y * sy;
```

Which is the same as our scaling sample.
Now I'm sure you might still be thinking. So what? What's the point. That seems like a lot of work just to do the same thing we were already doing?
This is where the magic comes in. It turns out we can multiply matrices together and apply all the transformations at once. Let's assume we have function, `matrixMultiply`, that takes two matrices, multiplies them and returns the result.
To make things clearer let's make functions to build matrices for translation, rotation and scale.

```js
function makeTranslation(tx, ty) {
  return [
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1
  ];
}

function makeRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
    c,-s, 0,
    s, c, 0,
    0, 0, 1
  ];
}

function makeScale(sx, sy) {
  return [
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  ];
}
```

Now let's change our shader. The old shader looked like this

```html
<script id="2d-vertex-shader" type="x-shader/x-vertex">
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  // Scale the positon
  vec2 scaledPosition = a_position * u_scale;

  // Rotate the position
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

  // Add in the translation.
  vec2 position = rotatedPosition + u_translation;
  ...
```

Our new shader will be much simpler.

```html
<script id="2d-vertex-shader" type="x-shader/x-vertex">
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  ...
```

And here's how we use it

```js
  // Draw the scene.
  function drawScene() {
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Compute the matrices
    var translationMatrix =
       makeTranslation(translation[0], translation[1]);
    var rotationMatrix = makeRotation(angleInRadians);
    var scaleMatrix = makeScale(scale[0], scale[1]);

    // Multiply the matrices.
    var matrix = matrixMultiply(scaleMatrix, rotationMatrix);
    matrix = matrixMultiply(matrix, translationMatrix);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 18);
  }
```

Still, you might be asking, so what? That doesn't seem like much of a benefit . But, now if we want to change the order we don't have to write a new shader. We can just change the math.

```js
    ...
    // Multiply the matrices.
    var matrix = matrixMultiply(translationMatrix, rotationMatrix);
    matrix = matrixMultiply(matrix, scaleMatrix);
    ...
```

Being able to apply matrices like this is especially important for hierarchical animation like arms on a body, moons on a planet around a sun, or branches on a tree. For a simple example of hierarchical animation lets draw draw our 'F' 5 times but each time lets start with the matrix from the previous 'F'.

```js
  // Draw the scene.
  function drawScene() {
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Compute the matrices
    var translationMatrix = makeTranslation(translation[0], translation[1]);
    var rotationMatrix = makeRotation(angleInRadians);
    var scaleMatrix = makeScale(scale[0], scale[1]);

    // Starting Matrix.
    var matrix = makeIdentity();

    for (var i = 0; i < 5; ++i) {
      // Multiply the matrices.
      matrix = matrixMultiply(matrix, scaleMatrix);
      matrix = matrixMultiply(matrix, rotationMatrix);
      matrix = matrixMultiply(matrix, translationMatrix);

      // Set the matrix.
      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 18);
    }
  }
```

To do this we had introduce the function, `makeIdentity`, that makes an identity matrix. An identity matrix is a matrix that effectively represents 1.0 so that if you multiply by the identity nothing happens. Just like 

```js
X * 1 = X
```

so too 

```js
matrixX * identity = matrixX
```

Here's the code to make an identity matrix.

```js
function makeIdentity() {
  return [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
}
```

One more example, In every sample so far our 'F' rotates around its top left corner. This is because the math we are using always rotates around the origin and the top left corner of our 'F' is at the origin, (0, 0)
But now, because we can do matrix math and we can choose the order that transforms are applied we can move the origin before the rest of the transforms are applied.

```js
    // make a matrix that will move the origin of the 'F' to
    // its center.
    var moveOriginMatrix = makeTranslation(-50, -75);
    ...

    // Multiply the matrices.
    var matrix = matrixMultiply(moveOriginMatrix, scaleMatrix);
    matrix = matrixMultiply(matrix, rotationMatrix);
    matrix = matrixMultiply(matrix, translationMatrix);
```

Using that technique you can rotate or scale from any point. Now you know how Photoshop or Flash let you move the rotation point.
Let's go even more crazy. If you go back to the first article on <a href="/tutorials/webgl/webgl_fundamentals/">WebGL fundamentals</a> you might remember we have code in the shader to convert from pixels to clipspace that looks like this.

```js
  ...
  // convert the rectangle from pixels to 0.0 to 1.0
  vec2 zeroToOne = position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
```

If you look at each of those steps in turn, the first step, "convert from pixels to 0.0 to 1.0", is really a scale operation. The second is also a scale operation. The next is a translation and the very last scales Y by -1. We can actually do that all in the matrix we pass into the shader. We could make 2 scale matrices, one to scale by 1.0/resolution, another to scale by 2.0, a 3rd to translate by -1.0,-1.0 and a 4th to scale Y by -1 then multiply them all together but instead, because the math is simple, we'll just make a function that makes a 'projection' matrix for a given resolution directly.

```js
function make2DProjection(width, height) {
  // Note: This matrix flips the Y axis so that 0 is at the top.
  return [
    2 / width, 0, 0,
    0, -2 / height, 0,
    -1, 1, 1
  ];
}
```

Now we can simplify the shader even more. Here's the entire new vertex shader.

```js
<script id="2d-vertex-shader" type="x-shader/x-vertex">
attribute vec2 a_position;

uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
</script>
```

And in JavaScript we need to multiply by the projection matrix

```js
  // Draw the scene.
  function drawScene() {
    ...
    // Compute the matrices
    var projectionMatrix =
       make2DProjection(canvas.width, canvas.height);
    ...

    // Multiply the matrices.
    var matrix = matrixMultiply(scaleMatrix, rotationMatrix);
    matrix = matrixMultiply(matrix, translationMatrix);
    matrix = matrixMultiply(matrix, projectionMatrix);
    ...
  }
```

We also removed the code that set the resolution. With this last step we've gone from a rather complicated shader with 6-7 steps to a very simple shader with only 1 step all do to the magic of matrix math.

I hope this article has helped demystify matrix math. I'll move on to 3D next. In 3D matrix math follows the same principles and usage. I started with 2D to hopefully keep it simple to understand.

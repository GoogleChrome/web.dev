---
layout: post
title: Case Study - Building Technitone.com
authors:
  - gskinnerdotcom
date: 2012-02-27
tags:
  - blog
  - case-study
---
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/n7RpXa3NM0GtkXIyec38.jpeg", alt="Technitone — a web audio experience.", width="754", height="255" %}
</figure>

[Technitone.com](http://www.technitone.com) is a fusion of WebGL, Canvas, Web Sockets, CSS3, Javascript, Flash, and the new [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html) in Chrome.

This article will touch base on every aspect of production: the plan, the server, the sounds, the visuals, and some of the workflow we leverage to design for interactive. Most sections contain code snippets, a demo, and a download. At the end of the article, there is a download link where you can grab them all as one zip file.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/bZ0A2m55hacSQzLtrcoq.png", alt="The gskinner.com production Team.", width="750", height="263" %}
</figure>

## The gig

We're by no means audio engineers at gskinner.com — but tempt us with a challenge and we'll figure out a plan:

- Users [plot tones on a grid](http://www.technitone.com/view/68k21dr24vb),"inspired" by [Andre's](http://lab.andre-michelle.com/) [ToneMatrix](http://lab.andre-michelle.com/tonematrix)
- Tones are wired to sampled instruments, drum kits, or even users' [own recordings](http://www.technitone.com/view/m923dgxnwbg)
- Multiple connected users play on the same grid simultaneously
- …or go into solo mode to explore on their own
- Invitational sessions allow users to organize a band and have an impromptu jam

We offer users an opportunity to explore the Web Audio API by means of a tools panel that applies audio filters and effects on their tones.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/RAWSPBmXjb2u6e6uJAef.png", alt="Technitone by gskinner.com", width="750", height="471" %}
</figure>

We also:

- Store users' compositions and effects as data and sync it across clients
- Provide some color options so they can draw [cool looking songs](http://www.technitone.com/view/8vec1djzfxv)
- Offer a gallery so people can listen, love, or even edit, other people's work

We stuck with the familiar grid metaphor, floated it in 3D space, added some lighting, texture and particle effects, housed it in a flexible (or fullscreen) CSS and JS-driven interface.

## Road trip

Instrument, effect, and grid data is consolidated and serialized on the client, then sent off to our custom [Node.js](http://nodejs.org/) backend to resolve for multiple users à la [Socket.io](http://socket.io/). This data is sent back to the client with each players' contributions included, before being dispersed to the relative CSS, WebGL, and WebAudio layers in charge of rendering the UI, samples, and effects during multi-user playback.

Real-time communication with sockets feeds Javascript on the client and Javascript on the server.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/HpmPCTvFFVK2vkUxbGsv.png", alt="Technitone Server Diagram", width="751", height="923" %}
</figure>

We use Node for every aspect of the server. It's a static web server and our socket server all in one. [Express](http://expressjs.com/) is what we ended up using, it's a full web server built entirely on Node. It's super scalable, highly customizable, and handles the low-level server aspects for you (just like Apache or Windows Server would). Then you, as the developer, only have to focus on building your application.

### Multi-User Demo (ok, it's really just a screenshot)

This demo requires to be run off a Node server, and since this article isn't one, we've included a screenshot of what the demo looks like after you've installed Node.js, configured your web server, and run it locally. Every time a new user visits your demo installation, a new grid will be added and everyone's work is visible to one another.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/y03Skm6l0vM3q8yZUuZF.gif", alt="Screenshot of Node.js Demo", width="750", height="426" %}
</figure>

Node is easy. Using a combo of Socket.io and custom POST requests, we didn't have to build complex routines for synchronization. Socket.io transparently handles this; [JSON](http://en.wikipedia.org/wiki/JSON) gets passed around.

How easy? Watch this.

With 3 lines of Javascript we have a web server up and running with Express.

```js
//Tell  our Javascript file we want to use express.
var express = require('express');

//Create our web-server
var server = express.createServer();

//Tell express where to look for our static files.
server.use(express.static(__dirname + '/static/'));
```

A few more to tie socket.io in for real-time communication.

```js
var io = require('socket.io').listen(server);
//Start listening for socket commands
io.sockets.on('connection', function (socket) {
	//User is connected, start listening for commands.
	socket.on('someEventFromClient', handleEvent);

});
```

Now we just start listening for incoming connections from the HTML page.

```js
<!-- Socket-io will serve it-self when requested from this url. -->
<script type="text/javascript" src="/socket.io/socket.io.js"></script>

 <!-- Create our socket and connect to the server -->
 var sock = io.connect('http://localhost:8888');
 sock.on("connect", handleConnect);

 function handleConnect() {
 	//Send a event to the server.
 	sock.emit('someEventFromClient', 'someData');
 }
 ```

## Sound check

A big unknown was the effort entailed with using the Web Audio API. Our initial findings confirmed that [Digital Signal Processing](http://en.wikipedia.org/wiki/Digital_Signal_Processing) (DSP) is very complex, and we were likely in way over our heads. Second realization: [Chris Rogers](http://chromium.googlecode.com/svn/trunk/samples/audio/index.html) has already done the heavy lifting in the API.
Technitone isn't using any really complex math or audioholicism; this functionality is easily accessible to interested developers. We really just needed to brush up on some terminology and [read the docs](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html). Our advice? Don't skim them. Read them. Start at the top and end at the bottom. They are peppered with diagrams and photos, and it's really cool stuff.

If this is the first you've heard of the Web Audio API, or don't know what it can do, hit up Chris Rogers' [demos](http://chromium.googlecode.com/svn/trunk/samples/audio/index.html). Looking for inspiration? You'll definitely find it there.

### Web Audio API Demo

Load in a sample (sound file)…

```js
/**
 * The XMLHttpRequest allows you to get the load
 * progress of your file download and has a responseType
 * of "arraybuffer" that the Web Audio API uses to
 * create its own AudioBufferNode.
 * Note: the 'true' parameter of request.open makes the
 * request asynchronous - this is required!
 */
var request = new XMLHttpRequest();
request.open("GET", "mySample.mp3", true);
request.responseType = "arraybuffer";
request.onprogress = onRequestProgress; // Progress callback.
request.onload = onRequestLoad; // Complete callback.
request.onerror = onRequestError; // Error callback.
request.onabort = onRequestError; // Abort callback.
request.send();

// Use this context to create nodes, route everything together, etc.
var context = new webkitAudioContext();

// Feed this AudioBuffer into your AudioBufferSourceNode:
var audioBuffer = null;

function onRequestProgress (event) {
	var progress = event.loaded / event.total;
}

function onRequestLoad (event) {
	// The 'true' parameter specifies if you want to mix the sample to mono.
	audioBuffer = context.createBuffer(request.response, true);
}

function onRequestError (event) {
	// An error occurred when trying to load the sound file.
}
```

…set up modular routing…

```js
/**
 * Generally you'll want to set up your routing like this:
 * AudioBufferSourceNode > [effect nodes] > CompressorNode > AudioContext.destination
 * Note: nodes are designed to be able to connect to multiple nodes.
 */

// The DynamicsCompressorNode makes the loud parts
// of the sound quieter and quiet parts louder.
var compressorNode = context.createDynamicsCompressor();
compressorNode.connect(context.destination);

// [other effect nodes]

// Create and route the AudioBufferSourceNode when you want to play the sample.
```

…apply a runtime effect (convolution using an impulse response)…

```js
/**
 * Your routing now looks like this:
 * AudioBufferSourceNode > ConvolverNode > CompressorNode > AudioContext.destination
 */

var convolverNode = context.createConvolver();
convolverNode.connect(compressorNode);
convolverNode.buffer = impulseResponseAudioBuffer;
```

…apply another runtime effect (delay)…

```js
/**
 * The delay effect needs some special routing.
 * Unlike most effects, this one takes the sound data out
 * of the flow, reinserts it after a specified time (while
 * looping it back into itself for another iteration).
 * You should add an AudioGainNode to quieten the
 * delayed sound...just so things don't get crazy :)
 *
 * Your routing now looks like this:
 * AudioBufferSourceNode -> ConvolverNode > CompressorNode > AudioContext.destination
 *                       |  ^
 *                       |  |___________________________
 *                       |  v                          |
 *                       -> DelayNode > AudioGainNode _|
 */

var delayGainNode = context.createGainNode();
delayGainNode.gain.value = 0.7; // Quieten the feedback a bit.
delayGainNode.connect(convolverNode);

var delayNode = context.createDelayNode();
delayNode.delayTime = 0.5; // Re-sound every 0.5 seconds.
delayNode.connect(delayGainNode);

delayGainNode.connect(delayNode); // make the loop
```

…and then make it audible.

```js
/**
 * Once your routing is set up properly, playing a sound
 * is easy-shmeezy. All you need to do is create an
 * AudioSourceBufferNode, route it, and tell it what time
 * (in seconds relative to the currentTime attribute of
 * the AudioContext) it needs to play the sound.
 *
 * 0 == now!
 * 1 == one second from now.
 * etc...
 */

var sourceNode = context.createBufferSource();
sourceNode.connect(convolverNode);
sourceNode.connect(delayNode);
sourceNode.buffer = audioBuffer;
sourceNode.noteOn(0); // play now!
```

Our approach to playback in Technitone is all about scheduling. Instead of setting a timer interval equal to our tempo to process sounds every beat, we set up a smaller interval that manages and schedules sounds in a queue. This allows the API to perform the up-front labour of resolving audio data and processing filters and effects before we task the CPU with actually making it audible. When that beat finally comes around, it already has all the information it needs to present the net result to the speakers.

Overall, everything needed to be optimized. When we pushed our CPUs too hard, processes were skipped (pop, click, scratch) in order to keep up with the schedule; we put serious effort into halting all the madness if you jump over to another tab in Chrome.

## Light show

Front and center is our grid and particle tunnel. This is Technitone's [WebGL](http://www.khronos.org/webgl/) layer.

WebGL offers considerably superior performance than most other approaches to rendering visuals on the web, by tasking the GPU to work in conjunction with the processor. That performance gain comes with the cost of significantly more involved development with a much steeper learning curve. That said, if you're truly passionate about interactive on the web, and want as few performance restraints as possible, WebGL offers a solution [comparable to Flash.](http://www.airtightinteractive.com/2011/10/stage3d-vs-webgl-performance/)

## WebGL Demo

WebGL content is rendered to a canvas (literally, the HTML5 Canvas) and is comprised of these core building blocks:

- object vertices (geometry)
- position matrices (3D coordinates)
    - shaders (a description of geometry appearance, linked directly to the GPU)
    - the context ("shortcuts" to the elements that the GPU makes reference to)
    - buffers (pipelines for passing context data to the GPU)
    - the main code (the business logic specific to the desired interactive)
    - the"draw" method (activates the shaders and draws pixels to the canvas)

The basic process to render WebGL content to the screen looks like:

1. Set the perspective matrix (adjusts settings for the camera that peers into the 3D space, defining the picture plane).
1. Set the position matrix (declare an origin in the 3D coordinates that positions are measured relative to).
1. Fill the buffers up with data (vertex position, color, textures…) to pass to the context through the shaders.
1. Extract and organize data from the buffers with the shaders and pass it into the GPU.
1. Call the draw method to tell the context to activate shaders, run with the data, and update the canvas.

It looks like this in action:

Set the perspective matrix…

```js
// Aspect ratio (usually based off the viewport,
// as it can differ from the canvas dimensions).
var aspectRatio = canvas.width / canvas.height;

// Set up the camera view with this matrix.
mat4.perspective(45, aspectRatio, 0.1, 1000.0, pMatrix);

// Adds the camera to the shader. [context = canvas.context]
// This will give it a point to start rendering from.
context.uniformMatrix4fv(shader.pMatrixUniform, 0, pMatrix);
```

…set the position matrix…

```js
// This resets the mvMatrix. This will create the origin in world space.
mat4.identity(mvMatrix);

// The mvMatrix will be moved 20 units away from the camera (z-axis).
mat4.translate(mvMatrix, [0,0,-20]);

// Sets the mvMatrix in the shader like we did with the camera matrix.
context.uniformMatrix4fv(shader.mvMatrixUniform, 0, mvMatrix);
```

…define some geometry and appearance…

```js
// Creates a square with a gradient going from top to bottom.
// The first 3 values are the XYZ position; the last 4 are RGBA.
this.vertices = new Float32Array(28);
this.vertices.set([-2,-2, 0, 	0.0, 0.0, 0.7, 1.0,
                   -2, 2, 0, 	0.0, 0.4, 0.9, 1.0,
                    2, 2, 0, 	0.0, 0.4, 0.9, 1.0,
                    2,-2, 0, 	0.0, 0.0, 0.7, 1.0
                  ]);

// Set the order of which the vertices are drawn. Repeating values allows you
// to draw to the same vertex again, saving buffer space and connecting shapes.
this.indices = new Uint16Array(6);
this.indices.set([0,1,2, 0,2,3]);
```

…fill the buffers up with data and pass it to the context…

```js
// Create a new storage space for the buffer and assign the data in.
context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
context.bufferData(context.ARRAY_BUFFER, this.vertices, context.STATIC_DRAW);

// Separate the buffer data into its respective attributes per vertex.
context.vertexAttribPointer(shader.vertexPositionAttribute,3,context.FLOAT,0,28,0);
context.vertexAttribPointer(shader.vertexColorAttribute,4,context.FLOAT,0,28,12);

// Create element array buffer for the index order.
context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, context.createBuffer());
context.bufferData(context.ELEMENT_ARRAY_BUFFER, this.indices, context.STATIC_DRAW);
```

…and call the draw method

```js
// Draw the triangles based off the order: [0,1,2, 0,2,3].
// Draws two triangles with two shared points (a square).
context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0);
```

Every frame, remember to clear the canvas if you don't want alpha-based visuals to stack up on one another.

## The venue

Besides the grid and particle tunnel, every other UI element was built in HTML / CSS and interactive logic in Javascript.

From the onset, we decided users should be interacting with the grid as quickly as possible. No splash screen, no instructions, no tutorials, just 'Go.' If the interface is loaded — there should be nothing slowing them down.

This required us to look carefully at how to guide a first-time user through their interactions. We included subtle cues, like having the CSS cursor property change based on the user's mouse position within the WebGL space. If the cursor is over the grid, we switch it to a hand cursor (because they can interact by plotting tones). If it's hovered in the whitespace around the grid, we swap it out for a directional cross cursor (to indicate they can rotate, or explode the grid into layers).

### Getting Ready for the Show

[LESS](http://lesscss.org/) (a CSS pre-processor), and [CodeKit](http://incident57.com/codekit/) (web development on steroids) really cut down on the time it took to translate design files into stubbed out HTML/CSS. These let us organize, write, and optimize CSS in a much more versatile fashion — leveraging variables, mix-ins (functions), and even math!

## Stage Effects

Using [CSS3 transitions](http://www.w3schools.com/css3/css3_transitions.asp) and [backbone.js](http://documentcloud.github.com/backbone/) we created some really simple effects that help bring the application to life and provide users with visual queues that indicate which instrument they are using.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/347uJ8Xov5CXd7Rvnpfs.jpeg", alt="The colors of Technitone.", width="750", height="540" %}
</figure>

Backbone.js allows us to catch color change events and apply the new color to the appropriate DOM elements. GPU accelerated CSS3 transitions handled the color style changes with little-to-no impact on performance.

Most of the color transitions on interface elements were created by transitioning background colors. On top of this background color, we place background images with strategic areas of transparency to let the background color shine through.


### HTML: The Foundation

We needed three color regions for the demo: two user selected color regions and a third mixed color region. We built the simplest DOM structure we could think of that support CSS3 transitions and the fewest HTTP requests for our illustration.

```html
<!-- Basic HTML Setup -->
<div class="illo color-mixed">
  <div class="illo color-primary"></div>
  <div class="illo color-secondary"></div>
</div>
```

### CSS: Simple Structure with Style

We used absolute positioning to place each region in its correct location and adjusted the background-position property to align the background illustration within each region. This makes all the regions (each with the same background image), look like a single element.

```css
.illo {
  background: url('../img/illo.png') no-repeat;
  top:        0;
  cursor:     pointer;
}
  .illo.color-primary, .illo.color-secondary {
    position: absolute;
    height:   100%;
  }
  .illo.color-primary {
    width:                350px;
    left:                 0;
    background-position:  top left;
  }
  .illo.color-secondary {
    width:                355px;
    right:                0;
    background-position:  top right;
  }
```

GPU accelerated transitions were applied that listen for color change events. We increased the duration and [modified the easing](http://cubic-bezier.com/#.78,0,.53,1) on .color-mixed to create the impression that it took time for the colors to mix.

```css
/* Apply Transitions To Backgrounds */
.color-primary, .color-secondary {
  -webkit-transition: background .5s linear;
  -moz-transition:    background .5s linear;
  -ms-transition:     background .5s linear;
  -o-transition:      background .5s linear;
}

.color-mixed {
  position:           relative;
  width:              750px;
  height:             600px;
  -webkit-transition: background 1.5s cubic-bezier(.78,0,.53,1);
  -moz-transition:    background 1.5s cubic-bezier(.78,0,.53,1);
  -ms-transition:     background 1.5s cubic-bezier(.78,0,.53,1);
  -o-transition:      background 1.5s cubic-bezier(.78,0,.53,1);
}
```

[Visit HTML5please for current browser support and recommended usage for CSS3 transitions.](http://html5please.us/#transition)

### Javascript: Making it Work

Assigning colors dynamically is simple. We search the DOM for any element with our color class and set the background-color based on the user's color selections. We apply our transition effect to any element in the DOM  by adding a class.
This creates an architecture that is lightweight, flexible and scalable.

```js
function createPotion() {

	var primaryColor = $('.picker.color-primary > li.selected').css('background-color');
	var secondaryColor = $('.picker.color-secondary > li.selected').css('background-color');
	console.log(primaryColor, secondaryColor);
	$('.illo.color-primary').css('background-color', primaryColor);
	$('.illo.color-secondary').css('background-color', secondaryColor);

	var mixedColor = mixColors (
			parseColor(primaryColor),
			parseColor(secondaryColor)
	);

	$('.color-mixed').css('background-color', mixedColor);
}
```

Once the primary and secondary colors are selected, we calculate their mixed color value and assign the resulting value to the appropriate DOM element.

```js
// take our rgb(x,x,x) value and return an array of numeric values
function parseColor(value) {
	return (
			(value = value.match(/(\d+),\s*(\d+),\s*(\d+)/)))
			? [value[1], value[2], value[3]]
			: [0,0,0];
}

// blend two rgb arrays into a single value
function mixColors(primary, secondary) {

	var r = Math.round( (primary[0] * .5) + (secondary[0] * .5) );
	var g = Math.round( (primary[1] * .5) + (secondary[1] * .5) );
	var b = Math.round( (primary[2] * .5) + (secondary[2] * .5) );

	return 'rgb('+r+', '+g+', '+b+')';
}
```

### Illustrating for HTML/CSS Architecture: Giving Three Color Shifting Boxes Personality

Our goal was to create a fun and realistic lighting effect that maintained its integrity when contrasting colors were placed in adjacent color regions.

A 24-bit PNG allows the background-color of our HTML elements to show through the transparent areas of the image.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oZoiOeii4Ay77GXjEi1v.png", alt="Image Transparencies", width="750", height="600" %}
</figure>

The colored boxes create hard edges where different colors meet. This gets in the way of realistic lighting effects and was one of the bigger challenges when designing the illustration.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ksuKOxSPh5gEEtw3cnpZ.png", alt="Color Regions", width="750", height="600" %}
</figure>

The solution was to design the illustration so that it never allows the edges of color regions to show through the transparent areas.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/6DzJhF0kdqf6rwn293fd.png", alt="Color Region Edges", width="750", height="400" %}
</figure>

Planning for the build was critical. A quick planning session between designer, developer, and illustrator helped the team understand how everything needed to be built so it would work together when assembled.

Check out the Photoshop file as an example of how layer naming can communicate information about CSS construction.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/DdUuR77g7274uRabQsXT.png", alt="Color Region Edges", width="749", height="276" %}
</figure>

## Encore

For users without Chrome, we set a goal to distill the essence of the application into a single static image. The grid node became the hero, the background tiles allude to the purpose of the application, and the perspective present in the reflection hints at the immersive 3D environment of the grid.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/RdCrxXGnV72xd8iBYvfH.png", alt="Color Region Edges.", width="750", height="514" %}
</figure>

If you're interested in learning more about Technitone, stay tuned in to our [blog.](http://www.gskinner.com/blog)

## The band

Thanks for reading, maybe we'll be [jamming with you](http://www.technitone.com) soon!

---
layout: post
title: Creating Roll It
authors:
  - justingitlin
date: 2013-06-04
tags:
  - blog
  - case-study
---

[Roll It](http://g.co/rollit) is a [Chrome Experiment](http://www.chromeexperiments.com/) that reimagines a classic boardwalk game using only the browser on your phone and computer. The browser on your phone lets you aim and roll the ball with a flick of your wrist, while the browser on your computer renders the real time graphics of the Roll It alley with WebGL and Canvas. The two devices communicate via Websockets. No apps. No downloads. No tokens. All you need is a modern browser.

With Google Creative Lab's direction, [Legwork](http://www.legworkstudio.com/) developed the user experience, interfaces and game environment, then teamed up with development partner, [Mode Set](http://modeset.com/), to build Roll It. Over the duration of the project there were a number of unique challenges. This article walks through some of the techniques we used, tricks we discovered and lessons we learned while bringing Roll It to fruition.

## 3D Workflow

One of the struggles in the beginning was figuring out the best way to bring 3D models from our software to a web ready file format. After creating the assets inside [Cinema 4D](http://en.wikipedia.org/wiki/Cinema_4D), the models were simplified and converted to low-polygon meshes. Each mesh was given certain polygon selection tags to differentiate between parts of the object for coloring and texturing. We were then able to export as a Collada 1.5 (.dae) file and import into [Blender](http://www.blender.org/), an open source 3D program, in order to make compatible files for three.js. Once we ensured our models were imported correctly, we exported the mesh as a JSON file and the lighting was applied using code. Here's a more detailed look at the steps we took:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/wO5joNKsGBJ5RNU4CmTF.jpg", alt="Model the object inside C4D. Make sure the mesh normals are facing outwards.", width="640", height="360" %}
<figcaption>Model the object inside C4D. Make sure the mesh normals are facing outwards. </figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/v6kTsybppIgurgbL1r7h.jpg", alt="Using the polygon selection tool, create selection tags of the specific areas you wish to texture. Apply materials to each of the selection tags.", width="640", height="360" %}
<figcaption>Using the polygon selection tool, create selection tags of the specific areas you wish to texture. Apply materials to each of the selection tags. </figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/pAoVytoYzW8lj2vdVcfk.jpg", alt="Export your mesh as a COLLADA 1.5 .dae file.", width="353", height="707" %}
<figcaption>Export your mesh as a COLLADA 1.5 .dae file.</figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/4yi5aKW20yvBwlCRgJ7E.jpg", alt="Make sure 'export 2D geometry' is checked. Exporting triangles is generally more widely supported across 3D environments on the code side, but has the downside of doubling your polygon count. The higher the polygon count, the more taxing the model will be on the computer's processor. So leave this checked off if you see slow performance.", width="449", height="409" %}
<figcaption>Make sure "export 2D geometry" is checked. Exporting triangles is generally more widely supported across 3D environments on the code side, but has the downside of doubling your polygon count. The higher the polygon count, the more taxing the model will be on the computer's processor. So leave this checked off if you see slow performance.</figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/o9tB71ulBNDa59C0gJLX.jpg", alt="Import the Collada file into Blender.", width="569", height="582" %}
<figcaption>Import the Collada file into Blender.</figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/VFGU21NTU5YF6Btb49Vw.jpg", alt="Once imported into blender, you will see that your materials and selection tags have carried over as well.", width="640", height="360" %}
<figcaption>Once imported into blender, you will see that your materials and selection tags have carried over as well.</figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/c6rev9rPcSCxYxouWP7v.jpg", alt="Select your object, and adjust the materials of the object to what you prefer.", width="424", height="682" %}
<figcaption>Select your object, and adjust the materials of the object to what you prefer.</figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/QEWiOMbjGaic1Tv6iElt.jpg", alt="Export the file as a three.js file", width="683", height="579" %}
<figcaption><a href="https://github.com/mrdoob/three.js/tree/master/utils/exporters/blender">Export the file as a three.js file for webGL compatibility.</a></figcaption>
</figure>

## Writing the code

Roll It was developed with open source libraries and runs natively in modern browsers. With technologies like WebGL and WebSockets, the web is closing in on console-quality gaming and multimedia experiences. The ease and comfort in which developers can build these experiences has been taking leaps forward as more modern tools have become available for HTML development. 

### The development environment

Most of Roll It's original code was written with [CoffeeScript](http://coffeescript.org/)&mdash;a clean and concise language that transcompiles to well-formed and [linted](http://www.javascriptlint.com/) JavaScript. CoffeeScript shines for OOP development with its great inheritance model and cleaner scope handling. The CSS was written with the [SASS](http://sass-lang.com/) framework, which gives the developer a number of great tools to enhance and manage a project's stylesheets. Adding these systems to the build process takes a little bit of time to set up, but the payoff is definitely worth it, especially for a larger project like Roll It. We set up a [Ruby on Rails](http://rubyonrails.org/) server to auto-compile our assets during development, so all of these compilation steps became transparent.

Beyond creating a streamlined and comfortable coding environment, we manually optimized assets to minimize requests in order to load the site faster. We ran every image through a couple of compression programs&mdash;[ImageOptim](http://imageoptim.com/) and [ImageAlpha](http://pngmini.com/). Each program optimizes images in their own way&mdash;lossless and lossy, respectively. With the right combination of settings, they can significantly cut down an image's file size. This not only saves bandwidth when loading external images, but once optimized, your images will translate into a much smaller base64 encoded strings for inline embedding in HTML, CSS and JavaScript. While on the subject of base64 encoding, we also embedded our [Open Sans](http://www.google.com/fonts/specimen/Open+Sans) WOFF and SVG font files directly into the CSS using this technique, which resulted in even fewer total requests.

### The physics-enabled 3D scene

[THREE.js](http://threejs.org/) is the ubiquitous 3D JavaScript library for the web. It wraps up low-level 3D math and hardware-based WebGL optimizations that enable mere mortals to easily create well-lit and beautiful interactive 3D scenes without having to write custom shaders or perform manual matrix transformations. [Physijs](https://github.com/chandlerprall/Physijs) is a THREE.js-specific wrapper for a popular C++ physics library that has been translated to JavaScript. We took advantage of this library to simulate the ball rolling, jumping, and bouncing towards its destination in 3D.

From the start, we set out to not only make the physical experience of rolling the ball feel realistic, but also to make sure that the objects in the game felt real. This required many iterations of adjusting the overall gravity of the Physijs scene, the speed of the ball as it rolls from the player's throw, the slope of the lane's jump, and the friction and restitution (bounciness) properties of the ball and lane materials. The combination of more gravity and more speed resulted in a more realistic gaming experience.

### Smoothing it out

Most modern browser and video card combinations should take advantage of native hardware-based anti-aliasing in the WebGL environment, but some won't play nice. In the case that anti-aliasing doesn't work natively, any hard and contrasted edges in the THREE.js scene will will be jagged and ugly (to our discerning eyes, at least). 

Luckily there's a fix: through a snippet of code, we can detect whether the platform will natively support antialiasing. If it does, then we're good to go. If it doesn't, there are a series of post-processing shaders that come with THREE.js that can help us. Namely, the FXAA anti-aliasing filter. By redrawing the rendered scene every frame with this shader, we're generally left with a much smoother look to our lines and edges. See the demo below:

```js
// Check for native platform antialias support via the THREE renderer
// from: http://codeflow.org/entries/2013/feb/22/how-to-write-portable-webgl/#antialiasing
var nativeAntialiasSupport = (renderer.context.getParameter(renderer.context.SAMPLES) == 0) ? false : true;
```

### Accelerometer-based game controls

Much of Roll It's magic comes from the ball-rolling gesture that the player performs with a phone. Mobile devices have had access to the accelerometer within the browser for some time now, but as an industry we're just starting to explore motion-based gesture recognition on the web. We're somewhat limited by the data that the phone's accelerometer provides, but with a little creativity we can come up with some great new experiences.

Detecting Roll It's main "roll" gesture starts with tracking the 10 most recent accelerometer updates that come from the window's [`deviceorientation`](http://www.html5rocks.com/en/tutorials/device/orientation/) event. By subtracting the previous tilt value from the current tilt value, we store the angle delta between events. Then, by constantly summing up the last ten angle deltas, we can detect continuous rotation as the phone moves through space. When the phone passes a threshold of sweeping angle change, we trigger a roll. Then, by finding the largest single tilt delta in that sweep, we can estimate a speed for the ball. In Roll It, this speed is normalized using timestamps that we attach to each accelerometer update. This helps smooth out the variable speed in which accelerometer updates stream into the browser on different devices.

### WebSockets communication

Once the player rolls the ball with their phone, a message is sent from the phone to the laptop telling it to launch the ball. This "roll" message is sent via a [JSON](http://en.wikipedia.org/wiki/JSON) data object through a [WebSocket](http://en.wikipedia.org/wiki/WebSocket) connection between the two machines. The JSON data is small, mainly consisting of a message type, throw speed, and aim direction. 

```json
{
  "type": "device:ball-thrown",
  "speed": 0.5,
  "aim": 0.1
}
```

All of the communication between the laptop and phone happens via small JSON messages like this. Every time the game updates its state on the desktop, or the user tilts or taps a button on the phone, a WebSocket message is transmitted between the machines. In order to keep this communication simple and easy to manage, the WebSockets messages are broadcast using a single exit point from either browser. Conversely, there's a single entry point on the receiving browser, with one WebSocket object handling all incoming and outgoing messages on both ends. When a WebSocket message is received, the JSON data is rebroadcast within the JavaScript app using jQuery's `trigger()` method. At this point, the incoming data behaves just like any other custom DOM event, and can be picked up and processed by any other object in the application. 

```js
var websocket = new WebSocket(serverIPAddress);

// rebroadcast incoming WebSocket messages with a global event via jQuery
websocket.onmessage = function(e) {
  if (e.data) {
    var obj = JSON.parse(e.data);
    $(document).trigger(data.type, obj);
  }
};

// broadcast outgoing WebSocket messages by passing in a native .js object
var broadcast = function(obj) {
  websocket.send(JSON.stringify(obj));
};
```

Roll It's WebSocket servers are created on-the-fly when two devices are synced with a game code. The backend for Roll It was built on the [Google Compute Engine](https://cloud.google.com/products/compute-engine) and [App Engine](https://developers.google.com/appengine/) platform using [Go](https://code.google.com/p/go/).

### Tilting menu screens

Beyond the event-driven WebSocket messages used during gameplay, the menus in Roll It are controlled by tilting the phone and tapping a button to confirm a selection. This requires a more consistent stream of tilt data transmitting from the phone to the laptop. In order to reduce bandwidth and avoid sending unnecessary updates, these messages are only sent if the device's tilt has changed by more than a couple of degrees. There's no point in sending a stream of tilt data if the phone is lying flat on a table! The rate of transmission is also throttled - no more than 15 WebSockets messages are sent per second in Roll It, even if the device is actively being tilted. 

Once the tilt values are picked up on the computer, they're interpolated over time using [`requestAnimationFrame`](http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision) to keep a smooth feel. The end result is a rotating menu and a ball that rolls to help indicate the user's selection. As the phone sends tilt data, these DOM elements are updated in real time by recalculating a CSS transform inside of the `requestAnimationFrame` loop. The menu's container simply rotates, but the ball seems to roll along the floor. To achieve this effect, we implement some basic trigonometry to relate the balls x-coordinate to its rotation. The simple equation is: rotations = x / (diameter * π)

## Wrap up

Roll It is a sign of the times. Between the open source projects that powered its development, the processing power of the devices on our desks and in our pockets, and the state of the web as a platform, it's a truly exciting and transformative time to be connected on the open web. Just a few years ago, much of this technology only existed in proprietary systems, unavailable to freely use and distribute. Today, complex experiences can be realized with less work and more imagination as we create and share new pieces of the puzzle every day. So, what are you waiting for? Build something great and share it with the world!

<figure>
<a href="http://g.co/rollit">
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/b1Dl2Hq6J2yVUQqo2wlx.png", alt="Roll it logo", width="376", height="64" %}
</a>
</figure>

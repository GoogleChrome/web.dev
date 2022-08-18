---
layout: post
title: The Hobbit Experience
subhead: Bringing Middle-Earth to Life with Mobile WebGL
date: 2013-11-20
updated: 2013-11-26
authors:
  - danielisaksson
tags:
  - blog
  - case-study
---

Historically, bringing interactive, web-based, multimedia-heavy experiences to mobiles and tablets has been a challenge. The main constraints have been performance, API availability, limitations in HTML5 audio on devices and the lack of seamless inline video playback.

Earlier this year we started a project with friends from Google and Warner Bros. to make a mobile-first web experience for the new Hobbit movie, __The Hobbit: The Desolation of Smaug__. Building a multimedia-heavy mobile Chrome Experiment has been a really inspiring and challenging task.

The experience is optimized for Chrome for Android on the new Nexus devices where we now have access to WebGL and Web Audio. However a large portion of the experience is accessible on non-WebGL devices and browsers as well thanks to hardware-accelerated compositing and CSS animations.

The whole experience is based on a map of Middle-earth and the locations and characters from the Hobbit movies. Using WebGL made it possible for us to dramatize and explore the rich world of the Hobbit trilogy and let the users control the experience.

## Challenges of WebGL on mobile devices

First, the term "mobile devices" is very broad. The specs for devices vary a lot. So as a developer you need to decide if you want to support more devices with a less complex experience or, as we did in this case, limit the supported devices to those able to display a more realistic 3D world. For “Journey through Middle-earth” we focused on Nexus devices and five popular Android smartphones. 

In the experiment, we used [three.js](http://threejs.org/) as we’ve done for some of our previous WebGL projects. We started implementation by building an initial version of the [Trollshaw game](http://middle-earth.thehobbit.com/trollshaw/experience) that would run well on the Nexus 10 tablet. After some initial testing on the device, we had a list of optimizations in mind that looked much like what we normally would use for a low-spec laptop:

- Use low-poly models
- Use low-res textures
- Reduce the number of drawcalls as much as possible by [merging geometry](http://www.google.com/url?q=http%3A%2F%2Flearningthreejs.com%2Fblog%2F2011%2F10%2F05%2Fperformance-merging-geometry%2F&amp;sa=D&amp;sntz=1&amp;usg=AFQjCNEekldEIRJOLOTgexpMUFPq6Obtvg)
- Simplify materials and lighting
- Remove post effects and turn off antialiasing
- Optimise Javascript performance
- Render the WebGL canvas at half size and scale up with CSS

After applying these optimizations to our first rough version of the game, we had a steady frame rate of 30FPS that we were happy with. At that point our goal was to improve the visuals without negatively impacting frame rate. We tried many tricks: some turned out to really have an impact on performance; a few didn’t have as big an effect as we’d hoped.

### Use low-poly models

Let’s start with the models. Using low-poly models certainly helps download time, as well as the time it takes to initialize the scene. We found that we could increase the complexity quite a lot without affecting performance much. The troll models we use in this game are about 5K faces and the scene is around 40K faces and that works fine.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/atliubYSO7t5PZmmsQWa.jpg", alt="One of the trolls of Trollshaw forest", width="800", height="732" %}
<figcaption>One of the trolls of Trollshaw forest</figcaption>
</figure>

For another (not yet released) location in the experience we saw more impact on performance from reducing polygons. In that case we loaded lower-polygon objects for mobile devices than the objects we loaded for desktop. Creating different sets of 3D models requires some extra work and isn’t always required. It really depends on how complex your models are to begin with. 

When working on big scenes with a lot of objects, we tried to be strategic on how we divide the geometry. This enabled us to switch less important meshes on and off quickly, to find a setting that worked for all mobile devices. Then, we could choose to merge the geometry in JavaScript at runtime for dynamic optimization or to merge it in pre-production to save requests.

### Use low-res textures

To reduce load time on mobile devices, we chose to load different textures that were half the size of the textures on desktop. It turns out that all devices can [handle texture sizes](http://webglstats.com/#h_texsize) up to 2048x2048px and most can handle 4096x4096px. Texture lookup on the individual textures doesn’t seem to be a problem once they are uploaded to GPU. The total size of the textures must fit in the GPU memory to avoid having textures constantly up- and downloaded, but this is probably not a big problem for most web-experiences. However, combining textures into as few spritesheets as possible is important to reduce the number of drawcalls  -  this is something that has a big impact on performance on mobile devices.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/OpVvRIIqlQUQOlJprLhV.jpg", alt="Texture for one of the trolls of Trollshaw forest", width="512", height="512" %}
<figcaption>Texture for one of the trolls of Trollshaw forest<br>
(original size 512x512px)</figcaption>
</figure>

### Simplify materials and lighting

The choice of materials can also greatly affect performance and must be managed wisely on mobile. Using ` MeshLambertMaterial`  (per vertex light calculation) in three.js instead of ` MeshPhongMaterial`  (per texel light calculation) is one thing we used to optimise performance. Basically we tried to use as simple shaders with as few lighting calculations as possible.

To see how the materials you use affect a scene’s performance, you can override the materials of the scene with a ` MeshBasicMaterial` . This will give you a good comparison.

```js
scene.overrideMaterial = new THREE.MeshBasicMaterial({color:0x333333, wireframe:true});
```

### Optimise JavaScript performance

When building games for mobile, the GPU isn’t always the biggest hurdle. A lot of time is spent on the CPU, especially physics and skeletal animations. One trick that helps sometimes, depending on the simulation, is to only run these expensive calculations every other frame. You can also use available JavaScript optimisation techniques when it comes to object pooling, [garbage collection and object creation](http://www.html5rocks.com/en/tutorials/speed/static-mem-pools/). 

Updating pre-allocated objects in loops instead of creating new objects is an important step to avoid garbage collection "hiccups" during the game.

For example, consider code like this:

```js
var currentPos = new THREE.Vector3();

function gameLoop() {
  currentPos = new THREE.Vector3(0+offsetX,100,0);
}
```

An improved version of this loop avoids creating new objects that must be garbage collected:

```js
var originPos = new THREE.Vector3(0,100,0);
var currentPos = new THREE.Vector3();
function gameLoop() {
  currentPos.copy(originPos).x += offsetX;
  //or
  currentPos.set(originPos.x+offsetX,originPos.y,originPos.z);
}
```
As much as possible, event handlers should only update properties, and let the ` requestAnimationFrame`  render-loop handle updating the stage.

Another tip is to optimise and/or pre-calculate ray-casting operations. For example, if you need to attach an object to a mesh during a static path movement, you can "record" the positions during one loop and then read from this data instead of ray-casting against the mesh. Or as we do in the [Rivendell experience](http://middle-earth.thehobbit.com/rivendell/experience), ray-cast to look for mouse interactions with a simpler low-poly invisible mesh. Searching for collisions on a high-poly mesh is very slow and should be avoided in a game-loop in general.

### Render the WebGL canvas at half size and scale up with CSS

The size of the WebGL canvas is probably the single most effective parameter you can tweak to optimise performance. The bigger the canvas you use to draw your 3D scene, the more pixels have to be drawn on every frame. This of course affects performance.The Nexus 10 with its high-density 2560x1600 pixel display has to push 4 times the number of pixels as a low-density tablet. To optimise this for mobile we use a [trick](http://blog.tojicode.com/2011/07/dirty-full-frame-webgl-performance-hack.html) where we set the canvas to half the size (50%) and then scale it up to its intended size (100%) with hardware-accelerated CSS 3D transforms. The downside of this is a pixelated image where thin lines can become a problem but on a high-res screen the effect isn’t that bad. It’s absolutely worth the extra performance.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/qrYKVjMtRVRg9vIHFxY6.jpg", alt="The same scene without canvas scaling on the Nexus 10 (16FPS) and scaled to 50% (33FPS)", width="800", height="400" %}
<figcaption>The same scene without canvas scaling on the Nexus 10 (16FPS) and scaled to 50% (33FPS).</figcaption>
</figure>

### Objects as building blocks

To be able to create the big maze of the [Dol Guldur](http://middle-earth.thehobbit.com/dolguldur/experience) castle and the never ending valley of Rivendell we made a set of building block 3D models that we re-use. Re-using objects lets us ensure that objects are instantiated and uploaded at the start of the experience, and not in the middle of it.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/uo2fKSut8TWsmFns7TlR.jpg", alt="3D object building blocks used in the maze of Dol Guldur.", width="800", height="450" %}
<figcaption>3D object building blocks used in the maze of Dol Guldur.</figcaption>
</figure>

In Rivendell we have a number of ground sections that we constantly reposition in Z-depth as the user’s journey progresses. As the user passes sections, these are repositioned in the far distance.

For the Dol Guldur castle we wanted the maze to be regenerated for every game.  To do this we created a script that regenerates the maze.

Merging the whole structure into one big mesh from the beginning results in a very big scene and poor performance. To address this, we decided to hide and show the building blocks depending on whether they are in view. Right from the start, we had an idea about using a 2D raycaster script but in the end we used the [built-in three.js frustrum culling](https://github.com/mrdoob/three.js/blob/master/src/math/Frustum.js). We reused the raycaster script to zoom in on the "danger" the player is facing.

The next big thing to handle is user interaction. On desktop you have mouse and keyboard input; on mobile devices your users interact with touch, swipe, pinch, device orientation etc.

## Using touch interaction in mobile web experiences

Adding touch support isn’t difficult. There are [great articles](http://www.html5rocks.com/en/mobile/touch/) to read about the topic. But there are some small things that can make it more complicated. 

You can have __both__ touch and mouse. The Chromebook Pixel and other touch enabled laptops have both mouse and touch support. One common mistake is to check if the device is touch enabled and then only add touch event listeners and none for mouse.

Don’t update rendering in event listeners. Save the touch events to variables instead and react to them in the requestAnimationFrame render loop. This improves performance and also coalesce conflicting events. Make sure that you re-use objects instead of creating new objects in the event listeners.

Remember that it’s multitouch: event.touches is an array of all touches. In some cases it’s more interesting to look at event.targetTouches or event.changedTouches instead and just react to the touches you are interested in. To separate taps from swipes we use a delay before we check if the touch has moved (swipe) or if it’s still (tap). To get a pinch we measure the distance between the two initial touches and how that changes over time.

In a 3D world you have to decide how your camera reacts to mouse vs. swipe actions. One common way of adding camera movement is to follow the mouse movement. This can be done with either direct control using mouse position or with a delta movement (position change). You don’t always want the same behaviour on a mobile device as a desktop browser. We tested extensively to decide what felt right for each version.

When dealing with smaller screens and touchscreens you’ll find that the user’s fingers and UI interaction graphics are often in the way of what you want to show. This is something we are used to when designing native apps but haven’t really had to think about before with web experiences. This is a real challenge for designers and UX designers.

## Summary

Our overall experience from this project is that WebGL on mobile works really well, especially on newer, high-end devices. When it comes to performance it seems like polygon count and texture size mostly affect download and initialization times and that materials, shaders and the size of the WebGL canvas are the most important parts to optimise for mobile performance. However, it’s the sum of the parts that affects the performance so everything you can do to optimise counts.

Targeting mobile devices also means that you have to get used to thinking about touch interactions and that it’s not only about the pixel size  -  it’s the physical size of the screen as well. In some cases we had to move the 3D camera closer to actually see what was going on.

The experiment is launched and it’s been a fantastic journey. Hope you enjoy it!

Want to try it out? Take your own [Journey to Middle-Earth](http://middle-earth.thehobbit.com).


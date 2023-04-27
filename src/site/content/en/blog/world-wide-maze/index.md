---
layout: post
title: Case Study - Inside World Wide Maze
authors:
  - saqoosha
date: 2013-06-06
tags:
  - blog
  - case-study
---

[World Wide Maze](http://chrome.com/maze/) is a game in which you use your smartphone to navigate a rolling ball through 3D mazes created from websites in order to try to reach their goal points.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/h1X0VHLvBGJ29bsv9mT7.jpg", alt="World Wide Maze", width="620", height="349" %}
</figure>

The game features abundant use of HTML5 features. For example, the [DeviceOrientation](http://dev.w3.org/geo/api/spec-source-orientation.html#deviceorientation) event retrieves tilt data from the smartphone, which is then sent to the PC via WebSocket, where players find their way through 3D spaces built by [WebGL](http://dev.w3.org/geo/api/spec-source-orientation.html#deviceorientation) and [Web Workers](http://www.w3.org/TR/workers/).

In this article, I'll explain precisely how these features are used, the overall development process, and key points for optimization.

## DeviceOrientation

The DeviceOrientation event ([example](http://simpl.info/deviceorientation/)) is used to retrieve tilt data from the smartphone. When `addEventListener` is used with the `DeviceOrientation` event, a callback with the `DeviceOrientationEvent` object is invoked as an argument at regular intervals. The intervals themselves vary with the device used. For example, in iOS + Chrome and iOS + Safari, the callback is invoked about every 1/20th of a second, while in Android 4 + Chrome it's invoked about every 1/10th of a second.

```js
window.addEventListener('deviceorientation', function (e) {
  // do something here..
});
```

The `DeviceOrientationEvent` object contains tilt data for each of the `X`, `Y`, and `Z` axes in degrees (not radians) ([Read more on HTML5Rocks](http://www.html5rocks.com/tutorials/device/orientation/)). However, the return values also vary with the combination of device and browser used. The ranges of the actual return values are laid out in the table below:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3jthuywYio6XSYslGnOS.png", alt="Device orientation.", width="620", height="277" %}
</figure>

The values at the top highlighted in blue are those defined in W3C specifications. Those highlighted in green match these specifications, while those highlighted in red deviate. Surprisingly, only the Android-Firefox combination returned values that matched specifications. Nonetheless, when it comes to implementation it makes more sense to accommodate values that occur frequently. World Wide Maze therefore uses the iOS return values as standard and adjusts for Android devices accordingly.

```js
if android and event.gamma > 180 then event.gamma -= 360
```

This still does not support the Nexus 10, however. Although the Nexus 10 returns the same range of values as other Android devices, there's a bug which reverses the beta and gamma values. This is being addressed separately. (Perhaps it's defaulting to landscape orientation?)

As this demonstrates, even if APIs involving physical devices have set specifications, there is no guarantee that the values returned will match those specifications. Testing them on all prospective devices is therefore crucial. It also means that unexpected values may be entered, which requires creating workarounds. World Wide Maze prompts first-time players to calibrate their devices as step 1 of its tutorial, but it won't calibrate to the zero position properly if it receives unexpected tilt values. It therefore has an internal time limit and prompts the player to switch to keyboard controls if it cannot calibrate within that time limit.

## WebSocket

In World Wide Maze, your smartphone and PC are connected via WebSocket. More accurately, they are connected via a relay server between them, i.e. smartphone to server to PC. This is because WebSocket lacks the ability to connect browsers directly to each other. (Using WebRTC data channels allows peer-to-peer connectivity and eliminates the need for a relay server, but at the time of implementation this method [could only be used with Chrome Canary and Firefox Nightly](https://hacks.mozilla.org/2013/03/webrtc-data-channels-for-great-multiplayer/).)

I chose to implement using a library called Socket.IO (v0.9.11), which includes features for reconnecting in the event of a connection timeout or disconnection. I used it together with NodeJS, as this NodeJS + Socket.IO combination showed the best server-side performance in several WebSocket implementation tests.

### Pairing by numbers

1. Your PC connects to the server.
1. The server gives your PC a randomly generated number and remembers the combination of number and PC.
1. From your mobile device, specify a number and connect to the server.
1. If the number specified is the same as from a connected PC, your mobile device is paired with that PC.
1. If there is no designated PC, an error occurs.
1. When data comes in from your mobile device, it is sent to the PC with which it is paired, and vice versa.

You can also make the initial connection from your mobile device instead. The devices are simply reversed in that case.

### Tab Sync

The Chrome-specific Tab Sync feature makes the pairing process even easier. With it, pages that are open on the PC can be opened on a mobile device easily (and vice versa). The PC takes the connection number issued by the server and appends it to a page's URL using `history.replaceState`.

```js
history.replaceState(null, null, '/maze/' + connectionNumber)
```

If Tab Sync is enabled, the URL is synced after a few seconds and the same page can be opened on the mobile device. The mobile device checks the URL of the open page, and if a number is appended it begins connecting immediately. This eliminates the need to enter numbers manually or scan QR codes with a camera.

### Latency

Since the relay server is located in the US, accessing it from Japan results in a delay of approximately 200ms before the smartphone's tilt data reaches the PC. Response times were clearly sluggish compared to those of the local environment used during development, but inserting something like a low-pass filter (I used [EMA](http://en.wikipedia.org/wiki/Exponential_Moving_Average#Exponential_moving_average)) improved this to unobtrusive levels. (In practice, a low-pass filter was needed for presentation purposes as well; return values from the tilt sensor included a considerable amount of noise, and applying those values to the screen as is resulted in a lot of shaking.) This didn't work with jumps, which were clearly sluggish, but nothing could be done to resolve this.

Since I expected latency issues from the start, I considered setting up relay servers around the world so that clients could connect to the closest available (thus minimizing latency). However, I ended up using [Google Compute Engine (GCE)](https://cloud.google.com/products/compute-engine), which existed only in the US at the time, so this wasn't possible.

### The Nagle Algorithm problem

The [Nagle algorithm](http://en.wikipedia.org/wiki/Nagle%27s_algorithm) is typically incorporated into operating systems for efficient communication by buffering at the TCP level, but I found that I couldn't send data in real time while this algorithm was enabled. (Specifically when combined with [TCP delayed acknowledgment](http://en.wikipedia.org/wiki/TCP_delayed_acknowledgment). Even with no delayed `ACK`, the same problem occurs if `ACK` is delayed to a certain degree due to factors like the server being located overseas.)

The Nagle latency issue did not occur with WebSocket in Chrome for Android, which includes the `TCP_NODELAY` option for disabling Nagle, but it did occur with the WebKit WebSocket used in Chrome for iOS, which does not have this option enabled. (Safari, which uses the same WebKit, also had this problem. [The issue was reported to Apple via Google and has apparently been resolved in the development version of WebKit](https://bugs.webkit.org/show_bug.cgi?id=102079).

When this issue occurs, tilt data sent out every 100ms is combined into chunks that only reach the PC every 500ms. The game cannot function under these conditions, so it avoids this latency by having the server side send out data at short intervals (every 50ms or so). I believe that receiving `ACK` at short intervals fools the Nagle algorithm into thinking that it's okay to send out data.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/p7E719M6tDEWDEwtTPCq.png", alt="Nagle algorithm 1", width="500", height="125" %}
</figure>

The above graphs the intervals of actual data received. It indicates the time intervals between packets; the green represents output intervals and the red represents input intervals. The minimum is 54ms, the maximum is 158ms, and the middle is close to 100ms. Here I used an iPhone with a relay server located in Japan. Both output and input are around 100ms, and operation is smooth.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/pdfzctuj4xfvKGcdt5qP.png", alt="Nagle algorithm 2", width="500", height="125" %}
</figure>

In contrast, this graph shows the results of using the server in the US. While the green output intervals hold steady at 100ms, the input intervals fluctuate between lows of 0ms and highs of 500ms, indicating that the PC is receiving data in chunks.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/t5u9aStKeVDgRVuj0lgJ.png", alt="ALT_TEXT_HERE", width="500", height="156" %}
</figure>

Finally, this graph shows the results of avoiding latency by having the server send out placeholder data. While it doesn't perform quite as well as using the Japanese server, it's clear that the input intervals remain relatively stable at around 100ms.

### A bug?

Despite the default browser in Android 4 (ICS) having a WebSocket API, it cannot connect, resulting in a Socket.IO connect_failed event. Internally it times out, and the server side cannot verify a connection either. (I haven't tested this with WebSocket alone, so it could be a Socket.IO problem.)

### Scaling relay servers

Since the relay server's role isn't that complicated, scaling up and increasing numer of servers shouldn't be difficult so long as you ensure that the same PC and the mobile device are always connected to the same server.

## Physics

In-game ball movement (rolling downhill, colliding with the ground, colliding with walls, collecting items, etc.) is all done with a 3D physics simulator. I used [Ammo.js](https://github.com/kripken/ammo.js/)—a port of the widely used [Bullet](http://bulletphysics.org/wordpress/) physics engine into JavaScript using [Emscripten](http://emscripten.org/)—along with [Physijs](http://chandlerprall.github.com/Physijs/) to utilize it as a "Web Worker."

### Web Workers

Web Workers is an API for running JavaScript in separate threads. JavaScript launched as a Web Worker runs as a thread separate from the one that originally called it, so heavy tasks can be performed while keeping the page responsive. Physijs uses Web Workers efficiently to help the normally intensive 3D physics engine run smoothly. World Wide Maze handles the physics engine and WebGL image rendering at completely different frame rates, so even if frame rate drops on a low-spec machine due to heavy WebGL rendering load, the physics engine itself will more or less maintain 60 fps and not impede game controls.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/yBl90vAq6oSpQt5E119l.png", alt="FPS", width="235", height="202" %}
</figure>

This image shows the resulting frame rates on a [Lenovo G570](http://shop.lenovo.com/us/notebooks/essential/g-series/g570). The upper box shows the frame rate for WebGL (image rendering), and the lower one shows the frame rate for the physics engine. The GPU is an integrated Intel HD Graphics 3000 chip, so the image rendering frame rate didn't attain the expected 60 fps. However, since the physics engine achieved the expected frame rate, the gameplay isn't that different from performance on a high-spec machine.

Since threads with active Web Workers don't have console objects, data must be sent to the main thread via postMessage to produce debugging logs. Using [console4Worker](http://blog.jetienne.com/blog/2011/09/12/console4worker/) creates the equivalent of a console object in the Worker, making the debugging process significantly easier.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/hvlpSHVHZcbDFW2maF6O.png", alt="Service workers", width="373", height="142" %}
</figure>

Recent versions of Chrome allow you to set breakpoints when launching Web Workers, which is also useful for debugging. This can be found in the "Workers" panel in Developer Tools.

### Performance

Stages with high polygon counts sometimes exceed 100,000 polygons, but performance didn't particularly suffer even when they were generated entirely as `Physijs.ConcaveMesh` (`btBvhTriangleMeshShape` in Bullet).

Initially, frame rate dropped as the number of objects requiring collision detection increased, but eliminating unnecessary processing in Physijs improved performance. This improvement was made to a [fork](https://github.com/Saqoosha/Physijs) of the original Physijs.

### Ghost objects

Objects that have collision detection but no impact upon collision and thus no effect on other objects are called "ghost objects" in Bullet. Although Physijs does not officially support ghost objects, it's possible to create them there by tinkering with flags after generating a `Physijs.Mesh`. World Wide Maze uses ghost objects for the collision detection of items and goal points.

```js
hit = new Physijs.SphereMesh(geometry, material, 0)
hit._physijs.collision_flags = 1 | 4
scene.add(hit)
```

For `collision_flags`, 1 is `CF_STATIC_OBJECT`, and 4 is `CF_NO_CONTACT_RESPONSE`. Try searching the Bullet [forum](http://www.bulletphysics.org/Bullet/phpBB3/), [Stack Overflow](http://stackoverflow.com/), or [Bullet documentation](http://bulletphysics.org/Bullet/BulletFull/) for more information. Since Physijs is a wrapper for Ammo.js and Ammo.js is basically identical to Bullet, most things that can be done in Bullet can also be done in Physijs.

### The Firefox 18 problem

The Firefox update from version 17 to 18 changed the way Web Workers exchanged data, and Physijs stopped working as a result. The [issue](https://github.com/chandlerprall/Physijs/issues/62) was reported on GitHub and resolved after a few days. While this open source efficiency impressed me, the incident also reminded me how World Wide Maze is comprised of several different open source frameworks. I'm writing this article in hopes of providing some sort of feedback.

### asm.js

Although this doesn't concern World Wide Maze directly, Ammo.js already supports Mozilla's recently announced [asm.js](http://asmjs.org/) (not surprising since asm.js was basically created to speed up JavaScript generated by Emscripten, and the creator of Emscripten is also the creator of Ammo.js). If Chrome supports asm.js as well, the physics engine's computing load should diminish considerably. Speed was noticeably faster when tested with Firefox Nightly. Perhaps it would be best to write sections that require more speed in C/C++ and then port them to JavaScript using Emscripten?

## WebGL

For WebGL implementation I used the most actively developed library, [three.js](http://mrdoob.github.com/three.js/) (r53). Although revision 57 was already released by the latter stages of development, major changes had been made to the API, so I stuck with the original revision for release.

### Glow effect

The glow effect added to the ball's core and to items is implemented using a simple version of the so-called "[Kawase Method MGF](https://www.google.co.jp/search?q=%E5%B7%9D%E7%80%AC%E5%BC%8F)". However, while the Kawase Method makes all bright areas bloom, World Wide Maze creates separate render targets for areas that need to glow. This is because a website screenshot must be used for stage textures, and simply extracting all bright areas would result in the entire website glowing if, for instance, it has a white background. I also considered processing everything in HDR, but I decided against it this time since implementation would have gotten quite complicated.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/o7kG87kPyTEAb3PP18Zu.jpg", alt="Glow", width="620", height="349" %}
</figure>

The top left shows the first pass, where the glow areas were rendered separately and then a blur applied. The bottom right shows the second pass, where the image size was reduced by 50% and then a blur applied. The top right shows the third pass, where the image was again reduced by 50% and then blurred. The three were then overlaid to create the final composite image shown at the bottom left. For the blur I used `VerticalBlurShader` and `HorizontalBlurShader`, included in three.js, so there's still room for further optimization.

### Reflective ball

The reflection on the ball is based on a [sample](http://mrdoob.github.com/three.js/examples/webgl_materials_cubemap_dynamic2.html) from three.js. All directions are rendered from the ball's position and used as environment maps. Environment maps need to be updated every time the ball moves, but since updating at 60 fps is intensive, they're updated every three frames instead. The result isn't quite as smooth as updating every frame, but the difference is virtually imperceptible unless pointed out.

### Shader, shader, shader…

WebGL requires shaders (vertex shaders, fragment shaders) for all rendering. While the shaders included in three.js already allow for a wide range of effects, writing your own is unavoidable for more elaborate shading and optimization. Since World Wide Maze keeps the CPU busy with its physics engine, I tried to utilize the GPU instead by writing as much as possible in shading language (GLSL), even when CPU processing (via JavaScript) would have been easier. The ocean wave effects rely on shaders, naturally, as do the fireworks at goal points and the mesh effect used when the ball appears.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/CMZY9KfGSudN7l6H1Ool.png", alt="Shader balls", width="620", height="199" %}
</figure>

The above is from tests of the mesh effect used when the ball appears. The one on the left is the one used in-game, composed of 320 polygons. The one in the center uses about 5,000 polygons, and the one on the right uses about 300,000 polygons. Even with this many polygons, processing with shaders can keep a steady frame rate of 30 fps.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Ap8yISIVD8O3bxDQN3Bv.png", alt="Shader mesh", width="620", height="378" %}
</figure>

The small items scattered throughout the stage are all integrated into one mesh, and individual movement relies on shaders moving each of the polygon tips. This is from a test to see whether performance would suffer with large numbers of objects present. About 5,000 objects are laid out here, composed of roughly 20,000 polygons. Performance didn't suffer at all.

### poly2tri

Stages are formed based on outline information received from the server and then polygonized by JavaScript. Triangulation, a key part of this process, is implemented poorly by three.js and usually fails. I therefore decided to integrate a different triangulation library called [poly2tri](https://code.google.com/p/poly2tri/) myself. As it turns out, three.js had evidently attempted the same thing in the past, so I got it working simply by commenting part of it out. Errors decreased significantly as a result, allowing many more playable stages. The occasional error persists, and for some reason poly2tri handles errors by issuing alerts, so I modified it to throw exceptions instead.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/iqUZuwpies8sUS2HGk3u.jpg", alt="poly2tri", width="620", height="246" %}
</figure>

The above shows how the blue outline is triangulated and red polygons generated.

### Anisotropic filtering

Since standard isotropic MIP mapping downsizes images on both horizontal and vertical axes, viewing polygons from oblique angles makes textures on the far end of World Wide Maze stages look like horizontally elongated, low-resolution textures. The top right image on [this Wikipedia page](http://en.wikipedia.org/wiki/Anisotropic_filtering) shows a good example of this. In practice, more horizontal resolution is required, which WebGL (OpenGL) resolves by using a method called anisotropic filtering. In three.js, setting a value greater than 1 for `THREE.Texture.anisotropy` enables anisotropic filtering. However, this feature is an extension and may not be supported by all GPUs.

### Optimize

As this [WebGL best practices](https://developer.mozilla.org/docs/WebGL/WebGL_best_practices) article also mentions, the most crucial way to improve WebGL (OpenGL) performance is to minimize draw calls. During initial development of World Wide Maze, all in-game islands, bridges, and guard rails were separate objects. This sometimes resulted in over 2,000 draw calls, making complex stages unwieldy. However, once I packed the same types of objects all into one mesh, draw calls dropped to fifty or so, improving performance significantly.

I used the Chrome tracing feature for further optimization. Profilers included in Chrome's Developer Tools can determine overall method processing times to some degree, but tracing can tell you precisely how long each part takes, down to 1/1000th of a second. Have a look at [this article](http://www.html5rocks.com/tutorials/games/abouttracing/) for details on how to use tracing.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/aE8XKpELRoSijYCsN3tB.png", alt="Optimization", width="620", height="232" %}
</figure>

The above are trace results from creating environment maps for the ball's reflection. Inserting `console.time` and `console.timeEnd` into seemingly relevant locations in three.js gives us a graph that looks like this. Time flows from left to right, and each layer is something like a call stack. Nesting a console.time within a `console.time` allows further measurements. The top graph is pre-optimization and the bottom is post-optimization. As the top graph shows, the `updateMatrix` (though the word is truncated) was called for each of renders 0-5 during pre-optimization. I modified it so that it's called only once, however, as this process is required only when objects change position or orientation.

The tracing process itself takes up resources, naturally, so inserting `console.time` excessively can cause a significant deviation from actual performance, making it difficult to pinpoint areas for optimization.

### Performance adjuster

Due to the nature of the Internet, the game will likely be played on systems with widely varying specs. [Find Your Way to Oz](http://www.findyourwaytooz.com/), released in early February, uses a class called [`IFLAutomaticPerformanceAdjust`](https://code.google.com/p/oz-experiment/source/browse/project/develop/coffee/ifl/IFLAutomaticPerformanceAdjust.coffee) to scale back effects according to fluctuations in frame rate, helping to ensure smooth playback. World Wide Maze builds on the same `IFLAutomaticPerformanceAdjust` class and scales back effects in the following order to make gameplay as smooth as possible:

1. If frame rate falls below 45 fps, environment maps stop updating.
1. If it still falls below 40 fps, rendering resolution is reduced to 70% (50% of surface ratio).
1. If it still falls below 40 fps, FXAA (anti-aliasing) is eliminated.
1. If it still falls below 30 fps, glow effects are eliminated.

### Memory leak

Eliminating objects neatly is sort of a hassle with three.js. But leaving them alone would obviously lead to memory leaks, so I devised the method below. `@renderer` refers to `THREE.WebGLRenderer`. (The latest revision of three.js uses a slightly different method of deallocation, so this probably won't work with it as is.)

```js
destructObjects: (object) =>
  switch true
    when object instanceof THREE.Object3D
      @destructObjects(child) for child in object.children
      object.parent?.remove(object)
      object.deallocate()
      object.geometry?.deallocate()
      @renderer.deallocateObject(object)
      object.destruct?(this)

    when object instanceof THREE.Material
      object.deallocate()
      @renderer.deallocateMaterial(object)

    when object instanceof THREE.Texture
      object.deallocate()
      @renderer.deallocateTexture(object)

    when object instanceof THREE.EffectComposer
      @destructObjects(object.copyPass.material)
      object.passes.forEach (pass) =>
        @destructObjects(pass.material) if pass.material
        @renderer.deallocateRenderTarget(pass.renderTarget) if pass.renderTarget
        @renderer.deallocateRenderTarget(pass.renderTarget1) if pass.renderTarget1
        @renderer.deallocateRenderTarget(pass.renderTarget2) if pass.renderTarget2
```

## HTML

Personally, I think the best thing about the WebGL app is the ability to design page layout in HTML. Building 2D interfaces such as score or text displays in Flash or openFrameworks (OpenGL) is kind of a pain. Flash at least has an IDE, but openFrameworks is tough if you aren't used to it (using something like Cocos2D may make it easier). HTML, on the other hand, allows precise control of all frontend design aspects with CSS, just as when building websites. Although complex effects like particles condensing into a logo are impossible, some 3D effects within the capabilities of CSS Transforms are possible. World Wide Maze's "GOAL" and "TIME IS UP" text effects are animated using scale in CSS Transition (implemented with [Transit](http://ricostacruz.com/jquery.transit/)). (Obviously the background gradations use WebGL.)

Each page in the game (the title, RESULT, RANKING, etc.) has its own HTML file, and once these are loaded as templates, `$(document.body).append()` is called with the appropriate values at the appropriate time. One hiccup was that mouse and keyboard events could not be set before appending, so attempting `el.click (e) -> console.log(e)` before appending didn't work.

### Internationalization (i18n)

Working in HTML was also convenient for creating the English language version. I chose to use [i18next](http://jamuhl.github.com/i18next/), a web i18n library, for my internationalization needs, which I was able to use as is without modification.

Editing and translation of in-game text was done in Google Docs Spreadsheet. Since i18next requires [JSON file](http://chrome.com/maze/locales/en/translation.json)s, I exported the spreadsheets to TSV and then converted them with a custom converter. I made a lot of updates just before release, so automating the export process from Google Docs Spreadsheet would have made things much easier.

Chrome's [automatic translation feature](http://support.google.com/chrome/bin/answer.py?hl=en&amp;answer=173424) also functions normally since the pages are built with HTML. However, it sometimes fails to detect language correctly, instead mistaking it for a totally different one (e.g., Vietnamese), so this feature is currently disabled. ([It can be disabled using meta tags](http://googlewebmastercentral.blogspot.jp/2008/10/helping-you-break-language-barrier.html).)

## RequireJS

I chose [RequireJS](http://requirejs.org/) as my JavaScript module system. The game's 10,000 lines of source code are divided into about 60 classes (= coffee files) and compiled into individual js files. RequireJS loads these individual files in appropriate order based on dependency.

```js
define ->
  class Hoge
    hogeMethod: ->
```

The class defined above (hoge.coffee) can be used as follows:

```js
define ['hoge'], (Hoge) ->
  class Moge
    constructor: ->
      @hoge = new Hoge()
      @hoge.hogeMethod()
```

To work, hoge.js must be loaded before moge.js, and since "hoge" is designated as the first argument of "define," hoge.js is always loaded first (called back once hoge.js is done loading). This mechanism is called [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD), and any third-party library can be used for the same kind of callback so long as it supports AMD. Even those that do not (e.g., three.js) will perform similarly as long as d[ependencies are specified in advance](http://requirejs.org/docs/api.html#config-shim).

This is similar to importing AS3, so it shouldn't seem that strange. If you end up with more dependent files, [this](http://requirejs.org/docs/whyamd.html#sugar) is a possible solution.

### r.js

RequireJS includes an optimizer called [r.js](http://requirejs.org/docs/optimization.html). This bundles the main js with all dependent js files into one, then minifies it using UglifyJS (or Closure Compiler). This reduces the number of files and total amount of data that the browser needs to load. The total JavaScript file size for World Wide Maze is around 2 MB and can be reduced to about 1 MB with r.js optimization. If the game could be distributed using gzip, this would be further reduced to 250 KB. (GAE has an issue that won't allow transmission of gzip files 1 MB or larger, so the game is currently distributed uncompressed as 1 MB of plain text.)

## Stage builder

Stage data is generated as follows, performed entirely on the GCE server in the US:

1. The URL of the website to be converted into a stage is sent via WebSocket.
1. PhantomJS takes a screenshot, and div and img tag positions are retrieved and output in JSON format.
1. Based on the screenshot from step 2 and positioning data of HTML elements, a custom C++ (OpenCV, Boost) program deletes unnecessary areas, generates islands, connects the islands with bridges, calculates guard rail and item positions, sets the goal point, etc. The results are output in JSON format and returned to the browser.

### PhantomJS

PhantomJS is a browser that requires no screen. It can load web pages without opening windows, so it can be used in automated tests or to capture screenshots on the server side. Its browser engine is WebKit, the same one used by Chrome and Safari, so its layout and JavaScript execution results are also more or less the same as those of standard browsers.

With PhantomJS, JavaScript or CoffeeScript is used to write the processes you want executed. Capturing screenshots is very easy, as shown in [this sample](https://github.com/ariya/phantomjs/blob/master/examples/rasterize.coffee). I was working on a Linux server (CentOS), so I needed to install fonts to display Japanese ([M+ FONTS](http://mplus-fonts.sourceforge.jp/)). Even then, font rendering is handled differently than in Windows or Mac OS, so the same font can look different on other machines (the difference is minimal, though).

Retrieving img and div tag positions is basically handled the same way as on standard pages. jQuery can also be used without any problems.

### stage_builder

I initially considered using a more DOM-based approach to generate stages (similar to the [Firefox 3D Inspector](https://www.google.com/search?q=firefox+3d+inspector&amp;tbm=isch&amp;hl=en)) and attempted something like a DOM analysis in PhantomJS. In the end, though, I settled on an image processing approach. To this end I wrote a C++ program that uses OpenCV and Boost called "stage_builder." It performs the following:

1. Loads the screenshot and JSON file(s).
1. Converts images and text into "islands."
1. Creates bridges to connect the islands.
1. Eliminates unnecessary bridges to create a maze.
1. Places large items.
1. Places small items.
1. Places guard rails.
1. Outputs positioning data in JSON format.

Each step is detailed below.

### Loading the screenshot and JSON file(s)

The usual `cv::imread` is used to load screenshots. I tested several libraries for the JSON files, but [picojson](https://github.com/kazuho/picojson) seemed the easiest to work with.

### Converting images and text into "islands"

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/mOx1vcwAl5S0LQFAArh4.jpg", alt="Stage build", width="620", height="242" %}
</figure>

The above is a screenshot of the News section of [aid-dcc.com](http://www.aid-dcc.com/) (click to view actual size). The images and text elements must be converted into islands. In order to isolate these sections, we should delete the white background color—in other words the most prevalent color in the screenshot. Here's what it looks like once this is done:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ATEAYBim1HObyI4nCJHy.jpg", alt="Stage build", width="620", height="242" %}
</figure>

The white sections are the potential islands.

The text is too fine and sharp, so we'll thicken it with `cv::dilate`, `cv::GaussianBlur`, and `cv::threshold`. Image content is also missing, so we'll fill those areas with white, based on the img tag data output from PhantomJS. The resulting image looks like this:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/zSwqqM5ydoBgCxEKC63p.jpg", alt="Stage build", width="620", height="242" %}
</figure>

The text now forms suitable clumps, and each image is a proper island.

### Creating bridges to connect the islands

Once the islands are ready, they are connected with bridges. Each island looks for adjacent islands left, right, above, and below, then connects a bridge to the closest point of the closest island, resulting in something like this:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/558tMaIBBUHgzvlq4N7y.jpg", alt="Stage build", width="620", height="242" %}
</figure>

### Eliminating unnecessary bridges to create a maze

Keeping all the bridges would make the stage too easy to navigate, so some must be eliminated to create a maze. One island (e.g., the one at the top left) is chosen as a starting point, and all but one bridge (selected at random) connecting to that island are deleted. Then the same thing is done for the next island connected by the remaining bridge. Once the path reaches a dead end or leads back to a previously visited island, it backtracks to a point that allows access to a new island. The maze is completed once all islands are processed in this way.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/yXMArBXt4MuSG9BzXyvL.jpg", alt="Stage build", width="620", height="242" %}
</figure>

### Placing large items

One or more large items are placed on each island depending on its dimensions, choosing from points furthest from the islands' edges. Although not very clear, these points are shown in red below:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/BwmXDvmisAmeHqC66ask.jpg", alt="Stage build", width="545", height="166" %}
</figure>

From all of these possible points, the one at top left is set as the starting point (red circle), the one at bottom right is set as the goal (green circle), and a maximum of six of the rest are chosen for large item placement (purple circle).

### Placing small items

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/8sDe2oCkoXcmsthh05yc.jpg", alt="Stage build", width="620", height="253" %}
</figure>

Suitable numbers of small items are placed along lines at set distances from the island edges. The image above (not from aid-dcc.com) shows the projected placement lines in gray, offset and placed at regular intervals from the edges of the island. The red dots indicate where the small items are placed. Since this image is from a mid-development version, the items are laid out in straight lines, but the final version scatters the items a little more irregularly to either side of the gray lines.

### Placing guard rails

The guard rails are basically placed along the outer boundaries of the islands but must be cut off at bridges to allow access. The Boost [Geometry library](http://www.boost.org/doc/libs/1_53_0/libs/geometry/doc/html/index.html) proved useful for this, simplifying geometric calculations such as determining where island boundary data intersects with the lines on either side of a bridge.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/dOT6oazeJkNv89wyXDAA.jpg", alt="Stage build", width="620", height="242" %}
</figure>

The green lines outlining the islands are the guard rails. It may be difficult to see in this image, but there are no green lines where the bridges are. This is the final image used for debugging, where all objects that need to be output into JSON are included. The light blue dots are small items, and the gray dots are proposed restarting points. When the ball falls into the ocean, the game is resumed from the nearest restarting point. Restarting points are arranged more or less the same way small items are, at regular intervals at a set distance from the edge of the island.

### Outputting positioning data in JSON format

I used picojson for output as well. It writes the data to standard output, which is then received by the caller (Node.js).

### Creating a C++ program on a Mac to be run in Linux

The game was developed on a Mac and deployed in Linux, but since OpenCV and Boost existed for both operating systems, development itself was not difficult once the compile environment was established. I used Command Line Tools in Xcode to debug the build on the Mac, then created a configure file using automake/autoconf so that the build could be compiled in Linux. Then I simply had to use "configure && make" in Linux to create the executable file. I encountered some Linux-specific bugs due to compiler version differences but was able to resolve them relatively easily using gdb.

## Conclusion

A game like this could be created with Flash or Unity, which would bring numerous advantages. However, this version requires no plugins, and the layout features of HTML5 + CSS3 proved to be extremely powerful. It's definitely important to have the right tools for each task. I was personally surprised at how well the game turned out for one made entirely in HTML5, and although it's still lacking in many areas, I look forward to seeing how it develops in the future.

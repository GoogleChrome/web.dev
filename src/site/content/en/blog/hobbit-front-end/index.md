---
layout: post
title: The Front-end of Middle-earth
subhead: A walkthrough of multi-device development
date: 2013-12-11
updated: 2013-12-12
authors:
  - einaroberg
  - danielisaksson
tags:
  - blog
  - case-study
---

In [our first article](http://www.html5rocks.com/en/tutorials/casestudies/hobbit/) about the development of the Chrome Experiment [A Journey Through Middle-earth](http://middle-earth.thehobbit.com/) we focused on WebGL development for mobile devices. In this article we discuss the challenges, problems and solutions we encountered when creating the rest of the HTML5 front-end.

## Three versions of the same site

Let’s start by talking a bit about adapting this experiment to work on both desktop computers and mobile devices from a screen-size and device-capabilities perspective.

The whole project is based on a very “cinematic” style, where we design-wise wanted to keep the experience within a landscape-oriented fixed frame to keep the magic from the movie. Since a large chunk of the project consists of interactive mini “games” it wouldn’t make sense to let them overflow the frame either.

We can take the landing page as an example of how we adapt the design for different sizes.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/AxrZEfU6BKgkNRmkTznh.png", alt="The eagles just dropped us at the landing page.", width="800", height="424" %}
<figcaption>The eagles just dropped us at the landing page.</figcaption>
</figure>

The site has three different modes: desktop, tablet and mobile. Not just to handle layout, but because we need to handle runtime-loaded assets and add various performance optimizations. With devices that have a higher resolution than desktop computers and laptops but have worse performance than phones, it's not an easy task to define the ultimate set of rules.

We’re using user-agent data to detect mobile devices and a viewport-size test to target tablets among those (645px and higher). Each different mode can in fact render all resolutions, because the layout is based on media queries or relative/percentage positioning with JavaScript.

Since the designs in this case aren’t based on grids or rules and are quite unique between the different sections it really depends on the specific element and scenario as to what breakpoints or styles to use. It happened more than once that we had set up the perfect layout with nice sass-mixins and media-queries, and then we needed to add an effect based on the mouse position or dynamic objects, and ended up rewriting everything in JavaScript.

We also add a class with the current mode in the head tag so we can use that info in our styles, like in this example (in SCSS):

```css
.loc-hobbit-logo {

  // Default values here.

  .desktop & {
     // Applies only in desktop mode.
  }

 .tablet &, .mobile & {
   
   // Different asset for mobile and tablets perhaps.

   @media screen and (max-height: 760px), (max-width: 760px) {
     // Breakpoint-specific styles.
   }

   @media screen and (max-height: 570px), (max-width: 400px) {
     // Breakpoint-specific styles.
   }
 }
}
```

We support all sizes down to about 360x320, which has been pretty challenging when making a immersive web experience. On desktop we have a minimum size before we show scrollbars because we want you to experience the site in a larger viewport if possible. On mobile devices we decided to allow both landscape and portrait mode all the way up to the interactive experiences, where we ask you to turn the device to landscape. The argument against this was that it’s not as immersive in portrait as in landscape; but the site scaled pretty well so we kept it.

{% Aside %}
**DeviceOrientation events** The content layout is controlled by breakpoints and CSS but we also need to handle the event in JavaScript to pause game-loop and keep the correct state. It turns out you can’t rely on the value in window.orientation because it’s not standard and varies across devices. Instead, listen to the event, but look for `window.innerWidth` and `window.innerHeight` to determine the orientation.
{% endAside %}

It’s important to note that layout shouldn’t be mixed up with feature detection like input type, device orientation, sensors etc. Those features can exist in all of these modes and should span across all. Supporting mouse and touch at the same time is one example. Retina compensation for quality but most of all performance is another, sometimes lesser quality is better. As an example the canvas is half the resolution in the WebGL experiences on retina displays, which would otherwise have to render four times the number of pixels

{% Aside %}
You can easily try out all sizes right in your browser by [emulating](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation) a device in Chrome DevTools. When switching between mobile, tablet and desktop versions you have to reload the site to use the correct dependencies and settings.
{% endAside %}

We frequently used the emulator tool in DevTools during development, especially in Chrome Canary which has new improved features and lots of presets. It is a good way of quickly validating design. We still needed to test on real devices regularly. One reason was because the site is adapting to fullscreen. Pages with vertical scroll hide the browser UI when scrolling in most cases (Safari on iOS7 has problems with this currently) but we had to fit everything independent of the that. We also used a preset in the emulator and changed the screen size setting to simulate the loss of available space. Testing on real devices is also important for monitoring memory-consumption and performance

## Handling the state

After the [landing page](http://middle-earth.thehobbit.com/) we land at the map of Middle-earth. Did you notice the URL changing? The site is a single page application that uses the [History API](http://diveintohtml5.info/history.html) to handle [routing](http://visionmedia.github.io/page.js/).

Each section of the site is its own object inheriting a boilerplate of functionality such as DOM-elements, transitions, loading of assets, disposing etc. When you explore different parts of the site, sections are initiated, elements are added to and removed from the DOM and assets for the current section are loaded.

Since the user can hit the browser’s back button or navigate via the menu at any time, everything that is created needs to be disposed of at some point. Timeouts and animations need to be stopped and discarded or they will cause unwanted behaviour, errors, and memory leaks. This is not always an easy task, especially when deadlines are approaching and you need to get everything in there as fast as possible.

{% Aside %}
Keep calm and add those event listeners. Make a practice of adding a dispose function to every object. Watch out for leaving timers and tweens behind. If tweening, use the equivalent of `TweenMax.killTweensOf(foo)` or save references and stop them from triggering callbacks. Remove runtime added DOM elements. Use profiling tools regulary to keep an eye on the memory consumption and leaks.
{% endAside %}

## Showing off the locations

To show off the beautiful settings and the characters of Middle-earth we built a modular system of image and text components that you can drag or swipe horizontally. We haven’t enabled a scrollbar here since we want to have different speeds on different ranges, like in image sequences where you stop the motion sideways until the clip has played out.

{% Aside %}
A scrollbar sets expectations about the behavior of your site. It can be a bad user experience when a website hijacks this control.
{% endAside %}

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ebf9JxwetAeDmWbqofcW.jpg", alt="Thranduil's Hall", width="800", height="71" %}
<figcaption><a href="http://middle-earth.thehobbit.com/thranduils-hall">Thranduil's Hall</a> timeline</figcaption>
</figure>

### The timeline

When development started we didn’t know the content of the modules for each location. What we knew was that we wanted a templated way of showing different types of media and information in a horizontal timeline that would give us the freedom to have six different location presentations without having to rebuild everything six times. To manage this we created a timeline controller that handle the panning of its modules based on settings and the modules’ behaviours. 

### Modules and behaviour components

The different modules we added support for are image-sequence, still image, parallax scene, focus-shift scene and text. 

The parallax scene module has an opaque background with a custom number of layers that listens to the viewport progress for exact positions. 

The focus-shift scene is a variant of the parallax bucket, with the addition that we use two images for each layer which fades in and out to simulate a focus change. We tried to use the blur filter, but it’s still to expensive, so we’ll wait for CSS shaders for this.

The content in the text module is drag-enabled with the TweenMax plugin [Draggable](http://www.greensock.com/draggable/). You can also use the scrollwheel or two-finger swipe to scroll vertically. Note the [throw-props-plugin](http://www.greensock.com/throwprops/) that adds the fling-style physics when you swipe and release.

The modules can also have different behaviours that are added as a set of components. They all have their own target selectors and settings. Translate to move an element, scale to zoom, hotspots for info overlay, debug metrics for testing visually, a start-title overlay, a flare layer, and some more. These will be appended to the DOM or controlling their target element inside the module.

With this in place we can create the different locations with just a [config file](https://gist.github.com/inear/7626665) that defines what 
assets to load and setup the different kinds of modules and components.

### Image sequences

The most challenging of the modules from a performance and a download-size aspect is the image sequence. There’s a bunch to read about this [topic](http://awardwinningfjords.com/2012/03/08/image-sequences.html). On mobile and tablets we replace this with a still image. It’s too much data to decode and store in memory if we want decent quality on mobile. We tried multiple alternative solutions; using a background image and a spritesheet first, but it led to memory problems and lag when the GPU needed to swap between spritesheets. Then we tried swapping img elements, but it was also too slow. Drawing a frame from a spritesheet to a canvas was the most performant, so we began optimizing that. To save computation time each frame, the image data to write into the canvas is pre-processed via a temporary canvas and saved with putImageData() to an array, decoded and ready to use. The original spritesheet can then be garbage collected, and we store only the minimum amount of data needed in memory. Maybe it’s actually less to store undecoded images, but we get better performance while scrubbing the sequence this way. The frames are pretty small, just 640x400, but those will just be visible during scrubbing. When you stop, a high-res image loads and quickly fades in.

```js
var canvas = document.createElement('canvas');
canvas.width = imageWidth;
canvas.height = imageHeight;

var ctx = canvas.getContext('2d');
ctx.drawImage(sheet, 0, 0);

var tilesX = imageWidth / tileWidth;
var tilesY = imageHeight / tileHeight;

var canvasPaste = canvas.cloneNode(false);
canvasPaste.width = tileWidth;
canvasPaste.height = tileHeight;

var i, j, canvasPasteTemp, imgData, 
var currentIndex = 0;
var startIndex = index * 16;
for (i = 0; i < tilesY; i++) {
  for (j = 0; j < tilesX; j++) {
    // Store the image data of each tile in the array.
    canvasPasteTemp = canvasPaste.cloneNode(false);
    imgData = ctx.getImageData(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
    canvasPasteTemp.getContext('2d').putImageData(imgData, 0, 0);

    list[ startIndex + currentIndex ] = imgData;

    currentIndex++;
  }
}
```

The sprite-sheets are generated with [Imagemagick](http://www.imagemagick.org/script/index.php). Here is a simple [example on GitHub](https://gist.github.com/inear/7616849) that shows how to create a spritesheet of all images inside a folder.

### Animating the modules

To place the modules on the timeline, a hidden representation of the timeline, displayed offscreen, keeps track on the ‘playhead’ and the width of the timeline. This can be done with just code, but it was good with a visual representation when developing and debugging. When running for real it’s just updated on resize to set dimensions. Some modules fills the viewport and some have their own ratio, so it was a little tricky to scale and position everything in all resolutions so everything is visible and not cropped too much. Each module has two progress indicators, one for the visible position on screen and one for the duration of the module itself. When making parallax movement it’s often hard to calculate start- and end-position of objects to sync with the expected position when it’s in view. It’s good to know exactly when a module enters the view, plays its internal timeline and when it animates out of view again.

Each module has a subtle black layer on top that adjusts its opacity so it’s fully transparent when it’s in the center position. This helps you to focus on one module at a time, which enhances the experience.

### Page performance

Moving from a functioning prototype to a jank-free release version means going from guessing to knowing of what happens in the browser. This is where Chrome DevTools is your best friend.

We have spent quite a lot of time optimising the site. Forcing hardware-acceleration is one of the most important tools of course to get smooth animations. But also hunting [colorful columns](https://developers.google.com/chrome-developer-tools/docs/tips-and-tricks#timeline-frames-mode) and red rectangles in Chrome DevTools. There are many good articles about the topics, and you should read them [all](http://jankfree.org/). The reward for removing skipping frames is instant, but so is the frustration when they return again. And they will. It's an ongoing process that needs iterations.

{% Aside %}
Watch the layers panel (only in Canary) and the “paint rectangles” in Chrome DevTools. If, for example, child elements need to be updated per frame and be painted you should investigate if it’s faster to rearrange the layers to minimize the areas that need to be painted as much as possible.
{% endAside %}

I like to use TweenMax from Greensock for tweening properties, transforms and CSS. Think in containers, visualise your structure as you add new layers. Keep in mind that existing transforms can be overwritten by new transforms. The translateZ(0) that forced hardware acceleration in your CSS class is replaced by a 2D matrix if you tween 2D values only. To keep the layer in acceleration mode in those cases, use the property “force3D:true” in the tween to make a 3D matrix instead of a 2D matrix. It’s easy to forget when you combine CSS and JavaScript tweens to set styles.

Don’t force hardware acceleration where it’s not needed. GPU memory can quickly fill up and cause unwanted results when you want to hardware-accelerate many containers, especially on iOS where memory have more constraints. To load smaller assets and scale them up with css and disable some of the effects in mobile mode made huge improvements.

[Memory leaks](http://www.html5rocks.com/en/tutorials/memory/effectivemanagement/) was another field we needed to improve our skills in. When navigating between the different WebGL experiences a lot of objects, materials, textures and geometry are created. If those are not ready for garbage collection when you navigate away and remove the section they will probably cause the device to crash after a while when it runs out of memory.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/LgHLhBoc1xsHi8j3PuP0.png", alt="Exiting a section with a failing dispose function.", width="667", height="61" %}
<figcaption>Exiting a section with a failing dispose function.</figcaption>
</figure>

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/wV383MdysOSfWvrtxDl0.png", alt="Much better!", width="679", height="62" %}
<figcaption>Much better!</figcaption>
</figure>

To find the leak it was pretty straight forward workflow in DevTools, recording the timeline and capturing heap snapshots. It’s easier if there are specific objects, like 3D geometry or a specific library, that you can filter out. In the example above it turned out that the 3D scene was still around and also an array that stored geometry was not cleared. If you find it hard to locate where the object lives, there is a nice feature that let you view this called [retaining paths](https://developers.google.com/chrome-developer-tools/docs/heap-profiling?hl=sv&csw=1#views_paths). Just click the object you want to inspect in the heap snapshot and you get the information in a panel below. Using a good structure with smaller objects helps when locating your references.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/rPmywWW0dm3GoCrS2qPk.png", alt="The scene was referenced in the EffectComposer.", width="593", height="334" %}
<figcaption>The scene was referenced in the EffectComposer.</figcaption>
</figure>

In general, it's healthy to think twice before you manipulate the DOM. When you do, think about efficiency. Don't manipulate the DOM inside a game loop if you can help it. Store references in variables for reuse. If you need to search for an element, use the shortest route by storing references to strategic containers and searching inside the nearest ancestor element.

Delay reading dimensions of newly added elements or when removing/adding classes if you experience layout bugs. Or make sure [Layout is triggered](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/#toc-animating-layout-properties). Sometimes the browser batch changes to styles, and will not update after the next layout trigger. This can really be a big problem sometimes, but it’s there for a reason, so try to learn how it’s working behind the scenes and you will gain a lot.

### Fullscreen

When available, you have the option to put the site in fullscreen-mode in the menu via the Fullscreen API. But on devices there is also the browsers decision to put it into fullscreen. Safari on iOS had previously a hack to let you control that, but that is not available anymore so you have to prepare your design to work without it when making a non-scrolling page. We can probably expect updates on this in future updates, since it has broke a lot of web-apps.

## Assets

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/FIinD7TN05e0D5UO6BXb.jpg", alt="Animated instructions for the experiments.", width="800", height="222" %}
<figcaption>Animated instructions for the experiments.</figcaption>
</figure>

Throughout the site we have a lot of different types of assets, we use images (PNG and JPEG), SVG (inline and background), spritesheets (PNG), custom icon fonts and Adobe Edge animations. We use PNGs for assets and animations (spritesheets) where the element can't be vector based, otherwise we try to use SVGs as much as possible.

The vector format means no loss of quality, even if we scale it. 1 file for all devices.

- Small file size.
- We can animate each part separately (perfect for advanced animations). As an example we hide the "subtitle" of the Hobbit logo (the desolation of Smaug) when it's scaled down.
- It can be embedded as an SVG HTML tag or used as a background-image with no extra loading (it’s loaded the same time as the html page).

Icon typefaces have the same advantages as SVG when it comes to scalability and are used instead of SVG for small elements like icons on which we only need to be able to change the colour (hover, active, etc.). The icons are also very easy to reuse, you just need to set the CSS "content" property of an element.

## Animations

In some cases animating SVG elements with code can be very time consuming, especially when the animation needs to be changed a lot during the design process. To improve the workflow between designers and developers we use Adobe Edge for some animations (the instructions before the games). The animation workflow is really close to Flash and that helped the team but there are a few drawbacks, especially with integrating the Edge animations in our asset loading process since it comes with it’s own loaders and implementation logic.

I still feel we have a long way to go before we have a perfect workflow for handling assets and handmade animations on the web. We’re looking forward to seeing how tools like Edge will evolve. Feel free to add suggestions on other animation tools and workflows in the comments.

## Conclusion

Now when all the parts of the project are released and we look at the final result I must say we are quite impressed with the state of modern mobile browsers. When we started off this project we had much lower expectations on how seamless, integrated and performant we would be able to make it. It's been a great learning experience for us and all the time spent iterating and testing (a lot) has improved our understanding of how modern browsers work. And that's what it will take if we want to shorten the production time on these types of projects, going from guessing to knowing.

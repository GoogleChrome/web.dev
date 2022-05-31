---
layout: post
title: Making of the World Wonders 3D Globe
authors:
- ilmariheikkinen
date: 2012-07-26
tags:
- blog
---

## Introduction to the World Wonders 3D globe

If you've viewed the recently launched [Google World Wonders](http://google.com/worldwonders/) site on a WebGL-capable browser, you might have spotted a fancy spinning globe at the bottom of the screen. This article lets you in on how the globe works and what we used to build it.

To give you a quick overview, the World Wonders globe is a heavily tweaked version of the WebGL Globe by the Google Data Arts Team. We took the original globe, stripped out the bar graph bits, changed the shaders, added fancy clickable HTML markers and Natural Earth continent geometry from Mozilla's GlobeTweeter demo (big thanks to Cedric Pinson!) All to make a nice animated globe that matches the site's color scheme and adds an extra layer of sophistication to the site.

The design brief for the globe was to have a nice-looking animated map with clickable markers placed on top of World Heritage Sites. With that in mind, I started looking for something suitable. The first thing that came to mind was the WebGL Globe built by the Google Data Arts Team. It's a globe and it looks cool. What else do you need, eh?

## Setting up the WebGL Globe

The first step in making the globe widget was to download the WebGL Globe and get it up and running. The WebGL Globe is online at [Google Code](http://code.google.com/p/webgl-globe/), and it's simple to download and run. Download and extract [the zip](http://code.google.com/p/webgl-globe/downloads/detail?name=webgl-globe.zip), cd into it and run a basic webserver: `python -m SimpleHTTPServer`. (Do note, this doesn't have UTF-8 on by default; [you can use this](https://github.com/mathiasbynens/dotfiles/blob/73201f63481e6a9daf24652714af408c3e8f3fc7/.functions#L97-L104).) Now if you navigate to `http://localhost:8000/globe/globe.html` you should see the WebGL Globe.

With the WebGL Globe up and running it was time to cut off all the unneeded parts. I edited the HTML to excise the UI bits and removed the globe bar graph setup stuff from the globe initialization function. At the end of that process, I had a very barebones WebGL Globe on my screen. You can spin it around and it looks cool, but that's about it.

To cut the unneeded stuff, I deleted all the UI elements from the globe's index.html and edited the initialization script in to look like this:

```js
if(!Detector.webgl){
  Detector.addGetWebGLMessage();
} else {
  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  globe.animate();
}
```

## Adding the continent geometry

We wanted to have the camera close to the globe surface, but when we tested the globe zoomed in the lack of texture resolution became apparent. Zoomed in, the WebGL Globe's texture becomes blocky and blurry. We could have used a larger image, but that would make the globe slower to download and run, so we opted to go with a vector representation of the landmasses and borders.

For the landmass geometry, I turned to the open source GlobeTweeter demo and loaded the 3D model in that to Three.js. With the model loaded and rendering, it was time to start polishing the look for the globe. First problem was that the globe landmass model wasn't spherical enough to be flush with the WebGL Globe, so I ended up writing a quick mesh splitting algorithm that made the landmass model more spherical.

With a spherical landmass model, I was able to place it just slightly offset from the globe surface, creating floating continents outlined with a black 2px line below them for a shadow of sorts. I also experimented with neon-colored outlines to make for a sort of Tron-like look.

With the globe and the landmasses rendering, I started to experiment with different looks for the globe. As we wanted to go with a understated monochrome look, I stuck with a greyscale globe and landmasses. In addition to the aforementioned neon outlines, I tried out a dark globe with dark landmasses on a light background, which actually looks pretty cool. But it was too low-contrast to be easily readable and it didn't fit the feel of the project so I scrapped that.

Another early thought I had for the globe look was to make it look like glazed porcelain. That one I didn't manage to try out as I didn't manage to write a shader to do the porcelain look (visual material editor would be nice). The closest thing I tried was this white glowing globe with black landmasses. It's kinda neat but too high-contrast. And it doesn't look super nice. So another one for the scrapheap.

The shaders in the black and white globes are using a sort of bogus diffuse backlit lighting. The lightness of the globe depends on the distance of the surface normal to the screen plane. So pixels at the middle of the globe that are pointing at the screen are dark and pixels at the edges of the globe are light. Combined with a light background you get a look where the globe is reflecting the diffuse bright background, creating a classy showroom look. The black globe is also using the WebGL Globe texture as a gloss map, so that the continental shelves (shallow water areas) look shiny compared to the other parts of the globe.

Here's what the ocean shader for the black globe looks like. Very basic vertex shader and a hacky "oh that looks kinda neat *tweak tweak*" fragment shader.

```js
    'ocean' : {
      uniforms: {
        'texture': { type: 't', value: 0, texture: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = pow(1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0);',
          'float i = 0.8-pow(clamp(dot( vNormal, vec3( 0, 0, 1.0 )), 0.0, 1.0), 1.5);',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * intensity;',
          'float d = clamp(pow(max(0.0,(diffuse.r-0.062)*10.0), 2.0)*5.0, 0.0, 1.0);',
          'gl_FragColor = vec4( (d*vec3(i)) + ((1.0-d)*diffuse) + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    }
```

In the end we went with a dark globe with light-grey landmasses lit from above. It was closest to the design brief and looked nice and readable. In addition, having the globe be a bit low-contrast makes the markers and the rest of the content stand out more in comparison. The version below is using completely black oceans, whereas the production version has dark gray oceans and slightly different markers.

## Creating the markers with CSS

Speaking of markers, with the globe and landmasses working, I started work on the placemarkers. I decided to go with CSS-style HTML elements for the markers, to make it easier to make and style the markers, and to potentially reuse the markers in the 2D map the team was working on. At the time I also didn't know of an easy way to make the WebGL markers clickable and didn't want to write extra code for loading / creating the marker models. In hindsight, the CSS markers worked well but had a tendency to occasionally run into performance issues when browser compositors and renderers were in periods of flux. From a performance point of view, doing the markers in WebGL would've been a better option. Then again, the CSS markers saved a good deal of dev time.

The CSS markers consist of a couple of divs absolute-positioned with the CSS transform property. The background of the markers is a CSS gradient and the triangle part of the marker is a rotated div. The markers have a small drop shadow to pop them from the background. The biggest problem with the markers was to make them perform well enough. Sad as it may sound, drawing a few dozen divs that move around and change their z-index on every frame is a pretty good way to trigger all sorts of browser rendering pitfalls.

The way the markers are synchronized with the 3D scene is not too complicated. Each marker has a corresponding Object3D in the Three.js scene, which are used to track the markers. To get screen space coordinates, I take the Three.js matrices for the globe and the marker, and multiply a zero vector with those. From that I get the scene position of the marker. To get the screen position of the marker, I project the scene position through the camera. The resulting projected vector has the screen space coordinates for the marker, ready for use in CSS.

```js
var mat = new THREE.Matrix4();
var v = new THREE.Vector3();

for (var i=0; i<locations.length; i++) {
  mat.copy(scene.matrix);
  mat.multiplySelf(locations[i].point.matrix);
  v.set(0,0,0);
  mat.multiplyVector3(v);
  projector.projectVector(v, camera);
  var x = w * (v.x + 1) / 2; // Screen coords are between -1 .. 1, so we transform them to pixels.
  var y = h - h * (v.y + 1) / 2; // The y coordinate is flipped in WebGL.
  var z = v.z;
}
```

In the end, the fastest approach was to use CSS transforms for moving the markers, not use opacity fading as it was triggering a slow path on Firefox and keeping all the markers in the DOM, not removing them when they went behind the globe. We also experimented with using 3D transforms instead of z-indexes, but for some reason it didn't work right in the app (but it did work in a reduced test case, go figure), and we were a few days from the launch at that point so had to leave that part to post-launch maintenance.

When you click on a marker it expands into a list of clickable placenames. This is all normal HTML DOM stuff, so it was super easy to write. All the links and text rendering just work with no extra work on our part.

## Squeezing the filesize

With the demo working and hooked up to the rest of the World Wonders site, there was still one big issue to solve. The JSON-format mesh for the globe landmasses was about 3 megs in size. Not good for the front page of a showcase site. The good thing was that compressing the mesh with gzip brought it down to 350 kB. But hey, 350 kB is still a bit big. A couple emails later we managed to recruit Won Chun -- who worked on compressing the huge Google Body meshes -- to give us a hand at compressing the mesh. He [squeezed](http://code.google.com/p/webgl-loader/) the mesh down from a big flat list of triangles given as JSON coordinates to compressed 11-bit coords with indexed triangles and got the file size down to 95 kB gzipped.

Using compressed meshes does not only save bandwidth, but the meshes are also faster to parse. Turning 3 megs of stringified numbers into native numbers takes a good deal more work than parsing a hundred kB of binary data. And the resulting 250 kB size reduction for the page is very nifty as well as it gets the initial load time below a second on a 2 Mbps connection. Faster and smaller, awesomesauce!

At the same time, I was doodling around with loading the original Natural Earth Shapefiles from which the GlobeTweeter mesh is derived. I managed to load the Shapefiles but rendering them as flat landmasses requires triangulating them (with holes for lakes, natch.) I got the shapes triangulated using THREE.js utils but not the holes. And the resulting meshes had very long edges, which required splitting the mesh down to smaller tris. Long story short, I didn't manage to get it working in time, but the neat thing was that the further-compressed Shapefile format would've gotten you a 8 kB landmass model. Oh well, maybe next time.

## Future work

One thing that could use a bit of extra work are making the marker animations nicer. Now when they go over the horizon, the effect is a bit tacky. Additionally, having a cool animation for the marker opening would be nice.

Performance-wise the two things lacking are optimizing the mesh splitting algorithm and making the markers faster. Apart from that, things are dandy.  Hurrah!

## Summary

In this article I described how we built the 3D globe for the Google World Wonders project. I hope you enjoyed the examples and will try out building your own custom globe widget.

## References

- [WebGL Globe](http://code.google.com/p/webgl-globe/)
- [GlobeTweeter](http://plopbyte.com/globetweeter/)
- [Natural Earth](http://www.naturalearthdata.com/)
- [Shapefile](http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf)
- [shp.js](https://github.com/kig/shp.js/)
- [Three.js](https://github.com/mrdoob/three.js/)

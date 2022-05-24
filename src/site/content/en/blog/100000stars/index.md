---
layout: post
title: Making 100,000 Stars
authors:
  - michaelchang
date: 2012-11-28
tags:
  - blog
  - case-study
---

Hello! My name is Michael Chang and I work with the Data Arts Team at Google. Recently, we completed [100,000 Stars](http://workshop.chromeexperiments.com/stars), a [Chrome Experiment](http://chromeexperiments.com/) visualizing nearby stars. The project was built with [THREE.js](https://github.com/mrdoob/three.js/) and CSS3D. In this case study I will outline the discovery process, share some programming techniques, and finish with some thoughts for future improvement.

The topics discussed here will be fairly broad, and require some knowledge of THREE.js, though it is my hope that you can still enjoy this as a technical post-mortem. Feel free to jump to an area of interest using the table of contents button on the right. First, I'll show the rendering portion of the project, followed by shader management, and finally how to use CSS text labels in combination with WebGL.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/vlT6adEn3dy1cqmQVxBG.png", alt="100,000 Stars, a Chrome Experiment by Data Arts Team", width="500", height="235" %}
    <figcaption>100,000 Stars uses THREE.js to visualize nearby stars in the Milky Way</figcaption>
</figure>

## Discovering Space

Shortly after we finished [Small Arms Globe](http://www.chromeexperiments.com/detail/arms-globe/), I was experimenting with a THREE.js particle demo with depth of field. I noticed that I could change the interpreted "scale" of the scene by adjusting the amount of the effect applied. When the depth of field effect was really extreme, distant objects became really blurry similar to the way tilt-shift photography works on giving one the illusion of looking at a microscopic scene. Conversely, turning down the effect made it appear as if you were staring into deep space.

I began hunting for data I could use to inject particle positions with, a path that lead me to [astronexus.com](http://astronexus.com/)'s HYG database, a compilation of the three data sources (Hipparcos, Yale Bright Star Catalog, and Gliese/Jahreiss Catalog) accompanied by pre-calculated xyz Cartesian coordinates. Let's begin!

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3ViDnDe2KbPrITxGzGK5.png", alt="Plotting star data.", width="500", height="264" %}
    <figcaption>The first step is to plot every star in the catalog as a single particle.</figcaption>
</figure>

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/QI23eDp67VmKRHeOB7w9.png", alt="The named stars.", width="500", height="253" %}
    <figcaption>Some stars in the catalog have proper names, labeled here.</figcaption>
</figure>

It took about an hour to hack together something that placed the star data in 3D space. There are exactly 119,617 stars in the data set, so representing each star with a particle is not a problem for a modern GPU. There are also 87 individually identified stars, so I created a CSS marker overlay using the same technique I [described](http://mflux.tumblr.com/post/28367579774/armstradeviz) in Small Arms Globe.

During this time I had just finished the [Mass Effect](http://masseffect.bioware.com/) series. In the game the player is invited to explore the galaxy and [scan various planets and read about](https://www.youtube.com/watch?v=1g92-pgyJrU) their completely fictional, wikipedia-sounding history: what species had thrived on the planet, its geological history, and so forth.

Knowing the wealth of actual data that's out there about stars, one could conceivably present real information about the galaxy in the same way. The ultimate goal for this project would be to bring to life this data, allow the viewer to explore the galaxy à la Mass Effect, to learn about stars and their distribution, and hopefully inspire a sense of awe and wonder about space. Phew!

I should probably preface the rest of this case-study by saying that __I am by no means an astronomer, and that this is the work of amateur research__ supported by some advice from external experts. This project should definitely be construed as an artist interpretation of space.

## Building a Galaxy

My plan was to procedurally generate a model of the galaxy that can put the star data in context -- and hopefully give an awesome view of our place in the Milky Way.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/S5ZbLFPB3RnfRTOT35mW.png", alt="An early prototype of the galaxy.", width="500", height="200" %}
    <figcaption>An early prototype of the Milky Way particle system.</figcaption>
</figure>

To generate the Milky Way, I spawned 100,000 particles and placed them in a spiral by emulating the way galactic arms are formed. I wasn't too worried about the specifics of spiral arm formation because this would be a representational model rather than a mathematical one. However I did try to get the number of spiral arms more or less correct, and spinning in the "right direction."

In later versions of the Milky Way model I de-emphasized the use of particles in favor of a planar image of a galaxy to accompany the particles, hopefully giving it a more of a photographic appearance. The [actual image is of spiral galaxy NGC 1232](http://www.eso.org/public/images/ngc1232b/) roughly 70 million light years away from us, image-manipulated to look like the Milky Way.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/dQZVXko0eZdufru9zpqr.png", alt="Figuring out the scale of the galaxy.", width="500", height="221" %}
    <figcaption>Every GL unit is a light year. In this case the sphere is 110,000 light years wide, encompassing the particle system.</figcaption>
</figure>

I decided early on to represent one GL unit, basically a pixel in 3D, as one light year -- a convention that unified placement for everything visualized, and unfortunately gave me serious precision issues later on.

Another convention I decided was to rotate the entire scene rather than moving the camera, something I've done in a few other projects. One advantage is that everything is placed onto a "turntable" so that mouse-dragging left and right rotates the object in question, but zooming in is only a matter of changing camera.position.z.

Field of view (or FOV) for the camera is also dynamic. As one pulls outwards, the field of view widens, taking in more and more of the galaxy. The opposite is true when moving inwards towards a star, the field of view narrows. This allows the camera to view things that are infinitesimal (in comparison to the galaxy) by squishing the FOV down to something of a god-like magnifying glass without having to deal with near-plane clipping issues.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/cJhqkFVdJ81oTmVYsyFY.png", alt="Different ways of rendering a galaxy.", width="500", height="366" %}
    <figcaption>(above) Early particle galaxy. (below) Particles accompanied by an image plane.</figcaption>
</figure>

From here I was able to "place" the Sun at some number of units away from the galactic core. I was also able to visualize the relative size of the solar system by mapping out the radius of the [Kuiper Cliff](http://en.wikipedia.org/wiki/Kuiper_cliff#.22Kuiper_cliff.22) (I eventually chose to visualize the [Oort Cloud](http://en.wikipedia.org/wiki/Oort_cloud)) instead. Within this model solar system, I could also visualize a simplified orbit of Earth, and the actual radius of the Sun in comparison.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/iVU66rpZ86Wfoz3mY7B6.png", alt="The solar system.", width="500", height="267" %}
    <figcaption>The Sun orbited by planets and a sphere representing the Kuiper Belt.</figcaption>
</figure>

The Sun was difficult to render. I had to cheat with as many real-time graphics techniques as I knew. The surface of the Sun is a hot froth of plasma and needed to pulse and change over time. This was simulated via a bitmap texture of an infrared image of the solar surface. The surface shader makes a color look-up based on the grayscale of this texture and performs a look-up in a separate color ramp. When this look-up is shifted over time it creates this lava-like distortion.

A similar technique was used for the corona of the Sun, except that it would be a flat sprite card that always faces the camera using [https://github.com/mrdoob/three.js/blob/master/src/extras/core/Gyroscope.js](https://github.com/mrdoob/three.js/blob/master/src/extras/core/Gyroscope.js).

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/4yVISJF05rsbqZBogwl4.png", alt="Rendering Sol.", width="500", height="313" %}
    <figcaption>Early version of the Sun.</figcaption>
</figure>

The solar flares were created via vertex and fragment shaders applied to a torus, spinning just around the edge of the solar surface. The vertex shader has a noise function causing it to weave in a blob-like fashion.

It was here that I was starting to experience some z-fighting issues due to GL precision. All of the variables for precision were pre-defined in THREE.js, so I couldn't realistically bump up the precision without a huge amount of work. Precision issues were not as bad near the origin. However, once I started modeling other star systems, this became an issue.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/U8H1iHnTmqlKLBLmwO75.png", alt="Star model.", width="500", height="324" %}
    <figcaption>The code for rendering the Sun was later generalized to render other stars.</figcaption>
</figure>

There were a few hacks I employed to mitigate z-fighting. THREE's [Material.polygonoffset](https://github.com/mrdoob/three.js/blob/master/src/materials/Material.js) is a property that allows polygons to be rendered at a different perceived location (as far as I understand). This was used to force the corona plane to always render on top of the Sun's surface. Below this, a Sun "halo" was rendered to give sharp light rays moving away from the sphere.

A different problem related to precision was that the star models would begin jittering as the scene zoomed in. To fix this I had to "zero out" the scene rotation and separately rotate the star model and environment map to give the illusion that you are orbiting the star.

### Creating Lensflare

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/aS7ugNArmQTjwwmT1PeS.png", alt="With great power comes great responsibility.", width="500", height="324" %}
    <figcaption>With great power comes great responsibility.</figcaption>
</figure>

Space visualizations are where I feel like I can get away with excessive use of lensflare. [THREE.LensFlare](https://github.com/mrdoob/three.js/blob/master/src/extras/objects/LensFlare.js) serves this purposes, all I needed to do was throw in some anamorphic hexagons and a dash of [JJ Abrams](http://en.wikipedia.org/wiki/J._J._Abrams). The snippet below shows how to construct them in your scene.

```js
// This function retuns a lesnflare THREE object to be .add()ed to the scene graph
function addLensFlare(x,y,z, size, overrideImage){
var flareColor = new THREE.Color( 0xffffff );

lensFlare = new THREE.LensFlare( overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor );

// we're going to be using multiple sub-lens-flare artifacts, each with a different size
lensFlare.add( textureFlare1, 4096, 0.0, THREE.AdditiveBlending );
lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

// and run each through a function below
lensFlare.customUpdateCallback = lensFlareUpdateCallback;

lensFlare.position = new THREE.Vector3(x,y,z);
lensFlare.size = size ? size : 16000 ;
return lensFlare;
}

// this function will operate over each lensflare artifact, moving them around the screen
function lensFlareUpdateCallback( object ) {
var f, fl = this.lensFlares.length;
var flare;
var vecX = -this.positionScreen.x _ 2;
var vecY = -this.positionScreen.y _ 2;
var size = object.size ? object.size : 16000;

var camDistance = camera.position.length();

for( f = 0; f &lt; fl; f ++ ) {
flare = this.lensFlares[ f ];

flare.x = this.positionScreen.x + vecX * flare.distance;
flare.y = this.positionScreen.y + vecY * flare.distance;

flare.scale = size / camDistance;
flare.rotation = 0;

}
}
```

### An easy way to do texture scrolling

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/jKVWKP56RGV6ULZmY0LC.png", alt="Inspired by Homeworld.", width="500", height="247" %}
    <figcaption>A cartesian plane to help with spatial orientation in space.</figcaption>
</figure>

For the "spatial orientation plane", a gigantic THREE.CylinderGeometry() was created and centered on the Sun. To create the "wave of light" fanning outwards, I modified its texture offset over time like so:

```js
mesh.material.map.needsUpdate = true;
mesh.material.map.onUpdate = function(){
this.offset.y -= 0.001;
this.needsUpdate = true;
}
```

`map` is the texture belonging to the material, which get an onUpdate function you can over-write. Setting its offset causes the texture to be "scrolled" along that axis, and spamming needsUpdate = true would force this behavior to loop.

### Using color ramps

Each star has a different color based on a "color-index" that astronomers have assigned them. In general, red stars are cooler and blue/purple stars are hotter. A band of white and intermediate orange colors exist in this gradient.

When rendering the stars I wanted to give each particle its own color based on this data. The way to do this was with "attributes" given to the shader material applied to the particles.

```js
var shaderMaterial = new THREE.ShaderMaterial( {
uniforms: datastarUniforms,
attributes: datastarAttributes,
/_ ... etc _/
});
```

```js
var datastarAttributes = {
size: { type: 'f', value: [] },
colorIndex: { type: 'f', value: [] },
};
```

Filling up the colorIndex array would give each particle its unique color in the shader. Normally one would pass in a color vec3, but in this instance I'm passing in a float for the eventual color ramp look-up.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/FalbN0I27j7vvmlJQQJj.png", alt="Color ramp.", width="500", height="10" %}
    <figcaption>A color ramp used to look up the visible color from a star's color index.</figcaption>
</figure>

The color ramp looked like this, however I needed to access its bitmap color data from JavaScript. The way I did this was to first load the image onto DOM, draw it into a canvas element, then access the canvas bitmap.

```js
// make a blank canvas, sized to the image, in this case gradientImage is a dom image element
gradientCanvas = document.createElement('canvas');
gradientCanvas.width = gradientImage.width;
gradientCanvas.height = gradientImage.height;

// draw the image
gradientCanvas.getContext('2d').drawImage( gradientImage, 0, 0, gradientImage.width, gradientImage.height );

// a function to grab the pixel color based on a normalized percentage value
gradientCanvas.getColor = function( percentage ){
return this.getContext('2d').getImageData(percentage \* gradientImage.width,0, 1, 1).data;
}
```

This same method is then used for coloring individual stars in the star model view.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/J9xkA6vu8V6BBbkjQ2og.png", alt="My eyes!", width="500", height="236" %}
    <figcaption>The same technique is used to do color lookup for a star's spectral class.</figcaption>
</figure>

## Shader wrangling

Throughout the project I discovered that I needed to write more and more shaders to accomplish all of the visual effects. I wrote a custom shader loader for this purpose because I was tired of having shaders live in index.html.

```js
// list of shaders we'll load
var shaderList = ['shaders/starsurface', 'shaders/starhalo', 'shaders/starflare', 'shaders/galacticstars', /*...etc...*/];

// a small util to pre-fetch all shaders and put them in a data structure (replacing the list above)
function loadShaders( list, callback ){
var shaders = {};

var expectedFiles = list.length \* 2;
var loadedFiles = 0;

function makeCallback( name, type ){
return function(data){
if( shaders[name] === undefined ){
shaders[name] = {};
}

    shaders[name][type] = data;

    //  check if done
    loadedFiles++;
    if( loadedFiles == expectedFiles ){
    callback( shaders );
    }

};

}

for( var i=0; i&lt;list.length; i++ ){
var vertexShaderFile = list[i] + '.vsh';
var fragmentShaderFile = list[i] + '.fsh';

//	find the filename, use it as the identifier
var splitted = list[i].split('/');
var shaderName = splitted[splitted.length-1];
$(document).load( vertexShaderFile, makeCallback(shaderName, 'vertex') );
$(document).load( fragmentShaderFile,  makeCallback(shaderName, 'fragment') );

}
}
```

The loadShaders() function takes a list of shader file names (expecting .fsh for fragment and .vsh for vertex shaders), attempts to load their data, and then just replaces the list with objects. The end result is in your THREE.js uniforms you could pass shaders to it like so:

```js
var galacticShaderMaterial = new THREE.ShaderMaterial( {
vertexShader: shaderList.galacticstars.vertex,
fragmentShader: shaderList.galacticstars.fragment,
/_..._/
});
```

I probably could have used require.js although that would have needed some code reassembling just for this purpose. This solution, while much easier, could be improved upon I think, perhaps even as a THREE.js extension. If you have suggestions or ways to do this better, please let me know!

## CSS Text Labels on top of THREE.js

On our last project, Small Arms Globe, I toyed with making text labels appear on top of a THREE.js scene. The method I was using calculates the absolute model position of where I want the text to appear, then resolves the screen position using THREE.Projector(), and finally uses CSS "top" and "left" to place the CSS elements at the desired position.

Early iterations on this project used this same technique, however I've been itching to try [this other method described by Luis Cruz.](http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs)

The basic idea: match the CSS3D's matrix transform to THREE's camera and scene, and you can "place" CSS elements in 3D as if it were on top of THREE's scene. There are limitations to this though, for example you won't be able to have text go underneath a THREE.js object. This is still much faster than trying to perform layout using "top" and "left" CSS attributes.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/9GGQ2CoTcQ5DAkgJ2NdA.png", alt="Text labels.", width="500", height="287" %}
    <figcaption>Using CSS3D transforms to place text labels on top of WebGL.</figcaption>
</figure>

You can find the [demo (and code in view source) for this here.](http://www.emagix.net/images/portfolio/academic/mscs-project/code_projects/projects/webgl-three-css3-sync01.html) However I did find that the matrix order has since changed for THREE.js. The function I've updated:

```js
/_ Fixes the difference between WebGL coordinates to CSS coordinates _/
function toCSSMatrix(threeMat4, b) {
var a = threeMat4, f;
if (b) {
f = [
a.elements[0], -a.elements[1], a.elements[2], a.elements[3],
a.elements[4], -a.elements[5], a.elements[6], a.elements[7],
a.elements[8], -a.elements[9], a.elements[10], a.elements[11],
a.elements[12], -a.elements[13], a.elements[14], a.elements[15]
];
} else {
f = [
a.elements[0], a.elements[1], a.elements[2], a.elements[3],
a.elements[4], a.elements[5], a.elements[6], a.elements[7],
a.elements[8], a.elements[9], a.elements[10], a.elements[11],
a.elements[12], a.elements[13], a.elements[14], a.elements[15]
];
}
for (var e in f) {
f[e] = epsilon(f[e]);
}
return "matrix3d(" + f.join(",") + ")";
}
```

Since everything is transformed, the text no longer faces the camera. The solution was to use [THREE.Gyroscope()](https://github.com/mrdoob/three.js/blob/master/src/extras/core/Gyroscope.js) which forces an Object3D to "lose" its inherited orientation from the scene. This technique is called "billboarding", and Gyroscope is perfect for doing this.

What's really nice is that all of the normal DOM and CSS still played along, like being able mouse-over a 3D text label and have it glow with drop shadows.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/HVa9xgeH7Dy4YGoGlrC9.png", alt="Text labels.", width="500", height="267" %}
    <figcaption>Having text labels always face the camera by attaching it to a THREE.Gyroscope().</figcaption>
</figure>

When zooming in I found the scaling of typography was causing issues with positioning. Perhaps is this due to the kerning and padding of the text? Another problem was that the text became pixelated when zoomed into since the DOM renderer treats the rendered text as a textured quad, something to be aware of when using this method. In retrospect, I could have just used gigantic font-sized text, and perhaps this is something for future exploration. In this project I also used the "top/left" CSS placement text labels, described earlier, for really small elements that accompany planets in the solar system.

## Music playback and looping

The piece of music played during Mass Effect's 'Galactic Map' was by Bioware composers Sam Hulick and Jack Wall, and it had the kind of emotion I wanted the visitor to experience. We wanted some music in our project because we felt it was an important part of the atmosphere, helping create that sense of awe and wonderment we were trying to aim for.

Our producer Valdean Klump contacted Sam who had a bunch of "cutting floor" music from Mass Effect that he very graciously let us use. The track is titled "In a Strange Land".

I used the audio tag for music playback, however even in Chrome the "loop" attribute was unreliable -- sometimes it would just fail to loop. In the end this dual audio tag hack was used to check for end of playback and cycling to the other tag for playing. What was disappointing was that this *still* was not perfectly looping all the time, alas I feel like this was the best that I could do.

```js
var musicA = document.getElementById('bgmusicA');
var musicB = document.getElementById('bgmusicB');
musicA.addEventListener('ended', function(){
this.currentTime = 0;
this.pause();
var playB = function(){
musicB.play();
}
// make it wait 15 seconds before playing again
setTimeout( playB, 15000 );
}, false);

musicB.addEventListener('ended', function(){
this.currentTime = 0;
this.pause();
var playA = function(){
musicA.play();
}
// otherwise the music will drive you insane
setTimeout( playA, 15000 );
}, false);

// okay so there's a bit of code redundancy, I admit it
musicA.play();
```

## Room for improvement

After having worked with THREE.js for a while, I feel like I've gotten to the point where my data was mixing too much with my code. For example when defining materials, textures, and geometry instructions in-line, I was essentially "3D modeling with code". This felt really bad, and is an area where future endeavors with THREE.js could greatly improve upon, for example defining material data in a separate file, preferably viewable and tweakable in some context, and can be brought back into the main project.

Our colleague Ray McClure also spent some time creating some awesome generative "space noises" which had to be cut due to the web audio API being unstable, crashing Chrome every so often. It's unfortunate… but it definitely got us thinking more in the sound space for future work. As of this writing I'm informed that the Web Audio API has been patched so it's possible this is working now, something to look out for in the future.

Typographical elements paired with WebGL still remains to be a challenge, and I'm not 100% sure what we're doing here is the correct way. It still feels like a hack. Perhaps future versions of THREE, with its [up and coming CSS Renderer](https://plus.sandbox.google.com/113862800338869870683/posts/PnJB9fAQb6z), can be used to better join the two worlds.

## Credits

Thanks to Aaron Koblin for letting me go to town with this project. Jono Brandel for the excellent UI design + implementation, type treatment, and tour implementation. Valdean Klump for giving the project a name and all of the copy. Sabah Ahmed for clearing the metric ton of use-rights for the data and image sources. Clem Wright for reaching out to the right people for publication. Doug Fritz for technical excellence. George Brower for teaching me JS and CSS. And of course Mr. Doob for THREE.js.

## References

- [Three.js](https://github.com/mrdoob/three.js/)
- [Camera Sync with CSS3 and WebGL THREE.js](http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs)
- [Mass Effect](http://masseffect.bioware.com/)

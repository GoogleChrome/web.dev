---
layout: post
title: An introduction to shaders
authors:
- paullewis
date: 2011-06-02
tags:
- blog
---

## Introduction

I've previously given you [an introduction to Three.js](https://www.html5rocks.com/tutorials/three/intro/). If you've
not read that you might want to as it's the foundation on which I will
be building during this article.

What I want to do is discuss shaders. WebGL is brilliant, and as I've 
said before [Three.js](https://github.com/mrdoob/three.js/) (and other libraries) do a fantastic job of abstracting
away the difficulties for you. But there will be times you want to achieve
a specific effect, or you will want to dig a little deeper into how that
amazing stuff appeared on your screen, and shaders will almost certainly be
a part of that equation. Also if you're like me you may well want to go from
the basic stuff in the last tutorial to something a little more tricky. I'll
work on the basis that you're using Three.js, since it does a lot of the donkey
work for us in terms of getting the shader going.
I'll say up front as well that at the start I will be explaining
the context for shaders, and that the latter part of this tutorial is where
we will get into slightly more advanced territory. The reason for this is that
shaders are unusual at first sight and take a bit of explaining.

## 1. Our Two Shaders

WebGL does not offer the use of the Fixed
Pipeline, which is a shorthand way of saying that it doesn't give you any means
of rendering your stuff out of the box. What it __does__ offer, however, is
the Programmable Pipeline, which is more powerful but also more
difficult to understand and use. In short the Programmable Pipeline means as the
programmer you take responsibility for getting the vertices and so forth rendered
to the screen. Shaders are a part of this pipeline, and there are two types
of them:

1. Vertex shaders
1. Fragment shaders

Both of which, I'm sure you'll agree, mean absolutely nothing by themselves. What you
should know about them is that they both run entirely on your graphics card's GPU. This means
that we want to offload all that we can to them, leaving our CPU to do other work.
A modern GPU is heavily optimised for the functions that shaders require so it's great
to be able to use it.

## 2. Vertex Shaders

Take a standard primitive shape, like a sphere. It's made up of vertices, right?
A vertex shader is given every single one of these vertices in turn and can mess around with them.
It's up to the vertex shader
what it actually does with each one, but it has one responsibility: it must at some point set
something called **gl_Position**, a 4D float vector, which is the final position of the
vertex on screen. In and of itself that's quite an interesting process, because we're
actually talking about getting a 3D position (a vertex with x,y,z) onto, or projected,
to a 2D screen. Thankfully for us
if we're using something like Three.js we will have a shorthand way of setting the
**gl_Position** without things getting too heavy.


## 3. Fragment Shaders

So we have our object with its vertices, and we've projected them to the 2D screen,
but what about the colours we use? What about texturing and lighting? That's exactly
what the fragment shader is there for.
Very much like the vertex shader, the fragment shader also only has one must-do
job: it must set or discard the **gl_FragColor** variable, another 4D float vector, which the final colour of our fragment.
But what is a fragment? Think of three vertices which make a triangle. Each pixel within that triangle needs to be
drawn out. A fragment is the data provided by those three vertices for the purpose of drawing each pixel in that triangle.
Because of this the fragments receive interpolated values from their constituent vertices. If one vertex is coloured red, and
its neighbour is blue we would see the colour values interpolate from red, through purple, to blue.

## 4. Shader Variables

When talking about variables there are three declarations you can make: **Uniforms**,
**Attributes** and **Varyings**. When I first heard of those three I was very confused since they don't match anything else
I'd ever worked with. But here's how you can think of them: 

1. **Uniforms** are sent to **both**
vertex shaders and fragment shaders and contain values that stay the same across the
entire frame being rendered. A good example of this might be a light's position.

1. **Attributes** are values that are applied to individual vertices. Attributes
are **only** available to the vertex shader. This could be something like each vertex
having a distinct colour. Attributes have a one-to-one relationship with vertices.

1. **Varying**s are variables declared in
the vertex shader that we want to share with the fragment shader. To do this we make
sure we declare a varying variable of the same type and name in both the vertex shader
and the fragment shader. A classic use of this would be a vertex's normal since this can
be used in the lighting calculations.

Later on we'll use all three types so you can
get a feel for how they are applied for real.

Now we've talked about vertex shaders and fragment shaders and the types
of variables they deal with, it's now worth looking at the simplest shaders
we can create.

## 5. Bonjourno World
Here, then, is the Hello World of vertex shaders:

```js
/**
* Multiply each vertex by the model-view matrix
* and the projection matrix (both provided by
* Three.js) to get a final vertex position
*/
void main() {
gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}   
```

and here's the same for the fragment shader:

```js
/**
* Set the colour to a lovely pink.
* Note that the color is a 4D Float
* Vector, R,G,B and A and each part
* runs from 0.0 to 1.0
*/
void main() {
gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}

```

Not too complicated though, right?

In the vertex shader we are sent a couple of uniforms by Three.js. These two uniforms are
4D matrices, called the Model-View Matrix and the Projection Matrix. You
don't desperately need to know exactly how these work, although it's always
best to understand how things do what they do if you can. The short version is
that they are how the 3D position of the vertex is actually projected to
the final 2D position on the screen.

I've actually left them out of the snippet above because
Three.js adds them to the top of your shader code itself so you don't need
to worry about doing it. Truth be told it actually adds a lot more than
that, such as light data, vertex colours and vertex normals. If you were doing
this without Three.js you would have to create and set all those uniforms
and attributes yourself. True story.

## 6. Using a MeshShaderMaterial

OK, so we have a shader set up, but how do we use it with Three.js? It
turns out that it's terribly easy. It's rather like this:

```js
/**
* Assume we have jQuery to hand and pull out
* from the DOM the two snippets of text for
* each of our shaders
*/
var shaderMaterial = new THREE.MeshShaderMaterial({
vertexShader:   $('vertexshader').text(),
fragmentShader: $('fragmentshader').text()
});
```

From there Three.js will compile and run your shaders attached to the
mesh to which you give that material. It doesn't get much easier than that
really. Well it probably does, but we're talking about 3D running in your
browser so I figure you expect a certain amount of complexity.

We can actually add two more properties to our MeshShaderMaterial: uniforms
and attributes. They can both take vectors, integers or floats but as I mentioned
before uniforms are the same for the whole frame, i.e. for all vertices, so they
tend to be single values. Attributes, however, are per-vertex variables, so they
are expected to be an array. There should be a one-to-one relationship
between the number of values in the attributes array and the number of vertices
in the mesh.

## 7. Next Steps

Now we are going to spend a bit of time adding in an animation loop,
vertex attributes and a uniform. We'll also add in a varying variable
so that the vertex shader can send some data to the fragment shader.
The end result is that our sphere
that was pink is going to appear to be lit from above and to the side and
is going to pulsate. It's kind of trippy, but hopefully it will lead
you to a good understanding of the three variable types as well as how they
relate to each other and the underlying geometry.

## 8. A Fake Light

Let's update the colouring so it's not a flat coloured object. We could take a look at
how Three.js handles lighting, but as I'm sure you can appreciate
it's more complex than we need right now, so we're going to fake it. You should
totally look through [the fantastic shaders](https://github.com/mrdoob/three.js/blob/master/src/extras/ShaderUtils.js) that are a part of Three.js, and also [the ones](http://ro.me/tech) from the recent amazing WebGL project by Chris Milk and Google, [Rome](http://ro.me/).
Back to our shaders. We'll update our Vertex Shader to provide each vertex
normal to the Fragment Shader. We do this with a varying:

```js
// create a shared variable for the
// VS and FS containing the normal
varying vec3 vNormal;

void main() {

// set the vNormal value with
// the attribute value passed
// in by Three.js
vNormal = normal;

gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}
```

and in the Fragment Shader we're going to set up the same variable name
and then use the dot product of the vertex normal with a vector that
represents a light shining from above and to the right of the sphere.
The net result of this gives us an effect
similar to a directional light in a 3D package.

```js
// same name and type as VS
varying vec3 vNormal;

void main() {

// calc the dot product and clamp
// 0 -> 1 rather than -1 -> 1
vec3 light = vec3(0.5,0.2,1.0);
    
// ensure it's normalized
light = normalize(light);

// calculate the dot product of
// the light to the vertex normal
float dProd = max(0.0, dot(vNormal, light));

// feed into our frag colour
gl_FragColor = vec4(dProd, dProd, dProd, 1.0);

}
```

So the reason the dot product works is that given two vectors it comes
out with a number that tells you how 'similar' the two vectors are. With
normalised vectors, if they point in exactly the same direction, you get
a value of 1. If they point in opposite directions you get a -1. What we
do is take that number and apply it to our lighting. So a vertex in the
top right will have a value near or equal to 1, i.e. fully lit, whereas a vertex on
the side would have a value near 0 and round the back would be -1. We
clamp the value to 0 for anything negative, but when you plug the numbers
in you end up with the basic lighting we're seeing.
        
What's next? Well it would be nice to maybe
try messing with some vertex positions.

## 9. Attributes

What I'd like us to do now is attach a random number to each vertex
via an attribute. We'll use this number to push the vertex out along
its normal. The net result will be some kind of weird spike ball that
will change every time you refresh the page. It won't be animated just
yet (that happens next) but a few page refreshes will show you it's randomised.

Let's start by adding in the attribute to the vertex shader:

```js
attribute float displacement;
varying vec3 vNormal;

void main() {

vNormal = normal;

// push the displacement into the three
// slots of a 3D vector so it can be
// used in operations with other 3D
// vectors like positions and normals
vec3 newPosition = position + 
                    normal * 
                    vec3(displacement);

gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);
}

```
How does it look?

Not much different really! This is because the attribute
hasn't been set up in the MeshShaderMaterial so effectively the
shader uses a zero value instead. It's kind of like a placeholder
right now. In a second we'll add the attribute to the
MeshShaderMaterial in the JavaScript and Three.js will tie the two
together for us automatically.

Also of note is the fact that I had to
assign the updated position to a __new__ vec3 variable because the
original attribute, like all attributes, is read only.

## 10. Updating the MeshShaderMaterial

Let's hop straight into updating our MeshShaderMaterial
with the attribute needed to power our displacement. A reminder:
attributes are per-vertex values so we need one value per vertex
in our sphere. Like this:

```js
var attributes = {
displacement: {
    type: 'f', // a float
    value: [] // an empty array
}
};

// create the material and now
// include the attributes property
var shaderMaterial = new THREE.MeshShaderMaterial({
attributes:     attributes,
vertexShader:   $('#vertexshader').text(),
fragmentShader: $('#fragmentshader').text()
});

// now populate the array of attributes
var vertices = sphere.geometry.vertices;
var values = attributes.displacement.value
for(var v = 0; v < vertices.length; v++) {
values.push(Math.random() * 30);
}

```

Now we're seeing a mangled sphere, but the cool
thing is that all the displacement is happening on the GPU.


## 11. Animating That Sucker
We should totally make this animate. How do we do it? Well there
are two things we need to get in place:

1. A uniform to animate how much displacement should be applied
 in each frame. We can use sine or cosine for that since they run from -1 to 1
1. An animation loop in the JS

We're going to add the uniform to both
the MeshShaderMaterial and the Vertex Shader. First the Vertex Shader:

```js
uniform float amplitude;
attribute float displacement;
varying vec3 vNormal;

void main() {

vNormal = normal;

// multiply our displacement by the
// amplitude. The amp will get animated
// so we'll have animated displacement
vec3 newPosition = position + 
                    normal * 
                    vec3(displacement *
                        amplitude);

gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition,1.0);
}
```

Next we update the MeshShaderMaterial:

```js
// add a uniform for the amplitude
var uniforms = {
amplitude: {
    type: 'f', // a float
    value: 0
}
};

// create the final material
var shaderMaterial = new THREE.MeshShaderMaterial({
uniforms:       uniforms,
attributes:     attributes,
vertexShader:   $('#vertexshader').text(),
fragmentShader: $('#fragmentshader').text()
});
```

Our shaders are done for now. But right we would appear to have taken a step backwards.
This is largely because
our amplitude value is at 0 and since we multiply that with the 
displacement we're seeing nothing change. We also haven't set up the
animation loop so we never see that 0 change to anything else.

In our JavaScript we now need to wrap up the render call into a function and
then use requestAnimationFrame to call it. In there we also need
to update the uniform's value.

```js
var frame = 0;
function update() {

// update the amplitude based on
// the frame value
uniforms.amplitude.value = Math.sin(frame);
frame += 0.1;

renderer.render(scene, camera);

// set up the next call
requestAnimFrame(update);
}
requestAnimFrame(update);

```

## 12. Conclusion

And that's it! You can now see it's animating  in a strange (and slightly trippy) pulsating manner.
    
There's so much more we can cover
on shaders as a topic, but I hope you've found this introduction
helpful. You should now be able to understand shaders when you see them
as well as having the confidence to create some amazing shaders of your own!

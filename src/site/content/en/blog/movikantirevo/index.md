---
layout: post
title: Movi Kanti Revo - Part 1 - Building the 3D World
authors:
  - petelepage
date: 2012-09-19
tags:
  - blog
  - case-study
---

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/btqFngSls9zPrOREEqAU.png", alt="Movi Kanti Revo logo.", width="640", height="280" %}
</figure>

[Movi.Kanti.Revo](http://www.movikantirevo.com") is 
a new sensory Chrome experiment crafted by Cirque du Soleil and developed by 
Subatomic Systems that brings the wonder of Cirque du Soleil to the web through 
modern web technologies.  

## Building the 3D World

The experiment was created using just HTML5, and the environment is built 
entirely with markup and CSS.  Like set pieces on 
stage, `div`s, `img`s, small `video`s and 
other elements are positioned in a 3D space using CSS.  Using the new 
`getUserMedia` API enabled a whole new way of interacting with the 
experiment, instead of using the keyboard or mouse, a JavaScript facial 
detection library tracks your head and moves the environment along with you.

## All the Web's a Stage

To build this experiment, it’s best to imagine the browser as a stage, and the
elements like `<div>`s, images, videos and other elements as
set pieces positioned in 3D space using CSS.  Each element, or set piece is
positioned on the stage by applying a 3D transform.  If you’re unfamiliar with
the `translate3d` transform, it takes 3 parameters, X, Y and Z.  X 
moves the element along a horizontal line, Y moves the element up and down, 
and Z moves the element closer or further away.  For example, applying a 
`transform: translate3d(100px, -200px, 300px)` will move the element 
100 pixels to the right, 200 pixels down and 300 pixels closer towards the 
viewer. 

### Building the Auditorium

Let’s take a look at the [last 
scene](http://www.movikantirevo.com/#sea,) and to see how it’s put together.  All scenes are broken down into 
three primary containers, the world container, a perspective container and 
the stage.  The world container effectively setups up the viewers camera, and 
uses the CSS `perspective` property to tell the browser where the 
viewer will be looking at the element from.  The 
`#perspective-container` is used to change our perspective by 
applying 3D transforms to it.  Finally, the stage contains the actual set 
pieces that will be visible on screen. 


```html
<div id="world-container">
  <div id="perspective-container">
    <div id="stage">
    </div>
  </div>
</div>
```

```css
#world-container {
perspective: 700px;
overflow: hidden;
}

#perspective-container {
{ % mixin transform-style: preserve-3d; % }
{ % mixin transform-origin: center center; % }
{ % mixin perspective-origin: center center; % }
{ % mixin transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); % }
}
```

### Visualizing the Stage

Within the stage, there are seven elements in the final scene.  Moving from 
back to front, they include the sky background, a fog layer, the doors, the 
water, reflections, an additional fog layer, and finally the cliffs in front.   
Each item is placed on stage with a 
`transform: translate3d(x, y, z)` CSS property that indicates where 
it fits in 3D space. We used the z value in a similar way that we’d use 
`z-index`, but with the `translate3d` property, we can 
also provide a unit with the value.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/f8idh5Ffxbxd9muznYQN.png", alt="Figure 1: The stage from the side", width="640", height="400" %}
<figcaption>
    Figure 1: The stage from the side.
</figcaption>
</figure>

Figure 1 shows the scene zoomed out and rotated almost 90 degrees so that you
can visualize the way each of the different set pieces are placed within the
stage.  At the back (furthest to the left), you can see the background, fog,
doors, water and finally the cliffs.

### Placing the Background on Stage

Let’s start with the background image.  Since it’s the furthest back, we 
applied a -990px transform on the Z-axis to push it back in our perspective
(see Figure 2).

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/G8jQnIyffHXwHAGQz26s.png", alt="The stage, with only the background placed at -990px", width="640", height="400" %}
<figcaption>
    Figure 2: The stage, with only the background placed at -990px
</figcaption>
</figure>

As it moves back in space, physics demands that it gets smaller, so it needs 
to be resized via a `scale(3.3)` property to fit the viewport and 
aligned the top edge with the top of the viewport with a 
`translate3d` on the y-axis (see Figure 3).

```css
.background {
width: 1280px;
height: 800px;
top: 0px;
background-image: url(stars.png);
{ % mixin transform: translate3d(0, 786px, <b>-990px</b>) <b>scale(3.3)</b>; % }
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oIOqxVGPQtUillIvLyKx.png", alt="Figure 3: The stage, with background positioned and scaled.", width="640", height="400" %}
<figcaption>
    Figure 3: The stage, with only the background positioned and scaled.
</figcaption>
</figure>

The fog, doors, and the cliffs in the same way, each by applying a 
`translate3d` with an appropriate z position and scale factor 
(see Figure 4).  Notice how the fog is stacked behind the doors, and behind 
the cliffs.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/WR6Imi7KOP6ZqUhLlDHQ.png", alt="Figure 4: The stage, with fog, doors and cliff positioned and scaled", width="640", height="400" %}
<figcaption>
    Figure 4: The stage, with fog, doors and cliff positioned and scaled.
</figcaption>
</figure>

### Adding the Sea

To create as realistic an environment as possible, we knew we couldn’t simply 
put the water on a vertical plane, it’s typically doesn’t exist that way in 
the real world.  In addition to applying the `translate3d` to 
position the water on stage, we also apply an x-axis (horizontal) rotation of 
60 degrees (`rotateX(60deg)`) to make it appear flat and textured.  
A similar rotation was added to the door reflection and secondary fog to make 
it appear in the correct plane (see Figure 5).

```css
.sea {
bottom: 120px;
background-image: url(sea2.png);
width: 1280px;
height: 283px;
{ % mixin transform: translate3d(-100px, 225px, -30px) scale(2.3) <b>rotateX(60deg)</b>; % }
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/WgTCZnJfO93yN1Tu0a3z.png", alt="Figure 5: The stage, with everything positioned and scaled.", width="640", height="400" %}
<figcaption>
    Figure 5: The stage, with everything positioned and scaled.
</figcaption>>
</figure>

Each scene was built in a similar fashion, elements were visualized within the 
3D space of a stage, and an appropriate transform was applied to each.

## Further Reading

- [3D and CSS](http://www.html5rocks.com/en/tutorials/3d/css/)
- [Adventures in the Third Dimension: CSS 3D Transforms](http://coding.smashingmagazine.com/2012/01/06/adventures-in-the-third-dimension-css-3-d-transforms/)
- [Intro to CSS 3D Transforms](http://desandro.github.com/3dtransforms/)
- [MDN: Using CSS Transforms](https://developer.mozilla.org/docs/CSS/Using_CSS_transforms)


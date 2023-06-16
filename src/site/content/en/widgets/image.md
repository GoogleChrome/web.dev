---
title: '{% Img %} and <figure>'
---
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

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/73JKSfkcxMnLw661RnKA.png", alt="Flip", width="500", height="172" %}
<figcaption>This is what the page fold looks like when the page is flipping or being dragged.</figcaption>
</figure>

### Finding your frame

Once you've located the correct row in the tracing tool for your game, the next step is to find the main loop. The main loop looks like a repeating pattern in the tracing data. You can navigate the tracing data by using the W, A, S, D keys: A and D to move left or right (back and forth in time) and W and S to zoom in and out on the data. You would expect your main loop to be a pattern that repeats every 16 milliseconds if your game is running at 60Hz.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/OaqgG1IveqQcmrvLbeHs.png", alt="Looks like three execution frames", width="579", height="141" %}
  <figcaption>Looks like three execution frames</figcaption>
</figure>

Once you've located your game's heartbeat, you can dig into what exactly your code is doing at each frame. Use W, A, S, D to zoom in until you can read the text in the function boxes.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/LZZ7mv7XoGiC01rIOaWh.png", alt="Deep into an execution frame", width="579", height="335" %}
  <figcaption>Deep into an execution frame</figcaption>
</figure>

Success: Try to maintain 60fps for all of your animations. That way, your users won't see stuttering animations that interfere with their experience. Ensure that any animating element has `will-change` set for anything you plan to change well ahead of the animation starting. For view transitions, it’s highly likely you will want to use `will-change: transform`.

## Use translations to move between views

<figure class="float-left">
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ZbdixE36RlDboM08jwGH.gif", alt="Translating between two views.", width="320", height="404" %}
</figure>

To make life easier, assume that there are two views: a list view and a details view. As the user taps a list item inside the list view, the details view slides in, and the list view slides out.

<figure class="float-right">
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/5t4foOL1MBvOiAD4XbFD.svg", alt="View hierarchy.", width="309", height="148" %}
</figure>

To achieve this effect, you need a container for both views that has `overflow: hidden` set on it. That way, the two views can both be inside the container side-by-side without showing any horizontal scrollbars, and each view can slide side-to-side inside the container as needed.

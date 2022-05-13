---
layout: post
title: Next Generation Web Layout - National Geographic Forest Giant
authors:
  - christophergammon
date: 2013-06-03
tags:
  - blog
  - case-study
---

Wielding the tools from CSS and browser layout can enable stunning visualizations for web content. Using web features like CSS filters, WebGL, HTML5 video, SVG, canvas and evolving future tech like CSS Regions, CSS Shapes and CSS Custom Filters promises a hugely expanded creative landscape. Adobe has had a long history of working with content creators who are passionate about layout and design, and so has been active in applying this knowledge to the web with contributions to many evolving web standards.

With the help of National Geographic, we used content from their feature titled ‘Forest Giant’ to build a prototype showcasing how these features can enable rich web layout and responsive techniques. This article will show how we built some particularly interesting characteristics of the site. For a concise overview it’s worth watching [this video below](https://www.youtube.com/watch?v=UM0Cl3wWys0) where Christian Cantrell walks you through the various features of the site.

{% YouTube id="UM0Cl3wWys0" %}

## Subtleties of Layout

What constitutes great layout and the features behind it can be subtle, so we created an "editor's overlay" which highlights the more noteworthy features. To enable editor's marks, click on the bar at the bottom of the article.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/RnCyRfvuq2HWm1NCoMgl.gif", alt="Editor's marks image", width="477", height="473" %}
</figure>

## Layout Independent

In the web today, layout is often dictated by our content with containers enlarging vertically to fit text. When creating complex layouts, changes to the copy or other content can have an unwanted impact on the overall layout, causing the need for one to redesign content based on unexpected changes. With regions, we can truly separate our content from layout by defining an element as our content, and then specifying the parts of the layout we want that content to flow through.

In the example of ‘Forest Giant’ we have the story contained in a single element. Then, throughout the page, we have our layout scaffolding, consisting of photos and text areas. With CSS, we define the elements we want the content to flow through. When the copy reaches the end of an element, it continues to the next one in the DOM order. This allows us to get really creative with our columns, offsetting them and adapting their height based on the design, without concern of whether the text will fit or exceed the height of the element. It also allows us to have elements within our layout, like full width images, while the story continues to flow through it.

```css
#storyContent {
    flow-into: story;
}
.story {
    flow-from: story;
}
```

In the CSS above, we are creating a named flow called __"story"__. The content of this named flow is the element with the id of __"storyContent"__. This then flows through all of the elements with the class name __"story"__. CSS Regions are a great tool for responsive design allowing features like multi-columns and offset columns for rich layout on large screens while adjusting to single column layout on smaller screens. With regions you can also set the size of your region with responsive units like vw or vh.  This can be used to ensure columns don’t exceed the viewport height in your layout, without worrying about content getting cut off, since it will naturally flow into the next element in the region chain.


## Drop Caps

CSS Exclusions allow us to wrap text around or within irregular shapes. This can be useful for design flourishes like drop caps. Drop caps are a common design practice, where the first letter of a story or chapter is enlarged, allowing the rest of the text to wrap around the contour of the character. This effect is very similar to how inline content wraps around floats, however with exclusions, we are no longer restricted to rectangular boxes. Using shape-outside on a float, we can define the geometry that allows our content to wrap tightly around the shape of our character.

```css
.drop-caps {
    height: 100px;
    width: 100px;
    float: left;
    shape-outside: ellipse(50%, 50%, 50%, 50%);
}
```

This will create an ellipse allowing content to wrap around the circular shape. Also, because we are using relative units for the shape, changing the size of the element will be reflected in the size of the shape.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/dvld43h1IEJCT6k36D1K.jpg", alt="Drop Cap image", width="478", height="473" %}
</figure>

## Shapes

Along with drop caps, exclusions bring the ability to wrap text within shapes using shape-inside. We use this feature throughout the site, particularly with large image captions, making use of the negative space of photos to frame the text. It also allows us to wrap text along the contour of other images and graphics emulating layouts that were previously very difficult to achieve on the web.

Shapes can also work with responsive layouts by using relative units to define your shape. This way we can make shapes that stretch based on the container or viewport, and even use media queries to completely change the shape or remove it since it is all defined in CSS. Below is an example of one of a polygon shape being used within the site with the values defining the points:

```css
.shape {
    shape-inside: polygon(0 50%, 50% 0, 100% 0, 100% 100%, 0 100%);
}
```
 
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/bkMXfDcQqpvBe1usuDDH.jpg", alt="CSS Shapes image", width="478", height="473" %}
</figure>

## Balanced Text

Balanced Text is a feature that looks at the whole block of text within an element when wrapping lines, rather than wrapping word by word. It avoids situations where we have one or two words on a single line by breaking lines of text to achieve evenly sized lines within an element. This level of control allows us to easily create aesthetically pleasing blocks of text, especially for short runs like pull quotes or subtitles.

This is exactly where we’re using Balanced Text within the article. Because this feature is a standard that Adobe is Proposing, we’re using a <a href="https://github.com/adobe-webplatform/balance-text">polyfill created by Randy Edmunds</a> to achieve the same results.  This feature is best seen in responsive cases. When resizing the browser, you’ll notice that the block continues to balance the text to result in lines with approximately the same width.  Using the balanced text polyfill is easy, because it’s a jQuery plugin, all we have to do is apply ‘balanceText()’ to a selector when the layout changes and we’ll get nicely balanced text, which looks like this:

```js
$('.balance').balanceText();
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/8rhonRm5uzEbmBG60ZyT.gif", alt="Balanced text image", width="475", height="385" %}
</figure>

## Filter Transitions

Transitions are an important way to direct the attention of the user, and communicate the state of things within your site. With opacity -- and more recently, 3D Transforms -- we have seen these being used to create graceful transitions and animations as users scroll or interact with parts of your site. We now have filters which can be used for the same purpose.

In ‘Forest Giant’, we use filters to fade from grayscale to color as some images come into view. These filters can be combined with opacity, or other filters to create complex imaging effects and transitions.  We can use the power of custom filters to add even more dramatic effects.

Custom filters are written using GLSL, the same shading language as WebGL. They allow you to apply these shaders to DOM elements through CSS, enabling complex blending effects and 3D distortion. At the bottom of the site, when you click ‘Explore the President Tree’, you’ll see the page curl up to reveal another section underneath. This is just one example of how custom filters can allow rich transitions between content. The animation can be achieved using CSS transitions.  However, if you’d like to use more robust animations or interactions than transitions allow, you can pass values to your shader by setting the style with javascript as can be seen below.  This can allow you to have more granular control over easing or even allow methods of user input to manipulate the shader.

```js
function applyCurl(value) {
    $("#map").css("webkitFilter",
    "custom(url(page-curl.vs) mix(url(page-curl.fs) normal source-atop),"
    + " 50 50, transform perspective(1000) scale(1.0) rotateX(0deg) "
    + " rotateY(0deg) rotateZ(0deg), curlPosition "
    + value + " 0, curlDirection 104, curlRadius 0.2, bleedThrough 1.0)");
}
```

Our filter is rasterizing the content as a texture on the GPU to apply the effect.  Because of this, we need to be sure to remove it when it’s finished, otherwise our content may appear blurry.

```js
$("#map").css("webkitFilter", "none");
```
CSS custom filters enable interesting effects like page wrapping that looks like a page being flipped in a real book. They enable a web developer to program complex effects in a language called GLSL and apply it to web content. For more information on the details of custom filters, all those parameters, and how to use them, check out [this great tutorial](http://alteredqualia.com/css-shaders/article/).

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/sRjyy3S5KvbpQ1EQMMlC.gif", alt="Page flip image", width="438", height="336" %}
</figure>

## Pre-Render Textures in WebGL

The jewel of this article was the first complete image of ‘The President’, believed to be the second largest tree in the world by volume. This image was created by photo-stitching hundreds of photos of the tree to create a full picture.  We wanted to simulate this process by breaking the image into a bunch of little photos that fly into place to create the full picture.  This was achieved using WebGL, specifically with the [Three.js library](http://threejs.org/), which is a higher level API wrapper around WebGL.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/0uCmKsy7uEQcaVsKBcr9.jpg", alt="Giant tree image", width="438", height="336" %}
</figure>

Rendering a large number of textures can quickly cause performance issues each time a new texture tries to draw on screen, not to mention extra network requests. To reduce this, we made our textures as large as possible and offset them for each tile. This technique is often referred to as sprite mapping, and is common in game development. This resulted in three large textures for the whole tree. To get rid of the performance hit each time one of the textures first becomes visible on screen, we render 1px squares with each of the textures before the animation starts, moving the performance hit to the beginning. This allows us to fly through and animate the entire height of the tree smoothly, even on a tablet.

To offset the textures, we’re altering the UV’s which map the texture to the geometry.  In Three.js it looks like this:

```js
geometry.faceVertexUvs[0][0] = [
    new THREE.Vector2(xOffset, yOffset + 1),
    new THREE.Vector2(xOffset, yOffset),
    new THREE.Vector2(xOffset + 1, yOffset),
    new THREE.Vector2(xOffset + 1, yOffset + 1)
];
```

Here you can see we’re using a variable for the x and y offset of the texture.  The same effect could be achieved with a custom GLSL shader material that offsets the drawn coordinates on the geometry.


## Experimental Features

Because some of the features the demo uses are still experimental, the article needs to be viewed in [Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html) and enable all the flags mentioned for Chrome Canary at [this website](http://html.adobe.com/webplatform/enable/).


Once you have Chrome Canary installed and properly configured, go [check out the demo](http://adobe-webplatform.github.io/Demo-for-National-Geographic-Forest-Giant/browser/src/). (Note that the entire project is open source and [available on GitHub](https://github.com/adobe-webplatform/Demo-for-National-Geographic-Forest-Giant).)

## Conclusion

We’ve also been exploring how these features might be used in the mobile application context, more along the lines of an e-book.  You can see this prototype in progress and how we’re utilizing the different interaction and touch paradigms to showcase these features on a tablet.

{% YouTube id="zKjoZvRCyh0" %}

With web browser layout constantly evolving, we’re seeing the desire to continue the production value and layout quality we’ve grown accustomed to in the past with legacy reading content.  With features like CSS Regions, Exclusions, balanced text, custom filters, and WebGL, content creators will no longer have to choose between reach and design quality.  ‘Forest Giant’ is a clear sign that the web of the future will allow both.

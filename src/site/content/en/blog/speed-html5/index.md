---
layout: post
title: Improving the performance of your HTML5 App
authors:
  - malteubl
date: 2011-02-14
tags:
  - blog
---
## Introduction

HTML5 gives us great tools to enhance the visual appearance of web applications. This is especially true in the realm of animations. However, with this new power also come new challenges. Actually these challenges aren't really that new and it might sometimes make sense to ask your friendly desk neighbor, the Flash programmer, how she has overcome similar things in the past.

Anyway, when you work in animation it becomes hugely important that users perceive these animations to be smooth. What we need to realize is that smoothness in animations can't really be created by simply increasing the frames per second beyond any cognitive threshold. Our brain is, unfortunately, smarter than that. What you will learn is that true 30 frames of animation per second (fps) is much better than 60 fps with just a few frames dropped in the middle. People hate jaggedness.

This article will try to give you the tools and techniques to work on improving the experience of your own application.

## The Strategy

By no means do we want to discourage you from building awesome, stunningly visual apps with HTML5.

Then when you notice that performance could be a little better, come back here and read up on how you can improve the elements of your application. It can, of course, help to do some things right in the first place but never let that get in your way of being productive.

## Visual fidelity++ with HTML5

### Hardware Acceleration

Hardware acceleration is an important milestone for overall render performance in the browser. The general scheme is to offload tasks that would otherwise be calculated by the main CPU to the graphics processing unit (GPU) in your computer's graphics adapter. This can yield massive performance gains and can also reduce resource consumption on mobile devices.

#### These aspects of your document can be accelerated by the GPU

- General layout compositing
- CSS3 transitions
- CSS3 3D transforms
- Canvas Drawing
- WebGL 3D Drawing

While acceleration of canvas and WebGL are special purpose features that might not apply to your specific application the first three aspects can help pretty much every app to become faster.

#### What can be accelerated?

GPU acceleration works by offloading well-defined and specific tasks to special purpose hardware. The general scheme is that your document is broken down into multiple "layers" which are invariant to the aspects of your page that are accelerated. These layers are rendered using the traditional render pipeline. The GPU is then used to composite the layers onto a single page applying the "effects" that can be accelerated on the fly. A possible outcome is that an object that is animated on the screen does not require a single "relayout" of the page while the animation happens.

What you need to take away from that is that you need to make it easy for the rendering engine to identify when it can apply it's GPU acceleration magic. 
Consider the following example:

{% Aside %}
You want to animate an element in the browser from left to right. The traditional approach to is to set a JavaScript timer and then repeatedly setting the "left" property of the style object every N milliseconds.
{% endAside %}


While this works, the browser doesn't really know that you are performing something that is supposed to be perceived as smooth animation by a human being. Consider what happens when you achieve the same visual appearance using CSS3 transitions instead:

{% Aside %}
Now, you simply define the final position of the object and then tell the browser to perform an animation to the final destination over a certain period of time.
{% endAside %}

How the browser implements this animation is completely hidden from the developer. This in turn means that the browser is able to apply tricks such as GPU acceleration to achieve the defined goal.

There are two useful command-line flags for Chrome to help debugging GPU acceleration:

1. `--show-composited-layer-borders` shows a red border around elements that are
being manipulated at the GPU level. Good for confirming your manipulations occur within the GPU layer.
1. `--show-paint-rects` all non-GPU changes are painted and this throws
a light border around all areas that are repainted. You can see the browser optimizing paint areas in action.


Safari has similar runtime flags [described here](http://mir.aculo.us/2011/02/08/visualizing-webkits-hardware-acceleration/).

### CSS3 Transitions

CSS Transitions make style animation trivial for everyone, but they also are a smart performance feature. Because a CSS transition is managed by the browser, the fidelity of its animation can be greatly improved, and in many cases hardware accelerated. Currently WebKit (Chrome, Safari, iOS) have hardware accelerated CSS transforms, but it's coming quickly to other browsers and platforms.

You can use [`transitionEnd`](https://developer.mozilla.org/CSS/CSS_transitions) events in order to script this into powerful combinations, though right now, capturing all supported transition end events means watching `webkitTransitionEnd transitionend oTransitionEnd`.


Many libraries have now introduced animation APIs that leverage transitions if present and fall back to standard DOM style animation otherwise. [scripty2](http://scripty2.com/), [YUI transition](http://developer.yahoo.com/yui/3/transition/), [jQuery animate enhanced](http://playground.benbarnett.net/jquery-animate-enhanced/).

### CSS3 Translate

I'm sure you've found yourself animating the x/y position of an element across the page before. You probably manipulated the inline style's left and top properties. With 2D transforms, we can use the `translate()` functionality to replicate this behavior.

We can combo this with DOM animation to use the best thing possible

```html
<div style="position:relative; height:120px;" class="hwaccel">

  <div style="padding:5px; width:100px; height:100px; background:papayaWhip;
              position:absolute;" id="box">
  </div>
</div>

<script>
document.querySelector('#box').addEventListener('click', moveIt, false);

function moveIt(evt) {
  var elem = evt.target;

  if (Modernizr.csstransforms && Modernizr.csstransitions) {
    // vendor prefixes omitted here for brevity
    elem.style.transition = 'all 3s ease-out';
    elem.style.transform = 'translateX(600px)';

  } else {
    // if an older browser, fall back to jQuery animate
    jQuery(elem).animate({ 'left': '600px'}, 3000);
  }
}
</script>
```

We use Modernizr to feature test for CSS 2D Transforms and CSS Transitions, if so we're going to use translate to shift the position. If this is animated using a transition there is a good chance the browser can hardware accelerate it. To give the browser another push in the right direction we'll use the "magic CSS bullet" from above.

If our browser is less capable, we'll fallback to jQuery to move our element. You can pick up the [jQuery Transform polyfill plugin](http://louisremi.github.io/jquery.transform.js/index.html) by Louis-Remi Babe to make this whole thing automatic.

### `window.requestAnimationFrame`

`requestAnimationFrame` was introduced by Mozilla and iterated on by WebKit with the goal of providing you a native API for running animations, whether they be DOM/CSS-based or on `<canvas>` or WebGL. The browser can optimize concurrent animations together into a single reflow and repaint cycle, leading to higher fidelity animation. For example, JS-based animations synchronized with CSS transitions or SVG SMIL. Plus, **if you're running the animation loop in a tab that's not visible, the browser won't keep it running**, which means less CPU, GPU, and memory usage, leading to much longer battery life.

For more details on how and why to use `requestAnimationFrame`, view Paul Irish's article [requestAnimationFrame for smart animating](http://paulirish.com/2011/requestanimationframe-for-smart-animating/).

## Profiling

When you discover that the speed of your application can be improved, it is time to dig into profiling to find out where optimizations could yield the greatest benefit. Optimizations will often have negative impact on the maintainability of your source code and should thus only be applied if necessary. Profiling tells you which parts of your code would yield the greatest benefits when their performance would be improved.

### JavaScript Profiling

JavaScript profilers give you an overview on the performance of your application on the JavaScript function level by measuring the time it takes to execute each individual function from its starts to its end.

The gross execution time of a function is the overall time it takes to execute it from top to bottom. The net execution time is the gross execution time minus the time it took to execute functions called from the function.

Some functions get called more often than others. Profilers usually give you the time it took for all invocations to run as well as the average and minimum and maximum execution time.

For more details, check out the [Chrome Dev Tools docs on profiling](http://code.google.com/chrome/devtools/docs/profiles.html).

#### The DOM

The performance of JavaScript has a strong influence in to how fluid and responsive your application will feel. It is important to understand that, while JavaScript profilers measure the execution time of your JavaScript, they also indirectly measure the time spent doing DOM operations. These DOM operations are often at the heart of your performance issues.

```js
function drawArray(array) {
  for(var i = 0; i < array.length; i++) {
    document.getElementById('test').innerHTML += array[i]; // No good :(
  }
}
```

E.g. in the code above almost no time is spent executing actual JavaScript. It is still very likely that the drawArray-function will show up in your profiles because it is interacting with the DOM in a very wasteful fashion.

#### Tips and Tricks

##### Anonymous Functions

Anonymous functions are not easy to profile because they inherently don't have a name under which they could show up in the profiler. There are two ways to work around this:

```js
$('.stuff').each(function() { ... });
```

rewrite to:

```js
$('.stuff').each(function workOnStuff() { ... });
```

It is not commonly known that JavaScript supports naming function expressions. Doing this will make them show up perfectly in the profiler. There is one problem with this solution: The named expression actually puts the function name into the current lexical scope. This might clobber other symbols, so be careful.

##### Profiling long functions

Imagine you have a long function and you suspect that a small part of it might be the reason for your performance problems. There are two ways to find out which part is the problem:

1. The correct method: Refactor your code to not include any long functions.
1. The evil getting-things-done method: add statements in the form of named self calling functions to your code. If you are a little careful this does not change the semantics and it makes parts of your function show up as individual functions in the profiler:
```js
function myLongFunction() {
  ...
  (function doAPartOfTheWork() {
    ...
  })();
  ...
}
```
Don't forget to remove these extra functions after profiling is done; or even use them as a starting point to refactor your code.

### DOM Profiling

The latest Chrome Web Inspector development tools contain the new "Timeline View" which shows a timeline of the low level actions performed by the browser. You can use this information to optimize your DOM operations. You should aim to reduce the number of "actions" the browser has to perform while your code executes.

The timeline view can create an immense amount of information. You should thus try to create minimal test cases that you can execute independently.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/2TyfAOp4mUpJKOsUzhUW.png", alt="DOM Profiling", width="475", height="173" %}
</figure>

The image above shows the output of the timeline view for a very simple script. The left pane shows the operations performed by the browser in chronical order, while the timeline in the right pane shows the actual time consumed by an individual operation.

[More info on the timeline view.](http://code.google.com/chrome/devtools/docs/timeline.html) An alternative tool for profiling in Internet Explorer is <a href="">[DynaTrace Ajax Edition](http://www.google.com/url?q=http%3A%2F%2Fajax.dynatrace.com%2Fajax%2Fen%2F&amp;sa=D&amp;sntz=1&amp;usg=AFQjCNFXR0N-8Ja89DdI_cyTEA3vdPPP5w).

### Profiling Strategies

#### Single out aspects

When you want to profile your application, try to single out the aspects of its functionality that might trigger slowness as close as possible. Then try to do a profile run that only executes parts of your code that are relevant to these aspects of your application. This will make the profiling data easier to interpret because it is not intermixed with code paths that are not related to your actual problem. Good examples for individual aspects of your application might be:

1. Start up time (activate the profiler, reload application, wait until initialization is complete, stop the profiler.
1. Click a button and subsequent animation (start profiler, click button, wait until animation is complete, stop profiler).

##### GUI Profiling

Executing only the right part of your application can be harder in a GUI program than when you optimize, say, the ray tracer of your 3D engine. When you, for example, want to profile the stuff that happens when you click a button, you might trigger unrelated mouseover events along the way that make your results less conclusive. Try to avoid that :)

##### Programatic Interface

There is also a programatic interface to activate the debugger. This allows precise control over when profiling starts and when it ends.

Start a profiling with:

`console.profile()`

Stop profiling with:

`console.profileEnd()`

#### Repeatability

When you do profiling make sure you can actually reproduce your results. Only then will you be able to tell whether your optimizations did actually improve things. Also function level profiling is done in the context of your whole computer. It is not an exact science. Individual profile runs might be influenced by many other things happening on your computer:

1. An unrelated timer in your own application that fires while you measure something else.
1. The garbage collector doing its work.
1. Another tab in your browser doing hard work in the same operating thread.
1. Another program on your computer using up the CPU thus making your application slower.
1. Sudden changes in the gravitational field of the earth.

It also makes sense to execute the same code path multiple times in one profiling session. This way you decrease the influence of above factors and the slow parts may stand out even more clearly.

#### Measure, improve, measure

When you identified a slow spot in your program, try to think of ways to improve the execution behavior. After you changed your code, profile again. If you are satisfied with the result, move on, if you are not seeing an improvement you should probably roll back your change and not leave it in "because it can't hurt".

## Optimization Strategies

### Minimize DOM interaction

A common theme for improving the speed of web client applications is to minimize DOM interaction. While the speed of JavaScript engines has increased by an order of magnitude, accessing the DOM has not gotten faster at the same rate. This is also for very practical reasons never going to happen (things like layouting and drawing stuff on a screen just take time).

#### Cache DOM Nodes

Whenever you retrieve a node or a list of nodes from the DOM, try to think about whether you might be able to reuse them in a later computation (or even just the next loop iteration). As long as you don't actually add or delete nodes in the relevant area, this is often the case.

Before:

```js
function getElements() {
  return $('.my-class');
}
```

After:

```js
var cachedElements;
function getElements() {
  if (cachedElements) {
    return cachedElements;
  }
  cachedElements = $('.my-class');
  return cachedElements;
}
```

#### Cache Attribute Values

The same way you can cache DOM nodes you can also cache the values of attributes. Imagine you are animating an attribute of a node's style. If you know that you (as in that part of the code) are the only one that will ever touch that attribute you can cache the last value on every iteration so that you will not have to read it repeatedly.

Before:

```js
setInterval(function() {
  var ele = $('#element');
  var left = parseInt(ele.css('left'), 10);
  ele.css('left', (left + 5) + 'px');
}, 1000 / 30);
```


After:
```js
var ele = $('#element');
var left = parseInt(ele.css('left'), 10);
setInterval(function() {
  left += 5;
  ele.css('left', left + 'px');
}, 1000 / 30);
```

#### Move DOM Manipulation Out of Loops

Loops are often hot points for optimization. Try to think of ways to decouple actual number crunching to working with the DOM. It is often possible to do a calculation and then, after it is done, apply all the results in one go.

Before:

```js
document.getElementById('target').innerHTML = '';
for(var i = 0; i < array.length; i++) {
  var val = doSomething(array[i]);
  document.getElementById('target').innerHTML += val;
}
```

After:

```js
var stringBuilder = [];
for(var i = 0; i < array.length; i++) {
  var val = doSomething(array[i]);
  stringBuilder.push(val);
}
document.getElementById('target').innerHTML = stringBuilder.join('');
```

#### Redraws and Reflows

As discussed earlier accessing the DOM is relatively slow. It becomes very slow when your code is reading a value which has to be recalculated because your code recently modified something related in the DOM. Thus, it should be avoided to intermix reading and writing access to the DOM. Ideally your code should always be grouped in two phases:

- Phase 1: Read DOM values necessary for your code
- Phase 2: Modify the DOM

Try not to program a pattern such as:

- Phase 1: Read DOM values
- Phase 2: Modify the DOM
- Phase 3: Read some more
- Phase 4: Modify the DOM somewhere else.

Before:

```js
function paintSlow() {
  var left1 = $('#thing1').css('left');
  $('#otherThing1').css('left', left);
  var left2 = $('#thing2').css('left');
  $('#otherThing2').css('left', left);
}
```

After:

```js
function paintFast() {
  var left1 = $('#thing1').css('left');
  var left2 = $('#thing2').css('left');
  $('#otherThing1').css('left', left);
  $('#otherThing2').css('left', left);
}
```

This advice should be considered for actions happening within one JavaScript execution context. (e.g. within an event handler, within an interval handler or when handling an ajax response.)

Executing the function `paintSlow()` from above creates this image:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/aHTQuhABgASDfKuSWOSh.png", alt="paintSlow()", width="536", height="212" %}
</figure>

Switching to the faster implementation yields this image:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/PEbeR9lTvj6mDheaWkCe.png", alt="Faster implementation", width="360", height="234" %}
</figure>

These images show that reordering the way your code accesses the DOM can greatly enhance render performance. In this case the original code has to recalculate styles and layout the page twice to create the same result. Similar optimization can be applied to basically all "real world" code and yield some really dramatic results.

Read more: [**Rendering: repaint, reflow/relayout, restyle** by Stoyan Stefanov](http://calendar.perfplanet.com/2009/rendering-repaint-reflow-relayout-restyle/)

#### Redraws and the Event Loop

JavaScript execution in the browser follows an "Event Loop" model. By default the browser is in an "idle" state. This state can be interrupted by events from user interactions or such things as JavaScript timers or Ajax callbacks. Whenever a piece of JavaScript runs at such an interruption point, the browser will usually wait for it to finish until it repaints the screen (There might be exceptions for extremely long running JavaScripts or in cases such as alert-boxes which effectively interrupt the JavaScript execution).

Consequences

1. If your JavaScript animation cycles take longer than 1/30 seconds to execute, you will not be able to create smooth animations because the browser will not repaint during the JS execution. When you expect to also handle user events you need to be much faster.
1. Sometimes it comes in handy to delay some JavaScript actions until just a little bit later.
E.g. `setTimeout(function() { ... }, 0)`
This effectively tells the browser to execute the callback as soon as the event loop is idle again (effectively some browsers will wait at least 10ms). You need to be aware that this will create two JavaScript execution cycles which are very close together in time. Both might trigger a repaint of the screen which might double the overall time spent with painting. Whether this actually triggers two paints depends on heuristics in the browser.

Regular version:

```js
function paintFast() {
  var height1 = $('#thing1').css('height');
  var height2 = $('#thing2').css('height');
  $('#otherThing1').css('height', '20px');
  $('#otherThing2').css('height', '20px');
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/2TyfAOp4mUpJKOsUzhUW.png", alt="Redraws and the Event Loop", width="475", height="173" %}
</figure>

Lets add some delay:

```js
function paintALittleLater() {
  var height1 = $('#thing1').css('height');
  var height2 = $('#thing2').css('height');
  $('#otherThing1').css('height', '20px');
  setTimeout(function() {
    $('#otherThing2').css('height', '20px');
  }, 10)
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/PEbeR9lTvj6mDheaWkCe.png", alt="Delay", width="360", height="234" %}
</figure>

The delayed version shows that the browser paints twice although the two changes to the page are only 1/100 of a second a part.

### Lazy Initialization

Users want web apps that load fast and feel responsive. However, users have different thresholds into what they perceive as slow depending on the action that they do. E.g. an app should never do a lot of computation on a mouseover event because this might create a bad user experience while the user continues to move his mouse. However, users are used to accepting a little delay after they clicked on a button.

Thus it might make sense to move your initialization code to be executed as late as possible (e.g. when the user clicks a button that activates a particular component of your application).

Before:
```js
var things = $('.ele > .other * div.className');
$('#button').click(function() { things.show() });
```

After:
```js
$('#button').click(function() { $('.ele > .other * div.className').show() });
```

### Event Delegation

Spreading event handlers across a page might take a relatively long time and can also be tedious once elements are dynamically replaced which then requires reattaching event handlers to the new elements.

The solution in this case is to use a technique called event delegation. Instead of attaching individual event handlers to elements, the bubbling nature of many browser events is used by actually attaching the event handler to a parent node and checking the target node of the event to see if the event is of interest.

In jQuery this can be easily expressed as:

```js
$('#parentNode').delegate('.button', 'click', function() { ... });
```

#### When not to use event delegation

Sometimes the opposite can be true: You are using event delegation and you're having a performance problem. Basically event delegation allows constant-complexity initialization time. However, the price of checking if an event is of interest has to be paid for every invocation of that event. This might come in expensive, especially for events that occur frequently like "mouseover" or even "mousemove".

## Typical Problems and Solutions

### The stuff I do in `$(document).ready` takes a long time

Malte's personal advice: Never do anything in `$(document).ready`. Try to deliver your document in its final form. OK, you are allowed to register event listeners, but only using id-selector and/or using event delegation. For expensive events such as "mousemove", delay the registration until they are needed (mouseover event on the relevant element).

And if you really need to do stuff, such as making an Ajax request to get actual data, then show a nice animation; you might want to include the animation as a data URI if it is an animated GIF or the like.

### Since I added a Flash movie to the page everything is really slow

Adding Flash to a page will always slow down rendering a little because the final layout of the window has to be "negotiated" between the browser and the Flash plugin. When you cannot completely avoid putting Flash on your pages, make sure you set the "wmode" Flash-parameter to the value "window" (which is the default). This will disable the ability to composite HTML and Flash elements (You won't be able to see an HTML element that lies above the Flash movie and your Flash movie cannot be transparent). This might be an inconvenience but it will dramatically improve your performance. For example check out the way that [youtube.com](http://youtube.com) carefully avoids placing layers above the main movie player.

### I'm saving things to localStorage, now my application stutters

Writing to localStorage is a synchronous operations that involves spinning up your hard disk. You never want to do "long running" synchronous operations while doing animations. Move the access to localStorage to a spot in your code where you are sure that the user is idle and no animations are going on.

### Profiling points to a jQuery selector being really slow

First you want to make sure that your selector can be run through [document.querySelectorAll](https://developer.mozilla.org/DOM/Document.querySelectorAll). You can test that in the JavaScript console. If there is an exception rewrite your selector to not use any special extension of your JavaScript framework. This will speed up your selector in modern browsers by an order of magnitude.

If this doesn't help or if you also want to be fast in modern browsers, follow these guidelines:

- Be as specific on the right side of your selector as possible.
- Use a tag name that you don't use often as the rightmost selector part.
- If nothing helps, think about rewriting things so you can use an id-selector

### All these DOM manipulations take a long time

A bunch of DOM node inserts, removes and updates can be really slow. This can generally be optimized by generating a large string of html and the using `domNode.innerHTML = newHTML` to replace the old content. Note that this might be really bad for maintainability and might create memory links in IE so be careful.

Another common problem is that your initialization code might create a lot of HTML. E.g. a jQuery plugin that transforms a select box into a bunch of divs because that is what the design people wanted in ignorance of UX best practices. If you really want your page to be fast, never do that. Instead deliver all the markup from the server side in its final form. This again has many problems so think hard whether the speed is worth the tradeoff.

## Tools

1. [JSPerf - Benchmark little snippets of JavaScript](http://jsperf.com)
1. [Firebug - For profiling in Firefox](http://getfirebug.com/)
1. [Google Chrome Developer Tools](http://code.google.com/chrome/devtools/) (Available as WebInspector in Safari)
1. [DOM Monster - For optimizing DOM performance](http://mir.aculo.us/dom-monster/)
1. [DynaTrace Ajax Edition - For profiling and paint optimizations in Internet Explorer](http://ajax.dynatrace.com/ajax)

## Further reading

1. [Google Speed](http://code.google.com/speed/)
1. [Paul Irish on jQuery Performance](http://paulirish.com/2009/perf/)
1. [Extreme JavaScript Performance (Slide Deck)](http://www.slideshare.net/madrobby/extreme-javascript-performance)
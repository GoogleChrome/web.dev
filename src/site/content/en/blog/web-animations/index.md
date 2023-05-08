---
title: Web Animations API improvements in Chromium 84
subhead: Orchestrating animations with promises, performance improvements with replaceable animations, smoother animations with composite modes, and more.
authors:
  - una
  - kevinellis
date: 2020-05-27
hero: image/admin/FHGNLoi8kcbaHlFTYb4H.jpg
alt: Option screen with illustrated characters and a moving blue target.
description: Wrangling your web animations is about to get much easier.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - animations
  - chrome-84
  - javascript
feedback:
  - api
---

When used correctly, [animations improve user perception and memory](https://www.researchgate.net/publication/229351931_The_Effects_of_Animation_and_Format_on_the_Perception_and_Memory_of_Online_Advertising) of your brand, guide user actions, and help users navigate your application—providing context in a digital space.


The [Web Animations API](https://www.w3.org/TR/web-animations-1/) is a tool that enables developers to write [imperative animations with JavaScript](https://www.youtube.com/watch?v=WaNoqBAp8NI). It was written to underpin both CSS animation and transition implementations and enable future effects to be developed, as well as existing effects to be composed and timed.

While [Firefox](https://mozilla.github.io/standards-positions/) and [Safari](https://webkit.org/status/#specification-web-animations) have already implemented the full set of spec [features](https://caniuse.com/#feat=web-animation), Chromium 84 brings a slew of previously unsupported features to [Chrome and Edge](https://developer.microsoft.com/en-us/microsoft-edge/status/webanimationsjavascriptapi/) enabling cross-browser interoperability.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mdsjLgrX6rngEnBZo5Nu.png", alt="The Web Animations API first hit Chromium in version 36, July of 2014. Now the spec is going to be complete, in version 84, launching July 2020.", width="800", height="374" %}
  <figcaption>
    The long history of the Web Animations API in Chromium.
  </figcaption>
</figure>

## Getting started

Creating an animation via the Web Animations API should feel very familiar if you've used `@keyframe` rules. First you'll need to create a Keyframe Object. What might look like [this](https://codepen.io/una/pen/RwWMvPw) in CSS:

```css
@keyframes openAnimation {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
```

would look like [this](https://codepen.io/una/pen/abvYXJX) in JavaScript:

```js
const openAnimation = [
  { transform: 'scale(0)' },
  { transform: 'scale(1)' },
];
```

Where you set parameters for animation in CSS:

```css
.modal {
  animation: openAnimation 1s 1 ease-in;
}
```

you would set in JS:

```js
document.querySelector('.modal').animate(
    openAnimation, {
      duration: 1000, // 1s
      iterations: 1, // single iteration
      easing: 'ease-in' // easing function
    }
);
```

The amount of code is about the same, but with JavaScript, you get a couple of superpowers that you don't have with CSS alone. This includes the ability to sequence effects, and an increased control of their play states.

{% Aside %}
  Hyphenated property names become camel case when used in keyframes (e.g. `background-color` to `backgroundColor`)
{% endAside %}

### Beyond `element.animate()`

However, with the update, the Web Animations API is no longer restricted to animations created via `element.animate()`. We can manipulate CSS animations and transitions as well.

`getAnimations()` is a method that returns all animations on an element regardless of whether it was created via `element.animate()` or via CSS rules (CSS animation or transition). Here is an example of what this looks like:

{% Glitch {
  id: 'waapi-getanimations',
  path: 'index.html',
  height: 480
} %}

You first `"get"` the keyframes for the transition to determine where we are transitioning from. Then, you create two new opacity animations, enabling the   cross fade effect. Once the cross-fade completes, you delete the copy.

## Orchestrating animations with promises

In Chromium 84, you now have two methods that can be used with promises: `animation.ready` and `animation.finished`.

- `animation.ready` enables you to wait for pending changes to take effect (i.e. switching between playback control methods such as play and pause).
- `animation.finished` provides a means of executing custom JavaScript code when an animation is complete.

Let's continue with our example, and create an orchestrated animation chain with `animation.finished`. Here, you have a vertical transformation (`scaleY`), followed by a horizontal transformation (`scaleX`), followed by an opacity change on a child element:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/web-animations/modal-open.mp4">
  </video>
  <figcaption>
    Applying transformations and opacity to an opening modal element. <a href="https://codepen.io/una/pen/dyYKJMz">See Demo on Codepen</a>
  </figcaption>
</figure>

```js/1
const transformAnimation = modal.animate(openModal, openModalSettings);
transformAnimation.finished.then(() => { text.animate(fadeIn, fadeInSettings)});
```

We've chained these animations using `animation.finished.then()` prior to executing the next animation set in the chain. This way, the animations appear in order, and you are even applying effects to different target elements with different options set (such as speed and ease).

Within CSS, this would be cumbersome to recreate, especially when applying unique, yet sequenced animations to multiple elements. You'd have to use a `@keyframe`, sort out the correct timing percentages to place the animations, and use `animation-delay` prior to triggering the animations in the sequence.

### Example: Play, pause, and reverse

What can open, should close! Luckily, since [Chromium 39](https://developer.chrome.com/blog/web-animation-playback/), the Web Animations API has provided us the ability to play, pause, and reverse our animations.

You can take the above animation, and give it a smooth, reversed animation when clicking the button again using `.reverse()`. This way, you can create a smoother and more contextual interaction for our modal.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/web-animations/modal-reverse.mp4">
  </video>
  <figcaption>
    An example of a modal opening and closing upon button click. <a href="https://glitch.com/~waapi-promises">See Demo on Glitch </a>
  </figcaption>
</figure>

{% Glitch {
  id: 'waapi-promises',
  path: 'script.js',
  height: 480
} %}

What you can do is create two play-pending animations (`openModal`, and an inline opacity transformation), and then pause one of the animations, delaying it until the other is finished. You can then use promises to wait for each to be finished before playing. Finally, you can check to see if a flag is set, and then reverse each animation.

### Example: Dynamic interactions with partial keyframes

<figure>
<video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/web-animations/retargetting.mp4">
  </video>  <figcaption>
    Retargeting example, where a mouse click adjusts the animation to a new location. <a href="https://glitch.com/~waapi-retargetting">See Demo on Glitch </a>
  </figcaption>
</figure>

```js
selector.animate([{transform: `translate(${x}px, ${y}px)`}],
    {duration: 1000, fill: 'forwards'});
```

In this example, there is only one keyframe, and no specified start position. This is an example of using **partial keyframes**. The mouse handler does a few things here: it sets a new end location and triggers a new animation. The new start position is inferred from the current underlying position.

New transitions can be triggered while existing ones are still running. This means that the current transition is interrupted, and a new one is created.

## Performance improvements with replaceable animations

When creating animations based on events, such as on `'mousemove'`, a new animation is created each time, which can quickly consume memory and degrade performance.  To address this problem, replaceable animations were introduced in Chromium 83, enabling automated cleanup, where finished animations are flagged as replaceable and automatically removed if replaced by another finished animation. Consider the following example:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/web-animations/comet-trail.mp4">
  </video>
  <figcaption>
  A comet trail animates when the mouse moves. <a href="https://glitch.com/~waapi-replaced">See Demo on Glitch</a>
  </figcaption>
</figure>

 ```js
elem.addEventListener('mousemove', evt => {
  rectangle.animate(
    { transform: translate(${evt.clientX}px, ${evt.clientY}px) },
    { duration: 500, fill: 'forwards' }
  );
});
```

Each time the mouse moves, the browser re-calculates the position for each ball in the comet trail and creates an animation to this new point. The browser now knows to remove old animations (enabling replacement) when:

1. The animation is finished.
2. There is one or more animations higher in composite ordering that are also finished.
3. The new animations are animating the same properties.

You can see exactly how many animations are being replaced by tallying up a counter with each removed animation, using `anim.onremove` to trigger the counter.

There are a few additional methods to take your animation control even further:

- `animation.replaceState()` provides a means of tracking whether an animation is active, persisted, or removed.
- `animation.commitStyles()` updates the style of an element based on the underlying style along with all animations on the element in the composite order.
- `animation.persist()` marks an animation as non-replaceable.

{% Aside %}
  `animation.commitStyles()` and `animation.persist()` are commonly used with compositing modes, such as "add". Check out the composite modes demo below to see them in action.
{% endAside %}

## Smoother animations with composite modes

With the Web Animations API, you can now set the composite mode of your animations, meaning they can be additive or accumulative, in addition to the default mode of "replace". [Composite modes](https://css-tricks.com/additive-animation-web-animations-api/) allow developers to write distinct animations and have control over how effects are combined. Three composite modes are now supported: `'replace'` (the default mode), `'add'`, and `'accumulate'`.

When you composite animations, a developer can write short, distinct effects and see them combined together. In the example below, we are applying a rotation and scale keyframe to each box, with the only adjustment being the composite mode, added as an option:

<figure>
<video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/web-animations/replace-add-accumulate.mp4">
  </video>  <figcaption>
    A demo showing the default, add, and accumulate composite modes. <a href="https://glitch.com/~waapi-composite-demos">See Demo on Glitch</a>
  </figcaption>
</figure>

In the default `'replace'` composite mode, the final animation replaces the transform property and ends up at `rotate(360deg) scale(1.4)`. For `'add'`, composite adds the rotation and multiplies the scale, resulting in a final state of `rotate(720deg) scale(1.96)`. `'accumulate'` combines the transformations, resulting in `rotate(720deg) scale(1.8)`. For more on the intricacies of these composite modes, check out [The CompositeOperation and CompositeOperationOrAuto enumerations](https://www.w3.org/TR/web-animations-1/#the-compositeoperation-enumeration) from the Web Animations spec.

Let's take a look at a UI element example:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/web-animations/dropdown.mp4">
  </video>
  <figcaption>
  A bouncy dropdown menu which has two composited animations applied to it. <a href="https://glitch.com/~waapi-composited">See Demo on Glitch</a>
  </figcaption>
</figure>

Here, two `top` animations are composited. The first is a macro-animation, which moves the dropdown by the full height of the menu itself as a slide-in effect from the top of the page, and the second, a micro-animation, applies a little bounce as it hits the bottom. Using the `'add'` composite mode enables a smoother transition.

```js/12
const dropDown = menu.animate(
    [
      { top: `${-menuHeight}px`, easing: 'ease-in' },
      { top: 0 }
    ], { duration: 300, fill: 'forwards' });

  dropDown.finished.then(() => {
    const bounce = menu.animate(
      [
        { top: '0px', easing: 'ease-in' },
        { top: '10px', easing: 'ease-out' },
        { ... }
      ], { duration: 300, composite: 'add' });
  });
```

### What's next for the Web Animations API

These are all exciting additions to animations capabilities in today's browsers, and even more additions are coming down the pipeline. Check out these future specifications for some further reading on what's coming next:

- [Scroll-linked animations with the Houdini API](https://www.w3.org/TR/css-animation-worklet-1/#scroll-timeline)
- [Mutable timelines](https://drafts.csswg.org/web-animations-2/#setting-the-timeline)
- [Group Effect and Synchronization](https://drafts.csswg.org/web-animations-2/#grouping-and-synchronization)

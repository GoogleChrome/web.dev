---
title: The Web Animations API just hit Chrome stable — here's what you need to know
subhead: Wrangling your web animations is about to get much easier
authors:
  - una
  # - kevin ellis -- add to contributing
date: 2020-05-27
hero: hero.png
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
# thumbnail: thumbnail.png
description: Wrangling your web animations is about to get much easier
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - web animation
  - web animations api
  - waapi
  - chrome 84
---

Adding delightful animations to your website is not only for cosmetic reasons. When used correctly, animations improve user perception and [memory](https://www.researchgate.net/publication/229351931_The_Effects_of_Animation_and_Format_on_the_Perception_and_Memory_of_Online_Advertising) of your brand, guide user actions, but also helps users navigate your application—providing context in a digital space.

And an exciting piece of news: the [Web Animations API](https://www.w3.org/TR/web-animations-1/) has just hit Chrome stable! This API enables developers to incorporate [imperative](https://www.youtube.com/watch?v=WaNoqBAp8NI) animations with JavaScript. It was written to underlie both CSS animation and transition implementations and enable future effects to be developed, as well as existing effects to be composed and timed. This lets us take advantage of CSS animations, but extend those in a way that we can't do with CSS alone.

## Getting Started

With the Web Animations API, we can take advantage of some really great features that allow for more robust animations! Specifically, new features to both the document and individual elements allow for you to pause, rewind, and wait for an animation to end before triggering another animation.

These are hugely beneficial when orchestrating animations for complex components, such as a you may need for a getting started guide or even to just apply multiple, tiered animations to a modal opening.

Let's take a look at an example of creating an animation using the Web Animations API. First, we'll need to create a Keyframe Object. If you're familiar with CSS `@keyframe`s, this is very similar. What might look like [this](https://codepen.io/una/pen/RwWMvPw) in CSS:

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

Would look like [this](https://codepen.io/una/pen/abvYXJX) in JS:

```js
const openAnimation = [
  { transform: 'scale(0)' }, 
  { transform: 'scale(1)' }, 
];
```

Where we set parameters for animation in CSS:

```css
.modal {
  animation: openAnimation 1s 1 ease-in;
}
```

We would set in JS:

```js
document.querySelector('.modal').animate(
    openAnimation ,  {
    duration: 1000, // 1s
    iterations: 1, // single iteration
easing: 'ease-in' // easing function
  }
);
```

So the amount of code is about the same, but with JavaScript, we get a couple of superpowers that we don't have with CSS alone. A few of those are the ability to group effects, and to move within an animation timeline.

## Orchestrating Animations with Promises

Now in Chrome stable, we have two methods that can be used with promises: `animation.ready()` and `animation.finished`

### `Animation.ready`
In web animations, playback control methods such as play and pause are asynchronous and don't immediately take effect. Animation.ready promise allows you to wait for these pending changes to take effect. For example:

```js
slideOutAnimation.play();
slideOutAnimation.ready.then(() => {
  fadeOutAnimation.startTime = slideOutAnimation.startTime + delay;
});
```

### `Animation.finished`
The Animation.finished promise provides a means of executing custom JavaScript code when an animation is complete.  The finished promise may be used as an alternative to fill mode for simple animations. 

```js
box.animate([{transform: 'translateX(100px)' }],
            { duration: 1000 }).finished.then(() => {
  box.style.transform = 'translateY(100px)';
});
```

Let's continue with our previous example, and create an orchestrated animation chain with `animation.finished` and a promise. In this example, we have a vertical transformation (`scaleY`), followed by a horizontal transformation (`scaleX`), followed by an opacity change on a child element: 

[https://codepen.io/una/pen/eYpKEzp](https://codepen.io/una/pen/eYpKEzp) and [https://codepen.io/una/pen/dyYKJMz](https://codepen.io/una/pen/dyYKJMz) (two ways to write it)
-- CODE BLOCK HERE FROM THE ABOVE --

<img src='./modal-open.gif' alt='an opening modal'>

We've chained these animations using `animation.finished.then()` prior to executing the next animation set in the chain. This way, the animations appear in order, and we are even applying effects to different target elements with different options set (such as speed and ease).

Within CSS, this would be cumbersome to recreate. You'd have to use a `@keyframe` and sort out the correct percentages to place the animations, and use animation delays prior to triggering the animations in the sequence. Another factor is applying the animations to different elements (the parents vs the child, for example). This would need to be calculated properly with delays and there's a lot of room for error.

## Grouping Effects with the Animation Timeline

What can open, should close! Luckily, the WAAPI provides us the ability to place code within a robust timeline.

We can take the above animation, place it on a timeline using keyframes, and give it a reversed style when clicking the button again. This way, you get a smoother animation upon opening and closing this modal.


### `Animation.timeline`

`Animation.timeline` returns the timeline for an animation, which may be used to ensure that animations are synchronized on the same timeline when timelines other than the default document timeline are used.

```js
function createSynchronizedAnimation(sourceAnimation, 
                                    keyframeEffect) {
  const animation = new Animation(
      keyframeEffect,   sourceAnimation.timeline);
  animation.currentTime = sourceAnimation.curentTime;
  animation.play();
}
```

Let's re-write our example above with an animation timeline. Doing so will enable us to move along the timeline. With a timeline, our animation demo would look like this:

[ TODO -- HOW TO GET A TIMELINE HAPPENING for https://codepen.io/una/pen/dyYKJMz]

## Play, Pause, Reverse

[TODO:  REVERSE EXAMPLE ]

Timeline example with pause state from Sam Thorogood: https://codepen.io/samthor/pen/mJxPRK?editors=0010

## Replaceable Animations

Fill modes provide a convenient means of 'sticking' the start or end value of an animation, but at a cost.  For a small number of animations, this is not typically a problem, but consider the following example:
 
 ```js
elem.addEventListener('mousemove', evt => {
  circle.animate(
    { transform: translate(${evt.clientX}px, ${evt.clientY}px) },
    { duration: 500, fill: 'forwards' }
  );
});
```

Each time the mousemove event triggers, we create a new animation which can quickly consume memory and degrade performance.  To address this problem, replaceable animations were introduced.  At the risk of oversimplifying the replacement rules, when the effect of an animation in the finished state is overridden by another finished animation, it is removed from the set of active animations.  No additional JavaScript code is needed to take advantage of this replacement process; however, methods have been introduced into the API to provide better control over the replacement process and are described below.

### `animation.commitStyles`
The commitStyles method updates the style of an element based on underlying style along with all animations on the element up to the target animation in composite ordering. This is particularly useful in cases where the resulting value is non-trivial to calculate. Returning to our previous example:

```js
elem.addEventListener('mousemove', evt => {
  const animation = 
    circle.animate(
      { transform: `translate(${evt.clientX}px, ${evt.clientY}px)` },
      { duration: 500 });
  animation.finished.then(() => {
    animation.commitStyles();
    animation.cancel();
  });
});
```
 
### `animation.persist`
The persist method marks an animation as non-replaceable. Persisting an animation is useful when used in conjunction with composite modes 'add' or 'accumulate'.

```js
box.animate([{transform: 'translateX(100px)' }], 
            { duration: 1000, fill: 'forwards' }).persist();
box.animate([{transform: 'translateX(100px)', composite: 'add' }], 
            { duration: 1000, fill: 'forwards' });
```
 
In this example, the persist method prevents the first animation from being removed and resulting transformation is between 0 and 200px.  Composite modes are described in more detail below.  Caution should be exercised when using persist as resources for these animations can only be reclaimed once the animation is cancelled.

### `animation.onremove`

With the onremove event handler, we can run custom JavaScript code when an animation is replaced. This handler provides a convenient place for commitStyles to be called, and has the advantage of not requiring "persist" or "cancel".  Our" persist" example from above, becomes:

```
const base = box.animate([{transform: 'translateX(100px)' }], 
                         { duration: 1000, fill: 'forwards' });
box.animate([{transform: 'translateX(100px)', composite: 'add' }], 
            { duration: 1000, fill: 'forwards' });
base.onRemove = () => { base.commitStyles(); });
```

### `animation.replaceState`

The replaceState attribute provides a means of tracking whether an animation is active, persisted or removed.  Animations that are explicitly marked as persisted, are not flagged as replaceable, and thus not automatically removed.  The following example shows one method for clean up of persisted animations: 

```
function commitPersistedAnimations() {
  document.getAnimations().forEach((anim) => {
    if (anim.playState == 'finished' && 
        anim.replaceState == 'persisted') {
    anim.commitStyles();
    anim.cancel();
  });
}
```

## Compositing Animations

### Replaceable Animations

Fill modes provide a convenient means of 'sticking' the start or end value of an animation, but at a cost.   For a small number of animations, this is not typically a problem, but consider the following example:
 
```js
elem.addEventListener('mousemove', evt => {
  circle.animate(
    { transform: translate(${evt.clientX}px, ${evt.clientY}px) },
    { duration: 500, fill: 'forwards' }
  );
});
```

Each time the mousemove event triggers, we create a new animation which can quickly consume memory and degrade performance.  To address this problem, replaceable animations were introduced.  At the risk of oversimplifying the replacement rules, when the effect of an animation in the finished state is overridden by another finished animation, it is removed from the set of active animations.  No additional JavaScript code is needed to take advantage of this replacement process; however, methods have been introduced into the API to provide better control over the replacement process and are described below.
animation.commitStyles

The commitStyles method updates the style of an element based on underlying style along with all animations on the element up to the target animation in composite ordering. This is particularly useful in cases where the resulting value is non-trivial to calculate. Returning to our previous example:

```js
elem.addEventListener('mousemove', evt => {
  const animation = 
    circle.animate(
      { transform: `translate(${evt.clientX}px, ${evt.clientY}px)` },
      { duration: 500 });
  animation.finished.then(() => {
    animation.commitStyles();
    animation.cancel();
  });
});
```
 
### `animation.persist`
The persist method marks an animation as non-replaceable. Persisting an animation is useful when used in conjunction with composite modes 'add' or 'accumulate'.

```js
box.animate([{transform: 'translateX(100px)' }], 
            { duration: 1000, fill: 'forwards' }).persist();
box.animate([{transform: 'translateX(100px)', composite: 'add' }], 
            { duration: 1000, fill: 'forwards' });
```

In this example, the persist method prevents the first animation from being removed and resulting transformation is between 0 and 200px.  Composite modes are described in more detail below.  Caution should be exercised when using persist as resources for these animations can only be reclaimed once the animation is cancelled.
animation.onremove

With the onremove event handler, we can run custom JavaScript code when an animation is replaced. This handler provides a convenient place for commitStyles to be called, and has the advantage of not requiring "persist" or "cancel".  Our" persist" example from above, becomes:

```js
const base = box.animate([{transform: 'translateX(100px)' }], 
                         { duration: 1000, fill: 'forwards' });
box.animate([{transform: 'translateX(100px)', composite: 'add' }], 
            { duration: 1000, fill: 'forwards' });
base.onRemove = () => { base.commitStyles(); });
```

### `animation.replaceState`

The replaceState attribute provides a means of tracking whether an animation is active, persisted or removed.  Animations that are explicitly marked as persisted, are not flagged as replaceable, and thus not automatically removed.  The following example shows one method for clean up of persisted animations: 

```js
function commitPersistedAnimations() {
  document.getAnimations().forEach((anim) => {
    if (anim.playState == 'finished' && 
        anim.replaceState == 'persisted') {
    anim.commitStyles();
    anim.cancel();
  });
}
```

## What Else is New

### `KeyframeEffect.(get|set)Keyframes`
The getKeyframes and setKeyframes methods provide access to and control over the keyframes associated with an effect,  which makes it possible to customize the interpolation behavior of an animation.  For example, tweaking the easing function may be insufficient to achieve the desired animation effect for a transition, potentially necessitating the injection of intermediate keyframes.  This effect can be achieved as follows:

```js
function TweakPropertyInterpolation(propertyName, tweaker) {
  const handler = evt => {
    if (evt.propertyName !== propertyName)
      return;
    const transition = 
        evt.target.getAnimations().
            find(animation => animation.transitionProperty ===
                propertyName);
    const keyframes = transition.effect.getKeyframes();
    const replacementKeyframes = tweaker(keyframes);
    transition.effect.setKeyframes(replacementKeyframes);
  };
  document.addEventListener('transitionrun', handler);
}
```

### `KeyframeEffect.pseudoElement`

The pseudoElement attribute may be used to associate a keyframe effect with a pseudo-element selector on the target element.  The following example illustrates a means of adding an animation effect when a button is clicked.

```css
button::after {
  content: "";
  background: linear-gradient(...);
  …
}  
```

```js
button.onclick = evt => {
  const sheenEffect = new KeyframeEffect(
    evt.target,
    [
      { transform: 'translate(-5em, 7em)' },
      { transform: 'translate(1em, -9em)' }
    ],
    { duration: 600 });
  sheenEffect.pseudoElement = '::after';
  const animation = new Animation(sheenEffect, document.timeline);
  animation.play();
};
```

### `Document|Element|ShadowRoot.getAnimations`

The getAnimations methods return a list of all relevant animations attached to the document, element or shadow root. The list of animations includes not only animations created via Element.animate, but CSS animations and transitions as well; providing a mechanism for programmatically customizing the behavior of animations regardless how they were created.

```js
function accelerate() {
  document.getAnimations().forEach(animation => {
    animation.playbackRate = 2 * animation.playbackRate;
  });
}
```

This example doubles the playback rate of all active animations that target elements within the document, regardless of type.

-- maybe --

## Animation Guidelines

Let's quickly go over a few considerations when adding animation to your web experiences.

Provide a reduced-animation option for folks with vestibular impairments or for those who simple prefer fewer animations
For most cases, you'll likely want to use easing curves to imitate natural movements rather than the default linear movement. This will make your animations feel more fluid.


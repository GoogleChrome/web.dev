---
title: Building a toast component
subhead: A foundational overview of how to build an adaptive and accessible toast component.
authors:
  - adamargyle
description: A foundational overview of how to build an adaptive and accessible toast component.
date: 2021-12-08
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/kVA6GT6GamdvCskUpLme.png
alt: A few toast examples like 'In cart' and 'Added to Playlist'.
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/KvDOz8UzG3yLfDkkqqsI.png
tags:
  - blog
  - css
  - dom
  - javascript
---

In this post I want to share thinking on how to build a toast component. Try the
[demo](https://gui-challenges.web.app/toast/dist/).

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/HuT5ZhOBd9ZPMcxR8W92.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    <a href="https://gui-challenges.web.app/toast/dist/">Demo</a>
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'R75ZVW4LW5o' %}

## Overview

Toasts are non-interactive, passive, and asynchronous short messages for users.
Generally they are used as an interface feedback pattern for informing the user
about the results of an action.

{% Aside %} [Toast
component](https://developer.android.com/guide/topics/ui/notifiers/toasts) on
Android {% endAside %}

### Interactions

Toasts are unlike notifications,
[alerts](https://developer.mozilla.org/docs/Web/API/Window/alert) and
[prompts](https://developer.mozilla.org/docs/Web/API/Window/prompt) because
they're not interactive; they're not meant to be dismissed or persist.
Notifications are for more important information, synchronous messaging that
requires interaction, or system level messages (as opposed to page level).
Toasts are more passive than other notice strategies.

## Markup

The
[`<output>`](https://html.spec.whatwg.org/multipage/form-elements.html#the-output-element)
element is a good choice for the toast because it is announced to screen
readers. Correct HTML provides a safe base for us to enhance with JavaScript and
CSS, and there will be lots of JavaScript. 

### A toast

```html
<output class="gui-toast">Item added to cart</output>
```

It can be [more
inclusive](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html#:~:text=WCAG%20success%20criteria.-,Inclusive%20UX%20of%20a%20toast,-A%20toast%20component)
by adding [`role="status"`](https://w3c.github.io/aria/#status). This provides a
fallback if the browser doesn't give `<output>` elements the [implicit
role](https://developer.mozilla.org/docs/Web/HTML/Element/output#:~:text=accepts%20phrasing%20content.-,Implicit%20ARIA%20role,-status)
per the spec. 

```html
<output role="status" class="gui-toast">Item added to cart</output>
```

### A toast container

More than one toast can be shown at a time. In order to orchestrate multiple
toasts, a container is used. This container also handles the position of the
toasts on the screen.

```html
<section class="gui-toast-group">
  <output role="status">Wizard Rose added to cart</output>
  <output role="status">Self Watering Pot added to cart</output>
</section>
```

## Layouts

I chose to pin toasts to the
[`inset-block-end`](https://developer.mozilla.org/docs/Web/CSS/inset-block-end)
of the viewport, and if more toasts are added, they stack from that screen edge.

### GUI container 

The toasts container does all the layout work for presenting toasts. It's
`fixed` to the viewport and uses the logical property
[`inset`](https://developer.mozilla.org/docs/Web/CSS/inset) to specify which
edges to pin to, plus a little bit of `padding` from the same `block-end` edge.

```css
.gui-toast-group {
  position: fixed;
  z-index: 1;
  inset-block-end: 0;
  inset-inline: 0;
  padding-block-end: 5vh;
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/yJfP9FLqpngoR9zIm35J.png", alt="Screenshot with DevTools box size and padding overlayed on a .gui-toast-container element.", width="800", height="248" %}

In addition to positioning itself within the viewport, the toast container is a
grid container that can align and distribute toasts. Items are centered as a
group with `justify-content` and individually centered with `justify-items`.
Throw in a little bit of `gap` so toasts don't touch.

```css
.gui-toast-group {
  display: grid;
  justify-items: center;
  justify-content: center;
  gap: 1vh;
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/kaTSVr7KToPBYqDXKE4T.png",
alt="Screenshot with the CSS grid overlay on the toast group, this time
highlighting the space and gaps between toast child elements.", width="800",
height="292" %}

### GUI Toast

An individual toast has some `padding`, some softer corners with
[`border-radius`](https://developer.mozilla.org/docs/Web/CSS/border-radius),
and a [`min()`](https://developer.mozilla.org/docs/Web/CSS/min()) function to
aid in mobile and desktop sizing. The responsive size in the following CSS
prevents toasts growing wider than 90% of the viewport or
[`25ch`](https://developer.mozilla.org/docs/Web/CSS/length).

```css
.gui-toast {
  max-inline-size: min(25ch, 90vw);
  padding-block: .5ch;
  padding-inline: 1ch;
  border-radius: 3px;
  font-size: 1rem;
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/fxZbpWDiuZCfpY2Cxq6A.png",
alt="Screenshot of a single .gui-toast element, with the padding and border
radius shown.", width="800", height="223" %}

## Styles

With layout and positioning set, add CSS that helps with adapting to user
settings and interactions.

### Toast container

Toasts are not interactive, tapping or swiping on them doesn't do anything, but
they do currently consume pointer events. Prevent the toasts from stealing
clicks with the following CSS.

```css
.gui-toast-group {
  pointer-events: none;
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/3uDub8eM8qYAepz6lbX0.mp4",
  autoplay="true",
  loop="true",
  muted="true" %}

### GUI Toast

Give the toasts a light or dark adaptive theme with custom properties, HSL and a
preference media query.

```css
.gui-toast {
  --_bg-lightness: 90%;

  color: black;
  background: hsl(0 0% var(--_bg-lightness) / 90%);
}

@media (prefers-color-scheme: dark) {
  .gui-toast {
    color: white;
    --_bg-lightness: 20%;
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/AUzcAPLccQdvIL2bR3pd.mp4",
  autoplay="true",
  loop="true",
  muted="true" %}

### Animation

A new toast should present itself with an animation as it enters the screen.
Accommodating reduced motion is done by setting `translate` values to `0` by
default, but updating the motion value to a length in a motion preference media
query . Everyone gets some animation, but only some users have the toast travel
a distance.

Here are the keyframes used for the toast animation. CSS will be controlling the
entrance, the wait, and the exit of the toast, all in one animation. 

```css
@keyframes fade-in {
  from { opacity: 0 }
}

@keyframes fade-out {
  to { opacity: 0 }
}

@keyframes slide-in {
  from { transform: translateY(var(--_travel-distance, 10px)) }
}
```

The toast element then sets up the variables and orchestrates the keyframes.

```css
.gui-toast {
  --_duration: 3s;
  --_travel-distance: 0;

  will-change: transform;
  animation: 
    fade-in .3s ease,
    slide-in .3s ease,
    fade-out .3s ease var(--_duration);
}

@media (prefers-reduced-motion: no-preference) {
  .gui-toast {
    --_travel-distance: 5vh;
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/QeeF8vZ5gbXrxfp7EjRf.mp4",
  autoplay="true",
  loop="true",
  muted="true" %}

## JavaScript

With the styles and screen reader accessible HTML ready, JavaScript is needed to
orchestrate the creation, addition, and destruction of toasts based on user
events. The developer experience of the toast component should be minimal and
easy to get started with, like this:

```js
import Toast from './toast.js'

Toast('My first toast')
```

### Creating the toast group and toasts

When the toast module loads from JavaScript, it must create a toast container
and add it to the page. I chose to add the element before `body`, this will make
`z-index` stacking issues unlikely as the container is above the container for
all the body elements. 

```js
const init = () => {
  const node = document.createElement('section')
  node.classList.add('gui-toast-group')

  document.firstElementChild.insertBefore(node, document.body)
  return node
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/3O34m8U5Z6BsLUwzcKDx.png",
alt="Screenshot of the toast group between the head and body tags.",
width="800", height="308" %}

The `init()` function is called internally to the module, stashing the element
as `Toaster`:

```js
const Toaster = init()
```

Toast HTML element creation is done with the `createToast()` function. The
function requires some text for the toast, creates an `<output>` element, adorns
it with some classes and attributes, sets the text, and returns the node.

```js
const createToast = text => {
  const node = document.createElement('output')
  
  node.innerText = text
  node.classList.add('gui-toast')
  node.setAttribute('role', 'status')

  return node
}
```

### Managing one or many toasts

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/3slAqrQiWDmnBnEgSPYz.mp4",
  autoplay="true",
  loop="true",
  muted="true" %}

JavaScript now adds a container to the document for containing toasts and is
ready to add created toasts. The `addToast()` function orchestrates handling one
or many toasts. First checking the number of toasts, and whether motion is ok,
then using this information to either append the toast or do some fancy
animation so the other toasts appear to "make room" for the new toast.

```js
const addToast = toast => {
  const { matches:motionOK } = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  )

  Toaster.children.length && motionOK
    ? flipToast(toast)
    : Toaster.appendChild(toast)
}
```

When adding the first toast, `Toaster.appendChild(toast)` adds a toast to the
page triggering the CSS animations: animate in, wait `3s`, animate out.
`flipToast()` is called when there are existing toasts, employing a technique
called [FLIP](https://aerotwist.com/blog/flip-your-animations/) by [Paul
Lewis](https://twitter.com/aerotwist). The idea is to calculate the difference
in positions of the container, before and after the new toast has been added.
Think of it like marking where the Toaster is now, where it's going to be, then
animating from where it was to where it is. 

{% Aside 'key-term' %}
FLIP stands for: First, Last, Invert, and Play. A handy acronym to assist in understanding the animation concept.
{% endAside %}

```js
const flipToast = toast => {
  // FIRST
  const first = Toaster.offsetHeight

  // add new child to change container size
  Toaster.appendChild(toast)

  // LAST
  const last = Toaster.offsetHeight

  // INVERT
  const invert = last - first

  // PLAY
  const animation = Toaster.animate([
    { transform: `translateY(${invert}px)` },
    { transform: 'translateY(0)' }
  ], {
    duration: 150,
    easing: 'ease-out',
  })
}
```

CSS grid does the lifting of the layout. When a new toast is added, grid puts it
at the start and spaces it with the others. Meanwhile, a [web
animation](https://developer.mozilla.org/docs/Web/API/Web_Animations_API) is
used to animate the container from the old position. 

### Putting all the JavaScript together 

When `Toast('my first toast')` is called, a toast is created, added to the page
(maybe even the container is animated to accommodate the new toast), a
[promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
is returned and the created toast is
[watched](https://developer.mozilla.org/docs/Web/API/Element/getAnimations) for
CSS animation completion (the three keyframe animations) for promise resolution.


```js
const Toast = text => {
  let toast = createToast(text)
  addToast(toast)

  return new Promise(async (resolve, reject) => {
    await Promise.allSettled(
      toast.getAnimations().map(animation => 
        animation.finished
      )
    )
    Toaster.removeChild(toast)
    resolve() 
  })
}
```

I felt the confusing part of this code is in the `Promise.allSettled()` function
and `toast.getAnimations()` mapping. Since I used multiple keyframe animations
for the toast, to confidently know all of them have finished, each must be
requested from JavaScript and each of their
[`finished`](https://developer.mozilla.org/docs/Web/API/Animation/finished)
promises observed for completion.
[`allSettled`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
does that work for us, resolving itself as complete once all of its promises
have been fulfilled. Using `await Promise.allSettled()` means the next line of
code can confidently remove the element and assume the toast has completed its
lifecycle. Finally, calling `resolve()` fulfills the high level Toast promise so
developers can clean up or do other work once the toast has shown.

```js
export default Toast
```

Last, the `Toast` function is exported from the module, for other scripts to
import and use.

### Using the Toast component

Using the toast, or the toast's developer experience, is done by importing the
`Toast` function and calling it with a message string.

```js
import Toast from './toast.js'

Toast('Wizard Rose added to cart')
```

If the developer wants to do clean up work or whatever, after the toast has
shown, they can use async and
[await](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await).


```js
import Toast from './toast.js'

async function example() {
  await Toast('Wizard Rose added to cart')
  console.log('toast finished')
}
```

## Conclusion

Now that you know how I did it, how would you‽ 🙂 

Let's diversify our approaches and learn all the ways to build on the web.
Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

- [@_developit](https://twitter.com/_developit) with HTML/CSS/JS: [demo & code](https://jsfiddle.net/developit/v293tnaj/)
- [Joost van der Schee](https://twitter.com/jhvanderschee) with HTML/CSS/JS: [demo & code](https://codepen.io/joosts/pen/PoJzGpm)

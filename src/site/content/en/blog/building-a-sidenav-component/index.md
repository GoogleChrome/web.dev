---
layout: post
title: Building a sidenav component
subhead: A foundational overview of how to build a responsive slide out sidenav
authors:
  - adamargyle
description: A foundational overview of how to build a responsive slide out sidenav
date: 2021-01-21
hero: image/admin/Zo1KkESK9CfEIYpbWzap.jpg
thumbnail: image/admin/pVZO6FsC9tF3H6QIWpY2.png
codelabs: codelab-building-a-sidenav-component
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

In this post I want to share with you how I prototyped a Sidenav component for the web that 
is responsive, stateful, supports keyboard navigation, works with and without Javascript, 
and works across browsers. Try the [demo](https://gui-challenges.web.app/sidenav/dist/).

If you prefer video, here's a YouTube version of this post:

{% YouTube 'uiZqDLqjGRY' %}

## Overview

It's tough building a responsive navigation system. Some users will be on a keyboard, 
some will have powerful desktops, and some will visit from a small mobile device. 
Everyone visiting should be able to open and close the menu. 

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/desktop-demo-1080p.mp4">
  </video>
  <figcaption class="w-figure">
    Desktop to mobile responsive layout demo
  </figcaption>
</figure>

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/mobile-demo-1080p.mp4">
  </video>
  <figcaption class="w-figure">
    Light and dark theme down on iOS and Android
  </figcaption>
</figure>

## Web Tactics

In this component exploration I had the joy of combining a few critical web platform features:

1. CSS [`:target`](#target-psuedo-class)
2. CSS [grid](#grid-stack)
3. CSS [transforms](#transforms)
4. CSS Media Queries for viewport and user preference
5. JS for `focus` [UX enhancements](#ux-enhancements)

My solution has one sidebar and toggles only when at a "mobile" viewport of `540px` or less. 
`540px` will be our breakpoint for switching between the mobile interactive layout and the static desktop layout.

### CSS `:target` pseudo-class {: #target-psuedo-class }

One `<a>` link sets the url hash to `#sidenav-open` and the other to empty (`''`). 
Lastly, an element has the `id` to match the hash: 

```html
<a href="#sidenav-open" id="sidenav-button" title="Open Menu" aria-label="Open Menu">

<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<aside id="sidenav-open">
  …
</aside>
```

Clicking each of these links changes the hash state of our page URL, 
then with a pseudo-class I show and hide the sidenav:

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
  }

  #sidenav-open:target {
    visibility: visible;
  }
}
```

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/hash-change.mp4">
  </video>
</figure>

### CSS Grid {: #grid-stacks }

In the past, I only used absolute or fixed position 
sidenav layouts and components. Grid though, with its `grid-area` syntax, 
lets us assign multiple elements to the same row or column.

#### Stacks

The primary layout element `#sidenav-container` is a grid that creates 1 row and 2 columns, 
1 of each are named `stack`. When space is constrained, CSS assigns all of the `<main>` element's 
children to the same grid name, placing all elements into the same space, creating a stack.

```css
#sidenav-container {
  display: grid;
  grid: [stack] 1fr / min-content [stack] 1fr;
  min-height: 100vh;
}

@media (max-width: 540px) {
  #sidenav-container > * {
    grid-area: stack;
  }
}
```

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/responsive-stack-demo-1080p.mp4">
  </video>
</figure>

#### Menu backdrop

The `<aside>` is the animating element that contains the side navigation. It has
2 children: the navigation container `<nav>` named `[nav]` and a backdrop `<a>`
named `[escape]`, which is used to close the menu. 

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

Adjust `2fr` & `1fr` to find the ratio you like for the menu overlay and its negative space close button.

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/overlay-escape-ratio.mp4">
  </video>
  <figcaption class="w-figure">
    A demo of what happens when you change the ratio.
  </figcaption>
</figure>

### CSS 3D transforms & transitions {: #transforms }

Our layout is now stacked at a mobile viewport size. Until I add some new styles, 
it's overlaying our article by default. Here's some UX I'm shooting for in this next section:

- Animate open and close
- Only animate with motion if the user is OK with that
- Animate `visibility` so keyboard focus doesn't enter the offscreen element

As I begin to implement motion animations, I want to start with accessibility top of mind.

#### Accessible motion

Not everyone will want a slide out motion experience. In our solution this preference 
is applied by adjusting a `--duration` CSS variable inside a media query. This media query value represents 
a user's operating system preference for motion (if available).

```css
#sidenav-open {
  --duration: .6s;
}

@media (prefers-reduced-motion: reduce) {
  #sidenav-open {
    --duration: 1ms;
  }
}
```

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/prefers-reduced-motion.mp4">
  </video>
  <figcaption class="w-figure">
    A demo of the interaction with and without duration applied.
  </figcaption>
</figure>

Now when our sidenav is sliding open and closed, if a user prefers reduced motion, 
I instantly move the element into view, maintaining state without motion. 

#### Transition, transform, translate

##### Sidenav out (default)

To set the default state of our sidenav on mobile to an offscreen state, 
I position the element with `transform: translateX(-110vw)`. 

Note, I added another `10vw` to the typical offscreen code of `-100vw`, 
to ensure the `box-shadow` of the sidenav doesn't peek into the main viewport when it's hidden.

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
    transform: translateX(-110vw);
    will-change: transform;
    transition: 
      transform var(--duration) var(--easeOutExpo),
      visibility 0s linear var(--duration);
  }
}
```

##### Sidenav in

When the `#sidenav` element matches as `:target`, set the `translateX()` position to homebase `0`, 
and watch as CSS slides the element from its out position of `-110vw`, to its "in" 
position of `0` over `var(--duration)` when the URL hash is changed. 

```css
@media (max-width: 540px) {
  #sidenav-open:target {
    visibility: visible;
    transform: translateX(0);
    transition: 
      transform var(--duration) var(--easeOutExpo);
  }
}
```

#### Transition visibility

The goal now is to hide the menu from screenreaders when it's out, 
so systems don't put focus into an offscreen menu. I accomplish this by setting a 
visibility transition when the `:target` changes.

- When going in, don't transition visibility; be visible right away so I can see the element slide in and accept focus. 
- When going out, transition visibility but delay it, so it flips to `hidden` at the end of the transition out.

### Accessibility UX enhancements {: #ux-enhancements }

#### Links

This solution relies on changing the URL in order for the state to be managed. 
Naturally, the `<a>` element should be used here, and it gets some nice accessibility 
features for free. Let's adorn our interactive elements with labels clearly articulating intent.

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
  <svg>...</svg>
</a>
```

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/keyboard-voiceover.mp4">
  </video>
  <figcaption class="w-figure">
    A demo of the voiceover and keyboard interaction UX.
  </figcaption>
</figure>

Now our primary interaction buttons clearly state their intent for both mouse and keyboard.

#### `:is(:hover, :focus)`

This handy CSS functional pseudo-selector lets us swiftly be inclusive 
with our hover styles by sharing them with focus as well.

```css
.hamburger:is(:hover, :focus) svg > line {
  stroke: hsl(var(--brandHSL));
}
```

#### Sprinkle on Javascript 

##### Press `escape` to close

The `Escape` key on your keyboard should close the menu right? Let's wire that up.

```js
const sidenav = document.querySelector('#sidenav-open');

sidenav.addEventListener('keyup', event => {
  if (event.code === 'Escape') document.location.hash = '';
});
```

##### Focus UX

The next snippet helps us put focus on the open and close buttons after 
they open or close. I want to make toggling easy. 

```js
sidenav.addEventListener('transitionend', e => {
  const isOpen = document.location.hash === '#sidenav-open';

  isOpen
      ? document.querySelector('#sidenav-close').focus()
      : document.querySelector('#sidenav-button').focus();
})
```

When the sidenav opens, focus the close button. When the sidenav closes, 
focus the open button. I do this by calling `focus()` on the element in JavaScript.

### Conclusion

Now that you know how I did it, how would you?! This makes for some fun component architecture! 
Who's going to make the 1st version with slots? 🙂

Let's diversify our 
approaches and learn all the ways to build on the web. Create a [Glitch](https://glitch.com), 
[tweet me](https://twitter.com/argyleink) your version, and I'll add it to the 
[Community remixes](#community-remixes) section below.

## Community remixes

- [@_developit](https://twitter.com/_developit) with custom elements: [demo & code](https://glitch.com/edit/#!/app-drawer)
- [@mayeedwin1](https://twitter.com/mayeedwin1) with HTML/CSS/JS: [demo & code](https://glitch.com/edit/#!/maye-gui-challenge)
- [@a_nurella](https://twitter.com/a_nurella) with a Glitch Remix: [demo & code](https://glitch.com/edit/#!/sidenav-with-adam)
- [@EvroMalarkey](https://twitter.com/EvroMalarkey) with HTML/CSS/JS: [demo & code](https://evromalarkey.github.io/scrollsnap-drawer/index.html)

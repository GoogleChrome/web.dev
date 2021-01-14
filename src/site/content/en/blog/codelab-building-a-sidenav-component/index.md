---
layout: codelab
title: "Codelab: Building a Sidenav component"
authors:
  - adamargyle
description: |
  Learn how to build a responsive slide out side navigation layout component.
date: 2020-11-25
hero: hero.jpg
thumbnail: thumb.png
glitch: gui-challenges-sidenav-lab
glitch_path: app/index.html
related_post: building-a-sidenav-component
tags:
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

This codelab teaches you how to build a responsive slide out side navigation layout component
on the web. We'll build the component as we go, starting with HTML, then CSS,
then JavaScript.

Check out my blog post [Building a Sidenav component](/building-a-sidenav-component)
to learn about the CSS web platform features chosen for building this component.

{% YouTube 'PzvdREGR0Xw' %}

## Setup

{% Instruction 'remix', 'ol' %}
1. Open `app/index.html`.

## HTML

First, get the essentials of the HTML setup so there's content and some boxes to work with.
I'll be using an `<aside>` to hold the navigation menu, and a `<main>` to hold the primary page content. 
Drop the following HTML into the body tag.

```html
<aside></aside>
<main></main>
```

Next I'll fill in those semantic elements with the rest of the page content. Add a 
navigation element, some nav links and a close link. 

```html/1-14
<aside>
  <nav>
    <h4>My</h4>
    <a href="#">Dashboard</a>
    <a href="#">Profile</a>
    <a href="#">Preferences</a>
    <a href="#">Archive</a>

    <h4>Settings</h4>
    <a href="#">Accessibility</a>
    <a href="#">Theme</a>
    <a href="#">Admin</a>
  </nav>
  
  <a href="#"></a>
</aside>
```

In the main content element, I added a header and an article to semantically hold the layout content. 
The header will have the menu open button, we'll show and hide it based on viewport size soon. The aside 
has the close button.

```html/1-14
<main>
  <header>
    <a href="#sidenav-open">
      <svg viewBox="0 0 50 40">
        <line x1="0" x2="100%" y1="10%" y2="10%" />
        <line x1="0" x2="100%" y1="50%" y2="50%" />
        <line x1="0" x2="100%" y1="90%" y2="90%" />
      </svg>
    </a>
    <h1>Site Title</h1>
  </header>

  <article>
    {put some placeholder content here}
  </article>
</main>
```

So far I've added an aside element, with a nav, links and a way to close the sidenav. 
Also added a header, a way to open the sidenav, and an article to the main element. 
This is clean, semantic and pretty timeless already, but next I want to 
go sprinkle on some accessibility sugar, to make it clean and clear for everyone.

The open link in the sidenav could be more clearly marked. Here's how I did that.

```html//0
<a href="#sidenav-open">
<a href="#sidenav-open" title="Open Menu" aria-label="Open Menu">
```

The open SVG icon for the sidenav could be more clearly marked. Here's how I did that.

```html//0
<svg viewBox="0 0 50 40">
<svg viewBox="0 0 50 40" role="presentation" focusable="false" aria-label="trigram for heaven symbol">
```

The close link in the sidenav could be more clearly marked. 

```html//0
<a href="#"></a>
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>
```

## CSS

Time to layout the elements. The main content 
and sidenav are inside the `<body>` tag, so I started with their layout. Add the following 
CSS into `css/sidenav.css` so the body element positions the children.

```css
body {
  display: grid;
  grid: [stack] 1fr / min-content [stack] 1fr;

  @media (max-width: 540px) {
    & > :matches(aside, main) {
      grid-area: stack;
    }
  }
}
```

This layout essentially says: Create a named row "stack" with everything in it, 
and 2 columns in that row, the 2nd of which is named "stack" also. The 1st column 
should be sized by it's minimal content needs, and the 2nd column can take up the rest. 
Then, if in a constrained viewport of `540px` or less, put the sidenav and main content elements 
into the same row and column, resulting in them being on top of each other.

With this as a base, I can now leverage the state of the url bar to toggle the 
visibility and transition style of the sidenav. Speaking of which, I need to update the 
HTML to enable CSS to hook into this feature.

```html//0
<aside>
<aside id="sidenav-open">
```

Now the element's ID can match the url hash we'll be setting. Next I added IDs for 
key elements that control the sidenav.

```html//0
<a href="#sidenav-open" title="Open Menu" aria-label="Open Menu">
<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
```

With the macro layout done, time to style the micro sidenav components.

The `<aside>` has a neat layout too. It has 2 children, a `<nav>` which is the paper like looking 
component that slides out, and a closing `<a>` link element that sets the url has to '#'. 
The link is invisible to the right of the paper slide out nav, it's so folks can "click off" the visual 
component to dismiss it. Here's how I accomplished that with grid.

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

I thought the ratio was a really nice touch here, where grid could shine and give a 
designer a lot of control.

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/overlay-escape-ratio.mp4">
  </video>
</figure>

Next I need to conditionally overlay the main content and persist my position 
through any document scrolling. This is a great job for `position: sticky` and 
some `overscroll-behavior`. Go ahead and open the side menu after scrolling the page, 
or try scrolling the page while the sidenav is open. What do you think?

Here's how I accomplished that:

```css/4-12
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;

  @media (max-width: 540px) {
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow: hidden auto;
    overscroll-behavior: contain;

    visibility: hidden; /* not keyboard accessible when closed */
  }
}
```

```css/6-8
#sidenav-open {
  ...

  @media (max-width: 540px) {
    ...
    
    &:target {
      visibility: visible;
    }
  }
}
```

I also only need the open and close buttons when at a mobile layout, let's 
manage them with CSS and a media query as well.

```css
#sidenav-button,
#sidenav-close {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  touch-action: manipulation;

  @media (min-width: 540px) {
    display: none;
  }
}
```

For some flair, let's add CSS transforms with respectful accessibility.

```css
#sidenav-open {
  --easeOutExpo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration: .6s;

  ...

  @media (max-width: 540px) {
    ...

    transform: translateX(-110vw);
    will-change: transform;
    transition: 
      transform var(--duration) var(--easeOutExpo),
      visibility 0s linear var(--duration);
    
    &:target {
      visibility: visible;
      transform: translateX(0);
      transition: transform var(--duration) var(--easeOutExpo);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    --duration: 1ms;
  }
}
```

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/prefers-reduced-motion.mp4">
  </video>
  <figcaption class="w-figure">
    demo of the interaction with and without duration applied based on `prefers-reduced-motion` media query
  </figcaption>
</figure>

### Sprinkle in some Javascript

The `esc` key should close the menu. I add this by listening for a key event on the sidenav element, 
and if it's "Escape", than I set the url hash to empty, making the sidenav transition out.

```js
const sidenav = document.querySelector('#sidenav-open')

sidenav.addEventListener('keyup', e => {
  if (e.code === 'Escape')
    document.location.hash = ''
})
```

This next piece of UX is focus management. I want to make opening and closing easy, so I wait 
until the sidenav has finished a transition of some kind, then cross check it against the 
url hash to determine if it's in or out. I then use javascript to set the focus on the button 
complimentary to the one they just pressed.

```js
const closenav = document.querySelector('#sidenav-close')
const opennav = document.querySelector('#sidenav-button')

sidenav.addEventListener('transitionend', e => {
  if (e.propertyName !== 'transform')
    return

  const isOpen = document.location.hash === '#sidenav-open'

  isOpen
    ? closenav.focus()
    : opennav.focus()
})
```

## Try it out

{% Instruction 'preview' %}

## Conclusion

That's a wrap up for the needs I had with the component. Feel free to build upon
it, drive it with data, and in general make it yours! There's always more to add 
or more use cases to cover. 

Open up `css/brandnav.css` to check out the non-layout related styles that I applied to 
this component. I didn't feel it was important to the featureset I was focusing on, and I 
hoped that separating styles from layout would encourage copy and paste. There could 
be more learning for you there!

How do you make slide out responsive sidenav components? 
Do you ever have more than 1, like one on both sides? I'd love to feature your solution 
in a YouTube video, make sure to tweet or comment with your code, it'll help everyone 
out!
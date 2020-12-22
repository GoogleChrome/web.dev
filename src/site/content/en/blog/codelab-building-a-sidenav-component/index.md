---
layout: codelab
title: "Codelab: Building a Sidenav component"
authors:
  - adamargyle
description: |
  Learn how to build a responsive slide out side navigation layout component.
date: 2020-11-25
hero: hero.jpg
thumbnail: thumb.jpg
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
to learn about the CSS tools chosen for building this component.

{% YouTube 'PzvdREGR0Xw' %}

## Setup

{% Instruction 'remix', 'ol' %}
1. Open `app/index.html`.

## HTML

Let's get the essentials of our HTML setup, so there's content and some boxes to work with.
We'll be using an `<aside>` to hold the navigation menu, and a `<main>` to hold our primary page content.

```html
<aside></aside>
<main></main>
```

In the sidenav, let's fill in those semantic elements with the rest of our page content. We'll add a 
navigation element and a close link. 

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

In the main content element, let's add a header and an article to semantically hold our layout content.

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

So far we've added an aside element, with a nav and links. Then we also added a header and 
article to our main element. This is clean, semantic and pretty timeless already, but let's 
go sprinkle on some accessibility sugar, to really make it clean and clear UX for everyone.

The open link for our sidenav could be more clearly marked. Here's how to do that.

```html//0
<a href="#sidenav-open">
<a href="#sidenav-open" title="Open Menu" aria-label="Open Menu">
```

The open SVG icon for our sidenav could be more clearly marked. Here's how to do that.

```html//0
<svg viewBox="0 0 50 40">
<svg viewBox="0 0 50 40" role="presentation" focusable="false" aria-label="trigram for heaven symbol">
```

The close link in our sidenav could be more clearly marked. 

```html//0
<a href="#"></a>
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>
```

## CSS

Next let's setup our desktop and mobile layout essentials. Our main content 
and sidenav are inside the `<body>` tag, let's start with their layout, which is 
owned by the document body. Put the following CSS into `css/sidenav.css`:

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

With this as a base, we can now leverage the state of the url bar to toggle the 
visibility and transition style of the sidenav. Speaking of which, we need to update our 
HTML to enable this feature.

```html//0
<aside>
<aside id="sidenav-open">
```
and
```html//0
<a href="#sidenav-open" title="Open Menu" aria-label="Open Menu">
<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
```

Now the element's ID can match the url hash we'll be setting. We also added IDs for 
key elements that control the sidenav. With that, let's style our sidenav components.

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

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

## Try it out

{% Instruction 'preview' %}

## Conclusion

That's a wrap up for the needs I had with the component. Feel free to build upon
it, drive it with data, and in general make it yours! 
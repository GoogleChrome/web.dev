---
layout: post
title: Building a breadcrumbs component
subhead: A foundational overview of how to build a responsive and accessible breadcrumbs component for users to navigate your site.
authors:
  - adamargyle
description: A foundational overview of how to build a responsive and accessible breadcrumbs component for users to navigate your site.
date: 2021-07-14
updated: 2021-07-15
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/kCeb8N9YlMYsI5O5ChC9.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/dk9VreVtYiF3LBkRpZlg.png
tags:
  - blog
  - css
  - dom
  - javascript
---

In this post I want to share thinking on a way to build breadcrumb components.
[Try the demo](https://gui-challenges.web.app/breadcrumbs/dist/).

<figure class="w-figure w-figure--fullbleed">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/90PkYJ8y9wi2U1w034gv.mp4",
    class="w-screenshot",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption class="w-figure">
    <a href="https://gui-challenges.web.app/breadcrumbs/dist/">Demo</a>
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'kHL3gxAlvK8' %}

## Overview

A [breadcrumbs](https://codepen.io/search/pens?q=breadcrumbs) component shows
where in the site hierarchy the user is. The name is from [Hansel and
Gretel](https://en.wikipedia.org/wiki/Hansel_and_Gretel), who dropped
breadcrumbs behind them in some dark woods and were able to find their way home
by tracing crumbs backwards. 

The breadcrumbs in this post are not [standard
breadcrumbs](https://www.w3.org/TR/wai-aria-practices-1.1/examples/breadcrumb/index.html),
they're breadcrumb-like. They offer additional functionality by putting sibling
pages right into the navigation with a `<select>`, making multi-tiered access
possible. 

### Background UX

In the component demo video above, the placeholder categories are genres of
video games. This trail is created by navigating the following path:  `home »
rpg » indie » on sale`, as shown below.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/u3nemRGC7g39sVvPnUBh.mp4",
  class="w-screenshot",
  autoplay="true",
  loop="true",
  muted="true"
%}

This breadcrumb component should enable users to move through this
information hierarchy; jumping branches and selecting pages with speed and
accuracy. 

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/69hQj4fuf6cJltEqGxDJ.mp4",
  class="w-screenshot",
  autoplay="true",
  loop="true",
  muted="true"
%}

## Information architecture

I find it's helpful to think in terms of collections and items.

### Collections

A collection is an array of options to choose from. From the homepage of
the breadcrumb prototype of this post, the collections are FPS, RPG, brawler,
dungeon crawler, sports and puzzle. 

### Items

A video game is an item, a specific collection could also be an item if it
represents another collection. For example, RPG is an item and a valid
collection. When it's an item, the user is on that collection page. For example,
they are on  the RPG page, which displays a list of RPG games, including the
additional subcategories AAA, Indie and Self Published.

In computer science terms, this breadcrumbs component represents a
[multidimensional
array](https://www.javascripttutorial.net/javascript-multidimensional-array/):

```js
const rawBreadcrumbData = {
  "FPS": {...},
  "RPG": {
    "AAA": {...},
    "indie": {
      "new": {...},
      "on sale": {...},
      "under 5": {...},
    },
    "self published": {...},
  },
  "brawler": {...},
  "dungeon crawler": {...},
  "sports": {...},
  "puzzle": {...},
}
```

Your app or website will have custom information architecture (IA) creating a
different multidimensional array, but I hope the concept of collection landing
pages and hierarchy traversal can make it into your breadcrumbs as well.

## Layouts

### Markup

Good components begin with appropriate HTML. In this next section I'll cover my
markup choices and how they impact the overall component.

#### Dark and light scheme

```html
<meta name="color-scheme" content="dark light">
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/I8w6oe28ueaZsDiOFssl.mp4",
  class="w-screenshot",
  autoplay="true",
  loop="true",
  muted="true"
%}

The [`color-scheme`](/color-scheme/) meta tag in the above
snippet informs the browser that this page wants the light and dark browser
styles. The example breadcrumbs don't include any CSS for these color schemes,
and so the breadcrumbs will use the default colors provided by the browser.

{% Aside %} Try removing all the styles from the demo page. The component works
without them due to the well structured markup. {% endAside %}

#### Navigation element

```html
<nav class="breadcrumbs" role="navigation"></nav>
```

It's appropriate to use the
[`<nav>`](https://developer.mozilla.org/docs/Web/HTML/Element/nav) element
for site navigation, which has an implicit ARIA [role of
navigation](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/Navigation_Role). 
In testing, I noticed that having the `role` attribute changed the way a
screen reader interacted with the element, it was actually announced as
navigation, and so I've chosen to add it.

#### Icons

When an icon is repeated on a page, the SVG
[`<use>`](https://developer.mozilla.org/docs/Web/SVG/Element/use) element
means that you can define the `path` once, and use it for all instances of the
icon. This prevents the same path information from being repeated, causing
larger documents and the potential of path inconsistency. 

To use this technique, add a hidden SVG element to the page and wrap the icons
in a `<symbol>` element with a unique ID:

```html
<svg style="display: none;">

  <symbol id="icon-home">
    <title>A home icon</title>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
  </symbol>
  
  <symbol id="icon-dropdown-arrow">
    <title>A down arrow</title>
    <path d="M19 9l-7 7-7-7"/>
  </symbol>
  
</svg>
```

The browser reads the SVG HTML, puts the icon information into memory, and
continues with the rest of the page referencing the ID for additional uses of
the icon, like this:

```html
<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
  <use href="#icon-home" />
</svg>

<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
  <use href="#icon-dropdown-arrow" />
</svg>
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/BVkOZ3YnQBgF6K09sLTE.png",
alt="DevTools showing a rendered `<use>` SVG element.", width="800", height="447"
%}

Define once, use as many times as you like, with minimal page performance impact
and flexible styling. Notice `aria-hidden="true"` is added to the SVG element.
The icons are not useful to someone browsing who only hears the content, hiding
them from those users stops them adding unnecessary noise.

#### Split-link `.crumb`

This is where the traditional breadcrumb and those in this component diverge.
Normally, this would only be an `<a>` link, but I've added traversal UX with a
disguised select. The `.crumb` class is responsible for laying out the link and
the icon, while the `.crumbicon` is responsible for stacking the icon and select
element together. I've called it a split-link because its functions are very
similar to a [split-button](https://www.nngroup.com/articles/split-buttons/),
but for page navigation.

```html
<span class="crumb">
  <a href="#sub-collection-b">Category B</a>
  <span class="crumbicon">
    <svg>...</svg>
    <select class="disguised-select" title="Navigate to another category">
      <option>Category A</option>
      <option selected>Category B</option>
      <option>Category C</option>
    </select>
  </span>
</span>
```

A link and some options is nothing special but adds more functionality to a
simple breadcrumb. Adding a `title` to the `<select>` element is helpful for screen
reader users, giving them information about the action of the button. However it
provides the same help to everyone else too, you'll see it's front and center on
iPad. One attribute provides button context to many users. 

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/IbANGFRfyEC61P7ETlGp.png",
alt="Screenshot with the invisible select element being hovered and its
contextual tooltip showing.", width="271", height="83" %}

#### Separator decorations

```html
<span class="crumb-separator" aria-hidden="true">→</span>
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/LASjAldbKTMivtF01aWo.mp4",
  class="w-screenshot",
  autoplay="true",
  loop="true",
  muted="true"
%}

Separators are optional, adding just one works great too (see the third example in the video
above). I then give each `aria-hidden="true"` since they are decorative and not
something a screen reader needs to announce.

The [`gap`](/flexbox-gap) property, covered next, makes the spacing of these straightforward.

### Styles

Since the color uses [system colors](https://www.w3.org/TR/css-color-4/#css-system-colors), it's mostly gaps and stacks for styles!

#### Layout direction and flow

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/uPs9kdqJgyaY5GWqdZHP.png",
alt="DevTools showing breadcrumb nav alignment with a its flexbox overlay
feature.", width="800", height="74" %}

The primary navigation element `nav.breadcrumbs` sets a scoped custom property
for children to use, and otherwise establishes a horizontal vertically aligned
layout. This ensures that the crumbs, dividers, and icons align.

```css
.breadcrumbs {
  --nav-gap: 2ch;

  display: flex;
  align-items: center;
  gap: var(--nav-gap);
  padding: calc(var(--nav-gap) / 2);
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/8JJyoerH462n22u0vD2R.png",
alt="One breadcrumb shown vertically aligned with flexbox overlays.",
width="167", height="66" %}

Each `.crumb` also establishes a horizontal vertically aligned layout with some
gap, but specially targets its link children and specifies the style
`white-space: nowrap`. This is crucial for multi-word breadcrumbs as we dont
want them to go multi-line. Later in this post we'll add styles to handle the
horizontal overflow this `white-space` property caused. 

```css
.crumb {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--nav-gap) / 4);

  & > a {
    white-space: nowrap;

    &[aria-current="page"] {
      font-weight: bold;
    }
  }
}
```

`aria-current="page"` is added to help the current page link stand out from the
rest. Not only will screen reader users have a clear indicator that the link is
for the current page, we've visually styled the element to help sighted users
get a similar user experience.

The `.crumbicon` component uses grid to stack an SVG icon with a "nearly
invisible" `<select>` element.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jx2uAiFT8NEHD5AbuSp3.png",
alt="Grid DevTools shown overlaying a button where the row and column are both
named stack.", width="218", height="180" %}

```css/8
.crumbicon {
  --crumbicon-size: 3ch;

  display: grid;
  grid: [stack] var(--crumbicon-size) / [stack] var(--crumbicon-size);
  place-items: center;

  & > * {
    grid-area: stack;
  }
}
```

The `<select>` element is last in the DOM, so it's on top of the stack,
and interactive. Add a style of `opacity: .01` so the element is still usable,
and the result is a select box that fits perfectly to the shape of the icon.
This is a nice way to customize the look of a `<select>` element while
maintaining the built-in functionality.

```css
.disguised-select {
  inline-size: 100%;
  block-size: 100%;
  opacity: .01;
  font-size: min(100%, 16px); /* Defaults to 16px; fixes iOS zoom */
}
```

{% Aside %}
Try using this icon component from mobile!
{% endAside %}

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/n3MsbELMwsvYn355hXdi.mp4",
  class="w-screenshot",
  autoplay="true",
  loop="true",
  muted="true"
%}

#### Overflow

Breadcrumbs should be able to represent a very long trail. I'm a fan of allowing
things to go offscreen horizontally, when appropriate, and I felt this
breadcrumbs component qualified well. 

```css
.breadcrumbs {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scroll-padding-inline: calc(var(--nav-gap) / 2);

  & > .crumb:last-of-type {
    scroll-snap-align: end;
  }

  @supports (-webkit-hyphens:none) { & {
    scroll-snap-type: none;
  }}
}
```

The overflow styles set up the following UX:

- Horizontal scroll with overscroll containment.
- Horizontal scroll padding.
- One snap point on the last crumb. This means that on page load the first
   crumb loads snapped and in view.
- Removes the snap point from Safari, which struggles with the horizontal
   scrolling and snap effect combinations.

#### Media queries

One subtle adjustment for smaller viewports is to hide the "Home" label, leaving
just the icon: 

```css
@media (width <= 480px) { 
  .breadcrumbs .home-label {
    display: none;
  }
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/T47A7AUqFPuneqNK3GWa.png",
alt="Side by side of the breadcrumbs with and without a home label, for
comparison.", width="800", height="84" %}

## Accessibility

### Motion

There isn't a whole lot of motion in this component, but by wrapping the
transition in a `prefers-reduced-motion` check, we can prevent unwanted motion.

```css
@media (prefers-reduced-motion: no-preference) { 
  .crumbicon {
    transition: box-shadow .2s ease;
  }
}
```

None of the other styles need to change, the hover and focus effects are great
and meaningful without a `transition`, but if motion is okay, we'll add a subtle
transition to the interaction.

### JavaScript

First, regardless of the type of router you use in your site or application,
when a user changes the breadcrumbs, the URL needs to be updated and the user
shown the appropriate page. Second, to normalize the user experience, make sure
no unexpected navigations happen when users are just browsing `<select>`
options.

Two critical user experience measures to be handled by JavaScript: select has
changed and eager `<select>` change event firing prevention.

The eager event prevention is needed due to the use of a `<select>`
element. On Windows Edge, and probably other browsers too, the select `changed`
event fires as the user browses options with the keyboard. This is why I
called it eager, as the user has only pseudo selected the option, like a hover
or focus, yet hasn't confirmed the choice with `enter` or a `click`. The eager
event makes this component category change feature inaccessible, because
opening the select box and simply browsing an item will fire the event and
change the page, before the user is ready.

#### A better `<select>` changed event

```js
const crumbs = document.querySelectorAll('.breadcrumbs select')
const allowedKeys = new Set(['Tab', 'Enter', ' '])
const preventedKeys = new Set(['ArrowUp', 'ArrowDown'])

// watch crumbs for changes,
// ensures it's a full value change, not a user exploring options via keyboard
crumbs.forEach(nav => {
  let ignoreChange = false

  nav.addEventListener('change', e => {
    if (ignoreChange) return
    // it's actually changed!
  })

  nav.addEventListener('keydown', ({ key }) => {
    if (preventedKeys.has(key))
      ignoreChange = true
    else if (allowedKeys.has(key))
      ignoreChange = false
  })
})
```

The strategy for this is to watch for keyboard down events on each `<select>`
element and determine if the key pressed was navigation confirmation (`Tab` or
`Enter`) or spatial navigation (`ArrowUp` or `ArrowDown`). With this
determination, the component can decide to wait or go, when the event for the
`<select>` element fires.

## Conclusion

Now that you know how I did it, how would you‽ 🙂

Let's diversify our approaches and learn all the ways to build on the web.
Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

*Nothing to see here yet.*

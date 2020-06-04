---
layout: post
title: Building a Stories component on the web
# TODO(kayce): Rename URL to match the title
subhead: TODO
authors:
  - adamargyle
description: |
  Adam Argyle shares his strategy of recreating stories, a mobile UI pattern commonly found on native platforms, with web technology. With CSS grid and scroll-snap-points it turned out to be swift work.
date: 2020-05-21
hero: hero.jpg
thumbnail: thumb.jpg
codelabs: codelab-stories-component
tags:
  - blog
  - layout
  - ui
---

In this post I want to share with you how I built a Stories component for
the web that is mobile-focused, supports keyboard navigation, and works across
browsers.

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/stories-desktop-demo.mp4">
  </video>
</figure>

If you would prefer a hands-on demonstration of building this Stories component yourself,
check out the [Stories component codelab](TODO).

If you prefer video, here's a YouTube version of this post:

{% YouTube '-oyeaIirVC0' %}

## Overview

Two popular examples of the Stories UX are Snapchat Stories and Instagram Stories.
In general UX terms, Stories are usually a mobile-only, tap-centric pattern for navigating
multiple subscriptions. For example, on Instagram, users open a friend's story
and go through the pictures in it. They generally do this many friends at a
time. By tapping on the right side of the device, a user skips ahead to that friend's
next story. By swiping right, a user skips ahead to a different friend's story.
A Story component is fairly similar to a carousel, but allows navigating a
multidimensional array as opposed to an array. It's as if there's a carousel inside
each carousel. 🤯 

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./carousel-of-carousels.png" 
       alt="Visualized multi-dimensional array using cards. Left to right is a stack of purple borders cards, and inside each card is 1-many cyan bordered cards. List in a list.">
  <figcaption class="w-figcaption">
    <span style="width: 1rem; height: 1rem; background: #EB00FF; display: inline-block; border-radius: 3px; position: relative; top: .2em;"></span> 1st carousel of your friends array
    <br><span style="width: 1rem; height: 1rem; background: #00D8FF; display: inline-block; border-radius: 3px; position: relative; top: .2em;"></span> 2nd "stacked" carousel for the stories array of a friend
    <br>👍 List in a list, a multi-dimensional array
  </figcaption>
</figure>

## Picking the right tools for the job {: #features }

All in all I found this component pretty easy to build, thanks to a few
critical new web platform features. Let's cover some of them!

### CSS Grid {: #grid }

Our layout turned out to be no tall order for CSS Grid as it's equipped with some
powerful ways to wrangle content.

#### Primary content wrapper

Our primary component wrapper is a horizontal scroll container:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./horizontal-scroll-with-grid.png" 
       alt="Chrome and DevTools open with a grid visual showing the full width layout">
  <figcaption class="w-figcaption">
    DevTools showing grid column overflow, making a horizontal scroller
  </figcaption>
</figure>

<!--
TODO(kayce): Remove DevTools from this screenshot. Undock DevTools if we want to
have the Grid lines. Note also that it's OK to use Firefox here if they have
better visualization.
-->

```css/1-3
.stories {
  display: grid;
  grid: 1fr / auto-flow 100vw;
  gap: 1ch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}
```

Let's breakdown that `grid` value:

* [`1fr`](https://alligator.io/css/css-grid-layout-fr-unit/) specifies a full height row 
* `/` separates our row and column templates
* `auto-flow 100vw` lays out the columns as `auto-columns` set to the full viewport width [`grid-auto-flow: column`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow)

{% Aside %}
  Note that the location of the `/` separator relative to `auto-flow` is important.
  If `auto-flow` came before `/` it would be shorthand for `grid-auto-flow: row`.
{% endAside %}

On a mobile phone, think of this like the row size being the viewport height
and each column being the viewport width. Continuing with the Snapchat Stories
and Instagram Stories example, each column will be a friend's story. We want
friends stories to continue outside of the viewport so
we have somewhere to scroll to. Grid will make however many columns it needs to
layout your HTML for each friend story, creating a perfect scrolling container for us. 

#### Stacking

For each friend we needed their stories in a pagination-ready state.
In preparation for animation and other fun patterns, I chose a stack. 
When I say stack, I mean like you're looking down on a
sandwich, not like you're looking from the side.

With CSS grid, we can define a single cell grid (i.e. a square), where the rows
and columns share an alias (`[story]`), and then each child gets assigned to that
aliased single-cell space: 


```css/1-2
.user {
  display: grid;
  grid: [story] 1fr / [story] 1fr;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

```css/1-1
.story {
  grid-area: story;
  background-size: cover;
  …
}
```

This puts our HTML in control of the stacking order and also keeps all elements
in flow. Notice how we didn't need to do anything with `absolute` positioning or `z-index` and
we didn't need to box correct with `height: 100%` or `width: 100%`. The parent grid
already defined the size of the story picture viewport, so none of these story components
needed to be told to fill it!

### CSS Scroll Snap Points {: #scroll-snap-points}

The [CSS Scroll Snap Points spec](https://www.w3.org/TR/css-scroll-snap-1/) makes it
a cinch to lock elements into the viewport on scroll. Before these CSS properties existed, 
you had to use JavaScript, and it was… tricky, to say the least. Check out
[Introducing CSS Scroll Snap Points](https://css-tricks.com/introducing-css-scroll-snap-points/)
by Sarah Drasner for a great breakdown of how to use them.

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/scroll-snap-example.mp4">
  </video>
  <figcaption class="w-figcaption">
    Shows horizontal scrolling without and with `scroll-snap-points` styles. Without it, users can free scroll as normal. With it, browser rests gently on each item.
  </figcaption>
</figure>

<div class="w-columns">
{% Compare 'better', 'parent' %}
```css/4-5
.stories {
  display: grid;
  grid: 1fr / auto-flow 100vw;
  gap: 1ch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}
```

{% CompareCaption %} Parent with overscroll defines snap behavior {%
endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'child' %}
```css/3-4
.user {
  display: grid;
  grid: [story] 1fr / [story] 1fr;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

{% CompareCaption %} Children opt into being a snap target {% endCompareCaption
%}

{% endCompare %}
</div>

I chose Scroll Snap Points for a few reasons:

* **Free accessibility**. The Scroll Snap Points spec states that pressing the
  <kbd>Left Arrow</kbd> and <kbd>Right Arrow</kbd> keys should move through the snap points
  by default.
* **A growing spec**. The Scroll Snap Points spec is getting new features and improvements
  all the time, which means that my Stories component will probably only get better from
  here on out.
* **Ease of implementation**. Scroll Snap Points are practically built for the
  touch-centric horizontal-pagination use case.
* **Free native inertia**. Every platform will swipe and scroll with 100% native feel

## Cross-browser compatibility {: #compatibility }

<!-- TODO(kayce): Clear up what browsers were tested on what operating systems. -->

We tested on Opera, Firefox, Safari, and Chrome, plus Android and iOS. Here's
a brief rundown of the web features where we found differences in capabilities and support. 

{% Aside 'success' %} 
  All of the features chosen were supported and none were buggy.
{% endAside %}

We did though have some CSS not apply, so some platforms are currently missing out on UX
optimizations. I did enjoy not needing to manage these features and feel confident
that they'll eventually reach other browsers and platforms.

### `scroll-snap-stop`

Carousels were one of the major UX use cases that prompted the creation of the
CSS Scroll Snap Points spec. Unlike Stories, A Carousel doesn't always need to stop
on each image after a user interacts with it. It might be fine or encouraged to
quickly cycle through the Carousel. Stories, on the other hand, are best navigated one-by-one,
and that's exactly what `scroll-snap-stop` provides.

At the time of writing this post, `scroll-snap-stop` is only supported on Chromium-based
browsers. You should check out
[Browser compatibility](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop#Browser_compatibility)
for updates, though. It's not a blocker, though. It just means that on unsupported browsers
users can accidentally skip a friend. So users will just have to be more careful, or
we'll need to write JavaScript to ensure that a skipped friend isn't marked as viewed.

Read more in [the
spec](https://www.w3.org/TR/css-scroll-snap-1/#scroll-snap-stop) if you're
interested.

### `overscroll-behavior`

<!-- TODO(kayce): Video would be helpful. -->

Have you ever been scrolling through a modal when all of a sudden you
start scrolling the content behind the modal?
[`overscroll-behavior`](https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior) 
lets the developer trap that scroll and never let it
leave. It's nice for all sorts of occasions. My Stories component uses it
to prevent additional swipes and scrolling gestures from leaving the
component. 

Safari and Opera were the 2 browser's that didn't
[support](https://caniuse.com/#search=overscroll-behavior) this, and that's
totally OK. Those users will get an overscroll experience like they're used to
and may never notice this enhancement. I'm personally a big fan and like
including it as part of nearly every overscroll feature I implement. It's a
harmless addition that can only lead to an improvement.

<!-- TODO(kayce): Describe what Safari and Opera users will see. -->

### `scrollIntoView({behavior: 'smooth'})` {: #scrollintoview }

When a user taps or clicks and has reached the end of a friend's set of stories,
it's time to move to the next friend in the scroll snap point set. With
JavaScript, we were able to reference the next friend and request for it to be
scrolled into view. The support for the basics of this are great; every browser
scrolled it into view. But, not every browser did it `smooth`. This just means
it's scrolled into view instead of snapped, which makes for a more seamless
transition.

Safari was the only one not to support `behavior: 'smooth'` here.
Check out
[Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#Browser_compatibility)
for updates.

## Hands-On

Now that you know how I did it, how would you?! Let's diversify our 
approaches and learn all the ways to build on the web. Remix the Glitch, 
[tweet me](https://twitter.com/argyleink) your version and I'll add it 
the [Community remixes](#community-remixes) section below.

<div class="glitch-embed-wrap" style="height: 720px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/stories-gui-challenge?path=app/index.html&attributionHidden=true&previewSize=100"
    alt="TODO"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Community remixes {: #community-remixes }

<!-- TODO(kayce): Add a warning that this is community content that may change over time. -->

Nothing to see here, yet!
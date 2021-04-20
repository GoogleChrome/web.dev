---
layout: post
title: Building a Stories component
# TODO(kayce): Rename URL to match the title
subhead: A foundational overview of how to build an experience similar to Instagram Stories on the web.
authors:
  - adamargyle
description: A foundational overview of how to build an experience similar to Instagram Stories on the web.
date: 2020-11-25
hero: image/admin/OghwTxMrgwyEpzqQeuCa.jpg
thumbnail: image/admin/7FsH2ngtBgEZsXVGSv0q.jpg
codelabs: codelab-building-a-stories-component
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

In this post I want to share thinking on building a Stories component for
the web that is responsive, supports keyboard navigation, and works across
browsers.

<figure class="w-figure w-figure--fullbleed">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/stories-desktop-demo.mp4">
  </video>
  <figcaption class="w-figure">
    <a href="https://gui-challenges-stories.glitch.me/">Demo</a>
  </figcaption>
</figure>

If you would prefer a hands-on demonstration of building this Stories component yourself,
check out the [Stories component codelab](/codelab-building-a-stories-component).

If you prefer video, here's a YouTube version of this post:

{% YouTube 'PzvdREGR0Xw' %}

## Overview

Two popular examples of the Stories UX are Snapchat Stories and Instagram Stories (not to mention fleets).
In general UX terms, Stories are usually a mobile-only, tap-centric pattern for navigating
multiple subscriptions. For example, on Instagram, users open a friend's story
and go through the pictures in it. They generally do this many friends at a
time. By tapping on the right side of the device, a user skips ahead to that friend's
next story. By swiping right, a user skips ahead to a different friend.
A Story component is fairly similar to a carousel, but allows navigating a
multi-dimensional array as opposed to a single-dimensional array. It's as if there's a carousel inside
each carousel. 🤯

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yVm8NC0TiAsl6hcDxys.png", alt="Visualized multi-dimensional array using cards. Left to right is a stack of purple borders cards, and inside each card is 1-many cyan bordered cards. List in a list.", width="716", height="255", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    <span style="width: 1rem; height: 1rem; background: #EB00FF; display: inline-block; border-radius: 3px; position: relative; top: .2em;"></span> 1st carousel of friends
    <br><span style="width: 1rem; height: 1rem; background: #00D8FF; display: inline-block; border-radius: 3px; position: relative; top: .2em;"></span> 2nd "stacked" carousel of stories
    <br>👍 List in a list, aka: a multi-dimensional array
  </figcaption>
</figure>

## Picking the right tools for the job {: #features }

All in all I found this component pretty straightforward to build, thanks to a few
critical web platform features. Let's cover them!

### CSS Grid {: #grid }

Our layout turned out to be no tall order for CSS Grid as it's equipped with some
powerful ways to wrangle content.

#### Friends layout

Our primary `.stories` component wrapper is a mobile-first horizontal scrollview:

```css/4-6
.stories {
  inline-size: 100vw;
  block-size: 100vh;

  display: grid;
  grid: 1fr / auto-flow 100%;
  gap: 1ch;

  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior: contain;
  touch-action: pan-x;
}

/* desktop constraint */
@media (hover: hover) and (min-width: 480px) {
  max-inline-size: 480px;
  max-block-size: 848px;
}
```

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/stories-overflow-columns.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/stories-overflow-columns.mp4">
  </video>
  <figcaption class="w-figcaption">
    Using Chrome DevTools'
    <a href="https://developers.google.com/web/tools/chrome-devtools/device-mode">Device Mode</a>
    to highlight the columns created by Grid
  </figcaption>
</figure>

Let's breakdown that `grid` layout:

* We explicitly fill the viewport on mobile with `100vh` and `100vw` and constrain the size on desktop
* `/` separates our row and column templates
* `auto-flow` translates to [`grid-auto-flow: column`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow)
* The autoflow template is `100%`, which in this case is whatever the scroll window width is

{% Aside %}
  Note that the location of the `/` separator relative to `auto-flow` is important.
  If `auto-flow` came before `/` it would be shorthand for `grid-auto-flow: row`.
{% endAside %}

On a mobile phone, think of this like the row size being the viewport height and
each column being the viewport width. Continuing with the Snapchat Stories and
Instagram Stories example, each column will be a friend's story. We want friends
stories to continue outside of the viewport so we have somewhere to scroll to.
Grid will make however many columns it needs to layout your HTML for each friend
story, creating a dynamic and responsive scrolling container for us. Grid
enabled us to centralize the whole effect.

#### Stacking

For each friend we need their stories in a pagination-ready state.
In preparation for animation and other fun patterns, I chose a stack.
When I say stack, I mean like you're looking down on a
sandwich, not like you're looking from the side.

With CSS grid, we can define a single-cell grid (i.e. a square), where the rows
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
    Horizontal scrolling without and with <code>scroll-snap-points</code> styles.
    Without it, users can free scroll as normal. With it, the browser rests gently on each item.
  </figcaption>
</figure>

<div class="w-columns">
{% Compare 'better', 'parent' %}
```css/4-5
.stories {
  display: grid;
  grid: 1fr / auto-flow 100%;
  gap: 1ch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior: contain;
  touch-action: pan-x;
}
```

{% CompareCaption %}
  Parent with overscroll defines snap behavior.
{% endCompareCaption %}

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

{% CompareCaption %}
  Children opt into being a snap target.
{% endCompareCaption %}

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
* **Free platform-style inertia**. Every platform will scroll and rest in its style, as opposed to
  normalized inertia which can have an uncanny scrolling and resting style.

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
CSS Scroll Snap Points spec. Unlike Stories, a carousel doesn't always need to stop
on each image after a user interacts with it. It might be fine or encouraged to
quickly cycle through the carousel. Stories, on the other hand, are best navigated one-by-one,
and that's exactly what `scroll-snap-stop` provides.

```css/2
.user {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

At the time of writing this post, `scroll-snap-stop` is only supported on Chromium-based
browsers. Check out
[Browser compatibility](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop#Browser_compatibility)
for updates. It's not a blocker, though. It just means that on unsupported browsers
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

```css
.stories {
  overflow-x: auto;
  overscroll-behavior: contain;
}
```

Safari and Opera were the 2 browsers that didn't
[support](https://caniuse.com/#search=overscroll-behavior) this, and that's
totally OK. Those users will get an overscroll experience like they're used to
and may never notice this enhancement. I'm personally a big fan and like
including it as part of nearly every overscroll feature I implement. It's a
harmless addition that can only lead to improved UX.

<!-- TODO(kayce): Describe what Safari and Opera users will see. -->

### `scrollIntoView({behavior: 'smooth'})` {: #scrollintoview }

When a user taps or clicks and has reached the end of a friend's set of stories,
it's time to move to the next friend in the scroll snap point set. With
JavaScript, we were able to reference the next friend and request for it to be
scrolled into view. The support for the basics of this are great; every browser
scrolled it into view. But, not every browser did it `'smooth'`. This just means
it's scrolled into view instead of snapped.

```js
element.scrollIntoView({
  behavior: 'smooth'
})
```

Safari was the only browser not to support `behavior: 'smooth'` here. Check out
[Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#Browser_compatibility)
for updates.

## Hands-on

Now that you know how I did it, how would you?! Let's diversify our
approaches and learn all the ways to build on the web. Create a [Glitch](https://glitch.com),
[tweet me](https://twitter.com/argyleink) your version, and I'll add it to
the [Community remixes](#community-remixes) section below.

## Community remixes {: #remixes }

<!-- TODO(kayce): Add a warning that this is community content that may change over time. -->

- [@geoffrich_](https://twitter.com/geoffrich_) with [Svelte](https://svelte.dev): [demo](https://svelte-stories.glitch.me) & [code](https://github.com/geoffrich/svelte-stories)
- [@GauteMeekOlsen](https://twitter.com/GauteMeekOlsen) with [Vue](https://vuejs.org/): [demo + code](https://stackblitz.com/edit/stories)
- [@AnaestheticsApp](https://twitter.com/AnaestheticsApp) with [Lit](https://lit-element.polymer-project.org/): [demo](https://lit-stories.glitch.me/) & [code](https://github.com/anaestheticsapp/web-stories)
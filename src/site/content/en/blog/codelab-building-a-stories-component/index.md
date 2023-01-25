---
layout: codelab
title: "Codelab: Building a Stories component"
authors:
  - adamargyle
description: |
  Learn how to build an experience similar to Instagram Stories on the web.
date: 2020-11-25
hero: hero.jpg
thumbnail: image/admin/0nRwu5FF7f5tHsgT9PgE.jpg
glitch: gui-challenges-stories-codelab
glitch_path: app/index.html
related_post: building-a-stories-component
tags:
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

This codelab teaches you how to build an experience like Instagram Stories
on the web. We'll build the component as we go, starting with HTML, then CSS,
then JavaScript.

Check out my blog post [Building a Stories component](/building-a-stories-component)
to learn about the progressive enhancements made while building this component.

{% YouTube 'PzvdREGR0Xw' %}

{% Aside %}
This post assumes that you're familiar with the Instagram Stories UX
and will use terminology from that experience (e.g. a "friend's story").
{% endAside %}

## Setup

{% Instruction 'remix', 'ol' %}
1. Open `app/index.html`.

## HTML

I always aim to use [semantic HTML](https://en.wikipedia.org/wiki/Semantic_HTML).
Since each friend can have any number of stories, I thought it was meaningful to use a
`<section>` element for each friend and an `<article>` element for each story.
Let's start from the beginning though. First, we need a container for our
stories component.

Add a `<div>` element to your `<body>`:

```html/0,2
<div class="stories">

</div>
```

<!-- TODO(kayce): Why not use "friend" instead of "user"? -->

Add some `<section>` elements to represent friends:

```html/1-4
<div class="stories">
  <section class="user"></section>
  <section class="user"></section>
  <section class="user"></section>
  <section class="user"></section>
</div>
```

Add some `<article>` elements to represent stories:

<!--

Each friend has some pictures. We'll call each picture a `.story`.
Next, let's dig into how and where we'll put pictures in this component.

### Placeholder loading technique

Let's use a placeholder loading technique for each `.story`. We'll use CSS's
`background-image` property, which allows us to specify more than one background
image. We can put them in an order so that our user picture is on top and will
show up automatically when it's done loading. To enable this, we'll put
our image URL into a custom property (`--bg`), and use it within our CSS to
layer with the loading placeholder.

-->

```html/2-3,6,9,12-14
<div class="stories">
  <section class="user">
    <article class="story" style="--bg: url(https://picsum.photos/480/840);"></article>
    <article class="story" style="--bg: url(https://picsum.photos/480/841);"></article>
  </section>
  <section class="user">
    <article class="story" style="--bg: url(https://picsum.photos/481/840);"></article>
  </section>
  <section class="user">
    <article class="story" style="--bg: url(https://picsum.photos/481/841);"></article>
  </section>
  <section class="user">
    <article class="story" style="--bg: url(https://picsum.photos/482/840);"></article>
    <article class="story" style="--bg: url(https://picsum.photos/482/843);"></article>
    <article class="story" style="--bg: url(https://picsum.photos/482/844);"></article>
  </section>
</div>
```

* We're using an image service (`picsum.com`) to help prototype stories.
* The `style` attribute on each `<article>` is part of a placeholder loading
  technique, which you'll learn more about in the next section.

## CSS

Our content is ready for style. Let's turn those bones into something folks will
want to interact with. We'll be working mobile-first today.

### `.stories`

For our `<div class="stories">` container we want a horizontal scrolling container.
We can achieve this by:

* Making the container a [Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
* Setting each child to fill the row track
* Making the width of each child the width of a mobile device viewport

Grid will continue placing new `100vw`-wide columns to the right of the previous
one, until it's placed all the HTML elements in your markup.

<!-- TODO(kayce): Resize this screenshot so there's less whitespace -->

<figure class="w-figure">
  {% Img src="image/admin/oLbxOrfO2rUqmxnnleXw.png", alt="Chrome and DevTools open with a grid visual showing the full width layout", width="800", height="465" %}
  <figcaption class="w-figcaption">Chrome DevTools showing grid column overflow, making a horizontal scroller.</figcaption>
</figure>

Add the following CSS to the bottom of `app/css/index.css`:

```css
.stories {
  display: grid;
  grid: 1fr / auto-flow 100%;
  gap: 1ch;
}
```

{% Aside %}
Feel free to stop and study the `body` styles if you like!
They're handling the responsive nature of our Stories component.
You can also collapse the `body` styles by clicking the **&or;**
symbol next to `body` on line 1.
{% endAside %}

Now that we have content extending beyond the viewport, it's time to tell that
container how to handle it. Add the highlighted lines of code to your `.stories` ruleset:

```css/4-6
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

We want horizontal scrolling, so we'll set `overflow-x` to
`auto`. When the user scrolls we want the component to gently rest on the next story,
so we'll use `scroll-snap-type: x mandatory`. Read more about this
CSS in the [CSS Scroll Snap Points](/building-a-stories-component/#scroll-snap-points)
and [overscroll-behavior](/building-a-stories-component/#overscroll-behavior)
sections of my blog post.

It takes both the parent container and the children to agree to scroll snapping, so
let's handle that now. Add the following code to the bottom of `app/css/index.css`:

```css
.user {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

Your app doesn't work yet, but the video below shows what happens when
`scroll-snap-type` is enabled and disabled. When enabled, each horizontal
scroll snaps to the next story. When disabled, the browser uses its
default scrolling behavior.

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/scroll-snap-example.mp4">
  </video>
</figure>

That will get you scrolling through your friends, but we still have an issue
with the stories to solve.

### `.user`

Let's create a layout in the `.user` section that wrangles those child story
elements into place. We're going to use a handy stacking trick to solve this.
We're essentially creating a 1x1 grid where the row and column have the same Grid
alias of `[story]`, and each story grid item is going to try and claim that space,
resulting in a stack.

Add the highlighted code to your `.user` ruleset:

```css/3-4
.user {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: grid;
  grid: [story] 1fr / [story] 1fr;
}
```

Add the following ruleset to the bottom of `app/css/index.css`:

```css
.story {
  grid-area: story;
}
```

Now, without absolute positioning, floats, or other layout directives that take
an element out of flow, we're still in flow. Plus, it's like barely any code,
look at that! This gets broken down in the video and the blog post in more detail.

### `.story`

Now we just need to style the story item itself.

Earlier we mentioned that the `style` attribute on each `<article>` element is part of a
placeholder loading technique:

```html
<article class="story" style="--bg: url(https://picsum.photos/480/840);"></article>
```

We're going to use CSS's `background-image` property, which allows us to specify
more than one background image. We can put them in an order so that our user
picture is on top and will show up automatically when it's done loading. To
enable this, we'll put our image URL into a custom property (`--bg`), and use it
within our CSS to layer with the loading placeholder.

First, let's update the `.story` ruleset to replace a gradient with a background image
once it's done loading. Add the highlighted code to your `.story` ruleset:

```css/3-6
.story {
  grid-area: story;

  background-size: cover;
  background-image:
    var(--bg),
    linear-gradient(to top, lch(98 0 0), lch(90 0 0));
}
```

Setting `background-size` to `cover` ensures there's no empty space in the
viewport because our image will be filling it up. Defining 2 background images
enables us to pull a neat CSS web trick called the *loading tombstone*:

- Background image 1 (`var(--bg)`) is the URL we passed inline in the HTML
- Background image 2 (`linear-gradient(to top, lch(98 0 0), lch(90 0 0))` is a gradient
  to show while the URL is loading

CSS will automatically replace the gradient with the image, once the image is done downloading.

Next we'll add some CSS to remove some behavior, freeing up the browser to move faster.
Add the highlighted code to your `.story` ruleset:

```css/8-9
.story {
  grid-area: story;

  background-size: cover;
  background-image:
    var(--bg),
    linear-gradient(to top, lch(98 0 0), lch(90 0 0));

  user-select: none;
  touch-action: manipulation;
}
```

* `user-select: none` prevents users from accidentally selecting text
* `touch-action: manipulation` instructs the browser that these interactions
  should be treated as touch events, which frees up the browser from trying to
  decide whether you're clicking a URL or not

Last, let's add a little CSS to animate the transition between stories. Add the
highlighted code to your `.story` ruleset:

```scss/11-16
.story {
  grid-area: story;

  background-size: cover;
  background-image:
    var(--bg),
    linear-gradient(to top, lch(98 0 0), lch(90 0 0));

  user-select: none;
  touch-action: manipulation;

  transition: opacity .3s cubic-bezier(0.4, 0.0, 1, 1);

  &.seen {
    opacity: 0;
    pointer-events: none;
  }
}
```

The `.seen` class will be added to a story that needs an exit.
I got the custom easing function (`cubic-bezier(0.4, 0.0, 1,1)`)
from Material Design's [Easing](https://material.io/design/motion/speed.html#easing)
guide (scroll to the *Accerlerated easing* section).

{% Aside %}
  Check out [Nesting Selector: the `&` selector](https://drafts.csswg.org/css-nesting-1/#nest-selector)
  for an explanation of `&.seen`.
{% endAside %}

If you've got a keen eye you probably noticed the `pointer-events: none`
declaration and are scratching your head right now. I'd say this is the only
downside of the solution so far. We need this because a `.seen.story` element
will be on top and will receive taps, even though it's invisible. By setting the
`pointer-events` to `none`, we turn the glass story into a window, and steal no
more user interactions. Not too bad of a trade off, not too hard to manage here
in our CSS right now. We're not juggling `z-index`. I'm feeling good about this
still.


## JavaScript

The interactions of a Stories component are quite simple to the user: tap on the
right to go forward, tap on the left to go back. Simple things for users tends
to be hard work for developers. We'll take care of lots of it, though.

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/stories-desktop-demo.mp4">
  </video>
</figure>

### Setup

To start out, let's compute and store as much information as we can.
Add the following code to `app/js/index.js`:

```js
const stories = document.querySelector('.stories')
const median = stories.offsetLeft + (stories.clientWidth / 2)
```

Our first line of JavaScript grabs and stores a reference to our primary HTML
element root. The next line calculates where the middle of our element is, so we
can decide if a tap is to go forward or backward.

### State

Next we make a small object with some state relevant to our logic. In this
case, we're only interested in the current story. In our HTML markup, we can
access it by grabbing the 1st friend and their most recent story. Add the highlighted code
to your `app/js/index.js`:

```js/3-5
const stories = document.querySelector('.stories')
const median = stories.offsetLeft + (stories.clientWidth / 2)

const state = {
  current_story: stories.firstElementChild.lastElementChild
}
```

<!-- TODO(kayce): All JS code needs semicolons: https://google.github.io/styleguide/jsguide.html#formatting-semicolons-are-required -->

### Listeners

We have enough logic now to start listening for user events and directing them.

#### Mouse

Let's start by listening to the `'click'` event on our stories container.
Add the highlighted code to `app/js/index.js`:

```js/7-15
const stories = document.querySelector('.stories')
const median = stories.offsetLeft + (stories.clientWidth / 2)

const state = {
  current_story: stories.firstElementChild.lastElementChild
}

stories.addEventListener('click', e => {
  if (e.target.nodeName !== 'ARTICLE')
    return

  navigateStories(
    e.clientX > median
      ? 'next'
      : 'prev')
})
```

If a click happens and it's not on a `<article>` element we bail and do nothing.
If it is an article, we grab the horizontal position of the mouse or finger with
`clientX`. We haven't implemented `navigateStories` yet, but the argument that
it takes specifies what direction we need to go. If that user position is
greater than the median, we know we need to navigate to `next`, otherwise
`prev` (previous).

#### Keyboard

Now, let's listen for keyboard presses. If the <kbd>Down Arrow</kbd> is pressed we navigate
to `next`. If it's the <kbd>Up Arrow</kbd>, we go to `prev`.

Add the highlighted code to `app/js/index.js`:

```js/17-23
const stories = document.querySelector('.stories')
const median = stories.offsetLeft + (stories.clientWidth / 2)

const state = {
  current_story: stories.firstElementChild.lastElementChild
}

stories.addEventListener('click', e => {
  if (e.target.nodeName !== 'ARTICLE')
    return

  navigateStories(
    e.clientX > median
      ? 'next'
      : 'prev')
})

document.addEventListener('keydown', ({key}) => {
  if (key !== 'ArrowDown' || key !== 'ArrowUp')
    navigateStories(
      key === 'ArrowDown'
        ? 'next'
        : 'prev')
})
```

### Stories navigation

Time to tackle the unique business logic of stories and the UX they've become
famous for. This looks chunky and tricky, but I think if you take it line by
line, you'll find it's quite digestible.

Upfront, we stash some selectors that help us decide whether to scroll to a
friend or show/hide a story. Since the HTML is where we're working, we'll be
querying it for presence of friends (users) or stories (story).

These variables will help us answer questions like, "given story x, does "next"
mean move to another story from this same friend or to a different friend?" I did it by using the tree
structure we built, reaching into parents and their children.

Add the following code to the bottom of `app/js/index.js`:

```js
const navigateStories = direction => {
  const story = state.current_story
  const lastItemInUserStory = story.parentNode.firstElementChild
  const firstItemInUserStory = story.parentNode.lastElementChild
  const hasNextUserStory = story.parentElement.nextElementSibling
  const hasPrevUserStory = story.parentElement.previousElementSibling
}
```

Here's our business logic goal, as close to natural language as possible:

* Decide how to handle the tap
  * If there's a next/previous story: show that story
  * If it's the last/first story of the friend: show a new friend
  * If there's no story to go to in that direction: do nothing
* Stash the new current story into `state`

Add the highlighted code to your `navigateStories` function:

```js/7-36
const navigateStories = direction => {
  const story = state.current_story
  const lastItemInUserStory = story.parentNode.firstElementChild
  const firstItemInUserStory = story.parentNode.lastElementChild
  const hasNextUserStory = story.parentElement.nextElementSibling
  const hasPrevUserStory = story.parentElement.previousElementSibling

  if (direction === 'next') {
    if (lastItemInUserStory === story && !hasNextUserStory)
      return
    else if (lastItemInUserStory === story && hasNextUserStory) {
      state.current_story = story.parentElement.nextElementSibling.lastElementChild
      story.parentElement.nextElementSibling.scrollIntoView({
        behavior: 'smooth'
      })
    }
    else {
      story.classList.add('seen')
      state.current_story = story.previousElementSibling
    }
  }
  else if(direction === 'prev') {
    if (firstItemInUserStory === story && !hasPrevUserStory)
      return
    else if (firstItemInUserStory === story && hasPrevUserStory) {
      state.current_story = story.parentElement.previousElementSibling.firstElementChild
      story.parentElement.previousElementSibling.scrollIntoView({
        behavior: 'smooth'
      })
    }
    else {
      story.nextElementSibling.classList.remove('seen')
      state.current_story = story.nextElementSibling
    }
  }
}
```

## Try it out

{% Instruction 'preview' %}

## Conclusion

That's a wrap up for the needs I had with the component. Feel free to build upon
it, drive it with data, and in general make it yours!

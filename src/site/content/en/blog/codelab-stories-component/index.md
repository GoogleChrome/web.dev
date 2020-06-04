---
layout: codelab
title: Building A Stories Component
authors:
  - adamargyle
description: |
  TODO.
date: 2020-05-21
hero: hero.jpg
glitch: gui-challenges-stories
glitch_path: app/index.html
related_post: stories-component
---

This is the hands-on experience companion sandbox for this [YouTube video](#). We'll be walking through the HTML, CSS and Javascript, assembling the component as we go! The [associated blog post](#) is great for learning the tradeoffs we made with the strategy.

{% Aside 'objective' %}
get our hands dirty with the code to maximize learnings
{% endAside %}


### Introduction
We'll be first going over the HTML, then the CSS, and last the Javascript. By the end you'll have a working component that you can use the same strategy for on something else.

Prep
- open `app/index.html`

## HTML
Since each friend can have any number of stories, I thought it was meaningful to make my friends `<section>`'s and each of their stories `<article>`'s. Let's start from the beginning though. 

We need a container to start from, this will be our stories component. Our first lines of code are a simple div with a class of stories. Paste the follow code inside of our `<body>` tag of `app/index.html`.

```html/0-2
<div class="stories">

</div>
```

Inside of `.stories` we'll be listing our friends, I made each of our friends a `<section>`. Like, here's a section for their contextual stories. You could even name each of these if you wanted hehe.

```html/1-4
<div class="stories"> 
  <section class="user"></section>
  <section class="user"></section>
  <section class="user"></section>
  <section class="user"></section>
</div>
```

Each friend has some pictures, we'll call each picture a `.story`. Let's dig into how and where we're putting pictures into this component. 

### Placeholder Loading Technique
I want to share a placeholder loading technique for these pictures. To do this, we'll be using CSS's `background-image` property. It allows us to specify more than one background image. We can put them in an order so that our user picture is on top and will show up automatically when it's done loading. To enable this, we'll be putting our image url into a custom property (`--bg`), and use it within our CSS to layer with the loading placeholder.

```html/2-14
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

#### That's All For HTML
This sets us up with a container to be a horizontal list (`.stories`) and a place for each of our friends stories (`.user`). You'll see in the HTML there that I'm using an image service to help me prototype friend's stories.

## CSS
Our content is ready for style, let's turn those bones into something folks will want to interact with. We'll be working mobile first today. Open `app/css/index.css` and collapse the `body {}` styles, let's clear our workspace!

{% Aside 'success' %}
Feel free to stop and study the styles in the `body` tag if you like! They're handling the responsive nature of our stories workspace.
{% endAside %}

### .stories
For our main component, we want a horizontal scrolling container, and so we made the component a grid, set each child to fill the row track and told each child to be the width of the viewport (mobile device). Grid will continue placing new `100vw` wide columns to the right of the previous one, until it's placed all the HTML elements in your markup. 

<figure class="w-figure">
  <img src="./horizontal-scroll-with-grid.png" alt="Chrome and DevTools open with a grid visual showing the full width layout">
  <figcaption class="w-figcaption">DevTools showing grid column overflow, making a horizontal scroller</figcaption>
</figure>

```css
.stories {
  display: grid;
  grid: 1fr / auto-flow 100%;
  gap: 1ch;
}
```

Now that we have content extending beyond the viewport, it's time to tell that container how to handle it. We want horizontal scrolling, so we'll overflow-x to auto, and we even throw in some extras to help iron out some UX. Check out [the associated blog post](/a-stories-component) for more information about why 👍

```css/4-6
.stories {
  display: grid;
  grid: 1fr / auto-flow 100%;
  gap: 1ch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}
```

It takes both the parent container and the children to agree to scroll snapping, so let's cover how each `.user` opts into the snapping behavior:

```css/1-2
.user {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/scroll-snap-example.mp4">
  </video>
</figure>

That will get you scrolling through your friends, but we still have an issue with the stories to solve.

### .user
Let's create a layout in the `.user` section that wrangles those child story elements into place. We're going to use a handy stacking trick to solve this. We're essentially creating a 1x1 grid where the row and column have the same alias of `story`, and each story grid item is going to try and claim that space, resulting in a stack.

```css/3-4
.user {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: grid;
  grid: [story] 1fr / [story] 1fr;
}
```

```css/1-1
.story {
  grid-area: story;
}
```

Now, without absolute positioning, floats, or other layout directives that take an element out of flow, we're still in flow. Plus, it's like barely any code, look at that. This also get's broken down in the video and the blog post better, in case you'd like additional explanation. 

### .story
Our last CSS style to do is for the story item itself. Our HTML had put these as background images, and we have some interesting things in our CSS to checkout here.

I set the `background-size` to cover which will ensure there's no empty space in the viewport, our image will be filling it up. Then, we define 2 background images and pull a neat CSS web trick: loading tombstone.
- Background image 1 (top): is our `var(--bg)`, a url we passed inline in the HTML
- Background image 2 (bottom): a gradient to show while the url is loading

CSS will automatically replace the gradient with the image, once it's done downloading:

```css/3-6
.story {
  grid-area: story;

  background-size: cover;
  background-image: 
    var(--bg), 
    linear-gradient(to top, lch(98 0 0), lch(90 0 0));
}
```

Next we'll add some CSS to remove some behavior, freeing up the browser to move faster. The first is `user-select`, which we set to none so that users don't accidentally start a text-selection moment, like to copy text. The next is to specify the item as interaction to touch events, like drag and tap. This frees the browser from trying to decide if you're clicking a link or not, resulting in an instant interaction instead of one `300ms` behind.

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

Last, we're using Javascript to toggle between our stories, why not give CSS a little hook to animate with? We'll be putting a `.seen` class onto our stories that need an exit. I decided a slight fade would be nice, so I added that transition CSS to tell it what I wanted. I instructed to animate only `opacity`, over `300ms` with a custom easing function that I got from [Material](https://material.io/design/motion/speed.html#easing).

```css/11-16
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

A keen eye would notice the `pointer-events: none` there and scratch their head. I'd say this is the only downside of the solution so far, is that a `.seen.story` is still on top and will receive taps, even though it's invisible. By setting the `pointer-events` to none, we turn the glass story into a window, and steal more user interactions. Not too bad of a trade off, not too hard to manage here in our CSS right now. We're not juggling `z-index`, I'm feeling good about this still.


## Javascript
The interactions of a stories component are quite simple to the user: tap on the right to go forward, tap on the left to go back. Simple things for users tends to be hard work for developers. We'll take care of lots of it though, it'll get us really far.

<figure class="w-figure">
  <video playsinline controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.webm" type="video/webm"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/gui-challenges/stories-desktop-demo.mp4">
  </video>
</figure>

### Setup
To start out, let's compute and store as much information as we can. Our first line of js grabs and stores a reference to our primary HTML element root. The next line calculates where the middle of our element is, so we can decide if a tap is to go forward or backward.

```js/0-1
const stories = document.querySelector('.stories')
const median = stories.offsetLeft + (stories.clientWidth / 2)
```

### State
Next I make a small object with some state relevant to our logic, and in this case, we're only interested in the current story. In our HTML markup, we can access it by grabbing the 1st user and their 1st story, like this:

```js/3-5
const stories = document.querySelector('.stories')
const median = stories.offsetLeft + (stories.clientWidth / 2)

const state = {
  current_story: stories.firstElementChild.lastElementChild
}
```

### Listeners
We have enough logic now to start listening for user events and directing them. 

#### Mouse
Let's start by listening to the `'click'` event on our stories container. If a click happens and it's not on an article (which is the element type of a `.story`), we bail and do nothing. If it is an article, the `clientX` of the click is used, which grabs the horizontal position of the mouse or finger used. If that user position is greater than the media, we know the stories needs to go `next`, otherwise `previous`. 

Ignoring `navigateStories()` for now, what we've done is: 
- Guarded the event to only those on stories
- Compared the user interaction point with the middle of the screen
- Directed user interaction to business logic

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

#### Keyboard
This time we're listening for keyboard presses in the browser window, and if the arrow is down we send navigate `next`, and if the arrow is up we navigate `previous`.

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

### Stories Navigation
Time to tackle the unique business logic of stories and the UX they've become famous for. This looks chunky and tricky, but I think if you take it line by line, you'll find it's quite digestible. 

Upfront, we stash some selectors that help us decide whether to scroll to a friend or show/hide a story. Since the HTML is where we're working, we'll be querying it for presence of friends (users) or stories (story). 

These variables will help us answer questions like, "given story x, does "next" mean move to another story or to a user," etc. I did it by using the tree structure we built, reaching into parents and their children:

```js/1-5
const navigateStories = direction => {
  const story = state.current_story
  const lastItemInUserStory = story.parentNode.firstElementChild
  const firstItemInUserStory = story.parentNode.lastElementChild
  const hasNextUserStory = story.parentElement.nextElementSibling
  const hasPrevUserStory = story.parentElement.previousElementSibling 
}
```

The argument this function accepts is the direction that was pre-determined by our event listener directors. With it and our DOM, we're ready to make a smart decision about what to do in our code.

Here's our business logic goal, as close to natural language as possible:
If there's a next/previous story: show that story
If it's the last/first story of the friend: show a new friend
If there's no story to go to in that direction: do nothing
Stash the new current story into state

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

## Conclusion
That's a wrap up for the needs I had with the component. Feel free to build upon it, drive it with data, etc! 

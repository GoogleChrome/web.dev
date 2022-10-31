---
layout: post
title: Building Chrometober!
subhead: How the scrolling book came to life for sharing fun and frightening tips and tricks this Chrometober.
authors:
  - jheyy
description: How the scrolling book came to life for sharing fun and frightening tips and tricks this Chrometober.
date: 2022-10-31
thumbnail: image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/yVQU4QE9veU6WuA8MCRq.jpg
hero: image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/yVQU4QE9veU6WuA8MCRq.jpg
alt: Two carved Halloween pumpkins sit on a surface in the dark. They are glowing from being lit within presumably by candle light. Their reflections are shown in the surface.
tags:
  - engineering-blog
  - blog
  - css
  - ux
---
Following on from [Designcember](https://designcember.com), we wanted to build Chrometober for you this year as a way to highlight and share web content from the community and Chrome team. Designcember showcased the use of Container Queries, but this year we're showcasing the CSS scroll-linked animations API.

Check out the scrolling book experience at [web.dev/chrometober-2022](/chrometober-2022).

{% Video
  controls="true",
  loop="true",
  src="video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/nIBMYSqI5NRCFoLSbeNh.mp4"
%}

## Overview

The goal of the project was to deliver a whimsical experience highlighting the scroll-linked animations API. But, whilst being whimsical, the experience needed to be responsive and accessible too. The project has also been a great way to test drive the API polyfill that is in active development; that, as well as trying different techniques and tools in combination. And all with a festive Halloween theme!

Our team structure looked like this:

- [Tyler Reed](https://twitter.com/intent/follow?screen_name=rudepetsclub): Illustration and design
- [Jhey Tompkins](https://twitter.com/intent/follow?screen_name=jh3yy): Architectural and creative lead
- [Una Kravets](https://twitter.com/intent/follow?screen_name=una): Project lead
- [Bramus Van Damme](https://twitter.com/intent/follow?screen_name=bramus): Site contributor
- [Adam Argyle](https://twitter.com/intent/follow?screen_name=argyleink): Accessibility review
- Aaron Forinton: Copywriting

## Drafting a scrollytelling experience

The ideas for Chrometober started flowing at our first team offsite back in May 2022. A collection of scribbles had us thinking of ways in which a user could scroll their way along some form of storyboard. Inspired by video games, we considered a scrolling experience through scenes such as graveyards and a haunted house.

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/5teCNthBhFithDxWLXMv.jpg", alt="A notebook lies on a desk with various doodles and scribbles related to the project.", width="800", height="600" %}

It was exciting to have the creative freedom to take my first Google project in an unexpected direction. This was an early prototype of how a user might navigate through the content.


{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/MlfvDw4pl0NqRaRnu2rC.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "gOKbBVz",
    height: 450,
    tab: 'result'
  }
%}


As the user scrolls sideways, the blocks rotate and scale in. But I decided to move away from this idea out of concern for how we could make this experience great for users on devices of all sizes. Instead, I leaned towards the design of something I'd made in the past. In 2020, I was fortunate to have access to [GreenSock's ScrollTrigger](https://greensock.com/scrolltrigger/) to build release demos.

One of the demos I’d built was a 3D-CSS book where the pages turned as you scrolled, and this felt much more appropriate for what we wanted for Chrometober. The scroll-linked animations API is a perfect swap for that functionality. It also works well with `scroll-snap`, as you'll see!

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/FlOQAUsk6Md9Rya04Gkm.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "WNybYeP",
    height: 450,
    tab: 'result'
  }
%}

Our illustrator for the project, [Tyler Reed](https://www.rudepets.club/), was great at altering the design as we changed ideas. Tyler did a fantastic job of taking all the creative ideas thrown at him and bringing them to life. It was a lot of fun brainstorming ideas together. A big part of how we wanted this to work was having features broken up into isolated blocks. That way, we could compose them into scenes and then pick and choose what we brought to life.

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/j4ecLHXusYXPiPJxlPtB.png", alt="One of the composition scenes featuring a snake, a coffin with arms coming out, a fox with a wand at a cauldron, a tree with a spooky face, and a gargoyle holding a pumpkin lantern.", width="800", height="564" %}

The main idea was that, as the user made their way through the book, they could access blocks of content. They could also interact with dashes of whimsy, including the Easter eggs we had built into the experience; for example, a portrait in a haunted house, whose eyes followed your pointer, or subtle animations triggered by media queries. These ideas and features would be animated on scroll. An early idea was a zombie bunny that would rise and translate along the x-axis on user scroll.

## Getting familiar with the API

Before we could start playing with individual features and Easter eggs, we needed a book. So we decided to turn this into a chance to test the featureset for the emerging, [CSS scroll-linked animations API](https://drafts.csswg.org/scroll-animations-1/). The scroll-linked animations API is not currently supported in any browsers. However, while developing the API, the engineers on the interactions team have been working on a [polyfill](https://github.com/flackr/scroll-timeline). This provides a way to test out the shape of the API as it develops. That means we could use this API today, and fun projects like this are often a great place to try out experimental features, and to provide feedback. Find out what we learned and the feedback we were able to provide, [later in the article](#what-we-learned).

At a high level, you can use this API to link animations to scroll. It's important to note that you can't trigger an animation on scroll—this is something that could come later. Scroll-linked animations also fall into two main categories:

1. Those that react to scroll position.
2. Those that react to an element's position in its scrolling container.

To create the latter, we use a `ViewTimeline` applied via an `animation-timeline` property.

Here's an example of what using `ViewTimeline` looks like in CSS:

```css
.element-moving-in-viewport {
  view-timeline-name: foo;
  view-timeline-axis: block;
}

.element-scroll-linked {
  animation: rotate both linear;
  animation-timeline: foo;
  animation-delay: enter 0%;
  animation-end-delay: cover 50%;
}

@keyframes rotate {
 to {
   rotate: 360deg;
 }
}
```

We create a `ViewTimeline` with `view-timeline-name` and define the axis for it. In this example, `block` refers to [logical `block`](/learn/css/logical-properties/). The animation gets linked to scroll with the `animation-timeline` property. `animation-delay` and `animation-end-delay` (at the time of writing) are how we define phases.

These phases define the points at which the animation should get linked in relation to an element's position in its scrolling container. In our example, we're saying start the animation when the element enters (`enter 0%`) the scrolling container. And finish when it has covered 50% (`cover 50%`) of the scrolling container.

Here's our demo in action:

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/xVK0tJ70MsfN6ZYmtsaS.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "jOKEQWj",
    height: 450,
    tab: 'result'
  }
%}

You could also link an animation to the element that is moving in the viewport. You can do this by setting the `animation-timeline` to be the element's `view-timeline`. This is good for scenarios such as list animations. The behavior is similar to how you might animate elements [upon entry using `IntersectionObserver`](https://twitter.com/jh3yy/status/1558551933064884225?s=20&t=A1hdziw2Oz5MgkEjTZS-2Q).

```css
element-moving-in-viewport {
  view-timeline-name: foo;
  view-timeline-axis: block;
  animation: scale both linear;
  animation-delay: enter 0%;
  animation-end-delay: cover 50%;
  animation-timeline: foo;
}

@keyframes scale {
  0% {
    scale: 0;
  }
}
```

With this,"Mover" scales up as it enters the viewport, triggering the rotation of "Spinner".

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/FnxZiRz1i8NevSCcxeag.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "MWXYzeY",
    height: 450,
    tab: 'result'
  }
%}

{% Aside %}
Do check out [the spec](https://drafts.csswg.org/scroll-animations-1/) for more in-depth details about the API. Also look out for an article dedicated to scroll-linked animations coming soon!
{% endAside %}

What I found from experimenting was that the API works very well with [scroll-snap](/css-scroll-snap/). Scroll-snap combined with `ViewTimeline` would be a great fit for snapping page turns in a book.

{% Aside %}
Feel free to check out my [scroll-linked animations API collection](https://codepen.io/collection/qOPdLq) over on CodePen.
{% endAside %}

## Prototyping the mechanics

After some experimenting, I was able to get a book prototype working. You scroll horizontally to turn the pages of the book. 

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/JZJZyFvVruWFy50EYBb8.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "JjZoeEN",
    height: 450,
    tab: 'result'
  }
%}

In the demo, you can see the different triggers highlighted with dashed borders.

The markup looks a little like this:

```html
<body>
  <div class="book-placeholder">
    <ul class="book" style="--count: 7;">
      <li
        class="page page--cover page--cover-front"
        data-scroll-target="1"
        style="--index: 0;"
      >
        <div class="page__paper">
          <div class="page__side page__side--front"></div>
          <div class="page__side page__side--back"></div>
        </div>
      </li>
      <!-- Markup for other pages here -->
    </ul>
  </div>
  <div>
    <p>intro spacer</p>
  </div>
  <div data-scroll-intro>
    <p>scale trigger</p>
  </div>
  <div data-scroll-trigger="1">
    <p>page trigger</p>
  </div>
  <!-- Markup for other triggers here -->
</body>
```

As you scroll, the pages of the book turn, but snap open or closed. This is dependent on the scroll-snap alignment of the triggers.

```css
html {
  scroll-snap-type: x mandatory;
}

body {
  grid-template-columns: repeat(var(--trigger-count), auto);
  overflow-y: hidden;
  overflow-x: scroll;
  display: grid;
}

body > [data-scroll-trigger] {
  height: 100vh;
  width: clamp(10rem, 10vw, 300px);
}

body > [data-scroll-trigger] {
  scroll-snap-align: end;
}
```

This time, we do not connect the `ViewTimeline` in CSS, but use the [Web Animations API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API) in JavaScript. This has the added benefit of being able to loop over a set of elements and generate the `ViewTimeline` we need, instead of creating them each by hand.

```js
const triggers = document.querySelectorAll("[data-scroll-trigger]")

const commonProps = {
  delay: { phase: "enter", percent: CSS.percent(0) },
  endDelay: { phase: "enter", percent: CSS.percent(100) },
  fill: "both"
}

const setupPage = (trigger, index) => {
  const target = document.querySelector(
    `[data-scroll-target="${trigger.getAttribute("data-scroll-trigger")}"]`
  );

  const viewTimeline = new ViewTimeline({
    subject: trigger,
    axis: 'inline',
  });

  target.animate(
    [
      {
        transform: `translateZ(${(triggers.length - index) * 2}px)`
      },
      {
        transform: `translateZ(${(triggers.length - index) * 2}px)`,
        offset: 0.75
      },
      {
        transform: `translateZ(${(triggers.length - index) * -1}px)`
      }
    ],
    {
      timeline: viewTimeline,
      …commonProps,
    }
  );
  target.querySelector(".page__paper").animate(
    [
      {
        transform: "rotateY(0deg)"
      },
      {
        transform: "rotateY(-180deg)"
      }
    ],
    {
      timeline: viewTimeline,
      …commonProps,
    }
  );
};

const triggers = document.querySelectorAll('[data-scroll-trigger]')
triggers.forEach(setupPage);
```

For each trigger, we generate a `ViewTimeline`. Then we animate the trigger's associated page using that `ViewTimeline`. That links the page's animation to scroll. For our animation, we are rotating an element of the page on the y-axis to turn the page. We also translate the page itself on the z-axis so it behaves like a book.

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/up1PL47mHnpZLbOfMJoX.mp4"
  }
%}

## Putting it all together

Once I'd worked out the mechanism for the book, I could focus on bringing Tyler's illustrations to life.

### Astro

The team [used Astro for Designcember](/how-we-built-designcember/) in 2021 and I was keen to use it again for Chrometober. The developer experience of being able to break things up into components is well suited to this project.

The book itself is a component. It is also a collection of page components. Each page has two sides and they have backdrops. The children of a page side are components which can be added, removed, and positioned with ease.

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/6k7eoCK4ObUg9VMvWg0x.mp4"
  }
%}

### Building a book

It was important for me to make the blocks easy to manage. I also wanted to make it easy for the rest of the team to make contributions.

The pages at a high level are defined by a configuration array. Each page object in the array defines the content, backdrop, and other metadata for a page.

```js
const pages = [
  {
    front: {
      marked: true,
      content: PageTwo,
      backdrop: spreadOne,
      darkBackdrop: spreadOneDark
    },
    back: {
      content: PageThree,
      backdrop: spreadTwo,
      darkBackdrop: spreadTwoDark
    },
    aria: `page 1`
  },
  /* Obfuscated page objects */
]
```

These get passed to the `Book` component.

```html
<Book pages={pages} />
```

The `Book` component is where the scrolling mechanism is applied and the pages of the book are created. The same mechanism from the prototype is used; but we share multiple instances of  `ViewTimeline` that are created globally.

```js
window.CHROMETOBER_TIMELINES.push(viewTimeline);
```
This way, we can share the timelines to be used elsewhere instead of recreating them. More on this later.

### Page composition
Each page is a list item inside a list:

```js
<ul class="book">
  {
    pages.map((page, index) => {
      const FrontSlot = page.front.content
      const BackSlot = page.back.content
      return (
        <Page
          index={index}
          cover={page.cover}
          aria={page.aria}
          backdrop={
            {
              front: {
                light: page.front.backdrop,
                dark: page.front.darkBackdrop
              },
              back: {
                light: page.back.backdrop,
                dark: page.back.darkBackdrop
              }
            }
          }>
          {page.front.content && <FrontSlot slot="front" />}    
          {page.back.content && <BackSlot slot="back" />}    
        </Page>
      )
    })
  }
</ul>
```

And the defined configuration gets passed to each `Page` instance. The pages use Astro's [slot feature](https://docs.astro.build/en/core-concepts/astro-components/#slots) to insert content into each page.

```html
<li
  class={className}
  data-scroll-target={target}
  style={`--index:${index};`}
  aria-label={aria}
>
  <div class="page__paper">
    <div
      class="page__side page__side--front"
      aria-label={`Right page of ${index}`}
    >
      <picture>
        <source
          srcset={darkFront}
          media="(prefers-color-scheme: dark)"
          height="214"
          width="150"
        >
        <img
          src={lightFront}
          class="page__background page__background--right"
          alt=""
          aria-hidden="true"
          height="214"
          width="150"
        >
      </picture>
      <div class="page__content">
        <slot name="front" />
      </div>
    </div>
    <!-- Markup for back page -->
  </div>
</li>
```

This code is mostly for setting up structure. Contributors can work on the book’s content for the most part without having to touch this code.

### Backdrops

The creative shift towards a book made splitting up the sections much easier, and each spread of the book is a scene taken from the original design.

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/N3UtScgJr16t0Xp4vDN7.png", alt="Page spread illustration from the book which features an apple tree in a graveyard. The graveyard has multiple headstones and there is a bat in the sky in front of a large moon.", width="800", height="560" %}

As we had decided on an aspect ratio for the book, the backdrop for each page could have a picture element. Setting that element to 200% width and using `object-position` based on page side does the trick.

```css
.page__background {
  height: 100%;
  width: 200%;
  object-fit: cover;
  object-position: 0 0;
  position: absolute;
  top: 0;
  left: 0;
}

.page__background--right {
  object-position: 100% 0;
}

```

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/koKQdPSVpa7uARGLmcXL.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "RwJNOrO",
    height: 450,
    tab: 'result'
  }
%}

### Page content

Let's look at building out one of the pages. Page three features an owl that pops up in a tree.

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/GYZvp3dT9l57lIfjO2wE.mp4"
  }
%}

It gets populated with a `PageThree` component, as defined in the configuration. It’s an [Astro component](https://docs.astro.build/en/core-concepts/astro-components/) (`PageThree.astro`). These components look like HTML files but they have a code fence at the top similar to frontmatter. This enables us to do things like import other components. The component for page three looks like this:

```jsx
---
import TreeOwl from '../TreeOwl/TreeOwl.astro'
import { contentBlocks } from '../../assets/content-blocks.json'
import ContentBlock from '../ContentBlock/ContentBlock.astro'
---
<TreeOwl/>
<ContentBlock {...contentBlocks[3]} id="four" />

<style is:global>
  .content-block--four {
    left: 30%;
    bottom: 10%;
  }
</style>
```

Again, pages are atomic in nature. They are built from a collection of features. Page three features a content block and the interactive owl, so there is a component for each.

Content blocks are the links to content seen within the book. These are also driven by a configuration object.

```json
{
 "contentBlocks": [
    {
      "id": "one",
      "title": "New in Chrome",
      "blurb": "Lift your spirits with a round up of all the tools and features in Chrome.",
      "link": "https://www.youtube.com/watch?v=qwdN1fJA_d8&list=PLNYkxOF6rcIDfz8XEA3loxY32tYh7CI3m"
    },
    …otherBlocks
  ]
}
```

This configuration gets imported where content blocks are required. Then the relevant block configuration gets passed to the `ContentBlock` component.

```jsx
<ContentBlock {...contentBlocks[3]} id="four" />
```

There is also an example here of how we use the page's component as a place to position the content. Here, a content block gets positioned.

```html
<style is:global>
  .content-block--four {
    left: 30%;
    bottom: 10%;
  }
</style>
```

But, the general styles for a content block are co-located with the component code.

```css
.content-block {
  background: hsl(0deg 0% 0% / 70%);
  color: var(--gray-0);
  border-radius:  min(3vh, var(--size-4));
  padding: clamp(0.75rem, 2vw, 1.25rem);
  display: grid;
  gap: var(--size-2);
  position: absolute;
  cursor: pointer;
  width: 50%;
}
```

As for our owl, it's an interactive feature—one of many in this project. This is a nice small example to go through that shows how we used the shared ViewTimeline that we created.

At a high level, our owl component imports some SVG and inlines it using Astro's Fragment.

```jsx
---
import { default as Owl } from '../Features/Owl.svg?raw'
---
<Fragment set:html={Owl} />
```

And the styles for positioning our owl are co-located with the component code.

```css
.owl {
  width: 34%;
  left: 10%;
  bottom: 34%;
}
```

There is one extra piece of styling that defines the `transform` behavior for the owl.

```css
.owl__owl {
  transform-origin: 50% 100%;
  transform-box: fill-box;
}
```

The use of `transform-box` affects the `transform-origin`. It makes it relative to the object’s bounding box within the SVG. The owl scales up from the bottom center, hence the use of `transform-origin: 50% 100%`.

The fun part is when we link the owl up to one of our generated `ViewTimeline`s:

```js
const setUpOwl = () => {
   const owl = document.querySelector('.owl__owl');

   owl.animate([
     {
       translate: '0% 110%',
     },
     {
       translate: '0% 10%',
     },
   ], {
     timeline: CHROMETOBER_TIMELINES[1],
     delay: { phase: "enter", percent: CSS.percent(80) },
     endDelay: { phase: "enter", percent: CSS.percent(90) },
     fill: 'both' 
   });
 }

 if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches)
   setUpOwl()
```

In this block of code, we do two things:

1. Check for the user’s motion preferences.
2. If they have no preference, link an animation of the owl to scroll.

For the second part, the owl animates on the y-axis using the Web Animations API. Individual transform property `translate` is used, and is linked to one `ViewTimeline`. It's linked to `CHROMETOBER_TIMELINES[1]` via the `timeline` property. This is a `ViewTimeline` that is generated for the page turns. This links the owl's animation to the page turn using the `enter` phase. It defines that, when the page is 80% turned, start moving the owl. At 90%, the owl should finish its translation.

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/GYZvp3dT9l57lIfjO2wE.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "KKewLKo",
    height: 450,
    tab: 'result'
  }
%}

## Book features

Now you've seen the approach for building a page and how the project architecture works. You can see how it allows contributors to jump in and work on a page or feature of their choosing. Various features in the book have their animations linked to the book's page turning; for example, the bat that flies in and out on page turns.

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/D9wLvoj1f8Ieddu9MGUm.mp4"
  }
%}

It also has elements that are powered by [CSS animations](https://developer.mozilla.org/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

Once the content blocks were in the book, there was time to get creative with other features. This provided an opportunity to generate some different interactions, and try different ways to implement things.

### Keeping things responsive

Responsive viewport units size the book and its features. However, keeping fonts responsive was an interesting challenge. Container query units are a good fit here. They aren't supported everywhere yet, though. The size of the book is set, so we don't need a container query. An inline container query unit can be generated with [CSS `calc()`](https://developer.mozilla.org/docs/Web/CSS/calc) and used for font sizing.

```css

.book-placeholder {
  --size: clamp(12rem, 72vw, 80vmin);
  --aspect-ratio: 360 / 504;
  --cqi: calc(0.01 * (var(--size) * (var(--aspect-ratio))));
}

.content-block h2 {
  color: var(--gray-0);
  font-size: clamp(0.6rem, var(--cqi) * 4, 1.5rem);
}

.content-block :is(p, a) {
  font-size: clamp(0.6rem, var(--cqi) * 3, 1.5rem);
}
```

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/kXldZFb8uwtGdIBV6xY6.mp4"
  }
%}

### Pumpkins shine at night

Those with a keen eye may have noticed the use of `<source>` elements when discussing the page backdrops earlier. [Una](https://twitter.com/una) was keen to have an interaction that reacted to color scheme preference. As a result, the backdrops support both light and dark modes with different variants. Because you can use media queries with the `<picture>` element, it's a great way to provide two backdrop styles. The `<source>` element queries for color scheme preference, and shows the appropriate backdrop.

```html
<picture>
  <source srcset={darkFront} media="(prefers-color-scheme: dark)" height="214" width="150">
  <img src={lightFront} class="page__background page__background--right" alt="" aria-hidden="true" height="214" width="150">
</picture>
```
You could introduce other changes based on that color scheme preference. The pumpkins on page two react to a user's color scheme preference. The SVG used has circles that represent flames, which scale up and animate in dark mode.

```css
.pumpkin__flame,
 .pumpkin__flame circle {
   transform-box: fill-box;
   transform-origin: 50% 100%;
 }

 .pumpkin__flame {
   scale: 0.8;
 }

 .pumpkin__flame circle {
   transition: scale 0.2s;
   scale: 0;
 }

@media(prefers-color-scheme: dark) {
   .pumpkin__flame {
     animation: pumpkin-flicker 3s calc(var(--index, 0) * -1s) infinite linear;
   }

   .pumpkin__flame circle {
     scale: 1;
   }

   @keyframes pumpkin-flicker {
     50% {
       scale: 1;
     }
   }
 }
```

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/PYuFOFPEG5RjwVySed3J.mp4"
  }
%}

### Is this portrait watching you?

If you check out page 10, you might notice something. You're being watched! The eyes of the portrait will follow your pointer as you move around the page. The trick here is to map the pointer location to a translate value, and pass it through to CSS.

```js
const mapRange = (inputLower, inputUpper, outputLower, outputUpper, value) => {
   const INPUT_RANGE = inputUpper - inputLower
   const OUTPUT_RANGE = outputUpper - outputLower
   return outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
 }
```

This code takes input and output ranges, and maps the given values. For example, this usage would give the value 625.

```js
mapRange(0, 100, 250, 1000, 50) // 625
```

For the portrait, the input value is the center point of each eye, plus or minus some pixel distance. The output range is how much the eyes can translate in pixels. And then the pointer position on the x or y axis gets passed as the value. To get the center point of the eyes while moving them, the eyes are duplicated. The originals don't move, are transparent, and used for reference.

Then it's a case of tying it together and updating the CSS custom property values on the eyes so the eyes can move. A function is bound to the `pointermove` event against the `window`. As this fires, the bounds of each eye get used to calculate the center points. Then the pointer position is mapped to values that are set as custom property values on the eyes.

```js
const RANGE = 15
const LIMIT = 80
const interact = ({ x, y }) => {
   // map a range against the eyes and pass in via custom properties
   const LEFT_EYE_BOUNDS = LEFT_EYE.getBoundingClientRect()
   const RIGHT_EYE_BOUNDS = RIGHT_EYE.getBoundingClientRect()

   const CENTERS = {
     lx: LEFT_EYE_BOUNDS.left + LEFT_EYE_BOUNDS.width * 0.5,
     rx: RIGHT_EYE_BOUNDS.left + RIGHT_EYE_BOUNDS.width * 0.5,
     ly: LEFT_EYE_BOUNDS.top + LEFT_EYE_BOUNDS.height * 0.5,
     ry: RIGHT_EYE_BOUNDS.top + RIGHT_EYE_BOUNDS.height * 0.5,
   }

   Object.entries(CENTERS)
     .forEach(([key, value]) => {
       const result = mapRange(value - LIMIT, value + LIMIT, -RANGE, RANGE)(key.indexOf('x') !== -1 ? x : y)
       EYES.style.setProperty(`--${key}`, result)
     })
 }
```

Once the values are passed to CSS, the styles can do what they want with them. The great part here is using [CSS `clamp()`](https://developer.mozilla.org/docs/Web/CSS/clamp) to make the behavior different for each eye, so you can make each eye behave differently without touching the JavaScript again.

```css
.portrait__eye--mover {
   transition: translate 0.2s;
 }

 .portrait__eye--mover.portrait__eye--left {
   translate:
     clamp(-10px, var(--lx, 0) * 1px, 4px)
     clamp(-4px, var(--ly, 0) * 0.5px, 10px);
 }

 .portrait__eye--mover.portrait__eye--right {
   translate:
     clamp(-4px, var(--rx, 0) * 1px, 10px)
     clamp(-4px, var(--ry, 0) * 0.5px, 10px);
 }
```



{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/ciul3m4cJLWEy9vD6CVx.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "vYrOOGG",
    height: 450,
    tab: 'result'
  }
%}

### Casting spells

If you check out page six, do you feel spellbound? This page embraces the design of our fantastic magical fox. If you move your pointer around, you may see a custom cursor trail effect. This uses canvas animation. A `<canvas>` element sits above the rest of the page content with `pointer-events: none`. This means users can still click the content blocks underneath.

```css
.wand-canvas {
  height: 100%;
  width: 200%;
  pointer-events: none;
  right: 0;
  position: fixed;
}
```

Much like how our portrait listens for a `pointermove` event on `window`, so does our `<canvas>` element. Yet each time the event fires, we're creating an object to animate on the `<canvas>` element. These objects represent shapes used in the cursor trail. They have coordinates and a random hue.

Our `mapRange` function from earlier is used again, as we can use it to map the pointer delta to `size` and `rate`. The objects are stored in an array that gets looped over when the objects are drawn to the `<canvas>` element. The properties for each object tell our `<canvas>` element where things should be drawn.

```js
const blocks = []
  const createBlock = ({ x, y, movementX, movementY }) => {
    const LOWER_SIZE = CANVAS.height * 0.05
    const UPPER_SIZE = CANVAS.height * 0.25
    const size = mapRange(0, 100, LOWER_SIZE, UPPER_SIZE, Math.max(Math.abs(movementX), Math.abs(movementY)))
    const rate = mapRange(LOWER_SIZE, UPPER_SIZE, 1, 5, size)
    const { left, top, width, height } = CANVAS.getBoundingClientRect()
    
    const block = {
      hue: Math.random() * 359,
      x: x - left,
      y: y - top,
      size,
      rate,
    }
    
    blocks.push(block)
  }
window.addEventListener('pointermove', createBlock)
```

For drawing to the canvas, a loop is created with `requestAnimationFrame`. The cursor trail should only render when the page is in view. We have an `IntersectionObserver` that updates and determines which pages are in view. If a page is in view, the objects are rendered as circles on the canvas.

We then loop over the `blocks` array and draw each part of the trail. Each frame reduces the size and alters the position of the object by the `rate`. This produces that falling and scaling effect. If the object shrinks completely, the object is removed from the `blocks` array.

```js
let wandFrame
const drawBlocks = () => {
   ctx.clearRect(0, 0, CANVAS.width, CANVAS.height)
  
   if (PAGE_SIX.className.indexOf('in-view') === -1 && wandFrame) {
     blocks.length = 0
     cancelAnimationFrame(wandFrame)
     document.body.removeEventListener('pointermove', createBlock)
     document.removeEventListener('resize', init)
   }
  
   for (let b = 0; b < blocks.length; b++) {
     const block = blocks[b]
     ctx.strokeStyle = ctx.fillStyle = `hsla(${block.hue}, 80%, 80%, 0.5)`
     ctx.beginPath()
     ctx.arc(block.x, block.y, block.size * 0.5, 0, 2 * Math.PI)
     ctx.stroke()
     ctx.fill()

     block.size -= block.rate
     block.y += block.rate

     if (block.size <= 0) {
       blocks.splice(b, 1)
     }

   }
   wandFrame = requestAnimationFrame(drawBlocks)
 }
```

If the page goes out of view, event listeners are removed and the animation frame loop is canceled. The `blocks` array is also cleared.

Here's the cursor trail in action!

{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/1v5SAuZIIC0fpxNzfVX1.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "QWxbbQB",
    height: 450,
    tab: 'result'
  }
%}


## Accessibility review

It's all good creating a fun experience to explore, but it's no good if it isn't accessible to users. [Adam](https://twitter.com/argyleink)'s expertise in this area proved invaluable in getting Chrometober prepared for an accessibility review before release.

Some of the notable areas covered:

- Ensuring that the HTML used was semantic. This included things like appropriate landmark elements such as `<main>` for the book; aso the use of the `<article>` element for each content block, and `<abbr>` elements where acronyms are introduced. Thinking ahead as the book was built made things more accessible. The use of headings and links makes it easier for a user to navigate. The use of a list for the pages also means the number of pages is announced by assistive technology.
- Ensuring that all images use appropriate `alt` attributes. For inline SVGs, the `title` element is present where necessary.
- Using `aria` attributes where they improve the experience. The use of `aria-label` for pages and their sides communicates to the user which page they are on. The use of `aria-describedBy` on the "Read more" links communicates the text of the content block. This removes ambiguity about where the link will take the user.
- On the subject of content blocks, the ability to click the whole card and not only the "Read more" link is available.
- The use of an `IntersectionObserver` to track which pages are in view came up earlier. This has many benefits that aren't just performance related. Pages not in view will have any animation or interaction paused. But these pages also have the `inert` attribute applied. This means that users using a screen reader can explore the same content as sighted users. Focus remains within the page that's in view and users can't tab to another page.
- Last but not least, we make use of media queries to respect a user's preference for motion.

Here's a screenshot from the review highlighting some of the measures in place.



{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/BtC3lPDyNj9DqIg7uT9s.jpg", alt="Screenshot of the front page of the Chrometober book. Green outlined boxes are provided around various aspects of the UI, describing the intended accessibility functionality and the user experience outcomes that the page will deliver. For example, header elements have a green box around them, indicating they can be navigated via headline landmarks. Another example is the <main> element is identified as around the whole book, indicating it should be the main landmark for assistive technology users to find. More is outlined in the screenshot.", width="800", height="465" %}

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/ecmrk7v25vNJJC9ENukj.jpg", alt="Screenshot of the Chrometober book open. Green outlined boxes are provided around various aspects of the UI, describing the intended accessibility functionality and the user experience outcomes that the page will deliver. For example, images have alt text. Another example is an accessibility label declaring that pages out of view are inert. More is outlined in the screenshot.", width="800", height="463" %}


## What we learned

The motivation behind Chrometober was not only to highlight web content from the community, but was also a way for us to test drive the scroll-linked animations API polyfill that's in development.

We set aside a session while on our team summit in New York to test the project and tackle issues that arose. The team's contribution was invaluable. It was also a great opportunity to list all the things that needed tackling before we could go live.

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/XZUlK54695r51ACoMRFr.png", alt="CSS, UI, and DevTools team sit around the table in a conference room. Una stands at a whiteboard which is covered in sticky notes. Other team members sit around the table with refreshments and laptops.", width="800", height="450" %}

For example, testing out the book on devices raised a rendering issue. Our book wouldn't render as expected on iOS devices. Viewport units size the page, but when a notch was present, it affected the book. The solution was to use `viewport-fit=cover` in the `meta` viewport:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

This session also raised some issues with the API polyfill. [Bramus](https://twitter.com/bramus) raised these issues in the polyfill repository. He subsequently found solutions to those issues and got them merged into the polyfill. For example, [this pull request](https://github.com/flackr/scroll-timeline/pull/84) made a performance gain by adding caching to part of the polyfill.

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/KqWtVBOnDI4irqSg75fy.png", alt="A screenshot of a demo open in Chrome. The Developer Tools are open and show a baseline performance measurement.", width="800", height="392" %}

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/KtNfXA8JbaP3embdPPxK.png", alt="A screenshot of a demo open in Chrome. The Developer Tools are open and show an improved performance measurement.", width="800", height="392" %}

## That's it!

This has been a real fun project to work on, resulting in a whimsical scrolling experience that highlights amazing content from the community. Not only that, it's been great for testing the polyfill, as well as providing feedback to the engineering team to help improve the polyfill.



{% Video {
    controls: true,
    loop: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/fNQYmEUY2CSbhPJ8fEnz.mp4"
  }
%}

{% Codepen {
    user: 'web-dot-dev',
    id: "PoaqYrR",
    height: 450,
    tab: 'result'
  }
%}

[Chrometober 2022](/chrometober-2022) is a wrap.

We hope you enjoyed it! What's your favorite feature? [Tweet me](https://twitter.com/jh3yy) and let us know!

{% Img src="image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/RjZRcgYXbrBiUuI9q2iB.jpg", alt="Jhey holding a sticker sheet of the characters from Chrometober.", width="800", height="601" %}

You might even be able to grab some stickers from one of the team if you [see us at an event](https://developer.chrome.com/meet-the-team/).

_Hero Photo by [David Menidrey](https://unsplash.com/@cazault) on [Unsplash](https://unsplash.com/s/photos/pumpkins)_
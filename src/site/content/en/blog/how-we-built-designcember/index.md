---
layout: post
title: 'Building Designcember'
authors: 
  - adamargyle
  - una
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  A peek into the process and tools used to build the holiday-calendar-style experience of Designcember. 
description: >
  A peek into the process and tools used to build the holiday-calendar-style experience of Designcember. 
date: 2021-12-28
tags:
  - blog
  - css
---

In the spirit of December and the many calendars that folks use to countdown and celebrate, we wanted to highlight web content from the community and the Chrome team. Every day, we highlighted one piece of UI-development and design-related content, totaling 31 highlights, among which were 26 new demo sites, tools, announcements, podcasts, videos, articles, and case studies.

See the full experience at [designcember.com](https://designcember.com).

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/v8kOpJVC6fygzllNjUpC.png", alt="The Designcember site.", width="800", height="1034" %}

## Overview

Our goal was to deliver an accessible, whimsical, modern, and responsive web experience in as few bytes as possible. We wanted to highlight new responsive APIs like container queries, and include a beautiful example of a dark mode in a design-focused and asset-heavy website. To achieve this, we compressed files, offered multiple formats, used build tools optimized for static site generation, shipped a new polyfill, and more.

## Starting with whimsy

The idea around the Designcember calendar site was to function as a showcase for all the work we wanted to spotlight throughout the month of December, while acting like a demo site itself. We decided to build a responsive apartment building that could get taller and more narrow, or shorter and wider, with windows that rearranged themselves within the frame. Each window represented one day (and thus, one piece of content). 
We worked with illustrator [Alice Lee](https://www.byalicelee.com/) to bring our vision to life.

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/rO328nH0xEtVpwbXeYSi.jpg", alt="Sketches of the Designcember page skeleton.", width="800", height="618" %}

Alice was inspiring, sharing processes and sketches that were exciting even in their early concepts. While she worked on the art, we hacked on the architecture. Early discussions were around the macro layout, the building, and its windows. How would the windows adapt to one, two, or three columns as more viewport space became available? How far could they shrink or stretch? What would the maximum size of the building be? How much would the windows shift?

Here's a preview of a responsive prototype using [`grid-auto-flow: dense`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-flow) showing how windows could be auto placed by the grid algorithm. We quickly realized that while aspect-ratio grids performed beautifully to showcase art, they didn’t provide an opportunity to let the windows grow and shrink into non-uniform available space and showcase the power of container queries.

<figure>
{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/Ktw3eAZCo6p5avjO6xdm.gif", alt="Animation that shows how this wireframe responds to different screen sizes.", width="800", height="552" %}

<figcaption>
   <a href="https://codepen.io/argyleink/pen/189adacf9be3eb2348308d904d493143?editors=1100">Check out this demo on CodePen.</a>
</figcaption>

</figure>

Once the general grid was relatively stable and communicated a sense of direction for the responsiveness of the building and its windows, we could focus on a single window. Some windows stretched, shrank, squeezed, grew, and re-composed themselves more than others in the grid.


{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/iJWU8JYwUhpeXafZ434y.png", alt="Wireframes showing how the windows display at different breakpoints.", width="800", height="812" %}

Each window would need to handle a certain amount of resize turbulence. Below is a prototype of a window demonstrating its responsiveness to turbulence, showing how much we could expect each interactive window to adjust.

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/2F6S98FvsNhviuBvtJcI.mov", autoplay="true", loop="true", muted="true" %}

## Window animation with spritesheets

Some windows have animations to bring extra interaction to the experience. The animations are hand-drawn, frame by frame, in Photoshop. Each frame is exported, turned into a spritesheet with this 
[spritesheet generator](https://www.toptal.com/developers/css/sprite-generator/), then optimized with Squoosh. The CSS animation then uses `background-position-x` and 
[`animation-timing-function`](https://developer.mozilla.org/docs/Web/CSS/animation-timing-function) as shown in the following example.

```css
.una
  background: url("/day1/una_sprite.webp") 0% 0%;
  background-size: 400% auto;
}

.day:is(:hover, :focus-within) .una {
  animation: una-wave .5s steps(1) alternate infinite;
}

@keyframes una-wave {
  0%  { background-position-x: 0%; }
  25% { background-position-x: 300%; }
  50% { background-position-x: 200%; }
  75% { background-position-x: 100%; }
}
```

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/wQurazNt80vsmII3rdnT.gif", alt="Animation showing the window for day one.", width="800", height="933", style="max-width: 400px; margin: 1em auto;" %}

Some animations, such as the [piggy bank of day six](https://designcember.com/#6th), were step-based CSS animations. 
We achieved this effect with a similar technique, using `steps()`, with the difference being that the keyframes were CSS transform positions instead of background positions.

## CSS masking

Some windows had unique shapes. We used 
[masks](https://developer.mozilla.org/docs/Web/CSS/mask) and 
[`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) to help make a scalable, uniquely shaped, and adaptive window. 

To create a mask, such as this one for window eight, some classic Photoshop skills were needed, 
plus a little bit of knowledge about how masks on the web work. Let's look at the window for day eight.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/ZFET81EyIUsVEofkYDIt.png", alt="The window for day eight.", width="800", height="655", style="max-width: 400px; margin: 1em auto;" %}

To become a mask, the inner four leaf clover type shape has to be isolated as its own shape and filled in the color white. White tells the CSS what content stays, and everything outside the white won't. In Photoshop, the inside of the window was selected, feathered 1px (to remove aliasing issues), then filled white and exported at the same height and width as the window frame. This way the frame and the mask could be layered directly on top of each other, showing the inner content within the frame as expected.

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/Jm6F9q8T41Sf6riwNYS7.png", alt="Clover mask image", width="776", height="774", style="max-width: 400px; margin: 1em auto;" %}

Once complete, the contents of the window could be modified and would always appear to stay within the custom frame. The following image shows the dark mode version of the window, with a different background gradient and a glow CSS filter applied to the light.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/5F1DOOOGToYyQ8lv6wjW.png", alt="The window for day eight in dark mode.", width="800", height="634", style="max-width: 400px; margin: 1em auto;" %}

Masking also supports responsive container-query based windows. In window nine, there’s a character who is hidden behind a mask until the window is in a more narrow size. To make sure the user can’t adjust the image out of frame, Alice completed the full character for us. The character is masked within the window, but the plants are not, so another challenge we dealt with was layering masked elements with unmasked layers, and ensuring that they all scaled well together.

The following image shows what it looks like without the mask on the window and character.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/jWEL8nIl454zzKMnhyEo.png", alt="The image for window nine without the mask.", width="512", height="319" %}

## Squooshing the art

To maintain the fidelity of the illustration and ensure high definition screens wouldn't get a blurry user experience, Alice worked at a 3x pixel ratio. The plan was to use imgix and serve optimized images and formats on their server, but we found that manual tweaking with the Squoosh tool could save us 50% or more.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/MSHzLyoiZdAZyy0oVHwo.png", alt="Using Squoosh to compress images.", width="800", height="490" %}

Illustration has unique challenges for compression, especially the brush stroke and transparent rough edge style Alice used. We chose to Squoosh each 3x Photoshop exported png image, to a smaller png, webp, and avif. Each file type has its own special compression abilities, and it took compressing more than 50 images to find some common optimization settings.

The [Squoosh CLI](https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli) became crucial with over 200 images to optimize&mdash;doing all those manually would have taken days. Once we had the common optimization settings, we provided them as command line instructions and batch processed entire folders of PNG images into their WebP and AVIF compressed counterparts. 

Here's an example AVIF CLI squoosh command used:

```bash
npx @squoosh/cli --quant '{"enabled":true,"zx":0,"maxNumColors":256,"dither":1}' --avif '{"cqLevel":19,"cqAlphaLevel":17,"subsample":1,"tileColsLog2":0,"tileRowsLog2":0,"speed":6,"chromaDeltaQ":false,"sharpness":5,"denoiseLevel":0,"tune":0}' image-1.png image-2.png image-3.png
```

With optimized artwork checked into the repo, we could start loading them from HTML:

```html
<picture>
  <source srcset="/day1/inner-frame.avif" type="image/avif">
  <source srcset="/day1/inner-frame.webp" type="image/webp">
  <img alt="" decoding="async" role="presentation" src="/day1/inner-frame.png">
</picture>
```

It was repetitive to write the picture source code, so we made an 
[Astro component](https://github.com/GoogleChromeLabs/designcember/blob/main/src/components/Pic/Pic.astro) to embed images with one line of code.

```html
<Pic filename="day1/inner-frame" role="presentation" />
```

## Screen reader and keyboard users

Much of the experience of Designcember is through the art and interactive windows. It was important to us that a keyboard user could use the site and peek into windows, and that screen reader users get a nice narrated experience. 

For example, when embedding the images we used `role="presentation"` to mark the image as presentational for screen readers. We felt that a user experience of between 5 and 12 fractured `alt` descriptions was going to be a poor experience. So, we marked the images as presentational and provided an overall window narration. Moving through the windows on a screen reader then has a nice narrative feeling, which we hoped would help deliver the whimsy and fun the site wants to share.

The following video shows a demo of the keyboard experience. Tab, enter, spacebar, and escape keys are all used to orchestrate focus to and from the window popups and the windows.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/UYNJSy92FLABrsLgz0lz.mp4", autoplay="true", loop="true", muted="true" %}

The screen reader experience has special ARIA attributes that bring clarity to the content. For example, the links for the days only say "one" or "two", but with some added ARIA, they are announced as "Day one" and "Day two." Furthermore, all the images are summarized in a single label so each window has a description.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/bKYH0xxOJkwh0RTMGuAG.mp4", autoplay="true", loop="true", muted="true" %}

## Astro, static first, component-driven site generator

[Astro](https://astro.build/) made it easy for the team to work together on the site. The component model was familiar to both Angular and React developers, while the scoped classname style system helped each developer know their work on a window wouldn't conflict with anyone else. 

### Days as components

[Each day was a component](https://github.com/GoogleChromeLabs/designcember/blob/main/src/components/Days/Day1.astro) that fetched status from a 
[build time data store](https://github.com/GoogleChromeLabs/designcember/blob/main/src/components/Days/day.store.js). This let us run template logic before the HTML reached the browser. The logic would determine if the day should show its tooltip or not, as inactive days don't have pop ups. 

Builds are run every hour and the build time data store would unlock a new day when the build server was past midnight. These self-updating and self-sufficient little systems keep the site up to date.

### Scoped styles and Open Props

Astro [scopes styles written inside its component model](https://docs.astro.build/guides/styling/), which made distributing the workload amongst many team members easier, and also made using [Open Props](https://open-props.style/) fun. The [Open Props normalize.css](https://unpkg.com/open-props/normalize.min.css) styles came in handy with the adaptive (light and dark) theme, as well as helping wrangle content like paragraphs and headers. 

As early adopters of Astro, we ran into a few snags with PostCSS. For example, we weren't able to update to the 
[latest Astro version](https://astro.build/blog/astro-021-release/) due to too many build issues. More time could be spent here, optimizing the build and developer workflows. 

## Flexible containers

Some windows grow and shrink, maintaining [aspect ratio](/aspect-ratio) to preserve their art. We used some other windows to showcase the power of component-based architecture with container queries. Container queries meant windows could own their individual responsive styling information and readjust based on their own sizes. Some windows went from narrow to wide and needed to adjust the size of the media within them, as well as the placement of that media.


{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/ssFflPRQrTum3fbwkAWZ.png", alt="A demonstration of how the windows change as they have more space.", width="800", height="383" %}

As more space becomes available for a window, we could adapt the size or child elements of the window to fit. Turned out that in order to fulfill the adaptive windows, container queries wouldn't just be fun to showcase, they'd be required and drastically simplify orchestrating certain layouts. 

```css
.day {
  container: inline-size;
}

.day > .pane {
  min-block-size: 250px;

  @container (min-width: 220px) {
    min-block-size: 300px;
  }

  @container (min-width: 260px) {
    min-block-size: 310px;
  }

  @container (min-width: 360px) {
    min-block-size: 450px;
  }
}
```

{% Aside 'warning' %}
The container query spec has since added a required `size()` wrapper around width and height queries. This syntax language is still a work in progress, but the polyfill described later in this article supports both syntaxes.
{% endAside %}

This approach is different from maintaining an aspect ratio. It offers more control and more opportunities. At a certain size, many children shift around to adapt to a new layout. 

Container queries also allowed us to support block-direction (vertical) containment, so as a window grew in length, we could adjust its styles to fit appropriately. This is seen in the height-based queries, which we used standalone, and in addition to width-based queries:

```css
.person {
  place-self: flex-end;
  margin-block: 25% 50%;
  margin-inline-start: -15%;
  z-index: var(--layer-1);

  @container (max-height: 350px) and (max-width: 425px) {
    place-self: center flex-end;
    inline-size: 50%;
    inset-block-end: -15%;
    margin-block-start: -2%;
    margin-block-end: -25%;
    z-index: var(--layer-2);
  }
}
```

We also used container queries to show and hide detail as the art became increasingly crowded at smaller sizes, and emptier at wider sizes. Window nine is a great example of where this came into play:

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/rXfci0RECfk5six1UTGv.mov", autoplay="true", loop="true", muted="true" %}


## Cross-browser support

To create a great modern cross-browser experience, especially for experimental APIs like container queries, we need a great polyfill. We sent a call out to our team, and Surma spearheaded a build for a new [container query polyfill](https://www.npmjs.com/package/container-query-polyfill). The polyfill relies on [ResizeObserver](https://caniuse.com/resizeobserver), [MutationObserver](https://caniuse.com/mutationobserver) and the CSS [:is() function](https://caniuse.com/css-matches-pseudo). Therefore, all modern browsers support the polyfill, specifically Chrome and Edgefrom version 88, Firefox from version 78, and Safari from version 14. Using the polyfill allows any of the following syntaxes:

```css
/* These are all equivalent */
@container (min-width: 200px) {
  /* ... */
}
@container (width >= 200px) {
  /* ... */
}
@container size(width >= 200px) {
  /* ... */
}
```

## Dark mode

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/KKWJFNWYiKBiOkpg1fBK.jpg", alt="The light and dark mode versions of the Designcember site, side-by-side.", width="800", height="401" %}

One last touch that was essential for the Designcember website was a beautiful dark theme. We wanted to show how you could use art itself to be an active participant in creating a great dark mode experience. For this, we adjusted the background styles of each window itself programmatically, and used as much CSS as made sense when creating the window art. Most of the backgrounds were CSS gradients, so that it would be easier to adjust their color values. We then layered the art on top of these.

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/gBrdHzLwdDckE9pgxK5L.mp4", autoplay="true", loop="true", muted="true" %}

## Other Easter eggs

### Personal touches

We added a few personal touches to the page to give the site more personality. The first was the cast of characters, drawn from inspiration from our team. We also included a throwback-style cursor on inactive days and played around with the favicon style.

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/qjXfDOxsGXIIE57cXnyr.jpg", alt="Custom cursor styles and favicon options", width="800", height="408" %}

### Functional touches

One of the additional functional touches is a "Jump to Today" functionality, with a bird that sits on top of the building. Clicking or hitting enter on this bird jumps you down on the page to the current day of the month, so you can quickly get to the latest launches.

Designcember.com also has a special print stylesheet where we're essentially serving a specific image that works best on 8.5" x 11" paper so you can print the calendar out yourself and stay festive all year long. 

<figure>
{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/FQ1XPh1UbVvlvNzn7PtC.jpg", alt="Poster-sized print of the calendar design.", width="800", height="1066" %}
<figcaption>Una holding a large print of the calendar.</figcaption>
</figure>

All in all, a ton of work went into creating a fun, whimsical modern web experience to celebrate UI development all month long in December. We hope you enjoyed it!

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/aNlNdEYdk4t9yteQm8GK.jpg", alt="Parts of the calendar with annotations and visual notes", width="800", height="957" %}
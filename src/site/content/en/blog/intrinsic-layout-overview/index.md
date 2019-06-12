---
<!-- layout: post -->
title: An Intrinsic Introduction
subhead: The what and why of modern, resilient and content outward layouts with CSS
authors:
  - adamargyle
description: Intrinsic layout starts with healthy layout strategies that respond to ever-changing & user generated content.
alt: A full page design is shown alluding to a large amount of layout work
web_lighthouse: N/A
date: 2019-06-10
hero: hero.jpg
hero_position: top
tags:
  - post
  - layout
  - css
---

## History ⏳
The term [intrinsic](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size), with regard to the web, is used to help us talk specifically about a **strategy to calculating element sizing.**

{% Aside 'key-term' %}
  The **intrinsic size** of an element is the size it would be based on its content, if no external factors were applied to it.
{% endAside %}

[Jen Simmons](https://twitter.com/jensimmons) **astutely** coined the term [intrinsic web design](https://adactio.com/journal/13671) to help us talk specifically about a layout strategy in which the developer leverages newer, more content centric (intrinsic) CSS properties to unlock stronger layouts. Since coining the term, Jen passionately advocates and [demonstrates](https://labs.jensimmons.com) her joy and learnings around intrinsic web design around the world. For good reason too, it's most certainly a strong, future facing layout strategy that has brought me much power and joy.

She describes intrinsic web design so well that I'd like to pull directly from **her words**:

<blockquote class="w-blockquote">
  <p class="w-blockquote__text">Intrinsic Web Design is a name that I gave to this new era, because I think we’re really in a new era of layout design... it’s not that float-based thing where everything’s set in widths with using percents. It’s this new set of technologies.</p>
  <p class="w-blockquote__text">It’s not just because the tech is new, it’s also because the possibilities of what you can actually do are new, and the ways in which you can get content to morph and shift and change based on how much space is available is actually really different than Responsive Web Design.</p>
  <p class="w-blockquote__text">... it includes CSS Grid, but it’s not just about CSS Grid. It’s also about using Flexbox, and kind of rediscovering what Flexbox is actually intended to be for. Plus, it’s about using some floats sometimes, using things like CSS shapes or object-fit, using a flow content, using multi-column. Some of these things are old, and they’ve been around for a long time, but it’s about thinking about the whole system of layout, and how all these pieces fit together in a brand new way.</p>
  <cite class="w-blockquote__cite">
    Jen Simmons while <a href="http://www.zeldman.com/2018/05/02/transcript-intrinsic-web-design-with-jen-simmons-the-big-web-show/">chatting with Jeffrey Zeldman</a> on <a href="https://5by5.tv/bigwebshow">The Big Web Show</a>
  </cite>
</blockquote>

<figure class="w-figure w-figure--center" style="margin: 5rem 0;">
  <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/patrick-star.gif" alt="Patrick Star admiring with floating hearts">
</figure>

#### So **stoooooked** on this approach to layout!
A way I like to think of it is self reflective. You, yes you the reader (I'm busting the 4th wall or whatever) what's your height? Stand up, no shoes on, just you. Ok, now what's your width? **That's your intrinsic size.** Now extend your arms to the ceiling, that's your `max-content` size. Now get into the fetal position, haha, that's your `min-content` size. Those sizes are relative to you, and they're quite personal. **Intrinsic properties are very personal.** Okay, now think about a friend, family member, etc, and think about their natural height, width, max-content and min-content. It's different from yours no?

**Intrinsic design is about thinking and treating your content just as you would a fellow human, that's dynamic, different and unique.** We should create layouts that are respectful of our content's needs as to not squish something beyond it's min-content or extend it beyond it's max-content. Think about our layouts more like lining up a group of friends, as opposed to faceless boxes. This will help you be mindful of the dynamic uniqueness of each node of content we wish to layout. We want to encourage and revel in the content's personal and intrinsic sizing needs, even if they change without our control.

I've been exploring, building and prototyping with intrinsic design as a strategy and mentality, and it's certainly a **"new era of layout"** we're in! I must **share the joy and power I've acquired** through these endeavors and research. Do you like joy and power? lol, hopefully this guide delivers.

## Why "intrinsic"? 🤔
This may look familiar 😂, it's the result of an extrinsic approach to layout:

<p class="codepen" data-height="401" data-theme-id="dark" data-default-tab="result" data-user="brundolf" data-slug-hash="gRaREv" style="height: 401px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS is Awesome">
  <span>See the Pen <a href="https://codepen.io/brundolf/pen/gRaREv/">
  CSS is Awesome</a> by Brandon (<a href="https://codepen.io/brundolf">@brundolf</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

{% Aside 'caution' %}
  Extrinsic isn't evil or weak, I don't want this guide to pitch extrinsic as something to avoid at all costs. We'll be using both intrinsic and extrinsic strategies in this guide. There are still many scenarios where extrinsic layout is the right choice 👍.
{% endAside %}

The article [CSS is Awesome](https://css-tricks.com/css-is-awesome/) from [CSS-Tricks](https://css-tricks.com) **recaps the frustration** of this classic CSS joke really well:
- The content doesn't shrink to fit the container
- The container doesn't expand to fit the content
- The container doesn't handle overflow gracefully

Studying and striving for **intrinsic layout can help alleviate these frustrations**:
- <s>The content doesn't shrink to fit the container</s> <br>Content's sizing needs are considered first
- <s>The container doesn't expand to fit the content</s> <br>The container shrinkwraps to the content
- <s>The container doesn't handle overflow gracefully</s> <br>Overflow isn't an issue when content size and length are respected

#### Additionally
In my experience, laying out a site/components extrinsicly is initially the easiest. Later, it becomes tedious to maintain or even becomes a problem for other folks on the team that aren't engineers. **Eventually, the front-end instigates limitations that affect more systems and folks than it should because of it's percieved inflexibility.** I believe these issues stem from overly articulating a layout by applying too many extrinsic properties. Perhaps you or your team have felt 1 or more of the following:

1. Ever been in a CMS with an odd text length limit on a field that's hindering you from proper articulation?
1. Ever told a copywriter or designer they can't say that there or else it breaks the component or layout?
1. Ever seen squished or poorly cropped/masked images?
1. Ever seen a field in a CMS required so the front end didn't break?
1. etc, etc..

#### Let's confront these
Let's investigate how much flexibility we have these days. **Let's simulate the chaos of user generated content** to put our layouts and components to the test. Our end goal being [layout algorithms](https://notlaura.com/writing-css-algorithms/) that elegantly handle changing contexts and content. The front-ends that we build **shouldn't** be continuing the perception of inflexibility, they **should be** liberating our systems and users while simultaneously providing richer design options for a diverse set of viewports.

## Our Quest ⚔️
{% Aside 'objective' %}
  Grok the features of intrinsic layout by engineering resilient [macro, and micro layouts](https://www.vandelaydesign.com/micro-macro-white-space-in-web-design/) that withstand content chaos and adjust well to changing viewports. We're not just reading about layout tactics in this guide, we're applying them.
{% endAside %}

As a practical way of learning the ropes of intrinsic web design, I'd like to orient this guide towards a meaningful, reasonable and tangible end goal: **a full page responsive layout.** The following design may look innocent, but it's **jam packed** with learning opportunities. Along the way we'll implement **macro and micro layouts**, a mixture of **[flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) and [grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)**, a blend of **[intrinsic and extrinsic](https://googlechrome.github.io/samples/css-intrinsic-sizing/)**, plus a **sprinkle of chaos** to really help the value add sink in.

#### The Design
A theoretically **CMS powered e-commerce homepage**. Horizontally overflowing scroll areas, component variability, heavy images, etc. Plus the pretty typical scenario of no mobile designs provided, but are expected.

<figure class="w-figure w-figure--fullbleed">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/home@2x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/home.jpg" alt="TenHundred store home page" class="screenshot">
  </picture>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    <a href="https://intrinsic-layout-guide.glitch.me" target="_blank">Preview the final layout demo page</a>
  </figcaption>
</figure>

We **break this design down,** piece by piece, focusing **specifically on the layouts** for desktop and mobile:

1. **[Macro](/intrinsic-layout-macro)**<br>The highest level layout, the territory creator
1. **[Nav](/intrinsic-layout-nav)** <small>(coming soon)</small><br>Reponsive down to 240px plus a shallow DOM tree
1. **[Sidebar](/intrinsic-layout-sidebar)** <small>(coming soon)</small><br>Learn why flex was better than grid for UX
1. **[Grouped ListView](/intrinsic-layout-grouped-listview)** <small>(coming soon)</small><br>A listview of listviews
1. **[Chip Card](/intrinsic-layout-chip-card)** <small>(coming soon)</small><br>Teach this tiny card how to handle lots of chaos
1. **[Mural Card](/intrinsic-layout-mural-card)** <small>(coming soon)</small><br>The trickiest of the layouts to solve
1. **[Featured Card](/intrinsic-layout-card)** <small>(coming soon)</small><br>Take what you've learned and apply it in this resilient and intrinsic layout coding challenge

<figure class="w-figure--center">
  <img loading="lazy" class="w-screenshot" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/feature-card-chaos.gif" alt="Showing component being edited, deleted and abused yet the layout and ratios remain intact">
  <figcaption class="w-figcaption">
    <b>Example of the chaos</b> we'll throw at layouts to verify resilience
  </figcaption>
</figure>

## From This Guide 📓
#### Prepare to:
- **lean into content variability**: aka assume text/images are out of our control
- **simulate chaos**: aka simulate content variability
- lean into **[css grid](https://css-tricks.com/snippets/css/complete-guide-grid/)**
- keep our **DOM shallow**: avoid superfluous HTML elements
- write semantic HTML
- **limit [fixed units](https://www.w3.org/TR/css-sizing-3/)**
- **limit defining heights** (though I'll demo exceptions!)
- **limit writing @media queries**
- Leverage `minmax()` to **curb needs** for media queries or container queries
- **limit** `grid-template-areas` **usage:** it enables creative layouts but they have high specificity and are difficult to polyfill
- **curb** our **grid happy tendencies**: perhaps flexbox is better
- use [**css variables**](https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/)
- fix the layout at smaller viewports **using our best judgement**
- use [tomorrow's CSS today](https://preset-env.cssdb.org)
- take a [Layout Challenge](/codelab-intrinsic-layout-card)

#### Takeaway:
- confidence **when playing with layout**
- confidence in **refactoring layout**
- **distinguish** when **flexbox or grid** are most appropriate
- **leverage** the size of your **content**
- use **less** `grid-template-areas`
- **grid snippets** for your product/project
- engineer **[resilient](https://www.smashingmagazine.com/2017/03/resilient-web-design/) and intrinsic** CSS layout algorithms

## Better Together 🍻
We'll acquire some bruises along the way as we bump our head, shoulders, knees and toes.. but I believe it's crucial for when y'all run into similar issues, that we've gone through a gauntlet together. That means this guide includes refactor reasoning and results. There's a lot of "play" that needs to happen with intrinsic layouts, **I want you to see how I play and reach resilient layouts.** That way you can do it too!

If you don't have the basics of grid or flexbox down, have no fear. **Y'all can pick up the basics & jargon along the way.** I'll do my best to provide links out to topics that I'm not going to cover but will touch upon. 👍

<figure style="text-align:center; margin: 5rem 0;">
  <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/get-started.gif" alt="run begin GIF by Crowdfire">
  <figcaption>Weeeeeeeeeeeeeeee!</figcaption>
</figure>

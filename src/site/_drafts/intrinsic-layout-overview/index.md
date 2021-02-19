---
title: An introduction to intrinsic layouts
subhead: The what and why of resilient CSS layouts
authors:
  - adamargyle
description: Intrinsic layout starts with healthy layout strategies that respond to ever-changing and user generated content.
alt: A full page design is shown alluding to a large amount of layout work
web_lighthouse: N/A
date: 2019-06-10
hero: image/admin/qJ1nZhqmZbdu7HDxqXhM.jpg
hero_position: top
tags:
  - blog
  - layout
  - css
---

## History ⏳
In 2018, [Jen Simmons](https://twitter.com/jensimmons) coined the term [intrinsic web
design](https://adactio.com/journal/13671) to help us talk about a layout
strategy in which developers leverage newer, more content-centric CSS properties
to unlock stronger layouts.

{% Aside 'key-term' %}
The **intrinsic size** of an element is its size if no external factors are
applied to it.
{% endAside %}

A way I like to think of it is self-reflective. You—yes you the reader—if you
stand up with no shoes on, what's your height? What's your width? **Those
numbers make up your intrinsic size!** Extend your arms to the ceiling—that's
your `max-content`. Crouch down—that's your `min-content`. Those sizes are
relative to you, and they're quite personal.

Now think about a friend or family member, and think about their natural
`height`, `width`, `max-content` and `min-content`. It's probably different from
yours.

**Intrinsic design means treating your content just as you would a fellow human
that's dynamic, different, and unique.** It means creating layouts that are
respectful of your content's needs so as not to squish something beyond its
`min-content` or extend it beyond its `max-content`.

It also means accommodating those needs if they change. To do this we need to
leverage every part of the CSS toolbox and choose the right tool for the job. As
Jen explains:

<blockquote>
  <p>
    It includes CSS Grid, but it’s not just about CSS Grid. It’s also about using
    Flexbox, and kind of rediscovering what Flexbox is actually intended to be for.
    Plus, it’s about using some floats sometimes, using things like CSS shapes or
    object-fit, using a flow content, using multi-column. Some of these things are
    old, and they’ve been around for a long time, but it’s about thinking about the
    whole system of layout, and how all these pieces fit together in a brand new
    way.
  </p>
  <cite>
    <a href="http://www.zeldman.com/2018/05/02/transcript-intrinsic-web-design-with-jen-simmons-the-big-web-show/">Intrinsic web design with Jen Simmons</a>
  </cite>
</blockquote>

## Why "intrinsic"? 🤔
This may look familiar; it's the result of an _extrinsic_ approach to layout:

<p class="codepen" data-height="401" data-theme-id="dark" data-default-tab="result" data-user="brundolf" data-slug-hash="gRaREv" style="height: 401px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS is Awesome">
  <span>See the Pen <a href="https://codepen.io/brundolf/pen/gRaREv/">
  CSS is Awesome</a> by Brandon (<a href="https://codepen.io/brundolf">@brundolf</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The article [CSS is Awesome](https://css-tricks.com/css-is-awesome/) recaps the
frustration of this classic CSS joke really well:
- The content doesn't shrink to fit the container
- The container doesn't expand to fit the content
- The container doesn't handle overflow gracefully

In my experience, initially laying out a site extrinsicly is the easiest. Later,
it becomes tedious to maintain or even becomes a problem for other folks working
on the site. Perhaps you or your team have felt one or more of
these problems:

1. Ever been in a CMS with an odd text length limit on a field?
1. Ever told a copywriter or designer that they have to limit text to two lines or else it breaks the component's layout?
1. Ever seen squished or poorly cropped/masked images?

Striving for an intrinsic layout can help alleviate these frustrations:
- ~~The content doesn't shrink to fit the container~~ <br>Content's sizing needs are considered first
- ~~The container doesn't expand to fit the content~~ <br>The container shrinkwraps to the content
- ~~The container doesn't handle overflow gracefully~~ <br>Overflow isn't an issue when content size and length are respected

{% Aside 'caution' %}
  Extrinsic isn't evil or weak, I don't want this guide to pitch extrinsic as
  something to avoid at all costs. We'll be using both intrinsic and extrinsic
  strategies in this guide. There are still many scenarios where extrinsic
  layout is the right choice 👍.
{% endAside %}

The example below demonstrates the flexibility your site gains when it uses an
intrinsic layout. While the content might change—sometimes dramatically—the layout
is able to accommodate these changes in a way that preserves the site's design.

<figure class="w-figure">
  <video class="w-screenshot" autoplay loop muted playsinline aria-label="Large amounts of text are added to a three column layout. The layout flows the text correctly so it preserves its three column appearance.">
    <source src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/intrinsic-layout-overview_intrinsic-chaos-overview.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/intrinsic-layout-overview_intrinsic-chaos-overview.mp4" type="video/mp4; codecs=h264">
  </video>
</figure>

## Our Quest ⚔️
{% Aside 'objective' %}
  Understand the features of intrinsic layout by engineering resilient
  [macro, and micro layouts](https://www.vandelaydesign.com/micro-macro-white-space-in-web-design/)
  that withstand content chaos and adjust well to changing viewports. We're not
  just reading about layout tactics in this series, we're applying them!
{% endAside %}

As a practical way of learning the ropes of intrinsic web design, I'd like to
orient this series of guides towards a tangible end goal: **a full page
intrinsic layout.**

<figure class="w-figure w-figure--fullbleed">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/home@2x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/home.jpg" alt="TenHundred store home page" class="screenshot">
  </picture>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    <a href="https://intrinsic-layout-guide.glitch.me" target="_blank" rel="noopener noreferrer">Preview the final layout demo page</a>
  </figcaption>
</figure>

This layout demonstrates a CMS powered e-commerce homepage. The design may look
innocent, but it's jam packed with learning opportunities: horizontally
overflowing scroll areas, component variability, heavy images, etc. Plus the
designer forgot to create a mock for mobile devices 😅

By the end of this series you should have:
- confidence **when playing with layout**
- confidence in **refactoring layout**
- **distinguishing** when **flexbox or grid** are most appropriate
- **leveraging** the size of your **content**
- using **less** `grid-template-areas`
- using **grid snippets** for your product/project
- engineering **resilient and intrinsic** CSS layouts

## Better Together 🍻
We'll acquire some bruises along the way as we bump our heads, shoulders, knees,
and toes… but I believe it's crucial for when you run into similar issues,
that we've gone through a gauntlet together. That means this series includes
refactor reasoning and results. There's a lot of "play" that needs to happen
with intrinsic layouts, **I want you to see how I play and reach resilient
layouts.** That way you can do it too!

If you don't have the basics of grid or flexbox down, have no fear! **You'll
pick up the basics along the way** and I'll do my best to provide links that
explain certain topics in-depth. 👍

<figure class="w-figure">
  <video autoplay loop muted playsinline aria-label="A man and a woman quickly running in place.">
    <source src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/intrinsic-layout-overview_get-started.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-overview/intrinsic-layout-overview_get-started.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption class="w-figcaption w-figcaption--center">
    Weeeeeeeeeeeeeeee!
  </figcaption>
</figure>

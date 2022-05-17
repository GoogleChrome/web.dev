---
layout: post
title: 'Community highlight: Miriam Suzanne'
authors: 
  - rachelandrew
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  Miriam Suzanne is an author, artist, and web developer in Denver, Colorado, and is currently working on exciting CSS specs like Container Queries and Cascade Layers.
description: >
  One of a series of interviews with people from the web development community who are doing interesting things with CSS. This time I speak to Miriam Suzanne.
date: 2021-12-24
tags:
  - blog
  - css
  - community
---

_This post is part of [Designcember](https://designcember.com/). A celebration of web design, brought to you by web.dev._


Miriam Suzanne is an author, artist, and web developer in Denver, Colorado. She’s a co-founder of [OddBird](https://oddbird.net ) (a web agency), staff writer for CSS Tricks, member of the Sass core team, and W3C Invited Expert on the CSS Working Group. Lately she's been focused on [developing new CSS features](css.oddbird.net) like Cascade Layers, Container Queries, and Scope. Offline, Miriam is a published novelist, playwright, and musician. We talked about her work with Sass and CSS.

<figure>
  {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/waVF92Q2nGF3zqWcRkLc.jpeg", alt="Miriam onstage, smiling, lit by a spotlight.", width="800", height="534" %}
  <figcaption>Photo credit <a href="https://fromthehipphoto.com">From the Hip Photo</a></figcaption>
</figure>

**Rachel:** I first learned about your work due to your grid framework [Susy](https://www.oddbird.net/susy/), what led you to create that?

**Miriam:** Back in 2008, layout on the web was a very different experience. Developers had moved away from table layout to more semantic (but still hacky) floated grids. There was a boom in one-size-fits-all 12-column "grid frameworks"–providing a pre-defined (usually static) grid with a set of pre-defined CSS classes. If you needed anything more customizable, you were on your own. It was clear that websites needed to become more responsive, but media-queries weren't available yet, and there were a load of browser compatibility issues around fluid floats. 

I was using Natalie Downe's [CSS Systems](https://blog.natbat.net/post/46614243624/css-systems) approach, which was clever about responding to both font and viewport sizes, but I was frustrated by all the repetitive math and browser hacks required. At the same time, Sass was starting to get some attention, and it fit perfectly for what I needed. The first draft of Susy was very simple: just a couple mixins to do the math and add the hacks I needed. The goal was to be minimal, and only output the essential code. Totally customizable grids, without any predefined classes.

**Rachel:** How did you make the shift from working on a CSS preprocessor to working on CSS specifications? Do you think working on the preprocessor was a good background for specification writing?

**Miriam:** In my experience there is a lot of overlap, and I'm still very active on both sides of that divide. But I think that's largely thanks to the Sass team in particular, led by [Natalie Weizenbaum](https://twitter.com/nex3), which takes a very long-term view&mdash;trying to develop tools that integrate smoothly with developing web standards. Pushing beyond one-size-fits-all "opinionated" solutions and building for long-term flexibility is essential when you are thinking about the future of core web standards. 

How can we build tools that respect the diversity of developer needs and approaches, while still encouraging and facilitating accessibility and other important considerations?

**Rachel:** We’ve got a bunch of stuff coming into CSS that essentially replaces functionality that was traditionally part of Sass. Are there strong reasons to still use something like Sass?

**Miriam:** Yes, for some people&mdash;but there's no universal answer here. Take variables for example. Sass variables are lexically scoped, and compiled on the server, with organized data structures like lists and objects, color manipulation, etc. That's great for design system logic that doesn't need to run in the browser. 

CSS variables have some overlap, they can also store values, but they provide an entirely different set of cascade-based strengths and weaknesses. Sass can't handle custom properties, and CSS can't really handle structured data. Both are useful, and both are powerful&mdash;but your specific needs may vary. 

I think it's great when people can eliminate tools that they no longer need, and some projects might not require both server- and client-side variables. Wonderful! But it's too simple to assume that means they are identical, and one simply replaces the other. There will always be use-cases for some design logic to happen server-side, and some to happen client-side&mdash;even if we get to the point where the languages provide essentially the same features. Pre-processors are with us for the long term.

**Rachel:** Is there anything that has surprised you as you’ve got more involved in the work of creating standards, or anything that you think folk generally might not be aware of about the process?

**Miriam:** Before getting involved, the standards process felt like a mysterious and magical black box, and I wasn't sure what to expect. I was scared that I might not have enough knowledge of browser-internals to contribute, but the reality is they don't need more browser engineers. They need more developers and designers who are building websites and applications in the wild. 

I was surprised to find that very few of the people involved are primarily focused on standards, but also very few of them are primarily developing or designing websites. The W3C is made up of 'volunteers' from member organizations (often paid by those orgs, but not as their primary job) and membership isn't cheap. That skews the participants away from day-to-day designers and developers, especially those of us doing client work at small agencies, or freelance. My role as an Invited Expert would be totally volunteer, an expensive hobby, if I hadn't found outside funding for that work.

In reality, the process is quite open and public and needs developer involvement–but there are always so many conversations happening at once, it can be hard to find your place. Especially if it's not your day job.

{% Aside %}
To find out how to contribute to the web platform, check out the [Web Platform Contribution Guide](https://wpc.guide/).
{% endAside %}

**Rachel:** Container queries have been the holy grail for a lot of web developers for many years. I’m very excited about the fact that we’re getting them. I feel as if a lot of folk are thinking about the utility of container queries&mdash;do you feel they have potential to unlock more creativity too?

**Miriam:** Absolutely, though I don't see those as entirely separate. We all have limited time, and we're trying to write maintainable and performant code. When something is hard to do practically, we are less likely to get creative with what's possible.

Still, the web industry is now dominated by large corporate interests, and so those business concerns always get more airtime than web artists. And I think we lose a lot if we ignore web creativity as a primary use-case for features. I've been very excited to see some of the CSS art folks playing with the container query prototype. [Jhey Tompkins](https://jhey.dev/) built a particularly clever and interactive demo of [CSS venetian blinds](https://jh3y.medium.com/can-we-create-a-resize-hack-with-css-container-queries-e9fc32501293) as commentary on the old anti-CSS meme. I think there's a lot more to explore in that space, and I can't wait to see what else people come up with.

The conversation has also focused on size-based queries, as the original use-case, but I'm excited to see what people do with style queries–the ability to write conditional styles based on the value of a CSS property or variable. It's an extremely powerful feature, and so far mostly unexplored. I think it opens up even more creative opportunities!

**Rachel:** Is there anything that we can’t do (or have an upcoming way to do) in CSS that you think would be useful?

**Miriam:** I'm very excited about some other specs I've been working on. [Cascade layers](https://developer.mozilla.org/docs/Web/CSS/@layer) will give authors more control over specificity issues, and Scope should help with more precise selector targeting. But both of those are high-level architectural concerns. The artist in me is more excited for things like CSS toggles, a declarative way to create interactive styles, or container 'timelines', allowing us to smoothly transition values between media or container breakpoints. That has very practical implications for responsive typography, but would also open up a lot of creative opportunities for responsive art and animation. 

**Rachel:** Who else is doing really interesting, fun, or creative work on the web right now?

**Miriam:** Oh, I'm not even sure how to answer that, there are so many people doing creative work in such different areas. There's a lot of exciting standards work in progress from both the CSSWG and Open-UI, including some of your work on fragmentation. But I often find the most inspiration from web artists, and how people are putting these tools into production, in ways that aren't directly tied to commerce. People like [Jhey](https://jhey.dev/), or [Lynn Fisher](https://lynnandtonic.com/), or [Yuan Chuan](https://twitter.com/yuanchuan23), or many others who are pushing the boundaries of what web technologies can do visually and interactively. Even people doing more business-driven work can learn a lot from their artistic techniques.

I also appreciate the more conceptual web art of people like [Ben Grosser](https://bengrosser.com/), who keeps pushing us to reconsider what we want from the web, and social media in particular. Check out his new [minus.social](https://minus.social), for example.

**Rachel:** Keep up with Miriam’s work on CSS at [css.oddbird.net](https://css.oddbird.net) and find out what else she is up to via her website at [miriam.codes](https://miriam.codes) and Twitter [@TerribleMia](https://twitter.com/TerribleMia).

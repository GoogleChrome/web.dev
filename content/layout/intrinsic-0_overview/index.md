---
page_type: guide
title: Overview
author: adamargyle
description: A introduction article that sets up the tasks and goals of the guide
tags:
- Layout
- Design
- CSS
web_lighthouse: N/A
web_updated_on:
web_published_on:
wf_blink_components: Blink>Accessibility
---

# Overview

Heard this term yet in the context of web, [intrinsic web design](https://adactio.com/journal/13671)? [Jen Simmons](https://shoptalkshow.com/episodes/328-jen-simmons-intrinsic-web-design/) **astutely coined it** and advocates for it. I love it. No, like **loooooove** it, and I must **share** with you **the joy**.

<figure style="text-align:center; margin: 5rem 0;">
  <img src="https://media3.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif?cid=3640f6095c9541ae7945334751d09c8b" alt="Patrick Star admiring with floating hearts">
</figure>

Intrinsic has a few synonyms or alternative implecations and meanings I want to share quickly too, since I think they can really help you shape a mental model of what we're going for:
1. [Intrinsic web design](https://twitter.com/jensimmons/status/980980521848127488?lang=en)
1. [Content centric/outward layout](http://bradfrost.com/blog/post/7-habits-of-highly-effective-media-queries/)
1. [Resilient CSS](https://www.smashingmagazine.com/2017/03/resilient-web-design/)
1. Courteous CSS: okay, this one's mine 🤓

<br><br>

## Why study Intrinsic concepts?
**Too often the front end instigates limitations that affect more systems and folks than it should.** Ever been in a CMS with an odd text length limit on a field that's really hindering you from effective articulation? Ever told a copywriter they can't say that there or else it breaks the component?

**The front end often stifles proper communication or implementations because of it's percieved inflexibility.** Let's confront this. Let's investigate how much flexibility we have these days. **Let's simulate the chaos of user generated content** to put our layouts and components to the test, with the **goal of building layout algorythyms that elegantly handle the changing contexts and content.**

<br><br><br><br>

# Tangible learning
Intrinsic definitions get abstract, so let's **define it tangibly and visibly together.**

Our overarching task throughout this guide is to **lay out the following design,** as a practical way of learning the ropes. Check it out. It might not look like much, but it's **packed with learning opportunities!** 💀🤘

<figure style="text-align:center; margin: 5rem 0;">
  <img src="home.png" alt="TenHundred store home page" class="screenshot">
  <figcaption><a href="https://argyleink-webdev-intrinsic-layout-guide.glitch.me/">Interactive Demo</a></figcaption>
</figure>

## Prepare to
- lean into content variability: aka **assume text/images are out of our control**
- simulate some **chaos**: aka **simulate that lack of content control**
- lean into **[css grid](https://css-tricks.com/snippets/css/complete-guide-grid/)**
- **avoid [fixed units](https://www.w3.org/TR/css-sizing-3/)**
- **avoid defining heights** (though I'll demo exceptions!)
- **avoid writing @media queries**
- pacify our `grid-template-areas` knee jerk reactions
- **curb** our **grid happy tendencies**
- use [**css variables**](https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/)
- fix the layout at smaller viewports **using our best judgement**
- use [tomorrow's CSS today](https://preset-env.cssdb.org)
- take a [Layout Challenge](#)

## By the end
- be confident **when playing with layout**
- confident in **refactoring layout**
- **distinguish** when **flexbox or grid** are appropriate
- **leverage** the size of your **content**
- use **less** `grid-template-areas`
- **take snippets** back to your product/project
- **engineer resilient and intrinsic CSS layout algorithms**

<br><br>

# Better Together
We'll acquire some bruises along the way as we bump our head, shoulders, knees and toes.. but I believe it's crucial for when y'all run into similar issues, that we've gone through a gauntlet together. That means this guide includes refactor reasoning and results. There's a lot of "play" that needs to happen with intrinsic layouts, **I want you to see how I play and reach resilient layouts.** That way you can do it too!

If you don't have the basics of grid or flexbox down, have no fear. **Y'all can pick up the basics & jargon along the way.** I'll do my best to provide links out to topics that I'm not going to cover. 👍

<figure style="text-align:center; margin: 5rem 0;">
  <img src="https://media3.giphy.com/media/l0IyjiXOXTX6Yemsg/giphy.gif?cid=3640f6095c9542263268556d73ffef90" alt="run begin GIF by Crowdfire">
  <figcaption>Weeeeeeeeeeeeeeee!</figcaption>
</figure>

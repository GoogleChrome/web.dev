---
layout: post
title: 'Community highlight: Chen Hui Jing'
authors: 
  - rachelandrew
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  Chen Hui Jing  is a self-taught designer and developer living in Singapore, I talked to her about CSS, and in particular non-English writing systems.
description: >
  One of a series of interviews with people from the web development community who are doing interesting things with CSS. This time I speak to Chen Hui Jing.
date: 2021-12-10
tags:
  - blog
  - css
  - community
---

_This post is part of [Designcember](https://designcember.com/). A celebration of web design, brought to you by web.dev._


{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/8tTxEc4ZW29AKRkpwjoP.jpg", alt="Chen Hui Jing speaking on stage on front of a large screen showing slides.", width="800", height="533" %}

Chen Hui Jing is a self-taught designer and developer living in Singapore, with an inordinate love for CSS, as evidenced by her blog (which is mostly about CSS) and her tweets (which are largely about typography and the web). She used to play basketball full-time and launched her web career during downtime between training sessions, and hopes to be able to climb outdoors one day. I talked to her about CSS, and in particular non-English writing systems.

**Rachel:** What was your route into web design and development?

**Hui Jing:** When I was living in the dorms while playing basketball full-time, I had a bit more experience with computers than my peers, and my coach (bless him) thought that I could do something about our association website that hadn't been updated in years. I had zero idea what web development was, but I thought I had enough spare time to figure it out. It was more enjoyable than I expected and many years later, I'm still here.

**Rachel:** And how did you get into CSS in particular?

**Hui Jing:** I'm a very visual person by nature, and there's something about being able to give "instructions" to the browser and immediately see that reflected on the screen that really appealed to me. It felt much more intuitive to me than programming logic for applications. I got serious about the web at a time when developments in the world of CSS were starting to pick up speed, so there were a lot of experimental properties that were not widely used. It felt very exciting to discover new features that few people knew about.

## Working with vertical writing modes

**Rachel:** You've written a lot about vertical writing modes in CSS, and the fun bugs you find when working with vertical writing. Do you have any favorite bugs we should all go and star?

**Hui Jing:** There were a few [when I checked back in May this year](https://chenhuijing.com/blog/debugging-vertical-layouts-in-2021/#%F0%9F%92%BB), but, most of them have been resolved except one: Chromium has an issue with the [Devtools overlay in vertical writing mode](https://bugs.chromium.org/p/chromium/issues/detail?id=1203251&q=devtools%20grid&can=2). I think this is a testament to how this evergreen browser update cycle is really pushing web development forward.

**Rachel:** It’s great to hear that these issues are being fixed. Do you think playing with writing-mode has more use cases than simply typesetting vertical text?

**Hui Jing:** Oh yes, definitely. Even though typesetting East Asian scripts is the primary use-case of writing mode, I think other writing systems can make use of writing-mode to implement vertical layouts, like the style we often see in print magazines. To me, combinations of CSS properties are what makes CSS so powerful, so writing-mode together with flexbox and grid give us a fairly large number of permutations for layout directions, from a page level boxes down to individual characters in the text. I think this unlocks possibilities and more creativity as folks realize the scope of what is possible for web design moving forward. I hope to see layouts and designs on the web that I couldn't have imagined just a few years ago.

{% Aside %}
Hui Jing often speaks about typography and writing systems on the web. Watch her speak on [Web Typography: a non-English perspective](https://www.youtube.com/watch?v=yLQHDGRLOwQ) and [The web is not just left to right](https://www.youtube.com/watch?v=yLQHDGRLOwQ) to learn more
{% endAside %}

**Rachel:** I'm often asked whether I think everyone should use logical properties and values now, or if it will become the default. How would you answer that?

**Hui Jing:** Personally, I hope it would become the default, because from a practical perspective, it would make multi-script website development much easier. As to whether it WILL become the default, that's much harder to answer. 

A challenge for logical properties is that it is "replacing" an established syntax that has been in use for many years, plus the fact that support for scripts that are not the default, horizontal top-to-bottom only got much better in recent years. Content on the web is still predominantly in English, so the case for using logical properties is less strong in this context. I think a larger push for non-English speakers to create content in their respective languages for the web would forward this cause. Also, if supporting multiple languages becomes a greater priority, the value of using logical properties would become even more apparent.

{% Aside %}
Find out about logical properties and values in the Learn CSS module on [Logical Properties](/learn/css/logical-properties/).
{% endAside %}

## New features in CSS

**Rachel:** What feature or functionality would you love to see added to CSS?

**Hui Jing:** I've been following Miriam Suzanne's work on container queries for a while, and the parts of the specification that haven't been developed yet for Style and State container features are quite exciting, because they really expand the concept of responsive design. We can potentially get our designs and layouts to respond to more than just the size of our viewport. So I hope the containment module is something the different browser vendors can agree on and we can get wider support for this in the near future.

## Inspiring people to follow

**Rachel:** Who else is doing really interesting, fun, or creative work on the web right now?

**Hui Jing:** I'm always drawn to people who do CSS art. And there are folks whom I have been a fan of for years, like [Yuan Chuan](https://twitter.com/yuanchuan23) and his generative CSS creations, [Ben Evans](https://codepen.io/ivorjetski) who does mind blowing CSS artwork and [Ana Tudor](https://www.patreon.com/anatudor) with her deep dives into really clever techniques.
Recently I've come across Codepens by [Julia Miocene](https://codepen.io/miocene/pens/public) and [Jackie Zen](https://codepen.io/jackiezen) that have beautiful CSS animations as well.

**Rachel:** You can read more from Chen Hui Jing on her site at [chenhuijing.com](https://chenhuijing.com).

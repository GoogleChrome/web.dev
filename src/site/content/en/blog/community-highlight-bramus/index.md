---
layout: post
title: 'Community highlight: Bramus Van Damme'
authors: 
  - rachelandrew
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  Bramus Van Damme is a web developer from Belgium. From the moment he discovered view-source at the age of 14 (way back in 1997), he fell in love with the web and has been tinkering with it ever since. I caught up with him to learn about his journey in web development, and to find out what he thinks is exciting in CSS today.
description: >
  One of a series of interviews with people from the web development community who are doing interesting things with CSS. This time I speak to prolific writer Bramus Van Damme.
date: 2021-12-04
tags:
  - blog
  - css
  - community
---

_This post is part of [Designcember](https://designcember.com/). A celebration of web design, brought to you by web.dev._

<figure>
{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/6tkSbZYOqxtgJM9s5ovw.jpg", alt="Bramus on stage in from of a large screen showing slides.", width="800", height="533" %}
    <figcaption>Bramus speaking at Frontend United.</figcaption>
</figure>

{% Aside %}
Read some recent articles by Bramus on [Cascade Layers](https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/), 
[Scroll-Linked Animations](https://css-tricks.com/scroll-linked-animations-with-the-web-animations-api-waapi-and-scrolltimeline/), 
and [Container Relative Lengths](https://www.bram.us/2021/09/21/css-container-queries-container-relative-lengths/).
{% endAside %}

**Rachel:** What was your route into web development?

**Bramus:** As a kid, I always liked to tinker with things. I would spend days playing with my LEGO® bricks, building my own fantasy world and objects from scratch.

When we got a computer at home—an unusual device to own in the 1990s—I soon traded in the physical toys with computer games. I wasn't an avid gamer though; I don't think I ever finished a game entirely. Instead of finishing the games, I found myself modding them. 

In 1997, while looking up information about those games and tools, I also discovered [`view-source`](https://www.bram.us/#view-source). Curious to know how things were built, I started collecting HTML-snippets of the sites that I visited. Combining those snippets with Frontpage Express (an application that came with Internet Explorer 4 and 5), I soon created my very first web pages with info about myself. Those pages never got published, they only existed on one of the floppy disks I carried around.

From that time on I continued to become more interested in computers and the web. This interest led me to flunk a year in high school on purpose, so that I could switch major from economics to IT—I knew I wanted to pursue a career in IT. By 2002 I was in college, where I properly learned HTML and took my first steps into CSS and JavaScript. During those three years I realized that the web was my true passion, and in 2005, fresh out of college, I took on my first job as a professional web developer.

## On being a front and backend developer

**Rachel:** I spotted on your site that you are both a front and backend developer, I followed a similar path being originally a Perl, then a PHP and MySQL developer. Do you feel more excited by one side or the other? Do you think the possibility of being a hybrid developer is vanishing given the complexity of learning just one part of the stack?

**Bramus:** Throughout my career I've constantly been floating between backend and frontend. One year I would find myself elbow-deep into JavaScript and React (and even React Native), only to be creating Terraform scripts and Docker containers the year after. I like mixing the two, yet my passion always lay with the frontend, and CSS specifically.

In the early days of tinkering with the web, one simply was the "webmaster" and did it all. As the scope of the work was pretty limited back then, it was quite easy to keep up. Having seen both frontend and backend explode over the past 20 years, it became harder and harder to maintain expertise across the field. That's why I decided to mainly focus on frontend again in 2020.

**Rachel:** Why did you start writing about CSS in particular?

**Bramus** The content on my blog has always been a reflection of the projects that I'm working on. Therefore a mix of front and backend posts.

Attending conferences such as [Fronteers Conference](https://fronteers.nl/congres) and [CSS Day](https://cssday.nl/) helped me to write in-depth frontend posts. For example, seeing [Tab Atkins-Bittner talk about CSS Custom Properties in 2013](https://vimeo.com/69531455)—years before they even were an official thing—or [you (Rachel Andrew) explaining Grid to us in 2015](https://rachelandrew.co.uk/archives/2015/07/17/css-grid-layout-at-css-day/) were events that directly led me to write about them. At the time, I was a lecturer in web and mobile development at a technical university, so I had a very good reason to pay attention, as later on I'd be teaching my own students about those subjects.

In 2019, I started to closely monitor the CSSWG and [participate in discussions](https://github.com/w3c/csswg-drafts/issues). Browsers working on features behind feature flags meant that I was able to experiment with the things I read about, even before they shipped. This was then reflected through the contents of my blog.

## Advice for new writers

**Rachel:** What would be your advice to someone who wants to start writing about tech?

**Bramus:** Don't hesitate and simply do it. Even when it's about a single line of CSS, or if it's 1 post per year, or if you "only" have 5 subscribers: do it. Scratch your own itch, and write the article you wanted to find yourself. Through writing on my blog I not only challenged myself to learn about technologies in finer detail, but also opened doors along the way—both personally and professionally.

Don't overly rely on external services such as Medium or Twitter, but try and have your own place on the web. In the long run it'll pay off. You don't need any fancy CMS, build pipelines, or comments system, to get started. All you need is a text editor and some time to spare. HTML, combined with a simple stylesheet, can get you a long way.

## New features in CSS

**Rachel:** You have written about lots of the new features that are being developed in the CSSWG and in browsers, what do you think is the most exciting for the future of the web? Which do you think will have the most immediate impact in your own professional work?

**Bramus:** Along with many developers I'm pretty excited about CSS Container Queries. Other upcoming features—such as [Cascade Layers](https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/) and [Scroll-linked Animations](https://www.bram.us/2021/02/23/the-future-of-css-scroll-linked-animations-part-1/)—also excite me, but Container Queries will definitely have the biggest impact. They will allow us to transition from responsive pages to responsive components.

{% Aside %}
Learn about container queries in this [Designing in the Browser](https://www.youtube.com/watch?v=gCNMyYr7F6w) episode.
{% endAside %}

**Rachel:** What feature or functionality would you love to see added to CSS?

**Bramus:** Scroll-linked Animations is one of the features that I would like to see move forward. Right now it's only an Editor's Draft. Being able to define hardware-accelerated scrolling without relying on JavaScript is something that totally fits into my mental model of progressive enhancement and the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power).

CSS Nesting is also my radar. It took more than two years since its first Editor's Draft, but I was very glad to see its First Public Working Draft get released last summer.

Apart from these bigger features, I can definitely appreciate smaller tweaks and additions. Things like [accent-color](/accent-color/) definitely put a smile on my face, as they make my life as a developer easier.

## Recommendations for inspiring web people to follow

**Rachel:** Who else is doing really interesting, fun, or creative work on the web right now?

**Bramus:** That's a very difficult question to answer, so many people are producing content that amazes and inspires me. For example, [Adam Argyle](https://twitter.com/argyleink) and his GUI challenges, the projects from [Stephanie Eckles](https://twitter.com/5t3ph), blog posts by [Michelle Barker](https://twitter.com/michebarks), videos from [Kevin J. Powell](https://twitter.com/KevinJPowell), the work [Miriam Suzanne](https://twitter.com/TerribleMia) is doing in the CSS Working Group, podcasts from [Una Kravets](https://twitter.com/Una), articles by [Jake Archibald](https://twitter.com/jaffathecake), Jake and Surma's [HTTP 203](https://http203.libsyn.com/), [George Francis](https://twitter.com/georgedoescode)' Houdini work, and [Temani Afif](https://twitter.com/ChallengesCss)'s posts. These people and their projects, and the many others that I'm forgetting right now, have my respect and admiration.

I think the most influential person throughout my career was [Jeremy Keith](https://adactio.com/). His teaching us about semantic HTML, progressive enhancement, and resilience were eye-opening moments to me. It's a message I gave to my own students, and still like to spread today. In times where JavaScript is eating the world and junior developers somehow seem to have skipped out on the fundamentals of the web, his posts and talks are more relevant than they ever were before.

{% Aside %}
Jeremy Keith has created our new [responsive design course](/learn/design/) here on web.dev.
{% endAside %}

**Rachel:** You can [follow Bramus on Twitter](https://twitter.com/bramus), and on his blog at [bram.us](https://www.bram.us/).

---
layout: post
title: 'Community highlight: Lynn Fisher'
authors: 
  - rachelandrew
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  Lynn Fisher is an American artist known for her many creative projects and yearly portfolio refresh.
description: >
  One of a series of interviews with people from the web development community who are doing interesting things with CSS. This time I speak to Lynn Fisher.
date: 2021-12-30
tags:
  - blog
  - css
  - community
---

_This post is part of [Designcember](https://designcember.com/). A celebration of web design, brought to you by web.dev._


{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/tKe0NESCAhvU0SCaOBSb.jpg", alt="Lynn Fisher", width="800", height="474" %}

Lynn Fisher is an American artist known for her work on the web. After attending art school in Arizona, she began working as a designer and CSS developer in software consulting. She has spent her career pursuing cross-discipline endeavors, experimenting with the web as a creative medium, and creating fun, niche web projects. She currently works with the creative folks at [Netlify](https://netlify.com). I talked to her about her many fun projects.

**Rachel** What was your route into web design and development?

**Lynn:** In high school, a friend of mine introduced me to GeoCities. I remember having such a "my eyes are finally open" moment realizing I could make websites. My first site was a fansite for a local band in Phoenix that I was obsessed with. Over the next few years I learned HTML and CSS via the LiveJournal to MySpace pipeline and made lots of sites for local bands and artists. I learned just enough to get my first job as an "HTML Production Assistant" at a web agency after college.

After that, I learned on the job and via the design and dev community sharing knowledge and resources. I studied fine art in school which did help me develop confidence in my creative voice and introduced me to critique, but it wasn't formal design training. I was able to improve over time with practice and learning from coworkers and folks in the industry.

**Rachel:** How did you get started creating [single div CSS artworks](https://a.singlediv.com)?

**Lynn:** At CSSConf 2013, I saw Lea Verou give her [Humble Border-radius](https://youtu.be/b9HGzJIcfDE) talk and it was another eye-opening moment. There was this whole world of artistic potential in CSS properties I was already using and I was so excited to explore and experiment. I went home and made [WhyAZ](https://why.az) and drew all the illustrations with CSS. At the time, each illustration was made of two HTML elements (which followed a lot of icon system markup that was floating around). So it looked something like:

```html
<div class="icon">
  <span class="clock"></span>
</div>
```

I then wanted to see how complex I could make illustrations with only one HTML element. Turned out to be a really fun, super-constrained challenge that I could do with a couple hours here or there. So I bought a domain and started adding them to a site and now it‘s been almost eight years! It's still really fun to try and stretch the medium and to work on my illustration skills at the same time.

**Rachel:** You have so many cool projects! Do you always have something in your mind that you would like to build?

**Lynn:** Thank you! I keep a backlog of rough ideas that might make fun projects: things I'm interested in, patterns I start noticing, shows and movies I'm obsessing over. Sometimes it takes a long time for an idea to turn into a clear project. I had "fake movies in real movies" in my backlog for a few years before the [Nestflix](https://nestflix.fun) fake streaming service developed into an executable project. I don't keep a schedule, but I usually have an idea that feels ready once I'm looking for something new to work on.

{% Aside %}
Some other projects that Lynn has created are:

- [Airport Codes](https://airportcod.es)
- [Top Chef Stats](https://topchefstats.com)
- [Dress David Rose](https://davidrose.style)
- [Hollywood Age Gap](https://hollywoodagegap.com)
- [The Food Place](https://thefoodplace.cafe)
- [US Flags [dot] Design](https://usflags.design)

{% endAside %}

**Rachel:** Your yearly refreshes have become something of an event. Do you feel a pressure to do these now, or is it still a lot of fun?

<figure>
    {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/aVuPAt9P1MnVV2UVEfHG.png", alt="The portfolio archive on lynnandtonic.com.", width="800", height="407" %}
    <figcaption>You can see an <a href="https://lynnandtonic.com/archive/">archive of all the designs</a></figcaption>
</figure>

**Lynn:** It's still really fun and a project I look forward to. It's the one project I know I can make as weird as I want. It's always a good opportunity to experiment, try something new, and learn whatever new techniques gained traction that year. And because it gets replaced each year, it's really helped me to strengthen my ability to deal with change. It forces me to move on, even if I feel a particular affinity for any one version.

I do feel pressure though! It's easy to feel like each version needs to be more creative, more innovative than the previous ones. It can be stressful! It does push me to be ambitious though and I appreciate that. While I have the time and energy, I'm happy to try and keep raising the bar.

**Rachel:** You've recently started working at Netlify, how has the shift from client work to working on a product been?

**Lynn:** So I'm working on the marketing design team at Netlify, so in a lot of ways the work is really similar to the agency work we would do for product teams. The biggest difference is being able to see so much more of the big picture. Sometimes when you're hired as an outside agency to work on a project, your view can be limited to those specific goals and timelines. Not that that's a bad thing, though. Focus is super valuable! Being inside the product company opens up so much information and you get to see how different parts of the business work together, how competing goals are prioritized, and how individual projects effectively contribute (or don't) to long term revenue and growth goals. 

I guess maybe my experience has been more like going from an outside agency to an in-house team. I do love the variety client work offers, but it's been fun digging into deeply understanding Netlify as a platform and the Jamstack ecosystem.

**Rachel:** What feature or functionality would you love to see added to CSS?

**Lynn:** A lot of things I've always wanted are being actively worked on which is really cool. Container queries and the `:has()` pseudo-class are at the top of the list.

[Interpolation timelines](https://wiki.csswg.org/ideas/timelines) feel like they could be super useful. [Scott Kellum](https://twitter.com/ScottKellum) recently talked me through how they might help with some issues I've been running into with my responsive experiments and it's super cool.

I often reach for JS to give me the height of an element when it's not explicitly set, so it might be cool if CSS could do that on its own. I'm sure that's complicated though!

**Rachel:** Who else is doing really interesting, fun, or creative work on the web right now?

**Lynn:** So many people are doing fun work! Some I'm loving lately:

- [Neal Agarwal's](https://nealagarwal.me/) [neal.fun](https://neal.fun) is a treasure trove of delightful web projects.
- I love the fun and creative SVG work from [Cassie Evans](https://twitter.com/cassiecodes). 
- [Jhey Tompkins](https://jhey.dev/) does really fun CSS demos.
- I love the project [Style Stage](https://stylestage.dev/) (a next generation CSS Zen Garden) from [Stephanie Eckles](https://thinkdobecreate.com/). 
- Mind-blowing CSS artwork from [Ben Evans](https://www.tinydesign.co.uk/ben-evans-portfolio/) and [Diana Smith](https://diana-adrianne.com/).
- Charlie Gerard is making extremely cool hands-free and motion-controlled demos.
- [George Francis](https://georgefrancis.dev/) is creating beautiful generative artwork.  

You can find out what Lynn creates next via her portfolio website at [lynnandtonic.com](https://lynnandtonic.com), or by following her on [Twitter](https://twitter.com/lynnandtonic).

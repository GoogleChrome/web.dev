---
layout: post
title: Deep dive into top web developer pain points
subhead: A collection of insights on the top developer pain points, collected from a number of one to one conversations.
authors:
  - andreban
date: 2022-04-25
hero: image/Vww75TFpThOgTNuASFM6UYfBAp53/PUmvOTjDHLGbbZAds3pZ.jpg
alt: under the ocean, with a sandy ocean floor illuminated by sun rays from the surface.
description: |
  A collection of insights on the top pain points, collected from a number of one to one conversations with web developers.
tags:
  - blog
feedback:
---

A few months ago, [Paul Kinlan][2] posted about the [top developer pain points in 2021][1], so it feels appropriate to start this article with an update on the last 2 quarters. The numbers have moved around a bit, but the ranking hasn't changed. 

|Challenge|Q1 2021|Q2 2021|Q3 2021|Q4 2021|
|:-------:|:-----:|:-----:|:-----:|:-----:|
Keeping up with changes to the web platform or web standards.|27%|26%|27%|22%|
Keeping up with a large number of new and existing tools or frameworks.|26%|26%|25%|21%|
Making a design or experience work the same across browsers.|26%|28%|24%|21%|
Testing across browsers.|23%|24%|20%|20%|
Understanding and implementing security measures.|23%|25%|20%|19%|

As mentioned in Paul's blog post we need to address these pain points. As part of a larger effort to do so, my colleague [Kadir Topal][3] and I have interviewed over 18 developers. Our aim is to investigate and start making sense of the path to fixing top developer pain points.

## Developer Discussions

**Disclaimer:** *those insights are based on a small number of conversations with developers. When using "all" or "some", this refers to the developers interviewed, not the entire community. More research is needed to extrapolate those insights more widely.*

These conversations were a great reminder of how amazing and diverse the web developer community is, and I'd like to thank all the developers who talked to us. Some developers had over 25 years of experience, while others started as recently as 2020. Some developers started their careers via a formal computer science degree, while others started their careers independently. Some developers actively seek what is new and keep up by reading browser release notes, while others learn about new things via colleagues and friends. Some think complexity is part of the job and enjoy being challenged, while others just want to get their job done. When thinking about solving those pain points, it's important to keep this diversity in our minds!

One of the common things amongst all developers is that all of them are using a CMS or a framework to do their work. Wordpress, React, Bootstrap, Angular, and Tailwind were all mentioned, none of the developers were using the vanilla web platform in production. Choosing a framework when starting a project is a challenge, and developers frequently take into account non-technical requirements. For example, whether it will be easy to hire a developer to work with that framework. We cannot improve developer pain points if frameworks and CMSs are not included in the solution.  

Speaking of the web platform, most developers understand the platform as the thing they are developing on top of. This includes not only the [classical definition][4] of the web platform, but also the CMSs, framework, tools, and polyfills. In many cases, keeping up to date with those is where the biggest difficulties are. This changed our interpretation of that question, and we now know we need to update our survey to break it down into different parts that are less ambiguous. 

Another area of ambiguity is the definition of [web standards][5]. When asked about examples around keeping up with standards, many developers pointed out difficulties with keeping up with best practices instead. This is another area we need to clarify on the survey. 

Developers look for best practices when implementing specific use-cases and patterns. Blog posts and StackOverflow are mentioned as sources for best practices, but developers often wonder if the information they are reading is indeed the best practice and if it is up to date with the latest features and APIs. They would like a more official source to read those. 

Keeping up with features and APIs that enable new use-cases is a smaller problem. Developers struggle more with features, APIs, and changes to the platform that result in a change in best practices.

Most developers agree that compatibility is one of the biggest challenges. Things are improving via efforts like [Compat 2021][7] and [Interop 2022][6], but it's clear that developers don't see it as a solved problem yet.

Most developers use polyfills in one way or another. In many cases, however, usage is transparent to developers, since the polyfill can be automatically added by a tool like Babel or a framework. For those who are managing their polyfills themselves, figuring out if a polyfill is "good" can be a problem. Developers mentioned using the number of installs on NPM and the creator of the polyfill as signals. A couple of developers mentioned doing work to remove polyfills that became unnecessary due to dropping support for IE 11.

Frameworks introduce fragmentation issues. We heard reports where developers were "stuck" into an older version of a framework, and limited on the features they could use because of that, but that migrating to a newer version of the same framework could be costly and hard to justify.

## Conclusion

Modern web development has many moving pieces including, standards, browsers, libraries, polyfills, CMSs, frameworks, best practices, and tooling. This diversity is one of the great things about the web but, right now, it's up to each developer individually to make sense of each piece and how they are compatible with each other.

I wonder if there's a way to bring more clarity to developers on how everything ties together and more alignment between all the pieces, without compromising on the diversity. It's a large, complex problem, and hard to do all at once. But where to even start?

If you have views and opinions you'd like to share. I'd love to talk to you too. I'll set up a way for booking conversations directly but, in the meantime, my DMs are open [on Twitter][8]. Reach out and we can grab the time to chat!

[1]: https://paul.kinlan.me/top-web-developer-pain-points-in-2021/
[2]: https://twitter.com/Paul_Kinlan
[3]: https://twitter.com/atopal
[4]: https://en.wikipedia.org/wiki/Web_platform
[5]: https://www.w3.org/standards/
[6]: https://web.dev/interop-2022/
[7]: https://web.dev/compat2021/
[8]: https://twitter.com/andreban

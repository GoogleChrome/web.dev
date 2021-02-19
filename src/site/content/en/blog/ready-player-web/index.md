---
title: Ready Player Web
subhead: Building games for the modern web.
authors:
  - tomgreenaway
date: 2019-08-21
hero: image/admin/d14lKdJ4iYwr1wI8AgA3.jpg
hero_position: center
hero_fit: contain
alt: Game design, business and tools for modern web games.
description: |
  The Web platform is very mature for game development nowadays.
  The key to building a modern web game is embracing the best practices of game design and monetization.
  This post provides provides guidance towards this goal.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - games
  - game-design
  - monetization
  - tools
---


Good game developers know that to capitalise on the opportunity of a particular platform it's important to embrace the unique characteristics of that platform. So what are the unique characteristics of the web? And what defines a web game?

At Google I/O 2019 I presented my thoughts on the state of the web games ecosystem, the current best practices for modern web game development, and where the industry is heading. In this blog post, I'll summarise some of the key points from my talk which you can watch in full on YouTube:

{% YouTube 'aVTYxHL45SA' %}

## The challenges of web games

Before joining Google I created a mobile game known as [Duet](https://www.duetgame.com) which was downloaded nearly 20 million times. Through that experience I learned that the three essential ingredients to building a successful business out of a game are:

- A functional game
- Users
- A way to monetize users

Without these three elements, a game developer cannot succeed. Nowadays, these last two points are the most critical. Closed HTML5 ecosystems such as WeChat, Facebook Instant Games, and more have demonstrated that building games using HTML5 is achievable.

## Modern best practices

By "functional game" I refer to the three most core elements of what makes a game work:

- Performance
- Visuals
- Audio

In each of these areas, the web platform has made significant strides in the past few years. For CPU performance we have access to a [performant new standard called Web Assembly](https://www.youtube.com/watch?v=njt-Qzw0mVY). From the graphics side, [WebGL 1.0](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) has [good cross-browser support](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#WebGL_1) and future standards such as [WebGPU](https://www.youtube.com/watch?v=K2JzIUIHIhc) are positioning the web platform for an extensible future of graphics programming similar to Vulkan and Metal. Finally, for web audio we have the [common Web Audio API and more recently the Audio Worklet API](https://www.youtube.com/watch?v=-GaD0RCp-Q0).

Recently, Unity previewed a new runtime called Project Tiny which is focused on building 2D games for HTML5-based platforms. Project Tiny applies a new modular design to the engine structure of Unity enabling the core Unity engine to be under 1 megabyte in size.

<figure class="w-figure">
  {% Img src="image/admin/NAydOzjTBzlBnom2SubM.gif", alt="Two tanks engaged in a battle.", width="800", height="449" %}
  <figcaption class="w-figcaption">Unity's Tanks Demo exported via HTML5.</figcaption>
</figure>

From the technical side, there has never been a better time to embrace web game development.

## Enter the loop

A great game is obviously more than just good performance, graphics, and sound though–to be great a game must be fun.

Fun is a difficult element to measure in a product. When a game is fun, interesting, or innovative enough, users will want to tell their friends–in other words, they'll want to share the experience. Tapping into this opportunity and coupling it with the web is a powerful combination that unlocks a lot of potential for viral growth. And on the web in particular, without a central discovery platform, our best bet towards acquiring users is to ensure our games are as viral as possible.

Good game developers know that to capitalise on a particular platform–whether at a software or hardware level–it's important to embrace the unique characteristics of that platform. For example, if you're building a game for a console with motion controls, you should probably think about the best way to embrace those motion controls.

In other words, you must respect the expectations of the users of the platform you're building for. What do users of the web expect? They expect web content to load fast and be interactive quickly. In my talk, I covered several examples of ways–both on and off the web–that games have been designed to load quickly, pull users into their game worlds, engage those users, and provide users with additional incentives to share their experiences.

{% Img src="image/admin/ppUw6LsWIqub2vRiMuaG.png", alt="Three games with minimalist art styles.", width="800", height="368" %}

I personally believe that the key to building a successful web game is to lean into this unique characteristic of the web. Specifically, the strength of the web's URL structure and the sharing loop that users can join in.

Here's an example of a web game I built using [Construct 3](http://construct.net) that leverages the URL in a fun and engaging way.

{% Img src="image/admin/L0wolsGPYf4pQjlI4i1g.png", alt="A level editor interface for a game.", width="800", height="608" %}

[Space Board](https://io-space-board.firebaseapp.com) is a very simple game that can be played on either mobile with touch controls or on desktop with keyboard input. The objective is to navigate a maze of obstacles to reach a goal at the end.

How does Space Board leverage the URL in a unique fashion? By encoding the level structure into the URL itself. All levels are defined as a 10 by 10 grid of objects–e.g. walls, enemy turrets, keys, locked doors etc. The URL then lists all the individual grid positions and their contents. A wall is represented by a `W` character. An empty space is an underscore character.

Here's an example:

```text
https://io-space-board.firebaseapp.com/?gameWorld=_wwwwwwwwww___ww__eww_k__d___ww___ww___ww_wwwww_www_wwwww_www___ww___ww_s_ww_f_ww___ww___wwwwwwwwwwww
```

It's ugly but it does the job.

Upon completing a level in Space Board, the player has the opportunity to design their own level using the simple level editor shown above. By enabling players to design their own levels we are giving them the opportunity for personalisation. When a user feels a connection to a game and a sense of ownership via creation and customisation they are more likely to want to share that 'thing' with the world.

The desire to share a game is the beginning of the viral loop that we are aiming to achieve with our web games. This game design and sharing mechanism is just one example that's possible but there are many other possibilities–I encourage you to watch my talk for further examples!

## Return on investment

At present, there are ultimately two schools of thought with regards to how a game developer can generate revenue through web games:

- Monetizing the games directly
- Treating them as an acquisition channel

Treating web games as an acquisition channel means leveraging the web version of your iOS/Android/desktop game as a mechanism to get your players hooked and convincing them to download your larger iOS/Android/desktop binary. You then generate revenue with the iOS/Android/desktop platform's built-in payment and billing backends.

Monetization is usually a mixture of advertising and microtransactions. There is still work to be done for the web to compete with mobile platforms in game advertising. For example, formats like Rewarded Video Ads have been extremely popular for mobile games for several years and yet we're only now seeing ad networks deploy these formats on the web.

Nonetheless, there are game developers who continue to be successful on the open web through advertising via traditional banner ads and interstitial video ads. Take a look at [Adsense for Games](https://support.google.com/adsense/answer/1705831) for more information on these formats.

For microtransactions, the web offers complete flexibility due to the limitless number of payment methods that can be implemented. However this quality is a double-edged sword. The negative side of this is that players have less implicit trust towards a new website they discover versus the familiarity of the platform-specific mobile store payment methods.

One solution that brings a more consistent payment UI to the web is the [Payment Request API](https://developers.google.com/web/fundamentals/payments/). This API invokes a UI that is shown by the browser and streamlines the acquisition of payment details such as credit cards and billing addresses. However, acquiring payment details is just the first step of making a transaction. You need a backend billing platform as well.

## The future

We've seen several surprisingly successful web games over the past few years. Slither.io has built a mixed web and platform-specific business that demonstrates the tremendous reach and viral growth opportunity that the web offers. Portals such as [Poki.com](https://poki.com/) are innovating in their user experience and releasing new games every day including titles that match the fidelity of their mobile counterparts, such as Subway Surfers or Crossy Road.

Furthermore, if you look outside of the open web you can see that web games are already taking off. Closed ecosystems such as WeChat and LINE offer satisfying games which aren't playable on the open web but which are built on top of web technologies like HTML5 and WebViews. This is a clear sign that the web has reached a level of fidelity that's capable of rivaling platform-specific mobile games–perhaps not in a textbook definition of fidelity but in a more important metric: player attention.



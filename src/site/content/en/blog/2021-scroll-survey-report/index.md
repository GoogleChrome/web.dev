---
layout: post
title: 2021 Scroll Survey Report
subhead: Get the 2021 Scroll Survey Report plus words from the Chrome team about how this impacts priorities and plans for Chromium and the web.
authors:
  - adamargyle
  - samdutton
description: Get the 2021 Scroll Survey Report plus words from the Chrome team about how this impacts priorities and plans for Chromium and the web.
date: 2021-08-02
thumbnail: image/80mq7dk16vVEg8BBhsVe42n6zn82/0yI4zjveGNiC1Kh8QzhV.jpg
alt: The unveiling of the new Torah display at Trinity International University, photo by Taylor Wilcox.
tags:
  - blog
  - css
  - dom
  - javascript
  - mobile
  - ux
---

In April, the Chrome team [released a scroll and touch-action
survey](/2021-scroll-survey/) based on top reported issues from
the [2019 MDN Web DNA
Report](https://mdn-web-dna.s3-us-west-2.amazonaws.com/MDN-Web-DNA-Report-2019.pdf).
The [2021 Scroll Survey
Report](https://storage.googleapis.com/web-dev-uploads/file/vS06HQ1YTsbMKSFTIPl2iogUQP73/QZopyELSk8T7IpsgOnRU.pdf)
is ready, and the Chrome team would like to share some thoughts and action items
we've gleaned from the survey results. We hope these results will help browser
vendors and standards groups understand how to improve web scrolling. 

**View the [2021 Scroll Survey
Report](https://storage.googleapis.com/web-dev-uploads/file/vS06HQ1YTsbMKSFTIPl2iogUQP73/QZopyELSk8T7IpsgOnRU.pdf).**

## Noteworthy results

The survey anonymously collected 880 submissions, with 366 answering every
question. 

While getting started with scrolling is one line of CSS, like `overflow-x:
scroll;`, the surface area of scroll APIs and options is large, spanning JavaScript to
CSS. The following results help to highlight the issues web developers are
encountering.

### Overall satisfaction with web scrolling

<small>Question 27</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">45<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      are <b>somewhat</b> or <b>extremely dissatisfied overall</b> <br>
      with <b>web scrolling</b>.
    </p>
  </div>
</div>

This question was placed near the end of the survey intentionally, after
questions on 26 scroll use cases and features. From the response, it's clear that
the web community struggles with scroll. Almost half of the respondents report a
level of overall dissatisfaction. 

We believe overall sentiment about working with scroll should not be this low.
This metric needs to be changed; it's a clear signal there's work to be done.

### Difficulty working with scroll

<small>Question 2</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">43<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      reported it's <b>somewhat</b> or <br>
      <b>extremely difficult <br>
      to  work with scrolling</b>.
    </p>
  </div>
</div>

From our research, these difficulties come from the multitude of use cases for
scroll. When we talk about scrolling, that might include:
- [Positioning elements within scrollable areas](https://elad.medium.com/css-position-sticky-how-it-really-works-54cd01dc2d46)
- [Infinite scroll](https://blog.logrocket.com/infinite-scroll-techniques-in-react-adcfd7ff32bd/)
- [Scroll linked animation](https://greensock.com/scrolltrigger/)
- [Carousels](https://css-tricks.com/css-only-carousel/)
- [Scrollview padding](https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4)
- [Cyclical scroll](https://www.magictoolbox.com/magicscroll/integration/)
- [Virtualized scroll](https://github.com/tbranyen/hyperlist)

Missing browser features,
complex JavaScript, and the need to support input modes including touch,
keyboard, and gamepads, make all of these things harder.

### Importance of touch interactions

<small>Question 3</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">51<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report <b>touch interactions</b> as <br>
      <b>very</b> or <b>extremely important</b> <br>
      to their work.
    </p>
  </div>
</div>

With [mobile web users still on the rise in visit
statistics](https://twitter.com/TheRealNooshu/status/1399676709125906432?s=20),
it wasn't surprising to see half of the respondents report that touch is very
important to their work on the web. This signaled that web features like CSS
scroll snap and `touch-action` need extra attention so the web can deliver on
high-quality touch interaction.

### Difficulty of tab key or gamepad navigation

<small>Question 5a</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">44<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report <b>somewhat</b> or <b>extremely difficult</b> <br>
      to do <b>gamepad</b> and <b>tab navigation</b>.
    </p>
  </div>
</div>

Scrolling includes navigation methods such as keyboard arrows, tab keys,
spacebar presses, and gamepads, and it can be difficult to include these when doing
custom scroll work. Almost half of the respondents report it's
somewhat or extremely difficult to include these inputs. 

### Learning `touch-action`

<small>Question 9</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">50<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report <b>learning</b> about <br>
      <b>`touch-action: manipulation`</b> <br>
      from the survey.
    </p>
  </div>
</div>

Some of the survey questions asked about using certain APIs with a possible
answer of Yes, No, or "today I learned." One notable piece of feedback was the
number of people who reported learning about `touch-action` from the survey, as
it's a critical property when building custom touch gestures that need to
interact within scroll.

### Cyclical scrolling

<small>Question 27</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">58<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report <b>sometimes, often</b> or on <b>every project</b> <br>
      using <b>cyclical scrolling</b>.
    </p>
  </div>
</div>

<figure class="w-figure">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/xLwqQ6xGBIdI0uxFx566.mp4",
    autoplay="true",
    loop="true",
    width="380",
    muted="true"
  %}
  <figcaption class="w-figure">
    The video shows cyclical seconds scrolling, <br>
    after 60 seconds it begins at 0 again.
  </figcaption>
</figure>

Those numbers are high for a scrolling feature with little or no support provided by the web platform. 
The feature often incurs high amounts of technical
debt because of this, with duplication or JavaScript injected to force the
effect. It's popular for product carousels and when selecting time in seconds or minutes to
offer cyclical scrolling.

### Are scrollable areas important

<small>Question 2</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">55<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      <b>very</b> or <br>
      <b>extremely important</b>
    </p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">16<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report <b>not at all</b> <br>
      or <b>slightly important</b>
    </p>
  </div>
</div>

Respondents felt strongly about the importance of scrollable areas, 
giving another signal about the struggles required to deliver high-quality scrolling.

### Carousels

<small>Question 20</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">87<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      <b>have used</b> carousels.
    </p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">24<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report they're <br>
      <b>easy</b> to manage.
    </p>
  </div>
</div>

Nearly every respondent delivers carousels in their web work, while only 25% find
them easy to manage. Off-the-shelf carousels were popular during our
research, but this statistic surprised us, as it doesn't sound very solved.

### Infinite scroll

<small>Question 22</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">65<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      use it <b>sometimes</b> <br>
      to <b>every project</b>
    </p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">60<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      <b>somewhat</b> or <br>
      <b>extremely difficult</b>.
    </p>
  </div>
</div>

Two-thirds of respondents deliver infinite scroll in their web work, and an equal
amount report it's difficult to do. Another example of high usage paired with
high difficulty, which indicates to us an area needing attention.

While [`content-visibility`](/content-visibility/) and
`contain-intrinsic-size` can be combined to reduce render costs for long
scrollable areas, it doesn't seem to be helping with "load more" infinite scroll
UX. 

### Scroll-linked or scroll-triggered animations

<small>Question 24</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">47<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      use it <b>sometimes</b><br>
      to <b>every project</b>
    </p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">56<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      report <b>somewhat</b> or <br>
      <b>extremely difficult</b>
    </p>
  </div>
</div>

Almost half of all respondents use scroll-orchestrated animations and half the
respondents find it difficult, once again linking high usage with difficulty.

### Compete with built-in scrolling

<small>Question 26</small>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">32<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      <b>always</b> or <br>
      <b>most of the time</b>
    </p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">50<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">
      <b>sometimes</b>
    </p>
  </div>
</div>

The built-in scroll and touch interactions of phone and tablet applications are
often touted as a clear place where the web can catch up. The features include
scroll-linked animations, programmatic interfaces, voice integration, scroll
hints, and pull-to-refresh APIs.

Just half of the respondents felt it was only sometimes possible to match the
experience of built-in scrolling. 

### Overall satisfaction building scroll interactions on the web

<small>Question 27</small>

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/ycHj33nZb1KfUFxNBdH5.png", alt="A
pie chart showing 5 sections: 6.3% extremely dissatisfied, 2.7% extremely
satisfied, 23.4% somewhat satisfied, 28.8% neither satisfied nor dissatisfied,
38.7% somewhat dissatisfied.", width="800", height="400" %}

## Survey Takeaways

The survey results are segmented into four categories: 
[compatibility](#compatibility), 
[education](#education),
[APIs](#apis), 
and [features](#features).

### Compatibility

The Chrome team has [declared a goal](/compat2021) to decrease
the number of web compatibility issues, including scroll compatibility.

The first three compatibility issues to focus on:
1. Horizontal scrolling compatibility.
1. `overscroll-behavior` cross browser.
1. Removing prefixes from `-webkit-scrollbar` and following the standard.

### Education

The survey results showed that there needs to be more education around
`touch-action` and [logical
properties](/logical-property-shorthands/). The browser is at the
forefront of international layout, and it's apparent it's underutilized or
misunderstood.

Areas to focus on:
1. [`touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
1. [Logical properties](/learn/css/logical-properties/)

### APIs

Usage of scroll snapping is growing, and developers have responded that they
want to use features interoperably with popular libraries and
plugins. Shrinking this gap between CSS and plugin libraries will help the
satisfaction of scroll snap developer and user experience.

We'll focus API work on `scroll-snap`:
1. API availability and compatibility across browsers.
1. Begin work on [new CSS
   APIs](https://github.com/argyleink/ScrollSnapExplainers) like `scroll-start`.
1. Begin work on [new JS
   events](https://github.com/argyleink/ScrollSnapExplainers) like
   `snapChanged()`.

### Features

The survey results showed that users struggle with some specific types of
scroll-related components on the web, as the platform doesn't provide the
primitives they need to build them without plugins or a high level of effort.
This is an area that we hope to explore more deeply.

The features developers struggle to build include:
1. Carousels
1. Virtual scroll
1. Infinite scroll

### Resources

- [Scroll Survey
  Report](https://drive.google.com/file/d/10WXTJHCZmH0rXEh3J7z3ki96-f9SHs_R/view?usp=sharing&resourcekey=0-5b1y_6rZDhyt6Tkbz3FCzA)
- [Survey Announcement](/2021-scroll-survey/)
- [Mozilla DNA Reports](https://insights.developer.mozilla.org/)
- [Compat2021: Eliminating five top compatibility pain points on the
  web](/compat2021/)
- [2020-2021 Scroll Compatibility Igalia
  Work](https://groups.google.com/a/google.com/g/blink-interactions-team/search?q=Igalia%20work%20update)

Thumbnail image: photo by [Taylor Wilcox](https://unsplash.com/@taypaigey) on [Unsplash](https://unsplash.com/photos/aXeVH4FcS1k).

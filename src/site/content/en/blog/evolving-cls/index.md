---
title: "Evolving the CLS metric"
subhead: "Plans for improving the CLS metric to be more fair to long-lived pages."
description: "Plans for improving the CLS metric to be more fair to long-lived pages."
authors:
  - anniesullie
  - hbsong
date: 2021-04-07
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: An example windowing approach for measuring layout shift.
tags:
  - blog
  - performance
  - web-vitals
---
We (the Chrome Speed Metrics Team) recently outlined our initial research into
[options for making the CLS metric more fair to pages that are open for a long
time](/better-layout-shift-metric/). We've received a lot of very
helpful feedback and after completing the large-scale analysis, we've finalized
the change we plan to make to the metric: **maximum session window with 1 second
gap, capped at 5 seconds**.

Read on for the details!

## How did we evaluate the options?

We reviewed all the feedback received from the developer community and took it
into account.

We also implemented the [top
options](/better-layout-shift-metric/#best-strategies) in Chrome
and did a large-scale analysis of the metrics over millions of web pages. We
checked what types of sites each option improved, and how the options compared,
especially looking into the sites which were scored differently by different
options. Overall, we found that:

* **All** the options reduced the correlation between time spent on page and
  layout shift score.
* **None** of the options resulted in a worse score for any page. So there is no
  need to be concerned that this change will worsen the scores for your site.

## Decision points

### Why a session window?

In our [earlier post](/better-layout-shift-metric/), we covered
[a few different windowing
strategies](/better-layout-shift-metric/#windowing-strategies)
for grouping together layout shifts while ensuring the score doesn't grow
unbounded. The feedback we received from developers overwhelmingly favored the
session window strategy because it groups the layout shifts together most
intuitively.

To review session windows, here's an example:

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Example of a session window.
  </figcaption>
</figure>

In the example above, many layout shifts occur over time as the user views the
page. Each is represented by a blue bar. You'll notice above that the blue bars
have different heights; those represent the [score](/cls/#layout-shift-score) of
each individual layout shift. A session window starts with the first layout shift
and continues to expand until there is a gap with no layout shifts. When the next
layout shift occurs, a new session window starts. Since there are three gaps with
no layout shifts, there are three session windows in the example. Similar to the
current definition of CLS, the scores of each shift are added up, so that each
window's score is the sum of its individual layout shifts.

Based on the [initial
research](/better-layout-shift-metric/#best-strategies), we chose
a 1 second gap between session windows, and that gap worked well in our
large-scale analysis. So the "Session Gap" shown in the example above is 1
second.

### Why the maximum session window?

We narrowed the [summarization
strategies](/better-layout-shift-metric/#summarization) down to
two options in our initial research:

* The **average** score of all the session windows, for very large session
  windows (uncapped windows with 5 second gaps between them).
* The **maximum** score of all the session windows, for smaller session windows
  (capped at 5 seconds, with 1 second gaps between them).

After the initial research, we added each metric to Chrome so that we could do a
large-scale analysis over millions of URLs. In the large-scale analysis, we
found a lot of URLs with layout shift patterns like this:

{% Img src="image/MZfwZ8oVW8U6tzo5CXffcER0jR83/bW3lHZmss3cqGayZsq4P.png",
alt="Example of a small layout shift pulling down the average", width="800",
height="550" %}

On the bottom right, you can see there is only a single, tiny layout shift in
Session Window 2, giving it a very low score. That means that the average score
is pretty low. But what if the developer fixes that tiny layout shift? Then the
score is calculated just on Session Window 1, which means that the page's score
*nearly doubles*. It would be really confusing and discouraging to developers
to improve their layout shifts only to find that the score got worse. And
removing this small layout shift is obviously slightly better for the user
experience, so it shouldn't worsen the score.

Because of this problem with averages, we decided to move forward with the
smaller, capped, maximum windows. So in the example above, Session Window 2
would be ignored and only the sum of the layout shifts in Session Window 1 would
be reported.

### Why 5 seconds?

We evaluated multiple window sizes and found two things:

* For short windows, slower page loads and slower responses to user interactions
  could break layout shifts into multiple windows and improve the score. We
  wanted to keep the window large enough so it doesn't reward slowdowns!
* There are some pages with a continual stream of small layout shifts. For
  example, a sports score page that shifts a bit with each score update. These
  shifts are annoying, but they don't get more annoying as time passes. So we
  wanted to ensure that the window was capped for these types of layout shifts.

With these two things in mind, comparing a variety of window sizes on many
real-world web pages, we concluded that 5 seconds would be a good limit to the
window size.

## How will this affect my page's CLS score?

Since this update caps the CLS of a page, **no page will have a worse score**
as a result of this change.

And based on our analysis, **55% of origins will not see a change in CLS at all
at the 75th percentile**. This is because their pages either do not currently
have any layout shifts or the shifts they do have are already confined to a
single session window.

**The rest of the origins will see improved scores at the 75th percentile with
this change.** Most will only see a slight improvement, but about 3% will see
their scores improve from having a "needs improvement" or "poor" rating to
having a "good" rating. These pages tend to use infinite scrollers or have many
slow UI updates, as described in our [earlier
post](/better-layout-shift-metric/).

## How can I try it out?

We'll be updating our tools to use the new metric definition soon! Until then,
you can try out the updated version of CLS on any site using the [example
JavaScript
implementations](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver)
or the [fork of the Web Vitals
extension](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls).

Thanks to everyone who took the time to read the previous post and give their
feedback!

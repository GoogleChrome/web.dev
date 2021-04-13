---
title: Fast ads matter
subhead: |
    Learn how improving ad speed can increase revenue and makes users happy, and
    how to approach ad speed improvements.
date: 2019-10-29
authors:
  - gernberg
  - jimper
  - robhazan
  - thebengeu
hero: image/admin/xw8W0H84I776HdSNR1NJ.jpg
thumbnail: image/admin/qcam8u4RQMmc8rod7UXm.jpg
alt: |
    A long-exposure shot of a moving subway train and advertisement posters at
    the station photo.
description: |
    Understand the value of fast ads and how to think about ad speed.
tags:
  - blog
  - performance
  - ads
---

If you're like most publishers on the web, your business offers a simple value
exchange: you provide content that users find valuable, and in the process
present them with relevant ads to generate revenue. But if those ads slow down
the content, are you really upholding your end of the bargain?

This post explains how fast ads benefit everyone, and how to start investigating
and improving ad speed on your sites.

## Why do fast ads matter?

### Fast ads improve the user experience

Users come to your site to be entertained, get informed, or learn something new,
and they expect your site to load quickly, with minimal interruption. If your
site helps users do that well, they tend to return more often. While ads may be
necessary for your business, if they're slowing down your site they can create a
tension with the user's purpose.

The browser has limited resources to work with—memory, CPU, and network
bandwidth. The more of these resources your ads consume, the longer it takes for
your page to become visually complete and [interactive](/interactive/). This can
be a drag on user experience metrics like [session
length](https://en.wikipedia.org/wiki/Session_(web_analytics)) and [bounce
rate](https://en.wikipedia.org/wiki/Bounce_rate). You can improve these metrics
by serving the most lightweight ads possible and loading them at the right time
(which is not always right away).

For many e-commerce publishers, display ads are a secondary source of revenue.
If you're one of these publishers, you know that any ads you place on the page
have some negative impact on your primary business metrics (sales,
subscriptions, and more). Fast ads, by getting out of the page's way, give your
primary business metrics a boost as well.

{% Aside %} When asked about their reasons for installing ad blockers, [many
users cited "interruption" and
"speed"](https://pagefair.com/blog/2017/adblockreport/) as primary motivators.
Since fast ads result in improved user experience metrics, a focus on improving
ad speed may decrease the incentive for users to install ad blockers. {%
endAside %}

### Fast ads make you more money

Another way to think about this topic is from an advertiser's point of view. The
sooner an ad appears on the page, the longer it will be visible on the screen,
meaning it's more likely to be seen and interacted with. As views and
interactions increase, so does the value of your ad slots in the eyes of
advertisers.

Conversely,
[impressions](https://en.wikipedia.org/wiki/Impression_(online_media)) and
[viewable impressions](https://en.wikipedia.org/wiki/Viewable_Impression)
decrease the longer an ad takes to appear on the page. To provide a sense of the
magnitude of this problem, the charts below show aggregated data from an
experiment where a delay between 100&nbsp;ms and 1&nbsp;s was injected before
each ad response, across 4 billion impressions on websites with the Google
Publisher Tag in multi-request mode. The dotted lines are extrapolations to
visualize how improving ad speed could increase impressions and viewability
rate.

With 1&nbsp;s of added delay, impressions decreased by 1.1% for mobile traffic
and 1.9% for desktop traffic:

<figure class="w-figure">
  {% Img src="image/admin/upKhjFZogtlvQGtTfwrX.svg", alt="Chart showing latency injected vs. impressions change", width="800", height="600" %}
  <figcaption class="w-figcaption">Source: Google Internal Data, December 2016 to January 2017.</figcaption>
</figure>

With 1&nbsp;s of added delay, viewability rate decreased by 3.6% for mobile
traffic and 2.9% for desktop traffic:

<figure class="w-figure">
  {% Img src="image/admin/PeyZqzqs99y5kklrE2XK.svg", alt="Chart showing latency injected vs. viewability rate change", width="800", height="600" %}
  <figcaption class="w-figcaption">Source: Google Internal Data, December 2016 to January 2017.</figcaption>
</figure>

## A framework for thinking about ad speed

Modern websites tend to have complex and diverse ad serving setups, which means
there's no one-size-fits-all method of making ads fast. Instead, the following
sections give you a framework for thinking about ad speed. Some points are
specific to Google Ad Manager, but the principles apply even if you're using a
different ad server.

### Know why you want to improve ad speed

Before you start working to improve ad speed, you should be clear on what your
goals are. Is it to improve the user experience? To increase viewability? Both?

Whatever your specific goals are, it's important to identify the metrics you can
use to measure and track progress towards them over time. Having the right
metrics in place allows you to:

*   Know if the changes you're making are moving you in the right direction.
*   Run experiments, such as A/B tests, to evaluate the effectiveness of
    specific changes.

Once you've decided on the metrics that make sense for you, be sure to configure
reporting so you can easily keep track of them. A dashboard you can check
periodically or scheduled reports sent to you by email work well for that.

### Know your inventory and dependencies

To identify opportunities for improving ad speed, you first need to understand
the types of inventory your site supports and the technical dependencies of
each.

As an example, suppose a site supports the following inventory types:
* Desktop leaderboard
* Mobile banner

To load and display ads, the example site uses the following:
* A consent management platform
* Audience scripts
* Header bidding scripts
* A rendering framework

First, create a flowchart for each inventory type to visualize how the various
dependencies interact in order to load and display an ad. Desktop leaderboard
inventory may look like this:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Kj5Vv9SffxhrfWmNtptm.svg", alt="An example workflow for the desktop leaderboard inventory type.", width="800", height="92" %}

While a more complex inventory type, such as mobile banner, may look like this:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lzFgP8eaVWqLIlpBibyX.svg", alt="An example workflow for the mobile banner inventory type.", width="800", height="287" %}

Then, use this information to create a simple table like the one below, which
maps each inventory type to its dependencies in an easily digestible format.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
      <th>Type of inventory</th>
      <th>Consent management platform</th>
      <th>Audience script</th>
      <th>Header bidding script</th>
      <th>Rendering framework</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Desktop leaderboard</td>
        <td>&#x2714;</td>
        <td>&#x2714; (X)</td>
        <td>&#x2714; (A)</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Mobile banner</td>
        <td>&#x2714;</td>
        <td>&#x2714; (X and Y)</td>
        <td>&#x2714; (A and B)</td>
        <td>&#x2714;</td>
      </tr>
    </tbody>
  </table>
</div>

Creating an overview of inventory types and dependencies like this helps to
identify critical paths and areas for optimization. For example, you may find
that some dependencies are included unnecessarily and can be removed for a quick
speed improvement. This information is especially useful to have when analyzing
ad loading times.

### Know where you want to improve

A good way to approach improving ad speed is to focus on reducing the amount of
time it takes for the first ad on your page to load. This time can be broken
down into three main intervals:

<dl>
    <dt>Time to load ad libraries</dt>
    <dd>The time it takes to load all ad libraries necessary to issue the first ad request. May be improved by removing or <a href="/efficiently-load-third-party-javascript/">delaying the loading of scripts</a> that are not related to making ad requests.</dd>
    <dt>Time to first ad request</dt>
    <dd>The time elapsed from ad library load to the first ad request being made. May be improved by parallelizing header bidding requests and avoiding tasks that <a href="/mainthread-work-breakdown/">block the main thread</a>.</dd>
    <dt>Time to render first ad</dt>
    <dd>The time elapsed from the first ad request being made to the first ad being rendered. May be improved by reducing ad complexity and creative file size.</dd>
</dl>

Before you start making any changes, you need to decide which of these metrics
to focus on. While the ultimate goal is to minimize them all, the relative
importance of improving each (and the methods you use to do so) will greatly
depend on your specific setup.

You can use a tool like [Publisher Ads Audits for
Lighthouse](https://developers.google.com/publisher-ads-audits) to help you
analyze your site, identify bottlenecks, and make an informed decision about
what to focus your efforts on.

## Conclusion

Now that you understand the importance of ad speed and have a framework for
thinking about it, it's time to identify areas for improvement in your sites and
make your ads fast. Finally, consider authoring your ads in
[AMP](https://amp.dev/about/ads/), a format that reliably produces fast ads.

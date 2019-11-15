---
layout: post
title: User-centric performance metrics
authors:
  - philipwalton
date: 2019-11-08
description: |
  User-centric performance metrics are a critical tool in understanding and
  improving the experience of your site in a way that benefits real
  users.
tags:
  - performance
  - metrics
---

We've all heard how important performance is. But when we talk about
performance&mdash;and about making websites "fast"&mdash;what specifically do we
mean?

The truth is performance is relative:

- A site might be fast for one user (on a fast network with a powerful device)
  but slow for another user (on a slow network with a low-end device).
- Two sites may finish loading in the exact same amount of time, yet one may
  _seem_ to load faster (if it loads content progressively rather than waiting
  until the end to display anything).
- A site might _appear_ to load quickly but then respond slowly (or not at all)
  to user interaction.

So when talking about performance, it's important to be precise and to refer to
performance in terms of objective criteria that can be quantitatively measured.
These criteria are known as _metrics_.

But just because a metric is based on objective criteria and can be
quantitatively measured, it doesn't necessarily mean those measurements are
useful.

## Defining metrics

Historically, web performance has been measured with the
<code>[load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)</code>
event. However, even though <code>load</code> is a well-defined moment in a
page's lifecycle, that moment doesn't necessarily correspond with anything the
user cares about.

For example, a server could respond with a minimal page that "loads" immediately
but then defers fetching content and displaying anything on the page until
several seconds after the `load` event fires. While such a page might
technically have a fast load time, that time would not correspond to how a user
actually experiences the page loading.

Over the past few years, members of the Chrome team&mdash;in collaboration with
the [W3C Web Performance Working Group](https://www.w3.org/webperf/)&mdash;have
been working to standardize a set of new APIs and metrics that more accurately
measure how users experience the performance of a web page.

To help ensure the metrics are relevant to users, we frame them around a few key
questions:

<table id="questions">
  <tr>
    <td><strong>Is it happening?</strong></td>
    <td>Did the navigation start successfully? Has the server responded?</td>
  </tr>
  <tr>
    <td><strong>Is it useful?</strong></td>
    <td>Has enough content rendered that users can engage with it?</td>
  </tr>
  <tr>
    <td><strong>Is it usable?</strong></td>
    <td>Can users interact with the page, or is it busy?</td>
  </tr>
  <tr>
    <td><strong>Is it delightful?</strong></td>
    <td>Are the interactions smooth and natural, free of lag and jank?</td>
  </tr>
</table>

## How metrics are measured

Performance metrics are generally measured in one of two ways:

- **In the lab:** using tools to simulate a page load in a consistent,
  controlled environment
- **In the field**: on real users actually loading and interacting with the page

Neither of these options is necessarily better or worse than the other&mdash;in
fact you generally want to use both to ensure good performance.

### In the lab

Testing performance in the lab is essential when developing new features. Before
features are released in production, it's impossible to measure their
performance characteristics on real users, so testing them in the lab before the
feature is released is the best way to prevent performance regressions.

### In the field

On the other hand, while testing in the lab is a reasonable proxy for
performance, it isn't necessarily reflective of how all users experience your
site in the wild.

The performance of a site can vary dramatically based on a user's device
capabilities and their network conditions. It can also vary based on whether (or
how) a user is interacting with the page.

Moreover, page loads may not be deterministic. For example, sites that load
personalized content or ads may experience vastly different performance
characteristics from user to user. A lab test will not capture those
differences.

The only way to truly know how your site performs for your users is to actually
measure its performance as those users are loading and interacting with it. This
type of measurement is commonly referred to as [Real User
Monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring)&mdash;or RUM for
short.

## Types of metrics

There are several other types of metrics that are relevant to how users perceive
performance.

- **Perceived load speed:** how quickly a page can load and render all of its
  visual elements to the screen.
- **Load responsiveness:** how quickly a page can load and execute any required
  JavaScript code in order for components to respond quickly to user interaction
- **Runtime responsiveness:** after page load, how quickly can the page respond
  to user interaction.
- **Visual stability:** do elements on the page shift in ways that users don't
  expect and potentially interfere with their interactions?
- **Smoothness:** do transitions and animations render at a consistent frame
  rate and flow fluidly from one state to the next?

Given all the above types of performance metrics, it's hopefully clear that no
single metric is sufficient to capture all the performance characteristics of a
page.

## Important metrics to measure

- **[First contentful paint (FCP)](/fcp/):** measures the time from when the
  page starts loading to when any part of the page's content is rendered on the
  screen. _([lab](#in-the-lab), [field](#in-the-field))_
- **[Largest contentful paint (LCP)](/lcp/):** measures the time from when the
  page starts loading to when the largest text block or image element is
  rendered on the screen. _([lab](#in-the-lab), [field](#in-the-field))_
- **[First input delay (FID)](/fid/):** measures the time from when a user first
  interacts with your site (i.e. when they click a link, tap a button, or use a
  custom, JavaScript-powered control) to the time when the browser is actually
  able to respond to that interaction. _([field](#in-the-field))_
- **[Time to Interactive (TTI)](/tti/):** measures the time from when the page
  starts loading to when it's visually rendered, its initial scripts (if any)
  have loaded, and it's capable of reliably responding to user input quickly.
  _([lab](#in-the-lab))_
- **[Total blocking time (TBT)](/tbt/):** measures the total amount of time
  between FCP and TTI where the main thread was blocked for long enough to
  prevent input responsiveness. _([lab](#in-the-lab))_
- **[Cumulative layout shift (CLS)](/cls/):** measures the cumulative score of
  all unexpected layout shifts that occur between when the page starts loading
  and when its [lifecycle
  state](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)
  changes to hidden. _([lab](#in-the-lab), [field](#in-the-field))_

While this list includes metrics measuring many of the various aspects of
performance relevant to users, it does not include everything (e.g. runtime
responsiveness and smoothness are not currently covered).

In some cases, new metrics will be introduced to cover missing areas, but in
other cases the best metrics are ones specifically tailored to your site.

## Custom metrics

The performance metrics listed above are good for getting a general
understanding of the performance characteristics of most sites on the web.
They're also good for having a common set of metrics for sites to compare their
performance against their competitors.

However, there may be times when a specific site is unique in some way that
requires additional metrics to capture the full performance picture. For
example, the LCP metric is intended to measure when a page's main content has
finished loading, but there could be cases where the largest element is not part
of the page's main content and thus LCP may not be relevant.

To address such cases, the Web Performance Working Group has also standardized
lower-level APIs that can be useful for implementing your own custom metrics:

- [User Timing API](https://w3c.github.io/user-timing/)
- [Long Tasks API](https://w3c.github.io/longtasks/)
- [Element Timing API](https://wicg.github.io/element-timing/)
- [Navigation Timing API](https://w3c.github.io/navigation-timing/)
- [Resource Timing API](https://w3c.github.io/resource-timing/)
- [Server timing](https://w3c.github.io/server-timing/)

Refer to the guide on [Custom Metrics](/custom-metrics/) to learn how to use
these APIs to measure performance characteristics specific to your site.

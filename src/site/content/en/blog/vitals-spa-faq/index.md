---
title: "How SPA architectures affect Core Web Vitals"
subhead: "Answers to common questions about SPAs, Core Web Vitals, and Google's plan to address current measurement limitations."
description: "Answers to common questions about SPAs, Core Web Vitals, and Google's plan to address current measurement limitations."
authors:
  - philipwalton
  - yoavweiss
date: 2021-09-14
updated: 2022-07-18
hero: image/eqprBhZUGfb8WYnumQ9ljAxRrA72/FITOGeO0PDyPrBveixB7.jpeg
alt: "Exterior view of the Walt Disney Concert Hall"
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

Since first introducing the [Web Vitals](/vitals/) initiative in May of 2020, we
on the Chrome team have received a lot of great questions and feedback about the
program.

Perhaps the topic we've received the most questions about, which is also
probably the hardest question to answer, is how to measure Core Web Vitals in a
[single-page application](https://en.wikipedia.org/wiki/Single-page_application)
(SPA), as well as how SPA architectures affect Core Web Vitals scores.

These questions are hard to answer because the problem is quite nuanced, so in
this post we're going to do our best to answer the most common questions,
providing as much detail and context as we can.

Before getting into specifics, though, it's important to state that Google does
not have any preference as to what architecture or technology is used to build a
site. We believe that SPAs and multi-page applications (MPAs) are both capable
of delivering high quality experiences to users, and our intention with the Web
Vitals initiative is to provide metrics that measure the experience independent
of the technology. While this is not possible in every case today (due to
limitations in the web platform), we are [actively working on closing those
gaps](#what-is-google-doing-to-ensure-mpas-do-not-have-an-unfair-advantage-compared-to-spas).

## Frequently asked questions

### Do Core Web Vitals metrics include SPA route transitions?

No. Each of the Core Web Vitals metrics is measured relative to the current,
top-level page navigation. If a page dynamically loads new
content and updates the URL of the page in the address bar, it will have no
effect on how the Core Web Vitals metrics are measured. Metric values are not
reset, and the URL associated with each metric measurement is the URL the user
navigated to that initiated the page load.

### Can the Core Web Vitals metrics treat SPA route changes the same as traditional page loads?

Unfortunately, no. Not yet anyway.

There is no standardized way of building an SPA today, and even among the
popular SPA and routing libraries, the user experience can be quite different
from app to app:

* Some SPAs update the URL only when loading new "full page" content, whereas
  other sites update the URL for tiny content changes or even just UI state
  changes.
* Some SPAs update the URL using the History API, whereas others use hash
  changes in order to support older browsers (and others do not update the URL
  at all).
* Some SPAs load content and then update the URL, whereas others update the URL
  before loading content.
* Some SPAs load content all at once, synchronously, in a single JavaScript
  task, whereas others transition content in, asynchronously, across multiple
  tasks (with no clear transition end event).
* Some SPAs always load content from the network, whereas others preload all
  content upfront so that route changes load instantly from memory.

These differences make defining and identifying what constitutes an SPA route
change, or even an SPA itself, very difficult to do _at scale_.

In some cases an SPA route change is logically identical to an MPA page load,
and in such cases it would be great if the existing Core Web Vitals metrics
could be applied.

However, without solid heuristics to reliably identify "real" route changes from
all other URL changes—as well as clear signals marking the beginning and end of
such transitions—reporting Core Web Vitals metrics in these cases would muddy
the data and make it less useful or representative of the real user experience
on the site.

### Is it harder for SPAs to do well on Core Web Vitals than MPAs?

There is nothing inherent in the SPA architecture that would prevent a page in
an SPA from loading just as quickly—and scoring just as well on all of the Core
Web Vitals metrics—as a similar page in an MPA.

However, properly optimized MPAs do have some advantages in meeting the Core Web
Vitals thresholds that SPAs currently do not. The reason is because with the MPA
architecture, each "page" is loaded as a full-page navigation (rather than
dynamically fetching content and inserting it into the existing page), which
means users who visit an MPA are more likely to load more than one page from the
site, which in turn means that a larger percentage of the distribution of all
page loads for an MPA will involve some or all of the sub-resources being
cached.

Granted, for an MPA to perform better on the Core Web Vitals metrics than an SPA
requires a few things to be true:

* The MPA needs to have optimized sub-resource caching in order to ensure
  same-origin page loads are indeed faster than cross-origin page loads at the
  75th percentile.
* Users who visit MPAs need to visit multiple pages in order for the site to
  receive the caching benefits that result in faster page loads.

Since Core Web Vitals assessments [consider the 75th
percentile](/defining-core-web-vitals-thresholds/#choice-of-percentile) of page
visits, having more, well-performing page visits in the dataset will increase
the likelihood that the visit at the 75th percentile of the distribution will be
within the recommended thresholds.

Note that an important thing to consider when comparing Core Web Vitals scores
is how the data is aggregated—that is, whether the dataset in the distribution
includes all pages from your site or origin, or just page loads for a particular
page URL.

When aggregating the scores of all pages in an origin, individual fast pages can
improve the 75th percentile for the origin as a whole. However, when aggregating
by individual pages, the scores of one page will not affect the scores of the
next. In other words, when aggregating the scores of an MPA by page, fast cache
loads seen on the checkout page will _not_ improve the scores of slow initial
loads experienced on the site's [landing
page](https://en.wikipedia.org/wiki/Landing_page).

You can check your site's score for different aggregation methods using
[PageSpeed Insights](https://pagespeed.web.dev/) or
the [Chrome User Experience Report
API](/chrome-ux-report-api/),
which reports scores for both individual page URLs and the entire origin.

Another way the SPA architecture can affect Core Web Vitals scores is for
metrics that consider the full lifespan of a page. Since users visiting SPAs
tend to stay on the same "page" for the entire session, metrics that accumulate
over time can be harsher on SPAs than MPAs.

In April 2021, we announced [changes to the CLS metric](/evolving-cls/) that
partially addressed this problem. Previously CLS would accumulate over the
entire page lifespan, whereas now it only accumulates over a specific window of
time—essentially the worst burst of layout shifts on a given page.

However, even with the new CLS definition, SPAs are still at a disadvantage
because the CLS value doesn't "reset" after a route transitions like it does
with full page loads in an MPA. This can also lead to confusion because layout
shifts that occur after a route transition will be attributed to the URL of the
page when it was loaded, not the URL in the address bar at the time of the shift
([more details
below](#if-core-web-vitals-scores-are-only-reported-for-an-spa's-landing-pages-how-can-i-debug-issues-that-occur-on-"pages"-after-a-route-transition)).

### If SPA architectures improve the user experience, shouldn't that improvement be reflected in the metrics?

Yes, it should. Though as mentioned previously, quantifying just how much the
experience has improved is difficult to do at scale, given all the different
ways SPAs are implemented on the web today.

The truth is the web performance industry (Google included) has historically not
invested nearly as much time and effort into developing [user-centric
metrics](/user-centric-performance-metrics/) for the post-load performance of a
page as it has for the page load itself. This isn't because post-load
performance isn't important, it's because post-load UX and interactions are so
much more varied and less well-defined—making it hard to design metrics for
them.

But even if we did have well defined post-load metrics to measure SPA
performance, we wouldn't want to ignore the load experience just because the
post load experience got better.

One of the goals of the Web Vitals initiative is to promote and incentivize good
user experiences across as many aspects of loading and using a web page as
possible. We don't want to encourage scenarios where bad experiences are
justified if you can have enough good experiences to make up for them. Users
want pages to load fast _and_ transition to new content fast, and we've tried to
design metrics that favor those types of experiences.

So while it's true that an MPA version of a site may fare better on the Core Web
Vitals metrics at the 75th percentile than an SPA version of the exact same
site, the SPA version should still strive to meet the "good" threshold. If the
SPA version doesn't meet the "good" threshold for most users, then the initial
load experience is probably still not perceived as good—even if the subsequent,
in-page navigation experience is excellent.

In the future we plan to develop metrics that encourage great, post-load
experiences, and we believe this is the best path to incentivize high-quality
SPAs in a way that doesn't compromise the initial load experience. We have
already delivered a new metric named [Interaction to Next Paint (INP)](/inp/) that measures interaction latency throughout the entire page lifecycle, and we're actively working on other
post-load metrics as well, including metrics that measure SPA route transitions
([see below](#design-new-apis-that-enable-better-spa-measurement)).

### We switched our site from an MPA to an SPA and our scores regressed. Is that expected?

It depends. There are a number of reasons why your scores could change after a
major architecture migration, but a decrease in the number of warm cache loads
could account for some of the change.

A quick way to check would be to test both an MPA and SPA version of one of your
landing pages with
[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/). If the
Lighthouse score is lower on any of the Core Web Vitals metric for the SPA
version, then it's likely that the load experience did get worse after the
update.

### Should I switch my site from an SPA to an MPA to score better on Core Web Vitals?

Probably not. You should only switch from an SPA to an MPA if you are not happy
with your SPA stack and you have reason to believe an MPA will provide a better
user experience.

Over time, as the Core Web Vitals metrics improve and cover more of the full
browsing experience, teams with well-built SPAs that provide great UX should
expect to see their Core Web Vitals scores reflect that.

### If Core Web Vitals scores are only reported for an SPA's landing pages, how can I debug issues that occur on "pages" after a route transition?

Google tools that report field data for the Core Web Vitals metric (like Search
Console and PageSpeed Insights) get their data from the [Chrome User Experience
Report](https://developer.chrome.com/docs/crux/)
(CrUX). And CrUX aggregates data either by origin or by page URL (that is, the
page URL at load time).

For all the reasons already listed above, CrUX is not able to aggregate data by
SPA route. However, as a site owner who is familiar with your own architecture,
it is possible to measure this yourself, and many analytics tools allow you to
signal when an SPA route change is occurring and they update your measurement
data accordingly.

When measuring Web Vitals metrics with an analytics tool, make sure you're
measuring both the current route URL as well as the original page URL. This will
allow you to both debug individual issues that occur throughout the page
lifecycle as well as aggregate by original page URL in order to match how Google
tools measure and report on the metrics.

For more details and best practices on this topic, see: [Debug Web Vitals in the
field](/debug-web-vitals-in-the-field/).

### What is Google doing to ensure MPAs do not have an unfair advantage compared to SPAs?

As mentioned above, a properly-optimized MPA can, in some cases, report better
Web Vitals scores at the 75th percentile due to the fact that it will likely
have a higher percentage of cached page visits. Conversely, real improvements to
the user experience in properly-optimized SPAs are not currently being captured
by any of the Core Web Vitals metrics.

At Google, we recognize that this creates incentives that do not fully align
with the goals of the Web Vitals initiative, and we are actively looking at ways
to fix this. Currently, we're exploring two potential solutions, one short term
and one longer term:

1. Assess cross-origin and same-origin page visits separately.
2. Design new APIs that enable better SPA measurement.

#### Assess cross-origin and same-origin page visits separately

Today the Core Web Vitals metrics aggregate all page visits into a single
bucket—they do not differentiate between new versus returning visits or landing
pages versus checkout pages or any other aggregation type where cache state
could have an effect on performance.

One way to normalize the differences between SPA and MPA performance would be to
apply different weighting to different types of visits, potentially even with
completely different [threshold
recommendations](/defining-core-web-vitals-thresholds/).

While we definitely do want to reward effective cache implementations, we don't
want fast intra-site navigations to be able to cover up for slow landing page
loads. We also don't want to incentivize sites to break up long pages into a
collection of shorter pages just for the sake of improving metric scores.

By separately assessing cross-origin and same-origin page visits we can help
ensure that both types of experiences are important without letting the relative
popularity of one type on a given site skew the distribution of any particular
metric.

#### Design new APIs that enable better SPA measurement

Another solution that is actively being worked on (in parallel to the above) is
a new [App History API](/app-history-api/), which would help standardize current
SPA patterns and make it easier to measure and understand SPA usage at scale.

The App History API introduces a new
[`navigate`](https://wicg.github.io/app-history/#navigate-event) event, which
has two key features specific to SPA measurement:

* A
  [`userInitiated`](https://wicg.github.io/app-history/#ref-for-dom-apphistorynavigateevent-userinitiated%E2%91%A0)
  flag, which will only be set to true if the navigation was initiated via a
  link click, form submission, or the browser's back or forward UI.
* A
  [`transitionWhile()`](https://wicg.github.io/app-history/#ref-for-dom-apphistorynavigateevent-transitionwhile%E2%91%A0%E2%91%A8)
  method, which takes a promise allowing the developer to signal when the work
  they've initiated to perform the navigation is complete.

The `userInitiated` flag can be used to determine a semantic starting point for
an SPA route transition, indicating clear user intent. The `transitionWhile()`
promise resolving can help the browser correlate paints with the specific route
transition, such that it may be able to determine the largest contentful paint
related to that transition.

Building on top of the idea presented in the previous section, it might even be
possible to aggregate SPA route transition time into the same bucket as
same-origin page loads in an MPA. This is exciting because it would allow a site
migrating from an MPA to an SPA to actually compare the performance before and
after.

Of course, more research is needed before we'll know whether we can accurately
make these determinations. If you have suggestions or feedback on these
proposals, please email
[web-vitals-feedback@googlegroups.com](mailto:web-vitals-feedback@googlegrouops.com).

## Final thoughts

Google is deeply committed to improving the Web Vitals metrics, and ensuring
they measure and incentivize high-quality experiences that are important to
users. That being said, we do acknowledge that measurement gaps exist today. The
metrics do not currently cover every aspect of user experience, but we are
actively working to close these gaps.

Despite the current limitations, we believe the areas the existing metrics do
capture are critical to the health and success of the web, and to the extent
that sites (regardless of architecture) do not meet the recommended thresholds,
we believe there is room for improvement.

I hope this post has helped shed some light on this complex and nuanced subject.
As always, if you have feedback on the current or future Web Vitals metrics,
please email
[web-vitals-feedback@googlegroups.com](mailto:web-vitals-feedback@googlegrouops.com).

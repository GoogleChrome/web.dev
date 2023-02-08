---
title: Find your way with field data in the Web Vitals extension update
subhead: The Web Vitals extension now shows you where your local experiences are in relation to
  real user experiences in the field.
description: The Web Vitals extension now shows you where your local experiences are in relation
  to real user experiences in the field.
authors:
  - rviscomi
date: 2021-07-02
hero: image/STd8eW8CSiNp5B1bX0R6Dww2eH32/KwcWeCZ6LoIfTLRgVxp4.png
alt: The Milky Way galaxy with a pin labeled You Are Here.
tags:
  - blog
  - web-vitals
  - chrome-ux-report
  - tools
---

[Core Web Vitals](/vitals) are the most important metrics to measure to
understand your users' experiences, because when users have good experiences,
[good things happen](https://wpostats.com/)! The [Web Vitals extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)
for Chrome is one tool in the [Web Vitals toolbox](/vitals-tools/) that shows you
performance data about the pages you visit as you browse the web.

Page performance depends on many factors, including hardware and network quality. How
you experience a page on your machine may be very different from how the majority of users
experience it. That's why version 1.0 of the Web Vitals extension includes a new feature
that integrates real-user data from the [Chrome UX Report](/chrome-ux-report/) (CrUX)
with your local Core Web Vitals measurements. This feature displays your local measurements
in the context of how other users have experienced the same pages. It comes with
a sparkly new UI and I'm excited to show you how it works.

{% Video
  src="video/STd8eW8CSiNp5B1bX0R6Dww2eH32/EFeVK6dAwBZWzKhqBd1Y.mp4",
  height="493",
  width="800",
  controls="true",
  loop="true",
  muted="true",
  preload="auto" %}

## Field data from CrUX

CrUX is a public dataset of real-user experiences in Chrome. It powers some of the critical tools
in the Core Web Vitals workflow like [Search Console](https://support.google.com/webmasters/answer/9205520#about_data)
and [PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/about#crux).
The raw data for millions of websites is also publicly queryable in the [CrUX dataset on BigQuery](https://developer.chrome.com/blog/chrome-ux-report-bigquery)
and the [CrUX API](https://developer.chrome.com/blog/chrome-ux-report-api). This Web Vitals extension update
integrates the page and origin-level desktop data from the CrUX API.

User experience data is broken down into three qualitative ratings: good, needs improvement, and poor.
The thresholds used for each rating are documented in the guides for each of the Core Web Vitals
metrics: [LCP](/lcp/#what-is-lcp), [FID](/fid/#what-is-fid), and
[CLS](/cls/#what-is-a-good-cls-score). So for example, the CrUX API can tell you that
16% of real-user experiences on a given page are evaluated as having good
<span style="white-space: nowrap;">LCP under 2.5</span> seconds.

## New extension UI

<figure>
{% Img src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/EaVNEuQ6gxVLtHYNkSZj.png", alt="Screenshot of the
Web Vitals extension showing an explanation of how the local LCP experience relates to real-user
desktop data from the field.", width="800", height="549" %}
  <figcaption>
    Screenshot of the Web Vitals extension showing an explanation of how the local LCP experience
    relates to real-user desktop data from the field.
  </figcaption>
</figure>

In the new Web Vitals extension interface, your local experience is layered on
top of the broader distribution of real-user experiences. It's like when you're in an expansive
place like a shopping mall and there's a big map with all of the stores and a pin labeled
"YOU ARE HERE" to help you orient yourself and find where you're going.

The distributions of real-user data from CrUX are laid out on a horizontal bar for each metric.
Your local experiences are displayed as single points on those horizontal bars. The position of
your local experience on the horizontal bar indicates where that experience falls relative to the
real-user distributions. This should make it immediately apparent when your local
experience is very different from other users'. For example, if you have a slow LCP experience and
only 1% of users have similar experiences, something unusual must have happened.

## Falling back to origin-level data

<figure>
{% Img src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/t5SmXUJqJadNsyOi26bb.png", alt="Screenshot of the
Web Vitals extension showing origin-level desktop field data with \"Waiting for input…\" for the
FID results.", width="800", height="552" %}
  <figcaption>
    Screenshot of the Web Vitals extension showing origin-level desktop field data with
    "Waiting for input…" for the FID results.
  </figcaption>
</figure>

Some pages don't have URL-level data in the CrUX dataset. This can happen
because the page is so new that it hasn't been picked up yet or because the page has insufficient
traffic to be included in the dataset. In cases like these, Web Vitals extension falls back to more
granular origin-level data whenever possible. This data represents the aggregate user experiences
on all pages of the website, so while it may not be immediately relevant to your particular page
experience, it should still offer some insight into how users experience the site as a whole.

Another common case is to see a "Waiting for input&hellip;" message. This is because FID is the only
Core Web Vital that requires user interaction to be measured, so the extension won't have any local FID data
to show until you interact with the page.

## Edge cases

<figure>
{% Img src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/qt6fmKIjPNrUsckKiUfS.png", alt="Screenshot of the
Web Vitals extension showing only local data; field data is unavailable.",
width="800", height="548" %}
  <figcaption>
    Screenshot of the Web Vitals extension showing only local data; field data is unavailable.
  </figcaption>
</figure>

There are some less common edge cases that you may run into while using the extension.

It can happen that entire origins have insufficient data. In that case, the extension will just show you
how your local experiences performed.

How you interact with the page may also affect the relevance of the data. For example, loading the
page in a background tab will count against the LCP metric the entire time until you foreground the page.
If it takes you 90 seconds to switch to the tab, the LCP might appear as 91.5 seconds. When this happens, a little
warning icon will appear next to your LCP value to warn you of the artificial inflation. Note that
these kinds of irrelevant LCP values are ignored in the CrUX dataset.

One last edge case to be aware of is specific to FID. Because it depends on user interactions, that makes it
less likely to be available in the dataset for pages and websites with fewer page views. So if you're
visiting a page like that, you may only see field data for LCP and CLS. It's worth noting for the
sake of completeness that the same could happen for LCP or CLS in extremely rare situations, but
this issue is predominantly affected by FID.

## Comparing field data from phones

<figure>
{% Img src="image/STd8eW8CSiNp5B1bX0R6Dww2eH32/0K0g0TD22jdNZpSe3s3p.png", alt="Screenshot of the
Web Vitals extension showing local metrics compared to phone field data.",
width="800", height="556" %}
  <figcaption>
    Screenshot of the Web Vitals extension showing local metrics compared to phone field data.
  </figcaption>
</figure>

By default, all of the data in the Web Vitals extension corresponds to real desktop users'
experiences from the field. After all, this extension is only available on desktop versions of
Chrome, so it'd be most relevant to see how users under similar conditions experience the
page or origin.

It's important to understand phone users' experiences too, so the extension has an advanced setting on
the Options page that lets you see how your local experience compares to phone data from the field.

To enable phone data in the extension, follow these steps:

1. Right click on the extension icon in the toolbar and select **Options**.
2. Check the **Compare local experiences to phone field data** option.

The UI will update in a few places to indicate which mode you're in. Be aware that real phone
users' experiences can be _very different_ from that of desktop users, so use this feature with discretion.

## Get the Web Vitals extension

To start using the latest version of the Web Vitals extension, head over to the
[Chrome Web Store](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)
to install it. Or if you're an existing user of the extension, you should be upgraded to
version 1.0 automatically. If you have any feedback about your experience with the extension
(feature requests, bug reports, anything), let us know in the
[open-source repository](https://github.com/GoogleChrome/web-vitals-extension) on GitHub.
I hope it helps you better understand where your local experiences are in relation to other
real users from the field!

_Image credit: Mark Garlick/Science Photo Library/Getty Images_

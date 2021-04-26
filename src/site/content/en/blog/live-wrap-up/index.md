---
layout: post
title: web.dev LIVE wrap-up
subhead: >
  A summary of the major news and updates that were announced during our
  3-day online community event, and a reminder about upcoming regional events.
description: >
  A summary of the major news and updates that were announced during our
  3-day online community event, and a reminder about upcoming regional events.
date: 2020-07-06
hero: image/admin/H60ns6FN1VtNrlx8e3EU.png
thumbnail: image/admin/d2asSQy3UHgqRF8sx1Xk.png
alt: The web.dev LIVE logo.
tags:
  - blog
  - web-vitals
  - security
  - capabilities
  - accessibility
  - metrics
  - devtools
  - lighthouse
  - privacy
  - progressive-web-apps
  - install
---

We just wrapped up our three-day event, [web.dev LIVE](/live), where some of the web
community came together online to talk about the state of web development. We kicked off each day in
a different regional timezone, and Googlers shared a round of updates, news, and tips in the spirit
of helping developers with tools and guidance to keep the web stable, powerful, and accessible.

If you missed some of the live stream, all of the
[sessions are recorded](/live) and available for you to watch on YouTube.
We've also got upcoming [regional events](/live/#regional-events) all around
the world which are organized by Google Developer Groups and will provide
deep-dive sessions on topics related to what we covered during web.dev LIVE.

Let's dive into some of the news and updates that were shared over the three days.

## Web Vitals

The Chrome team
[announced](https://blog.chromium.org/2020/05/introducing-web-vitals-essential-metrics.html) the
[Web Vitals](/vitals) initiative to provide unified guidance, metrics, and tools to
help developers deliver great user experiences on the web. The Google Search team also [recently
announced](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html) that they will
be evaluating page experience as a ranking criteria, and will include [Core Web
Vitals](/vitals/#core-web-vitals) metrics as its foundation.

The three pillars of the 2020 Core Web Vitals are loading, interactivity, and visual stability of
page content, which are captured by the following metrics:

<figure class="w-figure">
  {% Img src="image/admin/kzOdl2pRyEEPEQI0U2lQ.png", alt="An illustration of the Core Web Vitals.", width="800", height="232" %}
</figure>

+ [Largest Contentful Paint](/lcp/) measures perceived load speed and
  marks the point in the page load timeline when a page's main content has likely loaded.
+ [First Input Delay](/fid/) measures responsiveness and quantifies the
  experience users feel when trying to first interact with a page.
+ [Cumulative Layout Shift](/cls/) measures visual stability and quantifies
  the amount of unexpected movement of page content.

At web.dev LIVE, we shared best practices on how to [optimize for Core Web
Vitals](https://youtu.be/AQqFZ5t8uNc) and how to use [Chrome DevTools to explore your site's
vitals values](https://youtu.be/OHb3xZIqUeU). We also shared plenty of other performance-related
talks that you can find at [web.dev/live](/live) in the Day 1 schedule.

## tooling.report

Developing for a platform as broad as the web can be challenging. Build tools are often at the heart
of your web development project, taking on a key role in handling your developer and product
lifecycle.

We have all seen unwieldy build config files, so to help web developers _and_ tooling authors
conquer the complexity of the web, we built [tooling.report](/introducing-tooling-report). It's a website
that helps you choose the right build tool for your next project, decide if migrating from one tool
to another is worth it, or figure out how to incorporate best practices into your tooling
configuration and code base.

We designed a suite of tests to determine which build tools allow you to follow
web development best practices. We worked with the build tool authors to
make sure we used their tools correctly and represented them fairly.

<figure class="w-figure">
  {% Img src="image/admin/awFmvfMqFv3gvbpIICJY.png", alt="A screenshot of the tooling.report UI.", width="800", height="316", class="w-screenshot" %}
</figure>

The initial release of tooling.report covers webpack v4, Rollup v2, Parcel v2, and Browserify with Gulp,
which appear to be the most popular build tools right now. We built tooling.report with the
flexibility of adding more build tools and additional tests with help from the community.

If we're missing a best practice that should be tested, please [propose it in a GitHub
issue](https://github.com/GoogleChromeLabs/tooling.report/issues/new). If you're up for writing a
test or adding a new tool we did not include in the initial set, we welcome you to
[contribute](https://github.com/GoogleChromeLabs/tooling.report/blob/dev/CONTRIBUTING.md)!

In the meantime, you can read more about our [approach towards building
tooling.report](/introducing-tooling-report) and watch our [session from web.dev
LIVE](https://youtu.be/vsMJiNtQWvw).

## Privacy and security on the web

Chrome believes in an open web that is respectful of users' privacy and maintains key use cases that
keep the web working for everyone.

In 2019, Chrome
[proposed](https://blog.chromium.org/2019/05/improving-privacy-and-security-on-web.html) an update
to the cookie standard to restrict cookies to first-party contexts by default and require cookies
for third-party contexts to be explicitly marked as such. Specifically, this provides a line of defense
against Cross-Site Request Forgery attacks. The proposal is now being adopted by Chrome, Firefox,
Edge, and other browsers.

While Chrome decided to [temporarily
rollback](https://blog.chromium.org/2020/04/temporarily-rolling-back-samesite.html) these changes
in light of COVID-19, sadly, during a crisis when people are most vulnerable, you also see these
kinds of attacks increase. So, with the Chrome 84 Stable release (mid-July 2020), the changes will
[start to roll out again](https://www.chromium.org/updates/same-site?pli=1#20200528) across all
Chrome versions from 80 and up. Check out the [SameSite cookies
guidance](/samesite-cookies-explained/) as well as the [web.dev LIVE
session](https://youtu.be/Fet6-IiX69E) to learn more.

Moreover, under the banner of the [Privacy
Sandbox](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html) Chrome is
introducing a number of standards proposals that aim to support the use cases that let people make
their living using the web platform, but do it in a way that better respects user privacy. Chrome is
actively seeking feedback on these proposals, and is participating within the open forums of the W3C
to discuss the proposals as well as those submitted by other parties. Learn more about this
initiative in the [Security and privacy for the open web](https://youtu.be/8Tl0uQdVpxU) session.

Finally, looking at user security, [Spectre](https://meltdownattack.com/) was a vulnerability that
meant malicious code running in one browser process might be able to read any data associated with
that process even if it's from a different origin. One of the browser mitigations for this is site
isolation, i.e. putting each site into a separate process. Watch the web.dev LIVE session on the
[new Cross-Origin Opener and Embedder Policies](https://youtu.be/XLNJYhjA-0c) (COOP and COEP) to
learn more.

## Building a web with powerful capabilities

Chrome wants you to be free to create the highest quality web apps that give you the biggest reach
to users across devices. Combining the installability and reliability of PWAs, with the
[capabilities project](/fugu-status/) (Project Fugu), Chrome is focusing on three
things to close the gap between platform-specific apps and the web, to help you build and deliver great
experiences.

First, Chrome teams have been working hard to give web developers and users [more control over the install
experience](/customize-install/), [adding an install promotion to the
omnibox](/install-criteria/), and
[more](/promote-install/#browser-promotion). Despite the web's ubiquity, it's still
important for some businesses to have their app in the store. To help, Chrome launched
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap), a library and CLI that makes it
trivial to get your PWA into the Play Store. In fact, [PWABuilder.com](http://PWABuilder.com) now
uses Bubblewrap under the hood. In just a few mouse clicks, you can generate an APK and upload your
PWA to the Play Store, as long as you meet the
[criteria](https://blog.chromium.org/2020/06/changes-to-quality-criteria-for-pwas.html).

Second, Chrome is providing tighter integration with the operating system, such as the ability to
share a photo, song, or whatever by invoking the system-level share service with the [Web Share
API](/web-share/), or the ability to [receive content when shared from a different
installed app](/web-share-target/). You can keep users up-to-date, or subtly notify
them of new activity with [app badging](/badging-api/). Also, it's now easier for
users to quickly start an action using [App Shortcuts](/app-shortcuts/), which will
land in Chrome 84 (mid-July 2020).

And finally, Chrome has been working on new capabilities that enable new scenarios that weren't
possible before, like editors that [read and write to files on the user's local file
system](/file-system-access/), or get the list of locally installed fonts so that
users can use them in their designs.

During web.dev LIVE, we spoke about [lots of other capabilities and
features](https://youtu.be/NXCT3htg9nk) that can enable you to deliver the same kind of experience,
with the same capabilities, as platform-specific apps. See all sessions at [web.dev/live](/live)
in the Day 2 schedule.

## What's new in Chrome DevTools and Lighthouse 6.0

### Chrome Devtools: new Issues tab, color deficiencies emulator, and Web Vitals support

One of the most powerful features of Chrome DevTools is its ability to spot issues on a web page and
bring them to the developer's attention. This is most pertinent as we move into the next phase of a
[privacy-first web](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html).
To reduce notification fatigue and clutter in the Console, Chrome DevTools launched the [Issues
tab](https://developers.google.com/web/tools/chrome-devtools/issues) which focuses on three types of
critical issues to start with: [cookie problems](/samesite-cookies-explained),
[mixed content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content),
and [COEP issues](/coop-coep/). Watch the web.dev LIVE session on [finding and fixing
problems with the Issues tab](https://youtu.be/1TbkSxQb4bI) to get started.

<figure class="w-figure">
  {% Img src="image/admin/G7AmzK1btOMBUPEhnFhV.png", alt="A screenshot of the Issues tab.", width="800", height="535", class="w-screenshot w-screenshot--filled" %}
</figure>

Moreover, with the [Core Web Vitals](/vitals/#core-web-vitals) becoming one of the
most critical sets of metrics for web developers to track and measure, DevTools wants to ensure
developers are able to easily track how they perform against these thresholds. So these three
metrics are now in the Chrome DevTools Performance panel.

And finally, with an increasing number of developers focusing on accessibility, DevTools also
introduced a [color vision deficiencies
emulator](https://twitter.com/mathias/status/1237393102635012101?) that allows developers to
emulate blurred vision and other types of vision deficiencies. You
can learn more about this and many other features in the [What's new in
DevTools](https://youtu.be/6yrJZHqJe2k) session.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3gTvVdPvTN3IUyhSN8gn.png", alt="A screenshot of the vision deficiencies emulator.", width="800", height="509", class="w-screenshot w-screenshot--filled" %}
</figure>

### Lighthouse 6.0: New metrics, Core Web Vitals lab measurements, an updated Performance score, and new audits

[Lighthouse](https://developers.google.com/web/tools/lighthouse) is an open-source automated tool
that helps developers improve their site's performance. In its latest version, the Lighthouse team
focused on providing insights based on metrics that give you a balanced view of the quality of your
user experience against critical dimensions.

To ensure consistency, Lighthouse added support for the Core Web Vitals:
[LCP](/lcp/), [TBT](/tbt/) (a proxy for
[FID](/fid/) since Lighthouse is a lab tool and FID can only be
measured in the field) and [CLS](/cls/). Lighthouse also removed
three old metrics: [First Meaningful
Paint](/first-meaningful-paint/), [First CPU
Idle](/first-cpu-idle/), and [Max Potential
FID](/lighthouse-max-potential-fid/). These removals are due to
considerations like metric variability and newer metrics offering better
reflections of the part of user experience that Lighthouse is trying to measure.
Additionally, Lighthouse also made some adjustments to how much each metric
factors into the overall Performance score based on user feedback.

Lighthouse also added a [scoring
calculator](https://googlechrome.github.io/lighthouse/scorecalc/) to help you explore your
performance scoring, by providing a comparison between version 5 and 6 scores. When you run an audit
with Lighthouse 6.0, the report comes with a link to the calculator with your results populated.

And finally, Lighthouse added a bunch of [new
audits](/lighthouse-whats-new-6.0/#new-audits), with a focus on JavaScript analysis
and accessibility.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qAVFUVHR7Ad0tm05J1d3.png", alt="A list of the new audits.", width="800", height="450", class="w-screenshot" %}
</figure>

Learn more by watching the [What's new in speed tooling](https://youtu.be/yDHfrhCGFQw)
session.

## Learn more

Thank you to everyone in the community who joined us to discuss the web
platform's opportunities and challenges.

This post summarized some of the highlights of the event, but there was so much
more. Make sure to check out all the [sessions](/live) and
[subscribe to the web.dev newsletter](/newsletter) if you'd like
more content straight to your inbox. And visit the [Regional
Events](/live#regional-events) section on web.dev/live to find an upcoming community
event in your timezone!

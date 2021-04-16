---
title: "Lighthouse evolution: continuous integration, new performance score formula, and more"
subhead: |
  Get the latest Lighthouse updates and insights from Chrome Developer Summit 2019.
authors:
  - egsweeny
date: 2019-12-16
description: |
  Read about the latest Lighthouse updates announced at Chrome Developer Summit 2019.
hero: image/admin/mQ77SlZ6Y8ailMClzaCs.svg
alt: Lighthouse logo.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

In the [Speed Tooling Evolutions](https://youtu.be/iaWLXf1FgI0) talk at Chrome
Developer Summit (CDS), Paul Irish and I presented the newest products and
features coming from Google that can help you build and maintain an exceptionally fast experience for all your users. At the center of that story
are additions to the [Lighthouse](https://developers.google.com/web/tools/lighthouse) family of performance monitoring tools.

## Lighthouse CI alpha release

The Lighthouse team has launched the alpha version of [Lighthouse
CI](https://github.com/GoogleChrome/lighthouse-ci) the new continuous
integration product that enables you to run Lighthouse on every commit before
pushing to production. Lighthouse CI runs Lighthouse multiple times, asserts
static audit or metric thresholds, and then uploads Lighthouse reports to a
server for visual diffing and basic category score history. Existing
[budgets.json configurations](/use-lighthouse-for-performance-budgets) work
seamlessly alongside the new expressive syntax for asserting *any* Lighthouse
audit or category result.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xvyxLU5J0bap6s0LdrD3.png", alt="Lighthouse CI report.", width="400", height="356", class="w-screenshot" %}
</figure>

Lighthouse CI supports [Travis CI](https://travis-ci.com/), [Circle
CI](https://circleci.com/), and [GitHub
Actions](https://github.com/features/actions) out-of-the-box and any Ubuntu or
container-based CI service with some configuration. You can install the
Lighthouse CI server on-premise or use a [docker image for instant
setup](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/recipes/docker-server/README.md).
Free, public, temporary Lighthouse report storage is available as an alternative
to get started right away.

## Coming soon: Performance score updates

Changes are coming to the Lighthouse Performance score version 6! In version 5
(as of November 2019), Lighthouse has five metrics that are [weighted and
blended](/performance-scoring/#weightings) to form the 0-100 Performance score:
[First Contentful Paint](/fcp/), [Speed Index](/speed-index/), [First Meaningful
Paint](/first-meaningful-paint/), [Time to Interactive](/interactive/), and
[First CPU Idle](/first-cpu-idle/).

<figure class="w-figure">
  {% Img src="image/admin/X0u1YQC63JaPfE0DWgz8.png", alt="Comparison of Lighthouse performance score formulas in versions 5 and 6.", width="800", height="211", class="w-screenshot" %}
</figure>

See [Lighthouse performance scoring](/performance-scoring/) for detailed
information.

In Lighthouse version 6, new metrics, [Largest Contentful Paint (LCP)](/lcp/)
and [Total Blocking Time (TBT)](/tbt/), are replacing First CPU Idle (FCI) and
First Meaningful Paint (FMP). The weights of each of the five metrics will be
adjusted to better balance different phases of load and interactivity measures.

{% Aside %} [Cumulative Layout Shift (CLS)](/cls/) is another new metric that's
still being finessed and should become a part of the Lighthouse Performance
score eventually. {% endAside %}

The Lighthouse team is still working to ensure that all scoring curves are
fine-tuned, and the metrics are mature and thoroughly tested. They aim to ship
the Lighthouse v6 Performance score in January 2020.

{% Aside %}
Performance engineers sometimes find speed tools results difficult
to reproduce due to two discrete challenges--variability and cross-environment
inconsistency. Variability is the issue of seeing numbers change even when the
testing environment remains the same. Cross-environment inconsistency is the
issue of getting different results when running tests on the same page, but in
differing environments (for example, DevTools and PageSpeed Insights). While the
Lighthouse team is working on ways to mitigate variability, it's helpful to
understand [sources of
variability](https://developers.google.com/web/tools/lighthouse/variability#sources_of_variability)
and [how you can deal with
it](https://developers.google.com/web/tools/lighthouse/variability#strategies_for_dealing_with_variance).
The Lighthouse team is also investigating calibration methods to reduce
differences between environments, but it's fair to expect that different
conditions and hardware lead to different measurements—at least for now.
{% endAside %}

## Lighthouse Stack Packs

Lighthouse can automatically detect if sites use a framework or a [content
management system
(CMS)](https://en.wikipedia.org/wiki/Content_management_system) and include
stack-specific advice in the report. [Stack
Packs](https://github.com/GoogleChrome/lighthouse-stack-packs) add customized
recommendations, curated by community experts (like you!), on top of Lighthouse
report core audits.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qdhyyYLFj0avPPHgx8in.png", alt="Lighthouse report recommendation for deferring offscreen images in React applications.", width="800", height="194", class="w-screenshot" %}
</figure>

At the moment, there are Stack Packs for Angular, WordPress, Magento, React, and
AMP. To create your own Stack Pack, visit the [GitHub
repo](https://github.com/GoogleChrome/lighthouse-stack-packs/blob/master/CONTRIBUTING.md)
or [contact the Lighthouse team](https://github.com/GoogleChrome/lighthouse-stack-packs/issues).

## Coming soon: Lighthouse plugins as Chrome Extensions

<figure class="w-figure">
  {% Img src="image/admin/pPFz27fWWNVyT42ptr7a.png", alt="Lighthouse plugin icon.", width="250", height="220" %}
</figure>

[Lighthouse
Plugins](https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md)
are another way you can take advantage of Lighthouse's extensibility. There
are a lot of quality checks that Lighthouse core audits currently don't cover,
either because they are only applicable to a subset of developers or because the
team hasn't had the bandwidth to create the audits yet.

Lighthouse plugins allow community experts to implement a new set of checks that
Lighthouse can run and add to the report as a new category. Right now, plugins
only work in [Lighthouse
CLI](https://developers.google.com/web/tools/lighthouse#cli), but the goal is to
enable running them in the DevTools **Audits** panel too.

<figure class="w-figure">
  {% Img src="image/admin/I6WOZkh3Wdbb6vk2sE4z.png", alt="Chrome DevTools Audits panel with options for running Lighthouse plugins for Google Publisher Ads and User Experience.", width="400", height="753", class="w-screenshot" %}
  <figcaption class="w-figcaption">Community Plugins in DevTools Audits panel (beta)</figcaption>
</figure>

When users install Lighthouse plugin extensions from the [Chrome Web
Store](https://chrome.google.com/webstore/category/extensions), DevTools will
identify installed plugins and offer them as an option in the **Audits** panel.
The Lighthouse team will be building the support for the plugin approach in the
coming months, so stay tuned. In the meantime, you can create a plugin today as
a node module and make it accessible to all Lighthouse users via the CLI!

## Learn more

For more details about Lighthouse and other performance tooling updates from
CDS 2019, watch the Speed tooling evolutions talk:

{% YouTube 'iaWLXf1FgI0' %}

Your feedback is invaluable in making Lighthouse better, so go on and try out
[Lighthouse CI](http://bit.ly/lhci), write a [Stack
Pack](http://bit.ly/lh-stackpacks), or create a [Lighthouse
Plugin](http://bit.ly/lh-plugins) and [let us
know](https://github.com/GoogleChrome/lighthouse/issues) what you think.

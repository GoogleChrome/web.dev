---
layout: post
title: Minimize critical request depth
description: |
  Learn what critical request chains are, how they affect web page performance,
  and how you can reduce the effect.
date: 2019-05-02
updated: 2019-12-17
web_lighthouse:
  - critical-request-chains
---

[Critical request chains](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)
are series of dependent network requests important for page rendering.
The greater the length of the chains and the larger the download sizes,
the more significant the impact on page load performance.

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
reports critical requests loaded with a high priority:

<figure class="w-figure">
  <img class="w-screenshot" src="critical-request-chains.png" alt="A screenshot of the Lighthouse Minimize critical request depth audit">
</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}


## How Lighthouse identifies critical request chains

Lighthouse uses network priority as a proxy for identifying render-blocking critical resources.
See Google's [Chrome Resource Priorities and Scheduling](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit)
for more information about how Chrome defines these priorities.

Data on critical request chains, resource sizes,
and time spent downloading resources is extracted from the
[Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol).

## How to reduce the effect of critical request chains on performance

Use the critical request chains audit results to target the resources that have the biggest effect on page load first:

- Minimize the number of critical resources: eliminate them, defer their download, mark them as `async`, and so on.
- Optimize the number of critical bytes to reduce the download time (number of round trips).
- Optimize the order in which the remaining critical resources are loaded: download all critical assets as early as possible to shorten the critical path length.

Learn more about optimizing your
[images](/use-imagemin-to-compress-images),
[JavaScript](/apply-instant-loading-with-prpl),
[CSS](/defer-non-critical-css), and
[web fonts](/avoid-invisible-text).

## Resources

[Source code for **Minimize critical request depth** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)

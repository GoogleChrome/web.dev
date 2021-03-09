---
layout: post
title: Identify slow third-party JavaScript
subhead: Supercharge your performance detective skills with Lighthouse and Chrome DevTools.
authors:
  - mihajlija
date: 2019-08-14
# Add an updated date to your post if you edit in the future.
# updated: 2020-04-29
hero: image/admin/8ZJRM6xxTNs8wBPph7ZO.jpg
alt: Inspecting a laptop with a magnifying glass.
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
description: |
  Learn how to use Lighthouse and Chrome DevTools to identify slow third-party resources.
tags:
  - performance
---

As a developer, you often don't have control over [which third-party scripts](/third-party-javascript/#network) your site loads. Before you can optimize third-party content you have to do some detective work to find out what's making your site slow. 🕵️

In this post, you'll learn how to use [Lighthouse](https://developers.google.com/web/tools/lighthouse/) and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) to identify slow third-party resources. The post walks through increasingly robust techniques which are best used in combination.

## If you only have 5 minutes

The Lighthouse [Performance audit](/lighthouse-performance) helps you discover opportunities to speed up page loads. Slow third-party scripts are likely to appear in the **Diagnostics** section under the **Reduce JavaScript execution time** and **Avoid enormous network payloads** audits.

To run an audit:

{% Instruction 'devtools-lighthouse', 'ol' %}
1. Click **Mobile**.
1. Select the **Performance** checkbox. (You can clear the rest of the checkboxes in the Audits section.)
1. Click **Simulated Fast 3G, 4x CPU Slowdown**.
1. Select the **Clear Storage** checkbox.
1. Click **Run audits**.

{% Img src="image/admin/XLNFxdEOc7739bcIwERq.png", alt="Screenshot of the Chrome DevTools Audits panel.", width="800", height="1068" %}

### Third-party usage

The Lighthouse **Third-party usage** audit shows a list of the third-party providers a page uses. This overview can help you better understand the big picture and identify redundant third-party code. The audit is available in the [Lighthouse extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en) and will soon be added to DevTools in Chrome 77.

<figure class="w-figure">
  {% Img src="image/admin/4JXHK0FkgJIfKED16BnF.png", alt="Screenshot showing that 51 third-parties were found and a list of imaginary startups.", width="728", height="646", class="w-screenshot" %}
  <figcaption class="w-figcaption">
  Third-party provider names generated with <a href="http://tiffzhang.com/startup/?s=641553836036">Startup generator</a>. Any similarity to actual startups, living or dead, is purely coincidental.
  </figcaption>
</figure>

### Reduce JavaScript execution time
The Lighthouse [Reduce JavaScript execution time](/bootup-time) audit highlights scripts that take a long time to parse, compile, or evaluate. Select the **Show 3rd-party resources** checkbox to discover CPU-intensive third-party scripts.

{% Img src="image/admin/O7vN1En6dtbL3Q8TbufC.png", alt="Screenshot showing that the 'Show third-party resources' checkbox is checked.", width="800", height="981", class="w-screenshot" %}

### Avoid enormous network payloads
The Lighthouse [Avoid enormous network payloads](/total-byte-weight) audit identifies network requests—including those from third-parties—that may slow down page load time. The audit fails when your network payload exceeds 4,000 KB.

{% Img src="image/admin/9Pnoz73MLeNzooUQLuam.png", alt="Screenshot of the Chrome DevTools 'Avoid enormous network payloads' audit.", width="799", height="631", class="w-screenshot" %}

## Block network requests in Chrome DevTools

Chrome DevTools [network request blocking](https://developers.google.com/web/updates/2017/04/devtools-release-notes#block-requests) allows you to see how your page behaves when a particular script, stylesheet, or other resource isn't available. After you identify third-party scripts that you suspect affect performance, measure how your load time changes by blocking the requests to those scripts.

To enable request blocking:
{% Instruction 'devtools-network', 'ol' %}
1. Right-click any request in the **Network** panel.
1. Select **Block request URL**.

{% Img src="image/admin/UbedvjrtP9si1l0X2QVA.png", alt="A screenshot of the context menu in the Chrome DevTools Performance panel. The 'Block request URL' option is highlighted.", width="800", height="529", class="w-screenshot" %}

A **Request blocking** tab will appear in the DevTools drawer. You can manage which requests have been blocked there.

To measure the impact of third-party scripts:
1. Measure how long your page takes to load using the **Network** panel. To emulate real-world conditions, turn on [network throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/#emulate) and [CPU throttling](https://developers.google.com/web/updates/2017/07/devtools-release-notes#throttling). (On faster connections and desktop hardware, the impact of expensive scripts may not be as representative as it would be on a mobile phone.)
1. Block the URLs or domains responsible for third-party scripts you believe are an issue.
1. Reload the page and re-measure how long it takes to load without the blocked third-party scripts.

You should hopefully see a speed improvement, but occasionally blocking third-party scripts might not have the effect you expect. If that's the case, reduce the list of blocked URLs until you isolate the one that's causing slowness.

Note that doing three or more runs of measurement and looking at the median values will likely produce more stable results. As third-party content can occasionally pull in different resources per page load, this approach can give you a more realistic estimate. [DevTools now supports multiple recordings](https://twitter.com/ChromeDevTools/status/963820146388221952) in the **Performance** panel, making this a little easier.

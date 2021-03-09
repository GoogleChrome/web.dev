---
layout: post
title: How to measure speed?
authors:
  - bojanpavic
  - ansteychris
description: |
  Real-world performance is highly variable due to differences in users'
  devices, network connections, and other factors. In this post we explore
  tools that can help you collect lab or field data to assess page performance.
web_lighthouse: N/A
date: 2019-05-01
tags:
  - performance
---

Real-world performance is highly variable due to differences in users' devices, network connections, and other factors. For example, if you load your website using a cable network connection in your office and compare it against the load using WiFi in a coffee shop, the experiences are likely to be very different. There are many tools on the market that can help you collect lab or field data to assess page performance.

## Lab data vs Field data

{% Img src="image/admin/6OMEfvIKRuDWWSiVDto4.png", alt="Speed tools graphics", width="800", height="232" %}

**Lab data** is performance data collected within a controlled environment with predefined device and network settings, while **Field data** is performance data collected from real page loads experienced by your users in the wild. Each type has its own strengths and limitations.

**Lab data** offers reproducible results and a debugging environment, but might not capture real-world bottlenecks and cannot correlate against real-world page KPIs. With lab data, you need to understand your users' typical devices and networks and appropriately mirror those conditions when you test performance. Have in mind that even in areas with 4G, users may still experience slower or intermittent connections when in elevators, while commuting, or in comparable environments.

**Field data** (also called Real User Monitoring or RUM) captures true real-world user experience and enables correlation to business KPIs, but has a restricted set of metrics and limited debugging capabilities.


## Tools

### Lab data

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) takes a URL and runs a series of audits against the page, generating a report on how well the page did. There are multiple ways to run Lighthouse, including an option to easily audit a page from within Chrome DevTools.

### Field data

[Chrome User Experience Report (CrUX)](https://developers.google.com/web/tools/chrome-user-experience-report/) provides metrics showing how real-world Chrome users experience popular destinations on the web.

### Other tools

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) provides both lab and field data about a page. It uses Lighthouse to collect and analyze lab data about the page, while real-world field data is based on the Chrome User Experience Report dataset.

[Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools/) is a set of web developer tools built directly into the Google Chrome browser. It allows you to profile the runtime of a page, as well as identify and debug performance bottlenecks.

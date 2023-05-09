---
layout: post
title: Find slow interactions in the field
subhead: |
  Learn how to find slow interactions in your website's field data so you can find opportunities to improve its Interaction to Next Paint.
authors:
  - jlwagner
date: 2023-05-09
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/eS778yALdGSMtVQ5Z26E.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/F3pa3Lf9rntLDvO1T6KI.jpg
alt: A photo of a wide open golden field under a swift sunrise.
description: |
  Before you can reproduce slow interactions in the lab to optimize your website's Interaction to Next Paint, you'll need to lean on field data to find them. Learn how to do just that in this guide.
tags:
  - blog
  - performance
  - web-vitals
---

[Field data](/lab-and-field-data-differences/#field-data) is _the_ authoritative source when it comes to how actual users are experiencing your website. It teases out issues you may not see in [lab data](/lab-and-field-data-differences/#lab-data) alone. While interactions can be simulated in lab-based tools, you're not going to be able to reproduce every single interaction in the lab in the way that users in the field experience them. Gathering field data for [Interaction to Next Paint (INP)](/inp/) is critical to understanding how responsive your page is to real users, and it contains the clues to make their experience even better.

## What you should collect in the field and why

When collecting INP data in the field, you'll want to capture the following to give context to why interactions were slow:

- **The INP value.** This is the key piece of data you'll need to collect. The distribution of these values will determine whether the page meets [the INP thresholds](/inp/#what-is-a-good-inp-score).
- **The element selector string responsible for the page's INP.** Knowing a page's INP is good, but not good enough by itself. Without knowing what element was responsible for it, you'll be in the dark. By logging element selector strings, you’ll know exactly what elements are responsible for interactions.
- **The loading state of the page for the interaction that is the page's INP.** When a page is loading, it's reasonable to assume that there's more main thread activity occurring that could result in higher interaction latency. During page load, there's HTML parsing, stylesheet parsing, and JavaScript evaluation and execution going on. Knowing whether an interaction has taken place during page load or afterwards helps you to figure out if you need to optimize for faster startup so interactions have more room on the main thread to run quickly, or if the interaction responsible for the page's INP in itself is slow regardless.
- **The interaction's `startTime`.** Logging the interaction's [`startTime`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry/startTime) lets you know exactly when the interaction occurred on the performance timeline.
- **The event type.** The [event type](https://developer.mozilla.org/docs/Web/API/Event/type) is good to know, as it will tell you whether the interaction was the result of a `click`, `keypress`, or other eligible event type. A user interaction may contain multiple callbacks, and can help you to pinpoint exactly which event callback in the interaction took the longest to run.

While this all seems like a lot to take into account, you don't have to reinvent the wheel to get there. Thankfully, this data is exposed in the [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals), and you'll learn how to gather it in the next section.

## Measure interactions in the field with the `web-vitals` JavaScript library

The `web-vitals` JavaScript library is a great way to find slow interactions in the field, thanks in large part to its ability to provide [attribution](https://github.com/GoogleChrome/web-vitals#attribution-build) for what's causing them. INP can be collected in browsers that support the [Event Timing API](https://developer.mozilla.org/docs/Web/API/PerformanceEventTiming) and its [`interactionId` property](https://developer.mozilla.org/docs/Web/API/PerformanceEventTiming/interactionId).

{% BrowserCompat 'api.PerformanceEventTiming.interactionId' %}

Using a [Real User Monitoring (RUM)](https://en.wikipedia.org/wiki/Real_user_monitoring) provider to get INP is most convenient, but not always an option. If that's your case, for example, you can use the `web-vitals` JavaScript library to collect and transmit INP data to Google Analytics for later evaluation:

```js
// Be sure to import from the attribution build:
import {onINP} from 'web-vitals/attribution';

function sendToGoogleAnalytics ({name, value, id, attribution}) {
  // Destructure the attribution object:
  const {eventEntry, eventTarget, eventType, loadState} = attribution;

  // Get timings from the event timing entry:
  const {startTime, processingStart, processingEnd, duration, interactionId} = eventEntry;

  const eventParams = {
    // The page's INP value:
    metric_inp_value: value,
    // A unique ID for the page session, which is useful
    // for computing totals when you group by the ID.
    metric_id: id,
    // The event target (a CSS selector string pointing
    // to the element responsible for the interaction):
    metric_inp_event_target: eventTarget,
    // The type of event that triggered the interaction:
    metric_inp_event_type: eventType,
    // Whether the page was loaded when the interaction
    // took place. Useful for identifying startup versus
    // post-load interactions:
    metric_inp_load_state: loadState,
    // The time (in milliseconds) after page load when
    // the interaction took place:
    metric_inp_start_time: startTime,
    // When processing of the event callbacks in the
    // interaction started to run:
    metric_inp_processing_start: processingStart,
    // When processing of the event callbacks in the
    // interaction finished:
    metric_inp_processing_end: processingEnd,
    // The total duration of the interaction. Note: this
    // value is rounded to 8 milliseconds of granularity:
    metric_inp_duration: duration,
    // The interaction ID assigned to the interaction by
    // the Event Timing API. This could be useful in cases
    // where you might want to aggregate related events:
    metric_inp_interaction_id: interactionId
  };

  // Send to Google Analytics
  gtag('event', name, eventParams);
}

// Pass the reporting function to the web-vitals INP reporter:
onINP(sendToGoogleAnalytics);
```

{% Aside 'important' %}
Where element attribution is concerned, not every interaction can be attributed to a specific element. This is due to a limitation of the underlying [Event Timing API](https://developer.mozilla.org/docs/Web/API/PerformanceEventTiming), which is used to calculate the page's INP. In this API, [the event target](https://developer.mozilla.org/docs/Web/API/Event/target) may be absent if the element responsible for the interaction was disconnected from the DOM, or if the element was in the [shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM).
{% endAside %}

If you have Google Analytics and run the preceding code on your website, you'll get a detailed reporting of not just the page's INP, but also useful contextual information that can give you a better sense of where to begin optimizing slow interactions.

### Monitor full session duration, not just up to `onload`

Using the `web-vitals` JavaScript library, as previously mentioned, may result in multiple analytics events being sent to Google Analytics. This is fine, as the ID `web-vitals` generates for the current page will stay the same, and Google Analytics will allow you to overwrite previous data.

However, not all RUM providers operate this way, so if you're building your own RUM collection solution, you'll need to take this into account. If your current analytics provider won't allow overwrites of existing records, you'll need to record all the `delta` values—that is, the difference between a metric's past and current states— for a metric and transmit them using the same ID provided by the `web-vitals` library;  then you can sum those changes by grouping on the ID. For more more information, consult the `web-vitals` documentation's [section on handling deltas](https://github.com/GoogleChrome/web-vitals#report-only-the-delta-of-changes).

## Get field data quickly with CrUX

The [Chrome UX Report (CrUX)](https://developer.chrome.com/docs/crux/) is the official dataset of the Web Vitals program. While data from CrUX alone doesn't give you all the information you need to troubleshoot specific INP issues, it does let you know whether you have a problem in the first place. Even if you're already collecting field data through a RUM provider, consider contrasting it with CrUX data for your website (if available), as there are [differences in the methodologies they use](/crux-and-rum-differences/).

You can evaluate your website's INP and view its CrUX data using [PageSpeed Insights (PSI)](https://pagespeed.web.dev/). PageSpeed Insights may provide page-level field data for websites that are included in the CrUX dataset. To audit a URL with PageSpeed Insights, go to [https://pagespeed.web.dev/](https://pagespeed.web.dev/), enter a URL to test, and click the **Analyze** button.

{% Aside 'important' %}
The URL you enter [may not be eligible for CrUX](​​https://developer.chrome.com/docs/crux/methodology/#eligibility). If this is the case, you'll need to collect your own field data, which is explained in the previous section. Also, where page-level data is not available for the given URL in PageSpeed Insights, the provided field data will be aggregated over the entire website.
{% endAside %}

Once the assessment begins, CrUX data will be available instantly as Lighthouse (a [lab tool](/lab-and-field-data-differences/#lab-data)) runs.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/JZjcvOGERDsYovSJVn7o.png", alt="A screenshot of INP field data in a distribution. The distribution aligns with the INP thresholds, and in this example, the field INP value is 545 milliseconds, which lands in the poor range.", width="800", height="161" %}
  <figcaption>The distribution of INP experiences as seen in PageSpeed Insights.</figcaption>
</figure>

When Lighthouse has finished running its assessment, PSI will populate the assessment with Lighthouse audits.

{% Aside 'important' %}
Because PageSpeed Insights is not scripted to interact with the page, there will be no audits relevant to INP. However, [Total Blocking Time (TBT)](/tbt/) is [highly correlated with INP](https://almanac.httparchive.org/en/2022/performance#inp-and-tbt). Therefore, you can filter audits by TBT to find opportunities to reduce the amount of time a page blocks the main thread during the test.
{% endAside %}

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Ra3g6IEXkYsgMhpQsjEV.png", alt="A screenshot of Lighthouse audits as seen in PageSpeed Insights. The audits are filtered by the TBT metric, showing tips for minimizing main thread work, avoiding an excessive DOM size, and avoiding long main thread tasks.", width="800", height="346" %}
  <figcaption>Audits for Total Blocking Time</figcaption>
</figure>

## What if I don't have field data?

You might be in a situation where you don't have or can’t even collect field data. If this describes your situation, then you'll be entirely dependent on lab tools in order to find slow interactions. For more information on lab testing, read [How to diagnose what's causing poor INP in the lab](/diagnose-slow-interactions-in-the-lab/).

## Conclusion

Field data is the best source of information you can draw on when it comes to understanding which interactions are problematic for actual users in the field. By drawing on information available in PageSpeed Insights, or relying on field data collection tools such as the `web-vitals` JavaScript library (or your RUM provider), you can be more confident about which interactions are most problematic, and then move on to [reproducing problematic interactions in the lab](/diagnose-slow-interactions-in-the-lab/) and then go about fixing them.

_Hero image from [Unsplash](https://unsplash.com/), by [Federico Respini](https://unsplash.com/@federicorespini)._

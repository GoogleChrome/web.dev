---
layout: post
title: How prefetching helped Terra increase ads click-through rate by 30% and speed up Largest Contentful Paint.
subhead: |
  Prefetching resources speeds up page load times and improves business metrics.
description: |
  Prefetching is a technique used to speed up page loading by downloading resources—or even entire pages—which are likely to be needed in the near future. Research has shown that faster load times result in higher conversion rates and better user experiences.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/v2HlksdTOBRKk77JtixN.png
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/SSNjeq1z2euzy4ar5QfN.png
alt: The Terra logo, set on a white backdrop.
authors:
  - guilhermems
  - thiernothiam
date: 2023-08-31
tags:
  - blog
  - performance
  - case-study
---

Prefetching is a technique used to speed up page loading by downloading resources—or even entire pages—which are likely to be needed in the near future. Research has shown that [faster load times result in higher conversion rates](https://wpostats.com/) and better user experiences.

[Terra](https://www.terra.com/) is one of the largest content portals from Brazil, offering entertainment, news, and sports with more than 63 million unique visitors per month. We’ve collaborated with Terra’s engineering team to improve the loading time of articles by using prefetching techniques on certain sections of their website.

This case study describes Terra’s journey implementation which resulted in a 11% ads click-through rate (CTR) increase on mobile, 30% ads CTR on desktop, and 50% reduction in the [Largest Contentful Paint (LCP)](/lcp/) times.

## Prefetching strategy 

Prefetching has been around for a while, but it is important to use it carefully as it consumes extra bandwidth for resources that are not immediately necessary. This technique should be applied thoughtfully to avoid unnecessary data usage. In the case of Terra, articles are prefetched if the following conditions are met:

- **Visibility of links to prefetched articles:** Terra used the [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) to detect viewability of the section containing the articles that they wanted to prefetch.
- **Favorable conditions for increased data usage:** As mentioned previously, prefetching is a speculative performance improvement that consumes extra data, and that may not be a desirable outcome in every situation. To reduce the likelihood of wasting bandwidth, Terra uses the [Network Information API](https://wicg.github.io/netinfo/) along with the [Device Memory API](https://developer.chrome.com/blog/device-memory/) to determine whether to fetch the next article. Terra only fetches the next article when:
  - The connection speed is at least 3G and the device has at least 4GB of memory,
  - or if the device is running iOS.
- **CPU idle:** Finally, Terra checks if the CPU is idle and able to perform extra work by using [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback), which takes a callback to be processed when the main thread is idle, or by a specific (optional) deadline—whichever comes first.

Adhering to these conditions ensures that Terra only fetches data when necessary, which saves bandwidth and battery life, and minimizes the impact of prefetches that end up going unused.

When these conditions are met, Terra prefetches the articles present in the sections: "Related Content" and "Recommended for you" highlighted in blue below.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Z5yUqXEgRMMMUqXtYCw1.png", alt="A screenshot of the two sections on the Terra website in which links were prefetched. At left, the 'Related content' section is highlighted, whereas on the right, the 'Recommended for you' section is highlighted.", width="800", height="494" %}
</figure>

## Business Impact

In order to measure the impact of this technique, Terra first launched this feature in the "Related content" section of the article page. A UTM code helped them to differentiate between prefetched and non-prefetched articles for comparison purposes. After two weeks of successful A/B testing, Terra decided to add the prefetching functionality to the "Recommended for you" section.

As a result of prefetching articles, an overall increase of ads metrics and a reduction of LCP and [Time to First Byte (TTFB)](/ttfb/) times were observed:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Metric</th>
        <th>Mobile</th>
        <th>Desktop</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ads CTR</td>
        <td>+11%</td>
        <td>+30%</td>
      </tr>
      <tr>
        <td>Ads viewability</td>
        <td>+10.5%</td>
        <td>+6%</td>
      </tr>
      <tr>
        <td>LCP</td>
        <td>-51%</td>
        <td>-73%</td>
      </tr>
      <tr>
        <td>TTFB</td>
        <td>-83%</td>
        <td>-84%</td>
      </tr>
    </tbody>
  </table>
</div>

Prefetching—when used with care—greatly improves page load time, increases ads metrics, and reduces LCP time.

## Technical details

Prefetching can be achieved through the use of resource hints such as [`rel=prefetch`](https://developer.mozilla.org/docs/Glossary/Prefetch) or [`rel=preload`](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preload) via libraries such as [quicklink](https://github.com/GoogleChromeLabs/quicklink) or [Guess.js](https://github.com/guess-js), or the newer Speculation Rules API. Terra has chosen to implement this by using the [fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API) with a [low priority](https://developer.mozilla.org/docs/Web/API/fetch#:~:text=priority) in combination with an Intersection Observer instance. Terra made this choice as it allows them to support Safari, which doesn't yet support other prefetching methods like `rel=prefetch` or the Speculation Rules API, and a full-featured JavaScript library wasn't necessary for Terra's needs.

```js
function prefetch(nodeLists, minConnectionType = "3g") {
  if (nodeLists.length === 0) {
    console.error("prefetchURL: nodeList must contain at least one node to prefetch");

    return;
  }

  const connDictionary = {
    'slow-2g': 0,
    '2g': 1,
    '3g': 2,
    '4g': 3
  };

  if (navigator.connection && navigator.connection.effectiveType) {
    if (connDictionary[minConnectionType] === undefined) {
      console.error('prefetchURL: select a valid type of minConnectionType');

      return;
    } else if (connDictionary[minConnectionType] > connDictionary[navigator.connection.effectiveType]) {
      console.error('prefetchURL: network conditions are too poor for the use of prefetch');

      return;
    }

    // Exclude low end device which is device with memory <= 2GB
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
      console.error("prefetchURL: device memory is insufficient");

      return;
    }
  }

  const fetchLinkList = {};

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!fetchLinkList[entry.target.href]) {
          fetchLinkList[entry.target.href] = true;

          fetch(entry.target, {
            priority: 'low'
          });
        }
        
        observer.unobserve(entry = entry.target);
      }
    });
  });
}

const idleCallback = window.requestIdleCallback || function (cb) {
  let start = Date.now();

  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
}

idleCallback(function () {
  prefetch(nodeLists, minConnectionType)
})
```

- The `prefetch` function first checks for a minimum connection quality and device memory before initiating prefetching.
- Then it uses an `IntersectionObserver` to monitor when elements become visible in the viewport, and subsequently adds URLs to a list for prefetching.
- The prefetch process is scheduled with `requestIdleCallback`, aiming to execute the `prefetch` function when the main thread is idle.

Conclusion
When used with care, prefetching can significantly reduce load times for future navigation requests, thereby reducing friction in the user journey and increasing engagement. Various implementation techniques already exist, however, prefetching results in loading of extra bytes that may not be used, so it should only be used when necessary—ideally in good network conditions, and on capable devices.

_Special thanks to Gilberto Cocchi, Harry Theodoulou, Miguel Carlos Martínez Díaz, Barry Pollard, Jeremy Wagner and the Terra's Engineering team for their contribution to this work._

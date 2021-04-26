---
title: Monitor your web page's total memory usage with `measureUserAgentSpecificMemory()`
subhead: >
  Learn how to measure memory usage of your web page in production to detect regressions.
description: >
  Learn how to measure memory usage of your web page in production to detect regressions.
updated: 2020-10-19
date: 2020-04-13
authors:
  - ulan
hero: image/admin/Ne2U4cUtHG6bJ0YeIkt5.jpg
alt: >
  Green RAM stick. Photo by Harrison Broadbent on Unsplash.
origin_trial:
    url: https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113
tags:
  - blog
  - memory
  - javascript
feedback:
  - api
---

{% Banner 'caution', 'body' %}

**Updates**

**April 23rd, 2021**: Updated the status and clarified the scope of the API with a note about out-of-process iframes.

**January 20th, 2021**: `performance.measureMemory` is renamed to `performance.measureUserAgentSpecificMemory`
and enabled by default in Chrome 89 for [cross-origin isolated](/coop-coep) web pages.
The format of the result also [has changed](https://github.com/WICG/performance-measure-memory/blob/master/ORIGIN_TRIAL.md#result-differences)
slightly compared to the Origin Trial version.
{% endBanner %}

Browsers manage the memory of web pages automatically. Whenever a web page
creates an object, the browser allocates a chunk of memory "under the hood" to
store the object. Since memory is a finite resource, the browser performs
garbage collection to detect when an object is no longer needed and to free
the underlying memory chunk. The detection is not perfect though, and it
[was proven][halting-problem] that perfect detection
is an impossible task. Therefore browsers approximate the notion of "an object
is needed" with the notion of "an object is reachable". If the web page cannot
reach an object via its variables and the fields of other reachable objects,
then the browser can safely reclaim the object. The difference between these
two notions leads to memory leaks as illustrated by the following example.

```javascript
const object = { a: new Array(1000), b: new Array(2000) };
setInterval(() => console.log(object.a), 1000);
```

Here the larger array `b` is no longer needed, but the browser does not
reclaim it because it is still reachable via `object.b` in the callback. Thus
the memory of the larger array is leaked.

Memory leaks are [prevalent on the Web][memory-leaks].
It is easy to introduce one by forgetting to unregister an event listener, by
accidentally capturing objects from an iframe, by not closing a worker, by
accumulating objects in arrays, and so on. If a web page has memory leaks,
then its memory usage grows over time and the web page appears slow and
bloated to the users.

The first step in solving this problem is measuring it. The new
[`performance.measureUserAgentSpecificMemory()` API][explainer] allows developers to
measure memory usage of their web pages in production and thus detect memory
leaks that slip through local testing.

## How is `performance.measureUserAgentSpecificMemory()` different from the legacy `performance.memory` API? {: #legacy-api }

If you are familiar with the existing non-standard `performance.memory` API,
you might be wondering how the new API differs from it. The main difference is
that the old API returns the size of the JavaScript heap whereas the new API
estimates the memory used by the web page. This difference becomes
important when Chrome shares the same heap with multiple web pages (or
multiple instances of the same web page). In such cases, the result of the old
API may be arbitrarily off. Since the old API is defined in
implementation-specific terms such as "heap", standardizing it is hopeless.

Another difference is that the new API performs memory measurement during
garbage collection. This reduces the noise in the results, but it may take a
while until the results are produced. Note that other browsers may decide to
implement the new API without relying on garbage collection.


## Suggested use cases {: #use-cases }

Memory usage of a web page depends on the timing of events, user actions, and
garbage collections. That is why the memory measurement API is intended for
aggregating memory usage data from production. The results of individual calls
are less useful. Example use cases:

* Regression detection during rollout of a new version of the web page to catch new memory leaks.
* A/B testing a new feature to evaluate its memory impact and detect memory leaks.
* Correlating memory usage with session duration to verify presence or absence of memory leaks.
* Correlating memory usage with user metrics to understand the overall impact of memory usage.

## Browser compatibility {: #compatibility }

Currently the API is supported only in Chrome 83 as an origin trial. The
result of the API is highly implementation-dependent because browsers have
different ways of representing objects in memory and different ways of
estimating the memory usage. Browsers may exclude some memory regions from
accounting if proper accounting is too expensive or infeasible. Thus, results
cannot be compared across browsers. It is only meaningful to compare the
results for the same browser.

## Current status {: #status }

<div class="w-table-wrapper">
<table>
    <thead>
      <tr>
        <th>Step</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1. Create explainer</td>
        <td><a href="https://github.com/WICG/performance-measure-memory">Complete</a></td>
      </tr>
      <tr>
        <td>2. Create initial draft of specification</td>
        <td><a href="https://wicg.github.io/performance-measure-memory/">Complete</a></td>
      </tr>
      <tr>
        <td>3. Gather feedback and iterate design</td>
        <td><a href="#feedback">In Progress</a></td>
      </tr>
      <tr>
        <td>4. Origin trial </td>
        <td><a href="https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113">Complete</a></td>
      </tr>
      <tr>
        <td>5. Launch</td>
        <td>Enabled by default in Chrome 89</td>
      </tr>
    </tbody>
</table>
</div>

## Using `performance.measureUserAgentSpecificMemory()` {: use }

### Enabling via chrome://flags

To experiment with `performance.measureUserAgentSpecificMemory()` without an origin trial
token, enable the `#experimental-web-platform-features` flag in `chrome://flags`.

### Enabling support during the origin trial phase

The `performance.measureUserAgentSpecificMemory()` API is available as an origin trial starting in
Chrome 83. The origin trial is expected to end in Chrome 86, in early November 2020.

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Feature detection

The `performance.measureUserAgentSpecificMemory()` function may fail with a
[SecurityError][security-error] if the execution environment does not fulfil
the security requirements for preventing cross-origin information leaks.
During the origin trial in Chrome, the API requires that [Site
Isolation][site-isolation] is enabled. When the API ships, it will rely on
[cross-origin isolation][cross-origin-isolation]. A web page can opt-in to
cross-origin isolation by setting [COOP+COEP headers][coop-coep].

```javascript
if (performance.measureUserAgentSpecificMemory) {
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException &&
        error.name === "SecurityError") {
      console.log("The context is not secure.");
    } else {
      throw error;
    }
  }
  console.log(result);
}
```

### Local testing

Chrome performs the memory measurement during garbage collection. This means
that the API does not resolve the result promise immediately and instead waits
for the next garbage collection. The API forces a garbage collection after
some timeout, which is currently set to 20 seconds. Starting Chrome with the
`--enable-blink-features='ForceEagerMeasureMemory'` command-line flag reduces
the timeout to zero and is useful for local debugging and testing.

## Example

The recommended usage of the API is to define a global memory monitor that
samples memory usage of the whole web page and sends the results to a server
for aggregation and analysis. The simplest way is to sample periodically, for
example every `M` minutes. That however introduces bias to data because the
memory peaks may occur between the samples. The following example shows how to
do unbiased memory measurements using a [Poisson process][poisson], which
guarantees that samples are equally likely to occur at any point in time
([demo][demo], [source][demo-source]).

First, define a function that schedules the next memory measurement using
`setTimeout()` with a randomized interval. The function should be called after
page load on the main window.

```javascript
function scheduleMeasurement() {
  if (!performance.measureUserAgentSpecificMemory) {
    console.log("performance.measureUserAgentSpecificMemory() is not available.");
    return;
  }
  const interval = measurementInterval();
  console.log("Scheduling memory measurement in " +
      Math.round(interval / 1000) + " seconds.");
  setTimeout(performMeasurement, interval);
}

// Start measurements after page load on the main window.
window.onload = function () {
  scheduleMeasurement();
}
```

The `measurementInterval()` function computes a random interval in milliseconds
such that on average there is one measurement every five minutes. See [Exponential
distribution][math] if you are interested in the math behind the function.

```javascript
function measurementInterval() {
  const MEAN_INTERVAL_IN_MS = 5 * 60 * 1000;
  return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS;
}
```

Finally, the async `performMeasurement()` function invokes the API, records
the result, and schedules the next measurement.

```javascript
async function performMeasurement() {
  // 1. Invoke performance.measureUserAgentSpecificMemory().
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException &&
        error.name === "SecurityError") {
      console.log("The context is not secure.");
      return;
    }
    // Rethrow other errors.
    throw error;
  }
  // 2. Record the result.
  console.log("Memory usage:", result);
  // 3. Schedule the next measurement.
  scheduleMeasurement();
}
```

The result may look as follows:
```javascript
// Console output:
{
  bytes: 60_000_000,
  breakdown: [
    {
      bytes: 40_000_000,
      attribution: [
        {
          url: "https://foo.com",
          scope: "Window",
        },
      ]
      types: ["JS"]
    },
    {
      bytes: 0,
      attribution: [],
      types: []
    },
    {
      bytes: 20_000_000,
      attribution: [
        {
          url: "https://foo.com/iframe",
          container: {
            id: "iframe-id-attribute",
            src: "redirect.html?target=iframe.html",
          },
        },
      ],
      types: ["JS"]
    },
  ]
}
```

The total memory usage estimate is returned in the `bytes` field. The value of
bytes is using [numeric separator syntax][numeric-separators]. This value is
highly implementation-dependent and cannot be compared across browsers. It may
even change between different versions of the same browser. During the origin
trial the value includes JavaScript memory usage of the main window and all
**same-site** iframes and related windows. When the API ships, the value will
account for JavaScript and DOM memory of all iframes, related windows, and web
workers in the current process. Note that the API does not measure the memory
of cross-site [out-of-process iframes](https://www.chromium.org/developers/design-documents/oop-iframes)
when [Site Isolation](https://www.chromium.org/Home/chromium-security/site-isolation) is enabled.

The `breakdown` list provides further information about the used memory. Each
entry describes some portion of the memory and attributes it to a set of
windows, iframes, and workers identified by URLs. The `types` field lists
the implementation-specific memory types associated with the memory.

It is important to treat all lists in a generic way and to not hardcode
assumptions based on a particular browser. For example, some browsers may
return an empty `breakdown` or an empty `attribution`. Other browsers may
return multiple entries in `attribution` indicating they could not distinguish
which of these entries owns the memory.

## Feedback {: #feedback }

The [Web Performance Community Group][webperfs] and the Chrome team would love
to hear about your thoughts and experiences with
`performance.measureUserAgentSpecificMemory()`.

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or are there
missing properties that you need to implement your idea? File a spec issue on
the [performance.measureUserAgentSpecificMemory() GitHub repo][issues] or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec? File a bug at [new.crbug.com][new-bug]. Be sure to
include as much detail as you can, provide simple instructions for reproducing
the bug, and have **Components** set to `Blink>PerformanceAPIs`.
[Glitch][glitch] works great for sharing quick and easy repros.

### Show support

Are you planning to use `performance.measureUserAgentSpecificMemory()`? Your public support
helps the Chrome team prioritize features and shows other browser vendors how
critical it is to support them. Send a tweet to [@ChromiumDev](https://twitter.com/chromiumdev) and let us know
where and how you're using it.

## Helpful links {: #helpful }

* [Explainer][explainer]
* [Demo][demo] | [Demo source][demo-source]
* [Origin Trial][ot]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]

## Acknowledgements
Big thanks to Domenic Denicola, Yoav Weiss, Mathias Bynens for API design reviews,
and Dominik Inführ, Hannes Payer, Kentaro Hara, Michael Lippautz for code reviews
in Chrome. I also thank Per Parker, Philipp Weis, Olga Belomestnykh, Matthew
Bolohan, and Neil Mckay for providing valuable user feedback that greatly
improved the API.

[Hero image](https://unsplash.com/photos/5tLfQGURzHM) by [Harrison Broadbent](https://unsplash.com/@harrisonbroadbent) on [Unsplash](https://unsplash.com)

[coop-coep]: https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=1049093
[cr-dev-twitter]: https://twitter.com/chromiumdev
[cr-status]: https://www.chromestatus.com/feature/5685965186138112
[cross-origin-isolation]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated
[demo-source]: https://glitch.com/edit/#!/performance-measure-memory?path=script.js:1:0
[demo]: https://performance-measure-memory.glitch.me/
[explainer]: https://github.com/WICG/performance-measure-memory
[glitch]: https://glitch.com/
[halting-problem]: https://en.wikipedia.org/wiki/Halting_problem
[issues]: https://github.com/WICG/performance-measure-memory/issues
[math]: https://en.wikipedia.org/wiki/Exponential_distribution#Computational_methods
[memory-leaks]: https://docs.google.com/presentation/d/14uV5jrJ0aPs0Hd0Ehu3JPV8IBGc3U8gU6daLAqj6NrM/edit#slide=id.p
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EPerformanceAPIs
[numeric-separators]: https://v8.dev/features/numeric-separators
[ot]: https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113
[poisson]: https://en.wikipedia.org/wiki/Poisson_point_process
[security-error]: https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-SecurityError
[site-isolation]: https://developers.google.com/web/updates/2018/07/site-isolation
[webperfs]: https://www.w3.org/community/webperfs/

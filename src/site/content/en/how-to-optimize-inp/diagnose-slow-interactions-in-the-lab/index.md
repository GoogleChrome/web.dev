---
layout: post
title: Diagnose slow interactions in the lab
subhead: |
  Learn how to take your field data into the lab to reproduce and identify the causes behind slow interactions.
authors:
  - jlwagner
date: 2023-05-09
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/D4fgU9geyo1xm2vd9q4J.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/qgattSatrRyStFVkwakj.jpg
alt: A photo of a dropper placing a purple liquid into various collection tubes.
description: |
  You've looked through your field data and you have some slow interactions on your hands. Now to learn more about testing those interactions, and identifying the causes behind them.
tags:
  - blog
  - performance
  - web-vitals
---

One challenging aspect of optimizing [Interaction to Next Paint (INP)](/inp/) is figuring out what's causing poor INP. There's a large variety of potential causes: third-party scripts that schedule many tasks on the main thread, large [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model) sizes, expensive event callbacks, and so on.

Finding ways to fix poor INP can be difficult. To start, you have to know which interactions tend to be responsible for a page's INP. If you don't know this already, start by reading [Find slow interactions in the field](/find-slow-interactions-in-the-field/). Once you have that field data and know what interactions to test, you can do so in lab tools to work out why those interactions are slow.

## What if you don't have field data?

Ideally, you'll want field data, as it saves you a lot of time trying to figure out which interactions need to be optimized. You might be in a position where you don't have field data, though. If that's your situation, you can still find interactions to improve: you'll just have to take a different approach.

[Total Blocking Time (TBT)](/tbt/) is a metric that assesses page responsiveness during load. [It correlates very well with INP](https://almanac.httparchive.org/en/2022/performance#inp-and-tbt), and can give you an idea if there might be interactions you can profile while the page is loading.

You can use either [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) or [PageSpeed Insights](https://pagespeed.web.dev/) to measure your page's TBT. If your TBT is either poor or needs improvement, there's a good chance there are interactions that might be slow during page load.

To find slow interactions after the page has loaded, you might need to rely on other types of data, such as common user flows that you may already have in your website's analytics. If you work on an ecommerce website, for example, a common user flow would be the actions users take when they're adding items to an online shopping cart or going through an online checkout.

Whether or not you have field data, the next step involves reproducing that interaction—because it's only when you're able to conclusively identify a slow interaction that you'll be able to fix it.

## Reproducing slow interactions in the lab

Once you've identified a slow interaction, the next step is to test it in the lab to see if it's reliably slow.

### Don't reach for the performance profiler right away

Chrome performance profiler—while invaluable—doesn't provide a live view while interacting with the page. It's more efficient to test interaction latency in a much faster way first, so you can quickly assess whether a given interaction is reliably slow, and then reach for the performance profiler when you need more information.

#### Use the Web Vitals Chrome Extension

The [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en) involves the lowest amount of effort in testing interaction latency. Once installed, the extension will display interaction data in the console if you do the following:

1. In Chrome, click the extensions icon to the right of the address bar.
2. Locate the Web Vitals extension in the drop-down menu.
3. Click the icon at the right to open the extension's settings.
4. Click **Options**.
5. Enable the **Console logging** checkbox in the resulting screen, and then click **Save**.

Once this has been done, open the console in Chrome DevTools, and begin testing the desired interactions on your website. As you interact with the page, you'll receive useful console logs giving you detailed diagnostic information for the interaction.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/aVIMXrpfirRew3rTM2PM.png", alt="A screenshot of the console logging that the Web Vitals extension provides for interactions. The logging contains details such timings and other contextual information.", width="800", height="264" %}
  <figcaption>
    A console entry from the Web Vitals extension when console logging is turned on. Each qualifying interaction will log interaction data to the console.
  </figcaption>
</figure>

#### Use a JavaScript snippet

Using the Web Vitals extension may not be a viable option for a number of reasons. Extensions can be blocked in some cases, and they also can't be installed on mobile devices. The latter is problematic if you want to test on a physical Android device with [remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/).

An alternate method involves copying and pasting some JavaScript into the console of Chrome DevTools. The following code yields the same console output as the Web Vitals extension for every interaction:

```js
let worstInp = 0;

const observer = new PerformanceObserver((list, obs, options) => {
  for (let entry of list.getEntries()) {
    if (!entry.interactionId) continue;

    entry.renderTime = entry.startTime + entry.duration;
    worstInp = Math.max(entry.duration, worstInp);
      
    console.log('[Interaction]', entry.duration, `type: ${entry.name} interactionCount: ${performance.interactionCount}, worstInp: ${worstInp}`, entry, options);
  }
});

observer.observe({
  type: 'event',
  durationThreshold: 0, // 16 minimum by spec
  buffered: true
});
```

{% Aside %}
A more convenient way of using the preceding code is to use the [snippets feature in Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/snippets/).
{% endAside %}

Once you have determined that the interaction is reliably slow, you can then profile the interaction to get more detailed information on _why_ that interaction is slow.

#### What if you can't reproduce a slow interaction?

What if you've managed to find something in your field data that suggests a particular interaction is slow, but you can't reproduce it in the lab?

For one, this is a common challenge in troubleshooting performance issues of any kind. Your point of view when testing is entirely relative and dependent on the hardware you're using. After all, you may be on a fast device with a fast internet connection—but that doesn't mean your users are too. For this situation you can do one of three things:

1. If you have a physical Android device, use [remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/) to open a Chrome DevTools instance on your host machine and try to reproduce slow interactions there.
2. If you don't have a physical device, [enable the CPU throttling feature in Chrome DevTools](https://umaar.com/dev-tips/88-cpu-throttling/).
3. Follow both steps 1 and 2, as you can also enable CPU throttling on the DevTools instance for a physical Android device.

Another cause could be that you're waiting for a page to load before you interact with it, but your users are not. If you're on a fast network, enable [network throttling](https://developer.chrome.com/docs/devtools/settings/throttling/) and interact with the page as soon as it paints. You should do this because the main thread is often busiest during startup, and testing at that time might help reveal what your users are actually experiencing.

### Record a trace

To get more information on why an interaction is slow, you'll need to take things to the next level by [using the performance profiler in Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/). To profile an interaction in Chrome's performance profiler, do the following:

1. With the page you need to profile loaded and ready for interactions, open Chrome DevTools and go to the **Performance** panel.
2. Click the **Record** button at the upper left of the panel to start tracing.
3. Perform the desired interaction.
4. Click the **Record** button again to stop tracing.

When the profile populates, the first place to look should be the activity summary at the top of the profiler. The activity summary will show red bars at the top where long tasks occurred in the recording. This allows you to quickly zoom in on problem areas.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/UcSCVSfw65rg6u1YkqmY.png", alt="A screenshot of the activity summary in the performance panel of Chrome DevTools. The activity displayed is mostly from JavaScript that causes a long task, which is highlighted in red above the flame chart.", width="674", height="126" %}
  <figcaption>
    The activity summary at the top of Chrome's performance profiler. Long tasks are highlighted in red above the activity flame chart. In this case, significant scripting work was responsible for most of the work in the long task.
  </figcaption>
</figure>

You can quickly focus on the problem area by dragging and selecting a region in the activity summary. Once you've focused to where the interaction occurred, the **Interactions** track will help you line up the interaction and the activity that occurred in the main thread track below it:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/YKYLTuog3110ynQyXDdM.png", alt="A screenshot of an interaction as visualized in the performance panel of Chrome DevTools. An interactions track above the main thread track shows the duration of an interaction, which can be lined up with main thread activity.", width="800", height="325" %}
  <figcaption>
    An interaction profiled in the performance profiler in Chrome's DevTools. The <strong>Interactions</strong> track shows a series of events that amount to a click interaction. The Interactions track entries span across the tasks responsible for driving the interaction.
  </figcaption>
</figure>

From here, it's a matter of observing what the problem with the interaction might be. There are many things that can contribute to high interaction latency, so let's go through what some of the culprits could be.

### Use Lighthouse timespans as an alternative to tracing

Chrome's performance profiler—while rich with diagnostic information—can be a bit intimidating to the uninitiated. One alternative to the performance profiler is Lighthouse's timespan mode. To use this mode, do the following:

1. With DevTools open, go to the **Lighthouse** tab in DevTools.
2. Under the section labeled **Mode**, select the **Timespan** option.
3. Select the desired device type under the section labeled **Device**.
4. Ensure at least the checkbox labeled **Performance** is selected under the **Categories** label.
5. Click the **Start timespan** button.
6. Test the desired interaction(s) on the page.
7. Click the **End timespan** button and wait for the audit to appear
8. Once the audit populates in the Lighthouse tab, you can filter the audits by INP by clicking the **INP** link next to the label which reads **Show audits relevant to**.

At this point, you'll see a drop-down list for audits that have failed or passed. When you expand that drop-down, you'll probably see a breakdown of time spent during the interaction.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/F3fWEdo61KDoAE1OQx9X.jpg", alt="A screenshot of a Lighthouse audit provided by its timespan mode. The audit is specific to INP, and shows details for an interaction, including a screenshot of the element that triggered it, and a table beneath detailing where time was spent processing the interaction.", width="800", height="662" %}
  <figcaption>
    An interaction profiled in Lighthouse's timespan mode. When interactions are made with the page, Lighthouse provides an audit detailing where the time during an interaction was spent, and breaks it down by input delay, processing delay, and presentation delay.
  </figcaption>
</figure>

{% Aside %}
If you want to further investigate the cause behind a slow interaction, you can do so by clicking the **View Trace** button just above the filmstrip. This will take you to the performance profiler that shows interactions details for the interactions that you tested in the timespan mode.
{% endAside %}

## How to identify long input delays

One thing that could be contributing to high interaction latency is input delay. The _input delay_ is the first phase of an interaction. This is the period of time from when the user action is first received by the operating system until the browser is able to start processing the first event triggered by that input. The input delay ends right as the event callbacks for the interaction begin to run.

Identifying input delay in Chrome's performance profiler can be done by finding the start of an interaction in the interactions panel, and then finding the beginning of when the event callbacks for that interaction start to run.

You'll always incur at least some input delay, as it takes some time for the operating system to pass the input event to the browser—but you do have some control over how long the input delay is. **The key is to figure out if there is work running on the main thread that's preventing your callbacks from running.**

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/UrkbAOpDSW2ABcG5ZHE3.png", alt="A depiction of input delay in Chrome's performance panel. The start of the interaction comes significantly before the event callbacks because of increased input delay due to a timer firing from a third-party script.", width="800", height="291" %}
  <figcaption>
    Input delay caused by a task fired by a timer from a third-party script.
  </figcaption>
</figure>

In the previous figure, a task from a third-party script is running as the user attempts to interact with the page, and therefore extends the input delay. The extended input delay affects the interaction's latency, and could therefore affect the page's INP.

For more information on how you can resolve long input delays, read about how you can [identify and reduce input delay](/optimize-input-delay/).

## How to identify expensive event callbacks

Event callbacks occur immediately after the input delay. If an event callback runs too long, it delays the browser from presenting the next frame, and can add significantly to an interaction's total latency. Event callbacks can often run for too long, whether they run as the result of first-party or third-party JavaScript—and in some cases, both.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/h0UKtDuUBvWxd10vjrsn.png", alt="A depiction of event callback tasks in Chrome's performance panel. The event callbacks occur for the pointerdown and click events, which occur in a long task.", width="800", height="291" %}
  <figcaption>
    The event callbacks that run in response to a click interaction, as shown in the performance profiler in Chrome DevTools. Note the red triangle in the upper right corner of both the <strong>Event: pointerdown</strong> and <strong>Event: click</strong> entries, which identifies expensive event callbacks.
  </figcaption>
</figure>

Finding expensive event callbacks can be done by observing the following in a trace for a specific interaction:

1. Determine whether the task associated with the event callbacks is a [long task](/long-tasks-devtools/#what-are-long-tasks). To reveal long tasks in a lab setting more reliably, you may need to [enable CPU throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) in the performance panel, or connect a low to mid-tier Android device and use [remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/).
2. If the task that runs the event callbacks is a long task, look for event handler entries (entries with names such as **Event: click**, for example) in the call stack that have a red triangle at the upper right corner of the entry. These are expensive event callbacks.

To address expensive event callbacks, try one of the following strategies:

1. **Do as little work as possible.** Is everything that happens in an expensive event callback strictly necessary? If not, consider removing that code altogether if you can, or deferring its execution to a later point in time if you can't. You can also take advantage of framework features to help. For example, React's [`PureComponent` class](https://beta.reactjs.org/reference/react/PureComponent) and [memoization feature](https://react.dev/reference/react/memo) can skip unnecessary rendering work when props and state haven't changed for a component.
2. **Defer non-rendering work in the event callback to a later point in time.** Long tasks can be broken up by [yielding to the main thread](/optimize-long-tasks/#use-asyncawait-to-create-yield-points). Whenever you yield to the main thread, you're ending execution of the current task and breaking up the remainder of the work into a separate task. This gives the renderer a chance to process updates to the user interface that were processed earlier in the event callback. If you happen to be developing in React, its [transitions feature](https://react.dev/reference/react/useTransition) will do this for you.

By employing these strategies, you should be able to get your event callbacks in a place where they're responding more quickly to user input.

## How to identify presentation delays

Long input delays and expensive event callbacks aren't the only possible culprits of poor INP. Sometimes the rendering updates that occur in response to even small amounts of event callback code can be expensive. The time it takes for the browser to render visual updates to the user interface to reflect the result of an interaction is known as _presentation delay_.

{% Aside 'important' %}
The [rendering performance guide](/rendering-performance/) is a good primer on understanding how the browser renders a page. [Life of a pixel](https://www.youtube.com/watch?v=K2QHdgAKP-s) goes further in depth on how rendering works in Chromium-based browsers.
{% endAside %}

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/pFmaZMXrlbugrC9WPoHM.png", alt="Rendering work as visualized in the performance panel of Chrome DevTools. The rendering work occurs after the event callback in order to paint the next frame.", width="800", height="229" %}
  <figcaption>
    Rendering tasks as shown in Chrome's performance profiler. The rendering work is shown in purple, with paint work in green.
  </figcaption>
</figure>

{% Aside 'important' %}
When profiling slow interactions due to expensive rendering work, you should enable the **Screenshots** checkbox at the top of the performance profiler. This will help you to line up user interface updates with the corresponding rendering work on the main thread.
{% endAside %}

Of all the possible causes of high interaction latency, rendering work can be the most difficult to troubleshoot and fix, but the result is worth the effort. Excessive rendering work could be caused by any of the following:

- **Large DOM sizes.** Rendering work often increases along with the size of the page's DOM. For more information, read [How large DOM sizes affect interactivity—and what you can do about it](/dom-size-and-interactivity/).
- **Forced reflows.** This happens when you apply style changes to elements in JavaScript, and _then_ query the results of that work. The result is that the browser has to perform the layout work before doing anything else, so that the browser can return the updated styles. For more information and tips on avoiding forced reflows, read [Avoid large, complex layouts and layout thrashing](/avoid-large-complex-layouts-and-layout-thrashing/).
- **Excessive or unnecessary work in [`requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame) callbacks.** `requestAnimationFrame()` callbacks are run during the rendering phase of the event loop, and must complete before the next frame can be presented. If you're using `requestAnimationFrame()` to do work that doesn't involve changes to the user interface, understand that you could be delaying the next frame.
- **[`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) callbacks.** Such callbacks run prior to rendering, and may delay presentation of the next frame if the work in them is expensive. As with event callbacks, defer any logic not needed for the next frame.

{% Aside 'important' %}
Troubleshooting might be made easier by enabling the **Timeline: event initiators** experiment in Chrome DevTools. Enabling this experiment will draw an arrow from any style recalculation task to the JavaScript task that kicked it off. To enable this experiment, go into the Chrome DevTools settings, click on **Experiments** in the left hand menu, the click the checkbox labeled **Timeline: event initiators**, and restart DevTools.
{% endAside %}

## Troubleshooting INP is an iterative process

Finding out what's causing high interaction latency that contributes to poor INP takes a lot of work—but if you can pin down the causes, you're halfway there. By following a methodical approach to troubleshooting poor INP, you can reliably pin down what's causing a problem, and arrive more quickly to the right fix. To review:

- [Rely on field data to find slow interactions](/find-slow-interactions-in-the-field/).
- Test problematic field interactions in the lab to see if they're reproducible.
- Identify whether the cause is due to long input delay, expensive event callbacks, or expensive rendering work.
- Repeat.

The last of these is the most important. Like most other work you must do to improve page performance, troubleshooting and improving INP is a cyclical process. When you fix one slow interaction, you'll need to move onto the next, and continue to do so until you start to see results. Stay vigilant!

_Hero image from [Unsplash](https://unsplash.com/), by [Louis Reed](https://unsplash.com/@_louisreed)._

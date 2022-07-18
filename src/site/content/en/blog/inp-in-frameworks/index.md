---
layout: post
title: How do modern frameworks perform on the new INP metric
subhead: Understand how the new INP metric affects the experience of sites built using JavaScript frameworks and libraries.
date: 2022-05-16
updated: 2022-07-18
authors:
  - leenasohoni
  - addyosmani
  - keenyeeliau
description: |
  This post discusses the relevance of the new INP metric to framework-based websites and Aurora's work to support frameworks in optimizing this metric.
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/EK3nTunaRZbP96S2zwM2.jpeg
alt: Person about to touch the calm water.
tags:
  - aurora-project
  - blog
---

Chrome recently introduced a new [experimental responsiveness metric](https://groups.google.com/a/chromium.org/g/chrome-ux-report-announce/c/F7S4_emZkcw) in the [Chrome UX Report](https://developer.chrome.com/docs/crux/) report. This metric, which we now know as [Interaction to Next Paint (INP)](/inp/) measures overall responsiveness to user interactions on the page. Today we want to share insights on where websites built using modern JavaScript frameworks stand in relation to this metric. We want to discuss why INP is relevant to frameworks and how [Aurora](/introducing-aurora/) and frameworks are working to optimize responsiveness.


## Background

Chrome uses First Input Delay ([FID](/fid/#why-only-consider-the-input-delay)) as part of Core Web Vitals ([CWV](/learn-web-vitals/)) to measure the [load responsiveness](/user-centric-performance-metrics/#types-of-metrics) of websites. FID measures the waiting time from the first user interaction to the moment the browser is able to process the event handlers connected to the interaction. It does not include the time to process the event handlers, process subsequent interactions on the same page, or paint the next frame after the event callbacks run. However, responsiveness is crucial to the user experience throughout the page lifecycle because users spend roughly 90% of the time on a page after it loads.

[INP](/inp) measures the time it takes a web page to respond to user interactions from when the user starts the interaction until the moment the next frame is painted on the screen. With INP, we hope to enable an aggregate measure for the perceived latency of all interactions in the page's lifecycle. We believe that INP will provide a more accurate estimate of web pages' load and runtime responsiveness.

Since FID measures only the input delay of the first interaction, it is likely that web developers have not proactively optimized the subsequent interactions as part of their CWV improvement process. Sites, especially those with a high degree of interactivity, would therefore have to start working hard to do well on this metric.


### The role of frameworks

Since many websites rely on JavaScript to provide interactivity, the INP score would primarily be affected by the amount of JavaScript processed on the main thread. [JavaScript frameworks](https://developer.mozilla.org/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks) are an essential part of modern front-end web development and provide developers with valuable abstractions for routing, event handling, and compartmentalization of JavaScript code. Thus, they have a central role in optimizing the responsiveness and user experience of websites that use them.

Frameworks may have taken steps for better responsiveness by improving FID for websites earlier. However, they would now have to analyze the available responsiveness metric data and work towards addressing any gaps identified. In general, INP tends to have lower pass rates, and the difference in the measurement process requires additional code optimization. The following table summarizes why.

<div class="table-wrapper scrollbar">
<table>
  <thead>
    <tr>
      <th></th>
      <th>FID</th>
      <th>INP</th>
    </tr>
  </thead>
  <tbody>
  <tr>
   <th>Measurement</th>
   <td>Measures the duration between the first user input and the time when the corresponding event handler runs.
   </td>
   <td>Measures the overall interaction latency by using the delay of the
    <ul>
      <li>single largest interaction for less than 50 transactions
      <li><a href="https://web.dev/inp/#why-not-the-worst-interaction-latency">one of the largest interactions</a> for more than 50 transactions.</li>
    </ul>
   </td>
  </tr>
  <tr>
   <th>Depends on</th>
   <td>Main thread availability to run the event handler required for the first interaction. The main thread could be blocked because it is processing other resources as part of the initial page load.
   </td>
   <td>Main thread availability and size of the script executed by the event handlers for different interactions, including the first interaction.
   </td>
  </tr>
  <tr>
   <th>Primary cause for poor scores</th>
   <td>Poor FID is mainly caused due to <a href="https://web.dev/optimize-fid/#heavy-javascript-execution">heavy JavaScript execution</a> on the main thread.
   </td>
   <td>Heavy event-handling JavaScript and other rendering tasks after running handlers can result in poor INP.
   </td>
  </tr>
  <tr>
   <th>Optimization</th>
   <td>FID can be optimized by improving resource loading on page load and optimizing JavaScript code.
   </td>
   <td>Similar to FID for every interaction plus usage of rendering patterns that prioritize key UX updates over other rendering tasks.
   </td>
  </tr>
   </tbody>
   <caption>FID versus INP: Measurement and optimization</caption>
</table>
</div>

The [Aurora](/introducing-aurora/) team in Chrome works with open-source web frameworks to help developers improve different aspects of the user experience, including performance and CWV metrics. With the introduction of INP, we want to be prepared for the change in CWV metrics for framework-based websites. We have collected data based on the experimental responsiveness metric in CrUX reports. We will share insights and action items to ease the transition to the INP metric for framework-based websites.


## Experimental responsiveness metric data

An INP below or equal to 200 milliseconds indicates good responsiveness. The CrUX report data and the [CWV Technology Report](https://www.google.com/url?q=https://datastudio.google.com/s/gPxRJmoivLA&sa=D&source=docs&ust=1652475737927418&usg=AOvVaw3ZQ0WOZu2ZGjCuJb23dQYg) for April 2022 give us the following information about responsiveness for popular JavaScript frameworks.

{% Aside %}
This measurement includes data from all versions of the frameworks listed. For more mature frameworks, this can include data from versions many years out-of-date.
{% endAside %}

<div class="table-wrapper scrollbar">
<table>
<thead>
  <tr>
   <th rowspan="2">Technology
   </th>
   <th colspan="2" align="center">% Passing
   </th>
  </tr>
  <tr>
   <th>% Mobile
   </th>
   <th>Desktop
   </th>
  </tr>
</thead>
  <tbody>
  <tr>
   <td>Angular (v2.0.0+)
   </td>
   <td>19.0
   </td>
   <td>65.5
   </td>
  </tr>
  <tr>
   <td>Next.js
   </td>
   <td>20.2
   </td>
   <td>73.4
   </td>
  </tr>
  <tr>
   <td>Nuxt.js
   </td>
   <td>25.4
   </td>
   <td>84.5
   </td>
  </tr>
  <tr>
   <td>Preact
   </td>
   <td>36.6
   </td>
   <td>90.6
   </td>
  </tr>
  <tr>
   <td>Vue (v2.0.0+)
   </td>
   <td>41.7
   </td>
   <td>90.0
   </td>
  </tr>
  <tr>
   <td>Lit
   </td>
   <td>36.4
   </td>
   <td>75.7
   </td>
  </tr>
  </tbody>
   <caption>CWV technology report - INP data for April 2022</caption>
</table>
</div>


{% Aside 'important' %}

We recommend not solely making decisions on the frameworks you are choosing based on the numbers above, without being aware of additional nuance. Many different variables contribute to making a framework suitable for your web apps, and the table only reflects INP. Additionally, the used dataset only looks into landing pages which is not the typical use case for some of the listed frameworks. Besides the framework used, several other factors could affect performance metrics. It is also worth noting that frameworks are often used for different application [holotypes](https://jasonformat.com/application-holotypes/), which may play a factor here. The purpose of the data is to indicate the extent of effort required to meet INP goals if your site uses a specific framework.

{% endAside %}


The table shows the percentage of origins on each framework with a good responsiveness score. The numbers are encouraging but tell us that there is much room for improvement.


## How does JavaScript affect INP?

INP values in the field correlate well with the Total Blocking Time (TBT) observed in the lab. This could imply that any script that blocks the main thread for a long duration would be bad for INP. Heavy JavaScript execution after any interaction could block the main thread for an extended period and delay the response to that interaction. Some of the common causes that lead to blocking scripts are:

* **Unoptimized JavaScript:** Redundant code or poor code-splitting and loading strategies can cause JavaScript bloat and block the main thread for long periods. Code-splitting, progressive loading, and [breaking up long tasks](/long-tasks-devtools/) can improve response times considerably.

* **Third-party scripts:** [Third-party scripts](/optimizing-content-efficiency-loading-third-party-javascript/), which are sometimes not required to process an interaction (for example, ad scripts), can block the main thread and cause unnecessary delays. Prioritizing essential scripts can help to reduce the negative impact of third-party scripts.

* **Multiple event handlers:** Multiple event handlers associated with every interaction, each running a different script, could interfere with each other and add up to cause long delays. Some of these tasks may be non-essential and could be scheduled on a web worker or when the browser is idle.

* **Framework overhead on event handling:** Frameworks may have additional features/syntax for event handling. For example, Vue uses [v-on](https://v2.vuejs.org/v2/api/#v-on) to attach event listeners to elements, while Angular wraps user event handlers. Implementing these features requires additional framework code above vanilla JavaScript.

* **Hydration:** When using a JavaScript framework, it's not uncommon for a server to generate the initial HTML for a page which then needs to be augmented with event handlers and application state so that it can be interactive in a web browser. We call this process hydration. This can be a heavy process during load, depending on how long JavaScript takes to load and for hydration to finish. It can also lead to pages looking like they are interactive when they are not. Often hydration occurs automatically during page load or lazily (for example, on user interaction) and can impact INP or processing time due to task scheduling. In libraries such as React, you can leverage `useTransition` so that part of a component render is in the next frame and any more costly side-effects are left to future frames. Given this, updates in a transition that yield to more urgent updates like clicks can be a pattern that can be good for INP.

* **Prefetching:** Aggressively prefetching the resources needed for subsequent navigations can be a performance win when done right. If however, you prefetch and render SPA routes synchronously, you can end up negatively impacting INP as all of this expensive rendering attempts to complete in a single frame. Contrast this to not prefetching your route and instead kicking off the work needed (for example, `fetch()`) and unblocking paint. We recommend re-examining if your framework's approach to prefetching is delivering the optimal UX and how (if at all) this may impact INP.

From now on, for a good INP score, developers will have to focus on reviewing the code that executes after every interaction on the page and optimize their chunking, rehydration, loading strategies, and the size of each render() update  for both first-party and third-party scripts,


## How are Aurora and frameworks addressing INP issues?

Aurora works with frameworks by incorporating best practices to provide baked-in solutions to common problems. We have worked with Next.js, Nuxt.js, Gatsby, and Angular on [solutions](/introducing-aurora/#what-has-our-work-unlocked-so-far) that offer strong defaults within the framework to optimize performance. Following are the highlights of our work in this context:

* **React and Next.js:** The [Next.js Script component](/script-component/) helps to address issues caused due to inefficient loading of third-party scripts. [Granular chunking](/granular-chunking-nextjs/) was introduced in Next.js to allow for smaller-sized chunks for shared code. This helps to reduce the amount of unused common code that is downloaded on all pages. We are also working with Next.js to make INP data available as part of their [Analytics](https://nextjs.org/analytics) service.

* **Angular:** Aurora is [partnering with the Angular](https://angular.io/guide/roadmap#explore-hydration-and-server-side-rendering-usability-improvements) team to explore server-side rendering and hydration improvements. We also plan to look into refinements in event handling and change detection to improve INP.

* **Vue and Nuxt.js:** We are exploring avenues for collaboration, mainly in relation to script loading and rendering.

### How are frameworks thinking about improving INP?


#### React and Next.js

React.js _time slicing_, implemented through [startTransition](https://github.com/reactwg/react-18/discussions/41) and _Suspense_, allows you to opt-in to selective or progressive hydration. This means that hydration isn't a synchronous block. It's done in small slices that are interruptible at any point.

This should help improve INP and enable you to respond more quickly to keystrokes, hover effects during the transition, and clicks. It also helps to keep React apps responsive even for large transitions such as auto-complete.

Next.js is working on a [new routing framework](https://twitter.com/leeerob/status/1521659624516030466) that will use startTransition by default for route transitions. This goal is to allow Next.js site owners to adopt React time-slicing and improve the responsiveness of route transitions.


#### Angular

The Angular team is exploring several ideas that should also help with INP:

* **Zoneless:** Cuts down on initial bundle size, and required code that must load before an app can render anything.
* **Hydration:** Island-style hydration to limit how much of the app needs to be woken up for interaction.
* **Reduce overhead of CD:** For example, make change detection less expensive, find ways to check less of the app, and leverage reactive signals about what's changed.
* **More granular code-splitting:** Make the initial bundle smaller.
* **Better support for loading indicators:**: For example, during SSR re-render, during route navigation, and in lazy loading operations.
* **Profiling tools:** Better dev tools to understand interaction cost, particularly around change detection cost for specific interactions.

Through these enhancements, we can address different issues that lead to poor responsiveness and user experience, and boost the CWV metrics and the new INP metric for framework-based websites.


## Conclusion

We expect the INP score to provide a better compass for websites to improve responsiveness and performance in the future. We will take steps to provide more actionable guidance on the metric in 2022-23. We hope to achieve this by:

* Creating channels for easy access to field data on INP for frameworks and web developers.
* Work with frameworks to build features that will improve INP by default.

We welcome [feedback](mailto:web-vitals-feedback@googlegroups.com) from framework users as they begin their INP optimization journeys.

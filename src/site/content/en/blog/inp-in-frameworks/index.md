---
layout: post
title: How do modern frameworks perform on the new INP metric
subhead: Understand how the new INP metric affects the CWV of websites built using JavaScript frameworks and libraries.
date: 2022-05-10
authors:
  - leenasohoni
  - keenyeeliau
  - addyosmani
description: |
  This post discusses the relevance of the new INP metric to framework-based websites and Aurora's work to support frameworks in optimizing this metric.
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/EK3nTunaRZbP96S2zwM2.jpeg
alt: Person about to touch the calm water.
tags:
  - aurora-project
  - blog
---

Chrome recently introduced a new [experimental responsiveness metric](https://groups.google.com/a/chromium.org/g/chrome-ux-report-announce/c/F7S4_emZkcw) in the [CrUX](https://developers.google.com/web/tools/chrome-user-experience-report) report. This metric, which we now know as [Interaction to Next Paint (INP)](/inp/) measures overall responsiveness to user interactions on the page. Today we want to share insights on where websites built using modern JavaScript frameworks stand in relation to this metric. We want to discuss why INP is relevant to frameworks and how [Aurora](/introducing-aurora/) is helping frameworks to optimize responsiveness, irrespective of the metric used.


# Background

Chrome uses First Input Delay ([FID](/fid/#why-only-consider-the-input-delay)) as part of Core Web Vitals ([CWV](/learn-web-vitals/)) to measure the [load responsiveness](/user-centric-performance-metrics/#types-of-metrics) of websites. FID measures the waiting time from the first user interaction to the moment the browser is able to process the event handlers connected to the interaction. It does not include the time to process the event handlers, process subsequent interactions on the same page, or paint the next frame after the event callbacks run. However, responsiveness is crucial to the user experience throughout the page lifecycle because users spend roughly 90% of the time on a page after it loads. 

[INP](/inp) measures the time it takes a web page to respond to user interactions from when the user starts the interaction until the moment the next frame is painted on the screen. With INP, we hope to enable an aggregate measure for the perceived latency of all interactions in the page's lifecycle. We believe that INP will provide a more accurate estimate of web pages' load and runtime responsiveness.

Since FID measures only the input delay of the first interaction, it is likely that web developers have not proactively optimized the subsequent interactions as part of their CWV improvement process. Sites, especially those with a high degree of interactivity, would therefore have to start working hard to do well on this metric.


## The role of frameworks

Since many websites rely on JavaScript to provide interactivity, the INP score would primarily be affected by the amount of JavaScript processed on the main thread. [JavaScript frameworks](https://developer.mozilla.org/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks) are an essential part of modern front-end web development and provide developers with valuable abstractions for routing, event handling, and compartmentalization of JavaScript code. Thus, they have a central role in optimizing the responsiveness and user experience of websites that use them.

Frameworks may have taken steps for better responsiveness by improving FID for websites earlier. However, they would now have to analyze the available responsiveness metric data and work towards addressing any gaps identified. In general, INP tends to be poorer than FID, and the difference in the measurement process requires additional code optimization. The following table summarizes why.

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
   <td>Aggregates the delay for up to the last 500 interactions in the page lifecycle, from user interaction to response paint.
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
   <td>Heavy event-handling JavaScript for interactions can result in poor INP.
   </td>
  </tr>
  <tr>
   <th>Optimization</th>
   <td>FID can be optimized by improving resource loading on page load and optimizing JavaScript code.
   </td>
   <td>To optimize INP, optimize the JavaScript code executed after each event, including the page load event. 
   </td>
  </tr>
   </tbody>
   <caption>FID versus INP: Measurement and optimization</caption>
</table>
</div>

The [Aurora](/introducing-aurora/) team in Chrome works with open-source web frameworks to help developers improve different aspects of the user experience, including performance and CWV metrics. With the introduction of INP, we want to be prepared for the change in CWV metrics for framework-based websites. We have collected data based on the experimental responsiveness metric in CrUX reports. We will share insights and action items to ease the transition to the INP metric for framework-based websites. 


# Experimental responsiveness metric data

An INP below or equal to 200 milliseconds indicates good responsiveness. The CrUX report data and the [CWV technology report](https://datastudio.google.com/u/0/reporting/55bc8fad-44c2-4280-aa0b-5f3f0cd3d2be/page/M6ZPC?s=k-3cPh_K1xg&params=%7B%22df44%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580React%25EE%2580%2580Vue.js%25EE%2580%2580Nuxt.js%25EE%2580%2580Next.js%25EE%2580%2580Preact%25EE%2580%2580Angular%25EE%2580%2580lit-element%25EE%2580%2580SvelteKit%22%7D) for April 2022 give us the following information about responsiveness for popular JavaScript frameworks.

<div class="table-wrapper scrollbar">
<table>
<thead>
  <tr>
   <th rowspan="2">Technology
   </th>
   <th colspan="2">Mobile
   </th>
   <th colspan="2">Desktop
   </th>
  </tr>
  <tr>
   <th>% passing
   </th>
   <th>No. of origins
   </th>
   <th>% passing
   </th>
   <th>No. of origins
   </th>
  </tr>
</thead>
  <tbody>
  <tr>
   <td>Angular
   </td>
   <td>19.0
   </td>
   <td>40,116
   </td>
   <td>65.5
   </td>
   <td>33,835
   </td>
  </tr>
  <tr>
   <td>Next.js
   </td>
   <td>20.2
   </td>
   <td>67,300
   </td>
   <td>73.4
   </td>
   <td>54,992
   </td>
  </tr>
  <tr>
   <td>Nuxt.js
   </td>
   <td>25.4
   </td>
   <td>93,268
   </td>
   <td>84.5
   </td>
   <td>72,668
   </td>
  </tr>
  <tr>
   <td>Preact
   </td>
   <td>36.6
   </td>
   <td>152,491
   </td>
   <td>90.6
   </td>
   <td>126,909
   </td>
  </tr>
  <tr>
   <td>React
   </td>
   <td>34.6
   </td>
   <td>456,607
   </td>
   <td>83.7
   </td>
   <td>338,736
   </td>
  </tr>
  <tr>
   <td>Vue
   </td>
   <td>41.7
   </td>
   <td>160,878
   </td>
   <td>90.0
   </td>
   <td>129,172
   </td>
  </tr>
  <tr>
   <td>Lit
   </td>
   <td>36.4
   </td>
   <td>16,263
   </td>
   <td>75.7
   </td>
   <td>14,409
   </td>
  </tr>
  </tbody>
   <caption>CWV technology report - INP data for April 2022</caption>
</table>
</div>


{% Aside 'important' %}

Do not use these numbers for comparing the frameworks listed. Besides the framework used, several other reasons could affect performance metrics. The purpose of the data is to indicate the extent of effort required to meet INP goals if your site uses a specific framework.
{% endAside %}


The table shows the percentage of origins on each framework with a good responsiveness score. The numbers are encouraging but tell us that there is much room for improvement. 


# How does JavaScript affect INP?

INP values in the field correlate well with the Total Blocking Time (TBT) observed in the lab. This could imply that any script that blocks the main thread for a long duration would be bad for INP. Heavy JavaScript execution after any interaction could block the main thread for an extended period and delay the response to that interaction. Some of the common causes that lead to blocking scripts are:

* **Unoptimized JavaScript:** Redundant code or poor code-splitting and loading strategies can cause JavaScript bloat and block the main thread for long periods. Code-splitting, progressive loading, and [breaking up long tasks](/long-tasks-devtools/) can improve response times considerably.

* **Third-party scripts:** [Third-party scripts](/optimizing-content-efficiency-loading-third-party-javascript/), which are sometimes not required to process an interaction (for example, ad scripts), can block the main thread and cause unnecessary delays. Prioritizing essential scripts can help to reduce the negative impact of third-party scripts. 

* **Multiple event handlers:** Multiple event handlers associated with every interaction, each running a different script, could interfere with each other and add up to cause long delays. Some of these tasks may be non-essential and could be scheduled on a web worker or when the browser is idle.

* **Framework overhead on event handling:** Frameworks may have additional features/syntax for event handling. For example, Vue uses [v-on](https://v2.vuejs.org/v2/api/#v-on) to attach event listeners to elements, while Angular wraps user event handlers. Implementing these features requires additional framework code above vanilla JavaScript.

* **Rehydration code:** Execution of rehydration code after repainting frames can cause delays. Generating some content statically during build time and routing to this content on events can help to render the content quickly.

From now on, for a good INP score, developers will have to focus on reviewing the code that executes after every interaction on the page and optimize their chunking, rehydration, and loading strategies for both first-party and third-party scripts,  


# How is Aurora addressing INP issues?

Aurora works with frameworks by incorporating best practices to provide baked-in solutions to common problems. We have worked with Next.js, Nuxt.js, Gatsby, and Angular on [solutions](/introducing-aurora/#what-has-our-work-unlocked-so-far) that offer strong defaults within the framework to optimize performance. Following are the highlights of our work in this context:

* **React and Next.js:** The [Next.js Script component](/script-component/) helps to address issues caused due to inefficient loading of third-party scripts. [Granular chunking](/granular-chunking-nextjs/) was introduced in Next.js to allow for smaller-sized chunks for shared code. This helps to reduce the amount of unused common code that is downloaded on all pages. We are also working with Next.js to make INP data available as part of their [Analytics](https://nextjs.org/analytics) service.

* **Angular:** Aurora is [partnering with the Angular](https://angular.io/guide/roadmap#explore-hydration-and-server-side-rendering-usability-improvements) team to explore server-side rendering and hydration improvements. We also plan to look into refinements in event handling and change detection to improve INP.

* **Vue and Nuxt.js:** We are exploring avenues for collaboration, mainly in relation to script loading and rendering.

Through these enhancements, Aurora can address different issues that lead to poor responsiveness and user experience, and boost the CWV metrics and the new INP metric for framework-based websites.


# Conclusion

We expect the INP score to provide a better compass for websites to improve responsiveness and performance in the future. We will take steps to provide more actionable guidance on the metric in 2022-23. We hope to achieve this by:

* Creating channels for easy access to field data on INP for frameworks and web developers.
* Work with frameworks to build features that will improve INP by default.

We welcome feedback from framework users as they begin their INP optimization journeys.

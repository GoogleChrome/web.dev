---
layout: post
title: Optimizing third-party script loading in Next.js
subhead: Understand the vision behind the Next.js’ Script component, which provides a built-in solution to optimize the loading of third-party scripts.
date: 2022-02-24
authors:
  - leenasohoni
  - houssein
description: |
  This article discusses the Next.js Script component and demonstrates how it can be used for better sequencing of third-party scripts.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/I71rvvFlEORPhGILHsZX.jpg
alt: A child arranging Jenga blocks.
tags:
  - aurora-project
  - blog
---

Around [45%](https://almanac.httparchive.org/en/2021/third-parties#fig-3) of requests from websites served on mobile and desktop are third-party requests of which [33% are scripts](https://almanac.httparchive.org/en/2021/third-parties#fig-9). The size, latency, and loading of third-party scripts can significantly affect a site's performance. The Next.js Script component comes with baked-in best practices and defaults to help developers introduce third-party scripts in their applications while addressing potential performance issues out of the box.

## Third-party scripts and their impact on performance

[Third-party scripts](/third-party-javascript/) allow web developers to leverage existing solutions to implement common features and reduce development time. But the creators of these scripts typically do not have any incentive to consider the performance impact on the consuming website. These scripts are also a blackbox to developers who use them.

Scripts account for a significant number of [third-party bytes](https://almanac.httparchive.org/en/2021/third-parties#fig-11) downloaded by websites across different categories of third-party requests. By default, the browser prioritizes scripts based on where they are in the document which may delay the discovery or execution of scripts critical to user experience.

Third-party libraries required for layout should be loaded early to render the page. Third-parties that are not required for initial render should be deferred so that they do not block other processing on the main thread. [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) has two audits to flag render-blocking or main thread blocking scripts.

<figure>
  {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/nzgIO68cBW9y5xCsW0g6.png", alt="Lighthouse audits for Eliminate render-blocking resources and Minimize third-party usage", width="800", height="301" %}
</figure>

It's important to consider the resource loading sequence of your page so that critical resources are not delayed and non-critical resources do not block critical resources.

While there are [best practices](/fast/#optimize-your-third-party-resources) to reduce the impact of third parties, not everyone may be aware of how to implement them for every third-party they use. This can be complicated because:

* On average, websites use [21 to 23 different third parties](https://almanac.httparchive.org/en/2021/third-parties#fig-4)&mdash;including scripts&mdash;on mobile and desktop. Usage and recommendations may differ for each.
* Implementing many third-parties can differ based on whether a particular framework or UI library is used.
* Newer third-party libraries are introduced frequently.
* Varying business requirements related to the same third-party makes it difficult for developers to standardize its use.

## Aurora’s focus on third-party scripts

Part of Aurora's [collaboration](/introducing-aurora/#aurora-a-collaboration-between-chrome-and-open-source-web-frameworks-and-tools) with open source web frameworks and tools is to provide strong defaults and opinionated tooling to help developers improve aspects of the user experience such as performance, accessibility, security, and mobile readiness. In 2021, we were focused on helping framework stacks improve user experience and their [Core Web Vitals](/vitals/) metrics.

One of the most significant steps towards achieving our goal to improve framework performance involved researching the ideal loading sequence of third-party scripts in Next.js. Frameworks such as Next.js are uniquely positioned to provide useful defaults and features that help developers efficiently load resources, including third-parties. We studied extensive [HTTP Archive](https://httparchive.org/) and Lighthouse [data](https://docs.google.com/spreadsheets/d/1Td-4qFjuBzxp8af_if5iBC0Lkqm_OROb7_2OcbxrU_g/edit?resourcekey=0-ZCfve5cngWxF0-sv5pLRzg#gid=1628564987) to find which third-parties [block rendering](/render-blocking-resources/) the most across different frameworks.

To address the issue of main-thread blocking third-party scripts used in an application, we built the [Script component](https://nextjs.org/docs/basic-features/script). The component encapsulates sequencing features to provide developers with better controls for third-party script loading.

## Sequencing third-party scripts without a framework component

The [available guidance](/efficiently-load-third-party-javascript/) to reduce the impact of render-blocking scripts provides the following methods for efficiently loading and sequencing third-party scripts:

1. Use the `async` or `defer` attribute with `<script>` tags that tell the browser to load non-critical third-party scripts without blocking the document parser. Scripts not required for initial page load or the first user interaction may be considered non-critical.

    ```html
       <script src="https://example.com/script1.js" defer></script>
       <script src="https://example.com/script2.js" async></script>
    ```

2. [Establish early connections to required origins](/preconnect-and-dns-prefetch/) using preconnect and dns-prefetch. This allows critical scripts to start downloading earlier.

    ```html
       <head>
           <link rel="preconnect" href="http://PreconnThis.com">
           <link rel="dns-prefetch" href="http://PrefetchThis.com">
       </head>
    ```


3. [Lazy-load](/embed-best-practices/#lazy-loading) third-party resources and embeds after the main page content has finished loading or when the user scrolls down to the part of the page where they are included.


## The Next.js Script component

The [Next.js Script component](https://nextjs.org/docs/basic-features/script) implements the above methods for sequencing scripts and provides a template for developers to define their loading strategy. Once the suitable strategy is specified, it will load optimally without blocking other critical resources.

The Script component builds on the HTML &lt;script&gt; tag and provides an option to set the loading priority for third-party scripts using the strategy attribute.


```html
// Example for beforeInteractive:
<Script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserverEntry%2CIntersectionObserver" strategy="beforeInteractive" />

// Example for afterInteractive (default):
<Script src="https://example.com/samplescript.js" />

// Example for lazyonload:
<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />
```

The strategy attribute can take three values.

1. **`beforeInteractive`**: This option may be used for critical scripts that should execute before the page becomes interactive. Next.js ensures that such scripts are injected into the initial HTML on the server and executed before other self-bundled JavaScript. Consent management, bot detection scripts, or helper libraries required to render critical content are good candidates for this strategy.

2. **`afterInteractive`**: This is the default strategy applied and is equivalent to loading a script with the defer attribute. It should be used for scripts that the browser can run after the page is interactive&mdash;for example, analytics scripts. Next.js injects these scripts on the client-side, and they run after the page is hydrated. Thus, unless otherwise specified, all third-party scripts defined using the Script component are deferred by Next.js, thereby providing a strong default.

3. **`lazyOnload`**: This option may be used to lazy-load low-priority scripts when the browser is idle. The functionality provided by such scripts is not required immediately after the page becomes interactive&mdash;for example, chat or social media plug-ins.

Developers can tell Next.js how their application uses a script by specifying the strategy. This allows the framework to apply optimizations and best practices to load the script while ensuring the best loading sequence.

{% Aside 'caution' %}
Since the default strategy used is `afterInteractive`, developers must remember to set the strategy to `beforeInteractive` for scripts necessary for rendering the page.
{% endAside %}

Using the Script component, developers can place a third-party script anywhere in the application for late-loading third-parties and at the document level for critical scripts. This implies that the Script component may be co-located with the component using the script. After hydration, the script will be injected into the head of the initially rendered document or at the bottom of the body, depending on the strategy used.

## Measuring the impact

We used the templates for the Next.js [commerce app](https://nextjs.org/commerce) and [starter blog](https://github.com/vercel/next-learn/tree/dependabot/npm_and_yarn/seo/demo/next-12.1.0/basics/learn-starter) to create two demo apps that helped measure the impact of including third-party scripts. Commonly used third-parties for Google Tag Manager and social media embeds were included on the pages of these apps directly at first and then through the Script component. We then compared the performance of these pages on [WebPageTest](https://www.webpagetest.org/).

### Third-party scripts in a Next.js commerce app

Third-party scripts were added to the commerce app template for the demo as given below.

<div class="table-wrapper scrollbar">
<table>
    <thead>
        <tr>
            <th>Before</th>
            <th>After</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Google Tag Manager with async</td>
            <td rowspan="2">Script component with strategy = afterInteractive for both scripts
            </td>
        </tr>
        <tr>
            <td>Twitter Follow button without async or defer
            </td>
        </tr>
    </tbody>
    <caption>Script and Script Component configuration for demo 1 with 2 scripts.</caption>
</table>
</div>

The following comparison shows the visual progress for both versions of the [Next.js commerce starter-kit](https://demo.vercel.store/). As seen, LCP occurs nearly 1s earlier with the Script component enabled with the right loading strategy.

<figure>
  {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/a3gpB5Ji7vcvQjBhviCP.png", alt="Film strip comparison showing improvment in LCP", width="800", height="372" %}
</figure>

### Third-party scripts in a Next.js blog

Third-party scripts were added to the demo blog app as given below.

<div>
<table>
    <thead>
        <tr>
            <th>Before</th>
            <th>After</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Google Tag Manager with async</td>
            <td rowspan="2">Script component with strategy = lazyonload for each of the four scripts
            </td>
        </tr>
        <tr>
            <td>Twitter Follow button with async
            </td>
        </tr>
        <tr>
            <td>YouTube Subscribe button without async or defer
            </td>
        </tr>
        <tr>
            <td>LinkedIn Follow button without async or defer
            </td>
        </tr>
    </tbody>
    <caption>Script and Script Component configuration for demo 2 with 4 scripts.</caption>
</table>
</div>

<figure>
  {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/BAWQVlyBX1UUJOMyrBJm.gif", alt="Video showing the loading progress for the index page with and without the Script component. There is a 0.5 seconds improvement in FCP with the Script component.", width="800", height="306" %}
</figure>

As seen in the video, [First Contentful Paint (FCP)](/fcp/) occurs at 0.9 seconds on the page without the Script component and 0.4 seconds with the Script component.

## What’s next for the Script component

While the strategy options for `afterInteractive` and `lazyOnload` provide significant control over render-blocking scripts, we are also exploring other options that would increase the utility of the Script component.

### Using web workers

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) can be used to run independent scripts on background threads which can free up the main thread to handle processing user interface tasks and improve performance. Web Workers are best suited for offloading JavaScript processing, rather than UI work, off the main thread. Scripts used for customer support or marketing, which typically do not interact with the UI, may be good candidates for execution on a background thread. A lightweight third-party library&mdash;[PartyTown](https://github.com/BuilderIO/partytown)&mdash;may be used to isolate such scripts into a web worker.

With the current implementation of the Next.js script component, we recommend deferring these scripts on the main thread by setting the strategy to `afterInteractive` or `lazyOnload`. In the future, we propose introducing a new strategy option, `'worker'`, which will allow Next.js to use PartyTown or a custom solution to run scripts on web workers. We welcome comments from developers on this [RFC](https://github.com/vercel/next.js/discussions/31517).

### Minimizing CLS

Third-party embeds like advertisements, video, or social media feed embeds can cause layout shifts when lazy-loaded. This affects the user experience and the [Cumulative Layout Shift (CLS)](/cls/) metric for the page. CLS can be minimized by specifying the size of the container where the embed will load.

The Script component may be used to load embeds that can cause layout shifts. We are considering augmenting it to provide configuration options that will help reduce the CLS. This could be made available within the Script component itself or as a companion component.

### Wrapper components

The syntax and loading strategy for including popular third-party scripts such as Google Analytics or Google Tag Manager (GTM) is usually fixed. These can be further encapsulated in individual wrapper components for each type of script. Only a minimal set of application-specific attributes (such as tracking ID) will be available to developers. Wrapper components will help developers by:

1. Making it easier for them to include popular script tags.
2. Ensuring that the framework uses the most optimal strategy under the hood.

## Conclusion

Third-party scripts are usually created to include specific features in the consuming website. To reduce the impact of non-critical scripts, we recommend deferring them&mdash;which the Next.js Script component does by default. Developers have the assurance that included scripts will not delay critical functionality unless they explicitly apply the `beforeInteractive` strategy. Like the Next.js Script component, framework developers can also consider building these features in other frameworks. We are actively exploring landing a similar component with the Nuxt.js team. Based on feedback, we also hope to enhance the [Script component](https://github.com/vercel/next.js/blob/canary/packages/next/client/script.tsx) further to cover additional use cases.

## Acknowledgments

Thank you to [Kara Erickson](/authors/karaerickson/), [Janicklas Ralph](https://github.com/janicklas-ralph), [Katie Hempenius](/authors/katiehempenius/), [Philip Walton](/authors/philipwalton/), [Jeremy Wagner](/authors/jlwagner/), and [Addy Osmani](/authors/addyosmani/) for their feedback on this post.

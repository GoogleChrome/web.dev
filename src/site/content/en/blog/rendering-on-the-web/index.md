---
title: Rendering on the Web
subhead: Where should we implement logic and rendering in our applications? Should we use Server Side Rendering? What about Rehydration? Let's find some answers!
authors:
 - developit
 - addyosmani
date: 2019-02-06
updated: 2023-05-17
description: |
  Where should we implement logic and rendering in our applications? Should we use Server Side Rendering? What about Rehydration? Let's find some answers!
tags:
 - blog
---

As developers, we are often faced with decisions that will affect the entire architecture of our applications. One of the core decisions web developers must make is where to implement logic and rendering in their application. This can be difficult, since there are a number of different ways to build a website.

Our understanding of this space is informed by our work in Chrome talking to large sites over the past few years. Broadly speaking, we would encourage developers to consider server-side rendering or static rendering over a full rehydration approach.

In order to better understand the architectures we're choosing from when we make this decision, we need to have a solid understanding of each approach and consistent terminology to use when speaking about them. The differences between these approaches help illustrate the trade-offs of rendering on the web through the lens of performance.

## Terminology

**Rendering**

- **Server-side rendering (SSR):** rendering a client-side or universal app to HTML on the server.
- **Client-side rendering (CSR):** rendering an app in a browser via JavaScript to modify the DOM.
- **Rehydration:** "booting up" JavaScript views on the client such that they reuse the server-rendered HTML's DOM tree and data.
- **Prerendering:** running a client-side application at build time to capture its initial state as static HTML.

**Performance**

- **[Time to First Byte (TTFB)](/ttfb/):** seen as the time between clicking a link and the first bit of content coming in.
- **[First Contentful Paint (FCP)](/fcp/):** the time when requested content (article body, etc) becomes visible.
- **[Interaction to Next Paint (INP)](/inp/):** seen as a representative metric that assesses whether a page is responding consistently fast to user inputs.
- **[Total Blocking Time (TBT)](/tbt/):** A [proxy metric for INP](https://almanac.httparchive.org/en/2022/performance#inp-and-tbt), which calculates the amount of time the main thread was blocked during page load.

## Server-side rendering

_Server-side rendering generates the full HTML for a page on the server in response to navigation. This avoids additional round-trips for data fetching and templating on the client, since it's handled before the browser gets a response._

Server-side rendering generally produces a fast FCP. Running page logic and rendering on the server makes it possible to avoid sending lots of JavaScript to the client. This helps to reduce a page's TBT, which can also lead to a lower INP, as the main thread is not blocked as often during page load. When the main thread is blocked less often, user interactions will have more opportunities run sooner. This makes sense, since with server-side rendering, you're really just sending text and links to the user's browser. This approach can work well for a large spectrum of device and network conditions, and opens up interesting browser optimizations like streaming document parsing.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/WOL6PIpIQHpqsgtKwbJv.png", alt="Diagram showing server-side rendering and JS execution affecting FCP and TTI.", width="800", height="494" %}
</figure>

With server-side rendering, users are less likely to be left waiting for CPU-bound JavaScript to run before they can use your site. Even where [third-party JS](/optimizing-content-efficiency-loading-third-party-javascript/) can't be avoided, using server-side rendering to reduce your own first-party [JavaScript costs](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4) can give you more [budget](https://medium.com/@addyosmani/start-performance-budgeting-dabde04cf6a3) for the rest. However, there is one potential trade-off with this approach: generating pages on the server takes time, which can may result in a higher TTFB.

Whether server-side rendering is enough for your application largely depends on what type of experience you are building. There is a long-standing debate over the correct applications of server-side rendering versus client-side rendering, but it's important to remember that you can opt to use server-side rendering for some pages and not others. Some sites have adopted hybrid rendering techniques with success. [Netflix](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9) server-renders its relatively static landing pages, while [prefetching](https://dev.to/addyosmani/speed-up-next-page-navigations-with-prefetching-4285) the JS for interaction-heavy pages, giving these heavier client-rendered pages a better chance of loading quickly.

Many modern frameworks, libraries and architectures make it possible to render the same application on both the client and the server. These techniques can be used for server-side rendering. However, it's important to note that architectures where rendering happens both on the server _and_ on the client are their own class of solution with very different performance characteristics and tradeoffs. React users can use [server DOM APIs](https://react.dev/reference/react-dom/server) or solutions built atop them like [Next.js](https://nextjs.org/) for server-side rendering. Vue users can look at Vue's [server-side rendering guide](https://vuejs.org/guide/scaling-up/ssr.html) or [Nuxt](https://nuxtjs.org). Angular has [Universal](https://angular.io/guide/universal). Most popular solutions employ some form of hydration though, so be aware of the approach in use before selecting a tool.

## Static rendering

[Static rendering](https://frontarm.com/articles/static-vs-server-rendering/) happens at build-time. This apporach offers a fast FCP, and also a lower TBT and INP—assuming the amount of client-side JS is limited. Unlike server-side rendering, it also manages to achieve a consistently fast TTFB, since the HTML for a page doesn't have to be dynamically generated on the server. Generally, static rendering means producing a separate HTML file for each URL ahead of time. With HTML responses generated in advance, static renders can be deployed to multiple CDNs to take advantage of edge caching.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/SRsl2UcHyJquzuJkdTHR.png", alt="Diagram showing static rendering and optional JS execution affecting FCP and TTI.", width="800", height="613" %}
</figure>

Solutions for static rendering come in all shapes and sizes. Tools like [Gatsby](https://www.gatsbyjs.org) are designed to make developers feel like their application is being rendered dynamically rather than generated as a build step. Static site generation tools such as [11ty](https://www.11ty.dev/), [Jekyll](https://jekyllrb.com), and [Metalsmith](https://metalsmith.iooperationalizing-node-js-for-server-side-rendering-c5ba718acfc9speedier-server-side-rendering-in-react-16-with-component-caching-e8aa677929b1) embrace their static nature, providing a more template-driven approach.

{% Aside %}
Abstractions of popular frameworks such as Next.js or Nuxt offer both static rendering and server-side rendering. This allows developers to opt into static rendering for pages that qualify, or use server-side rendering for pages that need to be dynamically generated in response to a request.
{% endAside %}

One of the downsides to static rendering is that individual HTML files must be generated for every possible URL. This can be challenging or even infeasible when you can't predict what those URLs will be ahead of time, or for sites with a large number of unique pages.

React users may be familiar with Gatsby, [Next.js static export](https://nextjs.org/learn/excel/static-html-export/) or [Navi](https://frontarm.com/navi/)—all of these make it convenient to author pages using components. However, it's important to understand the difference between static rendering and prerendering: static rendered pages are interactive without the need to execute much client-side JavaScript, whereas prerendering improves the FCP of a Single Page Application that must be booted on the client in order for pages to be truly interactive.

If you're unsure whether a given solution is static rendering or prerendering, try disabling JavaScript and load the page you want to test. For statically rendered pages, most of the functionality will still exist without JavaScript enabled. For prerendered pages, there may still be some basic functionality like links, but most of the page will be inert.

Another useful test is to use [network throttling in Chrome DevTools](https://developer.chrome.com/docs/devtools/device-mode/#network), and observe how much JavaScript has been downloaded before a page becomes interactive. Prerendering generally requires more JavaScript to become interactive, and that JavaScript tends to be more complex than the [progressive enhancement](https://developer.mozilla.org/docs/Glossary/Progressive_Enhancement) approach used by static rendering.

## Server-side rendering versus static rendering

Server-side rendering is not a silver bullet—its dynamic nature can come with significant compute overhead costs. Many server-side rendering solutions don't flush early, can delay TTFB, or double the data being sent (for example, inlined state used by JavaScript on the client). In React, `renderToString()` can be slow as it's synchronous and single-threaded. [Newer React server DOM APIs](https://react.dev/reference/react-dom/server) supporting streaming, which can get the initial part of an HTML response to the browser sooner while the rest of it is still being generated on the server.

Getting server-side rendering "right" can involve finding or building a solution for [component caching](https://medium.com/@reactcomponentcaching/), managing memory consumption, applying [memoization](https://speakerdeck.com/maxnajim/hastening-react-ssr-with-component-memoization-and-templatization) techniques, and other concerns. You're generally processing/rebuilding the same application multiple times—once on the client and once on the server. Just because server-side rendering can make something show up sooner doesn't suddenly mean you have less work to do—if you have a lot of work on the client after a server-generated HTML response arrives on the client, this can still lead to higher TBT and INP for your website.

Server-side rendering produces HTML on-demand for each URL, but can be slower than just serving static rendered content. If you can put in the additional leg-work, server-side rendering plus [HTML caching](https://freecontent.manning.com/caching-in-react/) can significantly reduce server render time. The upside to server-side rendering is the ability to pull more "live" data and respond to a more complete set of requests than is possible with static rendering. Pages requiring personalization are a concrete example of the type of request that would not work well with static rendering.

Server-side rendering can also present interesting decisions when building a [PWA](/progressive-web-apps/): is it better to use full-page [service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/) caching, or just server-render individual pieces of content?

## Client-side rendering

Client-side rendering means rendering pages directly in the browser with JavaScript. All logic, data fetching, templating and routing are handled on the client rather than the server. The effective outcome is that more passed to the user's device from the server, and that comes with its own set of trade-offs.

Client-side rendering can be difficult to get and keep fast for mobile devices. If minimal work is done, client-side rendering can approach the performance of pure server-side rendering, keeping a [tight JavaScript budget](https://mobile.twitter.com/HenrikJoreteg/status/1039744716210950144) and delivering value in as few [round-trips](https://en.wikipedia.org/wiki/Round-trip_delay_time) as possible. Critical scripts and data can be delivered sooner using `<link rel=preload>`, which gets the parser working for you sooner. Patterns like [PRPL](/apply-instant-loading-with-prpl/) are also worth evaluating in order to ensure initial and subsequent navigations feel instant.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/JFxoxQe847ntctVOdn5u.png", alt="Diagram showing client-side rendering affecting FCP and TTI.", width="800", height="322" %}
</figure>

The primary downside to client-side rendering is that the amount of JavaScript required tends to grow as an application grows, which can have negative effects on a page's INP. This becomes especially difficult with the addition of new JavaScript libraries, polyfills and third-party code, which compete for processing power and must often be processed before a page's content can be rendered.

Experiences that use client-side rendering that rely on large JavaScript bundles should consider [aggressive code-splitting](/reduce-javascript-payloads-with-code-splitting/) to lower TBT and INP during page load, and be sure to lazy-load JavaScript—"serve only what you need, when you need it". For experiences with little or no interactivity, server-side rendering can represent a more scalable solution to these issues.

For folks building single page applications, identifying core parts of the user interface shared by most pages means you can apply the [application shell caching](https://developer.chrome.com/blog/app-shell/) technique. Combined with service workers, this can dramatically improve perceived performance on repeat visits, as the application shell HTML and its dependencies can be loaded from `CacheStorage` very quickly.

## Combining server-side rendering and client-side rendering via rehydration

This approach attempts to smooth over the trade-offs between client-side rendering and server-side rendering by doing both. Navigation requests like full page loads or reloads are handled by a server that renders the application to HTML, then the JavaScript and data used for rendering is embedded into the resulting document. When done carefully, this achieves a fast FCP just like server-side rendering, then "picks up" by rendering again on the client using a technique called [(re)hydration](https://react.dev/reference/react-dom/client/hydrateRoot). This is an effective solution, but it can come with considerable performance drawbacks.

The primary downside of server-side rendering with rehydration is that it can have a significant negative impact on TBT and INP, even if it improves FCP. Server-side rendered pages can deceptively appear to be loaded and interactive, but can't actually respond to input until the client-side scripts for components are executed and event handlers have been attached. This can take seconds or even minutes on mobile.

Perhaps you've experienced this yourself—for a period of time after it looks like a page has loaded, clicking or tapping does nothing. This quickly becoming frustrating, as the user is left to wonder why nothing is happening when they try to interact with the page.

### A rehydration problem: one app for the price of two

Rehydration issues can often be worse than delayed interactivity due to JavaScript. In order for the client-side JavaScript to be able to accurately "pick up" where the server left off without having to re-request all of the data the server used to render its HTML, current server-side rendering solutions generally serialize the response from a UI's data dependencies into the document as script tags. The resulting HTML document contains a high level of duplication:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/CwHQGXjA4qRyVa4pGdXT.png", alt="HTML document
containing serialized UI, inlined data and a bundle.js script", width="800", height="447" %}
</figure>

As you can see, the server is returning a description of the application's UI in response to a navigation request, but it's also returning the source data used to compose that UI, and a complete copy of the UI's implementation which then boots up on the client. Only after `bundle.js` has finished loading and executing does this UI become interactive.

Performance metrics collected from real websites using server-side rendering and rehydration indicate its use should be discouraged. Ultimately, the reason comes down to the user experience: it's extremely easy to end up leaving users in an "uncanny valley", where interactivity feels absent even though the page _appears_ to be ready.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/aXn4IcnNfFb2SvaYJPWU.png", alt="Diagram showing client rendering negatively affecting TTI.", width="800", height="270" %}
</figure>

There's hope for server-side rendering with rehydration, though. In the short term, only using server-side rendering for highly cacheable content can reduce TTFB, producing similar results to prerendering. Rehydrating [incrementally](https://www.emberjs.com/blog/2017/10/10/glimmer-progress-report.html), progressively, or partially may be the key to making this technique more viable in the future.

## Streaming server-side rendering and progressive rehydration

Server-side rendering has had a number of developments over the last few years.

[Streaming server-side rendering](https://mxstbr.com/thoughts/streaming-ssr) allows you to send HTML in chunks that the browser can progressively render as it's received. This can result in a fast FCP, as markup arrives to users faster. In React, streams being asynchronous in [`renderToPipeableStream()`]—compared to synchronous `renderToString()`—means backpressure is handled well.

Progressive rehydration is also worth considering, and something that React has [landed](https://github.com/facebook/react/pull/14717). With this approach, individual pieces of a server-rendered application are "booted up" over time, rather than the current common approach of initializing the entire application at once. This can help reduce the amount of JavaScript required to make pages interactive, since client-side upgrading of low priority parts of the page can be deferred to prevent blocking the main thread, allowing user interactions to occur sooner after the user initiates them.

Progressive rehydration can also help avoid one of the most common server-side rendering rehydration pitfalls, where a server-rendered DOM tree gets destroyed and then immediately rebuilt—most often because the initial synchronous client-side render required data that wasn't quite ready, perhaps awaiting resolution of a `Promise`.

### Partial rehydration

Partial rehydration has proven difficult to implement. This approach is an extension of the idea of progressive rehydration, where the individual pieces (components/views/trees) to be progressively rehydrated are analyzed and those with little interactivity or no reactivity are identified. For each of these mostly-static parts, the corresponding JavaScript code is then transformed into inert references and decorative functionality, reducing their client-side footprint to nearly zero.

The partial hydration approach comes with its own issues and compromises. It poses some interesting challenges for caching, and client-side navigation means we can't assume server-rendered HTML for inert parts of the application will be available without a full page load.

### Trisomorphic rendering

If [service workers](https://developer.chrome.com/docs/workbox/service-worker-overview/) are an option for you, "trisomorphic" rendering may also be of interest. It's a technique where you can use streaming server-side rendering for initial/non-JS navigations, and then have your service worker take on rendering of HTML for navigations after it has been installed. This can keep cached components and templates up to date and enables SPA-style navigations for rendering new views in the same session. This approach works best when you can share the same templating and routing code between the server, client page, and service worker.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/EnHAdI7a6mhv7iU81iRe.png", alt="Diagram of Trisomorphic rendering, showing a browser and service worker communicating with the server.", width="800", height="504" %}
</figure>

## SEO considerations

Teams often factor in the impact of SEO when choosing a strategy for rendering on the web. Server-side rendering is often chosen for delivering a "complete looking" experience crawlers can interpret with ease. Crawlers [may understand JavaScript](/discoverable/how-search-works), but there are often [limitations](https://developers.google.com/search/docs/guides/rendering) worth being aware of in how they render. Client-side rendering can work, but often not without additional testing and leg-work. More recently, [dynamic rendering](https://developers.google.com/search/docs/advanced/javascript/dynamic-rendering) has also become an option worth considering if your architecture depends heavily on client-side JavaScript.

When in doubt, the [mobile friendly test tool](https://search.google.com/test/mobile-friendly) is invaluable for testing that your chosen approach does what you're hoping for. It shows a visual preview of how any page appears to Google's crawler, the serialized HTML content found (after JavaScript executed), and any errors encountered during rendering.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/2OH46CfDEvODtabXpKZp.png", alt="Screenshot of the Mobile Friendly Test UI.", width="800", height="817" %}
</figure>

## Wrapping up

When deciding on an approach to rendering, measure and understand what your bottlenecks are. Consider whether static rendering or server-side rendering can get you most of the way there. It's perfectly okay to mostly ship HTML with minimal JavaScript to get an experience interactive. Here's a handy infographic showing the server-client spectrum:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/FZ7p6ZImdJbM82E0ZwMF.png", alt="Infographic showing the spectrum of options described in this article.", width="800", height="530" %}
</figure>

## Credits

Thanks to everyone for their reviews and inspiration:

Jeffrey Posnick,
Houssein Djirdeh,
Shubhie Panicker,
Chris Harrelson, and
Sebastian Markbåge

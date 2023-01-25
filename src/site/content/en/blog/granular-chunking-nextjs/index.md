---
title: Improved Next.js and Gatsby page load performance with granular chunking
subhead: A newer webpack chunking strategy in Next.js and Gatsby minimizes duplicate code to improve page load performance.
authors:
  - houssein
date: 2020-04-29
hero: image/admin/G5NYXIUQZ3hUfbyOnt0r.png
alt: Jigsaw pieces connecting
description: |
  Learn how both Next.js and Gatsby have improved their build output to minimize duplicate code and improve page load performance
tags:
  - blog
  - performance
  - frameworks
---

Chrome is [collaborating](/advancing-framework-ecosystem-cds-2019/) with tooling and
frameworks in the JavaScript open-source ecosystem. A number of newer optimizations were recently
added to improve the loading performance of [Next.js](https://nextjs.org/) and
[Gatsby](https://www.gatsbyjs.org/). This article covers an improved granular chunking strategy
that is now shipped by default in both frameworks.

## Introduction

Like many web frameworks, Next.js and Gatsby use [webpack](https://webpack.js.org/) as their core
bundler. webpack v3 introduced
[`CommonsChunkPlugin`](https://webpack.js.org/plugins/commons-chunk-plugin/) to make it possible to
output modules shared between different entry points in a single (or few) "commons" chunk (or
chunks). Shared code can be downloaded separately and stored in the browser cache early on which can
result in a better loading performance.

This pattern became popular with many single-page application frameworks adopting an entrypoint and
bundle configuration that looked like this:

{% Img src="image/admin/r4QB67AXzmPMgxcxgbQF.png", alt="Common entrypoint and bundle configuration", width="800", height="569", class="w-screenshot w-screenshot--filled" %}

Although practical, the concept of bundling all shared module code into a single chunk has its
limitations. Modules not shared in every entry point can be downloaded for routes that do not use it
resulting in more code being downloaded than necessary. For example, when `page1` loads
the `common` chunk, it loads the code for `moduleC` even though `page1` doesn't use `moduleC`.
For this reason, along with a few others, webpack v4 removed the plugin in favor of a new
one: [`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/).

## Improved Chunking

The default settings for `SplitChunksPlugin`  works well for most users. Multiple split chunks are
created depending on a number of [conditions](https://webpack.js.org/plugins/split-chunks-plugin/#defaults)
to prevent fetching duplicated code across multiple routes.

However, many web frameworks that use this plugin still follow a "single-commons" approach to chunk
splitting. Next.js, for example, would generate a `commons` bundle that contained any module that is
used in more than 50% of pages and all framework dependencies (`react`, `react-dom`, and so on).

```javascript/10,15
const splitChunksConfigs = {
  …
  prod: {
    chunks: 'all',
    cacheGroups: {
      default: false,
      vendors: false,
      commons: {
        name: 'commons',
        chunks: 'all',
        minChunks: totalPages > 2 ? totalPages * 0.5 : 2,
      },
      react: {
        name: 'commons',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react|react-dom|scheduler|use-subscription)[\\/]/,
      },
    },
  },
```
Although including framework-dependent code into a shared chunk means that it can be downloaded and
cached for any entrypoint, the usage-based heuristic of including common modules used in more than
_half of pages_ isn't very effective. Modifying this ratio would only result in one of two outcomes:

+   If you reduce the ratio, more unnecessary code gets downloaded.
+   If you increase the ratio, more code gets duplicated across multiple routes.

To solve this problem, Next.js adopted a [different
configuration](https://github.com/zeit/next.js/pull/7696) for`SplitChunksPlugin` that reduces
unnecessary code for any route.

+   Any sufficiently large third-party module (greater than 160 KB) is split into its own individual
    chunk
+   A separate `frameworks` chunk is created for framework dependencies (`react`, `react-dom`, and
    so on)
+   As many shared chunks as needed are created (up to 25)
+   The minimum size for a chunk to be generated is changed to 20 KB

This granular chunking strategy provides the following benefits:

+   **Page load times are improved**. Emitting multiple shared chunks, instead of a single one,
    minimizes the amount of unneeded (or duplicate) code for any entrypoint.
+   **Improved caching during navigations**. Splitting large libraries and framework dependencies
    into separate chunks reduces the possibility of cache invalidation since both are unlikely to
    change until an upgrade is made.

You can see the entire configuration that Next.js adopted in [`webpack-config.ts`](https://github.com/vercel/next.js/blob/e125d905a0dd93d247c6122d349c2c90268f0713/packages/next/build/webpack-config.ts#L352-L429).

## More HTTP requests

`SplitChunksPlugin` defined the basis for granular chunking, and applying this approach to a
framework like Next.js was not an entirely new concept. Many frameworks, however, still continued to
use a single heuristic and "commons" bundle strategy for a few reasons. This includes the concern that
many more HTTP requests can negatively affect site performance.

Browsers can only open a limited number of TCP connections to a single origin (6 for Chrome), so
minimizing the number of chunks outputted by a bundler can ensure that the total number of requests
stays under this threshold. However, this only holds true for HTTP/1.1. Multiplexing in HTTP/2
allows for multiple requests to be streamed in parallel using a single connection over a single
origin. In other words, we generally do not need to worry about limiting the number of chunks
emitted by our bundler.

{% Aside %}
It is important to note that different browsers take [different
approaches](https://calendar.perfplanet.com/2018/http2-prioritization/) to prioritize specific
resources when many are requested over the same TCP connection. Some servers and CDNs also handle
prioritization differently (see ["Tracking HTTP/2 Prioritization
Issues"](https://github.com/andydavies/http2-prioritization-issues#cdns--cloud-hosting-services)).
{% endAside %}

[All major browsers](https://caniuse.com/#feat=http2) support HTTP/2. The Chrome and Next.js teams
wanted to see if increasing the number of requests by splitting Next.js's single "commons" bundle
into multiple shared chunks would affect loading performance in any way. They began by measuring the
performance of a single site while modifying the maximum number of parallel requests using the
[`maxInitialRequests`](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksmaxinitialrequests)
property.

{% Img src="image/admin/Psq42HGvyk1hiaCdEJxc.png", alt="Page load performance with increased number of requests", width="800", height="495" %}

In an average of three runs of multiple trials on a single web page, the
[`load`](https://developer.mozilla.org/docs/Web/API/Window/load_event),
[start-render](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Quick%20Start%20Guide.md#start-render)
and [First Contentful Paint](/fcp) times all remained about the same when varying the max initial
request count (from 5 to 15). Interestingly enough, we noticed a slight performance overhead only
after splitting aggressively to hundreds of requests.

{% Img src="image/admin/Ykz3Zm35JUVmtqX1U6cI.png", alt="Page load performance with hundreds of requests", width="800", height="495" %}

This showed that staying under a reliable threshold (20~25 requests) struck the right balance
between loading performance and caching efficiency. After some baseline testing, 25 was selected as
the `maxInitialRequest` count.

Modifying the maximum number of requests that happen in parallel resulted in more than a single
shared bundle, and separating them appropriately for each entry point significantly reduced the
amount of unneeded code for the same page.

{% Img src="image/admin/z2yOSP2fpfu51OEpyTGS.png", alt="JavaScript payload reductions with increased chunking", width="800", height="495" %}

This experiment was only about modifying the number of requests to see if there would be any
negative effect on page load performance. The results suggest that setting `maxInitialRequests` to
`25` on the test page was optimal because it reduced the JavaScript payload size without slowing
down the page. The total amount of JavaScript that was needed to hydrate the page still remained
about the same, which explains why page load performance didn't necessarily improve with the reduced
amount of code.

webpack uses 30 KB as a default minimum size for a chunk to be generated. However, coupling a
`maxInitialRequests` value of 25 with a 20 KB minimum size instead resulted in better caching.

## Size reductions with granular chunks

Many frameworks, including Next.js, rely on client-side routing (handled by JavaScript) to inject
newer script tags for every route transition. But how do they predetermine these dynamic chunks at build time?

Next.js uses a server-side build manifest file to determine which outputted chunks are used by
different entry points. To provide this information to the client as well, an abridged client-side
build manifest file was created to map all the dependencies for every entry point.

```javascript
// Returns a promise for the dependencies for a particular route
getDependencies (route) {
  return this.promisedBuildManifest.then(
    man => (man[route] && man[route].map(url => `/_next/${url}`)) || []
  )
}
```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3XG4VlLQEQ724fvhynvM.png", alt="Output of multiple shared chunks in a Next.js application.", width="800", height="488", class="w-screenshot w-screenshot--filled" %}
</figure>

This newer granular chunking strategy was first rolled out in Next.js behind a flag, where it was tested on a
number of early adopters. Many saw significant reductions to the total JavaScript used for their
entire site:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Website</th>
        <th>Total JS Change</th>
        <th>% Difference</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://www.barnebys.com/">https://www.barnebys.com/</a></td>
        <td>-238 KB</td>
        <td>-23%</td>
      </tr>
      <tr>
        <td><a href="https://sumup.com/">https://sumup.com/</a></td>
        <td>-220 KB</td>
        <td>-30%</td>
      </tr>
      <tr>
        <td><a href="https://www.hashicorp.com/">https://www.hashicorp.com/</a></td>
        <td>-11 MB</td>
        <td>-71%</td>
      </tr>
    </tbody>
    <caption>JavaScript size reductions - across all routes (compressed)</caption>
  </table>
</div>

The final version was shipped by default in [version 9.2](https://nextjs.org/blog/next-9-2).

## Gatsby

[Gatsby](https://www.gatsbyjs.org/) used to follow the same approach of using a usage-based
heuristic for defining common modules:

```javascript/13
config.optimization = {
  …
  splitChunks: {
    name: false,
    chunks: `all`,
    cacheGroups: {
      default: false,
      vendors: false,
      commons: {
        name: `commons`,
        chunks: `all`,
        // if a chunk is used more than half the components count,
        // we can assume it's pretty global
        minChunks: componentsCount > 2 ? componentsCount * 0.5 : 2,
      },
      react: {
        name: `commons`,
        chunks: `all`,
        test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
      },
```

By optimizing their webpack configuration to adopt a similar granular chunking strategy, they also
noticed sizeable JavaScript reductions in many large sites:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Website</th>
        <th>Total JS Change</th>
        <th>% Difference</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://www.gatsbyjs.org/">https://www.gatsbyjs.org/</a></td>
        <td>-680 KB</td>
        <td>-22%</td>
      </tr>
      <tr>
        <td><a href="https://www.thirdandgrove.com/">https://www.thirdandgrove.com/</a></td>
        <td>-390 KB</td>
        <td>-25%</td>
      </tr>
      <tr>
        <td><a href="https://ghost.org/">https://ghost.org/</a></td>
        <td>-1.1 MB</td>
        <td>-35%</td>
      </tr>
      <tr>
        <td><a href="https://reactjs.org/">https://reactjs.org/</a></td>
        <td>-80 Kb</td>
        <td>-8%</td>
      </tr>
    </tbody>
    <caption>JavaScript size reductions - across all routes (compressed)</caption>
  </table>
</div>

Take a look at the [PR](https://github.com/gatsbyjs/gatsby/pull/22253) to understand how they
implemented this logic into their webpack configuration, which is shipped by default in v2.20.7.

## Conclusion

The concept of shipping granular chunks is not specific to Next.js, Gatsby or even webpack. Everyone
should consider improving their application's chunking strategy if it follows a large "commons"
bundle approach, regardless of the framework or module bundler used.

+   If you would like to see the same chunking optimizations applied to a vanilla React application,
    take a look at this [sample React
    app](https://glitch.com/edit/#!/webpack-granular-split-chunks?path=webpack.config.js). It uses a
    simplified version of the granular chunking strategy and can help you start applying the same
    sort of logic to your site.
+   For Rollup, chunks are created granularly by default. Take a look at
    [`manualChunks`](https://rollupjs.org/guide/en/#manualchunks) if you would like to manually
    configure the behavior.

---
title: Don't fight the browser preload scanner
subhead: |
  Find out what the browser preload scanner is, how it helps performance, and how you can stay out of its way.
authors:
  - jlwagner
date: 2022-05-13
updated: 2022-10-11
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ZYfhboCPqPWawQ5LzWKO.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/irM6kTXZoP0MmXGtHOSa.jpg
alt: A close-up photograph of a screen with various bits of HTML markup shown in a text editor.
description: |
  Find out what the browser preload scanner is, how it helps performance, and how you can stay out of its way.
tags:
  - blog
  - performance
  - web-vitals
---

One overlooked aspect of optimizing page speed involves knowing a bit about browser internals. Browsers make certain optimizations to improve performance in ways that we as developers can't&mdash;but only so long as those optimizations aren't unintentionally thwarted.

One internal browser optimization to understand is the browser preload scanner. This post will cover how the preload scanner works&mdash;and more importantly, how you can avoid getting in its way.

## What's a preload scanner?

Every browser has a primary HTML parser that [tokenizes](https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization) raw markup and processes it into [an object model](https://developer.mozilla.org/docs/Web/API/Document_Object_Model). This all merrily goes on until the parser pauses when it finds a [blocking resource](/render-blocking-resources/), such as a stylesheet loaded with a `<link>` element, or script loaded with a `<script>` element without an `async` or `defer` attribute.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/mXRoJneD6CbMAqaTqNZW.svg", alt="HTML parser diagram.", width="333", height="450" %}
  <figcaption>
    <strong>Fig. 1:</strong> A diagram of how the browser's primary HTML parser can be blocked. In this case, the parser runs into a <code>&lt;link&gt;</code> element for an external CSS file, which blocks the browser from parsing the rest of the document&mdash;or even rendering any of it&mdash;until the CSS is downloaded and parsed.
  </figcaption>
</figure>

In the case of CSS files, both parsing and rendering are blocked in order to prevent a [flash of unstyled content (FOUC)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content), which is when an unstyled version of a page can be seen briefly before styles are applied to it.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/8LkMd46pUlwgfYvmTBrO.png", alt="The web.dev home page in an unstyled state (left) and the styled state (right).", width="800", height="748", loading="lazy" %}
  <figcaption>
    <strong>Fig. 2:</strong> A simulated example of FOUC. At left is the front page of web.dev without styles. At right is the same page with styles applied. The unstyled state can occur in a flash if the browser doesn't block rendering while a stylesheet is being downloaded and processed.
  </figcaption>
</figure>

The browser also blocks parsing and rendering of the page when it encounters `<script>` elements without a `defer` or `async` attribute.

{% Aside %}
  Scripts loaded from `<script>` elements with a [`type=module` attribute](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules#applying_the_module_to_your_html) are deferred by default.
{% endAside %}

The reason for this is that the browser can't know for sure if any given script will modify the DOM while the primary HTML parser is still doing its job. This is why it's been a common practice to load your JavaScript at the end of the document so that the effects of blocked parsing and rendering become marginal.

These are good reasons for why the browser _should_ block both parsing and rendering. Yet, blocking either of these important steps is undesirable, as they can hold up the show by delaying the discovery of other important resources. Thankfully, browsers do their best to mitigate these problems by way of a secondary HTML parser called a _preload scanner_.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/6lccoVh4f6IJXA8UBKxH.svg", alt="A diagram of both the primary HTML parser (left) and the preload scanner (right), which is the secondary HTML parser.", width="657", height="450", loading="lazy" %}
  <figcaption>
    <strong>Fig. 3:</strong> A diagram depicting how the preload scanner works in parallel with the primary HTML parser to speculatively load assets. Here, the primary HTML parser is blocked as it loads and processes CSS before it can begin processing image markup in the <code>&lt;body&gt;</code> element, but the preload scanner can look ahead in the raw markup to find that image resource and begin loading it before the primary HTML parser is unblocked.
  </figcaption>
</figure>

[A preload scanner's role is speculative](https://html.spec.whatwg.org/multipage/parsing.html#speculative-html-parsing), meaning that it examines raw markup in order to find resources to opportunistically fetch before the primary HTML parser would otherwise discover them.

## How to tell when the preload scanner is working

The preload scanner exists _because_ of blocked rendering and parsing. If these two performance issues never existed, the preload scanner wouldn't be very useful. The key to figuring out whether a web page benefits from the preload scanner depends on these blocking phenomena. To do that, you can introduce an artificial delay for requests to find out where the preload scanner is working.

Take [this page](https://preload-scanner-fights.glitch.me/artifically-delayed-requests.html) of basic text and images with a stylesheet as an example. Because CSS files block both rendering and parsing, you introduce an artificial delay of two seconds for the stylesheet through a proxy service. This delay makes it easier to see in the network waterfall where the preload scanner is working.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Gtw08XaoFETKEauBBbBl.png", alt="The WebPageTest network waterfall chart illustrates an artificial delay of 2 seconds imposed on the styleesheet.", width="800", height="219", loading="lazy" %}
  <figcaption>
    <strong>Fig. 4:</strong> A <a href="https://www.webpagetest.org/" rel="nofollow noopener">WebPageTest</a> <a href="https://developer.chrome.com/docs/devtools/network/reference/#waterfall" rel="noopener">network waterfall chart</a> of <a href="https://preload-scanner-fights.glitch.me/artifically-delayed-requests.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. Even though the stylesheet is artificially delayed through a proxy by two seconds before it begins to load, the image located later in the markup payload is discovered by the preload scanner.
  </figcaption>
</figure>

As you can see in the waterfall, the preload scanner discovers the `<img>` element _even while rendering and document parsing is blocked_. Without this optimization, the browser can't fetch things opportunistically during the blocking period, and more resource requests would be consecutive rather than concurrent.

With that toy example out of the way, let's take a look at some real-world patterns where the preload scanner can be defeated&mdash;and what can be done to fix them.

{% Aside %}
  This smattering of patterns isn't an exhaustive list, just some common ones.
{% endAside %}

## Injected `async` scripts

Let's say you've got HTML in your `<head>` that includes some inline JavaScript like this:

```html
<script>
  const scriptEl = document.createElement('script');
  scriptEl.src = '/yall.min.js';

  document.head.appendChild(scriptEl);
</script>
```

Injected scripts are [`async`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-async) by default, so when this script is injected, it will behave as if the `async` attribute was applied to it. That means it will run as soon as possible and not block rendering. Sounds optimal, right? Yet, if you presume that this inline `<script>` comes after a `<link>` element that loads an external CSS file, you'll get a suboptimal result:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/L9ltNSHa6D4FI6YPw1vF.png", alt="This WebPageTest chart shows the preload scan defeated when a script is injected.", width="800", height="219", loading="lazy" %}
  <figcaption>
    <strong>Fig. 5:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/injected-async-script.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page contains a single stylesheet and an injected <code>async</code> script. The preload scanner can't discover the script during the render blocking phase, because it's injected on the client.
  </figcaption>
</figure>

Let's break down what happened here:

1. At 0 seconds, the main document is requested.
2. At 1.4 seconds, the first byte of the navigation request arrives.
3. At 2.0 seconds, the CSS and image are requested.
4. Because the parser is blocked loading the stylesheet and the inline JavaScript that injects the `async` script comes _after_ that stylesheet at 2.6 seconds, the functionality that script provides isn't available as soon as it could be.

This is suboptimal because the request for the script occurs only after the stylesheet has finished downloading. This delays the script from running as soon as possible. This could have the potential to affect a page's [Time to Interactive (TTI)](/tti/). By contrast, because the `<img>` element is discoverable in the server-provided markup, it's discovered by the preload scanner.

So, what happens if you use a regular `<script>` tag with the `async` attribute as opposed to injecting the script into the DOM?

```html
<script src="/yall.min.js" async></script>
```

This is the result:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Hb4IRf5XDVBpfakZbteE.png", alt="A WebPageTest network waterfall depicting how an async script loaded by using the HTML &lt;script&gt; element is still discoverable by the browser preload scanner, even though the browser's primary HTML parser is blocked while downloading and processing a stylesheet.", width="800", height="219", loading="lazy" %}
  <figcaption>
    <strong>Fig. 6:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/inline-async-script.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page contains a single stylesheet and a single <code>async</code> <code>&lt;script&gt;</code> element. The preload scanner discovers the script during the render blocking phase, and loads it concurrently with the CSS.
  </figcaption>
</figure>

There may be some temptation to suggest that these issues could be remedied by using [`rel=preload`](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload). This would certainly work, but it may carry some side effects. After all, why use `rel=preload` to fix a problem that can be avoided by _not_ injecting a `<script>` element into the DOM?

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/O6KzUOeFD2cCFg11XK8W.png", alt="A WebPageTest waterfall showing how the rel=preload resource hint is used to promote discovery of an async injected script&mdash;albeit in a way that may have unintended side-effects.", width="800", height="219", loading="lazy" %}
  <figcaption>
    <strong>Fig. 7:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/preloaded-injected-async-script.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page contains a single stylesheet and an injected <code>async</code> script, but the <code>async</code> script is preloaded to ensure it is discovered sooner.
  </figcaption>
</figure>

Preloading "fixes" the problem here, but it introduces a new problem: the `async` script in the first two demos&mdash;despite being loaded in the `<head>`&mdash;are loaded at "Low" priority, whereas the stylesheet is loaded at "Highest" priority. In the last demo where the `async` script is preloaded, the stylesheet is still loaded at "Highest" priority, but the script's priority has been promoted to "High".

{% Aside %}
  Resource priority can be discovered in the network tab in modern browsers. For Chrome DevTools in particular, [you can right click on the column headers](https://developer.chrome.com/docs/devtools/network/reference/#columns) to ensure the priority column is visible. Be sure to test in multiple browsers, as resource priority varies by browser and other factors.
{% endAside %}

When a resource's priority is raised, the browser allocates more bandwidth to it. This means that&mdash;even though the stylesheet has the highest priority&mdash;the script's raised priority may cause bandwidth contention. That could be a factor on slow connections, or in cases where resources are quite large.

The answer here is straightforward: if a script is needed during startup, don't defeat the preload scanner by injecting it into the DOM. Experiment as needed with `<script>` element placement, as well as with attributes such as `defer` and `async`.

{% Aside %}
  Ilya Grigorik has written [an informative post](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/) that goes into great detail about injected `async` scripts. Give it a read if you want a deep dive into this topic.
{% endAside %}

## Lazy loading with JavaScript

Lazy loading is a great method of conserving data, one that's often applied to images. However, sometimes lazy loading is incorrectly applied to images that are "above the fold", so to speak.

This introduces potential issues with resource discoverability where the preload scanner is concerned, and can unnecessarily delay how long it takes to discover a reference to an image, download it, decode it, and present it. Let's take this image markup for example:

```html
<img data-src="/sand-wasp.jpg" alt="Sand Wasp" width="384" height="255">
```

The use of a `data-` prefix is a common pattern in JavaScript-powered lazy loaders. When the image is scrolled into the viewport, the lazy loader strips the `data-` prefix, meaning that in the preceding example, `data-src` becomes `src`. This update prompts the browser to fetch the resource.

This pattern isn't problematic until it's applied to images that are in the viewport during startup. Because the preload scanner doesn't read the `data-src` attribute in the same way that it would an `src` (or `srcset`) attribute, the image reference isn't discovered earlier. Worse, the image is delayed from loading until _after_ the lazy loader JavaScript downloads, compiles, and executes.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Qu1Ghkpp2K5FUu2etfz7.png", alt="A WebPageTest network waterfall chart showing how a lazily-loaded image that is in the viewport during startup is necessarily delayed because the browser preload scanner can't find the image resource, and only loads when the JavaScript required for lazy loading to work loads. The image is discovered far later than it should be.", width="800", height="220", loading="lazy" %}
  <figcaption>
    <strong>Fig. 8:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/js-lazy-load-suboptimal.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The image resource is unnecessarily lazy-loaded, even though it is visible in the viewport during startup. This defeats the preload scanner and causes an unnecessary delay.
  </figcaption>
</figure>

Depending on the size of the image&mdash;which may depend on the size of the viewport&mdash;it may be a candidate element for [Largest Contentful Paint (LCP)](/lcp/). When the preload scanner cannot speculatively fetch the image resource ahead of time&mdash;possibly during the point at which the page's stylesheet(s) block rendering&mdash;LCP suffers.

{% Aside 'important' %}
  For more information on optimizing LCP beyond the scope of this article, read [Optimizing Largest Contentful Paint](/optimize-lcp/).
{% endAside %}

The solution is to change the image markup:

```html
<img src="/sand-wasp.jpg" alt="Sand Wasp" width="384" height="255">
```

This is the optimal pattern for images that are in the viewport during startup, as the preload scanner will discover and fetch the image resource more quickly.

<figure id="fig-9">
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/0pRjNYnUCcbrEHaaTJ3t.png", alt="A WebPageTest network waterfall chart depicting an loading scenario for an image in the viewport during startup. The image is not lazily loaded, which means it is not dependent on the script to load, meaning the preload scanner can discover it sooner.", width="800", height="220", loading="lazy" %}
  <figcaption>
    <strong>Fig. 9:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/js-lazy-load-optimal.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The preload scanner discovers the image resource before the CSS and JavaScript begin loading, which gives the browser a head start on loading it.
  </figcaption>
</figure>

The result in this simplified example is a 100-millisecond improvement in LCP on a slow connection. This may not seem like a huge improvement, but it is when you consider that the solution is a quick markup fix, and that most web pages are more complex than this set of examples. That means that LCP candidates may have to contend for bandwidth with many other resources, so optimizations like this become increasingly important.

{% Aside 'important' %}
  Images aren't the only resource type that can suffer from suboptimal lazy loading patterns. The [`<iframe>` element](https://developer.mozilla.org/docs/Web/HTML/Element/iframe) can also be affected, and since `<iframe>` elements can load many subresources, the impact of performance could be substantially worse.
{% endAside %}

## CSS background images

Remember that the browser preload scanner scans _markup_. It doesn't scan other resource types, such as CSS which may involve fetches for images referenced by the [`background-image` property](https://developer.mozilla.org/docs/Web/CSS/background-image).

Like HTML, browsers process CSS into its own object model, known as the [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model). If external resources are discovered as the CSSOM is constructed, those resources are requested at the time of discovery, and not by the preload scanner.

Let's say your page's [LCP candidate](/lcp/#what-elements-are-considered) is an element with a CSS `background-image` property. The following is what happens as resources load:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/YDBXJlSV1xN4SheYVQUY.png", alt="A WebPageTest network waterfall chart depicting a page with an LCP candidate loaded from CSS using the background-image property. Because the LCP candidate image is in a resource type that the browser preload scanner can't examine, the resource is delayed from loading until the CSS is downloaded and processed, delaying the LCP candidate's paint time.", width="800", height="206", loading="lazy" %}
  <figcaption>
    <strong>Fig. 10:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/css-background-image-no-preload.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page's LCP candidate is an element with a CSS <code>background-image</code> property (row 3). The image it requests doesn't begin fetching until the CSS parser finds it.
  </figcaption>
</figure>

In this case, the preload scanner isn't so much defeated as it is uninvolved. Even so, if an LCP candidate on the page is from a `background-image` CSS property, you're going to want to preload that image:

```html
<!-- Make sure this is in the <head> below any
     stylesheets, so as not to block them from loading -->
<link rel="preload" as="image" href="lcp-image.jpg">
```

{% Aside 'caution' %}
  If your LCP candidate is from a `background-image` CSS property, but that image varies based on the viewport size, you'll need to specify the [`imagesrcset` attribute](https://developer.mozilla.org/docs/Web/HTML/Element/link#attr-imagesrcset) on the `<link>` element.
{% endAside %}

That `rel=preload` hint is small, but it helps the browser discover the image sooner than it otherwise would:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/SdBeh352sU0rN5umquSQ.png", alt="A WebPageTest network waterfall chart showing a CSS background image (which is the LCP candidate) loading much sooner due to the use of a rel=preload hint. The LCP time improves by roughly 250 milliseconds.", width="800", height="206", loading="lazy" %}
  <figcaption>
    <strong>Fig. 11:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/css-background-image-with-preload.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page's LCP candidate is an element with a CSS <code>background-image</code> property (row 3). The <code>rel=preload</code> hint helps the browser to discover the image around 250 milliseconds sooner than without the hint.
  </figcaption>
</figure>

With the `rel=preload` hint, the LCP candidate is discovered sooner, lowering the LCP time. While that hint helps fix this issue, the better option may be to assess whether or not your image LCP candidate _has_ to be loaded from CSS. With an `<img>` tag, you'll have more control over loading an image that's appropriate for the viewport while allowing the preload scanner to discover it.

## Inlining too many resources

Inlining is a practice that places a resource inside of the HTML. You can inline stylesheets in `<style>` elements, scripts in `<script>` elements, and virtually any other resource using [base64 encoding](https://developer.mozilla.org/docs/Glossary/Base64).

Inlining resources is often faster than downloading them because a separate request isn't issued for the resource. It's right in the document, and loads instantly. However, there are drawbacks:

- If you're not caching your HTML&mdash;and you just can't if the HTML response is dynamic&mdash;the inlined resources are never cached. This affects performance because the inlined resources aren't reusable.
- If you inline too much, you delay the preload scanner from discovering resources in the document, because parsers for CSS and scripts have to do their thing before the preload scanner can continue on to discover other resources in the document.
- Even if you can cache the HTML, inlined resources aren't shared between documents. This reduces caching efficiency compared to external files that can be cached and reused across an entire origin.

Take [this page](https://preload-scanner-fights.glitch.me/inline-nothing.html) as an example. In certain conditions the LCP candidate is the image at the top of the page, and the CSS is in a separate file loaded by a `<link>` element. The page also uses four web fonts which are requested as separate files from the CSS resource.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/uDCAZc9Vkl9phYrZk2vW.png", alt="A WebPageTest network waterfall chart of page with an external CSS file with four fonts referenced in it. The LCP candidate image is discovered by the preload scanner in due course.", width="800", height="347", loading="lazy" %}
  <figcaption>
    <strong>Fig. 12:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/inline-nothing.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page's LCP candidate is an image loaded from an <code>&lt;img&gt;</code> element, but is discovered by the preload scanner because the CSS and the fonts required for the page load in separate resources, which avoids preventing the preload scanner from doing its job.
  </figcaption>
</figure>

Now what happens if the CSS _and_ all the fonts are inlined as base64 resources?

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/frUPqxpkkouS0eUWWFVc.png", alt="A WebPageTest network waterfall chart of page with an external CSS file with four fonts referenced in it. The preload scanner is delayed significantly from discovering the LCP image .", width="800", height="297", loading="lazy" %}
  <figcaption>
    <strong>Fig. 13:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/inline-everything.html" rel="noopener">a web page</a> run on Chrome on a mobile device over a simulated 3G connection. The page's LCP candidate is an image loaded from an <code>&lt;img&gt;</code> element, but the inlining of the CSS and its four font resources delays the preload scanner from discovering the image until those resources are fully parsed.
  </figcaption>
</figure>

The impact of inlining yields negative consequences for LCP in this example&mdash;and for performance in general. The version of the page that doesn't inling anything paints the LCP image in about 3.5 seconds. The page that inlines everything doesn't paint the LCP image until just over 7 seconds.

To be candid, there's more at play here than just the preload scanner. Inlining fonts is not a great strategy because base64 is an inefficient format for binary resources. Additionally, because external font resources aren't downloaded unless they're determined necessary by the CSSOM. When those fonts are inlined as base64, they're downloaded whether they're needed for the current page or not.

Could a preload improve things here? Sure. You _could_ preload the LCP image and reduce LCP time, but bloating your potentially uncacheable HTML with inlined resources has other negative performance consequences. [First Contentful Paint (FCP)](/fcp/) is also affected by this pattern. In the version of the page where nothing is inlined, FCP is roughly 2.7 seconds. In the version where everything is inlined, FCP is roughly 5.8 seconds.

Be very careful with inlining stuff into HTML, especially base64-encoded resources. In general it is not recommended, except for very small resources. Inline as little as possible, because inlining too much is playing with fire.

## Rendering markup with client-side JavaScript

There's no doubt about it: [JavaScript definitely affects page speed](https://almanac.httparchive.org/en/2021/performance#total-blocking-time-tbt). Not only do developers depend on it to provide interactivity, but there has also been a tendency to rely on it to deliver content itself. This leads to a better developer experience in some ways; but benefits for developers don't always translate into benefits for users.

One pattern that can defeat the preload scanner is rendering markup with client-side JavaScript:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ZhwXAzscucsECuG6XDRl.png", alt="A WebPageTest network waterfall showing a basic page with images and text rendered completely on the client in JavaScript. Because the markup is contained within JavaScript, the preload scanner can't detect any of the resources. All resources are additionally delayed due to the extra network and processing time that JavaScript frameworks require.", width="800", height="260", loading="lazy" %}
  <figcaption>
    <strong>Fig. 14:</strong> A WebPageTest network waterfall chart of <a href="https://preload-scanner-fights.glitch.me/client-rendered.html" rel="noopener">a client-rendered web page</a> run on Chrome on a mobile device over a simulated 3G connection. Because the content is contained in JavaScript and relies on a framework to render, the image resource in the client-rendered markup is hidden from the preload scanner. The equivalent server-rendered experience is depicted in <a href="#fig-9">Fig. 9</a>.
  </figcaption>
</figure>

When markup payloads are contained in and rendered entirely by JavaScript in the browser, any resources in that markup are effectively invisible to the preload scanner. This delays the discovery of important resources, which certainly affects LCP. In the case of these examples, the request for the LCP image is _significantly_ delayed when compared to the equivalent server-rendered experience that doesn't require JavaScript to appear.

This veers a bit from the focus of this article, but the effects of rendering markup on the client go far beyond defeating the preload scanner. For one, introducing JavaScript to power an experience that doesn't require it introduces unnecessary processing time that can affect [Interaction to Next Paint (INP)](/inp/).

Additionally, rendering extremely large amounts of markup on the client is more likely to generate [long tasks](/long-tasks-devtools/) compared to the same amount of markup being sent by the server. The reason for this&mdash;aside from the extra processing that JavaScript involves&mdash;is that browsers stream markup from the server and chunk up rendering in such a way that avoids long tasks. Client-rendered markup, on the other hand, is handled as a single, monolithic task, which may affect page responsiveness metrics such as [Total Blocking Time (TBT)](/tbt/) or [First Input Delay (FID)](/fid/) in addition to INP.

The remedy for this scenario depends on the answer to this question: **Is there a reason why your page's markup can't be provided by the server as opposed to being rendered on the client?** If the answer to this is "no", server-side rendering (SSR) or statically generated markup should be considered where possible, as it will help the preload scanner to discover and opportunistically fetch important resources ahead of time.

If your page _does_ need JavaScript to attach functionality to some parts of your page markup, you can still do so with SSR, either with vanilla JavaScript, or [hydration](https://www.patterns.dev/posts/progressive-hydration/) to get the best of both worlds.

## Help the preload scanner help you

The preload scanner is a highly effective browser optimization that helps pages load faster during startup. By avoiding patterns which defeat its ability to discover important resources ahead of time, you're not just making development simpler for yourself, you're creating better user experiences that will deliver better results in many metrics, including some [web vitals](/vitals/).

To recap, here's the following things you'll want to take away from this post:

- The browser preload scanner is a secondary HTML parser that scans ahead of the primary one if it's blocked to opportunistically discover resources it can fetch sooner.
- Resources that aren't present in markup provided by the server on the initial navigation request can't be discovered by the preload scanner. Ways the preload scanner can be defeated may include (but are not limited to):
  - Injecting resources into the DOM with JavaScript, be they scripts, images, stylesheets, or anything else that would be better off in the initial markup payload from the server.
  - Lazy-loading above-the-fold images or iframes using a JavaScript solution.
  - Rendering markup on the client that may contain references to document subresources using JavaScript.
- The preload scanner only scans HTML. It does not examine the contents of other resources&mdash;particularly CSS&mdash;that may include references to important assets, including LCP candidates.

If, for whatever reason, you _can't_ avoid a pattern that negatively affects the preload scanner's ability to speed up loading performance, consider the [`rel=preload`](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) resource hint. If you _do_ use `rel=preload`, test in lab tools to ensure that it's giving you the desired effect. Finally, don't preload too many resources, because when you prioritize everything, nothing will be.

## Resources

- [Script-injected "async scripts" considered harmful](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/)
- [How the Browser Pre-loader Makes Pages Load Faster](https://andydavies.me/blog/2013/10/22/how-the-browser-pre-loader-makes-pages-load-faster/)
- [Preload critical assets to improve loading speed](/preload-critical-assets/)
- [Establish network connections early to improve perceived page speed](/preconnect-and-dns-prefetch/)
- [Optimizing Largest Contentful Paint](/optimize-lcp/)

_Hero image from [Unsplash](https://unsplash.com/photos/oXlXu2qukGE), by [Mohammad Rahmani
](https://unsplash.com/@afgprogrammer)._

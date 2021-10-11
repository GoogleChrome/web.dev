---
title: Get Ready for Priority Hints
subhead: Priority Hints are a new feature in Chrome that allows developers to reprioritize resource requests for better performance. Learn more about its implementation, use cases, and how you can participate in its second origin trial.
authors:
  - jlwagner
  - yoavweiss
description: Priority Hints are a new feature in Chrome that allows developers to reprioritize resource requests for better performance. Learn more about its implementation, use cases, and how you can participate in its second origin trial.
date: 2020-10-14
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/CEHDGorcLctbzphb7Ydk.jpg
hero_position: center
alt: A photo of the Gare Du Nord train station platform in Paris, France.
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/365917469723852801
tags:
  - blog
  - performance
  - html
  - javascript
  - images
---

Resource loading is a key aspect of web performance, and the need for new web platform features that give developers more control over how resources are loaded is greater than ever. One ongoing effort to give developers this control is an experimental feature named [Priority Hints](https://wicg.github.io/priority-hints/), which lets developers tell the browser how to prioritize the loading of select resources.

When a browser downloads a resource, the resource is assigned a priority. [By default](/prioritize-resources/#default-priorities-in-the-browser), priorities depend on the resource type, and—in Chromium, at least—the location of the resource reference in the document. Some examples of how this works in Chromium are:

- CSS loaded by a `<link>` element in the `<head>` will be assigned the highest priority, as it blocks rendering.
- Images are initially given low priority, but may have their priority boosted if they’re in the viewport once layout happens.
- A `<script>` loaded at the end of the document may receive a priority assignment of medium or low, but this can be influenced by [`defer`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-defer) and [`async`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-async).

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Bs4SGqH4rrDTiyy1p6Tz.png", alt="A screenshot of a list of downloaded resources as shown in the network panel of Chrome's DevTools. There are three columns for the resource name, size, and its priority.", width="800", height="158" %}
  <figcaption>A list of resources and their corresponding priorities in the network panel of Chrome’s DevTools.</figcaption>
</figure>

Historically, we've had little control over resource priority beyond [modifying the critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) until [`rel=preload`](/preload-critical-assets/) came around, which changes the discovery order of a resource by telling the browser about it before it would ordinarily be discovered.

`rel=preload` aside, there are times when browsers prioritize resources in undesirable ways. Priority Hints can help address this problem.

## Using priority hints

Priority Hints can be set for resources in HTML by specifying an `importance` attribute on `<script>`, `<img>`, or `<link>` elements. An example of its use may look something like this:

```html
<!-- An image near the top of the page, which receives unnecessarily "high" priority. -->
<img src="/images/in_viewport_but_not_important.svg" importance="low" alt="I'm an unimportant image!">
```

The `importance` attribute accepts one of three values:

- `high`: The resource may be given higher priority, provided the browser's own heuristics don't prevent that from happening.
- `low`: The resource may be deprioritized—again, if the browser's heuristics permit.
- `auto`: Let the browser decide what priority is appropriate. This is the default.

Because `<link>` elements are affected by `importance`, this means priority can be changed not only for stylesheets, but also for `rel=preload` hints:

```html
<!-- We want to preload a resource, but also deprioritize it -->
<link rel="preload" href="/js/script.js" as="script" importance="low">
```

Priority Hints aren't restricted to HTML. You can also change the priority of `fetch` requests via the `importance` option, which takes the same values as its HTML equivalent:

```javascript
fetch('https://example.com/', { importance: 'low' }).then(data => {
  // Process the response
});
```

Priority Hints behave differently depending on your network stack. With HTTP/1.X, the only way for the browser to prioritize resources is to delay requests for them from going out. As a result, lower priority requests will hit the network after higher priority ones, (assuming higher priority requests have been queued up). Otherwise, the browser may still delay some low priority requests if it predicts that higher priority requests will be added to the queue, such as if the document's `<head>` is open and render-critical resources are likely to be discovered there.

With HTTP/2 and HTTP/3, the browser may delay some low-priority requests, but it can also set their resource's [stream priority](https://http2.github.io/http2-spec/#StreamPriority) to a lower level, enabling the server to better prioritize the resources it is sending down.

{% Aside %}
Priority Hints in its current form does not affect `<iframe>` elements. If you need to keep an `<iframe>` and its subresources from affecting loading performance during startup, consider [lazy loading it](/iframe-lazy-loading/).
{% endAside %}

## How can I tell when Priority Hints work?

One of the more direct methods for finding out if Priority Hints are working is to use [WebPageTest](https://webpagetest.org/). After profiling a page in WebPageTest, you can click on any of the requests in the waterfall view to get more information, including the request’s priority:

<figure>
{% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Uro7wt442sJ7inG46tXq.png", alt="A screenshot of the request details modal dialog in WebPageTest. It is overlaid on top of the network waterfall diagram, and displays information such as the request URL, the host name, and—relevantly—the request's priority.", width="800", height="485" %}
  <figcaption>A request’s priority can be found in WebPageTest by clicking on it in the waterfall view.</figcaption>
</figure>

With this information, you can tinker with priority hints on various resources and observe the effects, including the impact on core web vitals and other performance metrics.

In what circumstances might Priority Hints come in useful? Let's find out!

## Use cases

Default resource priorities vary. Once you modify them, the effects may become a bit less clear. Let's look at some examples where Priority Hints can improve performance.

### Hero images and LCP

[Largest Contentful Paint (LCP)](/lcp/) is a perceptual performance metric that tracks when the largest piece of content paints on a page. The largest piece of content may be a [hero image](https://en.wikipedia.org/wiki/Hero_image).

Because hero images tend to be large in terms of dimensions, they also tend to be large in terms of file size. Various optimization techniques—[including alternative formats](/uses-webp-images/)—can go a long way in reducing LCP, but Priority Hints may help even more.

Initially, image requests in Chromium are low priority. Once page layout is finished, priority may change for those requests. However, that initial prioritization may deprive a high-value image asset of bandwidth until the layout has been applied. Reprioritization may also not work well in some scenarios, such as when an H2 server suffers from buffer bloat. By giving a hero image an `importance` attribute value of `"high"`, the browser doesn’t have to wait until the layout has been applied to the page before reprioritizing the request for it.

For example, the [Google Flights](https://www.google.com/travel/flights) homepage has a large hero image. When `importance="high"` is applied to it, its LCP on a simulated 4G connection goes [from 2.7 seconds to 2 seconds](https://www.webpagetest.org/video/compare.php?tests=211006_AiDcG3_40871b05d6040112a05be4524565cf5d%2C211006_BiDcHR_bebed947f1b6607f2d97e8a899fdc36b&thumbSize=200&ival=100&end=visual).

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/n19NfVD9PNjq0m0jXdg7.png", alt="A screenshot of WebPageTest's filmstrip comparison view. At top, the Google Flights home page renders the hero image with an initially low priority, resulting in an LCP of 2.7 seconds. At bottom, the hero image's initial priority is boosted, resulting in faster painting of the image and an LCP of 2 seconds.", width="800", height="167" %}
  <figcaption>A filmstrip view comparing two tests of the Google Flights homepage. At bottom, Priority Hints are used to boost the priority of the hero image, resulting in a 0.7 second decrease in LCP.</figcaption>
</figure>

Bear in mind that WebPageTest is a tool that gathers lab data. Insufficient data has been gathered on the effectiveness of Priority Hints in the field, but we hope to gain further insights from the [Priority Hints origin trial](https://developer.chrome.com/origintrials/#/view_trial/365917469723852801). Even so, the lab data gathered on this feature speaks to its potential, and warrants further investigation as to its effectiveness in the field.

### Re-prioritizing scripts

Script resource priorities vary in Chromium depending on a `<script>` element's location in the DOM, and whether the script has `async` or `defer` attributes. That means when you place blocking scripts in the footer rather than in the document `<head>`, you're implicitly telling the browser that your script is less important than other resources.

Let’s say you’re loading a critical script in a non-blocking way, so you've given it an `async` attribute to ensure it runs as soon as it’s available. This works for scripts that provide interactivity, but shouldn't block rendering. Alternatively, you might have a blocking script at the bottom of the page, but at the same time, it shouldn’t always run before other async scripts, and can therefore be deprioritized.

There are hacks to work around some of these heuristics, but Priority Hints deal with these issues in a clear and declarative way. So, if you wanted to prioritize an async script, you could indicate:

```html
<script src="/js/async_but_important.js" async importance="high"></script>
```

Similarly, for a blocking script at the end of the document, you could give the browser a hint that it's less important than other resources:

```html
<script src="/js/blocking_but_unimportant.js" importance="low"></script>
```

### Deprioritizing fetches

Say you have a number of `fetch` calls that fire around the same time. Because fetches are given high priority, they'll contend with one another—and other high priority requests—if enough of them occur concurrently. To get around this, you could specify an `importance` of `low` on fetches for non-critical data:

```javascript
// Important user data (high by default)
const userData = await fetch('/user');

// Less important content data (explicitly low priority)
const newsFeedContent = await fetch('/content/news-feed', {
  importance: 'low'
});

const suggestedContent = await fetch('/content/suggested', {
  importance: 'low'
});
```

This ensures that fetches for critical data won't contend with fetches for less important data. This could improve performance in situations where bandwidth is low, but the number of fetch calls is high.

## Caveats and conclusion

Right about now, you're ready to run out there and start using Priority Hints—but hold on first! You should be aware of a few things before you do so.

### Priority Hints are hints, not instructions

The key word is _hint_. The browser has the final say in prioritization. The browser may decide that a given priority hint would result in worse performance. This may change as Chrome's implementation matures, so test often!

### It will take trial and error

A good way to think about Priority Hints is to compare them to `rel=preload`: Where `rel=preload` has more readily observable effects, Priority Hints are more nuanced. If you don't notice any difference when using them, it could be for any number of reasons, such as:

1. Resource priorities ensure that critical resources get to the browser before non-critical ones. Yet, that only helps in environments where bottlenecks exist. That happens often with HTTP/1.X, where the number of simultaneous connections are limited. This also happens with HTTP/2, but more so on low-bandwidth connections. High bandwidth HTTP/2 connections are less likely to recognize an obvious benefit from better resource prioritization.
2. HTTP/2 servers and their prioritization implementations are imperfect. [Pat Meenan](https://twitter.com/patmeenan) wrote about [common hurdles](https://blog.cloudflare.com/http-2-prioritization-with-nginx/) and how to fix them. [Andy Davies](https://twitter.com/andydavies) has run tests to see which CDNs and services are [getting it right](https://github.com/andydavies/http2-prioritization-issues#current-status). Generally, if you see that HTTP/2 prioritization is not having the impact you expect it to have, your server’s HTTP/2 implementation may not be as effective as another’s.
3. The browser either ignored the hint you gave it, or you attempted to set a priority for a resource that would have been the same as the browser's original choice.

Priority Hints are a fine-tuning optimization. If you haven't looked at other techniques like image optimization, code splitting, `rel=preload`, and so forth, try those things before you go all-in on Priority Hints.

### Priority Hints are experimental

Chrome’s Priority Hints implementation is in development. Be aware that Priority Hints and their impact may change over time. Use them with this in mind. Since Priority Hints are a fine-tuning optimization, they should not cause breaking changes, but rather may cause subtly undesirable effects that may be hard to measure for some users if misused.

### Try Priority Hints!

Starting in Chrome 96, Priority Hints are entering [its second origin trial](https://developer.chrome.com/origintrials/#/view_trial/365917469723852801). That means that, in order to use them, [you must register your domain](https://developers.chrome.com/origintrials/#/trials/active) and have the feature turned on for your users from Chrome 96 to 99.

Give Priority Hints a try to see if it improves your site's performance. We want to improve our understanding of its real world benefits, and this origin trial will help us do just that.

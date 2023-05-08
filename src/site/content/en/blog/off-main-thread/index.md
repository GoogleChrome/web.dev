---
title: Use web workers to run JavaScript off the browser's main thread
subhead: |
  An off-main-thread architecture
  can significantly improve your app's reliability and user experience.
description: |
  The browser's main thread is incredibly overworked. By using web workers
  to shift code off the main thread, you can significantly improve
  your app's reliability and user experience.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/LwqqWsiDgCI6DWSvIBx9.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/0g1FW2vXmRc30u7BtWRc.jpg
alt: A monochrome photo of a railroad junction.

# A list of authors. Supports more than one.
authors:
  - surma

date: 2019-12-05
# Add an updated date to your post if you edit in the future.
updated: 2022-11-29

tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

In the past 20&nbsp;years,
the web has evolved dramatically from static documents with a few styles and images
to complex, dynamic applications.
However, one thing has remained largely unchanged:
we have just one thread per browser tab (with some exceptions)
to do the work of rendering our sites and running our JavaScript.

As a result, the main thread has become incredibly overworked.
And as web apps grow in complexity,
the main thread becomes a significant bottleneck for performance.
To make matters worse,
the amount of time it takes to run code on the main thread for a given user
is **almost completely unpredictable**
because device capabilities have a massive effect on performance.
That unpredictability will only grow as users access the web
from an increasingly diverse set of devices,
from hyper-constrained feature phones to high-powered,
high-refresh-rate flagship machines.

If we want sophisticated web apps to reliably meet performance guidelines
like the [Core Web Vitals](/vitals/)—which
is based on empirical data about human perception and psychology—we
need ways to execute our code **off the main thread (OMT)**.

{% Aside %}
If you want to hear more about the case for an OMT architecture,
watch my CDS 2019 talk below.
{% endAside %}

{% YouTube '7Rrv9qFMWNM' %}

## Why web workers?

JavaScript is, by default, a single-threaded language that runs [tasks](/optimize-long-tasks/#what-is-a-task) on [the main thread](/optimize-long-tasks/#what-is-the-main-thread). However, web workers provide a sort of escape hatch from the main thread by allowing developers to spin up separate threads to handle work off of the main thread. While the scope of web workers is limited and doesn't offer direct access to the DOM, they can be hugely beneficial if there is considerable work that needs to be done that would otherwise overwhelm the main thread.

Where [Core Web Vitals](/vitals/) are concerned, running work off the main thread can be beneficial. In particular, offloading work from the main thread to web workers can reduce contention for the main thread, which can improve important responsiveness metrics such as [Interaction to Next Paint (INP)](/inp/) and [First Input Delay (FID)](/fid/). When the main thread has less work to process, it can respond more quickly to user interactions.

Less main thread work—especially during startup—also carries a potential benefit for [Largest Contentful Paint (LCP)](/lcp/) by reducing long tasks. Rendering an LCP element requires main thread time—either for rendering text or images, which are frequent and common LCP elements—and by reducing main thread work overall, you can ensure that your page's LCP element is less likely to be blocked by expensive work that a web worker could handle instead.

## Threading with web workers

Other platforms typically support parallel work
by allowing you to give a thread a function,
which runs in parallel with the rest of your program.
You can access the same variables from both threads,
and access to these shared resources can be synchronized
with mutexes and semaphores to prevent race conditions.

In JavaScript, we can get roughly similar functionality from web workers,
which have been around since 2007
and supported across all major browsers since 2012.
Web workers run in parallel with the main thread,
but unlike OS threading they can't share variables.

{% Aside %}
Don't confuse web workers with [service workers](/service-workers-cache-storage)
or [worklets](https://developer.mozilla.org/docs/Web/API/Worklet).
While the names are similar, the functionality and uses are different.
{% endAside %}

To create a web worker, pass a file to the worker constructor,
which starts running that file in a separate thread:

```js
const worker = new Worker("./worker.js");
```

Communicate with the web worker by sending messages via the
[`postMessage` API](https://developer.mozilla.org/docs/Web/API/Window/postMessage).
Pass the message value as a parameter in the `postMessage` call
and then add a message event listener to the worker:

<!--lint disable no-duplicate-headings-in-section-->
### `main.js`
```js/1
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
```

### `worker.js`
```js
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
});
```

To send a message back to the main thread,
use the same `postMessage` API in the web worker
and set up an event listener on the main thread:

### `main.js`
```js/2-4
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
worker.addEventListener("message", event => {
  console.log(event.data);
});
```

### `worker.js`
```js/3
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
  postMessage(a+b);
});
```

Admittedly, this approach is somewhat limited.
Historically, web workers have mainly been used
for moving a single piece of heavy work off the main thread.
Trying to handle multiple operations with a single web worker gets unwieldy quickly:
you have to encode not only the parameters but also the operation in the message,
and you have to do bookkeeping to match responses to requests.
That complexity is likely why web workers haven't been adopted more widely.

But if we could remove some of the difficulty of communicating
between the main thread and web workers,
this model could be a great fit for many use cases.
And, luckily, there's a library that does just that!

## Comlink: making web workers less work

[Comlink](http://npm.im/comlink) is a library
whose goal is to let you use web workers
without having to think about the details of `postMessage`.
Comlink lets you to share variables
between web workers and the main thread
almost like other programming languages that support threading.

You set up Comlink by importing it in a web worker
and defining a set of functions to expose to the main thread.
You then import Comlink on the main thread, wrap the worker,
and get access to the exposed functions:

### `worker.js`
```js
import {expose} from "comlink";

const api = {
  someMethod() { /* … */ }
}
expose(api);
```

### `main.js`
```js
import {wrap} from "comlink";

const worker = new Worker("./worker.js");
const api = wrap(worker);
```

The `api` variable on main thread behaves the same as the one in the web worker,
except that every function returns a promise for a value rather than the value itself.

## What code should you move to a web worker?

Web workers don't have access to the DOM and many APIs
like [WebUSB](https://developer.mozilla.org/docs/Web/API/USB),
[WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API), or
[Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API),
so you can't put pieces of your app that rely on such access in a worker.
Still, every small piece of code moved to a worker buys more headroom
on the main thread for stuff that _has_ to be there—like updating the user interface.

{% Aside %}
Restricting UI access  to the main thread is actually typical in other languages.
In fact, both iOS and Android call the main thread the _UI thread_.
{% endAside %}

One problem for web developers is that most web apps rely on a UI framework
like Vue or React to orchestrate everything in the app;
everything is a component of the framework and so is inherently tied to the DOM.
That would seem to make it difficult to migrate to an OMT architecture.

However, if we shift to a model in which UI concerns are separated from other concerns,
like state management, web workers can be quite useful even with framework-based apps.
That's exactly the approach taken with PROXX.

## PROXX: an OMT case study

The Google Chrome team developed [PROXX](/load-faster-like-proxx/)
as a Minesweeper clone that meets
[Progressive Web App](https://developers.google.com/web/progressive-web-apps) requirements,
including working offline and having an engaging user experience.
Unfortunately, early versions of the game performed poorly on constrained devices
like feature phones, which led the team to realize that the main thread was a bottleneck.

The team decided to use web workers to separate the game's visual state from its logic:

*   The main thread handles rendering of animations and transitions.
*   A web worker handles game logic, which is purely computational.

{% Aside %}
This approach is similar to the Redux
[Flux pattern](https://facebook.github.io/flux/),
so many Flux apps may be able to migrate fairly easily to an OMT architecture.
Take a look at [this blog post](http://dassur.ma/things/react-redux-comlink/)
to read more about applying OMT to a Redux app.
{% endAside %}

OMT had interesting effects on PROXX's feature phone performance.
In the non-OMT version,
the UI is frozen for six seconds after the user interacts with it.
There's no feedback, and the user has to wait for the full six seconds
before being able to do something else.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption>
    UI response time in the <strong>non-OMT</strong> version of PROXX.
  </figcaption>
</figure>

In the OMT version, however, the game takes _twelve_ seconds to complete a UI update.
While that seems like a performance loss,
it actually leads to increased feedback to the user.
The slowdown occurs because the app is shipping more frames than the non-OMT version,
which isn't shipping any frames at all.
The user therefore knows that something is happening
and can continue playing as the UI updates,
making the game feel considerably better.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.mp4" type="video/mp4; codecs=h264">
  </video>
 <figcaption>
    UI response time in the <strong>OMT</strong> version of PROXX.
  </figcaption>
</figure>

This is a conscious tradeoff:
we give users of constrained devices an experience that _feels_ better
without penalizing users of high-end devices.

## Implications of an OMT architecture

As the PROXX example shows,
OMT makes your app reliably run on a wider range of devices,
but it doesn't make your app faster:

*   You're just moving work from the main thread, not reducing the work.
*   The extra communication overhead between the web worker
    and the main thread can sometimes make things marginally slower.

### Considering the tradeoffs

Since the main thread is free to process user interactions
like scrolling while JavaScript is running,
there are fewer dropped frames even though total wait time may be marginally longer.
Making the user wait a bit is preferable to dropping a frame
because the margin of error is smaller for dropped frames:
dropping a frame happens in milliseconds,
while you have _hundreds_ of milliseconds before a user perceives wait time.

Because of the unpredictability of performance across devices,
the goal of OMT architecture is really about **reducing risk**—making
your app more robust in the face of highly variable runtime conditions—not
about the performance benefits of parallelization.
The increase in resilience and the improvements
to UX are more than worth any small tradeoff in speed.

{% Aside %}
Developers are sometimes concerned about the cost
of copying complex objects across the main thread and web workers.
There's more detail in the talk, but, in general,
you shouldn't break your performance budget
if your object's stringified JSON representation is less than 10&nbsp;KB.
If you need to copy larger objects, consider using
[ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
or [WebAssembly](https://webassembly.org/).
You can read more about this issue in
[this blog post about `postMessage` performance](https://dassur.ma/things/is-postmessage-slow).
{% endAside %}

### A note about tooling

Web workers aren't yet mainstream,
so most module tools—like [WebPack](https://webpack.js.org/)
and [Rollup](https://github.com/rollup/rollup)—don't support them out of the box.
([Parcel](https://parceljs.org/) does though!)
Luckily, there are plugins to make web workers, well, _work_ with WebPack and Rollup:

*   [worker-plugin](https://github.com/GoogleChromeLabs/worker-plugin) for WebPack
*   [rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) for Rollup

## Summing up

To make sure our apps are as reliable and accessible as possible, especially in an increasingly globalized marketplace, we need to support constrained devices—they're how most users are accessing the web globally. OMT offers a promising way to increase performance on such devices without adversely affecting users of high-end devices.

Also, OMT has secondary benefits:

*   It moves JavaScript execution costs to a separate thread.
*   It moves _parsing_ costs, meaning UI might boot up faster.
    That might reduce [First Contentful Paint](/fcp/)
    or even [Time to Interactive](/tti/),
    which can in turn increase your
    [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) score.

Web workers don't have to be scary.
Tools like Comlink are taking the work out of workers
and making them a viable choice for a wide range of web applications.

_Hero image from [Unsplash](https://unsplash.com/), by [James Peacock](https://unsplash.com/@jimmyp9751)._

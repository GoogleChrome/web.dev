---
title: Better JS scheduling with isInputPending()
subhead: >
  A new JavaScript API that may help you avoid the trade-off between
  load performance and input responsiveness.
description: >
  A new JavaScript API that may help you avoid the trade-off between
  load performance and input responsiveness.
date: 2020-11-19
hero: image/admin/Jlg1NJbRJnJN4VgubXh4.jpg
alt: A traffic sign that says 'GIVE WAY'.
tags:
  - blog
  - javascript
  - performance
  - rendering
authors:
  - nateschloss
  - andrewcomminos
feedback:
  - api
---

Loading fast is hard. Sites that leverage JS to render their content currently
have to make a trade-off between load performance and input
responsiveness: either perform all the work needed for display
all at once (better load performance, worse input responsiveness), or
chunk the work into smaller tasks in order to remain responsive to
input and paint (worse load performance, better input
responsiveness).

To eliminate the need to make this trade-off, Facebook proposed and implemented
the `isInputPending()` API in Chromium in order to improve responsiveness without
yielding. Based on origin trial feedback, we've made a number of updates to the
API, and are happy to announce that the API is now shipping by default in Chromium
87!

## Browser compatibility

`isInputPending()` is shipping in Chromium-based browsers starting in version 87.
No other browser has signaled an intent to ship the API.

## Background

{% Aside %}
  For the full background, check out our Facebook Engineering blog post,
  [Faster input events with Facebook's first browser API
  contribution](https://engineering.fb.com/developer-tools/isinputpending-api/).
{% endAside %}

Most work in today's JS ecosystem gets done on a single thread: the main thread.
This provides a robust execution model to developers, but the user experience
(responsiveness in particular) can suffer drastically if script executes for a long
time. If the page is doing a lot of work while an input event is fired,
for instance, the page won't handle the click input event until after that work
completes.

The current best practice is to deal with this issue by breaking the
JavaScript up into smaller blocks. While the page is loading, the page can run a
bit of JavaScript, and then yield and pass control back to the browser. The
browser can then check its input event queue and see whether there is anything
it needs to tell the page about. Then the browser can go back to running the
JavaScript blocks as they get added. This helps, but it can cause other issues.

Each time the page yields control back to the browser, it takes some time for
the browser to check its input event queue, process events, and pick up the next
JavaScript block. While the browser responds to events quicker, the overall
loading time of the page gets slowed down. And if we yield too often, the page
loads too slowly. If we yield less often, it takes longer for the browser to
respond to user events, and people get frustrated. Not fun.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/C2JMVL3EhgBqne5DkrhN.png", alt="A diagram showing that when you run long JS tasks, the browser has less time to dispatch events.", width="800", height="450" %}

At Facebook, we wanted to see what things would look like if we came up with a
new approach for loading that would eliminate this frustrating trade-off. We
reached out to our friends at Chrome about this, and came up with the proposal
for `isInputPending()`. The `isInputPending()` API is the first to use the concept of
interrupts for user inputs on the web, and allows for JavaScript to be
able to check for input without yielding to the browser.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Et3ZusgDbXrdTIfenRD.png", alt="A diagram showing that isInputPending() allows your JS to check if there's pending user input, without completely yielding execution back to the browser.", width="800", height="450" %}

Since there was interest in the API, we partnered with our colleagues at Chrome
to implement and ship the feature in Chromium. With help from the Chrome
engineers, we got the patches landed behind an [origin trial](/origin-trials/)
(which is a way for Chrome to test changes and get feedback from developers
before fully releasing an API).

We've now taken feedback from the origin trial and from the other members of the
W3C Web Performance Working Group and implemented changes to the API.

## Example: a yieldier scheduler

Suppose that you've got a bunch of display-blocking work to do to load your
page, for example generating markup from components, factoring out primes, or
just drawing a cool loading spinner. Each one of these is broken into a discrete
work item. Using the scheduler pattern, let's sketch out how we might process
our work in a hypothetical `processWorkQueue()` function:

```js
const DEADLINE = performance.now() + QUANTUM;
while (workQueue.length > 0) {
  if (performance.now() >= DEADLINE) {
    // Yield the event loop if we're out of time.
    setTimeout(processWorkQueue);
    return;
  }
  let job = workQueue.shift();
  job.execute();
}
```

By invoking `processWorkQueue()` later in a new macrotask via `setTimeout()`, we
give the browser the ability to remain somewhat responsive to input (it can
run event handlers before work resumes) while still managing to run relatively
uninterrupted. Though, we might get descheduled for a long time by other work
that wants control of the event loop, or get up to an extra `QUANTUM` milliseconds
of event latency.

{% Aside %}
  A good value for `QUANTUM` (under the [RAIL model](/rail/)) is <50ms,
  depending on the type of work being done. This value is primarily what
  dictates the tradeoff between throughput and latency.
{% endAside %}

This is okay, but can we do better? Absolutely!

```js
const DEADLINE = performance.now() + QUANTUM;
while (workQueue.length > 0) {
  if (navigator.scheduling.isInputPending() || performance.now() >= DEADLINE) {
    // Yield if we have to handle an input event, or we're out of time.
    setTimeout(processWorkQueue);
    return;
  }
  let job = workQueue.shift();
  job.execute();
}
```

By introducing a call to `navigator.scheduling.isInputPending()`, we're able to
respond to input quicker while still ensuring that our display-blocking work
executes uninterrupted otherwise. If we're not interested in handling anything
other than input (e.g. painting) until work is complete, we can handily increase
the length of `QUANTUM` as well.

By default, "continuous" events are not returned from `isInputPending()`. These
include `mousemove`, `pointermove`, and others. If you're interested in yielding for
these as well, no problem. By providing a dictionary to `isInputPending()` with
`includeContinuous` set to `true`, we're good to go:

```js
const DEADLINE = performance.now() + QUANTUM;
const options = { includeContinuous: true };
while (workQueue.length > 0) {
  if (navigator.scheduling.isInputPending(options) || performance.now() >= DEADLINE) {
    // Yield if we have to handle an input event (any of them!), or we're out of time.
    setTimeout(processWorkQueue);
    return;
  }
  let job = workQueue.shift();
  job.execute();
}
```

That's it! Frameworks like React are building `isInputPending()` support into their
core scheduling libraries using similar logic. Hopefully, this will lead
developers who use these frameworks to be able to benefit from `isInputPending()`
behind the scenes without significant rewrites.

## Yielding isn't always bad

It's worth noting that yielding less isn't the right solution for every use
case. There are many reasons to return control to the browser other than to
process input events, such as to perform rendering and execute other scripts on
the page.

There exist cases where the browser isn't able to properly attribute pending
input events. In particular, setting complex clips and masks for cross-origin
iframes may report false negatives (i.e. `isInputPending()` may unexpectedly return
false when targeting these frames). Be sure that you're yielding often enough if
your site does require interactions with stylized subframes.

Be mindful of other pages that share an event loop, as well. On platforms such
as Chrome for Android, it's quite common for multiple origins to share an event
loop. `isInputPending()` will never return `true` if input is dispatched to a
cross-origin frame, and thus backgrounded pages may interfere with the
responsiveness of foreground pages. You may wish to reduce, postpone, or yield
more often when doing work in the background using the [Page Visibility
API](https://www.w3.org/TR/page-visibility-2/).

We encourage you to use `isInputPending()` with discretion. If there isn't
user-blocking work to be done, then be kind to others on the event loop by
yielding more frequently. [Long tasks can be
harmful](/long-tasks-devtools/).

## Feedback

* Leave feedback on the spec in the
  [is-input-pending](https://github.com/WICG/is-input-pending) repository.
* Contact [@acomminos](https://twitter.com/acomminos) (one of the spec authors)
  on Twitter.

## Conclusion

We're excited that `isInputPending()` is launching, and that developers are able
to start using it today. This API is the first time that Facebook has built a
new web API and taken it from idea incubation to standards proposal to actually
shipping in a browser. We'd like to thank everyone who helped us get to this
point, and give a special shoutout to everyone at Chrome who helped us flesh out
this idea and get it shipped!

Hero photo by [Will H McMahan](https://unsplash.com/@whmii) on
[Unsplash](https://unsplash.com).

---
layout: post
title: Optimize input delay
subhead: |
  Find out what input delay is, and learn techniques to reduce it for faster interactivity.
authors:
  - jlwagner
date: 2023-05-09
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/97AJCstKrpjMHS2hHzdn.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/vKO5f6HIbL9tMBXfuXlk.jpg
alt: An LED road construction sign reading "Expect Delays".
description: |
  Input delay can contribute significantly to total interaction latency and negatively affect your page's INP. In this guide, learn what input delay is, and how you can reduce it for faster interactivity.
tags:
  - blog
  - performance
  - web-vitals
---

Interactions on the web are complicated things, with all sorts of activity occurring in the browser to drive them. What they all have in common, though, is that they incur some input delay before their event callbacks begin to run. In this guide, you'll learn what input delay is, and what you can do to minimize it so your website's interactions run faster.

## What is input delay?

_Input delay_ is the period of time beginning from when the user first interacts with a page—such as tapping on a screen, clicking with a mouse, or pressing a key—up to when the event callbacks for the interaction begin to run. Every interaction begins with some amount of input delay.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/WVS8po7gV1gKbeWcVadI.png", alt="A simplified visualization of input delay. At left, there is line art of a mouse cursor with a starburst behind it, signifying the start of an interaction. To the right is line art of a cogwheel, signifying when the event handlers for an interaction begin to run. The space in between is noted as the input delay with a curly brace.", width="736", height="303" %}
  <figcaption>
    The mechanics behind input delay. When an input is received by the operating system, it must be passed to the browser before the interaction starts. This takes a certain amount of time, and can be increased by existing main thread work.
  </figcaption>
</figure>

Some portion of the input delay is unavoidable: it always takes some amount of time for the operating system to recognize an input event and pass it to the browser. However, that portion of the input delay is often not even noticeable, and there are other things that happen on the page itself that can make input delays long enough to cause problems.

## How to think about input delay

Generally speaking, you want to keep every part of an interaction as short as possible so that your website has the best chance of meeting [the Interaction to Next Paint (INP) metric's "good" threshold](/inp/#what-is-a-good-inp-score), regardless of the user's device. Keeping input delay in check is just one part of meeting that threshold.

You might be tempted to look to [the First Input Delay (FID) thresholds](/fid/#what-is-a-good-fid-score) to determine an allowance for input delays—but the "good" threshold for FID is **100 milliseconds or less**. If you go by this threshold, you'd be allotting half of your budget for INP to input delay alone. This is inadvisable when you consider that an interaction also requires time to run event callbacks and for the browser to paint the next frame.

To meet INP's "good" threshold, you'll want to aim for the shortest input delay possible, but you shouldn't expect to eliminate it entirely, as that is impossible. As long as you're avoiding excessive main thread work while users are attempting to interact with your page, your input delay should be low enough to avoid problems.

## How to minimize input delay

As said previously, some input delay is unavoidable, but on the other hand, some input delay _is_ avoidable. Here are some things to consider if you're struggling with long input delays.

### Avoid recurring timers that kick off excessive main thread work

There are two commonly used timer functions in JavaScript that can contribute to input delay: [`setTimeout`](https://developer.mozilla.org/docs/Web/API/setTimeout) and [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval). The difference between the two is that `setTimeout` schedules a callback to run after a specified time. `setInterval`, on the other hand, schedules a callback to run every _n_ milliseconds in perpetuity, or until the timer is stopped with [`clearInterval`](https://developer.mozilla.org/docs/Web/API/clearInterval).

`setTimeout` is not problematic in itself—in fact, it can be helpful in [avoiding long tasks](#avoid-long-tasks). However, it depends on _when_ the timeout occurs, and whether the user attempts to interact with the page when the timeout callback runs.

Additionally, `setTimeout` can be run in a loop or recursively, where it acts more like `setInterval`, though preferably not scheduling the next iteration until the previous one is completed. While this means the loop will yield to the main thread every time `setTimeout` is called, you should take care to ensure its callback doesn't end up doing excessive work.

`setInterval` runs a callback on an interval, and is therefore much more likely to get in the way of interactions. This is because—unlike a single instance of a `setTimeout` call, which is a one-off callback that _may_ get in the way of a user interaction—`setInterval`'s recurring nature makes it much more likely that it _will_ get in the way of an interaction, thus increasing the interaction's input delay.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/TxMJD9z8fKs8CxOywEWS.png", alt="A screenshot of the performance profiler in Chrome DevTools demonstrating input delay. A task fired by a timer function occurs just before a user initiates a click interaction. However, the timer extends the input delay, causing the interaction's event callbacks to run later than they otherwise would.", width="800", height="458" %}
  <figcaption>
    A timer registered by a previous `setInterval` call contributing to input delay as depicted in the performance panel of Chrome DevTools. The added input delay causes the event callbacks for the interaction to run later than they otherwise could.
  </figcaption>
</figure>

If timers are occurring in first-party code, then you have control over them. Evaluate whether you need them, or do your best to reduce the work in them as much as possible. However, timers in third-party scripts are a different story. You often don't have control over what a third-party script does, and fixing performance issues in third-party code often involves working with stakeholders to determine whether a given third-party script is necessary, and if so, establish contact with a third-party script vendor to determine what can done to fix performance issues they may cause on your website.

### Avoid long tasks

One way to mitigate long input delays is to avoid long tasks. When you have excessive main thread work that blocks the main thread during interactions, that will add to the input delay for them before the long tasks have had a chance to finish.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/PRO5n8DxflhLaM5PdoZv.png", alt="A visualization of how long tasks extend input delay. At top, an interaction occurs shortly after a single long task runs, causing significant input delay that causes event callbacks to run much later than they should. At bottom, an interaction occurs at roughly the same time, but the long task is broken up into several smaller ones by yielding, allowing the interaction's event callbacks to run much sooner.", width="800", height="448" %}
  <figcaption>
    A visualization of what happens to interactions when tasks are too long and the browser can't respond quickly enough to interactions, versus when longer tasks are broken up into smaller tasks.
  </figcaption>
</figure>

Besides minimizing the amount of work you do in a task—and you should _always_ strive to do as little work as possible on the main thread—you can improve responsiveness to user input by [breaking up long tasks](/optimize-long-tasks/).

{% Aside %}
Yielding isn't foolproof, as tasks from third-party JavaScript can still make their way in between first-party tasks after yielding. This can still contribute to input delay for future interactions, and you'll need to be mindful of third-party tasks that may run on an interval, as described in the previous section. This is a problem that [the proposed `scheduler.yield` API](https://github.com/WICG/scheduling-apis/blob/main/explainers/yield-and-continuation.md) is looking to solve.
{% endAside %}

### Be mindful of interaction overlap

A particularly challenging part of optimizing INP can be if you have interactions that overlap. Interaction overlap means that after you've interacted with one element, you make another interaction with the page before the initial interaction has had a chance to render the next frame.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ohYy7phsKRbKCeth0iUu.png", alt="A depiction of when tasks can overlap to produce long input delays. In this depiction, a click interaction overlaps with a keydown interaction to increase the input delay for the keydown interaction.", width="800", height="307" %}
  <figcaption>
    A visualization of two concurrent interactions in the performance profiler in Chrome's DevTools. The rendering work in the initial click interaction causes an input delay for the subsequent keyboard interaction.
  </figcaption>
</figure>

Sources of interaction overlap may be as simple as users making many interactions in a short period of time. This can occur when users type in form fields, where many keyboard interactions can occur in a very short period of time. If the work on a key event is especially expensive—such as in the common case of autocomplete fields where network requests are made to a back end—you have a couple of options:

- Consider [debouncing](/debounce-your-input-handlers/) inputs to limit the amount of times an event callback executes in a given period of time.
- Use [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController/abort) to cancel outgoing `fetch` requests so the main thread doesn't become congested handling `fetch` callbacks. Note: an `AbortController` instance's `signal` property can also be used to [abort events](https://developer.mozilla.org/docs/Web/API/AbortSignal/abort_event).

Another source of increased input delay due to overlapping interactions can be expensive animations. In particular, animations in JavaScript may fire many [`requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame) calls, which may get in the way of user interactions. To get around this, use CSS animations whenever possible to avoid queueing potentially expensive animation frames—but if you do this, make sure you [avoid non-composited animations](https://developer.chrome.com/en/docs/lighthouse/performance/non-composited-animations/) so that animations run mainly on the GPU and compositor threads, and not on the main thread.

## Conclusion

While input delays may not represent the majority of the time your interactions take to run, it's important to understand that every part of an interaction takes up an amount of time that you can reduce. If you're [observing long input delay](/diagnose-slow-interactions-in-the-lab/#how-to-identify-long-input-delays), then you have opportunities to reduce it. Avoiding recurring timer callbacks, breaking up long tasks, and being aware of potential interaction overlap can all help you to reduce input delay, leading to faster interactivity for your website's users.

_Hero image from [Unsplash](https://unsplash.com/), by [Erik Mclean](https://unsplash.com/@introspectivedsgn)._

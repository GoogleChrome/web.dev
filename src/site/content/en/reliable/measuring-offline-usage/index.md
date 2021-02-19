---
layout: post
title: Measuring offline usage
subhead: > 
  How to track offline usage of your site so that you can make a case as to why
  your site needs a better offline experience.
description: > 
  How to track offline usage of your site so that you can make a case as to why
  your site needs a better offline experience.
authors:
  - giesau
  - martinschierle
date: 2020-10-28
tags:
  - blog
  - offline
  - network
  - service-worker
  - metrics
hero: image/admin/NvPzgpuXtjuz5oE54SWn.jpg
alt: People on a subway.
---

This article shows you how to track offline usage of your site to help you make a case for why your
site needs a better offline mode. It also explains pitfalls and problems to avoid when implementing
offline usage analytics.

## The pitfalls of the online and offline browser events

The obvious solution for tracking offline usage is to create event listeners for the
[`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) and
[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events (which
[many browsers support](https://caniuse.com/#feat=online-status)) and to put your analytics tracking
logic in those listeners. Unfortunately, there are several problems and limitations with this
approach:

+   In general tracking every network connection status event might be excessive, and is
    counter-productive in a privacy-centric world where as little data as possible should be
    collected. Additionally the `online` and `offline` events can fire for just a split second of
    network loss, which a user probably wouldn't even see or notice.
+   The analytics tracking of offline activity would never reach the analytics server because
    the user is… well, offline.
+   Tracking a timestamp locally when a user goes offline and sending the offline activity to
    the analytics server when the user goes back online depends on the user revisiting your site.
    If the user drops off your site due to a lack of an offline mode and never revisits, you have
    no way to track that. The ability to track offline drop-offs is critical data for building a
    case about why your site needs a better offline mode.
+   The `online` event is not very reliable as it
    [only knows about network access](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine),
    not internet access. Therefore a user might still be offline, and sending the tracking ping can
    still fail.
+   Even if the user still stays on the current page while being offline, none of the other
    analytics events (e.g. scroll events, clicks, etc.) are tracked either, which might be the more
    relevant and useful information.
+   Being offline in itself is also not too meaningful in general. As a website developer it may
    be more important to know what kinds of resources failed to load. This is especially relevant
    in the context of SPAs, where a dropped network connection might not lead to a browser offline
    error page (which users understand) but more likely to random dynamic parts of the page failing
    silently.

You can still use this solution to gain a basic understanding of offline usage, but the many
drawbacks and limitations need to be considered carefully.

## A better approach: the service worker

The solution that enables offline mode turns out to be the better solution for tracking offline
usage.  The basic idea is to store analytics pings into IndexedDB as long as the user is offline,
and just resend them when the user goes online again. For Google Analytics this is already available
[off-the-shelf through a Workbox module](https://developers.google.com/web/tools/workbox/modules/workbox-google-analytics),
but keep in mind that hits sent more than
[four hours deferred](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt)
may not be processed. In its simplest form, it can be activated within a Workbox-based service
worker with these two lines:

```js
import * as googleAnalytics from 'workbox-google-analytics';

googleAnalytics.initialize();
```

This tracks all existing events and pageview pings while being offline, but you wouldn't know that
they happened offline (as they are just replayed as-is). For this
[you can manipulate tracking requests with Workbox](https://developers.google.com/web/tools/workbox/modules/workbox-google-analytics#using_a_custom_dimension_to_track_online_vs_offline_interactions)
by adding an `offline` flag to the analytics ping, using a custom dimension (`cd1` in the code
sample below): 

```js
import * as googleAnalytics from 'workbox-google-analytics';

googleAnalytics.initialize({
  parameterOverrides: {
    cd1: 'offline',
  },
});
```

What if the user drops out of the page due to being offline, before an internet connection comes
back? Even though this normally puts the service worker to sleep (i.e. it's unable to send the data
when the connection comes back), the Workbox Google Analytics module uses the [Background Sync
API](https://developers.google.com/web/updates/2015/12/background-sync), which sends the analytics
data later when the connection comes back, even if the user closes the tab or browser.

There is still a drawback: while this makes existing tracking offline-capable, you would most likely
not see much relevant data coming in until you implement a basic offline mode. Users would still
drop off your site quickly when the connection breaks away. But now you can at least measure and
quantify this, by comparing average session length and user engagement for users with the offline
dimension applied versus your regular users.

## SPAs and lazy loading

If users visiting a page built as a multi-page website go offline and try to navigate, the browser's
default offline page shows up, helping users understand what is happening. However, pages built as
single-page applications work differently. The user stays on the same page, and new content is
loaded dynamically through AJAX without any browser navigation. Users do not see the browser error
page when going offline. Instead, the dynamic parts of the page render with errors, go into
undefined states, or just stop being dynamic.

Similar effects can happen within multi-page websites due to lazy loading. For example, maybe the
initial load happened online, but the user went offline before scrolling. All lazy loaded content
below the fold will silently fail and be missing.

As these cases are really irritating to users, it makes sense to track them. Service workers are the
perfect spot to catch network errors, and eventually track them using analytics. With Workbox, a
[global catch handler](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks)
can be configured to inform the page about failed requests by sending a message event:

```js
import { setCatchHandler } from 'workbox-routing';

setCatchHandler(({ event }) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage
  event.waitUntil(async function () {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    client.postMessage({
      action: "network_fail",
      url: event.request.url,
      destination: event.request.destination
    });

    return Response.error();

  }());
});
```

Rather than listening to all failed requests, another way is to catch errors on specific routes
only. As an example, if we want to report errors happening on routes to `/products/*` only, we can
add a check in `setCatchHandler` which filters the URI with a regular expression.  
A cleaner solution is to implement registerRoute with a custom handler. This encapsulates the
business logic into a separate route, with better maintainability in more complex service workers:

```js
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const networkOnly = new NetworkOnly();
registerRoute(
  new RegExp('https:\/\/example\.com\/products\/.+'),
  async (params) => {
    try {
      // Attempt a network request.
      return await networkOnly.handle(params);
    } catch (error) {
      // If it fails, report the error.
      const event = params.event;
      if (!event.clientId) return;
      const client = await clients.get(event.clientId);
      if (!client) return;

      client.postMessage({
        action: "network_fail",
        url: event.request.url,
        destination: "products"
      });

      return Response.error();
    }
  }
);
```

As a final step, the page needs to listen to the `message` event, and send out the analytics ping.
Again, make sure to buffer analytics requests that happen offline within the service worker. As
described before, initialize the `workbox-google-analytics` plugin for built-in Google Analytics
support.

The following example uses Google Analytics, but can be applied in the same way for other analytics
vendors.

```js
if ("serviceWorker" in navigator) {
  // ... SW registration here

  // track offline error events
  navigator.serviceWorker.addEventListener("message", event => {
    if (gtag && event.data && event.data.action === "network_fail") {
      gtag("event", "network_fail", {
        event_category: event.data.destination,
        // event_label: event.data.url,
        // value: event.data.value
      });
    }
  });
}
```

This will track failed resource loads in Google Analytics, where they can be analyzed with
[reporting](https://support.google.com/analytics/answer/1033068?hl=en). The derived insight can be
used to improve service worker caching and error handling in general, to make the page more robust
and reliable under unstable network conditions.

## Next steps

This article showed different ways of tracking offline usage with their advantages and shortcomings.
While this can help to quantify how many of your users go offline and run into problems due to it,
it's still just a start. As long as your website does not offer a well-built offline mode, you
obviously won't see much offline usage in analytics.

We recommend to get the full tracking in place, and then extend your offline capabilities in
iterations with an eye on tracking numbers. Start with a simple offline error page first–with
[Workbox it's trivial to
do](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offline_page_only)–and
should be considered a UX best practice similar to custom 404 pages anyway. Then work your way
[towards more advanced offline fallbacks](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks)
and finally towards real offline content. Make sure you advertise and explain this to your users
well, and you will see increasing usage. After all, everyone goes offline every once in a while.

Check out [How to report metrics and build a performance culture](/how-to-report-metrics/)
and [Fixing website speed cross-functionally](/fixing-website-speed-cross-functionally/) for tips
on persuading cross-functional stakeholders to invest more in your website. Although those posts
are focused on performance, they should help you get general ideas about how to engage
stakeholders.

Hero photo by [JC Gellidon][hero] on [Unsplash][unsplash].

[hero]: https://unsplash.com/@jcgellidon?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText
[unsplash]: https://unsplash.com/s/photos/subway-people?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText
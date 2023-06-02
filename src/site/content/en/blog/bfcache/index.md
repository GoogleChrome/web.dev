---
layout: post
title: Back/forward cache
subhead: Optimize your pages for instant loads when using the browser's back and forward buttons.
description: |
  Learn how to optimize your pages for instant loads when using the browser's back and forward buttons.
authors:
  - philipwalton
  - tunetheweb
date: 2020-11-10
updated: 2023-05-25
hero: image/admin/Qoeb8x3a11BdGgRzYJbY.png
alt: Back and forward buttons
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

Back/forward cache (or bfcache) is a browser optimization that enables instant
back and forward navigation. It significantly improves the browsing experience
for users—especially those with slower networks or devices.

As web developers, it's critical to understand how to [optimize your pages for
bfcache](#optimize-your-pages-for-bfcache) across all browsers, so your users
can reap the benefits.

## Browser compatibility

bfcache has been supported in both
[Firefox](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/1.5/Using_Firefox_1.5_caching)
and [Safari](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/) for
many years, across desktop and mobile.

Starting in version 86, Chrome enabled bfcache for
[cross-site](/same-site-same-origin/) navigations on Android for a small
percentage of users. In subsequent releases, additional support slowly rolled
out. Since version 96, bfcache is enabled for all Chrome users across desktop
and mobile.

## bfcache basics

bfcache is an in-memory cache that stores a complete snapshot of a page
(including the JavaScript heap) as the user is navigating away. With the entire
page in memory, the browser can quickly and easily restore it if the user
decides to return.

How many times have you visited a website and clicked a link to go to another
page, only to realize it's not what you wanted and click the back button? In
that moment, bfcache can make a big difference in how fast the previous page
loads:

<div class="table-wrapper">
  <table data-alignment="top">
    <tr>
      <td width="30%"><strong><em>Without</em> bfcache enabled</strong></td>
      <td>
        A new request is initiated to load the previous page, and, depending
        on how well that page has been <a
        href="/reliable/#the-options-in-your-caching-toolbox">
        optimized</a> for repeat visits, the browser might have to re-download,
        re-parse, and re-execute some (or all) of resources it just downloaded.
      </td>
    </tr>
    <tr>
      <td><strong><em>With</em> bfcache enabled</strong></td>
      <td>
        Loading the previous page is <em>essentially instant</em>, because the
        entire page can be restored from memory, without having to go to the
        network at all
      </td>
    </tr>
  </table>
</div>

Check out this video of bfcache in action to understand the speed up it can
bring to navigations:

{% YouTube 'cuPsdRckkF0' %}

In the video above, the example with bfcache is quite a bit faster than the
example without it.

bfcache not only speeds up navigation, it also reduces data usage, since
resources do not have to be downloaded again.

Chrome usage data shows that 1 in 10 navigations on desktop and 1 in 5 on mobile
are either back or forward. With bfcache enabled, browsers could eliminate the
data transfer and time spent loading for billions of web pages every single day!

### How the "cache" works

The "cache" used by bfcache is different from the [HTTP cache](/http-cache/)
(which is also useful in speeding up repeat navigations). The bfcache is a
snapshot of the entire page in memory (including the JavaScript heap), whereas
the HTTP cache contains only the responses for previously made requests. Since
it's quite rare that all requests required to load a page can be fulfilled from
the HTTP cache, repeat visits using bfcache restores are always faster than even
the most well-optimized non-bfcache navigations.

Creating a snapshot of a page in memory, however, involves some complexity in
terms of how best to preserve in-progress code. For example, how do you handle
`setTimeout()` calls where the timeout is reached while the page is in the
bfcache?

The answer is that browsers pause running any pending timers or unresolved
promises—essentially all pending tasks in the [JavaScript task
queues](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)—and
resume processing tasks when (or if) the page is restored from the bfcache.

In some cases this is fairly low-risk (for example, timeouts or promises), but
in other cases it might lead to very confusing or unexpected behavior. For
example, if the browser pauses a task that's required as part of an [IndexedDB
transaction](https://developer.mozilla.org/docs/Web/API/IDBTransaction),
it can affect other open tabs in the same origin (since the same IndexedDB
databases can be accessed by multiple tabs simultaneously). As a result,
browsers will generally not attempt to cache pages in the middle of an IndexedDB
transaction or using APIs that might affect other pages.

For more details on how various API usage affects a page's bfcache eligibility,
see [Optimize your pages for bfcache](#optimize-your-pages-for-bfcache) below.

### APIs to observe bfcache

While bfcache is an optimization that browsers do automatically, it's still
important for developers to know when it's happening so they can [optimize their
pages for it](#optimize-your-pages-for-bfcache) and [adjust any metrics or
performance
measurement](#implications-for-analytics-and-performance-measurement)
accordingly.

The primary events used to observe bfcache are the [page transition
events](https://developer.mozilla.org/docs/Web/API/PageTransitionEvent)—`pageshow`
and `pagehide`—which have been around as long as bfcache has and are supported
in pretty much [all browsers in use
today](https://caniuse.com/page-transition-events).

The newer [Page
Lifecycle](https://developer.chrome.com/blog/page-lifecycle-api/)
events—`freeze` and `resume`—are also dispatched when pages go in or out of the
bfcache, as well as in some other situations. For example when a background tab
gets frozen to minimize CPU usage. Note, the Page Lifecycle events are currently
only supported in Chromium-based browsers.

#### Observe when a page is restored from bfcache

The `pageshow` event fires right after the `load` event when the page is
initially loading and any time the page is restored from bfcache. The `pageshow`
event has a
[`persisted`](https://developer.mozilla.org/docs/Web/API/PageTransitionEvent/persisted)
property which will be `true` if the page was restored from bfcache
(and `false` if not). You can use the `persisted` property
to distinguish regular page loads from bfcache restores. For example:

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('This page was restored from the bfcache.');
  } else {
    console.log('This page was loaded normally.');
  }
});
```

In browsers that support the Page Lifecycle API, the `resume` event will also
fire when pages are restored from bfcache (immediately before the `pageshow`
event), though it will also fire when a user revisits a frozen background tab.
If you want to restore a page's state after it's frozen (which includes pages in
the bfcache), you can use the `resume` event, but if you want to measure your
site's bfcache hit rate, you'd need to use the `pageshow` event. In some cases,
you might need to use both.

{% Aside %}
  See [Implications for performance and
  analytics](#how-bfcache-affects-analytics-and-performance-measurement) for
  more details on bfcache measurement best practices.
{% endAside %}

#### Observe when a page is entering bfcache

The `pagehide` event is the counterpart to the `pageshow` event. The `pageshow`
event fires when a page is either loaded normally or restored from the bfcache.
The `pagehide` event fires when the page is either unloaded normally or when the
browser attempts to put it into the bfcache.

The `pagehide` event also has a `persisted` property, and if it's `false` then
you can be confident a page is not about to enter the bfcache. However, if the
`persisted` property is `true`, it doesn't guarantee that a page will be cached.
It means that the browser _intends_ to cache the page, but there may be factors
that make it impossible to cache.

```js
window.addEventListener('pagehide', (event) => {
  if (event.persisted) {
    console.log('This page *might* be entering the bfcache.');
  } else {
    console.log('This page will unload normally and be discarded.');
  }
});
```

Similarly, the `freeze` event will fire immediately after the `pagehide` event
(if the event's `persisted` property is `true`), but again that only means the
browser _intends_ to cache the page. It may still have to discard it for a
number of reasons explained below.

## Optimize your pages for bfcache

Not all pages get stored in bfcache, and even when a page does get stored there,
it won't stay there indefinitely. It's critical that developers understand what
makes pages eligible (and ineligible) for bfcache to maximize their cache-hit
rates.

The following sections outline the best practices to make it as likely as
possible that the browser can cache your pages.

### Never use the `unload` event

The most important way to optimize for bfcache in all browsers is to never use
the `unload` event. Ever!

The `unload` event is problematic for browsers because it predates bfcache and
many pages on the internet operate under the (reasonable) assumption that a page
will not continue to exist after the `unload` event has fired. This presents a
challenge because many of those pages were _also_ built with the assumption that
the `unload` event would fire any time a user is navigating away, which is no
longer true (and [hasn't been true for a long
time](https://developer.chrome.com/blog/page-lifecycle-api/#the-unload-event)).

So browsers are faced with a dilemma, they have to choose between something that
can improve the user experience—but might also risk breaking the page.

On desktop, Chrome and Firefox have chosen to make pages ineligible for bfcache if they add an `unload`
listener, which is less risky but also disqualifies _a lot_ of pages. Safari
will attempt to cache some pages with an `unload` event listener, but to reduce
potential breakage it will not run the `unload` event when a user is navigating
away, which makes the event very unreliable.

On mobile, Chrome and Safari will attempt to cache pages with an `unload` event listener since the risk of breakage is lower due to the fact that the `unload` event has always been extremely unreliable on mobile. Firefox treats pages that use `unload` as ineligible for the bfcache, except on iOS, which requires all browsers to use the WebKit rendering engine, and so it behaves like Safari.

Instead of using the `unload` event, use the `pagehide` event. The `pagehide`
event fires in all cases where the `unload` event currently fires, and it
_also_ fires when a page is put in the bfcache.

In fact, [Lighthouse](https://developer.chrome.com/docs/lighthouse/) has a [`no-unload-listeners` audit](https://github.com/GoogleChrome/lighthouse/pull/11085), which will warn developers if any JavaScript on their pages (including that from third-party libraries) adds an `unload` event listener.

{% Aside 'warning' %}
  Never add an `unload` event listener! Use the `pagehide` event instead.
  Adding an `unload` event listener will make your site slower in Firefox, and
  the code won't even run most of the time in Chrome and Safari.
{% endAside %}

#### Only add `beforeunload` listeners conditionally

The `beforeunload` event will not make your pages ineligible for bfcache in
Chrome or Safari, but it will make them ineligible in Firefox, so avoid using it
unless absolutely necessary.

Unlike the `unload` event, however, there are legitimate uses for
`beforeunload`. For example, when you want to warn the user that they have
unsaved changes they'll lose if they leave the page. In this case, it's
recommended that you only add `beforeunload` listeners when a user has unsaved
changes and then remove them immediately after the unsaved changes are saved.

{% Compare 'worse' %}
```js
window.addEventListener('beforeunload', (event) => {
  if (pageHasUnsavedChanges()) {
    event.preventDefault();
    return event.returnValue = 'Are you sure you want to exit?';
  }
});
```
{% CompareCaption %}
  The code above adds a `beforeunload` listener unconditionally.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```js
function beforeUnloadListener(event) {
  event.preventDefault();
  return event.returnValue = 'Are you sure you want to exit?';
};

// A function that invokes a callback when the page has unsaved changes.
onPageHasUnsavedChanges(() => {
  window.addEventListener('beforeunload', beforeUnloadListener);
});

// A function that invokes a callback when the page's unsaved changes are resolved.
onAllChangesSaved(() => {
  window.removeEventListener('beforeunload', beforeUnloadListener);
});
```
{% CompareCaption %}
  The code above only adds the `beforeunload` listener when it's needed (and
  removes it when it's not).
{% endCompareCaption %}
{% endCompare %}

### Minimize use of `Cache-Control: no-store`

`Cache-Control: no-store` is an HTTP header web servers can set on responses that instructs the browser not to store the response in any HTTP cache. This should be used for resources containing sensitive user information, for example pages behind a login.

Though bfcache is not an HTTP cache, historically, when `Cache-Control: no-store` is set on the page resource itself (as opposed to any subresource), browsers have chosen not to store the page in bfcache. There is [work currently underway to change this behavior for Chrome](https://github.com/fergald/explainer-bfcache-ccns/blob/main/README.md) in a privacy-preserving manner, but at present any pages using `Cache-Control: no-store` will not be eligible for bfcache.

Since `Cache-Control: no-store` restricts a page's eligibility for bfcache, it should only be set on pages that contain sensitive information where caching of any sort is never appropriate.

For pages that wish to always serve up-to-date content—and that content does not contain sensitive information—use `Cache-Control: no-cache` or `Cache-Control: max-age=0`. These directives instruct the browser to revalidate the content before serving it, and they do not affect a page's bfcache eligibility.

Note that when a page is restored from bfcache, it is restored from memory, not from the HTTP cache. As a result, directives like `Cache-Control: no-cache` or `Cache-Control: max-age=0` are not taken into account, and no revalidation occurs before the content is displayed to the user.

This is still likely a better user experience, however, as bfcache restores are instant and—since pages do not stay in the bfcache for very long—it's unlikely that the content is out of date. However, if your content does change minute-by-minute, you can fetch any updates using the `pageshow` event, as outlined in the next section.

### Update stale or sensitive data after bfcache restore

If your site keeps user state—especially any sensitive user information—that
data needs to be updated or cleared after a page is restored from bfcache.

For example, if a user navigates to a checkout page and then updates their
shopping cart, a back navigation could potentially expose out-of-date
information if a stale page is restored from bfcache.

Another, more critical example is if a user signs out of a site on a public
computer and the next user clicks the back button. This could potentially expose
private data that the user assumed was cleared when they logged out.

To avoid situations like this, it's good to always update the page after a
`pageshow` event if `event.persisted` is `true`.

The following code checks for the presence of a site-specific cookie in the
`pageshow` event and reloads if the cookie is not found:

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted && !document.cookie.match(/my-cookie/)) {
    // Force a reload if the user has logged out.
    location.reload();
  }
});
```

### Avoid `window.opener` references

In some browsers (including Chromium-based browsers) if a page was opened using
[`window.open()`](https://developer.mozilla.org/docs/Web/API/Window/open)
or (in [Chromium-based browsers prior to version 88](https://crbug.com/898942)) from a link with
[`target=_blank`](https://developer.mozilla.org/docs/Web/HTML/Element/a#target)—without
specifying
[`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener)—then
the opening page will have a reference to the window object of the opened page.

In addition to [being a security
risk](https://mathiasbynens.github.io/rel-noopener/), a page with a non-null
[`window.opener`](https://developer.mozilla.org/docs/Web/API/Window/opener)
reference cannot safely be put into the bfcache because that could break any
pages attempting to access it.

As a result, it's best to avoid creating `window.opener` references. You can do this by using
`rel="noopener"` whenever possible. If your site requires opening a window and
controlling it through
[`window.postMessage()`](https://developer.mozilla.org/docs/Web/API/Window/postMessage)
or directly referencing the window object, neither the opened window nor the
opener will be eligible for the bfcache.

### Always close open connections before the user navigates away

As mentioned above, when a page is put into the bfcache all scheduled JavaScript
tasks are paused and then resumed when the page is taken out of the cache.

If these scheduled JavaScript tasks are only accessing DOM APIs—or other APIs
isolated to just the current page—then pausing these tasks while the page is not
visible to the user is not going to cause any problems.

However, if these tasks are connected to APIs that are also accessible from
other pages in the same origin (for example: IndexedDB, Web Locks, WebSockets,
etc.) this can be problematic because pausing these tasks may prevent code in
other tabs from running.

As a result, some browsers will not attempt to put a page in bfcache in the
following scenarios:

*   Pages with an open [IndexedDB
    connection](https://developer.mozilla.org/docs/Web/API/IDBOpenDBRequest)
*   Pages with in-progress
    [fetch()](https://developer.mozilla.org/docs/Web/API/Fetch_API) or
    [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)
*   Pages with an open
    [WebSocket](https://developer.mozilla.org/docs/Web/API/WebSocket) or
    [WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API)
    connection

If your page is using any of these APIs, it's best to always close connections
and remove or disconnect observers during the `pagehide` or `freeze` event. That
will allow the browser to safely cache the page without the risk of it affecting
other open tabs.

Then, if the page is restored from the bfcache, you can re-open or re-connect to
those APIs (in the `pageshow` or `resume` event).

The following example shows how to ensure your pages are eligible for bfcache
when using IndexedDB by closing an open connection in the `pagehide` event
listener:

```js
let dbPromise;
function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('my-db', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('keyval');
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  return dbPromise;
}

// Close the connection to the database when the user is leaving.
window.addEventListener('pagehide', () => {
  if (dbPromise) {
    dbPromise.then(db => db.close());
    dbPromise = null;
  }
});

// Open the connection when the page is loaded or restored from bfcache.
window.addEventListener('pageshow', () => openDB());
```

### Test to ensure your pages are cacheable

Chrome DevTools can help you test your pages to ensure they're optimized for
bfcache, and identify any issues that may be preventing them from being
eligible.

To test a particular page, navigate to it in Chrome and then in DevTools go to
**Application** > **Back-forward Cache**. Next click the **Run Test** button and
DevTools will attempt to navigate away and back to determine whether the page
could be restored from bfcache.

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/QafTzULUNflaSh77zBgT.png",
alt="Back-forward cache panel in DevTools", width="800", height="313" %}

{% Aside %}
  The Back/forward Cache feature in DevTools is currently in active development.
  We strongly encourage developers to test their pages in Chrome Canary to
  ensure they're running the latest version of DevTools and getting the most
  up-to-date bfcache recommendations.
{% endAside %}

If successful, the panel will report "Restored from back-forward cache":

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vPwN0z95ZBTiwZIpdZT4.png",
alt="DevTools reporting a page was successfully restored from bfcache",
width="800", height="313" %}

If unsuccessful, the panel will indicate the page was not restored and list the
reason why. If the reason is something you as a developer can address, that
will also be indicated:

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/ji3ew4DoP6joKdJvtGwa.png",
alt="DevTools reporting failure to restore a page from bfcache", width="800",
height="313" %}

In the screenshot above, the use of an `unload` event listener is
[preventing](/bfcache/#never-use-the-unload-event) the page from being eligible
for bfcache. You can fix that by switching from `unload` to using `pagehide` instead:

{% Compare 'worse' %}
```js
window.addEventListener('unload', ...);
```
{% endCompare %}

{% Compare 'better' %}
```js
window.addEventListener('pagehide', ...);
```
{% endCompare %}

Lighthouse 10.0 also [added a bfcache audit](https://developer.chrome.com/blog/lighthouse-10-0/#bfcache), which performs a similar test to the one DevTools does, and also provides reasons why the page is ineligible if the audit fails. Take a look at the [bfcache audit's docs](https://developer.chrome.com/docs/lighthouse/performance/bf-cache/) for more information.

## How bfcache affects analytics and performance measurement

If you track visits to your site with an analytics tool, you will likely notice
a decrease in the total number of pageviews reported as Chrome continues to
enable bfcache for more users.

In fact, you're likely _already_ underreporting pageviews from other browsers
that implement bfcache since most of the popular analytics libraries do not
track bfcache restores as new pageviews.

If you don't want your pageview counts to go down due to Chrome enabling
bfcache, you can report bfcache restores as pageviews (recommended) by listening
to the `pageshow` event and checking the `persisted` property.

The following example shows how to do this with Google Analytics; the logic
should be similar for other analytics tools:

```js
// Send a pageview when the page is first loaded.
gtag('event', 'page_view');

window.addEventListener('pageshow', (event) => {
  // Send another pageview if the page is restored from bfcache.
  if (event.persisted) {
    gtag('event', 'page_view');
  }
});
```

### Measuring your bfcache hit ratio

You may also wish to track whether the bfcache was used, to help identify pages
that are not utilizing the bfcache. For example, with an event:

```js
window.addEventListener('pageshow', (event) => {
  // You can measure bfcache hit rate by tracking all bfcache restores and
  // other back/forward navigations via a separate event.
  const navigationType = performance.getEntriesByType('navigation')[0].type;
  if (event.persisted || navigationType == 'back_forward' ) {
    gtag('event', 'back_forward_navigation', {
      'isBFCache': event.persisted,
    });
  }
});
```

It is important to realize that there are a number of scenarios, outside
of the site owners control, when a Back/Forward navigation will not use
the bfcache, including:
- when the user quits the browser and starts it again
- when the user duplicates a tab
- when the user closes a tab and uncloses it

Even without those exclusions the bfcache will be discarded after a period to conserve memory.

So, website owners should not be expecting a 100% bfcache hit ratio for all
`back_forward` navigations. However, measuring their ratio can be useful to
identify pages where the page itself is preventing bfcache usage for a high
proportion of back and forward navigations.

The Chrome team is working on a
[`NotRestoredReasons` API](https://github.com/rubberyuzu/bfcache-not-retored-reason/blob/main/NotRestoredReason.md)
to help expose the reasons why the bfcache was not used to help developers
understand the reasoning the cache was not used and if this is something they
can work on to improve for their sites.

### Performance measurement

bfcache can also negatively affect performance metrics collected [in the
field](/user-centric-performance-metrics/#in-the-field), specifically metrics
that measure page load times.

Since bfcache navigations restore an existing page rather than initiate a new
page load, the total number of page loads collected will decrease when bfcache
is enabled. What's critical, though, is that the page loads being replaced by
bfcache restores would likely have been some of the fastest page loads in your
dataset. This is because back and forward navigations, by definition, are repeat
visits, and repeat page loads are generally faster than page loads from first
time visitors (due to [HTTP caching](/http-cache/), as mentioned earlier).

The result is fewer fast page loads in your dataset, which will likely skew the
distribution slower—despite the fact that the performance experienced by the
user has probably improved!

There are a few ways to deal with this issue. One is to annotate all page load
metrics with their respective [navigation
type](https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types):
`navigate`, `reload`, `back_forward`, or `prerender`. This will allow you to
continue to monitor your performance within these navigation types—even if the
overall distribution skews negative. This approach is recommended for
non-user-centric page load metrics like [Time to First Byte
(TTFB)](/ttfb/).

For user-centric metrics like the [Core Web Vitals](/vitals/), a better option
is to report a value that more accurately represents what the user experiences.

{% Aside 'caution' %}
  The `back_forward` navigation type in the [Navigation Timing
  API](https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types)
  is not to be confused with bfcache restores. The Navigation Timing API only
  annotates page loads, whereas bfcache restores are re-using a page loaded from
  a previous navigation.
{% endAside %}

### Impact on Core Web Vitals

[Core Web Vitals](/vitals/) measure the user's experience of a web page across a
variety of dimensions (loading speed, interactivity, visual stability), and
since users experience bfcache restores as faster navigations than traditional
page loads, it's important that the Core Web Vitals metrics reflect this. After
all, a user doesn't care whether or not bfcache was enabled, they just care that
the navigation was fast!

Tools like the [Chrome User Experience
Report](https://developer.chrome.com/docs/crux/),
that collect and report on the Core Web Vitals metrics treat bfcache restores as
separate page visits in their dataset.

And while there aren't (yet) dedicated web performance APIs for measuring these
metrics after bfcache restores, their values can be approximated using existing
web APIs.

*   For [Largest Contentful Paint (LCP)](/lcp/), you can use the delta between
    the `pageshow` event's timestamp and the timestamp of the next painted frame
    (since all elements in the frame will be painted at the same time). Note
    that in the case of a bfcache restore, LCP and FCP will be the same.
*   For [First Input Delay (FID)](/fid/), you can re-add the event listeners
    (the same ones used by the [FID
    polyfill](https://github.com/GoogleChromeLabs/first-input-delay)) in the
    `pageshow` event, and report FID as the delay of the first input after the
    bfcache restore.
*   For [Cumulative Layout Shift (CLS)](/cls/), you can continue to keep using
    your existing Performance Observer; all you have to do is reset the current
    CLS value to 0.

For more details on how bfcache affects each metric, refer to the individual
Core Web Vitals [metric guides pages](/vitals/#core-web-vitals). And for a
specific example of how to implement bfcache versions of these metrics in code,
refer to the [PR adding them to the web-vitals JS
library](https://github.com/GoogleChrome/web-vitals/pull/87).

{% Aside %}
  As of `v1`, the [web-vitals](https://github.com/GoogleChrome/web-vitals)
  JavaScript library [supports bfcache
  restores](https://github.com/GoogleChrome/web-vitals/pull/87) in the metrics
  it reports. Developers using `v1` or greater should not need to update their
  code.
{% endAside %}

## Additional Resources

*   [Firefox
    Caching](https://developer.mozilla.org/Firefox/Releases/1.5/Using_Firefox_1.5_caching)
    _(bfcache in Firefox)_
*   [Page Cache](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/)
    _(bfcache in Safari)_
*   [Back/forward cache: web exposed
    behavior](https://docs.google.com/document/d/1JtDCN9A_1UBlDuwkjn1HWxdhQ1H2un9K4kyPLgBqJUc/edit?usp=sharing)
    _(bfcache differences across browsers)_
*   [bfcache
    tester](https://back-forward-cache-tester.glitch.me/?persistent_logs=1)
    _(test how different APIs and events affect bfcache in browsers)_
*   [Performance Game Changer: Browser Back/Forward Cache](https://www.smashingmagazine.com/2022/05/performance-game-changer-back-forward-cache/)
    _(a case study from Smashing Magazine showing dramatic Core Web Vitals improvements by enabling bfcache)_

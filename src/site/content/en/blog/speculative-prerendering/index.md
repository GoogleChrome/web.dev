---
layout: post
title: Bringing instant page-loads to the browser through speculative prerendering
subhead: Learn more about speculative prerendering in the browser and how to participate in Chrome origin trial.
date: 2021-09-24
updated: 2022-04-11
authors:
  - leenasohoni
  - addyosmani
description: |
  This article focuses on speculative prefetching and prerendering. Learn more about
  how they're used, the drawbacks of the current implementations,  popular external
  libraries that implement sophisticated speculation, and the origin trial that brings same-origin
  speculative prerendering to the browser.
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/NDg4DvtC6Hkbly4MyGkZ.jpeg
alt: Motorcycle on a highway
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - origin-trials
---

Resource hints, such as [`preconnect`](/uses-rel-preconnect/),
[`preload`](/uses-rel-preload/),
[`prefetch`](/link-prefetch/), and
[`prerender`](https://developer.mozilla.org/docs/Glossary/prerender), help
the browser figure out which resources will the user need in the near future.

`preconnect` and `preload` are declarative hints—the browser _must_ act on
them, so use them when you are sure that a resource will be required during the
next load.

`prefetch` and `prerender` are speculative hints—use these to recommend that
the browser should fetch a certain resource because there's a high chance it
might be required.

This article focuses on speculative prefetching and prerendering. Learn more about
how they're used, the drawbacks of the current implementations, and popular external
libraries that implement sophisticated speculation. Enhancements that bring same-origin
speculative prerendering to the browser are under development and you can learn more about
their design and participate in
[Chrome origin trial](https://developer.chrome.com/origintrials/#/view_trial/1325184190353768449).

## `prefetch` and `prerender`: Current implementation

Users looking at a list of links relevant to their interest (for example, a list
of products or articles matching a search keyword or the user's preferences)
will likely click on the links at the top. If they navigate back to the list
page, they might click the following link in the list. `prefetch` and `prerender`
rely on this knowledge of the user's behavior. Developers speculate which page
(B) is likely to be requested after a specific page (A).

### `prefetch` hint

When developers include a `prefetch` hint on page A to tell the browser that it
can fetch either page B or specific resources on page B in advance, the browser
can fetch those resources while it is idle without affecting the processing of
page A.

The syntax for using `prefetch` in the origin page (page A of our example)  is as
follows:

```html
<link rel="prefetch" href="/results/" as="document">
```

The `as` attribute here is optional but helps the browser set the correct
headers required to determine if the resource is already in the cache.

The available [support for `prefetch`](https://caniuse.com/?search=prefetch) and
implementation options have matured slightly over the last couple of years.

{% BrowserCompat 'html.elements.link.rel.prefetch' %}

### `prerender` hint

Including a `prerender` hint tells the browser to render page B in advance.
Prerendering a page enables an instant navigation experience when the user
actually clicks on the link for page B.

The syntax for using `prerender` in the origin page is as follows:

```html
<link rel="prerender" href="/next-page/">
```

`prerender` behavior, however, is still not clearly defined or [universally
implemented](https://caniuse.com/link-rel-prerender).

{% BrowserCompat 'html.elements.link.rel.prerender' %}

### Prefetch implementation

There are a few important points to note about prefetch behavior (especially in
Chrome):

+   You can prefetch either the next page entirely or same-origin
    subresources such as stylesheets or scripts that would be required by the
    next page.
+   The prefetched resources are stored in the HTTP Cache if they are
    cacheable.
+   Chrome keeps the cached items for 5 minutes.
+   When the resources are requested or required they are retrieved from the
    cache. However, if they have not finished loading the partially loaded
    resource is picked up by Chrome to continue loading it.
+   Prefetching of resources consumes extra bytes and is not recommended if
    a user has data-saver mode enabled. The connection type and other details
    about users' data preferences can be determined via the
    [Network Information API](https://developer.mozilla.org/docs/Web/API/Network_Information_API).

### Prerender implementation using no-state prefetch

The
[original implementation](https://www.chromium.org/developers/design-documents/prerender)
for the `prerender` hint in Chromium was using a lot of memory so it was
deprecated in favour of a
[no-state prefetch](https://developers.google.com/web/updates/2018/07/nostate-prefetch)
which fetches resources in advance but it does not execute JavaScript or render
any part of the page in advance. Originally prerender consumed around 100 MiB of
memory and could potentially disrupt UI when certain components like media were
prerendered.

The current implementation using a no-state prefetch consumes significantly
lower memory of around 45 MiB, while still reducing page load times. The fetch
is triggered by a link element with a `prerender` resource hint. The no-state
prefetch is carried out in a new dedicated
[renderer](https://www.chromium.org/developers/design-documents/multi-process-architecture)
that is isolated from the visible tabs and cannot disrupt UI. The no-state
prefetch process caches the resources required but does not render them. It also
does not modify the state of the browser except when updating the DNS cache and
the cookie store. The new renderer is killed after all subresources are loaded.
A new renderer is created to render the page when the user requests it.

With a no-state prefetch implementation for prerender, the goal of instant page
loads still eludes us. Before exploring how we can achieve instant page loads,
let's take a look at some out-of-the-box options that implement speculation
logic for prefetch which may also be relevant to the prerender implementation.

## Smart speculation with third-party libraries

Developers have insight into how people use their site and use that knowledge to
decide what should be prefetched or prerendered. These usage trends tend to
evolve over time, so developers need to update their resource hints based on the
latest analytics data available for the site.

There are also libraries such as quicklink and guess.js, that use heuristics to
determine which resources should be prefetched at runtime. With these,
developers don't need to guess what should be prefetched. The libraries take the
decision based on available data.

### Quicklink

[Quicklink](https://github.com/GoogleChromeLabs/quicklink) uses Intersection
Observer API to determine which links are in the viewport and prefetches them
when the browser is idle if the user is not on a slow connection. It uses the
Network Information API to determine the type of connection and if the
data-saver mode is enabled. Quicklink is a lightweight library that you can use
with both [multiple-page apps](https://mini-ecomm-quicklink.glitch.me/) and
[single-page apps](https://create-react-app-quicklink.glitch.me/) to [speed up
navigations](/quicklink/).

### Guess.js

[Guess.js](https://github.com/guess-js/guess) implements [predictive
prefetching](/predictive-prefetching/) based on a report
generated by Google Analytics or a similar analytics provider. These
analytics-based predictions are used to prefetch resources that the user is
likely to need.

Let us now see how similar logic can be built inside the browser and what
additional tooling would be required to support that.

## Implementing a revamped prerendering solution

The current prerendering implementations do not address several constraints.
Following are some of the limitations that were discussed and proposed solutions
that could improve prerendering.

+   **Triggers**: Currently `<link rel="prerender"> `is the only trigger
    available to enable prerendering in the browser. For every link on the page
    which is eligible for prerendering, an additional resource hint needs to be
    included in the document during development.

    Since `prerender` requirements may change, the proposed solution should
    allow users to specify blanket triggers for links that match certain
    criteria. This has been made possible through the [speculation rules API
    ](https://github.com/WICG/nav-speculation/blob/main/triggers.md#speculation-rules)discussed in detail later.

+   **Cross-origin prerender**: When the target link of a prerender is on
    the same origin, there are not many additional checks required. However,
    when it is pointing to a
    [different origin](https://github.com/jeremyroman/alternate-loading-modes/blob/main/browsing-context.md),
    there may be privacy concerns that the browser should address. For example,
    user credentials should be omitted when prerendering a cross-origin page
    because the response should not be personalized before an actual navigation
    occurs. However, user-related information may be provided when the user
    navigates to the page. To support this two stages approach, there should be
    a way for the target pages to
    [opt-in](https://github.com/jeremyroman/alternate-loading-modes/blob/main/opt-in.md)
    to being prerendered by a cross-origin page.

+   **Prerendering browsing context**: Currently, there are different
    types of
    [top-level browsing contexts](https://html.spec.whatwg.org/multipage/browsers.html#top-level-browsing-context)
    available. For example, a tab in a window or an iframe on a page uses a
    different browsing context. A similar top-level
    [prerendering browsing context](https://github.com/jeremyroman/alternate-loading-modes/blob/main/browsing-context.md)
    should be created for prerendered content.

    The prerendering browsing context should be similar to an invisible tab
    and should impose additional restrictions. All disruptive APIs like playing
    media or permission prompts that may disrupt UI should be disabled in this
    browsing context.

    The prerendering browsing context may also be activated. Activation
    should take place when the user navigates to a prerendered page. When
    activated, the prerendered page would switch to a new top-level browsing
    context.

+   **Portals**:
    [Portal](https://github.com/WICG/portals/blob/main/README.md) is a new
    proposed HTML element that enables seamless and instant navigations between
    pages. It would allow you to display the prerendered content as shown.

    ```js
        <portal id="myPortal" src="https://example.com/"></portal>
    ```

    This element would provide a preview of the prerendered page in a
    prerendering browsing context. This implies that the page preview will have
    restricted permissions. ​​Developers may activate the context through code
    on, say, a click event to expand the portal with animation to a full-page
    view in the embedding window.

## In-browser speculation rules for `prefetch` and `prerender`

One of the most important pieces of prerendering discussed in the previous
section is prerendering triggers available through the proposed
[Speculation Rules API](https://github.com/jeremyroman/alternate-loading-modes/blob/main/triggers.md#speculation-rules).
The Speculation Rules API can be used by developers to indicate blanket
permissions to the browser to speculate and prefetch or prerender pages that
match the specified criteria.

The rules help the browser identify an initial set of pages that the website
thinks would interest the user. The browser can then apply additional heuristics
based on device or network characteristics, page structure, viewport, the
location of the cursor, past activity on the page, and so on to decide which
pages to prerender or prefetch. Thus, speculation logic like implemented by
QuickLink or Guess.js may be implemented by the browser itself.

Speculation rules may be specified as a JSON object within an inline script tag
or an external resource. For example, speculation rules for `prerender` may be
defined as follows:

```html
<script type="speculationrules">
   {
     "prerender": [
       {
         "source": "list",
         "urls": ["/page/2"],
         "score": 0.5
       },
       {
         "source": "document",
         "if_href_matches": ["https://*.wikipedia.org/**"],
         "if_not_selector_matches": [".restricted-section *"],
         "score": 0.1
       }
     ]
   }
</script>
```

Here, two types of rules have been defined for the `prerender` resource hint.

+   _List rules_ apply to the `list` of given `urls`. The `score`
    value is used to indicate how likely the user is to navigate to one of
    these URLs next. The score value can be between 0.0 and 1.0 with a default
    of 0.5.

+   _Document rules_ apply to a `document` implying that all link
    elements within a page are open to speculation by the browser. The subset
    of link elements may be chosen by including the
    `if_href_matches` or `if_not_href_matches` and
    `if_selector_matches` or `if_not_selector_matches` filters.

Here `href_matches` is used to match the link URLs, while
`selector_matches` is used to match the [CSS
selectors](https://drafts.csswg.org/selectors/).

## Same-origin prerendering trial

An initial implementation for prerendering that covers some of the previously
discussed features is available as a
[Chrome origin trial](https://developer.chrome.com/origintrials/#/view_trial/1325184190353768449)
which will run from Chrome 94 to 100 (Android only). Following are the
[key features](https://github.com/mfalken/alternate-loading-modes/blob/chrome-origin-trial/same-origin-explainer.md)
included in this trial.

-  **Triggers**: Certain features from the Speculation Rules API may be
    used to specify triggers to prerender same-origin URLs. Only the "list
    rules" format is supported at present. Also, only one prerender is allowed
    per page for pages with the same origin.

```html
<script type="speculationrules">
   {
     "prerender": [
       {"source": "list", "urls": ["https://a.test/foo"]}
     ]
   }
</script>
```

{% Aside %}
    If multiple rules are specified, Chrome always prerenders based on the
    first rule. The score property is not used. Rules may be added, but the
    removal of rule sets is ignored.
{% endAside %}

-  **Restricted APIs**: APIs that can disrupt the UI such as
    Geolocation, Web Serial, Notifications, Web MIDI, and Idle Detection, are
    deferred until the prerendered page is activated.

-  **Session access**: The prerendered page clones the session object of
    the tab-level session when it is created. Upon activation, it discards this
    clone and again takes the latest session object from the tab.

-  **Resources**: The prerendered page can load all resources like a
    normal page, except cross-origin iframes which are loaded only upon
    activation. Cookies and Storage APIs also function as they would on a
    normal page.

-  **Trial usage**: The
    [origin trial token](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin)
    must be included on both the page where speculation rules are specified and
    the page which is the intended target of a prerender.

### Using the trial

Once you start using the trial, you can check if pages are being prerendered and
study the performance impact by using existing Chrome tools.

#### Was the page prerendered?

The `chrome://process-internals` page can tell if a prerendered page exists.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/TEh2wBHOaslCV6zbqWHy.png", alt="Process internals page.", width="800", height="107" %}

Both the page that initiates the prerender through speculation rules and the
prerendered page will be under the same `webcontents` block but can be
differentiated by the `prerender` keyword.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/9U3igmdttYqWWJ017EIy.png", alt="Webcontents block showing the initiator page and the prerendered page.", width="800", height="77" %}

#### Was the prerendered page activated?

After prerendering, the next step is activation. To check if it was indeed the
prerendered page that was activated upon navigation and no new page load
occurred, you can open _Dev Tools_ console after the navigation occurs. Execute
the following script and check the value of `activationStart` in the console.

```js
let activationStart = performance.getEntriesByType('navigation')[0].activationStart;
console.log(activationStart);
```

A non-zero value for `activationStart` would imply the prerendered page was
activated.

#### Was it instantaneous?

The `activationStart` value is a timestamp that can be compared to the values of
First Paint and [First Contentful
Paint](/fcp/) to determine the user-centric
performance metrics for the prerendered page.

```js
// When the activation navigation started.
let activationStart = performance.getEntriesByType('navigation')[0].activationStart;

// When First Paint occurred:
let firstPaint = performance.getEntriesByName('first-paint')[0].startTime;

// When First Contentful Paint occurred:
let firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0].startTime;

console.log('time to first paint: ' + (firstPaint - activationStart));
console.log('time to first-contentful-paint: ' + (firstContentfulPaint - activationStart));
```

Comparing the values of `firstPaint` and `firstContentfulPaint` to those before
using the trial, can help you measure the performance impact. It is also
recommended that you use
[real user monitoring (RUM)](/vitals-measurement-getting-started/)
methods to measure the performance of the origin trial.

### Demo

To check out a
[simple demo for the prerendering trial](https://prerender2-speculationrules.glitch.me/),
[enable the `enable-prerender2` flag in Chrome](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).
You will need to enable this for the demo to work.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/zPQ21UocTuIb0qpNabiD.png", alt="Chrome flags page.", width="800", height="205" %}

The demo provides options to prerender three different page types using `<link
rel=prerender>` and the Speculation Rules API. You can click on each of the
available options to check if a prerender takes place.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/FKQOzMjXpwRZAarD0RET.png", alt="Prerendering demo on Glitch.", width="800", height="489" %}

You can also compare the transitions for each case by clicking on the link for
the page.


<div class="switcher">
  <figure>
      <figcaption>
Timer.html with speculation rules
    </figcaption>
{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/d4aNnm3A4PNN2h9iPrVa.png", alt="", width="498", height="318" %}
  </figure>
  <figure>
      <figcaption>
Timer.html without speculation rules
    </figcaption>
{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Gjbu7HMTr9bDP9Qa1hDz.png", alt="", width="710", height="792" %}
  </figure>
</div>

## Prerendering from the address bar

Starting with Chrome 101, prerendering will gradually be applied to the most likely navigation when a user triggers autocomplete suggestions by interacting with Chrome’s address bar. We are starting with Chrome for Android but intend to bring this feature to the other platforms we support in follow-up milestones.

Before this launch, Chrome used [No-State Prefetch](#prerender-implementation-using-no-state-prefetch) to prefetch critical resources for the most likely navigations from the address bar. Prerendering takes things a bit further by rendering the page, which includes constructing the DOM tree and executing scripts.

While this is a browser feature, it can have observable effects from the point of view of the prerendered websites. For instance, APIs that may cause unexpected surprises are delayed until the user navigates to the prerendered web page (for example, text to speech from an invisible website). 

The potential impact on server resource usage is low, as prerendering from the [Omnibox](https://www.chromium.org/user-experience/omnibox/) only triggers on high-confidence suggestions. The server load increase should be negligible since the user **will** navigate to a vast majority of the prerendered web pages. Navigation requests triggered for prerendering or prefetch needs are distinguishable from regular navigation requests. Look for the [<code>Sec-Purpose: prefetch; prerender</code>](https://chromestatus.com/feature/6247959677108224) HTTP header or its predecessor <code>Purpose: prefetch</code> sent by Chrome 101 and earlier versions. You can then decide to further reduce server load in peak season or prevent prerendering or prefetching if these cause issues for your website. The server can cancel the prerendering by responding with an HTTP error or without a response body, as described below:

* Responding with 204 No Content implies that the server has acknowledged the prerendering request but is unwilling or unable to serve it for now. This is the recommended option.
* Responding with 503 Service Unavailable implies that prerendering is not an available service. Any other HTTP response code in the 400s or 500s would have the same outcome of canceling the prerendering.

To try this feature, check out the [demo and instructions](https://docs.google.com/document/d/1sUbxYSu1o5G76tA4UW_xxgcfcOn8j6NlJc_Go0Gwb_Q/edit).


## Feedback welcome

The aim of this origin trial is to provide the capability of near-instantaneous
page loads through the browser without relying on any external library. At the
same time, it tries not to disrupt the user experience and provide a good start
to a more sophisticated prerendering journey. Sign-up for
the prerendering
[origin trial](https://developer.chrome.com/origintrials/#/view_trial/1325184190353768449)
and see how well it works for your specific use cases. If you have any feedback on the trial, submit an issue
[to the GitHub repo](https://github.com/jeremyroman/alternate-loading-modes/issues).

There is also an ongoing trial for using
[Speculation Rules for Prefetch](https://developer.chrome.com/origintrials/#/view_trial/4576783121315266561).
Sign-up for this trial if you would like
to replace your existing `prefetch` hints with browser supported speculative
prefetch.
